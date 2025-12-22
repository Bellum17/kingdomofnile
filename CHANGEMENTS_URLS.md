# 🎯 Nouvelles URLs du Site - Kingdom of the Nile

## ✅ Changements effectués

### 1. Fichiers renommés
- `index.html` → `accueil.html`
- `map.html` → `carte.html`
- `editor.html` → `editeur.html`
- `admin-panel.html` → `panel.html`

### 2. URLs propres (sans .html)
- ✨ **Page d'accueil** : `https://bellum17.github.io/kingdomofnile/accueil`
- 🗺️ **Cartographie** : `https://bellum17.github.io/kingdomofnile/carte`
- ✏️ **Éditeur** : `https://bellum17.github.io/kingdomofnile/editeur`
- ⚙️ **Panel admin** : `https://bellum17.github.io/kingdomofnile/panel`

### 3. Liens internes mis à jour
Tous les liens `href` dans les fichiers HTML ont été modifiés pour pointer vers les nouvelles URLs sans extension.

### 4. URLs de redirection Discord mises à jour

**Dans les fichiers JavaScript :**
- `accueil.html` → redirect vers `/accueil`
- `editor-script.js` → redirect vers `/editeur`
- `map-auth.js` → redirect vers `/carte`

### 5. Fichiers de configuration créés

**`.htaccess`**
```apache
# Permet l'accès aux pages sans .html
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^\.]+)$ $1.html [NC,L]
```

**`_config.yml`** (pour GitHub Pages)
```yaml
permalink: pretty
```

### 6. Documentation mise à jour
- ✅ `DISCORD_OAUTH_GUIDE.md` avec les nouvelles URLs
- ✅ `README.md` créé avec toutes les informations du site

## 🔐 ACTION REQUISE : Discord Developer Portal

Vous devez **impérativement** mettre à jour les URLs de redirection dans votre application Discord :

1. Allez sur https://discord.com/developers/applications
2. Sélectionnez votre application (Client ID: `1452413073326346321`)
3. OAuth2 → General → Redirects
4. **Remplacez les anciennes URLs par :**
   - `https://bellum17.github.io/kingdomofnile/accueil`
   - `https://bellum17.github.io/kingdomofnile/carte`
   - `https://bellum17.github.io/kingdomofnile/editeur`
5. Cliquez sur "Save Changes"

⚠️ **Important** : Sans cette modification, la connexion Discord ne fonctionnera pas !

## 🚀 Déploiement

Une fois les fichiers poussés sur GitHub :

```bash
git add .
git commit -m "feat: URLs propres sans .html + fichiers renommés"
git push origin main
```

Le site sera accessible aux URLs suivantes :
- 🏠 Accueil : `bellum17.github.io/kingdomofnile/accueil`
- 🗺️ Carte : `bellum17.github.io/kingdomofnile/carte`
- ✏️ Éditeur : `bellum17.github.io/kingdomofnile/editeur`

## ✨ Avantages

✅ URLs beaucoup plus professionnelles  
✅ Pas de `.html` visible  
✅ Meilleur SEO  
✅ Plus facile à mémoriser  
✅ Apparence moderne et propre

---

**Note** : Le panel admin (`/panel`) n'a pas besoin de redirection Discord car l'accès nécessite déjà d'être connecté via une autre page.
