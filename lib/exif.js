import {
    Sticker,
    StickerTypes
} from 'stickers-formatter';
import _0x0_0x467c5f from 'path';
import { tmpdir } from 'os';
import _0x0_0x5068fc from 'crypto';
import _0x0_0x5ecd57 from 'fs';
function randomFileName() {
    return _0x0_0x467c5f['join'](tmpdir(), _0x0_0x5068fc['randomBytes'](0x6)['readUIntLE'](0x0, 0x6)['toString'](0x24) + '.webp');
}
export async function imageToWebp(_0x217125) {
    return await new Sticker(_0x217125, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function videoToWebp(_0x2a767f) {
    return await new Sticker(_0x2a767f, { 'type': StickerTypes['DEFAULT'] })['toBuffer']();
}
export async function writeExifImg(_0x321050, _0x789bd8) {
    const _0x2dac66 = await new Sticker(_0x321050, {
        'pack': _0x789bd8['packname'],
        'author': _0x789bd8['author'],
        'categories': _0x789bd8['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x576c51 = randomFileName();
    _0x0_0x5ecd57['writeFileSync'](_0x576c51, _0x2dac66);
    return _0x576c51;
}
export async function writeExifVid(_0x33c977, _0x5c7549) {
    const _0xfbb944 = await new Sticker(_0x33c977, {
        'pack': _0x5c7549['packname'],
        'author': _0x5c7549['author'],
        'categories': _0x5c7549['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x51ab20 = randomFileName();
    _0x0_0x5ecd57['writeFileSync'](_0x51ab20, _0xfbb944);
    return _0x51ab20;
}
export async function writeExif(_0x3b03d3, _0xce298c) {
    const _0x54ff6a = /webp|image|video/['test'](_0x3b03d3['mimetype']) ? _0x3b03d3['data'] : null;
    if (!_0x54ff6a)
        return null;
    const _0x4a2a07 = await new Sticker(_0x54ff6a, {
        'pack': _0xce298c['packname'],
        'author': _0xce298c['author'],
        'categories': _0xce298c['categories'] || [''],
        'type': StickerTypes['DEFAULT']
    })['toBuffer']();
    const _0x203a14 = randomFileName();
    _0x0_0x5ecd57['writeFileSync'](_0x203a14, _0x4a2a07);
    return _0x203a14;
}