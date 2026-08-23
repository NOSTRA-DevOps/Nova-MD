import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x4ce04b from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x45903d) {
        return decryptSSC(_0x45903d);
    }
    static ['decryptDarkTunnel'](_0x11b850) {
        return decryptDarkTunnel(_0x11b850);
    }
    static ['decryptHTTPCustom'](_0x8acbff) {
        return decryptHTTPCustom(_0x8acbff);
    }
    static async ['decryptHTTPInjector'](_0x3bffd4) {
        return await decryptHTTPInjector(_0x3bffd4);
    }
    static ['decryptNPVTunnel'](_0x2e6381) {
        return decryptNPVTunnel(_0x2e6381);
    }
    static async ['downloadAndDecryptEhiLink'](_0x3764c4) {
        try {
            const _0x449e40 = await _0x0_0x4ce04b(_0x3764c4, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x527679 = await _0x449e40['text']();
            const _0xcdc10e = parse(_0x527679);
            const _0xd771af = _0xcdc10e['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0xd771af)
                return null;
            let _0x51fb2a = _0xd771af['getAttribute']('href');
            if (!_0x51fb2a['startsWith']('http'))
                _0x51fb2a = 'https://ehi.link' + _0x51fb2a;
            const _0x4baab1 = await _0x0_0x4ce04b(_0x51fb2a);
            return await decryptHTTPInjector(await _0x4baab1['buffer']());
        } catch (_0x1147be) {
            return null;
        }
    }
}
export {
    TDecryptor
};