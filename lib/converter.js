import { fileURLToPath } from 'url';
import _0x0_0x5eaea0, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3e80bc from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x2d0692, _0x15bd10 = [], _0x4eb512 = '', _0x1d234f = '') {
    return new Promise(async (_0x1e1384, _0x1fe993) => {
        try {
            const _0x423683 = _0x0_0x5eaea0['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x4eb512);
            const _0x1c823f = _0x423683 + '.' + _0x1d234f;
            await _0x0_0x3e80bc['promises']['writeFile'](_0x423683, _0x2d0692);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x423683,
                ..._0x15bd10,
                _0x1c823f
            ])['on']('error', _0x1fe993)['on']('close', async _0x3ec727 => {
                try {
                    await _0x0_0x3e80bc['promises']['unlink'](_0x423683);
                    if (_0x3ec727 !== 0x0)
                        return _0x1fe993(_0x3ec727);
                    _0x1e1384(await _0x0_0x3e80bc['promises']['readFile'](_0x1c823f));
                    await _0x0_0x3e80bc['promises']['unlink'](_0x1c823f);
                } catch (_0x63769e) {
                    _0x1fe993(_0x63769e);
                }
            });
        } catch (_0x4df8dd) {
            _0x1fe993(_0x4df8dd);
        }
    });
}
function toAudio(_0xbc1893, _0x1141bf) {
    return ffmpeg(_0xbc1893, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x1141bf, 'mp3');
}
function toPTT(_0x13ffee, _0x2377c7) {
    return ffmpeg(_0x13ffee, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x2377c7, 'opus');
}
function toVideo(_0x51d7a1, _0x13ceab) {
    return ffmpeg(_0x51d7a1, [
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
    ], _0x13ceab, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};