import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x3f61e9 from 'path';
import _0x0_0x54e17a from 'crypto';
import _0x0_0x5ac3ee from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x1d8d44 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x3f61e9['dirname'](__filename);
const _tmp = _0x0_0x3f61e9['join'](process['cwd'](), 'temp');
export async function sticker(_0x3fd04b, _0x57594f, _0x52a6c6, _0x49c8b4) {
    try {
        const _0x28ce85 = await fetch(_0x57594f);
        const _0x43643d = Buffer['from'](await _0x28ce85['arrayBuffer']());
        return await new Sticker(_0x43643d, {
            'pack': _0x0_0x1d8d44['packname'] || 'NOVA-MD',
            'author': _0x0_0x1d8d44['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x5a94a7) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x5a94a7);
        return null;
    }
}
export async function sticker2(_0x89340e, _0x1447bd) {
    const _0x2595f6 = _0x1447bd || _0x89340e;
    return await new Sticker(_0x2595f6, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x1cbc70, _0x162643, _0x194e8c, _0x2512ce) {
    const _0x276297 = _0x162643 || _0x1cbc70;
    return await new Sticker(_0x276297, {
        'pack': _0x194e8c,
        'author': _0x2512ce,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x3972e8, _0x170a83) {
    const _0x232958 = _0x170a83 || _0x3972e8;
    return await new Sticker(_0x232958, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x59fc4d, _0x1a11c8, _0x1c5655, _0x5dd3d1, _0x4429d3 = [''], _0x552116 = {}) {
    const _0x34f613 = _0x1a11c8 || _0x59fc4d;
    return await new Sticker(_0x34f613, {
        'pack': _0x1c5655 || _0x0_0x1d8d44['packname'],
        'author': _0x5dd3d1 || _0x0_0x1d8d44['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x4429d3,
        ..._0x552116
    })['toBuffer']();
}
export async function sticker6(_0x52dd10, _0x17ef81) {
    const _0x5a535a = _0x17ef81 || _0x52dd10;
    return await new Sticker(_0x5a535a, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x80be88, _0x4bc8b5, _0x43564b, _0x1c783f = [''], _0x3c1be8 = {}) {
    const _0x358b2f = new _0x0_0x5ac3ee['Image']();
    const _0x32a18c = _0x0_0x54e17a['randomBytes'](0x20)['toString']('hex');
    const _0x22c351 = {
        'sticker-pack-id': _0x32a18c,
        'sticker-pack-name': _0x4bc8b5,
        'sticker-pack-publisher': _0x43564b,
        'emojis': _0x1c783f,
        ..._0x3c1be8
    };
    const _0x213b5b = Buffer['from']([
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
    const _0x5badc8 = Buffer['from'](JSON['stringify'](_0x22c351), 'utf8');
    const _0x3687a0 = Buffer['concat']([
        _0x213b5b,
        _0x5badc8
    ]);
    _0x3687a0['writeUIntLE'](_0x5badc8['length'], 0xe, 0x4);
    await _0x358b2f['load'](_0x80be88);
    _0x358b2f['exif'] = _0x3687a0;
    return await _0x358b2f['save'](null);
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