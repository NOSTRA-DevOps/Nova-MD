import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x204f09 from 'fs';
import _0x0_0x4bd787 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x4bd787['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x4bd787['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x204f09['existsSync'](BIN_DIR)) {
        _0x0_0x204f09['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x5aff0b,
                bin: _0x46b1e0
            } of SOURCES) {
        const _0x4aca9d = _0x0_0x4bd787['join'](LIB_DIR, _0x5aff0b);
        const _0x2815d7 = _0x0_0x4bd787['join'](BIN_DIR, _0x46b1e0);
        if (!_0x0_0x204f09['existsSync'](_0x4aca9d)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x4aca9d);
            continue;
        }
        if (_0x0_0x204f09['existsSync'](_0x2815d7)) {
            const _0x2f27cf = _0x0_0x204f09['statSync'](_0x4aca9d)['mtimeMs'];
            const _0x3da38d = _0x0_0x204f09['statSync'](_0x2815d7)['mtimeMs'];
            if (_0x3da38d >= _0x2f27cf) {
                console['log']('[compile]\x20' + _0x46b1e0 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x5aff0b + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x2815d7 + '\x22\x20\x22' + _0x4aca9d + '\x22', { 'timeout': 0x7530 });
            _0x0_0x204f09['chmodSync'](_0x2815d7, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x46b1e0 + '\x20compiled');
        } catch (_0x419dc5) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x5aff0b + ':\x20' + (_0x419dc5['stderr'] || _0x419dc5['message']));
        }
    }
}
export function getBin(_0x298d97) {
    return _0x0_0x4bd787['join'](BIN_DIR, _0x298d97);
}