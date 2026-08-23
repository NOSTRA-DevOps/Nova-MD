import _0x0_0x445be7 from 'node-fetch';
import _0x0_0x20f114 from './chatbotConfig.js';
import _0x0_0x4be9fb from './commandHandler.js';
import _0x0_0x8f5219 from '../config.js';
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
        const _0x5ed021 = Array['from'](_0x0_0x4be9fb['commands']['values']());
        const _0x4138f3 = {};
        for (const _0x3410f8 of _0x5ed021) {
            const _0x198e88 = _0x3410f8['category'] || 'misc';
            if (!_0x4138f3[_0x198e88])
                _0x4138f3[_0x198e88] = [];
            _0x4138f3[_0x198e88]['push']({
                'name': _0x3410f8['command'],
                'description': _0x3410f8['description'] || 'No\x20description',
                'aliases': _0x3410f8['aliases'] || [],
                'usage': _0x3410f8['usage'] || '.' + _0x3410f8['command']
            });
        }
        let _0x3ac00e = '';
        for (const [_0x471415, _0x2b2bee] of Object['entries'](_0x4138f3)) {
            _0x3ac00e += '\x0a' + _0x471415['toUpperCase']() + ':\x0a';
            for (const _0x270a61 of _0x2b2bee) {
                _0x3ac00e += '-\x20' + _0x270a61['name'] + ':\x20' + _0x270a61['description'];
                if (_0x270a61['aliases']['length']) {
                    _0x3ac00e += '\x20(aliases:\x20' + _0x270a61['aliases']['join'](',\x20') + ')';
                }
                _0x3ac00e += '\x0a';
            }
        }
        return _0x3ac00e;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x20f114['config'] || {
            'enabled': !![],
            'mode': 'public',
            'provider': 'grok',
            'apiKey': '',
            'apiUrl': '',
            'puterModel': 'gpt-5.4-nano',
            'grokModel': 'grok-4.3',
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
    async ['getResponse'](_0x4ef7f9, _0x506037, _0x308b1c, _0x59e3d0 = {}) {
        try {
            if (!this['config']['enabled'])
                return null;
            if (!this['config']['apiKey']) {
                return this['_missingApiKeyMessage']();
            }
            const _0x58318b = this['cleanMessage'](_0x4ef7f9);
            if (!_0x58318b || _0x58318b['length'] < 0x1)
                return null;
            const _0x5409a2 = await this['intelligentCommandDetection'](_0x58318b);
            if (_0x5409a2) {
                if (_0x5409a2['isCommand'] && _0x5409a2['command']) {
                    const _0x22b47d = await this['executeCommand'](_0x5409a2['command'], _0x5409a2['args'] || [], _0x506037, _0x308b1c, _0x59e3d0);
                    if (_0x22b47d['success']) {
                        return _0x22b47d['message'];
                    }
                    return '❌\x20I\x20couldn\x27t\x20execute\x20the\x20command\x20`' + _0x5409a2['command'] + '`.\x20' + (_0x22b47d['error'] || 'Unknown\x20error');
                }
                if (!_0x5409a2['isCommand']) {
                    return await this['generateNaturalResponse'](_0x58318b, _0x506037, _0x308b1c);
                }
            }
            return await this['generateNaturalResponse'](_0x58318b, _0x506037, _0x308b1c);
        } catch (_0x26867f) {
            console['error']('Chatbot\x20service\x20error:', _0x26867f);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20The\x20AI\x20chatbot\x20isn\x27t\x20configured\x20yet.\x20Ask\x20the\x20bot\x20owner\x20to\x20run\x20`.cbc\x20apikey\x20<your_key>`\x20(with\x20`.cbc\x20provider\x20grok`\x20if\x20needed)\x20to\x20turn\x20it\x20on.';
    }
    async ['intelligentCommandDetection'](_0x3c2e9b) {
        try {
            const _0x133a0b = this['buildCommandDetectionPrompt'](_0x3c2e9b);
            const _0x595661 = this['config']['provider'] || 'grok';
            const _0x4a81ec = this['providers'][_0x595661] || this['providers']['grok'];
            const _0x4425e5 = await this['_callWithTimeout'](() => _0x4a81ec(_0x133a0b, { 'isCommandDetection': !![] }, {}), 0x2710);
            const _0x388f05 = _0x4425e5['match'](/\{[\s\S]*\}/);
            if (_0x388f05) {
                try {
                    const _0x100bf3 = JSON['parse'](_0x388f05[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x100bf3);
                    if (_0x100bf3['isCommand'] && _0x100bf3['command']) {
                        if (_0x0_0x4be9fb['commands']['has'](_0x100bf3['command'])) {
                            return _0x100bf3;
                        }
                        const _0x5e4bb6 = _0x0_0x4be9fb['findSuggestion'](_0x100bf3['command']);
                        if (_0x5e4bb6 && _0x0_0x4be9fb['commands']['has'](_0x5e4bb6)) {
                            _0x100bf3['command'] = _0x5e4bb6;
                            _0x100bf3['suggested'] = !![];
                            return _0x100bf3;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Command\x20not\x20found'
                        };
                    }
                    return _0x100bf3;
                } catch (_0x29790b) {
                    console['error']('JSON\x20parse\x20error:', _0x29790b);
                }
            }
            return this['simpleKeywordDetection'](_0x3c2e9b);
        } catch (_0x16ac65) {
            console['error']('Intent\x20detection\x20error:', _0x16ac65);
            return this['simpleKeywordDetection'](_0x3c2e9b);
        }
    }
    ['buildCommandDetectionPrompt'](_0x8e4c47) {
        const _0x2111f0 = Array['from'](_0x0_0x4be9fb['commands']['values']());
        let _0x9d6b15 = 'COMMANDS:\x0a';
        for (const _0x25025b of _0x2111f0) {
            _0x9d6b15 += '-\x20' + _0x25025b['command'];
            if (_0x25025b['aliases'] && _0x25025b['aliases']['length']) {
                _0x9d6b15 += '\x20(alias:\x20' + _0x25025b['aliases']['join'](',\x20') + ')';
            }
            _0x9d6b15 += ':\x20' + (_0x25025b['description'] || 'No\x20description');
            if (_0x25025b['usage']) {
                _0x9d6b15 += '\x20[Usage:\x20' + _0x25025b['usage'] + ']';
            }
            _0x9d6b15 += '\x0a';
        }
        return 'You\x20are\x20an\x20AI\x20that\x20detects\x20if\x20a\x20user\x20wants\x20to\x20execute\x20a\x20command\x20or\x20just\x20chat.\x0a\x0a' + _0x9d6b15 + '\x0a\x0aUSER\x20MESSAGE:\x20\x22' + _0x8e4c47 + '\x22\x0a\x0aANALYZE\x20CAREFULLY:\x0a1.\x20Does\x20the\x20user\x20want\x20to\x20perform\x20an\x20action\x20that\x20matches\x20a\x20command?\x0a2.\x20If\x20YES,\x20which\x20EXACT\x20command\x20matches\x20best?\x0a3.\x20Extract\x20any\x20arguments\x20(mentions,\x20text,\x20numbers,\x20etc.)\x0a4.\x20If\x20NO,\x20just\x20respond\x20naturally\x0a\x0aRULES:\x0a-\x20ONLY\x20identify\x20a\x20command\x20if\x20the\x20user\x20CLEARLY\x20asks\x20for\x20an\x20action\x0a-\x20If\x20the\x20user\x20is\x20just\x20chatting,\x20DO\x20NOT\x20identify\x20a\x20command\x0a-\x20Be\x20precise\x20and\x20careful\x0a\x0aRESPOND\x20WITH\x20JSON\x20ONLY:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22command_name\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22why\x20you\x20chose\x20this\x22\x0a}\x0a\x0aEXAMPLES:\x0a-\x20\x22create\x20a\x20sticker\x20from\x20this\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20create\x20sticker\x22}\x0a-\x20\x22download\x20this\x20music\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22music\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20download\x22}\x0a-\x20\x22ban\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20ban\x22}\x0a-\x20\x22hello\x20how\x20are\x20you?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Just\x20greeting\x22}\x0a-\x20\x22what\x20can\x20you\x20do?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Just\x20asking\x20about\x20capabilities\x22}\x0a-\x20\x22I\x20want\x20to\x20see\x20@user\x27s\x20profile\x20picture\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22profilepic\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22medium\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20profile\x20picture\x22}\x0a\x0aRESPOND\x20WITH\x20JSON\x20ONLY.\x20NO\x20OTHER\x20TEXT.';
    }
    ['simpleKeywordDetection'](_0x1e22fe) {
        const _0x3dc60b = _0x1e22fe['toLowerCase']();
        const _0x1a3afa = {
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
        let _0x33590f = null;
        let _0x5901f2 = 0x0;
        for (const [_0x25ef36, _0x38e801] of Object['entries'](_0x1a3afa)) {
            let _0x3ed012 = 0x0;
            for (const _0x12ccd1 of _0x38e801) {
                if (_0x3dc60b['includes'](_0x12ccd1)) {
                    _0x3ed012 += _0x12ccd1['length'] / 0x5;
                }
            }
            if (_0x3ed012 > _0x5901f2 && _0x3ed012 > 0x1) {
                _0x5901f2 = _0x3ed012;
                _0x33590f = _0x25ef36;
            }
        }
        if (_0x33590f) {
            return {
                'isCommand': !![],
                'command': _0x33590f,
                'args': this['extractArgs'](_0x3dc60b),
                'confidence': _0x5901f2 > 0x3 ? 'high' : 'medium',
                'reason': 'Keyword\x20match:\x20' + _0x33590f
            };
        }
        return {
            'isCommand': ![],
            'reason': 'No\x20command\x20detected'
        };
    }
    ['extractArgs'](_0x3bbc2e) {
        const _0x289b3b = [];
        const _0x34e469 = _0x3bbc2e['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x34e469)
            _0x289b3b['push'](..._0x34e469);
        const _0x2d8fc1 = _0x3bbc2e['match'](/\d+/g);
        if (_0x2d8fc1)
            _0x289b3b['push'](..._0x2d8fc1);
        const _0x11c699 = _0x3bbc2e['match'](/"([^"]*)"/g);
        if (_0x11c699)
            _0x289b3b['push'](..._0x11c699['map'](_0x1f34dd => _0x1f34dd['replace'](/"/g, '')));
        return _0x289b3b;
    }
    async ['generateNaturalResponse'](_0x48438d, _0x3ba7a6, _0x3aac09) {
        try {
            const _0x288067 = this['buildConversationContext'](_0x48438d, _0x3ba7a6);
            const _0xae7050 = this['config']['provider'] || 'grok';
            const _0x17d617 = this['providers'][_0xae7050] || this['providers']['grok'];
            const _0x20e6e6 = await this['_callWithTimeout'](() => _0x17d617(_0x48438d, _0x288067, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            const _0x6c7ce3 = this['cleanResponse'](_0x20e6e6);
            this['addToHistory'](_0x3ba7a6, _0x48438d, _0x6c7ce3);
            return _0x6c7ce3 || 'I\x27m\x20here!\x20How\x20can\x20I\x20help\x20you?\x20😊';
        } catch (_0x2fa273) {
            console['error']('Natural\x20response\x20error:', _0x2fa273);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x5d9c86, _0x3cf59d) {
        let _0x657e89 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x657e89 += '\x0a\x0a===\x20ADDITIONAL\x20CONTEXT\x20===\x0a' + this['config']['customContext'];
        }
        const _0x12c81d = this['getHistory'](_0x3cf59d);
        if (_0x12c81d && _0x12c81d['length'] > 0x0) {
            _0x657e89 += '\x0a\x0a===\x20CONVERSATION\x20HISTORY\x20===\x0a' + _0x12c81d['join']('\x0a');
        }
        _0x657e89 += '\x0a\x0a===\x20CURRENT\x20MESSAGE\x20===\x0a' + _0x5d9c86 + '\x0a\x0aIMPORTANT:\x20This\x20is\x20a\x20normal\x20conversation.\x20Respond\x20naturally\x20and\x20helpfully.\x20ONLY\x20execute\x20a\x20command\x20if\x20the\x20user\x20clearly\x20asks\x20for\x20it.';
        return _0x657e89;
    }
    async ['executeCommand'](_0x36d9d1, _0x3b8d8f, _0x449195, _0x5e447d, _0x237d1b) {
        try {
            const _0x34f419 = _0x0_0x4be9fb['commands']['get'](_0x36d9d1);
            if (!_0x34f419) {
                return {
                    'success': ![],
                    'error': 'Command\x20not\x20found'
                };
            }
            const _0x5d1113 = _0x237d1b['isOwnerOrSudo'] || ![];
            const _0x41bf2c = _0x237d1b['isFromMe'] || ![];
            const _0x4e0268 = _0x449195['endsWith']('@g.us');
            if (_0x34f419['ownerOnly'] && !_0x5d1113 && !_0x41bf2c) {
                return {
                    'success': ![],
                    'error': 'Command\x20reserved\x20for\x20owner'
                };
            }
            if (_0x34f419['groupOnly'] && !_0x4e0268) {
                return {
                    'success': ![],
                    'error': 'Command\x20reserved\x20for\x20groups'
                };
            }
            const _0x33735f = {
                'key': {
                    'remoteJid': _0x449195,
                    'participant': _0x5e447d
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x36d9d1 + '\x20' + _0x3b8d8f['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x237d1b['pushName'] || 'User'
            };
            await _0x34f419['handler'](_0x237d1b['sock'], _0x33735f, _0x3b8d8f, {
                'chatId': _0x449195,
                'senderId': _0x5e447d,
                'isGroup': _0x4e0268,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x36d9d1 + '\x20' + _0x3b8d8f['join']('\x20'),
                'messageText': _0x36d9d1 + '\x20' + _0x3b8d8f['join']('\x20'),
                'userMessage': _0x36d9d1 + '\x20' + _0x3b8d8f['join']('\x20'),
                'config': _0x0_0x8f5219
            });
            return {
                'success': !![],
                'message': '✅\x20Command\x20`' + _0x36d9d1 + '`\x20executed\x20successfully!'
            };
        } catch (_0x41c17f) {
            console['error']('Command\x20execution\x20error:', _0x41c17f);
            return {
                'success': ![],
                'error': _0x41c17f['message']
            };
        }
    }
    async ['_callPollinations'](_0x575938, _0xc9ae0, _0x3dfc2f) {
        const _0x123e57 = 'https://text.pollinations.ai/openai';
        const _0x3ba564 = this['config']['pollinationsModel'] || 'openai';
        try {
            const _0x346efe = await _0x0_0x445be7(_0x123e57, {
                'method': 'POST',
                'headers': { 'Content-Type': 'application/json' },
                'body': JSON['stringify']({
                    'model': _0x3ba564,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0xc9ae0
                        },
                        {
                            'role': 'user',
                            'content': _0x575938
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x346efe['ok']) {
                console['error']('Pollinations\x20API\x20error:', await _0x346efe['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x544fd8 = await _0x346efe['json']();
            const _0x8f12ea = _0x544fd8['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x8f12ea) || this['config']['fallbackResponse'];
        } catch (_0x2fd39e) {
            console['error']('Pollinations\x20API\x20request\x20failed:', _0x2fd39e['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0x5ca919, _0x5605bf, _0x34ec6e) {
        const _0x1f92a0 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x1f92a0) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token\x20configured\x20(.cbc\x20apikey\x20<token>\x20or\x20PUTER_AUTH_TOKEN).');
            return this['_missingApiKeyMessage']();
        }
        const _0x47c52b = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x21864f = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x544fdd = await _0x0_0x445be7(_0x47c52b, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x1f92a0
                },
                'body': JSON['stringify']({
                    'model': _0x21864f,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x5605bf
                        },
                        {
                            'role': 'user',
                            'content': _0x5ca919
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x544fdd['ok']) {
                console['error']('Puter\x20API\x20error:', await _0x544fdd['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x5332ac = await _0x544fdd['json']();
            const _0x38f169 = _0x5332ac['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x38f169) || this['config']['fallbackResponse'];
        } catch (_0x324531) {
            console['error']('Puter\x20API\x20request\x20failed:', _0x324531['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x243b68, _0x5bcb3d, _0x416613) {
        const _0x4d2b16 = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x4d2b16)
            return this['_missingApiKeyMessage']();
        const _0x4a8480 = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        const _0x1f08b5 = _0x5bcb3d + '\x0a\x0aUser:\x20' + _0x243b68;
        const _0x58867d = await _0x0_0x445be7(_0x4a8480 + '?key=' + _0x4d2b16, {
            'method': 'POST',
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON['stringify']({
                'contents': [{ 'parts': [{ 'text': _0x1f08b5 }] }],
                'generationConfig': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            })
        });
        if (!_0x58867d['ok']) {
            console['error']('Gemini\x20API\x20error:', await _0x58867d['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x2f47c1 = await _0x58867d['json']();
        const _0x411e70 = _0x2f47c1['candidates']?.[0x0]?.['content']?.['parts']?.[0x0]?.['text'];
        return this['cleanResponse'](_0x411e70) || this['config']['fallbackResponse'];
    }
    async ['_callGrok'](_0x1aea54, _0x3d918c, _0x1404ff) {
        const _0x5c5604 = this['config']['apiKey'] || process.env.GROK_API_KEY;
        if (!_0x5c5604) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key\x20configured\x20(.cbc\x20apikey\x20<token>\x20or\x20GROK_API_KEY).');
            return this['_missingApiKeyMessage']();
        }
        const _0x2b4b0a = this['config']['apiUrl'] || 'https://api.x.ai/v1/chat/completions';
        const _0x494ddf = this['config']['grokModel'] || 'grok-1';
        try {
            const _0x4069be = await _0x0_0x445be7(_0x2b4b0a, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x5c5604
                },
                'body': JSON['stringify']({
                    'model': _0x494ddf,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x3d918c
                        },
                        {
                            'role': 'user',
                            'content': _0x1aea54
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x4069be['ok']) {
                const _0x449df9 = await _0x4069be['text']();
                console['error']('Grok\x20API\x20error:', _0x449df9);
                return this['config']['fallbackResponse'];
            }
            const _0x19f546 = await _0x4069be['json']();
            const _0x2398cb = _0x19f546['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x2398cb) || this['config']['fallbackResponse'];
        } catch (_0x4b50c7) {
            console['error']('Grok\x20API\x20request\x20failed:', _0x4b50c7['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x39a9e9, _0x267e08, _0x39195a) {
        const _0x2ad41a = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x2ad41a)
            return this['_missingApiKeyMessage']();
        const _0x513e1c = 'https://api.openai.com/v1/chat/completions';
        const _0xa460ea = await _0x0_0x445be7(_0x513e1c, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer\x20' + _0x2ad41a
            },
            'body': JSON['stringify']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x267e08
                    },
                    {
                        'role': 'user',
                        'content': _0x39a9e9
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            })
        });
        if (!_0xa460ea['ok']) {
            console['error']('OpenAI\x20API\x20error:', await _0xa460ea['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x2593aa = await _0xa460ea['json']();
        const _0x246753 = _0x2593aa['choices']?.[0x0]?.['message']?.['content'];
        return this['cleanResponse'](_0x246753) || this['config']['fallbackResponse'];
    }
    async ['_callCustom'](_0x2939fc, _0x14d8ac, _0x87e081) {
        const _0x59eade = this['config']['apiUrl'];
        if (!_0x59eade)
            return this['_missingApiKeyMessage']();
        const _0x500577 = await _0x0_0x445be7(_0x59eade, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
            },
            'body': JSON['stringify']({
                'message': _0x2939fc,
                'context': _0x14d8ac,
                'metadata': _0x87e081
            })
        });
        if (!_0x500577['ok']) {
            console['error']('Custom\x20API\x20error:', await _0x500577['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x2dae5a = await _0x500577['json']();
        const _0x22be05 = _0x2dae5a['response'] || _0x2dae5a['reply'] || _0x2dae5a['text'] || _0x2dae5a['result'];
        return this['cleanResponse'](_0x22be05) || this['config']['fallbackResponse'];
    }
    ['cleanMessage'](_0x47394e) {
        const _0x442543 = global['botname'] || 'NOVA';
        const _0x300949 = [
            new RegExp('^' + _0x442543 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x442543 + '[:]\x5cs+', 'i')
        ];
        let _0x35fbc1 = _0x47394e;
        for (const _0x331f73 of _0x300949) {
            _0x35fbc1 = _0x35fbc1['replace'](_0x331f73, '')['trim']();
        }
        return _0x35fbc1;
    }
    ['cleanResponse'](_0x4219b4) {
        if (!_0x4219b4)
            return null;
        let _0xec849c = _0x4219b4['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^NOVA:\s*/i, '')['trim']();
        if (_0xec849c['length'] > 0x7d0) {
            _0xec849c = _0xec849c['slice'](0x0, 0x7d0) + '...';
        }
        return _0xec849c;
    }
    ['getHistory'](_0xce45b4) {
        const _0x7a313 = this['history']['get'](_0xce45b4) || [];
        const _0x30d236 = this['config']['maxHistory'] || 0xf;
        return _0x7a313['slice'](-_0x30d236);
    }
    ['addToHistory'](_0x4ad1e7, _0x5e8493, _0x151551) {
        if (!this['history']['has'](_0x4ad1e7)) {
            this['history']['set'](_0x4ad1e7, []);
        }
        const _0x20c57e = this['history']['get'](_0x4ad1e7);
        _0x20c57e['push']('User:\x20' + _0x5e8493);
        _0x20c57e['push']('NOVA:\x20' + _0x151551);
        const _0x2cb991 = this['config']['maxHistory'] || 0xf;
        if (_0x20c57e['length'] > _0x2cb991 * 0x2) {
            this['history']['set'](_0x4ad1e7, _0x20c57e['slice'](-_0x2cb991 * 0x2));
        }
    }
    ['clearHistory'](_0x1d6917) {
        if (_0x1d6917) {
            this['history']['delete'](_0x1d6917);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x1dc0b1, _0x3bc8aa) {
        if (_0x1dc0b1) {
            this['contextCache']['set'](_0x1dc0b1, _0x3bc8aa);
        } else {
            this['config']['customContext'] = _0x3bc8aa;
            _0x0_0x20f114['set']('customContext', _0x3bc8aa);
        }
    }
    ['getContext'](_0x9f4bfc) {
        return this['contextCache']['get'](_0x9f4bfc) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x311314, _0x194d1e) {
        return new Promise((_0x2c2c7e, _0x1e1e35) => {
            const _0x5d45c4 = setTimeout(() => {
                _0x1e1e35(new Error('Request\x20timeout\x20after\x20' + _0x194d1e + 'ms'));
            }, _0x194d1e);
            _0x311314()['then'](_0x1a6293 => {
                clearTimeout(_0x5d45c4);
                _0x2c2c7e(_0x1a6293);
            })['catch'](_0x1b7b53 => {
                clearTimeout(_0x5d45c4);
                _0x1e1e35(_0x1b7b53);
            });
        });
    }
}
export default new ChatbotService();