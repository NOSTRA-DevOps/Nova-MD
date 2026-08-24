import _0x0_0x2b3cf5 from 'node-fetch';
import _0x0_0x577ce5 from './chatbotConfig.js';
import _0x0_0x42fdce from './commandHandler.js';
import _0x0_0x4198a5 from '../config.js';
import { GoogleGenAI } from '@google/genai';
import _0x0_0x1da2cd from 'openai';
import _0x0_0x4c92d6 from 'dotenv';
_0x0_0x4c92d6['config']();
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
        const _0x4e1d5f = Array['from'](_0x0_0x42fdce['commands']['values']());
        const _0xa8c4b5 = {};
        for (const _0x5e4172 of _0x4e1d5f) {
            const _0x54c158 = _0x5e4172['category'] || 'misc';
            if (!_0xa8c4b5[_0x54c158])
                _0xa8c4b5[_0x54c158] = [];
            _0xa8c4b5[_0x54c158]['push']({
                'name': _0x5e4172['command'],
                'description': _0x5e4172['description'] || 'No\x20description',
                'aliases': _0x5e4172['aliases'] || [],
                'usage': _0x5e4172['usage'] || '.' + _0x5e4172['command']
            });
        }
        let _0x525970 = '';
        for (const [_0x396367, _0x30fb93] of Object['entries'](_0xa8c4b5)) {
            _0x525970 += '\x0a' + _0x396367['toUpperCase']() + ':\x0a';
            for (const _0x1f38e9 of _0x30fb93) {
                _0x525970 += '-\x20' + _0x1f38e9['name'] + ':\x20' + _0x1f38e9['description'];
                if (_0x1f38e9['aliases']['length']) {
                    _0x525970 += '\x20(aliases:\x20' + _0x1f38e9['aliases']['join'](',\x20') + ')';
                }
                _0x525970 += '\x0a';
            }
        }
        return _0x525970;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x577ce5['config'] || {
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
    async ['getResponse'](_0x7bfe3b, _0x4be422, _0x39e899, _0x3e78ca = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x7bfe3b);
        console['log']('📝\x20Chat\x20ID:', _0x4be422);
        console['log']('📝\x20Sender\x20ID:', _0x39e899);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x1ed103 = this['cleanMessage'](_0x7bfe3b);
            console['log']('📝\x20Clean\x20message:', _0x1ed103);
            if (!_0x1ed103 || _0x1ed103['length'] < 0x1) {
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
                const _0x425aaf = await this['intelligentCommandDetection'](_0x1ed103);
                if (_0x425aaf && _0x425aaf['isCommand'] && _0x425aaf['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x425aaf['command']);
                    const _0x563476 = await this['executeCommand'](_0x425aaf['command'], _0x425aaf['args'] || [], _0x4be422, _0x39e899, _0x3e78ca);
                    if (_0x563476['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x563476['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x563476['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x425aaf['command'] + '`.\x20' + (_0x563476['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x23d060 = await this['generateNaturalResponse'](_0x1ed103, _0x4be422, _0x39e899);
            console['log']('✅\x20Response\x20generated:', _0x23d060);
            return _0x23d060;
        } catch (_0x5ab244) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x5ab244);
            console['error']('❌\x20Stack\x20trace:', _0x5ab244['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20Pollinations\x20avec\x20`.cbc\x20provider\x20pollinations`';
    }
    async ['intelligentCommandDetection'](_0x2cd97f) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x2cd97f);
        try {
            const _0x91edb0 = this['buildCommandDetectionPrompt'](_0x2cd97f);
            const _0x276b26 = this['config']['provider'] || 'pollinations';
            const _0x24830c = this['providers'][_0x276b26];
            if (!_0x24830c) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x2cd97f);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x276b26);
            const _0x5a765c = await this['_callWithTimeout'](() => _0x24830c(_0x91edb0, { 'isCommandDetection': !![] }, {}), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x5a765c);
            const _0x1d5328 = _0x5a765c['match'](/\{[\s\S]*\}/);
            if (_0x1d5328) {
                try {
                    const _0x1a7c6d = JSON['parse'](_0x1d5328[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x1a7c6d);
                    if (_0x1a7c6d['isCommand'] && _0x1a7c6d['command']) {
                        if (_0x0_0x42fdce['commands']['has'](_0x1a7c6d['command'])) {
                            return _0x1a7c6d;
                        }
                        const _0x4444f4 = this['findSimilarCommand'](_0x1a7c6d['command']);
                        if (_0x4444f4 && _0x0_0x42fdce['commands']['has'](_0x4444f4)) {
                            _0x1a7c6d['command'] = _0x4444f4;
                            _0x1a7c6d['suggested'] = !![];
                            return _0x1a7c6d;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x1a7c6d;
                } catch (_0x262dca) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x262dca);
                }
            }
            return this['simpleKeywordDetection'](_0x2cd97f);
        } catch (_0x4942cb) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x4942cb);
            return this['simpleKeywordDetection'](_0x2cd97f);
        }
    }
    ['buildCommandDetectionPrompt'](_0x4d92c0) {
        const _0x4984d2 = Array['from'](_0x0_0x42fdce['commands']['values']());
        let _0x2911ba = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x16e361 of _0x4984d2) {
            _0x2911ba += '-\x20' + _0x16e361['command'];
            if (_0x16e361['aliases'] && _0x16e361['aliases']['length']) {
                _0x2911ba += '\x20(alias:\x20' + _0x16e361['aliases']['join'](',\x20') + ')';
            }
            _0x2911ba += ':\x20' + (_0x16e361['description'] || 'Pas\x20de\x20description');
            if (_0x16e361['usage']) {
                _0x2911ba += '\x20[Utilisation:\x20' + _0x16e361['usage'] + ']';
            }
            _0x2911ba += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x2911ba + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x4d92c0 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x244d0b) {
        const _0x2a61e9 = _0x244d0b['toLowerCase']();
        const _0x29f19e = {
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
        let _0x5f378f = null;
        let _0x5c17e7 = 0x0;
        for (const [_0x2132bf, _0x51fa64] of Object['entries'](_0x29f19e)) {
            let _0x721391 = 0x0;
            for (const _0x1cf5c8 of _0x51fa64) {
                if (_0x2a61e9['includes'](_0x1cf5c8)) {
                    _0x721391 += _0x1cf5c8['length'] / 0x5;
                }
            }
            if (_0x721391 > _0x5c17e7 && _0x721391 > 0x1) {
                _0x5c17e7 = _0x721391;
                _0x5f378f = _0x2132bf;
            }
        }
        if (_0x5f378f) {
            const _0x4d300f = this['extractArgs'](_0x244d0b);
            return {
                'isCommand': !![],
                'command': _0x5f378f,
                'args': _0x4d300f,
                'confidence': _0x5c17e7 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x5f378f
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x202c53) {
        const _0x20bfc8 = [];
        const _0x199b03 = _0x202c53['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x199b03)
            _0x20bfc8['push'](..._0x199b03);
        const _0x185206 = _0x202c53['match'](/\d+/g);
        if (_0x185206)
            _0x20bfc8['push'](..._0x185206);
        const _0x2902d2 = _0x202c53['match'](/"([^"]*)"/g);
        if (_0x2902d2)
            _0x20bfc8['push'](..._0x2902d2['map'](_0x45fa51 => _0x45fa51['replace'](/"/g, '')));
        const _0x3b33f9 = _0x202c53['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x3b33f9 && _0x3b33f9[0x1]) {
            _0x20bfc8['push'](_0x3b33f9[0x1]['trim']());
        }
        return _0x20bfc8;
    }
    ['findSimilarCommand'](_0x270291) {
        const _0x3905fa = Array['from'](_0x0_0x42fdce['commands']['keys']());
        const _0x2b6f94 = _0x3905fa['filter'](_0x184428 => _0x184428['includes'](_0x270291) || _0x270291['includes'](_0x184428) || this['levenshteinDistance'](_0x184428, _0x270291) < 0x3);
        return _0x2b6f94[0x0] || null;
    }
    ['levenshteinDistance'](_0x365721, _0x2800e4) {
        const _0x18a78a = [];
        for (let _0xbf19ec = 0x0; _0xbf19ec <= _0x2800e4['length']; _0xbf19ec++) {
            _0x18a78a[_0xbf19ec] = [_0xbf19ec];
        }
        for (let _0x11491f = 0x0; _0x11491f <= _0x365721['length']; _0x11491f++) {
            _0x18a78a[0x0][_0x11491f] = _0x11491f;
        }
        for (let _0x5d6c4e = 0x1; _0x5d6c4e <= _0x2800e4['length']; _0x5d6c4e++) {
            for (let _0xd80388 = 0x1; _0xd80388 <= _0x365721['length']; _0xd80388++) {
                if (_0x2800e4[_0x5d6c4e - 0x1] === _0x365721[_0xd80388 - 0x1]) {
                    _0x18a78a[_0x5d6c4e][_0xd80388] = _0x18a78a[_0x5d6c4e - 0x1][_0xd80388 - 0x1];
                } else {
                    _0x18a78a[_0x5d6c4e][_0xd80388] = Math['min'](_0x18a78a[_0x5d6c4e - 0x1][_0xd80388 - 0x1] + 0x1, _0x18a78a[_0x5d6c4e][_0xd80388 - 0x1] + 0x1, _0x18a78a[_0x5d6c4e - 0x1][_0xd80388] + 0x1);
                }
            }
        }
        return _0x18a78a[_0x2800e4['length']][_0x365721['length']];
    }
    async ['executeCommand'](_0x9d07a1, _0x263cb7, _0x2e1909, _0x3d427a, _0x3523f9) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x9d07a1, _0x263cb7);
            const _0x250ec8 = _0x0_0x42fdce['commands']['get'](_0x9d07a1);
            if (!_0x250ec8) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x5053ee = _0x3523f9['isOwnerOrSudo'] || ![];
            const _0x49d1bb = _0x3523f9['isFromMe'] || ![];
            const _0x5125ce = _0x2e1909['endsWith']('@g.us');
            if (_0x250ec8['ownerOnly'] && !_0x5053ee && !_0x49d1bb) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x250ec8['groupOnly'] && !_0x5125ce) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x3fbab4 = {
                'key': {
                    'remoteJid': _0x2e1909,
                    'participant': _0x3d427a
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x9d07a1 + '\x20' + _0x263cb7['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x3523f9['pushName'] || 'User'
            };
            await _0x250ec8['handler'](_0x3523f9['sock'], _0x3fbab4, _0x263cb7, {
                'chatId': _0x2e1909,
                'senderId': _0x3d427a,
                'isGroup': _0x5125ce,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x9d07a1 + '\x20' + _0x263cb7['join']('\x20'),
                'messageText': _0x9d07a1 + '\x20' + _0x263cb7['join']('\x20'),
                'userMessage': _0x9d07a1 + '\x20' + _0x263cb7['join']('\x20'),
                'config': _0x0_0x4198a5
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x9d07a1 + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x266f8d) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x266f8d);
            return {
                'success': ![],
                'error': _0x266f8d['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x4b935b, _0x4a03d4, _0x347834) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x4b935b);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x309c4f = this['buildConversationContext'](_0x4b935b, _0x4a03d4);
            console['log']('📝\x20Context\x20built,\x20length:', _0x309c4f['length']);
            const _0x1c23f7 = this['config']['provider'] || 'pollinations';
            const _0x1bfd8c = this['providers'][_0x1c23f7];
            if (!_0x1bfd8c) {
                console['error']('❌\x20Provider\x20' + _0x1c23f7 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x1c23f7);
            const _0x36a0e9 = await this['_callWithTimeout'](() => _0x1bfd8c(_0x4b935b, _0x309c4f, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x36a0e9);
            const _0xad51a3 = this['cleanResponse'](_0x36a0e9);
            this['addToHistory'](_0x4a03d4, _0x4b935b, _0xad51a3);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0xad51a3);
            return _0xad51a3 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x2ad9d5) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x2ad9d5);
            console['error']('❌\x20Stack\x20trace:', _0x2ad9d5['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x57bf13, _0xea59d4) {
        let _0x36d467 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x36d467 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0xcca291 = this['getHistory'](_0xea59d4);
        if (_0xcca291 && _0xcca291['length'] > 0x0) {
            _0x36d467 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0xcca291['join']('\x0a');
        }
        _0x36d467 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x57bf13 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x36d467;
    }
    async ['_callPollinations'](_0x5c8aa2, _0x1c559a, _0x172beb) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x5c8aa2);
        const _0x51396b = 'https://text.pollinations.ai/openai';
        try {
            const _0x3d6e5a = await _0x0_0x2b3cf5(_0x51396b, {
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
                            'content': _0x1c559a
                        },
                        {
                            'role': 'user',
                            'content': _0x5c8aa2
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x3d6e5a['status']);
            if (!_0x3d6e5a['ok']) {
                const _0x1ae39b = await _0x3d6e5a['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x1ae39b);
                return this['config']['fallbackResponse'];
            }
            const _0x2fefa1 = await _0x3d6e5a['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x44b352 = _0x2fefa1['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x44b352);
            return this['cleanResponse'](_0x44b352) || this['config']['fallbackResponse'];
        } catch (_0x37bb7b) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x37bb7b['message']);
            console['error']('❌\x20Stack:', _0x37bb7b['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x489832, _0x3d7f80, _0x4d103c) {
        console['log']('🌐\x20Calling\x20Grok\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x489832);
        const _0xf48283 = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0xf48283) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client\x20for\x20xAI...');
            const _0x4b2f11 = new _0x0_0x1da2cd({
                'apiKey': _0xf48283,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0xef4bd5 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0xef4bd5);
            console['log']('📡\x20Sending\x20request\x20to\x20Grok...');
            const _0xd47e86 = await _0x4b2f11['chat']['completions']['create']({
                'model': _0xef4bd5,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x3d7f80
                    },
                    {
                        'role': 'user',
                        'content': _0x489832
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x4e6a3e = _0xd47e86['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            console['log']('📝\x20Result:', _0x4e6a3e);
            return this['cleanResponse'](_0x4e6a3e) || this['config']['fallbackResponse'];
        } catch (_0x46ce69) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x46ce69['message']);
            console['error']('❌\x20Stack:', _0x46ce69['stack']);
            if (_0x46ce69['message']['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x46ce69['message']['includes']('model')) {
                return '❌\x20Modèle\x20Grok\x20non\x20disponible.\x20Vérifiez\x20votre\x20clé\x20API\x20et\x20les\x20modèles\x20disponibles.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x3901ca, _0x5e4f3c, _0x2e7559) {
        console['log']('🌐\x20Calling\x20Gemini\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x3901ca);
        const _0x2ff590 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x2ff590) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20GoogleGenAI\x20client...');
            const _0x7c450e = new GoogleGenAI({ 'apiKey': _0x2ff590 });
            const _0x8aad69 = 'gemini-2.0-flash-exp';
            console['log']('📡\x20Using\x20model:\x20' + _0x8aad69);
            console['log']('📡\x20Sending\x20request\x20to\x20Gemini...');
            const _0x3534fd = await _0x7c450e['interactions']['create']({
                'model': _0x8aad69,
                'input': _0x5e4f3c + '\x0a\x0aUser:\x20' + _0x3901ca + '\x0a\x0aAssistant:',
                'config': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            });
            const _0x3fb352 = _0x3534fd['output_text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            console['log']('📝\x20Result:', _0x3fb352);
            return this['cleanResponse'](_0x3fb352) || this['config']['fallbackResponse'];
        } catch (_0x5036a5) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x5036a5['message']);
            console['error']('❌\x20Stack:', _0x5036a5['stack']);
            if (_0x5036a5['message']['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez\x20votre\x20clé\x20sur\x20https://console.cloud.google.com/';
            }
            if (_0x5036a5['message']['includes']('not\x20enabled')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x5036a5['message']['includes']('quota')) {
                return '❌\x20Quota\x20Gemini\x20épuisé.\x20Attendez\x20ou\x20augmentez\x20vos\x20quotas.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x22ad33, _0x1ebc29, _0x28923e) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x22ad33);
        const _0x9b3f6 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x9b3f6) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x2ce00e = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x5b370c = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Puter...');
            const _0xed5da7 = await _0x0_0x2b3cf5(_0x2ce00e, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x9b3f6
                },
                'body': JSON['stringify']({
                    'model': _0x5b370c,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x1ebc29
                        },
                        {
                            'role': 'user',
                            'content': _0x22ad33
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Puter\x20response\x20status:', _0xed5da7['status']);
            if (!_0xed5da7['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0xed5da7['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x234ce0 = await _0xed5da7['json']();
            const _0x235678 = _0x234ce0['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x235678) || this['config']['fallbackResponse'];
        } catch (_0x4744e6) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x4744e6['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x358b7b, _0x367ba3, _0x34d84a) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x358b7b);
        const _0x3d5a3c = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x3d5a3c) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client...');
            const _0x37144b = new _0x0_0x1da2cd({ 'apiKey': _0x3d5a3c });
            console['log']('📡\x20Sending\x20request\x20to\x20OpenAI...');
            const _0x3532ce = await _0x37144b['chat']['completions']['create']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x367ba3
                    },
                    {
                        'role': 'user',
                        'content': _0x358b7b
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0xccbd3e = _0x3532ce['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            console['log']('📝\x20Result:', _0xccbd3e);
            return this['cleanResponse'](_0xccbd3e) || this['config']['fallbackResponse'];
        } catch (_0x1e9b6e) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x1e9b6e['message']);
            console['error']('❌\x20Stack:', _0x1e9b6e['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x73613a, _0x2ffc0d, _0x46c5bd) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x73613a);
        const _0x160b03 = this['config']['apiUrl'];
        if (!_0x160b03) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Custom\x20API...');
            const _0x3868fb = await _0x0_0x2b3cf5(_0x160b03, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x73613a,
                    'context': _0x2ffc0d,
                    'metadata': _0x46c5bd
                })
            });
            console['log']('📡\x20Custom\x20API\x20response\x20status:', _0x3868fb['status']);
            if (!_0x3868fb['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x3868fb['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x200ee6 = await _0x3868fb['json']();
            const _0x5c7f3b = _0x200ee6['response'] || _0x200ee6['reply'] || _0x200ee6['text'] || _0x200ee6['result'];
            return this['cleanResponse'](_0x5c7f3b) || this['config']['fallbackResponse'];
        } catch (_0x30ce23) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x30ce23['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x2f6db7) {
        const _0x215a98 = 'Nova';
        const _0x13f5a8 = [
            new RegExp('^' + _0x215a98 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x215a98 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x215a98 + ',?\x5cs+', 'i')
        ];
        let _0x47ef67 = _0x2f6db7;
        for (const _0x29849c of _0x13f5a8) {
            _0x47ef67 = _0x47ef67['replace'](_0x29849c, '')['trim']();
        }
        return _0x47ef67;
    }
    ['cleanResponse'](_0x3faa2d) {
        if (!_0x3faa2d)
            return null;
        let _0x263dc8 = _0x3faa2d['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x263dc8['length'] > 0x7d0) {
            _0x263dc8 = _0x263dc8['slice'](0x0, 0x7d0) + '...';
        }
        return _0x263dc8;
    }
    ['getHistory'](_0x2f316e) {
        const _0x241587 = this['history']['get'](_0x2f316e) || [];
        const _0x3fddfb = this['config']['maxHistory'] || 0xf;
        return _0x241587['slice'](-_0x3fddfb);
    }
    ['addToHistory'](_0x5369d9, _0x5a2070, _0x4b2c57) {
        if (!this['history']['has'](_0x5369d9)) {
            this['history']['set'](_0x5369d9, []);
        }
        const _0x2393b3 = this['history']['get'](_0x5369d9);
        _0x2393b3['push']('User:\x20' + _0x5a2070);
        _0x2393b3['push']('Nova:\x20' + _0x4b2c57);
        const _0x2c6c95 = this['config']['maxHistory'] || 0xf;
        if (_0x2393b3['length'] > _0x2c6c95 * 0x2) {
            this['history']['set'](_0x5369d9, _0x2393b3['slice'](-_0x2c6c95 * 0x2));
        }
    }
    ['clearHistory'](_0x41cc82) {
        if (_0x41cc82) {
            this['history']['delete'](_0x41cc82);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x24286e, _0x40c677) {
        if (_0x24286e) {
            this['contextCache']['set'](_0x24286e, _0x40c677);
        } else {
            this['config']['customContext'] = _0x40c677;
            _0x0_0x577ce5['set']('customContext', _0x40c677);
        }
    }
    ['getContext'](_0x3234de) {
        return this['contextCache']['get'](_0x3234de) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x5a1ba2, _0x47b939) {
        return new Promise((_0xba92a8, _0x30c262) => {
            const _0x3e0402 = setTimeout(() => {
                _0x30c262(new Error('Request\x20timeout\x20after\x20' + _0x47b939 + 'ms'));
            }, _0x47b939);
            _0x5a1ba2()['then'](_0x5ad2c7 => {
                clearTimeout(_0x3e0402);
                _0xba92a8(_0x5ad2c7);
            })['catch'](_0x3add19 => {
                clearTimeout(_0x3e0402);
                _0x30c262(_0x3add19);
            });
        });
    }
}
export default new ChatbotService();