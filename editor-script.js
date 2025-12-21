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

// Icône de gouvernement
var govIcon = L.icon({
    iconUrl: 'images/icon_gov_rdn.png',
    iconSize: [60, 50],
    iconAnchor: [30, 50],
    popupAnchor: [0, -50]
});

var gouvernementLayer = L.layerGroup();
var caireGov = L.marker([30.0444, 31.2357], {icon: govIcon});
caireGov.bindPopup("<b>Le Caire</b><br>Capitale du Royaume du Nil<br><span style='color:#87CEEB'>● Gouvernement</span>");
gouvernementLayer.addLayer(caireGov);
gouvernementLayer.addTo(map);

// Légende
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<h4>Légende</h4>';
    div.innerHTML += '<div class="legend-item"><span class="legend-color" style="background-color: #80e0ff;"></span> Symboles Gouvernementaux</div>';
    return div;
};
legend.addTo(map);

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
const unitItems = document.querySelectorAll('.unit-item');

// Variables pour le placement des unités
let selectedUnit = null;
let placementMode = false;
let unitsLayer = L.layerGroup().addTo(map);

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

// Ouvrir/Fermer le menu burger
burgerBtn.addEventListener('click', () => {
    unitMenu.classList.toggle('hidden');
});

closeMenuBtn.addEventListener('click', () => {
    unitMenu.classList.add('hidden');
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
        
        // Changer le curseur de la carte
        document.getElementById('maCarte').style.cursor = 'crosshair';
        
        // Fermer le menu
        unitMenu.classList.add('hidden');
    });
});

// Placement d'unités sur la carte
map.on('click', (e) => {
    if (placementMode && selectedUnit) {
        const unitIcon = unitIcons[selectedUnit];
        const unitName = unitNames[selectedUnit];
        
        const marker = L.marker(e.latlng, {
            icon: unitIcon,
            draggable: true
        });
        
        marker.bindPopup(`
            <b>${unitName}</b><br>
            <button onclick="removeMarker(${marker._leaflet_id})" style="
                background-color: #ff0000;
                color: #fff;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 3px;
                margin-top: 5px;
            ">🗑️ Supprimer</button>
        `);
        
        marker.unitType = selectedUnit;
        unitsLayer.addLayer(marker);
        
        // Réinitialiser le mode placement
        placementMode = false;
        selectedUnit = null;
        document.getElementById('maCarte').style.cursor = '';
        unitItems.forEach(i => i.classList.remove('selected'));
    }
});

// Fonction pour supprimer un marqueur
window.removeMarker = function(markerId) {
    unitsLayer.eachLayer(layer => {
        if (layer._leaflet_id === markerId) {
            unitsLayer.removeLayer(layer);
        }
    });
};

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
    
    // Utiliser html2canvas pour capturer la carte
    html2canvas(mapElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#000000',
        scale: 2 // Qualité d'image (2x la résolution)
    }).then(canvas => {
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
        console.error('Erreur lors de la génération PNG:', error);
        alert('Erreur lors de la génération de l\'image PNG');
        document.getElementById('downloadPng').innerHTML = originalText;
        document.getElementById('downloadPng').disabled = false;
    });
});

// Télécharger en JSON
document.getElementById('downloadJson').addEventListener('click', function() {
    const mapData = {
        center: map.getCenter(),
        zoom: map.getZoom(),
        markers: [],
        units: [],
        timestamp: new Date().toISOString()
    };
    
    // Collecter tous les marqueurs gouvernementaux
    gouvernementLayer.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            mapData.markers.push({
                latlng: layer.getLatLng(),
                popup: layer.getPopup() ? layer.getPopup().getContent() : null,
                type: 'government'
            });
        }
    });
    
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
            unitsCount: mapData.units.length,
            markersCount: mapData.markers.length
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
            
            // Restaurer les marqueurs gouvernementaux
            if (mapData.markers) {
                gouvernementLayer.clearLayers();
                mapData.markers.forEach(function(markerData) {
                    if (markerData.type === 'government') {
                        var marker = L.marker([markerData.latlng.lat, markerData.latlng.lng], {icon: govIcon});
                        if (markerData.popup) {
                            marker.bindPopup(markerData.popup);
                        }
                        gouvernementLayer.addLayer(marker);
                    }
                });
            }
            
            // Restaurer les unités
            if (mapData.units) {
                unitsLayer.clearLayers();
                mapData.units.forEach(function(unitData) {
                    if (unitData.type === 'unit' && unitData.unitType) {
                        const unitIcon = unitIcons[unitData.unitType];
                        const unitName = unitNames[unitData.unitType];
                        
                        const marker = L.marker([unitData.latlng.lat, unitData.latlng.lng], {
                            icon: unitIcon,
                            draggable: true
                        });
                        
                        marker.bindPopup(`
                            <b>${unitName}</b><br>
                            <button onclick="removeMarker(${marker._leaflet_id})" style="
                                background-color: #ff0000;
                                color: #fff;
                                border: none;
                                padding: 5px 10px;
                                cursor: pointer;
                                border-radius: 3px;
                                margin-top: 5px;
                            ">🗑️ Supprimer</button>
                        `);
                        
                        marker.unitType = unitData.unitType;
                        unitsLayer.addLayer(marker);
                    }
                });
            }
            
            alert('Carte chargée avec succès !');
            
            // Logger l'action
            if (currentUser) {
                ADMIN_CONFIG.logAction(currentUser, 'load_json', {
                    filename: file.name,
                    unitsCount: mapData.units ? mapData.units.length : 0,
                    markersCount: mapData.markers ? mapData.markers.length : 0
                });
            }
        } catch (error) {
            alert('Erreur lors du chargement du fichier JSON: ' + error.message);
        }
    };
    reader.readAsText(file);
});

// Publier sur la carte actuelle (Admin uniquement)
publishBtn.addEventListener('click', function() {
    if (!currentUser || !ADMIN_CONFIG.isAdmin(currentUser.id)) {
        alert('Vous devez être administrateur pour publier la carte.');
        return;
    }
    
    if (!confirm('⚠️ Êtes-vous sûr de vouloir publier cette carte sur le site principal ?\n\nCela remplacera la carte actuelle visible par tous les utilisateurs.')) {
        return;
    }
    
    // Collecter les données de la carte
    const mapData = {
        center: map.getCenter(),
        zoom: map.getZoom(),
        markers: [],
        units: [],
        timestamp: new Date().toISOString(),
        publishedBy: currentUser.username,
        publishedById: currentUser.id
    };
    
    // Collecter tous les marqueurs gouvernementaux
    gouvernementLayer.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            mapData.markers.push({
                latlng: layer.getLatLng(),
                popup: layer.getPopup() ? layer.getPopup().getContent() : null,
                type: 'government'
            });
        }
    });
    
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
    
    // Sauvegarder la version actuelle avant de publier
    const versionId = ADMIN_CONFIG.saveMapVersion(mapData, currentUser.id, currentUser.username);
    
    // Publier (sauvegarder comme carte actuelle)
    localStorage.setItem('published_map', JSON.stringify(mapData));
    
    // Logger l'action
    ADMIN_CONFIG.logAction(currentUser, 'publish_map', {
        versionId: versionId,
        markerCount: mapData.markers.length,
        unitsCount: mapData.units.length
    });
    
    alert(`✅ Carte publiée avec succès !\n\nVersion sauvegardée avec l'ID: ${versionId}\nMarqueurs: ${mapData.markers.length}\nUnités: ${mapData.units.length}`);
});
