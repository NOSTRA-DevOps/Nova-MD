import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x41a779, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3f441c from 'fs';
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
        const _0x5d3b6e = _0x0_0x41a779['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x3f441c['existsSync'](_0x5d3b6e))
            return;
        _0x0_0x3f441c['watch'](_0x5d3b6e, async (_0x56938e, _0x37b263) => {
            if (_0x37b263 && _0x37b263['endsWith']('.js')) {
                const _0x44cce7 = _0x0_0x41a779['join'](_0x5d3b6e, _0x37b263);
                try {
                    if (_0x0_0x3f441c['existsSync'](_0x44cce7)) {
                        const _0x3724e6 = (await import(pathToFileURL(_0x44cce7)['href']))['default'] || await import(pathToFileURL(_0x44cce7)['href']);
                        if (_0x3724e6['command']) {
                            this['registerCommand'](_0x3724e6);
                            if (_0x3724e6['isPrefixless'] === !![]) {
                                const _0x17d460 = _0x3724e6['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x17d460, _0x17d460);
                                if (_0x3724e6['aliases'] && Array['isArray'](_0x3724e6['aliases'])) {
                                    _0x3724e6['aliases']['forEach'](_0x5b5457 => {
                                        this['prefixlessCommands']['set'](_0x5b5457['toLowerCase'](), _0x17d460);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x37b263);
                        }
                    }
                } catch (_0x40e15e) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x37b263 + ':', _0x40e15e['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0xe141cb = _0x0_0x41a779['join'](process['cwd'](), 'plugins');
        const _0x24f158 = _0x0_0x3f441c['readdirSync'](_0xe141cb)['filter'](_0x557881 => _0x557881['endsWith']('.js'));
        for (const _0x5cf9af of _0x24f158) {
            try {
                const _0x578be7 = _0x0_0x41a779['join'](_0xe141cb, _0x5cf9af);
                const _0x909b21 = (await import(pathToFileURL(_0x578be7)['href']))['default'] || await import(pathToFileURL(_0x578be7)['href']);
                if (_0x909b21['command']) {
                    this['registerCommand'](_0x909b21);
                    if (_0x909b21['isPrefixless'] === !![]) {
                        const _0x393740 = _0x909b21['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x393740, _0x393740);
                        if (_0x909b21['aliases'] && Array['isArray'](_0x909b21['aliases'])) {
                            _0x909b21['aliases']['forEach'](_0xe419a5 => {
                                this['prefixlessCommands']['set'](_0xe419a5['toLowerCase'](), _0x393740);
                            });
                        }
                    }
                }
            } catch (_0x56e77b) {
                console['error']('Error\x20loading\x20' + _0x5cf9af + ':', _0x56e77b['message']);
            }
        }
    }
    ['registerCommand'](_0x241f6a) {
        const {
            command: _0x18e0fe,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x396e2d
        } = _0x241f6a;
        if (!_0x18e0fe || typeof _0x396e2d !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x18e0fe || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x55bb9b = _0x18e0fe['toLowerCase']();
        if (this['commands']['has'](_0x55bb9b)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x55bb9b + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x55bb9b, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x561671 = async (_0xaf2614, _0xeb9bc0, ..._0x3dfd3f) => {
            const _0x3a67 = this['stats']['get'](_0x55bb9b);
            if (this['disabledCommands']['has'](_0x55bb9b)) {
                return await _0xaf2614['sendMessage'](_0xeb9bc0['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x55bb9b + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0xeb9bc0 });
            }
            const _0x3f307f = _0xeb9bc0['key']['participant'] || _0xeb9bc0['key']['remoteJid'];
            const _0x25cef9 = Date['now']();
            const _0x5a8a57 = _0x3f307f + '_' + _0x55bb9b;
            if (this['cooldowns']['has'](_0x5a8a57)) {
                const _0x3a40b8 = this['cooldowns']['get'](_0x5a8a57) + (_0x241f6a['cooldown'] || 0xbb8);
                if (_0x25cef9 < _0x3a40b8)
                    return;
            }
            this['cooldowns']['set'](_0x5a8a57, _0x25cef9);
            const _0x23caa3 = process['hrtime']['bigint']();
            try {
                _0x3a67['calls']++;
                return await _0x396e2d(_0xaf2614, _0xeb9bc0, ..._0x3dfd3f);
            } catch (_0x4bc83e) {
                _0x3a67['errors']++;
                throw _0x4bc83e;
            } finally {
                const _0x32348f = process['hrtime']['bigint']();
                _0x3a67['totalTime'] += _0x32348f - _0x23caa3;
                _0x3a67['avgMs'] = Number(_0x3a67['totalTime'] / BigInt(_0x3a67['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x55bb9b, {
            ..._0x241f6a,
            'command': _0x18e0fe,
            'handler': _0x561671,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x4c8453 of aliases) {
            this['aliases']['set'](_0x4c8453['toLowerCase'](), _0x55bb9b);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x18e0fe)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x18e0fe);
        }
    }
    ['toggleCommand'](_0x35b145) {
        const _0x519128 = _0x35b145['toLowerCase']();
        if (this['disabledCommands']['has'](_0x519128)) {
            this['disabledCommands']['delete'](_0x519128);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x519128);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0xd5db2b, _0x5ae9dd) {
        const _0x5ebdb1 = [];
        for (let _0x381c9b = 0x0; _0x381c9b <= _0xd5db2b['length']; _0x381c9b++)
            _0x5ebdb1[_0x381c9b] = [_0x381c9b];
        for (let _0x1c364d = 0x0; _0x1c364d <= _0x5ae9dd['length']; _0x1c364d++)
            _0x5ebdb1[0x0][_0x1c364d] = _0x1c364d;
        for (let _0x33d053 = 0x1; _0x33d053 <= _0xd5db2b['length']; _0x33d053++) {
            for (let _0x39cfd0 = 0x1; _0x39cfd0 <= _0x5ae9dd['length']; _0x39cfd0++) {
                _0x5ebdb1[_0x33d053][_0x39cfd0] = Math['min'](_0x5ebdb1[_0x33d053 - 0x1][_0x39cfd0] + 0x1, _0x5ebdb1[_0x33d053][_0x39cfd0 - 0x1] + 0x1, _0x5ebdb1[_0x33d053 - 0x1][_0x39cfd0 - 0x1] + (_0xd5db2b[_0x33d053 - 0x1] === _0x5ae9dd[_0x39cfd0 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x5ebdb1[_0xd5db2b['length']][_0x5ae9dd['length']];
    }
    ['findSuggestion'](_0x4f98d2) {
        const _0x40aefd = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x223639 = null;
        let _0x53c5ce = 0x3;
        for (const _0x169868 of _0x40aefd) {
            const _0x1dae30 = this['_levenshtein'](_0x4f98d2, _0x169868);
            if (_0x1dae30 < _0x53c5ce) {
                _0x53c5ce = _0x1dae30;
                _0x223639 = _0x169868;
            }
        }
        return _0x223639;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x1045bf, _0x3e7388]) => ({
            'command': _0x1045bf,
            'usage': _0x3e7388['calls'],
            'errors': _0x3e7388['errors'],
            'average_speed': _0x3e7388['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x1045bf) ? 'OFF' : 'ON'
        }))['sort']((_0x2365c4, _0x333f24) => _0x333f24['usage'] - _0x2365c4['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x2572f9 of this['commands']['keys']()) {
            this['stats']['set'](_0x2572f9, {
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
    ['getCommand'](_0x5afae1, _0x1e70ad) {
        const _0x517e20 = _0x1e70ad['find'](_0x2cdd0a => _0x5afae1['startsWith'](_0x2cdd0a));
        const _0x4c2338 = _0x5afae1['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x517e20) {
            if (this['prefixlessCommands']['has'](_0x4c2338)) {
                const _0x13e860 = this['prefixlessCommands']['get'](_0x4c2338);
                return this['commands']['get'](_0x13e860);
            }
            return null;
        }
        const _0x3284e7 = _0x5afae1['slice'](_0x517e20['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x3284e7)) {
            return this['commands']['get'](_0x3284e7);
        }
        if (this['aliases']['has'](_0x3284e7)) {
            const _0x375172 = this['aliases']['get'](_0x3284e7);
            return this['commands']['get'](_0x375172);
        }
        const _0x5c31af = this['findSuggestion'](_0x3284e7);
        if (_0x5c31af) {
            return {
                'command': _0x5c31af,
                'handler': async (_0x571910, _0x2c2b9b) => {
                    const _0x29de7e = _0x2c2b9b['key']['remoteJid'];
                    await _0x571910['sendMessage'](_0x29de7e, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x517e20 + _0x5c31af + '*?' }, { 'quoted': _0x2c2b9b });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0xcfc21f) {
        return this['categories']['get'](_0xcfc21f['toLowerCase']()) || [];
    }
}
export default new CommandHandler();