import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x58566c from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x21d0f5) {
        return decryptSSC(_0x21d0f5);
    }
    static ['decryptDarkTunnel'](_0x4c403a) {
        return decryptDarkTunnel(_0x4c403a);
    }
    static ['decryptHTTPCustom'](_0xcd300a) {
        return decryptHTTPCustom(_0xcd300a);
    }
    static async ['decryptHTTPInjector'](_0x4eaacf) {
        return await decryptHTTPInjector(_0x4eaacf);
    }
    static ['decryptNPVTunnel'](_0xdf2378) {
        return decryptNPVTunnel(_0xdf2378);
    }
    static async ['downloadAndDecryptEhiLink'](_0x4a3c76) {
        try {
            const _0x248e34 = await _0x0_0x58566c(_0x4a3c76, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x1844bc = await _0x248e34['text']();
            const _0x30ac0f = parse(_0x1844bc);
            const _0xaf63d0 = _0x30ac0f['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0xaf63d0)
                return null;
            let _0x267c82 = _0xaf63d0['getAttribute']('href');
            if (!_0x267c82['startsWith']('http'))
                _0x267c82 = 'https://ehi.link' + _0x267c82;
            const _0x31261b = await _0x0_0x58566c(_0x267c82);
            return await decryptHTTPInjector(await _0x31261b['buffer']());
        } catch (_0x1e65e1) {
            return null;
        }
    }
}
export {
    TDecryptor
};