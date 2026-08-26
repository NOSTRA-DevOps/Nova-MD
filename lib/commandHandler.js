import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x529831, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5a5437 from 'fs';
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
        const _0x365546 = _0x0_0x529831['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x5a5437['existsSync'](_0x365546))
            return;
        _0x0_0x5a5437['watch'](_0x365546, async (_0x2961c9, _0x1f3fc7) => {
            if (_0x1f3fc7 && _0x1f3fc7['endsWith']('.js')) {
                const _0x5119fa = _0x0_0x529831['join'](_0x365546, _0x1f3fc7);
                try {
                    if (_0x0_0x5a5437['existsSync'](_0x5119fa)) {
                        const _0x5e775f = (await import(pathToFileURL(_0x5119fa)['href']))['default'] || await import(pathToFileURL(_0x5119fa)['href']);
                        if (_0x5e775f['command']) {
                            this['registerCommand'](_0x5e775f);
                            if (_0x5e775f['isPrefixless'] === !![]) {
                                const _0x22d04c = _0x5e775f['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x22d04c, _0x22d04c);
                                if (_0x5e775f['aliases'] && Array['isArray'](_0x5e775f['aliases'])) {
                                    _0x5e775f['aliases']['forEach'](_0x444cba => {
                                        this['prefixlessCommands']['set'](_0x444cba['toLowerCase'](), _0x22d04c);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x1f3fc7);
                        }
                    }
                } catch (_0x4d2491) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x1f3fc7 + ':', _0x4d2491['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x51ae20 = _0x0_0x529831['join'](process['cwd'](), 'plugins');
        const _0x55fb49 = _0x0_0x5a5437['readdirSync'](_0x51ae20)['filter'](_0xe24d44 => _0xe24d44['endsWith']('.js'));
        for (const _0x497a45 of _0x55fb49) {
            try {
                const _0x1201d1 = _0x0_0x529831['join'](_0x51ae20, _0x497a45);
                const _0x33e98a = (await import(pathToFileURL(_0x1201d1)['href']))['default'] || await import(pathToFileURL(_0x1201d1)['href']);
                if (_0x33e98a['command']) {
                    this['registerCommand'](_0x33e98a);
                    if (_0x33e98a['isPrefixless'] === !![]) {
                        const _0x2c35eb = _0x33e98a['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x2c35eb, _0x2c35eb);
                        if (_0x33e98a['aliases'] && Array['isArray'](_0x33e98a['aliases'])) {
                            _0x33e98a['aliases']['forEach'](_0x5cda7d => {
                                this['prefixlessCommands']['set'](_0x5cda7d['toLowerCase'](), _0x2c35eb);
                            });
                        }
                    }
                }
            } catch (_0x56181a) {
                console['error']('Error\x20loading\x20' + _0x497a45 + ':', _0x56181a['message']);
            }
        }
    }
    ['registerCommand'](_0x374061) {
        const {
            command: _0x185a77,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x2d4332
        } = _0x374061;
        if (!_0x185a77 || typeof _0x2d4332 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x185a77 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x2a15e2 = _0x185a77['toLowerCase']();
        if (this['commands']['has'](_0x2a15e2)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x2a15e2 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x2a15e2, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x29c140 = async (_0x383917, _0x4c4c9c, ..._0xd641eb) => {
            const _0x4bfc46 = this['stats']['get'](_0x2a15e2);
            if (this['disabledCommands']['has'](_0x2a15e2)) {
                return await _0x383917['sendMessage'](_0x4c4c9c['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x2a15e2 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x4c4c9c });
            }
            const _0x39d644 = _0x4c4c9c['key']['participant'] || _0x4c4c9c['key']['remoteJid'];
            const _0x249693 = Date['now']();
            const _0x6a58c9 = _0x39d644 + '_' + _0x2a15e2;
            if (this['cooldowns']['has'](_0x6a58c9)) {
                const _0x4a57f0 = this['cooldowns']['get'](_0x6a58c9) + (_0x374061['cooldown'] || 0xbb8);
                if (_0x249693 < _0x4a57f0)
                    return;
            }
            this['cooldowns']['set'](_0x6a58c9, _0x249693);
            const _0x5ad8de = process['hrtime']['bigint']();
            try {
                _0x4bfc46['calls']++;
                return await _0x2d4332(_0x383917, _0x4c4c9c, ..._0xd641eb);
            } catch (_0x3f6653) {
                _0x4bfc46['errors']++;
                throw _0x3f6653;
            } finally {
                const _0x52f12b = process['hrtime']['bigint']();
                _0x4bfc46['totalTime'] += _0x52f12b - _0x5ad8de;
                _0x4bfc46['avgMs'] = Number(_0x4bfc46['totalTime'] / BigInt(_0x4bfc46['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x2a15e2, {
            ..._0x374061,
            'command': _0x185a77,
            'handler': _0x29c140,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x2f665d of aliases) {
            this['aliases']['set'](_0x2f665d['toLowerCase'](), _0x2a15e2);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x185a77)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x185a77);
        }
    }
    ['toggleCommand'](_0x1f754f) {
        const _0x53b140 = _0x1f754f['toLowerCase']();
        if (this['disabledCommands']['has'](_0x53b140)) {
            this['disabledCommands']['delete'](_0x53b140);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0x53b140);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x2d3b63, _0x1ffa77) {
        const _0x92f228 = [];
        for (let _0x30455f = 0x0; _0x30455f <= _0x2d3b63['length']; _0x30455f++)
            _0x92f228[_0x30455f] = [_0x30455f];
        for (let _0x5aa69d = 0x0; _0x5aa69d <= _0x1ffa77['length']; _0x5aa69d++)
            _0x92f228[0x0][_0x5aa69d] = _0x5aa69d;
        for (let _0x470789 = 0x1; _0x470789 <= _0x2d3b63['length']; _0x470789++) {
            for (let _0x5b5718 = 0x1; _0x5b5718 <= _0x1ffa77['length']; _0x5b5718++) {
                _0x92f228[_0x470789][_0x5b5718] = Math['min'](_0x92f228[_0x470789 - 0x1][_0x5b5718] + 0x1, _0x92f228[_0x470789][_0x5b5718 - 0x1] + 0x1, _0x92f228[_0x470789 - 0x1][_0x5b5718 - 0x1] + (_0x2d3b63[_0x470789 - 0x1] === _0x1ffa77[_0x5b5718 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x92f228[_0x2d3b63['length']][_0x1ffa77['length']];
    }
    ['findSuggestion'](_0x3d6987) {
        const _0x5ab75f = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x2aae20 = null;
        let _0x54f1ec = 0x3;
        for (const _0x27e570 of _0x5ab75f) {
            const _0x46eb64 = this['_levenshtein'](_0x3d6987, _0x27e570);
            if (_0x46eb64 < _0x54f1ec) {
                _0x54f1ec = _0x46eb64;
                _0x2aae20 = _0x27e570;
            }
        }
        return _0x2aae20;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x790b85, _0x321151]) => ({
            'command': _0x790b85,
            'usage': _0x321151['calls'],
            'errors': _0x321151['errors'],
            'average_speed': _0x321151['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x790b85) ? 'OFF' : 'ON'
        }))['sort']((_0x171aa7, _0x35458d) => _0x35458d['usage'] - _0x171aa7['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x40f8a0 of this['commands']['keys']()) {
            this['stats']['set'](_0x40f8a0, {
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
    ['getCommand'](_0x100975, _0x7677f9) {
        const _0x235305 = _0x7677f9['find'](_0x51e7af => _0x100975['startsWith'](_0x51e7af));
        const _0x2018ed = _0x100975['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x235305) {
            if (this['prefixlessCommands']['has'](_0x2018ed)) {
                const _0x3a1343 = this['prefixlessCommands']['get'](_0x2018ed);
                return this['commands']['get'](_0x3a1343);
            }
            return null;
        }
        const _0x5b1e41 = _0x100975['slice'](_0x235305['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x5b1e41)) {
            return this['commands']['get'](_0x5b1e41);
        }
        if (this['aliases']['has'](_0x5b1e41)) {
            const _0x91b381 = this['aliases']['get'](_0x5b1e41);
            return this['commands']['get'](_0x91b381);
        }
        const _0x356f7d = this['findSuggestion'](_0x5b1e41);
        if (_0x356f7d) {
            return {
                'command': _0x356f7d,
                'handler': async (_0x41609, _0x43609b) => {
                    const _0x31b018 = _0x43609b['key']['remoteJid'];
                    await _0x41609['sendMessage'](_0x31b018, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x235305 + _0x356f7d + '*?' }, { 'quoted': _0x43609b });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x420448) {
        return this['categories']['get'](_0x420448['toLowerCase']()) || [];
    }
}
export default new CommandHandler();