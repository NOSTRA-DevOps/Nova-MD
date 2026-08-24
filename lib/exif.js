import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x22b425 from 'path';
import { tmpdir } from 'os';
import _0x0_0x23a719 from 'crypto';
import _0x0_0x2c33dc from 'fs';
function randomFileName() {
    return _0x0_0x22b425['join'](tmpdir(), _0x0_0x23a719['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x342c3f) {
    return await new Sticker(_0x342c3f, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x13b308) {
    return await new Sticker(_0x13b308, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x16ce29, _0x57d679) {
    const _0x340e5c = await new Sticker(_0x16ce29, {
        'pack': _0x57d679['packname'],
        'author': _0x57d679['author'],
        'categories': _0x57d679['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x144d79 = randomFileName();
    _0x0_0x2c33dc['writeFileSync'](_0x144d79, _0x340e5c);
    return _0x144d79;
}
export async function writeExifVid(_0x21d904, _0x5415c6) {
    const _0x4f8d3c = await new Sticker(_0x21d904, {
        'pack': _0x5415c6['packname'],
        'author': _0x5415c6['author'],
        'categories': _0x5415c6['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x186645 = randomFileName();
    _0x0_0x2c33dc['writeFileSync'](_0x186645, _0x4f8d3c);
    return _0x186645;
}
export async function writeExif(_0x2efd2b, _0xe4bb92) {
    const _0x54ceca = /webp|image|video/['test'](_0x2efd2b['mimetype']) ? _0x2efd2b['data'] : null;
    if (!_0x54ceca)
        return null;
    const _0x518299 = await new Sticker(_0x54ceca, {
        'pack': _0xe4bb92['packname'],
        'author': _0xe4bb92['author'],
        'categories': _0xe4bb92['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x454cdd = randomFileName();
    _0x0_0x2c33dc['writeFileSync'](_0x454cdd, _0x518299);
    return _0x454cdd;
}