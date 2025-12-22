// --- 1. Initialisation de la carte (identique à script.js) ---
var southWest = L.latLng(22.0, 25.0);
var northEast = L.latLng(31.8, 35.0);
var bounds = L.latLngBounds(southWest, northEast);

var map = L.map('maCarte', {
    center: [30.5, 31.2],
    zoom: 7,
    minZoom: 6,
    maxZoom: 14,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
}).setView([30.5, 31.2], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// --- 2. Authentification Discord OAuth2 ---

// CONFIGURATION DISCORD OAUTH
const DISCORD_CLIENT_ID = '1452413073326346321';
const DISCORD_REDIRECT_URI = 'https://bellum17.github.io/kingdomofnile/editeur';
const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=token&scope=identify`;
// Éléments DOM
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const publishBtn = document.getElementById('publishMap');
const publishInfo = document.getElementById('publishInfo');
const downloadPngBtn = document.getElementById('downloadPng');
const downloadJsonBtn = document.getElementById('downloadJson');
const loadJsonInput = document.getElementById('loadJson');

// Éléments du menu burger
const burgerBtn = document.getElementById('burgerBtn');
const unitMenu = document.getElementById('unitMenu');
const closeMenuBtn = document.getElementById('closeMenu');
const unitTabs = document.querySelectorAll('.unit-tab');
const tabContents = document.querySelectorAll('.tab-content');
const unitItems = document.querySelectorAll('.unit-item');

// Éléments des outils
const measureBtn = document.getElementById('measureBtn');
const coordBtn = document.getElementById('coordBtn');

// Variables pour le placement des unités
let selectedUnit = null;
let placementMode = false;
let unitsLayer = L.layerGroup().addTo(map);

// Variables pour les outils
let measureMode = false;
let coordMode = false;
let measurePoints = [];
let measureLine = null;
let measureMarkers = [];
let isDrawing = false;
let coordMarkers = [];

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

// Noms des unités pour les popups
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

// Fonction pour fermer tous les menus
function closeAllMenus() {
    unitMenu.classList.add('hidden');
}

// Ouvrir/Fermer le menu burger unique
burgerBtn.addEventListener('click', () => {
    unitMenu.classList.toggle('hidden');
});

closeMenuBtn.addEventListener('click', () => {
    unitMenu.classList.add('hidden');
});

// Gestion des onglets
unitTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Retirer l'état actif de tous les onglets et contenus
        unitTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        // Activer l'onglet et le contenu sélectionnés
        tab.classList.add('active');
        document.querySelector(`[data-content="${targetTab}"]`).classList.add('active');
    });
});

// Fermer le menu en cliquant en dehors
document.addEventListener('click', (e) => {
    if (!unitMenu.classList.contains('hidden') && 
        !unitMenu.contains(e.target) && 
        !burgerBtn.contains(e.target)) {
        unitMenu.classList.add('hidden');
    }
});

// Sélection d'une unité
unitItems.forEach(item => {
    item.addEventListener('click', () => {
        // Retirer la sélection précédente
        unitItems.forEach(i => i.classList.remove('selected'));
        
        // Sélectionner l'unité
        item.classList.add('selected');
        selectedUnit = item.dataset.unit;
        placementMode = true;
        
        // Désactiver les autres modes
        measureMode = false;
        coordMode = false;
        measureBtn.classList.remove('active');
        coordBtn.classList.remove('active');
        
        // Changer le curseur de la carte
        document.getElementById('maCarte').style.cursor = 'crosshair';
        
        // Fermer le menu
        closeAllMenus();
    });
});

// Stockage global des marqueurs pour suppression
let markerIdCounter = 0;
const markersMap = new Map();

// Annuler le mode placement avec Echap
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (placementMode) {
            placementMode = false;
            selectedUnit = null;
            document.getElementById('maCarte').style.cursor = '';
            unitItems.forEach(i => i.classList.remove('selected'));
        }
        if (measureMode) {
            resetMeasure();
        }
        if (coordMode) {
            coordMode = false;
            coordBtn.classList.remove('active');
            document.getElementById('maCarte').style.cursor = '';
            hideCoordDisplay();
            resetCoordMarkers();
        }
    }
});

// --- 3. OUTILS DE MESURE ET COORDONNÉES ---

// Créer les éléments d'affichage
const coordDisplay = document.createElement('div');
coordDisplay.className = 'coord-display';
coordDisplay.innerHTML = 'Lat: --, Lng: --';
document.querySelector('.map-container').appendChild(coordDisplay);

const measureInfo = document.createElement('div');
measureInfo.className = 'measure-info';
measureInfo.innerHTML = 'Distance: 0 km<div class="hint">Cliquez pour ajouter des points. Double-clic pour terminer.</div>';
document.querySelector('.map-container').appendChild(measureInfo);

// Fonction pour calculer la distance entre deux points (en km)
function calculateDistance(latlng1, latlng2) {
    return latlng1.distanceTo(latlng2) / 1000; // en km
}

// Fonction pour calculer la distance totale
function calculateTotalDistance() {
    let total = 0;
    for (let i = 1; i < measurePoints.length; i++) {
        total += calculateDistance(measurePoints[i-1], measurePoints[i]);
    }
    return total;
}

// Fonction pour afficher/cacher les coordonnées
function showCoordDisplay(lat, lng) {
    coordDisplay.innerHTML = `Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`;
    coordDisplay.classList.add('visible');
}

function hideCoordDisplay() {
    coordDisplay.classList.remove('visible');
}

// Fonction pour réinitialiser la mesure
function resetMeasure() {
    measureMode = false;
    isDrawing = false;
    measureBtn.classList.remove('active');
    document.getElementById('maCarte').style.cursor = '';
    measureInfo.classList.remove('visible');
    
    // Réactiver le dragging de la carte
    map.dragging.enable();
    
    // Supprimer la ligne
    if (measureLine) {
        map.removeLayer(measureLine);
        measureLine = null;
    }
    
    // Supprimer tous les marqueurs du tableau
    measureMarkers.forEach(m => {
        if (map.hasLayer(m)) {
            map.removeLayer(m);
        }
    });
    measureMarkers = [];
    measurePoints = [];
    
    // Sécurité supplémentaire : supprimer tous les circleMarkers verts qui pourraient rester
    map.eachLayer((layer) => {
        if (layer instanceof L.CircleMarker && 
            layer.options.color === '#0f0' && 
            layer.options.radius === 5) {
            map.removeLayer(layer);
        }
    });
}

// Fonction pour réinitialiser les coordonnées
function resetCoordMarkers() {
    coordMarkers.forEach(m => map.removeLayer(m));
    coordMarkers = [];
}

// Fonction pour mettre à jour l'affichage de la mesure
function updateMeasureDisplay() {
    const totalDistance = calculateTotalDistance();
    measureInfo.innerHTML = `Distance: ${totalDistance.toFixed(2)} km<div class="hint">Maintenez le clic pour tracer. Recliquez pour terminer.</div>`;
}

// Bouton de mesure
measureBtn.addEventListener('click', () => {
    // Désactiver les autres modes
    placementMode = false;
    selectedUnit = null;
    coordMode = false;
    coordBtn.classList.remove('active');
    hideCoordDisplay();
    resetCoordMarkers();
    unitItems.forEach(i => i.classList.remove('selected'));
    closeAllMenus();
    
    if (measureMode) {
        resetMeasure();
        // Réactiver le dragging de la carte
        map.dragging.enable();
    } else {
        measureMode = true;
        measureBtn.classList.add('active');
        document.getElementById('maCarte').style.cursor = 'crosshair';
        measureInfo.classList.add('visible');
        measureInfo.innerHTML = 'Distance: 0 km<div class="hint">Maintenez le clic pour tracer. Recliquez pour terminer.</div>';
        // Désactiver le dragging de la carte
        map.dragging.disable();
    }
});

// Bouton de coordonnées
coordBtn.addEventListener('click', () => {
    // Désactiver les autres modes
    placementMode = false;
    selectedUnit = null;
    resetMeasure();
    unitItems.forEach(i => i.classList.remove('selected'));
    closeAllMenus();
    
    if (coordMode) {
        coordMode = false;
        coordBtn.classList.remove('active');
        document.getElementById('maCarte').style.cursor = '';
        hideCoordDisplay();
        resetCoordMarkers();
    } else {
        coordMode = true;
        coordBtn.classList.add('active');
        document.getElementById('maCarte').style.cursor = 'crosshair';
    }
});

// Gestion du mode mesure avec mousedown/mousemove/mouseup
map.on('mousedown', (e) => {
    if (measureMode && !isDrawing) {
        isDrawing = true;
        measurePoints = [e.latlng];
        
        // Nettoyer les anciens marqueurs et lignes avant de commencer un nouveau tracé
        if (measureLine) {
            map.removeLayer(measureLine);
            measureLine = null;
        }
        measureMarkers.forEach(m => {
            if (map.hasLayer(m)) {
                map.removeLayer(m);
            }
        });
        measureMarkers = [];
        
        // Ajouter le premier marqueur
        const pointMarker = L.circleMarker(e.latlng, {
            radius: 5,
            color: '#0f0',
            fillColor: '#0f0',
            fillOpacity: 1
        }).addTo(map);
        measureMarkers = [pointMarker];
    }
});

map.on('mousemove', (e) => {
    // Mode mesure : tracer en temps réel pendant le drag
    if (measureMode && isDrawing) {
        measurePoints.push(e.latlng);
        
        // Mettre à jour la ligne en temps réel
        if (measureLine) {
            map.removeLayer(measureLine);
        }
        measureLine = L.polyline(measurePoints, {
            color: '#0f0',
            weight: 3,
            opacity: 0.8,
            dashArray: '10, 10'
        }).addTo(map);
        
        updateMeasureDisplay();
        return;
    }
    
    // Mode coordonnées : afficher les coordonnées au survol
    if (coordMode) {
        showCoordDisplay(e.latlng.lat, e.latlng.lng);
    }
});

map.on('mouseup', (e) => {
    if (measureMode && isDrawing) {
        isDrawing = false;
        
        // Ajouter un marqueur à la fin du tracé
        const pointMarker = L.circleMarker(e.latlng, {
            radius: 5,
            color: '#0f0',
            fillColor: '#0f0',
            fillOpacity: 1
        }).addTo(map);
        measureMarkers.push(pointMarker);
        
        // Afficher le résultat final
        const totalDistance = calculateTotalDistance();
        measureInfo.innerHTML = `Distance: ${totalDistance.toFixed(2)} km<div class="hint">Maintenez le clic pour un nouveau tracé, ou cliquez sur ✎ pour réinitialiser.</div>`;
    }
});

// Gestion des clics sur la carte pour les outils
map.on('click', (e) => {
    // Mode coordonnées : placer un marqueur permanent avec popup
    if (coordMode) {
        const coordMarker = L.marker(e.latlng, {
            icon: L.divIcon({
                className: 'coord-marker',
                html: '<div style="background-color: rgba(0,255,0,0.8); width: 10px; height: 10px; border-radius: 50%; border: 2px solid #0f0;"></div>',
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            })
        }).addTo(map);
        
        coordMarker.bindPopup(`
            <div style="color: #0f0; font-family: 'Courier New', monospace; font-size: 12px;">
                <b>Coordonnées</b><br>
                Lat: ${e.latlng.lat.toFixed(5)}<br>
                Lng: ${e.latlng.lng.toFixed(5)}
            </div>
        `).openPopup();
        
        coordMarkers.push(coordMarker);
        return;
    }
    
    // Mode placement d'unités
    if (placementMode && selectedUnit) {
        const unitIcon = unitIcons[selectedUnit];
        const unitName = unitNames[selectedUnit];
        
        const markerId = ++markerIdCounter;
        
        const marker = L.marker(e.latlng, {
            icon: unitIcon,
            draggable: true
        });
        
        // Stocker le marqueur
        markersMap.set(markerId, marker);
        marker.customId = markerId;
        marker.unitType = selectedUnit;
        
        // Créer le contenu du popup
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <b>${unitName}</b>
            <button class="unit-delete-btn" data-marker-id="${markerId}">🗑️ Supprimer</button>
        `;
        
        // Ajouter l'événement de suppression
        popupContent.querySelector('.unit-delete-btn').addEventListener('click', function() {
            const id = parseInt(this.dataset.markerId);
            const markerToRemove = markersMap.get(id);
            if (markerToRemove) {
                unitsLayer.removeLayer(markerToRemove);
                markersMap.delete(id);
            }
        });
        
        marker.bindPopup(popupContent);
        unitsLayer.addLayer(marker);
        
        // Réinitialiser le mode placement
        placementMode = false;
        selectedUnit = null;
        document.getElementById('maCarte').style.cursor = '';
        unitItems.forEach(i => i.classList.remove('selected'));
    }
});

