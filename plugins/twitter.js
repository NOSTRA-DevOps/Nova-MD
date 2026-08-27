import axios from 'axios';
import * as cheerio from 'cheerio';

export default {
    command: 'twitter',
    aliases: ['xtweet', 'tweetdl', 'twitterdl'],
    category: 'download',
    description: 'Download media (video or image) from X/Twitter post',
    usage: '.twitter <Tweet URL>',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const url = args?.[0];

        if (!url) {
            return await sock.sendMessage(chatId, { 
                text: '📱 *Twitter/X Downloader*\n\nPlease provide a Twitter/X URL.\nExample: .twitter https://x.com/i/status/2002054360428167305' 
            }, { quoted: message });
        }

        if (!url.includes('twitter.com') && !url.includes('x.com')) {
            return await sock.sendMessage(chatId, { 
                text: '❌ Invalid Twitter/X URL.' 
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(chatId, {
                text: '⏳ Fetching Twitter/X media...'
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

            // Extraire les métadonnées
            const title = $('meta[property="og:title"]').attr('content') || '';
            const description = $('meta[property="og:description"]').attr('content') || '';
            const author = $('meta[property="og:site_name"]').attr('content') || 'Twitter';
            
            // Extraire les médias
            const mediaUrls = [];
            
            // Vidéos
            $('video source').each((i, el) => {
                const src = $(el).attr('src');
                if (src) mediaUrls.push({ url: src, type: 'video' });
            });

            // Images
            $('img').each((i, el) => {
                const src = $(el).attr('src');
                if (src && (src.includes('media') || src.includes('pbs.twimg.com'))) {
                    mediaUrls.push({ url: src, type: 'image' });
                }
            });

            // Meta tags
            const metaVideo = $('meta[property="og:video"]').attr('content');
            if (metaVideo) mediaUrls.push({ url: metaVideo, type: 'video' });

            const metaImage = $('meta[property="og:image"]').attr('content');
            if (metaImage) mediaUrls.push({ url: metaImage, type: 'image' });

            if (mediaUrls.length === 0) {
                return await sock.sendMessage(chatId, { 
                    text: '❌ No media found for this Tweet.' 
                }, { quoted: message });
            }

            // Extraire les infos du tweet
            const authorMatch = description.match(/@([a-zA-Z0-9_]+)/);
            const authorUsername = authorMatch ? authorMatch[1] : 'Unknown';

            const caption = `📝 @${authorUsername}\n\n${title || description || 'No caption'}\n\n🔗 ${url}`;

            // Envoyer les médias
            let sentCount = 0;
            for (const media of mediaUrls.slice(0, 5)) {
                try {
                    if (media.type === 'video') {
                        await sock.sendMessage(chatId, { 
                            video: { url: media.url }, 
                            caption: sentCount === 0 ? caption : undefined 
                        }, { quoted: message });
                    } else {
                        await sock.sendMessage(chatId, { 
                            image: { url: media.url }, 
                            caption: sentCount === 0 ? caption : undefined 
                        }, { quoted: message });
                    }
                    sentCount++;
                } catch (e) {
                    console.log('Failed to send media:', e.message);
                }
            }

            if (sentCount === 0) {
                await sock.sendMessage(chatId, { 
                    text: '❌ Failed to download media.' 
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Twitter plugin error:', error);
            
            if (error.code === 'ECONNABORTED') {
                await sock.sendMessage(chatId, { 
                    text: '⏱️ Request timed out. Please try again later.' 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { 
                    text: `❌ Failed to fetch Twitter/X media.\n\nError: ${error.message}` 
                }, { quoted: message });
            }
        }
    }
};