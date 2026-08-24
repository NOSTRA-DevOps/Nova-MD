import _0x0_0x151e5c from 'node-fetch';
import _0x0_0x7d1865 from 'axios';
import _0x0_0x184f0b from './chatbotConfig.js';
import * as _0x0_0x5424d0 from './commandHandler.js';
import _0x0_0x3b3c18 from '../config.js';
import _0x0_0x2ea510 from 'dotenv';
_0x0_0x2ea510['config']();
const AI_APIS = [
    _0x37b028 => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x37b028),
    _0x335859 => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x335859),
    _0x1a0cbb => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x1a0cbb)
];
const askAI = async _0xfedc9 => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0xfedc9);
    for (const _0x33649b of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x33649b(_0xfedc9)['substring'](0x0, 0x32) + '...');
            const {data: _0x4b7fe2} = await _0x0_0x7d1865['get'](_0x33649b(_0xfedc9), { 'timeout': 0x3a98 });
            const _0x9d4160 = _0x4b7fe2?.['data']?.['response'];
            if (_0x9d4160 && typeof _0x9d4160 === 'string' && _0x9d4160['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x9d4160['trim']();
            }
        } catch (_0x107ed3) {
            console['log']('⚠️\x20API\x20failed:', _0x107ed3['message']);
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
            'systemai': this['_callCustomAI']['bind'](this),
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
        if (!_0x0_0x5424d0 || !_0x0_0x5424d0['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x3b8361 = Array['from'](_0x0_0x5424d0['commands']['values']());
            const _0x8ef9ff = {};
            for (const _0x386fde of _0x3b8361) {
                const _0x2274f9 = _0x386fde['category'] || 'misc';
                if (!_0x8ef9ff[_0x2274f9])
                    _0x8ef9ff[_0x2274f9] = [];
                _0x8ef9ff[_0x2274f9]['push']({
                    'name': _0x386fde['command'],
                    'description': _0x386fde['description'] || 'No\x20description',
                    'aliases': _0x386fde['aliases'] || [],
                    'usage': _0x386fde['usage'] || '.' + _0x386fde['command']
                });
            }
            let _0x272dde = '';
            for (const [_0x53dcb6, _0x523760] of Object['entries'](_0x8ef9ff)) {
                _0x272dde += '\x0a' + _0x53dcb6['toUpperCase']() + ':\x0a';
                for (const _0x41775b of _0x523760) {
                    _0x272dde += '-\x20' + _0x41775b['name'] + ':\x20' + _0x41775b['description'];
                    if (_0x41775b['aliases']['length']) {
                        _0x272dde += '\x20(aliases:\x20' + _0x41775b['aliases']['join'](',\x20') + ')';
                    }
                    _0x272dde += '\x0a';
                }
            }
            return _0x272dde || 'No\x20commands\x20available';
        } catch (_0x3de4d1) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x3de4d1);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x184f0b['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'systemai',
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
    async ['getResponse'](_0x1c1fa7, _0x3fca3a, _0x4b0643, _0x2d852a = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x1c1fa7);
        console['log']('📝\x20Chat\x20ID:', _0x3fca3a);
        console['log']('📝\x20Sender\x20ID:', _0x4b0643);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x514c9e = this['cleanMessage'](_0x1c1fa7);
            console['log']('📝\x20Clean\x20message:', _0x514c9e);
            if (!_0x514c9e || _0x514c9e['length'] < 0x1) {
                console['log']('❌\x20Empty\x20message\x20after\x20cleaning');
                return null;
            }
            if (this['config']['provider'] !== 'systemai' && this['config']['provider'] !== 'pollinations' && !this['config']['apiKey']) {
                console['log']('❌\x20No\x20API\x20key\x20for\x20provider:', this['config']['provider']);
                return this['_missingApiKeyMessage']();
            }
            console['log']('✅\x20Chatbot\x20will\x20process\x20message');
            if (this['config']['executeCommands']) {
                console['log']('🔍\x20Checking\x20for\x20commands...');
                const _0x1c541c = await this['intelligentCommandDetection'](_0x514c9e);
                if (_0x1c541c && _0x1c541c['isCommand'] && _0x1c541c['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x1c541c['command']);
                    const _0x2f6953 = await this['executeCommand'](_0x1c541c['command'], _0x1c541c['args'] || [], _0x3fca3a, _0x4b0643, _0x2d852a);
                    if (_0x2f6953['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x2f6953['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x2f6953['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x1c541c['command'] + '`.\x20' + (_0x2f6953['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x1a5f1a = await this['generateNaturalResponse'](_0x514c9e, _0x3fca3a, _0x4b0643);
            console['log']('✅\x20Response\x20generated:', _0x1a5f1a);
            return _0x1a5f1a;
        } catch (_0x292f5e) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x292f5e);
            console['error']('❌\x20Stack\x20trace:', _0x292f5e['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20systemai\x20avec\x20`.cbc\x20provider\x20systemai`';
    }
    async ['intelligentCommandDetection'](_0x167e1b) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x167e1b);
        try {
            const _0xee700d = this['buildCommandDetectionPrompt'](_0x167e1b);
            const _0x493d18 = this['config']['provider'] || 'systemai';
            const _0x2a86fc = this['providers'][_0x493d18];
            if (!_0x2a86fc) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x167e1b);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x493d18);
            const _0x394928 = await this['_callWithTimeout'](() => _0x2a86fc(_0xee700d, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x394928);
            const _0x5acb7f = _0x394928['match'](/\{[\s\S]*\}/);
            if (_0x5acb7f) {
                try {
                    const _0x572915 = JSON['parse'](_0x5acb7f[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x572915);
                    if (_0x572915['isCommand'] && _0x572915['command']) {
                        if (_0x0_0x5424d0 && _0x0_0x5424d0['commands'] && _0x0_0x5424d0['commands']['has'](_0x572915['command'])) {
                            return _0x572915;
                        }
                        const _0x5e2c79 = this['findSimilarCommand'](_0x572915['command']);
                        if (_0x5e2c79 && _0x0_0x5424d0['commands'] && _0x0_0x5424d0['commands']['has'](_0x5e2c79)) {
                            _0x572915['command'] = _0x5e2c79;
                            _0x572915['suggested'] = !![];
                            return _0x572915;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x572915;
                } catch (_0x4c8809) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x4c8809);
                }
            }
            return this['simpleKeywordDetection'](_0x167e1b);
        } catch (_0x1a4047) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x1a4047);
            return this['simpleKeywordDetection'](_0x167e1b);
        }
    }
    ['buildCommandDetectionPrompt'](_0x1bfecd) {
        if (!_0x0_0x5424d0 || !_0x0_0x5424d0['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x1bfecd + '\x22';
        }
        const _0x10b5db = Array['from'](_0x0_0x5424d0['commands']['values']());
        let _0x138ee0 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x29ccd6 of _0x10b5db) {
            _0x138ee0 += '-\x20' + _0x29ccd6['command'];
            if (_0x29ccd6['aliases'] && _0x29ccd6['aliases']['length']) {
                _0x138ee0 += '\x20(alias:\x20' + _0x29ccd6['aliases']['join'](',\x20') + ')';
            }
            _0x138ee0 += ':\x20' + (_0x29ccd6['description'] || 'Pas\x20de\x20description');
            if (_0x29ccd6['usage']) {
                _0x138ee0 += '\x20[Utilisation:\x20' + _0x29ccd6['usage'] + ']';
            }
            _0x138ee0 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x138ee0 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x1bfecd + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x5e0e02) {
        const _0x244ab8 = _0x5e0e02['toLowerCase']();
        const _0x42605a = {
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
                'ban',
                'bannir',
                'exclure'
            ],
            'kick': [
                'kick',
                'expulser',
                'virer'
            ],
            'promote': [
                'promote',
                'promouvoir',
                'admin'
            ],
            'demote': [
                'demote',
                'rétrograder'
            ],
            'profilepic': [
                'profilepic',
                'pp',
                'photo\x20de\x20profil',
                'avatar'
            ],
            'viewonce': [
                'viewonce',
                'view\x20once',
                'message\x20éphémère'
            ],
            'ping': [
                'ping',
                'test',
                'status'
            ]
        };
        let _0x30b8c3 = null;
        let _0x5399a5 = 0x0;
        for (const [_0x192a54, _0x25025c] of Object['entries'](_0x42605a)) {
            let _0x197d26 = 0x0;
            for (const _0x1601c8 of _0x25025c) {
                if (_0x244ab8['includes'](_0x1601c8)) {
                    _0x197d26 += _0x1601c8['length'] / 0x5;
                }
            }
            if (_0x197d26 > _0x5399a5 && _0x197d26 > 0x1) {
                _0x5399a5 = _0x197d26;
                _0x30b8c3 = _0x192a54;
            }
        }
        if (_0x30b8c3) {
            const _0x59588c = this['extractArgs'](_0x5e0e02);
            return {
                'isCommand': !![],
                'command': _0x30b8c3,
                'args': _0x59588c,
                'confidence': _0x5399a5 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x30b8c3
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x3cd3c1) {
        const _0x19e233 = [];
        const _0x1266d4 = _0x3cd3c1['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x1266d4)
            _0x19e233['push'](..._0x1266d4);
        const _0x4f1bf6 = _0x3cd3c1['match'](/\d+/g);
        if (_0x4f1bf6)
            _0x19e233['push'](..._0x4f1bf6);
        const _0x11e744 = _0x3cd3c1['match'](/"([^"]*)"/g);
        if (_0x11e744)
            _0x19e233['push'](..._0x11e744['map'](_0x58b8f9 => _0x58b8f9['replace'](/"/g, '')));
        const _0x8c569a = _0x3cd3c1['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x8c569a && _0x8c569a[0x1]) {
            _0x19e233['push'](_0x8c569a[0x1]['trim']());
        }
        return _0x19e233;
    }
    ['findSimilarCommand'](_0x4fe5cf) {
        if (!_0x0_0x5424d0 || !_0x0_0x5424d0['commands'])
            return null;
        const _0x4c8851 = Array['from'](_0x0_0x5424d0['commands']['keys']());
        const _0x1e2fa1 = _0x4c8851['filter'](_0x334a57 => _0x334a57['includes'](_0x4fe5cf) || _0x4fe5cf['includes'](_0x334a57) || this['levenshteinDistance'](_0x334a57, _0x4fe5cf) < 0x3);
        return _0x1e2fa1[0x0] || null;
    }
    ['levenshteinDistance'](_0x3ce673, _0x28248e) {
        const _0x38a004 = [];
        for (let _0x5c89ed = 0x0; _0x5c89ed <= _0x28248e['length']; _0x5c89ed++) {
            _0x38a004[_0x5c89ed] = [_0x5c89ed];
        }
        for (let _0x22cf6a = 0x0; _0x22cf6a <= _0x3ce673['length']; _0x22cf6a++) {
            _0x38a004[0x0][_0x22cf6a] = _0x22cf6a;
        }
        for (let _0x131680 = 0x1; _0x131680 <= _0x28248e['length']; _0x131680++) {
            for (let _0x1fab71 = 0x1; _0x1fab71 <= _0x3ce673['length']; _0x1fab71++) {
                if (_0x28248e[_0x131680 - 0x1] === _0x3ce673[_0x1fab71 - 0x1]) {
                    _0x38a004[_0x131680][_0x1fab71] = _0x38a004[_0x131680 - 0x1][_0x1fab71 - 0x1];
                } else {
                    _0x38a004[_0x131680][_0x1fab71] = Math['min'](_0x38a004[_0x131680 - 0x1][_0x1fab71 - 0x1] + 0x1, _0x38a004[_0x131680][_0x1fab71 - 0x1] + 0x1, _0x38a004[_0x131680 - 0x1][_0x1fab71] + 0x1);
                }
            }
        }
        return _0x38a004[_0x28248e['length']][_0x3ce673['length']];
    }
    async ['executeCommand'](_0xda2c8, _0x12cfc5, _0x4c683f, _0x5a10bf, _0xdafe43) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0xda2c8, _0x12cfc5);
            if (!_0x0_0x5424d0 || !_0x0_0x5424d0['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0x3a6811 = _0x0_0x5424d0['commands']['get'](_0xda2c8);
            if (!_0x3a6811) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x10ee4c = _0xdafe43['isOwnerOrSudo'] || ![];
            const _0x131733 = _0xdafe43['isFromMe'] || ![];
            const _0x1fb6a1 = _0x4c683f['endsWith']('@g.us');
            if (_0x3a6811['ownerOnly'] && !_0x10ee4c && !_0x131733) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x3a6811['groupOnly'] && !_0x1fb6a1) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x3c44ff = {
                'key': {
                    'remoteJid': _0x4c683f,
                    'participant': _0x5a10bf
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0xda2c8 + '\x20' + _0x12cfc5['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0xdafe43['pushName'] || 'User'
            };
            await _0x3a6811['handler'](_0xdafe43['sock'], _0x3c44ff, _0x12cfc5, {
                'chatId': _0x4c683f,
                'senderId': _0x5a10bf,
                'isGroup': _0x1fb6a1,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0xda2c8 + '\x20' + _0x12cfc5['join']('\x20'),
                'messageText': _0xda2c8 + '\x20' + _0x12cfc5['join']('\x20'),
                'userMessage': _0xda2c8 + '\x20' + _0x12cfc5['join']('\x20'),
                'config': _0x0_0x3b3c18
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0xda2c8 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x857c45) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x857c45);
            return {
                'success': ![],
                'error': _0x857c45['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x3ad8ff, _0x21bcd8, _0x441992) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x3ad8ff);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x4093ee = this['buildConversationContext'](_0x3ad8ff, _0x21bcd8);
            console['log']('📝\x20Context\x20built,\x20length:', _0x4093ee['length']);
            const _0x168dae = this['config']['provider'] || 'systemai';
            const _0x43abff = this['providers'][_0x168dae];
            if (!_0x43abff) {
                console['error']('❌\x20Provider\x20' + _0x168dae + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x168dae);
            const _0x58a331 = await this['_callWithTimeout'](() => _0x43abff(_0x3ad8ff, _0x4093ee, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x58a331);
            const _0x5ded54 = this['cleanResponse'](_0x58a331);
            this['addToHistory'](_0x21bcd8, _0x3ad8ff, _0x5ded54);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x5ded54);
            return _0x5ded54 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x3071a4) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x3071a4);
            console['error']('❌\x20Stack\x20trace:', _0x3071a4['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x10aebf, _0x2aad16) {
        let _0x545023 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x545023 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x1aaa97 = this['getHistory'](_0x2aad16);
        if (_0x1aaa97 && _0x1aaa97['length'] > 0x0) {
            _0x545023 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x1aaa97['join']('\x0a');
        }
        _0x545023 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x10aebf + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x545023;
    }
    async ['_callCustomAI'](_0x5ec412, _0x4e9b2d, _0x1836a6) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x5ec412);
        try {
            const _0x6c2cb9 = await askAI(_0x5ec412);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x6c2cb9) || this['config']['fallbackResponse'];
        } catch (_0x40ccf3) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x40ccf3['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x2366a6, _0x2fff24, _0x231074) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x2366a6);
        const _0x12c897 = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x1a703a = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x4261fe = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x1a703a) {
            _0x4261fe['Authorization'] = 'Bearer\x20' + _0x1a703a;
        }
        const _0x18529e = [];
        if (typeof _0x2fff24 === 'string' && _0x2fff24['trim']()) {
            _0x18529e['push']({
                'role': 'system',
                'content': _0x2fff24
            });
        }
        _0x18529e['push']({
            'role': 'user',
            'content': _0x2366a6
        });
        try {
            const _0x421e9c = await _0x0_0x151e5c(_0x12c897, {
                'method': 'POST',
                'headers': _0x4261fe,
                'body': JSON['stringify']({
                    'model': this['config']['pollinationsModel'] || 'openai',
                    'messages': _0x18529e,
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x421e9c['status']);
            if (!_0x421e9c['ok']) {
                const _0x17c0c7 = await _0x421e9c['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x17c0c7);
                if (_0x421e9c['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0x421e9c['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20systemai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x21819a = await _0x421e9c['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x5678c3 = _0x21819a['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x5678c3);
            return this['cleanResponse'](_0x5678c3) || this['config']['fallbackResponse'];
        } catch (_0x4649a9) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x4649a9['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x4c6d2f, _0x37d618, _0x4345b2) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x4c6d2f);
        const _0x207c9f = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x207c9f) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0xd06336} = await import('openai');
            const _0x3d7d14 = new _0xd06336({
                'apiKey': _0x207c9f,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x5a0b76 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x5a0b76);
            const _0x4ab45a = await _0x3d7d14['chat']['completions']['create']({
                'model': _0x5a0b76,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x37d618
                    },
                    {
                        'role': 'user',
                        'content': _0x4c6d2f
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x46f629 = _0x4ab45a['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x46f629) || this['config']['fallbackResponse'];
        } catch (_0x2dcbdd) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x2dcbdd['message']);
            if (_0x2dcbdd['status'] === 0x191 || _0x2dcbdd['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x2dcbdd['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x269b47, _0x3e9c1d, _0x2d8e94) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x269b47);
        const _0x27c1bd = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x27c1bd) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x48ca08} = await import('@google/genai');
            const _0x3b678c = new _0x48ca08({ 'apiKey': _0x27c1bd });
            const _0x5ce6d4 = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0x5ce6d4);
            const _0x2b7d6a = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x3e9c1d === 'string' && _0x3e9c1d['trim']()) {
                _0x2b7d6a['systemInstruction'] = _0x3e9c1d;
            }
            const _0x10fb02 = await _0x3b678c['models']['generateContent']({
                'model': _0x5ce6d4,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x269b47 }]
                    }],
                'config': _0x2b7d6a
            });
            const _0xee14f8 = _0x10fb02['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0xee14f8) || this['config']['fallbackResponse'];
        } catch (_0x1ca406) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x1ca406['message']);
            if (_0x1ca406['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0x1ca406['message']?.['includes']('not\x20enabled') || _0x1ca406['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x1ca406['message']?.['includes']('RESOURCE_EXHAUSTED') || _0x1ca406['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x5aabd8, _0x33bbda, _0x305d4b) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x5aabd8);
        const _0x37022d = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x37022d) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x291cd1 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x15ef8d = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x12e293 = await _0x0_0x151e5c(_0x291cd1, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x37022d
                },
                'body': JSON['stringify']({
                    'model': _0x15ef8d,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x33bbda
                        },
                        {
                            'role': 'user',
                            'content': _0x5aabd8
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x12e293['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x12e293['text']());
                return this['config']['fallbackResponse'];
            }
            const _0xe27e5e = await _0x12e293['json']();
            const _0x22ae93 = _0xe27e5e['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x22ae93) || this['config']['fallbackResponse'];
        } catch (_0x314ce0) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x314ce0['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x38997b, _0x37db82, _0x2c634a) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x38997b);
        const _0x47faef = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x47faef) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x3964e7} = await import('openai');
            const _0x5604a3 = new _0x3964e7({ 'apiKey': _0x47faef });
            const _0x25f661 = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0x25f661);
            const _0x97315e = await _0x5604a3['chat']['completions']['create']({
                'model': _0x25f661,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x37db82
                    },
                    {
                        'role': 'user',
                        'content': _0x38997b
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x412075 = _0x97315e['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x412075) || this['config']['fallbackResponse'];
        } catch (_0x4fc0cf) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x4fc0cf['message']);
            if (_0x4fc0cf['status'] === 0x191 || _0x4fc0cf['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x4fc0cf['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x81096d, _0x44cf64, _0x32c76c) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x81096d);
        const _0x464218 = this['config']['apiUrl'];
        if (!_0x464218) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x2385fe = await _0x0_0x151e5c(_0x464218, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x81096d,
                    'context': _0x44cf64,
                    'metadata': _0x32c76c
                })
            });
            if (!_0x2385fe['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x2385fe['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x4dbc35 = await _0x2385fe['json']();
            const _0x1b0281 = _0x4dbc35['response'] || _0x4dbc35['reply'] || _0x4dbc35['text'] || _0x4dbc35['result'];
            return this['cleanResponse'](_0x1b0281) || this['config']['fallbackResponse'];
        } catch (_0x168ef4) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x168ef4['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x393e92) {
        const _0x2c2ce3 = 'Nova';
        const _0x4cec81 = [
            new RegExp('^' + _0x2c2ce3 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x2c2ce3 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x2c2ce3 + ',?\x5cs+', 'i')
        ];
        let _0x2e7fb7 = _0x393e92;
        for (const _0x5b76e7 of _0x4cec81) {
            _0x2e7fb7 = _0x2e7fb7['replace'](_0x5b76e7, '')['trim']();
        }
        return _0x2e7fb7;
    }
    ['cleanResponse'](_0x517a94) {
        if (!_0x517a94)
            return null;
        let _0x11b61e = _0x517a94['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x11b61e['length'] > 0x7d0) {
            _0x11b61e = _0x11b61e['slice'](0x0, 0x7d0) + '...';
        }
        return _0x11b61e;
    }
    ['getHistory'](_0x133a14) {
        const _0x512674 = this['history']['get'](_0x133a14) || [];
        const _0x4b0cde = this['config']['maxHistory'] || 0xf;
        return _0x512674['slice'](-_0x4b0cde);
    }
    ['addToHistory'](_0x427859, _0x5b5dde, _0x272aa6) {
        if (!this['history']['has'](_0x427859)) {
            this['history']['set'](_0x427859, []);
        }
        const _0x521f60 = this['history']['get'](_0x427859);
        _0x521f60['push']('User:\x20' + _0x5b5dde);
        _0x521f60['push']('Nova:\x20' + _0x272aa6);
        const _0x2b0815 = this['config']['maxHistory'] || 0xf;
        if (_0x521f60['length'] > _0x2b0815 * 0x2) {
            this['history']['set'](_0x427859, _0x521f60['slice'](-_0x2b0815 * 0x2));
        }
    }
    ['clearHistory'](_0x37d117) {
        if (_0x37d117) {
            this['history']['delete'](_0x37d117);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x1d1ba4, _0x3db1c2) {
        if (_0x1d1ba4) {
            this['contextCache']['set'](_0x1d1ba4, _0x3db1c2);
        } else {
            this['config']['customContext'] = _0x3db1c2;
            _0x0_0x184f0b['set']('customContext', _0x3db1c2);
        }
    }
    ['getContext'](_0x4f6adb) {
        return this['contextCache']['get'](_0x4f6adb) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x58b039, _0x595962) {
        return new Promise((_0x114a7f, _0x29cbca) => {
            const _0x6a2a2a = setTimeout(() => {
                _0x29cbca(new Error('Request\x20timeout\x20after\x20' + _0x595962 + 'ms'));
            }, _0x595962);
            _0x58b039()['then'](_0x50413a => {
                clearTimeout(_0x6a2a2a);
                _0x114a7f(_0x50413a);
            })['catch'](_0x2f9fd0 => {
                clearTimeout(_0x6a2a2a);
                _0x29cbca(_0x2f9fd0);
            });
        });
    }
}
export default new ChatbotService();