// Variable globale pour stocker l'utilisateur actuel
let currentUser = null;

// Vérifier si l'utilisateur est déjà connecté
function checkAuth() {
    const token = localStorage.getItem('discord_token');
    const userData = localStorage.getItem('current_user');
    if (token && userData) {
        currentUser = JSON.parse(userData);
        displayUser(currentUser);
    } else if (token) {
        fetchUserInfo(token);
    }
}

// Récupérer les informations de l'utilisateur
async function fetchUserInfo(token) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            currentUser = user;
            localStorage.setItem('current_user', JSON.stringify(user));
            displayUser(user);
            
            // Logger la connexion
            ADMIN_CONFIG.logConnection(user);
        } else {
            localStorage.removeItem('discord_token');
            localStorage.removeItem('current_user');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur:', error);
        localStorage.removeItem('discord_token');
    }
}

// Afficher les informations de l'utilisateur
function displayUser(user) {
    const avatarUrl = user.avatar 
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
    
    userAvatar.src = avatarUrl;
    userName.textContent = user.username;
    
    loginBtn.style.display = 'none';
    userInfo.classList.remove('hidden');
    
    // Vérifier si l'utilisateur est admin
    const isAdmin = ADMIN_CONFIG.isAdmin(user.id);
    
    if (isAdmin) {
        // Activer tous les boutons pour les admins
        publishBtn.disabled = false;
        publishInfo.classList.add('hidden');
        downloadPngBtn.disabled = false;
        downloadJsonBtn.disabled = false;
        loadJsonInput.disabled = false;
    } else {
        // Désactiver le bouton publier pour les non-admins
        publishBtn.disabled = true;
        publishInfo.classList.remove('hidden');
        // Les autres boutons restent accessibles
        downloadPngBtn.disabled = false;
        downloadJsonBtn.disabled = false;
        loadJsonInput.disabled = false;
    }
}

