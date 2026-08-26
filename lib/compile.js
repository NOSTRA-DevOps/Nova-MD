import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x19e643 from 'fs';
import _0x0_0x3d4c25 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x3d4c25['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x3d4c25['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x19e643['existsSync'](BIN_DIR)) {
        _0x0_0x19e643['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x453075,
                bin: _0x1f5bdf
            } of SOURCES) {
        const _0x3333ed = _0x0_0x3d4c25['join'](LIB_DIR, _0x453075);
        const _0x42a815 = _0x0_0x3d4c25['join'](BIN_DIR, _0x1f5bdf);
        if (!_0x0_0x19e643['existsSync'](_0x3333ed)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x3333ed);
            continue;
        }
        if (_0x0_0x19e643['existsSync'](_0x42a815)) {
            const _0x3a1a1c = _0x0_0x19e643['statSync'](_0x3333ed)['mtimeMs'];
            const _0x3e95fc = _0x0_0x19e643['statSync'](_0x42a815)['mtimeMs'];
            if (_0x3e95fc >= _0x3a1a1c) {
                console['log']('[compile]\x20' + _0x1f5bdf + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x453075 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x42a815 + '\x22\x20\x22' + _0x3333ed + '\x22', { 'timeout': 0x7530 });
            _0x0_0x19e643['chmodSync'](_0x42a815, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x1f5bdf + '\x20compiled');
        } catch (_0x2db9a4) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x453075 + ':\x20' + (_0x2db9a4['stderr'] || _0x2db9a4['message']));
        }
    }
}
export function getBin(_0x35cb2a) {
    return _0x0_0x3d4c25['join'](BIN_DIR, _0x35cb2a);
}