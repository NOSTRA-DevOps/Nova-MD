import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x1b987a from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x11aa07) {
        return decryptSSC(_0x11aa07);
    }
    static ['decryptDarkTunnel'](_0x26c41d) {
        return decryptDarkTunnel(_0x26c41d);
    }
    static ['decryptHTTPCustom'](_0x579280) {
        return decryptHTTPCustom(_0x579280);
    }
    static async ['decryptHTTPInjector'](_0xcde77e) {
        return await decryptHTTPInjector(_0xcde77e);
    }
    static ['decryptNPVTunnel'](_0x44d333) {
        return decryptNPVTunnel(_0x44d333);
    }
    static async ['downloadAndDecryptEhiLink'](_0x1e30bf) {
        try {
            const _0x2418a6 = await _0x0_0x1b987a(_0x1e30bf, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x229201 = await _0x2418a6['text']();
            const _0x2724b8 = parse(_0x229201);
            const _0x48f554 = _0x2724b8['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x48f554)
                return null;
            let _0x4f223f = _0x48f554['getAttribute']('href');
            if (!_0x4f223f['startsWith']('http'))
                _0x4f223f = 'https://ehi.link' + _0x4f223f;
            const _0x3384c6 = await _0x0_0x1b987a(_0x4f223f);
            return await decryptHTTPInjector(await _0x3384c6['buffer']());
        } catch (_0x2bc33f) {
            return null;
        }
    }
}
export {
    TDecryptor
};