// Connexion
loginBtn.addEventListener('click', () => {
    window.location.href = DISCORD_OAUTH_URL;
});

// Déconnexion
logoutBtn.addEventListener('click', () => {
    if (currentUser) {
        ADMIN_CONFIG.logAction(currentUser.id, currentUser.username, 'logout');
    }
    localStorage.removeItem('discord_token');
    localStorage.removeItem('current_user');
    currentUser = null;
    loginBtn.style.display = 'flex';
    userInfo.classList.add('hidden');
    
    // Désactiver les boutons
    publishBtn.disabled = true;
    publishInfo.classList.add('hidden');
});

// Gérer le retour OAuth2
function handleOAuthCallback() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    
    if (token) {
        localStorage.setItem('discord_token', token);
        window.location.hash = '';
        fetchUserInfo(token);
    }
}

// Initialiser l'authentification
handleOAuthCallback();
checkAuth();

// --- 3. Fonctionnalités d'export/import ---

// Télécharger en PNG
document.getElementById('downloadPng').addEventListener('click', function() {
    const mapElement = document.getElementById('maCarte');
    
    // Afficher un message de chargement
    const originalText = this.innerHTML;
    this.innerHTML = '<span>⏳</span> Génération en cours...';
    this.disabled = true;
    
    // Masquer les contrôles de zoom (+/-) et autres contrôles Leaflet
    const zoomControl = document.querySelector('.leaflet-control-zoom');
    const attributionControl = document.querySelector('.leaflet-control-attribution');
    if (zoomControl) zoomControl.style.display = 'none';
    if (attributionControl) attributionControl.style.display = 'none';
    
    // Utiliser html2canvas pour capturer la carte
    html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        scale: 2 // Qualité d'image (2x la résolution)
    }).then(canvas => {
        // Réafficher les contrôles
        if (zoomControl) zoomControl.style.display = '';
        if (attributionControl) attributionControl.style.display = '';
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `carte-royaume-du-nil-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restaurer le bouton
        document.getElementById('downloadPng').innerHTML = originalText;
        document.getElementById('downloadPng').disabled = false;
    }).catch(error => {
        // Réafficher les contrôles en cas d'erreur
        if (zoomControl) zoomControl.style.display = '';
        if (attributionControl) attributionControl.style.display = '';
        
        console.error('Erreur lors de la génération PNG:', error);
        alert('Erreur lors de la génération de l\'image PNG');
        document.getElementById('downloadPng').innerHTML = originalText;
        document.getElementById('downloadPng').disabled = false;
    });
});

// Télécharger en JSON
document.getElementById('downloadJson').addEventListener('click', function() {
    // Afficher un indicateur de chargement
    const originalText = this.innerHTML;
    this.innerHTML = '<span>⏳</span> Génération...';
    this.disabled = true;
    
    // Utiliser un setTimeout pour permettre l'affichage de l'indicateur
    setTimeout(() => {
        const mapData = {
            center: map.getCenter(),
            zoom: map.getZoom(),
            units: [],
            timestamp: new Date().toISOString()
        };
        
        // Collecter toutes les unités
        unitsLayer.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                mapData.units.push({
                    latlng: layer.getLatLng(),
                    unitType: layer.unitType,
                    type: 'unit'
                });
            }
        });
        
        // Logger l'action
        if (currentUser) {
            ADMIN_CONFIG.logAction(currentUser, 'download_json', {
                unitsCount: mapData.units.length
            });
        }
        
        // Créer et télécharger le fichier JSON
        const jsonStr = JSON.stringify(mapData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `carte-royaume-du-nil-${timestamp}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        // Restaurer le bouton
        const btn = document.getElementById('downloadJson');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 100);
});

