import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x11a97b from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x4ce6d8) {
        return decryptSSC(_0x4ce6d8);
    }
    static ['decryptDarkTunnel'](_0x24b0fc) {
        return decryptDarkTunnel(_0x24b0fc);
    }
    static ['decryptHTTPCustom'](_0x1805b0) {
        return decryptHTTPCustom(_0x1805b0);
    }
    static async ['decryptHTTPInjector'](_0x23e9ab) {
        return await decryptHTTPInjector(_0x23e9ab);
    }
    static ['decryptNPVTunnel'](_0x12cb68) {
        return decryptNPVTunnel(_0x12cb68);
    }
    static async ['downloadAndDecryptEhiLink'](_0x1b3e55) {
        try {
            const _0x44296a = await _0x0_0x11a97b(_0x1b3e55, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0xc33a16 = await _0x44296a['text']();
            const _0x281633 = parse(_0xc33a16);
            const _0x2fbaa4 = _0x281633['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x2fbaa4)
                return null;
            let _0x290ca5 = _0x2fbaa4['getAttribute']('href');
            if (!_0x290ca5['startsWith']('http'))
                _0x290ca5 = 'https://ehi.link' + _0x290ca5;
            const _0x59a61b = await _0x0_0x11a97b(_0x290ca5);
            return await decryptHTTPInjector(await _0x59a61b['buffer']());
        } catch (_0x30bdf5) {
            return null;
        }
    }
}
export {
    TDecryptor
};