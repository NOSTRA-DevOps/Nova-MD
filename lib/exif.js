import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x1ac325 from 'path';
import { tmpdir } from 'os';
import _0x0_0x354200 from 'crypto';
import _0x0_0x2ede2f from 'fs';
function randomFileName() {
    return _0x0_0x1ac325['join'](tmpdir(), _0x0_0x354200['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x1a5c6b) {
    return await new Sticker(_0x1a5c6b, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x255714) {
    return await new Sticker(_0x255714, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x206c2a, _0x4cc0fc) {
    const _0x1d7a3b = await new Sticker(_0x206c2a, {
        'pack': _0x4cc0fc['packname'],
        'author': _0x4cc0fc['author'],
        'categories': _0x4cc0fc['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x314f6a = randomFileName();
    _0x0_0x2ede2f['writeFileSync'](_0x314f6a, _0x1d7a3b);
    return _0x314f6a;
}
export async function writeExifVid(_0x36d71d, _0x50c663) {
    const _0x15ed93 = await new Sticker(_0x36d71d, {
        'pack': _0x50c663['packname'],
        'author': _0x50c663['author'],
        'categories': _0x50c663['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x3062fe = randomFileName();
    _0x0_0x2ede2f['writeFileSync'](_0x3062fe, _0x15ed93);
    return _0x3062fe;
}
export async function writeExif(_0x55445f, _0x18940e) {
    const _0x89e0df = /webp|image|video/['test'](_0x55445f['mimetype']) ? _0x55445f['data'] : null;
    if (!_0x89e0df)
        return null;
    const _0x9cecee = await new Sticker(_0x89e0df, {
        'pack': _0x18940e['packname'],
        'author': _0x18940e['author'],
        'categories': _0x18940e['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x3c0578 = randomFileName();
    _0x0_0x2ede2f['writeFileSync'](_0x3c0578, _0x9cecee);
    return _0x3c0578;
}