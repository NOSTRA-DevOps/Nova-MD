import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x10414d, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x9f010c from 'fs';
class CommandHandler {
    constructor() {
        this['commands'] = new Map();
        this['aliases'] = new Map();
        this['categories'] = new Map();
        this['stats'] = new Map();
        this['cooldowns'] = new Map();
        this['disabledCommands'] = new Set();
        this['prefixlessCommands'] = new Map();
        this['watchPlugins']();
    }
    async ['watchPlugins']() {
        const _0x491b4a = _0x0_0x10414d['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x9f010c['existsSync'](_0x491b4a))
            return;
        _0x0_0x9f010c['watch'](_0x491b4a, async (_0x71b7f8, _0x22380a) => {
            if (_0x22380a && _0x22380a['endsWith']('.js')) {
                const _0x526fc5 = _0x0_0x10414d['join'](_0x491b4a, _0x22380a);
                try {
                    if (_0x0_0x9f010c['existsSync'](_0x526fc5)) {
                        const _0x411ad2 = (await import(pathToFileURL(_0x526fc5)['href']))['default'] || await import(pathToFileURL(_0x526fc5)['href']);
                        if (_0x411ad2['command']) {
                            this['registerCommand'](_0x411ad2);
                            if (_0x411ad2['isPrefixless'] === !![]) {
                                const _0x320bec = _0x411ad2['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x320bec, _0x320bec);
                                if (_0x411ad2['aliases'] && Array['isArray'](_0x411ad2['aliases'])) {
                                    _0x411ad2['aliases']['forEach'](_0x4d8c13 => {
                                        this['prefixlessCommands']['set'](_0x4d8c13['toLowerCase'](), _0x320bec);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x22380a);
                        }
                    }
                } catch (_0x46cb21) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x22380a + ':', _0x46cb21['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x9e3e61 = _0x0_0x10414d['join'](process['cwd'](), 'plugins');
        const _0xccc85d = _0x0_0x9f010c['readdirSync'](_0x9e3e61)['filter'](_0x8c64b => _0x8c64b['endsWith']('.js'));
        for (const _0x3ce818 of _0xccc85d) {
            try {
                const _0x482d01 = _0x0_0x10414d['join'](_0x9e3e61, _0x3ce818);
                const _0x20bd07 = (await import(pathToFileURL(_0x482d01)['href']))['default'] || await import(pathToFileURL(_0x482d01)['href']);
                if (_0x20bd07['command']) {
                    this['registerCommand'](_0x20bd07);
                    if (_0x20bd07['isPrefixless'] === !![]) {
                        const _0x350d0a = _0x20bd07['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x350d0a, _0x350d0a);
                        if (_0x20bd07['aliases'] && Array['isArray'](_0x20bd07['aliases'])) {
                            _0x20bd07['aliases']['forEach'](_0x4ee2e8 => {
                                this['prefixlessCommands']['set'](_0x4ee2e8['toLowerCase'](), _0x350d0a);
                            });
                        }
                    }
                }
            } catch (_0x554830) {
                console['error']('Error\x20loading\x20' + _0x3ce818 + ':', _0x554830['message']);
            }
        }
    }
    ['registerCommand'](_0x4cddf7) {
        const {
            command: _0xe7b36c,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x137443
        } = _0x4cddf7;
        if (!_0xe7b36c || typeof _0x137443 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0xe7b36c || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x23aec9 = _0xe7b36c['toLowerCase']();
        if (this['commands']['has'](_0x23aec9)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x23aec9 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x23aec9, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x449855 = async (_0x23b920, _0x4ff536, ..._0x473eb5) => {
            const _0x5e12e7 = this['stats']['get'](_0x23aec9);
            if (this['disabledCommands']['has'](_0x23aec9)) {
                return await _0x23b920['sendMessage'](_0x4ff536['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x23aec9 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x4ff536 });
            }
            const _0x49f2cc = _0x4ff536['key']['participant'] || _0x4ff536['key']['remoteJid'];
            const _0x1202a4 = Date['now']();
            const _0x4a39c4 = _0x49f2cc + '_' + _0x23aec9;
            if (this['cooldowns']['has'](_0x4a39c4)) {
                const _0x1d5ff9 = this['cooldowns']['get'](_0x4a39c4) + (_0x4cddf7['cooldown'] || 0xbb8);
                if (_0x1202a4 < _0x1d5ff9)
                    return;
            }
            this['cooldowns']['set'](_0x4a39c4, _0x1202a4);
            const _0x2b0af7 = process['hrtime']['bigint']();
            try {
                _0x5e12e7['calls']++;
                return await _0x137443(_0x23b920, _0x4ff536, ..._0x473eb5);
            } catch (_0x2e2512) {
                _0x5e12e7['errors']++;
                throw _0x2e2512;
            } finally {
                const _0x24f642 = process['hrtime']['bigint']();
                _0x5e12e7['totalTime'] += _0x24f642 - _0x2b0af7;
                _0x5e12e7['avgMs'] = Number(_0x5e12e7['totalTime'] / BigInt(_0x5e12e7['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x23aec9, {
            ..._0x4cddf7,
            'command': _0xe7b36c,
            'handler': _0x449855,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x56dce1 of aliases) {
            this['aliases']['set'](_0x56dce1['toLowerCase'](), _0x23aec9);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0xe7b36c)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0xe7b36c);
        }
    }
    ['toggleCommand'](_0x287a77) {
        const _0x38157d = _0x287a77['toLowerCase']();
        if (this['disabledCommands']['has'](_0x38157d)) {
            this['disabledCommands']['delete'](_0x38157d);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x38157d);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x4cd209, _0x1acb97) {
        const _0x19a34b = [];
        for (let _0x2efb7f = 0x0; _0x2efb7f <= _0x4cd209['length']; _0x2efb7f++)
            _0x19a34b[_0x2efb7f] = [_0x2efb7f];
        for (let _0x581fd2 = 0x0; _0x581fd2 <= _0x1acb97['length']; _0x581fd2++)
            _0x19a34b[0x0][_0x581fd2] = _0x581fd2;
        for (let _0x49e096 = 0x1; _0x49e096 <= _0x4cd209['length']; _0x49e096++) {
            for (let _0x13f9c0 = 0x1; _0x13f9c0 <= _0x1acb97['length']; _0x13f9c0++) {
                _0x19a34b[_0x49e096][_0x13f9c0] = Math['min'](_0x19a34b[_0x49e096 - 0x1][_0x13f9c0] + 0x1, _0x19a34b[_0x49e096][_0x13f9c0 - 0x1] + 0x1, _0x19a34b[_0x49e096 - 0x1][_0x13f9c0 - 0x1] + (_0x4cd209[_0x49e096 - 0x1] === _0x1acb97[_0x13f9c0 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x19a34b[_0x4cd209['length']][_0x1acb97['length']];
    }
    ['findSuggestion'](_0x45542a) {
        const _0x2023da = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x5bbb78 = null;
        let _0x1f174e = 0x3;
        for (const _0x561f38 of _0x2023da) {
            const _0x50a510 = this['_levenshtein'](_0x45542a, _0x561f38);
            if (_0x50a510 < _0x1f174e) {
                _0x1f174e = _0x50a510;
                _0x5bbb78 = _0x561f38;
            }
        }
        return _0x5bbb78;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x336340, _0x250710]) => ({
            'command': _0x336340,
            'usage': _0x250710['calls'],
            'errors': _0x250710['errors'],
            'average_speed': _0x250710['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x336340) ? 'OFF' : 'ON'
        }))['sort']((_0x527ad8, _0x284213) => _0x284213['usage'] - _0x527ad8['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x1273cc of this['commands']['keys']()) {
            this['stats']['set'](_0x1273cc, {
                'calls': 0x0,
                'errors': 0x0,
                'totalTime': 0x0n,
                'avgMs': 0x0
            });
        }
    }
    async ['reloadCommands']() {
        this['commands']['clear']();
        this['aliases']['clear']();
        this['categories']['clear']();
        this['stats']['clear']();
        this['cooldowns']['clear']();
        this['disabledCommands']['clear']();
        this['prefixlessCommands']['clear']();
        await this['loadCommands']();
    }
    ['getCommand'](_0x5e4952, _0x445003) {
        const _0x535a16 = _0x445003['find'](_0x1a6eb0 => _0x5e4952['startsWith'](_0x1a6eb0));
        const _0x278ff8 = _0x5e4952['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x535a16) {
            if (this['prefixlessCommands']['has'](_0x278ff8)) {
                const _0x5a74a5 = this['prefixlessCommands']['get'](_0x278ff8);
                return this['commands']['get'](_0x5a74a5);
            }
            return null;
        }
        const _0xcf0c64 = _0x5e4952['slice'](_0x535a16['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0xcf0c64)) {
            return this['commands']['get'](_0xcf0c64);
        }
        if (this['aliases']['has'](_0xcf0c64)) {
            const _0x2348fc = this['aliases']['get'](_0xcf0c64);
            return this['commands']['get'](_0x2348fc);
        }
        const _0x455ef7 = this['findSuggestion'](_0xcf0c64);
        if (_0x455ef7) {
            return {
                'command': _0x455ef7,
                'handler': async (_0x3152f6, _0x448d99) => {
                    const _0x32cc5b = _0x448d99['key']['remoteJid'];
                    await _0x3152f6['sendMessage'](_0x32cc5b, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x535a16 + _0x455ef7 + '*?' }, { 'quoted': _0x448d99 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x32ce48) {
        return this['categories']['get'](_0x32ce48['toLowerCase']()) || [];
    }
}
export default new CommandHandler();