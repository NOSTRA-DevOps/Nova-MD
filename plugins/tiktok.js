import axios from 'axios';
import cheerio from 'cheerio';

export default {
    command: 'tiktok',
    aliases: ['tt', 'ttdl', 'tiktokdl'],
    category: 'download',
    description: 'Download TikTok video without watermark',
    usage: '.tiktok <TikTok URL>',
    async handler(sock, message, args, context) {
        const { chatId, rawText } = context;
        const prefix = rawText.match(/^[.!#]/)?.[0] || '.';
        const commandPart = rawText.slice(prefix.length).trim();
        const parts = commandPart.split(/\s+/);
        const url = parts.slice(1).join(' ').trim();

        if (!url) {
            return await sock.sendMessage(chatId, {
                text: '🎵 *TikTok Downloader*\n\nPlease provide a TikTok URL.\nExample:\n.tiktok https://vm.tiktok.com/XXXX'
            }, { quoted: message });
        }

        if (!url.includes('tiktok.com')) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid TikTok URL.'
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(chatId, {
                text: '⏳ Downloading TikTok video...'
            }, { quoted: message });

            // Méthode 1: Scraper la page
            const response = await axios.get(url, {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });

            const html = response.data;
            const $ = cheerio.load(html);

            // Extraire les données du script
            let videoData = null;
            const scripts = $('script').map((i, el) => $(el).html()).get();
            
            for (const script of scripts) {
                if (script && script.includes('"videoData"')) {
                    try {
                        const match = script.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/s);
                        if (match) {
                            const data = JSON.parse(match[1]);
                            if (data?.videoData) {
                                videoData = data.videoData;
                                break;
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }

            // Extraire les métadonnées
            const title = $('meta[property="og:title"]').attr('content') || 'TikTok Video';
            const description = $('meta[property="og:description"]').attr('content') || '';
            
            // Extraire la vidéo
            let videoUrl = null;
            
            // Chercher dans les meta tags
            const metaVideo = $('meta[property="og:video"]').attr('content');
            if (metaVideo) videoUrl = metaVideo;

            // Chercher dans les vidéos
            if (!videoUrl) {
                $('video source').each((i, el) => {
                    const src = $(el).attr('src');
                    if (src && src.includes('tiktok')) {
                        videoUrl = src;
                        return false;
                    }
                });
            }

            if (!videoUrl) {
                return await sock.sendMessage(chatId, {
                    text: '❌ No video found for this TikTok URL.'
                }, { quoted: message });
            }

            // Extraire les stats
            const stats = {
                likes: '0',
                comments: '0',
                shares: '0',
                views: '0'
            };

            // Chercher les stats dans le HTML
            const statText = html.match(/"stats":\s*{([^}]*)}/);
            if (statText) {
                try {
                    const statsData = JSON.parse(`{${statText[1]}}`);
                    stats.likes = statsData.diggCount || statsData.likes || '0';
                    stats.comments = statsData.commentCount || statsData.comments || '0';
                    stats.shares = statsData.shareCount || statsData.shares || '0';
                    stats.views = statsData.playCount || statsData.views || '0';
                } catch (e) {}
            }

            // Extraire l'auteur
            let author = 'Unknown';
            const authorMatch = html.match(/@([a-zA-Z0-9_.]+)/);
            if (authorMatch) author = authorMatch[1];

            const caption = `🎵 *TikTok Downloader*
━━━━━━━━━━━━━━━━━━━
👤 *User:* @${author}
❤️ *Likes:* ${stats.likes}
💬 *Comments:* ${stats.comments}
🔁 *Shares:* ${stats.shares}
👀 *Views:* ${stats.views}
━━━━━━━━━━━━━━━━━━━
📝 *Caption:*
${description || title || 'No caption'}
━━━━━━━━━━━━━━━━━━━
✨ *Quality:* No Watermark`;

            await sock.sendMessage(chatId, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption
            }, { quoted: message });

        } catch (error) {
            console.error('TikTok plugin error:', error);
            
            if (error.code === 'ECONNABORTED') {
                await sock.sendMessage(chatId, {
                    text: '⏱️ Request timed out. Please try again later.'
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: `❌ Failed to download TikTok video.\n\nError: ${error.message}`
                }, { quoted: message });
            }
        }
    }
};