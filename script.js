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
var unitsLayer = L.layerGroup();

// Définition des icônes d'unités
const unitIcons = {
    'infanterie-motorisee': L.icon({
        iconUrl: 'images/Infanterie motorisée.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }),
    'cavalerie': L.icon({
        iconUrl: 'images/Cavalerie.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }),
    'infanterie-legere': L.icon({
        iconUrl: 'images/Infanterie légère.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }),
    'garde-royale': L.icon({
        iconUrl: 'images/Garde Royale.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }),
    'genie': L.icon({
        iconUrl: 'images/Génie.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }),
    'cdfa': L.icon({
        iconUrl: 'images/CDFA.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }),
    'commandement': L.icon({
        iconUrl: 'images/Commandement.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    }),
    'reserve': L.icon({
        iconUrl: 'images/Réserve d\'hommes.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
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

// Charger la carte publiée si elle existe
const publishedMap = localStorage.getItem('published_map');
if (publishedMap) {
    try {
        const mapData = JSON.parse(publishedMap);
        
        // Restaurer la position de la carte
        if (mapData.center && mapData.zoom) {
            map.setView([mapData.center.lat, mapData.center.lng], mapData.zoom);
        }
        
        // Restaurer les marqueurs
        if (mapData.markers && mapData.markers.length > 0) {
            mapData.markers.forEach(function(markerData) {
                if (markerData.type === 'government') {
                    var marker = L.marker([markerData.latlng.lat, markerData.latlng.lng], {icon: govIcon});
                    if (markerData.popup) {
                        marker.bindPopup(markerData.popup);
                    }
                    gouvernementLayer.addLayer(marker);
                }
            });
        } else {
            // Fallback: marqueur par défaut au Caire
            var caireGov = L.marker([30.0444, 31.2357], {icon: govIcon});
            caireGov.bindPopup("<b>Le Caire</b><br>Capitale du Royaume du Nil<br><span style='color:#87CEEB'>● Gouvernement</span>");
            gouvernementLayer.addLayer(caireGov);
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
                        unitsLayer.addLayer(marker);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement de la carte publiée:', error);
        // Fallback: marqueur par défaut au Caire
        var caireGov = L.marker([30.0444, 31.2357], {icon: govIcon});
        caireGov.bindPopup("<b>Le Caire</b><br>Capitale du Royaume du Nil<br><span style='color:#87CEEB'>● Gouvernement</span>");
        gouvernementLayer.addLayer(caireGov);
    }
} else {
    // Placement par défaut au Caire si aucune carte publiée
    var caireGov = L.marker([30.0444, 31.2357], {icon: govIcon});
    caireGov.bindPopup("<b>Le Caire</b><br>Capitale du Royaume du Nil<br><span style='color:#87CEEB'>● Gouvernement</span>");
    gouvernementLayer.addLayer(caireGov);
}

// Ajouter les groupes à la carte par défaut
gouvernementLayer.addTo(map);
unitsLayer.addTo(map);


// --- 4. Légende de la carte ---
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Légende</h4>';
    div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background-color: #80e0ff;"></span> Symboles Gouvernementaux</div>';
    return div;
};

legend.addTo(map);


// --- 5. Filtres de la carte ---
const filterGouvernement = document.getElementById('filterGouvernement');

// Filtre pour les symboles gouvernementaux
filterGouvernement.addEventListener('change', function() {
    if (this.checked) {
        gouvernementLayer.addTo(map);
    } else {
        map.removeLayer(gouvernementLayer);
    }
});