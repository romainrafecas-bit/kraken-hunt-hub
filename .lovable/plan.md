

## Audit — ce qu'il manque pour que ce soit nickel

Le paiement est OK. Voici les vrais manques, classés par ordre d'impact.

---

### 🔴 Priorité 1 — Bloquants production

**1. Passer Stripe en live**
Tu es encore en sandbox. Tant que tu n'as pas complété le go-live (claim account + vérif Stripe + activation), personne ne peut vraiment payer. Action côté onglet Payments — je peux checker le statut avec `get_go_live_status` mais c'est toi qui valides.

**2. Emails transactionnels**
Aujourd'hui l'utilisateur ne reçoit **aucun email** :
- Pas de confirmation d'inscription (Supabase envoie un mail par défaut, mais template brut en anglais)
- Pas de mail "bienvenue Pro" après paiement
- Pas d'alerte "ton essai finit dans 3 jours"
- Pas de mail d'annulation confirmée

**3. Reset mot de passe**
La page `/auth` n'a pas de lien "Mot de passe oublié ?". Bloquant dès qu'un user oublie son mdp.

**4. Relance trial expirant**
Un user en essai qui ne revient pas les 14 jours perd l'accès sans prévenir. Il faut au minimum une bannière J-3 dans le dashboard + idéalement un email.

---

### 🟠 Priorité 2 — Expérience & conversion

**5. Landing page → tunnel d'inscription**
Actuellement la landing pousse vers une **waitlist** (`waitlist` table). Mais ton produit est lancé, l'abonnement est actif. Il faut retirer la waitlist et envoyer direct vers `/auth` (signup → 14j d'essai).

**6. Page tarifs publique**
Pas de page `/tarifs` ou section pricing sur la landing. Un visiteur ne sait pas que c'est 9,90 €/mois avec 14j d'essai avant de créer un compte.

**7. Onboarding premier login**
Après signup, l'user arrive sur `/dashboard` sans guidage. Un mini tour (3 étapes : Produits → Favoris → Calculateur) augmente la rétention.

**8. État "past_due" géré dans l'UI**
Si une carte expire et que le paiement échoue, le statut passe `past_due`. Aujourd'hui l'user a encore accès mais ne le sait pas → il faut une bannière rouge "Ton paiement a échoué, mets à jour ta carte".

---

### 🟡 Priorité 3 — Qualité & confiance

**9. Pages légales**
- CGU / CGV (obligatoire en France pour vendre un abo)
- Politique de confidentialité (RGPD)
- Mentions légales
Footer avec liens vers ces pages.

**10. Gestion des erreurs globale**
Pas de page d'erreur propre (500, network down). Un `ErrorBoundary` React + page de fallback.

**11. Analytics produit**
Tu n'as aucune visibilité sur : combien de signups, combien convertissent en payant, quelles features sont utilisées. Au choix : Plausible, PostHog, ou simple table `events` Supabase.

**12. Support client**
Pas de moyen pour l'user de te contacter. Un simple lien mailto dans la sidebar + page `/aide` avec FAQ.

---

### 🟢 Priorité 4 — Nice to have

**13. Plan annuel** (ex: 99 €/an = -17%) → boost LTV
**14. Parrainage** (1 mois offert par filleul)
**15. Export CSV** des favoris et calculs de marge
**16. Mode sombre/clair** (tu es dark-only)
**17. Mobile app wrapper** (PWA installable)

---

## Ma reco : par où commencer

Dans cet ordre, sur 1-2 semaines :

```text
Semaine 1 (production-ready)
├── Go-live Stripe
├── Reset mot de passe
├── Emails transactionnels (bienvenue, trial J-3, paiement échoué)
└── Pages légales + footer

Semaine 2 (conversion)
├── Retirer waitlist, brancher landing → /auth
├── Section pricing sur landing
├── Bannière trial/past_due dans le dashboard
└── Analytics (Plausible ou PostHog)
```

Dis-moi par quoi tu veux attaquer et je te fais un plan détaillé pour ce chantier précis.

