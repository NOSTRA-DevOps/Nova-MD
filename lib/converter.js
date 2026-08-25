import { fileURLToPath } from 'url';
import _0x0_0x2010dc, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5a7b4f from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x161969, _0x547417 = [], _0x16b792 = '', _0x27a6dc = '') {
    return new Promise(async (_0x57bcc1, _0x27b0f9) => {
        try {
            const _0x22f8a3 = _0x0_0x2010dc['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x16b792);
            const _0x50188f = _0x22f8a3 + '.' + _0x27a6dc;
            await _0x0_0x5a7b4f['promises']['writeFile'](_0x22f8a3, _0x161969);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x22f8a3,
                ..._0x547417,
                _0x50188f
            ])['on']('error', _0x27b0f9)['on']('close', async _0x2f131c => {
                try {
                    await _0x0_0x5a7b4f['promises']['unlink'](_0x22f8a3);
                    if (_0x2f131c !== 0x0)
                        return _0x27b0f9(_0x2f131c);
                    _0x57bcc1(await _0x0_0x5a7b4f['promises']['readFile'](_0x50188f));
                    await _0x0_0x5a7b4f['promises']['unlink'](_0x50188f);
                } catch (_0x44a93d) {
                    _0x27b0f9(_0x44a93d);
                }
            });
        } catch (_0x5810da) {
            _0x27b0f9(_0x5810da);
        }
    });
}
function toAudio(_0x4ef066, _0x21ac35) {
    return ffmpeg(_0x4ef066, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x21ac35, 'mp3');
}
function toPTT(_0x20607d, _0x3bd7f1) {
    return ffmpeg(_0x20607d, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x3bd7f1, 'opus');
}
function toVideo(_0x324a35, _0x1dbf1c) {
    return ffmpeg(_0x324a35, [
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
    ], _0x1dbf1c, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};