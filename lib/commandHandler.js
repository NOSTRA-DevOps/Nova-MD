import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x3ffe4d, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xe9355f from 'fs';
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
        const _0x4dd825 = _0x0_0x3ffe4d['join'](process['cwd'](), 'plugins');
        if (!_0x0_0xe9355f['existsSync'](_0x4dd825))
            return;
        _0x0_0xe9355f['watch'](_0x4dd825, async (_0x2c2815, _0x4c5d9c) => {
            if (_0x4c5d9c && _0x4c5d9c['endsWith']('.js')) {
                const _0x20c562 = _0x0_0x3ffe4d['join'](_0x4dd825, _0x4c5d9c);
                try {
                    if (_0x0_0xe9355f['existsSync'](_0x20c562)) {
                        const _0x52e5d3 = (await import(pathToFileURL(_0x20c562)['href']))['default'] || await import(pathToFileURL(_0x20c562)['href']);
                        if (_0x52e5d3['command']) {
                            this['registerCommand'](_0x52e5d3);
                            if (_0x52e5d3['isPrefixless'] === !![]) {
                                const _0x186d49 = _0x52e5d3['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x186d49, _0x186d49);
                                if (_0x52e5d3['aliases'] && Array['isArray'](_0x52e5d3['aliases'])) {
                                    _0x52e5d3['aliases']['forEach'](_0x2a86b7 => {
                                        this['prefixlessCommands']['set'](_0x2a86b7['toLowerCase'](), _0x186d49);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x4c5d9c);
                        }
                    }
                } catch (_0xa3575b) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x4c5d9c + ':', _0xa3575b['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x1a00d4 = _0x0_0x3ffe4d['join'](process['cwd'](), 'plugins');
        const _0x5085bb = _0x0_0xe9355f['readdirSync'](_0x1a00d4)['filter'](_0x1be56a => _0x1be56a['endsWith']('.js'));
        for (const _0x2e36b1 of _0x5085bb) {
            try {
                const _0x5d61b7 = _0x0_0x3ffe4d['join'](_0x1a00d4, _0x2e36b1);
                const _0x303f08 = (await import(pathToFileURL(_0x5d61b7)['href']))['default'] || await import(pathToFileURL(_0x5d61b7)['href']);
                if (_0x303f08['command']) {
                    this['registerCommand'](_0x303f08);
                    if (_0x303f08['isPrefixless'] === !![]) {
                        const _0x433f90 = _0x303f08['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x433f90, _0x433f90);
                        if (_0x303f08['aliases'] && Array['isArray'](_0x303f08['aliases'])) {
                            _0x303f08['aliases']['forEach'](_0x1ec273 => {
                                this['prefixlessCommands']['set'](_0x1ec273['toLowerCase'](), _0x433f90);
                            });
                        }
                    }
                }
            } catch (_0x37b935) {
                console['error']('Error\x20loading\x20' + _0x2e36b1 + ':', _0x37b935['message']);
            }
        }
    }
    ['registerCommand'](_0x422326) {
        const {
            command: _0x3d397b,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x5dda52
        } = _0x422326;
        if (!_0x3d397b || typeof _0x5dda52 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x3d397b || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x176ce1 = _0x3d397b['toLowerCase']();
        if (this['commands']['has'](_0x176ce1)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x176ce1 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x176ce1, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x56aa69 = async (_0x598be3, _0x1def15, ..._0x41df40) => {
            const _0x1620dc = this['stats']['get'](_0x176ce1);
            if (this['disabledCommands']['has'](_0x176ce1)) {
                return await _0x598be3['sendMessage'](_0x1def15['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x176ce1 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x1def15 });
            }
            const _0x37501a = _0x1def15['key']['participant'] || _0x1def15['key']['remoteJid'];
            const _0x37e0e4 = Date['now']();
            const _0x52653b = _0x37501a + '_' + _0x176ce1;
            if (this['cooldowns']['has'](_0x52653b)) {
                const _0x53e015 = this['cooldowns']['get'](_0x52653b) + (_0x422326['cooldown'] || 0xbb8);
                if (_0x37e0e4 < _0x53e015)
                    return;
            }
            this['cooldowns']['set'](_0x52653b, _0x37e0e4);
            const _0x50c2ae = process['hrtime']['bigint']();
            try {
                _0x1620dc['calls']++;
                return await _0x5dda52(_0x598be3, _0x1def15, ..._0x41df40);
            } catch (_0x417bba) {
                _0x1620dc['errors']++;
                throw _0x417bba;
            } finally {
                const _0x3085f3 = process['hrtime']['bigint']();
                _0x1620dc['totalTime'] += _0x3085f3 - _0x50c2ae;
                _0x1620dc['avgMs'] = Number(_0x1620dc['totalTime'] / BigInt(_0x1620dc['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x176ce1, {
            ..._0x422326,
            'command': _0x3d397b,
            'handler': _0x56aa69,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x59f2e5 of aliases) {
            this['aliases']['set'](_0x59f2e5['toLowerCase'](), _0x176ce1);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x3d397b)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x3d397b);
        }
    }
    ['toggleCommand'](_0xeba482) {
        const _0x63a02b = _0xeba482['toLowerCase']();
        if (this['disabledCommands']['has'](_0x63a02b)) {
            this['disabledCommands']['delete'](_0x63a02b);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x63a02b);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x5e118, _0x4f6fb3) {
        const _0x3c37f5 = [];
        for (let _0x2e0630 = 0x0; _0x2e0630 <= _0x5e118['length']; _0x2e0630++)
            _0x3c37f5[_0x2e0630] = [_0x2e0630];
        for (let _0x5e57fd = 0x0; _0x5e57fd <= _0x4f6fb3['length']; _0x5e57fd++)
            _0x3c37f5[0x0][_0x5e57fd] = _0x5e57fd;
        for (let _0xf10a77 = 0x1; _0xf10a77 <= _0x5e118['length']; _0xf10a77++) {
            for (let _0x4fce1e = 0x1; _0x4fce1e <= _0x4f6fb3['length']; _0x4fce1e++) {
                _0x3c37f5[_0xf10a77][_0x4fce1e] = Math['min'](_0x3c37f5[_0xf10a77 - 0x1][_0x4fce1e] + 0x1, _0x3c37f5[_0xf10a77][_0x4fce1e - 0x1] + 0x1, _0x3c37f5[_0xf10a77 - 0x1][_0x4fce1e - 0x1] + (_0x5e118[_0xf10a77 - 0x1] === _0x4f6fb3[_0x4fce1e - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x3c37f5[_0x5e118['length']][_0x4f6fb3['length']];
    }
    ['findSuggestion'](_0x28f507) {
        const _0x5eb915 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x2fc9d2 = null;
        let _0x3a1d0f = 0x3;
        for (const _0x54ed74 of _0x5eb915) {
            const _0x4726d8 = this['_levenshtein'](_0x28f507, _0x54ed74);
            if (_0x4726d8 < _0x3a1d0f) {
                _0x3a1d0f = _0x4726d8;
                _0x2fc9d2 = _0x54ed74;
            }
        }
        return _0x2fc9d2;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x1cb563, _0x2ec631]) => ({
            'command': _0x1cb563,
            'usage': _0x2ec631['calls'],
            'errors': _0x2ec631['errors'],
            'average_speed': _0x2ec631['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x1cb563) ? 'OFF' : 'ON'
        }))['sort']((_0x49b622, _0x58f1d5) => _0x58f1d5['usage'] - _0x49b622['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x19b356 of this['commands']['keys']()) {
            this['stats']['set'](_0x19b356, {
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
    ['getCommand'](_0x5252cd, _0x2c2fa2) {
        const _0x50671f = _0x2c2fa2['find'](_0x3c77bb => _0x5252cd['startsWith'](_0x3c77bb));
        const _0xd4ddab = _0x5252cd['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x50671f) {
            if (this['prefixlessCommands']['has'](_0xd4ddab)) {
                const _0x65d185 = this['prefixlessCommands']['get'](_0xd4ddab);
                return this['commands']['get'](_0x65d185);
            }
            return null;
        }
        const _0x115b07 = _0x5252cd['slice'](_0x50671f['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x115b07)) {
            return this['commands']['get'](_0x115b07);
        }
        if (this['aliases']['has'](_0x115b07)) {
            const _0x23399a = this['aliases']['get'](_0x115b07);
            return this['commands']['get'](_0x23399a);
        }
        const _0x51a671 = this['findSuggestion'](_0x115b07);
        if (_0x51a671) {
            return {
                'command': _0x51a671,
                'handler': async (_0x230adc, _0x45bc34) => {
                    const _0x4f1190 = _0x45bc34['key']['remoteJid'];
                    await _0x230adc['sendMessage'](_0x4f1190, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x50671f + _0x51a671 + '*?' }, { 'quoted': _0x45bc34 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x230fac) {
        return this['categories']['get'](_0x230fac['toLowerCase']()) || [];
    }
}
export default new CommandHandler();