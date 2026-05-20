## Problème

Aujourd'hui, la checkbox d'en-tête du tableau Produits ne sélectionne que la **page courante** (20 lignes typiquement). Impossible de dire d'un clic : « sélectionne tous les produits de janvier 2025 » ou « tous les produits filtrés par catégorie Mode ».

## Objectif

Permettre de sélectionner **l'intégralité du résultat filtré** (toutes pages confondues), pas seulement la page affichée.

## Comportement UX

Dans la barre d'outils de sélection (qui apparaît dès qu'un produit est coché) :

1. Quand la **page courante est entièrement cochée** mais que `totalCount > paged.length`, afficher un bandeau type Gmail :

   ```
   ✓ Les 20 produits de cette page sont sélectionnés.
   → Sélectionner les 347 produits correspondant au filtre
   ```

   Le lien lance la sélection globale.

2. Pendant le fetch global : spinner + texte « Sélection en cours… (347) » et bouton désactivé.

3. Une fois fait : message « 347 produits sélectionnés sur tout le filtre » + lien « Désélectionner tout » (= `clearSelection`).

4. Si l'utilisateur change un filtre (catégorie, date, etc.) après une sélection globale → on garde les URLs déjà sélectionnées (cohérent avec le comportement actuel par page), mais le bandeau « tout sélectionner » réapparaît avec le nouveau `totalCount`.

5. La checkbox d'en-tête garde son rôle actuel (toggle page courante uniquement). Le bandeau est le seul vecteur pour « tout sélectionner ».

## Implémentation technique

Dans `src/components/dashboard/ProductAnalysis.tsx` :

- Ajouter un état `selectingAll: boolean` pour le loader.
- Nouvelle fonction `selectAllMatching()` qui rejoue exactement les mêmes filtres que `useProductsPaginated` mais en mode `select("url")` paginé (chunks de 1000, jusqu'à `totalCount`). Pour éviter la duplication de logique de filtres, **extraire** la construction du `query` Supabase dans une fonction utilitaire partagée :

  - Créer `src/hooks/productsQuery.ts` exportant `buildProductsQuery(supabase, filters)` qui applique toutes les clauses `.eq/.or/.gte/.lte/.not/.range` sauf `range` et `order`.
  - `useProductsPaginated` réutilise cette fonction et ajoute `order` + `range`.
  - `selectAllMatching` réutilise la même fonction, ajoute `.select("url")` puis pagine par 1000 jusqu'à épuisement (`while (from < totalCount)`).

- Ajouter les URLs récupérées dans `selectedUrls` via `setSelectedUrls(prev => new Set([...prev, ...newUrls]))`.

- Dans la toolbar de sélection (lignes 552-574), ajouter le bandeau conditionnel décrit plus haut, basé sur `allPageSelected && totalCount > paged.length && selectedUrls.size < totalCount`.

## Limites / garde-fous

- Cap dur à 5000 produits pour éviter qu'un utilisateur sélectionne 50 000 lignes par erreur (l'export Excel reste utilisable). Au-delà : toast « Affinez vos filtres (max 5000) ».
- Pas de modification du schéma DB, pas de nouvelle policy RLS (la policy `Active subscribers can read products` couvre déjà `select("url")`).

## Fichiers touchés

- `src/components/dashboard/ProductAnalysis.tsx` — toolbar + handler `selectAllMatching` + état `selectingAll`.
- `src/hooks/useProductsPaginated.ts` — refactor pour exposer `buildProductsQuery`.
- `src/hooks/productsQuery.ts` *(nouveau)* — fonction utilitaire de construction de query.

Aucune modification de la pagination, du tri, des filtres existants, ni de l'export Excel.