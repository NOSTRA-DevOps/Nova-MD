import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x4afc76 from 'fs';
import _0x0_0xb9788d from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0xb9788d['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0xb9788d['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x4afc76['existsSync'](BIN_DIR)) {
        _0x0_0x4afc76['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x5dfb76,
                bin: _0xe82a04
            } of SOURCES) {
        const _0x11d11c = _0x0_0xb9788d['join'](LIB_DIR, _0x5dfb76);
        const _0x2c5ad9 = _0x0_0xb9788d['join'](BIN_DIR, _0xe82a04);
        if (!_0x0_0x4afc76['existsSync'](_0x11d11c)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x11d11c);
            continue;
        }
        if (_0x0_0x4afc76['existsSync'](_0x2c5ad9)) {
            const _0x4bc4b3 = _0x0_0x4afc76['statSync'](_0x11d11c)['mtimeMs'];
            const _0x5aeac1 = _0x0_0x4afc76['statSync'](_0x2c5ad9)['mtimeMs'];
            if (_0x5aeac1 >= _0x4bc4b3) {
                console['log']('[compile]\x20' + _0xe82a04 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x5dfb76 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x2c5ad9 + '\x22\x20\x22' + _0x11d11c + '\x22', { 'timeout': 0x7530 });
            _0x0_0x4afc76['chmodSync'](_0x2c5ad9, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0xe82a04 + '\x20compiled');
        } catch (_0x5bd879) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x5dfb76 + ':\x20' + (_0x5bd879['stderr'] || _0x5bd879['message']));
        }
    }
}
export function getBin(_0x2402d5) {
    return _0x0_0xb9788d['join'](BIN_DIR, _0x2402d5);
}