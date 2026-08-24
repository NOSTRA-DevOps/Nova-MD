import { fileURLToPath } from 'url';
import _0x0_0x4f8a29, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4cf0f1 from 'fs';
import { spawn } from 'child_process';
function ffmpeg(_0x139a45, _0x336125 = [], _0x5a2c8b = '', _0x3625f9 = '') {
    return new Promise(async (_0x148f62, _0x56aa1a) => {
        try {
            const _0x468d67 = _0x0_0x4f8a29['join'](process['cwd'](), 'temp', +new Date() + '.' + _0x5a2c8b);
            const _0x358be = _0x468d67 + '.' + _0x3625f9;
            await _0x0_0x4cf0f1['promises']['writeFile'](_0x468d67, _0x139a45);
            spawn('ffmpeg', [
                '-y',
                '-i',
                _0x468d67,
                ..._0x336125,
                _0x358be
            ])['on']('error', _0x56aa1a)['on']('close', async _0x3ab45b => {
                try {
                    await _0x0_0x4cf0f1['promises']['unlink'](_0x468d67);
                    if (_0x3ab45b !== 0x0)
                        return _0x56aa1a(_0x3ab45b);
                    _0x148f62(await _0x0_0x4cf0f1['promises']['readFile'](_0x358be));
                    await _0x0_0x4cf0f1['promises']['unlink'](_0x358be);
                } catch (_0x48ff6d) {
                    _0x56aa1a(_0x48ff6d);
                }
            });
        } catch (_0x24d5da) {
            _0x56aa1a(_0x24d5da);
        }
    });
}
function toAudio(_0x1e2c89, _0x841740) {
    return ffmpeg(_0x1e2c89, [
        '-vn',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        '-f',
        'mp3'
    ], _0x841740, 'mp3');
}
function toPTT(_0x4cf4a5, _0x1ef272) {
    return ffmpeg(_0x4cf4a5, [
        '-vn',
        '-c:a',
        'libopus',
        '-b:a',
        '128k',
        '-vbr',
        'on',
        '-compression_level',
        '10'
    ], _0x1ef272, 'opus');
}
function toVideo(_0x205ff9, _0x158b16) {
    return ffmpeg(_0x205ff9, [
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
    ], _0x158b16, 'mp4');
}
export {
    toAudio,
    toPTT,
    toVideo,
    ffmpeg
};