## Plan

Je vais corriger la vraie source du problème sur `/` : le dashboard utilise `src/pages/Index.tsx`, pas le composant `CategoryBreakdown.tsx`.

### 1. Rendre la donnée du graphique déterministe
Dans `src/hooks/useDashboardStats.ts` :
- garder la pagination ordonnée, mais remplacer l’ordre sur `url` seul par un ordre stable multi-colonnes : `category`, puis `url` ;
- normaliser les catégories avant agrégation (`trim`, fallback `Autre`) pour éviter des doublons visuels comme `Gaming` / `Gaming ` ;
- trier les catégories par `recurrences` décroissant, puis `count` décroissant, puis nom alphabétique.

### 2. Figer l’ordre côté page dashboard
Dans `src/pages/Index.tsx` :
- construire `catStats` avec un `sort` final défensif après `formatCat`, pour garantir que l’ordre affiché du donut et de la liste ne dépend jamais de l’ordre reçu ;
- remplacer les clés/hover basés sur le nom affiché par le slug brut pour éviter les collisions si deux catégories se formatent pareil.

### 3. Éviter les pourcentages trompeurs
Toujours dans `Index.tsx` :
- calculer les pourcentages sur la même liste triée ;
- garder le donut et la légende synchronisés sur le même tableau, donc même ordre à chaque refresh.

### Hors scope
- Aucun changement de design.
- Aucun changement de base de données.
- Aucun changement de page d’accueil marketing `Landing.tsx`.