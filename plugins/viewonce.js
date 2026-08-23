import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
    command: 'viewonce',
    aliases: ['viewmedia', 'vv', 'ib'],
    category: 'general',
    description: 'Re-send a view-once image or video (IB silent mode)',
    usage: '.viewonce (reply to a view-once media)',
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        try {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const quotedImage = quoted?.imageMessage;
            const quotedVideo = quoted?.videoMessage;

            // Vérifier si c'est un message view-once
            const isViewOnce = (quotedImage?.viewOnce || quotedVideo?.viewOnce);
            
            if (!quotedImage && !quotedVideo) {
                return await sock.sendMessage(chatId, {
                    text: '📸 *Please reply to a view-once image or video.*\n\n' +
                          '💡 *Usage:* Reply to a view-once media with `.viewonce`'
                }, { quoted: message });
            }

            if (!isViewOnce) {
                return await sock.sendMessage(chatId, {
                    text: '⚠️ *This is not a view-once message!*\n\n' +
                          '💡 The media must be marked as "view once".'
                }, { quoted: message });
            }

            // Détecter le mode IB (silencieux)
            const isIB = args[0]?.toLowerCase() === 'ib' || 
                         context.rawText?.toLowerCase().includes('ib') ||
                         args[0]?.toLowerCase() === 'silent' ||
                         context.command === 'ib';

            // Télécharger le media
            let buffer = null;
            let mediaType = '';
            let caption = '';

            if (quotedImage) {
                const stream = await downloadContentFromMessage(quotedImage, 'image');
                const chunks = [];
                for await (const chunk of stream) {
                    chunks.push(chunk);
                }
                buffer = Buffer.concat(chunks);
                mediaType = 'image';
                caption = quotedImage.caption || '';
            } else if (quotedVideo) {
                const stream = await downloadContentFromMessage(quotedVideo, 'video');
                const chunks = [];
                for await (const chunk of stream) {
                    chunks.push(chunk);
                }
                buffer = Buffer.concat(chunks);
                mediaType = 'video';
                caption = quotedVideo.caption || '';
            }

            if (!buffer) {
                // En mode IB, ne rien afficher en cas d'erreur
                if (isIB) return;
                
                return await sock.sendMessage(chatId, {
                    text: '❌ *Failed to download the view-once media.*'
                }, { quoted: message });
            }

            // === MODE IB (COMPLÈTEMENT SILENCIEUX) ===
            if (isIB) {
                // 🔇 SILENCE TOTAL - Ne rien afficher dans le chat

                // Récupérer le numéro du propriétaire
                let ownerJid = null;
                
                try {
                    const config = await import('../config.js');
                    const ownerNumber = config.default?.ownerNumber || process.env.BOT_OWNER;
                    if (ownerNumber) {
                        ownerJid = `${ownerNumber.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
                    }
                } catch (_e) {
                    // Ignorer l'erreur
                }

                // Fallback: utiliser l'expéditeur
                if (!ownerJid) {
                    ownerJid = senderId;
                }

                // Envoyer le média en privé au propriétaire
                const messageOptions = {
                    caption: `📸 *ViewOnce Media*\n\n` +
                            `📤 *Sent by:* @${senderId.split('@')[0]}\n` +
                            `📅 *Time:* ${new Date().toLocaleString()}\n` +
                            `💬 *Caption:* ${caption || 'No caption'}\n\n` +
                            `🔒 *This was a view-once message.*`
                };

                try {
                    if (mediaType === 'image') {
                        await sock.sendMessage(ownerJid, {
                            image: buffer,
                            ...messageOptions
                        });
                    } else {
                        await sock.sendMessage(ownerJid, {
                            video: buffer,
                            ...messageOptions
                        });
                    }
                    console.log(`✅ ViewOnce sent privately to ${ownerJid}`);
                } catch (_e) {
                    console.error('Failed to send viewonce in private:', _e);
                }

                // 🔇 NE RIEN RETOURNER - Le bot fait comme si rien ne s'est passé
                return;
            }

            // === MODE NORMAL (Visible dans le chat) ===
            if (mediaType === 'image') {
                await sock.sendMessage(chatId, {
                    image: buffer,
                    fileName: 'viewonce.jpg',
                    caption: `📸 *ViewOnce Image*\n\n${caption || ''}\n\n` +
                            `⚠️ *This media will NOT disappear after viewing*`
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    video: buffer,
                    fileName: 'viewonce.mp4',
                    caption: `📹 *ViewOnce Video*\n\n${caption || ''}\n\n` +
                            `⚠️ *This media will NOT disappear after viewing*`
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error in viewonceCommand:', error);
            
            // En mode IB, ne rien afficher
            const isIB = args[0]?.toLowerCase() === 'ib' || 
                         context.rawText?.toLowerCase().includes('ib') ||
                         args[0]?.toLowerCase() === 'silent' ||
                         context.command === 'ib';
            
            if (isIB) {
                return; // 🔇 Silence total
            }
            
            await sock.sendMessage(chatId, {
                text: '❌ *Failed to retrieve the view-once media.*\n\n' +
                      `Error: ${error.message}`
            }, { quoted: message });
        }
    }
};