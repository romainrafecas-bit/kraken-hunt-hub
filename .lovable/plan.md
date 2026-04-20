

## Amélioration validation mot de passe - création de compte

Remplacer le message "8 caractères minimum" par une validation complète avec indicateurs visuels en temps réel, et traduire les erreurs Supabase correspondantes.

## Ce que je vais faire

### 1. Validation client-side en temps réel
Ajouter sous le champ mot de passe une checklist visuelle avec 4 critères :
- 8 caractères minimum
- 1 lettre minimum
- 1 chiffre minimum  
- 1 caractère spécial minimum (`!@#$%^&*(),.?":{}|<>`)

Chaque critère passe au vert (icône check) quand rempli, reste gris (icône circle) sinon.

### 2. Traduction erreurs Supabase
Ajouter dans le mapping d'erreurs (lignes 56-66) :
- `Password must contain at least one letter` → "Le mot de passe doit contenir au moins une lettre"
- `Password must contain at least one number` → "Le mot de passe doit contenir au moins un chiffre"
- `Password must contain at least one special character` → "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)"

### 3. UI/UX
- Garder le style Krakken (Deep Abyssal) : texte muted-foreground, icônes Lucide
- Afficher la checklist uniquement en mode signup (pas login)
- Mise à jour en temps réel à chaque frappe dans le champ mot de passe

## Fichier concerné
- `src/pages/Auth.tsx` uniquement

