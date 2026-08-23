import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x557ce3, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x161ba1 from 'fs';
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
        const _0x39e73b = _0x0_0x557ce3['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x161ba1['existsSync'](_0x39e73b))
            return;
        _0x0_0x161ba1['watch'](_0x39e73b, async (_0x2fc3bb, _0x2f404a) => {
            if (_0x2f404a && _0x2f404a['endsWith']('.js')) {
                const _0x2a117e = _0x0_0x557ce3['join'](_0x39e73b, _0x2f404a);
                try {
                    if (_0x0_0x161ba1['existsSync'](_0x2a117e)) {
                        const _0x4d5f6a = (await import(pathToFileURL(_0x2a117e)['href']))['default'] || await import(pathToFileURL(_0x2a117e)['href']);
                        if (_0x4d5f6a['command']) {
                            this['registerCommand'](_0x4d5f6a);
                            if (_0x4d5f6a['isPrefixless'] === !![]) {
                                const _0x5119ca = _0x4d5f6a['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x5119ca, _0x5119ca);
                                if (_0x4d5f6a['aliases'] && Array['isArray'](_0x4d5f6a['aliases'])) {
                                    _0x4d5f6a['aliases']['forEach'](_0x468d76 => {
                                        this['prefixlessCommands']['set'](_0x468d76['toLowerCase'](), _0x5119ca);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x2f404a);
                        }
                    }
                } catch (_0x396f73) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x2f404a + ':', _0x396f73['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x3d4278 = _0x0_0x557ce3['join'](process['cwd'](), 'plugins');
        const _0x287174 = _0x0_0x161ba1['readdirSync'](_0x3d4278)['filter'](_0x6f7f9b => _0x6f7f9b['endsWith']('.js'));
        for (const _0xbec1b6 of _0x287174) {
            try {
                const _0x527552 = _0x0_0x557ce3['join'](_0x3d4278, _0xbec1b6);
                const _0x420f7e = (await import(pathToFileURL(_0x527552)['href']))['default'] || await import(pathToFileURL(_0x527552)['href']);
                if (_0x420f7e['command']) {
                    this['registerCommand'](_0x420f7e);
                    if (_0x420f7e['isPrefixless'] === !![]) {
                        const _0xd46afc = _0x420f7e['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0xd46afc, _0xd46afc);
                        if (_0x420f7e['aliases'] && Array['isArray'](_0x420f7e['aliases'])) {
                            _0x420f7e['aliases']['forEach'](_0xe444d2 => {
                                this['prefixlessCommands']['set'](_0xe444d2['toLowerCase'](), _0xd46afc);
                            });
                        }
                    }
                }
            } catch (_0x54be29) {
                console['error']('Error\x20loading\x20' + _0xbec1b6 + ':', _0x54be29['message']);
            }
        }
    }
    ['registerCommand'](_0x57461d) {
        const {
            command: _0x1016ae,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x3515c1
        } = _0x57461d;
        if (!_0x1016ae || typeof _0x3515c1 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x1016ae || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x59f2a2 = _0x1016ae['toLowerCase']();
        if (this['commands']['has'](_0x59f2a2)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x59f2a2 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x59f2a2, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x2681aa = async (_0x5ee37a, _0x5971e6, ..._0x4bd8ec) => {
            const _0x5ac897 = this['stats']['get'](_0x59f2a2);
            if (this['disabledCommands']['has'](_0x59f2a2)) {
                return await _0x5ee37a['sendMessage'](_0x5971e6['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x59f2a2 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x5971e6 });
            }
            const _0xfae988 = _0x5971e6['key']['participant'] || _0x5971e6['key']['remoteJid'];
            const _0x45ccec = Date['now']();
            const _0xbb8d98 = _0xfae988 + '_' + _0x59f2a2;
            if (this['cooldowns']['has'](_0xbb8d98)) {
                const _0x53ff3d = this['cooldowns']['get'](_0xbb8d98) + (_0x57461d['cooldown'] || 0xbb8);
                if (_0x45ccec < _0x53ff3d)
                    return;
            }
            this['cooldowns']['set'](_0xbb8d98, _0x45ccec);
            const _0x5212a2 = process['hrtime']['bigint']();
            try {
                _0x5ac897['calls']++;
                return await _0x3515c1(_0x5ee37a, _0x5971e6, ..._0x4bd8ec);
            } catch (_0x4c7e55) {
                _0x5ac897['errors']++;
                throw _0x4c7e55;
            } finally {
                const _0x49fc81 = process['hrtime']['bigint']();
                _0x5ac897['totalTime'] += _0x49fc81 - _0x5212a2;
                _0x5ac897['avgMs'] = Number(_0x5ac897['totalTime'] / BigInt(_0x5ac897['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x59f2a2, {
            ..._0x57461d,
            'command': _0x1016ae,
            'handler': _0x2681aa,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x5864be of aliases) {
            this['aliases']['set'](_0x5864be['toLowerCase'](), _0x59f2a2);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x1016ae)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x1016ae);
        }
    }
    ['toggleCommand'](_0x96cbc2) {
        const _0xe9dfcf = _0x96cbc2['toLowerCase']();
        if (this['disabledCommands']['has'](_0xe9dfcf)) {
            this['disabledCommands']['delete'](_0xe9dfcf);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0xe9dfcf);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0x530397, _0x3699e5) {
        const _0x1bfde7 = [];
        for (let _0x1d5f83 = 0x0; _0x1d5f83 <= _0x530397['length']; _0x1d5f83++)
            _0x1bfde7[_0x1d5f83] = [_0x1d5f83];
        for (let _0x37d458 = 0x0; _0x37d458 <= _0x3699e5['length']; _0x37d458++)
            _0x1bfde7[0x0][_0x37d458] = _0x37d458;
        for (let _0x288454 = 0x1; _0x288454 <= _0x530397['length']; _0x288454++) {
            for (let _0x3b6a55 = 0x1; _0x3b6a55 <= _0x3699e5['length']; _0x3b6a55++) {
                _0x1bfde7[_0x288454][_0x3b6a55] = Math['min'](_0x1bfde7[_0x288454 - 0x1][_0x3b6a55] + 0x1, _0x1bfde7[_0x288454][_0x3b6a55 - 0x1] + 0x1, _0x1bfde7[_0x288454 - 0x1][_0x3b6a55 - 0x1] + (_0x530397[_0x288454 - 0x1] === _0x3699e5[_0x3b6a55 - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x1bfde7[_0x530397['length']][_0x3699e5['length']];
    }
    ['findSuggestion'](_0xc130fc) {
        const _0x294676 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x3bde8c = null;
        let _0x590674 = 0x3;
        for (const _0xd2df48 of _0x294676) {
            const _0x57d64b = this['_levenshtein'](_0xc130fc, _0xd2df48);
            if (_0x57d64b < _0x590674) {
                _0x590674 = _0x57d64b;
                _0x3bde8c = _0xd2df48;
            }
        }
        return _0x3bde8c;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x5dc28d, _0x54d03d]) => ({
            'command': _0x5dc28d,
            'usage': _0x54d03d['calls'],
            'errors': _0x54d03d['errors'],
            'average_speed': _0x54d03d['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x5dc28d) ? 'OFF' : 'ON'
        }))['sort']((_0x1478dd, _0x2d7ef0) => _0x2d7ef0['usage'] - _0x1478dd['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x15ad09 of this['commands']['keys']()) {
            this['stats']['set'](_0x15ad09, {
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
    ['getCommand'](_0x13a6a5, _0x1649c0) {
        const _0x545df7 = _0x1649c0['find'](_0x316bdf => _0x13a6a5['startsWith'](_0x316bdf));
        const _0x210c05 = _0x13a6a5['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x545df7) {
            if (this['prefixlessCommands']['has'](_0x210c05)) {
                const _0x204061 = this['prefixlessCommands']['get'](_0x210c05);
                return this['commands']['get'](_0x204061);
            }
            return null;
        }
        const _0x648cbd = _0x13a6a5['slice'](_0x545df7['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x648cbd)) {
            return this['commands']['get'](_0x648cbd);
        }
        if (this['aliases']['has'](_0x648cbd)) {
            const _0x33a760 = this['aliases']['get'](_0x648cbd);
            return this['commands']['get'](_0x33a760);
        }
        const _0x4ad2ff = this['findSuggestion'](_0x648cbd);
        if (_0x4ad2ff) {
            return {
                'command': _0x4ad2ff,
                'handler': async (_0x5a817d, _0x577535) => {
                    const _0x32a5ec = _0x577535['key']['remoteJid'];
                    await _0x5a817d['sendMessage'](_0x32a5ec, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x545df7 + _0x4ad2ff + '*?' }, { 'quoted': _0x577535 });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x1cc844) {
        return this['categories']['get'](_0x1cc844['toLowerCase']()) || [];
    }
}
export default new CommandHandler();