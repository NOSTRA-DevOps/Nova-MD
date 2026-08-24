import { fileURLToPath } from 'url';
import _0x0_0x4aec65, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x275836 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x13b48d, _0x42eb88 = [], _0x494bd1 = '', _0x192335 = '') {
    return new Promise(async (_0x2e0527, _0x2d2dd1) => {
        try {
            const _0x221af3 = _0x0_0x4aec65['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x494bd1);
            const _0x56b46b = _0x221af3 + '.' + _0x192335;
            await _0x0_0x275836['promises']['writeFile'](_0x221af3, _0x13b48d);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x221af3,
                ..._0x42eb88,
                _0x56b46b
            ])['on']('error', _0x2d2dd1)['on']('close', async _0xaa125e => {
                try {
                    await _0x0_0x275836['promises']['unlink'](_0x221af3);
                    if (_0xaa125e !== 0x0)
                        return _0x2d2dd1(_0xaa125e);
                    _0x2e0527(await _0x0_0x275836['promises']['readFile'](_0x56b46b));
                    await _0x0_0x275836['promises']['unlink'](_0x56b46b);
                } catch (_0x103d6c) {
                    _0x2d2dd1(_0x103d6c);
                }
            });
        } catch (_0x112460) {
            _0x2d2dd1(_0x112460);
        }
    });
}
function toAudio(_0x41356b, _0x51b842) {
    return ffmpeg(_0x41356b, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x51b842, 'mp3');
}
function toPTT(_0x1d7510, _0x5ef016) {
    return ffmpeg(_0x1d7510, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x5ef016, 'opus');
}
function toVideo(_0x25f446, _0x555c3b) {
    return ffmpeg(_0x25f446, [
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
    ], _0x555c3b, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};