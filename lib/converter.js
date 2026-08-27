import { fileURLToPath } from 'url';
import _0x0_0x20b5ca, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1a6a67 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x16fb73, _0x557970 = [], _0x36e3bf = '', _0x5f0527 = '') {
    return new Promise(async (_0x56e8ed, _0x169a20) => {
        try {
            const _0x6196c1 = _0x0_0x20b5ca['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x36e3bf);
            const _0xf321e2 = _0x6196c1 + '.' + _0x5f0527;
            await _0x0_0x1a6a67['promises']['writeFile'](_0x6196c1, _0x16fb73);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x6196c1,
                ..._0x557970,
                _0xf321e2
            ])['on']('error', _0x169a20)['on']('close', async _0x1955cc => {
                try {
                    await _0x0_0x1a6a67['promises']['unlink'](_0x6196c1);
                    if (_0x1955cc !== 0x0)
                        return _0x169a20(_0x1955cc);
                    _0x56e8ed(await _0x0_0x1a6a67['promises']['readFile'](_0xf321e2));
                    await _0x0_0x1a6a67['promises']['unlink'](_0xf321e2);
                } catch (_0x6e7596) {
                    _0x169a20(_0x6e7596);
                }
            });
        } catch (_0x10088f) {
            _0x169a20(_0x10088f);
        }
    });
}
function toAudio(_0x4cb02e, _0x3d68b8) {
    return ffmpeg(_0x4cb02e, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x3d68b8, 'mp3');
}
function toPTT(_0x56b304, _0x540205) {
    return ffmpeg(_0x56b304, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x540205, 'opus');
}
function toVideo(_0x4a96f4, _0x271ba3) {
    return ffmpeg(_0x4a96f4, [
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
    ], _0x271ba3, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};