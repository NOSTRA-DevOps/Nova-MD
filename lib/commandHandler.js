import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x18dbba, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x390bac from 'fs';
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
        const _0x575640 = _0x0_0x18dbba['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x390bac['existsSync'](_0x575640))
            return;
        _0x0_0x390bac['watch'](_0x575640, async (_0x5658ac, _0xf36f8e) => {
            if (_0xf36f8e && _0xf36f8e['endsWith']('.js')) {
                const _0x301e65 = _0x0_0x18dbba['join'](_0x575640, _0xf36f8e);
                try {
                    if (_0x0_0x390bac['existsSync'](_0x301e65)) {
                        const _0x4e4a81 = (await import(pathToFileURL(_0x301e65)['href']))['default'] || await import(pathToFileURL(_0x301e65)['href']);
                        if (_0x4e4a81['command']) {
                            this['registerCommand'](_0x4e4a81);
                            if (_0x4e4a81['isPrefixless'] === !![]) {
                                const _0x5ad0a4 = _0x4e4a81['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x5ad0a4, _0x5ad0a4);
                                if (_0x4e4a81['aliases'] && Array['isArray'](_0x4e4a81['aliases'])) {
                                    _0x4e4a81['aliases']['forEach'](_0xad5fdc => {
                                        this['prefixlessCommands']['set'](_0xad5fdc['toLowerCase'](), _0x5ad0a4);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0xf36f8e);
                        }
                    }
                } catch (_0x4ef577) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0xf36f8e + ':', _0x4ef577['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x2d9f87 = _0x0_0x18dbba['join'](process['cwd'](), 'plugins');
        const _0x51998d = _0x0_0x390bac['readdirSync'](_0x2d9f87)['filter'](_0x189910 => _0x189910['endsWith']('.js'));
        for (const _0x1c6ff1 of _0x51998d) {
            try {
                const _0x54965b = _0x0_0x18dbba['join'](_0x2d9f87, _0x1c6ff1);
                const _0x9617fd = (await import(pathToFileURL(_0x54965b)['href']))['default'] || await import(pathToFileURL(_0x54965b)['href']);
                if (_0x9617fd['command']) {
                    this['registerCommand'](_0x9617fd);
                    if (_0x9617fd['isPrefixless'] === !![]) {
                        const _0x101a95 = _0x9617fd['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x101a95, _0x101a95);
                        if (_0x9617fd['aliases'] && Array['isArray'](_0x9617fd['aliases'])) {
                            _0x9617fd['aliases']['forEach'](_0x51767e => {
                                this['prefixlessCommands']['set'](_0x51767e['toLowerCase'](), _0x101a95);
                            });
                        }
                    }
                }
            } catch (_0x3801f1) {
                console['error']('Error\x20loading\x20' + _0x1c6ff1 + ':', _0x3801f1['message']);
            }
        }
    }
    ['registerCommand'](_0x593577) {
        const {
            command: _0x59613f,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x4412b2
        } = _0x593577;
        if (!_0x59613f || typeof _0x4412b2 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x59613f || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x953991 = _0x59613f['toLowerCase']();
        if (this['commands']['has'](_0x953991)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x953991 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x953991, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x3a6fcf = async (_0x26ce47, _0x296d15, ..._0x5371af) => {
            const _0x4a0378 = this['stats']['get'](_0x953991);
            if (this['disabledCommands']['has'](_0x953991)) {
                return await _0x26ce47['sendMessage'](_0x296d15['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x953991 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x296d15 });
            }
            const _0x39b8b7 = _0x296d15['key']['participant'] || _0x296d15['key']['remoteJid'];
            const _0x4da85e = Date['now']();
            const _0x20f124 = _0x39b8b7 + '_' + _0x953991;
            if (this['cooldowns']['has'](_0x20f124)) {
                const _0x358749 = this['cooldowns']['get'](_0x20f124) + (_0x593577['cooldown'] || 0xbb8);
                if (_0x4da85e < _0x358749)
                    return;
            }
            this['cooldowns']['set'](_0x20f124, _0x4da85e);
            const _0x52a7aa = process['hrtime']['bigint']();
            try {
                _0x4a0378['calls']++;
                return await _0x4412b2(_0x26ce47, _0x296d15, ..._0x5371af);
            } catch (_0xc231cc) {
                _0x4a0378['errors']++;
                throw _0xc231cc;
            } finally {
                const _0x47c44e = process['hrtime']['bigint']();
                _0x4a0378['totalTime'] += _0x47c44e - _0x52a7aa;
                _0x4a0378['avgMs'] = Number(_0x4a0378['totalTime'] / BigInt(_0x4a0378['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x953991, {
            ..._0x593577,
            'command': _0x59613f,
            'handler': _0x3a6fcf,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x1884d5 of aliases) {
            this['aliases']['set'](_0x1884d5['toLowerCase'](), _0x953991);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x59613f)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x59613f);
        }
    }
    ['toggleCommand'](_0x80a9b8) {
        const _0x29ec10 = _0x80a9b8['toLowerCase']();
        if (this['disabledCommands']['has'](_0x29ec10)) {
            this['disabledCommands']['delete'](_0x29ec10);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x29ec10);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x473ff6, _0x494c41) {
        const _0x36dfb0 = [];
        for (let _0x58fbc7 = 0x0; _0x58fbc7 <= _0x473ff6['length']; _0x58fbc7++)
            _0x36dfb0[_0x58fbc7] = [_0x58fbc7];
        for (let _0x2fd053 = 0x0; _0x2fd053 <= _0x494c41['length']; _0x2fd053++)
            _0x36dfb0[0x0][_0x2fd053] = _0x2fd053;
        for (let _0x3c75dd = 0x1; _0x3c75dd <= _0x473ff6['length']; _0x3c75dd++) {
            for (let _0x8fec77 = 0x1; _0x8fec77 <= _0x494c41['length']; _0x8fec77++) {
                _0x36dfb0[_0x3c75dd][_0x8fec77] = Math['min'](_0x36dfb0[_0x3c75dd - 0x1][_0x8fec77] + 0x1, _0x36dfb0[_0x3c75dd][_0x8fec77 - 0x1] + 0x1, _0x36dfb0[_0x3c75dd - 0x1][_0x8fec77 - 0x1] + (_0x473ff6[_0x3c75dd - 0x1] === _0x494c41[_0x8fec77 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x36dfb0[_0x473ff6['length']][_0x494c41['length']];
    }
    ['findSuggestion'](_0x3589c6) {
        const _0xec26a2 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x41c3ca = null;
        let _0x3b1d24 = 0x3;
        for (const _0x4b9ac7 of _0xec26a2) {
            const _0x48baf9 = this['_levenshtein'](_0x3589c6, _0x4b9ac7);
            if (_0x48baf9 < _0x3b1d24) {
                _0x3b1d24 = _0x48baf9;
                _0x41c3ca = _0x4b9ac7;
            }
        }
        return _0x41c3ca;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x445e05, _0x54eb34]) => ({
            'command': _0x445e05,
            'usage': _0x54eb34['calls'],
            'errors': _0x54eb34['errors'],
            'average_speed': _0x54eb34['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x445e05) ? 'OFF' : 'ON'
        }))['sort']((_0x4208ad, _0xcde5de) => _0xcde5de['usage'] - _0x4208ad['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x233d63 of this['commands']['keys']()) {
            this['stats']['set'](_0x233d63, {
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
    ['getCommand'](_0x184968, _0x3987e5) {
        const _0x47f370 = _0x3987e5['find'](_0x299b6d => _0x184968['startsWith'](_0x299b6d));
        const _0x22fcbf = _0x184968['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x47f370) {
            if (this['prefixlessCommands']['has'](_0x22fcbf)) {
                const _0xebe123 = this['prefixlessCommands']['get'](_0x22fcbf);
                return this['commands']['get'](_0xebe123);
            }
            return null;
        }
        const _0x4a5245 = _0x184968['slice'](_0x47f370['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x4a5245)) {
            return this['commands']['get'](_0x4a5245);
        }
        if (this['aliases']['has'](_0x4a5245)) {
            const _0x42c807 = this['aliases']['get'](_0x4a5245);
            return this['commands']['get'](_0x42c807);
        }
        const _0x1a3316 = this['findSuggestion'](_0x4a5245);
        if (_0x1a3316) {
            return {
                'command': _0x1a3316,
                'handler': async (_0x329c94, _0x10639d) => {
                    const _0x3e0f0f = _0x10639d['key']['remoteJid'];
                    await _0x329c94['sendMessage'](_0x3e0f0f, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x47f370 + _0x1a3316 + '*?' }, { 'quoted': _0x10639d });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x20969e) {
        return this['categories']['get'](_0x20969e['toLowerCase']()) || [];
    }
}
export default new CommandHandler();