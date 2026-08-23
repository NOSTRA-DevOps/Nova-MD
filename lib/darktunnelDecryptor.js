import _0x0_0x1e310f from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x180e6b) {
    let _0x56fa51 = _0x180e6b['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x56fa51['length'] % 0x4 !== 0x0)
        _0x56fa51 += '=';
    return Buffer['from'](_0x56fa51, 'base64');
}
function aesCfbDecrypt(_0x14879a, _0x17adf7, _0x2a3c0f, _0xc62681 = 0x100) {
    const _0x46deb2 = _0xc62681 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x16451e = _0x0_0x1e310f['createDecipheriv'](_0x46deb2, _0x17adf7, _0x2a3c0f);
    return Buffer['concat']([
        _0x16451e['update'](_0x14879a),
        _0x16451e['final']()
    ]);
}
function cleanAndDecryptTree(_0xdb3fd3) {
    if (!_0xdb3fd3 || typeof _0xdb3fd3 !== 'object')
        return _0xdb3fd3;
    if (Array['isArray'](_0xdb3fd3)) {
        return _0xdb3fd3['map'](_0x54d5bd => cleanAndDecryptTree(_0x54d5bd));
    }
    const _0xebd094 = {};
    for (let [_0x4591c8, _0x5098dd] of Object['entries'](_0xdb3fd3)) {
        if (_0x4591c8['toLowerCase']()['includes']('password') || _0x4591c8['toLowerCase']()['includes']('pass')) {
            _0xebd094[_0x4591c8] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x4591c8['startsWith']('Encrypted') && (_0x5098dd instanceof Buffer || typeof _0x5098dd === 'string')) {
            try {
                const _0x2f6413 = typeof _0x5098dd === 'string' ? base64DecodeSafe(_0x5098dd) : _0x5098dd;
                const _0x36efbb = aesCfbDecrypt(_0x2f6413, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x5098dd = cleanAndDecryptTree(unpack(_0x36efbb));
                } catch (_0x5d473d) {
                    _0x5098dd = _0x36efbb['toString']('utf-8');
                }
                _0x4591c8 = _0x4591c8['replace']('Encrypted', 'Decrypted');
            } catch (_0x28c905) {
            }
        } else if (_0x5098dd instanceof Buffer) {
            _0x5098dd = _0x5098dd['toString']('utf-8');
        } else if (typeof _0x5098dd === 'object') {
            _0x5098dd = cleanAndDecryptTree(_0x5098dd);
        }
        if (typeof _0x5098dd === 'string' && (_0x5098dd['startsWith']('{') || _0x5098dd['startsWith']('['))) {
            try {
                _0x5098dd = JSON['parse'](_0x5098dd);
            } catch (_0x2fabb7) {
            }
        }
        _0xebd094[_0x4591c8] = _0x5098dd;
    }
    return _0xebd094;
}
export function decryptDarkTunnel(_0x254bdc) {
    try {
        let _0x175ef1 = _0x254bdc['toString']('utf-8')['trim']();
        if (_0x175ef1['includes']('://'))
            _0x175ef1 = _0x175ef1['split']('://')[0x1];
        const _0x38a2ea = JSON['parse'](base64DecodeSafe(_0x175ef1)['toString']('utf-8'));
        if (!_0x38a2ea['encryptedLockedConfig'])
            return null;
        const _0x4b4f8d = base64DecodeSafe(_0x38a2ea['encryptedLockedConfig']);
        const _0x2ce8b2 = aesCfbDecrypt(_0x4b4f8d, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x446a34 = unpack(_0x2ce8b2);
        const _0x491d8e = cleanAndDecryptTree(_0x446a34);
        _0x38a2ea['encryptedLockedConfig'] = _0x491d8e;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x38a2ea, null, 0x4);
    } catch (_0x27db26) {
        return null;
    }
}