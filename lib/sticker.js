import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x486ca1 from 'path';
import _0x0_0x2ce230 from 'crypto';
import _0x0_0x4ae109 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x4bc576 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x486ca1['dirname'](__filename);
const _tmp = _0x0_0x486ca1['join'](process['cwd'](), 'temp');
export async function sticker(_0x3fa716, _0x1b3ade, _0x4e43bf, _0x8cd7bf) {
    try {
        const _0x3f560e = await fetch(_0x1b3ade);
        const _0x45c610 = Buffer['from'](await _0x3f560e['arrayBuffer']());
        return await new Sticker(_0x45c610, {
            'pack': _0x0_0x4bc576['packname'] || 'NOVA-MD',
            'author': _0x0_0x4bc576['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x5211fd) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x5211fd);
        return null;
    }
}
export async function sticker2(_0x51f222, _0x1e9922) {
    const _0x5842e0 = _0x1e9922 || _0x51f222;
    return await new Sticker(_0x5842e0, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x318cd8, _0x22e48a, _0x43a882, _0x476e33) {
    const _0x4e3282 = _0x22e48a || _0x318cd8;
    return await new Sticker(_0x4e3282, {
        'pack': _0x43a882,
        'author': _0x476e33,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x45757a, _0x2757e7) {
    const _0x1f3a6c = _0x2757e7 || _0x45757a;
    return await new Sticker(_0x1f3a6c, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x389e80, _0x4878b4, _0x4451aa, _0xcb922a, _0x2593b2 = [''], _0x471a53 = {}) {
    const _0x4afe90 = _0x4878b4 || _0x389e80;
    return await new Sticker(_0x4afe90, {
        'pack': _0x4451aa || _0x0_0x4bc576['packname'],
        'author': _0xcb922a || _0x0_0x4bc576['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x2593b2,
        ..._0x471a53
    })['toBuffer']();
}
export async function sticker6(_0x17a0aa, _0x5bf403) {
    const _0x287c83 = _0x5bf403 || _0x17a0aa;
    return await new Sticker(_0x287c83, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x4cc42e, _0x2386ff, _0x134cf2, _0x2eea1d = [''], _0x531f4b = {}) {
    const _0x1189ba = new _0x0_0x4ae109['Image']();
    const _0x1a8b69 = _0x0_0x2ce230['randomBytes'](0x20)['toString']('hex');
    const _0x3e501a = {
        'sticker-pack-id': _0x1a8b69,
        'sticker-pack-name': _0x2386ff,
        'sticker-pack-publisher': _0x134cf2,
        'emojis': _0x2eea1d,
        ..._0x531f4b
    };
    const _0x38eddf = Buffer['from']([
        0x49,
        0x49,
        0x2a,
        0x0,
        0x8,
        0x0,
        0x0,
        0x0,
        0x1,
        0x0,
        0x41,
        0x57,
        0x7,
        0x0,
        0x0,
        0x0,
        0x0,
        0x0,
        0x16,
        0x0,
        0x0,
        0x0
    ]);
    const _0x1b3670 = Buffer['from'](JSON['stringify'](_0x3e501a), 'utf8');
    const _0x1270c0 = Buffer['concat']([
        _0x38eddf,
        _0x1b3670
    ]);
    _0x1270c0['writeUIntLE'](_0x1b3670['length'], 0xe, 0x4);
    await _0x1189ba['load'](_0x4cc42e);
    _0x1189ba['exif'] = _0x1270c0;
    return await _0x1189ba['save'](null);
}
export const support = {
    'ffmpeg': !![],
    'ffprobe': !![],
    'ffmpegWebp': !![],
    'convert': !![],
    'magick': ![],
    'gm': ![],
    'find': ![]
};