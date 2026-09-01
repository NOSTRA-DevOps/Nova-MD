// commands/owner.js
import fs from 'fs-extra';
import config from '../config.js';
import { cleanJid } from '../lib/isOwner.js';

export default {
    command: 'owner2',
    aliases: ['own', 'setowner', 'addowner', 'rmowner', 'delowner'],
    category: 'owner',
    description: 'Manage bot owners (view, add, remove, change)',
    usage: `.owner [action] [number]`,
    async handler(sock, message, args, context) {
        const chatId = context.chatId || message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const senderClean = cleanJid(senderId);
        
        // Obtenir le propriétaire actuel
        let currentOwner = config.ownerNumber;
        
        // Si currentOwner est vide, essayer de lire depuis owner.json
        if (!currentOwner) {
            try {
                const ownerPath = './data/owner.json';
                if (fs.existsSync(ownerPath)) {
                    const owners = JSON.parse(fs.readFileSync(ownerPath, 'utf-8'));
                    if (owners.length > 0) {
                        currentOwner = owners[0]; // Le premier est le principal
                        // Mettre à jour config
                        config.ownerNumber = currentOwner;
                    }
                }
            } catch (e) {}
        }
        
        // Fonction pour charger la liste des propriétaires
        function getOwners() {
            try {
                const ownerPath = './data/owner.json';
                if (fs.existsSync(ownerPath)) {
                    return JSON.parse(fs.readFileSync(ownerPath, 'utf-8'));
                }
            } catch (e) {}
            return [];
        }
        
        // Fonction pour sauvegarder les propriétaires
        function saveOwners(owners) {
            try {
                fs.ensureDirSync('./data');
                fs.writeFileSync('./data/owner.json', JSON.stringify(owners, null, 2));
                return true;
            } catch (e) {
                return false;
            }
        }
        
        // Fonction pour sauvegarder dans config
        function saveConfigOwner(number) {
            try {
                const configPath = './data/config.json';
                let configData = {};
                if (fs.existsSync(configPath)) {
                    configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                }
                configData.ownerNumber = number;
                configData.updatedAt = new Date().toISOString();
                configData.updatedBy = senderClean;
                fs.ensureDirSync('./data');
                fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
                config.ownerNumber = number;
                return true;
            } catch (e) {
                return false;
            }
        }
        
        // ============================================================
        // 1. AFFICHAGE (sans argument ou avec "info")
        // ============================================================
        if (args.length === 0 || args[0]?.toLowerCase() === 'info' || args[0]?.toLowerCase() === 'list') {
            const owners = getOwners();
            const mainOwner = currentOwner || owners[0] || 'Not set';
            
            let text = `👑 *BOT OWNER MANAGEMENT*\n\n`;
            
            if (mainOwner && mainOwner !== 'Not set') {
                text += `📱 *Main Owner:* \`${mainOwner}\`\n`;
                text += `🔗 wa.me/${mainOwner}\n\n`;
            } else {
                text += `⚠️ *No owner configured!*\n`;
                text += `Use \`.owner set 23765976XXXX\` to set one.\n\n`;
            }
            
            // Afficher tous les propriétaires
            if (owners.length > 0) {
                const additional = owners.filter(o => o !== mainOwner);
                if (additional.length > 0) {
                    text += `👥 *Additional Owners:* (${additional.length})\n`;
                    additional.forEach((o, i) => {
                        const isYou = o === senderClean ? ' 👈 (You)' : '';
                        text += `  ${i+1}. \`${o}\`${isYou}\n`;
                    });
                    text += '\n';
                } else if (mainOwner !== 'Not set') {
                    text += `👤 *Only one owner.*\n\n`;
                }
            }
            
            // Vérifier si l'utilisateur est propriétaire
            const isOwner = currentOwner === senderClean || owners.includes(senderClean);
            
            if (isOwner) {
                text += `✅ *You are an owner*\n\n`;
            } else {
                text += `❌ *You are NOT an owner*\n\n`;
            }
            
            text += `📌 *Commands:*\n`;
            text += `• \`.owner2 set 23765976XXXX\` - Set/Change main owner\n`;
            text += `• \`.owner2 add 23765976XXXX\` - Add an owner\n`;
            text += `• \`.owner2 rm 23765976XXXX\` - Remove an owner\n`;
            text += `• \`.owner2 clear\` - Remove ALL owners (danger!)\n`;
            text += `• \`.owner2 info\` - Show this info\n\n`;
            text += `🔒 *Only owners can modify the list*`;
            
            return await sock.sendMessage(chatId, { text }, { quoted: message });
        }
        
        // ============================================================
        // 2. VÉRIFICATION DES PERMISSIONS (pour les actions)
        // ============================================================
        const action = args[0]?.toLowerCase();
        const owners = getOwners();
        const isAuthorized = currentOwner === senderClean || owners.includes(senderClean);
        
        if (!isAuthorized && action !== 'set') {
            return await sock.sendMessage(chatId, {
                text: '❌ *Access Denied!*\n\nOnly current owners can modify the owner list.'
            }, { quoted: message });
        }
        
        // Pour "set", si aucun owner n'existe, tout le monde peut en définir un
        if (action === 'set' && owners.length === 0 && !currentOwner) {
            // Autoriser tout le monde à définir le premier propriétaire
        } else if (action === 'set' && !isAuthorized) {
            return await sock.sendMessage(chatId, {
                text: '❌ *Access Denied!*\n\nOnly the current owner can change the main owner.'
            }, { quoted: message });
        }
        
        const number = args[1]?.replace(/[^0-9]/g, '');
        
        // ============================================================
        // 3. SET / CHANGE MAIN OWNER
        // ============================================================
        if (action === 'set' || action === 'change') {
            if (!number) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Please provide a phone number!*\n\n📌 *Usage:* `.owner2 set 23765976XXXX`'
                }, { quoted: message });
            }
            
            if (number.length < 10) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Invalid phone number!*\n\nPlease provide a valid number with country code.\nExample: `23765976XXXX`'
                }, { quoted: message });
            }
            
            // Vérifier si le numéro existe sur WhatsApp
            try {
                const contact = await sock.onWhatsApp(`${number}@s.whatsapp.net`);
                if (!contact || !contact[0] || !contact[0].exists) {
                    return await sock.sendMessage(chatId, {
                        text: `⚠️ *Warning!*\n\nThis number \`${number}\` doesn't appear to be registered on WhatsApp.\n\n` +
                              `Reply with \`.owner force ${number}\` to force set it.`
                    }, { quoted: message });
                }
            } catch (e) {}
            
            // Sauvegarder le nouveau propriétaire
            let ownersList = getOwners();
            
            // Si le numéro n'est pas déjà dans la liste, l'ajouter
            if (!ownersList.includes(number)) {
                ownersList.unshift(number); // Ajouter en premier
            } else {
                // Le déplacer en premier
                ownersList = ownersList.filter(o => o !== number);
                ownersList.unshift(number);
            }
            
            saveOwners(ownersList);
            saveConfigOwner(number);
            
            // Envoyer la confirmation
            let text = `✅ *Owner Updated!*\n\n`;
            text += `📱 New Main Owner: \`${number}\`\n`;
            text += `👤 Updated by: \`${senderClean}\`\n`;
            text += `📅 Date: ${new Date().toLocaleString()}\n\n`;
            text += `🔗 wa.me/${number}\n\n`;
            text += `⚠️ The bot will now recognize this number as the primary owner.`;
            
            await sock.sendMessage(chatId, { text }, { quoted: message });
            
            // Envoyer un message au nouveau propriétaire
            try {
                await sock.sendMessage(`${number}@s.whatsapp.net`, {
                    text: `👑 *You are now the main owner of this bot!*\n\n` +
                          `🤖 Bot: ${config.botName || 'NOVA-MD'}\n` +
                          `📅 Since: ${new Date().toLocaleString()}\n\n` +
                          `Use \`.owner info\` to see all commands.`
                });
            } catch (e) {}
            
            return;
        }
        
        // ============================================================
        // 4. FORCE SET (ignore la vérification WhatsApp)
        // ============================================================
        if (action === 'force') {
            if (!number) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Please provide a phone number!*\n\n📌 *Usage:* `.owner force 23765976XXXX`'
                }, { quoted: message });
            }
            
            let ownersList = getOwners();
            if (!ownersList.includes(number)) {
                ownersList.unshift(number);
            } else {
                ownersList = ownersList.filter(o => o !== number);
                ownersList.unshift(number);
            }
            
            saveOwners(ownersList);
            saveConfigOwner(number);
            
            await sock.sendMessage(chatId, {
                text: `✅ *Owner forced!*\n\n📱 New Owner: \`${number}\`\n\n⚠️ This overrides the WhatsApp verification.`
            }, { quoted: message });
            
            return;
        }
        
        // ============================================================
        // 5. ADD OWNER
        // ============================================================
        if (action === 'add' || action === 'addowner') {
            if (!number) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Please provide a phone number!*\n\n📌 *Usage:* `.owner add 23765976XXXX`'
                }, { quoted: message });
            }
            
            let ownersList = getOwners();
            
            if (ownersList.includes(number)) {
                return await sock.sendMessage(chatId, {
                    text: `ℹ️ \`${number}\` is already an owner.`
                }, { quoted: message });
            }
            
            ownersList.push(number);
            saveOwners(ownersList);
            
            await sock.sendMessage(chatId, {
                text: `✅ *Owner Added!*\n\n📱 \`${number}\` is now an owner.\n\nThey can now use all owner commands.`
            }, { quoted: message });
            
            // Notifier le nouveau propriétaire
            try {
                await sock.sendMessage(`${number}@s.whatsapp.net`, {
                    text: `👑 *You have been added as an owner!*\n\n` +
                          `🤖 Bot: ${config.botName || 'NOVA-MD'}\n` +
                          `📅 Added by: \`${senderClean}\`\n\n` +
                          `Use \`.owner info\` to see all commands.`
                });
            } catch (e) {}
            
            return;
        }
        
        // ============================================================
        // 6. REMOVE OWNER
        // ============================================================
        if (action === 'rm' || action === 'remove' || action === 'del' || action === 'delete' || action === 'rmowner') {
            if (!number) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Please provide a phone number!*\n\n📌 *Usage:* `.owner rm 23765976XXXX`'
                }, { quoted: message });
            }
            
            let ownersList = getOwners();
            
            if (!ownersList.includes(number)) {
                return await sock.sendMessage(chatId, {
                    text: `ℹ️ \`${number}\` is not an owner.`
                }, { quoted: message });
            }
            
            // Empêcher de supprimer le seul propriétaire
            if (ownersList.length === 1 && ownersList[0] === number) {
                return await sock.sendMessage(chatId, {
                    text: `❌ *Cannot remove the only owner!*\n\nPlease set a new owner first:\n\`.owner set 23765976XXXX\``
                }, { quoted: message });
            }
            
            // Si c'est le propriétaire principal qui est supprimé, définir le suivant comme principal
            const isMainOwner = currentOwner === number;
            
            ownersList = ownersList.filter(o => o !== number);
            
            if (isMainOwner && ownersList.length > 0) {
                // Le nouveau propriétaire principal est le premier de la liste
                saveConfigOwner(ownersList[0]);
            }
            
            saveOwners(ownersList);
            
            await sock.sendMessage(chatId, {
                text: `✅ *Owner Removed!*\n\n📱 \`${number}\` is no longer an owner.${isMainOwner ? '\n\n⚠️ A new main owner has been automatically assigned.' : ''}`
            }, { quoted: message });
            
            return;
        }
        
        // ============================================================
        // 7. CLEAR ALL OWNERS (DANGER!)
        // ============================================================
        if (action === 'clear' || action === 'reset') {
            if (!isAuthorized) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Access Denied!*\n\nOnly owners can clear the owner list.'
                }, { quoted: message });
            }
            
            // Demander confirmation
            if (!args[1] || args[1]?.toLowerCase() !== 'confirm') {
                return await sock.sendMessage(chatId, {
                    text: `⚠️ *DANGER!*\n\nThis will remove ALL owners!\n\n` +
                          `Current owners: ${getOwners().join(', ')}\n\n` +
                          `To confirm, type: \`.owner clear confirm\``
                }, { quoted: message });
            }
            
            saveOwners([]);
            config.ownerNumber = '';
            
            try {
                const configPath = './data/config.json';
                if (fs.existsSync(configPath)) {
                    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                    delete configData.ownerNumber;
                    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
                }
            } catch (e) {}
            
            await sock.sendMessage(chatId, {
                text: `⚠️ *All owners have been removed!*\n\nAnyone can now set a new owner with:\n\`.owner set 23765976XXXX\``
            }, { quoted: message });
            
            return;
        }
        
        // ============================================================
        // 8. HELP / COMMANDE INCONNUE
        // ============================================================
        return await sock.sendMessage(chatId, {
            text: `❌ *Unknown action:* \`${action}\`\n\n` +
                  `📌 *Available actions:*\n` +
                  `• \`.owner2\` or \`.owner info\` - Show owner info\n` +
                  `• \`.owner2 set 23765976XXXX\` - Set main owner\n` +
                  `• \`.owner2 add 23765976XXXX\` - Add owner\n` +
                  `• \`.owner2 rm 23765976XXXX\` - Remove owner\n` +
                  `• \`.owner2 clear\` - Remove ALL owners\n` +
                  `• \`.owner2 force 23765976XXXX\` - Force set (no verification)`
        }, { quoted: message });
    }
};