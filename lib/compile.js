import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x12d782 from 'fs';
import _0x0_0xab0a4b from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0xab0a4b['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0xab0a4b['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x12d782['existsSync'](BIN_DIR)) {
        _0x0_0x12d782['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x42408a,
                bin: _0x2f351e
            } of SOURCES) {
        const _0x3be2fb = _0x0_0xab0a4b['join'](LIB_DIR, _0x42408a);
        const _0x55e07b = _0x0_0xab0a4b['join'](BIN_DIR, _0x2f351e);
        if (!_0x0_0x12d782['existsSync'](_0x3be2fb)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x3be2fb);
            continue;
        }
        if (_0x0_0x12d782['existsSync'](_0x55e07b)) {
            const _0x25ce0d = _0x0_0x12d782['statSync'](_0x3be2fb)['mtimeMs'];
            const _0x333a27 = _0x0_0x12d782['statSync'](_0x55e07b)['mtimeMs'];
            if (_0x333a27 >= _0x25ce0d) {
                console['log']('[compile]\x20' + _0x2f351e + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x42408a + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x55e07b + '\x22\x20\x22' + _0x3be2fb + '\x22', { 'timeout': 0x7530 });
            _0x0_0x12d782['chmodSync'](_0x55e07b, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x2f351e + '\x20compiled');
        } catch (_0x5bb87e) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x42408a + ':\x20' + (_0x5bb87e['stderr'] || _0x5bb87e['message']));
        }
    }
}
export function getBin(_0x2d7a90) {
    return _0x0_0xab0a4b['join'](BIN_DIR, _0x2d7a90);
}