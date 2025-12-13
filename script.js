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
const filterArmees = document.getElementById('filterArmees');

// Toggle du menu burger
if (burgerBtn && menuContent) {
    burgerBtn.addEventListener('click', function() {
        menuContent.classList.toggle('menu-hidden');
    });
}

// Filtre pour les symboles gouvernementaux
if (filterGouvernement) {
    filterGouvernement.addEventListener('change', function() {
        if (this.checked) {
            gouvernementLayer.addTo(map);
        } else {
            map.removeLayer(gouvernementLayer);
        }
    });
}


// --- 6. Système de placement d'unités militaires ---

// Groupe de calques pour les unités militaires
var armyLayer = L.layerGroup().addTo(map);
var placedUnits = [];

// État du mode placement
var placementMode = {
    active: false,
    unitType: null
};

// Définition des symboles d'unités (SVG NATO/APP-6 style)
const unitSymbols = {
    infantry: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><line x1="20" y1="10" x2="20" y2="30" stroke="#0f0" stroke-width="2"/><line x1="10" y1="20" x2="30" y2="20" stroke="#0f0" stroke-width="2"/></svg>',
    mechanized: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><line x1="20" y1="10" x2="20" y2="30" stroke="#0f0" stroke-width="2"/><line x1="10" y1="20" x2="30" y2="20" stroke="#0f0" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="none" stroke="#0f0" stroke-width="1.5"/></svg>',
    motorized: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><line x1="20" y1="10" x2="20" y2="30" stroke="#0f0" stroke-width="2"/><line x1="10" y1="20" x2="30" y2="20" stroke="#0f0" stroke-width="2"/><line x1="16" y1="16" x2="24" y2="24" stroke="#0f0" stroke-width="1.5"/></svg>',
    armor: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><ellipse cx="20" cy="20" rx="8" ry="8" fill="none" stroke="#0f0" stroke-width="2"/></svg>',
    recon: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><line x1="15" y1="15" x2="25" y2="25" stroke="#0f0" stroke-width="2"/><line x1="25" y1="15" x2="15" y2="25" stroke="#0f0" stroke-width="2"/></svg>',
    artillery: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="#0f0"/></svg>',
    antiair: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><circle cx="20" cy="20" r="3" fill="#0f0"/><path d="M 20 13 L 17 17 L 23 17 Z" fill="#0f0"/></svg>',
    missile: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><path d="M 20 12 L 20 28" stroke="#0f0" stroke-width="2"/><path d="M 16 16 L 20 12 L 24 16" fill="#0f0"/></svg>',
    helicopter: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><path d="M 12 14 L 28 14" stroke="#0f0" stroke-width="2"/><ellipse cx="20" cy="22" rx="6" ry="4" fill="none" stroke="#0f0" stroke-width="1.5"/></svg>',
    fighter: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><path d="M 20 14 L 20 26 M 14 20 L 26 20" stroke="#0f0" stroke-width="2"/></svg>',
    hq: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><text x="20" y="26" text-anchor="middle" fill="#0f0" font-size="14" font-weight="bold">HQ</text></svg>',
    supply: '<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" fill="rgba(0,255,0,0.2)" stroke="#0f0" stroke-width="2"/><rect x="16" y="16" width="8" height="8" fill="none" stroke="#0f0" stroke-width="1.5"/></svg>'
};

// Noms des unités pour les popups
const unitNames = {
    infantry: 'Infanterie',
    mechanized: 'Infanterie Mécanisée',
    motorized: 'Infanterie Motorisée',
    armor: 'Chars de Combat',
    recon: 'Reconnaissance',
    artillery: 'Artillerie',
    antiair: 'Défense Anti-Aérienne',
    missile: 'Unité de Missiles',
    helicopter: 'Hélicoptères',
    fighter: 'Aviation de Chasse',
    hq: 'Quartier Général',
    supply: 'Logistique'
};

// Sélection d'une unité
document.querySelectorAll('.unit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const unitType = this.getAttribute('data-unit');
        
        // Désactiver tous les boutons
        document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
        
        // Activer le mode placement
        if (placementMode.unitType === unitType && placementMode.active) {
            // Désactiver si on reclique sur la même unité
            placementMode.active = false;
            placementMode.unitType = null;
            document.body.classList.remove('placing-mode');
            document.getElementById('placementMode').querySelector('span').textContent = 'Sélection';
        } else {
            // Activer le nouveau mode
            placementMode.active = true;
            placementMode.unitType = unitType;
            this.classList.add('active');
            document.body.classList.add('placing-mode');
            document.getElementById('placementMode').querySelector('span').textContent = unitNames[unitType];
        }
    });
});

// Placement d'unité sur la carte
map.on('click', function(e) {
    if (placementMode.active && placementMode.unitType) {
        const unitType = placementMode.unitType;
        
        // Créer l'icône personnalisée
        const unitIcon = L.divIcon({
            html: unitSymbols[unitType],
            className: 'military-unit-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        // Créer le marqueur
        const marker = L.marker(e.latlng, {
            icon: unitIcon,
            draggable: true
        });
        
        // Ajouter popup
        marker.bindPopup(`
            <div style="text-align: center;">
                <b style="color: #0f0;">${unitNames[unitType]}</b><br>
                <small>Position: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}</small><br>
                <button onclick="removeUnit(${placedUnits.length})" style="margin-top: 10px; background: #f00; color: #fff; border: none; padding: 5px 10px; cursor: pointer;">Supprimer</button>
            </div>
        `);
        
        // Ajouter à la carte
        marker.addTo(armyLayer);
        placedUnits.push(marker);
        
        console.log(`Unité placée: ${unitNames[unitType]} à [${e.latlng.lat}, ${e.latlng.lng}]`);
    }
});

// Fonction pour supprimer une unité
window.removeUnit = function(index) {
    if (placedUnits[index]) {
        armyLayer.removeLayer(placedUnits[index]);
        placedUnits[index] = null;
    }
};

// Effacer toutes les unités
const clearUnitsBtn = document.getElementById('clearUnits');
if (clearUnitsBtn) {
    clearUnitsBtn.addEventListener('click', function() {
        if (confirm('Voulez-vous vraiment effacer toutes les unités ?')) {
            armyLayer.clearLayers();
            placedUnits = [];
            console.log('Toutes les unités ont été effacées');
        }
    });
}

// Filtre pour les unités militaires
if (filterArmees) {
    filterArmees.addEventListener('change', function() {
        if (this.checked) {
            armyLayer.addTo(map);
        } else {
            map.removeLayer(armyLayer);
        }
    });
}