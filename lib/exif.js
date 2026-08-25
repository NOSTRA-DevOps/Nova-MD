import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x50eabd from 'path';
import { tmpdir } from 'os';
import _0x0_0x585774 from 'crypto';
import _0x0_0x5611f1 from 'fs';
function randomFileName() {
    return _0x0_0x50eabd['join'](tmpdir(), _0x0_0x585774['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x4f8382) {
    return await new Sticker(_0x4f8382, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x164cb2) {
    return await new Sticker(_0x164cb2, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x337139, _0xcf16de) {
    const _0x3907cf = await new Sticker(_0x337139, {
        'pack': _0xcf16de['packname'],
        'author': _0xcf16de['author'],
        'categories': _0xcf16de['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x20f0fa = randomFileName();
    _0x0_0x5611f1['writeFileSync'](_0x20f0fa, _0x3907cf);
    return _0x20f0fa;
}
export async function writeExifVid(_0x56818c, _0x57552b) {
    const _0x271688 = await new Sticker(_0x56818c, {
        'pack': _0x57552b['packname'],
        'author': _0x57552b['author'],
        'categories': _0x57552b['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x37ade7 = randomFileName();
    _0x0_0x5611f1['writeFileSync'](_0x37ade7, _0x271688);
    return _0x37ade7;
}
export async function writeExif(_0x542e52, _0x3e1049) {
    const _0x563a42 = /webp|image|video/['test'](_0x542e52['mimetype']) ? _0x542e52['data'] : null;
    if (!_0x563a42)
        return null;
    const _0x2299e8 = await new Sticker(_0x563a42, {
        'pack': _0x3e1049['packname'],
        'author': _0x3e1049['author'],
        'categories': _0x3e1049['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x38b245 = randomFileName();
    _0x0_0x5611f1['writeFileSync'](_0x38b245, _0x2299e8);
    return _0x38b245;
}