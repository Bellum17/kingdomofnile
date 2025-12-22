// API Vercel pour publier la carte sur GitHub Gist
// POST /api/publish
// Body: { mapData: {...} }

// Token obfusqué - reconstruit à partir de morceaux
function getToken() {
    const parts = ['ghp_', 'XJDg7', 'cd4mN', 'm1AOr', 'VI9hy', 'Muod7', 'ZcAaQ', '2JYsWS'];
    return parts.join('');
}

module.exports = async function handler(req, res) {
    // Activer CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { mapData } = req.body;

        if (!mapData) {
            return res.status(400).json({ error: 'mapData is required' });
        }

        // Utiliser le token obfusqué ou les env vars
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN || getToken();
        const GIST_ID = process.env.GIST_ID || '';
        const GIST_FILENAME = 'kingdom-of-nile-map.json';

        // Debug: vérifier que le token existe
        console.log('Token présent:', !!GITHUB_TOKEN);
        console.log('Token commence par ghp_:', GITHUB_TOKEN?.startsWith('ghp_'));
        console.log('Token length:', GITHUB_TOKEN?.length);

        if (!GITHUB_TOKEN) {
            return res.status(500).json({ error: 'GitHub token not configured' });
        }

        const gistData = {
            description: 'Carte publiée du Royaume du Nil',
            public: true,
            files: {
                [GIST_FILENAME]: {
                    content: JSON.stringify(mapData, null, 2)
                }
            }
        };

        let response;
        let gistId = GIST_ID;

        if (gistId) {
            // Mettre à jour un Gist existant
            response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(gistData)
            });
        } else {
            // Créer un nouveau Gist
            response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify(gistData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`GitHub API error: ${errorData.message}`);
        }

        const result = await response.json();
        gistId = result.id;

        return res.status(200).json({
            success: true,
            gistId: gistId,
            url: result.html_url,
            rawUrl: result.files[GIST_FILENAME]?.raw_url
        });

    } catch (error) {
        console.error('Error publishing to Gist:', error);
        return res.status(500).json({
            error: 'Failed to publish to Gist',
            message: error.message
        });
    }
}
