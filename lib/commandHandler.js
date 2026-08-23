import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x3ef276, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4a81f6 from 'fs';
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
        const _0x50df78 = _0x0_0x3ef276['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x4a81f6['existsSync'](_0x50df78))
            return;
        _0x0_0x4a81f6['watch'](_0x50df78, async (_0x503790, _0x47ad48) => {
            if (_0x47ad48 && _0x47ad48['endsWith']('.js')) {
                const _0x37b974 = _0x0_0x3ef276['join'](_0x50df78, _0x47ad48);
                try {
                    if (_0x0_0x4a81f6['existsSync'](_0x37b974)) {
                        const _0x4ce06f = (await import(pathToFileURL(_0x37b974)['href']))['default'] || await import(pathToFileURL(_0x37b974)['href']);
                        if (_0x4ce06f['command']) {
                            this['registerCommand'](_0x4ce06f);
                            if (_0x4ce06f['isPrefixless'] === !![]) {
                                const _0x1f7324 = _0x4ce06f['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x1f7324, _0x1f7324);
                                if (_0x4ce06f['aliases'] && Array['isArray'](_0x4ce06f['aliases'])) {
                                    _0x4ce06f['aliases']['forEach'](_0x382cce => {
                                        this['prefixlessCommands']['set'](_0x382cce['toLowerCase'](), _0x1f7324);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x47ad48);
                        }
                    }
                } catch (_0xe8510) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x47ad48 + ':', _0xe8510['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x2f9d70 = _0x0_0x3ef276['join'](process['cwd'](), 'plugins');
        const _0x4cc760 = _0x0_0x4a81f6['readdirSync'](_0x2f9d70)['filter'](_0x598bc8 => _0x598bc8['endsWith']('.js'));
        for (const _0x3a000e of _0x4cc760) {
            try {
                const _0x3bbe3e = _0x0_0x3ef276['join'](_0x2f9d70, _0x3a000e);
                const _0x4b1a03 = (await import(pathToFileURL(_0x3bbe3e)['href']))['default'] || await import(pathToFileURL(_0x3bbe3e)['href']);
                if (_0x4b1a03['command']) {
                    this['registerCommand'](_0x4b1a03);
                    if (_0x4b1a03['isPrefixless'] === !![]) {
                        const _0x100c4f = _0x4b1a03['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x100c4f, _0x100c4f);
                        if (_0x4b1a03['aliases'] && Array['isArray'](_0x4b1a03['aliases'])) {
                            _0x4b1a03['aliases']['forEach'](_0x1a59ef => {
                                this['prefixlessCommands']['set'](_0x1a59ef['toLowerCase'](), _0x100c4f);
                            });
                        }
                    }
                }
            } catch (_0x52a701) {
                console['error']('Error\x20loading\x20' + _0x3a000e + ':', _0x52a701['message']);
            }
        }
    }
    ['registerCommand'](_0x479e88) {
        const {
            command: _0x1a45a4,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x4a9c96
        } = _0x479e88;
        if (!_0x1a45a4 || typeof _0x4a9c96 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x1a45a4 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x169e01 = _0x1a45a4['toLowerCase']();
        if (this['commands']['has'](_0x169e01)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x169e01 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x169e01, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x13c6f4 = async (_0x1d7b19, _0x196c1d, ..._0x2f7f48) => {
            const _0x2f5416 = this['stats']['get'](_0x169e01);
            if (this['disabledCommands']['has'](_0x169e01)) {
                return await _0x1d7b19['sendMessage'](_0x196c1d['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x169e01 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x196c1d });
            }
            const _0x595285 = _0x196c1d['key']['participant'] || _0x196c1d['key']['remoteJid'];
            const _0x278364 = Date['now']();
            const _0x403ee1 = _0x595285 + '_' + _0x169e01;
            if (this['cooldowns']['has'](_0x403ee1)) {
                const _0x36f89d = this['cooldowns']['get'](_0x403ee1) + (_0x479e88['cooldown'] || 0xbb8);
                if (_0x278364 < _0x36f89d)
                    return;
            }
            this['cooldowns']['set'](_0x403ee1, _0x278364);
            const _0x7fa850 = process['hrtime']['bigint']();
            try {
                _0x2f5416['calls']++;
                return await _0x4a9c96(_0x1d7b19, _0x196c1d, ..._0x2f7f48);
            } catch (_0x336335) {
                _0x2f5416['errors']++;
                throw _0x336335;
            } finally {
                const _0xd2e26a = process['hrtime']['bigint']();
                _0x2f5416['totalTime'] += _0xd2e26a - _0x7fa850;
                _0x2f5416['avgMs'] = Number(_0x2f5416['totalTime'] / BigInt(_0x2f5416['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x169e01, {
            ..._0x479e88,
            'command': _0x1a45a4,
            'handler': _0x13c6f4,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x3ef716 of aliases) {
            this['aliases']['set'](_0x3ef716['toLowerCase'](), _0x169e01);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x1a45a4)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x1a45a4);
        }
    }
    ['toggleCommand'](_0x101c0e) {
        const _0x466904 = _0x101c0e['toLowerCase']();
        if (this['disabledCommands']['has'](_0x466904)) {
            this['disabledCommands']['delete'](_0x466904);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x466904);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x4b4ac3, _0x11bf7b) {
        const _0xb77ca9 = [];
        for (let _0x53eda7 = 0x0; _0x53eda7 <= _0x4b4ac3['length']; _0x53eda7++)
            _0xb77ca9[_0x53eda7] = [_0x53eda7];
        for (let _0x7beadd = 0x0; _0x7beadd <= _0x11bf7b['length']; _0x7beadd++)
            _0xb77ca9[0x0][_0x7beadd] = _0x7beadd;
        for (let _0x95b1 = 0x1; _0x95b1 <= _0x4b4ac3['length']; _0x95b1++) {
            for (let _0x7e2904 = 0x1; _0x7e2904 <= _0x11bf7b['length']; _0x7e2904++) {
                _0xb77ca9[_0x95b1][_0x7e2904] = Math['min'](_0xb77ca9[_0x95b1 - 0x1][_0x7e2904] + 0x1, _0xb77ca9[_0x95b1][_0x7e2904 - 0x1] + 0x1, _0xb77ca9[_0x95b1 - 0x1][_0x7e2904 - 0x1] + (_0x4b4ac3[_0x95b1 - 0x1] === _0x11bf7b[_0x7e2904 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0xb77ca9[_0x4b4ac3['length']][_0x11bf7b['length']];
    }
    ['findSuggestion'](_0x3d5e47) {
        const _0x2e0e81 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x2bf2d1 = null;
        let _0xc27916 = 0x3;
        for (const _0x316388 of _0x2e0e81) {
            const _0x51b769 = this['_levenshtein'](_0x3d5e47, _0x316388);
            if (_0x51b769 < _0xc27916) {
                _0xc27916 = _0x51b769;
                _0x2bf2d1 = _0x316388;
            }
        }
        return _0x2bf2d1;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x4cda14, _0x44d910]) => ({
            'command': _0x4cda14,
            'usage': _0x44d910['calls'],
            'errors': _0x44d910['errors'],
            'average_speed': _0x44d910['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x4cda14) ? 'OFF' : 'ON'
        }))['sort']((_0x198923, _0x810e06) => _0x810e06['usage'] - _0x198923['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x1e3db3 of this['commands']['keys']()) {
            this['stats']['set'](_0x1e3db3, {
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
    ['getCommand'](_0xafcfe, _0xeffecb) {
        const _0x6ae61d = _0xeffecb['find'](_0xb1c6 => _0xafcfe['startsWith'](_0xb1c6));
        const _0x50aa64 = _0xafcfe['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x6ae61d) {
            if (this['prefixlessCommands']['has'](_0x50aa64)) {
                const _0x2d4363 = this['prefixlessCommands']['get'](_0x50aa64);
                return this['commands']['get'](_0x2d4363);
            }
            return null;
        }
        const _0x1d8eae = _0xafcfe['slice'](_0x6ae61d['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x1d8eae)) {
            return this['commands']['get'](_0x1d8eae);
        }
        if (this['aliases']['has'](_0x1d8eae)) {
            const _0x2eece1 = this['aliases']['get'](_0x1d8eae);
            return this['commands']['get'](_0x2eece1);
        }
        const _0x4f4d42 = this['findSuggestion'](_0x1d8eae);
        if (_0x4f4d42) {
            return {
                'command': _0x4f4d42,
                'handler': async (_0x3c74dc, _0x29e4e4) => {
                    const _0x2bdb98 = _0x29e4e4['key']['remoteJid'];
                    await _0x3c74dc['sendMessage'](_0x2bdb98, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x6ae61d + _0x4f4d42 + '*?' }, { 'quoted': _0x29e4e4 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x4be807) {
        return this['categories']['get'](_0x4be807['toLowerCase']()) || [];
    }
}
export default new CommandHandler();