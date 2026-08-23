import { fileURLToPath } from 'url';
import _0x0_0x4633b2, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x38b23c from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x3b78fa, _0x507ed4 = [], _0x5690f4 = '', _0x2b6b1f = '') {
    return new Promise(async (_0x469c37, _0x52d0e5) => {
        try {
            const _0xff4f89 = _0x0_0x4633b2['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x5690f4);
            const _0x33bd04 = _0xff4f89 + '.' + _0x2b6b1f;
            await _0x0_0x38b23c['promises']['writeFile'](_0xff4f89, _0x3b78fa);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0xff4f89,
                ..._0x507ed4,
                _0x33bd04
            ])['on']('error', _0x52d0e5)['on']('close', async _0x589636 => {
                try {
                    await _0x0_0x38b23c['promises']['unlink'](_0xff4f89);
                    if (_0x589636 !== 0x0)
                        return _0x52d0e5(_0x589636);
                    _0x469c37(await _0x0_0x38b23c['promises']['readFile'](_0x33bd04));
                    await _0x0_0x38b23c['promises']['unlink'](_0x33bd04);
                } catch (_0x4113e6) {
                    _0x52d0e5(_0x4113e6);
                }
            });
        } catch (_0x4edde7) {
            _0x52d0e5(_0x4edde7);
        }
    });
}
function toAudio(_0x2f4e15, _0x49edc9) {
    return ffmpeg(_0x2f4e15, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x49edc9, 'mp3');
}
function toPTT(_0x159b78, _0x1560aa) {
    return ffmpeg(_0x159b78, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x1560aa, 'opus');
}
function toVideo(_0x975de5, _0x43193a) {
    return ffmpeg(_0x975de5, [
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
    ], _0x43193a, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};