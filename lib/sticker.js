import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x3aecfe from 'path';
import _0x0_0x5f1ef3 from 'crypto';
import _0x0_0x53f252 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x7d80 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x3aecfe['dirname'](__filename);
const _tmp = _0x0_0x3aecfe['join'](process['cwd'](), 'temp');
export async function sticker(_0x176dbe, _0x5379d3, _0x4df9bd, _0x5f5323) {
    try {
        const _0x413c3c = await fetch(_0x5379d3);
        const _0x297b2d = Buffer['from'](await _0x413c3c['arrayBuffer']());
        return await new Sticker(_0x297b2d, {
            'pack': _0x0_0x7d80['packname'] || 'NOVA-MD',
            'author': _0x0_0x7d80['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x5e5b80) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x5e5b80);
        return null;
    }
}
export async function sticker2(_0x51808e, _0x43798a) {
    const _0x4fefd3 = _0x43798a || _0x51808e;
    return await new Sticker(_0x4fefd3, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x424d42, _0x2adb7e, _0x564b15, _0x1d5304) {
    const _0x44e10d = _0x2adb7e || _0x424d42;
    return await new Sticker(_0x44e10d, {
        'pack': _0x564b15,
        'author': _0x1d5304,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x53000d, _0x403780) {
    const _0x5bc45e = _0x403780 || _0x53000d;
    return await new Sticker(_0x5bc45e, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0xf358f4, _0xc66425, _0x4bba91, _0x122fe7, _0x52b31c = [''], _0x23768e = {}) {
    const _0x476513 = _0xc66425 || _0xf358f4;
    return await new Sticker(_0x476513, {
        'pack': _0x4bba91 || _0x0_0x7d80['packname'],
        'author': _0x122fe7 || _0x0_0x7d80['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x52b31c,
        ..._0x23768e
    })['toBuffer']();
}
export async function sticker6(_0x447b33, _0x882461) {
    const _0x245ccc = _0x882461 || _0x447b33;
    return await new Sticker(_0x245ccc, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0xdf2b0, _0x35f092, _0x2dff7c, _0x117328 = [''], _0x1be635 = {}) {
    const _0xba5bef = new _0x0_0x53f252['Image']();
    const _0x9d36b0 = _0x0_0x5f1ef3['randomBytes'](0x20)['toString']('hex');
    const _0x260692 = {
        'sticker-pack-id': _0x9d36b0,
        'sticker-pack-name': _0x35f092,
        'sticker-pack-publisher': _0x2dff7c,
        'emojis': _0x117328,
        ..._0x1be635
    };
    const _0x1ed0ca = Buffer['from']([
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
    const _0x20146e = Buffer['from'](JSON['stringify'](_0x260692), 'utf8');
    const _0x44c228 = Buffer['concat']([
        _0x1ed0ca,
        _0x20146e
    ]);
    _0x44c228['writeUIntLE'](_0x20146e['length'], 0xe, 0x4);
    await _0xba5bef['load'](_0xdf2b0);
    _0xba5bef['exif'] = _0x44c228;
    return await _0xba5bef['save'](null);
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