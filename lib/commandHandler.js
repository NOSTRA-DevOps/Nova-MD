import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0xf9b4fc, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x158d4a from 'fs';
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
        const _0x5a2d83 = _0x0_0xf9b4fc['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x158d4a['existsSync'](_0x5a2d83))
            return;
        _0x0_0x158d4a['watch'](_0x5a2d83, async (_0x1e2747, _0x1a0433) => {
            if (_0x1a0433 && _0x1a0433['endsWith']('.js')) {
                const _0x7802b2 = _0x0_0xf9b4fc['join'](_0x5a2d83, _0x1a0433);
                try {
                    if (_0x0_0x158d4a['existsSync'](_0x7802b2)) {
                        const _0x3d9d24 = (await import(pathToFileURL(_0x7802b2)['href']))['default'] || await import(pathToFileURL(_0x7802b2)['href']);
                        if (_0x3d9d24['command']) {
                            this['registerCommand'](_0x3d9d24);
                            if (_0x3d9d24['isPrefixless'] === !![]) {
                                const _0xda0d6c = _0x3d9d24['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0xda0d6c, _0xda0d6c);
                                if (_0x3d9d24['aliases'] && Array['isArray'](_0x3d9d24['aliases'])) {
                                    _0x3d9d24['aliases']['forEach'](_0x5ba105 => {
                                        this['prefixlessCommands']['set'](_0x5ba105['toLowerCase'](), _0xda0d6c);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x1a0433);
                        }
                    }
                } catch (_0x1e9ddc) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x1a0433 + ':', _0x1e9ddc['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x51db6c = _0x0_0xf9b4fc['join'](process['cwd'](), 'plugins');
        const _0x14e849 = _0x0_0x158d4a['readdirSync'](_0x51db6c)['filter'](_0x4f2ee0 => _0x4f2ee0['endsWith']('.js'));
        for (const _0xf83141 of _0x14e849) {
            try {
                const _0x390063 = _0x0_0xf9b4fc['join'](_0x51db6c, _0xf83141);
                const _0x414958 = (await import(pathToFileURL(_0x390063)['href']))['default'] || await import(pathToFileURL(_0x390063)['href']);
                if (_0x414958['command']) {
                    this['registerCommand'](_0x414958);
                    if (_0x414958['isPrefixless'] === !![]) {
                        const _0x5b235f = _0x414958['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x5b235f, _0x5b235f);
                        if (_0x414958['aliases'] && Array['isArray'](_0x414958['aliases'])) {
                            _0x414958['aliases']['forEach'](_0x1af131 => {
                                this['prefixlessCommands']['set'](_0x1af131['toLowerCase'](), _0x5b235f);
                            });
                        }
                    }
                }
            } catch (_0x25a0de) {
                console['error']('Error\x20loading\x20' + _0xf83141 + ':', _0x25a0de['message']);
            }
        }
    }
    ['registerCommand'](_0x41af7c) {
        const {
            command: _0x1446fa,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x19ceb1
        } = _0x41af7c;
        if (!_0x1446fa || typeof _0x19ceb1 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x1446fa || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x3f1eac = _0x1446fa['toLowerCase']();
        if (this['commands']['has'](_0x3f1eac)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x3f1eac + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x3f1eac, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0xaa1f77 = async (_0x51acf8, _0x4c09bb, ..._0x2fce93) => {
            const _0x4e6076 = this['stats']['get'](_0x3f1eac);
            if (this['disabledCommands']['has'](_0x3f1eac)) {
                return await _0x51acf8['sendMessage'](_0x4c09bb['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x3f1eac + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x4c09bb });
            }
            const _0x539d6f = _0x4c09bb['key']['participant'] || _0x4c09bb['key']['remoteJid'];
            const _0x347b85 = Date['now']();
            const _0x4de562 = _0x539d6f + '_' + _0x3f1eac;
            if (this['cooldowns']['has'](_0x4de562)) {
                const _0x4235d0 = this['cooldowns']['get'](_0x4de562) + (_0x41af7c['cooldown'] || 0xbb8);
                if (_0x347b85 < _0x4235d0)
                    return;
            }
            this['cooldowns']['set'](_0x4de562, _0x347b85);
            const _0x2ddeab = process['hrtime']['bigint']();
            try {
                _0x4e6076['calls']++;
                return await _0x19ceb1(_0x51acf8, _0x4c09bb, ..._0x2fce93);
            } catch (_0x3887c0) {
                _0x4e6076['errors']++;
                throw _0x3887c0;
            } finally {
                const _0x28d9c1 = process['hrtime']['bigint']();
                _0x4e6076['totalTime'] += _0x28d9c1 - _0x2ddeab;
                _0x4e6076['avgMs'] = Number(_0x4e6076['totalTime'] / BigInt(_0x4e6076['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x3f1eac, {
            ..._0x41af7c,
            'command': _0x1446fa,
            'handler': _0xaa1f77,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x4cc1f7 of aliases) {
            this['aliases']['set'](_0x4cc1f7['toLowerCase'](), _0x3f1eac);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x1446fa)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x1446fa);
        }
    }
    ['toggleCommand'](_0x17bc0d) {
        const _0x2180b9 = _0x17bc0d['toLowerCase']();
        if (this['disabledCommands']['has'](_0x2180b9)) {
            this['disabledCommands']['delete'](_0x2180b9);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x2180b9);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x40ba64, _0x4d0a39) {
        const _0x594472 = [];
        for (let _0x19aa41 = 0x0; _0x19aa41 <= _0x40ba64['length']; _0x19aa41++)
            _0x594472[_0x19aa41] = [_0x19aa41];
        for (let _0x2ba514 = 0x0; _0x2ba514 <= _0x4d0a39['length']; _0x2ba514++)
            _0x594472[0x0][_0x2ba514] = _0x2ba514;
        for (let _0x4005d3 = 0x1; _0x4005d3 <= _0x40ba64['length']; _0x4005d3++) {
            for (let _0x318225 = 0x1; _0x318225 <= _0x4d0a39['length']; _0x318225++) {
                _0x594472[_0x4005d3][_0x318225] = Math['min'](_0x594472[_0x4005d3 - 0x1][_0x318225] + 0x1, _0x594472[_0x4005d3][_0x318225 - 0x1] + 0x1, _0x594472[_0x4005d3 - 0x1][_0x318225 - 0x1] + (_0x40ba64[_0x4005d3 - 0x1] === _0x4d0a39[_0x318225 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x594472[_0x40ba64['length']][_0x4d0a39['length']];
    }
    ['findSuggestion'](_0xd33dd4) {
        const _0xc7e0b7 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x1dea02 = null;
        let _0x2c33f1 = 0x3;
        for (const _0x584236 of _0xc7e0b7) {
            const _0x7856db = this['_levenshtein'](_0xd33dd4, _0x584236);
            if (_0x7856db < _0x2c33f1) {
                _0x2c33f1 = _0x7856db;
                _0x1dea02 = _0x584236;
            }
        }
        return _0x1dea02;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x613374, _0x415a67]) => ({
            'command': _0x613374,
            'usage': _0x415a67['calls'],
            'errors': _0x415a67['errors'],
            'average_speed': _0x415a67['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x613374) ? 'OFF' : 'ON'
        }))['sort']((_0x4c8af0, _0x49f36d) => _0x49f36d['usage'] - _0x4c8af0['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x339a8f of this['commands']['keys']()) {
            this['stats']['set'](_0x339a8f, {
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
    ['getCommand'](_0x1d13b0, _0x5cb040) {
        const _0xf0f70b = _0x5cb040['find'](_0x17623a => _0x1d13b0['startsWith'](_0x17623a));
        const _0x28d311 = _0x1d13b0['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0xf0f70b) {
            if (this['prefixlessCommands']['has'](_0x28d311)) {
                const _0x18b544 = this['prefixlessCommands']['get'](_0x28d311);
                return this['commands']['get'](_0x18b544);
            }
            return null;
        }
        const _0x25c276 = _0x1d13b0['slice'](_0xf0f70b['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x25c276)) {
            return this['commands']['get'](_0x25c276);
        }
        if (this['aliases']['has'](_0x25c276)) {
            const _0x51078f = this['aliases']['get'](_0x25c276);
            return this['commands']['get'](_0x51078f);
        }
        const _0x136dca = this['findSuggestion'](_0x25c276);
        if (_0x136dca) {
            return {
                'command': _0x136dca,
                'handler': async (_0x5d862d, _0x3b5baf) => {
                    const _0x569496 = _0x3b5baf['key']['remoteJid'];
                    await _0x5d862d['sendMessage'](_0x569496, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0xf0f70b + _0x136dca + '*?' }, { 'quoted': _0x3b5baf });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x3755aa) {
        return this['categories']['get'](_0x3755aa['toLowerCase']()) || [];
    }
}
export default new CommandHandler();