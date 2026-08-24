import { fileURLToPath } from 'url';
import _0x0_0x54e37f, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x17d01f from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x2278d3, _0x31f015 = [], _0x4efec3 = '', _0x324cf3 = '') {
    return new Promise(async (_0x14285e, _0x1cc5c9) => {
        try {
            const _0x2c9cc6 = _0x0_0x54e37f['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x4efec3);
            const _0x4af2e5 = _0x2c9cc6 + '.' + _0x324cf3;
            await _0x0_0x17d01f['promises']['writeFile'](_0x2c9cc6, _0x2278d3);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x2c9cc6,
                ..._0x31f015,
                _0x4af2e5
            ])['on']('error', _0x1cc5c9)['on']('close', async _0x3c0e86 => {
                try {
                    await _0x0_0x17d01f['promises']['unlink'](_0x2c9cc6);
                    if (_0x3c0e86 !== 0x0)
                        return _0x1cc5c9(_0x3c0e86);
                    _0x14285e(await _0x0_0x17d01f['promises']['readFile'](_0x4af2e5));
                    await _0x0_0x17d01f['promises']['unlink'](_0x4af2e5);
                } catch (_0x32f923) {
                    _0x1cc5c9(_0x32f923);
                }
            });
        } catch (_0x10fbd7) {
            _0x1cc5c9(_0x10fbd7);
        }
    });
}
function toAudio(_0x5d8037, _0x4c83f4) {
    return ffmpeg(_0x5d8037, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x4c83f4, 'mp3');
}
function toPTT(_0x368612, _0x1d192a) {
    return ffmpeg(_0x368612, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x1d192a, 'opus');
}
function toVideo(_0x23d023, _0x55312a) {
    return ffmpeg(_0x23d023, [
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
    ], _0x55312a, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};