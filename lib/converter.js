import { fileURLToPath } from 'url';
import _0x0_0x5a3911, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2b254b from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x221044, _0x4fe57d = [], _0x197d35 = '', _0x4f6c53 = '') {
    return new Promise(async (_0x12f769, _0x4613b0) => {
        try {
            const _0x205d65 = _0x0_0x5a3911['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x197d35);
            const _0x45e540 = _0x205d65 + '.' + _0x4f6c53;
            await _0x0_0x2b254b['promises']['writeFile'](_0x205d65, _0x221044);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x205d65,
                ..._0x4fe57d,
                _0x45e540
            ])['on']('error', _0x4613b0)['on']('close', async _0x4357cb => {
                try {
                    await _0x0_0x2b254b['promises']['unlink'](_0x205d65);
                    if (_0x4357cb !== 0x0)
                        return _0x4613b0(_0x4357cb);
                    _0x12f769(await _0x0_0x2b254b['promises']['readFile'](_0x45e540));
                    await _0x0_0x2b254b['promises']['unlink'](_0x45e540);
                } catch (_0x6d96b1) {
                    _0x4613b0(_0x6d96b1);
                }
            });
        } catch (_0x4360de) {
            _0x4613b0(_0x4360de);
        }
    });
}
function toAudio(_0x2203c8, _0x3a182f) {
    return ffmpeg(_0x2203c8, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x3a182f, 'mp3');
}
function toPTT(_0x5b9b39, _0x5dd19e) {
    return ffmpeg(_0x5b9b39, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x5dd19e, 'opus');
}
function toVideo(_0xe5e12f, _0x410806) {
    return ffmpeg(_0xe5e12f, [
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
    ], _0x410806, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};