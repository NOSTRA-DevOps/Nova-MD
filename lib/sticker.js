import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x51bec8 from 'path';
import _0x0_0x82f33f from 'crypto';
import _0x0_0x5d3b75 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x4b40c3 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x51bec8['dirname'](__filename);
const _tmp = _0x0_0x51bec8['join'](process['cwd'](), 'temp');
export async function sticker(_0x938fec, _0x30b79d, _0x17de39, _0x3b71d8) {
    try {
        const _0x1a1e06 = await fetch(_0x30b79d);
        const _0x37b599 = Buffer['from'](await _0x1a1e06['arrayBuffer']());
        return await new Sticker(_0x37b599, {
            'pack': _0x0_0x4b40c3['packname'] || 'NOVA-MD',
            'author': _0x0_0x4b40c3['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x971184) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x971184);
        return null;
    }
}
export async function sticker2(_0x137ffe, _0x10bc6b) {
    const _0xa6ac03 = _0x10bc6b || _0x137ffe;
    return await new Sticker(_0xa6ac03, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x2ef2ca, _0x48fe72, _0x27d5fc, _0x231cca) {
    const _0x1d6cf1 = _0x48fe72 || _0x2ef2ca;
    return await new Sticker(_0x1d6cf1, {
        'pack': _0x27d5fc,
        'author': _0x231cca,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x3161a7, _0x25eabb) {
    const _0x58e062 = _0x25eabb || _0x3161a7;
    return await new Sticker(_0x58e062, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x36f3f2, _0x54ed34, _0x147f90, _0x2022fb, _0x225293 = [''], _0x2cc1f5 = {}) {
    const _0xb172f5 = _0x54ed34 || _0x36f3f2;
    return await new Sticker(_0xb172f5, {
        'pack': _0x147f90 || _0x0_0x4b40c3['packname'],
        'author': _0x2022fb || _0x0_0x4b40c3['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x225293,
        ..._0x2cc1f5
    })['toBuffer']();
}
export async function sticker6(_0x541093, _0x381bfa) {
    const _0x541267 = _0x381bfa || _0x541093;
    return await new Sticker(_0x541267, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x3d6b5d, _0x597336, _0x13169b, _0x23bbb5 = [''], _0x484d84 = {}) {
    const _0xea57df = new _0x0_0x5d3b75['Image']();
    const _0x2d8db2 = _0x0_0x82f33f['randomBytes'](0x20)['toString']('hex');
    const _0x52af59 = {
        'sticker-pack-id': _0x2d8db2,
        'sticker-pack-name': _0x597336,
        'sticker-pack-publisher': _0x13169b,
        'emojis': _0x23bbb5,
        ..._0x484d84
    };
    const _0x26da02 = Buffer['from']([
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
    const _0x26daf1 = Buffer['from'](JSON['stringify'](_0x52af59), 'utf8');
    const _0x250925 = Buffer['concat']([
        _0x26da02,
        _0x26daf1
    ]);
    _0x250925['writeUIntLE'](_0x26daf1['length'], 0xe, 0x4);
    await _0xea57df['load'](_0x3d6b5d);
    _0xea57df['exif'] = _0x250925;
    return await _0xea57df['save'](null);
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