import { fileURLToPath } from 'url';
import _0x0_0x3efa95, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x570bfa from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x144962, _0x3a4da7 = [], _0x36a3fc = '', _0x270300 = '') {
    return new Promise(async (_0x2a2f62, _0x527914) => {
        try {
            const _0x5ef433 = _0x0_0x3efa95['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x36a3fc);
            const _0x31e6c7 = _0x5ef433 + '.' + _0x270300;
            await _0x0_0x570bfa['promises']['writeFile'](_0x5ef433, _0x144962);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x5ef433,
                ..._0x3a4da7,
                _0x31e6c7
            ])['on']('error', _0x527914)['on']('close', async _0x5b6194 => {
                try {
                    await _0x0_0x570bfa['promises']['unlink'](_0x5ef433);
                    if (_0x5b6194 !== 0x0)
                        return _0x527914(_0x5b6194);
                    _0x2a2f62(await _0x0_0x570bfa['promises']['readFile'](_0x31e6c7));
                    await _0x0_0x570bfa['promises']['unlink'](_0x31e6c7);
                } catch (_0x4172e4) {
                    _0x527914(_0x4172e4);
                }
            });
        } catch (_0x5a6751) {
            _0x527914(_0x5a6751);
        }
    });
}
function toAudio(_0x4c6370, _0x4cdb67) {
    return ffmpeg(_0x4c6370, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x4cdb67, 'mp3');
}
function toPTT(_0x373a8e, _0xb13d5d) {
    return ffmpeg(_0x373a8e, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0xb13d5d, 'opus');
}
function toVideo(_0x685c35, _0x1fe019) {
    return ffmpeg(_0x685c35, [
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
    ], _0x1fe019, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};