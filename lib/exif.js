import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x550e67 from 'path';
import { tmpdir } from 'os';
import _0x0_0x4fa512 from 'crypto';
import _0x0_0x1118a4 from 'fs';
function randomFileName() {
    return _0x0_0x550e67['join'](tmpdir(), _0x0_0x4fa512['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x3ef4fb) {
    return await new Sticker(_0x3ef4fb, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x2095c2) {
    return await new Sticker(_0x2095c2, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x1fc595, _0x2f0155) {
    const _0x562ec5 = await new Sticker(_0x1fc595, {
        'pack': _0x2f0155['packname'],
        'author': _0x2f0155['author'],
        'categories': _0x2f0155['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x27ac5b = randomFileName();
    _0x0_0x1118a4['writeFileSync'](_0x27ac5b, _0x562ec5);
    return _0x27ac5b;
}
export async function writeExifVid(_0x4c48dc, _0x4951ef) {
    const _0x494175 = await new Sticker(_0x4c48dc, {
        'pack': _0x4951ef['packname'],
        'author': _0x4951ef['author'],
        'categories': _0x4951ef['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x11058d = randomFileName();
    _0x0_0x1118a4['writeFileSync'](_0x11058d, _0x494175);
    return _0x11058d;
}
export async function writeExif(_0x2abc41, _0x4af919) {
    const _0x1e68cc = /webp|image|video/['test'](_0x2abc41['mimetype']) ? _0x2abc41['data'] : null;
    if (!_0x1e68cc)
        return null;
    const _0x2642b3 = await new Sticker(_0x1e68cc, {
        'pack': _0x4af919['packname'],
        'author': _0x4af919['author'],
        'categories': _0x4af919['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x785fb = randomFileName();
    _0x0_0x1118a4['writeFileSync'](_0x785fb, _0x2642b3);
    return _0x785fb;
}