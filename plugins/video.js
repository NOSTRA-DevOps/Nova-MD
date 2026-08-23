import yts from 'yt-search';
import ytdl from 'ytdl-core';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    command: 'video',
    aliases: ['ytmp4', 'ytvideo', 'ytdl'],
    category: 'download',
    description: 'Download YouTube videos by link or search',
    usage: '.video <youtube link | search query>',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const query = args.join(' ').trim();

        if (!query) {
            return sock.sendMessage(chatId, { 
                text: '🎥 *What video do you want to download?*\nExample:\n.video Alan Walker Faded' 
            }, { quoted: message });
        }

        try {
            let videoUrl;
            let videoTitle;
            let videoThumbnail;
            let videoDuration;

            // Vérifier si c'est un lien ou une recherche
            if (query.startsWith('http://') || query.startsWith('https://')) {
                videoUrl = query;
                
                // Valider le lien YouTube
                const validYT = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
                if (!validYT) {
                    return sock.sendMessage(chatId, { 
                        text: '❌ Not a valid YouTube link!' 
                    }, { quoted: message });
                }

                // Obtenir les infos
                try {
                    const info = await ytdl.getInfo(videoUrl);
                    videoTitle = info.videoDetails.title;
                    videoThumbnail = info.videoDetails.thumbnails[0]?.url;
                    videoDuration = info.videoDetails.lengthSeconds;
                } catch (e) {
                    // Si on ne peut pas obtenir les infos, utiliser le lien
                }
            } else {
                // Recherche YouTube
                const { videos } = await yts(query);
                if (!videos?.length) {
                    return sock.sendMessage(chatId, { 
                        text: '❌ No videos found!' 
                    }, { quoted: message });
                }
                
                videoUrl = videos[0].url;
                videoTitle = videos[0].title;
                videoThumbnail = videos[0].thumbnail;
                videoDuration = videos[0].duration.seconds;
            }

            // Valider le lien YouTube
            const validYT = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([a-zA-Z0-9_-]{11})/);
            if (!validYT) {
                return sock.sendMessage(chatId, { 
                    text: '❌ Not a valid YouTube link!' 
                }, { quoted: message });
            }

            const ytId = validYT[1];
            const thumb = videoThumbnail || `https://i.ytimg.com/vi/${ytId}/sddefault.jpg`;

            // Envoyer le message de progression
            await sock.sendMessage(chatId, {
                image: { url: thumb },
                caption: `🎬 *${videoTitle || query}*\n⬇️ Downloading... *(may take up to 60s)*`
            }, { quoted: message });

            // Télécharger la vidéo
            const videoBuffer = await downloadVideo(videoUrl);

            // Formater la durée
            let durationFormatted = 'Unknown';
            if (videoDuration) {
                const mins = Math.floor(videoDuration / 60);
                const secs = videoDuration % 60;
                durationFormatted = `${mins}:${String(secs).padStart(2, '0')}`;
            }

            await sock.sendMessage(chatId, {
                video: videoBuffer,
                mimetype: 'video/mp4',
                fileName: `${sanitizeFileName(videoTitle || 'video')}.mp4`,
                caption: `🎬 *${videoTitle || 'Video'}*\n⏱️ ${durationFormatted}\n\n> *_Downloaded by NOVA-MD_*`
            }, { quoted: message });

        } catch (err) {
            console.error('[VIDEO] Error:', err.message);
            
            let errorMessage = '❌ Download failed!';
            if (err.message.includes('No video found')) {
                errorMessage = '❌ Video not found or unavailable.';
            } else if (err.message.includes('parse')) {
                errorMessage = '❌ Error parsing video. Try another.';
            } else if (err.message.includes('timeout')) {
                errorMessage = '⏰ Download timed out. Try again later.';
            } else {
                errorMessage += `\nReason: ${err.message}`;
            }
            
            await sock.sendMessage(chatId, { 
                text: errorMessage 
            }, { quoted: message });
        }
    }
};

// ============================================================
// FONCTIONS DE TÉLÉCHARGEMENT
// ============================================================

/**
 * Télécharger une vidéo YouTube
 */
async function downloadVideo(url) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let timeout;

        try {
            // Configurer le timeout
            timeout = setTimeout(() => {
                reject(new Error('Download timeout'));
            }, 120000);

            const stream = ytdl(url, {
                quality: 'highestvideo',
                filter: 'videoandaudio',
                highWaterMark: 1 << 25 // 32MB
            });

            stream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            stream.on('end', () => {
                clearTimeout(timeout);
                const buffer = Buffer.concat(chunks);
                if (buffer.length < 1024) {
                    reject(new Error('Downloaded file is too small'));
                } else {
                    resolve(buffer);
                }
            });

            stream.on('error', (err) => {
                clearTimeout(timeout);
                reject(err);
            });

        } catch (err) {
            clearTimeout(timeout);
            reject(err);
        }
    });
}

/**
 * Nettoyer le nom du fichier
 */
function sanitizeFileName(name) {
    return name
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 200);
}

// ============================================================
// VERSION ALTERNATIVE: TÉLÉCHARGEMENT PAR MORCEAUX
// ============================================================

/**
 * Alternative: Télécharger la vidéo avec gestion de la taille
 */
async function downloadVideoChunked(url) {
    return new Promise(async (resolve, reject) => {
        try {
            // Obtenir les infos de la vidéo
            const info = await ytdl.getInfo(url);
            
            // Choisir le format le plus adapté
            const format = ytdl.chooseFormat(info.formats, { 
                quality: 'highestvideo',
                filter: 'videoandaudio'
            });

            if (!format) {
                // Fallback: séparer video et audio
                const videoFormat = ytdl.chooseFormat(info.formats, { 
                    quality: 'highestvideo',
                    filter: 'videoonly'
                });
                const audioFormat = ytdl.chooseFormat(info.formats, { 
                    quality: 'highestaudio',
                    filter: 'audioonly'
                });

                if (videoFormat && audioFormat) {
                    // Télécharger séparément
                    const videoBuffer = await downloadStream(videoFormat.url);
                    const audioBuffer = await downloadStream(audioFormat.url);
                    // Fusionner (nécessite ffmpeg)
                    resolve(await mergeVideoAudio(videoBuffer, audioBuffer));
                } else {
                    reject(new Error('No suitable format found'));
                }
            } else {
                // Télécharger directement
                const buffer = await downloadStream(format.url);
                resolve(buffer);
            }
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Télécharger un stream
 */
function downloadStream(url) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const stream = ytdl.downloadFromInfo(url);
        
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

/**
 * Fusionner video et audio (nécessite ffmpeg)
 */
async function mergeVideoAudio(videoBuffer, audioBuffer) {
    // Cette fonction nécessite fluent-ffmpeg
    // Pour une version simple, on renvoie la vidéo seule
    return videoBuffer;
}