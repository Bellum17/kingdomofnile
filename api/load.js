// API Vercel pour charger la carte depuis GitHub Gist
// GET /api/load

// Importer la config locale si disponible, sinon utiliser les env vars
let config;
try {
    config = require('./config.js');
} catch (e) {
    config = {};
}

module.exports = async function handler(req, res) {
    // Activer CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Priorité : config.js > environment variables
        const GIST_ID = config.GIST_ID || process.env.GIST_ID;
        const GIST_FILENAME = 'kingdom-of-nile-map.json';

        if (!GIST_ID) {
            return res.status(404).json({ error: 'No published map found' });
        }

        // Charger depuis Gist public (pas besoin de token)
        const response = await fetch(`https://api.github.com/gists/${GIST_ID}`);

        if (!response.ok) {
            throw new Error(`Failed to load Gist: ${response.status}`);
        }

        const gist = await response.json();
        const file = gist.files?.[GIST_FILENAME];

        if (!file) {
            return res.status(404).json({ error: 'Map file not found in Gist' });
        }

        // Charger le contenu depuis raw_url si disponible
        let mapData;
        if (file.raw_url) {
            const rawResponse = await fetch(file.raw_url);
            if (!rawResponse.ok) {
                throw new Error(`Failed to load raw content: ${rawResponse.status}`);
            }
            const rawText = await rawResponse.text();
            mapData = JSON.parse(rawText);
        } else if (file.content) {
            mapData = JSON.parse(file.content);
        } else {
            return res.status(404).json({ error: 'No content available' });
        }

        return res.status(200).json({
            success: true,
            mapData: mapData
        });

    } catch (error) {
        console.error('Error loading from Gist:', error);
        return res.status(500).json({
            error: 'Failed to load from Gist',
            message: error.message
        });
    }
}
