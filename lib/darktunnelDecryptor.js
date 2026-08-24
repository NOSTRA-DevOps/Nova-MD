import _0x0_0x37fba5 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x2d5cbd) {
    let _0x1c22a4 = _0x2d5cbd['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x1c22a4['length'] % 0x4 !== 0x0)
        _0x1c22a4 += '=';
    return Buffer['from'](_0x1c22a4, 'base64');
}
function aesCfbDecrypt(_0x1c8212, _0x279cce, _0x2206ba, _0x494109 = 0x100) {
    const _0x21e3c9 = _0x494109 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x16cea2 = _0x0_0x37fba5['createDecipheriv'](_0x21e3c9, _0x279cce, _0x2206ba);
    return Buffer['concat']([
        _0x16cea2['update'](_0x1c8212),
        _0x16cea2['final']()
    ]);
}
function cleanAndDecryptTree(_0x3bb27d) {
    if (!_0x3bb27d || typeof _0x3bb27d !== 'object')
        return _0x3bb27d;
    if (Array['isArray'](_0x3bb27d)) {
        return _0x3bb27d['map'](_0x931901 => cleanAndDecryptTree(_0x931901));
    }
    const _0x170c3f = {};
    for (let [_0x341226, _0xa263a6] of Object['entries'](_0x3bb27d)) {
        if (_0x341226['toLowerCase']()['includes']('password') || _0x341226['toLowerCase']()['includes']('pass')) {
            _0x170c3f[_0x341226] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x341226['startsWith']('Encrypted') && (_0xa263a6 instanceof Buffer || typeof _0xa263a6 === 'string')) {
            try {
                const _0x162aeb = typeof _0xa263a6 === 'string' ? base64DecodeSafe(_0xa263a6) : _0xa263a6;
                const _0x58bf72 = aesCfbDecrypt(_0x162aeb, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0xa263a6 = cleanAndDecryptTree(unpack(_0x58bf72));
                } catch (_0x31d31f) {
                    _0xa263a6 = _0x58bf72['toString']('utf-8');
                }
                _0x341226 = _0x341226['replace']('Encrypted', 'Decrypted');
            } catch (_0x66e368) {
            }
        } else if (_0xa263a6 instanceof Buffer) {
            _0xa263a6 = _0xa263a6['toString']('utf-8');
        } else if (typeof _0xa263a6 === 'object') {
            _0xa263a6 = cleanAndDecryptTree(_0xa263a6);
        }
        if (typeof _0xa263a6 === 'string' && (_0xa263a6['startsWith']('{') || _0xa263a6['startsWith']('['))) {
            try {
                _0xa263a6 = JSON['parse'](_0xa263a6);
            } catch (_0x525873) {
            }
        }
        _0x170c3f[_0x341226] = _0xa263a6;
    }
    return _0x170c3f;
}
export function decryptDarkTunnel(_0x23c680) {
    try {
        let _0x13d072 = _0x23c680['toString']('utf-8')['trim']();
        if (_0x13d072['includes']('://'))
            _0x13d072 = _0x13d072['split']('://')[0x1];
        const _0x68b9b9 = JSON['parse'](base64DecodeSafe(_0x13d072)['toString']('utf-8'));
        if (!_0x68b9b9['encryptedLockedConfig'])
            return null;
        const _0xa9a6e4 = base64DecodeSafe(_0x68b9b9['encryptedLockedConfig']);
        const _0x549198 = aesCfbDecrypt(_0xa9a6e4, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x2cd504 = unpack(_0x549198);
        const _0x301f5b = cleanAndDecryptTree(_0x2cd504);
        _0x68b9b9['encryptedLockedConfig'] = _0x301f5b;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x68b9b9, null, 0x4);
    } catch (_0x1917c5) {
        return null;
    }
}