import _0x0_0x2fa7dd from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x93d406) {
    let _0x1abff5 = _0x93d406['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x1abff5['length'] % 0x4 !== 0x0)
        _0x1abff5 += '=';
    return Buffer['from'](_0x1abff5, 'base64');
}
function aesCfbDecrypt(_0x3a803c, _0x521794, _0x53f244, _0x9a5cef = 0x100) {
    const _0x19443d = _0x9a5cef === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x3b69d0 = _0x0_0x2fa7dd['createDecipheriv'](_0x19443d, _0x521794, _0x53f244);
    return Buffer['concat']([
        _0x3b69d0['update'](_0x3a803c),
        _0x3b69d0['final']()
    ]);
}
function cleanAndDecryptTree(_0x4b796d) {
    if (!_0x4b796d || typeof _0x4b796d !== 'object')
        return _0x4b796d;
    if (Array['isArray'](_0x4b796d)) {
        return _0x4b796d['map'](_0x55506b => cleanAndDecryptTree(_0x55506b));
    }
    const _0x43c580 = {};
    for (let [_0x2b4bf4, _0x34a174] of Object['entries'](_0x4b796d)) {
        if (_0x2b4bf4['toLowerCase']()['includes']('password') || _0x2b4bf4['toLowerCase']()['includes']('pass')) {
            _0x43c580[_0x2b4bf4] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x2b4bf4['startsWith']('Encrypted') && (_0x34a174 instanceof Buffer || typeof _0x34a174 === 'string')) {
            try {
                const _0x1486a8 = typeof _0x34a174 === 'string' ? base64DecodeSafe(_0x34a174) : _0x34a174;
                const _0x5ecbb2 = aesCfbDecrypt(_0x1486a8, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x34a174 = cleanAndDecryptTree(unpack(_0x5ecbb2));
                } catch (_0x10e35c) {
                    _0x34a174 = _0x5ecbb2['toString']('utf-8');
                }
                _0x2b4bf4 = _0x2b4bf4['replace']('Encrypted', 'Decrypted');
            } catch (_0xd1d20a) {
            }
        } else if (_0x34a174 instanceof Buffer) {
            _0x34a174 = _0x34a174['toString']('utf-8');
        } else if (typeof _0x34a174 === 'object') {
            _0x34a174 = cleanAndDecryptTree(_0x34a174);
        }
        if (typeof _0x34a174 === 'string' && (_0x34a174['startsWith']('{') || _0x34a174['startsWith']('['))) {
            try {
                _0x34a174 = JSON['parse'](_0x34a174);
            } catch (_0x331c6f) {
            }
        }
        _0x43c580[_0x2b4bf4] = _0x34a174;
    }
    return _0x43c580;
}
export function decryptDarkTunnel(_0x17376a) {
    try {
        let _0x116dea = _0x17376a['toString']('utf-8')['trim']();
        if (_0x116dea['includes']('://'))
            _0x116dea = _0x116dea['split']('://')[0x1];
        const _0x1c7318 = JSON['parse'](base64DecodeSafe(_0x116dea)['toString']('utf-8'));
        if (!_0x1c7318['encryptedLockedConfig'])
            return null;
        const _0x5e1f7b = base64DecodeSafe(_0x1c7318['encryptedLockedConfig']);
        const _0x185d62 = aesCfbDecrypt(_0x5e1f7b, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x150af7 = unpack(_0x185d62);
        const _0x36f44a = cleanAndDecryptTree(_0x150af7);
        _0x1c7318['encryptedLockedConfig'] = _0x36f44a;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x1c7318, null, 0x4);
    } catch (_0x4b1eb9) {
        return null;
    }
}