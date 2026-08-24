import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x281ec7 from 'path';
import { tmpdir } from 'os';
import _0x0_0x1cd70e from 'crypto';
import _0x0_0x127928 from 'fs';
function randomFileName() {
    return _0x0_0x281ec7['join'](tmpdir(), _0x0_0x1cd70e['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x1f238d) {
    return await new Sticker(_0x1f238d, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x251be9) {
    return await new Sticker(_0x251be9, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x14e469, _0x5d37a0) {
    const _0x318027 = await new Sticker(_0x14e469, {
        'pack': _0x5d37a0['packname'],
        'author': _0x5d37a0['author'],
        'categories': _0x5d37a0['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x2cf084 = randomFileName();
    _0x0_0x127928['writeFileSync'](_0x2cf084, _0x318027);
    return _0x2cf084;
}
export async function writeExifVid(_0x1d076c, _0x3b7635) {
    const _0x4de69c = await new Sticker(_0x1d076c, {
        'pack': _0x3b7635['packname'],
        'author': _0x3b7635['author'],
        'categories': _0x3b7635['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x233e1c = randomFileName();
    _0x0_0x127928['writeFileSync'](_0x233e1c, _0x4de69c);
    return _0x233e1c;
}
export async function writeExif(_0x23be80, _0x592ae7) {
    const _0x42241d = /webp|image|video/['test'](_0x23be80['mimetype']) ? _0x23be80['data'] : null;
    if (!_0x42241d)
        return null;
    const _0x1be573 = await new Sticker(_0x42241d, {
        'pack': _0x592ae7['packname'],
        'author': _0x592ae7['author'],
        'categories': _0x592ae7['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x22fb33 = randomFileName();
    _0x0_0x127928['writeFileSync'](_0x22fb33, _0x1be573);
    return _0x22fb33;
}