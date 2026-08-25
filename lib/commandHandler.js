import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x8f47a, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x22a968 from 'fs';
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
        const _0x15caa0 = _0x0_0x8f47a['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x22a968['existsSync'](_0x15caa0))
            return;
        _0x0_0x22a968['watch'](_0x15caa0, async (_0x559ff1, _0x2484a0) => {
            if (_0x2484a0 && _0x2484a0['endsWith']('.js')) {
                const _0x3cfa60 = _0x0_0x8f47a['join'](_0x15caa0, _0x2484a0);
                try {
                    if (_0x0_0x22a968['existsSync'](_0x3cfa60)) {
                        const _0xc0911e = (await import(pathToFileURL(_0x3cfa60)['href']))['default'] || await import(pathToFileURL(_0x3cfa60)['href']);
                        if (_0xc0911e['command']) {
                            this['registerCommand'](_0xc0911e);
                            if (_0xc0911e['isPrefixless'] === !![]) {
                                const _0x39d278 = _0xc0911e['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x39d278, _0x39d278);
                                if (_0xc0911e['aliases'] && Array['isArray'](_0xc0911e['aliases'])) {
                                    _0xc0911e['aliases']['forEach'](_0x85e9cb => {
                                        this['prefixlessCommands']['set'](_0x85e9cb['toLowerCase'](), _0x39d278);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x2484a0);
                        }
                    }
                } catch (_0x3d6b35) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x2484a0 + ':', _0x3d6b35['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x33ba01 = _0x0_0x8f47a['join'](process['cwd'](), 'plugins');
        const _0x3dc384 = _0x0_0x22a968['readdirSync'](_0x33ba01)['filter'](_0x19f6fc => _0x19f6fc['endsWith']('.js'));
        for (const _0x44d10b of _0x3dc384) {
            try {
                const _0x6afb80 = _0x0_0x8f47a['join'](_0x33ba01, _0x44d10b);
                const _0xc24ea1 = (await import(pathToFileURL(_0x6afb80)['href']))['default'] || await import(pathToFileURL(_0x6afb80)['href']);
                if (_0xc24ea1['command']) {
                    this['registerCommand'](_0xc24ea1);
                    if (_0xc24ea1['isPrefixless'] === !![]) {
                        const _0x3aadaa = _0xc24ea1['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x3aadaa, _0x3aadaa);
                        if (_0xc24ea1['aliases'] && Array['isArray'](_0xc24ea1['aliases'])) {
                            _0xc24ea1['aliases']['forEach'](_0x36b0c9 => {
                                this['prefixlessCommands']['set'](_0x36b0c9['toLowerCase'](), _0x3aadaa);
                            });
                        }
                    }
                }
            } catch (_0x3cde9b) {
                console['error']('Error\x20loading\x20' + _0x44d10b + ':', _0x3cde9b['message']);
            }
        }
    }
    ['registerCommand'](_0x527a59) {
        const {
            command: _0x1981c0,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x29409a
        } = _0x527a59;
        if (!_0x1981c0 || typeof _0x29409a !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x1981c0 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x4ccc32 = _0x1981c0['toLowerCase']();
        if (this['commands']['has'](_0x4ccc32)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x4ccc32 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x4ccc32, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x717b73 = async (_0x32e460, _0x21b1c7, ..._0x5efe19) => {
            const _0x36da7d = this['stats']['get'](_0x4ccc32);
            if (this['disabledCommands']['has'](_0x4ccc32)) {
                return await _0x32e460['sendMessage'](_0x21b1c7['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x4ccc32 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x21b1c7 });
            }
            const _0x72f3af = _0x21b1c7['key']['participant'] || _0x21b1c7['key']['remoteJid'];
            const _0x296f86 = Date['now']();
            const _0x529c61 = _0x72f3af + '_' + _0x4ccc32;
            if (this['cooldowns']['has'](_0x529c61)) {
                const _0x1177b3 = this['cooldowns']['get'](_0x529c61) + (_0x527a59['cooldown'] || 0xbb8);
                if (_0x296f86 < _0x1177b3)
                    return;
            }
            this['cooldowns']['set'](_0x529c61, _0x296f86);
            const _0x2f5448 = process['hrtime']['bigint']();
            try {
                _0x36da7d['calls']++;
                return await _0x29409a(_0x32e460, _0x21b1c7, ..._0x5efe19);
            } catch (_0x3b8811) {
                _0x36da7d['errors']++;
                throw _0x3b8811;
            } finally {
                const _0x4c7182 = process['hrtime']['bigint']();
                _0x36da7d['totalTime'] += _0x4c7182 - _0x2f5448;
                _0x36da7d['avgMs'] = Number(_0x36da7d['totalTime'] / BigInt(_0x36da7d['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x4ccc32, {
            ..._0x527a59,
            'command': _0x1981c0,
            'handler': _0x717b73,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0xe2512d of aliases) {
            this['aliases']['set'](_0xe2512d['toLowerCase'](), _0x4ccc32);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x1981c0)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x1981c0);
        }
    }
    ['toggleCommand'](_0x160d1b) {
        const _0x5cbf9a = _0x160d1b['toLowerCase']();
        if (this['disabledCommands']['has'](_0x5cbf9a)) {
            this['disabledCommands']['delete'](_0x5cbf9a);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x5cbf9a);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x1dab25, _0x3f6b40) {
        const _0x12fdbc = [];
        for (let _0x28d56d = 0x0; _0x28d56d <= _0x1dab25['length']; _0x28d56d++)
            _0x12fdbc[_0x28d56d] = [_0x28d56d];
        for (let _0x255cad = 0x0; _0x255cad <= _0x3f6b40['length']; _0x255cad++)
            _0x12fdbc[0x0][_0x255cad] = _0x255cad;
        for (let _0x17e652 = 0x1; _0x17e652 <= _0x1dab25['length']; _0x17e652++) {
            for (let _0x64705 = 0x1; _0x64705 <= _0x3f6b40['length']; _0x64705++) {
                _0x12fdbc[_0x17e652][_0x64705] = Math['min'](_0x12fdbc[_0x17e652 - 0x1][_0x64705] + 0x1, _0x12fdbc[_0x17e652][_0x64705 - 0x1] + 0x1, _0x12fdbc[_0x17e652 - 0x1][_0x64705 - 0x1] + (_0x1dab25[_0x17e652 - 0x1] === _0x3f6b40[_0x64705 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x12fdbc[_0x1dab25['length']][_0x3f6b40['length']];
    }
    ['findSuggestion'](_0x15e04e) {
        const _0x199b98 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x53dffc = null;
        let _0x313444 = 0x3;
        for (const _0x1b91a2 of _0x199b98) {
            const _0x4c0e2a = this['_levenshtein'](_0x15e04e, _0x1b91a2);
            if (_0x4c0e2a < _0x313444) {
                _0x313444 = _0x4c0e2a;
                _0x53dffc = _0x1b91a2;
            }
        }
        return _0x53dffc;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x11be13, _0x196561]) => ({
            'command': _0x11be13,
            'usage': _0x196561['calls'],
            'errors': _0x196561['errors'],
            'average_speed': _0x196561['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x11be13) ? 'OFF' : 'ON'
        }))['sort']((_0x1e1a22, _0x494853) => _0x494853['usage'] - _0x1e1a22['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x3505f2 of this['commands']['keys']()) {
            this['stats']['set'](_0x3505f2, {
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
    ['getCommand'](_0x4023fd, _0xc905a7) {
        const _0x3d6ef7 = _0xc905a7['find'](_0x16ce34 => _0x4023fd['startsWith'](_0x16ce34));
        const _0x2c810f = _0x4023fd['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x3d6ef7) {
            if (this['prefixlessCommands']['has'](_0x2c810f)) {
                const _0x43738c = this['prefixlessCommands']['get'](_0x2c810f);
                return this['commands']['get'](_0x43738c);
            }
            return null;
        }
        const _0x1ebe23 = _0x4023fd['slice'](_0x3d6ef7['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x1ebe23)) {
            return this['commands']['get'](_0x1ebe23);
        }
        if (this['aliases']['has'](_0x1ebe23)) {
            const _0x45265e = this['aliases']['get'](_0x1ebe23);
            return this['commands']['get'](_0x45265e);
        }
        const _0x2fa55f = this['findSuggestion'](_0x1ebe23);
        if (_0x2fa55f) {
            return {
                'command': _0x2fa55f,
                'handler': async (_0x4eaa78, _0x38a977) => {
                    const _0x44f824 = _0x38a977['key']['remoteJid'];
                    await _0x4eaa78['sendMessage'](_0x44f824, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x3d6ef7 + _0x2fa55f + '*?' }, { 'quoted': _0x38a977 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x5aa741) {
        return this['categories']['get'](_0x5aa741['toLowerCase']()) || [];
    }
}
export default new CommandHandler();