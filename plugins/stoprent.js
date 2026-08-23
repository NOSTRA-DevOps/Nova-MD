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

import store from '../lib/lightweight_store.js';
import fs from 'fs';
import path from 'path';

const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);

async function deleteCloneSession(authId) {
    if (HAS_DB) {
        await store.saveSetting('clones', authId, null);
    } else {
        const sessionPath = path.join(process.cwd(), 'session', 'clones', authId);
        if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
        }
        const registryPath = path.join(process.cwd(), 'session', 'clones', `${authId}.json`);
        if (fs.existsSync(registryPath)) {
            fs.unlinkSync(registryPath);
        }
    }
}

async function getAllCloneAuthIds() {
    if (HAS_DB) {
        const settings = await store.getSetting('clones', 'all') || {};
        return Object.entries(settings)
            .filter(([_key, value]) => value && value.status)
            .map(([authId]) => authId);
    } else {
        const clonesDir = path.join(process.cwd(), 'session', 'clones');
        if (!fs.existsSync(clonesDir)) return [];
        const files = fs.readdirSync(clonesDir);
        const authIds = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                authIds.push(file.replace('.json', ''));
            } else if (fs.statSync(path.join(clonesDir, file)).isDirectory()) {
                authIds.push(file);
            }
        }
        return authIds;
    }
}

async function deleteAllCloneSessions() {
    const authIds = await getAllCloneAuthIds();
    for (const authId of authIds) {
        await deleteCloneSession(authId);
    }
}

export default {
    command: 'stoprent',
    aliases: ['stopclone', 'delrent'],
    category: 'owner',
    description: 'Stop a specific sub-bot or all sub-bots',
    usage: '.stoprent [number/all]',
    ownerOnly: true,
    async handler(sock, message, args, context) {
        const { chatId } = context;

        if (!global.conns || global.conns.length === 0) {
            return await sock.sendMessage(chatId, {
                text: "❌ No sub-bots are currently running."
            }, { quoted: message });
        }

        if (!args[0]) {
            let listMsg = `*📋 ACTIVE CLONES*\n\n`;
            global.conns.forEach((conn, i) => {
                const number = conn.user.id.split(':')[0];
                listMsg += `*${i + 1}.* @${number}\n`;
                listMsg += `   └ Name: ${conn.user.name || 'Sub-Bot'}\n\n`;
            });
            listMsg += `📌 *Usage:* \`.stoprent <number>\` or \`.stoprent all\``;
            
            const mentions = global.conns.map((c) => c.user.id);
            return await sock.sendMessage(chatId, {
                text: listMsg,
                mentions
            }, { quoted: message });
        }

        if (args[0].toLowerCase() === 'all') {
            let stoppedCount = 0;
            for (const conn of global.conns) {
                try {
                    await conn.logout();
                    conn.end();
                    stoppedCount++;
                } catch (e) {
                    console.error('Error stopping clone:', e.message);
                }
            }
            global.conns = [];

            if (HAS_DB) {
                try {
                    await deleteAllCloneSessions();
                } catch (e) {
                    console.error('Error deleting clone sessions:', e.message);
                }
            } else {
                const clonesDir = path.join(process.cwd(), 'session', 'clones');
                if (fs.existsSync(clonesDir)) {
                    fs.rmSync(clonesDir, { recursive: true, force: true });
                    fs.mkdirSync(clonesDir, { recursive: true });
                }
            }

            return await sock.sendMessage(chatId, {
                text: `✅ All sub-bots have been stopped and removed.\n\n` +
                    `Stopped: ${stoppedCount}\n` +
                    `Storage: ${HAS_DB ? 'Database cleared' : 'Files deleted'}`
            }, { quoted: message });
        }

        const index = parseInt(args[0], 10) - 1;
        if (isNaN(index) || !global.conns[index]) {
            return await sock.sendMessage(chatId, {
                text: "❌ Invalid index number. Check `.listrent` first."
            }, { quoted: message });
        }

        try {
            const target = global.conns[index];
            const targetJid = target.user.id;
            const targetNumber = targetJid.split(':')[0];

            await target.logout();
            global.conns.splice(index, 1);

            if (HAS_DB) {
                const allSettings = await store.getSetting('clones', 'all') || {};
                for (const [authId, data] of Object.entries(allSettings)) {
                    if (data && data.phoneNumber === targetNumber) {
                        await deleteCloneSession(authId);
                        break;
                    }
                }
            } else {
                const clonesDir = path.join(process.cwd(), 'session', 'clones');
                if (fs.existsSync(clonesDir)) {
                    const items = fs.readdirSync(clonesDir);
                    for (const item of items) {
                        const sessionPath = path.join(clonesDir, item, 'session.json');
                        if (fs.existsSync(sessionPath)) {
                            try {
                                const data = JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
                                if (data.phoneNumber === targetNumber) {
                                    fs.rmSync(path.join(clonesDir, item), { recursive: true, force: true });
                                    break;
                                }
                            } catch (e) {}
                        }
                        if (item.endsWith('.json')) {
                            try {
                                const data = JSON.parse(fs.readFileSync(path.join(clonesDir, item), 'utf-8'));
                                if (data.phoneNumber === targetNumber) {
                                    fs.unlinkSync(path.join(clonesDir, item));
                                    break;
                                }
                            } catch (e) {}
                        }
                    }
                }
            }

            await sock.sendMessage(chatId, {
                text: `✅ Stopped and removed sub-bot: @${targetNumber}\n\n` +
                    `Storage: ${HAS_DB ? 'Database cleared' : 'Files deleted'}`,
                mentions: [targetJid]
            }, { quoted: message });

        } catch (err) {
            console.error(err);
            await sock.sendMessage(chatId, {
                text: "❌ Error while stopping the sub-bot."
            }, { quoted: message });
        }
    }
};