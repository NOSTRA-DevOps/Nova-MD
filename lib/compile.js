import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x291b86 from 'fs';
import _0x0_0x311280 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x311280['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x311280['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x291b86['existsSync'](BIN_DIR)) {
        _0x0_0x291b86['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0xf74649,
                bin: _0x10b1f5
            } of SOURCES) {
        const _0x2445b0 = _0x0_0x311280['join'](LIB_DIR, _0xf74649);
        const _0x2089ee = _0x0_0x311280['join'](BIN_DIR, _0x10b1f5);
        if (!_0x0_0x291b86['existsSync'](_0x2445b0)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x2445b0);
            continue;
        }
        if (_0x0_0x291b86['existsSync'](_0x2089ee)) {
            const _0x94843b = _0x0_0x291b86['statSync'](_0x2445b0)['mtimeMs'];
            const _0x3a1d5e = _0x0_0x291b86['statSync'](_0x2089ee)['mtimeMs'];
            if (_0x3a1d5e >= _0x94843b) {
                console['log']('[compile]\x20' + _0x10b1f5 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0xf74649 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x2089ee + '\x22\x20\x22' + _0x2445b0 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x291b86['chmodSync'](_0x2089ee, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x10b1f5 + '\x20compiled');
        } catch (_0x4e87d8) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0xf74649 + ':\x20' + (_0x4e87d8['stderr'] || _0x4e87d8['message']));
        }
    }
}
export function getBin(_0x125cff) {
    return _0x0_0x311280['join'](BIN_DIR, _0x125cff);
}