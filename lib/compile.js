import { exec } from 'child_process';
import { promisify } from 'util';
import _0x0_0xeadc92 from 'fs';
import _0x0_0x3bed5e from 'path';
const execAsync = promisify(exec);
const LIB_DIR = _0x0_0x3bed5e['join'](process['cwd'](), 'lib');
const BIN_DIR = _0x0_0x3bed5e['join'](LIB_DIR, 'bin');
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
    if (!_0x0_0xeadc92['existsSync'](BIN_DIR)) {
        _0x0_0xeadc92['mkdirSync'](BIN_DIR, { 'recursive': !![] });
    }
    for (const {
                src: _0xa2146c,
                bin: _0x32936c
            } of SOURCES) {
        const _0x3d4b03 = _0x0_0x3bed5e['join'](LIB_DIR, _0xa2146c);
        const _0x24dd8c = _0x0_0x3bed5e['join'](BIN_DIR, _0x32936c);
        if (!_0x0_0xeadc92['existsSync'](_0x3d4b03)) {
            console['warn']('[compile]\x20Source\x20not\x20found:\x20' + _0x3d4b03);
            continue;
        }
        if (_0x0_0xeadc92['existsSync'](_0x24dd8c)) {
            const _0x4623d2 = _0x0_0xeadc92['statSync'](_0x3d4b03)['mtimeMs'];
            const _0x4562f7 = _0x0_0xeadc92['statSync'](_0x24dd8c)['mtimeMs'];
            if (_0x4562f7 >= _0x4623d2) {
                console['log']('[compile]\x20' + _0x32936c + '\x20up\x20to\x20date');
                continue;
            }
        }
        try {
            console['log']('[compile]\x20Compiling\x20' + _0xa2146c + '...');
            await execAsync('g++\x20-O2\x20-std=c++17\x20-o\x20\x22' + _0x24dd8c + '\x22\x20\x22' + _0x3d4b03 + '\x22', { 'timeout': 0x7530 });
            _0x0_0xeadc92['chmodSync'](_0x24dd8c, 0x1ed);
            console['log']('[compile]\x20✓\x20' + _0x32936c + '\x20compiled');
        } catch (_0x570e28) {
            console['error']('[compile]\x20✗\x20Failed\x20to\x20compile\x20' + _0xa2146c + ':\x20' + (_0x570e28['stderr'] || _0x570e28['message']));
        }
    }
}
export function getBin(_0x1e89bb) {
    return _0x0_0x3bed5e['join'](BIN_DIR, _0x1e89bb);
}