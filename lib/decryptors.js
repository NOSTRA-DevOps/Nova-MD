import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x577b0a from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x57c748) {
        return decryptSSC(_0x57c748);
    }
    static ['decryptDarkTunnel'](_0x51d66a) {
        return decryptDarkTunnel(_0x51d66a);
    }
    static ['decryptHTTPCustom'](_0x2048ce) {
        return decryptHTTPCustom(_0x2048ce);
    }
    static async ['decryptHTTPInjector'](_0x176ccc) {
        return await decryptHTTPInjector(_0x176ccc);
    }
    static ['decryptNPVTunnel'](_0x127219) {
        return decryptNPVTunnel(_0x127219);
    }
    static async ['downloadAndDecryptEhiLink'](_0x583ca1) {
        try {
            const _0x208134 = await _0x0_0x577b0a(_0x583ca1, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x117b8c = await _0x208134['text']();
            const _0x493b76 = parse(_0x117b8c);
            const _0x56d079 = _0x493b76['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x56d079)
                return null;
            let _0x424eac = _0x56d079['getAttribute']('href');
            if (!_0x424eac['startsWith']('http'))
                _0x424eac = 'https://ehi.link' + _0x424eac;
            const _0x62c5ce = await _0x0_0x577b0a(_0x424eac);
            return await decryptHTTPInjector(await _0x62c5ce['buffer']());
        } catch (_0x5e68b7) {
            return null;
        }
    }
}
export {
    TDecryptor
};