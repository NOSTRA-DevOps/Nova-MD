import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x31ec0d from 'path';
import _0x0_0x299a02 from 'crypto';
import _0x0_0x2d3f11 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x24a590 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x31ec0d['dirname'](__filename);
const _tmp = _0x0_0x31ec0d['join'](process['cwd'](), 'temp');
export async function sticker(_0x752f68, _0x147ef3, _0x5717c2, _0x336cdc) {
    try {
        const _0x572194 = await fetch(_0x147ef3);
        const _0x44f476 = Buffer['from'](await _0x572194['arrayBuffer']());
        return await new Sticker(_0x44f476, {
            'pack': _0x0_0x24a590['packname'] || 'NOVA-MD',
            'author': _0x0_0x24a590['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0xd3ec5) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0xd3ec5);
        return null;
    }
}
export async function sticker2(_0x3e6c02, _0x1eb646) {
    const _0x3d9302 = _0x1eb646 || _0x3e6c02;
    return await new Sticker(_0x3d9302, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x40ace6, _0x54d8cb, _0x5c3e23, _0x496912) {
    const _0x207da8 = _0x54d8cb || _0x40ace6;
    return await new Sticker(_0x207da8, {
        'pack': _0x5c3e23,
        'author': _0x496912,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x232689, _0x1aaa38) {
    const _0x5afd5d = _0x1aaa38 || _0x232689;
    return await new Sticker(_0x5afd5d, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x4b02b6, _0x1f8235, _0x293d41, _0x234a92, _0x5f1e36 = [''], _0x4f91b6 = {}) {
    const _0x963ac2 = _0x1f8235 || _0x4b02b6;
    return await new Sticker(_0x963ac2, {
        'pack': _0x293d41 || _0x0_0x24a590['packname'],
        'author': _0x234a92 || _0x0_0x24a590['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x5f1e36,
        ..._0x4f91b6
    })['toBuffer']();
}
export async function sticker6(_0x1b797b, _0x5a0948) {
    const _0x198adc = _0x5a0948 || _0x1b797b;
    return await new Sticker(_0x198adc, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x373111, _0x2ccd4d, _0x2f46d6, _0x1a553e = [''], _0x3dba91 = {}) {
    const _0x27dec2 = new _0x0_0x2d3f11['Image']();
    const _0x3f4172 = _0x0_0x299a02['randomBytes'](0x20)['toString']('hex');
    const _0x2c6f5a = {
        'sticker-pack-id': _0x3f4172,
        'sticker-pack-name': _0x2ccd4d,
        'sticker-pack-publisher': _0x2f46d6,
        'emojis': _0x1a553e,
        ..._0x3dba91
    };
    const _0x3ce881 = Buffer['from']([
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
    const _0x2d11af = Buffer['from'](JSON['stringify'](_0x2c6f5a), 'utf8');
    const _0xe5eb4b = Buffer['concat']([
        _0x3ce881,
        _0x2d11af
    ]);
    _0xe5eb4b['writeUIntLE'](_0x2d11af['length'], 0xe, 0x4);
    await _0x27dec2['load'](_0x373111);
    _0x27dec2['exif'] = _0xe5eb4b;
    return await _0x27dec2['save'](null);
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