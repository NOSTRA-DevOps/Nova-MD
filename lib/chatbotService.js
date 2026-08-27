import _0x0_0x3b7561 from 'node-fetch';
import _0x0_0xbc4cfd from 'axios';
import _0x0_0x36b4be from './chatbotConfig.js';
import * as _0x0_0x55a9b2 from './commandHandler.js';
import _0x0_0x669a4e from '../config.js';
import _0x0_0x27570d from 'dotenv';
_0x0_0x27570d['config']();
const AI_APIS = [
    _0x1864b8 => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x1864b8),
    _0x4d371c => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x4d371c),
    _0x1e6f7c => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x1e6f7c)
];
const askAI = async _0x5c8bdc => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x5c8bdc);
    for (const _0x5e2b4d of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x5e2b4d(_0x5c8bdc)['substring'](0x0, 0x32) + '...');
            const {data: _0x25a543} = await _0x0_0xbc4cfd['get'](_0x5e2b4d(_0x5c8bdc), { 'timeout': 0x3a98 });
            const _0x467dd2 = _0x25a543?.['data']?.['response'];
            if (_0x467dd2 && typeof _0x467dd2 === 'string' && _0x467dd2['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x467dd2['trim']();
            }
        } catch (_0x3d0660) {
            console['log']('⚠️\x20API\x20failed:', _0x3d0660['message']);
            continue;
        }
    }
    throw new Error('All\x20AI\x20APIs\x20failed');
};
class ChatbotService {
    constructor() {
        console['log']('🤖\x20ChatbotService\x20initializing...');
        console['log']('📋\x20Using\x20custom\x20AI\x20APIs\x20(Mistral,\x20Llama)');
        this['providers'] = {
            'customai': this['_callCustomAI']['bind'](this),
            'pollinations': this['_callPollinations']['bind'](this),
            'puter': this['_callPuter']['bind'](this),
            'gemini': this['_callGemini']['bind'](this),
            'grok': this['_callGrok']['bind'](this),
            'openai': this['_callOpenAI']['bind'](this),
            'custom': this['_callCustom']['bind'](this)
        };
        this['history'] = new Map();
        this['contextCache'] = new Map();
        this['baseContext'] = 'You\x20are\x20NOVA,\x20a\x20virtual\x20assistant\x20powered\x20by\x20NOSTRA.\x20\x0aYou\x20are\x20an\x20advanced\x20AI\x20assistant\x20that\x20helps\x20users\x20with\x20various\x20tasks.\x0a\x0aKEY\x20TRAITS:\x0a-\x20You\x20are\x20friendly,\x20helpful,\x20and\x20professional\x0a-\x20You\x20ALWAYS\x20respond\x20in\x20the\x20SAME\x20LANGUAGE\x20as\x20the\x20user\x27s\x20question\x0a-\x20You\x20keep\x20responses\x20SHORT,\x20CLEAR,\x20and\x20PRECISE\x20(max\x203-4\x20sentences)\x0a-\x20You\x20use\x20emojis\x20appropriately\x20to\x20make\x20responses\x20engaging\x0a-\x20You\x20CAN\x20and\x20WILL\x20execute\x20commands\x20when\x20appropriate\x0a-\x20You\x20understand\x20natural\x20language\x20requests\x0a\x0aCOMMANDS\x20AVAILABLE:\x0a' + this['getCommandsList']() + '\x0a\x0aHOW\x20TO\x20IDENTIFY\x20COMMANDS:\x0a1.\x20Analyze\x20the\x20user\x27s\x20request\x20carefully\x0a2.\x20If\x20the\x20request\x20matches\x20a\x20command\x20intent,\x20execute\x20it\x0a3.\x20If\x20not,\x20just\x20have\x20a\x20normal\x20conversation\x0a4.\x20NEVER\x20execute\x20commands\x20unless\x20the\x20user\x20clearly\x20asks\x20for\x20an\x20action\x0a\x0aEXAMPLES\x20OF\x20COMMAND\x20DETECTION:\x0a-\x20\x22Nova\x20télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20EXECUTE\x20download\x20command\x0a-\x20\x22Nova\x20crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20EXECUTE\x20sticker\x20command\x20\x20\x0a-\x20\x22Nova\x20banni\x20@user\x22\x20→\x20EXECUTE\x20ban\x20command\x0a-\x20\x22Nova\x20salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20JUST\x20CHAT,\x20no\x20command\x0a-\x20\x22Nova\x20qu\x27est-ce\x20que\x20tu\x20peux\x20faire\x20?\x22\x20→\x20JUST\x20CHAT,\x20list\x20capabilities\x0a\x0aIMPORTANT\x20RULES:\x0a-\x20ONLY\x20execute\x20commands\x20when\x20the\x20user\x20explicitly\x20asks\x20for\x20an\x20action\x0a-\x20For\x20normal\x20conversation,\x20just\x20respond\x20naturally\x0a-\x20Always\x20explain\x20what\x20you\x27re\x20doing\x20when\x20executing\x20a\x20command\x0a-\x20If\x20unsure,\x20just\x20chat\x20normally\x0a-\x20You\x20understand\x20natural\x20language\x20like\x20\x22télécharge\x22,\x20\x22sticker\x22,\x20\x22ban\x22,\x20\x22kick\x22,\x20etc.\x0a\x0aRESPOND\x20IN\x20THE\x20SAME\x20LANGUAGE\x20AS\x20THE\x20USER:\x0a-\x20If\x20user\x20speaks\x20French\x20→\x20respond\x20in\x20French\x0a-\x20If\x20user\x20speaks\x20English\x20→\x20respond\x20in\x20English';
        this['loadConfig']();
        console['log']('📋\x20Current\x20provider:', this['config']['provider']);
        console['log']('📋\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        console['log']('📋\x20Execute\x20commands:', this['config']['executeCommands']);
        console['log']('📋\x20Enabled:', this['config']['enabled']);
        console['log']('📋\x20Mode:', this['config']['mode']);
    }
    ['getCommandsList']() {
        if (!_0x0_0x55a9b2 || !_0x0_0x55a9b2['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x226021 = Array['from'](_0x0_0x55a9b2['commands']['values']());
            const _0x16bf6b = {};
            for (const _0x3cd187 of _0x226021) {
                const _0x32d45b = _0x3cd187['category'] || 'misc';
                if (!_0x16bf6b[_0x32d45b])
                    _0x16bf6b[_0x32d45b] = [];
                _0x16bf6b[_0x32d45b]['push']({
                    'name': _0x3cd187['command'],
                    'description': _0x3cd187['description'] || 'No\x20description',
                    'aliases': _0x3cd187['aliases'] || [],
                    'usage': _0x3cd187['usage'] || '.' + _0x3cd187['command']
                });
            }
            let _0xe8dbc8 = '';
            for (const [_0x544f85, _0x27fbdb] of Object['entries'](_0x16bf6b)) {
                _0xe8dbc8 += '\x0a' + _0x544f85['toUpperCase']() + ':\x0a';
                for (const _0x431fc6 of _0x27fbdb) {
                    _0xe8dbc8 += '-\x20' + _0x431fc6['name'] + ':\x20' + _0x431fc6['description'];
                    if (_0x431fc6['aliases']['length']) {
                        _0xe8dbc8 += '\x20(aliases:\x20' + _0x431fc6['aliases']['join'](',\x20') + ')';
                    }
                    _0xe8dbc8 += '\x0a';
                }
            }
            return _0xe8dbc8 || 'No\x20commands\x20available';
        } catch (_0x46cbdd) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x46cbdd);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x36b4be['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'customai',
            'apiKey': '',
            'apiUrl': '',
            'puterModel': 'gpt-5.4-nano',
            'grokModel': 'grok-4.6',
            'openaiModel': 'gpt-4o-mini',
            'geminiModel': 'gemini-flash-latest',
            'pollinationsModel': 'openai',
            'customContext': '',
            'maxHistory': 0xf,
            'temperature': 0.7,
            'maxTokens': 0x400,
            'responseTimeout': 0x3a98,
            'language': 'auto',
            'responsePrefix': '🤖\x20',
            'fallbackResponse': 'Désolé,\x20je\x20n\x27ai\x20pas\x20pu\x20traiter\x20votre\x20demande.\x20Veuillez\x20réessayer.\x20🥲',
            'executeCommands': !![],
            'autoDetectLanguage': !![]
        };
    }
    async ['getResponse'](_0xef0164, _0x2d0b21, _0xbd98c, _0x4eb342 = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0xef0164);
        console['log']('📝\x20Chat\x20ID:', _0x2d0b21);
        console['log']('📝\x20Sender\x20ID:', _0xbd98c);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x4664be = this['cleanMessage'](_0xef0164);
            console['log']('📝\x20Clean\x20message:', _0x4664be);
            if (!_0x4664be || _0x4664be['length'] < 0x1) {
                console['log']('❌\x20Empty\x20message\x20after\x20cleaning');
                return null;
            }
            if (this['config']['provider'] !== 'customai' && this['config']['provider'] !== 'pollinations' && !this['config']['apiKey']) {
                console['log']('❌\x20No\x20API\x20key\x20for\x20provider:', this['config']['provider']);
                return this['_missingApiKeyMessage']();
            }
            console['log']('✅\x20Chatbot\x20will\x20process\x20message');
            if (this['config']['executeCommands']) {
                console['log']('🔍\x20Checking\x20for\x20commands...');
                const _0x434102 = await this['intelligentCommandDetection'](_0x4664be);
                if (_0x434102 && _0x434102['isCommand'] && _0x434102['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x434102['command']);
                    const _0x23ee13 = await this['executeCommand'](_0x434102['command'], _0x434102['args'] || [], _0x2d0b21, _0xbd98c, _0x4eb342);
                    if (_0x23ee13['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x23ee13['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x23ee13['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x434102['command'] + '`.\x20' + (_0x23ee13['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x530c5f = await this['generateNaturalResponse'](_0x4664be, _0x2d0b21, _0xbd98c);
            console['log']('✅\x20Response\x20generated:', _0x530c5f);
            return _0x530c5f;
        } catch (_0x24f66c) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x24f66c);
            console['error']('❌\x20Stack\x20trace:', _0x24f66c['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20customai\x20avec\x20`.cbc\x20provider\x20customai`';
    }
    async ['intelligentCommandDetection'](_0x15f600) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x15f600);
        try {
            const _0x34b27f = this['buildCommandDetectionPrompt'](_0x15f600);
            const _0x393d3e = this['config']['provider'] || 'customai';
            const _0x28cfde = this['providers'][_0x393d3e];
            if (!_0x28cfde) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x15f600);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x393d3e);
            const _0x11c48b = await this['_callWithTimeout'](() => _0x28cfde(_0x34b27f, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x11c48b);
            const _0x1a713b = this['_extractJson'](_0x11c48b);
            const _0x134d00 = this['_normalizeCommandDetection'](_0x1a713b);
            if (_0x134d00) {
                try {
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x134d00);
                    if (_0x134d00['isCommand'] && _0x134d00['command']) {
                        if (_0x0_0x55a9b2 && _0x0_0x55a9b2['commands'] && _0x0_0x55a9b2['commands']['has'](_0x134d00['command'])) {
                            return _0x134d00;
                        }
                        const _0x497fd6 = this['findSimilarCommand'](_0x134d00['command']);
                        if (_0x497fd6 && _0x0_0x55a9b2['commands'] && _0x0_0x55a9b2['commands']['has'](_0x497fd6)) {
                            _0x134d00['command'] = _0x497fd6;
                            _0x134d00['suggested'] = !![];
                            return _0x134d00;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x134d00;
                } catch (_0x40b49b) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x40b49b);
                }
            }
            return this['simpleKeywordDetection'](_0x15f600);
        } catch (_0x8ff7df) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x8ff7df);
            return this['simpleKeywordDetection'](_0x15f600);
        }
    }
    ['_extractJson'](_0x5b548e) {
        if (!_0x5b548e || typeof _0x5b548e !== 'string')
            return null;
        const _0x12c6d2 = _0x5b548e['trim']();
        try {
            return JSON['parse'](_0x12c6d2);
        } catch (_0x51ba07) {
        }
        const _0x1b2032 = _0x12c6d2['match'](/\{[\s\S]*\}/);
        if (_0x1b2032) {
            try {
                return JSON['parse'](_0x1b2032[0x0]);
            } catch (_0x3819e8) {
                return null;
            }
        }
        return null;
    }
    ['_normalizeCommandDetection'](_0x4a1ac2) {
        if (!_0x4a1ac2 || typeof _0x4a1ac2 !== 'object')
            return null;
        const _0x491295 = _0x4a1ac2['isCommand'] ?? _0x4a1ac2['est_une_demande_de_commande'] ?? _0x4a1ac2['est_demande_de_commande'] ?? _0x4a1ac2['is_command'] ?? ![];
        const _0x4151c5 = _0x4a1ac2['command'] ?? _0x4a1ac2['commande'] ?? _0x4a1ac2['cmd'] ?? null;
        const _0x569d80 = _0x4a1ac2['args'] ?? _0x4a1ac2['arguments'] ?? _0x4a1ac2['arguments_'] ?? [];
        const _0x55b244 = _0x4a1ac2['confidence'] ?? _0x4a1ac2['confiance'] ?? 'medium';
        const _0x566a19 = _0x4a1ac2['reason'] ?? _0x4a1ac2['analyse'] ?? _0x4a1ac2['raison'] ?? '';
        return {
            'isCommand': !!_0x491295,
            'command': typeof _0x4151c5 === 'string' ? _0x4151c5['toLowerCase']()['trim']() : _0x4151c5,
            'args': Array['isArray'](_0x569d80) ? _0x569d80 : [],
            'confidence': _0x55b244,
            'reason': _0x566a19
        };
    }
    ['buildCommandDetectionPrompt'](_0x4e4bd8) {
        if (!_0x0_0x55a9b2 || !_0x0_0x55a9b2['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x4e4bd8 + '\x22';
        }
        const _0x2f9cf9 = Array['from'](_0x0_0x55a9b2['commands']['values']());
        let _0x3aa14c = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x28a0a3 of _0x2f9cf9) {
            _0x3aa14c += '-\x20' + _0x28a0a3['command'];
            if (_0x28a0a3['aliases'] && _0x28a0a3['aliases']['length']) {
                _0x3aa14c += '\x20(alias:\x20' + _0x28a0a3['aliases']['join'](',\x20') + ')';
            }
            _0x3aa14c += ':\x20' + (_0x28a0a3['description'] || 'Pas\x20de\x20description');
            if (_0x28a0a3['usage']) {
                _0x3aa14c += '\x20[Utilisation:\x20' + _0x28a0a3['usage'] + ']';
            }
            _0x3aa14c += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x3aa14c + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x4e4bd8 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x48e2aa) {
        const _0x4bb101 = _0x48e2aa['toLowerCase']();
        if (_0x0_0x55a9b2 && _0x0_0x55a9b2['commands']) {
            for (const [_0x3d7932, _0x4bc2d7] of _0x0_0x55a9b2['commands']) {
                const _0x4e9e94 = [
                    _0x3d7932,
                    ...(_0x4bc2d7['aliases'] || [])['map'](_0x4b6c9d => _0x4b6c9d['toLowerCase']())
                ];
                for (const _0x519ac1 of _0x4e9e94) {
                    if (_0x519ac1['length'] < 0x3)
                        continue;
                    if (new RegExp('\x5cb' + _0x519ac1['replace'](/[.*+?^${}()|[\]\\]/g, '\x5c$&') + '\x5cb', 'i')['test'](_0x4bb101)) {
                        return {
                            'isCommand': !![],
                            'command': _0x3d7932,
                            'args': this['extractArgs'](_0x48e2aa),
                            'confidence': 'medium',
                            'reason': 'Mot-clé\x20détecté\x20(commande\x20enregistrée):\x20' + _0x519ac1
                        };
                    }
                }
            }
        }
        const _0x3ae659 = {
            'download': [
                'télécharge',
                'download',
                'télécharger',
                'musique',
                'chanson',
                'song',
                'music',
                'audio',
                'video'
            ],
            'sticker': [
                'sticker',
                'autocollant',
                'create\x20sticker',
                'make\x20sticker'
            ],
            'ban': [
                'bannir',
                'exclure'
            ],
            'kick': [
                'expulser',
                'virer'
            ],
            'promote': ['promouvoir'],
            'demote': ['rétrograder'],
            'profilepic': [
                'pp',
                'photo\x20de\x20profil',
                'avatar'
            ],
            'viewonce': [
                'view\x20once',
                'message\x20éphémère'
            ],
            'menu': [
                'affiche\x20le\x20menu',
                'montre\x20le\x20menu',
                'affiche\x20moi\x20le\x20menu',
                'liste\x20des\x20commandes',
                'quelles\x20commandes'
            ]
        };
        let _0x1aac74 = null;
        let _0x243789 = 0x0;
        for (const [_0x24f004, _0x348a96] of Object['entries'](_0x3ae659)) {
            let _0x3e3872 = 0x0;
            for (const _0x169202 of _0x348a96) {
                if (_0x4bb101['includes'](_0x169202)) {
                    _0x3e3872 += _0x169202['length'] / 0x5;
                }
            }
            if (_0x3e3872 > _0x243789 && _0x3e3872 > 0x1) {
                _0x243789 = _0x3e3872;
                _0x1aac74 = _0x24f004;
            }
        }
        if (_0x1aac74 && _0x0_0x55a9b2?.['commands']?.['has'](_0x1aac74)) {
            const _0x2f0840 = this['extractArgs'](_0x48e2aa);
            return {
                'isCommand': !![],
                'command': _0x1aac74,
                'args': _0x2f0840,
                'confidence': _0x243789 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x1aac74
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x3981f3) {
        const _0x1fb837 = [];
        const _0x2f1089 = _0x3981f3['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x2f1089)
            _0x1fb837['push'](..._0x2f1089);
        const _0x1ecac8 = _0x3981f3['match'](/\d+/g);
        if (_0x1ecac8)
            _0x1fb837['push'](..._0x1ecac8);
        const _0xd96c2e = _0x3981f3['match'](/"([^"]*)"/g);
        if (_0xd96c2e)
            _0x1fb837['push'](..._0xd96c2e['map'](_0x2fb04d => _0x2fb04d['replace'](/"/g, '')));
        const _0x4a271c = _0x3981f3['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x4a271c && _0x4a271c[0x1]) {
            _0x1fb837['push'](_0x4a271c[0x1]['trim']());
        }
        return _0x1fb837;
    }
    ['findSimilarCommand'](_0x569c53) {
        if (!_0x0_0x55a9b2 || !_0x0_0x55a9b2['commands'])
            return null;
        const _0xa9eb4a = Array['from'](_0x0_0x55a9b2['commands']['keys']());
        const _0xfa2131 = _0xa9eb4a['filter'](_0x50af4a => _0x50af4a['includes'](_0x569c53) || _0x569c53['includes'](_0x50af4a) || this['levenshteinDistance'](_0x50af4a, _0x569c53) < 0x3);
        return _0xfa2131[0x0] || null;
    }
    ['levenshteinDistance'](_0x5deeb9, _0x33a649) {
        const _0x2403b0 = [];
        for (let _0x3fc162 = 0x0; _0x3fc162 <= _0x33a649['length']; _0x3fc162++) {
            _0x2403b0[_0x3fc162] = [_0x3fc162];
        }
        for (let _0x3b2528 = 0x0; _0x3b2528 <= _0x5deeb9['length']; _0x3b2528++) {
            _0x2403b0[0x0][_0x3b2528] = _0x3b2528;
        }
        for (let _0x1689ee = 0x1; _0x1689ee <= _0x33a649['length']; _0x1689ee++) {
            for (let _0x5b5e22 = 0x1; _0x5b5e22 <= _0x5deeb9['length']; _0x5b5e22++) {
                if (_0x33a649[_0x1689ee - 0x1] === _0x5deeb9[_0x5b5e22 - 0x1]) {
                    _0x2403b0[_0x1689ee][_0x5b5e22] = _0x2403b0[_0x1689ee - 0x1][_0x5b5e22 - 0x1];
                } else {
                    _0x2403b0[_0x1689ee][_0x5b5e22] = Math['min'](_0x2403b0[_0x1689ee - 0x1][_0x5b5e22 - 0x1] + 0x1, _0x2403b0[_0x1689ee][_0x5b5e22 - 0x1] + 0x1, _0x2403b0[_0x1689ee - 0x1][_0x5b5e22] + 0x1);
                }
            }
        }
        return _0x2403b0[_0x33a649['length']][_0x5deeb9['length']];
    }
    async ['executeCommand'](_0x21e90c, _0x1e7f55, _0x57f307, _0x4c9985, _0xb41e08) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x21e90c, _0x1e7f55);
            if (!_0x0_0x55a9b2 || !_0x0_0x55a9b2['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0x3f659a = _0x0_0x55a9b2['commands']['get'](_0x21e90c);
            if (!_0x3f659a) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x1dc937 = _0xb41e08['isOwnerOrSudo'] || ![];
            const _0x1fc90f = _0xb41e08['isFromMe'] || ![];
            const _0x393d5c = _0x57f307['endsWith']('@g.us');
            if (_0x3f659a['ownerOnly'] && !_0x1dc937 && !_0x1fc90f) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x3f659a['groupOnly'] && !_0x393d5c) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x15ea12 = this['_validateArgsAgainstUsage'](_0x3f659a, _0x1e7f55);
            if (!_0x15ea12['valid']) {
                return {
                    'success': ![],
                    'error': _0x15ea12['message']
                };
            }
            const _0x16cef9 = {
                'key': {
                    'remoteJid': _0x57f307,
                    'participant': _0x4c9985
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x21e90c + '\x20' + _0x1e7f55['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0xb41e08['pushName'] || 'User'
            };
            await _0x3f659a['handler'](_0xb41e08['sock'], _0x16cef9, _0x1e7f55, {
                'chatId': _0x57f307,
                'senderId': _0x4c9985,
                'isGroup': _0x393d5c,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x21e90c + '\x20' + _0x1e7f55['join']('\x20'),
                'messageText': _0x21e90c + '\x20' + _0x1e7f55['join']('\x20'),
                'userMessage': _0x21e90c + '\x20' + _0x1e7f55['join']('\x20'),
                'config': _0x0_0x669a4e
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x21e90c + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x595781) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x595781);
            return {
                'success': ![],
                'error': _0x595781['message']
            };
        }
    }
    ['_parseUsageTokens'](_0x3ebffa) {
        if (!_0x3ebffa || typeof _0x3ebffa !== 'string')
            return [];
        const _0x1c2866 = [];
        const _0x4f05f4 = /<([^<>]+)>|\[([^\[\]]+)\]/g;
        let _0x228875;
        while ((_0x228875 = _0x4f05f4['exec'](_0x3ebffa)) !== null) {
            const required = _0x228875[0x1] !== undefined;
            const _0x6686d2 = (_0x228875[0x1] ?? _0x228875[0x2])['trim']();
            const _0x4d1d01 = _0x6686d2['includes']('|') ? _0x6686d2['split']('|')['map'](_0x28825e => _0x28825e['trim']()['toLowerCase']())['filter'](Boolean) : null;
            _0x1c2866['push']({
                'required': required,
                'content': _0x6686d2,
                'alternatives': _0x4d1d01
            });
        }
        return _0x1c2866;
    }
    ['_validateArgsAgainstUsage'](_0x3a1c1f, _0x2268d7) {
        const _0x26137b = this['_parseUsageTokens'](_0x3a1c1f['usage']);
        if (_0x26137b['length'] === 0x0) {
            return { 'valid': !![] };
        }
        const requiredCount = _0x26137b['filter'](_0x5313e0 => _0x5313e0['required'])['length'];
        if (_0x2268d7['length'] < requiredCount) {
            return {
                'valid': ![],
                'message': 'Arguments\x20manquants.\x20Utilisation\x20:\x20`' + _0x3a1c1f['usage'] + '`'
            };
        }
        for (let _0x8c47f = 0x0; _0x8c47f < _0x26137b['length']; _0x8c47f++) {
            const _0x5972bb = _0x26137b[_0x8c47f];
            if (!_0x5972bb['alternatives'])
                continue;
            const _0x2ca419 = _0x2268d7[_0x8c47f];
            if (_0x2ca419 === undefined) {
                if (_0x5972bb['required']) {
                    return {
                        'valid': ![],
                        'message': 'Arguments\x20manquants.\x20Utilisation\x20:\x20`' + _0x3a1c1f['usage'] + '`'
                    };
                }
                continue;
            }
            if (!_0x5972bb['alternatives']['includes'](String(_0x2ca419)['toLowerCase']())) {
                return {
                    'valid': ![],
                    'message': 'Argument\x20invalide\x20:\x20\x22' + _0x2ca419 + '\x22.\x20Valeurs\x20acceptées\x20:\x20' + _0x5972bb['alternatives']['join'](',\x20') + '.\x0aUtilisation\x20:\x20`' + _0x3a1c1f['usage'] + '`'
                };
            }
        }
        return { 'valid': !![] };
    }
    async ['generateNaturalResponse'](_0x3a9fb7, _0x3f13c2, _0xfbd4c4) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x3a9fb7);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x401664 = this['buildConversationContext'](_0x3a9fb7, _0x3f13c2);
            console['log']('📝\x20Context\x20built,\x20length:', _0x401664['length']);
            const _0x57f723 = this['config']['provider'] || 'customai';
            const _0x1442f4 = this['providers'][_0x57f723];
            if (!_0x1442f4) {
                console['error']('❌\x20Provider\x20' + _0x57f723 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x57f723);
            const _0x4c2f7d = await this['_callWithTimeout'](() => _0x1442f4(_0x3a9fb7, _0x401664, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x4c2f7d);
            const _0x58a536 = this['cleanResponse'](_0x4c2f7d);
            this['addToHistory'](_0x3f13c2, _0x3a9fb7, _0x58a536);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x58a536);
            return _0x58a536 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x3517fd) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x3517fd);
            console['error']('❌\x20Stack\x20trace:', _0x3517fd['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x4fb237, _0x3955ec) {
        let _0x557ed1 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x557ed1 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x5a548c = this['getHistory'](_0x3955ec);
        if (_0x5a548c && _0x5a548c['length'] > 0x0) {
            _0x557ed1 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x5a548c['join']('\x0a');
        }
        _0x557ed1 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x4fb237 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x557ed1;
    }
    async ['_callCustomAI'](_0x28bdea, _0x2237df, _0x2ca54b) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x28bdea);
        try {
            const _0x599d66 = await askAI(_0x28bdea);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x599d66) || this['config']['fallbackResponse'];
        } catch (_0x41c9e9) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x41c9e9['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x591fb2, _0x5a7c1c, _0x5a802f) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x591fb2);
        const _0x57905e = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x5d77ba = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x2940a1 = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x5d77ba) {
            _0x2940a1['Authorization'] = 'Bearer\x20' + _0x5d77ba;
        }
        const _0x2358cf = [];
        if (typeof _0x5a7c1c === 'string' && _0x5a7c1c['trim']()) {
            _0x2358cf['push']({
                'role': 'system',
                'content': _0x5a7c1c
            });
        }
        _0x2358cf['push']({
            'role': 'user',
            'content': _0x591fb2
        });
        try {
            const _0x4db827 = {
                'model': this['config']['pollinationsModel'] || 'openai',
                'messages': _0x2358cf,
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x5a802f?.['isCommandDetection']) {
                _0x4db827['response_format'] = { 'type': 'json_object' };
            }
            const _0x439ac2 = await _0x0_0x3b7561(_0x57905e, {
                'method': 'POST',
                'headers': _0x2940a1,
                'body': JSON['stringify'](_0x4db827)
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x439ac2['status']);
            if (!_0x439ac2['ok']) {
                const _0x25139a = await _0x439ac2['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x25139a);
                if (_0x439ac2['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0x439ac2['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20customai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x4bca5a = await _0x439ac2['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x393eb3 = _0x4bca5a['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x393eb3);
            return this['cleanResponse'](_0x393eb3) || this['config']['fallbackResponse'];
        } catch (_0x2911d0) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x2911d0['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0xf5d607, _0x30272f, _0x268f15) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0xf5d607);
        const _0x568529 = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x568529) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x2d8502} = await import('openai');
            const _0x46ada7 = new _0x2d8502({
                'apiKey': _0x568529,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x8a8a3f = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x8a8a3f);
            const _0x5af085 = {
                'model': _0x8a8a3f,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x30272f || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0xf5d607
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x268f15?.['isCommandDetection']) {
                _0x5af085['response_format'] = { 'type': 'json_object' };
            }
            const _0x102786 = await _0x46ada7['chat']['completions']['create'](_0x5af085);
            const _0x548087 = _0x102786['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x548087) || this['config']['fallbackResponse'];
        } catch (_0x4737dd) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x4737dd['message']);
            if (_0x4737dd['status'] === 0x191 || _0x4737dd['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x4737dd['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x28a57f, _0x36b2df, _0x5843d0) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x28a57f);
        const _0x4dc56f = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x4dc56f) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x4ad518} = await import('@google/genai');
            const _0x19166c = new _0x4ad518({ 'apiKey': _0x4dc56f });
            const _0x485da1 = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0x485da1);
            const _0x384cbf = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x36b2df === 'string' && _0x36b2df['trim']()) {
                _0x384cbf['systemInstruction'] = _0x36b2df;
            }
            if (_0x5843d0?.['isCommandDetection']) {
                _0x384cbf['responseMimeType'] = 'application/json';
                _0x384cbf['responseSchema'] = {
                    'type': 'OBJECT',
                    'properties': {
                        'isCommand': { 'type': 'BOOLEAN' },
                        'command': { 'type': 'STRING' },
                        'args': {
                            'type': 'ARRAY',
                            'items': { 'type': 'STRING' }
                        },
                        'confidence': { 'type': 'STRING' },
                        'reason': { 'type': 'STRING' }
                    },
                    'required': ['isCommand']
                };
            }
            const _0x431c98 = await this['_retryOnTransientError'](() => _0x19166c['models']['generateContent']({
                'model': _0x485da1,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x28a57f }]
                    }],
                'config': _0x384cbf
            }), {
                'retries': 0x2,
                'baseDelayMs': 0x320
            });
            const _0x11c9ac = _0x431c98['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x11c9ac) || this['config']['fallbackResponse'];
        } catch (_0x3400e8) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x3400e8['message']);
            if (_0x3400e8['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0x3400e8['message']?.['includes']('not\x20enabled') || _0x3400e8['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x3400e8['message']?.['includes']('RESOURCE_EXHAUSTED') || _0x3400e8['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            if (_0x3400e8['message']?.['includes']('UNAVAILABLE') || _0x3400e8['message']?.['includes']('503')) {
                return '❌\x20Gemini\x20est\x20surchargé\x20en\x20ce\x20moment\x20(503).\x20J\x27ai\x20réessayé\x20automatiquement\x20sans\x20succès\x20—\x20réessayez\x20dans\x20un\x20instant.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x45524d, _0x2bf082, _0x2d96db) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x45524d);
        const _0x477f36 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x477f36) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x1a5d9c = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x2efead = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x413ec3 = await _0x0_0x3b7561(_0x1a5d9c, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x477f36
                },
                'body': JSON['stringify']({
                    'model': _0x2efead,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x2bf082
                        },
                        {
                            'role': 'user',
                            'content': _0x45524d
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x413ec3['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x413ec3['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x4aa35c = await _0x413ec3['json']();
            const _0x197894 = _0x4aa35c['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x197894) || this['config']['fallbackResponse'];
        } catch (_0x363083) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x363083['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x1492db, _0x212326, _0x497649) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x1492db);
        const _0x1b19ae = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x1b19ae) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x11766c} = await import('openai');
            const _0xc710e5 = new _0x11766c({ 'apiKey': _0x1b19ae });
            const _0x296cbb = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0x296cbb);
            const _0x10e8f6 = {
                'model': _0x296cbb,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x212326 || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x1492db
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x497649?.['isCommandDetection']) {
                _0x10e8f6['response_format'] = { 'type': 'json_object' };
            }
            const _0x5cc9a2 = await _0xc710e5['chat']['completions']['create'](_0x10e8f6);
            const _0x18b488 = _0x5cc9a2['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x18b488) || this['config']['fallbackResponse'];
        } catch (_0x3b786d) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x3b786d['message']);
            if (_0x3b786d['status'] === 0x191 || _0x3b786d['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x3b786d['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x2c978e, _0x3faa1d, _0x547115) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x2c978e);
        const _0x43a8ce = this['config']['apiUrl'];
        if (!_0x43a8ce) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x12685e = await _0x0_0x3b7561(_0x43a8ce, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x2c978e,
                    'context': _0x3faa1d,
                    'metadata': _0x547115
                })
            });
            if (!_0x12685e['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x12685e['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x1d6eb5 = await _0x12685e['json']();
            const _0x50326e = _0x1d6eb5['response'] || _0x1d6eb5['reply'] || _0x1d6eb5['text'] || _0x1d6eb5['result'];
            return this['cleanResponse'](_0x50326e) || this['config']['fallbackResponse'];
        } catch (_0x2b2a67) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x2b2a67['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x516580) {
        const _0x3cb4cd = 'Nova';
        const _0x5c76c8 = [
            new RegExp('^' + _0x3cb4cd + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x3cb4cd + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x3cb4cd + ',?\x5cs+', 'i')
        ];
        let _0x66b6a8 = _0x516580;
        for (const _0x4cffd0 of _0x5c76c8) {
            _0x66b6a8 = _0x66b6a8['replace'](_0x4cffd0, '')['trim']();
        }
        return _0x66b6a8;
    }
    ['cleanResponse'](_0x2cc6f3) {
        if (!_0x2cc6f3)
            return null;
        let _0x5272d3 = _0x2cc6f3['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x5272d3['length'] > 0x7d0) {
            _0x5272d3 = _0x5272d3['slice'](0x0, 0x7d0) + '...';
        }
        return _0x5272d3;
    }
    ['getHistory'](_0x4015e1) {
        const _0x586db3 = this['history']['get'](_0x4015e1) || [];
        const _0x3678f1 = this['config']['maxHistory'] || 0xf;
        return _0x586db3['slice'](-_0x3678f1);
    }
    ['addToHistory'](_0x490b47, _0x570f95, _0x2fe11c) {
        if (!this['history']['has'](_0x490b47)) {
            this['history']['set'](_0x490b47, []);
        }
        const _0x184906 = this['history']['get'](_0x490b47);
        _0x184906['push']('User:\x20' + _0x570f95);
        _0x184906['push']('Nova:\x20' + _0x2fe11c);
        const _0x182ac1 = this['config']['maxHistory'] || 0xf;
        if (_0x184906['length'] > _0x182ac1 * 0x2) {
            this['history']['set'](_0x490b47, _0x184906['slice'](-_0x182ac1 * 0x2));
        }
    }
    ['clearHistory'](_0x1f204e) {
        if (_0x1f204e) {
            this['history']['delete'](_0x1f204e);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x5402aa, _0x3f2b1d) {
        if (_0x5402aa) {
            this['contextCache']['set'](_0x5402aa, _0x3f2b1d);
        } else {
            this['config']['customContext'] = _0x3f2b1d;
            _0x0_0x36b4be['set']('customContext', _0x3f2b1d);
        }
    }
    ['getContext'](_0x1b5f8a) {
        return this['contextCache']['get'](_0x1b5f8a) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x1123c3, _0x1ccb7b) {
        return new Promise((_0x5bd92c, _0x6ea283) => {
            const _0x293800 = setTimeout(() => {
                _0x6ea283(new Error('Request\x20timeout\x20after\x20' + _0x1ccb7b + 'ms'));
            }, _0x1ccb7b);
            _0x1123c3()['then'](_0x2fbfcc => {
                clearTimeout(_0x293800);
                _0x5bd92c(_0x2fbfcc);
            })['catch'](_0x3509d8 => {
                clearTimeout(_0x293800);
                _0x6ea283(_0x3509d8);
            });
        });
    }
    async ['_retryOnTransientError'](_0x48e6ac, {
        retries: retries = 0x2,
        baseDelayMs: baseDelayMs = 0x320
    } = {}) {
        let _0x20eca6;
        for (let _0x5655be = 0x0; _0x5655be <= retries; _0x5655be++) {
            try {
                return await _0x48e6ac();
            } catch (_0x1d8fc1) {
                _0x20eca6 = _0x1d8fc1;
                const _0xc2049a = _0x1d8fc1?.['message'] || '';
                const _0x24f9e6 = _0xc2049a['includes']('UNAVAILABLE') || _0xc2049a['includes']('503') || _0xc2049a['includes']('RESOURCE_EXHAUSTED') || _0xc2049a['includes']('429');
                if (!_0x24f9e6 || _0x5655be === retries) {
                    throw _0x1d8fc1;
                }
                const _0x34ebcf = baseDelayMs * Math['pow'](0x2, _0x5655be);
                console['warn']('⚠️\x20Transient\x20error,\x20retry\x20' + (_0x5655be + 0x1) + '/' + retries + '\x20in\x20' + _0x34ebcf + 'ms:', _0xc2049a);
                await new Promise(_0x25622c => setTimeout(_0x25622c, _0x34ebcf));
            }
        }
        throw _0x20eca6;
    }
}
export default new ChatbotService();