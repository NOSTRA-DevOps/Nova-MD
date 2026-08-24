import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x5a0f25 from 'fs';
import _0x0_0x8f8c6b from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x8f8c6b['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x8f8c6b['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x5a0f25['existsSync'](BIN_DIR)) {
        _0x0_0x5a0f25['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x4f39c1,
                bin: _0x449bad
            } of SOURCES) {
        const _0x2ca2ec = _0x0_0x8f8c6b['join'](LIB_DIR, _0x4f39c1);
        const _0x41e946 = _0x0_0x8f8c6b['join'](BIN_DIR, _0x449bad);
        if (!_0x0_0x5a0f25['existsSync'](_0x2ca2ec)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x2ca2ec);
            continue;
        }
        if (_0x0_0x5a0f25['existsSync'](_0x41e946)) {
            const _0x4add67 = _0x0_0x5a0f25['statSync'](_0x2ca2ec)['mtimeMs'];
            const _0x222848 = _0x0_0x5a0f25['statSync'](_0x41e946)['mtimeMs'];
            if (_0x222848 >= _0x4add67) {
                console['log']('[compile]\x20' + _0x449bad + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x4f39c1 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x41e946 + '\x22\x20\x22' + _0x2ca2ec + '\x22', { 'timeout': 0x7530 });
            _0x0_0x5a0f25['chmodSync'](_0x41e946, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x449bad + '\x20compiled');
        } catch (_0xcfc6c8) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x4f39c1 + ':\x20' + (_0xcfc6c8['stderr'] || _0xcfc6c8['message']));
        }
    }
}
export function getBin(_0x3c7389) {
    return _0x0_0x8f8c6b['join'](BIN_DIR, _0x3c7389);
}