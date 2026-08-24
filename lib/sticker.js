import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x36ca3c from 'path';
import _0x0_0x10e7f0 from 'crypto';
import _0x0_0x1a4922 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0xd67908 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x36ca3c['dirname'](__filename);
const _tmp = _0x0_0x36ca3c['join'](process['cwd'](), 'temp');
export async function sticker(_0x354c10, _0xb33865, _0x1e39c1, _0x268f30) {
    try {
        const _0x166d4d = await fetch(_0xb33865);
        const _0x35a9d4 = Buffer['from'](await _0x166d4d['arrayBuffer']());
        return await new Sticker(_0x35a9d4, {
            'pack': _0x0_0xd67908['packname'] || 'NOVA-MD',
            'author': _0x0_0xd67908['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x1469eb) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x1469eb);
        return null;
    }
}
export async function sticker2(_0x3ac729, _0x57a744) {
    const _0x12c048 = _0x57a744 || _0x3ac729;
    return await new Sticker(_0x12c048, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x2091d5, _0x3d086e, _0xa8ec9d, _0xbbab56) {
    const _0x302174 = _0x3d086e || _0x2091d5;
    return await new Sticker(_0x302174, {
        'pack': _0xa8ec9d,
        'author': _0xbbab56,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x3e0fea, _0x4241c7) {
    const _0x1e2163 = _0x4241c7 || _0x3e0fea;
    return await new Sticker(_0x1e2163, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x28ab59, _0x38592c, _0x2bd957, _0x507e5a, _0x599393 = [''], _0x576b97 = {}) {
    const _0x4ec92a = _0x38592c || _0x28ab59;
    return await new Sticker(_0x4ec92a, {
        'pack': _0x2bd957 || _0x0_0xd67908['packname'],
        'author': _0x507e5a || _0x0_0xd67908['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x599393,
        ..._0x576b97
    })['toBuffer']();
}
export async function sticker6(_0x1c0d8e, _0x5a5564) {
    const _0x267376 = _0x5a5564 || _0x1c0d8e;
    return await new Sticker(_0x267376, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x3f132b, _0x53b6da, _0x3ed064, _0x1ff2af = [''], _0x212aa0 = {}) {
    const _0x387b70 = new _0x0_0x1a4922['Image']();
    const _0x2c755a = _0x0_0x10e7f0['randomBytes'](0x20)['toString']('hex');
    const _0x282cac = {
        'sticker-pack-id': _0x2c755a,
        'sticker-pack-name': _0x53b6da,
        'sticker-pack-publisher': _0x3ed064,
        'emojis': _0x1ff2af,
        ..._0x212aa0
    };
    const _0x2eb3a2 = Buffer['from']([
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
    const _0xfd2697 = Buffer['from'](JSON['stringify'](_0x282cac), 'utf8');
    const _0x21ebba = Buffer['concat']([
        _0x2eb3a2,
        _0xfd2697
    ]);
    _0x21ebba['writeUIntLE'](_0xfd2697['length'], 0xe, 0x4);
    await _0x387b70['load'](_0x3f132b);
    _0x387b70['exif'] = _0x21ebba;
    return await _0x387b70['save'](null);
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