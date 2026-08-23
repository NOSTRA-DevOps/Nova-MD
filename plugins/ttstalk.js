import axios from 'axios';
import cheerio from 'cheerio';

export default {
    command: 'ttstalk',
    aliases: ['tikstalk', 'ttprofile'],
    category: 'stalk',
    description: 'Lookup TikTok user profile',
    usage: '.ttstalk <username>',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        
        if (!args.length) {
            return await sock.sendMessage(chatId, {
                text: '*Please provide a TikTok username.*\nExample: .ttstalk truepakistanofficial'
            }, { quoted: message });
        }

        const username = args[0];

        try {
            // Méthode 1: Utiliser l'API publique TikTok (via scraping)
            const profileUrl = `https://www.tiktok.com/@${username}`;
            
            const response = await axios.get(profileUrl, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            const html = response.data;
            const $ = cheerio.load(html);

            // Extraire les données du script
            let userData = null;
            const scripts = $('script').map((i, el) => $(el).html()).get();
            
            for (const script of scripts) {
                if (script && script.includes('"UserModule"')) {
                    try {
                        const match = script.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/s);
                        if (match) {
                            const data = JSON.parse(match[1]);
                            if (data?.UserModule?.users?.[username]) {
                                userData = data.UserModule.users[username];
                                break;
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }

            if (!userData) {
                // Méthode 2: Utiliser l'API alternative
                try {
                    const altApi = `https://tiktokapi.com/user/${username}`;
                    const altResponse = await axios.get(altApi, { timeout: 10000 });
                    if (altResponse.data) {
                        userData = altResponse.data;
                    }
                } catch (e) {
                    // Ignorer
                }
            }

            if (!userData) {
                return await sock.sendMessage(chatId, { 
                    text: '❌ TikTok user not found or profile is private.' 
                }, { quoted: message });
            }

            const user = userData;
            const verifiedMark = user.verified ? '✅ Verified' : '';
            
            const caption = `🎵 *TikTok Profile Info*\n\n` +
                `👤 Nickname: ${user.nickname || user.uniqueId || 'N/A'} ${verifiedMark}\n` +
                `🆔 Username: @${user.uniqueId || username}\n` +
                `📝 Bio: ${user.signature || user.bio || 'N/A'}\n` +
                `🔒 Private Account: ${user.privateAccount ? 'Yes' : 'No'}\n\n` +
                `👥 Followers: ${user.followerCount || user.fans || 0}\n` +
                `➡ Following: ${user.followingCount || user.follow || 0}\n` +
                `❤️ Likes: ${user.heartCount || user.likes || 0}\n` +
                `🎥 Videos: ${user.videoCount || user.videos || 0}\n\n` +
                `🔗 Profile URL: https://www.tiktok.com/@${user.uniqueId || username}`;

            const profileImage = user.avatarLarger || user.avatarMedium || user.avatarThumb || user.avatar;

            if (profileImage) {
                await sock.sendMessage(chatId, { 
                    image: { url: profileImage }, 
                    caption 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { 
                    text: caption 
                }, { quoted: message });
            }

        } catch (err) {
            console.error('TikTok plugin error:', err);
            
            let errorMsg = '❌ Failed to fetch TikTok profile.';
            if (err.response?.status === 404) {
                errorMsg = '❌ TikTok user not found.';
            } else if (err.response?.status === 403) {
                errorMsg = '❌ Profile is private or blocked.';
            }
            
            await sock.sendMessage(chatId, { 
                text: errorMsg 
            }, { quoted: message });
        }
    }
};