

## Probleme

Supabase a une limite par defaut de **1000 lignes** par requete. Le `useProducts` fait un seul `select("*")` sans pagination, donc il ne recupere que 1000 produits sur 83K.

## Solution

On ne peut pas charger 83K produits en memoire dans le navigateur -- ca serait ~200MB de JSON et ferait planter l'app. Il faut une approche mixte :

### 1. Dashboard (Index.tsx) -- Stats aggregees cote serveur

Creer des requetes optimisees qui recuperent uniquement les stats necessaires sans charger tous les produits :

- **Nombre total de produits** : `select("url", { count: "exact", head: true })` -- renvoie juste le count sans data
- **Courbe cumulative** : requete groupee par `added_date` avec un count par jour (via une fonction SQL ou un fetch pagine des dates uniquement)
- **Categories** : `select("category")` avec pagination pour compter par categorie, ou une vue/fonction SQL
- **Dernieres prises** : garder le `select("*").order("last_seen", { ascending: false }).limit(10)` -- seulement les 10 derniers

### 2. Page Produits (ProductAnalysis) -- Pagination serveur

Remplacer le chargement complet par une pagination cote serveur :
- Utiliser `.range(from, to)` de Supabase (ex: `.range(0, 49)` pour les 50 premiers)
- Les filtres (categorie, marque, stock, date) sont appliques cote serveur via `.eq()`, `.ilike()`, `.gte()` etc.
- Le tri est aussi cote serveur via `.order()`
- Recuperer le `count: "exact"` pour afficher le nombre total et calculer les pages

### 3. Hook `useProducts` refactor

- Scinder en deux hooks : `useDashboardStats()` (stats legeres) et `useProductsPaginated()` (avec filtres/pagination serveur)
- Le hook pagine accepte les parametres de filtre et de page en arguments

### Fichiers concernes

- `src/hooks/useProducts.ts` -- refactor en deux hooks
- `src/hooks/useDashboardStats.ts` -- nouveau, stats aggregees
- `src/pages/Index.tsx` -- utiliser `useDashboardStats` au lieu de `useProducts`
- `src/components/dashboard/ProductAnalysis.tsx` -- pagination et filtres cote serveur

### Detail technique pour les stats

Pour la courbe cumulative et les comptages par categorie sur 83K lignes, la meilleure approche est de creer une **edge function** ou une **fonction SQL** qui retourne directement les aggregats. Sinon, on peut paginer les colonnes `added_date` et `category` uniquement (sans le reste des champs) en boucle cote client.

Option pragmatique : une requete SQL via une database function `get_dashboard_stats()` qui retourne les counts par date et par categorie en un seul appel.

