import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x27314c from 'fs';
import _0x0_0x129ded from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x129ded['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x129ded['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x27314c['existsSync'](BIN_DIR)) {
        _0x0_0x27314c['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0xc2079d,
                bin: _0x7e95f9
            } of SOURCES) {
        const _0x276062 = _0x0_0x129ded['join'](LIB_DIR, _0xc2079d);
        const _0x38310d = _0x0_0x129ded['join'](BIN_DIR, _0x7e95f9);
        if (!_0x0_0x27314c['existsSync'](_0x276062)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x276062);
            continue;
        }
        if (_0x0_0x27314c['existsSync'](_0x38310d)) {
            const _0x9826d7 = _0x0_0x27314c['statSync'](_0x276062)['mtimeMs'];
            const _0x57a68a = _0x0_0x27314c['statSync'](_0x38310d)['mtimeMs'];
            if (_0x57a68a >= _0x9826d7) {
                console['log']('[compile]\x20' + _0x7e95f9 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0xc2079d + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x38310d + '\x22\x20\x22' + _0x276062 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x27314c['chmodSync'](_0x38310d, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x7e95f9 + '\x20compiled');
        } catch (_0x2c5b36) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0xc2079d + ':\x20' + (_0x2c5b36['stderr'] || _0x2c5b36['message']));
        }
    }
}
export function getBin(_0xea400) {
    return _0x0_0x129ded['join'](BIN_DIR, _0xea400);
}