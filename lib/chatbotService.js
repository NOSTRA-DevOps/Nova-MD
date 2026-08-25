import _0x0_0x1283c5 from 'node-fetch';
import _0x0_0x423c1b from 'axios';
import _0x0_0x28bea4 from './chatbotConfig.js';
import * as _0x0_0x3404de from './commandHandler.js';
import _0x0_0x436656 from '../config.js';
import _0x0_0x17ffaa from 'dotenv';
_0x0_0x17ffaa['config']();
const AI_APIS = [
    _0x3c64f6 => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x3c64f6),
    _0x83da41 => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x83da41),
    _0x51aea3 => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x51aea3)
];
const askAI = async _0x1bb44a => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x1bb44a);
    for (const _0x4dac85 of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x4dac85(_0x1bb44a)['substring'](0x0, 0x32) + '...');
            const {data: _0x26fcd4} = await _0x0_0x423c1b['get'](_0x4dac85(_0x1bb44a), { 'timeout': 0x3a98 });
            const _0x47aa58 = _0x26fcd4?.['data']?.['response'];
            if (_0x47aa58 && typeof _0x47aa58 === 'string' && _0x47aa58['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x47aa58['trim']();
            }
        } catch (_0x299e8c) {
            console['log']('⚠️\x20API\x20failed:', _0x299e8c['message']);
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
        if (!_0x0_0x3404de || !_0x0_0x3404de['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x1404b8 = Array['from'](_0x0_0x3404de['commands']['values']());
            const _0x35ee2d = {};
            for (const _0x1d84bc of _0x1404b8) {
                const _0x582094 = _0x1d84bc['category'] || 'misc';
                if (!_0x35ee2d[_0x582094])
                    _0x35ee2d[_0x582094] = [];
                _0x35ee2d[_0x582094]['push']({
                    'name': _0x1d84bc['command'],
                    'description': _0x1d84bc['description'] || 'No\x20description',
                    'aliases': _0x1d84bc['aliases'] || [],
                    'usage': _0x1d84bc['usage'] || '.' + _0x1d84bc['command']
                });
            }
            let _0x1a75bc = '';
            for (const [_0x4da12d, _0x1b241f] of Object['entries'](_0x35ee2d)) {
                _0x1a75bc += '\x0a' + _0x4da12d['toUpperCase']() + ':\x0a';
                for (const _0x50188f of _0x1b241f) {
                    _0x1a75bc += '-\x20' + _0x50188f['name'] + ':\x20' + _0x50188f['description'];
                    if (_0x50188f['aliases']['length']) {
                        _0x1a75bc += '\x20(aliases:\x20' + _0x50188f['aliases']['join'](',\x20') + ')';
                    }
                    _0x1a75bc += '\x0a';
                }
            }
            return _0x1a75bc || 'No\x20commands\x20available';
        } catch (_0x1bd58a) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x1bd58a);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x28bea4['config'] || {
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
    async ['getResponse'](_0x41a0ea, _0x5e9e61, _0x332e64, _0x670c8b = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x41a0ea);
        console['log']('📝\x20Chat\x20ID:', _0x5e9e61);
        console['log']('📝\x20Sender\x20ID:', _0x332e64);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x271c50 = this['cleanMessage'](_0x41a0ea);
            console['log']('📝\x20Clean\x20message:', _0x271c50);
            if (!_0x271c50 || _0x271c50['length'] < 0x1) {
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
                const _0x104cab = await this['intelligentCommandDetection'](_0x271c50);
                if (_0x104cab && _0x104cab['isCommand'] && _0x104cab['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x104cab['command']);
                    const _0x4249ab = await this['executeCommand'](_0x104cab['command'], _0x104cab['args'] || [], _0x5e9e61, _0x332e64, _0x670c8b);
                    if (_0x4249ab['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x4249ab['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x4249ab['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x104cab['command'] + '`.\x20' + (_0x4249ab['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x2e2e7c = await this['generateNaturalResponse'](_0x271c50, _0x5e9e61, _0x332e64);
            console['log']('✅\x20Response\x20generated:', _0x2e2e7c);
            return _0x2e2e7c;
        } catch (_0x5f453f) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x5f453f);
            console['error']('❌\x20Stack\x20trace:', _0x5f453f['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20customai\x20avec\x20`.cbc\x20provider\x20customai`';
    }
    async ['intelligentCommandDetection'](_0x4a9ac3) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x4a9ac3);
        try {
            const _0x595a67 = this['buildCommandDetectionPrompt'](_0x4a9ac3);
            const _0x4de529 = this['config']['provider'] || 'customai';
            const _0x3d47a5 = this['providers'][_0x4de529];
            if (!_0x3d47a5) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x4a9ac3);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x4de529);
            const _0x356c92 = await this['_callWithTimeout'](() => _0x3d47a5(_0x595a67, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x356c92);
            const _0x15314b = this['_extractJson'](_0x356c92);
            if (_0x15314b) {
                try {
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x15314b);
                    if (_0x15314b['isCommand'] && _0x15314b['command']) {
                        if (_0x0_0x3404de && _0x0_0x3404de['commands'] && _0x0_0x3404de['commands']['has'](_0x15314b['command'])) {
                            return _0x15314b;
                        }
                        const _0x35f38f = this['findSimilarCommand'](_0x15314b['command']);
                        if (_0x35f38f && _0x0_0x3404de['commands'] && _0x0_0x3404de['commands']['has'](_0x35f38f)) {
                            _0x15314b['command'] = _0x35f38f;
                            _0x15314b['suggested'] = !![];
                            return _0x15314b;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x15314b;
                } catch (_0x299e39) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x299e39);
                }
            }
            return this['simpleKeywordDetection'](_0x4a9ac3);
        } catch (_0x1a5bfc) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x1a5bfc);
            return this['simpleKeywordDetection'](_0x4a9ac3);
        }
    }
    ['_extractJson'](_0x43c65b) {
        if (!_0x43c65b || typeof _0x43c65b !== 'string')
            return null;
        const _0x328605 = _0x43c65b['trim']();
        try {
            return JSON['parse'](_0x328605);
        } catch (_0x338888) {
        }
        const _0x2edcf1 = _0x328605['match'](/\{[\s\S]*\}/);
        if (_0x2edcf1) {
            try {
                return JSON['parse'](_0x2edcf1[0x0]);
            } catch (_0x59d1b5) {
                return null;
            }
        }
        return null;
    }
    ['buildCommandDetectionPrompt'](_0x2cb762) {
        if (!_0x0_0x3404de || !_0x0_0x3404de['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x2cb762 + '\x22';
        }
        const _0x2759bc = Array['from'](_0x0_0x3404de['commands']['values']());
        let _0x1086f2 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0xb59aeb of _0x2759bc) {
            _0x1086f2 += '-\x20' + _0xb59aeb['command'];
            if (_0xb59aeb['aliases'] && _0xb59aeb['aliases']['length']) {
                _0x1086f2 += '\x20(alias:\x20' + _0xb59aeb['aliases']['join'](',\x20') + ')';
            }
            _0x1086f2 += ':\x20' + (_0xb59aeb['description'] || 'Pas\x20de\x20description');
            if (_0xb59aeb['usage']) {
                _0x1086f2 += '\x20[Utilisation:\x20' + _0xb59aeb['usage'] + ']';
            }
            _0x1086f2 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x1086f2 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x2cb762 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20et\x20STRICTEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x2ff52c) {
        const _0x540bf4 = _0x2ff52c['toLowerCase']();
        if (_0x0_0x3404de && _0x0_0x3404de['commands']) {
            for (const [_0x38d774, _0x2a73d4] of _0x0_0x3404de['commands']) {
                const _0xf8ea8c = [
                    _0x38d774,
                    ...(_0x2a73d4['aliases'] || [])['map'](_0x111849 => _0x111849['toLowerCase']())
                ];
                for (const _0x124d2f of _0xf8ea8c) {
                    if (_0x124d2f['length'] < 0x3)
                        continue;
                    if (new RegExp('\x5cb' + _0x124d2f['replace'](/[.*+?^${}()|[\]\\]/g, '\x5c$&') + '\x5cb', 'i')['test'](_0x540bf4)) {
                        return {
                            'isCommand': !![],
                            'command': _0x38d774,
                            'args': this['extractArgs'](_0x2ff52c),
                            'confidence': 'medium',
                            'reason': 'Mot-clé\x20détecté\x20(commande\x20enregistrée):\x20' + _0x124d2f
                        };
                    }
                }
            }
        }
        const _0x169dbf = {
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
        let _0x3c1eb5 = null;
        let _0x2a4b86 = 0x0;
        for (const [_0x52012f, _0x8ac073] of Object['entries'](_0x169dbf)) {
            let _0x2c3b0d = 0x0;
            for (const _0x3ef692 of _0x8ac073) {
                if (_0x540bf4['includes'](_0x3ef692)) {
                    _0x2c3b0d += _0x3ef692['length'] / 0x5;
                }
            }
            if (_0x2c3b0d > _0x2a4b86 && _0x2c3b0d > 0x1) {
                _0x2a4b86 = _0x2c3b0d;
                _0x3c1eb5 = _0x52012f;
            }
        }
        if (_0x3c1eb5 && _0x0_0x3404de?.['commands']?.['has'](_0x3c1eb5)) {
            const _0x2cf31b = this['extractArgs'](_0x2ff52c);
            return {
                'isCommand': !![],
                'command': _0x3c1eb5,
                'args': _0x2cf31b,
                'confidence': _0x2a4b86 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x3c1eb5
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x518425) {
        const _0x5d64f6 = [];
        const _0x436e52 = _0x518425['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x436e52)
            _0x5d64f6['push'](..._0x436e52);
        const _0x1074be = _0x518425['match'](/\d+/g);
        if (_0x1074be)
            _0x5d64f6['push'](..._0x1074be);
        const _0x5b7834 = _0x518425['match'](/"([^"]*)"/g);
        if (_0x5b7834)
            _0x5d64f6['push'](..._0x5b7834['map'](_0x121b6e => _0x121b6e['replace'](/"/g, '')));
        const _0xea7b12 = _0x518425['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0xea7b12 && _0xea7b12[0x1]) {
            _0x5d64f6['push'](_0xea7b12[0x1]['trim']());
        }
        return _0x5d64f6;
    }
    ['findSimilarCommand'](_0x4cdf5b) {
        if (!_0x0_0x3404de || !_0x0_0x3404de['commands'])
            return null;
        const _0x441867 = Array['from'](_0x0_0x3404de['commands']['keys']());
        const _0x5d2aa0 = _0x441867['filter'](_0x2e59ce => _0x2e59ce['includes'](_0x4cdf5b) || _0x4cdf5b['includes'](_0x2e59ce) || this['levenshteinDistance'](_0x2e59ce, _0x4cdf5b) < 0x3);
        return _0x5d2aa0[0x0] || null;
    }
    ['levenshteinDistance'](_0x2d6d80, _0x81fdb3) {
        const _0x5cdd15 = [];
        for (let _0x1a00c5 = 0x0; _0x1a00c5 <= _0x81fdb3['length']; _0x1a00c5++) {
            _0x5cdd15[_0x1a00c5] = [_0x1a00c5];
        }
        for (let _0x54e973 = 0x0; _0x54e973 <= _0x2d6d80['length']; _0x54e973++) {
            _0x5cdd15[0x0][_0x54e973] = _0x54e973;
        }
        for (let _0x37a2f7 = 0x1; _0x37a2f7 <= _0x81fdb3['length']; _0x37a2f7++) {
            for (let _0x327764 = 0x1; _0x327764 <= _0x2d6d80['length']; _0x327764++) {
                if (_0x81fdb3[_0x37a2f7 - 0x1] === _0x2d6d80[_0x327764 - 0x1]) {
                    _0x5cdd15[_0x37a2f7][_0x327764] = _0x5cdd15[_0x37a2f7 - 0x1][_0x327764 - 0x1];
                } else {
                    _0x5cdd15[_0x37a2f7][_0x327764] = Math['min'](_0x5cdd15[_0x37a2f7 - 0x1][_0x327764 - 0x1] + 0x1, _0x5cdd15[_0x37a2f7][_0x327764 - 0x1] + 0x1, _0x5cdd15[_0x37a2f7 - 0x1][_0x327764] + 0x1);
                }
            }
        }
        return _0x5cdd15[_0x81fdb3['length']][_0x2d6d80['length']];
    }
    async ['executeCommand'](_0x17e24f, _0x4f3ec5, _0x340c59, _0x11e16e, _0x1f8037) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x17e24f, _0x4f3ec5);
            if (!_0x0_0x3404de || !_0x0_0x3404de['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0x4dacae = _0x0_0x3404de['commands']['get'](_0x17e24f);
            if (!_0x4dacae) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x363bd = _0x1f8037['isOwnerOrSudo'] || ![];
            const _0x295607 = _0x1f8037['isFromMe'] || ![];
            const _0x3b527b = _0x340c59['endsWith']('@g.us');
            if (_0x4dacae['ownerOnly'] && !_0x363bd && !_0x295607) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x4dacae['groupOnly'] && !_0x3b527b) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x514b46 = {
                'key': {
                    'remoteJid': _0x340c59,
                    'participant': _0x11e16e
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x17e24f + '\x20' + _0x4f3ec5['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x1f8037['pushName'] || 'User'
            };
            await _0x4dacae['handler'](_0x1f8037['sock'], _0x514b46, _0x4f3ec5, {
                'chatId': _0x340c59,
                'senderId': _0x11e16e,
                'isGroup': _0x3b527b,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x17e24f + '\x20' + _0x4f3ec5['join']('\x20'),
                'messageText': _0x17e24f + '\x20' + _0x4f3ec5['join']('\x20'),
                'userMessage': _0x17e24f + '\x20' + _0x4f3ec5['join']('\x20'),
                'config': _0x0_0x436656
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x17e24f + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x286c6d) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x286c6d);
            return {
                'success': ![],
                'error': _0x286c6d['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x1f1a46, _0x413d5f, _0xdf7b2c) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x1f1a46);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x266da7 = this['buildConversationContext'](_0x1f1a46, _0x413d5f);
            console['log']('📝\x20Context\x20built,\x20length:', _0x266da7['length']);
            const _0x21fd1f = this['config']['provider'] || 'customai';
            const _0x43daf2 = this['providers'][_0x21fd1f];
            if (!_0x43daf2) {
                console['error']('❌\x20Provider\x20' + _0x21fd1f + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x21fd1f);
            const _0x3aeec1 = await this['_callWithTimeout'](() => _0x43daf2(_0x1f1a46, _0x266da7, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x3aeec1);
            const _0x5edf1b = this['cleanResponse'](_0x3aeec1);
            this['addToHistory'](_0x413d5f, _0x1f1a46, _0x5edf1b);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x5edf1b);
            return _0x5edf1b || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x4cc867) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x4cc867);
            console['error']('❌\x20Stack\x20trace:', _0x4cc867['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x5f23b5, _0x3f2ece) {
        let _0x20c555 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x20c555 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x20c70f = this['getHistory'](_0x3f2ece);
        if (_0x20c70f && _0x20c70f['length'] > 0x0) {
            _0x20c555 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x20c70f['join']('\x0a');
        }
        _0x20c555 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x5f23b5 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x20c555;
    }
    async ['_callCustomAI'](_0x3cef39, _0x55fb6a, _0x305992) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x3cef39);
        try {
            const _0x468886 = await askAI(_0x3cef39);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0x468886) || this['config']['fallbackResponse'];
        } catch (_0xd8b421) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0xd8b421['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x55e8f0, _0x5cecac, _0xf9b12b) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x55e8f0);
        const _0x3962d3 = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x1c4e33 = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x455b40 = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x1c4e33) {
            _0x455b40['Authorization'] = 'Bearer\x20' + _0x1c4e33;
        }
        const _0x55a529 = [];
        if (typeof _0x5cecac === 'string' && _0x5cecac['trim']()) {
            _0x55a529['push']({
                'role': 'system',
                'content': _0x5cecac
            });
        }
        _0x55a529['push']({
            'role': 'user',
            'content': _0x55e8f0
        });
        try {
            const _0x4e3690 = {
                'model': this['config']['pollinationsModel'] || 'openai',
                'messages': _0x55a529,
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0xf9b12b?.['isCommandDetection']) {
                _0x4e3690['response_format'] = { 'type': 'json_object' };
            }
            const _0x5da65a = await _0x0_0x1283c5(_0x3962d3, {
                'method': 'POST',
                'headers': _0x455b40,
                'body': JSON['stringify'](_0x4e3690)
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x5da65a['status']);
            if (!_0x5da65a['ok']) {
                const _0x479162 = await _0x5da65a['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x479162);
                if (_0x5da65a['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0x5da65a['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20customai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x11a7c = await _0x5da65a['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x105a5a = _0x11a7c['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x105a5a);
            return this['cleanResponse'](_0x105a5a) || this['config']['fallbackResponse'];
        } catch (_0x313053) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x313053['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x4f79aa, _0x55bf04, _0x1bea4e) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x4f79aa);
        const _0x2cc0e5 = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x2cc0e5) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x370320} = await import('openai');
            const _0x22b752 = new _0x370320({
                'apiKey': _0x2cc0e5,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x264999 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x264999);
            const _0x2b5a84 = {
                'model': _0x264999,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x55bf04 || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x4f79aa
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x1bea4e?.['isCommandDetection']) {
                _0x2b5a84['response_format'] = { 'type': 'json_object' };
            }
            const _0x364d40 = await _0x22b752['chat']['completions']['create'](_0x2b5a84);
            const _0x3f324f = _0x364d40['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x3f324f) || this['config']['fallbackResponse'];
        } catch (_0x49df64) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x49df64['message']);
            if (_0x49df64['status'] === 0x191 || _0x49df64['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x49df64['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x158b6b, _0x53f1bf, _0x4fadfa) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x158b6b);
        const _0x1bb3be = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x1bb3be) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x8a801e} = await import('@google/genai');
            const _0x65d695 = new _0x8a801e({ 'apiKey': _0x1bb3be });
            const _0x239ca4 = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0x239ca4);
            const _0x2fd857 = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x53f1bf === 'string' && _0x53f1bf['trim']()) {
                _0x2fd857['systemInstruction'] = _0x53f1bf;
            }
            if (_0x4fadfa?.['isCommandDetection']) {
                _0x2fd857['responseMimeType'] = 'application/json';
            }
            const _0x2fd97d = await this['_retryOnTransientError'](() => _0x65d695['models']['generateContent']({
                'model': _0x239ca4,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x158b6b }]
                    }],
                'config': _0x2fd857
            }), {
                'retries': 0x2,
                'baseDelayMs': 0x320
            });
            const _0x183bdb = _0x2fd97d['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x183bdb) || this['config']['fallbackResponse'];
        } catch (_0x268f18) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x268f18['message']);
            if (_0x268f18['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0x268f18['message']?.['includes']('not\x20enabled') || _0x268f18['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x268f18['message']?.['includes']('RESOURCE_EXHAUSTED') || _0x268f18['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            if (_0x268f18['message']?.['includes']('UNAVAILABLE') || _0x268f18['message']?.['includes']('503')) {
                return '❌\x20Gemini\x20est\x20surchargé\x20en\x20ce\x20moment\x20(503).\x20J\x27ai\x20réessayé\x20automatiquement\x20sans\x20succès\x20—\x20réessayez\x20dans\x20un\x20instant.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x3d8813, _0x2f80fb, _0x5a32f0) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x3d8813);
        const _0x2a3b19 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x2a3b19) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x5aaab1 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x55d249 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x5a8c17 = await _0x0_0x1283c5(_0x5aaab1, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x2a3b19
                },
                'body': JSON['stringify']({
                    'model': _0x55d249,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x2f80fb
                        },
                        {
                            'role': 'user',
                            'content': _0x3d8813
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x5a8c17['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x5a8c17['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x165e4b = await _0x5a8c17['json']();
            const _0x805654 = _0x165e4b['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x805654) || this['config']['fallbackResponse'];
        } catch (_0x4483da) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x4483da['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x509e16, _0x9b057a, _0x3a2549) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x509e16);
        const _0x17c26f = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x17c26f) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x527de5} = await import('openai');
            const _0x223155 = new _0x527de5({ 'apiKey': _0x17c26f });
            const _0x42359c = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0x42359c);
            const _0x469bda = {
                'model': _0x42359c,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x9b057a || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x509e16
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x3a2549?.['isCommandDetection']) {
                _0x469bda['response_format'] = { 'type': 'json_object' };
            }
            const _0x2d7a36 = await _0x223155['chat']['completions']['create'](_0x469bda);
            const _0x1515a4 = _0x2d7a36['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x1515a4) || this['config']['fallbackResponse'];
        } catch (_0x499fba) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x499fba['message']);
            if (_0x499fba['status'] === 0x191 || _0x499fba['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x499fba['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x3eb2f8, _0x4912ec, _0x40fb45) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x3eb2f8);
        const _0x2a696c = this['config']['apiUrl'];
        if (!_0x2a696c) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x5c1795 = await _0x0_0x1283c5(_0x2a696c, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x3eb2f8,
                    'context': _0x4912ec,
                    'metadata': _0x40fb45
                })
            });
            if (!_0x5c1795['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x5c1795['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x5bd8d1 = await _0x5c1795['json']();
            const _0x5446f5 = _0x5bd8d1['response'] || _0x5bd8d1['reply'] || _0x5bd8d1['text'] || _0x5bd8d1['result'];
            return this['cleanResponse'](_0x5446f5) || this['config']['fallbackResponse'];
        } catch (_0x4446e9) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x4446e9['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x3eddaa) {
        const _0x2a2d54 = 'Nova';
        const _0xa8e6d2 = [
            new RegExp('^' + _0x2a2d54 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x2a2d54 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x2a2d54 + ',?\x5cs+', 'i')
        ];
        let _0x516567 = _0x3eddaa;
        for (const _0x41d764 of _0xa8e6d2) {
            _0x516567 = _0x516567['replace'](_0x41d764, '')['trim']();
        }
        return _0x516567;
    }
    ['cleanResponse'](_0x51e29a) {
        if (!_0x51e29a)
            return null;
        let _0x4bdecf = _0x51e29a['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x4bdecf['length'] > 0x7d0) {
            _0x4bdecf = _0x4bdecf['slice'](0x0, 0x7d0) + '...';
        }
        return _0x4bdecf;
    }
    ['getHistory'](_0x4a4fb7) {
        const _0x19d045 = this['history']['get'](_0x4a4fb7) || [];
        const _0x3934e6 = this['config']['maxHistory'] || 0xf;
        return _0x19d045['slice'](-_0x3934e6);
    }
    ['addToHistory'](_0x411132, _0x415020, _0x4d1075) {
        if (!this['history']['has'](_0x411132)) {
            this['history']['set'](_0x411132, []);
        }
        const _0x337966 = this['history']['get'](_0x411132);
        _0x337966['push']('User:\x20' + _0x415020);
        _0x337966['push']('Nova:\x20' + _0x4d1075);
        const _0x21c6c3 = this['config']['maxHistory'] || 0xf;
        if (_0x337966['length'] > _0x21c6c3 * 0x2) {
            this['history']['set'](_0x411132, _0x337966['slice'](-_0x21c6c3 * 0x2));
        }
    }
    ['clearHistory'](_0x434ad3) {
        if (_0x434ad3) {
            this['history']['delete'](_0x434ad3);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x3ad78b, _0x3786c6) {
        if (_0x3ad78b) {
            this['contextCache']['set'](_0x3ad78b, _0x3786c6);
        } else {
            this['config']['customContext'] = _0x3786c6;
            _0x0_0x28bea4['set']('customContext', _0x3786c6);
        }
    }
    ['getContext'](_0x10ff53) {
        return this['contextCache']['get'](_0x10ff53) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x3653e0, _0x47568b) {
        return new Promise((_0x34c54e, _0x265477) => {
            const _0x5cbfbc = setTimeout(() => {
                _0x265477(new Error('Request\x20timeout\x20after\x20' + _0x47568b + 'ms'));
            }, _0x47568b);
            _0x3653e0()['then'](_0x2fa197 => {
                clearTimeout(_0x5cbfbc);
                _0x34c54e(_0x2fa197);
            })['catch'](_0x8150c => {
                clearTimeout(_0x5cbfbc);
                _0x265477(_0x8150c);
            });
        });
    }
    async ['_retryOnTransientError'](_0x496715, {
        retries: retries = 0x2,
        baseDelayMs: baseDelayMs = 0x320
    } = {}) {
        let _0x1e7ffc;
        for (let _0x20d3e2 = 0x0; _0x20d3e2 <= retries; _0x20d3e2++) {
            try {
                return await _0x496715();
            } catch (_0x4c3168) {
                _0x1e7ffc = _0x4c3168;
                const _0x1ae29a = _0x4c3168?.['message'] || '';
                const _0x3fac36 = _0x1ae29a['includes']('UNAVAILABLE') || _0x1ae29a['includes']('503') || _0x1ae29a['includes']('RESOURCE_EXHAUSTED') || _0x1ae29a['includes']('429');
                if (!_0x3fac36 || _0x20d3e2 === retries) {
                    throw _0x4c3168;
                }
                const _0x170b4e = baseDelayMs * Math['pow'](0x2, _0x20d3e2);
                console['warn']('⚠️\x20Transient\x20error,\x20retry\x20' + (_0x20d3e2 + 0x1) + '/' + retries + '\x20in\x20' + _0x170b4e + 'ms:', _0x1ae29a);
                await new Promise(_0x51b0e3 => setTimeout(_0x51b0e3, _0x170b4e));
            }
        }
        throw _0x1e7ffc;
    }
}
export default new ChatbotService();