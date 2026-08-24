import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x3c7091 from 'fs';
import _0x0_0x15ff5d from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x15ff5d['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x15ff5d['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x3c7091['existsSync'](BIN_DIR)) {
        _0x0_0x3c7091['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x2e45f5,
                bin: _0x3b42b4
            } of SOURCES) {
        const _0x3208d0 = _0x0_0x15ff5d['join'](LIB_DIR, _0x2e45f5);
        const _0x438044 = _0x0_0x15ff5d['join'](BIN_DIR, _0x3b42b4);
        if (!_0x0_0x3c7091['existsSync'](_0x3208d0)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x3208d0);
            continue;
        }
        if (_0x0_0x3c7091['existsSync'](_0x438044)) {
            const _0x5a5297 = _0x0_0x3c7091['statSync'](_0x3208d0)['mtimeMs'];
            const _0x1258dd = _0x0_0x3c7091['statSync'](_0x438044)['mtimeMs'];
            if (_0x1258dd >= _0x5a5297) {
                console['log']('[compile]\x20' + _0x3b42b4 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x2e45f5 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x438044 + '\x22\x20\x22' + _0x3208d0 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x3c7091['chmodSync'](_0x438044, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x3b42b4 + '\x20compiled');
        } catch (_0x4f1d0b) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x2e45f5 + ':\x20' + (_0x4f1d0b['stderr'] || _0x4f1d0b['message']));
        }
    }
}
export function getBin(_0x5ca1a4) {
    return _0x0_0x15ff5d['join'](BIN_DIR, _0x5ca1a4);
}