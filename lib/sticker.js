import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x5dac6e from 'path';
import _0x0_0xf43e87 from 'crypto';
import _0x0_0x3bcdee from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x5fa0a4 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0x5dac6e['dirname'](__filename);
const _tmp = _0x0_0x5dac6e['join'](process['cwd'](), 'temp');
export async function sticker(_0x8ba2be, _0xa9778e, _0x2bf42f, _0x2c6aeb) {
    try {
        const _0x385740 = await fetch(_0xa9778e);
        const _0x5e424a = Buffer['from'](await _0x385740['arrayBuffer']());
        return await new Sticker(_0x5e424a, {
            'pack': _0x0_0x5fa0a4['packname'] || 'NOVA-MD',
            'author': _0x0_0x5fa0a4['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x2ab2d4) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x2ab2d4);
        return null;
    }
}
export async function sticker2(_0x461e37, _0x271b) {
    const _0x41a06a = _0x271b || _0x461e37;
    return await new Sticker(_0x41a06a, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x120bc8, _0xf83f97, _0x4c1428, _0x231b88) {
    const _0x2309cd = _0xf83f97 || _0x120bc8;
    return await new Sticker(_0x2309cd, {
        'pack': _0x4c1428,
        'author': _0x231b88,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x56a882, _0x1447a1) {
    const _0x59ca76 = _0x1447a1 || _0x56a882;
    return await new Sticker(_0x59ca76, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x15b5fe, _0x738d55, _0x45a307, _0x1eeccf, _0x164d20 = [''], _0x454437 = {}) {
    const _0x4ab6fb = _0x738d55 || _0x15b5fe;
    return await new Sticker(_0x4ab6fb, {
        'pack': _0x45a307 || _0x0_0x5fa0a4['packname'],
        'author': _0x1eeccf || _0x0_0x5fa0a4['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x164d20,
        ..._0x454437
    })['toBuffer']();
}
export async function sticker6(_0x366553, _0x3fd2c6) {
    const _0x1e428e = _0x3fd2c6 || _0x366553;
    return await new Sticker(_0x1e428e, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0x33fbd1, _0x442b93, _0x59d66a, _0x22c266 = [''], _0x13c5c4 = {}) {
    const _0x2a0aa2 = new _0x0_0x3bcdee['Image']();
    const _0x3a3238 = _0x0_0xf43e87['randomBytes'](0x20)['toString']('hex');
    const _0x4d8277 = {
        'sticker-pack-id': _0x3a3238,
        'sticker-pack-name': _0x442b93,
        'sticker-pack-publisher': _0x59d66a,
        'emojis': _0x22c266,
        ..._0x13c5c4
    };
    const _0x1939af = Buffer['from']([
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
    const _0x68e33a = Buffer['from'](JSON['stringify'](_0x4d8277), 'utf8');
    const _0x84646a = Buffer['concat']([
        _0x1939af,
        _0x68e33a
    ]);
    _0x84646a['writeUIntLE'](_0x68e33a['length'], 0xe, 0x4);
    await _0x2a0aa2['load'](_0x33fbd1);
    _0x2a0aa2['exif'] = _0x84646a;
    return await _0x2a0aa2['save'](null);
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