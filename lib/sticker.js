import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x347539 from 'path';
import _0x0_0x1a2e03 from 'crypto';
import _0x0_0x396330 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x507d03 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x347539['dirname'](__filename);
const _tmp = _0x0_0x347539['join'](process['cwd'](), 'temp');
export async function sticker(_0x190566, _0x45006f, _0x529e3c, _0x50ab95) {
    try {
        const _0x4f0bbe = await fetch(_0x45006f);
        const _0x4048d6 = Buffer['from'](await _0x4f0bbe['arrayBuffer']());
        return await new Sticker(_0x4048d6, {
            'pack': _0x0_0x507d03['packname'] || 'NOVA-MD',
            'author': _0x0_0x507d03['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x2b4b71) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x2b4b71);
        return null;
    }
}
export async function sticker2(_0x27ba3f, _0x159267) {
    const _0x103b6a = _0x159267 || _0x27ba3f;
    return await new Sticker(_0x103b6a, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x49997f, _0x1d3646, _0x4e4402, _0x1a42d1) {
    const _0x522169 = _0x1d3646 || _0x49997f;
    return await new Sticker(_0x522169, {
        'pack': _0x4e4402,
        'author': _0x1a42d1,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x46e868, _0x177786) {
    const _0x402ea6 = _0x177786 || _0x46e868;
    return await new Sticker(_0x402ea6, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x5f3d86, _0xbd7e29, _0xafb26a, _0x4c68ed, _0x27e14a = [''], _0x5c0edf = {}) {
    const _0x537abe = _0xbd7e29 || _0x5f3d86;
    return await new Sticker(_0x537abe, {
        'pack': _0xafb26a || _0x0_0x507d03['packname'],
        'author': _0x4c68ed || _0x0_0x507d03['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x27e14a,
        ..._0x5c0edf
    })['toBuffer']();
}
export async function sticker6(_0x23d989, _0x23c769) {
    const _0x4f7172 = _0x23c769 || _0x23d989;
    return await new Sticker(_0x4f7172, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x6854b2, _0x2673ae, _0x13baa8, _0x170fc5 = [''], _0x348fb4 = {}) {
    const _0x45d27d = new _0x0_0x396330['Image']();
    const _0x5d8ad1 = _0x0_0x1a2e03['randomBytes'](0x20)['toString']('hex');
    const _0x3faf1f = {
        'sticker-pack-id': _0x5d8ad1,
        'sticker-pack-name': _0x2673ae,
        'sticker-pack-publisher': _0x13baa8,
        'emojis': _0x170fc5,
        ..._0x348fb4
    };
    const _0x3b6f6b = Buffer['from']([
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
    const _0x8aebdd = Buffer['from'](JSON['stringify'](_0x3faf1f), 'utf8');
    const _0x2b21f9 = Buffer['concat']([
        _0x3b6f6b,
        _0x8aebdd
    ]);
    _0x2b21f9['writeUIntLE'](_0x8aebdd['length'], 0xe, 0x4);
    await _0x45d27d['load'](_0x6854b2);
    _0x45d27d['exif'] = _0x2b21f9;
    return await _0x45d27d['save'](null);
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