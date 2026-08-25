import _0x0_0x32d415 from 'node-fetch';
import _0x0_0x2e63db from 'axios';
import _0x0_0x37af6b from './chatbotConfig.js';
import * as _0x0_0x1e8a3c from './commandHandler.js';
import _0x0_0x561067 from '../config.js';
import _0x0_0x257287 from 'dotenv';
_0x0_0x257287['config']();
const AI_APIS = [
    _0xf5b94d => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0xf5b94d),
    _0x21565f => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x21565f),
    _0xb8f86c => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0xb8f86c)
];
const askAI = async _0x4d5639 => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x4d5639);
    for (const _0x4dd261 of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x4dd261(_0x4d5639)['substring'](0x0, 0x32) + '...');
            const {data: _0xf0a313} = await _0x0_0x2e63db['get'](_0x4dd261(_0x4d5639), { 'timeout': 0x3a98 });
            const _0x255cd4 = _0xf0a313?.['data']?.['response'];
            if (_0x255cd4 && typeof _0x255cd4 === 'string' && _0x255cd4['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x255cd4['trim']();
            }
        } catch (_0x12c44d) {
            console['log']('⚠️\x20API\x20failed:', _0x12c44d['message']);
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
        if (!_0x0_0x1e8a3c || !_0x0_0x1e8a3c['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x3f283c = Array['from'](_0x0_0x1e8a3c['commands']['values']());
            const _0xa02a11 = {};
            for (const _0x36ba56 of _0x3f283c) {
                const _0x52d4cd = _0x36ba56['category'] || 'misc';
                if (!_0xa02a11[_0x52d4cd])
                    _0xa02a11[_0x52d4cd] = [];
                _0xa02a11[_0x52d4cd]['push']({
                    'name': _0x36ba56['command'],
                    'description': _0x36ba56['description'] || 'No\x20description',
                    'aliases': _0x36ba56['aliases'] || [],
                    'usage': _0x36ba56['usage'] || '.' + _0x36ba56['command']
                });
            }
            let _0x140200 = '';
            for (const [_0x5be7e8, _0x40a5cb] of Object['entries'](_0xa02a11)) {
                _0x140200 += '\x0a' + _0x5be7e8['toUpperCase']() + ':\x0a';
                for (const _0x5e1222 of _0x40a5cb) {
                    _0x140200 += '-\x20' + _0x5e1222['name'] + ':\x20' + _0x5e1222['description'];
                    if (_0x5e1222['aliases']['length']) {
                        _0x140200 += '\x20(aliases:\x20' + _0x5e1222['aliases']['join'](',\x20') + ')';
                    }
                    _0x140200 += '\x0a';
                }
            }
            return _0x140200 || 'No\x20commands\x20available';
        } catch (_0x1fb44e) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x1fb44e);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x37af6b['config'] || {
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
    async ['getResponse'](_0x28a81c, _0x4bc8bf, _0x3e28d8, _0x32d8eb = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x28a81c);
        console['log']('📝\x20Chat\x20ID:', _0x4bc8bf);
        console['log']('📝\x20Sender\x20ID:', _0x3e28d8);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x102c00 = this['cleanMessage'](_0x28a81c);
            console['log']('📝\x20Clean\x20message:', _0x102c00);
            if (!_0x102c00 || _0x102c00['length'] < 0x1) {
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
                const _0x48d24b = await this['intelligentCommandDetection'](_0x102c00);
                if (_0x48d24b && _0x48d24b['isCommand'] && _0x48d24b['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x48d24b['command']);
                    const _0xfe93e5 = await this['executeCommand'](_0x48d24b['command'], _0x48d24b['args'] || [], _0x4bc8bf, _0x3e28d8, _0x32d8eb);
                    if (_0xfe93e5['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0xfe93e5['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0xfe93e5['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x48d24b['command'] + '`.\x20' + (_0xfe93e5['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0xdeac1b = await this['generateNaturalResponse'](_0x102c00, _0x4bc8bf, _0x3e28d8);
            console['log']('✅\x20Response\x20generated:', _0xdeac1b);
            return _0xdeac1b;
        } catch (_0xb5d38) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0xb5d38);
            console['error']('❌\x20Stack\x20trace:', _0xb5d38['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20customai\x20avec\x20`.cbc\x20provider\x20customai`';
    }
    async ['intelligentCommandDetection'](_0x41afc3) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x41afc3);
        try {
            const _0x2c4a43 = this['buildCommandDetectionPrompt'](_0x41afc3);
            const _0x4eae45 = this['config']['provider'] || 'customai';
            const _0x5ac46a = this['providers'][_0x4eae45];
            if (!_0x5ac46a) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x41afc3);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x4eae45);
            const _0x37c272 = await this['_callWithTimeout'](() => _0x5ac46a(_0x2c4a43, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x37c272);
            const _0x42c127 = this['_extractJson'](_0x37c272);
            if (_0x42c127) {
                try {
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x42c127);
                    if (_0x42c127['isCommand'] && _0x42c127['command']) {
                        if (_0x0_0x1e8a3c && _0x0_0x1e8a3c['commands'] && _0x0_0x1e8a3c['commands']['has'](_0x42c127['command'])) {
                            return _0x42c127;
                        }
                        const _0x545922 = this['findSimilarCommand'](_0x42c127['command']);
                        if (_0x545922 && _0x0_0x1e8a3c['commands'] && _0x0_0x1e8a3c['commands']['has'](_0x545922)) {
                            _0x42c127['command'] = _0x545922;
                            _0x42c127['suggested'] = !![];
                            return _0x42c127;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x42c127;
                } catch (_0x4120b3) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x4120b3);
                }
            }
            return this['simpleKeywordDetection'](_0x41afc3);
        } catch (_0x2f9441) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x2f9441);
            return this['simpleKeywordDetection'](_0x41afc3);
        }
    }
    ['_extractJson'](_0x85720c) {
        if (!_0x85720c || typeof _0x85720c !== 'string')
            return null;
        const _0x241388 = _0x85720c['trim']();
        try {
            return JSON['parse'](_0x241388);
        } catch (_0x3be8c5) {
        }
        const _0x337ae2 = _0x241388['match'](/\{[\s\S]*\}/);
        if (_0x337ae2) {
            try {
                return JSON['parse'](_0x337ae2[0x0]);
            } catch (_0x465d59) {
                return null;
            }
        }
        return null;
    }
    ['buildCommandDetectionPrompt'](_0x4972bb) {
        if (!_0x0_0x1e8a3c || !_0x0_0x1e8a3c['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x4972bb + '\x22';
        }
        const _0x4dc4f2 = Array['from'](_0x0_0x1e8a3c['commands']['values']());
        let _0xdd7b58 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x199261 of _0x4dc4f2) {
            _0xdd7b58 += '-\x20' + _0x199261['command'];
            if (_0x199261['aliases'] && _0x199261['aliases']['length']) {
                _0xdd7b58 += '\x20(alias:\x20' + _0x199261['aliases']['join'](',\x20') + ')';
            }
            _0xdd7b58 += ':\x20' + (_0x199261['description'] || 'Pas\x20de\x20description');
            if (_0x199261['usage']) {
                _0xdd7b58 += '\x20[Utilisation:\x20' + _0x199261['usage'] + ']';
            }
            _0xdd7b58 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0xdd7b58 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x4972bb + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20et\x20STRICTEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x1a56d6) {
        const _0x461e74 = _0x1a56d6['toLowerCase']();
        if (_0x0_0x1e8a3c && _0x0_0x1e8a3c['commands']) {
            for (const [_0x478ad3, _0x693a95] of _0x0_0x1e8a3c['commands']) {
                const _0x48acfa = [
                    _0x478ad3,
                    ...(_0x693a95['aliases'] || [])['map'](_0x43ab99 => _0x43ab99['toLowerCase']())
                ];
                for (const _0x51e742 of _0x48acfa) {
                    if (_0x51e742['length'] < 0x3)
                        continue;
                    if (new RegExp('\x5cb' + _0x51e742['replace'](/[.*+?^${}()|[\]\\]/g, '\x5c$&') + '\x5cb', 'i')['test'](_0x461e74)) {
                        return {
                            'isCommand': !![],
                            'command': _0x478ad3,
                            'args': this['extractArgs'](_0x1a56d6),
                            'confidence': 'medium',
                            'reason': 'Mot-clé\x20détecté\x20(commande\x20enregistrée):\x20' + _0x51e742
                        };
                    }
                }
            }
        }
        const _0x383942 = {
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
        let _0x5f5a93 = null;
        let _0x25fcb2 = 0x0;
        for (const [_0x2ed09f, _0xea4f47] of Object['entries'](_0x383942)) {
            let _0x3eec17 = 0x0;
            for (const _0x2fcb41 of _0xea4f47) {
                if (_0x461e74['includes'](_0x2fcb41)) {
                    _0x3eec17 += _0x2fcb41['length'] / 0x5;
                }
            }
            if (_0x3eec17 > _0x25fcb2 && _0x3eec17 > 0x1) {
                _0x25fcb2 = _0x3eec17;
                _0x5f5a93 = _0x2ed09f;
            }
        }
        if (_0x5f5a93 && _0x0_0x1e8a3c?.['commands']?.['has'](_0x5f5a93)) {
            const _0x44fb4e = this['extractArgs'](_0x1a56d6);
            return {
                'isCommand': !![],
                'command': _0x5f5a93,
                'args': _0x44fb4e,
                'confidence': _0x25fcb2 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x5f5a93
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x3ba647) {
        const _0x2a9ae9 = [];
        const _0x251b8b = _0x3ba647['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x251b8b)
            _0x2a9ae9['push'](..._0x251b8b);
        const _0x120d2f = _0x3ba647['match'](/\d+/g);
        if (_0x120d2f)
            _0x2a9ae9['push'](..._0x120d2f);
        const _0x550462 = _0x3ba647['match'](/"([^"]*)"/g);
        if (_0x550462)
            _0x2a9ae9['push'](..._0x550462['map'](_0x5f1b33 => _0x5f1b33['replace'](/"/g, '')));
        const _0x2a69f6 = _0x3ba647['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x2a69f6 && _0x2a69f6[0x1]) {
            _0x2a9ae9['push'](_0x2a69f6[0x1]['trim']());
        }
        return _0x2a9ae9;
    }
    ['findSimilarCommand'](_0x1e8f74) {
        if (!_0x0_0x1e8a3c || !_0x0_0x1e8a3c['commands'])
            return null;
        const _0x5bacb4 = Array['from'](_0x0_0x1e8a3c['commands']['keys']());
        const _0x568177 = _0x5bacb4['filter'](_0x54dc1d => _0x54dc1d['includes'](_0x1e8f74) || _0x1e8f74['includes'](_0x54dc1d) || this['levenshteinDistance'](_0x54dc1d, _0x1e8f74) < 0x3);
        return _0x568177[0x0] || null;
    }
    ['levenshteinDistance'](_0x15a230, _0x5d937e) {
        const _0x15f185 = [];
        for (let _0x5809eb = 0x0; _0x5809eb <= _0x5d937e['length']; _0x5809eb++) {
            _0x15f185[_0x5809eb] = [_0x5809eb];
        }
        for (let _0x20623d = 0x0; _0x20623d <= _0x15a230['length']; _0x20623d++) {
            _0x15f185[0x0][_0x20623d] = _0x20623d;
        }
        for (let _0x546d3b = 0x1; _0x546d3b <= _0x5d937e['length']; _0x546d3b++) {
            for (let _0x7685ed = 0x1; _0x7685ed <= _0x15a230['length']; _0x7685ed++) {
                if (_0x5d937e[_0x546d3b - 0x1] === _0x15a230[_0x7685ed - 0x1]) {
                    _0x15f185[_0x546d3b][_0x7685ed] = _0x15f185[_0x546d3b - 0x1][_0x7685ed - 0x1];
                } else {
                    _0x15f185[_0x546d3b][_0x7685ed] = Math['min'](_0x15f185[_0x546d3b - 0x1][_0x7685ed - 0x1] + 0x1, _0x15f185[_0x546d3b][_0x7685ed - 0x1] + 0x1, _0x15f185[_0x546d3b - 0x1][_0x7685ed] + 0x1);
                }
            }
        }
        return _0x15f185[_0x5d937e['length']][_0x15a230['length']];
    }
    async ['executeCommand'](_0x3feea3, _0x5981c6, _0x1f88d8, _0xc71474, _0x1abb83) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x3feea3, _0x5981c6);
            if (!_0x0_0x1e8a3c || !_0x0_0x1e8a3c['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0x413215 = _0x0_0x1e8a3c['commands']['get'](_0x3feea3);
            if (!_0x413215) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x2b90ea = _0x1abb83['isOwnerOrSudo'] || ![];
            const _0x5cf4ff = _0x1abb83['isFromMe'] || ![];
            const _0x1cc7c5 = _0x1f88d8['endsWith']('@g.us');
            if (_0x413215['ownerOnly'] && !_0x2b90ea && !_0x5cf4ff) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x413215['groupOnly'] && !_0x1cc7c5) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x1139c2 = {
                'key': {
                    'remoteJid': _0x1f88d8,
                    'participant': _0xc71474
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x3feea3 + '\x20' + _0x5981c6['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x1abb83['pushName'] || 'User'
            };
            await _0x413215['handler'](_0x1abb83['sock'], _0x1139c2, _0x5981c6, {
                'chatId': _0x1f88d8,
                'senderId': _0xc71474,
                'isGroup': _0x1cc7c5,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x3feea3 + '\x20' + _0x5981c6['join']('\x20'),
                'messageText': _0x3feea3 + '\x20' + _0x5981c6['join']('\x20'),
                'userMessage': _0x3feea3 + '\x20' + _0x5981c6['join']('\x20'),
                'config': _0x0_0x561067
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x3feea3 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x1d7a2a) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x1d7a2a);
            return {
                'success': ![],
                'error': _0x1d7a2a['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x19aa4b, _0x4b26c3, _0x2a0e1b) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x19aa4b);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x4424a5 = this['buildConversationContext'](_0x19aa4b, _0x4b26c3);
            console['log']('📝\x20Context\x20built,\x20length:', _0x4424a5['length']);
            const _0x57cae9 = this['config']['provider'] || 'customai';
            const _0x3fd5be = this['providers'][_0x57cae9];
            if (!_0x3fd5be) {
                console['error']('❌\x20Provider\x20' + _0x57cae9 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x57cae9);
            const _0x2178b6 = await this['_callWithTimeout'](() => _0x3fd5be(_0x19aa4b, _0x4424a5, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x2178b6);
            const _0x6c6516 = this['cleanResponse'](_0x2178b6);
            this['addToHistory'](_0x4b26c3, _0x19aa4b, _0x6c6516);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x6c6516);
            return _0x6c6516 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x3a4db2) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x3a4db2);
            console['error']('❌\x20Stack\x20trace:', _0x3a4db2['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x2ce8ab, _0x3352e2) {
        let _0x4a32fc = this['baseContext'];
        if (this['config']['customContext']) {
            _0x4a32fc += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x3881d0 = this['getHistory'](_0x3352e2);
        if (_0x3881d0 && _0x3881d0['length'] > 0x0) {
            _0x4a32fc += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x3881d0['join']('\x0a');
        }
        _0x4a32fc += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x2ce8ab + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x4a32fc;
    }
    async ['_callCustomAI'](_0x3f563f, _0x2102c4, _0x1fa81e) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x3f563f);
        try {
            const _0x1a5b13 = await askAI(_0x3f563f);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x1a5b13) || this['config']['fallbackResponse'];
        } catch (_0x58cd6a) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x58cd6a['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x57bf0e, _0x3a570e, _0x3ccba4) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x57bf0e);
        const _0x4d7367 = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x55c5c2 = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x55c8f8 = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x55c5c2) {
            _0x55c8f8['Authorization'] = 'Bearer\x20' + _0x55c5c2;
        }
        const _0x320053 = [];
        if (typeof _0x3a570e === 'string' && _0x3a570e['trim']()) {
            _0x320053['push']({
                'role': 'system',
                'content': _0x3a570e
            });
        }
        _0x320053['push']({
            'role': 'user',
            'content': _0x57bf0e
        });
        try {
            const _0x103389 = {
                'model': this['config']['pollinationsModel'] || 'openai',
                'messages': _0x320053,
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x3ccba4?.['isCommandDetection']) {
                _0x103389['response_format'] = { 'type': 'json_object' };
            }
            const _0x3dff1b = await _0x0_0x32d415(_0x4d7367, {
                'method': 'POST',
                'headers': _0x55c8f8,
                'body': JSON['stringify'](_0x103389)
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x3dff1b['status']);
            if (!_0x3dff1b['ok']) {
                const _0x53b7b5 = await _0x3dff1b['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x53b7b5);
                if (_0x3dff1b['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0x3dff1b['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20customai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x512e00 = await _0x3dff1b['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x2790e8 = _0x512e00['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x2790e8);
            return this['cleanResponse'](_0x2790e8) || this['config']['fallbackResponse'];
        } catch (_0x1f1149) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x1f1149['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0xc43ce6, _0x3a4b27, _0x317e1b) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0xc43ce6);
        const _0xa90e17 = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0xa90e17) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x35faa6} = await import('openai');
            const _0x53330a = new _0x35faa6({
                'apiKey': _0xa90e17,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x30b557 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x30b557);
            const _0x272617 = {
                'model': _0x30b557,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x3a4b27 || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0xc43ce6
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x317e1b?.['isCommandDetection']) {
                _0x272617['response_format'] = { 'type': 'json_object' };
            }
            const _0x1b7dec = await _0x53330a['chat']['completions']['create'](_0x272617);
            const _0x261ce4 = _0x1b7dec['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x261ce4) || this['config']['fallbackResponse'];
        } catch (_0x179cc7) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x179cc7['message']);
            if (_0x179cc7['status'] === 0x191 || _0x179cc7['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x179cc7['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x170967, _0x4526ae, _0x533bd2) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x170967);
        const _0x55c312 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x55c312) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x49e738} = await import('@google/genai');
            const _0x27bd25 = new _0x49e738({ 'apiKey': _0x55c312 });
            const _0x212965 = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0x212965);
            const _0x3e5d0c = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x4526ae === 'string' && _0x4526ae['trim']()) {
                _0x3e5d0c['systemInstruction'] = _0x4526ae;
            }
            if (_0x533bd2?.['isCommandDetection']) {
                _0x3e5d0c['responseMimeType'] = 'application/json';
            }
            const _0x5177ad = await this['_retryOnTransientError'](() => _0x27bd25['models']['generateContent']({
                'model': _0x212965,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x170967 }]
                    }],
                'config': _0x3e5d0c
            }), {
                'retries': 0x2,
                'baseDelayMs': 0x320
            });
            const _0x8bdcb0 = _0x5177ad['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x8bdcb0) || this['config']['fallbackResponse'];
        } catch (_0x2f0fad) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x2f0fad['message']);
            if (_0x2f0fad['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0x2f0fad['message']?.['includes']('not\x20enabled') || _0x2f0fad['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x2f0fad['message']?.['includes']('RESOURCE_EXHAUSTED') || _0x2f0fad['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            if (_0x2f0fad['message']?.['includes']('UNAVAILABLE') || _0x2f0fad['message']?.['includes']('503')) {
                return '❌\x20Gemini\x20est\x20surchargé\x20en\x20ce\x20moment\x20(503).\x20J\x27ai\x20réessayé\x20automatiquement\x20sans\x20succès\x20—\x20réessayez\x20dans\x20un\x20instant.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x50fa8a, _0x4caee4, _0x4fb31f) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x50fa8a);
        const _0x36879e = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x36879e) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x33bacf = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x180495 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x33775e = await _0x0_0x32d415(_0x33bacf, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x36879e
                },
                'body': JSON['stringify']({
                    'model': _0x180495,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x4caee4
                        },
                        {
                            'role': 'user',
                            'content': _0x50fa8a
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x33775e['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x33775e['text']());
                return this['config']['fallbackResponse'];
            }
            const _0xbc4262 = await _0x33775e['json']();
            const _0x4801ee = _0xbc4262['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x4801ee) || this['config']['fallbackResponse'];
        } catch (_0x2f8662) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x2f8662['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x437890, _0x2032a1, _0x4b8962) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x437890);
        const _0x4b2ba8 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x4b2ba8) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x535efb} = await import('openai');
            const _0x3169b7 = new _0x535efb({ 'apiKey': _0x4b2ba8 });
            const _0x348877 = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0x348877);
            const _0xa6ae97 = {
                'model': _0x348877,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x2032a1 || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x437890
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x4b8962?.['isCommandDetection']) {
                _0xa6ae97['response_format'] = { 'type': 'json_object' };
            }
            const _0xe8f8cc = await _0x3169b7['chat']['completions']['create'](_0xa6ae97);
            const _0x2131a0 = _0xe8f8cc['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x2131a0) || this['config']['fallbackResponse'];
        } catch (_0x32c02d) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x32c02d['message']);
            if (_0x32c02d['status'] === 0x191 || _0x32c02d['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x32c02d['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x2083bf, _0x3b2b76, _0x1b1f36) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x2083bf);
        const _0x1ab0f4 = this['config']['apiUrl'];
        if (!_0x1ab0f4) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x2313d7 = await _0x0_0x32d415(_0x1ab0f4, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x2083bf,
                    'context': _0x3b2b76,
                    'metadata': _0x1b1f36
                })
            });
            if (!_0x2313d7['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x2313d7['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x420b4d = await _0x2313d7['json']();
            const _0x1aa1b8 = _0x420b4d['response'] || _0x420b4d['reply'] || _0x420b4d['text'] || _0x420b4d['result'];
            return this['cleanResponse'](_0x1aa1b8) || this['config']['fallbackResponse'];
        } catch (_0x27077b) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x27077b['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x10618a) {
        const _0x1c1ae5 = 'Nova';
        const _0x2536cd = [
            new RegExp('^' + _0x1c1ae5 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x1c1ae5 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x1c1ae5 + ',?\x5cs+', 'i')
        ];
        let _0x551617 = _0x10618a;
        for (const _0xeade2a of _0x2536cd) {
            _0x551617 = _0x551617['replace'](_0xeade2a, '')['trim']();
        }
        return _0x551617;
    }
    ['cleanResponse'](_0x57c261) {
        if (!_0x57c261)
            return null;
        let _0x2db320 = _0x57c261['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x2db320['length'] > 0x7d0) {
            _0x2db320 = _0x2db320['slice'](0x0, 0x7d0) + '...';
        }
        return _0x2db320;
    }
    ['getHistory'](_0x413a2f) {
        const _0x8a1a96 = this['history']['get'](_0x413a2f) || [];
        const _0x5f474c = this['config']['maxHistory'] || 0xf;
        return _0x8a1a96['slice'](-_0x5f474c);
    }
    ['addToHistory'](_0x3e9c79, _0x184170, _0x1784f6) {
        if (!this['history']['has'](_0x3e9c79)) {
            this['history']['set'](_0x3e9c79, []);
        }
        const _0x296a2e = this['history']['get'](_0x3e9c79);
        _0x296a2e['push']('User:\x20' + _0x184170);
        _0x296a2e['push']('Nova:\x20' + _0x1784f6);
        const _0x2b17d0 = this['config']['maxHistory'] || 0xf;
        if (_0x296a2e['length'] > _0x2b17d0 * 0x2) {
            this['history']['set'](_0x3e9c79, _0x296a2e['slice'](-_0x2b17d0 * 0x2));
        }
    }
    ['clearHistory'](_0x540c01) {
        if (_0x540c01) {
            this['history']['delete'](_0x540c01);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x5f22d9, _0x2f99ce) {
        if (_0x5f22d9) {
            this['contextCache']['set'](_0x5f22d9, _0x2f99ce);
        } else {
            this['config']['customContext'] = _0x2f99ce;
            _0x0_0x37af6b['set']('customContext', _0x2f99ce);
        }
    }
    ['getContext'](_0x39a14e) {
        return this['contextCache']['get'](_0x39a14e) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x25f745, _0x6d9a07) {
        return new Promise((_0x43cced, _0x4a16d8) => {
            const _0x390b68 = setTimeout(() => {
                _0x4a16d8(new Error('Request\x20timeout\x20after\x20' + _0x6d9a07 + 'ms'));
            }, _0x6d9a07);
            _0x25f745()['then'](_0x4ed14f => {
                clearTimeout(_0x390b68);
                _0x43cced(_0x4ed14f);
            })['catch'](_0x48bc0d => {
                clearTimeout(_0x390b68);
                _0x4a16d8(_0x48bc0d);
            });
        });
    }
    async ['_retryOnTransientError'](_0x57db5e, {
        retries: retries = 0x2,
        baseDelayMs: baseDelayMs = 0x320
    } = {}) {
        let _0x4d7577;
        for (let _0x4d1275 = 0x0; _0x4d1275 <= retries; _0x4d1275++) {
            try {
                return await _0x57db5e();
            } catch (_0x2b5fc2) {
                _0x4d7577 = _0x2b5fc2;
                const _0x4951e2 = _0x2b5fc2?.['message'] || '';
                const _0x3c3478 = _0x4951e2['includes']('UNAVAILABLE') || _0x4951e2['includes']('503') || _0x4951e2['includes']('RESOURCE_EXHAUSTED') || _0x4951e2['includes']('429');
                if (!_0x3c3478 || _0x4d1275 === retries) {
                    throw _0x2b5fc2;
                }
                const _0x359efa = baseDelayMs * Math['pow'](0x2, _0x4d1275);
                console['warn']('⚠️\x20Transient\x20error,\x20retry\x20' + (_0x4d1275 + 0x1) + '/' + retries + '\x20in\x20' + _0x359efa + 'ms:', _0x4951e2);
                await new Promise(_0x6112de => setTimeout(_0x6112de, _0x359efa));
            }
        }
        throw _0x4d7577;
    }
}
export default new ChatbotService();