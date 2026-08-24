import axios from 'axios';

const AI_APIS = [
    (q) => `https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`,
    (q) => `https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`,
    (q) => `https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=${encodeURIComponent(q)}`
];

function detectLanguage(query) {
    const patterns = {
        fr: /[éèêëàâäôöùûüçîï]/i,
        en: /[a-zA-Z]/,
        es: /[áéíóúñ¿¡]/i,
        pt: /[áàâãéêíóôõúç]/i,
        ar: /[\u0600-\u06FF]/,
        ru: /[\u0400-\u04FF]/,
        zh: /[\u4e00-\u9fff]/
    };
    
    let scores = { en: 0 };
    for (const [lang, pattern] of Object.entries(patterns)) {
        const matches = query.match(pattern);
        if (matches) scores[lang] = matches.length;
        else scores[lang] = 0;
    }
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function buildPrompt(query, lang) {
    const langMap = {
        fr: 'français',
        en: 'English',
        es: 'español',
        pt: 'português',
        ar: 'العربية',
        ru: 'русский',
        zh: '中文'
    };
    
    const langName = langMap[lang] || 'English';
    
    return `[INST] Réponds en ${langName} de manière concise et précise.
Réponse courte mais complète (2-5 phrases).
Va droit au but.
Si explication, donne l'essentiel.

Question: ${query}

Réponse en ${langName}: [/INST]`;
}

const askAI = async (query) => {
    if (!query || query.trim().length < 2) {
        throw new Error('Question trop courte');
    }

    const lang = detectLanguage(query);
    const enhancedQuery = buildPrompt(query, lang);

    for (const apiUrl of AI_APIS) {
        try {
            const { data } = await axios.get(apiUrl(enhancedQuery), { 
                timeout: 18000,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            
            let response = data?.data?.response || data?.response || data?.text || data?.message;
            
            if (response && typeof response === 'string') {
                response = response.trim()
                    .replace(/^R['']éponse\s*[:：]\s*/i, '')
                    .replace(/^Answer\s*[:：]\s*/i, '')
                    .replace(/^Respuesta\s*[:：]\s*/i, '')
                    .replace(/^Resposta\s*[:：]\s*/i, '')
                    .trim();
                
                if (response.length > 5) {
                    return response;
                }
            }
        } catch (error) {
            console.error('API Error:', error.message);
            continue;
        }
    }
    throw new Error('All AI APIs failed');
};

export default {
    command: 'llama',
    aliases: ['llamaai', 'metaai'],
    category: 'ai',
    description: 'Pose une question à Llama AI (réponse adaptée)',
    usage: '.llama <question>',
    async handler(sock, message, args, context) {
        const { chatId, config } = context;
        const prefix = config.prefix || '.';
        const query = args.join(' ').trim();
        
        if (!query) {
            return sock.sendMessage(chatId, { 
                text: `🤖 *Assistant Llama*\n\n` +
                      `📌 *Utilisation:* \`${prefix}llama <votre question>\`\n` +
                      `💡 *Exemple:* \`${prefix}llama comment fonctionne l'IA\`\n` 
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(chatId, { react: { text: '🦙', key: message.key } });
            
            const answer = await askAI(query);
            
            const maxLength = 3000;
            const finalAnswer = answer.length > maxLength 
                ? answer.substring(0, maxLength) + '\n\n... (tronqué)'
                : answer;
            
            await sock.sendMessage(chatId, { 
                text: `🦙 *Llama AI*\n\n${finalAnswer}`
            }, { quoted: message });
            
            await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
            
        } catch (error) {
            console.error('AI Command Error:', error.message);
            await sock.sendMessage(chatId, { 
                text: '❌ *Erreur:* Impossible d\'obtenir une réponse. Veuillez réessayer plus tard.'
            }, { quoted: message });
        }
    }
};