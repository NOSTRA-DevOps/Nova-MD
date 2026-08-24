import _0x0_0x565706 from 'node-fetch';
import _0x0_0x3450b7 from './chatbotConfig.js';
import _0x0_0x1c8549 from './commandHandler.js';
import _0x0_0x1c7620 from '../config.js';
import { GoogleGenAI } from '@google/genai';
import _0x0_0x4fba25 from 'openai';
import _0x0_0x2bc963 from 'dotenv';
_0x0_0x2bc963['config']();
class ChatbotService {
    constructor() {
        console['log']('🤖\x20ChatbotService\x20initializing...');
        this['providers'] = {
            'pollinations': this['_callPollinations']['bind'](this),
            'puter': this['_callPuter']['bind'](this),
            'gemini': this['_callGemini']['bind'](this),
            'grok': this['_callGrok']['bind'](this),
            'openai': this['_callOpenAI']['bind'](this),
            'custom': this['_callCustom']['bind'](this)
        };
        this['history'] = new Map();
        this['contextCache'] = new Map();
        this['baseContext'] = 'You\x20are\x20NOVA,\x20a\x20virtual\x20assistant\x20powered\x20by\x20NOSTRA.\x20\x0aYou\x20are\x20an\x20advanced\x20AI\x20assistant\x20that\x20helps\x20users\x20with\x20various\x20tasks.\x0a\x0aKEY\x20TRAITS:\x0a-\x20You\x20are\x20friendly,\x20helpful,\x20and\x20professional\x0a-\x20You\x20ALWAYS\x20respond\x20in\x20the\x20SAME\x20LANGUAGE\x20as\x20the\x20user\x27s\x20question\x0a-\x20You\x20keep\x20responses\x20SHORT,\x20CLEAR,\x20and\x20PRECISE\x20(max\x203-4\x20sentences)\x0a-\x20You\x20use\x20emojis\x20appropriately\x20to\x20make\x20responses\x20engaging\x0a-\x20You\x20CAN\x20and\x20WILL\x20execute\x20commands\x20when\x20appropriate\x0a-\x20You\x20understand\x20natural\x20language\x20requests\x0a\x0aCOMMANDS\x20AVAILABLE:\x0a' + this['getCommandsList']() + '\x0a\x0aHOW\x20TO\x20IDENTIFY\x20COMMANDS:\x0a1.\x20Analyze\x20the\x20user\x27s\x20request\x20carefully\x0a2.\x20If\x20the\x20request\x20matches\x20a\x20command\x20intent,\x20execute\x20it\x0a3.\x20If\x20not,\x20just\x20have\x20a\x20normal\x20conversation\x0a4.\x20NEVER\x20execute\x20commands\x20unless\x20the\x20user\x20clearly\x20asks\x20for\x20an\x20action\x0a\x0aEXAMPLES\x20OF\x20COMMAND\x20DETECTION:\x0a-\x20\x22Nova\x20télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20EXECUTE\x20download\x20command\x0a-\x20\x22Nova\x20crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20EXECUTE\x20sticker\x20command\x20\x20\x0a-\x20\x22Nova\x20banni\x20@user\x22\x20→\x20EXECUTE\x20ban\x20command\x0a-\x20\x22Nova\x20salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20JUST\x20CHAT,\x20no\x20command\x0a-\x20\x22Nova\x20qu\x27est-ce\x20que\x20tu\x20peux\x20faire\x20?\x22\x20→\x20JUST\x20CHAT,\x20list\x20capabilities\x0a\x0aIMPORTANT\x20RULES:\x0a-\x20ONLY\x20execute\x20commands\x20when\x20the\x20user\x20explicitly\x20asks\x20for\x20an\x20action\x0a-\x20For\x20normal\x20conversation,\x20just\x20respond\x20naturally\x0a-\x20Always\x20explain\x20what\x20you\x27re\x20doing\x20when\x20executing\x20a\x20command\x0a-\x20If\x20unsure,\x20just\x20chat\x20normally\x0a-\x20You\x20understand\x20natural\x20language\x20like\x20\x22télécharge\x22,\x20\x22sticker\x22,\x20\x22ban\x22,\x20\x22kick\x22,\x20etc.\x0a\x0aCOMMAND\x20KEYWORDS\x20IN\x20FRENCH:\x0a-\x20Télécharger\x20→\x20download\x0a-\x20Sticker\x20/\x20autocollant\x20→\x20sticker\x0a-\x20Bannir\x20→\x20ban\x0a-\x20Expulser\x20→\x20kick\x0a-\x20Promouvoir\x20→\x20promote\x0a-\x20Rétrograder\x20→\x20demote\x0a-\x20Photo\x20de\x20profil\x20/\x20PP\x20→\x20profilepic\x0a\x0aRESPOND\x20IN\x20THE\x20SAME\x20LANGUAGE\x20AS\x20THE\x20USER:\x0a-\x20If\x20user\x20speaks\x20French\x20→\x20respond\x20in\x20French\x0a-\x20If\x20user\x20speaks\x20English\x20→\x20respond\x20in\x20English';
        this['loadConfig']();
        console['log']('📋\x20Current\x20provider:', this['config']['provider']);
        console['log']('📋\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        console['log']('📋\x20Execute\x20commands:', this['config']['executeCommands']);
        console['log']('📋\x20Enabled:', this['config']['enabled']);
        console['log']('📋\x20Mode:', this['config']['mode']);
    }
    ['getCommandsList']() {
        const _0x59170e = Array['from'](_0x0_0x1c8549['commands']['values']());
        const _0xed6f06 = {};
        for (const _0x4306a3 of _0x59170e) {
            const _0x459d9f = _0x4306a3['category'] || 'misc';
            if (!_0xed6f06[_0x459d9f])
                _0xed6f06[_0x459d9f] = [];
            _0xed6f06[_0x459d9f]['push']({
                'name': _0x4306a3['command'],
                'description': _0x4306a3['description'] || 'No\x20description',
                'aliases': _0x4306a3['aliases'] || [],
                'usage': _0x4306a3['usage'] || '.' + _0x4306a3['command']
            });
        }
        let _0x10fbee = '';
        for (const [_0x398a02, _0x10129a] of Object['entries'](_0xed6f06)) {
            _0x10fbee += '\x0a' + _0x398a02['toUpperCase']() + ':\x0a';
            for (const _0x515e68 of _0x10129a) {
                _0x10fbee += '-\x20' + _0x515e68['name'] + ':\x20' + _0x515e68['description'];
                if (_0x515e68['aliases']['length']) {
                    _0x10fbee += '\x20(aliases:\x20' + _0x515e68['aliases']['join'](',\x20') + ')';
                }
                _0x10fbee += '\x0a';
            }
        }
        return _0x10fbee;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x3450b7['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'pollinations',
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
    async ['getResponse'](_0xc19b3e, _0x1d41f0, _0x15fad6, _0x416155 = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0xc19b3e);
        console['log']('📝\x20Chat\x20ID:', _0x1d41f0);
        console['log']('📝\x20Sender\x20ID:', _0x15fad6);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x35e5fa = this['cleanMessage'](_0xc19b3e);
            console['log']('📝\x20Clean\x20message:', _0x35e5fa);
            if (!_0x35e5fa || _0x35e5fa['length'] < 0x1) {
                console['log']('❌\x20Empty\x20message\x20after\x20cleaning');
                return null;
            }
            if (this['config']['provider'] !== 'pollinations' && !this['config']['apiKey']) {
                console['log']('❌\x20No\x20API\x20key\x20for\x20provider:', this['config']['provider']);
                return this['_missingApiKeyMessage']();
            }
            console['log']('✅\x20Chatbot\x20will\x20process\x20message');
            if (this['config']['executeCommands']) {
                console['log']('🔍\x20Checking\x20for\x20commands...');
                const _0x3216d7 = await this['intelligentCommandDetection'](_0x35e5fa);
                if (_0x3216d7 && _0x3216d7['isCommand'] && _0x3216d7['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x3216d7['command']);
                    const _0x2878fb = await this['executeCommand'](_0x3216d7['command'], _0x3216d7['args'] || [], _0x1d41f0, _0x15fad6, _0x416155);
                    if (_0x2878fb['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x2878fb['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x2878fb['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x3216d7['command'] + '`.\x20' + (_0x2878fb['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x34c186 = await this['generateNaturalResponse'](_0x35e5fa, _0x1d41f0, _0x15fad6);
            console['log']('✅\x20Response\x20generated:', _0x34c186);
            return _0x34c186;
        } catch (_0x388395) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x388395);
            console['error']('❌\x20Stack\x20trace:', _0x388395['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20Pollinations\x20avec\x20`.cbc\x20provider\x20pollinations`';
    }
    async ['intelligentCommandDetection'](_0x86d687) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x86d687);
        try {
            const _0x5b0827 = this['buildCommandDetectionPrompt'](_0x86d687);
            const _0x53e1a4 = this['config']['provider'] || 'pollinations';
            const _0x231591 = this['providers'][_0x53e1a4];
            if (!_0x231591) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x86d687);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x53e1a4);
            const _0x322334 = await this['_callWithTimeout'](() => _0x231591(_0x5b0827, { 'isCommandDetection': !![] }, {}), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x322334);
            const _0x56f24d = _0x322334['match'](/\{[\s\S]*\}/);
            if (_0x56f24d) {
                try {
                    const _0x1a44c3 = JSON['parse'](_0x56f24d[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x1a44c3);
                    if (_0x1a44c3['isCommand'] && _0x1a44c3['command']) {
                        if (_0x0_0x1c8549['commands']['has'](_0x1a44c3['command'])) {
                            return _0x1a44c3;
                        }
                        const _0x1fd3d1 = this['findSimilarCommand'](_0x1a44c3['command']);
                        if (_0x1fd3d1 && _0x0_0x1c8549['commands']['has'](_0x1fd3d1)) {
                            _0x1a44c3['command'] = _0x1fd3d1;
                            _0x1a44c3['suggested'] = !![];
                            return _0x1a44c3;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x1a44c3;
                } catch (_0x143387) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x143387);
                }
            }
            return this['simpleKeywordDetection'](_0x86d687);
        } catch (_0x32d420) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x32d420);
            return this['simpleKeywordDetection'](_0x86d687);
        }
    }
    ['buildCommandDetectionPrompt'](_0x3979bc) {
        const _0x358c82 = Array['from'](_0x0_0x1c8549['commands']['values']());
        let _0x9e0b8b = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x448d2c of _0x358c82) {
            _0x9e0b8b += '-\x20' + _0x448d2c['command'];
            if (_0x448d2c['aliases'] && _0x448d2c['aliases']['length']) {
                _0x9e0b8b += '\x20(alias:\x20' + _0x448d2c['aliases']['join'](',\x20') + ')';
            }
            _0x9e0b8b += ':\x20' + (_0x448d2c['description'] || 'Pas\x20de\x20description');
            if (_0x448d2c['usage']) {
                _0x9e0b8b += '\x20[Utilisation:\x20' + _0x448d2c['usage'] + ']';
            }
            _0x9e0b8b += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x9e0b8b + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x3979bc + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x281326) {
        const _0x54f6e5 = _0x281326['toLowerCase']();
        const _0x33a5fc = {
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
        let _0x14eb9e = null;
        let _0x4e9fc0 = 0x0;
        for (const [_0x215e1d, _0xc5fc13] of Object['entries'](_0x33a5fc)) {
            let _0x4fb690 = 0x0;
            for (const _0x2d5161 of _0xc5fc13) {
                if (_0x54f6e5['includes'](_0x2d5161)) {
                    _0x4fb690 += _0x2d5161['length'] / 0x5;
                }
            }
            if (_0x4fb690 > _0x4e9fc0 && _0x4fb690 > 0x1) {
                _0x4e9fc0 = _0x4fb690;
                _0x14eb9e = _0x215e1d;
            }
        }
        if (_0x14eb9e) {
            const _0x468220 = this['extractArgs'](_0x281326);
            return {
                'isCommand': !![],
                'command': _0x14eb9e,
                'args': _0x468220,
                'confidence': _0x4e9fc0 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x14eb9e
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x24e733) {
        const _0x5c3ffc = [];
        const _0x4ef850 = _0x24e733['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x4ef850)
            _0x5c3ffc['push'](..._0x4ef850);
        const _0x694639 = _0x24e733['match'](/\d+/g);
        if (_0x694639)
            _0x5c3ffc['push'](..._0x694639);
        const _0x51cda1 = _0x24e733['match'](/"([^"]*)"/g);
        if (_0x51cda1)
            _0x5c3ffc['push'](..._0x51cda1['map'](_0x245ba1 => _0x245ba1['replace'](/"/g, '')));
        const _0x304a2a = _0x24e733['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x304a2a && _0x304a2a[0x1]) {
            _0x5c3ffc['push'](_0x304a2a[0x1]['trim']());
        }
        return _0x5c3ffc;
    }
    ['findSimilarCommand'](_0x1994c9) {
        const _0x4d970e = Array['from'](_0x0_0x1c8549['commands']['keys']());
        const _0x2b5858 = _0x4d970e['filter'](_0x46897b => _0x46897b['includes'](_0x1994c9) || _0x1994c9['includes'](_0x46897b) || this['levenshteinDistance'](_0x46897b, _0x1994c9) < 0x3);
        return _0x2b5858[0x0] || null;
    }
    ['levenshteinDistance'](_0x418387, _0x2549d6) {
        const _0x220564 = [];
        for (let _0x46239a = 0x0; _0x46239a <= _0x2549d6['length']; _0x46239a++) {
            _0x220564[_0x46239a] = [_0x46239a];
        }
        for (let _0x3e9c0f = 0x0; _0x3e9c0f <= _0x418387['length']; _0x3e9c0f++) {
            _0x220564[0x0][_0x3e9c0f] = _0x3e9c0f;
        }
        for (let _0x49f9df = 0x1; _0x49f9df <= _0x2549d6['length']; _0x49f9df++) {
            for (let _0x5554bd = 0x1; _0x5554bd <= _0x418387['length']; _0x5554bd++) {
                if (_0x2549d6[_0x49f9df - 0x1] === _0x418387[_0x5554bd - 0x1]) {
                    _0x220564[_0x49f9df][_0x5554bd] = _0x220564[_0x49f9df - 0x1][_0x5554bd - 0x1];
                } else {
                    _0x220564[_0x49f9df][_0x5554bd] = Math['min'](_0x220564[_0x49f9df - 0x1][_0x5554bd - 0x1] + 0x1, _0x220564[_0x49f9df][_0x5554bd - 0x1] + 0x1, _0x220564[_0x49f9df - 0x1][_0x5554bd] + 0x1);
                }
            }
        }
        return _0x220564[_0x2549d6['length']][_0x418387['length']];
    }
    async ['executeCommand'](_0x3afc51, _0x268269, _0xf5c565, _0x33c484, _0x2ce3d9) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x3afc51, _0x268269);
            const _0x2fd1cb = _0x0_0x1c8549['commands']['get'](_0x3afc51);
            if (!_0x2fd1cb) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x4d621a = _0x2ce3d9['isOwnerOrSudo'] || ![];
            const _0x4af1ce = _0x2ce3d9['isFromMe'] || ![];
            const _0x4a1bb1 = _0xf5c565['endsWith']('@g.us');
            if (_0x2fd1cb['ownerOnly'] && !_0x4d621a && !_0x4af1ce) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x2fd1cb['groupOnly'] && !_0x4a1bb1) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0xb0c1d3 = {
                'key': {
                    'remoteJid': _0xf5c565,
                    'participant': _0x33c484
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x3afc51 + '\x20' + _0x268269['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x2ce3d9['pushName'] || 'User'
            };
            await _0x2fd1cb['handler'](_0x2ce3d9['sock'], _0xb0c1d3, _0x268269, {
                'chatId': _0xf5c565,
                'senderId': _0x33c484,
                'isGroup': _0x4a1bb1,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x3afc51 + '\x20' + _0x268269['join']('\x20'),
                'messageText': _0x3afc51 + '\x20' + _0x268269['join']('\x20'),
                'userMessage': _0x3afc51 + '\x20' + _0x268269['join']('\x20'),
                'config': _0x0_0x1c7620
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x3afc51 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x22004f) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x22004f);
            return {
                'success': ![],
                'error': _0x22004f['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x353645, _0x4295e7, _0x3f7b84) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x353645);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x2f797a = this['buildConversationContext'](_0x353645, _0x4295e7);
            console['log']('📝\x20Context\x20built,\x20length:', _0x2f797a['length']);
            const _0x3dcf35 = this['config']['provider'] || 'pollinations';
            const _0x125ec4 = this['providers'][_0x3dcf35];
            if (!_0x125ec4) {
                console['error']('❌\x20Provider\x20' + _0x3dcf35 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x3dcf35);
            const _0x44ad4d = await this['_callWithTimeout'](() => _0x125ec4(_0x353645, _0x2f797a, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x44ad4d);
            const _0x154796 = this['cleanResponse'](_0x44ad4d);
            this['addToHistory'](_0x4295e7, _0x353645, _0x154796);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x154796);
            return _0x154796 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0xb065d6) {
            console['error']('❌\x20Natural\x20response\x20error:', _0xb065d6);
            console['error']('❌\x20Stack\x20trace:', _0xb065d6['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0xf0d2e1, _0x3790ef) {
        let _0x355622 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x355622 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0xc7e8d4 = this['getHistory'](_0x3790ef);
        if (_0xc7e8d4 && _0xc7e8d4['length'] > 0x0) {
            _0x355622 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0xc7e8d4['join']('\x0a');
        }
        _0x355622 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0xf0d2e1 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x355622;
    }
    async ['_callPollinations'](_0x397247, _0x55df01, _0x4d8646) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x397247);
        const _0x3f437d = 'https://text.pollinations.ai/openai';
        try {
            const _0x2c731a = await _0x0_0x565706(_0x3f437d, {
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
                            'content': _0x55df01
                        },
                        {
                            'role': 'user',
                            'content': _0x397247
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x2c731a['status']);
            if (!_0x2c731a['ok']) {
                const _0x4d3435 = await _0x2c731a['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x4d3435);
                return this['config']['fallbackResponse'];
            }
            const _0x5ec556 = await _0x2c731a['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x47fb30 = _0x5ec556['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x47fb30);
            return this['cleanResponse'](_0x47fb30) || this['config']['fallbackResponse'];
        } catch (_0x27649d) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x27649d['message']);
            console['error']('❌\x20Stack:', _0x27649d['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x4a2379, _0x2c7981, _0x1e414d) {
        console['log']('🌐\x20Calling\x20Grok\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x4a2379);
        const _0x314b6d = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x314b6d) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client\x20for\x20xAI...');
            const _0x2ffd59 = new _0x0_0x4fba25({
                'apiKey': _0x314b6d,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x4d5436 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x4d5436);
            console['log']('📡\x20Sending\x20request\x20to\x20Grok...');
            const _0x4aed4e = await _0x2ffd59['chat']['completions']['create']({
                'model': _0x4d5436,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x2c7981
                    },
                    {
                        'role': 'user',
                        'content': _0x4a2379
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x53ebdf = _0x4aed4e['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            console['log']('📝\x20Result:', _0x53ebdf);
            return this['cleanResponse'](_0x53ebdf) || this['config']['fallbackResponse'];
        } catch (_0x1089d7) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x1089d7['message']);
            console['error']('❌\x20Stack:', _0x1089d7['stack']);
            if (_0x1089d7['message']['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x1089d7['message']['includes']('model')) {
                return '❌\x20Modèle\x20Grok\x20non\x20disponible.\x20Vérifiez\x20votre\x20clé\x20API\x20et\x20les\x20modèles\x20disponibles.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x482edb, _0x55b024, _0x4630bb) {
        console['log']('🌐\x20Calling\x20Gemini\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x482edb);
        const _0x76a8b0 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x76a8b0) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20GoogleGenAI\x20client...');
            const _0x2aeecb = new GoogleGenAI({ 'apiKey': _0x76a8b0 });
            const _0x6515be = 'gemini-2.0-flash-exp';
            console['log']('📡\x20Using\x20model:\x20' + _0x6515be);
            console['log']('📡\x20Sending\x20request\x20to\x20Gemini...');
            const _0x4c59c1 = await _0x2aeecb['interactions']['create']({
                'model': _0x6515be,
                'input': _0x55b024 + '\x0a\x0aUser:\x20' + _0x482edb + '\x0a\x0aAssistant:',
                'config': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            });
            const _0x4b92bd = _0x4c59c1['output_text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            console['log']('📝\x20Result:', _0x4b92bd);
            return this['cleanResponse'](_0x4b92bd) || this['config']['fallbackResponse'];
        } catch (_0x50bd9d) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x50bd9d['message']);
            console['error']('❌\x20Stack:', _0x50bd9d['stack']);
            if (_0x50bd9d['message']['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez\x20votre\x20clé\x20sur\x20https://console.cloud.google.com/';
            }
            if (_0x50bd9d['message']['includes']('not\x20enabled')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x50bd9d['message']['includes']('quota')) {
                return '❌\x20Quota\x20Gemini\x20épuisé.\x20Attendez\x20ou\x20augmentez\x20vos\x20quotas.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x1a78f3, _0x26e453, _0xc68053) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x1a78f3);
        const _0x1737df = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x1737df) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x39a829 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x437dd2 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Puter...');
            const _0xdf375f = await _0x0_0x565706(_0x39a829, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x1737df
                },
                'body': JSON['stringify']({
                    'model': _0x437dd2,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x26e453
                        },
                        {
                            'role': 'user',
                            'content': _0x1a78f3
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Puter\x20response\x20status:', _0xdf375f['status']);
            if (!_0xdf375f['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0xdf375f['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x5770d3 = await _0xdf375f['json']();
            const _0x512c7b = _0x5770d3['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x512c7b) || this['config']['fallbackResponse'];
        } catch (_0xb3bd2d) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0xb3bd2d['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x592b57, _0x7d65f1, _0x3381fe) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x592b57);
        const _0x4eeb01 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x4eeb01) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client...');
            const _0x33e773 = new _0x0_0x4fba25({ 'apiKey': _0x4eeb01 });
            console['log']('📡\x20Sending\x20request\x20to\x20OpenAI...');
            const _0xd35cee = await _0x33e773['chat']['completions']['create']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x7d65f1
                    },
                    {
                        'role': 'user',
                        'content': _0x592b57
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x3aae7c = _0xd35cee['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            console['log']('📝\x20Result:', _0x3aae7c);
            return this['cleanResponse'](_0x3aae7c) || this['config']['fallbackResponse'];
        } catch (_0xa8dc59) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0xa8dc59['message']);
            console['error']('❌\x20Stack:', _0xa8dc59['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x431c4d, _0xb20b08, _0x2ec13d) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x431c4d);
        const _0x38d25d = this['config']['apiUrl'];
        if (!_0x38d25d) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Custom\x20API...');
            const _0x2e8e20 = await _0x0_0x565706(_0x38d25d, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x431c4d,
                    'context': _0xb20b08,
                    'metadata': _0x2ec13d
                })
            });
            console['log']('📡\x20Custom\x20API\x20response\x20status:', _0x2e8e20['status']);
            if (!_0x2e8e20['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x2e8e20['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x29b4fe = await _0x2e8e20['json']();
            const _0x232870 = _0x29b4fe['response'] || _0x29b4fe['reply'] || _0x29b4fe['text'] || _0x29b4fe['result'];
            return this['cleanResponse'](_0x232870) || this['config']['fallbackResponse'];
        } catch (_0x474158) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x474158['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x2da067) {
        const _0x468d72 = 'Nova';
        const _0x374a7c = [
            new RegExp('^' + _0x468d72 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x468d72 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x468d72 + ',?\x5cs+', 'i')
        ];
        let _0x1c222a = _0x2da067;
        for (const _0xe49024 of _0x374a7c) {
            _0x1c222a = _0x1c222a['replace'](_0xe49024, '')['trim']();
        }
        return _0x1c222a;
    }
    ['cleanResponse'](_0x11ea83) {
        if (!_0x11ea83)
            return null;
        let _0x17c067 = _0x11ea83['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x17c067['length'] > 0x7d0) {
            _0x17c067 = _0x17c067['slice'](0x0, 0x7d0) + '...';
        }
        return _0x17c067;
    }
    ['getHistory'](_0x1d33d0) {
        const _0x4c4728 = this['history']['get'](_0x1d33d0) || [];
        const _0x24b5ac = this['config']['maxHistory'] || 0xf;
        return _0x4c4728['slice'](-_0x24b5ac);
    }
    ['addToHistory'](_0x256cf6, _0x1d1da2, _0x57dd80) {
        if (!this['history']['has'](_0x256cf6)) {
            this['history']['set'](_0x256cf6, []);
        }
        const _0x13b85e = this['history']['get'](_0x256cf6);
        _0x13b85e['push']('User:\x20' + _0x1d1da2);
        _0x13b85e['push']('Nova:\x20' + _0x57dd80);
        const _0x1feb09 = this['config']['maxHistory'] || 0xf;
        if (_0x13b85e['length'] > _0x1feb09 * 0x2) {
            this['history']['set'](_0x256cf6, _0x13b85e['slice'](-_0x1feb09 * 0x2));
        }
    }
    ['clearHistory'](_0x2ddef1) {
        if (_0x2ddef1) {
            this['history']['delete'](_0x2ddef1);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x413ebd, _0x2ca1a1) {
        if (_0x413ebd) {
            this['contextCache']['set'](_0x413ebd, _0x2ca1a1);
        } else {
            this['config']['customContext'] = _0x2ca1a1;
            _0x0_0x3450b7['set']('customContext', _0x2ca1a1);
        }
    }
    ['getContext'](_0x37cd01) {
        return this['contextCache']['get'](_0x37cd01) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x295457, _0x8fa43f) {
        return new Promise((_0xba1018, _0x68dac0) => {
            const _0x46900c = setTimeout(() => {
                _0x68dac0(new Error('Request\x20timeout\x20after\x20' + _0x8fa43f + 'ms'));
            }, _0x8fa43f);
            _0x295457()['then'](_0x13eb9b => {
                clearTimeout(_0x46900c);
                _0xba1018(_0x13eb9b);
            })['catch'](_0x334603 => {
                clearTimeout(_0x46900c);
                _0x68dac0(_0x334603);
            });
        });
    }
}
export default new ChatbotService();