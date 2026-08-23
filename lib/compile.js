import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x53758b from 'fs';
import _0x0_0x1404c2 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x1404c2['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x1404c2['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x53758b['existsSync'](BIN_DIR)) {
        _0x0_0x53758b['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x21cdd7,
                bin: _0xc74f3f
            } of SOURCES) {
        const _0x51ce4f = _0x0_0x1404c2['join'](LIB_DIR, _0x21cdd7);
        const _0x68ad1f = _0x0_0x1404c2['join'](BIN_DIR, _0xc74f3f);
        if (!_0x0_0x53758b['existsSync'](_0x51ce4f)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x51ce4f);
            continue;
        }
        if (_0x0_0x53758b['existsSync'](_0x68ad1f)) {
            const _0x2344e1 = _0x0_0x53758b['statSync'](_0x51ce4f)['mtimeMs'];
            const _0x144978 = _0x0_0x53758b['statSync'](_0x68ad1f)['mtimeMs'];
            if (_0x144978 >= _0x2344e1) {
                console['log']('[compile]\x20' + _0xc74f3f + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x21cdd7 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x68ad1f + '\x22\x20\x22' + _0x51ce4f + '\x22', { 'timeout': 0x7530 });
            _0x0_0x53758b['chmodSync'](_0x68ad1f, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0xc74f3f + '\x20compiled');
        } catch (_0x199bbd) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x21cdd7 + ':\x20' + (_0x199bbd['stderr'] || _0x199bbd['message']));
        }
    }
}
export function getBin(_0x3638fd) {
    return _0x0_0x1404c2['join'](BIN_DIR, _0x3638fd);
}