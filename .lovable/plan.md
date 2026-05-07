# Sécuriser et vérifier le blocage des trials expirés

## Diagnostic actuel

**Le blocage existe déjà côté front**, mais il a un trou côté back. Détail :

### Côté client (OK)
- `useSubscription.computeAccess()` retourne `hasAccess = false` dès que `status === 'trialing'` ET `trial_ends_at <= now()`.
- `ProtectedRoute` redirige vers `/abonnement` si `!hasAccess`. Toutes les routes sensibles (`/dashboard`, `/produits`, `/calculateur`, `/profil`, `/favoris`, `/faq`) sont bien wrappées dans `<Protected>`.
- Conclusion front : un trial expiré est forcé sur `/abonnement` au prochain mount/refetch.

### Côté back (TROU)
- La table `products` a une RLS `Anyone can read products` (public, sans aucune vérif d'abonnement). Donc même un trial expiré qui resterait connecté peut **toujours requêter la base produits directement** via le client Supabase si le front est contourné (devtools, autre client, etc.).
- La fonction DB `has_active_access(user_uuid)` existe déjà mais n'est **utilisée nulle part** dans les RLS.
- `favorites` et `margin_calculations` sont OK (RLS sur `auth.uid() = user_id`, mais pas de check d'abonnement actif — un trial expiré peut encore lire/écrire ses favoris).

### Cas zéro données
Aujourd'hui en base : **23 lignes**, dont 22 `trialing` actives et 1 `active` payée. Aucun expiré encore. Le premier expirera le **10 mai 2026**. Tu pourras tester en live à ce moment-là, ou je peux te donner une requête de simulation.

## Ce que je propose

### 1. Fermer le trou RLS sur `products`
Remplacer la policy publique par une policy qui exige `has_active_access(auth.uid())`. La landing publique n'utilise pas cette table donc aucun impact.

### 2. Ajouter le check d'abonnement sur `favorites` et `margin_calculations`
Modifier les policies SELECT/INSERT/UPDATE/DELETE existantes pour ajouter `AND has_active_access(auth.uid())`. Un trial expiré ne pourra plus toucher à ses favoris ni à ses calculs.

### 3. Page Admin : visibilité sur les abonnements (toi seul)
Dans `/profil`, ajouter une section "Admin" visible uniquement pour `romain.rafecas@gmail.com` et `bouska1@outlook.fr` (logique déjà utilisée dans `handle_new_user`). Tableau listant pour chaque user :
- Email
- Statut (trialing / active / expired / canceled)
- Date de fin de trial ou de période
- Jours restants (négatif si expiré)
- Bouton pour copier l'email

Source : nouvelle edge function `admin-list-subscriptions` (verify_jwt = true) qui vérifie côté serveur que l'appelant est owner, puis liste via service role les `subscriptions` joints aux `auth.users`.

### 4. Ajouter une vue technique (`v_subscription_health`)
Vue SQL côté DB qui retourne en temps réel pour chaque sub : `is_active`, `is_expired`, `days_until_expiry`. Pratique pour debugging et pour la page admin.

### 5. Test de bout en bout
Après application :
- Forcer manuellement (via insert) `trial_ends_at = now() - 1 day` sur un user de test.
- Vérifier qu'il est redirigé vers `/abonnement` au prochain refresh.
- Vérifier qu'une requête directe `supabase.from('products').select()` renvoie 0 ligne pour ce user.

## Fichiers touchés

- **Migration SQL** : nouvelles RLS sur `products`, `favorites`, `margin_calculations` ; vue `v_subscription_health`.
- **Edge function** : `supabase/functions/admin-list-subscriptions/index.ts` (+ entrée dans `supabase/config.toml`).
- **Front** : `src/pages/Profil.tsx` (section Admin conditionnelle).

## Risques

- **Migration RLS sur `products`** : si une partie du landing public lit cette table, elle cassera. À vérifier — d'après l'audit la landing utilise `waitlist` uniquement, pas `products`. Je confirme avant d'appliquer.
- **Migration RLS sur `favorites`** : un user en trial expiré perd l'accès à ses favoris jusqu'au paiement. C'est ce que tu veux.

## Hors scope

Pas de modification du flow Stripe, pas de changement de la durée de trial, pas de relance email automatique aux trials qui expirent (déjà couvert par `trial-ending.tsx`).
