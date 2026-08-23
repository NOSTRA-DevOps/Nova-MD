import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x281cd9 from 'fs';
import _0x0_0x3d9058 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x3d9058['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x3d9058['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x281cd9['existsSync'](BIN_DIR)) {
        _0x0_0x281cd9['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x458106,
                bin: _0x1aa422
            } of SOURCES) {
        const _0x132176 = _0x0_0x3d9058['join'](LIB_DIR, _0x458106);
        const _0x371c50 = _0x0_0x3d9058['join'](BIN_DIR, _0x1aa422);
        if (!_0x0_0x281cd9['existsSync'](_0x132176)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x132176);
            continue;
        }
        if (_0x0_0x281cd9['existsSync'](_0x371c50)) {
            const _0x162dd4 = _0x0_0x281cd9['statSync'](_0x132176)['mtimeMs'];
            const _0x40ace7 = _0x0_0x281cd9['statSync'](_0x371c50)['mtimeMs'];
            if (_0x40ace7 >= _0x162dd4) {
                console['log']('[compile]\x20' + _0x1aa422 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x458106 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x371c50 + '\x22\x20\x22' + _0x132176 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x281cd9['chmodSync'](_0x371c50, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x1aa422 + '\x20compiled');
        } catch (_0x37bb3e) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x458106 + ':\x20' + (_0x37bb3e['stderr'] || _0x37bb3e['message']));
        }
    }
}
export function getBin(_0x3e80fd) {
    return _0x0_0x3d9058['join'](BIN_DIR, _0x3e80fd);
}