// --- 1. Initialisation de la carte ---
// Carte centrée sur la région 39 (Nord de l'Égypte - Delta du Nil)
// Définition des limites strictes de la région 39
var southWest = L.latLng(29.5, 29.5);  // Coin sud-ouest
var northEast = L.latLng(31.8, 33.0);  // Coin nord-est
var bounds = L.latLngBounds(southWest, northEast);

// Initialisation de la carte avec restrictions
var map = L.map('maCarte', {
    center: [30.5, 31.2],
    zoom: 9,
    minZoom: 8,
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

// Placement au Caire
var caireGov = L.marker([30.0444, 31.2357], {icon: govIcon}).addTo(map);
caireGov.bindPopup("<b>Le Caire</b><br>Capitale du Royaume du Nil<br><span style='color:#87CEEB'>● Gouvernement</span>");


// --- 4. Légende de la carte ---
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Légende</h4>';
    div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background-color: #87CEEB;"></span> Gouvernement</div>';
    return div;
};

legend.addTo(map);