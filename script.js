// --- 1. Initialisation de la carte ---
// Carte centrée sur la région 39 (Nord de l'Égypte - Delta du Nil)
// Définition des limites pour toute l'Égypte
var southWest = L.latLng(22.0, 25.0);  // Coin sud-ouest (frontière soudanaise)
var northEast = L.latLng(31.8, 35.0);  // Coin nord-est (Sinaï)
var bounds = L.latLngBounds(southWest, northEast);

// Initialisation de la carte avec restrictions
var map = L.map('maCarte', {
    center: [30.5, 31.2],
    zoom: 9,
    minZoom: 6,
    maxZoom: 14,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0  // Empêche de sortir des limites
}).setView([30.5, 31.2], 9);


// --- 2. Ajout du fond de carte (Tiles) ---
// Nous utilisons OpenStreetMap (gratuit)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// --- 3. Icônes personnalisées ---

// Icône de gouvernement (GOV)
var govIcon = L.icon({
    iconUrl: 'images/icon_gov_rdn.png',
    iconSize: [60, 50],        // Taille de l'icône (largeur x hauteur) - format rectangulaire
    iconAnchor: [30, 50],      // Point d'ancrage (centré en bas)
    popupAnchor: [0, -50]      // Position de la popup
});

// Groupe de calques pour les symboles gouvernementaux
var gouvernementLayer = L.layerGroup();

// Placement au Caire
var caireGov = L.marker([30.0444, 31.2357], {icon: govIcon});
caireGov.bindPopup("<b>Le Caire</b><br>Capitale du Royaume du Nil<br><span style='color:#87CEEB'>● Gouvernement</span>");
gouvernementLayer.addLayer(caireGov);

// Ajouter le groupe à la carte par défaut
gouvernementLayer.addTo(map);


// --- 4. Légende de la carte ---
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Légende</h4>';
    div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background-color: #80e0ff;"></span> Symboles Gouvernementaux</div>';
    return div;
};

legend.addTo(map);


// --- 5. Menu Burger et Filtres ---
const burgerBtn = document.getElementById('burgerBtn');
const menuContent = document.getElementById('menuContent');
const filterGouvernement = document.getElementById('filterGouvernement');

// Toggle du menu burger
burgerBtn.addEventListener('click', function() {
    menuContent.classList.toggle('menu-hidden');
});

// Filtre pour les symboles gouvernementaux
filterGouvernement.addEventListener('change', function() {
    if (this.checked) {
        gouvernementLayer.addTo(map);
    } else {
        map.removeLayer(gouvernementLayer);
    }
});


// --- 6. Unités Militaires ---
// Groupe de calques pour les unités militaires
const armyUnits = L.layerGroup().addTo(map);
let selectedSymbol = null;
let placementMode = false;

// Toggle des symboles militaires
function toggleArmySymbols() {
    const armyFilter = document.getElementById('armyFilter');
    if (armyFilter.checked) {
        map.addLayer(armyUnits);
    } else {
        map.removeLayer(armyUnits);
    }
}

// Sélectionner le symbole militaire
function selectSymbol(symbolType) {
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.symbol-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer le bouton sélectionné
    const selectedBtn = document.querySelector(`[data-symbol="${symbolType}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    selectedSymbol = symbolType;
    placementMode = true;
    
    // Afficher les informations de placement
    const placementInfo = document.getElementById('placementInfo');
    placementInfo.style.display = 'block';
    placementInfo.textContent = `Mode placement: ${getSymbolName(symbolType)} - Cliquez sur la carte`;
    
    // Changer le curseur
    map.getContainer().style.cursor = 'crosshair';
}

// Obtenir le nom du symbole
function getSymbolName(type) {
    const names = {
        'infantry': 'Infanterie',
        'armor': 'Blindés',
        'artillery': 'Artillerie',
        'airforce': 'Aviation',
        'navy': 'Marine',
        'special': 'Forces Spéciales',
        'hq': 'Quartier Général',
        'logistics': 'Logistique',
        'medical': 'Médical'
    };
    return names[type] || type;
}

// Obtenir l'icône du symbole
function getSymbolIcon(type) {
    const icons = {
        'infantry': '🪖',
        'armor': '🛡️',
        'artillery': '💣',
        'airforce': '✈️',
        'navy': '⚓',
        'special': '⭐',
        'hq': '🏛️',
        'logistics': '📦',
        'medical': '⚕️'
    };
    return icons[type] || '📍';
}

// Placer une unité au clic sur la carte
map.on('click', function(e) {
    if (placementMode && selectedSymbol) {
        const symbolIcon = getSymbolIcon(selectedSymbol);
        const symbolName = getSymbolName(selectedSymbol);
        
        // Créer une icône personnalisée
        const unitIcon = L.divIcon({
            className: 'military-unit-marker',
            html: `<div style="
                background: rgba(0, 255, 0, 0.2);
                border: 2px solid #00ff00;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
            ">${symbolIcon}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        // Créer le marqueur
        const marker = L.marker(e.latlng, { icon: unitIcon })
            .bindPopup(`
                <div style="text-align: center;">
                    <strong style="color: #00ff00;">${symbolName}</strong><br>
                    <small>Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}</small><br>
                    <button onclick="removeUnit(this)" style="
                        margin-top: 5px;
                        background: #ff0000;
                        color: white;
                        border: none;
                        padding: 5px 10px;
                        border-radius: 3px;
                        cursor: pointer;
                    ">Supprimer</button>
                </div>
            `);
        
        // Stocker la référence du marqueur pour suppression
        marker.unitId = Date.now();
        marker.addTo(armyUnits);
        
        // Réinitialiser le mode de placement
        placementMode = false;
        selectedSymbol = null;
        map.getContainer().style.cursor = '';
        
        // Masquer les informations de placement
        document.getElementById('placementInfo').style.display = 'none';
        
        // Retirer la classe active des boutons
        document.querySelectorAll('.symbol-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
});

// Fonction de suppression d'une unité
function removeUnit(button) {
    // Fermer tous les popups et trouver le marqueur à supprimer
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker && layer.getPopup() && layer.getPopup().isOpen()) {
            armyUnits.removeLayer(layer);
        }
    });
}