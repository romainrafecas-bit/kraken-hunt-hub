

## Persister les filtres de la page Produits

**Problème** : tous les filtres (catégorie, marques exclues, recherche, dates, prix, vendeurs, tri, page, sélection) sont en `useState` local dans `ProductAnalysis.tsx`. Dès que l'onglet est rechargé ou le composant remonté (changement d'onglet navigateur → retour → React peut re-render à neuf), tout est réinitialisé.

**Solution** : sauvegarder automatiquement chaque filtre dans `localStorage` et le restaurer à l'initialisation du composant.

### Changements

**1 seul fichier modifié** : `src/components/dashboard/ProductAnalysis.tsx`

- Créer un petit helper `usePersistedState(key, defaultValue)` qui :
  - lit `localStorage` au mount pour initialiser le state
  - écrit dans `localStorage` à chaque changement
  - supporte `Set` (sérialisation en array) pour `excludedBrands` et `selectedUrls`
- Remplacer chacun de ces `useState` par `usePersistedState` avec une clé préfixée `krakken:produits:` :
  - `selectedCategory`, `excludedBrands`, `selectedDatePreset`
  - `sortKey`, `sortDir`, `stockFilter`, `page`
  - `searchQuery`, `priceMin`, `priceMax`, `sellersMin`, `sellersMax`
  - `selectedUrls` (la sélection de produits cochés pour export)

### Pourquoi `localStorage` et pas `sessionStorage`

- `sessionStorage` est perdu si l'utilisateur ferme l'onglet (cas réel : ferme accidentellement, rouvre).
- `localStorage` survit entre sessions → l'utilisateur retrouve sa traque même le lendemain. C'est ce qu'on veut pour un workflow de sourcing long.

### Bouton "Réinitialiser les filtres" (bonus)

Petit bouton discret à côté de la barre de filtres pour tout reset d'un clic (utile car les filtres deviennent persistants et il faut un échappatoire).

### Détails techniques

- Aucune modif backend, aucune migration.
- Aucun impact sur les autres pages (Favoris, Calculateur, etc.) — le hook reste local au fichier.
- Clés `localStorage` namespacées `krakken:produits:*` pour éviter les collisions.
- `try/catch` autour des reads/writes localStorage (au cas où mode privé / quota plein).

