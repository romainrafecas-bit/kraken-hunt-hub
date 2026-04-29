## Nettoyer les colonnes vides de l'export Excel

**Constat (vérifié sur la base de production)** : sur un échantillon de 200 produits, deux colonnes de l'export n'ont jamais de donnée réelle :

- `rating` → 100 % à `0` (aucun produit avec note > 0)
- `review_count` → 100 % à `0` (aucun produit avec avis > 0)

Toutes les autres colonnes (`brand`, `category`, `price`, `sellers_count`, `in_stock`, `recurrences`, `last_seen`, `added_date`, `url`, `image_url`) sont remplies correctement.

### Modifications

**Fichier** : `src/components/dashboard/ProductAnalysis.tsx` — fonction `exportSelectedToExcel` (lignes ~242-282)

1. **Retirer du `select` Supabase** : `rating`, `review_count` (inutile de fetch).
2. **Retirer de `exportRows`** : les clés `"Note"` et `"Avis"`.
3. **Mettre à jour `ws["!cols"]`** : enlever les deux entrées de largeur correspondantes (passe de 14 à 12 colonnes).

### Colonnes finales de l'export

`Produit | Marque | Catégorie | Prix (€) | En stock | Vendeurs | Récurrences | Dernier vu | Ajouté le | URL produit | Image | Google Lens`

### Détails techniques

- Aucun changement de schéma, aucune migration.
- Si plus tard un scraper enrichit `rating`/`review_count`, il suffira de réajouter ces deux clés.
- Aucun impact sur l'affichage du tableau (les colonnes Note/Avis ne sont déjà pas affichées dans la UI principale, seules elles polluaient l'export).