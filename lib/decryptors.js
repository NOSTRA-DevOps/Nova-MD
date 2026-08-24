import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x24caf5 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0x10e145) {
        return decryptSSC(_0x10e145);
    }
    static ['decryptDarkTunnel'](_0x53fd79) {
        return decryptDarkTunnel(_0x53fd79);
    }
    static ['decryptHTTPCustom'](_0x2399f2) {
        return decryptHTTPCustom(_0x2399f2);
    }
    static async ['decryptHTTPInjector'](_0x37fdbb) {
        return await decryptHTTPInjector(_0x37fdbb);
    }
    static ['decryptNPVTunnel'](_0x5e2711) {
        return decryptNPVTunnel(_0x5e2711);
    }
    static async ['downloadAndDecryptEhiLink'](_0x3a42ea) {
        try {
            const _0x1b8fae = await _0x0_0x24caf5(_0x3a42ea, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0xa31431 = await _0x1b8fae['text']();
            const _0x591542 = parse(_0xa31431);
            const _0x472ecd = _0x591542['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x472ecd)
                return null;
            let _0x4734a5 = _0x472ecd['getAttribute']('href');
            if (!_0x4734a5['startsWith']('http'))
                _0x4734a5 = 'https://ehi.link' + _0x4734a5;
            const _0x49ad30 = await _0x0_0x24caf5(_0x4734a5);
            return await decryptHTTPInjector(await _0x49ad30['buffer']());
        } catch (_0x1fa313) {
            return null;
        }
    }
}
export {
    TDecryptor
};