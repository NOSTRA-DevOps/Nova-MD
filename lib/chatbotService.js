import _0x0_0x2c256f from 'node-fetch';
import _0x0_0x4cb8e1 from 'axios';
import _0x0_0x278f6f from './chatbotConfig.js';
import * as _0x0_0x56a56c from './commandHandler.js';
import _0x0_0xbd65d7 from '../config.js';
import _0x0_0x27546b from 'dotenv';
_0x0_0x27546b['config']();
const AI_APIS = [
    _0x8fb9c3 => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x8fb9c3),
    _0x56f61f => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x56f61f),
    _0x7f1fae => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x7f1fae)
];
const askAI = async _0x4ae927 => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x4ae927);
    for (const _0x4f9754 of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x4f9754(_0x4ae927)['substring'](0x0, 0x32) + '...');
            const {data: _0x2e8042} = await _0x0_0x4cb8e1['get'](_0x4f9754(_0x4ae927), { 'timeout': 0x3a98 });
            const _0x5d893c = _0x2e8042?.['data']?.['response'];
            if (_0x5d893c && typeof _0x5d893c === 'string' && _0x5d893c['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x5d893c['trim']();
            }
        } catch (_0x27de67) {
            console['log']('⚠️\x20API\x20failed:', _0x27de67['message']);
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
        if (!_0x0_0x56a56c || !_0x0_0x56a56c['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x98ae4d = Array['from'](_0x0_0x56a56c['commands']['values']());
            const _0x2791eb = {};
            for (const _0x26716b of _0x98ae4d) {
                const _0x25128b = _0x26716b['category'] || 'misc';
                if (!_0x2791eb[_0x25128b])
                    _0x2791eb[_0x25128b] = [];
                _0x2791eb[_0x25128b]['push']({
                    'name': _0x26716b['command'],
                    'description': _0x26716b['description'] || 'No\x20description',
                    'aliases': _0x26716b['aliases'] || [],
                    'usage': _0x26716b['usage'] || '.' + _0x26716b['command']
                });
            }
            let _0x1799dd = '';
            for (const [_0x41cd67, _0x3bb6b1] of Object['entries'](_0x2791eb)) {
                _0x1799dd += '\x0a' + _0x41cd67['toUpperCase']() + ':\x0a';
                for (const _0x38412f of _0x3bb6b1) {
                    _0x1799dd += '-\x20' + _0x38412f['name'] + ':\x20' + _0x38412f['description'];
                    if (_0x38412f['aliases']['length']) {
                        _0x1799dd += '\x20(aliases:\x20' + _0x38412f['aliases']['join'](',\x20') + ')';
                    }
                    _0x1799dd += '\x0a';
                }
            }
            return _0x1799dd || 'No\x20commands\x20available';
        } catch (_0x36fc9f) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x36fc9f);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x278f6f['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'customai',
            'apiKey': '',
            'apiUrl': '',
            'puterModel': 'gpt-5.4-nano',
            'grokModel': 'grok-4.6',
            'openaiModel': 'gpt-4o-mini',
            'geminiModel': 'gemini-2.0-flash-exp',
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
    async ['getResponse'](_0x22b36d, _0x5dc81a, _0x9c2a71, _0x262c06 = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x22b36d);
        console['log']('📝\x20Chat\x20ID:', _0x5dc81a);
        console['log']('📝\x20Sender\x20ID:', _0x9c2a71);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x223f87 = this['cleanMessage'](_0x22b36d);
            console['log']('📝\x20Clean\x20message:', _0x223f87);
            if (!_0x223f87 || _0x223f87['length'] < 0x1) {
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
                const _0x2bf33c = await this['intelligentCommandDetection'](_0x223f87);
                if (_0x2bf33c && _0x2bf33c['isCommand'] && _0x2bf33c['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x2bf33c['command']);
                    const _0x2edc3b = await this['executeCommand'](_0x2bf33c['command'], _0x2bf33c['args'] || [], _0x5dc81a, _0x9c2a71, _0x262c06);
                    if (_0x2edc3b['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x2edc3b['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x2edc3b['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x2bf33c['command'] + '`.\x20' + (_0x2edc3b['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x4d7737 = await this['generateNaturalResponse'](_0x223f87, _0x5dc81a, _0x9c2a71);
            console['log']('✅\x20Response\x20generated:', _0x4d7737);
            return _0x4d7737;
        } catch (_0x5e5e97) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x5e5e97);
            console['error']('❌\x20Stack\x20trace:', _0x5e5e97['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20customai\x20avec\x20`.cbc\x20provider\x20customai`';
    }
    async ['intelligentCommandDetection'](_0x25819e) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x25819e);
        try {
            const _0x2c6fac = this['buildCommandDetectionPrompt'](_0x25819e);
            const _0x406d7c = this['config']['provider'] || 'customai';
            const _0x4ff0c6 = this['providers'][_0x406d7c];
            if (!_0x4ff0c6) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x25819e);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x406d7c);
            const _0x14f13b = await this['_callWithTimeout'](() => _0x4ff0c6(_0x2c6fac, { 'isCommandDetection': !![] }, {}), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x14f13b);
            const _0x2b07d7 = _0x14f13b['match'](/\{[\s\S]*\}/);
            if (_0x2b07d7) {
                try {
                    const _0x18dd37 = JSON['parse'](_0x2b07d7[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x18dd37);
                    if (_0x18dd37['isCommand'] && _0x18dd37['command']) {
                        if (_0x0_0x56a56c && _0x0_0x56a56c['commands'] && _0x0_0x56a56c['commands']['has'](_0x18dd37['command'])) {
                            return _0x18dd37;
                        }
                        const _0x56df87 = this['findSimilarCommand'](_0x18dd37['command']);
                        if (_0x56df87 && _0x0_0x56a56c['commands'] && _0x0_0x56a56c['commands']['has'](_0x56df87)) {
                            _0x18dd37['command'] = _0x56df87;
                            _0x18dd37['suggested'] = !![];
                            return _0x18dd37;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x18dd37;
                } catch (_0x8a3699) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x8a3699);
                }
            }
            return this['simpleKeywordDetection'](_0x25819e);
        } catch (_0x552bd8) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x552bd8);
            return this['simpleKeywordDetection'](_0x25819e);
        }
    }
    ['buildCommandDetectionPrompt'](_0x111960) {
        if (!_0x0_0x56a56c || !_0x0_0x56a56c['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x111960 + '\x22';
        }
        const _0x54e5e4 = Array['from'](_0x0_0x56a56c['commands']['values']());
        let _0x305439 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x36f015 of _0x54e5e4) {
            _0x305439 += '-\x20' + _0x36f015['command'];
            if (_0x36f015['aliases'] && _0x36f015['aliases']['length']) {
                _0x305439 += '\x20(alias:\x20' + _0x36f015['aliases']['join'](',\x20') + ')';
            }
            _0x305439 += ':\x20' + (_0x36f015['description'] || 'Pas\x20de\x20description');
            if (_0x36f015['usage']) {
                _0x305439 += '\x20[Utilisation:\x20' + _0x36f015['usage'] + ']';
            }
            _0x305439 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x305439 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x111960 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x4e0019) {
        const _0x2e0331 = _0x4e0019['toLowerCase']();
        const _0x10bf08 = {
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
        let _0x2e3940 = null;
        let _0x3f9c3e = 0x0;
        for (const [_0x2ae51c, _0x130f4f] of Object['entries'](_0x10bf08)) {
            let _0x2c5c5a = 0x0;
            for (const _0x3f323c of _0x130f4f) {
                if (_0x2e0331['includes'](_0x3f323c)) {
                    _0x2c5c5a += _0x3f323c['length'] / 0x5;
                }
            }
            if (_0x2c5c5a > _0x3f9c3e && _0x2c5c5a > 0x1) {
                _0x3f9c3e = _0x2c5c5a;
                _0x2e3940 = _0x2ae51c;
            }
        }
        if (_0x2e3940) {
            const _0x98c3c7 = this['extractArgs'](_0x4e0019);
            return {
                'isCommand': !![],
                'command': _0x2e3940,
                'args': _0x98c3c7,
                'confidence': _0x3f9c3e > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x2e3940
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0xc33ed8) {
        const _0x15f629 = [];
        const _0x392cd5 = _0xc33ed8['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x392cd5)
            _0x15f629['push'](..._0x392cd5);
        const _0x5ced2d = _0xc33ed8['match'](/\d+/g);
        if (_0x5ced2d)
            _0x15f629['push'](..._0x5ced2d);
        const _0x3a1a91 = _0xc33ed8['match'](/"([^"]*)"/g);
        if (_0x3a1a91)
            _0x15f629['push'](..._0x3a1a91['map'](_0x1693e4 => _0x1693e4['replace'](/"/g, '')));
        const _0x79c79e = _0xc33ed8['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x79c79e && _0x79c79e[0x1]) {
            _0x15f629['push'](_0x79c79e[0x1]['trim']());
        }
        return _0x15f629;
    }
    ['findSimilarCommand'](_0x2a0bdb) {
        if (!_0x0_0x56a56c || !_0x0_0x56a56c['commands'])
            return null;
        const _0x1b58df = Array['from'](_0x0_0x56a56c['commands']['keys']());
        const _0x19c86d = _0x1b58df['filter'](_0x4a5f79 => _0x4a5f79['includes'](_0x2a0bdb) || _0x2a0bdb['includes'](_0x4a5f79) || this['levenshteinDistance'](_0x4a5f79, _0x2a0bdb) < 0x3);
        return _0x19c86d[0x0] || null;
    }
    ['levenshteinDistance'](_0x3694cf, _0x2e0d6b) {
        const _0x1f692d = [];
        for (let _0x2cbaf5 = 0x0; _0x2cbaf5 <= _0x2e0d6b['length']; _0x2cbaf5++) {
            _0x1f692d[_0x2cbaf5] = [_0x2cbaf5];
        }
        for (let _0x559fcb = 0x0; _0x559fcb <= _0x3694cf['length']; _0x559fcb++) {
            _0x1f692d[0x0][_0x559fcb] = _0x559fcb;
        }
        for (let _0x3a4702 = 0x1; _0x3a4702 <= _0x2e0d6b['length']; _0x3a4702++) {
            for (let _0x330ef5 = 0x1; _0x330ef5 <= _0x3694cf['length']; _0x330ef5++) {
                if (_0x2e0d6b[_0x3a4702 - 0x1] === _0x3694cf[_0x330ef5 - 0x1]) {
                    _0x1f692d[_0x3a4702][_0x330ef5] = _0x1f692d[_0x3a4702 - 0x1][_0x330ef5 - 0x1];
                } else {
                    _0x1f692d[_0x3a4702][_0x330ef5] = Math['min'](_0x1f692d[_0x3a4702 - 0x1][_0x330ef5 - 0x1] + 0x1, _0x1f692d[_0x3a4702][_0x330ef5 - 0x1] + 0x1, _0x1f692d[_0x3a4702 - 0x1][_0x330ef5] + 0x1);
                }
            }
        }
        return _0x1f692d[_0x2e0d6b['length']][_0x3694cf['length']];
    }
    async ['executeCommand'](_0x3a11b1, _0x220c9a, _0x38b924, _0x2fea25, _0x47f437) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x3a11b1, _0x220c9a);
            if (!_0x0_0x56a56c || !_0x0_0x56a56c['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0x580108 = _0x0_0x56a56c['commands']['get'](_0x3a11b1);
            if (!_0x580108) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x2f7b2a = _0x47f437['isOwnerOrSudo'] || ![];
            const _0xa868b2 = _0x47f437['isFromMe'] || ![];
            const _0x28360e = _0x38b924['endsWith']('@g.us');
            if (_0x580108['ownerOnly'] && !_0x2f7b2a && !_0xa868b2) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x580108['groupOnly'] && !_0x28360e) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x568bf1 = {
                'key': {
                    'remoteJid': _0x38b924,
                    'participant': _0x2fea25
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x3a11b1 + '\x20' + _0x220c9a['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x47f437['pushName'] || 'User'
            };
            await _0x580108['handler'](_0x47f437['sock'], _0x568bf1, _0x220c9a, {
                'chatId': _0x38b924,
                'senderId': _0x2fea25,
                'isGroup': _0x28360e,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x3a11b1 + '\x20' + _0x220c9a['join']('\x20'),
                'messageText': _0x3a11b1 + '\x20' + _0x220c9a['join']('\x20'),
                'userMessage': _0x3a11b1 + '\x20' + _0x220c9a['join']('\x20'),
                'config': _0x0_0xbd65d7
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x3a11b1 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x41d44e) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x41d44e);
            return {
                'success': ![],
                'error': _0x41d44e['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x24b16f, _0x533c3c, _0x480724) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x24b16f);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x2791b9 = this['buildConversationContext'](_0x24b16f, _0x533c3c);
            console['log']('📝\x20Context\x20built,\x20length:', _0x2791b9['length']);
            const _0x16e7f8 = this['config']['provider'] || 'customai';
            const _0x183972 = this['providers'][_0x16e7f8];
            if (!_0x183972) {
                console['error']('❌\x20Provider\x20' + _0x16e7f8 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x16e7f8);
            const _0xf6e039 = await this['_callWithTimeout'](() => _0x183972(_0x24b16f, _0x2791b9, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0xf6e039);
            const _0x5132ae = this['cleanResponse'](_0xf6e039);
            this['addToHistory'](_0x533c3c, _0x24b16f, _0x5132ae);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x5132ae);
            return _0x5132ae || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0xf4b0a3) {
            console['error']('❌\x20Natural\x20response\x20error:', _0xf4b0a3);
            console['error']('❌\x20Stack\x20trace:', _0xf4b0a3['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x74ed2f, _0x863a7f) {
        let _0x23300a = this['baseContext'];
        if (this['config']['customContext']) {
            _0x23300a += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x3c91d9 = this['getHistory'](_0x863a7f);
        if (_0x3c91d9 && _0x3c91d9['length'] > 0x0) {
            _0x23300a += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x3c91d9['join']('\x0a');
        }
        _0x23300a += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x74ed2f + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x23300a;
    }
    async ['_callCustomAI'](_0x1b12ca, _0x28e6bc, _0x20cede) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x1b12ca);
        try {
            const _0x596027 = await askAI(_0x1b12ca);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x596027) || this['config']['fallbackResponse'];
        } catch (_0x28751d) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x28751d['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x311c95, _0x55a009, _0x2bc41d) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x311c95);
        const _0x2cd58d = 'https://text.pollinations.ai/openai';
        try {
            const _0x57daea = await _0x0_0x2c256f(_0x2cd58d, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                'body': JSON['stringify']({
                    'model': 'openai',
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x55a009
                        },
                        {
                            'role': 'user',
                            'content': _0x311c95
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x57daea['status']);
            if (!_0x57daea['ok']) {
                const _0x28f319 = await _0x57daea['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x28f319);
                return this['config']['fallbackResponse'];
            }
            const _0x4fad0a = await _0x57daea['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x43e772 = _0x4fad0a['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x43e772);
            return this['cleanResponse'](_0x43e772) || this['config']['fallbackResponse'];
        } catch (_0x37ea40) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x37ea40['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x569364, _0x4956e6, _0x3114e1) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x569364);
        const _0x2565fd = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x2565fd) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x5262dd} = await import('openai');
            const _0x5844bc = new _0x5262dd({
                'apiKey': _0x2565fd,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x595044 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x595044);
            const _0x4bc84f = await _0x5844bc['chat']['completions']['create']({
                'model': _0x595044,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x4956e6
                    },
                    {
                        'role': 'user',
                        'content': _0x569364
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x3a12be = _0x4bc84f['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x3a12be) || this['config']['fallbackResponse'];
        } catch (_0x540563) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x540563['message']);
            if (_0x540563['status'] === 0x191 || _0x540563['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x540563['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x256d4c, _0x797941, _0x34e448) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x256d4c);
        const _0xb5166d = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0xb5166d) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x52ce0a} = await import('@google/genai');
            const _0x2a984d = new _0x52ce0a({ 'apiKey': _0xb5166d });
            const _0x362d2d = this['config']['geminiModel'] || 'gemini-2.0-flash-exp';
            console['log']('📡\x20Using\x20model:\x20' + _0x362d2d);
            const _0xd42410 = await _0x2a984d['models']['generateContent']({
                'model': _0x362d2d,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x256d4c }]
                    }],
                'config': {
                    'systemInstruction': _0x797941,
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            });
            const _0x2c0444 = _0xd42410['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x2c0444) || this['config']['fallbackResponse'];
        } catch (_0x1c7d3d) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x1c7d3d['message']);
            if (_0x1c7d3d['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0x1c7d3d['message']?.['includes']('not\x20enabled') || _0x1c7d3d['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x1c7d3d['message']?.['includes']('RESOURCE_EXHAUSTED') || _0x1c7d3d['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x7a7ced, _0x44eb91, _0x5c09d3) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x7a7ced);
        const _0x1838f2 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x1838f2) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x42f258 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x133a54 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x138d22 = await _0x0_0x2c256f(_0x42f258, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x1838f2
                },
                'body': JSON['stringify']({
                    'model': _0x133a54,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x44eb91
                        },
                        {
                            'role': 'user',
                            'content': _0x7a7ced
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x138d22['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x138d22['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x2c1330 = await _0x138d22['json']();
            const _0x2904e8 = _0x2c1330['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x2904e8) || this['config']['fallbackResponse'];
        } catch (_0x3aebc2) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x3aebc2['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x561385, _0x12a179, _0x4334f4) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x561385);
        const _0x14b770 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x14b770) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x5731ee} = await import('openai');
            const _0x5c2279 = new _0x5731ee({ 'apiKey': _0x14b770 });
            const _0xbc0e14 = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0xbc0e14);
            const _0x8a1684 = await _0x5c2279['chat']['completions']['create']({
                'model': _0xbc0e14,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x12a179
                    },
                    {
                        'role': 'user',
                        'content': _0x561385
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x3fd355 = _0x8a1684['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x3fd355) || this['config']['fallbackResponse'];
        } catch (_0x1ed711) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x1ed711['message']);
            if (_0x1ed711['status'] === 0x191 || _0x1ed711['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x1ed711['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x120061, _0xd6ec14, _0x25afca) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x120061);
        const _0x2cc52b = this['config']['apiUrl'];
        if (!_0x2cc52b) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x47150f = await _0x0_0x2c256f(_0x2cc52b, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x120061,
                    'context': _0xd6ec14,
                    'metadata': _0x25afca
                })
            });
            if (!_0x47150f['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x47150f['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x4c0e3e = await _0x47150f['json']();
            const _0x5451c1 = _0x4c0e3e['response'] || _0x4c0e3e['reply'] || _0x4c0e3e['text'] || _0x4c0e3e['result'];
            return this['cleanResponse'](_0x5451c1) || this['config']['fallbackResponse'];
        } catch (_0x4b5ede) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x4b5ede['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x2765e9) {
        const _0xdbc457 = 'Nova';
        const _0x4fdb70 = [
            new RegExp('^' + _0xdbc457 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0xdbc457 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0xdbc457 + ',?\x5cs+', 'i')
        ];
        let _0x5ef72d = _0x2765e9;
        for (const _0x1af654 of _0x4fdb70) {
            _0x5ef72d = _0x5ef72d['replace'](_0x1af654, '')['trim']();
        }
        return _0x5ef72d;
    }
    ['cleanResponse'](_0x435a37) {
        if (!_0x435a37)
            return null;
        let _0x10f2a7 = _0x435a37['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x10f2a7['length'] > 0x7d0) {
            _0x10f2a7 = _0x10f2a7['slice'](0x0, 0x7d0) + '...';
        }
        return _0x10f2a7;
    }
    ['getHistory'](_0x447f44) {
        const _0x2c04f7 = this['history']['get'](_0x447f44) || [];
        const _0x2e3515 = this['config']['maxHistory'] || 0xf;
        return _0x2c04f7['slice'](-_0x2e3515);
    }
    ['addToHistory'](_0x2d056c, _0x206f11, _0x54e305) {
        if (!this['history']['has'](_0x2d056c)) {
            this['history']['set'](_0x2d056c, []);
        }
        const _0x2fd87d = this['history']['get'](_0x2d056c);
        _0x2fd87d['push']('User:\x20' + _0x206f11);
        _0x2fd87d['push']('Nova:\x20' + _0x54e305);
        const _0x316886 = this['config']['maxHistory'] || 0xf;
        if (_0x2fd87d['length'] > _0x316886 * 0x2) {
            this['history']['set'](_0x2d056c, _0x2fd87d['slice'](-_0x316886 * 0x2));
        }
    }
    ['clearHistory'](_0x51dca2) {
        if (_0x51dca2) {
            this['history']['delete'](_0x51dca2);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x95bbb0, _0x19f4e7) {
        if (_0x95bbb0) {
            this['contextCache']['set'](_0x95bbb0, _0x19f4e7);
        } else {
            this['config']['customContext'] = _0x19f4e7;
            _0x0_0x278f6f['set']('customContext', _0x19f4e7);
        }
    }
    ['getContext'](_0x33321b) {
        return this['contextCache']['get'](_0x33321b) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x574d54, _0xc4ccad) {
        return new Promise((_0x52d1be, _0x246772) => {
            const _0x41a0cb = setTimeout(() => {
                _0x246772(new Error('Request\x20timeout\x20after\x20' + _0xc4ccad + 'ms'));
            }, _0xc4ccad);
            _0x574d54()['then'](_0x3ee9ca => {
                clearTimeout(_0x41a0cb);
                _0x52d1be(_0x3ee9ca);
            })['catch'](_0x333481 => {
                clearTimeout(_0x41a0cb);
                _0x246772(_0x333481);
            });
        });
    }
}
export default new ChatbotService();