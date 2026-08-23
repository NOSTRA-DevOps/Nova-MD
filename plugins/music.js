import axios from 'axios';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MUSICA_API = 'https://discord.st/api/search';

function cleanFileName(name) {
    return name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 100);
}

export default {
    command: 'music',
    aliases: ['musica', 'discord', 'm'],
    category: 'music',
    description: 'Download a song from Música (discord.st) - 320kbps',
    usage: '.music <song name>',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const query = args.join(' ').trim();

        if (!query) {
            return sock.sendMessage(chatId, {
                text: `🎵 *MÚSICA DOWNLOADER*\n\n` +
                      `📌 *Usage:* .music <song name>\n` +
                      `📌 *Example:* .music Despacito\n\n` +
                      `🎚️ *Quality:* 320kbps\n` +
                      `📡 *Source:* Música (discord.st)\n` +
                      `💸 *Cost:* 100% FREE`
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(chatId, { 
                text: `🔍 *Searching Música:* ${query}\n⏳ Please wait...` 
            }, { quoted: message });

            const response = await axios.get(MUSICA_API, {
                params: { q: query },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                },
                timeout: 15000
            });

            if (!response.data || !response.data.length) {
                return sock.sendMessage(chatId, { 
                    text: '❌ *No results found on Música!*' 
                }, { quoted: message });
            }

            // Si plusieurs résultats
            if (response.data.length > 1) {
                let listText = `🎵 *MÚSICA RESULTS*\n\n`;
                const tracks = response.data.slice(0, 5);
                for (let i = 0; i < tracks.length; i++) {
                    const track = tracks[i];
                    const duration = track.duration || 'Unknown';
                    listText += `${i + 1}. *${track.title || 'Unknown'}*\n`;
                    listText += `   🎤 ${track.artist || 'Unknown'}\n`;
                    listText += `   ⏱️ ${duration}s\n\n`;
                }
                listText += `📌 *To download:* \`.music ${query} <number>\``;
                
                // Sauvegarder les résultats
                global.musicaResults = response.data;
                
                return sock.sendMessage(chatId, { 
                    text: listText 
                }, { quoted: message });
            }

            // Un seul résultat
            const track = response.data[0];
            await downloadAndSendTrack(sock, chatId, track, message);

        } catch (err) {
            console.error('Music error:', err.message);
            await sock.sendMessage(chatId, { 
                text: `❌ *Failed:* ${err.message}` 
            }, { quoted: message });
        }
    }
};

// Fonction pour télécharger et envoyer
async function downloadAndSendTrack(sock, chatId, track, message) {
    try {
        if (!track.url) {
            throw new Error('No download URL available');
        }

        const title = track.title || 'Unknown Title';
        const artist = track.artist || 'Unknown Artist';
        const duration = track.duration || 0;

        await sock.sendMessage(chatId, {
            text: `✅ *Found:* ${title}\n🎤 ${artist}\n⏱️ ${duration}s\n\n⏳ *Downloading from Música...*`
        }, { quoted: message });

        // Télécharger la miniature
        let thumbnailBuffer;
        if (track.thumbnail || track.image) {
            try {
                const img = await axios.get(track.thumbnail || track.image, {
                    responseType: 'arraybuffer',
                    timeout: 10000
                });
                thumbnailBuffer = Buffer.from(img.data);
            } catch {}
        }

        // Télécharger l'audio
        const audioResponse = await axios.get(track.url, {
            responseType: 'arraybuffer',
            timeout: 60000
        });

        const audioBuffer = Buffer.from(audioResponse.data);

        await sock.sendMessage(chatId, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            fileName: `${cleanFileName(title)}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: `${artist} • ${duration}s`,
                    thumbnail: thumbnailBuffer,
                    mediaType: 2,
                    sourceUrl: track.url
                }
            }
        }, { quoted: message });

    } catch (error) {
        console.error('Download error:', error.message);
        throw error;
    }
}

// Commande pour télécharger par numéro
export const musicNumber = {
    command: 'music',
    aliases: ['m'],
    category: 'music',
    description: 'Download a Música song by number from search results',
    usage: '.music <number>',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const number = parseInt(args[0]);

        if (!global.musicaResults || !global.musicaResults.length) {
            return sock.sendMessage(chatId, {
                text: '❌ *No search results found!*\n\n💡 Search first with: `.music <song name>`'
            }, { quoted: message });
        }

        if (isNaN(number) || number < 1 || number > global.musicaResults.length) {
            return sock.sendMessage(chatId, {
                text: `❌ *Invalid number!*\n\n💡 Choose between 1 and ${global.musicaResults.length}`
            }, { quoted: message });
        }

        const track = global.musicaResults[number - 1];
        await downloadAndSendTrack(sock, chatId, track, message);
        
        // Nettoyer les résultats
        delete global.musicaResults;
    }
};