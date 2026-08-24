import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x29f4ba from 'path';
import _0x0_0x541bd7 from 'crypto';
import _0x0_0x36c5c0 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x288b31 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x29f4ba['dirname'](__filename);
const _tmp = _0x0_0x29f4ba['join'](process['cwd'](), 'temp');
export async function sticker(_0x349717, _0x51ec2f, _0xa01113, _0x306534) {
    try {
        const _0x24ee3e = await fetch(_0x51ec2f);
        const _0x582cc3 = Buffer['from'](await _0x24ee3e['arrayBuffer']());
        return await new Sticker(_0x582cc3, {
            'pack': _0x0_0x288b31['packname'] || 'NOVA-MD',
            'author': _0x0_0x288b31['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x12e25d) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x12e25d);
        return null;
    }
}
export async function sticker2(_0x5c80c5, _0x5993ba) {
    const _0xef033 = _0x5993ba || _0x5c80c5;
    return await new Sticker(_0xef033, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x789355, _0x177e98, _0x2fd635, _0x3ab3e8) {
    const _0x4c4243 = _0x177e98 || _0x789355;
    return await new Sticker(_0x4c4243, {
        'pack': _0x2fd635,
        'author': _0x3ab3e8,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x59ab36, _0x146cdc) {
    const _0x4e9323 = _0x146cdc || _0x59ab36;
    return await new Sticker(_0x4e9323, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x36a68f, _0x4a5ae9, _0x1b58c6, _0x425b27, _0x2c9426 = [''], _0x51f723 = {}) {
    const _0x15bd3b = _0x4a5ae9 || _0x36a68f;
    return await new Sticker(_0x15bd3b, {
        'pack': _0x1b58c6 || _0x0_0x288b31['packname'],
        'author': _0x425b27 || _0x0_0x288b31['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x2c9426,
        ..._0x51f723
    })['toBuffer']();
}
export async function sticker6(_0xc4d389, _0x1d4fed) {
    const _0x3dad83 = _0x1d4fed || _0xc4d389;
    return await new Sticker(_0x3dad83, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x426a4f, _0x3ae4c0, _0x342b9d, _0x4e346c = [''], _0x36b787 = {}) {
    const _0x14b101 = new _0x0_0x36c5c0['Image']();
    const _0x19d13b = _0x0_0x541bd7['randomBytes'](0x20)['toString']('hex');
    const _0x10a7cf = {
        'sticker-pack-id': _0x19d13b,
        'sticker-pack-name': _0x3ae4c0,
        'sticker-pack-publisher': _0x342b9d,
        'emojis': _0x4e346c,
        ..._0x36b787
    };
    const _0x128a5a = Buffer['from']([
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
    const _0x2f594c = Buffer['from'](JSON['stringify'](_0x10a7cf), 'utf8');
    const _0x10452c = Buffer['concat']([
        _0x128a5a,
        _0x2f594c
    ]);
    _0x10452c['writeUIntLE'](_0x2f594c['length'], 0xe, 0x4);
    await _0x14b101['load'](_0x426a4f);
    _0x14b101['exif'] = _0x10452c;
    return await _0x14b101['save'](null);
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