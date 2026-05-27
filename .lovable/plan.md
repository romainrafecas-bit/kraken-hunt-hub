## Problème

Sur le dashboard, la section "Répartition par catégorie" change d'ordre à chaque rafraîchissement. La donnée vient de `useDashboardStats` qui pagine la table `products` en chunks de 1000 via `fetchAllColumn`.

**Cause racine** : la requête de pagination dans `src/hooks/useDashboardStats.ts` n'a aucun `ORDER BY` :

```ts
await supabase.from("products").select(extraSelect).range(from, from + PAGE - 1);
```

Sans ordre explicite, Postgres ne garantit pas l'ordre entre les pages. Selon le plan d'exécution, certaines lignes sont comptées deux fois ou omises. Les sommes `recurrences` par catégorie fluctuent légèrement, ce qui modifie le tri `sort((a,b) => b.recurrences - a.recurrences)` et change l'ordre du donut + de la légende à chaque chargement.

De plus, le tri final compare uniquement `recurrences` : en cas d'égalité, l'ordre n'est pas déterministe vis-à-vis du nom.

## Correction

Dans `src/hooks/useDashboardStats.ts` :

1. **Pagination déterministe** dans `fetchAllColumn` — ajouter un `ORDER BY` sur la clé primaire `url` :
   ```ts
   .select(extraSelect)
   .order("url", { ascending: true })
   .range(from, from + PAGE - 1);
   ```
   Garantit que chaque ligne est lue exactement une fois → sommes stables.

2. **Tri stable** sur `categoryStats` — départager les égalités par nom :
   ```ts
   .sort((a, b) => b.recurrences - a.recurrences || a.name.localeCompare(b.name));
   ```

## Hors scope

- Aucun changement de design / animation sur `Index.tsx` ni `CategoryBreakdown.tsx`.
- Aucun changement sur `ProductAnalysis.tsx` ni la sélection produits.
- Aucun changement de schéma DB.
