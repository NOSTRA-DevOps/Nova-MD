import _0x0_0x1420fd from 'node-fetch';
import _0x0_0x38d8dd from 'axios';
import _0x0_0x538288 from './chatbotConfig.js';
import * as _0x0_0x2e6586 from './commandHandler.js';
import _0x0_0x5b1fea from '../config.js';
import _0x0_0x2727c8 from 'dotenv';
_0x0_0x2727c8['config']();
const AI_APIS = [
    _0x11f121 => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x11f121),
    _0xfb0c0 => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0xfb0c0),
    _0x475d28 => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x475d28)
];
const askAI = async _0x18979a => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x18979a);
    for (const _0x26a933 of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x26a933(_0x18979a)['substring'](0x0, 0x32) + '...');
            const {data: _0x289104} = await _0x0_0x38d8dd['get'](_0x26a933(_0x18979a), { 'timeout': 0x3a98 });
            const _0x59d398 = _0x289104?.['data']?.['response'];
            if (_0x59d398 && typeof _0x59d398 === 'string' && _0x59d398['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x59d398['trim']();
            }
        } catch (_0x2586f8) {
            console['log']('⚠️\x20API\x20failed:', _0x2586f8['message']);
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
        if (!_0x0_0x2e6586 || !_0x0_0x2e6586['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x54ec94 = Array['from'](_0x0_0x2e6586['commands']['values']());
            const _0x482c93 = {};
            for (const _0x573c7f of _0x54ec94) {
                const _0x23725e = _0x573c7f['category'] || 'misc';
                if (!_0x482c93[_0x23725e])
                    _0x482c93[_0x23725e] = [];
                _0x482c93[_0x23725e]['push']({
                    'name': _0x573c7f['command'],
                    'description': _0x573c7f['description'] || 'No\x20description',
                    'aliases': _0x573c7f['aliases'] || [],
                    'usage': _0x573c7f['usage'] || '.' + _0x573c7f['command']
                });
            }
            let _0x45e40d = '';
            for (const [_0x417153, _0x474c77] of Object['entries'](_0x482c93)) {
                _0x45e40d += '\x0a' + _0x417153['toUpperCase']() + ':\x0a';
                for (const _0x12e178 of _0x474c77) {
                    _0x45e40d += '-\x20' + _0x12e178['name'] + ':\x20' + _0x12e178['description'];
                    if (_0x12e178['aliases']['length']) {
                        _0x45e40d += '\x20(aliases:\x20' + _0x12e178['aliases']['join'](',\x20') + ')';
                    }
                    _0x45e40d += '\x0a';
                }
            }
            return _0x45e40d || 'No\x20commands\x20available';
        } catch (_0x3ec7b8) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x3ec7b8);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x538288['config'] || {
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
    async ['getResponse'](_0x40feda, _0x3a1cdb, _0x4cb4c1, _0x5da972 = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x40feda);
        console['log']('📝\x20Chat\x20ID:', _0x3a1cdb);
        console['log']('📝\x20Sender\x20ID:', _0x4cb4c1);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x2d5d90 = this['cleanMessage'](_0x40feda);
            console['log']('📝\x20Clean\x20message:', _0x2d5d90);
            if (!_0x2d5d90 || _0x2d5d90['length'] < 0x1) {
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
                const _0x3bf0ba = await this['intelligentCommandDetection'](_0x2d5d90);
                if (_0x3bf0ba && _0x3bf0ba['isCommand'] && _0x3bf0ba['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x3bf0ba['command']);
                    const _0x273252 = await this['executeCommand'](_0x3bf0ba['command'], _0x3bf0ba['args'] || [], _0x3a1cdb, _0x4cb4c1, _0x5da972);
                    if (_0x273252['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x273252['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x273252['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x3bf0ba['command'] + '`.\x20' + (_0x273252['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x586317 = await this['generateNaturalResponse'](_0x2d5d90, _0x3a1cdb, _0x4cb4c1);
            console['log']('✅\x20Response\x20generated:', _0x586317);
            return _0x586317;
        } catch (_0x22ee4c) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x22ee4c);
            console['error']('❌\x20Stack\x20trace:', _0x22ee4c['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20customai\x20avec\x20`.cbc\x20provider\x20customai`';
    }
    async ['intelligentCommandDetection'](_0x466bd5) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x466bd5);
        try {
            const _0x4f376b = this['buildCommandDetectionPrompt'](_0x466bd5);
            const _0x403c49 = this['config']['provider'] || 'customai';
            const _0x4779e3 = this['providers'][_0x403c49];
            if (!_0x4779e3) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x466bd5);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x403c49);
            const _0x43f30d = await this['_callWithTimeout'](() => _0x4779e3(_0x4f376b, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x43f30d);
            const _0x34e05f = this['_extractJson'](_0x43f30d);
            const _0x361c6b = this['_normalizeCommandDetection'](_0x34e05f);
            if (_0x361c6b) {
                try {
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x361c6b);
                    if (_0x361c6b['isCommand'] && _0x361c6b['command']) {
                        if (_0x0_0x2e6586 && _0x0_0x2e6586['commands'] && _0x0_0x2e6586['commands']['has'](_0x361c6b['command'])) {
                            return _0x361c6b;
                        }
                        const _0x5dc4df = this['findSimilarCommand'](_0x361c6b['command']);
                        if (_0x5dc4df && _0x0_0x2e6586['commands'] && _0x0_0x2e6586['commands']['has'](_0x5dc4df)) {
                            _0x361c6b['command'] = _0x5dc4df;
                            _0x361c6b['suggested'] = !![];
                            return _0x361c6b;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x361c6b;
                } catch (_0x42b02d) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x42b02d);
                }
            }
            return this['simpleKeywordDetection'](_0x466bd5);
        } catch (_0x2ade90) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x2ade90);
            return this['simpleKeywordDetection'](_0x466bd5);
        }
    }
    ['_extractJson'](_0x390b16) {
        if (!_0x390b16 || typeof _0x390b16 !== 'string')
            return null;
        const _0x523670 = _0x390b16['trim']();
        try {
            return JSON['parse'](_0x523670);
        } catch (_0x531f20) {
        }
        const _0x113919 = _0x523670['match'](/\{[\s\S]*\}/);
        if (_0x113919) {
            try {
                return JSON['parse'](_0x113919[0x0]);
            } catch (_0xa0d18c) {
                return null;
            }
        }
        return null;
    }
    ['_normalizeCommandDetection'](_0x2a86c6) {
        if (!_0x2a86c6 || typeof _0x2a86c6 !== 'object')
            return null;
        const _0x596c10 = _0x2a86c6['isCommand'] ?? _0x2a86c6['est_une_demande_de_commande'] ?? _0x2a86c6['est_demande_de_commande'] ?? _0x2a86c6['is_command'] ?? ![];
        const _0x4ae478 = _0x2a86c6['command'] ?? _0x2a86c6['commande'] ?? _0x2a86c6['cmd'] ?? null;
        const _0x3de79c = _0x2a86c6['args'] ?? _0x2a86c6['arguments'] ?? _0x2a86c6['arguments_'] ?? [];
        const _0x3203cf = _0x2a86c6['confidence'] ?? _0x2a86c6['confiance'] ?? 'medium';
        const _0x3bf0a1 = _0x2a86c6['reason'] ?? _0x2a86c6['analyse'] ?? _0x2a86c6['raison'] ?? '';
        return {
            'isCommand': !!_0x596c10,
            'command': typeof _0x4ae478 === 'string' ? _0x4ae478['toLowerCase']()['trim']() : _0x4ae478,
            'args': Array['isArray'](_0x3de79c) ? _0x3de79c : [],
            'confidence': _0x3203cf,
            'reason': _0x3bf0a1
        };
    }
    ['buildCommandDetectionPrompt'](_0x3d3b94) {
        if (!_0x0_0x2e6586 || !_0x0_0x2e6586['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x3d3b94 + '\x22';
        }
        const _0x17fb8f = Array['from'](_0x0_0x2e6586['commands']['values']());
        let _0x50bc27 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x2fe73e of _0x17fb8f) {
            _0x50bc27 += '-\x20' + _0x2fe73e['command'];
            if (_0x2fe73e['aliases'] && _0x2fe73e['aliases']['length']) {
                _0x50bc27 += '\x20(alias:\x20' + _0x2fe73e['aliases']['join'](',\x20') + ')';
            }
            _0x50bc27 += ':\x20' + (_0x2fe73e['description'] || 'Pas\x20de\x20description');
            if (_0x2fe73e['usage']) {
                _0x50bc27 += '\x20[Utilisation:\x20' + _0x2fe73e['usage'] + ']';
            }
            _0x50bc27 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x50bc27 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x3d3b94 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x4f12e3) {
        const _0x3eff34 = _0x4f12e3['toLowerCase']();
        if (_0x0_0x2e6586 && _0x0_0x2e6586['commands']) {
            for (const [_0x56d28a, _0x4164b0] of _0x0_0x2e6586['commands']) {
                const _0xe1d316 = [
                    _0x56d28a,
                    ...(_0x4164b0['aliases'] || [])['map'](_0x54db6c => _0x54db6c['toLowerCase']())
                ];
                for (const _0x2a03c8 of _0xe1d316) {
                    if (_0x2a03c8['length'] < 0x3)
                        continue;
                    if (new RegExp('\x5cb' + _0x2a03c8['replace'](/[.*+?^${}()|[\]\\]/g, '\x5c$&') + '\x5cb', 'i')['test'](_0x3eff34)) {
                        return {
                            'isCommand': !![],
                            'command': _0x56d28a,
                            'args': this['extractArgs'](_0x4f12e3),
                            'confidence': 'medium',
                            'reason': 'Mot-clé\x20détecté\x20(commande\x20enregistrée):\x20' + _0x2a03c8
                        };
                    }
                }
            }
        }
        const _0xf94b2 = {
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
        let _0x337c69 = null;
        let _0x2768cd = 0x0;
        for (const [_0x18926c, _0x3d421c] of Object['entries'](_0xf94b2)) {
            let _0x38e217 = 0x0;
            for (const _0x5bbb02 of _0x3d421c) {
                if (_0x3eff34['includes'](_0x5bbb02)) {
                    _0x38e217 += _0x5bbb02['length'] / 0x5;
                }
            }
            if (_0x38e217 > _0x2768cd && _0x38e217 > 0x1) {
                _0x2768cd = _0x38e217;
                _0x337c69 = _0x18926c;
            }
        }
        if (_0x337c69 && _0x0_0x2e6586?.['commands']?.['has'](_0x337c69)) {
            const _0x110118 = this['extractArgs'](_0x4f12e3);
            return {
                'isCommand': !![],
                'command': _0x337c69,
                'args': _0x110118,
                'confidence': _0x2768cd > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x337c69
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x32b0dc) {
        const _0x38a8ad = [];
        const _0x140fc9 = _0x32b0dc['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x140fc9)
            _0x38a8ad['push'](..._0x140fc9);
        const _0x677a9e = _0x32b0dc['match'](/\d+/g);
        if (_0x677a9e)
            _0x38a8ad['push'](..._0x677a9e);
        const _0x3ee790 = _0x32b0dc['match'](/"([^"]*)"/g);
        if (_0x3ee790)
            _0x38a8ad['push'](..._0x3ee790['map'](_0x3117b3 => _0x3117b3['replace'](/"/g, '')));
        const _0x25c458 = _0x32b0dc['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x25c458 && _0x25c458[0x1]) {
            _0x38a8ad['push'](_0x25c458[0x1]['trim']());
        }
        return _0x38a8ad;
    }
    ['findSimilarCommand'](_0xe88ccf) {
        if (!_0x0_0x2e6586 || !_0x0_0x2e6586['commands'])
            return null;
        const _0xa25338 = Array['from'](_0x0_0x2e6586['commands']['keys']());
        const _0x450ee7 = _0xa25338['filter'](_0x5756fa => _0x5756fa['includes'](_0xe88ccf) || _0xe88ccf['includes'](_0x5756fa) || this['levenshteinDistance'](_0x5756fa, _0xe88ccf) < 0x3);
        return _0x450ee7[0x0] || null;
    }
    ['levenshteinDistance'](_0x1957bc, _0x2a4fa9) {
        const _0x47ede3 = [];
        for (let _0x288232 = 0x0; _0x288232 <= _0x2a4fa9['length']; _0x288232++) {
            _0x47ede3[_0x288232] = [_0x288232];
        }
        for (let _0x4f9481 = 0x0; _0x4f9481 <= _0x1957bc['length']; _0x4f9481++) {
            _0x47ede3[0x0][_0x4f9481] = _0x4f9481;
        }
        for (let _0x2a0a26 = 0x1; _0x2a0a26 <= _0x2a4fa9['length']; _0x2a0a26++) {
            for (let _0x25b705 = 0x1; _0x25b705 <= _0x1957bc['length']; _0x25b705++) {
                if (_0x2a4fa9[_0x2a0a26 - 0x1] === _0x1957bc[_0x25b705 - 0x1]) {
                    _0x47ede3[_0x2a0a26][_0x25b705] = _0x47ede3[_0x2a0a26 - 0x1][_0x25b705 - 0x1];
                } else {
                    _0x47ede3[_0x2a0a26][_0x25b705] = Math['min'](_0x47ede3[_0x2a0a26 - 0x1][_0x25b705 - 0x1] + 0x1, _0x47ede3[_0x2a0a26][_0x25b705 - 0x1] + 0x1, _0x47ede3[_0x2a0a26 - 0x1][_0x25b705] + 0x1);
                }
            }
        }
        return _0x47ede3[_0x2a4fa9['length']][_0x1957bc['length']];
    }
    async ['executeCommand'](_0x5d90f3, _0x1cb0a3, _0x29a2c5, _0xf56c1e, _0x5a910b) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x5d90f3, _0x1cb0a3);
            if (!_0x0_0x2e6586 || !_0x0_0x2e6586['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0x510bd3 = _0x0_0x2e6586['commands']['get'](_0x5d90f3);
            if (!_0x510bd3) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x4fb73d = _0x5a910b['isOwnerOrSudo'] || ![];
            const _0x3fa5d2 = _0x5a910b['isFromMe'] || ![];
            const _0x301089 = _0x29a2c5['endsWith']('@g.us');
            if (_0x510bd3['ownerOnly'] && !_0x4fb73d && !_0x3fa5d2) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x510bd3['groupOnly'] && !_0x301089) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x102e25 = this['_validateArgsAgainstUsage'](_0x510bd3, _0x1cb0a3);
            if (!_0x102e25['valid']) {
                return {
                    'success': ![],
                    'error': _0x102e25['message']
                };
            }
            const _0x488307 = {
                'key': {
                    'remoteJid': _0x29a2c5,
                    'participant': _0xf56c1e
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x5d90f3 + '\x20' + _0x1cb0a3['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x5a910b['pushName'] || 'User'
            };
            await _0x510bd3['handler'](_0x5a910b['sock'], _0x488307, _0x1cb0a3, {
                'chatId': _0x29a2c5,
                'senderId': _0xf56c1e,
                'isGroup': _0x301089,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x5d90f3 + '\x20' + _0x1cb0a3['join']('\x20'),
                'messageText': _0x5d90f3 + '\x20' + _0x1cb0a3['join']('\x20'),
                'userMessage': _0x5d90f3 + '\x20' + _0x1cb0a3['join']('\x20'),
                'config': _0x0_0x5b1fea
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x5d90f3 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x1c401d) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x1c401d);
            return {
                'success': ![],
                'error': _0x1c401d['message']
            };
        }
    }
    ['_parseUsageTokens'](_0x48ce44) {
        if (!_0x48ce44 || typeof _0x48ce44 !== 'string')
            return [];
        const _0x5a58b7 = [];
        const _0x5f530a = /<([^<>]+)>|\[([^\[\]]+)\]/g;
        let _0xa1151e;
        while ((_0xa1151e = _0x5f530a['exec'](_0x48ce44)) !== null) {
            const required = _0xa1151e[0x1] !== undefined;
            const _0x17b862 = (_0xa1151e[0x1] ?? _0xa1151e[0x2])['trim']();
            const _0x369994 = _0x17b862['includes']('|') ? _0x17b862['split']('|')['map'](_0x2ac0d7 => _0x2ac0d7['trim']()['toLowerCase']())['filter'](Boolean) : null;
            _0x5a58b7['push']({
                'required': required,
                'content': _0x17b862,
                'alternatives': _0x369994
            });
        }
        return _0x5a58b7;
    }
    ['_validateArgsAgainstUsage'](_0x4d5837, _0x591fd0) {
        const _0x390c61 = this['_parseUsageTokens'](_0x4d5837['usage']);
        if (_0x390c61['length'] === 0x0) {
            return { 'valid': !![] };
        }
        const requiredCount = _0x390c61['filter'](_0x1334fb => _0x1334fb['required'])['length'];
        if (_0x591fd0['length'] < requiredCount) {
            return {
                'valid': ![],
                'message': 'Arguments\x20manquants.\x20Utilisation\x20:\x20`' + _0x4d5837['usage'] + '`'
            };
        }
        for (let _0x276ccc = 0x0; _0x276ccc < _0x390c61['length']; _0x276ccc++) {
            const _0xf8a388 = _0x390c61[_0x276ccc];
            if (!_0xf8a388['alternatives'])
                continue;
            const _0x5c757d = _0x591fd0[_0x276ccc];
            if (_0x5c757d === undefined) {
                if (_0xf8a388['required']) {
                    return {
                        'valid': ![],
                        'message': 'Arguments\x20manquants.\x20Utilisation\x20:\x20`' + _0x4d5837['usage'] + '`'
                    };
                }
                continue;
            }
            if (!_0xf8a388['alternatives']['includes'](String(_0x5c757d)['toLowerCase']())) {
                return {
                    'valid': ![],
                    'message': 'Argument\x20invalide\x20:\x20\x22' + _0x5c757d + '\x22.\x20Valeurs\x20acceptées\x20:\x20' + _0xf8a388['alternatives']['join'](',\x20') + '.\x0aUtilisation\x20:\x20`' + _0x4d5837['usage'] + '`'
                };
            }
        }
        return { 'valid': !![] };
    }
    async ['generateNaturalResponse'](_0xa3037d, _0x3da7c3, _0x213ad0) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0xa3037d);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x57d1f4 = this['buildConversationContext'](_0xa3037d, _0x3da7c3);
            console['log']('📝\x20Context\x20built,\x20length:', _0x57d1f4['length']);
            const _0x4f3a96 = this['config']['provider'] || 'customai';
            const _0x8fe872 = this['providers'][_0x4f3a96];
            if (!_0x8fe872) {
                console['error']('❌\x20Provider\x20' + _0x4f3a96 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x4f3a96);
            const _0x3d721b = await this['_callWithTimeout'](() => _0x8fe872(_0xa3037d, _0x57d1f4, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x3d721b);
            const _0x176169 = this['cleanResponse'](_0x3d721b);
            this['addToHistory'](_0x3da7c3, _0xa3037d, _0x176169);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x176169);
            return _0x176169 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x32ed0b) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x32ed0b);
            console['error']('❌\x20Stack\x20trace:', _0x32ed0b['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x476384, _0x42eb33) {
        let _0x3cb406 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x3cb406 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x5f32d7 = this['getHistory'](_0x42eb33);
        if (_0x5f32d7 && _0x5f32d7['length'] > 0x0) {
            _0x3cb406 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x5f32d7['join']('\x0a');
        }
        _0x3cb406 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x476384 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x3cb406;
    }
    async ['_callCustomAI'](_0x24f158, _0x2f1135, _0x586eb1) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x24f158);
        try {
            const _0xa396f = await askAI(_0x24f158);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0xa396f) || this['config']['fallbackResponse'];
        } catch (_0x29f06d) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x29f06d['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x35bf63, _0x11bd5f, _0x38f296) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x35bf63);
        const _0x285df6 = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x7a1a3f = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x50baee = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x7a1a3f) {
            _0x50baee['Authorization'] = 'Bearer\x20' + _0x7a1a3f;
        }
        const _0x11e587 = [];
        if (typeof _0x11bd5f === 'string' && _0x11bd5f['trim']()) {
            _0x11e587['push']({
                'role': 'system',
                'content': _0x11bd5f
            });
        }
        _0x11e587['push']({
            'role': 'user',
            'content': _0x35bf63
        });
        try {
            const _0x500e68 = {
                'model': this['config']['pollinationsModel'] || 'openai',
                'messages': _0x11e587,
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x38f296?.['isCommandDetection']) {
                _0x500e68['response_format'] = { 'type': 'json_object' };
            }
            const _0x492338 = await _0x0_0x1420fd(_0x285df6, {
                'method': 'POST',
                'headers': _0x50baee,
                'body': JSON['stringify'](_0x500e68)
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x492338['status']);
            if (!_0x492338['ok']) {
                const _0x3571c3 = await _0x492338['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x3571c3);
                if (_0x492338['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0x492338['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20customai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x11b3d = await _0x492338['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x55ae0b = _0x11b3d['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x55ae0b);
            return this['cleanResponse'](_0x55ae0b) || this['config']['fallbackResponse'];
        } catch (_0x519ba1) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x519ba1['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x16469e, _0x478259, _0x25478f) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x16469e);
        const _0xd17d93 = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0xd17d93) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x5b47f6} = await import('openai');
            const _0x5c575e = new _0x5b47f6({
                'apiKey': _0xd17d93,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x44cee2 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x44cee2);
            const _0x47c7af = {
                'model': _0x44cee2,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x478259 || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x16469e
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x25478f?.['isCommandDetection']) {
                _0x47c7af['response_format'] = { 'type': 'json_object' };
            }
            const _0x5549ae = await _0x5c575e['chat']['completions']['create'](_0x47c7af);
            const _0x46be6f = _0x5549ae['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x46be6f) || this['config']['fallbackResponse'];
        } catch (_0xd76eed) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0xd76eed['message']);
            if (_0xd76eed['status'] === 0x191 || _0xd76eed['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0xd76eed['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x5bf8f9, _0x102560, _0x1c59fc) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x5bf8f9);
        const _0x5254d7 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x5254d7) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x366000} = await import('@google/genai');
            const _0x51d50a = new _0x366000({ 'apiKey': _0x5254d7 });
            const _0x1e0049 = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0x1e0049);
            const _0x41fabe = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x102560 === 'string' && _0x102560['trim']()) {
                _0x41fabe['systemInstruction'] = _0x102560;
            }
            if (_0x1c59fc?.['isCommandDetection']) {
                _0x41fabe['responseMimeType'] = 'application/json';
                _0x41fabe['responseSchema'] = {
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
            const _0x475363 = await this['_retryOnTransientError'](() => _0x51d50a['models']['generateContent']({
                'model': _0x1e0049,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x5bf8f9 }]
                    }],
                'config': _0x41fabe
            }), {
                'retries': 0x2,
                'baseDelayMs': 0x320
            });
            const _0x2a9472 = _0x475363['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x2a9472) || this['config']['fallbackResponse'];
        } catch (_0x37b237) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x37b237['message']);
            if (_0x37b237['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0x37b237['message']?.['includes']('not\x20enabled') || _0x37b237['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x37b237['message']?.['includes']('RESOURCE_EXHAUSTED') || _0x37b237['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            if (_0x37b237['message']?.['includes']('UNAVAILABLE') || _0x37b237['message']?.['includes']('503')) {
                return '❌\x20Gemini\x20est\x20surchargé\x20en\x20ce\x20moment\x20(503).\x20J\x27ai\x20réessayé\x20automatiquement\x20sans\x20succès\x20—\x20réessayez\x20dans\x20un\x20instant.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x1b565f, _0x1f09f8, _0x426250) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x1b565f);
        const _0x29b969 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x29b969) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x4f783a = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0xe51416 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x5a3df2 = await _0x0_0x1420fd(_0x4f783a, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x29b969
                },
                'body': JSON['stringify']({
                    'model': _0xe51416,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x1f09f8
                        },
                        {
                            'role': 'user',
                            'content': _0x1b565f
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x5a3df2['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x5a3df2['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x993b3e = await _0x5a3df2['json']();
            const _0x3a57fc = _0x993b3e['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x3a57fc) || this['config']['fallbackResponse'];
        } catch (_0x15d090) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x15d090['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x19c524, _0x158942, _0x74bb0a) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x19c524);
        const _0x38a927 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x38a927) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x3643a3} = await import('openai');
            const _0xbca36e = new _0x3643a3({ 'apiKey': _0x38a927 });
            const _0xbf4410 = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0xbf4410);
            const _0x5ba938 = {
                'model': _0xbf4410,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x158942 || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x19c524
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x74bb0a?.['isCommandDetection']) {
                _0x5ba938['response_format'] = { 'type': 'json_object' };
            }
            const _0x5d0933 = await _0xbca36e['chat']['completions']['create'](_0x5ba938);
            const _0x87c3af = _0x5d0933['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x87c3af) || this['config']['fallbackResponse'];
        } catch (_0x3eb77e) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x3eb77e['message']);
            if (_0x3eb77e['status'] === 0x191 || _0x3eb77e['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x3eb77e['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x2c237b, _0x2fb906, _0x35254a) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x2c237b);
        const _0x5dea80 = this['config']['apiUrl'];
        if (!_0x5dea80) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x54d9df = await _0x0_0x1420fd(_0x5dea80, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x2c237b,
                    'context': _0x2fb906,
                    'metadata': _0x35254a
                })
            });
            if (!_0x54d9df['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x54d9df['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x5b6465 = await _0x54d9df['json']();
            const _0x3d5c67 = _0x5b6465['response'] || _0x5b6465['reply'] || _0x5b6465['text'] || _0x5b6465['result'];
            return this['cleanResponse'](_0x3d5c67) || this['config']['fallbackResponse'];
        } catch (_0x2d3a05) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x2d3a05['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x58073a) {
        const _0x590ed0 = 'Nova';
        const _0x114f16 = [
            new RegExp('^' + _0x590ed0 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x590ed0 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x590ed0 + ',?\x5cs+', 'i')
        ];
        let _0x317d93 = _0x58073a;
        for (const _0x4a1217 of _0x114f16) {
            _0x317d93 = _0x317d93['replace'](_0x4a1217, '')['trim']();
        }
        return _0x317d93;
    }
    ['cleanResponse'](_0x2c5d2f) {
        if (!_0x2c5d2f)
            return null;
        let _0x2461ea = _0x2c5d2f['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x2461ea['length'] > 0x7d0) {
            _0x2461ea = _0x2461ea['slice'](0x0, 0x7d0) + '...';
        }
        return _0x2461ea;
    }
    ['getHistory'](_0x54f704) {
        const _0x161150 = this['history']['get'](_0x54f704) || [];
        const _0xdb10d6 = this['config']['maxHistory'] || 0xf;
        return _0x161150['slice'](-_0xdb10d6);
    }
    ['addToHistory'](_0x3014e7, _0x363cec, _0x482d60) {
        if (!this['history']['has'](_0x3014e7)) {
            this['history']['set'](_0x3014e7, []);
        }
        const _0x337bc0 = this['history']['get'](_0x3014e7);
        _0x337bc0['push']('User:\x20' + _0x363cec);
        _0x337bc0['push']('Nova:\x20' + _0x482d60);
        const _0x74bcac = this['config']['maxHistory'] || 0xf;
        if (_0x337bc0['length'] > _0x74bcac * 0x2) {
            this['history']['set'](_0x3014e7, _0x337bc0['slice'](-_0x74bcac * 0x2));
        }
    }
    ['clearHistory'](_0xa88c3c) {
        if (_0xa88c3c) {
            this['history']['delete'](_0xa88c3c);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x24f30a, _0x327757) {
        if (_0x24f30a) {
            this['contextCache']['set'](_0x24f30a, _0x327757);
        } else {
            this['config']['customContext'] = _0x327757;
            _0x0_0x538288['set']('customContext', _0x327757);
        }
    }
    ['getContext'](_0x36e576) {
        return this['contextCache']['get'](_0x36e576) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x165035, _0x15ec37) {
        return new Promise((_0x3590fe, _0xb8e24a) => {
            const _0x15d1c0 = setTimeout(() => {
                _0xb8e24a(new Error('Request\x20timeout\x20after\x20' + _0x15ec37 + 'ms'));
            }, _0x15ec37);
            _0x165035()['then'](_0x3b3642 => {
                clearTimeout(_0x15d1c0);
                _0x3590fe(_0x3b3642);
            })['catch'](_0x1b041b => {
                clearTimeout(_0x15d1c0);
                _0xb8e24a(_0x1b041b);
            });
        });
    }
    async ['_retryOnTransientError'](_0x2854c9, {
        retries: retries = 0x2,
        baseDelayMs: baseDelayMs = 0x320
    } = {}) {
        let _0x3ec42f;
        for (let _0x122852 = 0x0; _0x122852 <= retries; _0x122852++) {
            try {
                return await _0x2854c9();
            } catch (_0x53c35a) {
                _0x3ec42f = _0x53c35a;
                const _0x58c6f9 = _0x53c35a?.['message'] || '';
                const _0x5142d9 = _0x58c6f9['includes']('UNAVAILABLE') || _0x58c6f9['includes']('503') || _0x58c6f9['includes']('RESOURCE_EXHAUSTED') || _0x58c6f9['includes']('429');
                if (!_0x5142d9 || _0x122852 === retries) {
                    throw _0x53c35a;
                }
                const _0x506d0a = baseDelayMs * Math['pow'](0x2, _0x122852);
                console['warn']('⚠️\x20Transient\x20error,\x20retry\x20' + (_0x122852 + 0x1) + '/' + retries + '\x20in\x20' + _0x506d0a + 'ms:', _0x58c6f9);
                await new Promise(_0x25c3a6 => setTimeout(_0x25c3a6, _0x506d0a));
            }
        }
        throw _0x3ec42f;
    }
}
export default new ChatbotService();