// API pour charger toutes les versions depuis le Gist
const https = require('https');

// ID du Gist pour les versions
const VERSIONS_GIST_ID = process.env.VERSIONS_GIST_ID || 'fd6bf844286bd263a245db3458805fbf';

module.exports = async (req, res) => {
    // Configuration CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const options = {
            hostname: 'api.github.com',
            path: `/gists/${VERSIONS_GIST_ID}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Kingdom-Of-Nile-App',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const gistData = await new Promise((resolve, reject) => {
            const request = https.request(options, (response) => {
                let data = '';
                response.on('data', chunk => data += chunk);
                response.on('end', () => {
                    if (response.statusCode === 200) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(new Error(`GitHub API error: ${response.statusCode}`));
                    }
                });
            });
            request.on('error', reject);
            request.end();
        });

        // Extraire le contenu
        const content = gistData.files['versions.json']?.content;
        if (!content) {
            return res.status(200).json({ versions: [] });
        }

        const versions = JSON.parse(content);
        
        return res.status(200).json({
            success: true,
            versions: versions
        });

    } catch (error) {
        console.error('Erreur:', error);
        
        // Si le Gist n'existe pas encore, retourner un tableau vide
        if (error.message.includes('404')) {
            return res.status(200).json({ versions: [] });
        }
        
        return res.status(500).json({
            error: 'Erreur lors du chargement des versions',
            details: error.message
        });
    }
};
