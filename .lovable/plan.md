## Bugs identifiés

### Bug 1 — La sélection s'ajoute aux sélections précédentes
Dans `selectAllMatching` (ProductAnalysis.tsx, ligne 241-245) :

```ts
setSelectedUrls(prev => {
  const next = new Set(prev);   // ← garde les URLs des filtres précédents
  urls.forEach(u => next.add(u));
  return next;
});
```

De plus, `selectedUrls` est persisté en localStorage (`usePersistedState`). Conséquence :
- L'utilisateur sélectionne tout Février → 300 produits.
- Change le filtre pour Janvier → clique "Sélectionner tout Janvier 2025" → 200 produits.
- L'état contient maintenant 500 URLs (Janvier + Février), et l'export Excel exporte les deux mois mélangés.

C'est très probablement ce que l'utilisateur observe : "ça ne sélectionne pas ce qu'il faut".

### Bug 2 — Pagination Supabase sans `ORDER BY`
Dans `fetchAllMatchingUrls` (productsQuery.ts, ligne 85-87) :

```ts
let q: any = supabase.from("products").select("url");
q = applyProductsFilters(q, filters);
q = q.range(from, to);   // ← aucun .order() → ordre indéterminé
```

Sans `ORDER BY`, Postgres ne garantit pas un ordre stable entre les requêtes paginées. Conséquence : certains produits peuvent être retournés deux fois (sans impact car `Set`) ou manqués (impact réel : sélection incomplète). Pour un mois avec ~300 produits, c'est invisible (un seul chunk). Au-delà de 1000 produits, on peut sélectionner moins que `totalCount`.

## Correctifs

### Fichier `src/components/dashboard/ProductAnalysis.tsx`

Remplacer la fonction `selectAllMatching` pour qu'elle **remplace** la sélection (au lieu d'ajouter) :

```ts
setSelectedUrls(new Set(urls));
```

Et ajouter un toast d'info clair :
```
347 produits sélectionnés pour Janvier 2025 (sélection précédente effacée)
```

### Fichier `src/hooks/productsQuery.ts`

Ajouter un ordre stable avant `.range()` :

```ts
q = q.order("url", { ascending: true });
q = q.range(from, to);
```

L'ordre par `url` est arbitraire mais stable et indexé (clé naturelle des produits).

## Hors scope

- Pas de changement de la checkbox "page courante" (toggle additif, comportement standard).
- Pas de changement du bandeau secondaire dans la toolbar.
- Pas de changement du cap à 5000.