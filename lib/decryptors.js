import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x2af157 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x3b166e) {
        return decryptSSC(_0x3b166e);
    }
    static ['decryptDarkTunnel'](_0xcc619e) {
        return decryptDarkTunnel(_0xcc619e);
    }
    static ['decryptHTTPCustom'](_0x2d0d79) {
        return decryptHTTPCustom(_0x2d0d79);
    }
    static async ['decryptHTTPInjector'](_0x16a688) {
        return await decryptHTTPInjector(_0x16a688);
    }
    static ['decryptNPVTunnel'](_0x4ec867) {
        return decryptNPVTunnel(_0x4ec867);
    }
    static async ['downloadAndDecryptEhiLink'](_0x2cb6dc) {
        try {
            const _0x2b0118 = await _0x0_0x2af157(_0x2cb6dc, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x9acee = await _0x2b0118['text']();
            const _0x517329 = parse(_0x9acee);
            const _0x443d10 = _0x517329['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x443d10)
                return null;
            let _0x425900 = _0x443d10['getAttribute']('href');
            if (!_0x425900['startsWith']('http'))
                _0x425900 = 'https://ehi.link' + _0x425900;
            const _0x354edb = await _0x0_0x2af157(_0x425900);
            return await decryptHTTPInjector(await _0x354edb['buffer']());
        } catch (_0x19fc7e) {
            return null;
        }
    }
}
export {
    TDecryptor
};