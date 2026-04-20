

## Réactiver paiement et gestion d'abonnement

La page `/abonnement` n'a plus aucun bouton actionnable depuis qu'on a retiré la carte promo. Il faut une UI minimale, sobre (pas un argumentaire de vente) qui permette à l'utilisateur de **payer** s'il n'a pas d'abonnement actif, et de **gérer/annuler** s'il en a un.

## Ce que je vais faire

### 1. Bloc d'action principal sur `/abonnement` (`src/pages/Abonnement.tsx`)

Logique conditionnelle selon l'état de l'abonnement :

**Cas A — Trial actif OU essai expiré OU pas d'abo (`!isActive`)** :
- Carte sobre "Krakken Pro — 9,90 €/mois", liste compacte des features, bouton **"Activer mon abonnement"**.
- Au clic : `setShowCheckout(true)` → le checkout embarqué s'affiche (déjà branché).

**Cas B — Abonnement actif (`isActive`)** :
- Carte "Abonnement actif" avec :
  - Date du prochain renouvellement (`currentPeriodEnd`)
  - Si `cancelAtPeriodEnd` : badge "Annulation programmée le X"
  - Bouton **"Gérer mon abonnement"** → ouvre le portail Stripe (changer carte, voir factures, annuler). Loader pendant l'appel.
- Petit bouton secondaire **"Annuler mon abonnement"** qui ouvre aussi le portail (raccourci, mêmes appel).

### 2. Retour de paiement
Quand Stripe redirige vers `/abonnement?session_id=...` après paiement réussi :
- Détecter `session_id` dans l'URL
- Toast succès "Bienvenue dans l'équipage Pro 🎉"
- Nettoyer l'URL + `refetch()` du hook `useSubscription` (le webhook a déjà mis à jour la base, mais on force le refresh)

### 3. Vérifier le produit Stripe
Créer (si absent) le produit `krakken_pro` avec le prix `krakken_pro_monthly` à 9,90 € EUR/mois via `payments--create_product`. Sans ça le checkout plante avec "Price not found".

### 4. Garde-fous
- Bouton "Activer" désactivé pendant le chargement (`loading`).
- Si checkout déjà ouvert, masquer le bloc d'action principal pour éviter le doublon.
- Le portail Stripe s'ouvre dans un nouvel onglet (`window.open`, déjà en place).

## Ce qui ne change pas
- Edge functions backend : déjà correctes, rien à toucher.
- Webhook : déjà branché, met à jour la table `subscriptions` automatiquement.
- Sidebar, route, garde d'accès (`hasAccess`) : inchangés.

## Fichiers touchés
- `src/pages/Abonnement.tsx` (refonte du contenu, ~80 lignes ajoutées)
- Création produit/prix Stripe via outil `payments--create_product` (idempotent — pas d'effet si déjà existant)

## Note importante sur le mode test
Tu es toujours en **sandbox Stripe**. Le checkout fonctionnera avec la carte test `4242 4242 4242 4242`. Pour encaisser de vrais paiements en prod, il faut compléter le go-live Stripe (claim account + activation + app live) côté onglet Payments — ça je ne peux pas le faire à ta place.

