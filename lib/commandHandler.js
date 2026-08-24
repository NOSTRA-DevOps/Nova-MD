import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x4f733f, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x11b198 from 'fs';
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
        const _0x1dcecb = _0x0_0x4f733f['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x11b198['existsSync'](_0x1dcecb))
            return;
        _0x0_0x11b198['watch'](_0x1dcecb, async (_0x1a7f23, _0x1551e3) => {
            if (_0x1551e3 && _0x1551e3['endsWith']('.js')) {
                const _0x2e24c7 = _0x0_0x4f733f['join'](_0x1dcecb, _0x1551e3);
                try {
                    if (_0x0_0x11b198['existsSync'](_0x2e24c7)) {
                        const _0x4f4663 = (await import(pathToFileURL(_0x2e24c7)['href']))['default'] || await import(pathToFileURL(_0x2e24c7)['href']);
                        if (_0x4f4663['command']) {
                            this['registerCommand'](_0x4f4663);
                            if (_0x4f4663['isPrefixless'] === !![]) {
                                const _0x324fbe = _0x4f4663['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x324fbe, _0x324fbe);
                                if (_0x4f4663['aliases'] && Array['isArray'](_0x4f4663['aliases'])) {
                                    _0x4f4663['aliases']['forEach'](_0x192357 => {
                                        this['prefixlessCommands']['set'](_0x192357['toLowerCase'](), _0x324fbe);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x1551e3);
                        }
                    }
                } catch (_0x2121ec) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x1551e3 + ':', _0x2121ec['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x20c7f2 = _0x0_0x4f733f['join'](process['cwd'](), 'plugins');
        const _0x58538b = _0x0_0x11b198['readdirSync'](_0x20c7f2)['filter'](_0x1925b1 => _0x1925b1['endsWith']('.js'));
        for (const _0x37dea8 of _0x58538b) {
            try {
                const _0x494560 = _0x0_0x4f733f['join'](_0x20c7f2, _0x37dea8);
                const _0xe2944e = (await import(pathToFileURL(_0x494560)['href']))['default'] || await import(pathToFileURL(_0x494560)['href']);
                if (_0xe2944e['command']) {
                    this['registerCommand'](_0xe2944e);
                    if (_0xe2944e['isPrefixless'] === !![]) {
                        const _0x471804 = _0xe2944e['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x471804, _0x471804);
                        if (_0xe2944e['aliases'] && Array['isArray'](_0xe2944e['aliases'])) {
                            _0xe2944e['aliases']['forEach'](_0x3da8c3 => {
                                this['prefixlessCommands']['set'](_0x3da8c3['toLowerCase'](), _0x471804);
                            });
                        }
                    }
                }
            } catch (_0x33a806) {
                console['error']('Error\x20loading\x20' + _0x37dea8 + ':', _0x33a806['message']);
            }
        }
    }
    ['registerCommand'](_0x1dc9f4) {
        const {
            command: _0x392036,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x31cf2b
        } = _0x1dc9f4;
        if (!_0x392036 || typeof _0x31cf2b !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x392036 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x413e04 = _0x392036['toLowerCase']();
        if (this['commands']['has'](_0x413e04)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x413e04 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x413e04, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x42ea1b = async (_0xa47b3a, _0x547af5, ..._0x381c17) => {
            const _0x5b3c1b = this['stats']['get'](_0x413e04);
            if (this['disabledCommands']['has'](_0x413e04)) {
                return await _0xa47b3a['sendMessage'](_0x547af5['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x413e04 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x547af5 });
            }
            const _0x15d6c7 = _0x547af5['key']['participant'] || _0x547af5['key']['remoteJid'];
            const _0x105ba0 = Date['now']();
            const _0x178b9d = _0x15d6c7 + '_' + _0x413e04;
            if (this['cooldowns']['has'](_0x178b9d)) {
                const _0x1fe017 = this['cooldowns']['get'](_0x178b9d) + (_0x1dc9f4['cooldown'] || 0xbb8);
                if (_0x105ba0 < _0x1fe017)
                    return;
            }
            this['cooldowns']['set'](_0x178b9d, _0x105ba0);
            const _0x3d26ae = process['hrtime']['bigint']();
            try {
                _0x5b3c1b['calls']++;
                return await _0x31cf2b(_0xa47b3a, _0x547af5, ..._0x381c17);
            } catch (_0x41117d) {
                _0x5b3c1b['errors']++;
                throw _0x41117d;
            } finally {
                const _0x4d675c = process['hrtime']['bigint']();
                _0x5b3c1b['totalTime'] += _0x4d675c - _0x3d26ae;
                _0x5b3c1b['avgMs'] = Number(_0x5b3c1b['totalTime'] / BigInt(_0x5b3c1b['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x413e04, {
            ..._0x1dc9f4,
            'command': _0x392036,
            'handler': _0x42ea1b,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x2c7bfe of aliases) {
            this['aliases']['set'](_0x2c7bfe['toLowerCase'](), _0x413e04);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x392036)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x392036);
        }
    }
    ['toggleCommand'](_0x35aafe) {
        const _0x3ea3a8 = _0x35aafe['toLowerCase']();
        if (this['disabledCommands']['has'](_0x3ea3a8)) {
            this['disabledCommands']['delete'](_0x3ea3a8);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x3ea3a8);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x3edebc, _0x4a506e) {
        const _0x5704b6 = [];
        for (let _0x5a2046 = 0x0; _0x5a2046 <= _0x3edebc['length']; _0x5a2046++)
            _0x5704b6[_0x5a2046] = [_0x5a2046];
        for (let _0x3c7799 = 0x0; _0x3c7799 <= _0x4a506e['length']; _0x3c7799++)
            _0x5704b6[0x0][_0x3c7799] = _0x3c7799;
        for (let _0x33f66c = 0x1; _0x33f66c <= _0x3edebc['length']; _0x33f66c++) {
            for (let _0x5db274 = 0x1; _0x5db274 <= _0x4a506e['length']; _0x5db274++) {
                _0x5704b6[_0x33f66c][_0x5db274] = Math['min'](_0x5704b6[_0x33f66c - 0x1][_0x5db274] + 0x1, _0x5704b6[_0x33f66c][_0x5db274 - 0x1] + 0x1, _0x5704b6[_0x33f66c - 0x1][_0x5db274 - 0x1] + (_0x3edebc[_0x33f66c - 0x1] === _0x4a506e[_0x5db274 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x5704b6[_0x3edebc['length']][_0x4a506e['length']];
    }
    ['findSuggestion'](_0x3d000d) {
        const _0x3fc0ac = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x11f6fc = null;
        let _0x5ea73c = 0x3;
        for (const _0x2e4b6a of _0x3fc0ac) {
            const _0x1cb55a = this['_levenshtein'](_0x3d000d, _0x2e4b6a);
            if (_0x1cb55a < _0x5ea73c) {
                _0x5ea73c = _0x1cb55a;
                _0x11f6fc = _0x2e4b6a;
            }
        }
        return _0x11f6fc;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x300e68, _0x3edd38]) => ({
            'command': _0x300e68,
            'usage': _0x3edd38['calls'],
            'errors': _0x3edd38['errors'],
            'average_speed': _0x3edd38['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x300e68) ? 'OFF' : 'ON'
        }))['sort']((_0x57f6db, _0x3dca6f) => _0x3dca6f['usage'] - _0x57f6db['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x51c24e of this['commands']['keys']()) {
            this['stats']['set'](_0x51c24e, {
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
    ['getCommand'](_0x2496f5, _0x22213c) {
        const _0x335ecd = _0x22213c['find'](_0x31260c => _0x2496f5['startsWith'](_0x31260c));
        const _0x5e3d6a = _0x2496f5['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x335ecd) {
            if (this['prefixlessCommands']['has'](_0x5e3d6a)) {
                const _0x16a71a = this['prefixlessCommands']['get'](_0x5e3d6a);
                return this['commands']['get'](_0x16a71a);
            }
            return null;
        }
        const _0xc135eb = _0x2496f5['slice'](_0x335ecd['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0xc135eb)) {
            return this['commands']['get'](_0xc135eb);
        }
        if (this['aliases']['has'](_0xc135eb)) {
            const _0x2bfac6 = this['aliases']['get'](_0xc135eb);
            return this['commands']['get'](_0x2bfac6);
        }
        const _0x31ffe8 = this['findSuggestion'](_0xc135eb);
        if (_0x31ffe8) {
            return {
                'command': _0x31ffe8,
                'handler': async (_0x1c848a, _0x3588ff) => {
                    const _0x493a56 = _0x3588ff['key']['remoteJid'];
                    await _0x1c848a['sendMessage'](_0x493a56, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x335ecd + _0x31ffe8 + '*?' }, { 'quoted': _0x3588ff });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x292f27) {
        return this['categories']['get'](_0x292f27['toLowerCase']()) || [];
    }
}
export default new CommandHandler();