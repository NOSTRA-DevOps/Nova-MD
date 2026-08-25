import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x1b5138 from 'path';
import _0x0_0x18a601 from 'crypto';
import _0x0_0xf3c3e3 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x3839d6 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x1b5138['dirname'](__filename);
const _tmp = _0x0_0x1b5138['join'](process['cwd'](), 'temp');
export async function sticker(_0x22fb34, _0x1c72e7, _0x14b9f4, _0xc0ac8) {
    try {
        const _0xe1935f = await fetch(_0x1c72e7);
        const _0x2c73dc = Buffer['from'](await _0xe1935f['arrayBuffer']());
        return await new Sticker(_0x2c73dc, {
            'pack': _0x0_0x3839d6['packname'] || 'NOVA-MD',
            'author': _0x0_0x3839d6['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x402db9) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x402db9);
        return null;
    }
}
export async function sticker2(_0x49ecdb, _0x2fe333) {
    const _0x17ea9a = _0x2fe333 || _0x49ecdb;
    return await new Sticker(_0x17ea9a, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x4ca9f2, _0x3d9487, _0x4da2a3, _0x12f74c) {
    const _0x2f8f01 = _0x3d9487 || _0x4ca9f2;
    return await new Sticker(_0x2f8f01, {
        'pack': _0x4da2a3,
        'author': _0x12f74c,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x5c4157, _0x5aca44) {
    const _0x2283e8 = _0x5aca44 || _0x5c4157;
    return await new Sticker(_0x2283e8, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x5965a7, _0x4a20b3, _0x1a820c, _0x2db373, _0xb3c41d = [''], _0x35d23a = {}) {
    const _0x5d349f = _0x4a20b3 || _0x5965a7;
    return await new Sticker(_0x5d349f, {
        'pack': _0x1a820c || _0x0_0x3839d6['packname'],
        'author': _0x2db373 || _0x0_0x3839d6['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0xb3c41d,
        ..._0x35d23a
    })['toBuffer']();
}
export async function sticker6(_0x3f1aa8, _0x30eb9c) {
    const _0x5c9301 = _0x30eb9c || _0x3f1aa8;
    return await new Sticker(_0x5c9301, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x1106c4, _0x291bbe, _0x4500d6, _0x28ae04 = [''], _0xaebc0f = {}) {
    const _0x1effb6 = new _0x0_0xf3c3e3['Image']();
    const _0x2cb3f1 = _0x0_0x18a601['randomBytes'](0x20)['toString']('hex');
    const _0x1d23b4 = {
        'sticker-pack-id': _0x2cb3f1,
        'sticker-pack-name': _0x291bbe,
        'sticker-pack-publisher': _0x4500d6,
        'emojis': _0x28ae04,
        ..._0xaebc0f
    };
    const _0x30cdca = Buffer['from']([
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
    const _0x1127fb = Buffer['from'](JSON['stringify'](_0x1d23b4), 'utf8');
    const _0x2455b4 = Buffer['concat']([
        _0x30cdca,
        _0x1127fb
    ]);
    _0x2455b4['writeUIntLE'](_0x1127fb['length'], 0xe, 0x4);
    await _0x1effb6['load'](_0x1106c4);
    _0x1effb6['exif'] = _0x2455b4;
    return await _0x1effb6['save'](null);
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