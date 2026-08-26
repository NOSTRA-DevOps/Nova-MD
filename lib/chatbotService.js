import _0x0_0x21a9ac from 'node-fetch';
import _0x0_0x4deada from 'axios';
import _0x0_0x32c6ff from './chatbotConfig.js';
import * as _0x0_0x54058f from './commandHandler.js';
import _0x0_0x7ec3ec from '../config.js';
import _0x0_0x4ca984 from 'dotenv';
_0x0_0x4ca984['config']();
const AI_APIS = [
    _0x2afabb => 'https://mistral.stacktoy.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x2afabb),
    _0x3fc19e => 'https://llama.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x3fc19e),
    _0x4fcb73 => 'https://mistral.gtech-apiz.workers.dev/?apikey=Suhail&text=' + encodeURIComponent(_0x4fcb73)
];
const askAI = async _0x54dad7 => {
    console['log']('🤖\x20Asking\x20AI\x20with\x20query:', _0x54dad7);
    for (const _0x169931 of AI_APIS) {
        try {
            console['log']('📡\x20Trying\x20API:', _0x169931(_0x54dad7)['substring'](0x0, 0x32) + '...');
            const {data: _0x215bec} = await _0x0_0x4deada['get'](_0x169931(_0x54dad7), { 'timeout': 0x3a98 });
            const _0x3f569d = _0x215bec?.['data']?.['response'];
            if (_0x3f569d && typeof _0x3f569d === 'string' && _0x3f569d['trim']()) {
                console['log']('✅\x20AI\x20response\x20received');
                return _0x3f569d['trim']();
            }
        } catch (_0x38d355) {
            console['log']('⚠️\x20API\x20failed:', _0x38d355['message']);
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
        if (!_0x0_0x54058f || !_0x0_0x54058f['commands']) {
            console['log']('⚠️\x20No\x20commands\x20available');
            return 'No\x20commands\x20loaded';
        }
        try {
            const _0x578490 = Array['from'](_0x0_0x54058f['commands']['values']());
            const _0xc86e = {};
            for (const _0x47d8b5 of _0x578490) {
                const _0x14ba40 = _0x47d8b5['category'] || 'misc';
                if (!_0xc86e[_0x14ba40])
                    _0xc86e[_0x14ba40] = [];
                _0xc86e[_0x14ba40]['push']({
                    'name': _0x47d8b5['command'],
                    'description': _0x47d8b5['description'] || 'No\x20description',
                    'aliases': _0x47d8b5['aliases'] || [],
                    'usage': _0x47d8b5['usage'] || '.' + _0x47d8b5['command']
                });
            }
            let _0x1c397e = '';
            for (const [_0x42697b, _0x2d5d74] of Object['entries'](_0xc86e)) {
                _0x1c397e += '\x0a' + _0x42697b['toUpperCase']() + ':\x0a';
                for (const _0x82e392 of _0x2d5d74) {
                    _0x1c397e += '-\x20' + _0x82e392['name'] + ':\x20' + _0x82e392['description'];
                    if (_0x82e392['aliases']['length']) {
                        _0x1c397e += '\x20(aliases:\x20' + _0x82e392['aliases']['join'](',\x20') + ')';
                    }
                    _0x1c397e += '\x0a';
                }
            }
            return _0x1c397e || 'No\x20commands\x20available';
        } catch (_0x5dbfff) {
            console['error']('❌\x20Error\x20getting\x20commands\x20list:', _0x5dbfff);
            return 'Commands\x20list\x20unavailable';
        }
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x32c6ff['config'] || {
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
    async ['getResponse'](_0x664e21, _0x29109e, _0x50fdc8, _0x345393 = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x664e21);
        console['log']('📝\x20Chat\x20ID:', _0x29109e);
        console['log']('📝\x20Sender\x20ID:', _0x50fdc8);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x1a5100 = this['cleanMessage'](_0x664e21);
            console['log']('📝\x20Clean\x20message:', _0x1a5100);
            if (!_0x1a5100 || _0x1a5100['length'] < 0x1) {
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
                const _0x3f2637 = await this['intelligentCommandDetection'](_0x1a5100);
                if (_0x3f2637 && _0x3f2637['isCommand'] && _0x3f2637['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x3f2637['command']);
                    const _0x36aafe = await this['executeCommand'](_0x3f2637['command'], _0x3f2637['args'] || [], _0x29109e, _0x50fdc8, _0x345393);
                    if (_0x36aafe['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x36aafe['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x36aafe['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x3f2637['command'] + '`.\x20' + (_0x36aafe['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x2b1f61 = await this['generateNaturalResponse'](_0x1a5100, _0x29109e, _0x50fdc8);
            console['log']('✅\x20Response\x20generated:', _0x2b1f61);
            return _0x2b1f61;
        } catch (_0x2c7e67) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x2c7e67);
            console['error']('❌\x20Stack\x20trace:', _0x2c7e67['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20customai\x20avec\x20`.cbc\x20provider\x20customai`';
    }
    async ['intelligentCommandDetection'](_0x1bf0fb) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x1bf0fb);
        try {
            const _0x47bc53 = this['buildCommandDetectionPrompt'](_0x1bf0fb);
            const _0x2ddcb8 = this['config']['provider'] || 'customai';
            const _0x4fc8b0 = this['providers'][_0x2ddcb8];
            if (!_0x4fc8b0) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x1bf0fb);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x2ddcb8);
            const _0x5989c8 = await this['_callWithTimeout'](() => _0x4fc8b0(_0x47bc53, '', { 'isCommandDetection': !![] }), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x5989c8);
            const _0x4b64f1 = this['_extractJson'](_0x5989c8);
            if (_0x4b64f1) {
                try {
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x4b64f1);
                    if (_0x4b64f1['isCommand'] && _0x4b64f1['command']) {
                        if (_0x0_0x54058f && _0x0_0x54058f['commands'] && _0x0_0x54058f['commands']['has'](_0x4b64f1['command'])) {
                            return _0x4b64f1;
                        }
                        const _0x1d8e44 = this['findSimilarCommand'](_0x4b64f1['command']);
                        if (_0x1d8e44 && _0x0_0x54058f['commands'] && _0x0_0x54058f['commands']['has'](_0x1d8e44)) {
                            _0x4b64f1['command'] = _0x1d8e44;
                            _0x4b64f1['suggested'] = !![];
                            return _0x4b64f1;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x4b64f1;
                } catch (_0x419901) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x419901);
                }
            }
            return this['simpleKeywordDetection'](_0x1bf0fb);
        } catch (_0x264ea9) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x264ea9);
            return this['simpleKeywordDetection'](_0x1bf0fb);
        }
    }
    ['_extractJson'](_0x503cd4) {
        if (!_0x503cd4 || typeof _0x503cd4 !== 'string')
            return null;
        const _0x22859f = _0x503cd4['trim']();
        try {
            return JSON['parse'](_0x22859f);
        } catch (_0x56eb60) {
        }
        const _0x22ae29 = _0x22859f['match'](/\{[\s\S]*\}/);
        if (_0x22ae29) {
            try {
                return JSON['parse'](_0x22ae29[0x0]);
            } catch (_0xc282d5) {
                return null;
            }
        }
        return null;
    }
    ['buildCommandDetectionPrompt'](_0x2bfd9f) {
        if (!_0x0_0x54058f || !_0x0_0x54058f['commands']) {
            return 'Analyse\x20ce\x20message\x20et\x20détermine\x20si\x20c\x27est\x20une\x20demande\x20de\x20commande:\x20\x22' + _0x2bfd9f + '\x22';
        }
        const _0x5891ed = Array['from'](_0x0_0x54058f['commands']['values']());
        let _0x43ad2f = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x2bdff1 of _0x5891ed) {
            _0x43ad2f += '-\x20' + _0x2bdff1['command'];
            if (_0x2bdff1['aliases'] && _0x2bdff1['aliases']['length']) {
                _0x43ad2f += '\x20(alias:\x20' + _0x2bdff1['aliases']['join'](',\x20') + ')';
            }
            _0x43ad2f += ':\x20' + (_0x2bdff1['description'] || 'Pas\x20de\x20description');
            if (_0x2bdff1['usage']) {
                _0x43ad2f += '\x20[Utilisation:\x20' + _0x2bdff1['usage'] + ']';
            }
            _0x43ad2f += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x43ad2f + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x2bfd9f + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20et\x20STRICTEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x486216) {
        const _0xb0f699 = _0x486216['toLowerCase']();
        if (_0x0_0x54058f && _0x0_0x54058f['commands']) {
            for (const [_0x20c116, _0x43ee17] of _0x0_0x54058f['commands']) {
                const _0x5f2d7c = [
                    _0x20c116,
                    ...(_0x43ee17['aliases'] || [])['map'](_0x282810 => _0x282810['toLowerCase']())
                ];
                for (const _0x4e9ee2 of _0x5f2d7c) {
                    if (_0x4e9ee2['length'] < 0x3)
                        continue;
                    if (new RegExp('\x5cb' + _0x4e9ee2['replace'](/[.*+?^${}()|[\]\\]/g, '\x5c$&') + '\x5cb', 'i')['test'](_0xb0f699)) {
                        return {
                            'isCommand': !![],
                            'command': _0x20c116,
                            'args': this['extractArgs'](_0x486216),
                            'confidence': 'medium',
                            'reason': 'Mot-clé\x20détecté\x20(commande\x20enregistrée):\x20' + _0x4e9ee2
                        };
                    }
                }
            }
        }
        const _0x515028 = {
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
        let _0xba2e30 = null;
        let _0x1e109f = 0x0;
        for (const [_0x2ec229, _0x5f1626] of Object['entries'](_0x515028)) {
            let _0x39e74e = 0x0;
            for (const _0x1f0d77 of _0x5f1626) {
                if (_0xb0f699['includes'](_0x1f0d77)) {
                    _0x39e74e += _0x1f0d77['length'] / 0x5;
                }
            }
            if (_0x39e74e > _0x1e109f && _0x39e74e > 0x1) {
                _0x1e109f = _0x39e74e;
                _0xba2e30 = _0x2ec229;
            }
        }
        if (_0xba2e30 && _0x0_0x54058f?.['commands']?.['has'](_0xba2e30)) {
            const _0x4e44c7 = this['extractArgs'](_0x486216);
            return {
                'isCommand': !![],
                'command': _0xba2e30,
                'args': _0x4e44c7,
                'confidence': _0x1e109f > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0xba2e30
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x5e135b) {
        const _0x18de6a = [];
        const _0x2de1f1 = _0x5e135b['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x2de1f1)
            _0x18de6a['push'](..._0x2de1f1);
        const _0x28f3fc = _0x5e135b['match'](/\d+/g);
        if (_0x28f3fc)
            _0x18de6a['push'](..._0x28f3fc);
        const _0x28f2bf = _0x5e135b['match'](/"([^"]*)"/g);
        if (_0x28f2bf)
            _0x18de6a['push'](..._0x28f2bf['map'](_0x50444a => _0x50444a['replace'](/"/g, '')));
        const _0x2e7866 = _0x5e135b['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x2e7866 && _0x2e7866[0x1]) {
            _0x18de6a['push'](_0x2e7866[0x1]['trim']());
        }
        return _0x18de6a;
    }
    ['findSimilarCommand'](_0x16d34d) {
        if (!_0x0_0x54058f || !_0x0_0x54058f['commands'])
            return null;
        const _0x177006 = Array['from'](_0x0_0x54058f['commands']['keys']());
        const _0x486fe2 = _0x177006['filter'](_0x1f698e => _0x1f698e['includes'](_0x16d34d) || _0x16d34d['includes'](_0x1f698e) || this['levenshteinDistance'](_0x1f698e, _0x16d34d) < 0x3);
        return _0x486fe2[0x0] || null;
    }
    ['levenshteinDistance'](_0x1e1ede, _0x3f1ed6) {
        const _0x387dd8 = [];
        for (let _0x6c6c1f = 0x0; _0x6c6c1f <= _0x3f1ed6['length']; _0x6c6c1f++) {
            _0x387dd8[_0x6c6c1f] = [_0x6c6c1f];
        }
        for (let _0x51c4ac = 0x0; _0x51c4ac <= _0x1e1ede['length']; _0x51c4ac++) {
            _0x387dd8[0x0][_0x51c4ac] = _0x51c4ac;
        }
        for (let _0x10f556 = 0x1; _0x10f556 <= _0x3f1ed6['length']; _0x10f556++) {
            for (let _0x526561 = 0x1; _0x526561 <= _0x1e1ede['length']; _0x526561++) {
                if (_0x3f1ed6[_0x10f556 - 0x1] === _0x1e1ede[_0x526561 - 0x1]) {
                    _0x387dd8[_0x10f556][_0x526561] = _0x387dd8[_0x10f556 - 0x1][_0x526561 - 0x1];
                } else {
                    _0x387dd8[_0x10f556][_0x526561] = Math['min'](_0x387dd8[_0x10f556 - 0x1][_0x526561 - 0x1] + 0x1, _0x387dd8[_0x10f556][_0x526561 - 0x1] + 0x1, _0x387dd8[_0x10f556 - 0x1][_0x526561] + 0x1);
                }
            }
        }
        return _0x387dd8[_0x3f1ed6['length']][_0x1e1ede['length']];
    }
    async ['executeCommand'](_0x4e84b6, _0x54d94a, _0x70c87, _0x1cfcb7, _0x564614) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x4e84b6, _0x54d94a);
            if (!_0x0_0x54058f || !_0x0_0x54058f['commands']) {
                return {
                    'success': ![],
                    'error': 'Command\x20handler\x20not\x20available'
                };
            }
            const _0xbb2003 = _0x0_0x54058f['commands']['get'](_0x4e84b6);
            if (!_0xbb2003) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x35654f = _0x564614['isOwnerOrSudo'] || ![];
            const _0x23c6a7 = _0x564614['isFromMe'] || ![];
            const _0x175dd1 = _0x70c87['endsWith']('@g.us');
            if (_0xbb2003['ownerOnly'] && !_0x35654f && !_0x23c6a7) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0xbb2003['groupOnly'] && !_0x175dd1) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x22b13d = {
                'key': {
                    'remoteJid': _0x70c87,
                    'participant': _0x1cfcb7
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x4e84b6 + '\x20' + _0x54d94a['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x564614['pushName'] || 'User'
            };
            await _0xbb2003['handler'](_0x564614['sock'], _0x22b13d, _0x54d94a, {
                'chatId': _0x70c87,
                'senderId': _0x1cfcb7,
                'isGroup': _0x175dd1,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x4e84b6 + '\x20' + _0x54d94a['join']('\x20'),
                'messageText': _0x4e84b6 + '\x20' + _0x54d94a['join']('\x20'),
                'userMessage': _0x4e84b6 + '\x20' + _0x54d94a['join']('\x20'),
                'config': _0x0_0x7ec3ec
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x4e84b6 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x361cc1) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x361cc1);
            return {
                'success': ![],
                'error': _0x361cc1['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x3aef47, _0x1eb76d, _0x3b68e0) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x3aef47);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x2bd535 = this['buildConversationContext'](_0x3aef47, _0x1eb76d);
            console['log']('📝\x20Context\x20built,\x20length:', _0x2bd535['length']);
            const _0x57a516 = this['config']['provider'] || 'customai';
            const _0x29c4ad = this['providers'][_0x57a516];
            if (!_0x29c4ad) {
                console['error']('❌\x20Provider\x20' + _0x57a516 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x57a516);
            const _0x5e647c = await this['_callWithTimeout'](() => _0x29c4ad(_0x3aef47, _0x2bd535, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x5e647c);
            const _0x682af7 = this['cleanResponse'](_0x5e647c);
            this['addToHistory'](_0x1eb76d, _0x3aef47, _0x682af7);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x682af7);
            return _0x682af7 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x94a908) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x94a908);
            console['error']('❌\x20Stack\x20trace:', _0x94a908['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x571f94, _0x109c43) {
        let _0x376ffa = this['baseContext'];
        if (this['config']['customContext']) {
            _0x376ffa += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x5d1ba0 = this['getHistory'](_0x109c43);
        if (_0x5d1ba0 && _0x5d1ba0['length'] > 0x0) {
            _0x376ffa += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x5d1ba0['join']('\x0a');
        }
        _0x376ffa += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x571f94 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x376ffa;
    }
    async ['_callCustomAI'](_0x53ae3b, _0x6f364c, _0x434d5b) {
        console['log']('🌐\x20Calling\x20Custom\x20AI\x20API...');
        console['log']('📝\x20Message:', _0x53ae3b);
        try {
            const _0xf75897 = await askAI(_0x53ae3b);
            console['log']('✅\x20Custom\x20AI\x20response\x20received');
            return this['cleanResponse'](_0xf75897) || this['config']['fallbackResponse'];
        } catch (_0x22eb48) {
            console['error']('❌\x20Custom\x20AI\x20request\x20failed:', _0x22eb48['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPollinations'](_0x2033a6, _0x2e403a, _0x139eeb) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x2033a6);
        const _0x453603 = 'https://gen.pollinations.ai/v1/chat/completions';
        const _0x565d13 = this['config']['apiKey'] || process.env.POLLINATIONS_API_KEY;
        const _0x31e4cf = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (_0x565d13) {
            _0x31e4cf['Authorization'] = 'Bearer\x20' + _0x565d13;
        }
        const _0x483196 = [];
        if (typeof _0x2e403a === 'string' && _0x2e403a['trim']()) {
            _0x483196['push']({
                'role': 'system',
                'content': _0x2e403a
            });
        }
        _0x483196['push']({
            'role': 'user',
            'content': _0x2033a6
        });
        try {
            const _0x11f32b = {
                'model': this['config']['pollinationsModel'] || 'openai',
                'messages': _0x483196,
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x139eeb?.['isCommandDetection']) {
                _0x11f32b['response_format'] = { 'type': 'json_object' };
            }
            const _0x59b795 = await _0x0_0x21a9ac(_0x453603, {
                'method': 'POST',
                'headers': _0x31e4cf,
                'body': JSON['stringify'](_0x11f32b)
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x59b795['status']);
            if (!_0x59b795['ok']) {
                const _0x452677 = await _0x59b795['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x452677);
                if (_0x59b795['status'] === 0x191) {
                    return '❌\x20Clé\x20API\x20Pollinations\x20manquante\x20ou\x20invalide.\x20Créez-en\x20une\x20gratuite\x20sur\x20https://enter.pollinations.ai\x20puis\x20`.cbc\x20apikey\x20<clé>`.';
                }
                if (_0x59b795['status'] === 0x192) {
                    return '❌\x20Budget\x20Pollen\x20épuisé\x20sur\x20cette\x20clé\x20Pollinations.\x20Rechargez\x20sur\x20https://enter.pollinations.ai,\x20ou\x20changez\x20de\x20provider\x20avec\x20`.cbc\x20provider\x20customai`.';
                }
                return this['config']['fallbackResponse'];
            }
            const _0x5d7530 = await _0x59b795['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x1442ee = _0x5d7530['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x1442ee);
            return this['cleanResponse'](_0x1442ee) || this['config']['fallbackResponse'];
        } catch (_0x50445b) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x50445b['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x482bbb, _0x39a36d, _0x5660c5) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        console['log']('📝\x20Message:', _0x482bbb);
        const _0x40d1d5 = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x40d1d5) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x4e64b1} = await import('openai');
            const _0x8e437d = new _0x4e64b1({
                'apiKey': _0x40d1d5,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x2081ba = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x2081ba);
            const _0x5859a7 = {
                'model': _0x2081ba,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x39a36d || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x482bbb
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x5660c5?.['isCommandDetection']) {
                _0x5859a7['response_format'] = { 'type': 'json_object' };
            }
            const _0x1880f9 = await _0x8e437d['chat']['completions']['create'](_0x5859a7);
            const _0x4f93bc = _0x1880f9['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            return this['cleanResponse'](_0x4f93bc) || this['config']['fallbackResponse'];
        } catch (_0x1380b7) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x1380b7['message']);
            if (_0x1380b7['status'] === 0x191 || _0x1380b7['message']?.['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x1380b7['status'] === 0x1ad) {
                return '❌\x20Quota\x20Grok\x20atteint.\x20Réessayez\x20plus\x20tard.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x2a35bd, _0x17d7e6, _0x54947e) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        console['log']('📝\x20Message:', _0x2a35bd);
        const _0x2a1263 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x2a1263) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {GoogleGenAI: _0x3104e1} = await import('@google/genai');
            const _0x2f92b2 = new _0x3104e1({ 'apiKey': _0x2a1263 });
            const _0xf93a38 = this['config']['geminiModel'] || 'gemini-flash-latest';
            console['log']('📡\x20Using\x20model:\x20' + _0xf93a38);
            const _0x32dcbf = {
                'temperature': this['config']['temperature'] || 0.7,
                'maxOutputTokens': this['config']['maxTokens'] || 0x400
            };
            if (typeof _0x17d7e6 === 'string' && _0x17d7e6['trim']()) {
                _0x32dcbf['systemInstruction'] = _0x17d7e6;
            }
            if (_0x54947e?.['isCommandDetection']) {
                _0x32dcbf['responseMimeType'] = 'application/json';
            }
            const _0x2926eb = await this['_retryOnTransientError'](() => _0x2f92b2['models']['generateContent']({
                'model': _0xf93a38,
                'contents': [{
                        'role': 'user',
                        'parts': [{ 'text': _0x2a35bd }]
                    }],
                'config': _0x32dcbf
            }), {
                'retries': 0x2,
                'baseDelayMs': 0x320
            });
            const _0x190e49 = _0x2926eb['text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            return this['cleanResponse'](_0x190e49) || this['config']['fallbackResponse'];
        } catch (_0xbfdeca) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0xbfdeca['message']);
            if (_0xbfdeca['message']?.['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez-la\x20sur\x20https://aistudio.google.com/app/apikey';
            }
            if (_0xbfdeca['message']?.['includes']('not\x20enabled') || _0xbfdeca['message']?.['includes']('SERVICE_DISABLED')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0xbfdeca['message']?.['includes']('RESOURCE_EXHAUSTED') || _0xbfdeca['message']?.['includes']('429')) {
                return '❌\x20Quota\x20Gemini\x20atteint.\x20Réessayez\x20plus\x20tard\x20ou\x20changez\x20de\x20clé\x20API.';
            }
            if (_0xbfdeca['message']?.['includes']('UNAVAILABLE') || _0xbfdeca['message']?.['includes']('503')) {
                return '❌\x20Gemini\x20est\x20surchargé\x20en\x20ce\x20moment\x20(503).\x20J\x27ai\x20réessayé\x20automatiquement\x20sans\x20succès\x20—\x20réessayez\x20dans\x20un\x20instant.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x213b6d, _0x149f81, _0xcd98d) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x213b6d);
        const _0x510276 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x510276) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x4142d3 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x39f62e = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x41ef51 = await _0x0_0x21a9ac(_0x4142d3, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x510276
                },
                'body': JSON['stringify']({
                    'model': _0x39f62e,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x149f81
                        },
                        {
                            'role': 'user',
                            'content': _0x213b6d
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x41ef51['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x41ef51['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x550f7a = await _0x41ef51['json']();
            const _0x2a0268 = _0x550f7a['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x2a0268) || this['config']['fallbackResponse'];
        } catch (_0x210b41) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x210b41['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x1ea965, _0x58ddc9, _0x572b90) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        console['log']('📝\x20Message:', _0x1ea965);
        const _0x565cf0 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x565cf0) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            const {OpenAI: _0x385b77} = await import('openai');
            const _0x2953c6 = new _0x385b77({ 'apiKey': _0x565cf0 });
            const _0x4acea8 = this['config']['openaiModel'] || 'gpt-4o-mini';
            console['log']('📡\x20Using\x20model:\x20' + _0x4acea8);
            const _0x3e9314 = {
                'model': _0x4acea8,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x58ddc9 || 'Tu\x20es\x20un\x20assistant\x20utile.'
                    },
                    {
                        'role': 'user',
                        'content': _0x1ea965
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            };
            if (_0x572b90?.['isCommandDetection']) {
                _0x3e9314['response_format'] = { 'type': 'json_object' };
            }
            const _0x77c95a = await _0x2953c6['chat']['completions']['create'](_0x3e9314);
            const _0x3638e5 = _0x77c95a['choices']?.[0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            return this['cleanResponse'](_0x3638e5) || this['config']['fallbackResponse'];
        } catch (_0x5de3cb) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x5de3cb['message']);
            if (_0x5de3cb['status'] === 0x191 || _0x5de3cb['message']?.['includes']('Incorrect\x20API\x20key')) {
                return '❌\x20Clé\x20API\x20OpenAI\x20invalide.\x20Vérifiez-la\x20sur\x20https://platform.openai.com/api-keys';
            }
            if (_0x5de3cb['status'] === 0x1ad) {
                return '❌\x20Quota\x20OpenAI\x20atteint\x20(rate\x20limit\x20ou\x20crédit\x20épuisé).';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x2b69aa, _0x545ee2, _0x5202fa) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x2b69aa);
        const _0x3830d9 = this['config']['apiUrl'];
        if (!_0x3830d9) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x1f6c2b = await _0x0_0x21a9ac(_0x3830d9, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x2b69aa,
                    'context': _0x545ee2,
                    'metadata': _0x5202fa
                })
            });
            if (!_0x1f6c2b['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x1f6c2b['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x5d81ac = await _0x1f6c2b['json']();
            const _0x53a421 = _0x5d81ac['response'] || _0x5d81ac['reply'] || _0x5d81ac['text'] || _0x5d81ac['result'];
            return this['cleanResponse'](_0x53a421) || this['config']['fallbackResponse'];
        } catch (_0x563c55) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x563c55['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x19bca6) {
        const _0x3803e3 = 'Nova';
        const _0x21f719 = [
            new RegExp('^' + _0x3803e3 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x3803e3 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x3803e3 + ',?\x5cs+', 'i')
        ];
        let _0x1b8aa6 = _0x19bca6;
        for (const _0x406960 of _0x21f719) {
            _0x1b8aa6 = _0x1b8aa6['replace'](_0x406960, '')['trim']();
        }
        return _0x1b8aa6;
    }
    ['cleanResponse'](_0x41bf65) {
        if (!_0x41bf65)
            return null;
        let _0x50ef61 = _0x41bf65['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x50ef61['length'] > 0x7d0) {
            _0x50ef61 = _0x50ef61['slice'](0x0, 0x7d0) + '...';
        }
        return _0x50ef61;
    }
    ['getHistory'](_0x399eef) {
        const _0x1fd8d1 = this['history']['get'](_0x399eef) || [];
        const _0x2e6241 = this['config']['maxHistory'] || 0xf;
        return _0x1fd8d1['slice'](-_0x2e6241);
    }
    ['addToHistory'](_0x39fd7a, _0x179bae, _0x4c59de) {
        if (!this['history']['has'](_0x39fd7a)) {
            this['history']['set'](_0x39fd7a, []);
        }
        const _0x4c7f97 = this['history']['get'](_0x39fd7a);
        _0x4c7f97['push']('User:\x20' + _0x179bae);
        _0x4c7f97['push']('Nova:\x20' + _0x4c59de);
        const _0x2eca3a = this['config']['maxHistory'] || 0xf;
        if (_0x4c7f97['length'] > _0x2eca3a * 0x2) {
            this['history']['set'](_0x39fd7a, _0x4c7f97['slice'](-_0x2eca3a * 0x2));
        }
    }
    ['clearHistory'](_0x1116ca) {
        if (_0x1116ca) {
            this['history']['delete'](_0x1116ca);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x33754f, _0x21dbec) {
        if (_0x33754f) {
            this['contextCache']['set'](_0x33754f, _0x21dbec);
        } else {
            this['config']['customContext'] = _0x21dbec;
            _0x0_0x32c6ff['set']('customContext', _0x21dbec);
        }
    }
    ['getContext'](_0x5477f0) {
        return this['contextCache']['get'](_0x5477f0) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x5b0e07, _0x45eb09) {
        return new Promise((_0x388d0e, _0x187311) => {
            const _0x54b460 = setTimeout(() => {
                _0x187311(new Error('Request\x20timeout\x20after\x20' + _0x45eb09 + 'ms'));
            }, _0x45eb09);
            _0x5b0e07()['then'](_0x1bc65b => {
                clearTimeout(_0x54b460);
                _0x388d0e(_0x1bc65b);
            })['catch'](_0x4a3edc => {
                clearTimeout(_0x54b460);
                _0x187311(_0x4a3edc);
            });
        });
    }
    async ['_retryOnTransientError'](_0x14957e, {
        retries: retries = 0x2,
        baseDelayMs: baseDelayMs = 0x320
    } = {}) {
        let _0x54acb8;
        for (let _0x41e4d0 = 0x0; _0x41e4d0 <= retries; _0x41e4d0++) {
            try {
                return await _0x14957e();
            } catch (_0x5cb6c1) {
                _0x54acb8 = _0x5cb6c1;
                const _0x1cf4e3 = _0x5cb6c1?.['message'] || '';
                const _0xdd043 = _0x1cf4e3['includes']('UNAVAILABLE') || _0x1cf4e3['includes']('503') || _0x1cf4e3['includes']('RESOURCE_EXHAUSTED') || _0x1cf4e3['includes']('429');
                if (!_0xdd043 || _0x41e4d0 === retries) {
                    throw _0x5cb6c1;
                }
                const _0x217537 = baseDelayMs * Math['pow'](0x2, _0x41e4d0);
                console['warn']('⚠️\x20Transient\x20error,\x20retry\x20' + (_0x41e4d0 + 0x1) + '/' + retries + '\x20in\x20' + _0x217537 + 'ms:', _0x1cf4e3);
                await new Promise(_0x1e8239 => setTimeout(_0x1e8239, _0x217537));
            }
        }
        throw _0x54acb8;
    }
}
export default new ChatbotService();