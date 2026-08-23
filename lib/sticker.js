import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0xf2324b from 'path';
import _0x0_0x1c7bb6 from 'crypto';
import _0x0_0x12c987 from 'node-webpmux';
import { fileURLToPath } from 'url';
import _0x0_0x1d7d90 from '../config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = _0x0_0xf2324b['dirname'](__filename);
const _tmp = _0x0_0xf2324b['join'](process['cwd'](), 'temp');
export async function sticker(_0x46b352, _0x2e4f0d, _0x2fad19, _0x3695dc) {
    try {
        const _0x57ab50 = await fetch(_0x2e4f0d);
        const _0x307061 = Buffer['from'](await _0x57ab50['arrayBuffer']());
        return await new Sticker(_0x307061, {
            'pack': _0x0_0x1d7d90['packname'] || 'NOVA-MD',
            'author': _0x0_0x1d7d90['author'] || 'NOSTRA',
            'type': StickerTypes['DEFAULT']
        })['toBuffer']();
    } catch (_0x42c5c4) {
        console['error']('Error\x20in\x20sticker\x20creation:', _0x42c5c4);
        return null;
    }
}
export async function sticker2(_0x749804, _0xb23bab) {
    const _0x27f276 = _0xb23bab || _0x749804;
    return await new Sticker(_0x27f276, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker3(_0x357392, _0x995377, _0x4c1012, _0x32dbba) {
    const _0x343237 = _0x995377 || _0x357392;
    return await new Sticker(_0x343237, {
        'pack': _0x4c1012,
        'author': _0x32dbba,
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
}
export async function sticker4(_0x28eda6, _0x442fc0) {
    const _0x2f6504 = _0x442fc0 || _0x28eda6;
    return await new Sticker(_0x2f6504, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function sticker5(_0x314fa5, _0x46bcfd, _0x2698b6, _0x211893, _0x4eadbb = [''], _0x2cfc7d = {}) {
    const _0x450a63 = _0x46bcfd || _0x314fa5;
    return await new Sticker(_0x450a63, {
        'pack': _0x2698b6 || _0x0_0x1d7d90['packname'],
        'author': _0x211893 || _0x0_0x1d7d90['author'],
        'type': StickerTypes['DEFAULT'],
        'categories': _0x4eadbb,
        ..._0x2cfc7d
    })['toBuffer']();
}
export async function sticker6(_0x4a9dbf, _0x8b0429) {
    const _0x460bc9 = _0x8b0429 || _0x4a9dbf;
    return await new Sticker(_0x460bc9, { 'type': StickerTypes['FULL'] })['toBuffer']();
}
export async function addExif(_0xaef72e, _0x11bfb2, _0x15fffd, _0x2ca12c = [''], _0x2b8fa6 = {}) {
    const _0x5f4864 = new _0x0_0x12c987['Image']();
    const _0x22bd72 = _0x0_0x1c7bb6['randomBytes'](0x20)['toString']('hex');
    const _0x26ccd6 = {
        'sticker-pack-id': _0x22bd72,
        'sticker-pack-name': _0x11bfb2,
        'sticker-pack-publisher': _0x15fffd,
        'emojis': _0x2ca12c,
        ..._0x2b8fa6
    };
    const _0x3280f1 = Buffer['from']([
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
    const _0x4c25c7 = Buffer['from'](JSON['stringify'](_0x26ccd6), 'utf8');
    const _0x499411 = Buffer['concat']([
        _0x3280f1,
        _0x4c25c7
    ]);
    _0x499411['writeUIntLE'](_0x4c25c7['length'], 0xe, 0x4);
    await _0x5f4864['load'](_0xaef72e);
    _0x5f4864['exif'] = _0x499411;
    return await _0x5f4864['save'](null);
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