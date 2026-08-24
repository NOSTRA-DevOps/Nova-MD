import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x2673e9 from 'path';
import _0x0_0x3b2c8b from 'crypto';
import _0x0_0x36351e from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x4627a9 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x2673e9['dirname'](__filename);
const _tmp = _0x0_0x2673e9['join'](process['cwd'](), 'temp');
export async function sticker(_0x39bfa8, _0x450bf5, _0x8323d8, _0x3682eb) {
    try {
        const _0x58301c = await fetch(_0x450bf5);
        const _0x1eec9e = Buffer['from'](await _0x58301c['arrayBuffer']());
        return await new Sticker(_0x1eec9e, {
            'pack': _0x0_0x4627a9['packname'] || 'NOVA-MD',
            'author': _0x0_0x4627a9['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x28985f) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x28985f);
        return null;
    }
}
export async function sticker2(_0x450172, _0x1dd786) {
    const _0x41e8ae = _0x1dd786 || _0x450172;
    return await new Sticker(_0x41e8ae, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x20040c, _0x29b1d4, _0x395306, _0x4b74c3) {
    const _0x462baf = _0x29b1d4 || _0x20040c;
    return await new Sticker(_0x462baf, {
        'pack': _0x395306,
        'author': _0x4b74c3,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x3ea845, _0x510046) {
    const _0x14aad1 = _0x510046 || _0x3ea845;
    return await new Sticker(_0x14aad1, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x114174, _0x1dd805, _0x6bc5e2, _0x5eab2e, _0x23b35d = [''], _0x4f827f = {}) {
    const _0x854a37 = _0x1dd805 || _0x114174;
    return await new Sticker(_0x854a37, {
        'pack': _0x6bc5e2 || _0x0_0x4627a9['packname'],
        'author': _0x5eab2e || _0x0_0x4627a9['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x23b35d,
        ..._0x4f827f
    })['toBuffer']();
}
export async function sticker6(_0x7511b7, _0x24f80e) {
    const _0x33d482 = _0x24f80e || _0x7511b7;
    return await new Sticker(_0x33d482, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x382109, _0x3a1fd7, _0x4d3f6f, _0x37d2ba = [''], _0x267bcc = {}) {
    const _0xe17350 = new _0x0_0x36351e['Image']();
    const _0x228e8c = _0x0_0x3b2c8b['randomBytes'](0x20)['toString']('hex');
    const _0x2e5e3e = {
        'sticker-pack-id': _0x228e8c,
        'sticker-pack-name': _0x3a1fd7,
        'sticker-pack-publisher': _0x4d3f6f,
        'emojis': _0x37d2ba,
        ..._0x267bcc
    };
    const _0x38f5a3 = Buffer['from']([
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
    const _0x24953f = Buffer['from'](JSON['stringify'](_0x2e5e3e), 'utf8');
    const _0x454598 = Buffer['concat']([
        _0x38f5a3,
        _0x24953f
    ]);
    _0x454598['writeUIntLE'](_0x24953f['length'], 0xe, 0x4);
    await _0xe17350['load'](_0x382109);
    _0xe17350['exif'] = _0x454598;
    return await _0xe17350['save'](null);
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