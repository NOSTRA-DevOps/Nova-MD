import { fileURLToPath } from 'url';
import _0x0_0x4323d7, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2ae7d5 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x34f85e, _0x3ecea8 = [], _0x260f0b = '', _0x209083 = '') {
    return new Promise(async (_0x4f0669, _0x25db82) => {
        try {
            const _0xea5f57 = _0x0_0x4323d7['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x260f0b);
            const _0x123367 = _0xea5f57 + '.' + _0x209083;
            await _0x0_0x2ae7d5['promises']['writeFile'](_0xea5f57, _0x34f85e);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0xea5f57,
                ..._0x3ecea8,
                _0x123367
            ])['on']('error', _0x25db82)['on']('close', async _0x3bea0c => {
                try {
                    await _0x0_0x2ae7d5['promises']['unlink'](_0xea5f57);
                    if (_0x3bea0c !== 0x0)
                        return _0x25db82(_0x3bea0c);
                    _0x4f0669(await _0x0_0x2ae7d5['promises']['readFile'](_0x123367));
                    await _0x0_0x2ae7d5['promises']['unlink'](_0x123367);
                } catch (_0x454d31) {
                    _0x25db82(_0x454d31);
                }
            });
        } catch (_0x52f3de) {
            _0x25db82(_0x52f3de);
        }
    });
}
function toAudio(_0x15cb81, _0x3ff80e) {
    return ffmpeg(_0x15cb81, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x3ff80e, 'mp3');
}
function toPTT(_0x34829a, _0x41ad51) {
    return ffmpeg(_0x34829a, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x41ad51, 'opus');
}
function toVideo(_0x3b77c9, _0x42d297) {
    return ffmpeg(_0x3b77c9, [
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
    ], _0x42d297, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};