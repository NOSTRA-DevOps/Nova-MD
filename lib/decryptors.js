import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x4e590b from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x2b1119) {
        return decryptSSC(_0x2b1119);
    }
    static ['decryptDarkTunnel'](_0x1742fb) {
        return decryptDarkTunnel(_0x1742fb);
    }
    static ['decryptHTTPCustom'](_0x1e26ba) {
        return decryptHTTPCustom(_0x1e26ba);
    }
    static async ['decryptHTTPInjector'](_0x4332ed) {
        return await decryptHTTPInjector(_0x4332ed);
    }
    static ['decryptNPVTunnel'](_0x5d1b7b) {
        return decryptNPVTunnel(_0x5d1b7b);
    }
    static async ['downloadAndDecryptEhiLink'](_0x474939) {
        try {
            const _0x1e4e45 = await _0x0_0x4e590b(_0x474939, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x421f39 = await _0x1e4e45['text']();
            const _0x3740f4 = parse(_0x421f39);
            const _0x4260b4 = _0x3740f4['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x4260b4)
                return null;
            let _0x2390e6 = _0x4260b4['getAttribute']('href');
            if (!_0x2390e6['startsWith']('http'))
                _0x2390e6 = 'https://ehi.link' + _0x2390e6;
            const _0x5e2e88 = await _0x0_0x4e590b(_0x2390e6);
            return await decryptHTTPInjector(await _0x5e2e88['buffer']());
        } catch (_0x5c2c64) {
            return null;
        }
    }
}
export {
    TDecryptor
};