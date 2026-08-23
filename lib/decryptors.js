import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x38b43f from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0xcca67c) {
        return decryptSSC(_0xcca67c);
    }
    static ['decryptDarkTunnel'](_0x83fcb0) {
        return decryptDarkTunnel(_0x83fcb0);
    }
    static ['decryptHTTPCustom'](_0x17ac00) {
        return decryptHTTPCustom(_0x17ac00);
    }
    static async ['decryptHTTPInjector'](_0x27cf7f) {
        return await decryptHTTPInjector(_0x27cf7f);
    }
    static ['decryptNPVTunnel'](_0x23d88c) {
        return decryptNPVTunnel(_0x23d88c);
    }
    static async ['downloadAndDecryptEhiLink'](_0x5f5073) {
        try {
            const _0x304d91 = await _0x0_0x38b43f(_0x5f5073, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x12f9fd = await _0x304d91['text']();
            const _0xb8979b = parse(_0x12f9fd);
            const _0x49e436 = _0xb8979b['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x49e436)
                return null;
            let _0x3b2d79 = _0x49e436['getAttribute']('href');
            if (!_0x3b2d79['startsWith']('http'))
                _0x3b2d79 = 'https://ehi.link' + _0x3b2d79;
            const _0x2f768e = await _0x0_0x38b43f(_0x3b2d79);
            return await decryptHTTPInjector(await _0x2f768e['buffer']());
        } catch (_0xc0f577) {
            return null;
        }
    }
}
export {
    TDecryptor
};