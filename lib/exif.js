import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x4a378a from 'path';
import { tmpdir } from 'os';
import _0x0_0x52ab9e from 'crypto';
import _0x0_0x3f350b from 'fs';
function randomFileName() {
    return _0x0_0x4a378a['join'](tmpdir(), _0x0_0x52ab9e['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x265677) {
    return await new Sticker(_0x265677, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x1451a6) {
    return await new Sticker(_0x1451a6, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x99ee7e, _0x449e34) {
    const _0x167be1 = await new Sticker(_0x99ee7e, {
        'pack': _0x449e34['packname'],
        'author': _0x449e34['author'],
        'categories': _0x449e34['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x39bfc5 = randomFileName();
    _0x0_0x3f350b['writeFileSync'](_0x39bfc5, _0x167be1);
    return _0x39bfc5;
}
export async function writeExifVid(_0x40be89, _0x5aabea) {
    const _0x23e7be = await new Sticker(_0x40be89, {
        'pack': _0x5aabea['packname'],
        'author': _0x5aabea['author'],
        'categories': _0x5aabea['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x1ba866 = randomFileName();
    _0x0_0x3f350b['writeFileSync'](_0x1ba866, _0x23e7be);
    return _0x1ba866;
}
export async function writeExif(_0xcf1c0f, _0x11ecce) {
    const _0x3385c6 = /webp|image|video/['test'](_0xcf1c0f['mimetype']) ? _0xcf1c0f['data'] : null;
    if (!_0x3385c6)
        return null;
    const _0x12f4d9 = await new Sticker(_0x3385c6, {
        'pack': _0x11ecce['packname'],
        'author': _0x11ecce['author'],
        'categories': _0x11ecce['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x3245c9 = randomFileName();
    _0x0_0x3f350b['writeFileSync'](_0x3245c9, _0x12f4d9);
    return _0x3245c9;
}