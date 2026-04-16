
Objectif

Faire apparaître les vrais produits 2026 sur `/produits` et remettre un tri chronologique fiable sur `last_seen`, sans jamais le remplacer par `updated_at`.

Constat confirmé

- `/produits` ne lit pas le backend intégré du projet: la page lit encore une base externe via `externalSupabase`.
- Le backend intégré du projet est vide (`public.products` = 0 ligne), donc ce n’est pas lui qui alimente l’écran actuel.
- Le dashboard “Dernières prises” est lui aussi faux aujourd’hui: `useDashboardStats` prend `limit(200)` sans tri serveur puis trie localement sur `added_date`.
- `/produits` démarre trié par `price`, pas par `lastSeen`.

Plan

1. Vérifier la vraie source utilisée par `/produits`
- Inspecter la table `products` de la base externe réellement appelée par le front.
- Confirmer 3 choses: type réel de `last_seen`, existence de lignes en 2026, et résultat brut d’un tri descendant sur `last_seen`.

2. Corriger le tri selon le vrai type de `last_seen`
- Si `last_seen` est un vrai timestamp:
  - garder `last_seen` comme source unique de vérité
  - trier serveur sur `last_seen desc`
  - ajouter seulement un tri secondaire stable pour départager les égalités si besoin
  - réaligner tous les filtres de date sur `last_seen`
- Si `last_seen` est du texte ou un format mixte:
  - supprimer définitivement les contournements via `added_date` ou `updated_at`
  - créer une date canonique parsée côté backend
  - brancher `/produits` sur cette date canonique pour le tri et les filtres

3. Corriger `/produits`
- Mettre le tri par défaut sur `lastSeen desc` pour afficher directement les produits les plus récents.
- Conserver l’affichage en `dd/mm/yyyy`, mais fiabiliser le parsing pour éviter les séquences absurdes du type `31/03 -> 15/04 -> 04/10`.
- Garder `updated_at` totalement séparé de `last_seen`.

4. Corriger aussi le dashboard
- Remplacer la logique actuelle de “Dernières prises”, qui ne récupère pas réellement les derniers produits.
- Utiliser le même tri/date canonique que `/produits` pour que les deux écrans racontent la même chose.
- Uniformiser les liens produits sur le dashboard si nécessaire.

5. Validation
- Page 1 de `/produits` = produits 2026 en tête quand ils existent.
- Clic sur “Dernier vu” = ordre strictement décroissant.
- Les presets `24h / 7j / 30j / 3m / 6m / 2026` filtrent bien sur `last_seen`.
- Le bloc “Dernières prises” du dashboard est cohérent avec `/produits`.

Fichiers concernés

- `src/hooks/useProductsPaginated.ts`
- `src/hooks/useProducts.ts`
- `src/hooks/useDashboardStats.ts`
- `src/components/dashboard/ProductAnalysis.tsx`
- éventuellement la couche d’accès aux données si on retire `externalSupabase` ou si on ajoute une date canonique côté backend

Détail technique

Le problème n’est pas juste “un mauvais tri”. Il y a aujourd’hui:
- une base externe encore utilisée par le front,
- un backend intégré vide,
- et une logique dashboard qui ne demande même pas les dernières lignes au serveur.

Tant qu’on ne vérifie pas la base externe réellement lue par `/produits` et qu’on ne normalise pas `last_seen` si nécessaire, le front ne peut pas garantir un vrai ordre chronologique.
