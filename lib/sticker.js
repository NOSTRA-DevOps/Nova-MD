import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x5a86b3 from 'path';
import _0x0_0x3f08a2 from 'crypto';
import _0x0_0x4293bb from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x2a94a8 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x5a86b3['dirname'](__filename);
const _tmp = _0x0_0x5a86b3['join'](process['cwd'](), 'temp');
export async function sticker(_0x4e113f, _0x14b066, _0xd33702, _0x3a2ef7) {
    try {
        const _0x40c609 = await fetch(_0x14b066);
        const _0x174621 = Buffer['from'](await _0x40c609['arrayBuffer']());
        return await new Sticker(_0x174621, {
            'pack': _0x0_0x2a94a8['packname'] || 'NOVA-MD',
            'author': _0x0_0x2a94a8['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x4941c7) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x4941c7);
        return null;
    }
}
export async function sticker2(_0x316de6, _0x379891) {
    const _0x560094 = _0x379891 || _0x316de6;
    return await new Sticker(_0x560094, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x5f4b19, _0x298bb8, _0x3644d1, _0x430067) {
    const _0x33d767 = _0x298bb8 || _0x5f4b19;
    return await new Sticker(_0x33d767, {
        'pack': _0x3644d1,
        'author': _0x430067,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x4ce73d, _0xff3dd1) {
    const _0x32223d = _0xff3dd1 || _0x4ce73d;
    return await new Sticker(_0x32223d, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x7b3c48, _0x22c049, _0x3e8c26, _0xf8eb66, _0x2811a5 = [''], _0x56326e = {}) {
    const _0x1f3a7d = _0x22c049 || _0x7b3c48;
    return await new Sticker(_0x1f3a7d, {
        'pack': _0x3e8c26 || _0x0_0x2a94a8['packname'],
        'author': _0xf8eb66 || _0x0_0x2a94a8['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x2811a5,
        ..._0x56326e
    })['toBuffer']();
}
export async function sticker6(_0x11e2b7, _0x4a5b90) {
    const _0x3bed86 = _0x4a5b90 || _0x11e2b7;
    return await new Sticker(_0x3bed86, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x1a56c4, _0x419418, _0x3417ac, _0x3c9369 = [''], _0x357723 = {}) {
    const _0x2fe796 = new _0x0_0x4293bb['Image']();
    const _0x5a7e01 = _0x0_0x3f08a2['randomBytes'](0x20)['toString']('hex');
    const _0x1953e3 = {
        'sticker-pack-id': _0x5a7e01,
        'sticker-pack-name': _0x419418,
        'sticker-pack-publisher': _0x3417ac,
        'emojis': _0x3c9369,
        ..._0x357723
    };
    const _0x28cd73 = Buffer['from']([
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
    const _0x5c374a = Buffer['from'](JSON['stringify'](_0x1953e3), 'utf8');
    const _0x33bcef = Buffer['concat']([
        _0x28cd73,
        _0x5c374a
    ]);
    _0x33bcef['writeUIntLE'](_0x5c374a['length'], 0xe, 0x4);
    await _0x2fe796['load'](_0x1a56c4);
    _0x2fe796['exif'] = _0x33bcef;
    return await _0x2fe796['save'](null);
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