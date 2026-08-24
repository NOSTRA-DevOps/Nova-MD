import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x26bc1d from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x2841f4) {
        return decryptSSC(_0x2841f4);
    }
    static ['decryptDarkTunnel'](_0x4fa705) {
        return decryptDarkTunnel(_0x4fa705);
    }
    static ['decryptHTTPCustom'](_0x4b6907) {
        return decryptHTTPCustom(_0x4b6907);
    }
    static async ['decryptHTTPInjector'](_0x5a22c3) {
        return await decryptHTTPInjector(_0x5a22c3);
    }
    static ['decryptNPVTunnel'](_0x2533ba) {
        return decryptNPVTunnel(_0x2533ba);
    }
    static async ['downloadAndDecryptEhiLink'](_0x5ac45b) {
        try {
            const _0x47474c = await _0x0_0x26bc1d(_0x5ac45b, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x5427d5 = await _0x47474c['text']();
            const _0x5d4d9f = parse(_0x5427d5);
            const _0x257783 = _0x5d4d9f['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x257783)
                return null;
            let _0x4d2988 = _0x257783['getAttribute']('href');
            if (!_0x4d2988['startsWith']('http'))
                _0x4d2988 = 'https://ehi.link' + _0x4d2988;
            const _0xa2d85e = await _0x0_0x26bc1d(_0x4d2988);
            return await decryptHTTPInjector(await _0xa2d85e['buffer']());
        } catch (_0x2d562f) {
            return null;
        }
    }
}
export {
    TDecryptor
};