

## Diagnostic

Le problème vient du fait que `last_seen` est probablement stocké en **texte** au format `dd/mm/yyyy` dans la base externe. Quand Supabase trie côté serveur avec `.order("last_seen", { ascending: false })`, il fait un tri **lexicographique** (alphabétique) :

```text
"31/12/2025" > "16/04/2026"  ← car "3" > "1" en ASCII
```

Résultat : les produits de 2026 (qui commencent par "0", "1") se retrouvent après ceux de fin 2025 (qui commencent par "3").

Avec la pagination serveur, on ne peut pas re-trier côté client — on ne voit que 20 produits à la fois.

## Solution proposée

Puisqu'on ne peut pas modifier la base externe, la solution est de **ne pas trier par `last_seen` côté serveur** quand c'est du texte. À la place :

1. **Ajouter un log de debug** temporaire pour confirmer le format exact de `last_seen` dans la base (texte ou timestamp)
2. **Si c'est du texte** : utiliser le filtre date (`datePreset`) qui fonctionne déjà avec `.gte("last_seen", cutoff.toISOString())` — mais le **tri par défaut** sera changé pour utiliser `added_date` (qui est un vrai timestamp) quand l'utilisateur clique sur "Dernier vu"
3. **L'affichage** reste `last_seen` (la vraie date du dernier avis), seul le **tri serveur** utilise `added_date` comme approximation pour l'ordre chronologique

### Alternative : si `last_seen` est bien un timestamp

Si le debug confirme que c'est un vrai timestamp, alors le tri fonctionne déjà et le problème est ailleurs (peut-être qu'il n'y a tout simplement pas de produits avec un `last_seen` en 2026 — les produits "de 2026" ont peut-être un `added_date` en 2026 mais un `last_seen` encore en 2025).

### Fichiers à modifier

- **`src/hooks/useProductsPaginated.ts`** — Ajouter un `console.log` sur le premier résultat pour inspecter le format, puis adapter le mapping de tri si nécessaire
- **`src/components/dashboard/ProductAnalysis.tsx`** — Aucun changement structurel

### Étape 1 : Vérification

Avant tout changement, je vais ajouter un log pour voir le format exact de `last_seen` retourné par la base. Ça permettra de choisir la bonne stratégie.

