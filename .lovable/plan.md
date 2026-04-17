

## Contexte

Actuellement `/profil` affiche 100% de données mockées (nom "Capitaine Kraken", email factice, stats en dur, préférences non persistées). La table `favorites` existe avec RLS `auth.uid() = user_id`, mais **l'app n'a aucune authentification** : pas de page `/auth`, pas de session, donc aucun favori ne peut être réellement stocké ni lu.

Refonte complète nécessaire en 3 volets : auth → favoris fonctionnels → profil réel.

## 1. Authentification

- Page `/auth` (login + signup) avec **Email/Mot de passe + Google OAuth**
- Auto-confirm email activé pour éviter la friction (pas d'email de vérif en dev)
- Provider `AuthContext` avec `onAuthStateChange` (set up AVANT `getSession()`)
- Hook `useAuth()` exposant `user`, `session`, `signOut`
- Routes protégées (`/dashboard`, `/produits`, `/favoris`, `/profil`, `/analytics`, `/abonnement`) → redirect vers `/auth` si non connecté
- Bouton "Se déconnecter" dans la sidebar (en bas) et sur le profil

## 2. Favoris fonctionnels (vrai branchement Supabase)

- Hook `useFavorites()` :
  - `favorites` : liste des favoris de l'utilisateur (lus depuis `favorites` joints aux `products` via `product_url`)
  - `toggleFavorite(productUrl, collection?)` : insert si absent, delete si présent
  - `isFavorite(productUrl)` : helper
  - `updateCollection(id, collection)`
  - Invalidation React Query
- **Brancher le coeur dans `ProductAnalysis.tsx`** : remplacer le state local par `useFavorites().toggleFavorite/isFavorite`
- **Refonte de `/favoris`** : afficher les vrais favoris de l'utilisateur depuis Supabase, regroupés par collection (À sourcer / Test / Validé / Abandonné), avec image, titre, prix, marque (jointure sur `products` via `product_url`), et possibilité de changer de collection ou supprimer

## 3. Refonte page `/profil`

Remplacement complet des données mockées par du réel :

**Header profil**
- Email réel : `user.email` depuis `useAuth()`
- "Membre depuis" : `user.created_at` formaté
- Initiales auto-générées dans l'avatar (à partir de l'email)
- Bouton "Se déconnecter" (rouge discret)
- Bouton "Gérer mon abonnement" (conservé)

**Stats réelles** (3 cartes, calculées depuis `favorites` + `products`)
- **Total favoris** : `COUNT(*)` sur `favorites` de l'utilisateur
- **Répartition par collection** : mini-bars avec compteurs À sourcer / Test / Validé / Abandonné
- **Catégorie favorite** : la catégorie la plus représentée parmi ses favoris (jointure sur `products.category`)

**Préférences (persistées)**
- Catégories favorites + fourchette de prix → stockées dans une nouvelle table `profiles` (user_id PK, favorite_categories text[], default_price_range text)
- Sauvegarde automatique on change avec toast de confirmation

## Backend / Migrations

```sql
-- 1. Table profiles (user_id = PK, FK auth.users ON DELETE CASCADE)
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  favorite_categories text[] default '{}',
  default_price_range text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- RLS: chaque user lit/écrit uniquement son profil
create policy "Own profile select" on profiles for select using (auth.uid() = user_id);
create policy "Own profile insert" on profiles for insert with check (auth.uid() = user_id);
create policy "Own profile update" on profiles for update using (auth.uid() = user_id);

-- 2. Trigger auto-création profil à l'inscription
create function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id) values (new.id);
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();
```

Table `favorites` : déjà OK (RLS bien configurée).

## Fichiers touchés

**Nouveaux**
- `src/pages/Auth.tsx` — login/signup + Google
- `src/contexts/AuthContext.tsx` + `src/hooks/useAuth.ts`
- `src/components/ProtectedRoute.tsx`
- `src/hooks/useFavorites.ts`
- `src/hooks/useProfile.ts`

**Modifiés**
- `src/App.tsx` — wrap `<AuthProvider>`, route `/auth`, `<ProtectedRoute>` autour des pages privées
- `src/pages/Profil.tsx` — refonte complète (email réel, stats réelles, préférences persistées, déconnexion)
- `src/pages/Favoris.tsx` — branchement Supabase + jointure produits
- `src/components/dashboard/ProductAnalysis.tsx` — coeur branché sur `useFavorites`
- `src/components/dashboard/KrakkenSidebar.tsx` — bouton déconnexion
- `supabase/config.toml` — `enable_confirmations = false`

## Notes

- Auth Google nécessitera que tu l'actives côté Lovable Cloud (un lien sera fourni).
- Les préférences du profil seront sans pré-remplissage automatique des filtres `/produits` dans cette itération (peut être ajouté ensuite si souhaité).
- Pas de mock conservé : tout est réel ou vide avec un état vide propre.

