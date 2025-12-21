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