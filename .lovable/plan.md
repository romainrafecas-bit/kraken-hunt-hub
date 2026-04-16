
Objectif: corriger le tri "Dernier vu" pour qu’il respecte réellement `last_seen` et non une date proxy.

1. Corriger la source du tri
- Dans `src/hooks/useProductsPaginated.ts`, remettre `sortKeyToColumn.lastSeen` sur `last_seen`.
- Supprimer le workaround actuel qui trie sur `added_date`, car c’est précisément ce qui mélange les dates affichées.

2. Nettoyer la logique basée sur une mauvaise hypothèse
- Le hook part encore du principe que les dates sont du texte (`like("%/2026")`, commentaire “text dd/mm/yyyy”).
- Remplacer cette logique par des filtres cohérents avec un vrai champ date/heure:
  - `2026` => bornes de début/fin d’année
  - `24h`, `7d`, `30d`, `3m`, `6m` => comparaison chronologique sur le champ attendu
- Vérifier que le filtre temporel utilisé pour la page Produits est bien aligné avec la colonne affichée à l’utilisateur.

3. Sécuriser l’affichage de la date
- Dans `src/hooks/useProducts.ts`, garder le format visuel `dd/mm/yyyy` mais fiabiliser le parsing/formatage pour éviter tout décalage de jour lié au timezone.
- Si `last_seen` contient une heure, conserver le tri sur le timestamp complet même si l’UI n’affiche que le jour.

4. Vérifier les endroits liés
- Contrôler `ProductAnalysis.tsx` pour s’assurer que le clic sur l’en-tête "Dernier vu" demande bien `sortKey = "lastSeen"` en desc par défaut.
- Vérifier qu’aucun autre écran Produits/Favoris ne repose encore sur `added_date` pour simuler `last_seen`.

5. Validation après implémentation
- Sur `/produits`, cliquer sur "Dernier vu" et confirmer que les premières lignes sont bien les plus récentes.
- Vérifier qu’on ne voit plus des inversions du type `01/02/2026` avant `03/02/2026`.
- Tester aussi la pagination pour confirmer que la page 1 contient bien les dernières dates globales.
- Revalider les presets de date pour s’assurer qu’ils filtrent la bonne période.

Fichiers à modifier
- `src/hooks/useProductsPaginated.ts`
- `src/hooks/useProducts.ts`

Détail technique
- Le bug visible vient du fait que l’interface affiche `last_seen`, mais le tri serveur utilise actuellement `added_date`.
- Donc l’ordre affiché et la valeur montrée ne parlent pas de la même chose, ce qui produit un classement incohérent.
- Même si `last_seen` contient aussi une heure, ce n’est pas un problème: le tri doit rester sur le timestamp complet, puis l’UI peut continuer à n’afficher que la date.
