import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x5700e7 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x328a06) {
        return decryptSSC(_0x328a06);
    }
    static ['decryptDarkTunnel'](_0x3f8d9c) {
        return decryptDarkTunnel(_0x3f8d9c);
    }
    static ['decryptHTTPCustom'](_0x176e8e) {
        return decryptHTTPCustom(_0x176e8e);
    }
    static async ['decryptHTTPInjector'](_0x52d34b) {
        return await decryptHTTPInjector(_0x52d34b);
    }
    static ['decryptNPVTunnel'](_0x2ea632) {
        return decryptNPVTunnel(_0x2ea632);
    }
    static async ['downloadAndDecryptEhiLink'](_0x337830) {
        try {
            const _0xd0ee4f = await _0x0_0x5700e7(_0x337830, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x21303d = await _0xd0ee4f['text']();
            const _0x43938b = parse(_0x21303d);
            const _0x8c320f = _0x43938b['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x8c320f)
                return null;
            let _0x87801c = _0x8c320f['getAttribute']('href');
            if (!_0x87801c['startsWith']('http'))
                _0x87801c = 'https://ehi.link' + _0x87801c;
            const _0x342470 = await _0x0_0x5700e7(_0x87801c);
            return await decryptHTTPInjector(await _0x342470['buffer']());
        } catch (_0x5ddd40) {
            return null;
        }
    }
}
export {
    TDecryptor
};