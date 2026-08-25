import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x1a8044 from 'fs';
import _0x0_0x308039 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x308039['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x308039['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x1a8044['existsSync'](BIN_DIR)) {
        _0x0_0x1a8044['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x16e85a,
                bin: _0x5f07a9
            } of SOURCES) {
        const _0x5690c4 = _0x0_0x308039['join'](LIB_DIR, _0x16e85a);
        const _0x34296a = _0x0_0x308039['join'](BIN_DIR, _0x5f07a9);
        if (!_0x0_0x1a8044['existsSync'](_0x5690c4)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x5690c4);
            continue;
        }
        if (_0x0_0x1a8044['existsSync'](_0x34296a)) {
            const _0x18dc6b = _0x0_0x1a8044['statSync'](_0x5690c4)['mtimeMs'];
            const _0x3e6d39 = _0x0_0x1a8044['statSync'](_0x34296a)['mtimeMs'];
            if (_0x3e6d39 >= _0x18dc6b) {
                console['log']('[compile]\x20' + _0x5f07a9 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x16e85a + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x34296a + '\x22\x20\x22' + _0x5690c4 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x1a8044['chmodSync'](_0x34296a, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x5f07a9 + '\x20compiled');
        } catch (_0x3d26df) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x16e85a + ':\x20' + (_0x3d26df['stderr'] || _0x3d26df['message']));
        }
    }
}
export function getBin(_0x30e677) {
    return _0x0_0x308039['join'](BIN_DIR, _0x30e677);
}