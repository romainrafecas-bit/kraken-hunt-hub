

## État actuel

**Côté code : prêt.** Tout est en place — table `subscriptions`, trigger 14j d'essai, edge functions (`create-checkout`, `payments-webhook`, `create-portal-session`), hook `useSubscription`, gating via `ProtectedRoute`, page `/abonnement` fonctionnelle avec Stripe Embedded Checkout.

**Côté Stripe : mode test uniquement.** Tu peux encaisser des paiements **fictifs** (carte `4242 4242 4242 4242`), mais **pas de vrai argent** tant que tu n'as pas complété le go-live.

## Ce qu'il reste à faire pour encaisser pour de vrai

4 étapes côté Stripe (rien à coder) :

1. **Réclamer ton compte Stripe** — clique le lien depuis l'onglet Payments dans Lovable, crée le compte (ou connecte un existant), valide ton email.
2. **Activer ton compte en mode live** — formulaire Stripe : type d'entreprise, identité, RIB pour les virements, 2FA. Coche "copier les produits depuis le sandbox" pour récupérer "Krakken Pro 9,90€".
3. **Installer l'app Lovable sur le compte live** — souvent fait automatiquement à l'étape 2 si tu as coché "tout copier".
4. **Lancer le readiness check** — automatique, valide que produits/prix/webhooks sont corrects.

Tout se passe dans **l'onglet Payments** de Lovable qui te guide étape par étape.

## Bug à corriger (silencieux)

Erreur runtime détectée sur `useSubscription` : double souscription au canal Realtime. À fixer (cleanup d'effect).

## Plan d'action

### Avant le go-live
1. Fix bug Realtime dans `useSubscription` (5 min, je le fais).
2. Tu testes le flow complet en sandbox : inscription → 14j d'essai → paiement carte test → vérif passage en `active`.

### Pour passer en live
3. Tu suis les 4 étapes Stripe depuis l'onglet Payments (15-30 min côté toi).
4. Une fois live activé, on refait un test avec une vraie carte (1€ remboursable).

## Question

Tu veux que je corrige le bug Realtime maintenant, et ensuite tu attaques le go-live Stripe de ton côté ?

