

## Forcer l'expiration du compte `2r.retailing@gmail.com`

Le compte est actuellement en `trialing` jusqu'au **05/05/2026**. Pour simuler un essai expiré et déclencher l'écran "Ton essai est terminé" + redirection forcée vers `/abonnement`, je vais reculer la date de fin d'essai dans le passé.

### Changement DB (1 migration)

Update sur la table `subscriptions` pour cet utilisateur :

```sql
UPDATE public.subscriptions
SET 
  trial_ends_at = now() - interval '1 day',
  status = 'trialing'  -- on garde trialing, mais expiré
WHERE user_id = '1638f05a-775e-47c4-af12-0dfdb82272e7';
```

### Ce qui va se passer côté UI

La fonction `has_active_access` (et le hook `useSubscription`) va retourner `hasAccess = false` car :
- `status = 'trialing'` ET `trial_ends_at < now()` → pas d'accès

Résultat à la prochaine reload :
- `ProtectedRoute` redirige automatiquement vers `/abonnement`
- La page affiche le bandeau rouge **"Accès suspendu — Ton essai gratuit de 14 jours est arrivé à expiration"**
- Le bouton retour vers `/profil` est masqué (puisque `hasAccess = false`)
- Seule la carte d'activation Pro reste visible avec CTA "Activer mon abonnement"

### Pour revenir en arrière plus tard

Il suffira de me dire "remets l'essai de 2r.retailing à 14 jours" et je relance un UPDATE inverse.

### Détails techniques
- **Fichier modifié** : aucun (uniquement DB)
- **Migration créée** : 1 (UPDATE conditionnel sur `user_id`)
- **Aucun impact** sur les autres comptes ni sur la logique applicative

