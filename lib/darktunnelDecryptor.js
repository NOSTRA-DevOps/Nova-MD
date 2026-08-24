import _0x0_0x732d49 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x31edd9) {
    let _0xdc8053 = _0x31edd9['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0xdc8053['length'] % 0x4 !== 0x0)
        _0xdc8053 += '=';
    return Buffer['from'](_0xdc8053, 'base64');
}
function aesCfbDecrypt(_0x368863, _0x23b706, _0x4f4c27, _0x574a0a = 0x100) {
    const _0x77c5b0 = _0x574a0a === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x43af89 = _0x0_0x732d49['createDecipheriv'](_0x77c5b0, _0x23b706, _0x4f4c27);
    return Buffer['concat']([
        _0x43af89['update'](_0x368863),
        _0x43af89['final']()
    ]);
}
function cleanAndDecryptTree(_0x5d2f8e) {
    if (!_0x5d2f8e || typeof _0x5d2f8e !== 'object')
        return _0x5d2f8e;
    if (Array['isArray'](_0x5d2f8e)) {
        return _0x5d2f8e['map'](_0x132ec6 => cleanAndDecryptTree(_0x132ec6));
    }
    const _0x2c198c = {};
    for (let [_0x116bf5, _0x555a16] of Object['entries'](_0x5d2f8e)) {
        if (_0x116bf5['toLowerCase']()['includes']('password') || _0x116bf5['toLowerCase']()['includes']('pass')) {
            _0x2c198c[_0x116bf5] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x116bf5['startsWith']('Encrypted') && (_0x555a16 instanceof Buffer || typeof _0x555a16 === 'string')) {
            try {
                const _0x446984 = typeof _0x555a16 === 'string' ? base64DecodeSafe(_0x555a16) : _0x555a16;
                const _0x470c7f = aesCfbDecrypt(_0x446984, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x555a16 = cleanAndDecryptTree(unpack(_0x470c7f));
                } catch (_0x5ec03a) {
                    _0x555a16 = _0x470c7f['toString']('utf-8');
                }
                _0x116bf5 = _0x116bf5['replace']('Encrypted', 'Decrypted');
            } catch (_0x57bea9) {
            }
        } else if (_0x555a16 instanceof Buffer) {
            _0x555a16 = _0x555a16['toString']('utf-8');
        } else if (typeof _0x555a16 === 'object') {
            _0x555a16 = cleanAndDecryptTree(_0x555a16);
        }
        if (typeof _0x555a16 === 'string' && (_0x555a16['startsWith']('{') || _0x555a16['startsWith']('['))) {
            try {
                _0x555a16 = JSON['parse'](_0x555a16);
            } catch (_0x4f99bf) {
            }
        }
        _0x2c198c[_0x116bf5] = _0x555a16;
    }
    return _0x2c198c;
}
export function decryptDarkTunnel(_0x3da5f0) {
    try {
        let _0x3b8f35 = _0x3da5f0['toString']('utf-8')['trim']();
        if (_0x3b8f35['includes']('://'))
            _0x3b8f35 = _0x3b8f35['split']('://')[0x1];
        const _0x29bb33 = JSON['parse'](base64DecodeSafe(_0x3b8f35)['toString']('utf-8'));
        if (!_0x29bb33['encryptedLockedConfig'])
            return null;
        const _0x38b19f = base64DecodeSafe(_0x29bb33['encryptedLockedConfig']);
        const _0x3faf60 = aesCfbDecrypt(_0x38b19f, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x5ae100 = unpack(_0x3faf60);
        const _0x491df5 = cleanAndDecryptTree(_0x5ae100);
        _0x29bb33['encryptedLockedConfig'] = _0x491df5;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x29bb33, null, 0x4);
    } catch (_0x129eaf) {
        return null;
    }
}