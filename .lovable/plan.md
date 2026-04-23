

## Tuer les temps de chargement à chaque navigation

**Cause racine** : 3 hooks de données critiques (`useProductsPaginated`, `useDashboardStats`, `useProducts`) utilisent `useState + useEffect`. Quand tu quittes une page, le composant est démonté et **les données meurent avec lui**. Au retour → fetch complet → skeleton.

`@tanstack/react-query` est déjà installé et configuré dans `App.tsx`, mais seulement `useProfile` et `useFavorites` l'utilisent. On va l'étendre aux 3 hooks restants → cache partagé entre toutes les pages, données instantanées au retour.

### Changements

**1. `src/App.tsx` — Configurer le cache global**

Remplacer `new QueryClient()` par une instance avec defaults :
```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // données "fraîches" 5 min → pas de refetch
      gcTime: 30 * 60 * 1000,        // gardées en mémoire 30 min après démontage
      refetchOnWindowFocus: false,   // PAS de refetch quand tu reviens d'un autre onglet
      refetchOnMount: false,         // PAS de refetch si déjà en cache
    },
  },
})
```

→ Ça résout aussi le problème "je reviens de Cdiscount, ça recharge".

**2. `src/hooks/useDashboardStats.ts` — Migrer vers `useQuery`**

Wrap la logique de `load()` dans `useQuery({ queryKey: ['dashboard-stats'], queryFn: load })`. Le résultat est mis en cache global → retour sur dashboard = affichage instantané.

**3. `src/hooks/useProductsPaginated.ts` — Migrer vers `useQuery`**

`queryKey: ['products-paginated', filters]` (filters sérialisés). Quand tu reviens sur Produits avec les mêmes filtres → données déjà là, zéro skeleton. Si tu changes un filtre → nouveau fetch (normal).

**4. `src/hooks/useProducts.ts` — Migrer vers `useQuery`**

Même traitement, `queryKey: ['products-all']`.

**5. `src/App.tsx` — Précharger en arrière-plan (bonus)**

Au mount du `AuthProvider` (utilisateur connecté), déclencher `queryClient.prefetchQuery` pour `dashboard-stats` et la 1ère page de `products-paginated` → quand l'utilisateur arrive sur n'importe quelle page, la donnée est déjà là.

**6. Supprimer le `<Suspense fallback={<PageLoader />}>` plein écran**

Garder le `Suspense` (nécessaire pour `lazy`) mais utiliser un `fallback={null}` ou un mini loader inline → plus de flash noir entre les pages. Une fois qu'une page est chargée, le module reste en cache : pas de loader au retour de toute façon.

### Ce que tu vas voir après

| Action | Avant | Après |
|---|---|---|
| Dashboard → Produits → Dashboard | Skeleton ~1s à chaque fois | Instantané (cache 5 min) |
| Cdiscount → retour Krakken | Refetch + skeleton | Instantané, pas de refetch |
| Refresh Produits avec filtres persistés | Skeleton + fetch | Skeleton ~300ms (1er hit), puis cache |
| Changement de page de pagination | Skeleton | Skeleton court (nouvelle data) — normal |

### Détails techniques

- **Aucune modif** : DB, RLS, edge functions, UI, filtres, persistence localStorage.
- **Fichiers touchés** : `src/App.tsx`, `src/hooks/useDashboardStats.ts`, `src/hooks/useProductsPaginated.ts`, `src/hooks/useProducts.ts`.
- **Risque** : nul. React Query est déjà en place et stable. Les hooks gardent la même signature de retour (`{ data, loading, error, refetch }`) — aucun composant consommateur à modifier.
- **Mémoire** : ~30 min de cache pour ~quelques MB de produits = négligeable.

