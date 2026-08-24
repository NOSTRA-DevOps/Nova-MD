import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0xef6309 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0xedcb20) {
        return decryptSSC(_0xedcb20);
    }
    static ['decryptDarkTunnel'](_0x35d9a1) {
        return decryptDarkTunnel(_0x35d9a1);
    }
    static ['decryptHTTPCustom'](_0xb17156) {
        return decryptHTTPCustom(_0xb17156);
    }
    static async ['decryptHTTPInjector'](_0x4e7105) {
        return await decryptHTTPInjector(_0x4e7105);
    }
    static ['decryptNPVTunnel'](_0x507c09) {
        return decryptNPVTunnel(_0x507c09);
    }
    static async ['downloadAndDecryptEhiLink'](_0x36107a) {
        try {
            const _0x494a55 = await _0x0_0xef6309(_0x36107a, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x5564bd = await _0x494a55['text']();
            const _0x38fe64 = parse(_0x5564bd);
            const _0x3cdff9 = _0x38fe64['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x3cdff9)
                return null;
            let _0x579214 = _0x3cdff9['getAttribute']('href');
            if (!_0x579214['startsWith']('http'))
                _0x579214 = 'https://ehi.link' + _0x579214;
            const _0x4ea0e7 = await _0x0_0xef6309(_0x579214);
            return await decryptHTTPInjector(await _0x4ea0e7['buffer']());
        } catch (_0x24b77f) {
            return null;
        }
    }
}
export {
    TDecryptor
};