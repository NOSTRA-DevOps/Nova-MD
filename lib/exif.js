import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0xe2ac3e from 'path';
import { tmpdir } from 'os';
import _0x0_0x306203 from 'crypto';
import _0x0_0x4cee11 from 'fs';
function randomFileName() {
    return _0x0_0xe2ac3e['join'](tmpdir(), _0x0_0x306203['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x47c2db) {
    return await new Sticker(_0x47c2db, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x3fcf55) {
    return await new Sticker(_0x3fcf55, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x4aeb5b, _0x50c139) {
    const _0x5d804f = await new Sticker(_0x4aeb5b, {
        'pack': _0x50c139['packname'],
        'author': _0x50c139['author'],
        'categories': _0x50c139['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0xbdc822 = randomFileName();
    _0x0_0x4cee11['writeFileSync'](_0xbdc822, _0x5d804f);
    return _0xbdc822;
}
export async function writeExifVid(_0x55cd0f, _0x216d6b) {
    const _0x5354e4 = await new Sticker(_0x55cd0f, {
        'pack': _0x216d6b['packname'],
        'author': _0x216d6b['author'],
        'categories': _0x216d6b['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x3a3ca9 = randomFileName();
    _0x0_0x4cee11['writeFileSync'](_0x3a3ca9, _0x5354e4);
    return _0x3a3ca9;
}
export async function writeExif(_0x4dd7ca, _0x2a9cc0) {
    const _0x145929 = /webp|image|video/['test'](_0x4dd7ca['mimetype']) ? _0x4dd7ca['data'] : null;
    if (!_0x145929)
        return null;
    const _0x4634d1 = await new Sticker(_0x145929, {
        'pack': _0x2a9cc0['packname'],
        'author': _0x2a9cc0['author'],
        'categories': _0x2a9cc0['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x458e03 = randomFileName();
    _0x0_0x4cee11['writeFileSync'](_0x458e03, _0x4634d1);
    return _0x458e03;
}