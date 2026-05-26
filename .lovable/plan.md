## Changement demandé

Revenir au comportement **additif** pour "Sélectionner tout {période}" : sélectionner Janvier puis Février doit cumuler les deux (et non remplacer).

## Correctif

### `src/components/dashboard/ProductAnalysis.tsx` — `selectAllMatching`

Remettre la fusion avec la sélection existante au lieu du remplacement :

```ts
setSelectedUrls(prev => {
  const next = new Set(prev);
  urls.forEach(u => next.add(u));
  return next;
});
```

Adapter le toast pour refléter le cumul, en indiquant combien ont été ajoutées et le total :
- `+218 produits ajoutés (Février 2025) — 565 sélectionnés au total`
- Si tout était déjà sélectionné : `Tous les produits de Février 2025 étaient déjà sélectionnés`

### Pour permettre de retirer une période entière

Comme la sélection est cumulative et peut couvrir des produits hors de la page courante (donc non décochables un par un facilement), ajouter une action symétrique **"Désélectionner tout {période}"** juste à côté du bouton "Sélectionner tout {période}".

- Visible quand au moins 1 produit du filtre actif est déjà sélectionné.
- Réutilise `fetchAllMatchingUrls(filters)` puis fait : `setSelectedUrls(prev => { const n = new Set(prev); urls.forEach(u => n.delete(u)); return n; })`.
- Toast : `-218 produits retirés (Février 2025) — 347 restants`.

Le bouton global "Effacer" (vide tout) reste tel quel.

## Hors scope

- Pas de changement de la pagination ni de l'ORDER BY (correctif Bug 2 conservé).
- Pas de changement de l'export Excel.
- Pas de modale de gestion (option écartée — l'action "désélectionner la période" couvre le besoin avec un clic).