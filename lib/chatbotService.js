import _0x0_0x4733cd from 'node-fetch';
import _0x0_0x51b3db from './chatbotConfig.js';
import _0x0_0xb316f from './commandHandler.js';
import _0x0_0x4bd587 from '../config.js';
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
        const _0x29255e = Array['from'](_0x0_0xb316f['commands']['values']());
        const _0x617f3e = {};
        for (const _0x46011f of _0x29255e) {
            const _0xa7f6df = _0x46011f['category'] || 'misc';
            if (!_0x617f3e[_0xa7f6df])
                _0x617f3e[_0xa7f6df] = [];
            _0x617f3e[_0xa7f6df]['push']({
                'name': _0x46011f['command'],
                'description': _0x46011f['description'] || 'No\x20description',
                'aliases': _0x46011f['aliases'] || [],
                'usage': _0x46011f['usage'] || '.' + _0x46011f['command']
            });
        }
        let _0x4ff680 = '';
        for (const [_0x5bd1e7, _0x1926e0] of Object['entries'](_0x617f3e)) {
            _0x4ff680 += '\x0a' + _0x5bd1e7['toUpperCase']() + ':\x0a';
            for (const _0x584c5c of _0x1926e0) {
                _0x4ff680 += '-\x20' + _0x584c5c['name'] + ':\x20' + _0x584c5c['description'];
                if (_0x584c5c['aliases']['length']) {
                    _0x4ff680 += '\x20(aliases:\x20' + _0x584c5c['aliases']['join'](',\x20') + ')';
                }
                _0x4ff680 += '\x0a';
            }
        }
        return _0x4ff680;
    }
    ['loadConfig']() {
        this['config'] = _0x0_0x51b3db['config'] || {
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
    async ['getResponse'](_0x206f92, _0x5befe8, _0x341681, _0x23cb5d = {}) {
        try {
            if (!this['config']['enabled'])
                return null;
            if (!this['config']['apiKey']) {
                return this['_missingApiKeyMessage']();
            }
            const _0x35ed07 = this['cleanMessage'](_0x206f92);
            if (!_0x35ed07 || _0x35ed07['length'] < 0x1)
                return null;
            const _0x4fefcc = await this['intelligentCommandDetection'](_0x35ed07);
            if (_0x4fefcc) {
                if (_0x4fefcc['isCommand'] && _0x4fefcc['command']) {
                    const _0x390911 = await this['executeCommand'](_0x4fefcc['command'], _0x4fefcc['args'] || [], _0x5befe8, _0x341681, _0x23cb5d);
                    if (_0x390911['success']) {
                        return _0x390911['message'];
                    }
                    return '❌\x20I\x20couldn\x27t\x20execute\x20the\x20command\x20`' + _0x4fefcc['command'] + '`.\x20' + (_0x390911['error'] || 'Unknown\x20error');
                }
                if (!_0x4fefcc['isCommand']) {
                    return await this['generateNaturalResponse'](_0x35ed07, _0x5befe8, _0x341681);
                }
            }
            return await this['generateNaturalResponse'](_0x35ed07, _0x5befe8, _0x341681);
        } catch (_0x448427) {
            console['error']('Chatbot\x20service\x20error:', _0x448427);
            return this['config']['fallbackResponse'];
        }
    }
    ['_missingApiKeyMessage']() {
        return '⚙️\x20The\x20AI\x20chatbot\x20isn\x27t\x20configured\x20yet.\x20Ask\x20the\x20bot\x20owner\x20to\x20run\x20`.cbc\x20apikey\x20<your_key>`\x20(with\x20`.cbc\x20provider\x20grok`\x20if\x20needed)\x20to\x20turn\x20it\x20on.';
    }
    async ['intelligentCommandDetection'](_0xf5bac6) {
        try {
            const _0x124d5d = this['buildCommandDetectionPrompt'](_0xf5bac6);
            const _0xa11391 = this['config']['provider'] || 'grok';
            const _0x84ce8f = this['providers'][_0xa11391] || this['providers']['grok'];
            const _0x2dce61 = await this['_callWithTimeout'](() => _0x84ce8f(_0x124d5d, { 'isCommandDetection': !![] }, {}), 0x2710);
            const _0x1a875b = _0x2dce61['match'](/\{[\s\S]*\}/);
            if (_0x1a875b) {
                try {
                    const _0x593cbc = JSON['parse'](_0x1a875b[0x0]);
                    console['log']('🔍\x20Intent\x20detection\x20result:', _0x593cbc);
                    if (_0x593cbc['isCommand'] && _0x593cbc['command']) {
                        if (_0x0_0xb316f['commands']['has'](_0x593cbc['command'])) {
                            return _0x593cbc;
                        }
                        const _0x585ba1 = _0x0_0xb316f['findSuggestion'](_0x593cbc['command']);
                        if (_0x585ba1 && _0x0_0xb316f['commands']['has'](_0x585ba1)) {
                            _0x593cbc['command'] = _0x585ba1;
                            _0x593cbc['suggested'] = !![];
                            return _0x593cbc;
                        }
                        return {
                            'isCommand': ![],
                            'reason': 'Command\x20not\x20found'
                        };
                    }
                    return _0x593cbc;
                } catch (_0x369145) {
                    console['error']('JSON\x20parse\x20error:', _0x369145);
                }
            }
            return this['simpleKeywordDetection'](_0xf5bac6);
        } catch (_0x7847e9) {
            console['error']('Intent\x20detection\x20error:', _0x7847e9);
            return this['simpleKeywordDetection'](_0xf5bac6);
        }
    }
    ['buildCommandDetectionPrompt'](_0x4d16cf) {
        const _0x58c481 = Array['from'](_0x0_0xb316f['commands']['values']());
        let _0x204147 = 'COMMANDS:\x0a';
        for (const _0x47309e of _0x58c481) {
            _0x204147 += '-\x20' + _0x47309e['command'];
            if (_0x47309e['aliases'] && _0x47309e['aliases']['length']) {
                _0x204147 += '\x20(alias:\x20' + _0x47309e['aliases']['join'](',\x20') + ')';
            }
            _0x204147 += ':\x20' + (_0x47309e['description'] || 'No\x20description');
            if (_0x47309e['usage']) {
                _0x204147 += '\x20[Usage:\x20' + _0x47309e['usage'] + ']';
            }
            _0x204147 += '\x0a';
        }
        return 'You\x20are\x20an\x20AI\x20that\x20detects\x20if\x20a\x20user\x20wants\x20to\x20execute\x20a\x20command\x20or\x20just\x20chat.\x0a\x0a' + _0x204147 + '\x0a\x0aUSER\x20MESSAGE:\x20\x22' + _0x4d16cf + '\x22\x0a\x0aANALYZE\x20CAREFULLY:\x0a1.\x20Does\x20the\x20user\x20want\x20to\x20perform\x20an\x20action\x20that\x20matches\x20a\x20command?\x0a2.\x20If\x20YES,\x20which\x20EXACT\x20command\x20matches\x20best?\x0a3.\x20Extract\x20any\x20arguments\x20(mentions,\x20text,\x20numbers,\x20etc.)\x0a4.\x20If\x20NO,\x20just\x20respond\x20naturally\x0a\x0aRULES:\x0a-\x20ONLY\x20identify\x20a\x20command\x20if\x20the\x20user\x20CLEARLY\x20asks\x20for\x20an\x20action\x0a-\x20If\x20the\x20user\x20is\x20just\x20chatting,\x20DO\x20NOT\x20identify\x20a\x20command\x0a-\x20Be\x20precise\x20and\x20careful\x0a\x0aRESPOND\x20WITH\x20JSON\x20ONLY:\x0a{\x0a\x20\x20\x20\x20\x22isCommand\x22:\x20true/false,\x0a\x20\x20\x20\x20\x22command\x22:\x20\x22command_name\x22,\x0a\x20\x20\x20\x20\x22args\x22:\x20[\x22arg1\x22,\x20\x22arg2\x22],\x0a\x20\x20\x20\x20\x22confidence\x22:\x20\x22high/medium/low\x22,\x0a\x20\x20\x20\x20\x22reason\x22:\x20\x22why\x20you\x20chose\x20this\x22\x0a}\x0a\x0aEXAMPLES:\x0a-\x20\x22create\x20a\x20sticker\x20from\x20this\x20image\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22sticker\x22,\x20\x22args\x22:\x20[],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20create\x20sticker\x22}\x0a-\x20\x22download\x20this\x20music\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22download\x22,\x20\x22args\x22:\x20[\x22music\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20download\x22}\x0a-\x20\x22ban\x20@user\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22ban\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22high\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20to\x20ban\x22}\x0a-\x20\x22hello\x20how\x20are\x20you?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Just\x20greeting\x22}\x0a-\x20\x22what\x20can\x20you\x20do?\x22\x20→\x20{\x22isCommand\x22:\x20false,\x20\x22reason\x22:\x20\x22Just\x20asking\x20about\x20capabilities\x22}\x0a-\x20\x22I\x20want\x20to\x20see\x20@user\x27s\x20profile\x20picture\x22\x20→\x20{\x22isCommand\x22:\x20true,\x20\x22command\x22:\x20\x22profilepic\x22,\x20\x22args\x22:\x20[\x22@user\x22],\x20\x22confidence\x22:\x20\x22medium\x22,\x20\x22reason\x22:\x20\x22User\x20wants\x20profile\x20picture\x22}\x0a\x0aRESPOND\x20WITH\x20JSON\x20ONLY.\x20NO\x20OTHER\x20TEXT.';
    }
    ['simpleKeywordDetection'](_0x5d873f) {
        const _0x538692 = _0x5d873f['toLowerCase']();
        const _0x3b0029 = {
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
        let _0x4bb3a7 = null;
        let _0x173968 = 0x0;
        for (const [_0x47eeab, _0x352144] of Object['entries'](_0x3b0029)) {
            let _0x196d65 = 0x0;
            for (const _0x4d6300 of _0x352144) {
                if (_0x538692['includes'](_0x4d6300)) {
                    _0x196d65 += _0x4d6300['length'] / 0x5;
                }
            }
            if (_0x196d65 > _0x173968 && _0x196d65 > 0x1) {
                _0x173968 = _0x196d65;
                _0x4bb3a7 = _0x47eeab;
            }
        }
        if (_0x4bb3a7) {
            return {
                'isCommand': !![],
                'command': _0x4bb3a7,
                'args': this['extractArgs'](_0x538692),
                'confidence': _0x173968 > 0x3 ? 'high' : 'medium',
                'reason': 'Keyword\x20match:\x20' + _0x4bb3a7
            };
        }
        return {
            'isCommand': ![],
            'reason': 'No\x20command\x20detected'
        };
    }
    ['extractArgs'](_0x163138) {
        const _0x5548f7 = [];
        const _0x4e7f86 = _0x163138['match'](/@[a-zA-Z0-9_]+/g);
        if (_0x4e7f86)
            _0x5548f7['push'](..._0x4e7f86);
        const _0x1400d3 = _0x163138['match'](/\d+/g);
        if (_0x1400d3)
            _0x5548f7['push'](..._0x1400d3);
        const _0x2d8d36 = _0x163138['match'](/"([^"]*)"/g);
        if (_0x2d8d36)
            _0x5548f7['push'](..._0x2d8d36['map'](_0x58b951 => _0x58b951['replace'](/"/g, '')));
        return _0x5548f7;
    }
    async ['generateNaturalResponse'](_0x80f9ab, _0x4d7334, _0x30ecec) {
        try {
            const _0x25e83d = this['buildConversationContext'](_0x80f9ab, _0x4d7334);
            const _0x5dfa43 = this['config']['provider'] || 'grok';
            const _0x49ec23 = this['providers'][_0x5dfa43] || this['providers']['grok'];
            const _0x16e14d = await this['_callWithTimeout'](() => _0x49ec23(_0x80f9ab, _0x25e83d, { 'isConversation': !![] }), this['config']['responseTimeout'] || 0x3a98);
            const _0x43e1c5 = this['cleanResponse'](_0x16e14d);
            this['addToHistory'](_0x4d7334, _0x80f9ab, _0x43e1c5);
            return _0x43e1c5 || 'I\x27m\x20here!\x20How\x20can\x20I\x20help\x20you?\x20😊';
        } catch (_0x574279) {
            console['error']('Natural\x20response\x20error:', _0x574279);
            return this['config']['fallbackResponse'];
        }
    }
    ['buildConversationContext'](_0x7db30c, _0x509492) {
        let _0x255f61 = this['baseContext'];
        if (this['config']['customContext']) {
            _0x255f61 += '\x0a\x0a===\x20ADDITIONAL\x20CONTEXT\x20===\x0a' + this['config']['customContext'];
        }
        const _0x5ca7bf = this['getHistory'](_0x509492);
        if (_0x5ca7bf && _0x5ca7bf['length'] > 0x0) {
            _0x255f61 += '\x0a\x0a===\x20CONVERSATION\x20HISTORY\x20===\x0a' + _0x5ca7bf['join']('\x0a');
        }
        _0x255f61 += '\x0a\x0a===\x20CURRENT\x20MESSAGE\x20===\x0a' + _0x7db30c + '\x0a\x0aIMPORTANT:\x20This\x20is\x20a\x20normal\x20conversation.\x20Respond\x20naturally\x20and\x20helpfully.\x20ONLY\x20execute\x20a\x20command\x20if\x20the\x20user\x20clearly\x20asks\x20for\x20it.';
        return _0x255f61;
    }
    async ['executeCommand'](_0x165ab1, _0x2cf338, _0x2d8c4c, _0x4eb2c2, _0x375de0) {
        try {
            const _0x32f02e = _0x0_0xb316f['commands']['get'](_0x165ab1);
            if (!_0x32f02e) {
                return {
                    'success': ![],
                    'error': 'Command\x20not\x20found'
                };
            }
            const _0x5adf00 = _0x375de0['isOwnerOrSudo'] || ![];
            const _0x20e1a7 = _0x375de0['isFromMe'] || ![];
            const _0x58ec23 = _0x2d8c4c['endsWith']('@g.us');
            if (_0x32f02e['ownerOnly'] && !_0x5adf00 && !_0x20e1a7) {
                return {
                    'success': ![],
                    'error': 'Command\x20reserved\x20for\x20owner'
                };
            }
            if (_0x32f02e['groupOnly'] && !_0x58ec23) {
                return {
                    'success': ![],
                    'error': 'Command\x20reserved\x20for\x20groups'
                };
            }
            const _0x49528c = {
                'key': {
                    'remoteJid': _0x2d8c4c,
                    'participant': _0x4eb2c2
                },
                'message': {
                    'extendedTextMessage': {
                        'text': _0x165ab1 + '\x20' + _0x2cf338['join']('\x20'),
                        'contextInfo': {}
                    }
                },
                'pushName': _0x375de0['pushName'] || 'User'
            };
            await _0x32f02e['handler'](_0x375de0['sock'], _0x49528c, _0x2cf338, {
                'chatId': _0x2d8c4c,
                'senderId': _0x4eb2c2,
                'isGroup': _0x58ec23,
                'channelInfo': {
                    'contextInfo': {
                        'forwardingScore': 0x1,
                        'isForwarded': !![]
                    }
                },
                'rawText': _0x165ab1 + '\x20' + _0x2cf338['join']('\x20'),
                'messageText': _0x165ab1 + '\x20' + _0x2cf338['join']('\x20'),
                'userMessage': _0x165ab1 + '\x20' + _0x2cf338['join']('\x20'),
                'config': _0x0_0x4bd587
            });
            return {
                'success': !![],
                'message': '✅\x20Command\x20`' + _0x165ab1 + '`\x20executed\x20successfully!'
            };
        } catch (_0x35aedc) {
            console['error']('Command\x20execution\x20error:', _0x35aedc);
            return {
                'success': ![],
                'error': _0x35aedc['message']
            };
        }
    }
    async ['_callPollinations'](_0x12dccf, _0x18a2d6, _0xc484f2) {
        const _0x5db5ae = 'https://text.pollinations.ai/openai';
        const _0x718121 = this['config']['pollinationsModel'] || 'openai';
        try {
            const _0x33d789 = await _0x0_0x4733cd(_0x5db5ae, {
                'method': 'POST',
                'headers': { 'Content-Type': 'application/json' },
                'body': JSON['stringify']({
                    'model': _0x718121,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x18a2d6
                        },
                        {
                            'role': 'user',
                            'content': _0x12dccf
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x33d789['ok']) {
                console['error']('Pollinations\x20API\x20error:', await _0x33d789['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x5694ae = await _0x33d789['json']();
            const _0x36ad60 = _0x5694ae['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x36ad60) || this['config']['fallbackResponse'];
        } catch (_0x17e71c) {
            console['error']('Pollinations\x20API\x20request\x20failed:', _0x17e71c['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callPuter'](_0xe36966, _0x35ac80, _0x2c37ca) {
        const _0x331ff5 = this['config']['apiKey'] || process.env.PUTER_AUTH_TOKEN;
        if (!_0x331ff5) {
            console['warn']('⚠️\x20No\x20Puter\x20auth\x20token\x20configured\x20(.cbc\x20apikey\x20<token>\x20or\x20PUTER_AUTH_TOKEN).');
            return this['_missingApiKeyMessage']();
        }
        const _0x519b71 = 'https://api.puter.com/puterai/openai/v1/chat/completions';
        const _0x476d69 = this['config']['puterModel'] || 'gpt-5.4-nano';
        try {
            const _0x262a73 = await _0x0_0x4733cd(_0x519b71, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x331ff5
                },
                'body': JSON['stringify']({
                    'model': _0x476d69,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x35ac80
                        },
                        {
                            'role': 'user',
                            'content': _0xe36966
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x262a73['ok']) {
                console['error']('Puter\x20API\x20error:', await _0x262a73['text']());
                return this['config']['fallbackResponse'];
            }
            const _0x3ffe67 = await _0x262a73['json']();
            const _0x30242a = _0x3ffe67['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x30242a) || this['config']['fallbackResponse'];
        } catch (_0x2ff7c8) {
            console['error']('Puter\x20API\x20request\x20failed:', _0x2ff7c8['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callGemini'](_0x1d7564, _0x97ae82, _0x566167) {
        const _0x3c5ccd = this['config']['apiKey'] || process.env.GEMINI_API_KEY;
        if (!_0x3c5ccd)
            return this['_missingApiKeyMessage']();
        const _0x25867a = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        const _0x346927 = _0x97ae82 + '\x0a\x0aUser:\x20' + _0x1d7564;
        const _0x3336cd = await _0x0_0x4733cd(_0x25867a + '?key=' + _0x3c5ccd, {
            'method': 'POST',
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON['stringify']({
                'contents': [{ 'parts': [{ 'text': _0x346927 }] }],
                'generationConfig': {
                    'temperature': this['config']['temperature'] || 0.7,
                    'maxOutputTokens': this['config']['maxTokens'] || 0x400
                }
            })
        });
        if (!_0x3336cd['ok']) {
            console['error']('Gemini\x20API\x20error:', await _0x3336cd['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x21f815 = await _0x3336cd['json']();
        const _0x3b5500 = _0x21f815['candidates']?.[0x0]?.['content']?.['parts']?.[0x0]?.['text'];
        return this['cleanResponse'](_0x3b5500) || this['config']['fallbackResponse'];
    }
    async ['_callGrok'](_0x3e0311, _0x5d8d05, _0x32e7dd) {
        const _0x2af06c = this['config']['apiKey'] || process.env.GROK_API_KEY;
        if (!_0x2af06c) {
            console['warn']('⚠️\x20No\x20Grok\x20API\x20key\x20configured\x20(.cbc\x20apikey\x20<token>\x20or\x20GROK_API_KEY).');
            return this['_missingApiKeyMessage']();
        }
        const _0x23b4a5 = this['config']['apiUrl'] || 'https://api.x.ai/v1/chat/completions';
        const _0x5cc6cc = this['config']['grokModel'] || 'grok-1';
        try {
            const _0x1333f0 = await _0x0_0x4733cd(_0x23b4a5, {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer\x20' + _0x2af06c
                },
                'body': JSON['stringify']({
                    'model': _0x5cc6cc,
                    'messages': [
                        {
                            'role': 'system',
                            'content': _0x5d8d05
                        },
                        {
                            'role': 'user',
                            'content': _0x3e0311
                        }
                    ],
                    'temperature': this['config']['temperature'] || 0.7,
                    'max_tokens': this['config']['maxTokens'] || 0x400
                })
            });
            if (!_0x1333f0['ok']) {
                const _0x1ee4fc = await _0x1333f0['text']();
                console['error']('Grok\x20API\x20error:', _0x1ee4fc);
                return this['config']['fallbackResponse'];
            }
            const _0x5d73f5 = await _0x1333f0['json']();
            const _0x18d45a = _0x5d73f5['choices']?.[0x0]?.['message']?.['content'];
            return this['cleanResponse'](_0x18d45a) || this['config']['fallbackResponse'];
        } catch (_0x56f8d3) {
            console['error']('Grok\x20API\x20request\x20failed:', _0x56f8d3['message']);
            return this['config']['fallbackResponse'];
        }
    }
    async ['_callOpenAI'](_0x4fc8f5, _0x3b8470, _0x21afae) {
        const _0x532ced = this['config']['apiKey'] || process.env.OPENAI_API_KEY;
        if (!_0x532ced)
            return this['_missingApiKeyMessage']();
        const _0x19ca8a = 'https://api.openai.com/v1/chat/completions';
        const _0x72f4ee = await _0x0_0x4733cd(_0x19ca8a, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer\x20' + _0x532ced
            },
            'body': JSON['stringify']({
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': _0x3b8470
                    },
                    {
                        'role': 'user',
                        'content': _0x4fc8f5
                    }
                ],
                'temperature': this['config']['temperature'] || 0.7,
                'max_tokens': this['config']['maxTokens'] || 0x400
            })
        });
        if (!_0x72f4ee['ok']) {
            console['error']('OpenAI\x20API\x20error:', await _0x72f4ee['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x1e3617 = await _0x72f4ee['json']();
        const _0x311cf5 = _0x1e3617['choices']?.[0x0]?.['message']?.['content'];
        return this['cleanResponse'](_0x311cf5) || this['config']['fallbackResponse'];
    }
    async ['_callCustom'](_0x22c170, _0x225a64, _0x123374) {
        const _0x26a155 = this['config']['apiUrl'];
        if (!_0x26a155)
            return this['_missingApiKeyMessage']();
        const _0xe94231 = await _0x0_0x4733cd(_0x26a155, {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': this['config']['apiKey'] ? 'Bearer\x20' + this['config']['apiKey'] : ''
            },
            'body': JSON['stringify']({
                'message': _0x22c170,
                'context': _0x225a64,
                'metadata': _0x123374
            })
        });
        if (!_0xe94231['ok']) {
            console['error']('Custom\x20API\x20error:', await _0xe94231['text']());
            return this['config']['fallbackResponse'];
        }
        const _0x15ab9b = await _0xe94231['json']();
        const _0x243b55 = _0x15ab9b['response'] || _0x15ab9b['reply'] || _0x15ab9b['text'] || _0x15ab9b['result'];
        return this['cleanResponse'](_0x243b55) || this['config']['fallbackResponse'];
    }
    ['cleanMessage'](_0x2453b7) {
        const _0x11b6d1 = global['botname'] || 'NOVA';
        const _0x18ed38 = [
            new RegExp('^' + _0x11b6d1 + '\x5cs+', 'i'),
            new RegExp('^@\x5cw+\x5cs+', 'i'),
            new RegExp('^' + _0x11b6d1 + '[:]\x5cs+', 'i')
        ];
        let _0x5070e2 = _0x2453b7;
        for (const _0x4eabfd of _0x18ed38) {
            _0x5070e2 = _0x5070e2['replace'](_0x4eabfd, '')['trim']();
        }
        return _0x5070e2;
    }
    ['cleanResponse'](_0x205733) {
        if (!_0x205733)
            return null;
        let _0x15430f = _0x205733['replace'](/^AI:\s*/i, '')['replace'](/^Assistant:\s*/i, '')['replace'](/^NOVA:\s*/i, '')['trim']();
        if (_0x15430f['length'] > 0x7d0) {
            _0x15430f = _0x15430f['slice'](0x0, 0x7d0) + '...';
        }
        return _0x15430f;
    }
    ['getHistory'](_0x5ca50d) {
        const _0x56ba28 = this['history']['get'](_0x5ca50d) || [];
        const _0x2a538b = this['config']['maxHistory'] || 0xf;
        return _0x56ba28['slice'](-_0x2a538b);
    }
    ['addToHistory'](_0x338973, _0x41410c, _0x4187db) {
        if (!this['history']['has'](_0x338973)) {
            this['history']['set'](_0x338973, []);
        }
        const _0x18c91e = this['history']['get'](_0x338973);
        _0x18c91e['push']('User:\x20' + _0x41410c);
        _0x18c91e['push']('NOVA:\x20' + _0x4187db);
        const _0x127234 = this['config']['maxHistory'] || 0xf;
        if (_0x18c91e['length'] > _0x127234 * 0x2) {
            this['history']['set'](_0x338973, _0x18c91e['slice'](-_0x127234 * 0x2));
        }
    }
    ['clearHistory'](_0x352a66) {
        if (_0x352a66) {
            this['history']['delete'](_0x352a66);
        } else {
            this['history']['clear']();
        }
    }
    ['setContext'](_0x418faf, _0x5dd8d7) {
        if (_0x418faf) {
            this['contextCache']['set'](_0x418faf, _0x5dd8d7);
        } else {
            this['config']['customContext'] = _0x5dd8d7;
            _0x0_0x51b3db['set']('customContext', _0x5dd8d7);
        }
    }
    ['getContext'](_0x443f20) {
        return this['contextCache']['get'](_0x443f20) || this['config']['customContext'] || '';
    }
    async ['_callWithTimeout'](_0x13349e, _0x572bbb) {
        return new Promise((_0x5d3130, _0x375542) => {
            const _0x446d7d = setTimeout(() => {
                _0x375542(new Error('Request\x20timeout\x20after\x20' + _0x572bbb + 'ms'));
            }, _0x572bbb);
            _0x13349e()['then'](_0xc9a8d5 => {
                clearTimeout(_0x446d7d);
                _0x5d3130(_0xc9a8d5);
            })['catch'](_0x2519e0 => {
                clearTimeout(_0x446d7d);
                _0x375542(_0x2519e0);
            });
        });
    }
}
export default new ChatbotService();