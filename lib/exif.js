import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x3d1393 from 'path';
import { tmpdir } from 'os';
import _0x0_0x5d808b from 'crypto';
import _0x0_0x4b05d2 from 'fs';
function randomFileName() {
    return _0x0_0x3d1393['join'](tmpdir(), _0x0_0x5d808b['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x23ce1f) {
    return await new Sticker(_0x23ce1f, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x4341e7) {
    return await new Sticker(_0x4341e7, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x18edc8, _0x1a65ae) {
    const _0x1a365e = await new Sticker(_0x18edc8, {
        'pack': _0x1a65ae['packname'],
        'author': _0x1a65ae['author'],
        'categories': _0x1a65ae['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x245e52 = randomFileName();
    _0x0_0x4b05d2['writeFileSync'](_0x245e52, _0x1a365e);
    return _0x245e52;
}
export async function writeExifVid(_0x1be067, _0x238462) {
    const _0x5df36a = await new Sticker(_0x1be067, {
        'pack': _0x238462['packname'],
        'author': _0x238462['author'],
        'categories': _0x238462['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x2e6773 = randomFileName();
    _0x0_0x4b05d2['writeFileSync'](_0x2e6773, _0x5df36a);
    return _0x2e6773;
}
export async function writeExif(_0x4a969d, _0x491171) {
    const _0x438d1a = /webp|image|video/['test'](_0x4a969d['mimetype']) ? _0x4a969d['data'] : null;
    if (!_0x438d1a)
        return null;
    const _0x2ea298 = await new Sticker(_0x438d1a, {
        'pack': _0x491171['packname'],
        'author': _0x491171['author'],
        'categories': _0x491171['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x3bdafe = randomFileName();
    _0x0_0x4b05d2['writeFileSync'](_0x3bdafe, _0x2ea298);
    return _0x3bdafe;
}