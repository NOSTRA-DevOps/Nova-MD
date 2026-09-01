import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x4d8fd4 from 'path';
import _0x0_0x24b2f2 from 'crypto';
import _0x0_0x1b6ef3 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x2fc4de from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x4d8fd4['dirname'](__filename);
const _tmp = _0x0_0x4d8fd4['join'](process['cwd'](), 'temp');
export async function sticker(_0x14f628, _0x27d8b7, _0x28b87b, _0x2a2e6b) {
    try {
        const _0x1dec75 = await fetch(_0x27d8b7);
        const _0x12dc0c = Buffer['from'](await _0x1dec75['arrayBuffer']());
        return await new Sticker(_0x12dc0c, {
            'pack': _0x0_0x2fc4de['packname'] || 'NOVA-MD',
            'author': _0x0_0x2fc4de['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x475d6e) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x475d6e);
        return null;
    }
}
export async function sticker2(_0x35e834, _0x22e833) {
    const _0x14144b = _0x22e833 || _0x35e834;
    return await new Sticker(_0x14144b, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x39e976, _0x5eedc1, _0x15de54, _0x53c719) {
    const _0x386794 = _0x5eedc1 || _0x39e976;
    return await new Sticker(_0x386794, {
        'pack': _0x15de54,
        'author': _0x53c719,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x299046, _0x1dfc8f) {
    const _0x3b86a3 = _0x1dfc8f || _0x299046;
    return await new Sticker(_0x3b86a3, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x3b9017, _0x515384, _0x5bfa0c, _0x44c6d5, _0x473f40 = [''], _0x557a1f = {}) {
    const _0x3986b1 = _0x515384 || _0x3b9017;
    return await new Sticker(_0x3986b1, {
        'pack': _0x5bfa0c || _0x0_0x2fc4de['packname'],
        'author': _0x44c6d5 || _0x0_0x2fc4de['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x473f40,
        ..._0x557a1f
    })['toBuffer']();
}
export async function sticker6(_0x4a1731, _0x22a9cb) {
    const _0x23ee4b = _0x22a9cb || _0x4a1731;
    return await new Sticker(_0x23ee4b, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x56005a, _0x11d80e, _0x2b3a16, _0x4077ad = [''], _0x143992 = {}) {
    const _0x212dcb = new _0x0_0x1b6ef3['Image']();
    const _0x567d90 = _0x0_0x24b2f2['randomBytes'](0x20)['toString']('hex');
    const _0x1b03ab = {
        'sticker-pack-id': _0x567d90,
        'sticker-pack-name': _0x11d80e,
        'sticker-pack-publisher': _0x2b3a16,
        'emojis': _0x4077ad,
        ..._0x143992
    };
    const _0x3a3012 = Buffer['from']([
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
    const _0x10536b = Buffer['from'](JSON['stringify'](_0x1b03ab), 'utf8');
    const _0x5ee3dd = Buffer['concat']([
        _0x3a3012,
        _0x10536b
    ]);
    _0x5ee3dd['writeUIntLE'](_0x10536b['length'], 0xe, 0x4);
    await _0x212dcb['load'](_0x56005a);
    _0x212dcb['exif'] = _0x5ee3dd;
    return await _0x212dcb['save'](null);
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