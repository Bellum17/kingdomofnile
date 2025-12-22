# 🗺️ Royaume du Nil - Système de carte partagée

## 🎯 Résumé rapide

Votre site utilise maintenant **GitHub Gist** pour partager la carte avec tous les visiteurs.

### Ce qui a changé

**AVANT** :
- ❌ Carte visible uniquement sur votre navigateur
- ❌ Visiteurs ne voient rien

**MAINTENANT** :
- ✅ Vous publiez → Tout le monde voit
- ✅ Automatique via GitHub Gist
- ✅ Gratuit et fiable

---

## ⚡ Configuration rapide (5 minutes)

### 1. Créer un token GitHub
1. Allez sur https://github.com/settings/tokens
2. "Generate new token (classic)"
3. Cochez uniquement `gist`
4. Copiez le token (commence par `ghp_`)

### 2. Configurer le site
1. Ouvrez `gist-config.js`
2. Remplacez `VOTRE_TOKEN_ICI` par votre token
3. Sauvegardez

### 3. Tester
1. Éditeur → Placez des unités → Publiez
2. Carte publique → Rechargez → Vous voyez les unités ✨

---

## 📚 Documentation complète

Voir [INSTALLATION_GIST.md](INSTALLATION_GIST.md) pour :
- Guide détaillé étape par étape
- Dépannage
- Sécurité
- Fonctionnement technique

---

## 🔒 Sécurité

⚠️ **IMPORTANT** : Ne commitez JAMAIS `gist-config.js` avec votre vrai token sur GitHub !

Le fichier est déjà dans `.gitignore` pour vous protéger.

---

## 🆘 Problème ?

### La carte ne se partage pas ?
1. Vérifiez le token dans `gist-config.js`
2. Ouvrez la console (F12) et regardez les erreurs
3. Consultez [INSTALLATION_GIST.md](INSTALLATION_GIST.md)

### Erreur "Token non configuré" ?
- Vous n'avez pas encore configuré le token
- Le site fonctionne quand même en mode local

---

## 🎮 Comment l'utiliser

### En tant qu'admin :
1. Ouvrez l'**Éditeur**
2. Connectez-vous avec Discord
3. Placez des unités militaires
4. Cliquez sur **📤 Publier la carte**
5. ✅ Message de confirmation avec URL du Gist

### En tant que visiteur :
1. Ouvrez la **Carte Actuelle**
2. Vous voyez automatiquement les dernières unités publiées
3. Pas besoin de compte Discord

---

## 📁 Fichiers ajoutés

- `gist-config.js` - Configuration du token GitHub
- `INSTALLATION_GIST.md` - Guide complet
- `.gitignore` - Protection du token

---

## 🚀 Prêt !

Une fois configuré, le système fonctionne automatiquement. Vous publiez, tout le monde voit. Simple ! 

**Bon jeu ! 🎉**
