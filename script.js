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


// --- 3.5. Délimitations des régions d'Égypte ---

// Style des frontières régionales
var regionStyle = {
    color: '#0f0',
    weight: 2,
    opacity: 0.6,
    fillOpacity: 0.05,
    fillColor: '#0f0'
};

// Région 39 - Basse-Égypte / Delta du Nil (petit triangle au nord entre mer et Caire)
var region39 = L.polygon([
    [31.50, 30.40],  // Nord-Ouest (Alexandrie côte)
    [31.40, 32.30],  // Nord-Est (Port-Saïd)
    [30.95, 31.65],  // Est
    [30.05, 31.30],  // Sud-Est (Le Caire)
    [30.40, 30.40]   // Sud-Ouest
], regionStyle).addTo(map);
region39.bindPopup("<b>Région 39</b><br>Basse-Égypte / Delta du Nil");

// Région 38 - Petite région à l'ouest du Delta (côte ouest)
var region38 = L.polygon([
    [31.65, 29.30],  // Nord (côte méditerranée)
    [31.50, 30.40],  // Est (frontière avec 39)
    [30.40, 30.40],  // Sud-Est
    [30.45, 29.20]   // Sud-Ouest
], regionStyle).addTo(map);
region38.bindPopup("<b>Région 38</b><br>Béheira");

// Région 42 - El Fayoum (petite zone au sud-ouest du Caire)
var region42 = L.polygon([
    [29.50, 30.65],  // Nord
    [30.05, 31.30],  // Nord-Est (Le Caire)
    [29.50, 31.05],  // Est
    [29.15, 30.75]   // Sud
], regionStyle).addTo(map);
region42.bindPopup("<b>Région 42</b><br>El Fayoum");

// Région 37 - Moyenne-Égypte (grande région centrale le long du Nil)
var region37 = L.polygon([
    [30.40, 30.40],  // Nord-Ouest
    [30.05, 31.30],  // Nord-Est (Le Caire)
    [29.50, 30.65],  // Centre (Fayoum nord)
    [29.15, 30.75],  // Sud-Ouest (Fayoum sud)
    [27.35, 30.95],  // Sud-Centre
    [27.15, 30.55],  // Sud
    [29.10, 29.45],  // Ouest milieu
    [30.45, 29.20]   // Nord-Ouest
], regionStyle).addTo(map);
region37.bindPopup("<b>Région 37</b><br>Moyenne-Égypte");

// Région 35 - Désert Oriental (entre le Nil et la Mer Rouge, bande centrale)
var region35 = L.polygon([
    [30.05, 31.30],  // Nord-Ouest (Le Caire)
    [30.95, 31.65],  // Nord
    [29.95, 32.55],  // Nord-Est (Suez)
    [28.55, 33.30],  // Est milieu
    [26.85, 33.20],  // Sud-Est
    [26.20, 32.75],  // Sud (Louxor)
    [27.15, 30.55],  // Sud-Ouest
    [27.35, 30.95],  // Ouest
    [29.15, 30.75],  // Nord-Ouest (Fayoum)
    [29.50, 31.05]   // Nord-Ouest bis
], regionStyle).addTo(map);
region35.bindPopup("<b>Région 35</b><br>Désert Oriental");

// Région 40 - Suez (petite zone du canal de Suez, entre 39, 35 et 41)
var region40 = L.polygon([
    [30.95, 31.65],  // Ouest
    [31.40, 32.30],  // Nord-Ouest (Port-Saïd)
    [30.90, 32.35],  // Nord (Ismaïlia)
    [29.95, 32.55]   // Sud (Suez ville)
], regionStyle).addTo(map);
region40.bindPopup("<b>Région 40</b><br>Suez");

// Région 41 - Nord Sinaï (triangle nord de la péninsule du Sinaï)
var region41 = L.polygon([
    [31.40, 32.30],  // Ouest (Port-Saïd)
    [31.10, 34.20],  // Nord-Est (frontière Gaza)
    [30.85, 34.05],  // Est
    [30.90, 32.35]   // Sud-Ouest (Ismaïlia)
], regionStyle).addTo(map);
region41.bindPopup("<b>Région 41</b><br>Nord Sinaï");

// Région 43 - Sud Sinaï (grande partie sud de la péninsule)
var region43 = L.polygon([
    [30.90, 32.35],  // Nord-Ouest (Ismaïlia)
    [30.85, 34.05],  // Nord
    [29.55, 34.90],  // Nord-Est (Taba)
    [28.05, 34.55],  // Est (Sharm)
    [27.95, 33.85],  // Sud-Est (pointe)
    [28.55, 33.30],  // Sud-Ouest
    [29.95, 32.55]   // Ouest (Suez)
], regionStyle).addTo(map);
region43.bindPopup("<b>Région 43</b><br>Sud Sinaï");

// Région 36 - Haute-Égypte (grande zone sud le long du Nil)
var region36 = L.polygon([
    [27.15, 30.55],  // Nord
    [26.20, 32.75],  // Nord-Est (Louxor)
    [25.75, 32.65],  // Est (Louxor centre)
    [24.10, 32.90],  // Sud-Est (Assouan)
    [24.05, 32.35],  // Sud (Assouan sud)
    [25.55, 31.55],  // Sud-Ouest
    [26.55, 30.25]   // Ouest
], regionStyle).addTo(map);
region36.bindPopup("<b>Région 36</b><br>Haute-Égypte");

// Région 44 - Mer Rouge (longue bande côtière le long de la Mer Rouge)
var region44 = L.polygon([
    [26.85, 33.20],  // Nord
    [28.55, 33.30],  // Nord-Est
    [27.95, 33.85],  // Est
    [28.05, 34.55],  // Est loin (Sharm)
    [25.55, 35.25],  // Sud-Est (Marsa Alam)
    [24.75, 35.05],  // Sud (frontière Soudan)
    [24.05, 32.35],  // Sud-Ouest (Assouan)
    [24.10, 32.90],  // Ouest
    [25.75, 32.65],  // Ouest milieu
    [26.20, 32.75]   // Ouest nord
], regionStyle).addTo(map);
region44.bindPopup("<b>Région 44</b><br>Mer Rouge");


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