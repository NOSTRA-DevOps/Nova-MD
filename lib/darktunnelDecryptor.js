import _0x0_0x410617 from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x2eaac4) {
    let _0x2be151 = _0x2eaac4['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x2be151['length'] % 0x4 !== 0x0)
        _0x2be151 += '=';
    return Buffer['from'](_0x2be151, 'base64');
}
function aesCfbDecrypt(_0xb9684f, _0x56429a, _0x265a00, _0x4768ae = 0x100) {
    const _0x54f307 = _0x4768ae === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x5cd83b = _0x0_0x410617['createDecipheriv'](_0x54f307, _0x56429a, _0x265a00);
    return Buffer['concat']([
        _0x5cd83b['update'](_0xb9684f),
        _0x5cd83b['final']()
    ]);
}
function cleanAndDecryptTree(_0x43f327) {
    if (!_0x43f327 || typeof _0x43f327 !== 'object')
        return _0x43f327;
    if (Array['isArray'](_0x43f327)) {
        return _0x43f327['map'](_0x59e45b => cleanAndDecryptTree(_0x59e45b));
    }
    const _0x433528 = {};
    for (let [_0x482af0, _0x3e1c3d] of Object['entries'](_0x43f327)) {
        if (_0x482af0['toLowerCase']()['includes']('password') || _0x482af0['toLowerCase']()['includes']('pass')) {
            _0x433528[_0x482af0] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x482af0['startsWith']('Encrypted') && (_0x3e1c3d instanceof Buffer || typeof _0x3e1c3d === 'string')) {
            try {
                const _0x55bf4c = typeof _0x3e1c3d === 'string' ? base64DecodeSafe(_0x3e1c3d) : _0x3e1c3d;
                const _0x552458 = aesCfbDecrypt(_0x55bf4c, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x3e1c3d = cleanAndDecryptTree(unpack(_0x552458));
                } catch (_0x4c3876) {
                    _0x3e1c3d = _0x552458['toString']('utf-8');
                }
                _0x482af0 = _0x482af0['replace']('Encrypted', 'Decrypted');
            } catch (_0xf48169) {
            }
        } else if (_0x3e1c3d instanceof Buffer) {
            _0x3e1c3d = _0x3e1c3d['toString']('utf-8');
        } else if (typeof _0x3e1c3d === 'object') {
            _0x3e1c3d = cleanAndDecryptTree(_0x3e1c3d);
        }
        if (typeof _0x3e1c3d === 'string' && (_0x3e1c3d['startsWith']('{') || _0x3e1c3d['startsWith']('['))) {
            try {
                _0x3e1c3d = JSON['parse'](_0x3e1c3d);
            } catch (_0x2f3b2b) {
            }
        }
        _0x433528[_0x482af0] = _0x3e1c3d;
    }
    return _0x433528;
}
export function decryptDarkTunnel(_0x3090cd) {
    try {
        let _0xa4f852 = _0x3090cd['toString']('utf-8')['trim']();
        if (_0xa4f852['includes']('://'))
            _0xa4f852 = _0xa4f852['split']('://')[0x1];
        const _0x5e8097 = JSON['parse'](base64DecodeSafe(_0xa4f852)['toString']('utf-8'));
        if (!_0x5e8097['encryptedLockedConfig'])
            return null;
        const _0x52c238 = base64DecodeSafe(_0x5e8097['encryptedLockedConfig']);
        const _0x248c3d = aesCfbDecrypt(_0x52c238, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x33bd84 = unpack(_0x248c3d);
        const _0x438e69 = cleanAndDecryptTree(_0x33bd84);
        _0x5e8097['encryptedLockedConfig'] = _0x438e69;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x5e8097, null, 0x4);
    } catch (_0x21628b) {
        return null;
    }
}