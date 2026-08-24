import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x29d34a from 'fs';
import _0x0_0x2a43a7 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x2a43a7['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x2a43a7['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x29d34a['existsSync'](BIN_DIR)) {
        _0x0_0x29d34a['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x431965,
                bin: _0x57b22e
            } of SOURCES) {
        const _0x360cf6 = _0x0_0x2a43a7['join'](LIB_DIR, _0x431965);
        const _0xb9fe27 = _0x0_0x2a43a7['join'](BIN_DIR, _0x57b22e);
        if (!_0x0_0x29d34a['existsSync'](_0x360cf6)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x360cf6);
            continue;
        }
        if (_0x0_0x29d34a['existsSync'](_0xb9fe27)) {
            const _0x951d7b = _0x0_0x29d34a['statSync'](_0x360cf6)['mtimeMs'];
            const _0x20e4b4 = _0x0_0x29d34a['statSync'](_0xb9fe27)['mtimeMs'];
            if (_0x20e4b4 >= _0x951d7b) {
                console['log']('[compile]\x20' + _0x57b22e + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x431965 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0xb9fe27 + '\x22\x20\x22' + _0x360cf6 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x29d34a['chmodSync'](_0xb9fe27, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x57b22e + '\x20compiled');
        } catch (_0x588c68) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x431965 + ':\x20' + (_0x588c68['stderr'] || _0x588c68['message']));
        }
    }
}
export function getBin(_0x210d64) {
    return _0x0_0x2a43a7['join'](BIN_DIR, _0x210d64);
}