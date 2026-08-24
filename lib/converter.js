import { fileURLToPath } from 'url';
import _0x0_0x4dae68, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4391e8 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x7c1532, _0x304835 = [], _0x4473e2 = '', _0x4dfc6b = '') {
    return new Promise(async (_0x390a64, _0x37a05b) => {
        try {
            const _0x1bfb70 = _0x0_0x4dae68['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x4473e2);
            const _0x39628f = _0x1bfb70 + '.' + _0x4dfc6b;
            await _0x0_0x4391e8['promises']['writeFile'](_0x1bfb70, _0x7c1532);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x1bfb70,
                ..._0x304835,
                _0x39628f
            ])['on']('error', _0x37a05b)['on']('close', async _0x11bc0c => {
                try {
                    await _0x0_0x4391e8['promises']['unlink'](_0x1bfb70);
                    if (_0x11bc0c !== 0x0)
                        return _0x37a05b(_0x11bc0c);
                    _0x390a64(await _0x0_0x4391e8['promises']['readFile'](_0x39628f));
                    await _0x0_0x4391e8['promises']['unlink'](_0x39628f);
                } catch (_0xa4fa27) {
                    _0x37a05b(_0xa4fa27);
                }
            });
        } catch (_0x57ce30) {
            _0x37a05b(_0x57ce30);
        }
    });
}
function toAudio(_0xbcc461, _0x1fecd9) {
    return ffmpeg(_0xbcc461, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x1fecd9, 'mp3');
}
function toPTT(_0x5e6d0c, _0x420156) {
    return ffmpeg(_0x5e6d0c, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x420156, 'opus');
}
function toVideo(_0x3c935c, _0x66bfb4) {
    return ffmpeg(_0x3c935c, [
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
    ], _0x66bfb4, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};