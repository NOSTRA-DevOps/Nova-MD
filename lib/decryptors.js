import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x4c54ea from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x188d0d) {
        return decryptSSC(_0x188d0d);
    }
    static ['decryptDarkTunnel'](_0x222d79) {
        return decryptDarkTunnel(_0x222d79);
    }
    static ['decryptHTTPCustom'](_0x69e7b9) {
        return decryptHTTPCustom(_0x69e7b9);
    }
    static async ['decryptHTTPInjector'](_0x116845) {
        return await decryptHTTPInjector(_0x116845);
    }
    static ['decryptNPVTunnel'](_0x197bbe) {
        return decryptNPVTunnel(_0x197bbe);
    }
    static async ['downloadAndDecryptEhiLink'](_0x5a41eb) {
        try {
            const _0x536d72 = await _0x0_0x4c54ea(_0x5a41eb, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x4d7394 = await _0x536d72['text']();
            const _0x114cda = parse(_0x4d7394);
            const _0x5ead1e = _0x114cda['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x5ead1e)
                return null;
            let _0x492050 = _0x5ead1e['getAttribute']('href');
            if (!_0x492050['startsWith']('http'))
                _0x492050 = 'https://ehi.link' + _0x492050;
            const _0x21c28d = await _0x0_0x4c54ea(_0x492050);
            return await decryptHTTPInjector(await _0x21c28d['buffer']());
        } catch (_0x63714a) {
            return null;
        }
    }
}
export {
    TDecryptor
};