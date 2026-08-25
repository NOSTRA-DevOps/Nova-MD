import _0x0_0x23029a from 'node-fetch';
import _0x0_0x5c5a95 from 'axios';
import _0x0_0x5a08d7 from './chatbotConfig.js';
import * as _0x0_0x3b43eb from './commandHandler.js';
import _0x0_0x4c99f1 from '../config.js';
import _0x0_0xe5f206 from 'dotenv';
_0x0_0xe5f206['config']();
const AI_APIS = [
    _0x384ea6 => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x384ea6),
    _0x3b669f => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x3b669f),
    _0x2c0b22 => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x2c0b22)
];
const askAI = async _0xe93a02 => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0xe93a02);
    for (const _0x74c294 of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x74c294(_0xe93a02)['substring'](0x0, 0x32) + '...');
            const {data: _0x2540ee} = await _0x0_0x5c5a95['get'](_0x74c294(_0xe93a02), { 'timeout': 0x3a98 });
            const _0x1e932a = _0x2540ee?.['data']?.['response'];
            if (_0x1e932a && typeof _0x1e932a === 'string' && _0x1e932a['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x1e932a['trim']();
            }
        } catch (_0x58fe10) {
            console['log']('⚠️\x20API\x20failed:', _0x58fe10['message']);
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
        if (!_0x0_0x3b43eb || !_0x0_0x3b43eb['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x414bfc = Array['from'](_0x0_0x3b43eb['commands']['values']());
            const _0x560ee0 = {};
            for (const _0x590d2a of _0x414bfc) {
                const _0x5969d0 = _0x590d2a['category'] || 'misc';
                if (!_0x560ee0[_0x5969d0])
                    _0x560ee0[_0x5969d0] = [];
                _0x560ee0[_0x5969d0]['push']({
                    'name': _0x590d2a['command'],
                    'description': _0x590d2a['description'] || 'No\x20description',
                    'aliases': _0x590d2a['aliases'] || [],
                    'usage': _0x590d2a['usage'] || '.' + _0x590d2a['command']
                });
            }
            let _0x10a340 = '';
            for (const [_0x3fb7ff, _0x48c98d] of Object['entries'](_0x560ee0)) {
                _0x10a340 += '\x0a' + _0x3fb7ff['toUpperCase']() + ':\x0a';
                for (const _0x53a4f8 of _0x48c98d) {
                    _0x10a340 += '-\x20' + _0x53a4f8['name'] + ':\x20' + _0x53a4f8['description'];
                    if (_0x53a4f8['aliases']['length']) {
                        _0x10a340 += '\x20(aliases:\x20' + _0x53a4f8['aliases']['join'](',\x20') + ')';
                    }
                    _0x10a340 += '\x0a';
                }
            }
            return _0x10a340 || 'No\x20commands\x20available';
        } catch (_0x3ff641) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x3ff641);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x5a08d7['config'] || {
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
    async ['getResponse'](_0x35e802, _0x1c7887, _0xaf6a81, _0x5b31db = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x35e802);
        console['log']('📝\x20Chat\x20ID:', _0x1c7887);
        console['log']('📝\x20Sender\x20ID:', _0xaf6a81);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x14a8a4 = this['cleanMessage'](_0x35e802);
            console['log']('📝\x20Clean\x20message:', _0x14a8a4);
            if (!_0x14a8a4 || _0x14a8a4['length'] < 0x1) {
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
                const _0x5872f7 = await this['intelligentCommandDetection'](_0x14a8a4);
                if (_0x5872f7 && _0x5872f7['isCommand'] && _0x5872f7['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x5872f7['command']);
                    const _0x3cf36a = await this['executeCommand'](_0x5872f7['command'], _0x5872f7['args'] || [], _0x1c7887, _0xaf6a81, _0x5b31db);
                    if (_0x3cf36a['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x3cf36a['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x3cf36a['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x5872f7['command'] + '`.\x20' + (_0x3cf36a['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x4268fa = await this['generateNaturalResponse'](_0x14a8a4, _0x1c7887, _0xaf6a81);
            console['log']('✅\x20Response\x20generated:', _0x4268fa);
            return _0x4268fa;
        } catch (_0x19415c) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x19415c);
            console['error']('❌\x20Stack\x20trace:', _0x19415c['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20systemai\x20avec\x20`.cbc\x20provider\x20systemai`';
    }
    async ['intelligentCommandDetection'](_0x47f0df) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x47f0df);
        try {
            const _0x24c870 = this['buildCommandDetectionPrompt'](_0x47f0df);
            const _0x12ea34 = this['config']['provider'] || 'systemai';
            const _0x4568a5 = this['providers'][_0x12ea34];
            if (!_0x4568a5) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x47f0df);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x12ea34);
            const _0x377b26 = await this['_callWithTimeout'](() => _0x4568a5(_0x24c870, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x377b26);
            const _0x1c350e = _0x377b26['match'](/\{[\s\S]*\}/);
            if (_0x1c350e) {
                try {
                    const _0x252aa8 = JSON['parse'](_0x1c350e[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x252aa8);
                    if (_0x252aa8['isCommand'] && _0x252aa8['command']) {
                        if (_0x0_0x3b43eb && _0x0_0x3b43eb['commands'] && _0x0_0x3b43eb['commands']['has'](_0x252aa8['command'])) {
                            return _0x252aa8;
                        }
                        const _0x13f9b8 = this['findSimilarCommand'](_0x252aa8['command']);
                        if (_0x13f9b8 && _0x0_0x3b43eb['commands'] && _0x0_0x3b43eb['commands']['has'](_0x13f9b8)) {
                            _0x252aa8['command'] = _0x13f9b8;
                            _0x252aa8['suggested'] = !![];
                            return _0x252aa8;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x252aa8;
                } catch (_0x1bdff7) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x1bdff7);
                }
            }
            return this['simpleKeywordDetection'](_0x47f0df);
        } catch (_0x446a3c) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x446a3c);
            return this['simpleKeywordDetection'](_0x47f0df);
        }
    }
    ['buildCommandDetectionPrompt'](_0x100bd0) {
        if (!_0x0_0x3b43eb || !_0x0_0x3b43eb['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x100bd0 + '\x22';
        }
        const _0x1d3e5f = Array['from'](_0x0_0x3b43eb['commands']['values']());
        let _0x4896a6 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x5407cf of _0x1d3e5f) {
            _0x4896a6 += '-\x20' + _0x5407cf['command'];
            if (_0x5407cf['aliases'] && _0x5407cf['aliases']['length']) {
                _0x4896a6 += '\x20(alias:\x20' + _0x5407cf['aliases']['join'](',\x20') + ')';
            }
            _0x4896a6 += ':\x20' + (_0x5407cf['description'] || 'Pas\x20de\x20description');
            if (_0x5407cf['usage']) {
                _0x4896a6 += '\x20[Utilisation:\x20' + _0x5407cf['usage'] + ']';
            }
            _0x4896a6 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x4896a6 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x100bd0 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x4e1e53) {
        const _0x3b456d = _0x4e1e53['toLowerCase']();
        const _0x14d8d = {
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
        let _0x162367 = null;
        let _0x1797c7 = 0x0;
        for (const [_0x49b4a9, _0x50d3a9] of Object['entries'](_0x14d8d)) {
            let _0xd8152f = 0x0;
            for (const _0x3d627c of _0x50d3a9) {
                if (_0x3b456d['includes'](_0x3d627c)) {
                    _0xd8152f += _0x3d627c['length'] / 0x5;
                }
            }
            if (_0xd8152f > _0x1797c7 && _0xd8152f > 0x1) {
                _0x1797c7 = _0xd8152f;
                _0x162367 = _0x49b4a9;
            }
        }
        if (_0x162367) {
            const _0x4adb78 = this['extractArgs'](_0x4e1e53);
            return {
                'isCommand': !![],
                'command': _0x162367,
                'args': _0x4adb78,
                'confidence': _0x1797c7 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x162367
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x25e518) {
        const _0x14136c = [];
        const _0x589d10 = _0x25e518['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x589d10)
            _0x14136c['push'](..._0x589d10);
        const _0x28167b = _0x25e518['match'](/\d+/g);
        if (_0x28167b)
            _0x14136c['push'](..._0x28167b);
        const _0x42d723 = _0x25e518['match'](/"([^"]*)"/g);
        if (_0x42d723)
            _0x14136c['push'](..._0x42d723['map'](_0x436720 => _0x436720['replace'](/"/g, '')));
        const _0x4a0ecc = _0x25e518['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x4a0ecc && _0x4a0ecc[0x1]) {
            _0x14136c['push'](_0x4a0ecc[0x1]['trim']());
        }
        return _0x14136c;
    }
    ['findSimilarCommand'](_0x58fad9) {
        if (!_0x0_0x3b43eb || !_0x0_0x3b43eb['commands'])
            return null;
        const _0x22dcaf = Array['from'](_0x0_0x3b43eb['commands']['keys']());
        const _0x2d7f46 = _0x22dcaf['filter'](_0x5704c6 => _0x5704c6['includes'](_0x58fad9) || _0x58fad9['includes'](_0x5704c6) || this['levenshteinDistance'](_0x5704c6, _0x58fad9) < 0x3);
        return _0x2d7f46[0x0] || null;
    }
    ['levenshteinDistance'](_0x31ad40, _0x1f265e) {
        const _0x1a3f39 = [];
        for (let _0xa3a96 = 0x0; _0xa3a96 <= _0x1f265e['length']; _0xa3a96++) {
            _0x1a3f39[_0xa3a96] = [_0xa3a96];
        }
        for (let _0x5d6113 = 0x0; _0x5d6113 <= _0x31ad40['length']; _0x5d6113++) {
            _0x1a3f39[0x0][_0x5d6113] = _0x5d6113;
        }
        for (let _0xada1c9 = 0x1; _0xada1c9 <= _0x1f265e['length']; _0xada1c9++) {
            for (let _0x433d78 = 0x1; _0x433d78 <= _0x31ad40['length']; _0x433d78++) {
                if (_0x1f265e[_0xada1c9 - 0x1] === _0x31ad40[_0x433d78 - 0x1]) {
                    _0x1a3f39[_0xada1c9][_0x433d78] = _0x1a3f39[_0xada1c9 - 0x1][_0x433d78 - 0x1];
                } else {
                    _0x1a3f39[_0xada1c9][_0x433d78] = Math['min'](_0x1a3f39[_0xada1c9 - 0x1][_0x433d78 - 0x1] + 0x1, _0x1a3f39[_0xada1c9][_0x433d78 - 0x1] + 0x1, _0x1a3f39[_0xada1c9 - 0x1][_0x433d78] + 0x1);
                }
            }
        }
        return _0x1a3f39[_0x1f265e['length']][_0x31ad40['length']];
    }
    async ['executeCommand'](_0x438b10, _0x462f60, _0x128147, _0x209fce, _0x54ef78) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x438b10, _0x462f60);
            if (!_0x0_0x3b43eb || !_0x0_0x3b43eb['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0xc9ac68 = _0x0_0x3b43eb['commands']['get'](_0x438b10);
            if (!_0xc9ac68) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x5a02cf = _0x54ef78['isOwnerOrSudo'] || ![];
            const _0x180e95 = _0x54ef78['isFromMe'] || ![];
            const _0x1e2466 = _0x128147['endsWith']('@g.us');
            if (_0xc9ac68['ownerOnly'] && !_0x5a02cf && !_0x180e95) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0xc9ac68['groupOnly'] && !_0x1e2466) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x401520 = {
                'key': {
                    'remoteJid': _0x128147,
                    'participant': _0x209fce
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x438b10 + '\x20' + _0x462f60['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x54ef78['pushName'] || 'User'
            };
            await _0xc9ac68['handler'](_0x54ef78['sock'], _0x401520, _0x462f60, {
                'chatId': _0x128147,
                'senderId': _0x209fce,
                'isGroup': _0x1e2466,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x438b10 + '\x20' + _0x462f60['join']('\x20'),
                'messageText': _0x438b10 + '\x20' + _0x462f60['join']('\x20'),
                'userMessage': _0x438b10 + '\x20' + _0x462f60['join']('\x20'),
                'config': _0x0_0x4c99f1
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x438b10 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x47c2a4) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x47c2a4);
            return {
                'success': ![],
                'error': _0x47c2a4['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x3a6820, _0x3b4198, _0x41b0e5) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x3a6820);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0xfbdb07 = this['buildConversationContext'](_0x3a6820, _0x3b4198);
            console['log']('📝\x20Context\x20built,\x20length:', _0xfbdb07['length']);
            const _0x2e5491 = this['config']['provider'] || 'systemai';
            const _0x2d6a61 = this['providers'][_0x2e5491];
            if (!_0x2d6a61) {
                console['error']('❌\x20Provider\x20' + _0x2e5491 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x2e5491);
            const _0x40813f = await this['_callWithTimeout'](() => _0x2d6a61(_0x3a6820, _0xfbdb07, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x40813f);
            const _0x2a6f91 = this['cleanResponse'](_0x40813f);
            this['addToHistory'](_0x3b4198, _0x3a6820, _0x2a6f91);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x2a6f91);
            return _0x2a6f91 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x216dd5) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x216dd5);
            console['error']('❌\x20Stack\x20trace:', _0x216dd5['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x44141c, _0x44060b) {
        let _0x42936d = this['baseContext'];
        if (this['config']['customContext']) {
            _0x42936d += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x256ba1 = this['getHistory'](_0x44060b);
        if (_0x256ba1 && _0x256ba1['length'] > 0x0) {
            _0x42936d += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x256ba1['join']('\x0a');
        }
        _0x42936d += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x44141c + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x42936d;
    }
    async ['_callCustomAI'](_0x3008ec, _0x4e86a3, _0x345d3a) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x3008ec);
        try {
            const _0x239bb4 = await askAI(_0x3008ec);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x239bb4) || this['config']['fallbackResponse'];
        } catch (_0x6eeaf8) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x6eeaf8['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x3aca5c, _0x51d42b, _0x140667) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x3aca5c);
        const _0x5b9986 = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x437488 = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x597905 = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x437488) {
            _0x597905['Authorization'] = 'Bearer\x20' + _0x437488;
        }
        const _0x5c3b02 = [];
        if (typeof _0x51d42b === 'string' && _0x51d42b['trim']()) {
            _0x5c3b02['push']({
                'role': 'system',
                'content': _0x51d42b
            });
        }
        _0x5c3b02['push']({
            'role': 'user',
            'content': _0x3aca5c
        });
        try {
            const _0xf2f5e4 = await _0x0_0x23029a(_0x5b9986, {
                'method': 'POST',
                'headers': _0x597905,
                'body': JSON['stringify']({
                    'model': this['config']['pollinationsModel'] || 'openai',
                    'messages': _0x5c3b02,
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0xf2f5e4['status']);
            if (!_0xf2f5e4['ok']) {
                const _0x1f76d2 = await _0xf2f5e4['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x1f76d2);
                if (_0xf2f5e4['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0xf2f5e4['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20systemai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x206679 = await _0xf2f5e4['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x556eaf = _0x206679['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x556eaf);
            return this['cleanResponse'](_0x556eaf) || this['config']['fallbackResponse'];
        } catch (_0x3dcf43) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x3dcf43['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x3b0b82, _0x503d30, _0x50dff2) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x3b0b82);
        const _0x4a45db = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x4a45db) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x52106a} = await import('openai');
            const _0x66c8e4 = new _0x52106a({
                'apiKey': _0x4a45db,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x1d8549 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x1d8549);
            const _0x3c7d8d = await _0x66c8e4['chat']['completions']['create']({
                'model': _0x1d8549,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x503d30
                    },
                    {
                        'role': 'user',
                        'content': _0x3b0b82
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x18b258 = _0x3c7d8d['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x18b258) || this['config']['fallbackResponse'];
        } catch (_0x2031da) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x2031da['message']);
            if (_0x2031da['status'] === 0x191 || _0x2031da['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x2031da['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0xfe19f7, _0x238f29, _0x73fdef) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0xfe19f7);
        const _0x2cad50 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x2cad50) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x3aaeb6} = await import('@google/genai');
            const _0x27ef52 = new _0x3aaeb6({ 'apiKey': _0x2cad50 });
            const _0x2d0ffa = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0x2d0ffa);
            const _0x1cd781 = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x238f29 === 'string' && _0x238f29['trim']()) {
                _0x1cd781['systemInstruction'] = _0x238f29;
            }
            const _0x217014 = await _0x27ef52['models']['generateContent']({
                'model': _0x2d0ffa,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0xfe19f7 }]
                    }],
                'config': _0x1cd781
            });
            const _0x5a9b0f = _0x217014['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x5a9b0f) || this['config']['fallbackResponse'];
        } catch (_0x4bc186) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x4bc186['message']);
            if (_0x4bc186['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0x4bc186['message']?.['includes']('not\x20enabled') || _0x4bc186['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x4bc186['message']?.['includes']('RESOURCE_EXHAUSTED') || _0x4bc186['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x58a433, _0x1e59d8, _0x435c1c) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x58a433);
        const _0x454eff = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x454eff) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x548c7 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x35b3a1 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x150dd5 = await _0x0_0x23029a(_0x548c7, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x454eff
                },
                'body': JSON['stringify']({
                    'model': _0x35b3a1,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x1e59d8
                        },
                        {
                            'role': 'user',
                            'content': _0x58a433
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x150dd5['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x150dd5['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x29d026 = await _0x150dd5['json']();
            const _0x17baa8 = _0x29d026['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x17baa8) || this['config']['fallbackResponse'];
        } catch (_0x31a651) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x31a651['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x107726, _0x342ce2, _0x1576f7) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x107726);
        const _0x3faabc = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x3faabc) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x4aece7} = await import('openai');
            const _0x284c02 = new _0x4aece7({ 'apiKey': _0x3faabc });
            const _0x5355f1 = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0x5355f1);
            const _0xcb34c8 = await _0x284c02['chat']['completions']['create']({
                'model': _0x5355f1,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x342ce2
                    },
                    {
                        'role': 'user',
                        'content': _0x107726
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x5d9074 = _0xcb34c8['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x5d9074) || this['config']['fallbackResponse'];
        } catch (_0x4f6281) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x4f6281['message']);
            if (_0x4f6281['status'] === 0x191 || _0x4f6281['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x4f6281['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x5e5c03, _0x4dcbca, _0x39440d) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x5e5c03);
        const _0x4fa793 = this['config']['apiUrl'];
        if (!_0x4fa793) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0xff5b60 = await _0x0_0x23029a(_0x4fa793, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x5e5c03,
                    'context': _0x4dcbca,
                    'metadata': _0x39440d
                })
            });
            if (!_0xff5b60['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0xff5b60['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x299afb = await _0xff5b60['json']();
            const _0x10f3d7 = _0x299afb['response'] || _0x299afb['reply'] || _0x299afb['text'] || _0x299afb['result'];
            return this['cleanResponse'](_0x10f3d7) || this['config']['fallbackResponse'];
        } catch (_0x13b606) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x13b606['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0xf3816b) {
        const _0x2bde26 = 'Nova';
        const _0x2c53c5 = [
            new RegExp('^' + _0x2bde26 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x2bde26 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x2bde26 + ',?\x5cs+', 'i')
        ];
        let _0x59e7aa = _0xf3816b;
        for (const _0x2b5db4 of _0x2c53c5) {
            _0x59e7aa = _0x59e7aa['replace'](_0x2b5db4, '')['trim']();
        }
        return _0x59e7aa;
    }
    ['cleanResponse'](_0x527693) {
        if (!_0x527693)
            return null;
        let _0x20f571 = _0x527693['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x20f571['length'] > 0x7d0) {
            _0x20f571 = _0x20f571['slice'](0x0, 0x7d0) + '...';
        }
        return _0x20f571;
    }
    ['getHistory'](_0x1733eb) {
        const _0x2ca021 = this['history']['get'](_0x1733eb) || [];
        const _0x4c235e = this['config']['maxHistory'] || 0xf;
        return _0x2ca021['slice'](-_0x4c235e);
    }
    ['addToHistory'](_0x21676c, _0x2676c1, _0x28f876) {
        if (!this['history']['has'](_0x21676c)) {
            this['history']['set'](_0x21676c, []);
        }
        const _0x22deda = this['history']['get'](_0x21676c);
        _0x22deda['push']('User:\x20' + _0x2676c1);
        _0x22deda['push']('Nova:\x20' + _0x28f876);
        const _0x1fba36 = this['config']['maxHistory'] || 0xf;
        if (_0x22deda['length'] > _0x1fba36 * 0x2) {
            this['history']['set'](_0x21676c, _0x22deda['slice'](-_0x1fba36 * 0x2));
        }
    }
    ['clearHistory'](_0x529f8e) {
        if (_0x529f8e) {
            this['history']['delete'](_0x529f8e);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x442eee, _0xd87f4) {
        if (_0x442eee) {
            this['contextCache']['set'](_0x442eee, _0xd87f4);
        } else {
            this['config']['customContext'] = _0xd87f4;
            _0x0_0x5a08d7['set']('customContext', _0xd87f4);
        }
    }
    ['getContext'](_0x5bc5a0) {
        return this['contextCache']['get'](_0x5bc5a0) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x144b0d, _0x1f274a) {
        return new Promise((_0x20d0d1, _0xd987ad) => {
            const _0x6d49d3 = setTimeout(() => {
                _0xd987ad(new Error('Request\x20timeout\x20after\x20' + _0x1f274a + 'ms'));
            }, _0x1f274a);
            _0x144b0d()['then'](_0x186733 => {
                clearTimeout(_0x6d49d3);
                _0x20d0d1(_0x186733);
            })['catch'](_0x4e71c2 => {
                clearTimeout(_0x6d49d3);
                _0xd987ad(_0x4e71c2);
            });
        });
    }
}
export default new ChatbotService();