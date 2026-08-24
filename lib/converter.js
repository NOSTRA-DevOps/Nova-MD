import { fileURLToPath } from 'url';
import _0x0_0x1f3f80, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x790c63 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x4b74b5, _0xa52253 = [], _0x358a59 = '', _0x385074 = '') {
    return new Promise(async (_0x1e8107, _0x4ab307) => {
        try {
            const _0x15e040 = _0x0_0x1f3f80['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x358a59);
            const _0x14ab4e = _0x15e040 + '.' + _0x385074;
            await _0x0_0x790c63['promises']['writeFile'](_0x15e040, _0x4b74b5);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x15e040,
                ..._0xa52253,
                _0x14ab4e
            ])['on']('error', _0x4ab307)['on']('close', async _0x369fe9 => {
                try {
                    await _0x0_0x790c63['promises']['unlink'](_0x15e040);
                    if (_0x369fe9 !== 0x0)
                        return _0x4ab307(_0x369fe9);
                    _0x1e8107(await _0x0_0x790c63['promises']['readFile'](_0x14ab4e));
                    await _0x0_0x790c63['promises']['unlink'](_0x14ab4e);
                } catch (_0x5c158e) {
                    _0x4ab307(_0x5c158e);
                }
            });
        } catch (_0x383fa7) {
            _0x4ab307(_0x383fa7);
        }
    });
}
function toAudio(_0x675759, _0x1ae421) {
    return ffmpeg(_0x675759, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x1ae421, 'mp3');
}
function toPTT(_0x32ed49, _0x5c31f) {
    return ffmpeg(_0x32ed49, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x5c31f, 'opus');
}
function toVideo(_0x1b9280, _0x1da126) {
    return ffmpeg(_0x1b9280, [
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
    ], _0x1da126, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};