# 🎖️ Menu Burger - Unités Militaires

## ✅ Fonctionnalités implémentées

### 📱 Menu Burger
- **Bouton** : Situé en haut à gauche de l'éditeur avec icône "☰ Unités"
- **Panel latéral** : Glisse depuis la gauche, 350px de largeur
- **Scroll** : Menu défilable pour voir toutes les unités
- **Fermeture** : Bouton "✕" en haut à droite ou clic sur une unité

### 🎯 Catégories d'unités

#### 1️⃣ **Unités de Combat**
- ✅ Infanterie motorisée (`Infanterie motorisée.png`)
- ✅ Cavalerie (`Cavalerie.png`)
- ✅ Infanterie légère (`Infanterie légère.png`)
- ✅ Garde Royale (`Garde Royale.png`)

#### 2️⃣ **Unités de Soutien**
- ✅ Unité du Génie (`Génie.png`)

#### 3️⃣ **Unités de Commandement**
- ✅ Commandement des Forces Armées (`CDFA.png`)
- ✅ Commandement (`Commandement.png`)

#### 4️⃣ **Autres**
- ✅ Réserve d'hommes (`Réserve d'hommes.png`)

### 🎨 Design
- **Style Matrix** : Fond noir, bordures vertes (#0f0), effet glow
- **Icônes** : 40x40px avec effet drop-shadow vert
- **Hover** : Animation de translation + glow au survol
- **Sélection** : Background vert semi-transparent pour l'unité sélectionnée
- **Scrollbar** : Personnalisée avec couleurs vertes

### 🖱️ Placement des unités
1. **Sélection** : Cliquer sur une unité dans le menu
2. **Mode placement** : Le curseur devient une croix (crosshair)
3. **Placement** : Cliquer n'importe où sur la carte
4. **Déplaçable** : Les unités placées sont draggables (glisser-déposer)
5. **Suppression** : Bouton "🗑️ Supprimer" dans la popup de chaque unité

### 💾 Sauvegarde et export

#### **Export PNG** ✅
- Capture de la carte complète avec toutes les unités
- Utilise `html2canvas` avec scale 2x pour la qualité
- Nom du fichier : `carte-royaume-du-nil-YYYY-MM-DD.png`

#### **Export JSON** ✅
- Sauvegarde la position, zoom, marqueurs gouvernementaux **ET** unités
- Structure JSON :
```json
{
  "center": { "lat": 30.5, "lng": 31.2 },
  "zoom": 7,
  "markers": [...],
  "units": [
    {
      "latlng": { "lat": 30.0, "lng": 31.0 },
      "unitType": "infanterie-motorisee",
      "type": "unit"
    }
  ],
  "timestamp": "2025-12-21T..."
}
```

#### **Import JSON** ✅
- Restaure toutes les unités avec leurs icônes
- Repositionne correctement chaque unité
- Bouton de suppression fonctionnel sur les unités importées

#### **Publication** ✅ (Admin uniquement)
- Publie la carte avec **toutes les unités** sur la page publique
- Sauvegarde automatique d'une version
- Visible sur `/carte` par tous les utilisateurs
- Compteur d'unités dans l'alerte de confirmation

### 📊 Logs et versions
- **Logs** : Toutes les actions (download_json, load_json, publish_map) incluent le nombre d'unités
- **Versions** : Les versions sauvegardées incluent les données des unités
- **Restauration** : Possibilité de restaurer une ancienne carte avec ses unités

## 🗺️ Affichage sur la carte publique

La page `/carte` affiche maintenant :
- ✅ Marqueurs gouvernementaux
- ✅ **Toutes les unités militaires publiées**
- ✅ Icônes correctes pour chaque type d'unité
- ✅ Popups avec le nom de l'unité

## 🎮 Utilisation

### Pour placer une unité :
1. Ouvrir le menu burger (☰ Unités)
2. Scroller pour trouver l'unité souhaitée
3. Cliquer sur l'unité
4. Cliquer sur la carte à l'emplacement désiré
5. L'unité apparaît et peut être déplacée

### Pour supprimer une unité :
1. Cliquer sur l'unité sur la carte
2. Cliquer sur "🗑️ Supprimer" dans la popup

### Pour sauvegarder :
- **PNG** : Bouton "📥 Télécharger en PNG"
- **JSON** : Bouton "💾 Télécharger en JSON"

### Pour charger :
- **JSON** : Bouton "📂 Charger un JSON" → Sélectionner le fichier

### Pour publier (Admin) :
- Bouton "🚀 Publier sur la carte actuelle"
- Confirmation demandée
- Version automatiquement sauvegardée

## 📁 Fichiers modifiés

### HTML
- `editeur.html` : Ajout du bouton burger + menu latéral avec toutes les unités

### CSS
- `editor-style.css` : Styles complets pour le menu burger (~200 lignes)
  - `.burger-btn` : Bouton d'ouverture
  - `.unit-menu` : Panel latéral
  - `.unit-category` : Séparateurs de catégories
  - `.unit-item` : Cards d'unités cliquables
  - Scrollbar personnalisée

### JavaScript
- `editor-script.js` : Logique complète du menu + placement
  - Définition de 8 icônes d'unités (40x40px)
  - Gestion de la sélection et du placement
  - Export/Import JSON avec unités
  - Publication avec unités
  - Fonction `removeMarker()` globale

- `script.js` : Affichage des unités sur la carte publique
  - Définition des mêmes icônes
  - Chargement des unités depuis `published_map`
  - Layer `unitsLayer` ajouté à la carte

## 🎯 Statut final

✅ Menu burger fonctionnel  
✅ 8 types d'unités disponibles  
✅ 4 catégories organisées  
✅ Placement par clic  
✅ Déplacement drag & drop  
✅ Suppression individuelle  
✅ Export PNG avec unités  
✅ Export JSON avec unités  
✅ Import JSON avec unités  
✅ Publication admin avec unités  
✅ Affichage public des unités  
✅ Versions avec unités  
✅ Logs avec compteurs d'unités  

---

**Le système d'unités militaires est entièrement opérationnel ! 🎉**
