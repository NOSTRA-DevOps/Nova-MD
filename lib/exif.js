import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x29f1ad from 'path';
import { tmpdir } from 'os';
import _0x0_0x367abf from 'crypto';
import _0x0_0x235b57 from 'fs';
function randomFileName() {
    return _0x0_0x29f1ad['join'](tmpdir(), _0x0_0x367abf['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x4c71ea) {
    return await new Sticker(_0x4c71ea, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x524ad7) {
    return await new Sticker(_0x524ad7, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x2de557, _0x427631) {
    const _0x2a3d0f = await new Sticker(_0x2de557, {
        'pack': _0x427631['packname'],
        'author': _0x427631['author'],
        'categories': _0x427631['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x2e3bb9 = randomFileName();
    _0x0_0x235b57['writeFileSync'](_0x2e3bb9, _0x2a3d0f);
    return _0x2e3bb9;
}
export async function writeExifVid(_0x4da99f, _0x4c9d7d) {
    const _0x248f85 = await new Sticker(_0x4da99f, {
        'pack': _0x4c9d7d['packname'],
        'author': _0x4c9d7d['author'],
        'categories': _0x4c9d7d['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x4c5477 = randomFileName();
    _0x0_0x235b57['writeFileSync'](_0x4c5477, _0x248f85);
    return _0x4c5477;
}
export async function writeExif(_0x2ffba9, _0x4f4b24) {
    const _0x49d54d = /webp|image|video/['test'](_0x2ffba9['mimetype']) ? _0x2ffba9['data'] : null;
    if (!_0x49d54d)
        return null;
    const _0x19a9dd = await new Sticker(_0x49d54d, {
        'pack': _0x4f4b24['packname'],
        'author': _0x4f4b24['author'],
        'categories': _0x4f4b24['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0xb76940 = randomFileName();
    _0x0_0x235b57['writeFileSync'](_0xb76940, _0x19a9dd);
    return _0xb76940;
}