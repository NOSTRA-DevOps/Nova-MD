import { fileURLToPath } from 'url';
import _0x0_0x895bbf, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x272813 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x763638, _0x343050 = [], _0x19da45 = '', _0x4cbded = '') {
    return new Promise(async (_0x4921e6, _0x30ee58) => {
        try {
            const _0x3f0807 = _0x0_0x895bbf['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x19da45);
            const _0x56bdbc = _0x3f0807 + '.' + _0x4cbded;
            await _0x0_0x272813['promises']['writeFile'](_0x3f0807, _0x763638);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x3f0807,
                ..._0x343050,
                _0x56bdbc
            ])['on']('error', _0x30ee58)['on']('close', async _0x19acee => {
                try {
                    await _0x0_0x272813['promises']['unlink'](_0x3f0807);
                    if (_0x19acee !== 0x0)
                        return _0x30ee58(_0x19acee);
                    _0x4921e6(await _0x0_0x272813['promises']['readFile'](_0x56bdbc));
                    await _0x0_0x272813['promises']['unlink'](_0x56bdbc);
                } catch (_0x699d8d) {
                    _0x30ee58(_0x699d8d);
                }
            });
        } catch (_0x1c790f) {
            _0x30ee58(_0x1c790f);
        }
    });
}
function toAudio(_0x473555, _0x100100) {
    return ffmpeg(_0x473555, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x100100, 'mp3');
}
function toPTT(_0x123050, _0x357c0c) {
    return ffmpeg(_0x123050, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x357c0c, 'opus');
}
function toVideo(_0x409e85, _0x37578a) {
    return ffmpeg(_0x409e85, [
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
    ], _0x37578a, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};