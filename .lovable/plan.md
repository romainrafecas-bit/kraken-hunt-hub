

User veut:
1. Créer une route `/connexion` qui pointe vers la même page que `/auth` (alias) — pour partager l'URL à 2-3 testeurs sans toucher au bouton de la landing page.
2. Donner un accès spécial à `bouska1@outlook.fr` — probablement un accès gratuit (whitelisté + abonnement actif à vie, comme pour le owner).

Pour le #2, deux options:
- L'ajouter à `allowed_emails` (table whitelist systeme.io) → il pourra créer son compte, aura 14j d'essai puis devra payer.
- L'ajouter à `allowed_emails` ET lui donner un statut `active` à vie (lifetime, comme `romain.rafecas@gmail.com`).

Je pense que l'intent est "lifetime gratuit" puisque c'est un accès "spécial" pour tester sans limite. Mais à confirmer car ambigu.

Plan:

## Ce que je vais faire

### 1. Alias `/connexion` → page Auth
Dans `src/App.tsx`, ajouter une route supplémentaire :
```tsx
<Route path="/connexion" element={<Auth />} />
```
Même composant, deux chemins. Tu peux partager `https://kraken-hunt-hub.lovable.app/connexion` à tes testeurs. Le bouton de la landing reste inchangé.

### 2. Accès spécial pour `bouska1@outlook.fr`
Deux opérations SQL :
- **Whitelist** : insert dans `allowed_emails` pour qu'il puisse créer son compte (la signup vérifie cette table via `check-systemeio-access`).
- **Lifetime** : modifier la fonction `handle_new_user` pour traiter `bouska1@outlook.fr` comme owner (status `active`, période 100 ans, pas de fin d'essai). Comme il n'a pas encore de compte, ça s'appliquera automatiquement à son inscription.

Alternative si tu veux qu'il ait juste les 14 jours d'essai normaux : on l'ajoute uniquement à `allowed_emails` et on ne touche pas au trigger.

## Question

**Quel niveau d'accès pour `bouska1@outlook.fr` ?**
- **A** : Accès à vie gratuit (comme toi, jamais besoin de payer) — recommandé pour un testeur de confiance.
- **B** : Accès normal (14 jours gratuits, puis 9,90€/mois) — comme un élève standard.

Je pars sur **A** par défaut car tu parles d'un "accès spécial". Dis-moi si tu préfères B.

## Étapes d'exécution

1. Édit `src/App.tsx` : ajouter route `/connexion`.
2. Migration SQL : 
   - `INSERT INTO allowed_emails (email) VALUES ('bouska1@outlook.fr')` (via tool insert).
   - `CREATE OR REPLACE FUNCTION handle_new_user` avec liste d'owners élargie `('romain.rafecas@gmail.com', 'bouska1@outlook.fr')`.
3. Tu partages `/connexion` à tes testeurs, ils créent leur compte avec leur email whitelisté.

