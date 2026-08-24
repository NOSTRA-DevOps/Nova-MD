import _0x0_0x57e0c4 from 'node-fetch';
import _0x0_0x3e3774 from './chatbotConfig.js';
import _0x0_0x15bee2 from './commandHandler.js';
import _0x0_0x95a5b6 from '../config.js';
import { GoogleGenAI } from '@google/genai';
import _0x0_0x226bdf from 'openai';
import _0x0_0x1912b8 from 'dotenv';
_0x0_0x1912b8['config']();
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
        const _0x23b6b8 = Array['from'](_0x0_0x15bee2['commands']['values']());
        const _0x141c7c = {};
        for (const _0x2ceb2c of _0x23b6b8) {
            const _0x49d711 = _0x2ceb2c['category'] || 'misc';
            if (!_0x141c7c[_0x49d711])
                _0x141c7c[_0x49d711] = [];
            _0x141c7c[_0x49d711]['push']({
                'name': _0x2ceb2c['command'],
                'description': _0x2ceb2c['description'] || 'No\x20description',
                'aliases': _0x2ceb2c['aliases'] || [],
                'usage': _0x2ceb2c['usage'] || '.' + _0x2ceb2c['command']
            });
        }
        let _0x5a5057 = '';
        for (const [_0x1ee07a, _0x53a09e] of Object['entries'](_0x141c7c)) {
            _0x5a5057 += '\x0a' + _0x1ee07a['toUpperCase']() + ':\x0a';
            for (const _0x547cc3 of _0x53a09e) {
                _0x5a5057 += '-\x20' + _0x547cc3['name'] + ':\x20' + _0x547cc3['description'];
                if (_0x547cc3['aliases']['length']) {
                    _0x5a5057 += '\x20(aliases:\x20' + _0x547cc3['aliases']['join'](',\x20') + ')';
                }
                _0x5a5057 += '\x0a';
            }
        }
        return _0x5a5057;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x3e3774['config'] || {
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
    async ['getResponse'](_0x1ee981, _0x1da559, _0x429659, _0x12801f = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x1ee981);
        console['log']('📝\x20Chat\x20ID:', _0x1da559);
        console['log']('📝\x20Sender\x20ID:', _0x429659);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0x367f45 = this['cleanMessage'](_0x1ee981);
            console['log']('📝\x20Clean\x20message:', _0x367f45);
            if (!_0x367f45 || _0x367f45['length'] < 0x1) {
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
                const _0x280a91 = await this['intelligentCommandDetection'](_0x367f45);
                if (_0x280a91 && _0x280a91['isCommand'] && _0x280a91['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x280a91['command']);
                    const _0x2e590d = await this['executeCommand'](_0x280a91['command'], _0x280a91['args'] || [], _0x1da559, _0x429659, _0x12801f);
                    if (_0x2e590d['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x2e590d['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x2e590d['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x280a91['command'] + '`.\x20' + (_0x2e590d['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x25919d = await this['generateNaturalResponse'](_0x367f45, _0x1da559, _0x429659);
            console['log']('✅\x20Response\x20generated:', _0x25919d);
            return _0x25919d;
        } catch (_0x1a7e5f) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x1a7e5f);
            console['error']('❌\x20Stack\x20trace:', _0x1a7e5f['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20Pollinations\x20avec\x20`.cbc\x20provider\x20pollinations`';
    }
    async ['intelligentCommandDetection'](_0x31cac0) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x31cac0);
        try {
            const _0x289f0a = this['buildCommandDetectionPrompt'](_0x31cac0);
            const _0x50fafb = this['config']['provider'] || 'pollinations';
            const _0x17278e = this['providers'][_0x50fafb];
            if (!_0x17278e) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x31cac0);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x50fafb);
            const _0xa7d86b = await this['_callWithTimeout'](() => _0x17278e(_0x289f0a, { 'isCommandDetection': !![] }, {}), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0xa7d86b);
            const _0x4834ec = _0xa7d86b['match'](/\{[\s\S]*\}/);
            if (_0x4834ec) {
                try {
                    const _0x3ad9b6 = JSON['parse'](_0x4834ec[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x3ad9b6);
                    if (_0x3ad9b6['isCommand'] && _0x3ad9b6['command']) {
                        if (_0x0_0x15bee2['commands']['has'](_0x3ad9b6['command'])) {
                            return _0x3ad9b6;
                        }
                        const _0xe11a31 = this['findSimilarCommand'](_0x3ad9b6['command']);
                        if (_0xe11a31 && _0x0_0x15bee2['commands']['has'](_0xe11a31)) {
                            _0x3ad9b6['command'] = _0xe11a31;
                            _0x3ad9b6['suggested'] = !![];
                            return _0x3ad9b6;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x3ad9b6;
                } catch (_0x32f660) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x32f660);
                }
            }
            return this['simpleKeywordDetection'](_0x31cac0);
        } catch (_0x367d3a) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x367d3a);
            return this['simpleKeywordDetection'](_0x31cac0);
        }
    }
    ['buildCommandDetectionPrompt'](_0x14c25c) {
        const _0x20bc45 = Array['from'](_0x0_0x15bee2['commands']['values']());
        let _0x509f1e = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x38a7b5 of _0x20bc45) {
            _0x509f1e += '-\x20' + _0x38a7b5['command'];
            if (_0x38a7b5['aliases'] && _0x38a7b5['aliases']['length']) {
                _0x509f1e += '\x20(alias:\x20' + _0x38a7b5['aliases']['join'](',\x20') + ')';
            }
            _0x509f1e += ':\x20' + (_0x38a7b5['description'] || 'Pas\x20de\x20description');
            if (_0x38a7b5['usage']) {
                _0x509f1e += '\x20[Utilisation:\x20' + _0x38a7b5['usage'] + ']';
            }
            _0x509f1e += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x509f1e + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x14c25c + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x25d720) {
        const _0x46eb22 = _0x25d720['toLowerCase']();
        const _0x230c0d = {
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
        let _0xa42957 = null;
        let _0x376798 = 0x0;
        for (const [_0x348b73, _0x4769c8] of Object['entries'](_0x230c0d)) {
            let _0x2ef671 = 0x0;
            for (const _0x150f51 of _0x4769c8) {
                if (_0x46eb22['includes'](_0x150f51)) {
                    _0x2ef671 += _0x150f51['length'] / 0x5;
                }
            }
            if (_0x2ef671 > _0x376798 && _0x2ef671 > 0x1) {
                _0x376798 = _0x2ef671;
                _0xa42957 = _0x348b73;
            }
        }
        if (_0xa42957) {
            const _0x5d0d63 = this['extractArgs'](_0x25d720);
            return {
                'isCommand': !![],
                'command': _0xa42957,
                'args': _0x5d0d63,
                'confidence': _0x376798 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0xa42957
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x29b174) {
        const _0x4a35f0 = [];
        const _0x35bbdc = _0x29b174['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x35bbdc)
            _0x4a35f0['push'](..._0x35bbdc);
        const _0x118897 = _0x29b174['match'](/\d+/g);
        if (_0x118897)
            _0x4a35f0['push'](..._0x118897);
        const _0x4b5550 = _0x29b174['match'](/"([^"]*)"/g);
        if (_0x4b5550)
            _0x4a35f0['push'](..._0x4b5550['map'](_0x351050 => _0x351050['replace'](/"/g, '')));
        const _0x52a5ab = _0x29b174['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x52a5ab && _0x52a5ab[0x1]) {
            _0x4a35f0['push'](_0x52a5ab[0x1]['trim']());
        }
        return _0x4a35f0;
    }
    ['findSimilarCommand'](_0x1c932a) {
        const _0x18ea9a = Array['from'](_0x0_0x15bee2['commands']['keys']());
        const _0x1672b6 = _0x18ea9a['filter'](_0x2003b4 => _0x2003b4['includes'](_0x1c932a) || _0x1c932a['includes'](_0x2003b4) || this['levenshteinDistance'](_0x2003b4, _0x1c932a) < 0x3);
        return _0x1672b6[0x0] || null;
    }
    ['levenshteinDistance'](_0x1d2b8c, _0x2fc145) {
        const _0xdd66f3 = [];
        for (let _0x96d7fc = 0x0; _0x96d7fc <= _0x2fc145['length']; _0x96d7fc++) {
            _0xdd66f3[_0x96d7fc] = [_0x96d7fc];
        }
        for (let _0x14e38d = 0x0; _0x14e38d <= _0x1d2b8c['length']; _0x14e38d++) {
            _0xdd66f3[0x0][_0x14e38d] = _0x14e38d;
        }
        for (let _0x1e8d5a = 0x1; _0x1e8d5a <= _0x2fc145['length']; _0x1e8d5a++) {
            for (let _0x512231 = 0x1; _0x512231 <= _0x1d2b8c['length']; _0x512231++) {
                if (_0x2fc145[_0x1e8d5a - 0x1] === _0x1d2b8c[_0x512231 - 0x1]) {
                    _0xdd66f3[_0x1e8d5a][_0x512231] = _0xdd66f3[_0x1e8d5a - 0x1][_0x512231 - 0x1];
                } else {
                    _0xdd66f3[_0x1e8d5a][_0x512231] = Math['min'](_0xdd66f3[_0x1e8d5a - 0x1][_0x512231 - 0x1] + 0x1, _0xdd66f3[_0x1e8d5a][_0x512231 - 0x1] + 0x1, _0xdd66f3[_0x1e8d5a - 0x1][_0x512231] + 0x1);
                }
            }
        }
        return _0xdd66f3[_0x2fc145['length']][_0x1d2b8c['length']];
    }
    async ['executeCommand'](_0xdd677d, _0xf2636c, _0x102491, _0x1d0840, _0x1469fb) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0xdd677d, _0xf2636c);
            const _0x5f82bc = _0x0_0x15bee2['commands']['get'](_0xdd677d);
            if (!_0x5f82bc) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x580961 = _0x1469fb['isOwnerOrSudo'] || ![];
            const _0x5b1633 = _0x1469fb['isFromMe'] || ![];
            const _0x3ba72b = _0x102491['endsWith']('@g.us');
            if (_0x5f82bc['ownerOnly'] && !_0x580961 && !_0x5b1633) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x5f82bc['groupOnly'] && !_0x3ba72b) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x15053f = {
                'key': {
                    'remoteJid': _0x102491,
                    'participant': _0x1d0840
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0xdd677d + '\x20' + _0xf2636c['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x1469fb['pushName'] || 'User'
            };
            await _0x5f82bc['handler'](_0x1469fb['sock'], _0x15053f, _0xf2636c, {
                'chatId': _0x102491,
                'senderId': _0x1d0840,
                'isGroup': _0x3ba72b,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0xdd677d + '\x20' + _0xf2636c['join']('\x20'),
                'messageText': _0xdd677d + '\x20' + _0xf2636c['join']('\x20'),
                'userMessage': _0xdd677d + '\x20' + _0xf2636c['join']('\x20'),
                'config': _0x0_0x95a5b6
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0xdd677d + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x44bfd0) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x44bfd0);
            return {
                'success': ![],
                'error': _0x44bfd0['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x19e72f, _0x25c91c, _0x12e383) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x19e72f);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x90ab86 = this['buildConversationContext'](_0x19e72f, _0x25c91c);
            console['log']('📝\x20Context\x20built,\x20length:', _0x90ab86['length']);
            const _0x5b681b = this['config']['provider'] || 'pollinations';
            const _0x1b0da4 = this['providers'][_0x5b681b];
            if (!_0x1b0da4) {
                console['error']('❌\x20Provider\x20' + _0x5b681b + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x5b681b);
            const _0x4a57b3 = await this['_callWithTimeout'](() => _0x1b0da4(_0x19e72f, _0x90ab86, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x4a57b3);
            const _0x118314 = this['cleanResponse'](_0x4a57b3);
            this['addToHistory'](_0x25c91c, _0x19e72f, _0x118314);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x118314);
            return _0x118314 || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0xbc361) {
            console['error']('❌\x20Natural\x20response\x20error:', _0xbc361);
            console['error']('❌\x20Stack\x20trace:', _0xbc361['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x5f27c1, _0x19b47c) {
        let _0x3b4d98 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x3b4d98 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x411969 = this['getHistory'](_0x19b47c);
        if (_0x411969 && _0x411969['length'] > 0x0) {
            _0x3b4d98 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x411969['join']('\x0a');
        }
        _0x3b4d98 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0x5f27c1 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x3b4d98;
    }
    async ['_callPollinations'](_0x4265fa, _0x48a2b5, _0xc5743f) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x4265fa);
        const _0x36a268 = 'https://text.pollinations.ai/openai';
        try {
            const _0x18052f = await _0x0_0x57e0c4(_0x36a268, {
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
                            'content': _0x48a2b5
                        },
                        {
                            'role': 'user',
                            'content': _0x4265fa
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x18052f['status']);
            if (!_0x18052f['ok']) {
                const _0x25ba2f = await _0x18052f['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0x25ba2f);
                return this['config']['fallbackResponse'];
            }
            const _0x3dc9fa = await _0x18052f['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x3cdcdd = _0x3dc9fa['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x3cdcdd);
            return this['cleanResponse'](_0x3cdcdd) || this['config']['fallbackResponse'];
        } catch (_0x175ef5) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x175ef5['message']);
            console['error']('❌\x20Stack:', _0x175ef5['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x4d5f20, _0x1032a9, _0x3e9b4e) {
        console['log']('🌐\x20Calling\x20Grok\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x4d5f20);
        const _0x23b31a = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0x23b31a) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client\x20for\x20xAI...');
            const _0xe74c78 = new _0x0_0x226bdf({
                'apiKey': _0x23b31a,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x2b773c = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x2b773c);
            console['log']('📡\x20Sending\x20request\x20to\x20Grok...');
            const _0x953588 = await _0xe74c78['chat']['completions']['create']({
                'model': _0x2b773c,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x1032a9
                    },
                    {
                        'role': 'user',
                        'content': _0x4d5f20
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x2f198c = _0x953588['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            console['log']('📝\x20Result:', _0x2f198c);
            return this['cleanResponse'](_0x2f198c) || this['config']['fallbackResponse'];
        } catch (_0x220f8e) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x220f8e['message']);
            console['error']('❌\x20Stack:', _0x220f8e['stack']);
            if (_0x220f8e['message']['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x220f8e['message']['includes']('model')) {
                return '❌\x20Modèle\x20Grok\x20non\x20disponible.\x20Vérifiez\x20votre\x20clé\x20API\x20et\x20les\x20modèles\x20disponibles.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x27ee7d, _0x4a9655, _0x18c23a) {
        console['log']('🌐\x20Calling\x20Gemini\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x27ee7d);
        const _0x5c01e6 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x5c01e6) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20GoogleGenAI\x20client...');
            const _0x408cbe = new GoogleGenAI({ 'apiKey': _0x5c01e6 });
            const _0x507874 = 'gemini-2.0-flash-exp';
            console['log']('📡\x20Using\x20model:\x20' + _0x507874);
            console['log']('📡\x20Sending\x20request\x20to\x20Gemini...');
            const _0x4d2850 = await _0x408cbe['interactions']['create']({
                'model': _0x507874,
                'input': _0x4a9655 + '\x0a\x0aUser:\x20' + _0x27ee7d + '\x0a\x0aAssistant:',
                'config': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            });
            const _0x19e61e = _0x4d2850['output_text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            console['log']('📝\x20Result:', _0x19e61e);
            return this['cleanResponse'](_0x19e61e) || this['config']['fallbackResponse'];
        } catch (_0x16b7e6) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x16b7e6['message']);
            console['error']('❌\x20Stack:', _0x16b7e6['stack']);
            if (_0x16b7e6['message']['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez\x20votre\x20clé\x20sur\x20https://console.cloud.google.com/';
            }
            if (_0x16b7e6['message']['includes']('not\x20enabled')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x16b7e6['message']['includes']('quota')) {
                return '❌\x20Quota\x20Gemini\x20épuisé.\x20Attendez\x20ou\x20augmentez\x20vos\x20quotas.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x3191dc, _0x24fe08, _0x4708bb) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x3191dc);
        const _0x5a7c7f = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x5a7c7f) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x1193b9 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0xc95f21 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Puter...');
            const _0x15c31c = await _0x0_0x57e0c4(_0x1193b9, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x5a7c7f
                },
                'body': JSON['stringify']({
                    'model': _0xc95f21,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x24fe08
                        },
                        {
                            'role': 'user',
                            'content': _0x3191dc
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Puter\x20response\x20status:', _0x15c31c['status']);
            if (!_0x15c31c['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x15c31c['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x4a4f0e = await _0x15c31c['json']();
            const _0x274379 = _0x4a4f0e['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x274379) || this['config']['fallbackResponse'];
        } catch (_0x270d62) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x270d62['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x291bdd, _0x518858, _0x3f403a) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x291bdd);
        const _0x2beae5 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x2beae5) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client...');
            const _0xa6393 = new _0x0_0x226bdf({ 'apiKey': _0x2beae5 });
            console['log']('📡\x20Sending\x20request\x20to\x20OpenAI...');
            const _0x19fe6f = await _0xa6393['chat']['completions']['create']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x518858
                    },
                    {
                        'role': 'user',
                        'content': _0x291bdd
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x1633c4 = _0x19fe6f['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            console['log']('📝\x20Result:', _0x1633c4);
            return this['cleanResponse'](_0x1633c4) || this['config']['fallbackResponse'];
        } catch (_0x58afc9) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x58afc9['message']);
            console['error']('❌\x20Stack:', _0x58afc9['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x229ad9, _0x10ef99, _0x270805) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x229ad9);
        const _0x381a06 = this['config']['apiUrl'];
        if (!_0x381a06) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Custom\x20API...');
            const _0x3a1461 = await _0x0_0x57e0c4(_0x381a06, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x229ad9,
                    'context': _0x10ef99,
                    'metadata': _0x270805
                })
            });
            console['log']('📡\x20Custom\x20API\x20response\x20status:', _0x3a1461['status']);
            if (!_0x3a1461['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x3a1461['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x53e7d3 = await _0x3a1461['json']();
            const _0x58d952 = _0x53e7d3['response'] || _0x53e7d3['reply'] || _0x53e7d3['text'] || _0x53e7d3['result'];
            return this['cleanResponse'](_0x58d952) || this['config']['fallbackResponse'];
        } catch (_0x480f0c) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x480f0c['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x1c9eef) {
        const _0x16a372 = 'Nova';
        const _0x52b57c = [
            new RegExp('^' + _0x16a372 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x16a372 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x16a372 + ',?\x5cs+', 'i')
        ];
        let _0x4f298b = _0x1c9eef;
        for (const _0x5021ba of _0x52b57c) {
            _0x4f298b = _0x4f298b['replace'](_0x5021ba, '')['trim']();
        }
        return _0x4f298b;
    }
    ['cleanResponse'](_0x4ba1f1) {
        if (!_0x4ba1f1)
            return null;
        let _0x28ee20 = _0x4ba1f1['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x28ee20['length'] > 0x7d0) {
            _0x28ee20 = _0x28ee20['slice'](0x0, 0x7d0) + '...';
        }
        return _0x28ee20;
    }
    ['getHistory'](_0x9b2faa) {
        const _0x36e1da = this['history']['get'](_0x9b2faa) || [];
        const _0x9fa20 = this['config']['maxHistory'] || 0xf;
        return _0x36e1da['slice'](-_0x9fa20);
    }
    ['addToHistory'](_0x18f506, _0x39bc4e, _0x37d071) {
        if (!this['history']['has'](_0x18f506)) {
            this['history']['set'](_0x18f506, []);
        }
        const _0x132fa4 = this['history']['get'](_0x18f506);
        _0x132fa4['push']('User:\x20' + _0x39bc4e);
        _0x132fa4['push']('Nova:\x20' + _0x37d071);
        const _0x1470d0 = this['config']['maxHistory'] || 0xf;
        if (_0x132fa4['length'] > _0x1470d0 * 0x2) {
            this['history']['set'](_0x18f506, _0x132fa4['slice'](-_0x1470d0 * 0x2));
        }
    }
    ['clearHistory'](_0x18f036) {
        if (_0x18f036) {
            this['history']['delete'](_0x18f036);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x1ff354, _0x406ea0) {
        if (_0x1ff354) {
            this['contextCache']['set'](_0x1ff354, _0x406ea0);
        } else {
            this['config']['customContext'] = _0x406ea0;
            _0x0_0x3e3774['set']('customContext', _0x406ea0);
        }
    }
    ['getContext'](_0x2720d5) {
        return this['contextCache']['get'](_0x2720d5) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x1ccb73, _0x4025e1) {
        return new Promise((_0x38aaa9, _0xa3b4a4) => {
            const _0x173ee7 = setTimeout(() => {
                _0xa3b4a4(new Error('Request\x20timeout\x20after\x20' + _0x4025e1 + 'ms'));
            }, _0x4025e1);
            _0x1ccb73()['then'](_0x37327a => {
                clearTimeout(_0x173ee7);
                _0x38aaa9(_0x37327a);
            })['catch'](_0x57fb01 => {
                clearTimeout(_0x173ee7);
                _0xa3b4a4(_0x57fb01);
            });
        });
    }
}
export default new ChatbotService();