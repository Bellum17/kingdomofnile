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
const DISCORD_REDIRECT_URI = 'https://bellum17.github.io/kingdomofnile/editor.html';
const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=token&scope=identify`;

// Éléments DOM
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');

// Vérifier si l'utilisateur est déjà connecté
function checkAuth() {
    const token = localStorage.getItem('discord_token');
    if (token) {
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
            displayUser(user);
        } else {
            localStorage.removeItem('discord_token');
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
}

// Connexion
loginBtn.addEventListener('click', () => {
    window.location.href = DISCORD_OAUTH_URL;
});

// Déconnexion
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('discord_token');
    loginBtn.style.display = 'flex';
    userInfo.classList.add('hidden');
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
        timestamp: new Date().toISOString()
    };
    
    // Collecter tous les marqueurs
    gouvernementLayer.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            mapData.markers.push({
                latlng: layer.getLatLng(),
                popup: layer.getPopup() ? layer.getPopup().getContent() : null,
                type: 'government'
            });
        }
    });
    
    // Créer et télécharger le fichier JSON
    const jsonStr = JSON.stringify(mapData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'carte-royaume-du-nil.json';
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
            
            // Restaurer les marqueurs
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
            
            alert('Carte chargée avec succès !');
        } catch (error) {
            alert('Erreur lors du chargement du fichier JSON: ' + error.message);
        }
    };
    reader.readAsText(file);
});
