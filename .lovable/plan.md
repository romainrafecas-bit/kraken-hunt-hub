

## Diagnostic

La base externe a été nettoyée :
- `last_seen` est maintenant un **vrai timestamp** (ex: `"2026-03-27"`)
- `added_date` est aussi un **vrai timestamp**
- Le tri serveur `order=last_seen.desc` fonctionne nativement et renvoie bien les produits 2026 en tête

Mais le code front est resté coincé dans les workarounds :
1. `useProductsPaginated.ts` mappe encore `lastSeen → updated_at` et filtre les dates sur `updated_at`
2. `useProducts.ts` parse `last_seen` comme du texte `dd/mm/yyyy` via une regex stricte → **échoue** sur le format ISO `2026-03-27` → renvoie `"Inconnu"` partout, et `mapToProduct` peut filtrer/casser l'affichage
3. `useDashboardStats.ts` parse `added_date` avec la même regex `dd/mm/yyyy` → ne reconnaît plus les ISO

C'est probablement pour ça que tu ne vois plus de produits (ou des données incohérentes).

## Plan

### 1. `src/hooks/useProducts.ts`
- Remplacer `parseDate` pour gérer en priorité le format **ISO** (`YYYY-MM-DD` et `YYYY-MM-DDTHH:mm:ss...`), tout en gardant un fallback `dd/mm/yyyy` au cas où.
- `formatLastSeen` continue de retourner `dd/mm/yyyy` pour l'affichage.

### 2. `src/hooks/useProductsPaginated.ts`
- Remettre le mapping `sortKeyToColumn.lastSeen → "last_seen"` (vraie colonne timestamp).
- Filtres date (`24h`, `7d`, `30d`, `3m`, `6m`, `2026`) appliqués directement sur `last_seen` avec `.gte()` / `.lt()` ISO.
- Tri secondaire stable sur `last_seen desc` quand on trie par autre chose.
- Supprimer tout commentaire et toute logique qui parle de "text dd/mm/yyyy" / `updated_at` comme proxy.

### 3. `src/hooks/useDashboardStats.ts`
- Le parsing `added_date` doit accepter ISO en priorité (et garder le fallback `dd/mm/yyyy`).
- Le bloc "Dernières prises" trie déjà côté serveur — on le bascule sur `last_seen desc` pour rester cohérent avec la page Produits (au lieu de `updated_at`).

### 4. `src/components/dashboard/ProductAnalysis.tsx`
- Vérifier que le tri par défaut est bien `lastSeen desc` (déjà fait au tour précédent, juste s'assurer que rien ne le casse).
- Aucun changement structurel attendu.

### 5. Validation
- `/produits` : page 1 affiche les dates les plus récentes (mars 2026 en tête d'après le test API).
- Clic sur "Dernier vu" : ordre strictement décroissant.
- Filtre `2026` : ne garde que les produits vus en 2026.
- Dashboard "Dernières prises" : cohérent avec `/produits`.

### Détail technique

Le bug actuel vient quasi certainement du `parseDate` strict qui n'accepte que `dd/mm/yyyy` : sur les nouvelles valeurs ISO il renvoie `null`, ce qui peut casser l'affichage de `lastSeen` (et donc donner l'impression qu'il n'y a "plus de produits" ou que les lignes sont vides). Une fois le parser tolérant à l'ISO, tout le pipeline (affichage + tri serveur natif sur `last_seen`) redevient cohérent sans aucun workaround.

Fichiers modifiés :
- `src/hooks/useProducts.ts`
- `src/hooks/useProductsPaginated.ts`
- `src/hooks/useDashboardStats.ts`

