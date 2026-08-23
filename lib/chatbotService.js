import _0x0_0x279bdb from 'node-fetch';
import _0x0_0x4d4ac0 from './chatbotConfig.js';
import _0x0_0x2efce from './commandHandler.js';
import _0x0_0x543037 from '../config.js';
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
        this['baseContext'] = 'You\x20are\x20NOVA,\x20a\x20virtual\x20assistant\x20powered\x20by\x20NOSTRA.\x20\x0aYou\x20are\x20an\x20advanced\x20AI\x20assistant\x20that\x20helps\x20users\x20with\x20various\x20tasks.\x0a\x0aKEY\x20TRAITS:\x0a-\x20You\x20are\x20friendly,\x20helpful,\x20and\x20professional\x0a-\x20You\x20ALWAYS\x20respond\x20in\x20the\x20SAME\x20LANGUAGE\x20as\x20the\x20user\x27s\x20question\x0a-\x20You\x20keep\x20responses\x20SHORT,\x20CLEAR,\x20and\x20PRECISE\x20(max\x203-4\x20sentences)\x0a-\x20You\x20use\x20emojis\x20appropriately\x20to\x20make\x20responses\x20engaging\x0a-\x20You\x20CAN\x20and\x20WILL\x20execute\x20commands\x20when\x20appropriate\x0a-\x20You\x20understand\x20natural\x20language\x20requests\x0a\x0aCOMMANDS\x20AVAILABLE:\x0a' + this['getCommandsList']() + '\x0a\x0aHOW\x20TO\x20IDENTIFY\x20COMMANDS:\x0a1.\x20Analyze\x20the\x20user\x27s\x20request\x20carefully\x0a2.\x20If\x20the\x20request\x20matches\x20a\x20command\x20intent,\x20execute\x20it\x0a3.\x20If\x20not,\x20just\x20have\x20a\x20normal\x20conversation\x0a4.\x20NEVER\x20execute\x20commands\x20unless\x20the\x20user\x20clearly\x20asks\x20for\x20an\x20action\x0a\x0aEXAMPLES\x20OF\x20COMMAND\x20DETECTION:\x0a-\x20\x22Nova\x20télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20EXECUTE\x20download\x20command\x0a-\x20\x22Nova\x20crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20EXECUTE\x20sticker\x20command\x20\x20\x0a-\x20\x22Nova\x20banni\x20@user\x22\x20→\x20EXECUTE\x20ban\x20command\x0a-\x20\x22Nova\x20salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20JUST\x20CHAT,\x20no\x20command\x0a-\x20\x22Nova\x20qu\x27est-ce\x20que\x20tu\x20peux\x20faire\x20?\x22\x20→\x20JUST\x20CHAT,\x20list\x20capabilities\x0a-\x20\x22Nova\x20je\x20veux\x20voir\x20la\x20photo\x20de\x20profil\x20de\x20@user\x22\x20→\x20EXECUTE\x20profilepic\x20command\x0a\x0aIMPORTANT\x20RULES:\x0a-\x20ONLY\x20execute\x20commands\x20when\x20the\x20user\x20explicitly\x20asks\x20for\x20an\x20action\x0a-\x20For\x20normal\x20conversation,\x20just\x20respond\x20naturally\x0a-\x20Always\x20explain\x20what\x20you\x27re\x20doing\x20when\x20executing\x20a\x20command\x0a-\x20If\x20unsure,\x20just\x20chat\x20normally\x0a-\x20You\x20understand\x20natural\x20language\x20like\x20\x22télécharge\x22,\x20\x22sticker\x22,\x20\x22ban\x22,\x20\x22kick\x22,\x20etc.\x0a\x0aCOMMAND\x20KEYWORDS\x20IN\x20FRENCH:\x0a-\x20Télécharger\x20→\x20download\x0a-\x20Sticker\x20/\x20autocollant\x20→\x20sticker\x0a-\x20Bannir\x20→\x20ban\x0a-\x20Expulser\x20→\x20kick\x0a-\x20Promouvoir\x20→\x20promote\x0a-\x20Rétrograder\x20→\x20demote\x0a-\x20Photo\x20de\x20profil\x20/\x20PP\x20→\x20profilepic\x0a-\x20Message\x20éphémère\x20→\x20viewonce\x0a\x0aRESPOND\x20IN\x20THE\x20SAME\x20LANGUAGE\x20AS\x20THE\x20USER:\x0a-\x20If\x20user\x20speaks\x20French\x20→\x20respond\x20in\x20French\x0a-\x20If\x20user\x20speaks\x20English\x20→\x20respond\x20in\x20English\x0a-\x20If\x20user\x20speaks\x20any\x20other\x20language\x20→\x20respond\x20in\x20that\x20language';
        this['loadConfig']();
        console['log']('📋\x20Current\x20provider:', this['config']['provider']);
        console['log']('📋\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        console['log']('📋\x20Execute\x20commands:', this['config']['executeCommands']);
    }
    ['getCommandsList']() {
        const _0x3f6817 = Array['from'](_0x0_0x2efce['commands']['values']());
        const _0x2260a2 = {};
        for (const _0x156339 of _0x3f6817) {
            const _0x2e1416 = _0x156339['category'] || 'misc';
            if (!_0x2260a2[_0x2e1416])
                _0x2260a2[_0x2e1416] = [];
            _0x2260a2[_0x2e1416]['push']({
                'name': _0x156339['command'],
                'description': _0x156339['description'] || 'No\x20description',
                'aliases': _0x156339['aliases'] || [],
                'usage': _0x156339['usage'] || '.' + _0x156339['command']
            });
        }
        let _0x3b0091 = '';
        for (const [_0x1af7b2, _0x108e4a] of Object['entries'](_0x2260a2)) {
            _0x3b0091 += '\x0a' + _0x1af7b2['toUpperCase']() + ':\x0a';
            for (const _0x53f46e of _0x108e4a) {
                _0x3b0091 += '-\x20' + _0x53f46e['name'] + ':\x20' + _0x53f46e['description'];
                if (_0x53f46e['aliases']['length']) {
                    _0x3b0091 += '\x20(aliases:\x20' + _0x53f46e['aliases']['join'](',\x20') + ')';
                }
                _0x3b0091 += '\x0a';
            }
        }
        return _0x3b0091;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x4d4ac0['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'pollinations',
            'apiKey': '',
            'apiUrl': '',
            'puterModel': 'gpt-5.4-nano',
            'grokModel': 'grok-1-latest',
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
    async ['getResponse'](_0x284696, _0x4aa19a, _0x2e4d36, _0x4dcbac = {}) {
        try {
            console['log']('🔍\x20Chatbot\x20called:', {
                'message': _0x284696,
                'provider': this['config']['provider'],
                'enabled': this['config']['enabled']
            });
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20disabled');
                return null;
            }
            const _0x9040e1 = this['cleanMessage'](_0x284696);
            if (!_0x9040e1 || _0x9040e1['length'] < 0x1) {
                console['log']('❌\x20Empty\x20message');
                return null;
            }
            if (this['config']['provider'] !== 'pollinations' && !this['config']['apiKey']) {
                return this['_missingApiKeyMessage']();
            }
            if (this['config']['executeCommands']) {
                const _0x1a0207 = await this['intelligentCommandDetection'](_0x9040e1);
                if (_0x1a0207 && _0x1a0207['isCommand'] && _0x1a0207['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x1a0207['command']);
                    const _0x42d83f = await this['executeCommand'](_0x1a0207['command'], _0x1a0207['args'] || [], _0x4aa19a, _0x2e4d36, _0x4dcbac);
                    if (_0x42d83f['success']) {
                        return _0x42d83f['message'];
                    } else {
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x1a0207['command'] + '`.\x20' + (_0x42d83f['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            return await this['generateNaturalResponse'](_0x9040e1, _0x4aa19a, _0x2e4d36);
        } catch (_0x46011b) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x46011b);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20Pollinations\x20avec\x20`.cbc\x20provider\x20pollinations`';
    }
    async ['intelligentCommandDetection'](_0x23abaf) {
        try {
            const _0x18713d = this['buildCommandDetectionPrompt'](_0x23abaf);
            const _0x3235f7 = this['config']['provider'] || 'pollinations';
            const _0x3d84a9 = this['providers'][_0x3235f7];
            if (!_0x3d84a9) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x23abaf);
            }
            const _0x452353 = await this['_callWithTimeout'](() => _0x3d84a9(_0x18713d, { 'isCommandDetection': !![] }, {}), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x452353);
            const _0x22afb5 = _0x452353['match'](/\{[\s\S]*\}/);
            if (_0x22afb5) {
                try {
                    const _0x29bb78 = JSON['parse'](_0x22afb5[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x29bb78);
                    if (_0x29bb78['isCommand'] && _0x29bb78['command']) {
                        if (_0x0_0x2efce['commands']['has'](_0x29bb78['command'])) {
                            return _0x29bb78;
                        }
                        const _0x45e24b = this['findSimilarCommand'](_0x29bb78['command']);
                        if (_0x45e24b && _0x0_0x2efce['commands']['has'](_0x45e24b)) {
                            _0x29bb78['command'] = _0x45e24b;
                            _0x29bb78['suggested'] = !![];
                            return _0x29bb78;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x29bb78;
                } catch (_0x1def3d) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x1def3d);
                }
            }
            return this['simpleKeywordDetection'](_0x23abaf);
        } catch (_0x347102) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x347102);
            return this['simpleKeywordDetection'](_0x23abaf);
        }
    }
    ['buildCommandDetectionPrompt'](_0x48a036) {
        const _0xce4c8c = Array['from'](_0x0_0x2efce['commands']['values']());
        let _0x433b24 = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x18dbb7 of _0xce4c8c) {
            _0x433b24 += '-\x20' + _0x18dbb7['command'];
            if (_0x18dbb7['aliases'] && _0x18dbb7['aliases']['length']) {
                _0x433b24 += '\x20(alias:\x20' + _0x18dbb7['aliases']['join'](',\x20') + ')';
            }
            _0x433b24 += ':\x20' + (_0x18dbb7['description'] || 'Pas\x20de\x20description');
            if (_0x18dbb7['usage']) {
                _0x433b24 += '\x20[Utilisation:\x20' + _0x18dbb7['usage'] + ']';
            }
            _0x433b24 += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x433b24 + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x48a036 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0xc56ce3) {
        const _0x269892 = _0xc56ce3['toLowerCase']();
        const _0x31a2ef = {
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
        let _0x1c7f89 = null;
        let _0x4da737 = 0x0;
        for (const [_0x5484bb, _0x1fbff9] of Object['entries'](_0x31a2ef)) {
            let _0x39d6b4 = 0x0;
            for (const _0x25b299 of _0x1fbff9) {
                if (_0x269892['includes'](_0x25b299)) {
                    _0x39d6b4 += _0x25b299['length'] / 0x5;
                }
            }
            if (_0x39d6b4 > _0x4da737 && _0x39d6b4 > 0x1) {
                _0x4da737 = _0x39d6b4;
                _0x1c7f89 = _0x5484bb;
            }
        }
        if (_0x1c7f89) {
            const _0x42cc07 = this['extractArgs'](_0xc56ce3);
            return {
                'isCommand': !![],
                'command': _0x1c7f89,
                'args': _0x42cc07,
                'confidence': _0x4da737 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x1c7f89
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x100265) {
        const _0x2c123a = [];
        const _0x16c1bc = _0x100265['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x16c1bc)
            _0x2c123a['push'](..._0x16c1bc);
        const _0x12e73b = _0x100265['match'](/\d+/g);
        if (_0x12e73b)
            _0x2c123a['push'](..._0x12e73b);
        const _0x348824 = _0x100265['match'](/"([^"]*)"/g);
        if (_0x348824)
            _0x2c123a['push'](..._0x348824['map'](_0x4cdddd => _0x4cdddd['replace'](/"/g, '')));
        const _0x3d104a = _0x100265['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x3d104a && _0x3d104a[0x1]) {
            _0x2c123a['push'](_0x3d104a[0x1]['trim']());
        }
        return _0x2c123a;
    }
    ['findSimilarCommand'](_0x49780a) {
        const _0x36b340 = Array['from'](_0x0_0x2efce['commands']['keys']());
        const _0x1fa175 = _0x36b340['filter'](_0x36ba88 => _0x36ba88['includes'](_0x49780a) || _0x49780a['includes'](_0x36ba88) || this['levenshteinDistance'](_0x36ba88, _0x49780a) < 0x3);
        return _0x1fa175[0x0] || null;
    }
    ['levenshteinDistance'](_0x58c90f, _0x541ab7) {
        const _0x24fa8f = [];
        for (let _0x47a72f = 0x0; _0x47a72f <= _0x541ab7['length']; _0x47a72f++) {
            _0x24fa8f[_0x47a72f] = [_0x47a72f];
        }
        for (let _0x39f871 = 0x0; _0x39f871 <= _0x58c90f['length']; _0x39f871++) {
            _0x24fa8f[0x0][_0x39f871] = _0x39f871;
        }
        for (let _0x238009 = 0x1; _0x238009 <= _0x541ab7['length']; _0x238009++) {
            for (let _0xb9ee54 = 0x1; _0xb9ee54 <= _0x58c90f['length']; _0xb9ee54++) {
                if (_0x541ab7[_0x238009 - 0x1] === _0x58c90f[_0xb9ee54 - 0x1]) {
                    _0x24fa8f[_0x238009][_0xb9ee54] = _0x24fa8f[_0x238009 - 0x1][_0xb9ee54 - 0x1];
                } else {
                    _0x24fa8f[_0x238009][_0xb9ee54] = Math['min'](_0x24fa8f[_0x238009 - 0x1][_0xb9ee54 - 0x1] + 0x1, _0x24fa8f[_0x238009][_0xb9ee54 - 0x1] + 0x1, _0x24fa8f[_0x238009 - 0x1][_0xb9ee54] + 0x1);
                }
            }
        }
        return _0x24fa8f[_0x541ab7['length']][_0x58c90f['length']];
    }
    async ['executeCommand'](_0x51da68, _0x2199bb, _0xf168b2, _0x40fb60, _0x3d7dd5) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x51da68, _0x2199bb);
            const _0x6bf339 = _0x0_0x2efce['commands']['get'](_0x51da68);
            if (!_0x6bf339) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x57558c = _0x3d7dd5['isOwnerOrSudo'] || ![];
            const _0x85b2cf = _0x3d7dd5['isFromMe'] || ![];
            const _0x567fd9 = _0xf168b2['endsWith']('@g.us');
            if (_0x6bf339['ownerOnly'] && !_0x57558c && !_0x85b2cf) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x6bf339['groupOnly'] && !_0x567fd9) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x220437 = {
                'key': {
                    'remoteJid': _0xf168b2,
                    'participant': _0x40fb60
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x51da68 + '\x20' + _0x2199bb['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x3d7dd5['pushName'] || 'User'
            };
            await _0x6bf339['handler'](_0x3d7dd5['sock'], _0x220437, _0x2199bb, {
                'chatId': _0xf168b2,
                'senderId': _0x40fb60,
                'isGroup': _0x567fd9,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x51da68 + '\x20' + _0x2199bb['join']('\x20'),
                'messageText': _0x51da68 + '\x20' + _0x2199bb['join']('\x20'),
                'userMessage': _0x51da68 + '\x20' + _0x2199bb['join']('\x20'),
                'config': _0x0_0x543037
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x51da68 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0xb364) {
            console['error']('❌\x20Command\x20execution\x20error:', _0xb364);
            return {
                'success': ![],
                'error': _0xb364['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x3a6c33, _0x2d442c, _0x516f15) {
        try {
            const _0xcc7902 = this['buildConversationContext'](_0x3a6c33, _0x2d442c);
            const _0x2803b7 = this['config']['provider'] || 'pollinations';
            const _0x3df474 = this['providers'][_0x2803b7];
            if (!_0x3df474) {
                console['error']('❌\x20Provider\x20' + _0x2803b7 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x2803b7);
            const _0x1c986e = await this['_callWithTimeout'](() => _0x3df474(_0x3a6c33, _0xcc7902, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            const _0x486a38 = this['cleanResponse'](_0x1c986e);
            this['addToHistory'](_0x2d442c, _0x3a6c33, _0x486a38);
            console['log']('✅\x20Response\x20generated');
            return _0x486a38 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x5153f8) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x5153f8);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x4f0221, _0x28c3f) {
        let _0x32310e = this['baseContext'];
        if (this['config']['customContext']) {
            _0x32310e += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0xba40ed = this['getHistory'](_0x28c3f);
        if (_0xba40ed && _0xba40ed['length'] > 0x0) {
            _0x32310e += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0xba40ed['join']('\x0a');
        }
        _0x32310e += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x4f0221 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x32310e;
    }
    async ['_callPollinations'](_0x2d82ce, _0x20d032, _0x3b7c8d) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        const _0x19987f = 'https://text.pollinations.ai/openai';
        try {
            const _0x1694f3 = await _0x0_0x279bdb(_0x19987f, {
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
                            'content': _0x20d032
                        },
                        {
                            'role': 'user',
                            'content': _0x2d82ce
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x1694f3['ok']) {
                const _0x5f194f = await _0x1694f3['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x5f194f);
                return this['config']['fallbackResponse'];
            }
            const _0xc86f45 = await _0x1694f3['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x355d96 = _0xc86f45['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x355d96) || this['config']['fallbackResponse'];
        } catch (_0x4152b4) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x4152b4['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x77335b, _0x2af9e6, _0x251a43) {
        console['log']('🌐\x20Calling\x20Grok\x20API...');
        const _0x15ad69 = this['config']['apiKey'] || process.env.GROK_API_KEY;
        if (!_0x15ad69) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        const _0x4a0f95 = this['config']['apiUrl'] || 'https://api.x.ai/v1/chat/completions';
        const _0x26f77e = this['config']['grokModel'] || 'grok-1-latest';
        try {
            const _0x5c4dc7 = await _0x0_0x279bdb(_0x4a0f95, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x15ad69
                },
                'body': JSON['stringify']({
                    'model': _0x26f77e,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x2af9e6
                        },
                        {
                            'role': 'user',
                            'content': _0x77335b
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x5c4dc7['ok']) {
                const _0x203a72 = await _0x5c4dc7['text']();
                console['error']('❌\x20Grok\x20API\x20error:', _0x203a72);
                return this['config']['fallbackResponse'];
            }
            const _0x34b293 = await _0x5c4dc7['json']();
            const _0x1f0723 = _0x34b293['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x1f0723) || this['config']['fallbackResponse'];
        } catch (_0x85cc42) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x85cc42['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x5eb216, _0x1c9dab, _0x383cd5) {
        console['log']('🌐\x20Calling\x20Gemini\x20API...');
        const _0x78564f = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x78564f) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        const _0x4cceae = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        const _0x1a5abb = _0x1c9dab + '\x0a\x0aUser:\x20' + _0x5eb216 + '\x0a\x0aAssistant:';
        try {
            const _0x18d9e4 = await _0x0_0x279bdb(_0x4cceae + '?key=' + _0x78564f, {
                'method': 'POST',
                'headers': { 'Content-Type': 'application/json' },
                'body': JSON['stringify']({
                    'contents': [{ 'parts': [{ 'text': _0x1a5abb }] }],
                    'generationConfig': {
                        'temperature': this['config']['temperature'] || 0.7,
                        'maxOutputTokens': this['config']['maxTokens'] || 0x400
                    }
                })
            });
            if (!_0x18d9e4['ok']) {
                const _0x56d8fc = await _0x18d9e4['text']();
                console['error']('❌\x20Gemini\x20API\x20error:', _0x56d8fc);
                return this['config']['fallbackResponse'];
            }
            const _0x44cf6d = await _0x18d9e4['json']();
            const _0x98fc14 = _0x44cf6d['candidates']?.[0x0]?.['content']?.['parts']?.[0x0]?.['text'];
            return this['cleanResponse'](_0x98fc14) || this['config']['fallbackResponse'];
        } catch (_0x38d0c5) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x38d0c5['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x5cbdd0, _0x3f1ba8, _0x63ff1a) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        const _0x297704 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x297704) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x3610e7 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x5da342 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x29c67e = await _0x0_0x279bdb(_0x3610e7, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x297704
                },
                'body': JSON['stringify']({
                    'model': _0x5da342,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x3f1ba8
                        },
                        {
                            'role': 'user',
                            'content': _0x5cbdd0
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x29c67e['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x29c67e['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x2ca324 = await _0x29c67e['json']();
            const _0x28f731 = _0x2ca324['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x28f731) || this['config']['fallbackResponse'];
        } catch (_0x1e30a5) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x1e30a5['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x491095, _0x23a92e, _0x3c71e4) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API...');
        const _0x5c1b09 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x5c1b09) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        const _0x24dbc9 = 'https://api.openai.com/v1/chat/completions';
        try {
            const _0x16c5e5 = await _0x0_0x279bdb(_0x24dbc9, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x5c1b09
                },
                'body': JSON['stringify']({
                    'model': 'gpt-3.5-turbo',
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x23a92e
                        },
                        {
                            'role': 'user',
                            'content': _0x491095
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x16c5e5['ok']) {
                console['error']('❌\x20OpenAI\x20API\x20error:', await _0x16c5e5['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x503a30 = await _0x16c5e5['json']();
            const _0x3438d3 = _0x503a30['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x3438d3) || this['config']['fallbackResponse'];
        } catch (_0xccab1f) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0xccab1f['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x562c5c, _0x8c1415, _0x5cc464) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        const _0x306eb9 = this['config']['apiUrl'];
        if (!_0x306eb9) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            const _0x33b82e = await _0x0_0x279bdb(_0x306eb9, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x562c5c,
                    'context': _0x8c1415,
                    'metadata': _0x5cc464
                })
            });
            if (!_0x33b82e['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x33b82e['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x2b0c1a = await _0x33b82e['json']();
            const _0x293471 = _0x2b0c1a['response'] || _0x2b0c1a['reply'] || _0x2b0c1a['text'] || _0x2b0c1a['result'];
            return this['cleanResponse'](_0x293471) || this['config']['fallbackResponse'];
        } catch (_0x4fdc71) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x4fdc71['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x2abb2a) {
        const _0x402335 = 'Nova';
        const _0xbc5cb8 = [
            new RegExp('^' + _0x402335 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x402335 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x402335 + ',?\x5cs+', 'i')
        ];
        let _0x1a0a82 = _0x2abb2a;
        for (const _0xce5529 of _0xbc5cb8) {
            _0x1a0a82 = _0x1a0a82['replace'](_0xce5529, '')['trim']();
        }
        return _0x1a0a82;
    }
    ['cleanResponse'](_0xf904c4) {
        if (!_0xf904c4)
            return null;
        let _0x62ff15 = _0xf904c4['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x62ff15['length'] > 0x7d0) {
            _0x62ff15 = _0x62ff15['slice'](0x0, 0x7d0) + '...';
        }
        return _0x62ff15;
    }
    ['getHistory'](_0x29b436) {
        const _0x568509 = this['history']['get'](_0x29b436) || [];
        const _0x218411 = this['config']['maxHistory'] || 0xf;
        return _0x568509['slice'](-_0x218411);
    }
    ['addToHistory'](_0x4e5ccc, _0xbd7779, _0x3650a2) {
        if (!this['history']['has'](_0x4e5ccc)) {
            this['history']['set'](_0x4e5ccc, []);
        }
        const _0x5c5427 = this['history']['get'](_0x4e5ccc);
        _0x5c5427['push']('User:\x20' + _0xbd7779);
        _0x5c5427['push']('Nova:\x20' + _0x3650a2);
        const _0x14cacf = this['config']['maxHistory'] || 0xf;
        if (_0x5c5427['length'] > _0x14cacf * 0x2) {
            this['history']['set'](_0x4e5ccc, _0x5c5427['slice'](-_0x14cacf * 0x2));
        }
    }
    ['clearHistory'](_0xc0ded3) {
        if (_0xc0ded3) {
            this['history']['delete'](_0xc0ded3);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x2600cd, _0x218dfa) {
        if (_0x2600cd) {
            this['contextCache']['set'](_0x2600cd, _0x218dfa);
        } else {
            this['config']['customContext'] = _0x218dfa;
            _0x0_0x4d4ac0['set']('customContext', _0x218dfa);
        }
    }
    ['getContext'](_0x271318) {
        return this['contextCache']['get'](_0x271318) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x3cc5c1, _0x265f7e) {
        return new Promise((_0x263ae8, _0x4b8e54) => {
            const _0x4916cc = setTimeout(() => {
                _0x4b8e54(new Error('Request\x20timeout\x20after\x20' + _0x265f7e + 'ms'));
            }, _0x265f7e);
            _0x3cc5c1()['then'](_0x2313e1 => {
                clearTimeout(_0x4916cc);
                _0x263ae8(_0x2313e1);
            })['catch'](_0x5f17bf => {
                clearTimeout(_0x4916cc);
                _0x4b8e54(_0x5f17bf);
            });
        });
    }
}
export default new ChatbotService();