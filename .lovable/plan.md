

## Remplacement page Analytics → Calculateur de marge

Tu remplaces une page peu utile par un outil métier concret pour tes utilisateurs : un calculateur de marge marketplace inspiré de marketplace-mastery.com, accessible via la sidebar après "Abonnement".

## Ce que je vais faire

### 1. Récupérer le modèle de calcul
J'ouvre `https://marketplace-mastery.com/calculateur-marge-marketplace.html` pour relever exactement les champs, formules et marketplaces couverts (Cdiscount, Amazon, Fnac, Rakuten, ManoMano…). Je m'inspire du fonctionnement, pas du design — l'UI restera 100% Krakken (Deep Abyssal, glass-panel, Nunito).

### 2. Nouvelle page `/calculateur`
Création de `src/pages/Calculateur.tsx` avec :

**Bloc Entrées** (gauche, sticky) :
- Prix de vente TTC (€)
- Prix d'achat HT (€)
- TVA (20% par défaut, sélecteur 5,5 / 10 / 20)
- Marketplace (select : Cdiscount, Amazon, Fnac, Rakuten, ManoMano, Autre)
- Catégorie produit (select dynamique selon marketplace, impacte la commission)
- Frais de port facturés au client (€)
- Coût d'expédition réel (€)
- Coût d'emballage / picking (€)
- Frais publicitaires unitaires (€, optionnel)

**Bloc Résultats** (droite, live update) :
- CA HT
- Commission marketplace (€ + %)
- Frais fixes éventuels (selon MP)
- Coût total (achat + logistique + pub + commission)
- **Marge brute** (€ et %) — gros chiffre, code couleur (vert > 20%, ambre 10-20%, rouge < 10%)
- **Marge nette** après TVA reversée
- Coefficient multiplicateur
- Seuil de rentabilité (prix de vente min)

**Bloc bonus** :
- Bouton "Sauvegarder ce calcul" → enregistre dans table `margin_calculations` (lié au user)
- Bouton "Réinitialiser"
- Liste des 5 derniers calculs sauvegardés (sous le calculateur)

### 3. Données commissions marketplaces
Fichier `src/data/marketplaceFees.ts` avec table des taux par MP × catégorie. Source : grilles publiques 2025 (je récupère depuis le site cible + docs officielles si besoin). Exemple structure :
```ts
{ cdiscount: { high_tech: 0.12, maison: 0.15, mode: 0.16, ... }, amazon: {...} }
```

### 4. Routing & navigation
- `src/App.tsx` : route `<Route path="/calculateur" element={<Protected><Calculateur /></Protected>} />`, suppression de la route `/analytics`.
- `src/components/dashboard/KrakkenSidebar.tsx` : remplace l'entrée "Analytics" par "Calculateur" (icône `Calculator` de Lucide), positionnée sous "Abonnement".
- Suppression de `src/pages/Analytics.tsx`.

### 5. Persistance (optionnelle mais recommandée)
Nouvelle table `public.margin_calculations` :
- `id`, `user_id`, `label` (text, ex "iPhone 15 Cdiscount"), `inputs` (jsonb), `results` (jsonb), `created_at`
- RLS : user CRUD sur ses propres lignes uniquement.

Permet à l'utilisateur de retrouver ses simulations entre sessions, et plus tard d'exporter en CSV.

## Question avant de coder

**Sur la persistance des calculs**, tu veux :
- **A** : Calculateur "live" uniquement, pas de sauvegarde (plus simple, 0 backend, 30 min de dev).
- **B** : Avec sauvegarde + historique des calculs en base (recommandé, +20 min, vraie valeur produit).

Je pars sur **B** par défaut. Réponds A si tu préfères ne pas créer de table.

## Étapes d'exécution

1. Fetch `marketplace-mastery.com/calculateur-marge-marketplace.html` pour aligner formules et grille de commissions.
2. Migration SQL : table `margin_calculations` + RLS (si option B).
3. Créer `src/data/marketplaceFees.ts`.
4. Créer `src/pages/Calculateur.tsx` (formulaire réactif + résultats live + sauvegarde).
5. Hook `useMarginCalculations` (CRUD calculs) si option B.
6. Update `src/App.tsx` (route swap) et `KrakkenSidebar.tsx` (item nav).
7. Delete `src/pages/Analytics.tsx`.
8. Mémoire projet : ajouter feature `margin-calculator` dans `mem://features/`.

