import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x26c056, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x37a830 from 'fs';
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
        const _0x2f6872 = _0x0_0x26c056['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x37a830['existsSync'](_0x2f6872))
            return;
        _0x0_0x37a830['watch'](_0x2f6872, async (_0x42a19e, _0x1dc195) => {
            if (_0x1dc195 && _0x1dc195['endsWith']('.js')) {
                const _0x685a31 = _0x0_0x26c056['join'](_0x2f6872, _0x1dc195);
                try {
                    if (_0x0_0x37a830['existsSync'](_0x685a31)) {
                        const _0x472620 = (await import(pathToFileURL(_0x685a31)['href']))['default'] || await import(pathToFileURL(_0x685a31)['href']);
                        if (_0x472620['command']) {
                            this['registerCommand'](_0x472620);
                            if (_0x472620['isPrefixless'] === !![]) {
                                const _0x58603a = _0x472620['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x58603a, _0x58603a);
                                if (_0x472620['aliases'] && Array['isArray'](_0x472620['aliases'])) {
                                    _0x472620['aliases']['forEach'](_0x2e9f2f => {
                                        this['prefixlessCommands']['set'](_0x2e9f2f['toLowerCase'](), _0x58603a);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x1dc195);
                        }
                    }
                } catch (_0x309c4c) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x1dc195 + ':', _0x309c4c['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0xfccc9 = _0x0_0x26c056['join'](process['cwd'](), 'plugins');
        const _0x4138d7 = _0x0_0x37a830['readdirSync'](_0xfccc9)['filter'](_0x5b83fa => _0x5b83fa['endsWith']('.js'));
        for (const _0x2d7ff2 of _0x4138d7) {
            try {
                const _0x3c0a21 = _0x0_0x26c056['join'](_0xfccc9, _0x2d7ff2);
                const _0x360adb = (await import(pathToFileURL(_0x3c0a21)['href']))['default'] || await import(pathToFileURL(_0x3c0a21)['href']);
                if (_0x360adb['command']) {
                    this['registerCommand'](_0x360adb);
                    if (_0x360adb['isPrefixless'] === !![]) {
                        const _0x35fb4a = _0x360adb['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x35fb4a, _0x35fb4a);
                        if (_0x360adb['aliases'] && Array['isArray'](_0x360adb['aliases'])) {
                            _0x360adb['aliases']['forEach'](_0x428926 => {
                                this['prefixlessCommands']['set'](_0x428926['toLowerCase'](), _0x35fb4a);
                            });
                        }
                    }
                }
            } catch (_0x3d2519) {
                console['error']('Error\x20loading\x20' + _0x2d7ff2 + ':', _0x3d2519['message']);
            }
        }
    }
    ['registerCommand'](_0x5284c8) {
        const {
            command: _0x11a7d2,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x579c37
        } = _0x5284c8;
        if (!_0x11a7d2 || typeof _0x579c37 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x11a7d2 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x5b4d0d = _0x11a7d2['toLowerCase']();
        if (this['commands']['has'](_0x5b4d0d)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x5b4d0d + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x5b4d0d, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x216d7b = async (_0x36b6f8, _0x4c782c, ..._0x4bc1b8) => {
            const _0x434196 = this['stats']['get'](_0x5b4d0d);
            if (this['disabledCommands']['has'](_0x5b4d0d)) {
                return await _0x36b6f8['sendMessage'](_0x4c782c['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x5b4d0d + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x4c782c });
            }
            const _0x443bf4 = _0x4c782c['key']['participant'] || _0x4c782c['key']['remoteJid'];
            const _0x21e005 = Date['now']();
            const _0x2f1622 = _0x443bf4 + '_' + _0x5b4d0d;
            if (this['cooldowns']['has'](_0x2f1622)) {
                const _0x3d881c = this['cooldowns']['get'](_0x2f1622) + (_0x5284c8['cooldown'] || 0xbb8);
                if (_0x21e005 < _0x3d881c)
                    return;
            }
            this['cooldowns']['set'](_0x2f1622, _0x21e005);
            const _0x38ab78 = process['hrtime']['bigint']();
            try {
                _0x434196['calls']++;
                return await _0x579c37(_0x36b6f8, _0x4c782c, ..._0x4bc1b8);
            } catch (_0x49fccd) {
                _0x434196['errors']++;
                throw _0x49fccd;
            } finally {
                const _0x3cbd4d = process['hrtime']['bigint']();
                _0x434196['totalTime'] += _0x3cbd4d - _0x38ab78;
                _0x434196['avgMs'] = Number(_0x434196['totalTime'] / BigInt(_0x434196['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x5b4d0d, {
            ..._0x5284c8,
            'command': _0x11a7d2,
            'handler': _0x216d7b,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x17ae60 of aliases) {
            this['aliases']['set'](_0x17ae60['toLowerCase'](), _0x5b4d0d);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x11a7d2)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x11a7d2);
        }
    }
    ['toggleCommand'](_0x2625e6) {
        const _0x493bb4 = _0x2625e6['toLowerCase']();
        if (this['disabledCommands']['has'](_0x493bb4)) {
            this['disabledCommands']['delete'](_0x493bb4);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x493bb4);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x303b9b, _0x4b5f55) {
        const _0x519922 = [];
        for (let _0x3271d7 = 0x0; _0x3271d7 <= _0x303b9b['length']; _0x3271d7++)
            _0x519922[_0x3271d7] = [_0x3271d7];
        for (let _0x2d4cdb = 0x0; _0x2d4cdb <= _0x4b5f55['length']; _0x2d4cdb++)
            _0x519922[0x0][_0x2d4cdb] = _0x2d4cdb;
        for (let _0x4e866e = 0x1; _0x4e866e <= _0x303b9b['length']; _0x4e866e++) {
            for (let _0x58b4c8 = 0x1; _0x58b4c8 <= _0x4b5f55['length']; _0x58b4c8++) {
                _0x519922[_0x4e866e][_0x58b4c8] = Math['min'](_0x519922[_0x4e866e - 0x1][_0x58b4c8] + 0x1, _0x519922[_0x4e866e][_0x58b4c8 - 0x1] + 0x1, _0x519922[_0x4e866e - 0x1][_0x58b4c8 - 0x1] + (_0x303b9b[_0x4e866e - 0x1] === _0x4b5f55[_0x58b4c8 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x519922[_0x303b9b['length']][_0x4b5f55['length']];
    }
    ['findSuggestion'](_0x4ab721) {
        const _0x7465e9 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x42d0e9 = null;
        let _0x1b156a = 0x3;
        for (const _0x22e0ba of _0x7465e9) {
            const _0x19b515 = this['_levenshtein'](_0x4ab721, _0x22e0ba);
            if (_0x19b515 < _0x1b156a) {
                _0x1b156a = _0x19b515;
                _0x42d0e9 = _0x22e0ba;
            }
        }
        return _0x42d0e9;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x4718c5, _0x4b638e]) => ({
            'command': _0x4718c5,
            'usage': _0x4b638e['calls'],
            'errors': _0x4b638e['errors'],
            'average_speed': _0x4b638e['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x4718c5) ? 'OFF' : 'ON'
        }))['sort']((_0x8becc9, _0x131cee) => _0x131cee['usage'] - _0x8becc9['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x50733b of this['commands']['keys']()) {
            this['stats']['set'](_0x50733b, {
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
    ['getCommand'](_0x215145, _0x4754d2) {
        const _0x3f4b38 = _0x4754d2['find'](_0x55061f => _0x215145['startsWith'](_0x55061f));
        const _0x5f149c = _0x215145['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x3f4b38) {
            if (this['prefixlessCommands']['has'](_0x5f149c)) {
                const _0x582ee9 = this['prefixlessCommands']['get'](_0x5f149c);
                return this['commands']['get'](_0x582ee9);
            }
            return null;
        }
        const _0x5ec176 = _0x215145['slice'](_0x3f4b38['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x5ec176)) {
            return this['commands']['get'](_0x5ec176);
        }
        if (this['aliases']['has'](_0x5ec176)) {
            const _0x5ad341 = this['aliases']['get'](_0x5ec176);
            return this['commands']['get'](_0x5ad341);
        }
        const _0x507ff8 = this['findSuggestion'](_0x5ec176);
        if (_0x507ff8) {
            return {
                'command': _0x507ff8,
                'handler': async (_0x4becd1, _0x58e3e9) => {
                    const _0xcb5eda = _0x58e3e9['key']['remoteJid'];
                    await _0x4becd1['sendMessage'](_0xcb5eda, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x3f4b38 + _0x507ff8 + '*?' }, { 'quoted': _0x58e3e9 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x1a6cdc) {
        return this['categories']['get'](_0x1a6cdc['toLowerCase']()) || [];
    }
}
export default new CommandHandler();