import config from '../config.js';
import commandHandler from '../lib/commandHandler.js';
import path from 'path';
import fs from 'fs';

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
 *    Description: This file is part of the NOVA-MD Project.                 *
 *                 Unauthorized copying or distribution is prohibited.       *
 *                                                                           *
 *****************************************************************************/

function formatTime() {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: config.timeZone || 'UTC'
    };
    return now.toLocaleTimeString('en-US', options);
}

// ============================================================
// STYLES DE MENU
// ============================================================

const menuStyles = [
    {
        render({ info, categories, prefix, page, totalPages, categoryFilter }) {
            let t = `╭━━『 *NOVA MENU* 』━⬣\n`;
            t += `┃ ✨ *Bot: ${info.bot}*\n`;
            t += `┃ 🔧 *Prefix: ${info.prefix}*\n`;
            t += `┃ 📦 *Plugins: ${info.total}*\n`;
            t += `┃ 💎 *Version: ${info.version}*\n`;
            t += `┃ ⏰ *Time: ${info.time}*\n`;
            if (categoryFilter) {
                t += `┃ 📂 *Category: ${categoryFilter.toUpperCase()}*\n`;
            }
            t += `┃ 📄 *Page ${page}/${totalPages}*\n`;
            t += `┃━━━━━━━━━━━━━━━━━━⬣\n`;
            for (const [cat, cmds] of categories) {
                t += `┃ ➤ *${cat.toUpperCase()}* (${cmds.length})\n`;
                for (const c of cmds)
                    t += `┃   ${prefix}${c}\n`;
            }
            t += `┃━━━━━━━━━━━━━━━━━━⬣\n`;
            t += `┃ 📌 *Navigation:*\n`;
            t += `┃ • ${prefix}menu <page> - Go to page\n`;
            t += `┃ • ${prefix}menu <category> - Filter by category\n`;
            t += `┃ • ${prefix}menu all - Show all\n`;
            t += `╰━━━━━━━━━━━━━━⬣`;
            return t;
        }
    },
    {
        render({ info, categories, prefix, page, totalPages, categoryFilter }) {
            let t = `◈╭─❍「 *NOVA MENU* 」❍\n`;
            t += `◈├• 🌟 *Bot: ${info.bot}*\n`;
            t += `◈├• ⚙️ *Prefix: ${info.prefix}*\n`;
            t += `◈├• 🍫 *Plugins: ${info.total}*\n`;
            t += `◈├• 💎 *Version: ${info.version}*\n`;
            t += `◈├• ⏰ *Time: ${info.time}*\n`;
            if (categoryFilter) {
                t += `◈├• 📂 *Category: ${categoryFilter.toUpperCase()}*\n`;
            }
            t += `◈├• 📄 *Page ${page}/${totalPages}*\n`;
            for (const [cat, cmds] of categories) {
                t += `◈├─❍「 *${cat.toUpperCase()}* 」❍ (${cmds.length})\n`;
                for (const c of cmds)
                    t += `◈├• ${prefix}${c}\n`;
            }
            t += `◈├─❍ *Navigation* ❍\n`;
            t += `◈├• ${prefix}menu <page>\n`;
            t += `◈├• ${prefix}menu <category>\n`;
            t += `◈├• ${prefix}menu all\n`;
            t += `◈╰──★─☆──♪♪─❍`;
            return t;
        }
    }
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ============================================================
// FONCTIONS DE PAGINATION
// ============================================================

const ITEMS_PER_PAGE = 12;

function paginateCommands(allCommands, page = 1, categoryFilter = null) {
    // Filtrer par catégorie si spécifiée
    let filtered = allCommands;
    if (categoryFilter && categoryFilter !== 'all') {
        filtered = allCommands.filter(cmd => 
            cmd.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
    }

    // Grouper par catégorie
    const grouped = {};
    for (const cmd of filtered) {
        const cat = cmd.category || 'misc';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(cmd.command);
    }

    // Convertir en tableau pour la pagination
    const categories = Object.entries(grouped);
    const totalItems = categories.reduce((sum, [_, cmds]) => sum + cmds.length, 0);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    
    // Pagination
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    let currentCount = 0;
    const paginatedCategories = [];
    
    for (const [cat, cmds] of categories) {
        const catStart = currentCount;
        const catEnd = catStart + cmds.length;
        
        if (catEnd > start && catStart < end) {
            const sliceStart = Math.max(0, start - catStart);
            const sliceEnd = Math.min(cmds.length, end - catStart);
            const slicedCmds = cmds.slice(sliceStart, sliceEnd);
            paginatedCategories.push([cat, slicedCmds]);
        }
        currentCount = catEnd;
    }

    return {
        categories: paginatedCategories,
        totalPages,
        totalItems,
        currentPage: page
    };
}

// ============================================================
// COMMANDE PRINCIPALE
// ============================================================

export default {
    command: 'menu',
    aliases: ['help', 'commands', 'h', 'list'],
    category: 'general',
    description: 'Show all commands with pagination and category filtering',
    usage: '.menu [page|category|all]',
    async handler(sock, message, args, context) {
        const { chatId, channelInfo } = context;
        const prefix = config.prefixes[0];
        const imagePath = path.join(process.cwd(), 'assets/thumb.png');

        // ============================================================
        // COMMANDE INFO (si argument spécifique)
        // ============================================================
        if (args.length) {
            const searchTerm = args[0].toLowerCase();
            
            // Vérifier si c'est une catégorie
            const allCommands = Array.from(commandHandler.commands.values());
            const categories = [...new Set(allCommands.map(c => c.category || 'misc'))];
            
            // Si c'est une catégorie
            if (categories.includes(searchTerm)) {
                return await showCategoryMenu(sock, chatId, searchTerm, prefix, message, channelInfo);
            }
            
            // Si c'est un numéro de page
            const pageNum = parseInt(searchTerm);
            if (!isNaN(pageNum) && pageNum > 0) {
                return await showPaginatedMenu(sock, chatId, pageNum, null, prefix, message, channelInfo);
            }
            
            // Si c'est "all" - tout afficher
            if (searchTerm === 'all' || searchTerm === 'tout') {
                return await showAllCommands(sock, chatId, prefix, message, channelInfo);
            }
            
            // Sinon, chercher une commande spécifique
            let cmd = commandHandler.commands.get(searchTerm);
            if (!cmd && commandHandler.aliases.has(searchTerm)) {
                const mainCommand = commandHandler.aliases.get(searchTerm);
                cmd = commandHandler.commands.get(mainCommand);
            }
            
            if (!cmd) {
                return sock.sendMessage(chatId, {
                    text: `❌ Command "${args[0]}" not found.\n\n` +
                          `📌 *Available categories:*\n${categories.map(c => `• ${c}`).join('\n')}\n\n` +
                          `📌 *Usage:*\n` +
                          `• ${prefix}menu <page> - Go to page\n` +
                          `• ${prefix}menu <category> - Filter by category\n` +
                          `• ${prefix}menu all - Show all commands`,
                    ...channelInfo
                }, { quoted: message });
            }
            
            // Afficher les infos de la commande
            const text = `╭━━━━━━━━━━━━━━⬣\n` +
                         `┃ 📌 *COMMAND INFO*\n` +
                         `┃\n` +
                         `┃ ⚡ *Command:* ${prefix}${cmd.command}\n` +
                         `┃ 📝 *Desc:* ${cmd.description || 'No description'}\n` +
                         `┃ 📖 *Usage:* ${cmd.usage || `${prefix}${cmd.command}`}\n` +
                         `┃ 🏷️ *Category:* ${cmd.category || 'misc'}\n` +
                         `┃ 🔖 *Aliases:* ${cmd.aliases?.length ? cmd.aliases.map((a) => prefix + a).join(', ') : 'None'}\n` +
                         `┃\n` +
                         `╰━━━━━━━━━━━━━━⬣`;
            
            if (fs.existsSync(imagePath)) {
                return sock.sendMessage(chatId, {
                    image: { url: imagePath },
                    caption: text,
                    ...channelInfo
                }, { quoted: message });
            }
            return sock.sendMessage(chatId, { text, ...channelInfo }, { quoted: message });
        }

        // ============================================================
        // MENU PRINCIPAL (Page 1 par défaut)
        // ============================================================
        return await showPaginatedMenu(sock, chatId, 1, null, prefix, message, channelInfo);
    }
};

// ============================================================
// FONCTIONS D'AFFICHAGE
// ============================================================

/**
 * Afficher le menu paginé
 */
async function showPaginatedMenu(sock, chatId, page, categoryFilter, prefix, message, channelInfo) {
    try {
        const allCommands = Array.from(commandHandler.commands.values());
        const result = paginateCommands(allCommands, page, categoryFilter);
        
        if (result.categories.length === 0) {
            return sock.sendMessage(chatId, {
                text: `❌ *No commands found on page ${page}*\n\n` +
                      `📌 *Total pages:* ${result.totalPages}\n` +
                      `💡 Use: ${prefix}menu <page>`,
                ...channelInfo
            }, { quoted: message });
        }

        // Récupérer la catégorie filtrée
        const filterDisplay = categoryFilter && categoryFilter !== 'all' ? categoryFilter.toUpperCase() : null;
        
        // Choisir un style aléatoire
        const style = pick(menuStyles);
        
        const text = style.render({
            info: {
                bot: config.botName,
                prefix: config.prefixes.join(', '),
                total: allCommands.length,
                version: config.version || "2.0.0",
                time: formatTime()
            },
            categories: result.categories,
            prefix: prefix,
            page: result.currentPage,
            totalPages: result.totalPages,
            categoryFilter: filterDisplay
        });

        const imagePath = path.join(process.cwd(), 'assets/thumb.png');
        
        // Navigation buttons
        const navButtons = [];
        if (result.currentPage > 1) {
            navButtons.push(`◀️ ${prefix}menu ${result.currentPage - 1}`);
        }
        if (result.currentPage < result.totalPages) {
            navButtons.push(`${prefix}menu ${result.currentPage + 1} ▶️`);
        }
        
        let navText = '';
        if (navButtons.length > 0) {
            navText = `\n\n📌 *Navigation:*\n${navButtons.map(b => `• ${b}`).join('\n')}`;
        }

        const finalText = text + navText;

        if (fs.existsSync(imagePath)) {
            await sock.sendMessage(chatId, {
                image: { url: imagePath },
                caption: finalText,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: finalText, 
                ...channelInfo 
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Menu error:', error);
        await sock.sendMessage(chatId, {
            text: `❌ *Error displaying menu:* ${error.message}`,
            ...channelInfo
        }, { quoted: message });
    }
}

/**
 * Afficher les commandes par catégorie
 */
async function showCategoryMenu(sock, chatId, category, prefix, message, channelInfo) {
    const allCommands = Array.from(commandHandler.commands.values());
    const filtered = allCommands.filter(cmd => 
        (cmd.category || 'misc').toLowerCase() === category.toLowerCase()
    );
    
    if (filtered.length === 0) {
        return sock.sendMessage(chatId, {
            text: `❌ *Category "${category}" not found!*\n\n` +
                  `📌 *Available categories:*\n` +
                  `${[...new Set(allCommands.map(c => c.category || 'misc'))].map(c => `• ${c}`).join('\n')}`,
            ...channelInfo
        }, { quoted: message });
    }

    // Afficher la première page de la catégorie
    await showPaginatedMenu(sock, chatId, 1, category, prefix, message, channelInfo);
}

/**
 * Afficher toutes les commandes (sans pagination)
 */
async function showAllCommands(sock, chatId, prefix, message, channelInfo) {
    const allCommands = Array.from(commandHandler.commands.values());
    
    // Grouper par catégorie
    const grouped = {};
    for (const cmd of allCommands) {
        const cat = cmd.category || 'misc';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(cmd.command);
    }

    let text = `╭━━『 *NOVA MENU - ALL* 』━⬣\n`;
    text += `┃ 📦 *Total Plugins: ${allCommands.length}*\n`;
    text += `┃ ━━━━━━━━━━━━━━━━━━⬣\n`;
    
    for (const [cat, cmds] of Object.entries(grouped)) {
        text += `┃ 📂 *${cat.toUpperCase()}* (${cmds.length})\n`;
        // Diviser les commandes en lignes de 4
        const chunks = [];
        for (let i = 0; i < cmds.length; i += 4) {
            chunks.push(cmds.slice(i, i + 4));
        }
        for (const chunk of chunks) {
            text += `┃ ${chunk.map(c => `${prefix}${c}`).join('  ')}\n`;
        }
        text += `┃ ──────────────────\n`;
    }
    
    text += `┃ 📌 *Navigation:*\n`;
    text += `┃ • ${prefix}menu <page> - Go to page\n`;
    text += `┃ • ${prefix}menu <category> - Filter by category\n`;
    text += `╰━━━━━━━━━━━━━━⬣`;

    const imagePath = path.join(process.cwd(), 'assets/thumb.png');
    
    if (fs.existsSync(imagePath)) {
        await sock.sendMessage(chatId, {
            image: { url: imagePath },
            caption: text,
            ...channelInfo
        }, { quoted: message });
    } else {
        await sock.sendMessage(chatId, { 
            text, 
            ...channelInfo 
        }, { quoted: message });
    }
}