

## Demande

Créer un accès direct pour `romain.rafecas@gmail.com` avec mot de passe `789963321147`, en contournant la vérification systeme.io (utile pour débloquer les tests immédiats).

## Approche

Deux actions complémentaires :

**1. Whitelister l'email en base**
Insérer `romain.rafecas@gmail.com` dans `allowed_emails` (traçabilité, sans `systemeio_contact_id`).

**2. Bypass owner dans l'edge function `check-systemeio-access`**
Ajouter une liste d'emails "owner" en dur en haut du fichier (juste `romain.rafecas@gmail.com`). Si l'email entrant matche → retourne `{ allowed: true }` immédiatement, sans appeler systeme.io. Le reste de la logique reste identique pour les autres élèves.

Avantage vs créer le compte directement en SQL : on garde le flow normal (signup via `/auth`), tu choisis ton mot de passe toi-même via le formulaire, et le bypass reste réutilisable si tu veux ajouter d'autres comptes admin plus tard.

**3. Tu signes up sur `/auth`**
Une fois le code déployé : aller sur `/auth` → "Première connexion" → email `romain.rafecas@gmail.com` + mot de passe `789963321147` → ça crée le compte Supabase Auth, le trigger `handle_new_user` crée ton profil, et tu es redirigé vers `/dashboard`.

## Modifications

- **`supabase/functions/check-systemeio-access/index.ts`** : ajout d'un `OWNER_EMAILS = ["romain.rafecas@gmail.com"]` avec early return `allowed: true` (et upsert dans `allowed_emails` pour cohérence).
- **Migration SQL** : `INSERT INTO allowed_emails (email) VALUES ('romain.rafecas@gmail.com') ON CONFLICT DO NOTHING;`

## Notes

- Le mot de passe `789963321147` (12 chiffres) passe la contrainte 8 caractères min. Note : c'est faible pour un compte admin — tu peux le changer plus tard via "Mot de passe oublié" si besoin.
- Si tu préfères que je crée directement le user dans `auth.users` via SQL (sans passer par le formulaire), dis-le moi — c'est faisable mais moins propre (le hash bcrypt doit être généré côté Postgres).

