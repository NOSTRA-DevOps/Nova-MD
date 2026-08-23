import isOwnerOrSudo from '../lib/isOwner.js';

export default {
    command: 'tagall',
    aliases: ['everyone', 'all', 'mentionall'],
    category: 'admin',
    description: 'Tag all group members (silent mode with * )',
    usage: '.tagall [message|*]',
    groupOnly: true,
    adminOnly: true,
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        
        try {
            const groupMetadata = await sock.groupMetadata(chatId);
            const participants = groupMetadata.participants;
            
            if (!participants || participants.length === 0) {
                await sock.sendMessage(chatId, {
                    text: '❌ No participants found in the group.',
                    ...channelInfo
                }, { quoted: message });
                return;
            }

            const mentionIds = participants.map((p) => p.id);
            const fullMessage = args.join(' ');
            const firstArg = args[0] || '';
            const senderId = message.key.participant || message.key.remoteJid;
            const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
            const isFromMe = message.key.fromMe;

            // ============================================================
            // MODE 1: * SEUL - Pour le propriétaire uniquement
            // ============================================================
            if (fullMessage === '*') {
                if (!isOwner && !isFromMe) {
                    await sock.sendMessage(chatId, {
                        text: '❌ *Silent mode (*) is only available for the bot owner!*\n\n' +
                              `💡 *Admin use:* \`.tagall * message\``,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                // Mode silencieux pour owner
                await sock.sendMessage(chatId, {
                    mentions: mentionIds
                });
                return;
            }

            // ============================================================
            // MODE 2: .tagall * message - Pour les admins (et owner aussi)
            // ============================================================
            if (firstArg === '*' && args.length > 1) {
                const msg = args.slice(1).join(' ');
                await sock.sendMessage(chatId, {
                    text: msg,
                    mentions: mentionIds,
                    ...channelInfo
                });
                return;
            }

            // ============================================================
            // MODE 3: .tagall * - Silencieux sans message (pour admins)
            // ============================================================
            if (firstArg === '*' && args.length === 1) {
                await sock.sendMessage(chatId, {
                    mentions: mentionIds
                });
                return;
            }

            // ============================================================
            // MODE 4: NORMAL - Affiche tous les @
            // ============================================================
            let text = `${fullMessage || '🔊 *Hello Everyone:*'}\n\n`;
            participants.forEach((participant) => {
                text += `@${participant.id.split('@')[0]}\n`;
            });

            await sock.sendMessage(chatId, {
                text,
                mentions: mentionIds,
                ...channelInfo
            });

        } catch (error) {
            console.error('Error in tagall command:', error);
            await sock.sendMessage(chatId, {
                text: '❌ Failed to tag all members.',
                ...channelInfo
            }, { quoted: message });
        }
    }
};