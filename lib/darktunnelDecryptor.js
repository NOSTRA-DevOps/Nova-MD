import _0x0_0x1b3145 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x18d71f) {
    let _0x356659 = _0x18d71f['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x356659['length'] % 0x4 !== 0x0)
        _0x356659 += '=';
    return Buffer['from'](_0x356659, 'base64');
}
function aesCfbDecrypt(_0x25996f, _0x56991e, _0x9e22a8, _0x7176bd = 0x100) {
    const _0x2383a3 = _0x7176bd === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x428bfe = _0x0_0x1b3145['createDecipheriv'](_0x2383a3, _0x56991e, _0x9e22a8);
    return Buffer['concat']([
        _0x428bfe['update'](_0x25996f),
        _0x428bfe['final']()
    ]);
}
function cleanAndDecryptTree(_0x2bb0c7) {
    if (!_0x2bb0c7 || typeof _0x2bb0c7 !== 'object')
        return _0x2bb0c7;
    if (Array['isArray'](_0x2bb0c7)) {
        return _0x2bb0c7['map'](_0x1a69b2 => cleanAndDecryptTree(_0x1a69b2));
    }
    const _0x16774a = {};
    for (let [_0x88f835, _0x1c2a02] of Object['entries'](_0x2bb0c7)) {
        if (_0x88f835['toLowerCase']()['includes']('password') || _0x88f835['toLowerCase']()['includes']('pass')) {
            _0x16774a[_0x88f835] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x88f835['startsWith']('Encrypted') && (_0x1c2a02 instanceof Buffer || typeof _0x1c2a02 === 'string')) {
            try {
                const _0xf3b0ac = typeof _0x1c2a02 === 'string' ? base64DecodeSafe(_0x1c2a02) : _0x1c2a02;
                const _0x4298b1 = aesCfbDecrypt(_0xf3b0ac, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x1c2a02 = cleanAndDecryptTree(unpack(_0x4298b1));
                } catch (_0x31e765) {
                    _0x1c2a02 = _0x4298b1['toString']('utf-8');
                }
                _0x88f835 = _0x88f835['replace']('Encrypted', 'Decrypted');
            } catch (_0xa413de) {
            }
        } else if (_0x1c2a02 instanceof Buffer) {
            _0x1c2a02 = _0x1c2a02['toString']('utf-8');
        } else if (typeof _0x1c2a02 === 'object') {
            _0x1c2a02 = cleanAndDecryptTree(_0x1c2a02);
        }
        if (typeof _0x1c2a02 === 'string' && (_0x1c2a02['startsWith']('{') || _0x1c2a02['startsWith']('['))) {
            try {
                _0x1c2a02 = JSON['parse'](_0x1c2a02);
            } catch (_0x5677b5) {
            }
        }
        _0x16774a[_0x88f835] = _0x1c2a02;
    }
    return _0x16774a;
}
export function decryptDarkTunnel(_0x1cf796) {
    try {
        let _0xc08758 = _0x1cf796['toString']('utf-8')['trim']();
        if (_0xc08758['includes']('://'))
            _0xc08758 = _0xc08758['split']('://')[0x1];
        const _0x1f9aad = JSON['parse'](base64DecodeSafe(_0xc08758)['toString']('utf-8'));
        if (!_0x1f9aad['encryptedLockedConfig'])
            return null;
        const _0x53a903 = base64DecodeSafe(_0x1f9aad['encryptedLockedConfig']);
        const _0x201e43 = aesCfbDecrypt(_0x53a903, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x56da02 = unpack(_0x201e43);
        const _0x8c6897 = cleanAndDecryptTree(_0x56da02);
        _0x1f9aad['encryptedLockedConfig'] = _0x8c6897;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x1f9aad, null, 0x4);
    } catch (_0x32f304) {
        return null;
    }
}