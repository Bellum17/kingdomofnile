# Guide de Configuration Discord OAuth2 et Panel Admin

## Étape 1: Créer une application Discord

1. Allez sur https://discord.com/developers/applications
2. Cliquez sur "New Application"
3. Donnez un nom à votre application (ex: "Royaume du Nil")
4. Acceptez les conditions et cliquez sur "Create"

## Étape 2: Configurer OAuth2

1. Dans le menu de gauche, cliquez sur "OAuth2"
2. Cliquez sur "General" (ou OAuth2)
3. Dans la section "Redirects", ajoutez vos URLs de redirection:
   - Pour le développement local:
     - `http://localhost:8000/accueil`
     - `http://localhost:8000/carte`
     - `http://localhost:8000/editeur`
   - Pour votre site en production:
     - `https://bellum17.github.io/kingdomofnile/accueil`
     - `https://bellum17.github.io/kingdomofnile/carte`
     - `https://bellum17.github.io/kingdomofnile/editeur`
   
4. Cliquez sur "Save Changes"

## Étape 3: Configuration déjà effectuée ✅

Le Client ID est déjà configuré dans le code:
- Client ID: `1452413073326346321`
- URLs de redirection configurées pour:
  - **Page d'accueil**: `https://bellum17.github.io/kingdomofnile/accueil`
  - **Cartographie**: `https://bellum17.github.io/kingdomofnile/carte`
  - **Éditeur**: `https://bellum17.github.io/kingdomofnile/editeur`

## Étape 4: **IMPORTANT** - Configurer les IDs des administrateurs

Dans le fichier `admin-config.js`, ligne 5, vous devez ajouter les IDs Discord des utilisateurs autorisés à être administrateurs:

```javascript
adminIds: [
    'VOTRE_ID_DISCORD_ICI', // Remplacez par votre vrai ID Discord
    // Ajoutez d'autres IDs ici
],
```

### Comment obtenir votre ID Discord:

1. Ouvrez Discord
2. Allez dans **Paramètres utilisateur** (⚙️)
3. Allez dans **Avancé**
4. Activez le **Mode développeur**
5. Fermez les paramètres
6. Clic droit sur votre nom d'utilisateur → **Copier l'identifiant**
7. Collez cet ID dans le fichier `admin-config.js`

## Fonctionnalités du système:

### Pour tous les utilisateurs connectés:
- ✅ Téléchargement de la carte en PNG
- ✅ Téléchargement de la carte en JSON
- ✅ Chargement d'une carte depuis un JSON

### Pour les administrateurs uniquement:
- 🔐 Accès au **Panel Gouvernemental**
- 🚀 Bouton **"Publier sur la carte actuelle"** (actualise la carte publique)
- 📊 Visualisation de tous les logs de connexion
- 🗺️ Gestion des versions sauvegardées
- ♻️ Restauration d'anciennes versions
- 🗑️ Suppression des logs
- 💾 Export des logs et versions

### Panel Gouvernemental:
Le panel affiche:
- **Logs de connexion**: Toutes les actions des utilisateurs (connexion, déconnexion, téléchargements, publications)
- **Versions sauvegardées**: Historique de toutes les versions publiées avec possibilité de restauration
- **Actions d'administration**: Effacer logs, exporter données

### Sécurité:
Si un utilisateur non-admin tente d'accéder au Panel Gouvernemental, il verra le message:
> "Vous n'êtes pas autorisés à accéder au Panel du gouvernement nilien."

Et sera automatiquement redirigé vers l'éditeur.

## Structure des fichiers:

```
Site_Test/
├── admin-config.js          # Configuration des admins
├── admin-panel.html         # Page du panel admin
├── admin-panel-style.css    # Styles du panel
├── admin-panel-script.js    # Logic du panel
├── editor.html              # Éditeur de carte
├── editor-style.css         # Styles éditeur
├── editor-script.js         # Logic éditeur + OAuth
└── ...
```

## Pour aller plus loin:

### Ajouter plusieurs administrateurs:
```javascript
adminIds: [
    '123456789012345678', // Admin 1
    '987654321098765432', // Admin 2
    '555666777888999000', // Admin 3
],
```

### Système de logs:
Toutes les actions sont enregistrées:
- `login` - Connexion
- `logout` - Déconnexion
- `download_png` - Téléchargement PNG
- `download_json` - Téléchargement JSON
- `load_json` - Chargement JSON
- `publish_map` - Publication carte
- `restore_version` - Restauration version
- `clear_logs` - Effacement logs
- `export_logs` - Export logs
- `export_versions` - Export versions
