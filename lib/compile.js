import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x1eb341 from 'fs';
import _0x0_0x427123 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x427123['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x427123['join'](LIB_DIR, 'bin');
const SOURCES = [
    {
        'src': 'dna.cpp',
        'bin': 'dna'
    },
    {
        'src': 'cipher.cpp',
        'bin': 'cipher'
    },
    {
        'src': 'rle.cpp',
        'bin': 'rle'
    },
    {
        'src': 'analyze.cpp',
        'bin': 'analyze'
    }
];
export async function compileAll() {
    if (!_0x0_0x1eb341['existsSync'](BIN_DIR)) {
        _0x0_0x1eb341['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x4b5413,
                bin: _0x5e6afc
            } of SOURCES) {
        const _0x2fe59d = _0x0_0x427123['join'](LIB_DIR, _0x4b5413);
        const _0x313ff4 = _0x0_0x427123['join'](BIN_DIR, _0x5e6afc);
        if (!_0x0_0x1eb341['existsSync'](_0x2fe59d)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x2fe59d);
            continue;
        }
        if (_0x0_0x1eb341['existsSync'](_0x313ff4)) {
            const _0x8af5db = _0x0_0x1eb341['statSync'](_0x2fe59d)['mtimeMs'];
            const _0x48021f = _0x0_0x1eb341['statSync'](_0x313ff4)['mtimeMs'];
            if (_0x48021f >= _0x8af5db) {
                console['log']('[compile]\x20' + _0x5e6afc + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x4b5413 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x313ff4 + '\x22\x20\x22' + _0x2fe59d + '\x22', { 'timeout': 0x7530 });
            _0x0_0x1eb341['chmodSync'](_0x313ff4, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x5e6afc + '\x20compiled');
        } catch (_0x525366) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x4b5413 + ':\x20' + (_0x525366['stderr'] || _0x525366['message']));
        }
    }
}
export function getBin(_0x253a86) {
    return _0x0_0x427123['join'](BIN_DIR, _0x253a86);
}