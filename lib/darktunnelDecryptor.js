import _0x0_0x2a784a from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x298170) {
    let _0x5e30fe = _0x298170['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x5e30fe['length'] % 0x4 !== 0x0)
        _0x5e30fe += '=';
    return Buffer['from'](_0x5e30fe, 'base64');
}
function aesCfbDecrypt(_0x358d71, _0x58e734, _0x3dfbfa, _0x407a67 = 0x100) {
    const _0x2faf3c = _0x407a67 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x4e2f26 = _0x0_0x2a784a['createDecipheriv'](_0x2faf3c, _0x58e734, _0x3dfbfa);
    return Buffer['concat']([
        _0x4e2f26['update'](_0x358d71),
        _0x4e2f26['final']()
    ]);
}
function cleanAndDecryptTree(_0x1331d3) {
    if (!_0x1331d3 || typeof _0x1331d3 !== 'object')
        return _0x1331d3;
    if (Array['isArray'](_0x1331d3)) {
        return _0x1331d3['map'](_0x2e1f97 => cleanAndDecryptTree(_0x2e1f97));
    }
    const _0x25781c = {};
    for (let [_0x17aaad, _0x3722c6] of Object['entries'](_0x1331d3)) {
        if (_0x17aaad['toLowerCase']()['includes']('password') || _0x17aaad['toLowerCase']()['includes']('pass')) {
            _0x25781c[_0x17aaad] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x17aaad['startsWith']('Encrypted') && (_0x3722c6 instanceof Buffer || typeof _0x3722c6 === 'string')) {
            try {
                const _0x287942 = typeof _0x3722c6 === 'string' ? base64DecodeSafe(_0x3722c6) : _0x3722c6;
                const _0x429e7b = aesCfbDecrypt(_0x287942, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x3722c6 = cleanAndDecryptTree(unpack(_0x429e7b));
                } catch (_0x3cd425) {
                    _0x3722c6 = _0x429e7b['toString']('utf-8');
                }
                _0x17aaad = _0x17aaad['replace']('Encrypted', 'Decrypted');
            } catch (_0x44952a) {
            }
        } else if (_0x3722c6 instanceof Buffer) {
            _0x3722c6 = _0x3722c6['toString']('utf-8');
        } else if (typeof _0x3722c6 === 'object') {
            _0x3722c6 = cleanAndDecryptTree(_0x3722c6);
        }
        if (typeof _0x3722c6 === 'string' && (_0x3722c6['startsWith']('{') || _0x3722c6['startsWith']('['))) {
            try {
                _0x3722c6 = JSON['parse'](_0x3722c6);
            } catch (_0x9b4f7b) {
            }
        }
        _0x25781c[_0x17aaad] = _0x3722c6;
    }
    return _0x25781c;
}
export function decryptDarkTunnel(_0x424cf0) {
    try {
        let _0x27d4da = _0x424cf0['toString']('utf-8')['trim']();
        if (_0x27d4da['includes']('://'))
            _0x27d4da = _0x27d4da['split']('://')[0x1];
        const _0x254ee5 = JSON['parse'](base64DecodeSafe(_0x27d4da)['toString']('utf-8'));
        if (!_0x254ee5['encryptedLockedConfig'])
            return null;
        const _0xd14da8 = base64DecodeSafe(_0x254ee5['encryptedLockedConfig']);
        const _0x5d0182 = aesCfbDecrypt(_0xd14da8, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x544ede = unpack(_0x5d0182);
        const _0x10be86 = cleanAndDecryptTree(_0x544ede);
        _0x254ee5['encryptedLockedConfig'] = _0x10be86;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x254ee5, null, 0x4);
    } catch (_0x368951) {
        return null;
    }
}