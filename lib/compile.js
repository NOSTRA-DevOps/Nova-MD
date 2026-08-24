import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x417ad6 from 'fs';
import _0x0_0x463720 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x463720['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x463720['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x417ad6['existsSync'](BIN_DIR)) {
        _0x0_0x417ad6['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x3bb7ae,
                bin: _0x39db54
            } of SOURCES) {
        const _0x2a6e03 = _0x0_0x463720['join'](LIB_DIR, _0x3bb7ae);
        const _0x204a13 = _0x0_0x463720['join'](BIN_DIR, _0x39db54);
        if (!_0x0_0x417ad6['existsSync'](_0x2a6e03)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x2a6e03);
            continue;
        }
        if (_0x0_0x417ad6['existsSync'](_0x204a13)) {
            const _0x5a5e37 = _0x0_0x417ad6['statSync'](_0x2a6e03)['mtimeMs'];
            const _0x21ec59 = _0x0_0x417ad6['statSync'](_0x204a13)['mtimeMs'];
            if (_0x21ec59 >= _0x5a5e37) {
                console['log']('[compile]\x20' + _0x39db54 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x3bb7ae + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x204a13 + '\x22\x20\x22' + _0x2a6e03 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x417ad6['chmodSync'](_0x204a13, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x39db54 + '\x20compiled');
        } catch (_0x3a3425) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x3bb7ae + ':\x20' + (_0x3a3425['stderr'] || _0x3a3425['message']));
        }
    }
}
export function getBin(_0x4a6142) {
    return _0x0_0x463720['join'](BIN_DIR, _0x4a6142);
}