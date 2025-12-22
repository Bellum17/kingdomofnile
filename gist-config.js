// Configuration GitHub Gist
// ⚠️ IMPORTANT : Remplacez ces valeurs par les vôtres

const GIST_CONFIG = {
    // Votre token GitHub (créé sur https://github.com/settings/tokens)
    // Permissions nécessaires : "gist" uniquement
    githubToken: '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', // Exemple: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    
    // ID du Gist (laissez vide pour la première publication, sera rempli automatiquement)
    gistId: '', // Sera mis à jour automatiquement après la première publication
    
    // Nom du fichier dans le Gist
    gistFilename: 'kingdom-of-nile-map.json',
    
    // Description du Gist
    gistDescription: 'Carte publiée du Royaume du Nil'
};

// ⚠️ IMPORTANT : Ne commitez JAMAIS ce fichier avec votre vrai token sur un repo public
// Utilisez plutôt GitHub Secrets ou des variables d'environnement en production

// Pour la sécurité, vous pouvez aussi stocker le token dans le localStorage
// après la première configuration (voir plus bas)

// Fonction pour vérifier la configuration
function checkGistConfig() {
    if (!GIST_CONFIG.githubToken || GIST_CONFIG.githubToken === 'VOTRE_TOKEN_ICI') {
        console.warn('⚠️ Token GitHub non configuré');
        return false;
    }
    return true;
}

// Fonction pour sauvegarder le Gist ID après la première publication
function saveGistId(gistId) {
    GIST_CONFIG.gistId = gistId;
    localStorage.setItem('gist_id', gistId);
    console.log('✅ Gist ID sauvegardé:', gistId);
}

// Fonction pour charger le Gist ID depuis le localStorage
function loadGistId() {
    const savedGistId = localStorage.getItem('gist_id');
    if (savedGistId && !GIST_CONFIG.gistId) {
        GIST_CONFIG.gistId = savedGistId;
        console.log('✅ Gist ID chargé:', savedGistId);
    }
    return GIST_CONFIG.gistId;
}

// Fonction pour publier sur GitHub Gist
async function publishToGist(mapData) {
    if (!checkGistConfig()) {
        throw new Error('Token GitHub non configuré. Veuillez configurer GIST_CONFIG.githubToken dans gist-config.js');
    }
    
    const content = JSON.stringify(mapData, null, 2);
    const gistId = loadGistId();
    
    const gistData = {
        description: GIST_CONFIG.gistDescription,
        public: true,
        files: {
            [GIST_CONFIG.gistFilename]: {
                content: content
            }
        }
    };
    
    try {
        let response;
        
        if (gistId) {
            // Mettre à jour un Gist existant
            console.log('🔄 Mise à jour du Gist existant...');
            response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${GIST_CONFIG.githubToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(gistData)
            });
        } else {
            // Créer un nouveau Gist
            console.log('✨ Création d\'un nouveau Gist...');
            response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${GIST_CONFIG.githubToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(gistData)
            });
        }
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur GitHub API: ${errorData.message}`);
        }
        
        const result = await response.json();
        
        // Sauvegarder le Gist ID pour les prochaines fois
        if (result.id) {
            saveGistId(result.id);
        }
        
        return {
            success: true,
            gistId: result.id,
            url: result.html_url,
            rawUrl: result.files[GIST_CONFIG.gistFilename].raw_url
        };
    } catch (error) {
        console.error('❌ Erreur lors de la publication sur Gist:', error);
        throw error;
    }
}

// Fonction pour charger depuis GitHub Gist
async function loadFromGist(gistId = null) {
    const id = gistId || loadGistId();
    
    if (!id) {
        console.log('ℹ️ Aucun Gist configuré, utilisation du localStorage');
        return null;
    }
    
    try {
        console.log('📥 Chargement depuis Gist:', id);
        const response = await fetch(`https://api.github.com/gists/${id}`);
        
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement: ${response.status}`);
        }
        
        const gist = await response.json();
        const fileContent = gist.files[GIST_CONFIG.gistFilename]?.content;
        
        if (!fileContent) {
            throw new Error('Fichier non trouvé dans le Gist');
        }
        
        const mapData = JSON.parse(fileContent);
        console.log('✅ Carte chargée depuis Gist');
        return mapData;
    } catch (error) {
        console.error('❌ Erreur lors du chargement depuis Gist:', error);
        console.log('ℹ️ Utilisation du localStorage à la place');
        return null;
    }
}

// Fonction pour obtenir l'URL publique du Gist
function getGistPublicUrl() {
    const gistId = loadGistId();
    if (!gistId) return null;
    return `https://gist.github.com/${gistId}`;
}

// Charger le Gist ID au démarrage
loadGistId();

// Debug : Confirmer que le script est chargé
console.log('✅ gist-config.js chargé');
console.log('Token configuré:', GIST_CONFIG.githubToken !== 'VOTRE_TOKEN_ICI');
console.log('publishToGist disponible:', typeof publishToGist !== 'undefined');
