import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x33f7ac, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1f6d21 from 'fs';
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
        const _0x5ccc36 = _0x0_0x33f7ac['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x1f6d21['existsSync'](_0x5ccc36))
            return;
        _0x0_0x1f6d21['watch'](_0x5ccc36, async (_0x2fca0e, _0x2c399e) => {
            if (_0x2c399e && _0x2c399e['endsWith']('.js')) {
                const _0x451b40 = _0x0_0x33f7ac['join'](_0x5ccc36, _0x2c399e);
                try {
                    if (_0x0_0x1f6d21['existsSync'](_0x451b40)) {
                        const _0x50700f = (await import(pathToFileURL(_0x451b40)['href']))['default'] || await import(pathToFileURL(_0x451b40)['href']);
                        if (_0x50700f['command']) {
                            this['registerCommand'](_0x50700f);
                            if (_0x50700f['isPrefixless'] === !![]) {
                                const _0x5981d7 = _0x50700f['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x5981d7, _0x5981d7);
                                if (_0x50700f['aliases'] && Array['isArray'](_0x50700f['aliases'])) {
                                    _0x50700f['aliases']['forEach'](_0x4f69c3 => {
                                        this['prefixlessCommands']['set'](_0x4f69c3['toLowerCase'](), _0x5981d7);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x2c399e);
                        }
                    }
                } catch (_0x70a458) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x2c399e + ':', _0x70a458['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x43c3b2 = _0x0_0x33f7ac['join'](process['cwd'](), 'plugins');
        const _0xb572ee = _0x0_0x1f6d21['readdirSync'](_0x43c3b2)['filter'](_0x55865c => _0x55865c['endsWith']('.js'));
        for (const _0x45e94b of _0xb572ee) {
            try {
                const _0x1badf3 = _0x0_0x33f7ac['join'](_0x43c3b2, _0x45e94b);
                const _0x1db288 = (await import(pathToFileURL(_0x1badf3)['href']))['default'] || await import(pathToFileURL(_0x1badf3)['href']);
                if (_0x1db288['command']) {
                    this['registerCommand'](_0x1db288);
                    if (_0x1db288['isPrefixless'] === !![]) {
                        const _0x485668 = _0x1db288['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x485668, _0x485668);
                        if (_0x1db288['aliases'] && Array['isArray'](_0x1db288['aliases'])) {
                            _0x1db288['aliases']['forEach'](_0x2128b4 => {
                                this['prefixlessCommands']['set'](_0x2128b4['toLowerCase'](), _0x485668);
                            });
                        }
                    }
                }
            } catch (_0x1861ff) {
                console['error']('Error\x20loading\x20' + _0x45e94b + ':', _0x1861ff['message']);
            }
        }
    }
    ['registerCommand'](_0x4bbc2f) {
        const {
            command: _0x3c3754,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x552e9d
        } = _0x4bbc2f;
        if (!_0x3c3754 || typeof _0x552e9d !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x3c3754 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x189632 = _0x3c3754['toLowerCase']();
        if (this['commands']['has'](_0x189632)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x189632 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x189632, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x31f63a = async (_0x5a307f, _0x6317d6, ..._0x1f7d05) => {
            const _0x4eed9b = this['stats']['get'](_0x189632);
            if (this['disabledCommands']['has'](_0x189632)) {
                return await _0x5a307f['sendMessage'](_0x6317d6['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x189632 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x6317d6 });
            }
            const _0x33070e = _0x6317d6['key']['participant'] || _0x6317d6['key']['remoteJid'];
            const _0x2e6264 = Date['now']();
            const _0x25eb79 = _0x33070e + '_' + _0x189632;
            if (this['cooldowns']['has'](_0x25eb79)) {
                const _0x3c905d = this['cooldowns']['get'](_0x25eb79) + (_0x4bbc2f['cooldown'] || 0xbb8);
                if (_0x2e6264 < _0x3c905d)
                    return;
            }
            this['cooldowns']['set'](_0x25eb79, _0x2e6264);
            const _0x8b8af6 = process['hrtime']['bigint']();
            try {
                _0x4eed9b['calls']++;
                return await _0x552e9d(_0x5a307f, _0x6317d6, ..._0x1f7d05);
            } catch (_0x3eb1b3) {
                _0x4eed9b['errors']++;
                throw _0x3eb1b3;
            } finally {
                const _0x503667 = process['hrtime']['bigint']();
                _0x4eed9b['totalTime'] += _0x503667 - _0x8b8af6;
                _0x4eed9b['avgMs'] = Number(_0x4eed9b['totalTime'] / BigInt(_0x4eed9b['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x189632, {
            ..._0x4bbc2f,
            'command': _0x3c3754,
            'handler': _0x31f63a,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x259f12 of aliases) {
            this['aliases']['set'](_0x259f12['toLowerCase'](), _0x189632);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x3c3754)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x3c3754);
        }
    }
    ['toggleCommand'](_0x2410ba) {
        const _0x10895e = _0x2410ba['toLowerCase']();
        if (this['disabledCommands']['has'](_0x10895e)) {
            this['disabledCommands']['delete'](_0x10895e);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x10895e);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x1e9703, _0x5b91cd) {
        const _0x4d248d = [];
        for (let _0x417366 = 0x0; _0x417366 <= _0x1e9703['length']; _0x417366++)
            _0x4d248d[_0x417366] = [_0x417366];
        for (let _0x4856c1 = 0x0; _0x4856c1 <= _0x5b91cd['length']; _0x4856c1++)
            _0x4d248d[0x0][_0x4856c1] = _0x4856c1;
        for (let _0x30144a = 0x1; _0x30144a <= _0x1e9703['length']; _0x30144a++) {
            for (let _0x1b3317 = 0x1; _0x1b3317 <= _0x5b91cd['length']; _0x1b3317++) {
                _0x4d248d[_0x30144a][_0x1b3317] = Math['min'](_0x4d248d[_0x30144a - 0x1][_0x1b3317] + 0x1, _0x4d248d[_0x30144a][_0x1b3317 - 0x1] + 0x1, _0x4d248d[_0x30144a - 0x1][_0x1b3317 - 0x1] + (_0x1e9703[_0x30144a - 0x1] === _0x5b91cd[_0x1b3317 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x4d248d[_0x1e9703['length']][_0x5b91cd['length']];
    }
    ['findSuggestion'](_0x170846) {
        const _0x36a9ea = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x58bf72 = null;
        let _0x556390 = 0x3;
        for (const _0x1840cb of _0x36a9ea) {
            const _0x268607 = this['_levenshtein'](_0x170846, _0x1840cb);
            if (_0x268607 < _0x556390) {
                _0x556390 = _0x268607;
                _0x58bf72 = _0x1840cb;
            }
        }
        return _0x58bf72;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0xd9136d, _0x382b16]) => ({
            'command': _0xd9136d,
            'usage': _0x382b16['calls'],
            'errors': _0x382b16['errors'],
            'average_speed': _0x382b16['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0xd9136d) ? 'OFF' : 'ON'
        }))['sort']((_0x17eb24, _0x4b849e) => _0x4b849e['usage'] - _0x17eb24['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x42282b of this['commands']['keys']()) {
            this['stats']['set'](_0x42282b, {
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
    ['getCommand'](_0x230d2d, _0x4ad2c5) {
        const _0x343f98 = _0x4ad2c5['find'](_0x1c4735 => _0x230d2d['startsWith'](_0x1c4735));
        const _0x41447d = _0x230d2d['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x343f98) {
            if (this['prefixlessCommands']['has'](_0x41447d)) {
                const _0x215a5e = this['prefixlessCommands']['get'](_0x41447d);
                return this['commands']['get'](_0x215a5e);
            }
            return null;
        }
        const _0x18bd9a = _0x230d2d['slice'](_0x343f98['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x18bd9a)) {
            return this['commands']['get'](_0x18bd9a);
        }
        if (this['aliases']['has'](_0x18bd9a)) {
            const _0x24973e = this['aliases']['get'](_0x18bd9a);
            return this['commands']['get'](_0x24973e);
        }
        const _0x147190 = this['findSuggestion'](_0x18bd9a);
        if (_0x147190) {
            return {
                'command': _0x147190,
                'handler': async (_0x19d8d7, _0x5c7c46) => {
                    const _0x478d50 = _0x5c7c46['key']['remoteJid'];
                    await _0x19d8d7['sendMessage'](_0x478d50, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x343f98 + _0x147190 + '*?' }, { 'quoted': _0x5c7c46 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x1eea47) {
        return this['categories']['get'](_0x1eea47['toLowerCase']()) || [];
    }
}
export default new CommandHandler();