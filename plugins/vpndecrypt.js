import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { TDecryptor } from '../lib/decryptors.js';

function detectFileType(buffer, rawText) {
    const textSample = rawText || buffer.toString('utf-8', 0, 500);
    const clean = textSample.trim();
    if (buffer && buffer.length > 4 && buffer.readUInt16BE(0) === 0xaced) return 'httpinjector';
    if (clean.startsWith('ssc://') || clean.includes('ssc://')) return 'ssc';
    if (clean.startsWith('NPVTSUB1') || clean.startsWith('NPVT1') || clean.includes('NPVT1')) return 'npvtunnel';
    if (clean.includes('encryptedLockedConfig') || clean.includes('EncryptedLockedConfig')) return 'darktunnel';
    if (clean.includes('cfg') || clean.includes('xy')) return 'httpcustom';
    return 'httpinjector';
}

export default {
    command: 'decrypt',
    aliases: ['dc', 'dec'],
    category: 'utility',
    description: 'Moteur universel de décryptage VPN sans stockage disque',
    usage: '.decrypt [Envoyer/Taguer fichier] ou [.decrypt ehi/hc/ssc/npv/dt]',
    ownerOnly: false,

    handler: async (sock, message, args, context) => {
        const chatId = context.chatId || message.key.remoteJid;
        const msg = message.message;
        const quotedContext = msg?.extendedTextMessage?.contextInfo;
        const quotedMsg = quotedContext?.quotedMessage;
        
        const documentTarget = msg?.documentMessage || quotedMsg?.documentMessage;
        const imageTarget = msg?.imageMessage || quotedMsg?.imageMessage;

        let fileBuffer = null;
        let fileType = null;
        let isEhiLink = false;
        let targetUrl = '';

        try {
            let text = args.join(' ') || msg?.conversation || msg?.extendedTextMessage?.text || '';
            if (!text && quotedMsg) text = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || '';
            text = text.trim();

            let forcedType = args[0]?.toLowerCase().trim();
            if (['ehi', 'httpinjector'].includes(forcedType)) forcedType = 'httpinjector';
            if (['hc', 'httpcustom'].includes(forcedType)) forcedType = 'httpcustom';
            if (['npv', 'npvtunnel'].includes(forcedType)) forcedType = 'npvtunnel';
            if (['dt', 'darktunnel'].includes(forcedType)) forcedType = 'darktunnel';

            if (text.includes('ehi.link/')) {
                isEhiLink = true;
                const match = text.match(/https?:\/\/ehi\.link\/[a-zA-Z0-9]+/i);
                targetUrl = match ? match[0] : `https://${text.replace(/https?:\/\//i, '')}`;
            }

            if (isEhiLink) {
                await sock.sendMessage(chatId, { text: `🔄 *Lien Cloud-EHI détecté...*\n📥 Décodage en mémoire RAM...` }, { quoted: message });
                const decryptedResult = await TDecryptor.downloadAndDecryptEhiLink(targetUrl);
                if (!decryptedResult) throw new Error("Erreur de décodage Cloud.");
                return await sock.sendMessage(chatId, { text: `🔓 *DECRYPTED :*\n\n\`\`\`json\n${decryptedResult}\n\`\`\`` }, { quoted: message });
            }

            if (documentTarget || imageTarget) {
                const targetDownloadable = { key: message.key, message: msg?.documentMessage ? msg : quotedMsg };
                fileBuffer = await downloadMediaMessage(targetDownloadable, 'buffer', {}, { logger: sock.logger });
                fileType = (forcedType && ['ssc', 'darktunnel', 'httpcustom', 'httpinjector', 'npvtunnel'].includes(forcedType)) ? forcedType : detectFileType(fileBuffer, null);
            } else if (text) {
                if (quotedMsg && forcedType && ['ssc', 'darktunnel', 'httpcustom', 'httpinjector', 'npvtunnel'].includes(forcedType)) {
                    const targetDownloadable = { key: message.key, message: quotedMsg };
                    fileBuffer = await downloadMediaMessage(targetDownloadable, 'buffer', {}, { logger: sock.logger });
                    fileType = forcedType;
                } else {
                    fileBuffer = Buffer.from(text, 'utf-8');
                    fileType = (forcedType && ['ssc', 'darktunnel', 'httpcustom', 'httpinjector', 'npvtunnel'].includes(forcedType)) ? forcedType : detectFileType(fileBuffer, text);
                }
            }

            if (!fileBuffer) {
                return await sock.sendMessage(chatId, { text: "❌ *Erreur :* Répondez à un fichier de config valide ou forcez le type (ex: `.decrypt ssc`)." }, { quoted: message });
            }

            let decryptedResult = null;
            if (fileType === 'ssc') decryptedResult = TDecryptor.decryptSSC(fileBuffer);
            if (fileType === 'darktunnel') decryptedResult = TDecryptor.decryptDarkTunnel(fileBuffer);
            if (fileType === 'httpcustom') decryptedResult = TDecryptor.decryptHTTPCustom(fileBuffer);
            if (fileType === 'httpinjector') decryptedResult = await TDecryptor.decryptHTTPInjector(fileBuffer);
            if (fileType === 'npvtunnel') decryptedResult = TDecryptor.decryptNPVTunnel(fileBuffer);

            if (!decryptedResult) {
                return await sock.sendMessage(chatId, { text: `❌ *Échec du décryptage.* Format [${fileType.toUpperCase()}] incorrect.` }, { quoted: message });
            }

            return await sock.sendMessage(chatId, { text: `🔓 *DECRYPTED CONFIG [${fileType.toUpperCase()}] :*\n\n\`\`\`json\n${decryptedResult.trim()}\n\`\`\`` }, { quoted: message });

        } catch (error) {
            await sock.sendMessage(chatId, { text: `❌ *Erreur Système :* ${error.message}` }, { quoted: message });
        }
    }
};
