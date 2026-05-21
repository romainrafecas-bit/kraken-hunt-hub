## Objectif

Permettre de sélectionner directement tous les produits correspondant au filtre actif — par exemple tout `Janvier 2025` — puis de les exporter en Excel, sans devoir d’abord cocher toute la page courante.

## Changement UX proposé

Dans la barre de filtres / zone de résultats de la page Produits :

1. Ajouter un bouton visible dès qu’un filtre retourne des résultats :
   - `Sélectionner les 347 produits filtrés`
   - si le filtre date est un mois : `Sélectionner tout Janvier 2025`

2. Le bouton sélectionnera toutes les lignes correspondant aux filtres actifs, toutes pages confondues :
   - mois sélectionné
   - catégorie
   - recherche
   - marques exclues
   - stock
   - prix
   - nombre de vendeurs

3. Pendant la sélection :
   - afficher un loader
   - désactiver le bouton
   - texte du type `Sélection en cours…`

4. Une fois la sélection terminée :
   - la toolbar actuelle affichera le nombre total sélectionné
   - le bouton `Exporter en Excel` fonctionnera avec toute la sélection

5. Conserver aussi le comportement existant :
   - la checkbox du tableau continue de sélectionner uniquement la page visible
   - le bandeau “sélectionner tous les produits correspondant au filtre” peut rester comme aide secondaire

## Détail technique

- Modifier uniquement `src/components/dashboard/ProductAnalysis.tsx`.
- Réutiliser la fonction déjà créée `selectAllMatching()` et `fetchAllMatchingUrls()`.
- Ajouter un label intelligent basé sur `selectedDatePreset` pour afficher le mois courant sélectionné.
- Afficher le bouton de sélection globale même quand aucun produit n’est encore coché.
- Garder le garde-fou existant de `5000` produits maximum.
- Ne pas toucher à la base de données ni aux règles d’accès.

## Résultat attendu

Quand l’utilisateur choisit `Janvier 2025`, il voit immédiatement une action claire pour sélectionner tous les produits de janvier 2025, puis peut cliquer sur `Exporter en Excel` sans parcourir les pages une par une.