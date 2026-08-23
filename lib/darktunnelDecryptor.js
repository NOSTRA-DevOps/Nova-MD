import _0x0_0x4157fa from 'crypto';
import { unpack } from 'msgpackr';
const DT_CONSTANTS = {
    'KEY_256': Buffer['from']('$B&E)H@McQfThWmZq4t7w!z%C*F-JaNd', 'utf-8'),
    'KEY_192': Buffer['from']('F)J@NcRfUjXn2r4u7x!A%D*G', 'utf-8'),
    'IV': Buffer['from']('232e39185523184a5723586242200e05', 'hex')
};
function base64DecodeSafe(_0x295a6c) {
    let _0xc22858 = _0x295a6c['replace'](/-/g, '+')['replace'](/_/g, '/');
    while (_0xc22858['length'] % 0x4 !== 0x0)
        _0xc22858 += '=';
    return Buffer['from'](_0xc22858, 'base64');
}
function aesCfbDecrypt(_0x29da66, _0xb7cae7, _0x24c5f8, _0x589b3a = 0x100) {
    const _0x53da59 = _0x589b3a === 0xc0 ? 'aes-192-cfb' : 'aes-256-cfb';
    const _0x2b0127 = _0x0_0x4157fa['createDecipheriv'](_0x53da59, _0xb7cae7, _0x24c5f8);
    return Buffer['concat']([
        _0x2b0127['update'](_0x29da66),
        _0x2b0127['final']()
    ]);
}
function cleanAndDecryptTree(_0x5c0077) {
    if (!_0x5c0077 || typeof _0x5c0077 !== 'object')
        return _0x5c0077;
    if (Array['isArray'](_0x5c0077)) {
        return _0x5c0077['map'](_0x1e15fa => cleanAndDecryptTree(_0x1e15fa));
    }
    const _0xcf5487 = {};
    for (let [_0x12df7e, _0x16151d] of Object['entries'](_0x5c0077)) {
        if (_0x12df7e['toLowerCase']()['includes']('password') || _0x12df7e['toLowerCase']()['includes']('pass')) {
            _0xcf5487[_0x12df7e] = 'REMOVED_FOR_SAFETY';
            continue;
        }
        if (_0x12df7e['startsWith']('Encrypted') && (_0x16151d instanceof Buffer || typeof _0x16151d === 'string')) {
            try {
                const _0x202331 = typeof _0x16151d === 'string' ? base64DecodeSafe(_0x16151d) : _0x16151d;
                const _0x1d3431 = aesCfbDecrypt(_0x202331, DT_CONSTANTS['KEY_192'], DT_CONSTANTS['IV'], 0xc0);
                try {
                    _0x16151d = cleanAndDecryptTree(unpack(_0x1d3431));
                } catch (_0x37ecbd) {
                    _0x16151d = _0x1d3431['toString']('utf-8');
                }
                _0x12df7e = _0x12df7e['replace']('Encrypted', 'Decrypted');
            } catch (_0x736b64) {
            }
        } else if (_0x16151d instanceof Buffer) {
            _0x16151d = _0x16151d['toString']('utf-8');
        } else if (typeof _0x16151d === 'object') {
            _0x16151d = cleanAndDecryptTree(_0x16151d);
        }
        if (typeof _0x16151d === 'string' && (_0x16151d['startsWith']('{') || _0x16151d['startsWith']('['))) {
            try {
                _0x16151d = JSON['parse'](_0x16151d);
            } catch (_0x55d917) {
            }
        }
        _0xcf5487[_0x12df7e] = _0x16151d;
    }
    return _0xcf5487;
}
export function decryptDarkTunnel(_0x544933) {
    try {
        let _0x3c0d49 = _0x544933['toString']('utf-8')['trim']();
        if (_0x3c0d49['includes']('://'))
            _0x3c0d49 = _0x3c0d49['split']('://')[0x1];
        const _0x38fa4e = JSON['parse'](base64DecodeSafe(_0x3c0d49)['toString']('utf-8'));
        if (!_0x38fa4e['encryptedLockedConfig'])
            return null;
        const _0x507423 = base64DecodeSafe(_0x38fa4e['encryptedLockedConfig']);
        const _0x3683fb = aesCfbDecrypt(_0x507423, DT_CONSTANTS['KEY_256'], DT_CONSTANTS['IV'], 0x100);
        const _0x859897 = unpack(_0x3683fb);
        const _0x286988 = cleanAndDecryptTree(_0x859897);
        _0x38fa4e['encryptedLockedConfig'] = _0x286988;
        return 'Labokingfreesurf\x20DARK\x20TUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x38fa4e, null, 0x4);
    } catch (_0x59377b) {
        return null;
    }
}