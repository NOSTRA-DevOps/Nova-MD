import axios from 'axios';
import cheerio from 'cheerio';

export default {
    command: 'snapchat',
    aliases: ['scspot', 'snapdl'],
    category: 'download',
    description: 'Download media (video or image) from Snapchat Spotlight URL',
    usage: '.snapchat <Snapchat URL>',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo, rawText } = context;
        const prefix = context.rawText.match(/^[.!#]/)?.[0] || '.';
        const commandPart = rawText.slice(prefix.length).trim();
        const parts = commandPart.split(/\s+/);
        const url = parts.slice(1).join(' ').trim();

        if (!url) {
            return await sock.sendMessage(chatId, {
                text: '📸 *Please provide a Snapchat Spotlight URL.*\n\nExample: .snapchat https://www.snapchat.com/spotlight/...',
                ...channelInfo
            }, { quoted: message });
        }

        // Vérifier si c'est un lien Snapchat valide
        if (!url.includes('snapchat.com')) {
            return await sock.sendMessage(chatId, {
                text: '❌ *Invalid Snapchat URL!*\n\nPlease provide a valid Snapchat Spotlight URL.',
                ...channelInfo
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(chatId, {
                text: '⏳ *Fetching Snapchat media...*',
                ...channelInfo
            }, { quoted: message });

            // Méthode 1: Essayer de récupérer via oEmbed (si disponible)
            try {
                const oEmbedUrl = `https://snapchat.com/oembed?url=${encodeURIComponent(url)}`;
                const oEmbedResponse = await axios.get(oEmbedUrl, {
                    timeout: 10000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                });

                if (oEmbedResponse.data && oEmbedResponse.data.thumbnail_url) {
                    // Si c'est une image
                    await sock.sendMessage(chatId, {
                        image: { url: oEmbedResponse.data.thumbnail_url },
                        caption: `📸 *Snapchat Spotlight*\n\n${oEmbedResponse.data.title || ''}\n\n${oEmbedResponse.data.author_name ? `👤 By: ${oEmbedResponse.data.author_name}` : ''}`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            } catch (oEmbedError) {
                console.log('oEmbed failed, trying alternative method...');
            }

            // Méthode 2: Scraper la page pour trouver les médias
            try {
                const response = await axios.get(url, {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                    }
                });

                const html = response.data;
                const $ = cheerio.load(html);

                // Chercher les vidéos
                const videoSources = [];
                $('video source').each((i, el) => {
                    const src = $(el).attr('src');
                    if (src) videoSources.push(src);
                });

                // Chercher les images
                const imageSources = [];
                $('img').each((i, el) => {
                    const src = $(el).attr('src');
                    if (src && (src.includes('snapchat') || src.includes('media'))) {
                        imageSources.push(src);
                    }
                });

                // Chercher dans les meta tags
                const metaVideo = $('meta[property="og:video"]').attr('content');
                if (metaVideo) videoSources.push(metaVideo);

                const metaImage = $('meta[property="og:image"]').attr('content');
                if (metaImage) imageSources.push(metaImage);

                // Chercher dans les scripts
                const scripts = $('script').map((i, el) => $(el).html()).get();
                let extractedMedia = [];
                for (const script of scripts) {
                    if (script && script.includes('video')) {
                        const videoMatch = script.match(/video["']?\s*[:=]\s*["']([^"']+)["']/i);
                        if (videoMatch) videoSources.push(videoMatch[1]);
                    }
                    if (script && script.includes('image') || script.includes('thumbnail')) {
                        const imageMatch = script.match(/(?:image|thumbnail)["']?\s*[:=]\s*["']([^"']+)["']/i);
                        if (imageMatch) imageSources.push(imageMatch[1]);
                    }
                }

                // Filtrer les URLs
                const validVideos = videoSources.filter(src => 
                    src && src.startsWith('http') && 
                    (src.includes('.mp4') || src.includes('.mov') || src.includes('video'))
                );

                const validImages = imageSources.filter(src => 
                    src && src.startsWith('http') && 
                    (src.includes('.jpg') || src.includes('.png') || src.includes('.jpeg') || src.includes('.webp'))
                );

                if (validVideos.length === 0 && validImages.length === 0) {
                    return await sock.sendMessage(chatId, {
                        text: '❌ *No media found for this Snapchat Spotlight URL.*\n\n' +
                              '⚠️ Snapchat may require a different approach. Try using the official app.',
                        ...channelInfo
                    }, { quoted: message });
                }

                // Envoyer les vidéos
                for (const videoUrl of validVideos.slice(0, 3)) {
                    await sock.sendMessage(chatId, {
                        video: { url: videoUrl },
                        caption: '📹 *Snapchat Spotlight Video*',
                        ...channelInfo
                    }, { quoted: message });
                }

                // Envoyer les images
                for (const imageUrl of validImages.slice(0, 3)) {
                    await sock.sendMessage(chatId, {
                        image: { url: imageUrl },
                        caption: '🖼 *Snapchat Spotlight Image*',
                        ...channelInfo
                    }, { quoted: message });
                }

                if (validVideos.length === 0 && validImages.length > 0) {
                    await sock.sendMessage(chatId, {
                        text: `✅ *Found ${validImages.length} image(s)*`,
                        ...channelInfo
                    }, { quoted: message });
                } else if (validVideos.length > 0 && validImages.length === 0) {
                    await sock.sendMessage(chatId, {
                        text: `✅ *Found ${validVideos.length} video(s)*`,
                        ...channelInfo
                    }, { quoted: message });
                }

            } catch (scrapeError) {
                console.error('Scraping failed:', scrapeError.message);
                
                // Méthode 3: Essayer avec l'API alternative
                try {
                    const apiUrls = [
                        `https://snapvid.com/api?url=${encodeURIComponent(url)}`,
                        `https://snapdownloader.com/api?url=${encodeURIComponent(url)}`
                    ];

                    for (const apiUrl of apiUrls) {
                        try {
                            const apiResponse = await axios.get(apiUrl, {
                                timeout: 10000,
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                                }
                            });

                            if (apiResponse.data && apiResponse.data.url) {
                                await sock.sendMessage(chatId, {
                                    video: { url: apiResponse.data.url },
                                    caption: '📹 *Snapchat Spotlight Video*',
                                    ...channelInfo
                                }, { quoted: message });
                                return;
                            }
                        } catch (e) {
                            continue;
                        }
                    }
                } catch (apiError) {
                    console.error('All methods failed:', apiError.message);
                }

                return await sock.sendMessage(chatId, {
                    text: '❌ *Unable to download Snapchat media.*\n\n' +
                          '💡 *Try these alternatives:*\n' +
                          '• Use the Snapchat app directly\n' +
                          '• Search for a Snapchat downloader website\n' +
                          '• Try again with a different URL',
                    ...channelInfo
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Snapchat plugin error:', error.message);
            await sock.sendMessage(chatId, {
                text: `❌ *Failed to fetch Snapchat media.*\n\nError: ${error.message}\n\n💡 Try using the Snapchat app directly.`,
                ...channelInfo
            }, { quoted: message });
        }
    }
};