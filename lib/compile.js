import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x1a689d from 'fs';
import _0x0_0x368e22 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x368e22['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x368e22['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x1a689d['existsSync'](BIN_DIR)) {
        _0x0_0x1a689d['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x5e2e17,
                bin: _0x2dfc29
            } of SOURCES) {
        const _0xb569ed = _0x0_0x368e22['join'](LIB_DIR, _0x5e2e17);
        const _0x2545a6 = _0x0_0x368e22['join'](BIN_DIR, _0x2dfc29);
        if (!_0x0_0x1a689d['existsSync'](_0xb569ed)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0xb569ed);
            continue;
        }
        if (_0x0_0x1a689d['existsSync'](_0x2545a6)) {
            const _0xa330c9 = _0x0_0x1a689d['statSync'](_0xb569ed)['mtimeMs'];
            const _0x26b57b = _0x0_0x1a689d['statSync'](_0x2545a6)['mtimeMs'];
            if (_0x26b57b >= _0xa330c9) {
                console['log']('[compile]\x20' + _0x2dfc29 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x5e2e17 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x2545a6 + '\x22\x20\x22' + _0xb569ed + '\x22', { 'timeout': 0x7530 });
            _0x0_0x1a689d['chmodSync'](_0x2545a6, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x2dfc29 + '\x20compiled');
        } catch (_0x3df01c) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x5e2e17 + ':\x20' + (_0x3df01c['stderr'] || _0x3df01c['message']));
        }
    }
}
export function getBin(_0x25c077) {
    return _0x0_0x368e22['join'](BIN_DIR, _0x25c077);
}