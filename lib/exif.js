import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x454dfe from 'path';
import { tmpdir } from 'os';
import _0x0_0x21d2a3 from 'crypto';
import _0x0_0xc40a68 from 'fs';
function randomFileName() {
    return _0x0_0x454dfe['join'](tmpdir(), _0x0_0x21d2a3['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x2da7a2) {
    return await new Sticker(_0x2da7a2, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x1d548e) {
    return await new Sticker(_0x1d548e, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x558dde, _0x241550) {
    const _0x5f0e3f = await new Sticker(_0x558dde, {
        'pack': _0x241550['packname'],
        'author': _0x241550['author'],
        'categories': _0x241550['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x305fd9 = randomFileName();
    _0x0_0xc40a68['writeFileSync'](_0x305fd9, _0x5f0e3f);
    return _0x305fd9;
}
export async function writeExifVid(_0x144b9b, _0x2dad39) {
    const _0xe320d2 = await new Sticker(_0x144b9b, {
        'pack': _0x2dad39['packname'],
        'author': _0x2dad39['author'],
        'categories': _0x2dad39['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x1bceaa = randomFileName();
    _0x0_0xc40a68['writeFileSync'](_0x1bceaa, _0xe320d2);
    return _0x1bceaa;
}
export async function writeExif(_0x2f2420, _0x5ef3de) {
    const _0x1f1968 = /webp|image|video/['test'](_0x2f2420['mimetype']) ? _0x2f2420['data'] : null;
    if (!_0x1f1968)
        return null;
    const _0x1acb21 = await new Sticker(_0x1f1968, {
        'pack': _0x5ef3de['packname'],
        'author': _0x5ef3de['author'],
        'categories': _0x5ef3de['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x4e10c6 = randomFileName();
    _0x0_0xc40a68['writeFileSync'](_0x4e10c6, _0x1acb21);
    return _0x4e10c6;
}