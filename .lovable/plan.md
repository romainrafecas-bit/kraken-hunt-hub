## Problème

Sur `/produits`, le `<select>` "Catégorie" affiche uniquement "Tous" au début car la liste des catégories est récupérée via une requête paginée (chunks de 1000 lignes sur la table `products`) déclenchée dans un `useEffect` local à `ProductAnalysis`. Conséquences :

- Le chargement prend plusieurs secondes — pendant ce temps aucun feedback : le dropdown a l'air "cassé".
- L'état (`dynamicCategories`, `dynamicBrands`) est local au composant. Dès qu'on quitte la page Produits puis qu'on revient (ou qu'on change de route protégée), le composant est démonté → re-fetch complet.
- Même problème pour la liste des marques (dropdown d'exclusion).

## Objectif

Que l'utilisateur comprenne qu'il faut patienter, et qu'il n'ait à patienter qu'une seule fois.

## Plan

### 1. UX immédiate (feedback de chargement)
Dans `src/components/dashboard/ProductAnalysis.tsx` :
- Ajouter un état `metaLoading` (et `metaError`).
- Pendant le chargement du dropdown Catégorie :
  - Désactiver le `<select>` (`disabled`).
  - Afficher une option placeholder : « Chargement des catégories… » avec un petit spinner Lucide (`Loader2 animate-spin`) à côté du chevron.
  - Style visuel : opacité réduite + curseur `wait`.
- Une fois chargé : afficher un compteur discret « N catégories » à côté du select pour confirmer.
- Même traitement pour le dropdown "Marques exclues" (bouton trigger en état "Chargement des marques…").
- En cas d'erreur : option « Erreur — réessayer » cliquable qui relance le fetch.

### 2. Cache cross-navigation (n'attendre qu'une fois)
Extraire le fetch dans un hook partagé `src/hooks/useProductsMeta.ts` basé sur React Query :
- `queryKey: ["products-meta"]`
- `staleTime: 10 minutes`, `gcTime: 1 heure` → conservé en mémoire même après démontage.
- Retourne `{ categories, brands, isLoading, error, refetch }`.
- Remplace le `useEffect` + `useState` actuel dans `ProductAnalysis`.

Résultat : au retour sur la page Produits, les catégories sont immédiates (servies depuis le cache React Query).

### 3. Accélérer le premier chargement (optionnel mais recommandé)
Le fetch actuel rapatrie toutes les lignes (`category, brand`) par paquets de 1000. Sur une grosse table c'est lent. Deux options :

- **A — RPC Postgres** : créer une fonction `get_products_meta()` qui renvoie `SELECT DISTINCT category, brand FROM products` en un seul appel léger (autorisée via RLS / `SECURITY DEFINER` lecture seule). Le hook fait alors un seul `supabase.rpc("get_products_meta")`.
- **B — Statu quo** : garder le fetch paginé mais bénéficier du cache React Query (point 2). Plus simple, zéro migration.

Recommandation : **option A** si la table dépasse quelques milliers de lignes, sinon B suffit.

## Fichiers touchés
- `src/components/dashboard/ProductAnalysis.tsx` (UX du select + utilisation du nouveau hook)
- `src/hooks/useProductsMeta.ts` (nouveau, cache React Query)
- *(si option A)* migration SQL ajoutant `get_products_meta()`

Aucune modification de la logique métier / des filtres / du tri.
