import _0x0_0x20b4a3 from 'node-fetch';
import _0x0_0x3bcbb5 from './chatbotConfig.js';
import _0x0_0x28b64c from './commandHandler.js';
import _0x0_0x1004db from '../config.js';
import { GoogleGenAI } from '@google/genai';
import _0x0_0x1923cb from 'openai';
import _0x0_0x4bbc7f from 'dotenv';
_0x0_0x4bbc7f['config']();
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
        const _0x57a437 = Array['from'](_0x0_0x28b64c['commands']['values']());
        const _0x2e0e99 = {};
        for (const _0x5a7ae8 of _0x57a437) {
            const _0x551f84 = _0x5a7ae8['category'] || 'misc';
            if (!_0x2e0e99[_0x551f84])
                _0x2e0e99[_0x551f84] = [];
            _0x2e0e99[_0x551f84]['push']({
                'name': _0x5a7ae8['command'],
                'description': _0x5a7ae8['description'] || 'No\x20description',
                'aliases': _0x5a7ae8['aliases'] || [],
                'usage': _0x5a7ae8['usage'] || '.' + _0x5a7ae8['command']
            });
        }
        let _0x4bdee6 = '';
        for (const [_0x5039b1, _0x2b0298] of Object['entries'](_0x2e0e99)) {
            _0x4bdee6 += '\x0a' + _0x5039b1['toUpperCase']() + ':\x0a';
            for (const _0x5e1f9a of _0x2b0298) {
                _0x4bdee6 += '-\x20' + _0x5e1f9a['name'] + ':\x20' + _0x5e1f9a['description'];
                if (_0x5e1f9a['aliases']['length']) {
                    _0x4bdee6 += '\x20(aliases:\x20' + _0x5e1f9a['aliases']['join'](',\x20') + ')';
                }
                _0x4bdee6 += '\x0a';
            }
        }
        return _0x4bdee6;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x3bcbb5['config'] || {
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
    async ['getResponse'](_0x3726a2, _0x148000, _0x302597, _0x80e6ff = {}) {
        console['log']('🔍\x20=====\x20CHATBOT\x20getResponse\x20CALLED\x20=====');
        console['log']('📝\x20User\x20message:', _0x3726a2);
        console['log']('📝\x20Chat\x20ID:', _0x148000);
        console['log']('📝\x20Sender\x20ID:', _0x302597);
        console['log']('📝\x20Provider:', this['config']['provider']);
        console['log']('📝\x20Enabled:', this['config']['enabled']);
        console['log']('📝\x20Has\x20API\x20key:', !!this['config']['apiKey']);
        try {
            if (!this['config']['enabled']) {
                console['log']('❌\x20Chatbot\x20is\x20disabled');
                return null;
            }
            const _0xccb4f9 = this['cleanMessage'](_0x3726a2);
            console['log']('📝\x20Clean\x20message:', _0xccb4f9);
            if (!_0xccb4f9 || _0xccb4f9['length'] < 0x1) {
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
                const _0x3b1076 = await this['intelligentCommandDetection'](_0xccb4f9);
                if (_0x3b1076 && _0x3b1076['isCommand'] && _0x3b1076['command']) {
                    console['log']('🎯\x20Command\x20detected:', _0x3b1076['command']);
                    const _0x1266e5 = await this['executeCommand'](_0x3b1076['command'], _0x3b1076['args'] || [], _0x148000, _0x302597, _0x80e6ff);
                    if (_0x1266e5['success']) {
                        console['log']('✅\x20Command\x20executed\x20successfully');
                        return _0x1266e5['message'];
                    } else {
                        console['log']('❌\x20Command\x20execution\x20failed:', _0x1266e5['error']);
                        return '❌\x20Je\x20n\x27ai\x20pas\x20pu\x20exécuter\x20la\x20commande\x20`' + _0x3b1076['command'] + '`.\x20' + (_0x1266e5['error'] || 'Erreur\x20inconnue');
                    }
                }
            }
            console['log']('💬\x20Generating\x20natural\x20response...');
            const _0x39ac24 = await this['generateNaturalResponse'](_0xccb4f9, _0x148000, _0x302597);
            console['log']('✅\x20Response\x20generated:', _0x39ac24);
            return _0x39ac24;
        } catch (_0x41e183) {
            console['error']('❌\x20Chatbot\x20service\x20error:', _0x41e183);
            console['error']('❌\x20Stack\x20trace:', _0x41e183['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20Clé\x20API\x20requise.\x20Utilisez\x20`.cbc\x20apikey\x20<votre_cle>`\x20ou\x20passez\x20à\x20Pollinations\x20avec\x20`.cbc\x20provider\x20pollinations`';
    }
    async ['intelligentCommandDetection'](_0x3d4501) {
        console['log']('🔍\x20intelligentCommandDetection\x20called\x20with:', _0x3d4501);
        try {
            const _0x1dc9b0 = this['buildCommandDetectionPrompt'](_0x3d4501);
            const _0x1adf75 = this['config']['provider'] || 'pollinations';
            const _0x1c7caf = this['providers'][_0x1adf75];
            if (!_0x1c7caf) {
                console['log']('⚠️\x20Provider\x20not\x20found,\x20using\x20simple\x20detection');
                return this['simpleKeywordDetection'](_0x3d4501);
            }
            console['log']('📡\x20Calling\x20provider\x20for\x20command\x20detection:', _0x1adf75);
            const _0x3e6ae9 = await this['_callWithTimeout'](() => _0x1c7caf(_0x1dc9b0, { 'isCommandDetection': !![] }, {}), 0x2710);
            console['log']('📡\x20Command\x20detection\x20response:', _0x3e6ae9);
            const _0x28a8de = _0x3e6ae9['match'](/\{[\s\S]*\}/);
            if (_0x28a8de) {
                try {
                    const _0x346e1c = JSON['parse'](_0x28a8de[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x346e1c);
                    if (_0x346e1c['isCommand'] && _0x346e1c['command']) {
                        if (_0x0_0x28b64c['commands']['has'](_0x346e1c['command'])) {
                            return _0x346e1c;
                        }
                        const _0x112f96 = this['findSimilarCommand'](_0x346e1c['command']);
                        if (_0x112f96 && _0x0_0x28b64c['commands']['has'](_0x112f96)) {
                            _0x346e1c['command'] = _0x112f96;
                            _0x346e1c['suggested'] = !![];
                            return _0x346e1c;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Commande\x20non\x20trouvée'
                        };
                    }
                    return _0x346e1c;
                } catch (_0x3d4a52) {
                    console['error']('❌\x20JSON\x20parse\x20error:', _0x3d4a52);
                }
            }
            return this['simpleKeywordDetection'](_0x3d4501);
        } catch (_0x38b4c8) {
            console['error']('❌\x20Intent\x20detection\x20error:', _0x38b4c8);
            return this['simpleKeywordDetection'](_0x3d4501);
        }
    }
    ['buildCommandDetectionPrompt'](_0x16c153) {
        const _0x4768ee = Array['from'](_0x0_0x28b64c['commands']['values']());
        let _0x26500e = 'COMMANDES\x20DISPONIBLES:\x0a';
        for (const _0x10bb88 of _0x4768ee) {
            _0x26500e += '-\x20' + _0x10bb88['command'];
            if (_0x10bb88['aliases'] && _0x10bb88['aliases']['length']) {
                _0x26500e += '\x20(alias:\x20' + _0x10bb88['aliases']['join'](',\x20') + ')';
            }
            _0x26500e += ':\x20' + (_0x10bb88['description'] || 'Pas\x20de\x20description');
            if (_0x10bb88['usage']) {
                _0x26500e += '\x20[Utilisation:\x20' + _0x10bb88['usage'] + ']';
            }
            _0x26500e += '\x0a';
        }
        return 'Tu\x20es\x20un\x20assistant\x20qui\x20détecte\x20si\x20un\x20utilisateur\x20veut\x20exécuter\x20une\x20commande\x20ou\x20juste\x20discuter.\x0a\x0a' + _0x26500e + '\x0a\x0aMESSAGE\x20DE\x20L\x27UTILISATEUR:\x20\x22' + _0x16c153 + '\x22\x0a\x0aANALYSE\x20ATTENTIVEMENT:\x0a1.\x20L\x27utilisateur\x20veut-il\x20effectuer\x20une\x20action\x20qui\x20correspond\x20à\x20une\x20commande\x20?\x0a2.\x20Si\x20OUI,\x20quelle\x20commande\x20EXACTE\x20correspond\x20le\x20mieux\x20?\x0a3.\x20Extrais\x20les\x20arguments\x20(mentions,\x20texte,\x20nombres,\x20etc.)\x0a4.\x20Si\x20NON,\x20réponds\x20naturellement\x0a\x0aRÈGLES\x20IMPORTANTES:\x0a-\x20N\x27identifie\x20UNIQUEMENT\x20une\x20commande\x20si\x20l\x27utilisateur\x20DEMANDE\x20CLAIREMENT\x20une\x20action\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20N\x27IDENTIFIE\x20PAS\x20de\x20commande\x0a-\x20Sois\x20précis\x20et\x20attentif\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22nom_de_la_commande\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22pourquoi\x20tu\x20as\x20choisi\x20ça\x22\x0a}\x0a\x0aEXEMPLES:\x0a-\x20\x22télécharge\x20la\x20chanson\x20Espoir\x20de\x20Josey\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22Espoir\x22,\x20\x22Josey\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20télécharger\x22}\x0a-\x20\x22crée\x20un\x20sticker\x20de\x20cette\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20créer\x20un\x20sticker\x22}\x0a-\x20\x22banni\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22L\x27utilisateur\x20veut\x20bannir\x22}\x0a-\x20\x22salut\x20comment\x20ça\x20va\x20?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Juste\x20une\x20salutation\x22}\x0a\x0aRÉPONDS\x20UNIQUEMENT\x20EN\x20JSON.\x20PAS\x20D\x27AUTRE\x20TEXTE.';
    }
    ['simpleKeywordDetection'](_0x51241c) {
        const _0x4c6875 = _0x51241c['toLowerCase']();
        const _0x5a4aa9 = {
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
        let _0x13e2d9 = null;
        let _0xda0b40 = 0x0;
        for (const [_0x48dc61, _0x10c9ec] of Object['entries'](_0x5a4aa9)) {
            let _0x3b68ab = 0x0;
            for (const _0x555168 of _0x10c9ec) {
                if (_0x4c6875['includes'](_0x555168)) {
                    _0x3b68ab += _0x555168['length'] / 0x5;
                }
            }
            if (_0x3b68ab > _0xda0b40 && _0x3b68ab > 0x1) {
                _0xda0b40 = _0x3b68ab;
                _0x13e2d9 = _0x48dc61;
            }
        }
        if (_0x13e2d9) {
            const _0x34bd26 = this['extractArgs'](_0x51241c);
            return {
                'isCommand': !![],
                'command': _0x13e2d9,
                'args': _0x34bd26,
                'confidence': _0xda0b40 > 0x3 ? 'high' : 'medium',
                'reason': 'Mot-clé\x20détecté:\x20' + _0x13e2d9
            };
        }
        return {
            'isCommand': ![],
            'reason': 'Aucune\x20commande\x20détectée'
        };
    }
    ['extractArgs'](_0x496db7) {
        const _0x49e240 = [];
        const _0x442584 = _0x496db7['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x442584)
            _0x49e240['push'](..._0x442584);
        const _0xfb1ffa = _0x496db7['match'](/\d+/g);
        if (_0xfb1ffa)
            _0x49e240['push'](..._0xfb1ffa);
        const _0x598d0d = _0x496db7['match'](/"([^"]*)"/g);
        if (_0x598d0d)
            _0x49e240['push'](..._0x598d0d['map'](_0x4bc6bb => _0x4bc6bb['replace'](/"/g, '')));
        const _0x42e9d4 = _0x496db7['match'](/(?:télécharge|download|télécharger)\s+(.+)/i);
        if (_0x42e9d4 && _0x42e9d4[0x1]) {
            _0x49e240['push'](_0x42e9d4[0x1]['trim']());
        }
        return _0x49e240;
    }
    ['findSimilarCommand'](_0x3a30c7) {
        const _0x1a8bbe = Array['from'](_0x0_0x28b64c['commands']['keys']());
        const _0x26e0c0 = _0x1a8bbe['filter'](_0x3371ca => _0x3371ca['includes'](_0x3a30c7) || _0x3a30c7['includes'](_0x3371ca) || this['levenshteinDistance'](_0x3371ca, _0x3a30c7) < 0x3);
        return _0x26e0c0[0x0] || null;
    }
    ['levenshteinDistance'](_0x1fc654, _0x433af2) {
        const _0x2c6ebc = [];
        for (let _0x2f0bac = 0x0; _0x2f0bac <= _0x433af2['length']; _0x2f0bac++) {
            _0x2c6ebc[_0x2f0bac] = [_0x2f0bac];
        }
        for (let _0x5bd556 = 0x0; _0x5bd556 <= _0x1fc654['length']; _0x5bd556++) {
            _0x2c6ebc[0x0][_0x5bd556] = _0x5bd556;
        }
        for (let _0x838165 = 0x1; _0x838165 <= _0x433af2['length']; _0x838165++) {
            for (let _0xf614c6 = 0x1; _0xf614c6 <= _0x1fc654['length']; _0xf614c6++) {
                if (_0x433af2[_0x838165 - 0x1] === _0x1fc654[_0xf614c6 - 0x1]) {
                    _0x2c6ebc[_0x838165][_0xf614c6] = _0x2c6ebc[_0x838165 - 0x1][_0xf614c6 - 0x1];
                } else {
                    _0x2c6ebc[_0x838165][_0xf614c6] = Math['min'](_0x2c6ebc[_0x838165 - 0x1][_0xf614c6 - 0x1] + 0x1, _0x2c6ebc[_0x838165][_0xf614c6 - 0x1] + 0x1, _0x2c6ebc[_0x838165 - 0x1][_0xf614c6] + 0x1);
                }
            }
        }
        return _0x2c6ebc[_0x433af2['length']][_0x1fc654['length']];
    }
    async ['executeCommand'](_0x391e6a, _0x1db684, _0x4fe554, _0x1c3a9b, _0x293444) {
        try {
            console['log']('🎯\x20Executing\x20command:', _0x391e6a, _0x1db684);
            const _0x478f1 = _0x0_0x28b64c['commands']['get'](_0x391e6a);
            if (!_0x478f1) {
                return {
                    'success': ![],
                    'error': 'Commande\x20non\x20trouvée'
                };
            }
            const _0x52360b = _0x293444['isOwnerOrSudo'] || ![];
            const _0x2d440b = _0x293444['isFromMe'] || ![];
            const _0x127439 = _0x4fe554['endsWith']('@g.us');
            if (_0x478f1['ownerOnly'] && !_0x52360b && !_0x2d440b) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20au\x20propriétaire'
                };
            }
            if (_0x478f1['groupOnly'] && !_0x127439) {
                return {
                    'success': ![],
                    'error': 'Commande\x20réservée\x20aux\x20groupes'
                };
            }
            const _0x57fe73 = {
                'key': {
                    'remoteJid': _0x4fe554,
                    'participant': _0x1c3a9b
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x391e6a + '\x20' + _0x1db684['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x293444['pushName'] || 'User'
            };
            await _0x478f1['handler'](_0x293444['sock'], _0x57fe73, _0x1db684, {
                'chatId': _0x4fe554,
                'senderId': _0x1c3a9b,
                'isGroup': _0x127439,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x391e6a + '\x20' + _0x1db684['join']('\x20'),
                'messageText': _0x391e6a + '\x20' + _0x1db684['join']('\x20'),
                'userMessage': _0x391e6a + '\x20' + _0x1db684['join']('\x20'),
                'config': _0x0_0x1004db
            });
            return {
                'success': !![],
                'message': '✅\x20Commande\x20`' + _0x391e6a + '`\x20exécutée\x20avec\x20succès\x20!'
            };
        } catch (_0x20ec9e) {
            console['error']('❌\x20Command\x20execution\x20error:', _0x20ec9e);
            return {
                'success': ![],
                'error': _0x20ec9e['message']
            };
        }
    }
    async ['generateNaturalResponse'](_0x4d2cd9, _0x55a1a5, _0x8cfe71) {
        console['log']('💬\x20generateNaturalResponse\x20called');
        console['log']('📝\x20Message:', _0x4d2cd9);
        console['log']('📝\x20Provider:', this['config']['provider']);
        try {
            const _0x1fc253 = this['buildConversationContext'](_0x4d2cd9, _0x55a1a5);
            console['log']('📝\x20Context\x20built,\x20length:', _0x1fc253['length']);
            const _0x3ce682 = this['config']['provider'] || 'pollinations';
            const _0x1c1650 = this['providers'][_0x3ce682];
            if (!_0x1c1650) {
                console['error']('❌\x20Provider\x20' + _0x3ce682 + '\x20not\x20found');
                return this['config']['fallbackResponse'];
            }
            console['log']('📡\x20Calling\x20provider:\x20' + _0x3ce682);
            const _0x32f0df = await this['_callWithTimeout'](() => _0x1c1650(_0x4d2cd9, _0x1fc253, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            console['log']('📡\x20Provider\x20response:', _0x32f0df);
            const _0x49564f = this['cleanResponse'](_0x32f0df);
            this['addToHistory'](_0x55a1a5, _0x4d2cd9, _0x49564f);
            console['log']('✅\x20Response\x20generated\x20and\x20cleaned:', _0x49564f);
            return _0x49564f || 'Je\x20suis\x20là\x20!\x20Comment\x20puis-je\x20vous\x20aider\x20?\x20😊';
        } catch (_0x459061) {
            console['error']('❌\x20Natural\x20response\x20error:', _0x459061);
            console['error']('❌\x20Stack\x20trace:', _0x459061['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0xcd1ac4, _0x3f3477) {
        let _0x33d878 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x33d878 += '\x0a\x0a===\x20CONTEXTE\x20SUPPLÉMENTAIRE\x20===\x0a' + this['config']['customContext'];
        }
        const _0x565023 = this['getHistory'](_0x3f3477);
        if (_0x565023 && _0x565023['length'] > 0x0) {
            _0x33d878 += '\x0a\x0a===\x20HISTORIQUE\x20DE\x20LA\x20CONVERSATION\x20===\x0a' + _0x565023['join']('\x0a');
        }
        _0x33d878 += '\x0a\x0a===\x20MESSAGE\x20ACTUEL\x20===\x0a' + _0xcd1ac4 + '\x0a\x0aIMPORTANT:\x20\x0a-\x20Si\x20l\x27utilisateur\x20demande\x20une\x20action,\x20exécute\x20la\x20commande\x20correspondante\x0a-\x20Si\x20l\x27utilisateur\x20discute\x20simplement,\x20réponds\x20naturellement\x0a-\x20Réponds\x20dans\x20la\x20même\x20langue\x20que\x20l\x27utilisateur';
        return _0x33d878;
    }
    async ['_callPollinations'](_0x402daf, _0x51cbbc, _0x30ffc3) {
        console['log']('🌐\x20Calling\x20Pollinations\x20API...');
        console['log']('📝\x20Message:', _0x402daf);
        const _0x4f15cf = 'https://text.pollinations.ai/openai';
        try {
            const _0x508358 = await _0x0_0x20b4a3(_0x4f15cf, {
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
                            'content': _0x51cbbc
                        },
                        {
                            'role': 'user',
                            'content': _0x402daf
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Pollinations\x20response\x20status:', _0x508358['status']);
            if (!_0x508358['ok']) {
                const _0xa5da78 = await _0x508358['text']();
                console['error']('❌\x20Pollinations\x20API\x20error:', _0xa5da78);
                return this['config']['fallbackResponse'];
            }
            const _0xc4b687 = await _0x508358['json']();
            console['log']('✅\x20Pollinations\x20response\x20received');
            const _0x5f1cec = _0xc4b687['choices']?.[0x0]?.['message']?.['content'];
            console['log']('📝\x20Result:', _0x5f1cec);
            return this['cleanResponse'](_0x5f1cec) || this['config']['fallbackResponse'];
        } catch (_0x5b5ed7) {
            console['error']('❌\x20Pollinations\x20API\x20request\x20failed:', _0x5b5ed7['message']);
            console['error']('❌\x20Stack:', _0x5b5ed7['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGrok'](_0x5b200a, _0x54db1e, _0xbe4b81) {
        console['log']('🌐\x20Calling\x20Grok\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x5b200a);
        const _0xdba9cd = this['config']['apiKey'] || process.env.XAI_API_KEY;
        if (!_0xdba9cd) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client\x20for\x20xAI...');
            const _0xc6932d = new _0x0_0x1923cb({
                'apiKey': _0xdba9cd,
                'baseURL': 'https://api.x.ai/v1'
            });
            const _0x221235 = this['config']['grokModel'] || 'grok-4.6';
            console['log']('📡\x20Using\x20model:\x20' + _0x221235);
            console['log']('📡\x20Sending\x20request\x20to\x20Grok...');
            const _0x367c88 = await _0xc6932d['chat']['completions']['create']({
                'model': _0x221235,
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x54db1e
                    },
                    {
                        'role': 'user',
                        'content': _0x5b200a
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x360a79 = _0x367c88['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20Grok\x20response\x20received');
            console['log']('📝\x20Result:', _0x360a79);
            return this['cleanResponse'](_0x360a79) || this['config']['fallbackResponse'];
        } catch (_0x61e5d2) {
            console['error']('❌\x20Grok\x20API\x20request\x20failed:', _0x61e5d2['message']);
            console['error']('❌\x20Stack:', _0x61e5d2['stack']);
            if (_0x61e5d2['message']['includes']('API\x20key')) {
                return '❌\x20Clé\x20API\x20Grok\x20invalide.\x20Obtenez\x20une\x20clé\x20sur\x20https://console.x.ai/';
            }
            if (_0x61e5d2['message']['includes']('model')) {
                return '❌\x20Modèle\x20Grok\x20non\x20disponible.\x20Vérifiez\x20votre\x20clé\x20API\x20et\x20les\x20modèles\x20disponibles.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x5c88e1, _0x3ab1ff, _0x16cdfd) {
        console['log']('🌐\x20Calling\x20Gemini\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x5c88e1);
        const _0x188880 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x188880) {
            console['warn']('⚠️\x20No\x20Gemini\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20GoogleGenAI\x20client...');
            const _0x496993 = new GoogleGenAI({ 'apiKey': _0x188880 });
            const _0x3efb42 = 'gemini-2.0-flash-exp';
            console['log']('📡\x20Using\x20model:\x20' + _0x3efb42);
            console['log']('📡\x20Sending\x20request\x20to\x20Gemini...');
            const _0x10fb1f = await _0x496993['interactions']['create']({
                'model': _0x3efb42,
                'input': _0x3ab1ff + '\x0a\x0aUser:\x20' + _0x5c88e1 + '\x0a\x0aAssistant:',
                'config': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            });
            const _0x9c7078 = _0x10fb1f['output_text'];
            console['log']('✅\x20Gemini\x20response\x20received');
            console['log']('📝\x20Result:', _0x9c7078);
            return this['cleanResponse'](_0x9c7078) || this['config']['fallbackResponse'];
        } catch (_0x2cbaef) {
            console['error']('❌\x20Gemini\x20API\x20request\x20failed:', _0x2cbaef['message']);
            console['error']('❌\x20Stack:', _0x2cbaef['stack']);
            if (_0x2cbaef['message']['includes']('API\x20key\x20not\x20valid')) {
                return '❌\x20Clé\x20API\x20Gemini\x20invalide.\x20Vérifiez\x20votre\x20clé\x20sur\x20https://console.cloud.google.com/';
            }
            if (_0x2cbaef['message']['includes']('not\x20enabled')) {
                return '❌\x20L\x27API\x20Gemini\x20n\x27est\x20pas\x20activée.\x20Activez-la\x20sur\x20https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com';
            }
            if (_0x2cbaef['message']['includes']('quota')) {
                return '❌\x20Quota\x20Gemini\x20épuisé.\x20Attendez\x20ou\x20augmentez\x20vos\x20quotas.';
            }
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x185a21, _0x3d49bb, _0x2b6d49) {
        console['log']('🌐\x20Calling\x20Puter\x20API...');
        console['log']('📝\x20Message:', _0x185a21);
        const _0x3727c3 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x3727c3) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token');
            return this['_missingApiKeyMessage']();
        }
        const _0x224dde = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x29eb10 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Puter...');
            const _0x5d646f = await _0x0_0x20b4a3(_0x224dde, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x3727c3
                },
                'body': JSON['stringify']({
                    'model': _0x29eb10,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x3d49bb
                        },
                        {
                            'role': 'user',
                            'content': _0x185a21
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            console['log']('📡\x20Puter\x20response\x20status:', _0x5d646f['status']);
            if (!_0x5d646f['ok']) {
                console['error']('❌\x20Puter\x20API\x20error:', await _0x5d646f['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x48a97e = await _0x5d646f['json']();
            const _0x2ef4dc = _0x48a97e['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x2ef4dc) || this['config']['fallbackResponse'];
        } catch (_0x329218) {
            console['error']('❌\x20Puter\x20API\x20request\x20failed:', _0x329218['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x219733, _0x316b11, _0x44b71f) {
        console['log']('🌐\x20Calling\x20OpenAI\x20API\x20with\x20official\x20SDK...');
        console['log']('📝\x20Message:', _0x219733);
        const _0x38ffd3 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x38ffd3) {
            console['warn']('⚠️\x20No\x20OpenAI\x20API\x20key');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Creating\x20OpenAI\x20client...');
            const _0x2e4db0 = new _0x0_0x1923cb({ 'apiKey': _0x38ffd3 });
            console['log']('📡\x20Sending\x20request\x20to\x20OpenAI...');
            const _0x4c22cc = await _0x2e4db0['chat']['completions']['create']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x316b11
                    },
                    {
                        'role': 'user',
                        'content': _0x219733
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            });
            const _0x25e25e = _0x4c22cc['choices'][0x0]?.['message']?.['content'];
            console['log']('✅\x20OpenAI\x20response\x20received');
            console['log']('📝\x20Result:', _0x25e25e);
            return this['cleanResponse'](_0x25e25e) || this['config']['fallbackResponse'];
        } catch (_0x6eca08) {
            console['error']('❌\x20OpenAI\x20API\x20request\x20failed:', _0x6eca08['message']);
            console['error']('❌\x20Stack:', _0x6eca08['stack']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callCustom'](_0x5154cd, _0x4d542e, _0x5071a8) {
        console['log']('🌐\x20Calling\x20Custom\x20API...');
        console['log']('📝\x20Message:', _0x5154cd);
        const _0x45248e = this['config']['apiUrl'];
        if (!_0x45248e) {
            console['warn']('⚠️\x20No\x20Custom\x20API\x20URL');
            return this['_missingApiKeyMessage']();
        }
        try {
            console['log']('📡\x20Sending\x20request\x20to\x20Custom\x20API...');
            const _0x57f88c = await _0x0_0x20b4a3(_0x45248e, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
                },
                'body': JSON['stringify']({
                    'message': _0x5154cd,
                    'context': _0x4d542e,
                    'metadata': _0x5071a8
                })
            });
            console['log']('📡\x20Custom\x20API\x20response\x20status:', _0x57f88c['status']);
            if (!_0x57f88c['ok']) {
                console['error']('❌\x20Custom\x20API\x20error:', await _0x57f88c['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x20c95d = await _0x57f88c['json']();
            const _0x55bf6b = _0x20c95d['response'] || _0x20c95d['reply'] || _0x20c95d['text'] || _0x20c95d['result'];
            return this['cleanResponse'](_0x55bf6b) || this['config']['fallbackResponse'];
        } catch (_0x290af8) {
            console['error']('❌\x20Custom\x20API\x20request\x20failed:', _0x290af8['message']);
            return this['config']['fallbackResponse'];
        }
    }
    ['cleanMessage'](_0x3d4eef) {
        const _0x25e182 = 'Nova';
        const _0x1b0644 = [
            new RegExp('^' + _0x25e182 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x25e182 + '[:]\x5cs+', 'i'),
            new RegExp('^' + _0x25e182 + ',?\x5cs+', 'i')
        ];
        let _0x15aa50 = _0x3d4eef;
        for (const _0x3ac965 of _0x1b0644) {
            _0x15aa50 = _0x15aa50['replace'](_0x3ac965, '')['trim']();
        }
        return _0x15aa50;
    }
    ['cleanResponse'](_0x12558c) {
        if (!_0x12558c)
            return null;
        let _0x237209 = _0x12558c['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^Nova:\s*/i, '')['trim']();
        if (_0x237209['length'] > 0x7d0) {
            _0x237209 = _0x237209['slice'](0x0, 0x7d0) + '...';
        }
        return _0x237209;
    }
    ['getHistory'](_0x272b11) {
        const _0x5251aa = this['history']['get'](_0x272b11) || [];
        const _0x459388 = this['config']['maxHistory'] || 0xf;
        return _0x5251aa['slice'](-_0x459388);
    }
    ['addToHistory'](_0x540a4a, _0x41ecbd, _0x5cc679) {
        if (!this['history']['has'](_0x540a4a)) {
            this['history']['set'](_0x540a4a, []);
        }
        const _0x2caaf7 = this['history']['get'](_0x540a4a);
        _0x2caaf7['push']('User:\x20' + _0x41ecbd);
        _0x2caaf7['push']('Nova:\x20' + _0x5cc679);
        const _0x48b8df = this['config']['maxHistory'] || 0xf;
        if (_0x2caaf7['length'] > _0x48b8df * 0x2) {
            this['history']['set'](_0x540a4a, _0x2caaf7['slice'](-_0x48b8df * 0x2));
        }
    }
    ['clearHistory'](_0x105345) {
        if (_0x105345) {
            this['history']['delete'](_0x105345);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x1eabb2, _0x300e4f) {
        if (_0x1eabb2) {
            this['contextCache']['set'](_0x1eabb2, _0x300e4f);
        } else {
            this['config']['customContext'] = _0x300e4f;
            _0x0_0x3bcbb5['set']('customContext', _0x300e4f);
        }
    }
    ['getContext'](_0x195bf0) {
        return this['contextCache']['get'](_0x195bf0) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x30d701, _0x42249f) {
        return new Promise((_0x19f108, _0x385866) => {
            const _0x1e4ff6 = setTimeout(() => {
                _0x385866(new Error('Request\x20timeout\x20after\x20' + _0x42249f + 'ms'));
            }, _0x42249f);
            _0x30d701()['then'](_0x2e0948 => {
                clearTimeout(_0x1e4ff6);
                _0x19f108(_0x2e0948);
            })['catch'](_0xd8d7f1 => {
                clearTimeout(_0x1e4ff6);
                _0x385866(_0xd8d7f1);
            });
        });
    }
}
export default new ChatbotService();