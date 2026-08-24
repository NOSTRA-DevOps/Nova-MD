import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0xa740e1 from 'path';
import { tmpdir } from 'os';
import _0x0_0x15674a from 'crypto';
import _0x0_0x44c85b from 'fs';
function randomFileName() {
    return _0x0_0xa740e1['join'](tmpdir(), _0x0_0x15674a['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x44cb4f) {
    return await new Sticker(_0x44cb4f, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x482088) {
    return await new Sticker(_0x482088, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x55e518, _0x21e568) {
    const _0x1e10a2 = await new Sticker(_0x55e518, {
        'pack': _0x21e568['packname'],
        'author': _0x21e568['author'],
        'categories': _0x21e568['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x267659 = randomFileName();
    _0x0_0x44c85b['writeFileSync'](_0x267659, _0x1e10a2);
    return _0x267659;
}
export async function writeExifVid(_0x485931, _0x5e7314) {
    const _0x1c1dc5 = await new Sticker(_0x485931, {
        'pack': _0x5e7314['packname'],
        'author': _0x5e7314['author'],
        'categories': _0x5e7314['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x53a991 = randomFileName();
    _0x0_0x44c85b['writeFileSync'](_0x53a991, _0x1c1dc5);
    return _0x53a991;
}
export async function writeExif(_0x5b2eae, _0x11fbc6) {
    const _0x49fca0 = /webp|image|video/['test'](_0x5b2eae['mimetype']) ? _0x5b2eae['data'] : null;
    if (!_0x49fca0)
        return null;
    const _0x26ed59 = await new Sticker(_0x49fca0, {
        'pack': _0x11fbc6['packname'],
        'author': _0x11fbc6['author'],
        'categories': _0x11fbc6['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x5cf3b8 = randomFileName();
    _0x0_0x44c85b['writeFileSync'](_0x5cf3b8, _0x26ed59);
    return _0x5cf3b8;
}