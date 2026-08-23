import { fileURLToPath } from 'url';
import _0x0_0x4b211d, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5dcd83 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x475c00, _0x2f9d96 = [], _0xc34a60 = '', _0x1abfc3 = '') {
    return new Promise(async (_0x26721a, _0x302bbc) => {
        try {
            const _0x115748 = _0x0_0x4b211d['join'](process['cwd'](), 'temp', +new Date() + '.' + _0xc34a60);
            const _0x4c7c7e = _0x115748 + '.' + _0x1abfc3;
            await _0x0_0x5dcd83['promises']['writeFile'](_0x115748, _0x475c00);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x115748,
                ..._0x2f9d96,
                _0x4c7c7e
            ])['on']('error', _0x302bbc)['on']('close', async _0x4fab37 => {
                try {
                    await _0x0_0x5dcd83['promises']['unlink'](_0x115748);
                    if (_0x4fab37 !== 0x0)
                        return _0x302bbc(_0x4fab37);
                    _0x26721a(await _0x0_0x5dcd83['promises']['readFile'](_0x4c7c7e));
                    await _0x0_0x5dcd83['promises']['unlink'](_0x4c7c7e);
                } catch (_0x3f43b8) {
                    _0x302bbc(_0x3f43b8);
                }
            });
        } catch (_0x4fe000) {
            _0x302bbc(_0x4fe000);
        }
    });
}
function toAudio(_0x5a8ac9, _0x26ea2e) {
    return ffmpeg(_0x5a8ac9, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x26ea2e, 'mp3');
}
function toPTT(_0x38cf69, _0x2e62e3) {
    return ffmpeg(_0x38cf69, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x2e62e3, 'opus');
}
function toVideo(_0x172110, _0x478172) {
    return ffmpeg(_0x172110, [
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
    ], _0x478172, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};