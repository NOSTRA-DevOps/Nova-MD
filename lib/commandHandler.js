import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x4fc197, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x148f96 from 'fs';
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
        const _0x2ff30 = _0x0_0x4fc197['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x148f96['existsSync'](_0x2ff30))
            return;
        _0x0_0x148f96['watch'](_0x2ff30, async (_0x5ce2a1, _0xb670d6) => {
            if (_0xb670d6 && _0xb670d6['endsWith']('.js')) {
                const _0xc62fa1 = _0x0_0x4fc197['join'](_0x2ff30, _0xb670d6);
                try {
                    if (_0x0_0x148f96['existsSync'](_0xc62fa1)) {
                        const _0x58d401 = (await import(pathToFileURL(_0xc62fa1)['href']))['default'] || await import(pathToFileURL(_0xc62fa1)['href']);
                        if (_0x58d401['command']) {
                            this['registerCommand'](_0x58d401);
                            if (_0x58d401['isPrefixless'] === !![]) {
                                const _0x13c11b = _0x58d401['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x13c11b, _0x13c11b);
                                if (_0x58d401['aliases'] && Array['isArray'](_0x58d401['aliases'])) {
                                    _0x58d401['aliases']['forEach'](_0x3a05de => {
                                        this['prefixlessCommands']['set'](_0x3a05de['toLowerCase'](), _0x13c11b);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0xb670d6);
                        }
                    }
                } catch (_0xcad9f8) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0xb670d6 + ':', _0xcad9f8['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x2c7733 = _0x0_0x4fc197['join'](process['cwd'](), 'plugins');
        const _0x460af8 = _0x0_0x148f96['readdirSync'](_0x2c7733)['filter'](_0x4816ac => _0x4816ac['endsWith']('.js'));
        for (const _0x3d802f of _0x460af8) {
            try {
                const _0x226691 = _0x0_0x4fc197['join'](_0x2c7733, _0x3d802f);
                const _0x352c06 = (await import(pathToFileURL(_0x226691)['href']))['default'] || await import(pathToFileURL(_0x226691)['href']);
                if (_0x352c06['command']) {
                    this['registerCommand'](_0x352c06);
                    if (_0x352c06['isPrefixless'] === !![]) {
                        const _0x40c7ed = _0x352c06['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x40c7ed, _0x40c7ed);
                        if (_0x352c06['aliases'] && Array['isArray'](_0x352c06['aliases'])) {
                            _0x352c06['aliases']['forEach'](_0x118331 => {
                                this['prefixlessCommands']['set'](_0x118331['toLowerCase'](), _0x40c7ed);
                            });
                        }
                    }
                }
            } catch (_0x3492d1) {
                console['error']('Error\x20loading\x20' + _0x3d802f + ':', _0x3492d1['message']);
            }
        }
    }
    ['registerCommand'](_0x17e0b4) {
        const {
            command: _0x1fa245,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x1feec6
        } = _0x17e0b4;
        if (!_0x1fa245 || typeof _0x1feec6 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x1fa245 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x43ebc3 = _0x1fa245['toLowerCase']();
        if (this['commands']['has'](_0x43ebc3)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x43ebc3 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x43ebc3, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x27545a = async (_0x32ab68, _0x499d65, ..._0xc079c1) => {
            const _0x4870a7 = this['stats']['get'](_0x43ebc3);
            if (this['disabledCommands']['has'](_0x43ebc3)) {
                return await _0x32ab68['sendMessage'](_0x499d65['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x43ebc3 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x499d65 });
            }
            const _0x9d496f = _0x499d65['key']['participant'] || _0x499d65['key']['remoteJid'];
            const _0x47826c = Date['now']();
            const _0x20cdf5 = _0x9d496f + '_' + _0x43ebc3;
            if (this['cooldowns']['has'](_0x20cdf5)) {
                const _0x49eceb = this['cooldowns']['get'](_0x20cdf5) + (_0x17e0b4['cooldown'] || 0xbb8);
                if (_0x47826c < _0x49eceb)
                    return;
            }
            this['cooldowns']['set'](_0x20cdf5, _0x47826c);
            const _0x287a82 = process['hrtime']['bigint']();
            try {
                _0x4870a7['calls']++;
                return await _0x1feec6(_0x32ab68, _0x499d65, ..._0xc079c1);
            } catch (_0x2ce351) {
                _0x4870a7['errors']++;
                throw _0x2ce351;
            } finally {
                const _0x3c61b5 = process['hrtime']['bigint']();
                _0x4870a7['totalTime'] += _0x3c61b5 - _0x287a82;
                _0x4870a7['avgMs'] = Number(_0x4870a7['totalTime'] / BigInt(_0x4870a7['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x43ebc3, {
            ..._0x17e0b4,
            'command': _0x1fa245,
            'handler': _0x27545a,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0xe93d14 of aliases) {
            this['aliases']['set'](_0xe93d14['toLowerCase'](), _0x43ebc3);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x1fa245)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x1fa245);
        }
    }
    ['toggleCommand'](_0x5f4c7f) {
        const _0x172b1d = _0x5f4c7f['toLowerCase']();
        if (this['disabledCommands']['has'](_0x172b1d)) {
            this['disabledCommands']['delete'](_0x172b1d);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x172b1d);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x342ec4, _0x5c0c1d) {
        const _0x48770a = [];
        for (let _0x3892e0 = 0x0; _0x3892e0 <= _0x342ec4['length']; _0x3892e0++)
            _0x48770a[_0x3892e0] = [_0x3892e0];
        for (let _0x30a0d0 = 0x0; _0x30a0d0 <= _0x5c0c1d['length']; _0x30a0d0++)
            _0x48770a[0x0][_0x30a0d0] = _0x30a0d0;
        for (let _0x3adff9 = 0x1; _0x3adff9 <= _0x342ec4['length']; _0x3adff9++) {
            for (let _0x1bbb0e = 0x1; _0x1bbb0e <= _0x5c0c1d['length']; _0x1bbb0e++) {
                _0x48770a[_0x3adff9][_0x1bbb0e] = Math['min'](_0x48770a[_0x3adff9 - 0x1][_0x1bbb0e] + 0x1, _0x48770a[_0x3adff9][_0x1bbb0e - 0x1] + 0x1, _0x48770a[_0x3adff9 - 0x1][_0x1bbb0e - 0x1] + (_0x342ec4[_0x3adff9 - 0x1] === _0x5c0c1d[_0x1bbb0e - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x48770a[_0x342ec4['length']][_0x5c0c1d['length']];
    }
    ['findSuggestion'](_0x4e02c9) {
        const _0x26b8e0 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x3dab73 = null;
        let _0x65415 = 0x3;
        for (const _0x1dc1b7 of _0x26b8e0) {
            const _0x1efe45 = this['_levenshtein'](_0x4e02c9, _0x1dc1b7);
            if (_0x1efe45 < _0x65415) {
                _0x65415 = _0x1efe45;
                _0x3dab73 = _0x1dc1b7;
            }
        }
        return _0x3dab73;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x2761d7, _0x4b53ca]) => ({
            'command': _0x2761d7,
            'usage': _0x4b53ca['calls'],
            'errors': _0x4b53ca['errors'],
            'average_speed': _0x4b53ca['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x2761d7) ? 'OFF' : 'ON'
        }))['sort']((_0x571d10, _0x281d43) => _0x281d43['usage'] - _0x571d10['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x3ffc22 of this['commands']['keys']()) {
            this['stats']['set'](_0x3ffc22, {
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
    ['getCommand'](_0x12ef47, _0x5d106f) {
        const _0x81ae3a = _0x5d106f['find'](_0x42f9b2 => _0x12ef47['startsWith'](_0x42f9b2));
        const _0x4357a7 = _0x12ef47['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x81ae3a) {
            if (this['prefixlessCommands']['has'](_0x4357a7)) {
                const _0x4d43a6 = this['prefixlessCommands']['get'](_0x4357a7);
                return this['commands']['get'](_0x4d43a6);
            }
            return null;
        }
        const _0x26d997 = _0x12ef47['slice'](_0x81ae3a['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x26d997)) {
            return this['commands']['get'](_0x26d997);
        }
        if (this['aliases']['has'](_0x26d997)) {
            const _0x221974 = this['aliases']['get'](_0x26d997);
            return this['commands']['get'](_0x221974);
        }
        const _0x324af4 = this['findSuggestion'](_0x26d997);
        if (_0x324af4) {
            return {
                'command': _0x324af4,
                'handler': async (_0x48e030, _0x22c07c) => {
                    const _0x59a7ac = _0x22c07c['key']['remoteJid'];
                    await _0x48e030['sendMessage'](_0x59a7ac, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x81ae3a + _0x324af4 + '*?' }, { 'quoted': _0x22c07c });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x5f3098) {
        return this['categories']['get'](_0x5f3098['toLowerCase']()) || [];
    }
}
export default new CommandHandler();