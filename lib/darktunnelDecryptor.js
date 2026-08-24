import _0x0_0x3ecb5a from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x15b6b0) {
    let _0x47b637 = _0x15b6b0['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x47b637['length'] % 0x4 !== 0x0)
        _0x47b637 += '=';
    return Buffer['from'](_0x47b637, 'base64');
}
function aesCfbDecrypt(_0x304681, _0x376074, _0x3a92df, _0x466a65 = 0x100) {
    const _0x20bd7c = _0x466a65 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x11d554 = _0x0_0x3ecb5a['createDecipheriv'](_0x20bd7c, _0x376074, _0x3a92df);
    return Buffer['concat']([
        _0x11d554['update'](_0x304681),
        _0x11d554['final']()
    ]);
}
function cleanAndDecryptTree(_0x368dc7) {
    if (!_0x368dc7 || typeof _0x368dc7 !== 'object')
        return _0x368dc7;
    if (Array['isArray'](_0x368dc7)) {
        return _0x368dc7['map'](_0xbe217 => cleanAndDecryptTree(_0xbe217));
    }
    const _0x46cfbe = {};
    for (let [_0x23f218, _0x15678b] of Object['entries'](_0x368dc7)) {
        if (_0x23f218['toLowerCase']()['includes']('password') || _0x23f218['toLowerCase']()['includes']('pass')) {
            _0x46cfbe[_0x23f218] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x23f218['startsWith']('Encrypted') && (_0x15678b instanceof Buffer || typeof _0x15678b === 'string')) {
            try {
                const _0x52661a = typeof _0x15678b === 'string' ? base64DecodeSafe(_0x15678b) : _0x15678b;
                const _0x2fca8a = aesCfbDecrypt(_0x52661a, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x15678b = cleanAndDecryptTree(unpack(_0x2fca8a));
                } catch (_0x5025c3) {
                    _0x15678b = _0x2fca8a['toString']('utf-8');
                }
                _0x23f218 = _0x23f218['replace']('Encrypted', 'Decrypted');
            } catch (_0x293810) {
            }
        } else if (_0x15678b instanceof Buffer) {
            _0x15678b = _0x15678b['toString']('utf-8');
        } else if (typeof _0x15678b === 'object') {
            _0x15678b = cleanAndDecryptTree(_0x15678b);
        }
        if (typeof _0x15678b === 'string' && (_0x15678b['startsWith']('{') || _0x15678b['startsWith']('['))) {
            try {
                _0x15678b = JSON['parse'](_0x15678b);
            } catch (_0x21db3e) {
            }
        }
        _0x46cfbe[_0x23f218] = _0x15678b;
    }
    return _0x46cfbe;
}
export function decryptDarkTunnel(_0x201717) {
    try {
        let _0x404ba4 = _0x201717['toString']('utf-8')['trim']();
        if (_0x404ba4['includes']('://'))
            _0x404ba4 = _0x404ba4['split']('://')[0x1];
        const _0x14e0b4 = JSON['parse'](base64DecodeSafe(_0x404ba4)['toString']('utf-8'));
        if (!_0x14e0b4['encryptedLockedConfig'])
            return null;
        const _0x2a5c52 = base64DecodeSafe(_0x14e0b4['encryptedLockedConfig']);
        const _0x52c349 = aesCfbDecrypt(_0x2a5c52, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x1c7f1a = unpack(_0x52c349);
        const _0x227668 = cleanAndDecryptTree(_0x1c7f1a);
        _0x14e0b4['encryptedLockedConfig'] = _0x227668;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x14e0b4, null, 0x4);
    } catch (_0x1d0b6f) {
        return null;
    }
}