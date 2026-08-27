import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x53ade8, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x394238 from 'fs';
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
        const _0x46c3aa = _0x0_0x53ade8['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x394238['existsSync'](_0x46c3aa))
            return;
        _0x0_0x394238['watch'](_0x46c3aa, async (_0x4adf7b, _0x52bdbc) => {
            if (_0x52bdbc && _0x52bdbc['endsWith']('.js')) {
                const _0x41d1e1 = _0x0_0x53ade8['join'](_0x46c3aa, _0x52bdbc);
                try {
                    if (_0x0_0x394238['existsSync'](_0x41d1e1)) {
                        const _0x171d69 = (await import(pathToFileURL(_0x41d1e1)['href']))['default'] || await import(pathToFileURL(_0x41d1e1)['href']);
                        if (_0x171d69['command']) {
                            this['registerCommand'](_0x171d69);
                            if (_0x171d69['isPrefixless'] === !![]) {
                                const _0x2a7206 = _0x171d69['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x2a7206, _0x2a7206);
                                if (_0x171d69['aliases'] && Array['isArray'](_0x171d69['aliases'])) {
                                    _0x171d69['aliases']['forEach'](_0x4c98f3 => {
                                        this['prefixlessCommands']['set'](_0x4c98f3['toLowerCase'](), _0x2a7206);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x52bdbc);
                        }
                    }
                } catch (_0x3b342f) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x52bdbc + ':', _0x3b342f['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x4ee074 = _0x0_0x53ade8['join'](process['cwd'](), 'plugins');
        const _0x3a3ee1 = _0x0_0x394238['readdirSync'](_0x4ee074)['filter'](_0x36c442 => _0x36c442['endsWith']('.js'));
        for (const _0x3c3e96 of _0x3a3ee1) {
            try {
                const _0x1814b1 = _0x0_0x53ade8['join'](_0x4ee074, _0x3c3e96);
                const _0x5190fd = (await import(pathToFileURL(_0x1814b1)['href']))['default'] || await import(pathToFileURL(_0x1814b1)['href']);
                if (_0x5190fd['command']) {
                    this['registerCommand'](_0x5190fd);
                    if (_0x5190fd['isPrefixless'] === !![]) {
                        const _0x49d08c = _0x5190fd['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x49d08c, _0x49d08c);
                        if (_0x5190fd['aliases'] && Array['isArray'](_0x5190fd['aliases'])) {
                            _0x5190fd['aliases']['forEach'](_0x16b551 => {
                                this['prefixlessCommands']['set'](_0x16b551['toLowerCase'](), _0x49d08c);
                            });
                        }
                    }
                }
            } catch (_0x481ca0) {
                console['error']('Error\x20loading\x20' + _0x3c3e96 + ':', _0x481ca0['message']);
            }
        }
    }
    ['registerCommand'](_0xf5b64) {
        const {
            command: _0x3cff9a,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x458ebd
        } = _0xf5b64;
        if (!_0x3cff9a || typeof _0x458ebd !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x3cff9a || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x8029ec = _0x3cff9a['toLowerCase']();
        if (this['commands']['has'](_0x8029ec)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x8029ec + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x8029ec, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x4460bd = async (_0x201bd2, _0x108c2b, ..._0x4a9557) => {
            const _0x2b0d10 = this['stats']['get'](_0x8029ec);
            if (this['disabledCommands']['has'](_0x8029ec)) {
                return await _0x201bd2['sendMessage'](_0x108c2b['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x8029ec + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x108c2b });
            }
            const _0x23f7a4 = _0x108c2b['key']['participant'] || _0x108c2b['key']['remoteJid'];
            const _0x37a2d6 = Date['now']();
            const _0x244add = _0x23f7a4 + '_' + _0x8029ec;
            if (this['cooldowns']['has'](_0x244add)) {
                const _0x5d1484 = this['cooldowns']['get'](_0x244add) + (_0xf5b64['cooldown'] || 0xbb8);
                if (_0x37a2d6 < _0x5d1484)
                    return;
            }
            this['cooldowns']['set'](_0x244add, _0x37a2d6);
            const _0x1d7726 = process['hrtime']['bigint']();
            try {
                _0x2b0d10['calls']++;
                return await _0x458ebd(_0x201bd2, _0x108c2b, ..._0x4a9557);
            } catch (_0x240c1a) {
                _0x2b0d10['errors']++;
                throw _0x240c1a;
            } finally {
                const _0x540994 = process['hrtime']['bigint']();
                _0x2b0d10['totalTime'] += _0x540994 - _0x1d7726;
                _0x2b0d10['avgMs'] = Number(_0x2b0d10['totalTime'] / BigInt(_0x2b0d10['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x8029ec, {
            ..._0xf5b64,
            'command': _0x3cff9a,
            'handler': _0x4460bd,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x173454 of aliases) {
            this['aliases']['set'](_0x173454['toLowerCase'](), _0x8029ec);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x3cff9a)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x3cff9a);
        }
    }
    ['toggleCommand'](_0x379195) {
        const _0xa92a9 = _0x379195['toLowerCase']();
        if (this['disabledCommands']['has'](_0xa92a9)) {
            this['disabledCommands']['delete'](_0xa92a9);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0xa92a9);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0xe37bc2, _0x23b3c7) {
        const _0xc452b4 = [];
        for (let _0x50cc96 = 0x0; _0x50cc96 <= _0xe37bc2['length']; _0x50cc96++)
            _0xc452b4[_0x50cc96] = [_0x50cc96];
        for (let _0x4e86e9 = 0x0; _0x4e86e9 <= _0x23b3c7['length']; _0x4e86e9++)
            _0xc452b4[0x0][_0x4e86e9] = _0x4e86e9;
        for (let _0x156bb9 = 0x1; _0x156bb9 <= _0xe37bc2['length']; _0x156bb9++) {
            for (let _0x1ce0bf = 0x1; _0x1ce0bf <= _0x23b3c7['length']; _0x1ce0bf++) {
                _0xc452b4[_0x156bb9][_0x1ce0bf] = Math['min'](_0xc452b4[_0x156bb9 - 0x1][_0x1ce0bf] + 0x1, _0xc452b4[_0x156bb9][_0x1ce0bf - 0x1] + 0x1, _0xc452b4[_0x156bb9 - 0x1][_0x1ce0bf - 0x1] + (_0xe37bc2[_0x156bb9 - 0x1] === _0x23b3c7[_0x1ce0bf - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0xc452b4[_0xe37bc2['length']][_0x23b3c7['length']];
    }
    ['findSuggestion'](_0x202eb0) {
        const _0x56c601 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x42b5cc = null;
        let _0xf5c903 = 0x3;
        for (const _0x492b03 of _0x56c601) {
            const _0x4ac38d = this['_levenshtein'](_0x202eb0, _0x492b03);
            if (_0x4ac38d < _0xf5c903) {
                _0xf5c903 = _0x4ac38d;
                _0x42b5cc = _0x492b03;
            }
        }
        return _0x42b5cc;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x1f39ab, _0x464c10]) => ({
            'command': _0x1f39ab,
            'usage': _0x464c10['calls'],
            'errors': _0x464c10['errors'],
            'average_speed': _0x464c10['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x1f39ab) ? 'OFF' : 'ON'
        }))['sort']((_0x3da45e, _0x55c951) => _0x55c951['usage'] - _0x3da45e['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x15f5eb of this['commands']['keys']()) {
            this['stats']['set'](_0x15f5eb, {
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
    ['getCommand'](_0x3449e9, _0x4edd52) {
        const _0xfd94fe = _0x4edd52['find'](_0x3c2ef5 => _0x3449e9['startsWith'](_0x3c2ef5));
        const _0x232e45 = _0x3449e9['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0xfd94fe) {
            if (this['prefixlessCommands']['has'](_0x232e45)) {
                const _0x2e2f44 = this['prefixlessCommands']['get'](_0x232e45);
                return this['commands']['get'](_0x2e2f44);
            }
            return null;
        }
        const _0x1f0db4 = _0x3449e9['slice'](_0xfd94fe['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x1f0db4)) {
            return this['commands']['get'](_0x1f0db4);
        }
        if (this['aliases']['has'](_0x1f0db4)) {
            const _0x425d37 = this['aliases']['get'](_0x1f0db4);
            return this['commands']['get'](_0x425d37);
        }
        const _0x3c1a55 = this['findSuggestion'](_0x1f0db4);
        if (_0x3c1a55) {
            return {
                'command': _0x3c1a55,
                'handler': async (_0x3121f6, _0x32b445) => {
                    const _0x1c97c6 = _0x32b445['key']['remoteJid'];
                    await _0x3121f6['sendMessage'](_0x1c97c6, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0xfd94fe + _0x3c1a55 + '*?' }, { 'quoted': _0x32b445 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x597548) {
        return this['categories']['get'](_0x597548['toLowerCase']()) || [];
    }
}
export default new CommandHandler();