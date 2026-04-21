

## Production-ready : reset mot de passe + bannières + pages légales + landing

J'attaque tout ce qui est faisable directement dans le code, dans cet ordre.

---

### 1. Reset mot de passe

**Sur `/auth`** : ajouter un lien "Mot de passe oublié ?" sous le bouton de connexion (visible uniquement en mode login).

Au clic → mini-modal/écran qui demande l'email et appelle :
```ts
supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
})
```

**Nouvelle page `/reset-password`** (route publique, hors `Protected`) :
- Détecte le `type=recovery` dans l'URL hash
- Formulaire nouveau mot de passe + confirmation
- Mêmes critères de validation que le signup (8 car / lettre / chiffre / spécial)
- Appelle `supabase.auth.updateUser({ password })`
- Redirige vers `/dashboard` avec toast succès

> Note : Lovable enverra l'email de reset avec son template par défaut (en anglais). Pour avoir un email en français brandé Krakken, il faut configurer un domaine email — chantier séparé que je listerai à la fin.

---

### 2. Bannières d'état abonnement (dashboard)

**Nouveau composant `SubscriptionBanner`** monté en haut de `/dashboard`, `/produits`, `/calculateur`, `/favoris` (via wrapper ou directement dans `Protected`).

Logique :
- **`status === 'past_due'`** → bandeau rouge : "Ton paiement a échoué. Mets à jour ta carte avant le [date]" + bouton "Mettre à jour" (ouvre portail Stripe)
- **`status === 'trialing'` && `daysLeft <= 3`** → bandeau orange : "Ton essai se termine dans X jours. Active ton abonnement pour continuer" + bouton "Activer" (→ `/abonnement`)
- **`cancelAtPeriodEnd === true`** → bandeau bleu info : "Ton abonnement sera annulé le [date]. Réactive-le quand tu veux" + bouton "Réactiver"
- Sinon → rien

Bandeau dismissible par session (sessionStorage) sauf `past_due` qui reste collé.

---

### 3. Pages légales + footer

**3 nouvelles pages publiques** (routes hors `Protected`) :
- `/cgv` — Conditions Générales de Vente (abo 9,90€/mois, 14j d'essai, droit de rétractation, modalités annulation)
- `/confidentialite` — Politique de confidentialité RGPD (données collectées, base légale, durée de conservation, droits user, contact DPO)
- `/mentions-legales` — Éditeur, hébergeur (Lovable Cloud), contact

Contenu rédigé en français, ton direct, adapté à un SaaS d'abo individuel. Les infos perso de l'éditeur (nom, adresse, SIREN) seront en placeholders `[À COMPLÉTER]` avec une note dans le chat te demandant de les remplir.

**Nouveau composant `Footer`** ajouté sur :
- Landing (`/`)
- `/auth`, `/reset-password`
- Toutes les pages légales

Liens : CGV · Confidentialité · Mentions légales · Contact (mailto)

---

### 4. Landing → signup direct (retrait waitlist)

Dans `Landing.tsx` :
- Remplacer tous les CTA "Rejoins l'équipage" qui ouvrent la modal waitlist par des liens directs vers `/auth?mode=signup`
- Garder le copy/storytelling existant
- Ajouter une **section pricing** avant le CTA final :
  - Card unique "Krakken Pro — 9,90 €/mois"
  - Mention "14 jours d'essai gratuit, sans carte requise au départ" *(à confirmer : actuellement le trial est créé au signup sans carte → OK)*
  - Liste compacte des features (Produits, Calculateur, Favoris, Stats temps réel)
  - Bouton "Commencer mon essai" → `/auth`

Le composant `Auth.tsx` lira `?mode=signup` dans l'URL pour pré-sélectionner le mode signup.

> Je **ne supprime pas** la table `waitlist` ni le composant modal pour l'instant — au cas où tu voudrais revenir en arrière. Je débranche juste les CTA.

---

## Détails techniques

**Fichiers créés :**
- `src/pages/ResetPassword.tsx`
- `src/pages/CGV.tsx`
- `src/pages/Confidentialite.tsx`
- `src/pages/MentionsLegales.tsx`
- `src/components/SubscriptionBanner.tsx`
- `src/components/Footer.tsx`
- `src/components/ForgotPasswordDialog.tsx`

**Fichiers modifiés :**
- `src/App.tsx` — ajout des 4 nouvelles routes publiques
- `src/pages/Auth.tsx` — lien "mot de passe oublié" + lecture `?mode=signup`
- `src/pages/Landing.tsx` — débranchement waitlist + section pricing + footer
- `src/components/ProtectedRoute.tsx` ou layout commun — montage du `SubscriptionBanner`

**Aucun changement DB / edge function / Stripe.**

---

## Ce que je ne peux PAS faire dans ce chantier (action de ta part requise)

1. **Go-live Stripe** — à compléter dans l'onglet Payments (claim account + vérification + activation)
2. **Emails transactionnels brandés** (bienvenue Pro, trial J-3, paiement échoué, reset mdp en français) — nécessite de configurer un **domaine email** (DNS sur ton domaine `krakken.io`). Si tu veux, on lance ce chantier ensuite.
3. **Analytics** — choix du provider à faire (Plausible, PostHog, ou table custom)
4. **Compléter les infos légales** dans les pages CGV/Mentions (nom, adresse, SIREN si tu en as un)

Je m'occupe de ce qui est codable maintenant. Une fois fait, on enchaîne sur les emails brandés si tu veux.

