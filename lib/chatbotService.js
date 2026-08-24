import _0x0_0x19d715 from 'node-fetch';
import _0x0_0x270988 from 'axios';
import _0x0_0x2161bc from './chatbotConfig.js';
import * as _0x0_0x5b522f from './commandHandler.js';
import _0x0_0x23a126 from '../config.js';
import _0x0_0xc7c1b3 from 'dotenv';
_0x0_0xc7c1b3['config']();
const AI_APIS = [
    _0x3119bf => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x3119bf),
    _0x117049 => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x117049),
    _0x3f6c96 => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x3f6c96)
];
const askAI = async _0x3f661a => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x3f661a);
    for (const _0x1a8a04 of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x1a8a04(_0x3f661a)['substring'](0x0, 0x32) + '...');
            const {data: _0x498177} = await _0x0_0x270988['get'](_0x1a8a04(_0x3f661a), { 'timeout': 0x3a98 });
            const _0x80d9ed = _0x498177?.['data']?.['response'];
            if (_0x80d9ed && typeof _0x80d9ed === 'string' && _0x80d9ed['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x80d9ed['trim']();
            }
        } catch (_0x3084bd) {
            console['log']('⚠️\x20API\x20failed:', _0x3084bd['message']);
            continue;
        }
    }
    throw new Error('All\x20AI\x20APIs\x20failed');
};
class ChatbotService {
    constructor() {
        console['log']('🤖\x20ChatbotService\x20initializing...');
        console['log']('📋\x20Using\x20custom\x20AI\x20APIs');
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
        if (!_0x0_0x5b522f || !_0x0_0x5b522f['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x2b5a92 = Array['from'](_0x0_0x5b522f['commands']['values']());
            const _0x522658 = {};
            for (const _0x1a3e92 of _0x2b5a92) {
                const _0x264fa1 = _0x1a3e92['category'] || 'misc';
                if (!_0x522658[_0x264fa1])
                    _0x522658[_0x264fa1] = [];
                _0x522658[_0x264fa1]['push']({
                    'name': _0x1a3e92['command'],
                    'description': _0x1a3e92['description'] || 'No\x20description',
                    'aliases': _0x1a3e92['aliases'] || [],
                    'usage': _0x1a3e92['usage'] || '.' + _0x1a3e92['command']
                });
            }
            let _0x5da904 = '';
            for (const [_0x3a9712, _0x3532f8] of Object['entries'](_0x522658)) {
                _0x5da904 += '\x0a' + _0x3a9712['toUpperCase']() + ':\x0a';
                for (const _0x30848f of _0x3532f8) {
                    _0x5da904 += '-\x20' + _0x30848f['name'] + ':\x20' + _0x30848f['description'];
                    if (_0x30848f['aliases']['length']) {
                        _0x5da904 += '\x20(aliases:\x20' + _0x30848f['aliases']['join'](',\x20') + ')';
                    }
                    _0x5da904 += '\x0a';
                }
            }
            return _0x5da904 || 'No\x20commands\x20available';
        } catch (_0x2488a7) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x2488a7);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x2161bc['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'systemai',
            'apiKey': '',
            'apiUrl': '',
            'puterModel': 'gpt-5.4-nano',
            'grokModel': 'grok-4.6',
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
    async ['getResponse'](_0x3e62e7, _0x3a7319, _0x102450, _0x48270e = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x3e62e7);
        console['log']('📝\x20Chat\x20ID:', _0x3a7319);
        console['log']('📝\x20Sender\x20ID:', _0x102450);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x18c00e = this['cleanMessage'](_0x3e62e7);
            console['log']('📝\x20Clean\x20message:', _0x18c00e);
            if (!_0x18c00e || _0x18c00e['length'] < 0x1) {
                console['log']('❌\x20Empty\x20message\x20after\x20cleaning');
                return null;
            }
            console['log']('✅\x20Chatbot\x20will\x20process\x20message');
            if (this['config']['executeCommands']) {
                console['log']('🔍\x20Checking\x20for\x20commands...');
                const _0xf130fe = await this['intelligentCommandDetection'](_0x18c00e);
                if (_0xf130fe && _0xf130fe['isCommand'] && _0xf130fe['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0xf130fe['command']);
                    const _0x3066ae = await this['executeCommand'](_0xf130fe['command'], _0xf130fe['args'] || [], _0x3a7319, _0x102450, _0x48270e);
                    if (_0x3066ae['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x3066ae['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x3066ae['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0xf130fe['command'] + '`.\x20' + (_0x3066ae['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x7a8e77 = await this['generateNaturalResponse'](_0x18c00e, _0x3a7319, _0x102450);
            console['log']('✅\x20Response\x20generated:', _0x7a8e77);
            return _0x7a8e77;
        } catch (_0x3dd05a) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x3dd05a);
            console['error']('❌\x20Stack\x20trace:', _0x3dd05a['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20systemai\x20avec\x20`.cbc\x20provider\x20systemai`';
    }
    async ['intelligentCommandDetection'](_0x530437) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x530437);
        try {
            const _0x22f3eb = this['buildCommandDetectionPrompt'](_0x530437);
            const _0x15bcb6 = this['config']['provider'] || 'systemai';
            const _0x5667be = this['providers'][_0x15bcb6];
            if (!_0x5667be) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x530437);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x15bcb6);
            const _0x21fdfc = await this['_callWithTimeout'](() => _0x5667be(_0x22f3eb, { 'isCommandDetection': !![] }, {}), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x21fdfc);
            const _0x43df6f = _0x21fdfc['match'](/\{[\s\S]*\}/);
            if (_0x43df6f) {
                try {
                    const _0x59ab73 = JSON['parse'](_0x43df6f[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x59ab73);
                    if (_0x59ab73['isCommand'] && _0x59ab73['command']) {
                        if (_0x0_0x5b522f && _0x0_0x5b522f['commands'] && _0x0_0x5b522f['commands']['has'](_0x59ab73['command'])) {
                            return _0x59ab73;
                        }
                        const _0xfeea98 = this['findSimilarCommand'](_0x59ab73['command']);
                        if (_0xfeea98 && _0x0_0x5b522f['commands'] && _0x0_0x5b522f['commands']['has'](_0xfeea98)) {
                            _0x59ab73['command'] = _0xfeea98;
                            _0x59ab73['suggested'] = !![];
                            return _0x59ab73;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x59ab73;
                } catch (_0x2e73ee) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x2e73ee);
                }
            }
            return this['simpleKeywordDetection'](_0x530437);
        } catch (_0x177493) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x177493);
            return this['simpleKeywordDetection'](_0x530437);
        }
    }
    ['buildCommandDetectionPrompt'](_0x1930c5) {
        if (!_0x0_0x5b522f || !_0x0_0x5b522f['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x1930c5 + '\x22';
        }
        const _0x5cb02c = Array['from'](_0x0_0x5b522f['commands']['values']());
        let _0x553470 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x2366ee of _0x5cb02c) {
            _0x553470 += '-\x20' + _0x2366ee['command'];
            if (_0x2366ee['aliases'] && _0x2366ee['aliases']['length']) {
                _0x553470 += '\x20(alias:\x20' + _0x2366ee['aliases']['join'](',\x20') + ')';
            }
            _0x553470 += ':\x20' + (_0x2366ee['description'] || 'Pas\x20de\x20description');
            if (_0x2366ee['usage']) {
                _0x553470 += '\x20[Utilisation:\x20' + _0x2366ee['usage'] + ']';
            }
            _0x553470 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x553470 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x1930c5 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x2e9b46) {
        const _0x2b5045 = _0x2e9b46['toLowerCase']();
        const _0xc58e2e = {
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
        let _0x7fd744 = null;
        let _0x43afbd = 0x0;
        for (const [_0x5e26a5, _0x2fc25b] of Object['entries'](_0xc58e2e)) {
            let _0x3575cf = 0x0;
            for (const _0x3926d3 of _0x2fc25b) {
                if (_0x2b5045['includes'](_0x3926d3)) {
                    _0x3575cf += _0x3926d3['length'] / 0x5;
                }
            }
            if (_0x3575cf > _0x43afbd && _0x3575cf > 0x1) {
                _0x43afbd = _0x3575cf;
                _0x7fd744 = _0x5e26a5;
            }
        }
        if (_0x7fd744) {
            const _0x511754 = this['extractArgs'](_0x2e9b46);
            return {
                'isCommand': !![],
                'command': _0x7fd744,
                'args': _0x511754,
                'confidence': _0x43afbd > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x7fd744
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x32bbf4) {
        const _0x5e3ecc = [];
        const _0x4d6497 = _0x32bbf4['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x4d6497)
            _0x5e3ecc['push'](..._0x4d6497);
        const _0x23c681 = _0x32bbf4['match'](/\d+/g);
        if (_0x23c681)
            _0x5e3ecc['push'](..._0x23c681);
        const _0x3172c6 = _0x32bbf4['match'](/"([^"]*)"/g);
        if (_0x3172c6)
            _0x5e3ecc['push'](..._0x3172c6['map'](_0xf65037 => _0xf65037['replace'](/"/g, '')));
        const _0x18e1dc = _0x32bbf4['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x18e1dc && _0x18e1dc[0x1]) {
            _0x5e3ecc['push'](_0x18e1dc[0x1]['trim']());
        }
        return _0x5e3ecc;
    }
    ['findSimilarCommand'](_0x143551) {
        if (!_0x0_0x5b522f || !_0x0_0x5b522f['commands'])
            return null;
        const _0x29e2da = Array['from'](_0x0_0x5b522f['commands']['keys']());
        const _0x262d68 = _0x29e2da['filter'](_0x581acf => _0x581acf['includes'](_0x143551) || _0x143551['includes'](_0x581acf) || this['levenshteinDistance'](_0x581acf, _0x143551) < 0x3);
        return _0x262d68[0x0] || null;
    }
    ['levenshteinDistance'](_0x50be48, _0x4c8081) {
        const _0x50023a = [];
        for (let _0x3b042e = 0x0; _0x3b042e <= _0x4c8081['length']; _0x3b042e++) {
            _0x50023a[_0x3b042e] = [_0x3b042e];
        }
        for (let _0x1b1ca9 = 0x0; _0x1b1ca9 <= _0x50be48['length']; _0x1b1ca9++) {
            _0x50023a[0x0][_0x1b1ca9] = _0x1b1ca9;
        }
        for (let _0x18c830 = 0x1; _0x18c830 <= _0x4c8081['length']; _0x18c830++) {
            for (let _0x3f8607 = 0x1; _0x3f8607 <= _0x50be48['length']; _0x3f8607++) {
                if (_0x4c8081[_0x18c830 - 0x1] === _0x50be48[_0x3f8607 - 0x1]) {
                    _0x50023a[_0x18c830][_0x3f8607] = _0x50023a[_0x18c830 - 0x1][_0x3f8607 - 0x1];
                } else {
                    _0x50023a[_0x18c830][_0x3f8607] = Math['min'](_0x50023a[_0x18c830 - 0x1][_0x3f8607 - 0x1] + 0x1, _0x50023a[_0x18c830][_0x3f8607 - 0x1] + 0x1, _0x50023a[_0x18c830 - 0x1][_0x3f8607] + 0x1);
                }
            }
        }
        return _0x50023a[_0x4c8081['length']][_0x50be48['length']];
    }
    async ['executeCommand'](_0x51fdbc, _0x1d471d, _0x49c0d3, _0x576411, _0x2fd365) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x51fdbc, _0x1d471d);
            if (!_0x0_0x5b522f || !_0x0_0x5b522f['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0xd9aa19 = _0x0_0x5b522f['commands']['get'](_0x51fdbc);
            if (!_0xd9aa19) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x291f99 = _0x2fd365['isOwnerOrSudo'] || ![];
            const _0xf4883f = _0x2fd365['isFromMe'] || ![];
            const _0x3c9d0e = _0x49c0d3['endsWith']('@g.us');
            if (_0xd9aa19['ownerOnly'] && !_0x291f99 && !_0xf4883f) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0xd9aa19['groupOnly'] && !_0x3c9d0e) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x237630 = {
                'key': {
                    'remoteJid': _0x49c0d3,
                    'participant': _0x576411
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x51fdbc + '\x20' + _0x1d471d['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x2fd365['pushName'] || 'User'
            };
            await _0xd9aa19['handler'](_0x2fd365['sock'], _0x237630, _0x1d471d, {
                'chatId': _0x49c0d3,
                'senderId': _0x576411,
                'isGroup': _0x3c9d0e,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x51fdbc + '\x20' + _0x1d471d['join']('\x20'),
                'messageText': _0x51fdbc + '\x20' + _0x1d471d['join']('\x20'),
                'userMessage': _0x51fdbc + '\x20' + _0x1d471d['join']('\x20'),
                'config': _0x0_0x23a126
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x51fdbc + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x26ce5f) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x26ce5f);
            return {
                'success': ![],
                'error': _0x26ce5f['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x53ab14, _0x5c6d9f, _0x174715) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x53ab14);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x2bcd56 = this['buildConversationContext'](_0x53ab14, _0x5c6d9f);
            console['log']('📝\x20Context\x20built,\x20length:', _0x2bcd56['length']);
            const _0x20c79d = this['config']['provider'] || 'systemai';
            const _0x2425f1 = this['providers'][_0x20c79d];
            if (!_0x2425f1) {
                console['error']('❌\x20Provider\x20' + _0x20c79d + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x20c79d);
            const _0x91e759 = await this['_callWithTimeout'](() => _0x2425f1(_0x53ab14, _0x2bcd56, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x91e759);
            const _0x596482 = this['cleanResponse'](_0x91e759);
            this['addToHistory'](_0x5c6d9f, _0x53ab14, _0x596482);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x596482);
            return _0x596482 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x388bb0) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x388bb0);
            console['error']('❌\x20Stack\x20trace:', _0x388bb0['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x277c09, _0x5ec908) {
        let _0x2b6625 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x2b6625 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x2de107 = this['getHistory'](_0x5ec908);
        if (_0x2de107 && _0x2de107['length'] > 0x0) {
            _0x2b6625 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x2de107['join']('\x0a');
        }
        _0x2b6625 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x277c09 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x2b6625;
    }
    async ['_callCustomAI'](_0x1472b7, _0x4ac323, _0x331588) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x1472b7);
        try {
            const _0x3d09d5 = await askAI(_0x1472b7);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x3d09d5) || this['config']['fallbackResponse'];
        } catch (_0x961785) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x961785['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x202f8d, _0x540621, _0x3bc389) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x202f8d);
        const _0x3187cd = 'https://text.pollinations.ai/openai';
        try {
            const _0x55861e = await _0x0_0x19d715(_0x3187cd, {
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
                            'content': _0x540621
                        },
                        {
                            'role': 'user',
                            'content': _0x202f8d
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x55861e['status']);
            if (!_0x55861e['ok']) {
                const _0x2172f8 = await _0x55861e['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x2172f8);
                return this['config']['fallbackResponse'];
            }
            const _0x32598f = await _0x55861e['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x383338 = _0x32598f['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x383338);
            return this['cleanResponse'](_0x383338) || this['config']['fallbackResponse'];
        } catch (_0x4a7089) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x4a7089['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x55cc2a, _0x5d8070, _0x47a39d) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x55cc2a);
        const _0x451ef0 = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x451ef0) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x22afd8} = await import('openai');
            const _0x3450a0 = new _0x22afd8({
                'apiKey': _0x451ef0,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x87c0e9 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x87c0e9);
            const _0x433e56 = await _0x3450a0['chat']['completions']['create']({
                'model': _0x87c0e9,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x5d8070
                    },
                    {
                        'role': 'user',
                        'content': _0x55cc2a
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x11ec3a = _0x433e56['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x11ec3a) || this['config']['fallbackResponse'];
        } catch (_0x48bb16) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x48bb16['message']);
            if (_0x48bb16['message']['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x5b32e0, _0xdf4e8, _0x388ff7) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x5b32e0);
        const _0x171207 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x171207) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x44bf10} = await import('@google/genai');
            const _0x233719 = new _0x44bf10({ 'apiKey': _0x171207 });
            const _0x1fb5db = 'gemini-2.0-flash-exp';
            console['log']('📡\x20Using\x20model:\x20' + _0x1fb5db);
            const _0x5632f8 = await _0x233719['interactions']['create']({
                'model': _0x1fb5db,
                'input': _0xdf4e8 + '\x0a\x0aUser:\x20' + _0x5b32e0 + '\x0a\x0aAssistant:',
                'config': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            });
            const _0x350e12 = _0x5632f8['output_text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x350e12) || this['config']['fallbackResponse'];
        } catch (_0xeef478) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0xeef478['message']);
            if (_0xeef478['message']['includes']('not\x20enabled')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x579d86, _0x37dbd5, _0x28f3ba) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x579d86);
        const _0x150fd5 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x150fd5) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x45d8aa = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x5aa910 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x21ed21 = await _0x0_0x19d715(_0x45d8aa, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x150fd5
                },
                'body': JSON['stringify']({
                    'model': _0x5aa910,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x37dbd5
                        },
                        {
                            'role': 'user',
                            'content': _0x579d86
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x21ed21['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x21ed21['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x3b703d = await _0x21ed21['json']();
            const _0x51e38a = _0x3b703d['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x51e38a) || this['config']['fallbackResponse'];
        } catch (_0x46aaf1) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x46aaf1['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x41936f, _0x31699f, _0x26c68b) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x41936f);
        const _0x4fddf5 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x4fddf5) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x49837f} = await import('openai');
            const _0x25959b = new _0x49837f({ 'apiKey': _0x4fddf5 });
            const _0x372a71 = await _0x25959b['chat']['completions']['create']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x31699f
                    },
                    {
                        'role': 'user',
                        'content': _0x41936f
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x3a3cf4 = _0x372a71['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x3a3cf4) || this['config']['fallbackResponse'];
        } catch (_0x46d0e0) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x46d0e0['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x215f5d, _0x8bd1f6, _0x143043) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x215f5d);
        const _0x2c7774 = this['config']['apiUrl'];
        if (!_0x2c7774) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x4d8983 = await _0x0_0x19d715(_0x2c7774, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x215f5d,
                    'context': _0x8bd1f6,
                    'metadata': _0x143043
                })
            });
            if (!_0x4d8983['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x4d8983['text']());
                return this['config']['fallbackResponse'];
            }
            const _0xae1ed7 = await _0x4d8983['json']();
            const _0x1897b9 = _0xae1ed7['response'] || _0xae1ed7['reply'] || _0xae1ed7['text'] || _0xae1ed7['result'];
            return this['cleanResponse'](_0x1897b9) || this['config']['fallbackResponse'];
        } catch (_0x21695e) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x21695e['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x209a39) {
        const _0x44d2b2 = 'Nova';
        const _0x33c3f5 = [
            new RegExp('^' + _0x44d2b2 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x44d2b2 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x44d2b2 + ',?\x5cs+', 'i')
        ];
        let _0x14abeb = _0x209a39;
        for (const _0x104e52 of _0x33c3f5) {
            _0x14abeb = _0x14abeb['replace'](_0x104e52, '')['trim']();
        }
        return _0x14abeb;
    }
    ['cleanResponse'](_0x384945) {
        if (!_0x384945)
            return null;
        let _0x25af95 = _0x384945['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x25af95['length'] > 0x7d0) {
            _0x25af95 = _0x25af95['slice'](0x0, 0x7d0) + '...';
        }
        return _0x25af95;
    }
    ['getHistory'](_0x152550) {
        const _0x2d21f7 = this['history']['get'](_0x152550) || [];
        const _0x4eaa26 = this['config']['maxHistory'] || 0xf;
        return _0x2d21f7['slice'](-_0x4eaa26);
    }
    ['addToHistory'](_0x3e0bb8, _0x13a78f, _0x3a07f4) {
        if (!this['history']['has'](_0x3e0bb8)) {
            this['history']['set'](_0x3e0bb8, []);
        }
        const _0x22255e = this['history']['get'](_0x3e0bb8);
        _0x22255e['push']('User:\x20' + _0x13a78f);
        _0x22255e['push']('Nova:\x20' + _0x3a07f4);
        const _0x1ae175 = this['config']['maxHistory'] || 0xf;
        if (_0x22255e['length'] > _0x1ae175 * 0x2) {
            this['history']['set'](_0x3e0bb8, _0x22255e['slice'](-_0x1ae175 * 0x2));
        }
    }
    ['clearHistory'](_0x478a1a) {
        if (_0x478a1a) {
            this['history']['delete'](_0x478a1a);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x8ee93d, _0xab55c) {
        if (_0x8ee93d) {
            this['contextCache']['set'](_0x8ee93d, _0xab55c);
        } else {
            this['config']['customContext'] = _0xab55c;
            _0x0_0x2161bc['set']('customContext', _0xab55c);
        }
    }
    ['getContext'](_0x45a845) {
        return this['contextCache']['get'](_0x45a845) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x215283, _0x41014f) {
        return new Promise((_0x1a3e40, _0x46fe1a) => {
            const _0x509b7b = setTimeout(() => {
                _0x46fe1a(new Error('Request\x20timeout\x20after\x20' + _0x41014f + 'ms'));
            }, _0x41014f);
            _0x215283()['then'](_0x205fa8 => {
                clearTimeout(_0x509b7b);
                _0x1a3e40(_0x205fa8);
            })['catch'](_0x3d6839 => {
                clearTimeout(_0x509b7b);
                _0x46fe1a(_0x3d6839);
            });
        });
    }
}
export default new ChatbotService();