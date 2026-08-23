import _0x0_0x380a9a from 'node-fetch';
import _0x0_0x4b9fc4 from './chatbotConfig.js';
import _0x0_0x4e4f9f from './commandHandler.js';
import _0x0_0xa166fe from '../config.js';
class ChatbotService {
    constructor() {
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
        this['baseContext'] = 'You\x20are\x20NOVA,\x20a\x20virtual\x20assistant\x20powered\x20by\x20NOSTRA.\x20\x0aYou\x20are\x20an\x20advanced\x20AI\x20assistant\x20that\x20helps\x20users\x20with\x20various\x20tasks.\x0a\x0aKEY\x20TRAITS:\x0a-\x20You\x20are\x20friendly,\x20helpful,\x20and\x20professional\x0a-\x20You\x20ALWAYS\x20respond\x20in\x20the\x20SAME\x20LANGUAGE\x20as\x20the\x20user\x27s\x20question\x0a-\x20You\x20keep\x20responses\x20SHORT,\x20CLEAR,\x20and\x20PRECISE\x20(max\x203-4\x20sentences)\x0a-\x20You\x20use\x20emojis\x20appropriately\x20to\x20make\x20responses\x20engaging\x0a-\x20You\x20can\x20execute\x20commands\x20when\x20appropriate\x0a-\x20You\x20understand\x20natural\x20language\x20requests\x0a\x0aCOMMANDS\x20AVAILABLE:\x0a' + this['getCommandsList']() + '\x0a\x0aHOW\x20TO\x20IDENTIFY\x20COMMANDS:\x0a1.\x20Analyze\x20the\x20user\x27s\x20request\x20carefully\x0a2.\x20If\x20the\x20request\x20matches\x20a\x20command\x20intent,\x20execute\x20it\x0a3.\x20If\x20not,\x20just\x20have\x20a\x20normal\x20conversation\x0a4.\x20NEVER\x20execute\x20commands\x20unless\x20the\x20user\x20clearly\x20asks\x20for\x20an\x20action\x0a\x0aEXAMPLES:\x0a-\x20\x22create\x20a\x20sticker\x20from\x20this\x20image\x22\x20→\x20EXECUTE\x20sticker\x20command\x0a-\x20\x22download\x20this\x20music\x22\x20→\x20EXECUTE\x20download\x20command\x0a-\x20\x22ban\x20@user\x22\x20→\x20EXECUTE\x20ban\x20command\x0a-\x20\x22hello\x20how\x20are\x20you?\x22\x20→\x20JUST\x20CHAT,\x20no\x20command\x0a-\x20\x22what\x20can\x20you\x20do?\x22\x20→\x20JUST\x20CHAT,\x20list\x20capabilities\x0a-\x20\x22I\x20want\x20to\x20see\x20@user\x27s\x20profile\x20picture\x22\x20→\x20EXECUTE\x20profilepic\x20command\x0a\x0aIMPORTANT:\x20\x0a-\x20Only\x20execute\x20commands\x20when\x20the\x20user\x20explicitly\x20asks\x20for\x20an\x20action\x0a-\x20For\x20normal\x20conversation,\x20just\x20respond\x20naturally\x0a-\x20Always\x20explain\x20what\x20you\x27re\x20doing\x20when\x20executing\x20a\x20command\x0a-\x20If\x20unsure,\x20just\x20chat\x20normally';
        this['loadConfig']();
    }
    ['getCommandsList']() {
        const _0x329616 = Array['from'](_0x0_0x4e4f9f['commands']['values']());
        const _0x3a737f = {};
        for (const _0x23606e of _0x329616) {
            const _0x364625 = _0x23606e['category'] || 'misc';
            if (!_0x3a737f[_0x364625])
                _0x3a737f[_0x364625] = [];
            _0x3a737f[_0x364625]['push']({
                'name': _0x23606e['command'],
                'description': _0x23606e['description'] || 'No\x20description',
                'aliases': _0x23606e['aliases'] || [],
                'usage': _0x23606e['usage'] || '.' + _0x23606e['command']
            });
        }
        let _0x44df4a = '';
        for (const [_0x5ca384, _0x39cce7] of Object['entries'](_0x3a737f)) {
            _0x44df4a += '\x0a' + _0x5ca384['toUpperCase']() + ':\x0a';
            for (const _0x58e1ef of _0x39cce7) {
                _0x44df4a += '-\x20' + _0x58e1ef['name'] + ':\x20' + _0x58e1ef['description'];
                if (_0x58e1ef['aliases']['length']) {
                    _0x44df4a += '\x20(aliases:\x20' + _0x58e1ef['aliases']['join'](',\x20') + ')';
                }
                _0x44df4a += '\x0a';
            }
        }
        return _0x44df4a;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x4b9fc4['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'grok',
            'apiKey': '',
            'apiUrl': '',
            'puterModel': 'gpt-5.4-nano',
            'grokModel': 'grok-1',
            'customContext': '',
            'maxHistory': 0xf,
            'temperature': 0.7,
            'maxTokens': 0x400,
            'responseTimeout': 0x3a98,
            'language': 'auto',
            'responsePrefix': '🤖\x20',
            'fallbackResponse': 'Sorry,\x20I\x20couldn\x27t\x20process\x20your\x20request.\x20Please\x20try\x20again.\x20🥲',
            'executeCommands': !![],
            'autoDetectLanguage': !![]
        };
    }
    async ['getResponse'](_0x521ed3, _0x59d90c, _0x529b13, _0x2f8750 = {}) {
        try {
            if (!this['config']['enabled'])
                return null;
            if (!this['config']['apiKey']) {
                return this['_missingApiKeyMessage']();
            }
            const _0x11748a = this['cleanMessage'](_0x521ed3);
            if (!_0x11748a || _0x11748a['length'] < 0x1)
                return null;
            const _0x3f6093 = await this['intelligentCommandDetection'](_0x11748a);
            if (_0x3f6093) {
                if (_0x3f6093['isCommand'] && _0x3f6093['command']) {
                    const _0x471ec9 = await this['executeCommand'](_0x3f6093['command'], _0x3f6093['args'] || [], _0x59d90c, _0x529b13, _0x2f8750);
                    if (_0x471ec9['success']) {
                        return _0x471ec9['message'];
                    }
                    return '❌\x20I\x20couldn\x27t\x20execute\x20the\x20command\x20`' + _0x3f6093['command'] + '`.\x20' + (_0x471ec9['error'] || 'Unknown\x20error');
                }
                if (!_0x3f6093['isCommand']) {
                    return await this['generateNaturalResponse'](_0x11748a, _0x59d90c, _0x529b13);
                }
            }
            return await this['generateNaturalResponse'](_0x11748a, _0x59d90c, _0x529b13);
        } catch (_0x2e1880) {
            console['error']('Chatbot\x20service\x20error:', _0x2e1880);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20The\x20AI\x20chatbot\x20isn\x27t\x20configured\x20yet.\x20Ask\x20the\x20bot\x20owner\x20to\x20run\x20`.cbc\x20apikey\x20<your_key>`\x20(with\x20`.cbc\x20provider\x20grok`\x20if\x20needed)\x20to\x20turn\x20it\x20on.';
    }
    async ['intelligentCommandDetection'](_0x1b8a2b) {
        try {
            const _0xf1d365 = this['buildCommandDetectionPrompt'](_0x1b8a2b);
            const _0x57c53e = this['config']['provider'] || 'grok';
            const _0x43d20b = this['providers'][_0x57c53e] || this['providers']['grok'];
            const _0x1580a8 = await this['_callWithTimeout'](() => _0x43d20b(_0xf1d365, { 'isCommandDetection': !![] }, {}), 0x2710);
            const _0x4e3dc0 = _0x1580a8['match'](/\{[\s\S]*\}/);
            if (_0x4e3dc0) {
                try {
                    const _0x2541b2 = JSON['parse'](_0x4e3dc0[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x2541b2);
                    if (_0x2541b2['isCommand'] && _0x2541b2['command']) {
                        if (_0x0_0x4e4f9f['commands']['has'](_0x2541b2['command'])) {
                            return _0x2541b2;
                        }
                        const _0x23f3d1 = _0x0_0x4e4f9f['findSuggestion'](_0x2541b2['command']);
                        if (_0x23f3d1 && _0x0_0x4e4f9f['commands']['has'](_0x23f3d1)) {
                            _0x2541b2['command'] = _0x23f3d1;
                            _0x2541b2['suggested'] = !![];
                            return _0x2541b2;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Command\x20not\x20found'
                        };
                    }
                    return _0x2541b2;
                } catch (_0x10c882) {
                    console['error']('JSON\x20parse\x20error:', _0x10c882);
                }
            }
            return this['simpleKeywordDetection'](_0x1b8a2b);
        } catch (_0x1017ab) {
            console['error']('Intent\x20detection\x20error:', _0x1017ab);
            return this['simpleKeywordDetection'](_0x1b8a2b);
        }
    }
    ['buildCommandDetectionPrompt'](_0x55f75d) {
        const _0x47ccb1 = Array['from'](_0x0_0x4e4f9f['commands']['values']());
        let _0x365521 = 'COMMANDS:\x0a';
        for (const _0x57544a of _0x47ccb1) {
            _0x365521 += '-\x20' + _0x57544a['command'];
            if (_0x57544a['aliases'] && _0x57544a['aliases']['length']) {
                _0x365521 += '\x20(alias:\x20' + _0x57544a['aliases']['join'](',\x20') + ')';
            }
            _0x365521 += ':\x20' + (_0x57544a['description'] || 'No\x20description');
            if (_0x57544a['usage']) {
                _0x365521 += '\x20[Usage:\x20' + _0x57544a['usage'] + ']';
            }
            _0x365521 += '\x0a';
        }
        return 'You\x20are\x20an\x20AI\x20that\x20detects\x20if\x20a\x20user\x20wants\x20to\x20execute\x20a\x20command\x20or\x20just\x20chat.\x0a\x0a' + _0x365521 + '\x0a\x0aUSER\x20MESSAGE:\x20\x22' + _0x55f75d + '\x22\x0a\x0aANALYZE\x20CAREFULLY:\x0a1.\x20Does\x20the\x20user\x20want\x20to\x20perform\x20an\x20action\x20that\x20matches\x20a\x20command?\x0a2.\x20If\x20YES,\x20which\x20EXACT\x20command\x20matches\x20best?\x0a3.\x20Extract\x20any\x20arguments\x20(mentions,\x20text,\x20numbers,\x20etc.)\x0a4.\x20If\x20NO,\x20just\x20respond\x20naturally\x0a\x0aRULES:\x0a-\x20ONLY\x20identify\x20a\x20command\x20if\x20the\x20user\x20CLEARLY\x20asks\x20for\x20an\x20action\x0a-\x20If\x20the\x20user\x20is\x20just\x20chatting,\x20DO\x20NOT\x20identify\x20a\x20command\x0a-\x20Be\x20precise\x20and\x20careful\x0a\x0aRESPOND\x20WITH\x20JSON\x20ONLY:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22command_name\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22why\x20you\x20chose\x20this\x22\x0a}\x0a\x0aEXAMPLES:\x0a-\x20\x22create\x20a\x20sticker\x20from\x20this\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20create\x20sticker\x22}\x0a-\x20\x22download\x20this\x20music\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22music\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20download\x22}\x0a-\x20\x22ban\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20ban\x22}\x0a-\x20\x22hello\x20how\x20are\x20you?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Just\x20greeting\x22}\x0a-\x20\x22what\x20can\x20you\x20do?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Just\x20asking\x20about\x20capabilities\x22}\x0a-\x20\x22I\x20want\x20to\x20see\x20@user\x27s\x20profile\x20picture\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22profilepic\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22medium\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20profile\x20picture\x22}\x0a\x0aRESPOND\x20WITH\x20JSON\x20ONLY.\x20NO\x20OTHER\x20TEXT.';
    }
    ['simpleKeywordDetection'](_0x1bc194) {
        const _0x36886a = _0x1bc194['toLowerCase']();
        const _0x17b14b = {
            'sticker': [
                'sticker',
                'autocollant',
                'create\x20sticker',
                'make\x20sticker',
                'convert\x20to\x20sticker'
            ],
            'ping': [
                'ping',
                'test',
                'status',
                'check'
            ],
            'ban': [
                'ban',
                'bannir',
                'exclude',
                'remove'
            ],
            'kick': [
                'kick',
                'expulser',
                'throw\x20out',
                'remove'
            ],
            'promote': [
                'promote',
                'promouvoir',
                'admin',
                'administrator'
            ],
            'demote': [
                'demote',
                'rétrograder',
                'remove\x20admin'
            ],
            'profilepic': [
                'profilepic',
                'pp',
                'profile\x20picture',
                'avatar'
            ],
            'viewonce': [
                'viewonce',
                'view\x20once',
                'ephemeral\x20message'
            ],
            'download': [
                'download',
                'télécharge',
                'music',
                'audio',
                'video',
                'song'
            ],
            'botmode': [
                'private\x20mode',
                'public\x20mode',
                'change\x20mode'
            ]
        };
        let _0x2ecbb0 = null;
        let _0x383289 = 0x0;
        for (const [_0xfd3021, _0x32ddf8] of Object['entries'](_0x17b14b)) {
            let _0x47d577 = 0x0;
            for (const _0xe61509 of _0x32ddf8) {
                if (_0x36886a['includes'](_0xe61509)) {
                    _0x47d577 += _0xe61509['length'] / 0x5;
                }
            }
            if (_0x47d577 > _0x383289 && _0x47d577 > 0x1) {
                _0x383289 = _0x47d577;
                _0x2ecbb0 = _0xfd3021;
            }
        }
        if (_0x2ecbb0) {
            return {
                'isCommand': !![],
                'command': _0x2ecbb0,
                'args': this['extractArgs'](_0x36886a),
                'confidence': _0x383289 > 0x3 ? 'high' : 'medium',
                'reason': 'Keyword\x20match:\x20' + _0x2ecbb0
            };
        }
        return {
            'isCommand': ![],
            'reason': 'No\x20command\x20detected'
        };
    }
    ['extractArgs'](_0x220d2e) {
        const _0x321047 = [];
        const _0x33422a = _0x220d2e['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x33422a)
            _0x321047['push'](..._0x33422a);
        const _0x407011 = _0x220d2e['match'](/\d+/g);
        if (_0x407011)
            _0x321047['push'](..._0x407011);
        const _0x2458e1 = _0x220d2e['match'](/"([^"]*)"/g);
        if (_0x2458e1)
            _0x321047['push'](..._0x2458e1['map'](_0x55be32 => _0x55be32['replace'](/"/g, '')));
        return _0x321047;
    }
    async ['generateNaturalResponse'](_0x5f37b7, _0x3d5102, _0x32c94f) {
        try {
            const _0x5ad455 = this['buildConversationContext'](_0x5f37b7, _0x3d5102);
            const _0x1e9764 = this['config']['provider'] || 'grok';
            const _0x5c0989 = this['providers'][_0x1e9764] || this['providers']['grok'];
            const _0x58986f = await this['_callWithTimeout'](() => _0x5c0989(_0x5f37b7, _0x5ad455, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            const _0xdfc094 = this['cleanResponse'](_0x58986f);
            this['addToHistory'](_0x3d5102, _0x5f37b7, _0xdfc094);
            return _0xdfc094 || 'I\x27m\x20here!\x20How\x20can\x20I\x20help\x20you?\x20😊';
        } catch (_0x4fa1cf) {
            console['error']('Natural\x20response\x20error:', _0x4fa1cf);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x566ef3, _0x211220) {
        let _0x467567 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x467567 += '\x0a\x0a===\x20ADDITIONAL\x20CONTEXT\x20===\x0a' + this['config']['customContext'];
        }
        const _0x324adb = this['getHistory'](_0x211220);
        if (_0x324adb && _0x324adb['length'] > 0x0) {
            _0x467567 += '\x0a\x0a===\x20CONVERSATION\x20HISTORY\x20===\x0a' + _0x324adb['join']('\x0a');
        }
        _0x467567 += '\x0a\x0a===\x20CURRENT\x20MESSAGE\x20===\x0a' + _0x566ef3 + '\x0a\x0aIMPORTANT:\x20This\x20is\x20a\x20normal\x20conversation.\x20Respond\x20naturally\x20and\x20helpfully.\x20ONLY\x20execute\x20a\x20command\x20if\x20the\x20user\x20clearly\x20asks\x20for\x20it.';
        return _0x467567;
    }
    async ['executeCommand'](_0x54f057, _0x433700, _0x30a352, _0x4ed10e, _0x36ae0a) {
        try {
            const _0x11b639 = _0x0_0x4e4f9f['commands']['get'](_0x54f057);
            if (!_0x11b639) {
                return {
                    'success': ![],
                    'error': 'Command\x20not\x20found'
                };
            }
            const _0x4576a5 = _0x36ae0a['isOwnerOrSudo'] || ![];
            const _0xe93d68 = _0x36ae0a['isFromMe'] || ![];
            const _0x337b1e = _0x30a352['endsWith']('@g.us');
            if (_0x11b639['ownerOnly'] && !_0x4576a5 && !_0xe93d68) {
                return {
                    'success': ![],
                    'error': 'Command\x20reserved\x20for\x20owner'
                };
            }
            if (_0x11b639['groupOnly'] && !_0x337b1e) {
                return {
                    'success': ![],
                    'error': 'Command\x20reserved\x20for\x20groups'
                };
            }
            const _0x3a5486 = {
                'key': {
                    'remoteJid': _0x30a352,
                    'participant': _0x4ed10e
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x54f057 + '\x20' + _0x433700['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x36ae0a['pushName'] || 'User'
            };
            await _0x11b639['handler'](_0x36ae0a['sock'], _0x3a5486, _0x433700, {
                'chatId': _0x30a352,
                'senderId': _0x4ed10e,
                'isGroup': _0x337b1e,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x54f057 + '\x20' + _0x433700['join']('\x20'),
                'messageText': _0x54f057 + '\x20' + _0x433700['join']('\x20'),
                'userMessage': _0x54f057 + '\x20' + _0x433700['join']('\x20'),
                'config': _0x0_0xa166fe
            });
            return {
                'success': !![],
                'message': '✅\x20Command\x20`' + _0x54f057 + '`\x20executed\x20successfully!'
            };
        } catch (_0x5dc276) {
            console['error']('Command\x20execution\x20error:', _0x5dc276);
            return {
                'success': ![],
                'error': _0x5dc276['message']
            };
        }
    }
    async ['_callPollinations'](_0x7d72aa, _0x19cc8c, _0x162ce4) {
        const _0x481c90 = 'https://text.pollinations.ai/openai';
        const _0x444a87 = this['config']['pollinationsModel'] || 'openai';
        try {
            const _0x1bf198 = await _0x0_0x380a9a(_0x481c90, {
                'method': 'POST',
                'headers': { 'Content-Type': 'application/json' },
                'body': JSON['stringify']({
                    'model': _0x444a87,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x19cc8c
                        },
                        {
                            'role': 'user',
                            'content': _0x7d72aa
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x1bf198['ok']) {
                console['error']('Pollinations\x20API\x20error:', await _0x1bf198['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x13fba9 = await _0x1bf198['json']();
            const _0x312125 = _0x13fba9['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x312125) || this['config']['fallbackResponse'];
        } catch (_0x50268b) {
            console['error']('Pollinations\x20API\x20request\x20failed:', _0x50268b['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x1f0658, _0x1bdd4c, _0x212883) {
        const _0x475fbb = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x475fbb) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token\x20configured\x20(.cbc\x20apikey\x20<token>\x20or\x20PUTER_AUTH_TOKEN).');
            return this['_missingApiKeyMessage']();
        }
        const _0x4d68f2 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x20f4a1 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x263bc3 = await _0x0_0x380a9a(_0x4d68f2, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x475fbb
                },
                'body': JSON['stringify']({
                    'model': _0x20f4a1,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x1bdd4c
                        },
                        {
                            'role': 'user',
                            'content': _0x1f0658
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x263bc3['ok']) {
                console['error']('Puter\x20API\x20error:', await _0x263bc3['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x5b7595 = await _0x263bc3['json']();
            const _0x417958 = _0x5b7595['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x417958) || this['config']['fallbackResponse'];
        } catch (_0x1b75ef) {
            console['error']('Puter\x20API\x20request\x20failed:', _0x1b75ef['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x3e7bef, _0x39bfae, _0x50435c) {
        const _0x23e7fc = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x23e7fc)
            return this['_missingApiKeyMessage']();
        const _0x5acf10 = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        const _0x57afc2 = _0x39bfae + '\x0a\x0aUser:\x20' + _0x3e7bef;
        const _0x5c0049 = await _0x0_0x380a9a(_0x5acf10 + '?key=' + _0x23e7fc, {
            'method': 'POST',
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON['stringify']({
                'contents': [{ 'parts': [{ 'text': _0x57afc2 }] }],
                'generationConfig': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            })
        });
        if (!_0x5c0049['ok']) {
            console['error']('Gemini\x20API\x20error:', await _0x5c0049['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x5e1a1d = await _0x5c0049['json']();
        const _0x26ddf2 = _0x5e1a1d['candidates']?.[0x0]?.['content']?.['parts']?.[0x0]?.['text'];
        return this['cleanResponse'](_0x26ddf2) || this['config']['fallbackResponse'];
    }
    async ['_callGrok'](_0x4daa2f, _0x127995, _0x58e57f) {
        const _0x489305 = this['config']['apiKey'] || process.env.GROK_API_KEY;
        if (!_0x489305) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key\x20configured\x20(.cbc\x20apikey\x20<token>\x20or\x20GROK_API_KEY).');
            return this['_missingApiKeyMessage']();
        }
        const _0x1569fd = this['config']['apiUrl'] || 'https://api.x.ai/v1/chat/completions';
        const _0xce7942 = this['config']['grokModel'] || 'grok-1';
        try {
            const _0xfa492f = await _0x0_0x380a9a(_0x1569fd, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x489305
                },
                'body': JSON['stringify']({
                    'model': _0xce7942,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x127995
                        },
                        {
                            'role': 'user',
                            'content': _0x4daa2f
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0xfa492f['ok']) {
                const _0xdab5bc = await _0xfa492f['text']();
                console['error']('Grok\x20API\x20error:', _0xdab5bc);
                return this['config']['fallbackResponse'];
            }
            const _0x20d81c = await _0xfa492f['json']();
            const _0x5a841b = _0x20d81c['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x5a841b) || this['config']['fallbackResponse'];
        } catch (_0xfce57b) {
            console['error']('Grok\x20API\x20request\x20failed:', _0xfce57b['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x15d561, _0x38766e, _0x5892af) {
        const _0x5927b3 = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x5927b3)
            return this['_missingApiKeyMessage']();
        const _0x34a3d2 = 'https://api.openai.com/v1/chat/completions';
        const _0x2acdc8 = await _0x0_0x380a9a(_0x34a3d2, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer\x20' + _0x5927b3
            },
            'body': JSON['stringify']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x38766e
                    },
                    {
                        'role': 'user',
                        'content': _0x15d561
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            })
        });
        if (!_0x2acdc8['ok']) {
            console['error']('OpenAI\x20API\x20error:', await _0x2acdc8['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x509c25 = await _0x2acdc8['json']();
        const _0x2d9f78 = _0x509c25['choices']?.[0x0]?.['message']?.['content'];
        return this['cleanResponse'](_0x2d9f78) || this['config']['fallbackResponse'];
    }
    async ['_callCustom'](_0x4be636, _0x1535bd, _0x36b537) {
        const _0x5366fa = this['config']['apiUrl'];
        if (!_0x5366fa)
            return this['_missingApiKeyMessage']();
        const _0x2785cb = await _0x0_0x380a9a(_0x5366fa, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
            },
            'body': JSON['stringify']({
                'message': _0x4be636,
                'context': _0x1535bd,
                'metadata': _0x36b537
            })
        });
        if (!_0x2785cb['ok']) {
            console['error']('Custom\x20API\x20error:', await _0x2785cb['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x4ea9f3 = await _0x2785cb['json']();
        const _0x245b16 = _0x4ea9f3['response'] || _0x4ea9f3['reply'] || _0x4ea9f3['text'] || _0x4ea9f3['result'];
        return this['cleanResponse'](_0x245b16) || this['config']['fallbackResponse'];
    }
    ['cleanMessage'](_0x18e9bd) {
        const _0x4953de = global['botname'] || 'NOVA';
        const _0x280d18 = [
            new RegExp('^' + _0x4953de + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x4953de + '[:]\x5cs+', 'i')
        ];
        let _0x1c0f29 = _0x18e9bd;
        for (const _0x54a88b of _0x280d18) {
            _0x1c0f29 = _0x1c0f29['replace'](_0x54a88b, '')['trim']();
        }
        return _0x1c0f29;
    }
    ['cleanResponse'](_0x5880fa) {
        if (!_0x5880fa)
            return null;
        let _0x34708 = _0x5880fa['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^NOVA:\s*/i, '')['trim']();
        if (_0x34708['length'] > 0x7d0) {
            _0x34708 = _0x34708['slice'](0x0, 0x7d0) + '...';
        }
        return _0x34708;
    }
    ['getHistory'](_0x37008d) {
        const _0x5e66ef = this['history']['get'](_0x37008d) || [];
        const _0x436fd4 = this['config']['maxHistory'] || 0xf;
        return _0x5e66ef['slice'](-_0x436fd4);
    }
    ['addToHistory'](_0x240ea9, _0x1b1d37, _0x2d6250) {
        if (!this['history']['has'](_0x240ea9)) {
            this['history']['set'](_0x240ea9, []);
        }
        const _0x52cd1b = this['history']['get'](_0x240ea9);
        _0x52cd1b['push']('User:\x20' + _0x1b1d37);
        _0x52cd1b['push']('NOVA:\x20' + _0x2d6250);
        const _0x4bcf92 = this['config']['maxHistory'] || 0xf;
        if (_0x52cd1b['length'] > _0x4bcf92 * 0x2) {
            this['history']['set'](_0x240ea9, _0x52cd1b['slice'](-_0x4bcf92 * 0x2));
        }
    }
    ['clearHistory'](_0x485363) {
        if (_0x485363) {
            this['history']['delete'](_0x485363);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x39f974, _0xd513d7) {
        if (_0x39f974) {
            this['contextCache']['set'](_0x39f974, _0xd513d7);
        } else {
            this['config']['customContext'] = _0xd513d7;
            _0x0_0x4b9fc4['set']('customContext', _0xd513d7);
        }
    }
    ['getContext'](_0x1312a3) {
        return this['contextCache']['get'](_0x1312a3) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x598f2d, _0x2c6dd7) {
        return new Promise((_0x213832, _0x246274) => {
            const _0x3d5b1a = setTimeout(() => {
                _0x246274(new Error('Request\x20timeout\x20after\x20' + _0x2c6dd7 + 'ms'));
            }, _0x2c6dd7);
            _0x598f2d()['then'](_0x5a7842 => {
                clearTimeout(_0x3d5b1a);
                _0x213832(_0x5a7842);
            })['catch'](_0x4816a2 => {
                clearTimeout(_0x3d5b1a);
                _0x246274(_0x4816a2);
            });
        });
    }
}
export default new ChatbotService();