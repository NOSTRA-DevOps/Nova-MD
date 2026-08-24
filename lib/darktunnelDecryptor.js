import _0x0_0x581307 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x4d2dc4) {
    let _0x317479 = _0x4d2dc4['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x317479['length'] % 0x4 !== 0x0)
        _0x317479 += '=';
    return Buffer['from'](_0x317479, 'base64');
}
function aesCfbDecrypt(_0x4db88d, _0x24aed7, _0x2fd98a, _0x484532 = 0x100) {
    const _0x5b9bd6 = _0x484532 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x545720 = _0x0_0x581307['createDecipheriv'](_0x5b9bd6, _0x24aed7, _0x2fd98a);
    return Buffer['concat']([
        _0x545720['update'](_0x4db88d),
        _0x545720['final']()
    ]);
}
function cleanAndDecryptTree(_0x52262a) {
    if (!_0x52262a || typeof _0x52262a !== 'object')
        return _0x52262a;
    if (Array['isArray'](_0x52262a)) {
        return _0x52262a['map'](_0x436921 => cleanAndDecryptTree(_0x436921));
    }
    const _0x214e8f = {};
    for (let [_0x342ac6, _0x44ba8b] of Object['entries'](_0x52262a)) {
        if (_0x342ac6['toLowerCase']()['includes']('password') || _0x342ac6['toLowerCase']()['includes']('pass')) {
            _0x214e8f[_0x342ac6] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x342ac6['startsWith']('Encrypted') && (_0x44ba8b instanceof Buffer || typeof _0x44ba8b === 'string')) {
            try {
                const _0x4e6f72 = typeof _0x44ba8b === 'string' ? base64DecodeSafe(_0x44ba8b) : _0x44ba8b;
                const _0x3dc53e = aesCfbDecrypt(_0x4e6f72, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x44ba8b = cleanAndDecryptTree(unpack(_0x3dc53e));
                } catch (_0x3d0069) {
                    _0x44ba8b = _0x3dc53e['toString']('utf-8');
                }
                _0x342ac6 = _0x342ac6['replace']('Encrypted', 'Decrypted');
            } catch (_0x5e5da6) {
            }
        } else if (_0x44ba8b instanceof Buffer) {
            _0x44ba8b = _0x44ba8b['toString']('utf-8');
        } else if (typeof _0x44ba8b === 'object') {
            _0x44ba8b = cleanAndDecryptTree(_0x44ba8b);
        }
        if (typeof _0x44ba8b === 'string' && (_0x44ba8b['startsWith']('{') || _0x44ba8b['startsWith']('['))) {
            try {
                _0x44ba8b = JSON['parse'](_0x44ba8b);
            } catch (_0x232bdd) {
            }
        }
        _0x214e8f[_0x342ac6] = _0x44ba8b;
    }
    return _0x214e8f;
}
export function decryptDarkTunnel(_0x1c620e) {
    try {
        let _0x37ccb2 = _0x1c620e['toString']('utf-8')['trim']();
        if (_0x37ccb2['includes']('://'))
            _0x37ccb2 = _0x37ccb2['split']('://')[0x1];
        const _0x27318e = JSON['parse'](base64DecodeSafe(_0x37ccb2)['toString']('utf-8'));
        if (!_0x27318e['encryptedLockedConfig'])
            return null;
        const _0x3c0845 = base64DecodeSafe(_0x27318e['encryptedLockedConfig']);
        const _0xa7413b = aesCfbDecrypt(_0x3c0845, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x5ef536 = unpack(_0xa7413b);
        const _0x2d544c = cleanAndDecryptTree(_0x5ef536);
        _0x27318e['encryptedLockedConfig'] = _0x2d544c;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x27318e, null, 0x4);
    } catch (_0x48b60b) {
        return null;
    }
}