// plugins/chatbot.js - Commande pour activer/désactiver par groupe
import { loadUserGroupData, saveUserGroupData } from '../lib/Chatbots.js';
import chatbotConfig from '../lib/chatbotConfig.js';
import isOwnerOrSudo from '../lib/isOwner.js';
import isAdmin from '../lib/isAdmin.js';

export default {
    command: 'chatbot',
    aliases: ['bot', 'ai'],
    category: 'admin',
    description: 'Enable or disable AI chatbot for this group',
    usage: '.chatbot <on|off|status>',
    // ⚠️ PAS de groupOnly: true pour que le status fonctionne en DM
    adminOnly: false, // On gère les permissions manuellement
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        const isFromMe = message.key.fromMe;
        const isOwnerOrSudoCheck = isFromMe || isOwner;
        
        const match = args.join(' ').toLowerCase();

        // Vérifier si le chatbot global est activé
        if (!chatbotConfig.get('enabled')) {
            return sock.sendMessage(chatId, {
                text: '❌ *Chatbot is globally disabled by the owner!*\n\n' +
                      'Contact the owner to enable it with: `.cbc enable`',
                quoted: message
            });
        }

        // === EN DM ===
        if (!isGroup) {
            // En DM, seul le propriétaire peut gérer
            if (!isOwnerOrSudoCheck) {
                return sock.sendMessage(chatId, {
                    text: '❌ *You are not authorized to configure the chatbot!*\n\n' +
                          'Contact the bot owner.',
                    quoted: message
                });
            }

            if (!match || match === 'status') {
                const isEnabled = chatbotConfig.get('enabled');
                return sock.sendMessage(chatId, {
                    text: `*🤖 CHATBOT STATUS*\n\n` +
                          `📊 Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                          `📱 Mode: DM (Private)\n` +
                          `🌐 Global: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                          `📌 *Commands:*\n` +
                          `• \`.cbc enable|disable\` - Global toggle\n` +
                          `• \`.cbc status\` - View full config`,
                    quoted: message
                });
            }

            if (match === 'on') {
                chatbotConfig.set('enabled', true);
                return sock.sendMessage(chatId, {
                    text: '✅ *Chatbot enabled globally!*\n\n' +
                          `💡 You can now chat with me.`,
                    quoted: message
                });
            }

            if (match === 'off') {
                chatbotConfig.set('enabled', false);
                return sock.sendMessage(chatId, {
                    text: '❌ *Chatbot disabled globally!*',
                    quoted: message
                });
            }

            return sock.sendMessage(chatId, {
                text: '❌ Use: `.chatbot on`, `.chatbot off` or `.chatbot status`',
                quoted: message
            });
        }

        // === EN GROUPE ===
        // Vérifier que l'utilisateur est admin du groupe
        const isGroupAdmin = await isAdmin(sock, chatId, senderId);
        
        // Seuls les admins et le propriétaire peuvent configurer le chatbot
        if (!isGroupAdmin && !isOwnerOrSudoCheck) {
            return sock.sendMessage(chatId, {
                text: '❌ *Only group admins can configure the chatbot!*',
                quoted: message
            });
        }

        const data = await loadUserGroupData();

        if (!match || match === 'status') {
            const isEnabled = data.chatbot[chatId] || false;
            
            return sock.sendMessage(chatId, {
                text: `*🤖 CHATBOT STATUS*\n\n` +
                      `📊 Status: ${isEnabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                      `📍 Group: ${chatId.split('@')[0]}\n` +
                      `🌐 Global: ${chatbotConfig.get('enabled') ? '✅ Enabled' : '❌ Disabled'}\n\n` +
                      `📌 *Commands:*\n` +
                      `• \`.chatbot on\` - Enable for this group\n` +
                      `• \`.chatbot off\` - Disable for this group\n` +
                      `• \`.chatbot status\` - Show this status\n\n` +
                      `💡 *Owner commands:*\n` +
                      `• \`.cbc status\` - View global config\n` +
                      `• \`.cbc enable|disable\` - Global toggle`,
                quoted: message
            });
        }

        if (match === 'on') {
            if (data.chatbot[chatId]) {
                return sock.sendMessage(chatId, {
                    text: '⚠️ *Chatbot is already enabled for this group*',
                    quoted: message
                });
            }
            data.chatbot[chatId] = true;
            await saveUserGroupData(data);
            return sock.sendMessage(chatId, {
                text: `✅ *Chatbot enabled for this group!*\n\n` +
                      `💡 Mention me: *@NOVA help* to see what I can do.`,
                quoted: message
            });
        }

        if (match === 'off') {
            if (!data.chatbot[chatId]) {
                return sock.sendMessage(chatId, {
                    text: '⚠️ *Chatbot is already disabled for this group*',
                    quoted: message
                });
            }
            delete data.chatbot[chatId];
            await saveUserGroupData(data);
            return sock.sendMessage(chatId, {
                text: '❌ *Chatbot disabled for this group*',
                quoted: message
            });
        }

        return sock.sendMessage(chatId, {
            text: '❌ Use: `.chatbot on`, `.chatbot off` or `.chatbot status`',
            quoted: message
        });
    }
};