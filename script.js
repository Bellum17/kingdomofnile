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


// --- 6. Système de placement d'unités militaires ---
let militaryUnits = L.layerGroup().addTo(map);
let selectedUnit = null;
let isPlacementMode = false;

// Configuration des symboles militaires
const unitConfig = {
    infantry: { symbol: '⬛', color: '#0f0', name: 'Infanterie' },
    armor: { symbol: '⬜', color: '#0ff', name: 'Blindés' },
    artillery: { symbol: '●', color: '#f90', name: 'Artillerie' },
    recon: { symbol: '◆', color: '#ff0', name: 'Reconnaissance' },
    aviation: { symbol: '✈', color: '#00f', name: 'Aviation' },
    logistics: { symbol: '▲', color: '#f0f', name: 'Logistique' },
    command: { symbol: '★', color: '#ff0', name: 'Commandement' },
    navy: { symbol: '⚓', color: '#0af', name: 'Marine' }
};

// Sélection d'une unité
const unitButtons = document.querySelectorAll('.unit-btn');
const placementStatus = document.getElementById('placementStatus');

unitButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const unitType = this.getAttribute('data-unit');
        
        // Retirer la classe active de tous les boutons
        unitButtons.forEach(b => b.classList.remove('active'));
        
        if (selectedUnit === unitType && isPlacementMode) {
            // Désélectionner si on clique deux fois
            selectedUnit = null;
            isPlacementMode = false;
            placementStatus.textContent = 'Sélectionnez une unité puis cliquez sur la carte';
            map.getContainer().style.cursor = '';
        } else {
            // Sélectionner une nouvelle unité
            selectedUnit = unitType;
            isPlacementMode = true;
            this.classList.add('active');
            placementStatus.textContent = `Mode placement: ${unitConfig[unitType].name} - Cliquez sur la carte`;
            map.getContainer().style.cursor = 'crosshair';
        }
    });
});

// Placement sur la carte
map.on('click', function(e) {
    if (isPlacementMode && selectedUnit) {
        placeUnit(e.latlng, selectedUnit);
    }
});

// Fonction pour placer une unité
function placeUnit(latlng, unitType) {
    const config = unitConfig[unitType];
    
    // Créer une icône HTML personnalisée
    const unitIcon = L.divIcon({
        className: 'military-unit-marker',
        html: `<div style="
            background-color: rgba(0, 0, 0, 0.8);
            border: 3px solid ${config.color};
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            box-shadow: 0 0 15px ${config.color};
            cursor: pointer;
        ">${config.symbol}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    // Créer le marqueur
    const marker = L.marker(latlng, {
        icon: unitIcon,
        draggable: true
    });
    
    // Ajouter une popup
    marker.bindPopup(`
        <div style="text-align: center;">
            <b style="color: #0f0;">${config.name}</b><br>
            <span style="font-size: 32px;">${config.symbol}</span><br>
            <button onclick="removeUnit(this)" style="
                background: #f00;
                color: #fff;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                margin-top: 10px;
            ">Supprimer</button>
        </div>
    `);
    
    // Ajouter au groupe
    militaryUnits.addLayer(marker);
    
    // Stocker l'ID du marqueur pour suppression
    marker._unitId = Date.now();
}

// Fonction globale pour supprimer une unité (appelée depuis la popup)
window.removeUnit = function(button) {
    // Fermer toutes les popups et retirer le marqueur parent
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker && layer.getPopup() && layer.getPopup().isOpen()) {
            militaryUnits.removeLayer(layer);
        }
    });
};

// Bouton pour effacer toutes les unités
document.getElementById('clearUnits').addEventListener('click', function() {
    if (confirm('Voulez-vous vraiment supprimer toutes les unités ?')) {
        militaryUnits.clearLayers();
        placementStatus.textContent = 'Toutes les unités ont été supprimées';
        setTimeout(() => {
            placementStatus.textContent = 'Sélectionnez une unité puis cliquez sur la carte';
        }, 2000);
    }
});

// Bouton pour annuler le placement
document.getElementById('cancelPlacement').addEventListener('click', function() {
    selectedUnit = null;
    isPlacementMode = false;
    unitButtons.forEach(b => b.classList.remove('active'));
    placementStatus.textContent = 'Placement annulé';
    map.getContainer().style.cursor = '';
    setTimeout(() => {
        placementStatus.textContent = 'Sélectionnez une unité puis cliquez sur la carte';
    }, 1500);
});