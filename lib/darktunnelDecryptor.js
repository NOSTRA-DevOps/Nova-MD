import _0x0_0x133907 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x24a472) {
    let _0x210114 = _0x24a472['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x210114['length'] % 0x4 !== 0x0)
        _0x210114 += '=';
    return Buffer['from'](_0x210114, 'base64');
}
function aesCfbDecrypt(_0x572ec3, _0x2eb43f, _0x22712f, _0x3bdee2 = 0x100) {
    const _0x1b31f3 = _0x3bdee2 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x210173 = _0x0_0x133907['createDecipheriv'](_0x1b31f3, _0x2eb43f, _0x22712f);
    return Buffer['concat']([
        _0x210173['update'](_0x572ec3),
        _0x210173['final']()
    ]);
}
function cleanAndDecryptTree(_0x2da5ce) {
    if (!_0x2da5ce || typeof _0x2da5ce !== 'object')
        return _0x2da5ce;
    if (Array['isArray'](_0x2da5ce)) {
        return _0x2da5ce['map'](_0x483e4f => cleanAndDecryptTree(_0x483e4f));
    }
    const _0x127c27 = {};
    for (let [_0x21be0c, _0x1afb07] of Object['entries'](_0x2da5ce)) {
        if (_0x21be0c['toLowerCase']()['includes']('password') || _0x21be0c['toLowerCase']()['includes']('pass')) {
            _0x127c27[_0x21be0c] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x21be0c['startsWith']('Encrypted') && (_0x1afb07 instanceof Buffer || typeof _0x1afb07 === 'string')) {
            try {
                const _0x22b98c = typeof _0x1afb07 === 'string' ? base64DecodeSafe(_0x1afb07) : _0x1afb07;
                const _0x1d9b72 = aesCfbDecrypt(_0x22b98c, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x1afb07 = cleanAndDecryptTree(unpack(_0x1d9b72));
                } catch (_0x1d5311) {
                    _0x1afb07 = _0x1d9b72['toString']('utf-8');
                }
                _0x21be0c = _0x21be0c['replace']('Encrypted', 'Decrypted');
            } catch (_0x47a76d) {
            }
        } else if (_0x1afb07 instanceof Buffer) {
            _0x1afb07 = _0x1afb07['toString']('utf-8');
        } else if (typeof _0x1afb07 === 'object') {
            _0x1afb07 = cleanAndDecryptTree(_0x1afb07);
        }
        if (typeof _0x1afb07 === 'string' && (_0x1afb07['startsWith']('{') || _0x1afb07['startsWith']('['))) {
            try {
                _0x1afb07 = JSON['parse'](_0x1afb07);
            } catch (_0x1b5165) {
            }
        }
        _0x127c27[_0x21be0c] = _0x1afb07;
    }
    return _0x127c27;
}
export function decryptDarkTunnel(_0x58cdf8) {
    try {
        let _0x3b1f02 = _0x58cdf8['toString']('utf-8')['trim']();
        if (_0x3b1f02['includes']('://'))
            _0x3b1f02 = _0x3b1f02['split']('://')[0x1];
        const _0x50654f = JSON['parse'](base64DecodeSafe(_0x3b1f02)['toString']('utf-8'));
        if (!_0x50654f['encryptedLockedConfig'])
            return null;
        const _0x4ff0ce = base64DecodeSafe(_0x50654f['encryptedLockedConfig']);
        const _0x485dc3 = aesCfbDecrypt(_0x4ff0ce, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x2c2fb8 = unpack(_0x485dc3);
        const _0x3c93f9 = cleanAndDecryptTree(_0x2c2fb8);
        _0x50654f['encryptedLockedConfig'] = _0x3c93f9;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x50654f, null, 0x4);
    } catch (_0x33dfca) {
        return null;
    }
}