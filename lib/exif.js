import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x26e5e6 from 'path';
import { tmpdir } from 'os';
import _0x0_0x152e01 from 'crypto';
import _0x0_0x115c43 from 'fs';
function randomFileName() {
    return _0x0_0x26e5e6['join'](tmpdir(), _0x0_0x152e01['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x12efbc) {
    return await new Sticker(_0x12efbc, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x59e175) {
    return await new Sticker(_0x59e175, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x2379f8, _0x5227fc) {
    const _0x37b32d = await new Sticker(_0x2379f8, {
        'pack': _0x5227fc['packname'],
        'author': _0x5227fc['author'],
        'categories': _0x5227fc['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x16a178 = randomFileName();
    _0x0_0x115c43['writeFileSync'](_0x16a178, _0x37b32d);
    return _0x16a178;
}
export async function writeExifVid(_0x2cc35f, _0x1305ae) {
    const _0x103d3d = await new Sticker(_0x2cc35f, {
        'pack': _0x1305ae['packname'],
        'author': _0x1305ae['author'],
        'categories': _0x1305ae['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0xb3309a = randomFileName();
    _0x0_0x115c43['writeFileSync'](_0xb3309a, _0x103d3d);
    return _0xb3309a;
}
export async function writeExif(_0x25ad11, _0x3efb22) {
    const _0x2f10fe = /webp|image|video/['test'](_0x25ad11['mimetype']) ? _0x25ad11['data'] : null;
    if (!_0x2f10fe)
        return null;
    const _0x9270e2 = await new Sticker(_0x2f10fe, {
        'pack': _0x3efb22['packname'],
        'author': _0x3efb22['author'],
        'categories': _0x3efb22['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x4c11f6 = randomFileName();
    _0x0_0x115c43['writeFileSync'](_0x4c11f6, _0x9270e2);
    return _0x4c11f6;
}