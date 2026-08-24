import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x60ee2b from 'path';
import { tmpdir } from 'os';
import _0x0_0x35d2dd from 'crypto';
import _0x0_0x25a479 from 'fs';
function randomFileName() {
    return _0x0_0x60ee2b['join'](tmpdir(), _0x0_0x35d2dd['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x4d6579) {
    return await new Sticker(_0x4d6579, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x436b86) {
    return await new Sticker(_0x436b86, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x47e994, _0x3edc57) {
    const _0x1b7e42 = await new Sticker(_0x47e994, {
        'pack': _0x3edc57['packname'],
        'author': _0x3edc57['author'],
        'categories': _0x3edc57['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x34b20d = randomFileName();
    _0x0_0x25a479['writeFileSync'](_0x34b20d, _0x1b7e42);
    return _0x34b20d;
}
export async function writeExifVid(_0x139bf4, _0x1404a3) {
    const _0x11b566 = await new Sticker(_0x139bf4, {
        'pack': _0x1404a3['packname'],
        'author': _0x1404a3['author'],
        'categories': _0x1404a3['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0xbf11 = randomFileName();
    _0x0_0x25a479['writeFileSync'](_0xbf11, _0x11b566);
    return _0xbf11;
}
export async function writeExif(_0x2ad851, _0x5637d1) {
    const _0x4f8a5e = /webp|image|video/['test'](_0x2ad851['mimetype']) ? _0x2ad851['data'] : null;
    if (!_0x4f8a5e)
        return null;
    const _0x3bb161 = await new Sticker(_0x4f8a5e, {
        'pack': _0x5637d1['packname'],
        'author': _0x5637d1['author'],
        'categories': _0x5637d1['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x44318d = randomFileName();
    _0x0_0x25a479['writeFileSync'](_0x44318d, _0x3bb161);
    return _0x44318d;
}