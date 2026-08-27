import _0x0_0xd7fde6 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x517457) {
    let _0x112b3d = _0x517457['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x112b3d['length'] % 0x4 !== 0x0)
        _0x112b3d += '=';
    return Buffer['from'](_0x112b3d, 'base64');
}
function aesCfbDecrypt(_0x1f791f, _0x2b3177, _0x3eeb3c, _0xa6b16f = 0x100) {
    const _0x3ec783 = _0xa6b16f === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x3872d0 = _0x0_0xd7fde6['createDecipheriv'](_0x3ec783, _0x2b3177, _0x3eeb3c);
    return Buffer['concat']([
        _0x3872d0['update'](_0x1f791f),
        _0x3872d0['final']()
    ]);
}
function cleanAndDecryptTree(_0xe304ea) {
    if (!_0xe304ea || typeof _0xe304ea !== 'object')
        return _0xe304ea;
    if (Array['isArray'](_0xe304ea)) {
        return _0xe304ea['map'](_0x1548d8 => cleanAndDecryptTree(_0x1548d8));
    }
    const _0x3e39cd = {};
    for (let [_0x4d9728, _0x3bcfd8] of Object['entries'](_0xe304ea)) {
        if (_0x4d9728['toLowerCase']()['includes']('password') || _0x4d9728['toLowerCase']()['includes']('pass')) {
            _0x3e39cd[_0x4d9728] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x4d9728['startsWith']('Encrypted') && (_0x3bcfd8 instanceof Buffer || typeof _0x3bcfd8 === 'string')) {
            try {
                const _0x8bb72b = typeof _0x3bcfd8 === 'string' ? base64DecodeSafe(_0x3bcfd8) : _0x3bcfd8;
                const _0x11bb7e = aesCfbDecrypt(_0x8bb72b, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x3bcfd8 = cleanAndDecryptTree(unpack(_0x11bb7e));
                } catch (_0x53635e) {
                    _0x3bcfd8 = _0x11bb7e['toString']('utf-8');
                }
                _0x4d9728 = _0x4d9728['replace']('Encrypted', 'Decrypted');
            } catch (_0x45ff3e) {
            }
        } else if (_0x3bcfd8 instanceof Buffer) {
            _0x3bcfd8 = _0x3bcfd8['toString']('utf-8');
        } else if (typeof _0x3bcfd8 === 'object') {
            _0x3bcfd8 = cleanAndDecryptTree(_0x3bcfd8);
        }
        if (typeof _0x3bcfd8 === 'string' && (_0x3bcfd8['startsWith']('{') || _0x3bcfd8['startsWith']('['))) {
            try {
                _0x3bcfd8 = JSON['parse'](_0x3bcfd8);
            } catch (_0x4a2f30) {
            }
        }
        _0x3e39cd[_0x4d9728] = _0x3bcfd8;
    }
    return _0x3e39cd;
}
export function decryptDarkTunnel(_0x3ba891) {
    try {
        let _0x2beb30 = _0x3ba891['toString']('utf-8')['trim']();
        if (_0x2beb30['includes']('://'))
            _0x2beb30 = _0x2beb30['split']('://')[0x1];
        const _0x1fc397 = JSON['parse'](base64DecodeSafe(_0x2beb30)['toString']('utf-8'));
        if (!_0x1fc397['encryptedLockedConfig'])
            return null;
        const _0x3be7c4 = base64DecodeSafe(_0x1fc397['encryptedLockedConfig']);
        const _0x39daf3 = aesCfbDecrypt(_0x3be7c4, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0xb3eb20 = unpack(_0x39daf3);
        const _0x53d662 = cleanAndDecryptTree(_0xb3eb20);
        _0x1fc397['encryptedLockedConfig'] = _0x53d662;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x1fc397, null, 0x4);
    } catch (_0x11786a) {
        return null;
    }
}