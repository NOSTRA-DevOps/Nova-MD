import { fileURLToPath } from 'url';
import _0x0_0x3fa8da, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4cb60a from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x444cee, _0x7b799f = [], _0x24fc8c = '', _0x131176 = '') {
    return new Promise(async (_0x4f4526, _0x223b30) => {
        try {
            const _0x95c4b6 = _0x0_0x3fa8da['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x24fc8c);
            const _0x4c1ad6 = _0x95c4b6 + '.' + _0x131176;
            await _0x0_0x4cb60a['promises']['writeFile'](_0x95c4b6, _0x444cee);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x95c4b6,
                ..._0x7b799f,
                _0x4c1ad6
            ])['on']('error', _0x223b30)['on']('close', async _0x1411af => {
                try {
                    await _0x0_0x4cb60a['promises']['unlink'](_0x95c4b6);
                    if (_0x1411af !== 0x0)
                        return _0x223b30(_0x1411af);
                    _0x4f4526(await _0x0_0x4cb60a['promises']['readFile'](_0x4c1ad6));
                    await _0x0_0x4cb60a['promises']['unlink'](_0x4c1ad6);
                } catch (_0x2a33c1) {
                    _0x223b30(_0x2a33c1);
                }
            });
        } catch (_0x23ca4f) {
            _0x223b30(_0x23ca4f);
        }
    });
}
function toAudio(_0x4754fa, _0x4727ae) {
    return ffmpeg(_0x4754fa, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x4727ae, 'mp3');
}
function toPTT(_0x48479c, _0x530627) {
    return ffmpeg(_0x48479c, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x530627, 'opus');
}
function toVideo(_0x3c9560, _0xca1294) {
    return ffmpeg(_0x3c9560, [
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
    ], _0xca1294, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};