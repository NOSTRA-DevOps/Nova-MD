import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import _0x0_0x4bb1fd, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1a6f7e from 'fs';
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
        const _0x4282ba = _0x0_0x4bb1fd['join'](process['cwd'](), 'plugins');
        if (!_0x0_0x1a6f7e['existsSync'](_0x4282ba))
            return;
        _0x0_0x1a6f7e['watch'](_0x4282ba, async (_0xb2ce4d, _0x3e4d63) => {
            if (_0x3e4d63 && _0x3e4d63['endsWith']('.js')) {
                const _0x307ceb = _0x0_0x4bb1fd['join'](_0x4282ba, _0x3e4d63);
                try {
                    if (_0x0_0x1a6f7e['existsSync'](_0x307ceb)) {
                        const _0x1852d3 = (await import(pathToFileURL(_0x307ceb)['href']))['default'] || await import(pathToFileURL(_0x307ceb)['href']);
                        if (_0x1852d3['command']) {
                            this['registerCommand'](_0x1852d3);
                            if (_0x1852d3['isPrefixless'] === !![]) {
                                const _0x56e161 = _0x1852d3['command']['toLowerCase']();
                                this['prefixlessCommands']['set'](_0x56e161, _0x56e161);
                                if (_0x1852d3['aliases'] && Array['isArray'](_0x1852d3['aliases'])) {
                                    _0x1852d3['aliases']['forEach'](_0x3f3494 => {
                                        this['prefixlessCommands']['set'](_0x3f3494['toLowerCase'](), _0x56e161);
                                    });
                                }
                            }
                            console['log']('[WATCHER]\x20Hot-reloaded:\x20' + _0x3e4d63);
                        }
                    }
                } catch (_0x23776a) {
                    console['error']('[WATCHER]\x20Error\x20reloading\x20' + _0x3e4d63 + ':', _0x23776a['message']);
                }
            }
        });
    }
    async ['loadCommands']() {
        const _0x71b28f = _0x0_0x4bb1fd['join'](process['cwd'](), 'plugins');
        const _0x48c56f = _0x0_0x1a6f7e['readdirSync'](_0x71b28f)['filter'](_0x4c74a9 => _0x4c74a9['endsWith']('.js'));
        for (const _0x244306 of _0x48c56f) {
            try {
                const _0x29f074 = _0x0_0x4bb1fd['join'](_0x71b28f, _0x244306);
                const _0xecbe61 = (await import(pathToFileURL(_0x29f074)['href']))['default'] || await import(pathToFileURL(_0x29f074)['href']);
                if (_0xecbe61['command']) {
                    this['registerCommand'](_0xecbe61);
                    if (_0xecbe61['isPrefixless'] === !![]) {
                        const _0x20be69 = _0xecbe61['command']['toLowerCase']();
                        this['prefixlessCommands']['set'](_0x20be69, _0x20be69);
                        if (_0xecbe61['aliases'] && Array['isArray'](_0xecbe61['aliases'])) {
                            _0xecbe61['aliases']['forEach'](_0x7af7a4 => {
                                this['prefixlessCommands']['set'](_0x7af7a4['toLowerCase'](), _0x20be69);
                            });
                        }
                    }
                }
            } catch (_0x4a5d73) {
                console['error']('Error\x20loading\x20' + _0x244306 + ':', _0x4a5d73['message']);
            }
        }
    }
    ['registerCommand'](_0x3a9248) {
        const {
            command: _0x506ca2,
            aliases: aliases = [],
            category: category = 'misc',
            handler: _0x472ed6
        } = _0x3a9248;
        if (!_0x506ca2 || typeof _0x472ed6 !== 'function') {
            console['error']('[SKIP]\x20Plugin\x20at\x20' + (_0x506ca2 || 'unknown') + '\x20is\x20missing\x20a\x20valid\x20command\x20name\x20or\x20handler\x20function.');
            return;
        }
        const _0x4b7577 = _0x506ca2['toLowerCase']();
        if (this['commands']['has'](_0x4b7577)) {
            console['warn']('[REPLACED]\x20Command\x20\x22' + _0x4b7577 + '\x22\x20was\x20already\x20registered\x20and\x20has\x20been\x20overwritten.');
        }
        this['stats']['set'](_0x4b7577, {
            'calls': 0x0,
            'errors': 0x0,
            'totalTime': 0x0n,
            'avgMs': 0x0
        });
        const _0x35214d = async (_0x2da082, _0x182806, ..._0x12bace) => {
            const _0x364ad1 = this['stats']['get'](_0x4b7577);
            if (this['disabledCommands']['has'](_0x4b7577)) {
                return await _0x2da082['sendMessage'](_0x182806['key']['remoteJid'], { 'text': '🚫\x20The\x20command\x20*' + _0x4b7577 + '*\x20is\x20currently\x20disabled.' }, { 'quoted': _0x182806 });
            }
            const _0x42608d = _0x182806['key']['participant'] || _0x182806['key']['remoteJid'];
            const _0x4a415c = Date['now']();
            const _0x240110 = _0x42608d + '_' + _0x4b7577;
            if (this['cooldowns']['has'](_0x240110)) {
                const _0x2b3d70 = this['cooldowns']['get'](_0x240110) + (_0x3a9248['cooldown'] || 0xbb8);
                if (_0x4a415c < _0x2b3d70)
                    return;
            }
            this['cooldowns']['set'](_0x240110, _0x4a415c);
            const _0x56365f = process['hrtime']['bigint']();
            try {
                _0x364ad1['calls']++;
                return await _0x472ed6(_0x2da082, _0x182806, ..._0x12bace);
            } catch (_0x582f7c) {
                _0x364ad1['errors']++;
                throw _0x582f7c;
            } finally {
                const _0x310ab3 = process['hrtime']['bigint']();
                _0x364ad1['totalTime'] += _0x310ab3 - _0x56365f;
                _0x364ad1['avgMs'] = Number(_0x364ad1['totalTime'] / BigInt(_0x364ad1['calls'] || 0x1)) / 0xf4240;
            }
        };
        this['commands']['set'](_0x4b7577, {
            ..._0x3a9248,
            'command': _0x506ca2,
            'handler': _0x35214d,
            'category': category['toLowerCase'](),
            'aliases': aliases
        });
        for (const _0x4fca7d of aliases) {
            this['aliases']['set'](_0x4fca7d['toLowerCase'](), _0x4b7577);
        }
        if (!this['categories']['has'](category['toLowerCase']())) {
            this['categories']['set'](category['toLowerCase'](), []);
        }
        if (!this['categories']['get'](category['toLowerCase']())['includes'](_0x506ca2)) {
            this['categories']['get'](category['toLowerCase']())['push'](_0x506ca2);
        }
    }
    ['toggleCommand'](_0xd76c9e) {
        const _0xbacdbf = _0xd76c9e['toLowerCase']();
        if (this['disabledCommands']['has'](_0xbacdbf)) {
            this['disabledCommands']['delete'](_0xbacdbf);
            return 'enabled';
        } else {
            this['disabledCommands']['add'](_0xbacdbf);
            return 'disabled';
        }
    }
    ['_levenshtein'](_0xd3a888, _0x1d4845) {
        const _0x2fddca = [];
        for (let _0x3568d2 = 0x0; _0x3568d2 <= _0xd3a888['length']; _0x3568d2++)
            _0x2fddca[_0x3568d2] = [_0x3568d2];
        for (let _0x47d142 = 0x0; _0x47d142 <= _0x1d4845['length']; _0x47d142++)
            _0x2fddca[0x0][_0x47d142] = _0x47d142;
        for (let _0x42e2ad = 0x1; _0x42e2ad <= _0xd3a888['length']; _0x42e2ad++) {
            for (let _0x41138c = 0x1; _0x41138c <= _0x1d4845['length']; _0x41138c++) {
                _0x2fddca[_0x42e2ad][_0x41138c] = Math['min'](_0x2fddca[_0x42e2ad - 0x1][_0x41138c] + 0x1, _0x2fddca[_0x42e2ad][_0x41138c - 0x1] + 0x1, _0x2fddca[_0x42e2ad - 0x1][_0x41138c - 0x1] + (_0xd3a888[_0x42e2ad - 0x1] === _0x1d4845[_0x41138c - 0x1] ? 0x0 : 0x1));
            }
        }
        return _0x2fddca[_0xd3a888['length']][_0x1d4845['length']];
    }
    ['findSuggestion'](_0x314c0f) {
        const _0x459cf5 = [
            ...this['commands']['keys'](),
            ...this['aliases']['keys']()
        ];
        let _0x490ee7 = null;
        let _0x5d5325 = 0x3;
        for (const _0x3768fe of _0x459cf5) {
            const _0x2e6140 = this['_levenshtein'](_0x314c0f, _0x3768fe);
            if (_0x2e6140 < _0x5d5325) {
                _0x5d5325 = _0x2e6140;
                _0x490ee7 = _0x3768fe;
            }
        }
        return _0x490ee7;
    }
    ['getDiagnostics']() {
        return Array['from'](this['stats']['entries']())['map'](([_0x5ed83d, _0x5bb577]) => ({
            'command': _0x5ed83d,
            'usage': _0x5bb577['calls'],
            'errors': _0x5bb577['errors'],
            'average_speed': _0x5bb577['avgMs']['toFixed'](0x3) + 'ms',
            'status': this['disabledCommands']['has'](_0x5ed83d) ? 'OFF' : 'ON'
        }))['sort']((_0x5c95dd, _0x24a8b5) => _0x24a8b5['usage'] - _0x5c95dd['usage']);
    }
    ['resetStats']() {
        this['stats']['clear']();
        this['cooldowns']['clear']();
        for (const _0x227a46 of this['commands']['keys']()) {
            this['stats']['set'](_0x227a46, {
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
    ['getCommand'](_0x2d61ee, _0xccd859) {
        const _0x7eeb64 = _0xccd859['find'](_0x3d6541 => _0x2d61ee['startsWith'](_0x3d6541));
        const _0x1ea34d = _0x2d61ee['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (!_0x7eeb64) {
            if (this['prefixlessCommands']['has'](_0x1ea34d)) {
                const _0x28a286 = this['prefixlessCommands']['get'](_0x1ea34d);
                return this['commands']['get'](_0x28a286);
            }
            return null;
        }
        const _0x30e4cd = _0x2d61ee['slice'](_0x7eeb64['length'])['trim']()['split']('\x20')[0x0]['toLowerCase']();
        if (this['commands']['has'](_0x30e4cd)) {
            return this['commands']['get'](_0x30e4cd);
        }
        if (this['aliases']['has'](_0x30e4cd)) {
            const _0x5ae0e7 = this['aliases']['get'](_0x30e4cd);
            return this['commands']['get'](_0x5ae0e7);
        }
        const _0x3d4313 = this['findSuggestion'](_0x30e4cd);
        if (_0x3d4313) {
            return {
                'command': _0x3d4313,
                'handler': async (_0x455917, _0xffed3e) => {
                    const _0x22256c = _0xffed3e['key']['remoteJid'];
                    await _0x455917['sendMessage'](_0x22256c, { 'text': '❓\x20Did\x20you\x20mean\x20*' + _0x7eeb64 + _0x3d4313 + '*?' }, { 'quoted': _0xffed3e });
                }
            };
        }
        return null;
    }
    ['getCommandsByCategory'](_0x14f260) {
        return this['categories']['get'](_0x14f260['toLowerCase']()) || [];
    }
}
export default new CommandHandler();