import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x326c64 from 'path';
import _0x0_0x45f4c5 from 'crypto';
import _0x0_0x5b34fb from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x305282 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x326c64['dirname'](__filename);
const _tmp = _0x0_0x326c64['join'](process['cwd'](), 'temp');
export async function sticker(_0xed80a7, _0x22770d, _0x2c5c7e, _0x507f97) {
    try {
        const _0x204307 = await fetch(_0x22770d);
        const _0x5f496d = Buffer['from'](await _0x204307['arrayBuffer']());
        return await new Sticker(_0x5f496d, {
            'pack': _0x0_0x305282['packname'] || 'NOVA-MD',
            'author': _0x0_0x305282['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x901a77) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x901a77);
        return null;
    }
}
export async function sticker2(_0x56ad65, _0x2081b) {
    const _0x2567ca = _0x2081b || _0x56ad65;
    return await new Sticker(_0x2567ca, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x4c9004, _0x4594d0, _0xa1166d, _0x1a966a) {
    const _0x4377f5 = _0x4594d0 || _0x4c9004;
    return await new Sticker(_0x4377f5, {
        'pack': _0xa1166d,
        'author': _0x1a966a,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0xeb4c99, _0x92b164) {
    const _0x50de7f = _0x92b164 || _0xeb4c99;
    return await new Sticker(_0x50de7f, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x480de7, _0x121f0f, _0xd72ca3, _0x537321, _0x5bc4be = [''], _0x37fa2a = {}) {
    const _0x75f3a4 = _0x121f0f || _0x480de7;
    return await new Sticker(_0x75f3a4, {
        'pack': _0xd72ca3 || _0x0_0x305282['packname'],
        'author': _0x537321 || _0x0_0x305282['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x5bc4be,
        ..._0x37fa2a
    })['toBuffer']();
}
export async function sticker6(_0xa54899, _0x2f5780) {
    const _0x273f1c = _0x2f5780 || _0xa54899;
    return await new Sticker(_0x273f1c, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x5daa74, _0x330efd, _0x2e0bc5, _0x482301 = [''], _0x4c7a32 = {}) {
    const _0x13506d = new _0x0_0x5b34fb['Image']();
    const _0x56bf4f = _0x0_0x45f4c5['randomBytes'](0x20)['toString']('hex');
    const _0x122413 = {
        'sticker-pack-id': _0x56bf4f,
        'sticker-pack-name': _0x330efd,
        'sticker-pack-publisher': _0x2e0bc5,
        'emojis': _0x482301,
        ..._0x4c7a32
    };
    const _0x1dad3f = Buffer['from']([
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
    const _0x2b669b = Buffer['from'](JSON['stringify'](_0x122413), 'utf8');
    const _0x4a10f2 = Buffer['concat']([
        _0x1dad3f,
        _0x2b669b
    ]);
    _0x4a10f2['writeUIntLE'](_0x2b669b['length'], 0xe, 0x4);
    await _0x13506d['load'](_0x5daa74);
    _0x13506d['exif'] = _0x4a10f2;
    return await _0x13506d['save'](null);
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