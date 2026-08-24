import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    command: 'about',
    aliases: ['info', 'botinfo', 'status', 'panel'],
    category: 'general',
    description: 'Afficher les informations du bot',
    usage: '.about',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        
        try {
            // Récupérer les informations
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            // Récupérer le mode du bot (si disponible)
            let botMode = 'public';
            try {
                if (global.store && typeof global.store.getBotMode === 'function') {
                    botMode = await global.store.getBotMode();
                } else if (global.db && typeof global.db.getBotMode === 'function') {
                    botMode = await global.db.getBotMode();
                }
            } catch (e) {
                botMode = 'public';
            }

            // Récupérer le nombre de plugins
            let pluginsCount = 0;
            try {
                if (global.commandHandler && global.commandHandler.commands) {
                    pluginsCount = global.commandHandler.commands.size;
                } else if (global.commands) {
                    pluginsCount = global.commands.size || Object.keys(global.commands).length;
                }
            } catch (e) {
                pluginsCount = 0;
            }

            // Récupérer le type de stockage
            let storageType = 'local';
            try {
                if (global.store && typeof global.store.getStats === 'function') {
                    const stats = global.store.getStats();
                    storageType = stats.backend || 'local';
                }
            } catch (e) {
                storageType = 'local';
            }

            // Récupérer les préfixes
            let prefixes = ['.'];
            try {
                if (global.config && global.config.prefixes) {
                    prefixes = global.config.prefixes;
                } else if (context && context.config && context.config.prefixes) {
                    prefixes = context.config.prefixes;
                }
            } catch (e) {
                prefixes = ['.'];
            }

            // Récupérer le nom du bot
            let botName = 'NOVA-MD';
            try {
                if (global.config && global.config.botName) {
                    botName = global.config.botName;
                } else if (context && context.config && context.config.botName) {
                    botName = context.config.botName;
                }
            } catch (e) {
                botName = 'NOVA-MD';
            }

            // Récupérer la version
            let version = '2.0.0';
            try {
                if (global.config && global.config.version) {
                    version = global.config.version;
                } else if (context && context.config && context.config.version) {
                    version = context.config.version;
                }
            } catch (e) {
                version = '2.0.0';
            }

            // Récupérer le numéro du bot
            let botNumber = 'N/A';
            try {
                if (sock && sock.user && sock.user.id) {
                    botNumber = sock.user.id.split(':')[0];
                }
            } catch (e) {
                botNumber = 'N/A';
            }

            // Construction du message
            let aboutText = `╭━━━━『 *${botName}* 』━━⬣\n`;
            aboutText += `┃\n`;
            aboutText += `┃ ✨ *Status:* ✅ ONLINE\n`;
            aboutText += `┃ 🤖 *Version:* ${version} (Stable)\n`;
            aboutText += `┃ 📱 *Bot Number:* ${botNumber}\n`;
            aboutText += `┃ ⚙️ *Mode:* ${botMode.toUpperCase()}\n`;
            aboutText += `┃ ⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s\n`;
            aboutText += `┃ 📊 *Prefixes:* ${prefixes.join(' ')}\n`;
            aboutText += `┃ 📦 *Plugins:* ${pluginsCount}\n`;
            aboutText += `┃ 💾 *Storage:* ${storageType.toUpperCase()}\n`;
            aboutText += `┃\n`;
            aboutText += `┃━━━━━━━━━━━━━━━━━━⬣\n`;
            aboutText += `┃\n`;
            aboutText += `┃ 🌐 *JOIN CHANNELS*\n`;
            aboutText += `┃\n`;
            aboutText += `┃ 💬 *FaceBook:*\n`;
            aboutText += `┃ https://www.facebook.com/profile.php?id=61591828051151\n`;
            aboutText += `┃\n`;
            aboutText += `┃ 📱 *Telegram:*\n`;
            aboutText += `┃ https://t.me/addlist/CpQzYQfWwwxmYTk0\n`;
            aboutText += `┃\n`;
            aboutText += `┃ ▶️ *YouTube:*\n`;
            aboutText += `┃ https://youtube.com/@labokingfreesurf\n`;
            aboutText += `┃\n`;
            aboutText += `┃━━━━━━━━━━━━━━━━━━⬣\n`;
            aboutText += `┃\n`;
            aboutText += `┃ ✨ _Powered by NOSTRA._\n`;
            aboutText += `╰━━━━━━━━━━━━━━━━━━⬣`;

            // Essayer d'envoyer avec logo
            let logoBuffer = null;
            
            // 1. Essayer de charger depuis URL
            try {
                const LOGO_URL = "https://raw.githubusercontent.com/NOSTRA-DevOps/Nova-MD/refs/heads/main/assets/logo.PNG";
                const response = await fetch(LOGO_URL);
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    logoBuffer = Buffer.from(arrayBuffer);
                }
            } catch (_e) {
                // Ignorer l'erreur
            }

            // 2. Si pas de logo, essayer local
            if (!logoBuffer) {
                try {
                    const localLogoPath = path.join(process.cwd(), "assets", "logo.PNG");
                    if (fs.existsSync(localLogoPath)) {
                        logoBuffer = fs.readFileSync(localLogoPath);
                    }
                } catch (_e) {
                    // Ignorer l'erreur
                }
            }

            // 3. Si pas de logo, essayer depuis le dossier courant
            if (!logoBuffer) {
                try {
                    const logoPaths = [
                        path.join(process.cwd(), "logo.png"),
                        path.join(process.cwd(), "logo.jpg"),
                        path.join(process.cwd(), "assets", "logo.jpg"),
                        path.join(process.cwd(), "media", "logo.png"),
                    ];
                    for (const logoPath of logoPaths) {
                        if (fs.existsSync(logoPath)) {
                            logoBuffer = fs.readFileSync(logoPath);
                            break;
                        }
                    }
                } catch (_e) {
                    // Ignorer l'erreur
                }
            }

            // Envoyer le message
            if (logoBuffer) {
                await sock.sendMessage(chatId, {
                    image: logoBuffer,
                    caption: aboutText,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363429019355682@newsletter",
                            newsletterName: "NOSTRA",
                            serverMessageId: -1,
                        },
                    },
                }, { quoted: message });
            } else {
                // Envoyer sans logo
                await sock.sendMessage(chatId, {
                    text: aboutText
                }, { quoted: message });
            }

        } catch (error) {
            console.error('About Command Error:', error);
            
            // Message de fallback
            const fallbackText = `╭━━━━『 *BOT INFO* 』━━⬣\n` +
                `┃\n` +
                `┃ ✨ *Status:* ✅ ONLINE\n` +
                `┃ ⏰ *Uptime:* ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m\n` +
                `┃\n` +
                `┃━━━━━━━━━━━━━━━━━━⬣\n` +
                `┃\n` +
                `┃ ✨ _Powered by NOSTRA._\n` +
                `╰━━━━━━━━━━━━━━━━━━⬣`;

            await sock.sendMessage(chatId, {
                text: fallbackText
            }, { quoted: message });
        }
    }
};