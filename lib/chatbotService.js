import _0x0_0x2e503b from 'node-fetch';
import _0x0_0x16d3e8 from 'axios';
import _0x0_0xb2c68e from './chatbotConfig.js';
import * as _0x0_0x2ae059 from './commandHandler.js';
import _0x0_0x3ca6c9 from '../config.js';
import _0x0_0x40296d from 'dotenv';
_0x0_0x40296d['config']();
const AI_APIS = [
    _0x5dad20 => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x5dad20),
    _0x371a33 => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x371a33),
    _0x130c41 => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x130c41)
];
const askAI = async _0x473fcb => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x473fcb);
    for (const _0x52635e of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x52635e(_0x473fcb)['substring'](0x0, 0x32) + '...');
            const {data: _0x4fd48c} = await _0x0_0x16d3e8['get'](_0x52635e(_0x473fcb), { 'timeout': 0x3a98 });
            const _0x5827c9 = _0x4fd48c?.['data']?.['response'];
            if (_0x5827c9 && typeof _0x5827c9 === 'string' && _0x5827c9['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x5827c9['trim']();
            }
        } catch (_0x3fdaad) {
            console['log']('⚠️\x20API\x20failed:', _0x3fdaad['message']);
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
        if (!_0x0_0x2ae059 || !_0x0_0x2ae059['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x2ae31b = Array['from'](_0x0_0x2ae059['commands']['values']());
            const _0x43a7df = {};
            for (const _0x1e4db8 of _0x2ae31b) {
                const _0x2360ed = _0x1e4db8['category'] || 'misc';
                if (!_0x43a7df[_0x2360ed])
                    _0x43a7df[_0x2360ed] = [];
                _0x43a7df[_0x2360ed]['push']({
                    'name': _0x1e4db8['command'],
                    'description': _0x1e4db8['description'] || 'No\x20description',
                    'aliases': _0x1e4db8['aliases'] || [],
                    'usage': _0x1e4db8['usage'] || '.' + _0x1e4db8['command']
                });
            }
            let _0x508284 = '';
            for (const [_0x240edf, _0x51ed37] of Object['entries'](_0x43a7df)) {
                _0x508284 += '\x0a' + _0x240edf['toUpperCase']() + ':\x0a';
                for (const _0x46a069 of _0x51ed37) {
                    _0x508284 += '-\x20' + _0x46a069['name'] + ':\x20' + _0x46a069['description'];
                    if (_0x46a069['aliases']['length']) {
                        _0x508284 += '\x20(aliases:\x20' + _0x46a069['aliases']['join'](',\x20') + ')';
                    }
                    _0x508284 += '\x0a';
                }
            }
            return _0x508284 || 'No\x20commands\x20available';
        } catch (_0x21b104) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x21b104);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0xb2c68e['config'] || {
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
    async ['getResponse'](_0x220c4a, _0x35ddba, _0x5ad61a, _0x412739 = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x220c4a);
        console['log']('📝\x20Chat\x20ID:', _0x35ddba);
        console['log']('📝\x20Sender\x20ID:', _0x5ad61a);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x21fc71 = this['cleanMessage'](_0x220c4a);
            console['log']('📝\x20Clean\x20message:', _0x21fc71);
            if (!_0x21fc71 || _0x21fc71['length'] < 0x1) {
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
                const _0x3994de = await this['intelligentCommandDetection'](_0x21fc71);
                if (_0x3994de && _0x3994de['isCommand'] && _0x3994de['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x3994de['command']);
                    const _0x9f2fcb = await this['executeCommand'](_0x3994de['command'], _0x3994de['args'] || [], _0x35ddba, _0x5ad61a, _0x412739);
                    if (_0x9f2fcb['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x9f2fcb['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x9f2fcb['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x3994de['command'] + '`.\x20' + (_0x9f2fcb['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x1ab8a6 = await this['generateNaturalResponse'](_0x21fc71, _0x35ddba, _0x5ad61a);
            console['log']('✅\x20Response\x20generated:', _0x1ab8a6);
            return _0x1ab8a6;
        } catch (_0x32ff7e) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x32ff7e);
            console['error']('❌\x20Stack\x20trace:', _0x32ff7e['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20systemai\x20avec\x20`.cbc\x20provider\x20systemai`';
    }
    async ['intelligentCommandDetection'](_0x45c43b) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x45c43b);
        try {
            const _0xd34d7e = this['buildCommandDetectionPrompt'](_0x45c43b);
            const _0x201027 = this['config']['provider'] || 'systemai';
            const _0x3b95f2 = this['providers'][_0x201027];
            if (!_0x3b95f2) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x45c43b);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x201027);
            const _0x26ed8f = await this['_callWithTimeout'](() => _0x3b95f2(_0xd34d7e, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x26ed8f);
            const _0x331a4d = _0x26ed8f['match'](/\{[\s\S]*\}/);
            if (_0x331a4d) {
                try {
                    const _0x6f1c5d = JSON['parse'](_0x331a4d[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x6f1c5d);
                    if (_0x6f1c5d['isCommand'] && _0x6f1c5d['command']) {
                        if (_0x0_0x2ae059 && _0x0_0x2ae059['commands'] && _0x0_0x2ae059['commands']['has'](_0x6f1c5d['command'])) {
                            return _0x6f1c5d;
                        }
                        const _0x7ea63b = this['findSimilarCommand'](_0x6f1c5d['command']);
                        if (_0x7ea63b && _0x0_0x2ae059['commands'] && _0x0_0x2ae059['commands']['has'](_0x7ea63b)) {
                            _0x6f1c5d['command'] = _0x7ea63b;
                            _0x6f1c5d['suggested'] = !![];
                            return _0x6f1c5d;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x6f1c5d;
                } catch (_0x17e1ed) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x17e1ed);
                }
            }
            return this['simpleKeywordDetection'](_0x45c43b);
        } catch (_0x195bd0) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x195bd0);
            return this['simpleKeywordDetection'](_0x45c43b);
        }
    }
    ['buildCommandDetectionPrompt'](_0x263a5e) {
        if (!_0x0_0x2ae059 || !_0x0_0x2ae059['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x263a5e + '\x22';
        }
        const _0x2f2941 = Array['from'](_0x0_0x2ae059['commands']['values']());
        let _0x31e90e = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x155c07 of _0x2f2941) {
            _0x31e90e += '-\x20' + _0x155c07['command'];
            if (_0x155c07['aliases'] && _0x155c07['aliases']['length']) {
                _0x31e90e += '\x20(alias:\x20' + _0x155c07['aliases']['join'](',\x20') + ')';
            }
            _0x31e90e += ':\x20' + (_0x155c07['description'] || 'Pas\x20de\x20description');
            if (_0x155c07['usage']) {
                _0x31e90e += '\x20[Utilisation:\x20' + _0x155c07['usage'] + ']';
            }
            _0x31e90e += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x31e90e + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x263a5e + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x3a75b8) {
        const _0x4746a0 = _0x3a75b8['toLowerCase']();
        const _0x4a91cb = {
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
        let _0x434b22 = null;
        let _0x5b7151 = 0x0;
        for (const [_0x4defad, _0x21fb1d] of Object['entries'](_0x4a91cb)) {
            let _0x57607c = 0x0;
            for (const _0xff4ebf of _0x21fb1d) {
                if (_0x4746a0['includes'](_0xff4ebf)) {
                    _0x57607c += _0xff4ebf['length'] / 0x5;
                }
            }
            if (_0x57607c > _0x5b7151 && _0x57607c > 0x1) {
                _0x5b7151 = _0x57607c;
                _0x434b22 = _0x4defad;
            }
        }
        if (_0x434b22) {
            const _0x48b9fc = this['extractArgs'](_0x3a75b8);
            return {
                'isCommand': !![],
                'command': _0x434b22,
                'args': _0x48b9fc,
                'confidence': _0x5b7151 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x434b22
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x40da97) {
        const _0x21f5d2 = [];
        const _0x51e7b1 = _0x40da97['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x51e7b1)
            _0x21f5d2['push'](..._0x51e7b1);
        const _0x2678f3 = _0x40da97['match'](/\d+/g);
        if (_0x2678f3)
            _0x21f5d2['push'](..._0x2678f3);
        const _0x1fc047 = _0x40da97['match'](/"([^"]*)"/g);
        if (_0x1fc047)
            _0x21f5d2['push'](..._0x1fc047['map'](_0x253701 => _0x253701['replace'](/"/g, '')));
        const _0x496849 = _0x40da97['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x496849 && _0x496849[0x1]) {
            _0x21f5d2['push'](_0x496849[0x1]['trim']());
        }
        return _0x21f5d2;
    }
    ['findSimilarCommand'](_0x36101e) {
        if (!_0x0_0x2ae059 || !_0x0_0x2ae059['commands'])
            return null;
        const _0x2c664a = Array['from'](_0x0_0x2ae059['commands']['keys']());
        const _0x59b5b0 = _0x2c664a['filter'](_0x32d776 => _0x32d776['includes'](_0x36101e) || _0x36101e['includes'](_0x32d776) || this['levenshteinDistance'](_0x32d776, _0x36101e) < 0x3);
        return _0x59b5b0[0x0] || null;
    }
    ['levenshteinDistance'](_0x18926f, _0x5a0670) {
        const _0x467413 = [];
        for (let _0x415d0c = 0x0; _0x415d0c <= _0x5a0670['length']; _0x415d0c++) {
            _0x467413[_0x415d0c] = [_0x415d0c];
        }
        for (let _0x2671a4 = 0x0; _0x2671a4 <= _0x18926f['length']; _0x2671a4++) {
            _0x467413[0x0][_0x2671a4] = _0x2671a4;
        }
        for (let _0x30ef94 = 0x1; _0x30ef94 <= _0x5a0670['length']; _0x30ef94++) {
            for (let _0x5a9f34 = 0x1; _0x5a9f34 <= _0x18926f['length']; _0x5a9f34++) {
                if (_0x5a0670[_0x30ef94 - 0x1] === _0x18926f[_0x5a9f34 - 0x1]) {
                    _0x467413[_0x30ef94][_0x5a9f34] = _0x467413[_0x30ef94 - 0x1][_0x5a9f34 - 0x1];
                } else {
                    _0x467413[_0x30ef94][_0x5a9f34] = Math['min'](_0x467413[_0x30ef94 - 0x1][_0x5a9f34 - 0x1] + 0x1, _0x467413[_0x30ef94][_0x5a9f34 - 0x1] + 0x1, _0x467413[_0x30ef94 - 0x1][_0x5a9f34] + 0x1);
                }
            }
        }
        return _0x467413[_0x5a0670['length']][_0x18926f['length']];
    }
    async ['executeCommand'](_0x2fa8d1, _0x307f07, _0x5a23e1, _0x1306fe, _0x4d5090) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x2fa8d1, _0x307f07);
            if (!_0x0_0x2ae059 || !_0x0_0x2ae059['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0x319e41 = _0x0_0x2ae059['commands']['get'](_0x2fa8d1);
            if (!_0x319e41) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x353259 = _0x4d5090['isOwnerOrSudo'] || ![];
            const _0x709251 = _0x4d5090['isFromMe'] || ![];
            const _0x202ee8 = _0x5a23e1['endsWith']('@g.us');
            if (_0x319e41['ownerOnly'] && !_0x353259 && !_0x709251) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x319e41['groupOnly'] && !_0x202ee8) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x1313cf = {
                'key': {
                    'remoteJid': _0x5a23e1,
                    'participant': _0x1306fe
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x2fa8d1 + '\x20' + _0x307f07['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x4d5090['pushName'] || 'User'
            };
            await _0x319e41['handler'](_0x4d5090['sock'], _0x1313cf, _0x307f07, {
                'chatId': _0x5a23e1,
                'senderId': _0x1306fe,
                'isGroup': _0x202ee8,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x2fa8d1 + '\x20' + _0x307f07['join']('\x20'),
                'messageText': _0x2fa8d1 + '\x20' + _0x307f07['join']('\x20'),
                'userMessage': _0x2fa8d1 + '\x20' + _0x307f07['join']('\x20'),
                'config': _0x0_0x3ca6c9
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x2fa8d1 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x41d5c0) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x41d5c0);
            return {
                'success': ![],
                'error': _0x41d5c0['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x5c628a, _0x15a2aa, _0x1cb510) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x5c628a);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x181406 = this['buildConversationContext'](_0x5c628a, _0x15a2aa);
            console['log']('📝\x20Context\x20built,\x20length:', _0x181406['length']);
            const _0x1eca09 = this['config']['provider'] || 'systemai';
            const _0x347aa7 = this['providers'][_0x1eca09];
            if (!_0x347aa7) {
                console['error']('❌\x20Provider\x20' + _0x1eca09 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x1eca09);
            const _0x84fa6b = await this['_callWithTimeout'](() => _0x347aa7(_0x5c628a, _0x181406, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x84fa6b);
            const _0xa4da2a = this['cleanResponse'](_0x84fa6b);
            this['addToHistory'](_0x15a2aa, _0x5c628a, _0xa4da2a);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0xa4da2a);
            return _0xa4da2a || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x56860f) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x56860f);
            console['error']('❌\x20Stack\x20trace:', _0x56860f['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x2046e4, _0x3deeb8) {
        let _0x2fcdd3 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x2fcdd3 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x11f058 = this['getHistory'](_0x3deeb8);
        if (_0x11f058 && _0x11f058['length'] > 0x0) {
            _0x2fcdd3 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x11f058['join']('\x0a');
        }
        _0x2fcdd3 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x2046e4 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x2fcdd3;
    }
    async ['_callCustomAI'](_0x210caa, _0x5b3060, _0x511c8f) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x210caa);
        try {
            const _0x218829 = await askAI(_0x210caa);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x218829) || this['config']['fallbackResponse'];
        } catch (_0x2d78b5) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x2d78b5['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x42ae0f, _0x2575c8, _0x3034a2) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x42ae0f);
        const _0x5d27e9 = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x53c27a = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x24704d = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x53c27a) {
            _0x24704d['Authorization'] = 'Bearer\x20' + _0x53c27a;
        }
        const _0x2879c7 = [];
        if (typeof _0x2575c8 === 'string' && _0x2575c8['trim']()) {
            _0x2879c7['push']({
                'role': 'system',
                'content': _0x2575c8
            });
        }
        _0x2879c7['push']({
            'role': 'user',
            'content': _0x42ae0f
        });
        try {
            const _0x204e02 = await _0x0_0x2e503b(_0x5d27e9, {
                'method': 'POST',
                'headers': _0x24704d,
                'body': JSON['stringify']({
                    'model': this['config']['pollinationsModel'] || 'openai',
                    'messages': _0x2879c7,
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x204e02['status']);
            if (!_0x204e02['ok']) {
                const _0x41e02b = await _0x204e02['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x41e02b);
                if (_0x204e02['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0x204e02['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20systemai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x435ad0 = await _0x204e02['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x89c7be = _0x435ad0['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x89c7be);
            return this['cleanResponse'](_0x89c7be) || this['config']['fallbackResponse'];
        } catch (_0x5911aa) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x5911aa['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x2c475e, _0x4f7d2e, _0x5bae9b) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x2c475e);
        const _0x2824fe = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x2824fe) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x5a33af} = await import('openai');
            const _0x383274 = new _0x5a33af({
                'apiKey': _0x2824fe,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x545269 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x545269);
            const _0x5b4fb4 = await _0x383274['chat']['completions']['create']({
                'model': _0x545269,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x4f7d2e
                    },
                    {
                        'role': 'user',
                        'content': _0x2c475e
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x1cf978 = _0x5b4fb4['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x1cf978) || this['config']['fallbackResponse'];
        } catch (_0xa42c40) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0xa42c40['message']);
            if (_0xa42c40['status'] === 0x191 || _0xa42c40['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0xa42c40['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x53e90b, _0x11073f, _0x72b5d8) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x53e90b);
        const _0x4ba5da = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x4ba5da) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0xed3aef} = await import('@google/genai');
            const _0x5cda9d = new _0xed3aef({ 'apiKey': _0x4ba5da });
            const _0x2945de = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0x2945de);
            const _0x2563b5 = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x11073f === 'string' && _0x11073f['trim']()) {
                _0x2563b5['systemInstruction'] = _0x11073f;
            }
            const _0x4b17f6 = await _0x5cda9d['models']['generateContent']({
                'model': _0x2945de,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x53e90b }]
                    }],
                'config': _0x2563b5
            });
            const _0x585b4d = _0x4b17f6['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x585b4d) || this['config']['fallbackResponse'];
        } catch (_0xd6e370) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0xd6e370['message']);
            if (_0xd6e370['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0xd6e370['message']?.['includes']('not\x20enabled') || _0xd6e370['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0xd6e370['message']?.['includes']('RESOURCE_EXHAUSTED') || _0xd6e370['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x2f1906, _0x258c9e, _0x59fb96) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x2f1906);
        const _0x16905e = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x16905e) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x580c9a = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x166f83 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x2e006a = await _0x0_0x2e503b(_0x580c9a, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x16905e
                },
                'body': JSON['stringify']({
                    'model': _0x166f83,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x258c9e
                        },
                        {
                            'role': 'user',
                            'content': _0x2f1906
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x2e006a['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x2e006a['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x4282b9 = await _0x2e006a['json']();
            const _0x2af143 = _0x4282b9['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x2af143) || this['config']['fallbackResponse'];
        } catch (_0x31c583) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x31c583['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x2e3baa, _0x2e98e0, _0xe2bab2) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x2e3baa);
        const _0x15b6c5 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x15b6c5) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x2d42fb} = await import('openai');
            const _0x5b8c10 = new _0x2d42fb({ 'apiKey': _0x15b6c5 });
            const _0x21c6d8 = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0x21c6d8);
            const _0x35c865 = await _0x5b8c10['chat']['completions']['create']({
                'model': _0x21c6d8,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x2e98e0
                    },
                    {
                        'role': 'user',
                        'content': _0x2e3baa
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x49870 = _0x35c865['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x49870) || this['config']['fallbackResponse'];
        } catch (_0x7a291b) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x7a291b['message']);
            if (_0x7a291b['status'] === 0x191 || _0x7a291b['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x7a291b['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x52e3ef, _0x33e0cc, _0x14771e) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x52e3ef);
        const _0x34d64f = this['config']['apiUrl'];
        if (!_0x34d64f) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x31c0fa = await _0x0_0x2e503b(_0x34d64f, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x52e3ef,
                    'context': _0x33e0cc,
                    'metadata': _0x14771e
                })
            });
            if (!_0x31c0fa['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x31c0fa['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x3216be = await _0x31c0fa['json']();
            const _0x7e245c = _0x3216be['response'] || _0x3216be['reply'] || _0x3216be['text'] || _0x3216be['result'];
            return this['cleanResponse'](_0x7e245c) || this['config']['fallbackResponse'];
        } catch (_0x4a37f5) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x4a37f5['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x5301ce) {
        const _0x15918b = 'Nova';
        const _0x23d579 = [
            new RegExp('^' + _0x15918b + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x15918b + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x15918b + ',?\x5cs+', 'i')
        ];
        let _0x4cbc02 = _0x5301ce;
        for (const _0x44583e of _0x23d579) {
            _0x4cbc02 = _0x4cbc02['replace'](_0x44583e, '')['trim']();
        }
        return _0x4cbc02;
    }
    ['cleanResponse'](_0x42b3c0) {
        if (!_0x42b3c0)
            return null;
        let _0x4a7fb9 = _0x42b3c0['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x4a7fb9['length'] > 0x7d0) {
            _0x4a7fb9 = _0x4a7fb9['slice'](0x0, 0x7d0) + '...';
        }
        return _0x4a7fb9;
    }
    ['getHistory'](_0x4eee31) {
        const _0x1b4218 = this['history']['get'](_0x4eee31) || [];
        const _0x4f93be = this['config']['maxHistory'] || 0xf;
        return _0x1b4218['slice'](-_0x4f93be);
    }
    ['addToHistory'](_0x3b498b, _0x1389b5, _0x403409) {
        if (!this['history']['has'](_0x3b498b)) {
            this['history']['set'](_0x3b498b, []);
        }
        const _0x28bf74 = this['history']['get'](_0x3b498b);
        _0x28bf74['push']('User:\x20' + _0x1389b5);
        _0x28bf74['push']('Nova:\x20' + _0x403409);
        const _0x5008f4 = this['config']['maxHistory'] || 0xf;
        if (_0x28bf74['length'] > _0x5008f4 * 0x2) {
            this['history']['set'](_0x3b498b, _0x28bf74['slice'](-_0x5008f4 * 0x2));
        }
    }
    ['clearHistory'](_0x5a1cac) {
        if (_0x5a1cac) {
            this['history']['delete'](_0x5a1cac);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x538724, _0xb2739d) {
        if (_0x538724) {
            this['contextCache']['set'](_0x538724, _0xb2739d);
        } else {
            this['config']['customContext'] = _0xb2739d;
            _0x0_0xb2c68e['set']('customContext', _0xb2739d);
        }
    }
    ['getContext'](_0x5c6b56) {
        return this['contextCache']['get'](_0x5c6b56) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0xfeb05a, _0x279dcd) {
        return new Promise((_0xd6b52e, _0x46824b) => {
            const _0x86db59 = setTimeout(() => {
                _0x46824b(new Error('Request\x20timeout\x20after\x20' + _0x279dcd + 'ms'));
            }, _0x279dcd);
            _0xfeb05a()['then'](_0x4568c1 => {
                clearTimeout(_0x86db59);
                _0xd6b52e(_0x4568c1);
            })['catch'](_0x45008d => {
                clearTimeout(_0x86db59);
                _0x46824b(_0x45008d);
            });
        });
    }
}
export default new ChatbotService();