// Charger un JSON
document.getElementById('loadJson').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const mapData = JSON.parse(event.target.result);
            
            // Restaurer la position de la carte
            if (mapData.center && mapData.zoom) {
                map.setView([mapData.center.lat, mapData.center.lng], mapData.zoom);
            }
            
            // Restaurer les unités
            if (mapData.units) {
                unitsLayer.clearLayers();
                markersMap.clear();
                
                mapData.units.forEach(function(unitData) {
                    if (unitData.type === 'unit' && unitData.unitType) {
                        const unitIcon = unitIcons[unitData.unitType];
                        const unitName = unitNames[unitData.unitType];
                        
                        const markerId = ++markerIdCounter;
                        
                        const marker = L.marker([unitData.latlng.lat, unitData.latlng.lng], {
                            icon: unitIcon,
                            draggable: true
                        });
                        
                        markersMap.set(markerId, marker);
                        marker.customId = markerId;
                        marker.unitType = unitData.unitType;
                        
                        const popupContent = document.createElement('div');
                        popupContent.innerHTML = `
                            <b>${unitName}</b>
                            <button class="unit-delete-btn" data-marker-id="${markerId}">🗑️ Supprimer</button>
                        `;
                        
                        popupContent.querySelector('.unit-delete-btn').addEventListener('click', function() {
                            const id = parseInt(this.dataset.markerId);
                            const markerToRemove = markersMap.get(id);
                            if (markerToRemove) {
                                unitsLayer.removeLayer(markerToRemove);
                                markersMap.delete(id);
                            }
                        });
                        
                        marker.bindPopup(popupContent);
                        unitsLayer.addLayer(marker);
                    }
                });
            }
            
            alert('Carte chargée avec succès !');
            
            // Logger l'action
            if (currentUser) {
                ADMIN_CONFIG.logAction(currentUser, 'load_json', {
                    filename: file.name,
                    unitsCount: mapData.units ? mapData.units.length : 0
                });
            }
        } catch (error) {
            alert('Erreur lors du chargement du fichier JSON: ' + error.message);
        }
    };
    reader.readAsText(file);
});

