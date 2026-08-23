import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x37baf6 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x36e34d) {
        return decryptSSC(_0x36e34d);
    }
    static ['decryptDarkTunnel'](_0x516fb1) {
        return decryptDarkTunnel(_0x516fb1);
    }
    static ['decryptHTTPCustom'](_0x44ac0b) {
        return decryptHTTPCustom(_0x44ac0b);
    }
    static async ['decryptHTTPInjector'](_0x54e91a) {
        return await decryptHTTPInjector(_0x54e91a);
    }
    static ['decryptNPVTunnel'](_0x498b94) {
        return decryptNPVTunnel(_0x498b94);
    }
    static async ['downloadAndDecryptEhiLink'](_0x490eeb) {
        try {
            const _0x21bee7 = await _0x0_0x37baf6(_0x490eeb, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x2a1420 = await _0x21bee7['text']();
            const _0x3d407b = parse(_0x2a1420);
            const _0x25f9b7 = _0x3d407b['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x25f9b7)
                return null;
            let _0x3323ee = _0x25f9b7['getAttribute']('href');
            if (!_0x3323ee['startsWith']('http'))
                _0x3323ee = 'https://ehi.link' + _0x3323ee;
            const _0x3279b0 = await _0x0_0x37baf6(_0x3323ee);
            return await decryptHTTPInjector(await _0x3279b0['buffer']());
        } catch (_0x479379) {
            return null;
        }
    }
}
export {
    TDecryptor
};