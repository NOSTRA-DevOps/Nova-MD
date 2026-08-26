import _0x0_0x487709 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x52aeea) {
    let _0x2cd162 = _0x52aeea['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x2cd162['length'] % 0x4 !== 0x0)
        _0x2cd162 += '=';
    return Buffer['from'](_0x2cd162, 'base64');
}
function aesCfbDecrypt(_0x29c4ce, _0x56ee42, _0x133ffe, _0x561c3d = 0x100) {
    const _0x26e014 = _0x561c3d === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x25eeda = _0x0_0x487709['createDecipheriv'](_0x26e014, _0x56ee42, _0x133ffe);
    return Buffer['concat']([
        _0x25eeda['update'](_0x29c4ce),
        _0x25eeda['final']()
    ]);
}
function cleanAndDecryptTree(_0xa702ab) {
    if (!_0xa702ab || typeof _0xa702ab !== 'object')
        return _0xa702ab;
    if (Array['isArray'](_0xa702ab)) {
        return _0xa702ab['map'](_0x43a14f => cleanAndDecryptTree(_0x43a14f));
    }
    const _0x58a5e1 = {};
    for (let [_0x26e752, _0x3cfb46] of Object['entries'](_0xa702ab)) {
        if (_0x26e752['toLowerCase']()['includes']('password') || _0x26e752['toLowerCase']()['includes']('pass')) {
            _0x58a5e1[_0x26e752] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x26e752['startsWith']('Encrypted') && (_0x3cfb46 instanceof Buffer || typeof _0x3cfb46 === 'string')) {
            try {
                const _0x1d0a72 = typeof _0x3cfb46 === 'string' ? base64DecodeSafe(_0x3cfb46) : _0x3cfb46;
                const _0x3d6ade = aesCfbDecrypt(_0x1d0a72, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x3cfb46 = cleanAndDecryptTree(unpack(_0x3d6ade));
                } catch (_0x55e255) {
                    _0x3cfb46 = _0x3d6ade['toString']('utf-8');
                }
                _0x26e752 = _0x26e752['replace']('Encrypted', 'Decrypted');
            } catch (_0x28dfa6) {
            }
        } else if (_0x3cfb46 instanceof Buffer) {
            _0x3cfb46 = _0x3cfb46['toString']('utf-8');
        } else if (typeof _0x3cfb46 === 'object') {
            _0x3cfb46 = cleanAndDecryptTree(_0x3cfb46);
        }
        if (typeof _0x3cfb46 === 'string' && (_0x3cfb46['startsWith']('{') || _0x3cfb46['startsWith']('['))) {
            try {
                _0x3cfb46 = JSON['parse'](_0x3cfb46);
            } catch (_0x1eed23) {
            }
        }
        _0x58a5e1[_0x26e752] = _0x3cfb46;
    }
    return _0x58a5e1;
}
export function decryptDarkTunnel(_0x58f69d) {
    try {
        let _0x20b099 = _0x58f69d['toString']('utf-8')['trim']();
        if (_0x20b099['includes']('://'))
            _0x20b099 = _0x20b099['split']('://')[0x1];
        const _0x437bdf = JSON['parse'](base64DecodeSafe(_0x20b099)['toString']('utf-8'));
        if (!_0x437bdf['encryptedLockedConfig'])
            return null;
        const _0x3c688f = base64DecodeSafe(_0x437bdf['encryptedLockedConfig']);
        const _0x5e12e5 = aesCfbDecrypt(_0x3c688f, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x412cc4 = unpack(_0x5e12e5);
        const _0x1bbf55 = cleanAndDecryptTree(_0x412cc4);
        _0x437bdf['encryptedLockedConfig'] = _0x1bbf55;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x437bdf, null, 0x4);
    } catch (_0x16e3c3) {
        return null;
    }
}