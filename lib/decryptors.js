import { decryptSSC } from './sscDecryptor.js';
import { decryptDarkTunnel } from './darktunnelDecryptor.js';
import { decryptHTTPCustom } from './httpcustomDecryptor.js';
import { decryptHTTPInjector } from './httpinjectorDecryptor.js';
import { decryptNPVTunnel } from './npvtunnelDecryptor.js';
import { parse } from 'node-html-parser';
import _0x0_0x41ebc6 from 'node-fetch';
class TDecryptor {
    static ['decryptSSC'](_0xa1a052) {
        return decryptSSC(_0xa1a052);
    }
    static ['decryptDarkTunnel'](_0x342cbe) {
        return decryptDarkTunnel(_0x342cbe);
    }
    static ['decryptHTTPCustom'](_0x50d3e3) {
        return decryptHTTPCustom(_0x50d3e3);
    }
    static async ['decryptHTTPInjector'](_0x521d72) {
        return await decryptHTTPInjector(_0x521d72);
    }
    static ['decryptNPVTunnel'](_0x573757) {
        return decryptNPVTunnel(_0x573757);
    }
    static async ['downloadAndDecryptEhiLink'](_0x5ea56c) {
        try {
            const _0x4ddaeb = await _0x0_0x41ebc6(_0x5ea56c, { 'headers': { 'User-Agent': 'Mozilla/5.0' } });
            const _0x2fa4af = await _0x4ddaeb['text']();
            const _0x5a5133 = parse(_0x2fa4af);
            const _0x7fb93f = _0x5a5133['querySelector']('a[href*=\x22.ehi\x22]');
            if (!_0x7fb93f)
                return null;
            let _0x1de40b = _0x7fb93f['getAttribute']('href');
            if (!_0x1de40b['startsWith']('http'))
                _0x1de40b = 'https://ehi.link' + _0x1de40b;
            const _0x470db8 = await _0x0_0x41ebc6(_0x1de40b);
            return await decryptHTTPInjector(await _0x470db8['buffer']());
        } catch (_0x5a0552) {
            return null;
        }
    }
}
export {
    TDecryptor
};