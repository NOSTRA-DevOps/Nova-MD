import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x4a9ef1, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x486cb5 from 'fs';
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
        const _0x1fde2d = _0x0_0x4a9ef1['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x486cb5['existsSync'](_0x1fde2d))
            return;
        _0x0_0x486cb5['watch'](_0x1fde2d, async (_0x5c0fac, _0x3906dd) => {
            if (_0x3906dd && _0x3906dd['endsWith']('.js')) {
                const _0x5089a1 = _0x0_0x4a9ef1['join'](_0x1fde2d, _0x3906dd);
                try {
                    if (_0x0_0x486cb5['existsSync'](_0x5089a1)) {
                        const _0x132841 = (await import(pathToFileURL(_0x5089a1)['href']))['default'] || await import(pathToFileURL(_0x5089a1)['href']);
                        if (_0x132841['command']) {
                            this['registerCommand'](_0x132841);
                            if (_0x132841['isPrefixless'] === !![]) {
                                const _0x348d51 = _0x132841['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x348d51, _0x348d51);
                                if (_0x132841['aliases'] && Array['isArray'](_0x132841['aliases'])) {
                                    _0x132841['aliases']['forEach'](_0x178bc1 => {
                                        this['prefixlessCommands']['set'](_0x178bc1['toLowerCase'](), _0x348d51);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x3906dd);
                        }
                    }
                } catch (_0x1a5cb7) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x3906dd + ':', _0x1a5cb7['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x3199d4 = _0x0_0x4a9ef1['join'](process['cwd'](), 'plugins');
        const _0x55da36 = _0x0_0x486cb5['readdirSync'](_0x3199d4)['filter'](_0x1ef4cd => _0x1ef4cd['endsWith']('.js'));
        for (const _0x2a2516 of _0x55da36) {
            try {
                const _0x47fb9d = _0x0_0x4a9ef1['join'](_0x3199d4, _0x2a2516);
                const _0x5d0903 = (await import(pathToFileURL(_0x47fb9d)['href']))['default'] || await import(pathToFileURL(_0x47fb9d)['href']);
                if (_0x5d0903['command']) {
                    this['registerCommand'](_0x5d0903);
                    if (_0x5d0903['isPrefixless'] === !![]) {
                        const _0x2c9733 = _0x5d0903['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x2c9733, _0x2c9733);
                        if (_0x5d0903['aliases'] && Array['isArray'](_0x5d0903['aliases'])) {
                            _0x5d0903['aliases']['forEach'](_0x389c85 => {
                                this['prefixlessCommands']['set'](_0x389c85['toLowerCase'](), _0x2c9733);
                            });
                        }
                    }
                }
            } catch (_0x3c4a28) {
                console['error']('Error\x20loading\x20' + _0x2a2516 + ':', _0x3c4a28['message']);
            }
        }
    }
    ['registerCommand'](_0xde87a2) {
        const {
            command: _0x3afe54,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x377969
        } = _0xde87a2;
        if (!_0x3afe54 || typeof _0x377969 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x3afe54 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x180227 = _0x3afe54['toLowerCase']();
        if (this['commands']['has'](_0x180227)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x180227 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x180227, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x59f825 = async (_0x44a183, _0x20e854, ..._0x503011) => {
            const _0x4483dd = this['stats']['get'](_0x180227);
            if (this['disabledCommands']['has'](_0x180227)) {
                return await _0x44a183['sendMessage'](_0x20e854['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x180227 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x20e854 });
            }
            const _0x4b5861 = _0x20e854['key']['participant'] || _0x20e854['key']['remoteJid'];
            const _0x37207c = Date['now']();
            const _0xb61060 = _0x4b5861 + '_' + _0x180227;
            if (this['cooldowns']['has'](_0xb61060)) {
                const _0x438bec = this['cooldowns']['get'](_0xb61060) + (_0xde87a2['cooldown'] || 0xbb8);
                if (_0x37207c < _0x438bec)
                    return;
            }
            this['cooldowns']['set'](_0xb61060, _0x37207c);
            const _0x985648 = process['hrtime']['bigint']();
            try {
                _0x4483dd['calls']++;
                return await _0x377969(_0x44a183, _0x20e854, ..._0x503011);
            } catch (_0x13fca4) {
                _0x4483dd['errors']++;
                throw _0x13fca4;
            } finally {
                const _0xfa6dd9 = process['hrtime']['bigint']();
                _0x4483dd['totalTime'] += _0xfa6dd9 - _0x985648;
                _0x4483dd['avgMs'] = Number(_0x4483dd['totalTime'] / BigInt(_0x4483dd['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x180227, {
            ..._0xde87a2,
            'command': _0x3afe54,
            'handler': _0x59f825,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x373e42 of aliases) {
            this['aliases']['set'](_0x373e42['toLowerCase'](), _0x180227);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x3afe54)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x3afe54);
        }
    }
    ['toggleCommand'](_0x4d5931) {
        const _0xf2194 = _0x4d5931['toLowerCase']();
        if (this['disabledCommands']['has'](_0xf2194)) {
            this['disabledCommands']['delete'](_0xf2194);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0xf2194);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x13cf62, _0x28e6aa) {
        const _0x18b541 = [];
        for (let _0x3fe716 = 0x0; _0x3fe716 <= _0x13cf62['length']; _0x3fe716++)
            _0x18b541[_0x3fe716] = [_0x3fe716];
        for (let _0x11bc03 = 0x0; _0x11bc03 <= _0x28e6aa['length']; _0x11bc03++)
            _0x18b541[0x0][_0x11bc03] = _0x11bc03;
        for (let _0x4b72ac = 0x1; _0x4b72ac <= _0x13cf62['length']; _0x4b72ac++) {
            for (let _0x207dd0 = 0x1; _0x207dd0 <= _0x28e6aa['length']; _0x207dd0++) {
                _0x18b541[_0x4b72ac][_0x207dd0] = Math['min'](_0x18b541[_0x4b72ac - 0x1][_0x207dd0] + 0x1, _0x18b541[_0x4b72ac][_0x207dd0 - 0x1] + 0x1, _0x18b541[_0x4b72ac - 0x1][_0x207dd0 - 0x1] + (_0x13cf62[_0x4b72ac - 0x1] === _0x28e6aa[_0x207dd0 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x18b541[_0x13cf62['length']][_0x28e6aa['length']];
    }
    ['findSuggestion'](_0xbfb48f) {
        const _0x21b786 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x32cf0c = null;
        let _0x4298ac = 0x3;
        for (const _0x1bf071 of _0x21b786) {
            const _0x2e086a = this['_levenshtein'](_0xbfb48f, _0x1bf071);
            if (_0x2e086a < _0x4298ac) {
                _0x4298ac = _0x2e086a;
                _0x32cf0c = _0x1bf071;
            }
        }
        return _0x32cf0c;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x36079a, _0xd7deba]) => ({
            'command': _0x36079a,
            'usage': _0xd7deba['calls'],
            'errors': _0xd7deba['errors'],
            'average_speed': _0xd7deba['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x36079a) ? 'OFF' : 'ON'
        }))['sort']((_0x5da676, _0x20e552) => _0x20e552['usage'] - _0x5da676['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x57ed93 of this['commands']['keys']()) {
            this['stats']['set'](_0x57ed93, {
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
    ['getCommand'](_0x223ef9, _0x32da67) {
        const _0x5da93f = _0x32da67['find'](_0x1be864 => _0x223ef9['startsWith'](_0x1be864));
        const _0xb67450 = _0x223ef9['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x5da93f) {
            if (this['prefixlessCommands']['has'](_0xb67450)) {
                const _0x4c454b = this['prefixlessCommands']['get'](_0xb67450);
                return this['commands']['get'](_0x4c454b);
            }
            return null;
        }
        const _0x55ad21 = _0x223ef9['slice'](_0x5da93f['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x55ad21)) {
            return this['commands']['get'](_0x55ad21);
        }
        if (this['aliases']['has'](_0x55ad21)) {
            const _0x5b47df = this['aliases']['get'](_0x55ad21);
            return this['commands']['get'](_0x5b47df);
        }
        const _0x5c7834 = this['findSuggestion'](_0x55ad21);
        if (_0x5c7834) {
            return {
                'command': _0x5c7834,
                'handler': async (_0x3fcf18, _0x19f06d) => {
                    const _0x2b0bb1 = _0x19f06d['key']['remoteJid'];
                    await _0x3fcf18['sendMessage'](_0x2b0bb1, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x5da93f + _0x5c7834 + '*?' }, { 'quoted': _0x19f06d });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x4d84f8) {
        return this['categories']['get'](_0x4d84f8['toLowerCase']()) || [];
    }
}
export default new CommandHandler();