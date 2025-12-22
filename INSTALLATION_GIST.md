# 🚀 Guide d'installation GitHub Gist

## Vue d'ensemble

Ce système permet de **partager la carte** avec tous les visiteurs du site via GitHub Gist.

### Comment ça marche ?

```
┌──────────────┐      Publie       ┌──────────────┐
│   ADMIN      │ ───────────────▶  │  GitHub      │
│  (Éditeur)   │                    │  Gist        │
└──────────────┘                    └──────────────┘
                                           │
                                           │ Charge
                                           ▼
                                    ┌──────────────┐
                                    │  VISITEURS   │
                                    │  (Carte)     │
                                    └──────────────┘
```

---

## 📋 Étape 1 : Créer un token GitHub

### 1.1 Se connecter à GitHub
- Allez sur https://github.com et connectez-vous

### 1.2 Accéder aux paramètres
1. Cliquez sur votre avatar en haut à droite
2. Sélectionnez **Settings**
3. Dans le menu de gauche, tout en bas, cliquez sur **Developer settings**
4. Cliquez sur **Personal access tokens** → **Tokens (classic)**

### 1.3 Générer le token
1. Cliquez sur **Generate new token** → **Generate new token (classic)**
2. Remplissez :
   - **Note** : `Kingdom of Nile - Map Publisher`
   - **Expiration** : Choisissez `No expiration` ou `90 days` (vous devrez le renouveler)
3. **Permissions** : Cochez UNIQUEMENT `gist`
   ```
   ☑ gist
     Create gists
   ```
4. Cliquez sur **Generate token** en bas
5. **⚠️ IMPORTANT** : Copiez le token immédiatement
   - Format : `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Vous ne pourrez plus le voir après !**

---

## 📝 Étape 2 : Configurer le token

### 2.1 Ouvrir le fichier de configuration
Ouvrez le fichier `/Users/bejnamin/Desktop/Site_Test/gist-config.js`

### 2.2 Remplacer le token
Trouvez la ligne :
```javascript
githubToken: 'VOTRE_TOKEN_ICI',
```

Remplacez `VOTRE_TOKEN_ICI` par votre token :
```javascript
githubToken: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
```

### 2.3 Sauvegarder
Sauvegardez le fichier.

---

## ✅ Étape 3 : Tester

### 3.1 Publication (Admin)
1. Ouvrez l'éditeur : https://bellum17.github.io/kingdomofnile/editeur
2. Connectez-vous avec Discord
3. Placez quelques unités
4. Cliquez sur **📤 Publier la carte**
5. ✅ Vous devriez voir un message avec l'URL du Gist

### 3.2 Vérification
1. Ouvrez la carte publique : https://bellum17.github.io/kingdomofnile/carte
2. Rechargez la page (F5)
3. ✅ Vous devriez voir les unités que vous avez placées

### 3.3 Console du navigateur
Ouvrez la console (F12) pour voir les logs :
```
🔄 Chargement depuis GitHub Gist...
✅ Carte chargée depuis Gist
```

---

## 🔒 Sécurité

### ⚠️ IMPORTANT : Ne pas commiter le token

Le token donne accès à votre compte GitHub pour créer des Gists.

#### Si vous utilisez Git :

**Option 1** : Ajouter au `.gitignore`
```bash
# Dans votre fichier .gitignore
gist-config.js
```

**Option 2** : Créer un fichier séparé
1. Créez `gist-config.local.js` avec votre token
2. Ajoutez-le au `.gitignore`
3. Dans `gist-config.js`, utilisez :
```javascript
// Chargement du token depuis localStorage
const GIST_CONFIG = {
    githubToken: localStorage.getItem('github_token') || '',
    // ...
};
```

**Option 3** : Utiliser GitHub Secrets (pour GitHub Actions)
Si vous automatisez le déploiement, stockez le token dans les secrets du repo.

---

## 🔧 Dépannage

### Problème : "Token GitHub non configuré"
- ✅ Vérifiez que vous avez bien remplacé `VOTRE_TOKEN_ICI`
- ✅ Vérifiez que le token commence par `ghp_`
- ✅ Rechargez la page

### Problème : "Erreur GitHub API: Bad credentials"
- ❌ Le token est invalide ou expiré
- ✅ Créez un nouveau token
- ✅ Remplacez-le dans `gist-config.js`

### Problème : "Erreur GitHub API: Not Found"
- ❌ Le token n'a pas la permission `gist`
- ✅ Créez un nouveau token avec la bonne permission

### Problème : La carte ne se charge pas
1. Ouvrez la console (F12)
2. Regardez les messages :
   - ❌ `Erreur Gist` → Problème de connexion
   - ✅ `Carte chargée depuis localStorage` → Fallback activé

### Problème : "CORS error"
- ℹ️ Normal si vous testez en local (file://)
- ✅ Doit fonctionner sur GitHub Pages

---

## 📊 Fonctionnement avancé

### Première publication
1. Le système crée un nouveau Gist sur votre compte GitHub
2. Le `gistId` est sauvegardé automatiquement dans le localStorage
3. Les publications suivantes mettent à jour le même Gist

### Voir le Gist sur GitHub
Après publication, vous verrez l'URL dans le message :
```
🌐 Publié sur GitHub Gist
URL: https://gist.github.com/Bellum17/xxxxxxxxxxxx
```

Vous pouvez :
- ✅ Voir l'historique des modifications
- ✅ Télécharger le JSON
- ✅ Partager le lien

### Fallback automatique
Si le Gist n'est pas disponible :
1. ⚠️ Le système essaie de charger depuis le Gist
2. 🔄 Si échec, utilise le localStorage (local uniquement)
3. ✅ Le site continue de fonctionner

---

## 🎯 Commande rapide (après configuration)

```bash
# Ouvrir le fichier de configuration
code gist-config.js

# Rechercher
githubToken: 'VOTRE_TOKEN_ICI'

# Remplacer par votre token
githubToken: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

# Sauvegarder et tester !
```

---

## 📞 Support

### Vérifier la configuration
Dans la console du navigateur (F12), tapez :
```javascript
checkGistConfig()
```

Si tout est bon :
```
✅ Gist ID chargé: xxxxxxxxxxxx
true
```

Si problème :
```
⚠️ Token GitHub non configuré
false
```

### Logs utiles
```javascript
// Voir le Gist ID actuel
console.log(GIST_CONFIG.gistId);

// Voir l'URL publique
console.log(getGistPublicUrl());

// Forcer un rechargement depuis le Gist
loadFromGist().then(data => console.log(data));
```

---

## ✨ Avantages de cette solution

✅ **Gratuit** : GitHub Gist est gratuit
✅ **Fiable** : Infrastructure GitHub
✅ **Automatique** : Mise à jour en 1 clic
✅ **Historique** : Toutes les versions sont sauvegardées
✅ **Fallback** : Fonctionne même si Gist est indisponible
✅ **Simple** : Pas de serveur à gérer

---

## 🔄 Workflow complet

```
1. ADMIN configure le token (une fois)
   ↓
2. ADMIN place des unités dans l'éditeur
   ↓
3. ADMIN clique sur "Publier"
   ↓
4. Système → Sauvegarde sur GitHub Gist
   ↓
5. VISITEUR ouvre la carte
   ↓
6. Système → Charge depuis Gist
   ↓
7. VISITEUR voit les unités ! ✨
```

---

Bon déploiement ! 🚀
