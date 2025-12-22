# 📋 Changelog - Royaume du Nil

## Version 2.3 - 22 Décembre 2025

### 🐛 Corrections importantes

#### 🗺️ Outil de mesure
- **Problème** : La carte se déplaçait pendant le tracé
- **Solution** : Le dragging de la carte est désactivé pendant le mode mesure
- **Résultat** : Tracé précis sans déplacement accidentel de la carte

#### 🧹 Nettoyage des outils
- **Problème** : Les marqueurs ne s'effaçaient pas en désactivant les outils
- **Solution** : Désactiver un outil (✎ ou ⚘) supprime maintenant tous les marqueurs
- **Comportement** : 
  - Cliquer sur ✎ : supprime les marqueurs de coordonnées
  - Cliquer sur ⚘ : supprime les lignes de mesure
  - Échap : supprime tout et désactive le mode

#### 📸 Export PNG propre
- **Problème** : Les contrôles de zoom (+/-) apparaissaient sur l'image
- **Solution** : Masquage automatique des contrôles pendant la capture
- **Résultat** : Image propre sans boutons Leaflet

#### 💾 Système de versions amélioré
- **Problème** : Perte de l'historique lors de la première sauvegarde
- **Solution** : Sauvegarde automatique de la version précédente
- **Fonctionnement** :
  - Première publication → crée automatiquement une "Version précédente"
  - Badge 🤖 Auto pour les sauvegardes automatiques
  - Bordure en pointillés bleus pour les distinguer
  - Note explicative sur l'origine de la version

### 🎨 Améliorations visuelles (Panel Admin)

#### Badges et indicateurs
- **Badge 🤖 Auto** : Pour les sauvegardes automatiques
- **Bordure bleue pointillée** : Versions auto-sauvegardées
- **Note bleue** : Description de la sauvegarde automatique
- **Survol bleu** : Effet de glow bleu pour les versions auto

#### Affichage des versions
```
Version #1734901234567 🤖 Auto
└─ Version précédente (sauvegarde automatique)
   👤 Par: Système
   ⚔️ Unités: 0
   🔍 Zoom: 7
```

### 🔧 Détails techniques

#### Gestion du dragging
```javascript
// Désactivation pendant la mesure
map.dragging.disable();

// Réactivation après
map.dragging.enable();
```

#### Capture PNG sans contrôles
```javascript
// Masquer avant capture
zoomControl.style.display = 'none';
attributionControl.style.display = 'none';

// Réafficher après
zoomControl.style.display = '';
attributionControl.style.display = '';
```

#### Sauvegarde automatique de l'ancienne version
```javascript
if (versions.length === 0 && publishedMap) {
    // Créer version "avant"
    oldVersion = {
        id: Date.now() - 1000,
        isAutoSaved: true,
        note: 'Version précédente (sauvegarde automatique)'
    };
}
```

## Version 2.2 - 22 Décembre 2025

### 🎯 Améliorations UX des outils

#### 📏 Outil de mesure amélioré
- **Nouveau comportement** : Maintenez le clic pour tracer une ligne continue
- **Avant** : Clic par clic pour ajouter des points
- **Après** : Tracé fluide en maintenant le bouton enfoncé
- **Terminer** : Relâchez le clic pour terminer le tracé
- **Nouvelle mesure** : Cliquez sur ✎ pour réinitialiser

#### 📍 Outil de coordonnées amélioré
- **Nouveau comportement** : Un clic place un marqueur permanent avec popup
- **Avant** : Affichage temporaire au survol
- **Après** : Marqueur vert avec popup contenant les coordonnées
- **Avantages** : 
  - Plusieurs points de coordonnées visibles simultanément
  - Popup reste ouvert pour référence
  - Marqueurs verts discrets (10px)
- **Nettoyage** : Appuyez sur Échap pour supprimer tous les marqueurs

### 🔧 Améliorations techniques

- Ajout de la variable `isDrawing` pour gérer l'état de tracé
- Ajout du tableau `coordMarkers` pour gérer les marqueurs de coordonnées
- Fonction `resetCoordMarkers()` pour nettoyer les marqueurs
- Gestionnaires `mousedown`, `mousemove`, `mouseup` pour le tracé continu
- Style CSS pour les marqueurs de coordonnées personnalisés

