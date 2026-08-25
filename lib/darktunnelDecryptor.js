import _0x0_0x10486a from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x247eec) {
    let _0x1281c3 = _0x247eec['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0x1281c3['length'] % 0x4 !== 0x0)
        _0x1281c3 += '=';
    return Buffer['from'](_0x1281c3, 'base64');
}
function aesCfbDecrypt(_0x3d408a, _0x3d466b, _0x1d5c8e, _0x1d7467 = 0x100) {
    const _0x460151 = _0x1d7467 === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x32235c = _0x0_0x10486a['createDecipheriv'](_0x460151, _0x3d466b, _0x1d5c8e);
    return Buffer['concat']([
        _0x32235c['update'](_0x3d408a),
        _0x32235c['final']()
    ]);
}
function cleanAndDecryptTree(_0x56cb32) {
    if (!_0x56cb32 || typeof _0x56cb32 !== 'object')
        return _0x56cb32;
    if (Array['isArray'](_0x56cb32)) {
        return _0x56cb32['map'](_0x481d4b => cleanAndDecryptTree(_0x481d4b));
    }
    const _0x498b28 = {};
    for (let [_0x5e3958, _0x52157f] of Object['entries'](_0x56cb32)) {
        if (_0x5e3958['toLowerCase']()['includes']('password') || _0x5e3958['toLowerCase']()['includes']('pass')) {
            _0x498b28[_0x5e3958] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x5e3958['startsWith']('Encrypted') && (_0x52157f instanceof Buffer || typeof _0x52157f === 'string')) {
            try {
                const _0x5179e9 = typeof _0x52157f === 'string' ? base64DecodeSafe(_0x52157f) : _0x52157f;
                const _0x35f89f = aesCfbDecrypt(_0x5179e9, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x52157f = cleanAndDecryptTree(unpack(_0x35f89f));
                } catch (_0x1b1def) {
                    _0x52157f = _0x35f89f['toString']('utf-8');
                }
                _0x5e3958 = _0x5e3958['replace']('Encrypted', 'Decrypted');
            } catch (_0x26d8e5) {
            }
        } else if (_0x52157f instanceof Buffer) {
            _0x52157f = _0x52157f['toString']('utf-8');
        } else if (typeof _0x52157f === 'object') {
            _0x52157f = cleanAndDecryptTree(_0x52157f);
        }
        if (typeof _0x52157f === 'string' && (_0x52157f['startsWith']('{') || _0x52157f['startsWith']('['))) {
            try {
                _0x52157f = JSON['parse'](_0x52157f);
            } catch (_0x3e0b47) {
            }
        }
        _0x498b28[_0x5e3958] = _0x52157f;
    }
    return _0x498b28;
}
export function decryptDarkTunnel(_0x368dd0) {
    try {
        let _0x1c030d = _0x368dd0['toString']('utf-8')['trim']();
        if (_0x1c030d['includes']('://'))
            _0x1c030d = _0x1c030d['split']('://')[0x1];
        const _0x27165c = JSON['parse'](base64DecodeSafe(_0x1c030d)['toString']('utf-8'));
        if (!_0x27165c['encryptedLockedConfig'])
            return null;
        const _0x83fd84 = base64DecodeSafe(_0x27165c['encryptedLockedConfig']);
        const _0x383047 = aesCfbDecrypt(_0x83fd84, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x3ed10a = unpack(_0x383047);
        const _0x287326 = cleanAndDecryptTree(_0x3ed10a);
        _0x27165c['encryptedLockedConfig'] = _0x287326;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x27165c, null, 0x4);
    } catch (_0x5327f6) {
        return null;
    }
}