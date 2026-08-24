import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x3bd299 from 'path';
import _0x0_0x4d5808 from 'crypto';
import _0x0_0x1725ae from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x210d3d from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x3bd299['dirname'](__filename);
const _tmp = _0x0_0x3bd299['join'](process['cwd'](), 'temp');
export async function sticker(_0x372b8a, _0x49ee52, _0x50cec2, _0x4650c7) {
    try {
        const _0x4cb56f = await fetch(_0x49ee52);
        const _0x422a42 = Buffer['from'](await _0x4cb56f['arrayBuffer']());
        return await new Sticker(_0x422a42, {
            'pack': _0x0_0x210d3d['packname'] || 'NOVA-MD',
            'author': _0x0_0x210d3d['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0xb97f23) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0xb97f23);
        return null;
    }
}
export async function sticker2(_0x3bc927, _0x22fefb) {
    const _0x1cfb32 = _0x22fefb || _0x3bc927;
    return await new Sticker(_0x1cfb32, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x59fdb8, _0x4bea9d, _0x5bc7fc, _0x4a6011) {
    const _0x4f4129 = _0x4bea9d || _0x59fdb8;
    return await new Sticker(_0x4f4129, {
        'pack': _0x5bc7fc,
        'author': _0x4a6011,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x1edfb6, _0x5b3bae) {
    const _0x490f91 = _0x5b3bae || _0x1edfb6;
    return await new Sticker(_0x490f91, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x57c5ec, _0x34c460, _0x17cd3c, _0x28023a, _0x52b36c = [''], _0x559c35 = {}) {
    const _0x23ce09 = _0x34c460 || _0x57c5ec;
    return await new Sticker(_0x23ce09, {
        'pack': _0x17cd3c || _0x0_0x210d3d['packname'],
        'author': _0x28023a || _0x0_0x210d3d['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x52b36c,
        ..._0x559c35
    })['toBuffer']();
}
export async function sticker6(_0x1db2f6, _0x19309d) {
    const _0x2e5eff = _0x19309d || _0x1db2f6;
    return await new Sticker(_0x2e5eff, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x2ba9a0, _0x27b4d0, _0x1d7378, _0x553bed = [''], _0x1e9568 = {}) {
    const _0x4e37ac = new _0x0_0x1725ae['Image']();
    const _0x2de963 = _0x0_0x4d5808['randomBytes'](0x20)['toString']('hex');
    const _0x2e8817 = {
        'sticker-pack-id': _0x2de963,
        'sticker-pack-name': _0x27b4d0,
        'sticker-pack-publisher': _0x1d7378,
        'emojis': _0x553bed,
        ..._0x1e9568
    };
    const _0x35ce03 = Buffer['from']([
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
    const _0x59b607 = Buffer['from'](JSON['stringify'](_0x2e8817), 'utf8');
    const _0x3a1568 = Buffer['concat']([
        _0x35ce03,
        _0x59b607
    ]);
    _0x3a1568['writeUIntLE'](_0x59b607['length'], 0xe, 0x4);
    await _0x4e37ac['load'](_0x2ba9a0);
    _0x4e37ac['exif'] = _0x3a1568;
    return await _0x4e37ac['save'](null);
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