## Version 2.1 - 22 Décembre 2025

### ✨ Nouvelles fonctionnalités

#### 🎖️ Menu des unités séparé
- **Unités militaires** : Menu dédié aux 8 unités militaires existantes
- **Unités civiles** : Nouveau menu prévu pour les futures unités civiles
- Menus indépendants avec boutons distincts en haut à droite de la carte

#### 📏 Outils de mesure (Éditeur)
- **Bouton ✎** (bas gauche) : Mesure de distance
  - Cliquez pour ajouter des points
  - Double-cliquez pour terminer
  - Affichage de la distance en kilomètres
  - Ligne en pointillés verts

#### 📍 Outil de coordonnées (Éditeur)
- **Bouton ⚘** (bas gauche) : Affichage des coordonnées
  - Cliquez ou survolez pour voir lat/lng
  - Affichage en temps réel
  - Précision à 5 décimales

### 🔧 Améliorations

#### Icônes d'unités
- **Avant** : 40x40 pixels (carrées)
- **Après** : 50x35 pixels (rectangulaires)
- Meilleure représentation visuelle des unités militaires

#### Indicateurs de chargement
- **Téléchargement PNG** : "⏳ Génération en cours..."
- **Téléchargement JSON** : "⏳ Génération..."
- **Publication** : "⏳ Publication en cours..."
- Boutons désactivés pendant le traitement
- Message de confirmation détaillé après publication

#### Nettoyage de l'interface
- ✅ Suppression de la légende de la carte
- ✅ Suppression du marqueur de gouvernement (Le Caire)
- ✅ Suppression du filtre "Symboles Gouvernementaux"
- Interface plus épurée et professionnelle

### 🐛 Corrections de bugs

1. **Téléchargement JSON bloquant**
   - Ajout d'un indicateur de chargement
   - Utilisation de setTimeout pour éviter le blocage de l'UI
   - Suppression des références à `gouvernementLayer` (obsolète)

2. **Carte publiée non mise à jour**
   - Correction de la structure de données JSON
   - Suppression des données obsolètes (marqueurs gouvernementaux)
   - Message explicite pour recharger la page "Carte Actuelle"

3. **Code mort supprimé**
   - Suppression de toutes les références à `govIcon`
   - Suppression de `gouvernementLayer`
   - Nettoyage des filtres obsolètes

### 📁 Fichiers modifiés

- `editor-script.js` : Ajout des outils, correction des bugs, indicateurs de chargement
- `editor-style.css` : Styles pour les nouveaux boutons et affichages
- `editeur.html` : Structure HTML pour les menus et outils
- `script.js` : Suppression du gouvernement et légende, icônes rectangulaires
- `carte.html` : Suppression du filtre gouvernement

### 🎯 Utilisation

#### Mesurer une distance
1. Cliquez sur le bouton **✎** en bas à gauche
2. Cliquez sur la carte pour placer des points
3. Double-cliquez pour terminer la mesure
4. La distance totale s'affiche en km

#### Afficher les coordonnées
1. Cliquez sur le bouton **⚘** en bas à gauche
2. Cliquez ou survolez la carte
3. Les coordonnées (lat/lng) s'affichent

#### Placer des unités militaires
1. Cliquez sur **☰ Unités militaires** en haut à droite
2. Sélectionnez une unité dans le menu
3. Cliquez sur la carte pour la placer
4. Glissez-déposez pour repositionner
5. Cliquez sur l'unité puis "🗑️ Supprimer" pour retirer

#### Publier la carte
1. Placez vos unités
2. Cliquez sur **📤 Publier la carte** (admin uniquement)
3. Confirmez la publication
4. Rechargez la page "Carte Actuelle" pour voir les modifications

---

## Version 2.0 - Précédente

### Fonctionnalités principales
- Système d'authentification Discord OAuth2
- Menu burger avec 8 unités militaires
- Export PNG/JSON
- Panel admin avec logs et versions
- URLs propres (sans .html)
