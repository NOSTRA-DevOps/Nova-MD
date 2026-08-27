import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0xdda4e1 from 'fs';
import _0x0_0x155e33 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x155e33['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x155e33['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0xdda4e1['existsSync'](BIN_DIR)) {
        _0x0_0xdda4e1['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x33c813,
                bin: _0x366bfb
            } of SOURCES) {
        const _0x240191 = _0x0_0x155e33['join'](LIB_DIR, _0x33c813);
        const _0x48b365 = _0x0_0x155e33['join'](BIN_DIR, _0x366bfb);
        if (!_0x0_0xdda4e1['existsSync'](_0x240191)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x240191);
            continue;
        }
        if (_0x0_0xdda4e1['existsSync'](_0x48b365)) {
            const _0x2850f4 = _0x0_0xdda4e1['statSync'](_0x240191)['mtimeMs'];
            const _0x5440dc = _0x0_0xdda4e1['statSync'](_0x48b365)['mtimeMs'];
            if (_0x5440dc >= _0x2850f4) {
                console['log']('[compile]\x20' + _0x366bfb + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x33c813 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x48b365 + '\x22\x20\x22' + _0x240191 + '\x22', { 'timeout': 0x7530 });
            _0x0_0xdda4e1['chmodSync'](_0x48b365, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x366bfb + '\x20compiled');
        } catch (_0x321c33) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x33c813 + ':\x20' + (_0x321c33['stderr'] || _0x321c33['message']));
        }
    }
}
export function getBin(_0x4dbed0) {
    return _0x0_0x155e33['join'](BIN_DIR, _0x4dbed0);
}