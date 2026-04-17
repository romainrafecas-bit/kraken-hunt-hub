

## Demande

Mettre en place un vrai système d'abonnement payant : 14 jours d'essai gratuit à l'inscription, puis blocage de l'accès tant que l'utilisateur n'a pas souscrit à l'offre Pro à 9,90€/mois.

## Décision provider

Recommandation : **Stripe via paiements intégrés Lovable** (`enable_stripe_payments`).
- Abonnement SaaS récurrent → cas d'usage parfait pour Stripe.
- Pas besoin de Merchant of Record (Paddle) ici sauf si tu veux qu'on gère TVA/compliance pour toi à l'international — à confirmer.
- Pas de compte Stripe à créer toi-même (Lovable gère).

À valider avant de lancer (1 question posée plus bas).

## Architecture cible

### Base de données
Nouvelle table `subscriptions` :
- `user_id` (FK auth.users, unique)
- `status` : `trialing` | `active` | `past_due` | `canceled` | `expired`
- `trial_ends_at` (timestamp, = signup + 14 jours)
- `current_period_end` (timestamp, mis à jour par webhook Stripe)
- `stripe_customer_id`, `stripe_subscription_id`
- RLS : user lit seulement sa propre ligne

Trigger `handle_new_user` (existant) étendu pour créer aussi la ligne `subscriptions` avec `status='trialing'` et `trial_ends_at = now() + 14 days`.

### Edge functions
1. **`create-checkout`** — crée une session Stripe Checkout pour l'abonnement Pro 9,90€/mois, retourne l'URL.
2. **`stripe-webhook`** — écoute `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` → met à jour `subscriptions.status` + `current_period_end`.
3. **`customer-portal`** — ouvre le portail Stripe pour gérer/annuler l'abonnement.

### Front
- **Hook `useSubscription`** : retourne `{ status, daysLeft, hasAccess }` où `hasAccess = trialing && trial_ends_at > now()` OR `active`.
- **`ProtectedRoute`** étendu : si `!hasAccess` → redirect vers `/abonnement` (au lieu de bloquer brutalement).
- **`/abonnement`** refait :
  - Affiche jours d'essai restants (réels, calculés depuis `trial_ends_at`)
  - Bouton "S'abonner au Pro" → appelle `create-checkout` → ouvre Stripe Checkout dans nouvel onglet
  - Si déjà `active` → bouton "Gérer mon abonnement" → `customer-portal`
- **Bandeau global** (sidebar ou header) : "Essai : X jours restants" quand `trialing`, masqué si `active`.
- Liste des features alignée sur ce qui existe vraiment (favoris, collections, recherche image — pas d'export Excel ni alertes tant que non implémentés).

### Bypass owner
Ton compte (`romain.rafecas@gmail.com`) reçoit `status='active'` à vie via une condition dans le trigger ou un seed SQL. Pas besoin de payer pour tester.

## Question à valider

1. **Type d'offre Stripe** : 9,90€/mois sans engagement, annulable à tout moment ?
2. **TVA / international** : tu vends uniquement en France, ou international ? (impacte le choix Stripe vs Paddle)

## Étapes d'exécution (après approbation)

1. Lancer `recommend_payment_provider` (vérif éligibilité).
2. Activer Stripe via `enable_stripe_payments`.
3. Créer le produit "Pro 9,90€/mois" via l'outil Lovable.
4. Migration SQL : table `subscriptions` + RLS + trigger étendu + bypass owner.
5. Edge functions : `create-checkout`, `stripe-webhook`, `customer-portal`.
6. Hook `useSubscription` + extension `ProtectedRoute`.
7. Refactor `Abonnement.tsx` (vraies données, vrais boutons).
8. Bandeau "essai restant" dans la sidebar.
9. Test end-to-end en mode test Stripe (carte `4242 4242 4242 4242`).

## Notes

- Tant que tu n'es pas en mode "live" Stripe (vérification d'identité), tu encaisseras avec des cartes de test uniquement. Lovable t'expliquera comment passer en live au moment voulu.
- Les 7 élèves déjà whitelistés via systeme.io devront aussi passer par le checkout Stripe (sauf si tu veux leur offrir l'accès gratuit — à dire). Option : auto-créer leur `subscriptions` avec `status='active'` lors du premier login si leur email est dans `allowed_emails` avec un flag spécial "lifetime".

