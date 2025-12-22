// Configuration des administrateurs autorisés
// Remplacez ces IDs par les vrais IDs Discord des admins

const ADMIN_CONFIG = {
    // Liste des IDs Discord autorisés
    adminIds: [
        '772821169664426025', // Votre ID Discord
        // Ajoutez d'autres IDs ici
    ],
    
    // Vérifier si un utilisateur est admin
    isAdmin: function(userId) {
        return this.adminIds.includes(userId);
    },
    
    // Enregistrer un log de connexion
    logConnection: function(user) {
        const logs = this.getLogs();
        const logEntry = {
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            timestamp: new Date().toISOString(),
            action: 'login'
        };
        logs.push(logEntry);
        localStorage.setItem('connection_logs', JSON.stringify(logs));
    },
    
    // Récupérer tous les logs
    getLogs: function() {
        const logs = localStorage.getItem('connection_logs');
        return logs ? JSON.parse(logs) : [];
    },
    
    // Enregistrer une action
    logAction: function(userId, username, action, details = {}) {
        const logs = this.getLogs();
        const logEntry = {
            userId: userId,
            username: username,
            timestamp: new Date().toISOString(),
            action: action,
            details: details
        };
        logs.push(logEntry);
        localStorage.setItem('connection_logs', JSON.stringify(logs));
    },
    
    // Sauvegarder une version de la carte (via API Vercel)
    saveMapVersion: async function(mapData, userId, username) {
        const version = {
            id: Date.now(),
            mapData: mapData,
            savedBy: username,
            userId: userId,
            timestamp: new Date().toISOString(),
            isAutoSaved: false
        };

        try {
            const apiUrl = (typeof VERCEL_CONFIG !== 'undefined' && VERCEL_CONFIG.apiUrl) 
                ? `${VERCEL_CONFIG.apiUrl}/api/save-version`
                : 'https://kingdomofnile-definitive.vercel.app/api/save-version';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'save',
                    version: version
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('Version sauvegardée avec succès:', data);
                return version.id;
            } else {
                throw new Error(data.error || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la version:', error);
            throw error;
        }
    },
    
    // Récupérer toutes les versions (via API Vercel)
    getMapVersions: async function() {
        try {
            const apiUrl = (typeof VERCEL_CONFIG !== 'undefined' && VERCEL_CONFIG.apiUrl) 
                ? `${VERCEL_CONFIG.apiUrl}/api/load-versions`
                : 'https://kingdomofnile-definitive.vercel.app/api/load-versions';

            const response = await fetch(apiUrl);
            const data = await response.json();
            
            return data.versions || [];
        } catch (error) {
            console.error('Erreur lors du chargement des versions:', error);
            return [];
        }
    },
    
    // Supprimer une version (via API Vercel)
    deleteMapVersion: async function(versionId) {
        try {
            const apiUrl = (typeof VERCEL_CONFIG !== 'undefined' && VERCEL_CONFIG.apiUrl) 
                ? `${VERCEL_CONFIG.apiUrl}/api/save-version`
                : 'https://kingdomofnile-definitive.vercel.app/api/save-version';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'delete',
                    versionId: versionId
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('Version supprimée avec succès:', data);
                return true;
            } else {
                throw new Error(data.error || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la version:', error);
            throw error;
        }
    },
    
    // Restaurer une version
    restoreMapVersion: async function(versionId) {
        const versions = await this.getMapVersions();
        const version = versions.find(v => v.id === versionId);
        return version ? version.mapData : null;
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ADMIN_CONFIG;
}
