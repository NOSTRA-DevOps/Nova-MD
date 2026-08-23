import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0xdef279 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x5f3ff4) {
        return decryptSSC(_0x5f3ff4);
    }
    static ['decryptDarkTunnel'](_0x4c3ada) {
        return decryptDarkTunnel(_0x4c3ada);
    }
    static ['decryptHTTPCustom'](_0x1d7202) {
        return decryptHTTPCustom(_0x1d7202);
    }
    static async ['decryptHTTPInjector'](_0x1c2785) {
        return await decryptHTTPInjector(_0x1c2785);
    }
    static ['decryptNPVTunnel'](_0x4da67b) {
        return decryptNPVTunnel(_0x4da67b);
    }
    static async ['downloadAndDecryptEhiLink'](_0x5de914) {
        try {
            const _0x47e380 = await _0x0_0xdef279(_0x5de914, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x359f1e = await _0x47e380['text']();
            const _0x5539ee = parse(_0x359f1e);
            const _0x4aa375 = _0x5539ee['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x4aa375)
                return null;
            let _0x436d81 = _0x4aa375['getAttribute']('href');
            if (!_0x436d81['startsWith']('http'))
                _0x436d81 = 'https://ehi.link' + _0x436d81;
            const _0x213f21 = await _0x0_0xdef279(_0x436d81);
            return await decryptHTTPInjector(await _0x213f21['buffer']());
        } catch (_0x442112) {
            return null;
        }
    }
}
export {
    TDecryptor
};