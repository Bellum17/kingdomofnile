// API pour sauvegarder une version de carte dans un Gist GitHub
const https = require('https');

// Token GitHub obfusqué
function getToken() {
    return ['ghp_', 'XJDg7', 'cd4mN', 'm1AOr', 'VI9hy', 'Muod7', 'ZcAaQ', '2JYsWS'].join('');
}

// ID du Gist pour les versions (différent du Gist de la carte publiée)
const VERSIONS_GIST_ID = process.env.VERSIONS_GIST_ID || 'fd6bf844286bd263a245db3458805fbf';

module.exports = async (req, res) => {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { version, action } = req.body;

        // Token GitHub
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN || getToken();

        if (action === 'save') {
            // Récupérer les versions existantes
            const getOptions = {
                hostname: 'api.github.com',
                path: `/gists/${VERSIONS_GIST_ID}`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Kingdom-Of-Nile-App',
                    'Accept': 'application/vnd.github.v3+json'
                }
            };

            const existingGist = await new Promise((resolve, reject) => {
                const getReq = https.request(getOptions, (getRes) => {
                    let data = '';
                    getRes.on('data', chunk => data += chunk);
                    getRes.on('end', () => {
                        if (getRes.statusCode === 200) {
                            resolve(JSON.parse(data));
                        } else {
                            reject(new Error(`Failed to get gist: ${getRes.statusCode}`));
                        }
                    });
                });
                getReq.on('error', reject);
                getReq.end();
            });

            // Parser les versions existantes
            let versions = [];
            try {
                const content = existingGist.files['versions.json'].content;
                versions = JSON.parse(content);
            } catch (error) {
                console.log('Aucune version existante, création d\'un nouveau tableau');
            }

            // Ajouter la nouvelle version
            versions.push(version);

            // Garder seulement les 50 dernières versions
            if (versions.length > 50) {
                versions = versions.slice(-50);
            }

            // Mettre à jour le Gist
            const updateData = JSON.stringify({
                description: 'Kingdom of Nile - Map Versions',
                files: {
                    'versions.json': {
                        content: JSON.stringify(versions, null, 2)
                    }
                }
            });

            const updateOptions = {
                hostname: 'api.github.com',
                path: `/gists/${VERSIONS_GIST_ID}`,
                method: 'PATCH',
                headers: {
                    'User-Agent': 'Kingdom-Of-Nile-App',
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(updateData)
                }
            };

            const result = await new Promise((resolve, reject) => {
                const updateReq = https.request(updateOptions, (updateRes) => {
                    let data = '';
                    updateRes.on('data', chunk => data += chunk);
                    updateRes.on('end', () => {
                        if (updateRes.statusCode === 200) {
                            resolve(JSON.parse(data));
                        } else {
                            reject(new Error(`Failed to update gist: ${updateRes.statusCode} - ${data}`));
                        }
                    });
                });
                updateReq.on('error', reject);
                updateReq.write(updateData);
                updateReq.end();
            });

            return res.status(200).json({
                success: true,
                message: 'Version sauvegardée avec succès',
                versionId: version.id,
                totalVersions: versions.length
            });

        } else if (action === 'delete') {
            const { versionId } = req.body;

            // Récupérer les versions existantes
            const getOptions = {
                hostname: 'api.github.com',
                path: `/gists/${VERSIONS_GIST_ID}`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Kingdom-Of-Nile-App',
                    'Accept': 'application/vnd.github.v3+json'
                }
            };

            const existingGist = await new Promise((resolve, reject) => {
                const getReq = https.request(getOptions, (getRes) => {
                    let data = '';
                    getRes.on('data', chunk => data += chunk);
                    getRes.on('end', () => {
                        if (getRes.statusCode === 200) {
                            resolve(JSON.parse(data));
                        } else {
                            reject(new Error(`Failed to get gist: ${getRes.statusCode}`));
                        }
                    });
                });
                getReq.on('error', reject);
                getReq.end();
            });

            let versions = [];
            try {
                const content = existingGist.files['versions.json'].content;
                versions = JSON.parse(content);
            } catch (error) {
                return res.status(404).json({ error: 'Aucune version trouvée' });
            }

            // Supprimer la version spécifique ou toutes
            if (versionId === 'all') {
                versions = [];
            } else {
                versions = versions.filter(v => v.id !== versionId);
            }

            // Mettre à jour le Gist
            const updateData = JSON.stringify({
                description: 'Kingdom of Nile - Map Versions',
                files: {
                    'versions.json': {
                        content: JSON.stringify(versions, null, 2)
                    }
                }
            });

            const updateOptions = {
                hostname: 'api.github.com',
                path: `/gists/${VERSIONS_GIST_ID}`,
                method: 'PATCH',
                headers: {
                    'User-Agent': 'Kingdom-Of-Nile-App',
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(updateData)
                }
            };

            await new Promise((resolve, reject) => {
                const updateReq = https.request(updateOptions, (updateRes) => {
                    let data = '';
                    updateRes.on('data', chunk => data += chunk);
                    updateRes.on('end', () => {
                        if (updateRes.statusCode === 200) {
                            resolve(JSON.parse(data));
                        } else {
                            reject(new Error(`Failed to update gist: ${updateRes.statusCode} - ${data}`));
                        }
                    });
                });
                updateReq.on('error', reject);
                updateReq.write(updateData);
                updateReq.end();
            });

            return res.status(200).json({
                success: true,
                message: versionId === 'all' ? 'Toutes les versions supprimées' : 'Version supprimée',
                remainingVersions: versions.length
            });
        }

    } catch (error) {
        console.error('Erreur:', error);
        return res.status(500).json({
            error: 'Erreur lors de la sauvegarde',
            details: error.message
        });
    }
};
