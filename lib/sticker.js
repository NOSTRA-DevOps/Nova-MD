import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x3a30ce from 'path';
import _0x0_0x14b4c6 from 'crypto';
import _0x0_0x36d99b from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x3366dd from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x3a30ce['dirname'](__filename);
const _tmp = _0x0_0x3a30ce['join'](process['cwd'](), 'temp');
export async function sticker(_0x1bce1c, _0x50762f, _0x2349cc, _0x187a97) {
    try {
        const _0x5c3454 = await fetch(_0x50762f);
        const _0x8d24d6 = Buffer['from'](await _0x5c3454['arrayBuffer']());
        return await new Sticker(_0x8d24d6, {
            'pack': _0x0_0x3366dd['packname'] || 'NOVA-MD',
            'author': _0x0_0x3366dd['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x2a3702) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x2a3702);
        return null;
    }
}
export async function sticker2(_0x5e057e, _0x1d0313) {
    const _0x2be680 = _0x1d0313 || _0x5e057e;
    return await new Sticker(_0x2be680, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x4c4def, _0x7eb046, _0x3414e2, _0xdd2ead) {
    const _0x5090bd = _0x7eb046 || _0x4c4def;
    return await new Sticker(_0x5090bd, {
        'pack': _0x3414e2,
        'author': _0xdd2ead,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x6e1340, _0x3144bb) {
    const _0x27e84d = _0x3144bb || _0x6e1340;
    return await new Sticker(_0x27e84d, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0xee0ea, _0x5c2497, _0x485335, _0x2eeaf4, _0x5cdb4e = [''], _0x5ea469 = {}) {
    const _0x2e2b87 = _0x5c2497 || _0xee0ea;
    return await new Sticker(_0x2e2b87, {
        'pack': _0x485335 || _0x0_0x3366dd['packname'],
        'author': _0x2eeaf4 || _0x0_0x3366dd['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x5cdb4e,
        ..._0x5ea469
    })['toBuffer']();
}
export async function sticker6(_0x273fea, _0x3b3fc7) {
    const _0x58df42 = _0x3b3fc7 || _0x273fea;
    return await new Sticker(_0x58df42, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x4600a9, _0x1c54f4, _0x41ef47, _0x27e785 = [''], _0x3af386 = {}) {
    const _0x5023ec = new _0x0_0x36d99b['Image']();
    const _0xfd7bf8 = _0x0_0x14b4c6['randomBytes'](0x20)['toString']('hex');
    const _0x30660f = {
        'sticker-pack-id': _0xfd7bf8,
        'sticker-pack-name': _0x1c54f4,
        'sticker-pack-publisher': _0x41ef47,
        'emojis': _0x27e785,
        ..._0x3af386
    };
    const _0xa8d1c8 = Buffer['from']([
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
    const _0x36ab36 = Buffer['from'](JSON['stringify'](_0x30660f), 'utf8');
    const _0x2f2ad8 = Buffer['concat']([
        _0xa8d1c8,
        _0x36ab36
    ]);
    _0x2f2ad8['writeUIntLE'](_0x36ab36['length'], 0xe, 0x4);
    await _0x5023ec['load'](_0x4600a9);
    _0x5023ec['exif'] = _0x2f2ad8;
    return await _0x5023ec['save'](null);
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