// Publier sur la carte actuelle (Admin uniquement)
publishBtn.addEventListener('click', async function() {
    if (!currentUser || !ADMIN_CONFIG.isAdmin(currentUser.id)) {
        alert('Vous devez être administrateur pour publier la carte.');
        return;
    }
    
    if (!confirm('⚠️ Êtes-vous sûr de vouloir publier cette carte sur le site principal ?\n\nCela remplacera la carte actuelle visible par tous les utilisateurs.')) {
        return;
    }
    
    // Afficher un indicateur de chargement
    const originalText = this.innerHTML;
    this.innerHTML = '<span>⏳</span> Publication en cours...';
    this.disabled = true;
    
    try {
        // Collecter les données de la carte
        const mapData = {
            center: map.getCenter(),
            zoom: map.getZoom(),
            units: [],
            timestamp: new Date().toISOString(),
            publishedBy: currentUser.username,
            publishedById: currentUser.id
        };
        
        // Collecter toutes les unités
        unitsLayer.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                mapData.units.push({
                    latlng: layer.getLatLng(),
                    unitType: layer.unitType,
                    type: 'unit'
                });
            }
        });
        
        // Sauvegarder la version actuelle avant de publier (via API Vercel)
        try {
            await ADMIN_CONFIG.saveMapVersion(mapData, currentUser.id, currentUser.username);
            console.log('✅ Version sauvegardée dans le Gist');
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde de la version:', error);
        }
        
        // Publier via l'API Vercel
        try {
            this.innerHTML = '<span>⏳</span> Publication en cours...';
            
            // Utiliser l'URL Vercel si configurée, sinon fallback local
            const apiUrl = (typeof VERCEL_CONFIG !== 'undefined' && VERCEL_CONFIG.apiUrl) 
                ? `${VERCEL_CONFIG.apiUrl}/api/publish`
                : '/api/publish';
            
            console.log('📤 Publication vers:', apiUrl);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mapData })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la publication');
            }
            
            const result = await response.json();
            console.log('✅ Publié via API Vercel:', result);
            
            // Sauvegarder aussi en local comme fallback
            localStorage.setItem('published_map', JSON.stringify(mapData));
            
        } catch (apiError) {
            console.warn('⚠️ Erreur API, sauvegarde locale uniquement:', apiError);
            // Fallback sur localStorage
            localStorage.setItem('published_map', JSON.stringify(mapData));
        }
        
        // Logger l'action
        ADMIN_CONFIG.logAction(currentUser, 'publish_map', {
            versionId: versionId,
            unitsCount: mapData.units.length
        });
        
        // Restaurer le bouton
        const btn = document.getElementById('publishMap');
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Message de succès
        alert(`✅ Carte publiée avec succès !\n\nVersion sauvegardée: ${versionId}\nUnités: ${mapData.units.length}\n\n Rechargez la page "Carte Actuelle" pour voir les modifications.`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la publication:', error);
        const btn = document.getElementById('publishMap');
        btn.innerHTML = originalText;
        btn.disabled = false;
        alert(`❌ Erreur lors de la publication:\n\n${error.message}`);
    }
});

