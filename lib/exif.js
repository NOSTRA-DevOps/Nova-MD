import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x55a3a9 from 'path';
import { tmpdir } from 'os';
import _0x0_0x2b9325 from 'crypto';
import _0x0_0x46aa13 from 'fs';
function randomFileName() {
    return _0x0_0x55a3a9['join'](tmpdir(), _0x0_0x2b9325['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x549b24) {
    return await new Sticker(_0x549b24, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x4cf3e6) {
    return await new Sticker(_0x4cf3e6, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x2acb3d, _0x25f7e9) {
    const _0x35c0b5 = await new Sticker(_0x2acb3d, {
        'pack': _0x25f7e9['packname'],
        'author': _0x25f7e9['author'],
        'categories': _0x25f7e9['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x18e0a2 = randomFileName();
    _0x0_0x46aa13['writeFileSync'](_0x18e0a2, _0x35c0b5);
    return _0x18e0a2;
}
export async function writeExifVid(_0x35eed8, _0x2941d9) {
    const _0x41b5d0 = await new Sticker(_0x35eed8, {
        'pack': _0x2941d9['packname'],
        'author': _0x2941d9['author'],
        'categories': _0x2941d9['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x1f59ea = randomFileName();
    _0x0_0x46aa13['writeFileSync'](_0x1f59ea, _0x41b5d0);
    return _0x1f59ea;
}
export async function writeExif(_0xaff9a7, _0x29a57f) {
    const _0x3d9da4 = /webp|image|video/['test'](_0xaff9a7['mimetype']) ? _0xaff9a7['data'] : null;
    if (!_0x3d9da4)
        return null;
    const _0x1277bc = await new Sticker(_0x3d9da4, {
        'pack': _0x29a57f['packname'],
        'author': _0x29a57f['author'],
        'categories': _0x29a57f['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x3c1aa0 = randomFileName();
    _0x0_0x46aa13['writeFileSync'](_0x3c1aa0, _0x1277bc);
    return _0x3c1aa0;
}