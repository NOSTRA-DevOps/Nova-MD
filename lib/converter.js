import { fileURLToPath } from 'url';
import _0x0_0x40bf88, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x45abb9 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x179ee3, _0x1732be = [], _0x4879bc = '', _0x4fa566 = '') {
    return new Promise(async (_0x248a0e, _0x53d5f3) => {
        try {
            const _0x2ab2d8 = _0x0_0x40bf88['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x4879bc);
            const _0x3ffc6c = _0x2ab2d8 + '.' + _0x4fa566;
            await _0x0_0x45abb9['promises']['writeFile'](_0x2ab2d8, _0x179ee3);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x2ab2d8,
                ..._0x1732be,
                _0x3ffc6c
            ])['on']('error', _0x53d5f3)['on']('close', async _0x5c437b => {
                try {
                    await _0x0_0x45abb9['promises']['unlink'](_0x2ab2d8);
                    if (_0x5c437b !== 0x0)
                        return _0x53d5f3(_0x5c437b);
                    _0x248a0e(await _0x0_0x45abb9['promises']['readFile'](_0x3ffc6c));
                    await _0x0_0x45abb9['promises']['unlink'](_0x3ffc6c);
                } catch (_0x2da435) {
                    _0x53d5f3(_0x2da435);
                }
            });
        } catch (_0x4d8a17) {
            _0x53d5f3(_0x4d8a17);
        }
    });
}
function toAudio(_0x19aa92, _0x5219c7) {
    return ffmpeg(_0x19aa92, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x5219c7, 'mp3');
}
function toPTT(_0x38e9ff, _0x244e25) {
    return ffmpeg(_0x38e9ff, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x244e25, 'opus');
}
function toVideo(_0x3006fc, _0x50b494) {
    return ffmpeg(_0x3006fc, [
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-ab',
        '128k',
        '-ar',
        '44100',
        '-crf',
        '32',
        '-preset',
        'slow'
    ], _0x50b494, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};