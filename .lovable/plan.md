

## Plug l'envoi d'emails brandés Krakken

Tu as un domaine custom (`krakken.io`) déjà connecté au projet. On va l'utiliser pour envoyer tous les emails depuis `notify@krakken.io` (ou similaire) au lieu des templates anglais par défaut.

---

### Étape 1 — Configurer le domaine d'envoi (action de ta part, 2 min)

Je vais te présenter un dialogue de configuration où tu choisiras le sous-domaine d'envoi (par défaut `notify.krakken.io`). Lovable ajoute automatiquement les enregistrements DNS nécessaires (SPF, DKIM, MX) — pas besoin de toucher à ta zone DNS manuellement.

> La vérification DNS peut prendre jusqu'à 72h, mais on peut continuer à scaffolder pendant ce temps. Les emails partiront automatiquement dès que la vérif est OK.

---

### Étape 2 — Emails d'authentification brandés (auth)

Une fois le domaine configuré, je scaffold les **6 templates d'auth en français**, brandés Krakken :

1. **Confirmation d'inscription** — "Bienvenue à bord, [prénom]. Confirme ton email pour rejoindre l'équipage."
2. **Reset mot de passe** — "Tu as demandé un nouveau mot de passe. Clique pour le réinitialiser."
3. **Magic link** — "Connecte-toi à Krakken en un clic."
4. **Invitation** — (si jamais tu actives ça plus tard)
5. **Changement d'email** — "Confirme ton nouvel email."
6. **Réauthentification** — "Confirme que c'est bien toi."

Style : fond blanc (obligatoire pour la délivrabilité), accents teal/turquoise (`#1FB8A8`), typo Nunito/DM Sans, logo Krakken en header, footer minimaliste avec liens légaux.

---

### Étape 3 — Emails transactionnels (app)

Je crée l'infra transactional + 3 templates métier :

1. **`welcome-pro`** — déclenché à l'inscription, après création du compte trial
   - "Ta traque commence. 14 jours d'essai t'attendent."
   - CTA → `/dashboard`
2. **`trial-ending`** — déclenché à J-3 de fin d'essai (via cron qu'on ajoutera après, ou manuel pour l'instant)
   - "Plus que 3 jours d'essai. Active ton abonnement pour continuer."
   - CTA → `/abonnement`
3. **`payment-failed`** — déclenché par le webhook Stripe `invoice.payment_failed`
   - "Ton paiement a échoué. Mets à jour ta carte avant suspension."
   - CTA → portail Stripe

> **Note** : pour le déclenchement, je branche immédiatement `welcome-pro` (sur signup) et `payment-failed` (dans `payments-webhook`). Le `trial-ending` J-3 nécessite un cron job — je le scaffold aussi mais on verra le déclenchement automatique dans une étape suivante si tu veux.

---

### Étape 4 — Page de désabonnement

Création d'une page `/email-unsubscribe` (route publique) qui valide le token de désabonnement et confirme la désinscription. Design cohérent avec le reste du site (glass panel, fond abyssal).

> Les emails d'auth (reset, confirmation) ne sont pas concernés par le désabonnement — c'est uniquement pour les transactionnels (welcome, trial-ending).

---

## Détails techniques

**Outils utilisés (séquence) :**
1. Tu cliques sur le bouton de setup domaine → DNS auto-délégué à Lovable
2. `setup_email_infra` → tables (queue pgmq, send_log, suppression list, unsubscribe tokens) + cron dispatcher
3. `scaffold_auth_email_templates` → 6 templates auth + `auth-email-hook` edge function
4. `scaffold_transactional_email` → `send-transactional-email` + handlers + 1 template d'exemple
5. Customisation des 6 templates auth en français + brand Krakken
6. Création des 3 templates transactionnels (welcome, trial-ending, payment-failed)
7. Branchement `welcome-pro` dans `Auth.tsx` (après signup réussi)
8. Branchement `payment-failed` dans `payments-webhook/index.ts` (sur event `invoice.payment_failed`)
9. Création de la page `/email-unsubscribe` + route dans `App.tsx`
10. Deploy de toutes les edge functions

**Fichiers créés :**
- `supabase/functions/auth-email-hook/index.ts`
- `supabase/functions/send-transactional-email/index.ts`
- `supabase/functions/handle-email-unsubscribe/index.ts`
- `supabase/functions/handle-email-suppression/index.ts`
- `supabase/functions/process-email-queue/index.ts`
- `supabase/functions/_shared/email-templates/*.tsx` (6 templates auth)
- `supabase/functions/_shared/transactional-email-templates/welcome-pro.tsx`
- `supabase/functions/_shared/transactional-email-templates/trial-ending.tsx`
- `supabase/functions/_shared/transactional-email-templates/payment-failed.tsx`
- `supabase/functions/_shared/transactional-email-templates/registry.ts`
- `src/pages/EmailUnsubscribe.tsx`

**Fichiers modifiés :**
- `src/pages/Auth.tsx` — appel `welcome-pro` après signup
- `src/App.tsx` — route `/email-unsubscribe`
- `supabase/functions/payments-webhook/index.ts` — appel `payment-failed` sur échec
- `supabase/config.toml` — config edge functions emails

**Aucune modif Stripe / DB schema / front existant.**

---

## Ce que tu dois faire (1 action)

**Cliquer sur le bouton ci-dessous** pour configurer le domaine `notify.krakken.io`. Le reste roule tout seul après.

<lov-actions>
<lov-open-email-setup>Configurer le domaine email</lov-open-email-setup>
</lov-actions>

