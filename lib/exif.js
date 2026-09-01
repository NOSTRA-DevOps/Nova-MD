import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0xc95407 from 'path';
import { tmpdir } from 'os';
import _0x0_0xfa1917 from 'crypto';
import _0x0_0x50d545 from 'fs';
function randomFileName() {
    return _0x0_0xc95407['join'](tmpdir(), _0x0_0xfa1917['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x5a6372) {
    return await new Sticker(_0x5a6372, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x54432f) {
    return await new Sticker(_0x54432f, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x1ed9fb, _0xe57b46) {
    const _0x27538e = await new Sticker(_0x1ed9fb, {
        'pack': _0xe57b46['packname'],
        'author': _0xe57b46['author'],
        'categories': _0xe57b46['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x37d6e2 = randomFileName();
    _0x0_0x50d545['writeFileSync'](_0x37d6e2, _0x27538e);
    return _0x37d6e2;
}
export async function writeExifVid(_0x5da553, _0x21a0a2) {
    const _0x5ae6ea = await new Sticker(_0x5da553, {
        'pack': _0x21a0a2['packname'],
        'author': _0x21a0a2['author'],
        'categories': _0x21a0a2['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x709cea = randomFileName();
    _0x0_0x50d545['writeFileSync'](_0x709cea, _0x5ae6ea);
    return _0x709cea;
}
export async function writeExif(_0x3a637a, _0x478ff6) {
    const _0x337af8 = /webp|image|video/['test'](_0x3a637a['mimetype']) ? _0x3a637a['data'] : null;
    if (!_0x337af8)
        return null;
    const _0x271c42 = await new Sticker(_0x337af8, {
        'pack': _0x478ff6['packname'],
        'author': _0x478ff6['author'],
        'categories': _0x478ff6['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x85a178 = randomFileName();
    _0x0_0x50d545['writeFileSync'](_0x85a178, _0x271c42);
    return _0x85a178;
}