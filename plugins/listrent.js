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

import { getAllClonesFromMainDB, isCloneOwner } from '../lib/cloneManager.js';
import isOwnerOrSudo from '../lib/isOwner.js';

export default {
    command: 'listrent',
    aliases: ['listclone', 'botclones', 'myclones'],
    category: 'owner',
    description: 'List your own sub-bots (or all if owner)',
    usage: '.listrent',
    async handler(sock, message, args, context) {
        const { chatId } = context;
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        const isFromMe = message.key.fromMe;
        const senderNumber = senderId.split('@')[0];

        const allClones = await getAllClonesFromMainDB();
        
        // Filtrer: si owner => tous, sinon seulement ses clones
        const clones = (isOwner || isFromMe) 
            ? allClones 
            : allClones.filter(c => c.phoneNumber === senderNumber);

        if (clones.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📋 MY CLONES*\n\n` +
                      `No clones found${!isOwner && !isFromMe ? ' for your number' : ''}.\n\n` +
                      `${!isOwner && !isFromMe ? '💡 Contact the bot owner to create a clone.' : '💡 Create a clone: `.rentbot create 23765976XXXX`'}`
            }, { quoted: message });
        }

        let msg = `*─── [ ${isOwner || isFromMe ? 'ALL' : 'MY'} CLONES ] ───*\n\n`;
        msg += `📱 Your number: \`${senderNumber}\`\n\n`;

        const online = clones.filter(c => c.status === 'online');
        const configured = clones.filter(c => c.status === 'configured' || c.status === 'active');
        const offline = clones.filter(c => c.status === 'offline' || !c.status);

        if (online.length > 0) {
            msg += `🟢 *ONLINE* (${online.length})\n`;
            for (const clone of online) {
                const dbDisplay = clone.dbType === 'local' ? '📁 Local' : `💾 ${clone.dbType.toUpperCase()}`;
                msg += `├─ 📱 \`${clone.phoneNumber}\`\n`;
                msg += `│  ${dbDisplay}\n`;
                msg += `│  📅 ${new Date(clone.updatedAt || clone.createdAt).toLocaleString()}\n`;
                msg += `│  ──────────────────\n`;
            }
            msg += `\n`;
        }

        if (configured.length > 0) {
            msg += `🟡 *CONFIGURED* (${configured.length})\n`;
            for (const clone of configured) {
                const dbDisplay = clone.dbType === 'local' ? '📁 Local' : `💾 ${clone.dbType.toUpperCase()}`;
                msg += `├─ 📱 \`${clone.phoneNumber}\`\n`;
                msg += `│  ${dbDisplay}\n`;
                msg += `│  📅 ${new Date(clone.updatedAt || clone.createdAt).toLocaleString()}\n`;
                msg += `│  ──────────────────\n`;
            }
            msg += `\n`;
        }

        if (offline.length > 0) {
            msg += `🔴 *OFFLINE* (${offline.length})\n`;
            for (const clone of offline) {
                const dbDisplay = clone.dbType === 'local' ? '📁 Local' : `💾 ${clone.dbType.toUpperCase()}`;
                msg += `├─ 📱 \`${clone.phoneNumber}\`\n`;
                msg += `│  ${dbDisplay}\n`;
                msg += `│  📅 ${new Date(clone.updatedAt || clone.createdAt).toLocaleString()}\n`;
                msg += `│  ──────────────────\n`;
            }
            msg += `\n`;
        }

        msg += `*Total:* ${clones.length}\n`;

        if (isOwner || isFromMe) {
            msg += `\n📌 *Commands:*\n`;
            msg += `• \`.rentbot create <phone>\` - Create clone\n`;
            msg += `• \`.rentbot delete <phone>\` - Delete clone`;
        }

        const mentions = online.map(c => `${c.phoneNumber}@s.whatsapp.net`).filter(Boolean);
        await sock.sendMessage(chatId, {
            text: msg,
            mentions
        }, { quoted: message });
    }
};