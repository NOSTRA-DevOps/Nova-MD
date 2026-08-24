import _0x0_0x1f337f from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x2757ec) {
    let _0x27f06b = _0x2757ec['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x27f06b['length'] % 0x4 !== 0x0)
        _0x27f06b += '=';
    return Buffer['from'](_0x27f06b, 'base64');
}
function aesCfbDecrypt(_0x3198e2, _0x18c959, _0x214de4, _0x38740a = 0x100) {
    const _0x44e5fc = _0x38740a === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x234d4b = _0x0_0x1f337f['createDecipheriv'](_0x44e5fc, _0x18c959, _0x214de4);
    return Buffer['concat']([
        _0x234d4b['update'](_0x3198e2),
        _0x234d4b['final']()
    ]);
}
function cleanAndDecryptTree(_0x429b98) {
    if (!_0x429b98 || typeof _0x429b98 !== 'object')
        return _0x429b98;
    if (Array['isArray'](_0x429b98)) {
        return _0x429b98['map'](_0x527e75 => cleanAndDecryptTree(_0x527e75));
    }
    const _0x398eb1 = {};
    for (let [_0x371061, _0x3a8ee2] of Object['entries'](_0x429b98)) {
        if (_0x371061['toLowerCase']()['includes']('password') || _0x371061['toLowerCase']()['includes']('pass')) {
            _0x398eb1[_0x371061] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x371061['startsWith']('Encrypted') && (_0x3a8ee2 instanceof Buffer || typeof _0x3a8ee2 === 'string')) {
            try {
                const _0x1bdcc7 = typeof _0x3a8ee2 === 'string' ? base64DecodeSafe(_0x3a8ee2) : _0x3a8ee2;
                const _0x2a5e1e = aesCfbDecrypt(_0x1bdcc7, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x3a8ee2 = cleanAndDecryptTree(unpack(_0x2a5e1e));
                } catch (_0x595375) {
                    _0x3a8ee2 = _0x2a5e1e['toString']('utf-8');
                }
                _0x371061 = _0x371061['replace']('Encrypted', 'Decrypted');
            } catch (_0x3af3a9) {
            }
        } else if (_0x3a8ee2 instanceof Buffer) {
            _0x3a8ee2 = _0x3a8ee2['toString']('utf-8');
        } else if (typeof _0x3a8ee2 === 'object') {
            _0x3a8ee2 = cleanAndDecryptTree(_0x3a8ee2);
        }
        if (typeof _0x3a8ee2 === 'string' && (_0x3a8ee2['startsWith']('{') || _0x3a8ee2['startsWith']('['))) {
            try {
                _0x3a8ee2 = JSON['parse'](_0x3a8ee2);
            } catch (_0x835970) {
            }
        }
        _0x398eb1[_0x371061] = _0x3a8ee2;
    }
    return _0x398eb1;
}
export function decryptDarkTunnel(_0x1996fe) {
    try {
        let _0x1550e3 = _0x1996fe['toString']('utf-8')['trim']();
        if (_0x1550e3['includes']('://'))
            _0x1550e3 = _0x1550e3['split']('://')[0x1];
        const _0x5ea8dc = JSON['parse'](base64DecodeSafe(_0x1550e3)['toString']('utf-8'));
        if (!_0x5ea8dc['encryptedLockedConfig'])
            return null;
        const _0x3faa40 = base64DecodeSafe(_0x5ea8dc['encryptedLockedConfig']);
        const _0x50a373 = aesCfbDecrypt(_0x3faa40, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x13ef3d = unpack(_0x50a373);
        const _0x499bda = cleanAndDecryptTree(_0x13ef3d);
        _0x5ea8dc['encryptedLockedConfig'] = _0x499bda;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x5ea8dc, null, 0x4);
    } catch (_0x49e5aa) {
        return null;
    }
}