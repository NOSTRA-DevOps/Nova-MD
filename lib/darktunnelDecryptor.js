import _0x0_0x58e8f7 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x1d5032) {
    let _0x20b6b9 = _0x1d5032['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x20b6b9['length'] % 0x4 !== 0x0)
        _0x20b6b9 += '=';
    return Buffer['from'](_0x20b6b9, 'base64');
}
function aesCfbDecrypt(_0x4f626b, _0x5c0d8f, _0x4b5aaa, _0x1d5ee5 = 0x100) {
    const _0x13eccd = _0x1d5ee5 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x3d2434 = _0x0_0x58e8f7['createDecipheriv'](_0x13eccd, _0x5c0d8f, _0x4b5aaa);
    return Buffer['concat']([
        _0x3d2434['update'](_0x4f626b),
        _0x3d2434['final']()
    ]);
}
function cleanAndDecryptTree(_0xf9a1c1) {
    if (!_0xf9a1c1 || typeof _0xf9a1c1 !== 'object')
        return _0xf9a1c1;
    if (Array['isArray'](_0xf9a1c1)) {
        return _0xf9a1c1['map'](_0x359ce0 => cleanAndDecryptTree(_0x359ce0));
    }
    const _0x1b0260 = {};
    for (let [_0xa7ee1b, _0x144007] of Object['entries'](_0xf9a1c1)) {
        if (_0xa7ee1b['toLowerCase']()['includes']('password') || _0xa7ee1b['toLowerCase']()['includes']('pass')) {
            _0x1b0260[_0xa7ee1b] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0xa7ee1b['startsWith']('Encrypted') && (_0x144007 instanceof Buffer || typeof _0x144007 === 'string')) {
            try {
                const _0x40a4d8 = typeof _0x144007 === 'string' ? base64DecodeSafe(_0x144007) : _0x144007;
                const _0x3a08b0 = aesCfbDecrypt(_0x40a4d8, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x144007 = cleanAndDecryptTree(unpack(_0x3a08b0));
                } catch (_0x107bc8) {
                    _0x144007 = _0x3a08b0['toString']('utf-8');
                }
                _0xa7ee1b = _0xa7ee1b['replace']('Encrypted', 'Decrypted');
            } catch (_0x1b461d) {
            }
        } else if (_0x144007 instanceof Buffer) {
            _0x144007 = _0x144007['toString']('utf-8');
        } else if (typeof _0x144007 === 'object') {
            _0x144007 = cleanAndDecryptTree(_0x144007);
        }
        if (typeof _0x144007 === 'string' && (_0x144007['startsWith']('{') || _0x144007['startsWith']('['))) {
            try {
                _0x144007 = JSON['parse'](_0x144007);
            } catch (_0x1f2eb7) {
            }
        }
        _0x1b0260[_0xa7ee1b] = _0x144007;
    }
    return _0x1b0260;
}
export function decryptDarkTunnel(_0x6fc86f) {
    try {
        let _0x4b7e2d = _0x6fc86f['toString']('utf-8')['trim']();
        if (_0x4b7e2d['includes']('://'))
            _0x4b7e2d = _0x4b7e2d['split']('://')[0x1];
        const _0x33a93c = JSON['parse'](base64DecodeSafe(_0x4b7e2d)['toString']('utf-8'));
        if (!_0x33a93c['encryptedLockedConfig'])
            return null;
        const _0x56be4e = base64DecodeSafe(_0x33a93c['encryptedLockedConfig']);
        const _0x581198 = aesCfbDecrypt(_0x56be4e, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x5f0a64 = unpack(_0x581198);
        const _0x1e48a8 = cleanAndDecryptTree(_0x5f0a64);
        _0x33a93c['encryptedLockedConfig'] = _0x1e48a8;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x33a93c, null, 0x4);
    } catch (_0x479b3a) {
        return null;
    }
}