import _0x0_0x204594 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x8af56b) {
    let _0x4813a7 = _0x8af56b['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x4813a7['length'] % 0x4 !== 0x0)
        _0x4813a7 += '=';
    return Buffer['from'](_0x4813a7, 'base64');
}
function aesCfbDecrypt(_0x252948, _0x4902b4, _0x2e3d0b, _0x5ca47d = 0x100) {
    const _0x5adde4 = _0x5ca47d === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x50e83a = _0x0_0x204594['createDecipheriv'](_0x5adde4, _0x4902b4, _0x2e3d0b);
    return Buffer['concat']([
        _0x50e83a['update'](_0x252948),
        _0x50e83a['final']()
    ]);
}
function cleanAndDecryptTree(_0x69a522) {
    if (!_0x69a522 || typeof _0x69a522 !== 'object')
        return _0x69a522;
    if (Array['isArray'](_0x69a522)) {
        return _0x69a522['map'](_0x524b8b => cleanAndDecryptTree(_0x524b8b));
    }
    const _0x27f146 = {};
    for (let [_0x20088f, _0x8c02b7] of Object['entries'](_0x69a522)) {
        if (_0x20088f['toLowerCase']()['includes']('password') || _0x20088f['toLowerCase']()['includes']('pass')) {
            _0x27f146[_0x20088f] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x20088f['startsWith']('Encrypted') && (_0x8c02b7 instanceof Buffer || typeof _0x8c02b7 === 'string')) {
            try {
                const _0xa1ba2 = typeof _0x8c02b7 === 'string' ? base64DecodeSafe(_0x8c02b7) : _0x8c02b7;
                const _0x5a4820 = aesCfbDecrypt(_0xa1ba2, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x8c02b7 = cleanAndDecryptTree(unpack(_0x5a4820));
                } catch (_0x1b5324) {
                    _0x8c02b7 = _0x5a4820['toString']('utf-8');
                }
                _0x20088f = _0x20088f['replace']('Encrypted', 'Decrypted');
            } catch (_0x5c0487) {
            }
        } else if (_0x8c02b7 instanceof Buffer) {
            _0x8c02b7 = _0x8c02b7['toString']('utf-8');
        } else if (typeof _0x8c02b7 === 'object') {
            _0x8c02b7 = cleanAndDecryptTree(_0x8c02b7);
        }
        if (typeof _0x8c02b7 === 'string' && (_0x8c02b7['startsWith']('{') || _0x8c02b7['startsWith']('['))) {
            try {
                _0x8c02b7 = JSON['parse'](_0x8c02b7);
            } catch (_0x153e7d) {
            }
        }
        _0x27f146[_0x20088f] = _0x8c02b7;
    }
    return _0x27f146;
}
export function decryptDarkTunnel(_0x33c0de) {
    try {
        let _0x581adf = _0x33c0de['toString']('utf-8')['trim']();
        if (_0x581adf['includes']('://'))
            _0x581adf = _0x581adf['split']('://')[0x1];
        const _0x833fb8 = JSON['parse'](base64DecodeSafe(_0x581adf)['toString']('utf-8'));
        if (!_0x833fb8['encryptedLockedConfig'])
            return null;
        const _0xa10f6b = base64DecodeSafe(_0x833fb8['encryptedLockedConfig']);
        const _0x301574 = aesCfbDecrypt(_0xa10f6b, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x58c450 = unpack(_0x301574);
        const _0xd4452 = cleanAndDecryptTree(_0x58c450);
        _0x833fb8['encryptedLockedConfig'] = _0xd4452;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x833fb8, null, 0x4);
    } catch (_0x29b495) {
        return null;
    }
}