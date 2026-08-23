/*****************************************************************************
 *                                                                           *
 *                     Developed By Nostra                                   *
 *                                                                           *
 *  🌐  GitHub   : https://github.com/NOVA-X-Code                            *
 *  ▶️  YouTube  : https://youtube.com/@labokingfreesurf                     *
 *  💬  WhatsApp : https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07     *
 *                                                                           *
 *    © 2026 NOSTRA. All rights reserved.                                   *
 *                                                                           *
 *****************************************************************************/

import fs from 'fs';
import path,{ dirname } from 'path';
import { fileURLToPath } from 'url';
import { 
    generateSessionId, 
    saveCloneToMainDB, 
    getAllClonesFromMainDB, 
    deleteClone,
    startClone,
    checkAndCleanExpiredClones
} from '../lib/cloneManager.js';
import isOwnerOrSudo from '../lib/isOwner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================
// TEST DATABASE CONNECTION
// ============================================================

async function testDatabaseConnection(dbUrl) {
    try {
        if (dbUrl.startsWith('mongodb')) {
            const mongoose = await import('mongoose');
            const conn = await mongoose.createConnection(dbUrl);
            await conn.db.admin().ping();
            await conn.close();
            return { success: true, type: 'mongodb' };
        }
        
        if (dbUrl.startsWith('postgresql')) {
            const pg = await import('pg');
            const { Pool } = pg;
            const pool = new Pool({ connectionString: dbUrl, connectionTimeoutMillis: 5000 });
            await pool.query('SELECT 1');
            await pool.end();
            return { success: true, type: 'postgresql' };
        }
        
        if (dbUrl.startsWith('mysql')) {
            const mysql = await import('mysql2/promise');
            const conn = await mysql.createConnection(dbUrl);
            await conn.execute('SELECT 1');
            await conn.end();
            return { success: true, type: 'mysql' };
        }
        
        return { success: false, error: 'Unsupported database type' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================================
// VÉRIFICATION DU PROPRIÉTAIRE PRINCIPAL
// ============================================================

async function isMainOwner(sock, senderId, chatId) {
    const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
    const isFromMe = senderId === sock.user.id || 
                     senderId === `${sock.user.id.split(':')[0]}@s.whatsapp.net`;
    
    try {
        const ownerData = JSON.parse(fs.readFileSync('./data/owner.json', 'utf-8'));
        const senderNumber = senderId.split('@')[0];
        if (ownerData.includes(senderNumber)) {
            return true;
        }
    } catch (_e) {
        // Ignorer l'erreur
    }
    
    return isOwner || isFromMe;
}

// ============================================================
// MAIN COMMAND
// ============================================================

export default {
    command: 'rentbot',
    aliases: ['botclone', 'clonebot'],
    category: 'owner',
    description: 'Create bot clones with optional expiry',
    usage: '.rentbot [create|list|delete|clean] [params]',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const { chatId } = context;
        const senderId = message.key.participant || message.key.remoteJid;
        
        const isMainOwnerValue = await isMainOwner(sock, senderId, chatId);
        
        if (!isMainOwnerValue) {
            return await sock.sendMessage(chatId, {
                text: '❌ *You are not authorized to use this command!*\n\n' +
                      '🔒 This command is restricted to the **bot owner** only.'
            }, { quoted: message });
        }

        const subCommand = args[0]?.toLowerCase();

        // ============================================================
        // CLEAN EXPIRED CLONES
        // ============================================================
        if (subCommand === 'clean' || subCommand === 'cleanup') {
            await sock.sendMessage(chatId, {
                text: '🧹 *Cleaning expired clones...*'
            }, { quoted: message });

            const cleaned = await checkAndCleanExpiredClones();
            
            return await sock.sendMessage(chatId, {
                text: `✅ *Cleanup complete!*\n\nRemoved ${cleaned} expired clone${cleaned > 1 ? 's' : ''}.`
            }, { quoted: message });
        }

        // ============================================================
        // LIST CLONES
        // ============================================================
        if (subCommand === 'list' || subCommand === 'ls' || subCommand === 'status') {
            const clones = await getAllClonesFromMainDB();
            
            if (clones.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: `*📋 CLONE LIST*\n\nNo clones found.\n\n💡 *Create a clone:* \`.rentbot create 23765976XXXX\``
                }, { quoted: message });
            }

            let text = `*📋 CLONE LIST* (${clones.length})\n\n`;
            text += '🔒 *Owner only*\n\n';
            
            const online = clones.filter(c => c.status === 'online');
            const configured = clones.filter(c => c.status === 'configured' || c.status === 'active');
            const offline = clones.filter(c => c.status === 'offline' || !c.status);
            const expired = clones.filter(c => c.expired === true);
            
            if (online.length > 0) {
                text += `🟢 *ONLINE* (${online.length})\n`;
                for (const clone of online) {
                    const dbDisplay = clone.dbType === 'local' ? '📁 Local' : `💾 ${clone.dbType.toUpperCase()}`;
                    text += `├─ 📱 \`${clone.phoneNumber}\`\n`;
                    text += `│  ${dbDisplay}\n`;
                    if (clone.expiryDays) {
                        const remaining = Math.ceil((clone.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
                        text += `│  ⏳ ${remaining} days remaining\n`;
                    }
                    text += `│  📅 ${new Date(clone.updatedAt || clone.createdAt).toLocaleString()}\n`;
                    text += '│  ──────────────────\n';
                }
                text += '\n';
            }
            
            if (configured.length > 0) {
                text += `🟡 *CONFIGURED* (${configured.length})\n`;
                for (const clone of configured) {
                    const dbDisplay = clone.dbType === 'local' ? '📁 Local' : `💾 ${clone.dbType.toUpperCase()}`;
                    text += `├─ 📱 \`${clone.phoneNumber}\`\n`;
                    text += `│  ${dbDisplay}\n`;
                    if (clone.expiryDays) {
                        const remaining = Math.ceil((clone.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
                        text += `│  ⏳ ${remaining} days remaining\n`;
                    }
                    text += `│  📅 ${new Date(clone.updatedAt || clone.createdAt).toLocaleString()}\n`;
                    text += '│  ──────────────────\n';
                }
                text += '\n';
            }
            
            if (offline.length > 0) {
                text += `🔴 *OFFLINE* (${offline.length})\n`;
                for (const clone of offline) {
                    const dbDisplay = clone.dbType === 'local' ? '📁 Local' : `💾 ${clone.dbType.toUpperCase()}`;
                    text += `├─ 📱 \`${clone.phoneNumber}\`\n`;
                    text += `│  ${dbDisplay}\n`;
                    if (clone.expiryDays) {
                        const remaining = Math.ceil((clone.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
                        text += `│  ⏳ ${remaining} days remaining\n`;
                    }
                    text += `│  📅 ${new Date(clone.updatedAt || clone.createdAt).toLocaleString()}\n`;
                    text += '│  ──────────────────\n';
                }
                text += '\n';
            }
            
            if (expired.length > 0) {
                text += `☠️ *EXPIRED* (${expired.length})\n`;
                for (const clone of expired) {
                    text += `├─ 📱 \`${clone.phoneNumber}\`\n`;
                    text += '│  💀 Expired\n';
                    text += `│  📅 ${new Date(clone.createdAt).toLocaleString()}\n`;
                    text += '│  ──────────────────\n';
                }
                text += '\n';
            }

            text += '📌 *Commands:*\n';
            text += '• `.rentbot create <phone> <days?>` - Create clone\n';
            text += '• `.rentbot create <phone> <db_url> <days?>` - With DB\n';
            text += '• `.rentbot delete <phone>` - Delete clone\n';
            text += '• `.rentbot list` - Show this list\n';
            text += '• `.rentbot clean` - Remove expired clones';

            return await sock.sendMessage(chatId, { text }, { quoted: message });
        }

        // ============================================================
        // DELETE CLONE
        // ============================================================
        if (subCommand === 'delete' || subCommand === 'del' || subCommand === 'remove' || subCommand === 'rm') {
            const phoneNumber = args[1]?.replace(/[^0-9]/g, '');
            
            if (!phoneNumber) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Please specify the phone number!*\n\n📌 *Usage:* `.rentbot delete 23765976XXXX`'
                }, { quoted: message });
            }

            const clones = await getAllClonesFromMainDB();
            const targetClones = clones.filter(c => c.phoneNumber === phoneNumber);
            
            if (targetClones.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: `❌ *Clone not found for* \`${phoneNumber}\``
                }, { quoted: message });
            }

            const cloneToDelete = targetClones[0];
            let expiryInfo = '';
            if (cloneToDelete.expiryDays) {
                const remaining = Math.ceil((cloneToDelete.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
                expiryInfo = `⏳ ${remaining} days remaining\n`;
            }
            
            await sock.sendMessage(chatId, {
                text: `⚠️ *Confirm deletion*\n\n` +
                      `📱 Phone: \`${cloneToDelete.phoneNumber}\`\n` +
                      `💾 Storage: ${cloneToDelete.dbType === 'local' ? '📁 Local' : `💾 ${cloneToDelete.dbType.toUpperCase()}`}\n` +
                      expiryInfo +
                      `📅 Created: ${new Date(cloneToDelete.createdAt).toLocaleString()}\n\n` +
                      '❓ *Are you sure?* Reply with:\n' +
                      `• \`.rentbot confirm ${cloneToDelete.phoneNumber}\` - Yes\n` +
                      '• `.rentbot list` - Cancel'
            }, { quoted: message });
            
            global.pendingDelete = { phoneNumber: cloneToDelete.phoneNumber, authId: cloneToDelete.authId, chatId };
            return;
        }

        // ============================================================
        // CONFIRM DELETE
        // ============================================================
        if (subCommand === 'confirm' || subCommand === 'yes') {
            const phoneNumber = args[1]?.replace(/[^0-9]/g, '');
            
            if (!phoneNumber || !global.pendingDelete || global.pendingDelete.phoneNumber !== phoneNumber) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *No pending deletion found.*'
                }, { quoted: message });
            }

            const result = await deleteClone(global.pendingDelete.authId);
            
            if (result.success) {
                await sock.sendMessage(chatId, {
                    text: `✅ *Clone deleted!*\n\n📱 Phone: \`${phoneNumber}\``
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: `❌ *Error:* ${result.error}`
                }, { quoted: message });
            }
            
            delete global.pendingDelete;
            return;
        }

        // ============================================================
        // CREATE CLONE
        // ============================================================
        if (subCommand === 'create' || subCommand === 'new' || subCommand === 'add') {
            const userNumber = args[1]?.replace(/[^0-9]/g, '');
            
            // Parser les arguments: [phone] [db_url] [days] ou [phone] [days]
            let dbUrl = null;
            let expiryDays = null;
            let argIndex = 2;
            
            while (argIndex < args.length) {
                const arg = args[argIndex];
                // Vérifier si c'est un nombre (durée en jours)
                if (/^\d+$/.test(arg) && !arg.includes('.') && !arg.includes(':')) {
                    expiryDays = parseInt(arg, 10);
                } else if (arg.startsWith('http') || arg.startsWith('mongodb') || 
                          arg.startsWith('postgresql') || arg.startsWith('mysql')) {
                    dbUrl = arg;
                } else if (!dbUrl) {
                    dbUrl = arg;
                }
                argIndex++;
            }
            
            if (!userNumber) {
                return await sock.sendMessage(chatId, {
                    text: '❌ *Phone number required!*\n\n📌 *Usage:*\n' +
                          '• Local: `.rentbot create 23765976XXXX` (no expiry)\n' +
                          '• With expiry: `.rentbot create 23765976XXXX 30` (30 days)\n' +
                          '• With DB: `.rentbot create 23765976XXXX mongodb://... 30`\n\n' +
                          '💡 *Examples:*\n' +
                          '• `.rentbot create 23765976XXXX 15` - 15 days\n' +
                          '• `.rentbot create 23765976XXXX mongodb://... 7` - 7 days with DB'
                }, { quoted: message });
            }

            let dbType = 'local';
            let displayDbInfo = '📁 Local storage';

            if (dbUrl) {
                await sock.sendMessage(chatId, {
                    text: `🔄 *Testing database...*\n\n📱 ${userNumber}`
                }, { quoted: message });

                const testResult = await testDatabaseConnection(dbUrl);
                if (!testResult.success) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ *DB connection failed!*\n\n${testResult.error}\n\n📌 Try local: \`.rentbot create ${userNumber}\``
                    }, { quoted: message });
                }
                dbType = testResult.type;
                displayDbInfo = `💾 ${dbType.toUpperCase()}`;
            }

            const authId = generateSessionId();
            const sessionPath = path.join(process.cwd(), 'session', 'clones', authId);
            
            if (!fs.existsSync(sessionPath)) {
                fs.mkdirSync(sessionPath, { recursive: true });
            }

            const expiryText = expiryDays ? `⏳ ${expiryDays} days` : '♾️ No expiry';
            
            await saveCloneToMainDB(authId, userNumber, dbUrl || 'local', dbType, 'configured', expiryDays);

            await sock.sendMessage(chatId, {
                text: `✅ *Clone configured!*\n\n📱 ${userNumber}\n💾 ${displayDbInfo}\n${expiryText}\n\n🔄 Getting pairing code...`
            }, { quoted: message });

            try {
                const { pairingCode } = await startClone(
                    sessionPath,
                    userNumber,
                    authId,
                    dbType,
                    dbUrl,
                    expiryDays,
                    async (_conn, _authId, _userNumber) => {
                        await sock.sendMessage(chatId, {
                            text: `✅ *Clone connected!*\n\n📱 \`${userNumber}\`\n💾 ${dbType === 'local' ? '📁 Local' : `💾 ${dbType.toUpperCase()}`}\n${expiryText}`
                        }, { quoted: message });
                    },
                    async (_conn, _authId, _userNumber) => {
                        // Gérer la déconnexion si nécessaire
                    }
                );

                if (pairingCode) {
                    const expiryInfo = expiryDays ? `\n⏳ *Validity:* ${expiryDays} days` : '\n♾️ *Validity:* No expiry';
                    const pairingText = `🔐 *PAIRING CODE*\n\n` +
                        `📱 Number: \`${userNumber}\`\n` +
                        `🔑 Code: *${pairingCode}*\n` +
                        `💾 Storage: ${dbType === 'local' ? '📁 Local' : `💾 ${dbType.toUpperCase()}`}\n` +
                        `${expiryInfo}\n\n` +
                        '📌 *Instructions:*\n' +
                        '1. Open WhatsApp Settings\n' +
                        '2. Linked Devices > Link with Phone Number\n' +
                        '3. Enter the code above\n\n' +
                        '🔒 *This clone is isolated from others*\n' +
                        `🆔 *ID:* ${authId}`;

                    await sock.sendMessage(chatId, { text: pairingText }, { quoted: message });
                }

            } catch (error) {
                await sock.sendMessage(chatId, {
                    text: `❌ *Failed to start clone:* ${error.message}`
                }, { quoted: message });
            }

            return;
        }

        // ============================================================
        // HELP
        // ============================================================
        return await sock.sendMessage(chatId, {
            text: '🤖 *CLONE BOT SYSTEM*\n\n' +
                  '🔒 *Owner only - Clones cannot create other clones*\n\n' +
                  '📌 *Commands:*\n\n' +
                  '🟢 *CREATE:*\n' +
                  '`.rentbot create 23765976XXXX` - No expiry\n' +
                  '`.rentbot create 23765976XXXX 30` - 30 days\n' +
                  '`.rentbot create 23765976XXXX mongodb://... 15` - 15 days with DB\n\n' +
                  '📋 *LIST:*\n' +
                  '`.rentbot list`\n\n' +
                  '🗑️ *DELETE:*\n' +
                  '`.rentbot delete 23765976XXXX`\n\n' +
                  '🧹 *CLEAN:*\n' +
                  '`.rentbot clean` - Remove expired clones'
        }, { quoted: message });
    }
};