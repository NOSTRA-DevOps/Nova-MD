import { fileURLToPath } from 'url';
import _0x0_0x56da37, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3af1eb from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x11f0de, _0x93b58 = [], _0x4c4e53 = '', _0x2a4f22 = '') {
    return new Promise(async (_0xa20b9e, _0x2c2b45) => {
        try {
            const _0x39d6d8 = _0x0_0x56da37['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x4c4e53);
            const _0x341902 = _0x39d6d8 + '.' + _0x2a4f22;
            await _0x0_0x3af1eb['promises']['writeFile'](_0x39d6d8, _0x11f0de);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x39d6d8,
                ..._0x93b58,
                _0x341902
            ])['on']('error', _0x2c2b45)['on']('close', async _0x1e90c => {
                try {
                    await _0x0_0x3af1eb['promises']['unlink'](_0x39d6d8);
                    if (_0x1e90c !== 0x0)
                        return _0x2c2b45(_0x1e90c);
                    _0xa20b9e(await _0x0_0x3af1eb['promises']['readFile'](_0x341902));
                    await _0x0_0x3af1eb['promises']['unlink'](_0x341902);
                } catch (_0x428bb7) {
                    _0x2c2b45(_0x428bb7);
                }
            });
        } catch (_0x5de24c) {
            _0x2c2b45(_0x5de24c);
        }
    });
}
function toAudio(_0x2cc396, _0x4df3fd) {
    return ffmpeg(_0x2cc396, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x4df3fd, 'mp3');
}
function toPTT(_0x36652f, _0xcc3a8f) {
    return ffmpeg(_0x36652f, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0xcc3a8f, 'opus');
}
function toVideo(_0x4394e0, _0xab7fd1) {
    return ffmpeg(_0x4394e0, [
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
    ], _0xab7fd1, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};