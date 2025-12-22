// --- 1. Initialisation de la carte ---

// Carte centrée sur la région 39 (Nord de l'Égypte - Delta du Nil)
// Définition des limites pour toute l'Égypte
var southWest = L.latLng(22.0, 25.0);  // Coin sud-ouest (frontière soudanaise)
var northEast = L.latLng(31.8, 35.0);  // Coin nord-est (Sinaï)
var bounds = L.latLngBounds(southWest, northEast);

// Initialisation de la carte avec restrictions
var map = L.map('maCarte', {
    center: [30.5, 31.2],
    zoom: 7,
    minZoom: 6,
    maxZoom: 14,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0  // Empêche de sortir des limites
}).setView([30.5, 31.2], 7);


// --- 2. Ajout du fond de carte (Tiles) ---
// Nous utilisons Wikimedia Maps
L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);


// --- 3. Icônes personnalisées ---

// Groupe de calques pour les unités
var unitsLayer = L.layerGroup();

// Définition des icônes d'unités (format rectangulaire)
const unitIcons = {
    'infanterie-motorisee': L.icon({
        iconUrl: 'images/Infanterie motorisee.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    }),
    'cavalerie': L.icon({
        iconUrl: 'images/Cavalerie.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    }),
    'infanterie-legere': L.icon({
        iconUrl: 'images/Infanterie legere.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    }),
    'garde-royale': L.icon({
        iconUrl: 'images/Garde Royale.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    }),
    'genie': L.icon({
        iconUrl: 'images/Genie.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    }),
    'cdfa': L.icon({
        iconUrl: 'images/CDFA.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    }),
    'commandement': L.icon({
        iconUrl: 'images/Commandement.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    }),
    'reserve': L.icon({
        iconUrl: 'images/Reserve.png',
        iconSize: [50, 35],
        iconAnchor: [25, 35],
        popupAnchor: [0, -35]
    })
};

const unitNames = {
    'infanterie-motorisee': 'Infanterie motorisée',
    'cavalerie': 'Cavalerie',
    'infanterie-legere': 'Infanterie légère',
    'garde-royale': 'Garde Royale',
    'genie': 'Unité du Génie',
    'cdfa': 'Commandement des Forces Armées',
    'commandement': 'Commandement',
    'reserve': 'Réserve d\'hommes'
};

// Catégories des unités (identique à editor-script.js)
const unitCategories = {
    'infanterie-motorisee': 'militaire',
    'cavalerie': 'militaire',
    'infanterie-legere': 'militaire',
    'garde-royale': 'militaire',
    'genie': 'militaire',
    'cdfa': 'militaire',
    'commandement': 'militaire',
    'reserve': 'civil'
};

// Charger la carte publiée si elle existe
async function loadPublishedMap() {
    let mapData = null;
    
    // Charger depuis l'API Vercel en priorité
    try {
        // Utiliser l'URL Vercel si configurée, sinon fallback local
        const apiUrl = (typeof VERCEL_CONFIG !== 'undefined' && VERCEL_CONFIG.apiUrl) 
            ? `${VERCEL_CONFIG.apiUrl}/api/load`
            : '/api/load';
        
        console.log('🔄 Chargement depuis:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.mapData) {
                mapData = result.mapData;
                console.log('✅ Carte chargée depuis API Vercel');
            }
        } else {
            console.warn('⚠️ API Vercel indisponible, tentative localStorage...');
        }
    } catch (error) {
        console.warn('⚠️ Erreur API Vercel, tentative localStorage...', error);
    }
    
    // Fallback sur localStorage si l'API ne répond pas
    if (!mapData) {
        const publishedMap = localStorage.getItem('published_map');
        if (publishedMap) {
            try {
                mapData = JSON.parse(publishedMap);
                console.log('✅ Carte chargée depuis localStorage');
            } catch (error) {
                console.error('❌ Erreur lors du chargement localStorage:', error);
            }
        }
    }
    
    // Charger la carte si des données sont disponibles
    if (mapData) {
        // Restaurer la position de la carte
        if (mapData.center && mapData.zoom) {
            map.setView([mapData.center.lat, mapData.center.lng], mapData.zoom);
        }
        
        // Restaurer les unités
        if (mapData.units && mapData.units.length > 0) {
            mapData.units.forEach(function(unitData) {
                if (unitData.type === 'unit' && unitData.unitType) {
                    const unitIcon = unitIcons[unitData.unitType];
                    const unitName = unitNames[unitData.unitType];
                    
                    if (unitIcon) {
                        var marker = L.marker([unitData.latlng.lat, unitData.latlng.lng], {icon: unitIcon});
                        marker.bindPopup(`<b>${unitName}</b>`);
                        marker.unitType = unitData.unitType; // Stocker le type pour le filtrage
                        unitsLayer.addLayer(marker);
                    }
                }
            });
        }
    }
}

// Ajouter les unités à la carte
unitsLayer.addTo(map);

// Charger la carte publiée
loadPublishedMap();

// ===== SYSTÈME DE FILTRES =====
const filtersToggleBtn = document.getElementById('filtersToggleBtn');
const filtersPanel = document.getElementById('filtersPanel');
const filterMilitaire = document.getElementById('filterMilitaire');
const filterCivil = document.getElementById('filterCivil');
const filterInfra = document.getElementById('filterInfra');

// Toggle du panneau de filtres
filtersToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filtersPanel.classList.toggle('hidden');
});

// Fermer le panneau en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!filtersPanel.classList.contains('hidden') && 
        !filtersPanel.contains(e.target) && 
        !filtersToggleBtn.contains(e.target)) {
        filtersPanel.classList.add('hidden');
    }
});

// Fonction pour appliquer les filtres
function applyFilters() {
    const showMilitaire = filterMilitaire.checked;
    const showCivil = filterCivil.checked;
    const showInfra = filterInfra.checked;
    
    unitsLayer.eachLayer((layer) => {
        if (layer.unitType) {
            const category = unitCategories[layer.unitType] || 'militaire';
            
            let shouldShow = false;
            if (category === 'militaire' && showMilitaire) shouldShow = true;
            if (category === 'civil' && showCivil) shouldShow = true;
            if (category === 'infra' && showInfra) shouldShow = true;
            
            if (shouldShow) {
                if (!map.hasLayer(layer)) {
                    map.addLayer(layer);
                }
            } else {
                if (map.hasLayer(layer)) {
                    map.removeLayer(layer);
                }
            }
        }
    });
}

// Événements de changement sur les checkboxes
filterMilitaire.addEventListener('change', applyFilters);
filterCivil.addEventListener('change', applyFilters);
filterInfra.addEventListener('change', applyFilters);
