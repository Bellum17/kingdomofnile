# Kingdom of the Nile 🏛️

Site de cartographie interactive pour le Royaume du Nil avec système d'édition et panel administratif.

## 🌐 URLs du Site

**Site en production** : `https://bellum17.github.io/kingdomofnile/`

### Pages disponibles :
- **Page d'accueil** : `/accueil`
- **Cartographie** : `/carte`
- **Éditeur de carte** : `/editeur`
- **Panel administratif** : `/panel` (accès restreint aux admins)

## 🔐 Authentification Discord

Le site utilise Discord OAuth2 pour l'authentification des utilisateurs.

### Configuration requise :
Vous devez ajouter ces URLs de redirection dans votre application Discord :
- `https://bellum17.github.io/kingdomofnile/accueil`
- `https://bellum17.github.io/kingdomofnile/carte`
- `https://bellum17.github.io/kingdomofnile/editeur`

Voir le fichier `DISCORD_OAUTH_GUIDE.md` pour les instructions complètes.

## 📋 Fonctionnalités

### Page d'accueil (`/accueil`)
- 3 boutons de navigation
- Connexion Discord en haut à droite
- Contrôle d'accès au panel administratif

### Cartographie (`/carte`)
- Visualisation de la carte publiée
- Options de filtrage
- Authentification Discord

### Éditeur de carte (`/editeur`)
- Édition interactive de la carte
- Export PNG et JSON
- Import JSON
- Publication sur la carte principale (admin uniquement)

### Panel administratif (`/panel`)
- Logs de connexion et d'actions
- Gestion des versions de carte
- Restauration de versions précédentes
- Accès restreint aux administrateurs

## 🎨 Thème

Design inspiré de Matrix avec :
- Couleurs : #0f0 (vert) sur fond noir #000
- Police : Courier New (monospace)
- Effets de glow et d'animation

## 🛠️ Technologies

- **Leaflet.js** : Cartographie interactive
- **html2canvas** : Export PNG
- **Discord OAuth2** : Authentification
- **LocalStorage** : Stockage client-side

## 👤 Admin

ID Discord admin configuré : `772821169664426025`

Pour ajouter d'autres admins, modifiez le tableau dans `admin-config.js`.

## 📦 Déploiement

Le site est hébergé sur GitHub Pages. Les URLs sans extension `.html` sont gérées par le fichier `.htaccess` et `_config.yml`.

---

© 2025 Royaume du Nil - Tous droits réservés
