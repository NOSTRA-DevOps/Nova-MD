import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x202e0e from 'path';
import { tmpdir } from 'os';
import _0x0_0x5bffe8 from 'crypto';
import _0x0_0x15a796 from 'fs';
function randomFileName() {
    return _0x0_0x202e0e['join'](tmpdir(), _0x0_0x5bffe8['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x40451b) {
    return await new Sticker(_0x40451b, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x4a37ac) {
    return await new Sticker(_0x4a37ac, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x45070a, _0x3f1a20) {
    const _0x5ebd56 = await new Sticker(_0x45070a, {
        'pack': _0x3f1a20['packname'],
        'author': _0x3f1a20['author'],
        'categories': _0x3f1a20['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x348108 = randomFileName();
    _0x0_0x15a796['writeFileSync'](_0x348108, _0x5ebd56);
    return _0x348108;
}
export async function writeExifVid(_0x100e62, _0x32301f) {
    const _0x71f16d = await new Sticker(_0x100e62, {
        'pack': _0x32301f['packname'],
        'author': _0x32301f['author'],
        'categories': _0x32301f['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x2dbbfb = randomFileName();
    _0x0_0x15a796['writeFileSync'](_0x2dbbfb, _0x71f16d);
    return _0x2dbbfb;
}
export async function writeExif(_0x183e16, _0x20ed17) {
    const _0x13fe4a = /webp|image|video/['test'](_0x183e16['mimetype']) ? _0x183e16['data'] : null;
    if (!_0x13fe4a)
        return null;
    const _0x120ee0 = await new Sticker(_0x13fe4a, {
        'pack': _0x20ed17['packname'],
        'author': _0x20ed17['author'],
        'categories': _0x20ed17['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x1d34f7 = randomFileName();
    _0x0_0x15a796['writeFileSync'](_0x1d34f7, _0x120ee0);
    return _0x1d34f7;
}