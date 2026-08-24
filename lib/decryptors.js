import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x33c757 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x272967) {
        return decryptSSC(_0x272967);
    }
    static ['decryptDarkTunnel'](_0x25d30f) {
        return decryptDarkTunnel(_0x25d30f);
    }
    static ['decryptHTTPCustom'](_0x275bac) {
        return decryptHTTPCustom(_0x275bac);
    }
    static async ['decryptHTTPInjector'](_0x155a7b) {
        return await decryptHTTPInjector(_0x155a7b);
    }
    static ['decryptNPVTunnel'](_0x483dcb) {
        return decryptNPVTunnel(_0x483dcb);
    }
    static async ['downloadAndDecryptEhiLink'](_0x30c6cf) {
        try {
            const _0x19038c = await _0x0_0x33c757(_0x30c6cf, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x5b7fe4 = await _0x19038c['text']();
            const _0x16f93c = parse(_0x5b7fe4);
            const _0x2057cd = _0x16f93c['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x2057cd)
                return null;
            let _0xd566ee = _0x2057cd['getAttribute']('href');
            if (!_0xd566ee['startsWith']('http'))
                _0xd566ee = 'https://ehi.link' + _0xd566ee;
            const _0x16762b = await _0x0_0x33c757(_0xd566ee);
            return await decryptHTTPInjector(await _0x16762b['buffer']());
        } catch (_0x421822) {
            return null;
        }
    }
}
export {
    TDecryptor
};