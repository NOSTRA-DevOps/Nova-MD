import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x558cc0 from 'path';
import { tmpdir } from 'os';
import _0x0_0x1b5f4c from 'crypto';
import _0x0_0xaa39bf from 'fs';
function randomFileName() {
    return _0x0_0x558cc0['join'](tmpdir(), _0x0_0x1b5f4c['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x14279c) {
    return await new Sticker(_0x14279c, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x20ef9a) {
    return await new Sticker(_0x20ef9a, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x1c55dc, _0x335491) {
    const _0x162b15 = await new Sticker(_0x1c55dc, {
        'pack': _0x335491['packname'],
        'author': _0x335491['author'],
        'categories': _0x335491['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x1dc4a6 = randomFileName();
    _0x0_0xaa39bf['writeFileSync'](_0x1dc4a6, _0x162b15);
    return _0x1dc4a6;
}
export async function writeExifVid(_0x173e37, _0x498755) {
    const _0x121020 = await new Sticker(_0x173e37, {
        'pack': _0x498755['packname'],
        'author': _0x498755['author'],
        'categories': _0x498755['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x378953 = randomFileName();
    _0x0_0xaa39bf['writeFileSync'](_0x378953, _0x121020);
    return _0x378953;
}
export async function writeExif(_0x370d31, _0x343769) {
    const _0x58ef37 = /webp|image|video/['test'](_0x370d31['mimetype']) ? _0x370d31['data'] : null;
    if (!_0x58ef37)
        return null;
    const _0x38057e = await new Sticker(_0x58ef37, {
        'pack': _0x343769['packname'],
        'author': _0x343769['author'],
        'categories': _0x343769['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x1a9ef5 = randomFileName();
    _0x0_0xaa39bf['writeFileSync'](_0x1a9ef5, _0x38057e);
    return _0x1a9ef5;
}