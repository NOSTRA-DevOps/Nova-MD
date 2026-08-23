import axios from 'axios';

export default {
    command: 'github',
    aliases: ['ghprofile', 'gh'],
    category: 'stalk',
    description: 'Lookup GitHub user profile',
    usage: '.github <username>',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        
        if (!args.length) {
            return await sock.sendMessage(chatId, {
                text: '*Please provide a GitHub username.*\nExample: .github labokingfreesurf'
            }, { quoted: message });
        }

        const username = args[0];

        try {
            // Utiliser l'API GitHub directement
            const apiUrl = `https://api.github.com/users/${username}`;
            const { data } = await axios.get(apiUrl, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'NOVA-MD-Bot',
                    'Accept': 'application/json'
                }
            });

            if (!data || !data.login) {
                return await sock.sendMessage(chatId, { 
                    text: '❌ GitHub user not found.' 
                }, { quoted: message });
            }

            // Récupérer les repos pour avoir plus d'infos
            let reposCount = data.public_repos || 0;
            let starsCount = 0;
            let forksCount = 0;
            
            try {
                const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;
                const reposResponse = await axios.get(reposUrl, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'NOVA-MD-Bot',
                        'Accept': 'application/json'
                    }
                });
                
                if (reposResponse.data && Array.isArray(reposResponse.data)) {
                    starsCount = reposResponse.data.reduce((acc, repo) => acc + repo.stargazers_count, 0);
                    forksCount = reposResponse.data.reduce((acc, repo) => acc + repo.forks_count, 0);
                }
            } catch (repoError) {
                console.log('Could not fetch repo stats:', repoError.message);
            }

            const caption = `🐙 *GitHub Profile Info*\n\n` +
                `👤 Name: ${data.name || 'N/A'}\n` +
                `🆔 Username: ${data.login || 'N/A'}\n` +
                `🏢 Company: ${data.company || 'N/A'}\n` +
                `📍 Location: ${data.location || 'N/A'}\n` +
                `💬 Bio: ${data.bio || 'N/A'}\n` +
                `📦 Public Repos: ${data.public_repos || 0}\n` +
                `⭐ Total Stars: ${starsCount || 0}\n` +
                `🔱 Total Forks: ${forksCount || 0}\n` +
                `👥 Followers: ${data.followers || 0}\n` +
                `➡ Following: ${data.following || 0}\n` +
                `🔗 Profile URL: ${data.html_url || 'N/A'}\n` +
                `📅 Created: ${data.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A'}\n` +
                `🕒 Updated: ${data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'N/A'}`;

            // Envoyer avec la photo de profil si disponible
            if (data.avatar_url) {
                await sock.sendMessage(chatId, { 
                    image: { url: data.avatar_url }, 
                    caption 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { text: caption }, { quoted: message });
            }

        } catch (err) {
            console.error('GitHub plugin error:', err);
            
            let errorMessage = '❌ Failed to fetch GitHub profile.';
            if (err.response?.status === 404) {
                errorMessage = '❌ GitHub user not found.';
            } else if (err.response?.status === 403) {
                errorMessage = '❌ API rate limit exceeded. Please try again later.';
            } else if (err.code === 'ECONNABORTED') {
                errorMessage = '⏰ Request timeout. Please try again.';
            }
            
            await sock.sendMessage(chatId, { 
                text: errorMessage 
            }, { quoted: message });
        }
    }
};