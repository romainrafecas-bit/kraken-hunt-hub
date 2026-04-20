---
name: Margin Calculator
description: Page /calculateur — outil de calcul de marge marketplace, remplace Analytics. Live + historique sauvegardé en base.
type: feature
---

Le calculateur de marge (`/calculateur`) remplace l'ancienne page Analytics jugée inutile.

**Fonctionnement** : inspiré de marketplace-mastery.com/calculateur-marge-marketplace.html. UI 100% Krakken (glass-panel, Nunito, palette Deep Abyssal).

**Entrées** : marketplace (Cdiscount, Amazon, Fnac, Rakuten, ManoMano, Rue du Commerce, Vinted Pro, Autre), catégorie (taux de commission dynamique), TVA (0/5,5/10/20%), prix vente TTC, prix achat HT, frais de port (facturés + réels), emballage, pub.

**Sorties** (live) : CA TTC/HT, TVA, commission MP (€ + %), coût total, marge brute (gros chiffre, code couleur vert ≥20% / ambre 10-20% / rouge <10%), marge nette HT, coefficient, seuil de rentabilité.

**Persistance** : table `margin_calculations` (user_id, label, inputs jsonb, results jsonb) avec RLS user-scoped. Hook `useMarginCalculations` (CRUD). Historique des 5 derniers calculs sous le calculateur, clic = recharge dans le formulaire.

**Données** : `src/data/marketplaceFees.ts` contient la grille commissions × catégories (taux indicatifs 2025).

**Sidebar** : item "Calculateur" (icône `Calculator` Lucide), positionné sous "Abonnement". Route `/analytics` redirige vers `/calculateur`.
