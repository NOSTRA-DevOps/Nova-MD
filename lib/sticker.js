import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x27788f from 'path';
import _0x0_0x215f96 from 'crypto';
import _0x0_0x5d1d41 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x157aed from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x27788f['dirname'](__filename);
const _tmp = _0x0_0x27788f['join'](process['cwd'](), 'temp');
export async function sticker(_0x598fac, _0xd01bc5, _0x18053b, _0x1b9cdb) {
    try {
        const _0x336583 = await fetch(_0xd01bc5);
        const _0x47aa0f = Buffer['from'](await _0x336583['arrayBuffer']());
        return await new Sticker(_0x47aa0f, {
            'pack': _0x0_0x157aed['packname'] || 'NOVA-MD',
            'author': _0x0_0x157aed['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x3fd792) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x3fd792);
        return null;
    }
}
export async function sticker2(_0x1e1ca4, _0x2ff1be) {
    const _0x41f8ee = _0x2ff1be || _0x1e1ca4;
    return await new Sticker(_0x41f8ee, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x30613b, _0xed67d0, _0x426c76, _0x4ec342) {
    const _0x3f46e4 = _0xed67d0 || _0x30613b;
    return await new Sticker(_0x3f46e4, {
        'pack': _0x426c76,
        'author': _0x4ec342,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x101b2d, _0x550eb4) {
    const _0x4cb57f = _0x550eb4 || _0x101b2d;
    return await new Sticker(_0x4cb57f, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x2030d0, _0x391eb3, _0x260657, _0x40e2ea, _0x147881 = [''], _0x56bd78 = {}) {
    const _0x3ab0cd = _0x391eb3 || _0x2030d0;
    return await new Sticker(_0x3ab0cd, {
        'pack': _0x260657 || _0x0_0x157aed['packname'],
        'author': _0x40e2ea || _0x0_0x157aed['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x147881,
        ..._0x56bd78
    })['toBuffer']();
}
export async function sticker6(_0x127d73, _0x4f424e) {
    const _0x153adc = _0x4f424e || _0x127d73;
    return await new Sticker(_0x153adc, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x186f9a, _0x4fad48, _0x34e46e, _0x2cd931 = [''], _0x3ff3aa = {}) {
    const _0x3a4322 = new _0x0_0x5d1d41['Image']();
    const _0x3acd28 = _0x0_0x215f96['randomBytes'](0x20)['toString']('hex');
    const _0x4242c8 = {
        'sticker-pack-id': _0x3acd28,
        'sticker-pack-name': _0x4fad48,
        'sticker-pack-publisher': _0x34e46e,
        'emojis': _0x2cd931,
        ..._0x3ff3aa
    };
    const _0x42aaad = Buffer['from']([
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
    const _0x3c992f = Buffer['from'](JSON['stringify'](_0x4242c8), 'utf8');
    const _0x26ccaa = Buffer['concat']([
        _0x42aaad,
        _0x3c992f
    ]);
    _0x26ccaa['writeUIntLE'](_0x3c992f['length'], 0xe, 0x4);
    await _0x3a4322['load'](_0x186f9a);
    _0x3a4322['exif'] = _0x26ccaa;
    return await _0x3a4322['save'](null);
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