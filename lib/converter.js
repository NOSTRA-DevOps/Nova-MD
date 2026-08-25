import { fileURLToPath } from 'url';
import _0x0_0x538b14, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x283f3c from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x421d80, _0x2ba8ed = [], _0x521db2 = '', _0xbc2071 = '') {
    return new Promise(async (_0x3427ac, _0x4e00b1) => {
        try {
            const _0x312188 = _0x0_0x538b14['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x521db2);
            const _0x2d9f49 = _0x312188 + '.' + _0xbc2071;
            await _0x0_0x283f3c['promises']['writeFile'](_0x312188, _0x421d80);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x312188,
                ..._0x2ba8ed,
                _0x2d9f49
            ])['on']('error', _0x4e00b1)['on']('close', async _0x4bb899 => {
                try {
                    await _0x0_0x283f3c['promises']['unlink'](_0x312188);
                    if (_0x4bb899 !== 0x0)
                        return _0x4e00b1(_0x4bb899);
                    _0x3427ac(await _0x0_0x283f3c['promises']['readFile'](_0x2d9f49));
                    await _0x0_0x283f3c['promises']['unlink'](_0x2d9f49);
                } catch (_0x42adf5) {
                    _0x4e00b1(_0x42adf5);
                }
            });
        } catch (_0x4bb8ce) {
            _0x4e00b1(_0x4bb8ce);
        }
    });
}
function toAudio(_0x314859, _0x2d7376) {
    return ffmpeg(_0x314859, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x2d7376, 'mp3');
}
function toPTT(_0x5d3c74, _0x205c96) {
    return ffmpeg(_0x5d3c74, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x205c96, 'opus');
}
function toVideo(_0x4d9d87, _0x2f85a6) {
    return ffmpeg(_0x4d9d87, [
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
    ], _0x2f85a6, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};