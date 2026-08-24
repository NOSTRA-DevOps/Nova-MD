import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0x1c12a5 from 'fs';
import _0x0_0x476035 from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x476035['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x476035['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0x1c12a5['existsSync'](BIN_DIR)) {
        _0x0_0x1c12a5['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0x1e2250,
                bin: _0x3399c9
            } of SOURCES) {
        const _0x521d10 = _0x0_0x476035['join'](LIB_DIR, _0x1e2250);
        const _0x5cc8fe = _0x0_0x476035['join'](BIN_DIR, _0x3399c9);
        if (!_0x0_0x1c12a5['existsSync'](_0x521d10)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x521d10);
            continue;
        }
        if (_0x0_0x1c12a5['existsSync'](_0x5cc8fe)) {
            const _0x53ce6a = _0x0_0x1c12a5['statSync'](_0x521d10)['mtimeMs'];
            const _0x32ad21 = _0x0_0x1c12a5['statSync'](_0x5cc8fe)['mtimeMs'];
            if (_0x32ad21 >= _0x53ce6a) {
                console['log']('[compile]\x20' + _0x3399c9 + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0x1e2250 + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x5cc8fe + '\x22\x20\x22' + _0x521d10 + '\x22', { 'timeout': 0x7530 });
            _0x0_0x1c12a5['chmodSync'](_0x5cc8fe, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x3399c9 + '\x20compiled');
        } catch (_0x4fbeaa) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0x1e2250 + ':\x20' + (_0x4fbeaa['stderr'] || _0x4fbeaa['message']));
        }
    }
}
export function getBin(_0x503f81) {
    return _0x0_0x476035['join'](BIN_DIR, _0x503f81);
}