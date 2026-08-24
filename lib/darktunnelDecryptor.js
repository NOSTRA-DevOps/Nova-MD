import _0x0_0xe0dcea from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x16f6fc) {
    let _0x42be21 = _0x16f6fc['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x42be21['length'] % 0x4 !== 0x0)
        _0x42be21 += '=';
    return Buffer['from'](_0x42be21, 'base64');
}
function aesCfbDecrypt(_0x6c55bf, _0x1dbac9, _0x43a823, _0x511d8a = 0x100) {
    const _0x1ae2a3 = _0x511d8a === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x5982c7 = _0x0_0xe0dcea['createDecipheriv'](_0x1ae2a3, _0x1dbac9, _0x43a823);
    return Buffer['concat']([
        _0x5982c7['update'](_0x6c55bf),
        _0x5982c7['final']()
    ]);
}
function cleanAndDecryptTree(_0x23b656) {
    if (!_0x23b656 || typeof _0x23b656 !== 'object')
        return _0x23b656;
    if (Array['isArray'](_0x23b656)) {
        return _0x23b656['map'](_0x1a5fcf => cleanAndDecryptTree(_0x1a5fcf));
    }
    const _0x358d9a = {};
    for (let [_0x15f05c, _0x1836b6] of Object['entries'](_0x23b656)) {
        if (_0x15f05c['toLowerCase']()['includes']('password') || _0x15f05c['toLowerCase']()['includes']('pass')) {
            _0x358d9a[_0x15f05c] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x15f05c['startsWith']('Encrypted') && (_0x1836b6 instanceof Buffer || typeof _0x1836b6 === 'string')) {
            try {
                const _0x5068e4 = typeof _0x1836b6 === 'string' ? base64DecodeSafe(_0x1836b6) : _0x1836b6;
                const _0x4f2f21 = aesCfbDecrypt(_0x5068e4, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x1836b6 = cleanAndDecryptTree(unpack(_0x4f2f21));
                } catch (_0x566989) {
                    _0x1836b6 = _0x4f2f21['toString']('utf-8');
                }
                _0x15f05c = _0x15f05c['replace']('Encrypted', 'Decrypted');
            } catch (_0x3bf3ef) {
            }
        } else if (_0x1836b6 instanceof Buffer) {
            _0x1836b6 = _0x1836b6['toString']('utf-8');
        } else if (typeof _0x1836b6 === 'object') {
            _0x1836b6 = cleanAndDecryptTree(_0x1836b6);
        }
        if (typeof _0x1836b6 === 'string' && (_0x1836b6['startsWith']('{') || _0x1836b6['startsWith']('['))) {
            try {
                _0x1836b6 = JSON['parse'](_0x1836b6);
            } catch (_0x4917fe) {
            }
        }
        _0x358d9a[_0x15f05c] = _0x1836b6;
    }
    return _0x358d9a;
}
export function decryptDarkTunnel(_0x4ae704) {
    try {
        let _0x52d81e = _0x4ae704['toString']('utf-8')['trim']();
        if (_0x52d81e['includes']('://'))
            _0x52d81e = _0x52d81e['split']('://')[0x1];
        const _0x4f2169 = JSON['parse'](base64DecodeSafe(_0x52d81e)['toString']('utf-8'));
        if (!_0x4f2169['encryptedLockedConfig'])
            return null;
        const _0x224499 = base64DecodeSafe(_0x4f2169['encryptedLockedConfig']);
        const _0x3c7f77 = aesCfbDecrypt(_0x224499, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x4d898e = unpack(_0x3c7f77);
        const _0xc4c5fd = cleanAndDecryptTree(_0x4d898e);
        _0x4f2169['encryptedLockedConfig'] = _0xc4c5fd;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x4f2169, null, 0x4);
    } catch (_0x4a8e1d) {
        return null;
    }
}