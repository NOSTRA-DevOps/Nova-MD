import axios from 'axios';

export default {
    command: 'gitclone',
    aliases: ['githubdl', 'git'],
    category: 'download',
    description: 'Download a GitHub repository as a ZIP file',
    usage: '.gitclone <github-link>',
    async handler(sock, message, args, context) {
        const { chatId } = context;
        const regex = new RegExp('(?:https|git)(?://|@)github.com[/:]([^/:]+)/(.+)', 'i');
        
        try {
            const link = args[0];
            if (!link) {
                return await sock.sendMessage(chatId, {
                    text: `❌ *Missing Link!*\n\nExample: .gitclone https://github.com/NOVA-X-Code/Nova-MD`
                }, { quoted: message });
            }
            
            if (!regex.test(link)) {
                return await sock.sendMessage(chatId, { 
                    text: '⚠️ *Invalid GitHub link!*' 
                }, { quoted: message });
            }
            
            const match = link.match(regex);
            if (!match) {
                return await sock.sendMessage(chatId, { 
                    text: '⚠️ *Invalid GitHub link format!*' 
                }, { quoted: message });
            }
            
            const user = match[1];
            let repo = match[2];
            repo = repo.replace(/.git$/, '');
            
            const url = `https://api.github.com/repos/${user}/${repo}/zipball`;
            
            // Vérifier si le repo existe
            try {
                const headRes = await axios.head(url);
                const contentDisposition = headRes.headers['content-disposition'];
                let filename = `${repo}.zip`;
                
                if (contentDisposition) {
                    const matchFilename = contentDisposition.match(/attachment; filename=(.*)/);
                    if (matchFilename) {
                        filename = matchFilename[1];
                    }
                }
                
                await sock.sendMessage(chatId, { 
                    text: `✳️ *Wait, sending repository...*` 
                }, { quoted: message });
                
                await sock.sendMessage(chatId, {
                    document: { url },
                    fileName: filename,
                    mimetype: 'application/zip',
                    caption: `📦 *Repository:* ${user}/${repo}\n✨ *Cloned by NOVA-MD*`
                }, { quoted: message });
                
            } catch (headError) {
                if (headError.response?.status === 404) {
                    return await sock.sendMessage(chatId, { 
                        text: '❌ *Repository not found!* Make sure the repository exists and is public.' 
                    }, { quoted: message });
                }
                throw headError;
            }
            
        } catch (err) {
            console.error('Gitclone Error:', err);
            await sock.sendMessage(chatId, { 
                text: '❌ *Failed to download the repository.* Make sure it is public and the link is correct.' 
            }, { quoted: message });
        }
    }
};