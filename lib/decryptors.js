import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x323d0b from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x4e3927) {
        return decryptSSC(_0x4e3927);
    }
    static ['decryptDarkTunnel'](_0x15b956) {
        return decryptDarkTunnel(_0x15b956);
    }
    static ['decryptHTTPCustom'](_0x22d370) {
        return decryptHTTPCustom(_0x22d370);
    }
    static async ['decryptHTTPInjector'](_0x34a7fe) {
        return await decryptHTTPInjector(_0x34a7fe);
    }
    static ['decryptNPVTunnel'](_0xc9ad0) {
        return decryptNPVTunnel(_0xc9ad0);
    }
    static async ['downloadAndDecryptEhiLink'](_0x4fd9ef) {
        try {
            const _0x45b5d9 = await _0x0_0x323d0b(_0x4fd9ef, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x108a21 = await _0x45b5d9['text']();
            const _0x53ab9f = parse(_0x108a21);
            const _0x592d23 = _0x53ab9f['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x592d23)
                return null;
            let _0x14e35d = _0x592d23['getAttribute']('href');
            if (!_0x14e35d['startsWith']('http'))
                _0x14e35d = 'https://ehi.link' + _0x14e35d;
            const _0x266ef9 = await _0x0_0x323d0b(_0x14e35d);
            return await decryptHTTPInjector(await _0x266ef9['buffer']());
        } catch (_0x192191) {
            return null;
        }
    }
}
export {
    TDecryptor
};