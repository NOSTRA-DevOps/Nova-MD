import _0x0_0x3f718c from 'crypto';
import _0x0_0x1a2df2 from 'argon2';
const EHI_CONSTANTS = {
    'L1_KEY': Buffer['from']('7e1210f7aab956f7a668bda6e57feddb7f84ad840aef8d27b1b969959be3ab6c', 'hex'),
    'L2_KEY_STATIC': Buffer['from']('b2bc617c32d8b9eb1943a5ffa8051eea', 'hex'),
    'EOO_MASTER_KEY': Buffer['from']('null=V5kU5+FFrY\x00', 'utf-8'),
    'BYPASS_IVS': [
        Buffer['from']('221d572349555f1d112133236b1f4a3f', 'hex'),
        Buffer['from']('5543494c53443e3f4a6a4539384e776a', 'hex'),
        Buffer['from']('374c2541575e4d531a3c327b75431e5f', 'hex')
    ],
    'STANDARD_IVS': [
        Buffer['from']('2c5d1147bbad422b3b334d4d235f1a53', 'hex'),
        Buffer['from']('522b01433a5e8b2fc7549e1ad368e541', 'hex'),
        Buffer['from']('337a1035aaedf3458ca167e92d74b839', 'hex')
    ],
    'STD_ALPHABET': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    'CUSTOM_ALPHABET': 'RkLC2QaVMPYgGJW/A4f7qzDb9e+t6Hr0Zp8OlNyjuxKcTw1o5EIimhBn3UvdSFXs',
    'TRANSLATION_MAP': {}
};
for (let i = 0x0; i < EHI_CONSTANTS['CUSTOM_ALPHABET']['length']; i++) {
    EHI_CONSTANTS['TRANSLATION_MAP'][EHI_CONSTANTS['CUSTOM_ALPHABET'][i]] = EHI_CONSTANTS['STD_ALPHABET'][i];
}
function customB64DecodeEhi(_0x27fc60) {
    const _0x3faccf = _0x27fc60['replace'](/\?/g, '');
    let _0x4539df = '';
    for (let _0x26d77d = 0x0; _0x26d77d < _0x3faccf['length']; _0x26d77d++) {
        _0x4539df += EHI_CONSTANTS['TRANSLATION_MAP'][_0x3faccf[_0x26d77d]] || _0x3faccf[_0x26d77d];
    }
    while (_0x4539df['length'] % 0x4 !== 0x0)
        _0x4539df += '=';
    return Buffer['from'](_0x4539df, 'base64');
}
function ehiDecryptXorLayer(_0x2338ed, _0x2495ea) {
    if (!_0x2338ed || !_0x2338ed['trim']())
        return null;
    try {
        const _0x70b1b = _0x2338ed['split']('')['reverse']()['join']('');
        const _0x7fb9d9 = customB64DecodeEhi(_0x70b1b);
        const _0x332ed9 = Buffer['from'](_0x7fb9d9['toString']('ascii'), 'hex');
        const _0x40331e = Buffer['from'](_0x2495ea);
        const _0x4298ec = [];
        for (let _0x8f4d64 = 0x0; _0x8f4d64 < _0x332ed9['length']; _0x8f4d64++) {
            const _0x27d9f5 = _0x332ed9[_0x8f4d64] ^ _0x40331e[_0x8f4d64 % _0x40331e['length']];
            if (_0x27d9f5 !== 0x0)
                _0x4298ec['push'](_0x27d9f5);
        }
        return Buffer['from'](_0x4298ec)['toString']('utf-8');
    } catch (_0x392c34) {
        return null;
    }
}
function xxteaDecrypt(_0x33546a, _0xa5d821) {
    if (_0x33546a['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x4fbe75 = Math['floor'](_0x33546a['length'] / 0x4);
    const _0x28a5a5 = new Uint32Array(_0x4fbe75);
    for (let _0x63b472 = 0x0; _0x63b472 < _0x4fbe75; _0x63b472++)
        _0x28a5a5[_0x63b472] = _0x33546a['readUInt32LE'](_0x63b472 * 0x4);
    const _0xe06caa = new Uint32Array(0x4);
    for (let _0x2b88eb = 0x0; _0x2b88eb < 0x4; _0x2b88eb++)
        _0xe06caa[_0x2b88eb] = _0xa5d821['readUInt32LE'](Math['min'](_0x2b88eb * 0x4, _0xa5d821['length'] - 0x4));
    const _0x7d7110 = 0x9e3779b9;
    let _0x532d07 = Math['floor'](0x6 + 0x34 / _0x4fbe75);
    let _0x36a4d8 = _0x532d07 * _0x7d7110 & 0xffffffff;
    let _0x5abe7c = _0x28a5a5;
    while (_0x36a4d8 !== 0x0) {
        const _0x4e210b = _0x36a4d8 >> 0x2 & 0x3;
        for (let _0x52a8c8 = _0x4fbe75 - 0x1; _0x52a8c8 > 0x0; _0x52a8c8--) {
            const _0x3baec9 = _0x28a5a5[_0x52a8c8 - 0x1];
            const _0x21962a = (_0x3baec9 >> 0x5 ^ _0x5abe7c << 0x2) + (_0x5abe7c >> 0x3 ^ _0x3baec9 << 0x4) ^ (_0x36a4d8 ^ _0x5abe7c) + (_0xe06caa[_0x52a8c8 & 0x3 ^ _0x4e210b] ^ _0x3baec9);
            _0x5abe7c = _0x28a5a5[_0x52a8c8] = _0x28a5a5[_0x52a8c8] - _0x21962a & 0xffffffff;
        }
        const _0xff863 = _0x28a5a5[_0x4fbe75 - 0x1];
        const _0x8517cb = (_0xff863 >> 0x5 ^ _0x5abe7c << 0x2) + (_0x5abe7c >> 0x3 ^ _0xff863 << 0x4) ^ (_0x36a4d8 ^ _0x5abe7c) + (_0xe06caa[0x0 & 0x3 ^ _0x4e210b] ^ _0xff863);
        _0x5abe7c = _0x28a5a5 = _0x28a5a5 - _0x8517cb & 0xffffffff;
        _0x36a4d8 = _0x36a4d8 - _0x7d7110 & 0xffffffff;
    }
    const _0x43ea80 = Buffer['alloc'](_0x4fbe75 * 0x4);
    for (let _0x1f3ed4 = 0x0; _0x1f3ed4 < _0x4fbe75; _0x1f3ed4++)
        _0x43ea80['writeUInt32LE'](_0x28a5a5[_0x1f3ed4], _0x1f3ed4 * 0x4);
    const _0x509959 = _0x28a5a5[_0x4fbe75 - 0x1];
    return _0x509959 > 0x0 && _0x509959 <= _0x4fbe75 * 0x4 ? _0x43ea80['slice'](0x0, _0x509959) : _0x43ea80;
}
function ehiParseBytes(_0x10de91) {
    try {
        let _0xd28362 = 0x0;
        if (_0x10de91['readUInt16BE'](0x0) === 0xaced)
            _0xd28362 = 0x4;
        function _0x55da5b() {
            if (_0xd28362 + 0x2 > _0x10de91['length'])
                return '';
            const _0x404993 = _0x10de91['readUInt16BE'](_0xd28362);
            _0xd28362 += 0x2;
            const _0x5cd5b2 = _0x10de91['slice'](_0xd28362, _0xd28362 + _0x404993)['toString']('utf-8');
            _0xd28362 += _0x404993;
            return _0x5cd5b2;
        }
        _0x55da5b();
        _0xd28362 += 0x8;
        _0x55da5b();
        _0xd28362 += 0x8;
        if (_0xd28362 + 0x4 > _0x10de91['length'])
            return null;
        const _0x16a97e = _0x10de91['readUInt32BE'](_0xd28362);
        _0xd28362 += 0x4;
        _0xd28362 += 0x8;
        return _0x10de91['slice'](_0xd28362, _0xd28362 + _0x16a97e);
    } catch (_0x4815d7) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x49fed8, _0x436b25) {
    if (!_0x49fed8)
        return _0x49fed8;
    try {
        const _0x3fdeec = Buffer['from'](_0x436b25, 'utf-8');
        const _0x52365e = Buffer['from'](_0x49fed8, 'utf-16le');
        const _0x5725e6 = Buffer['alloc'](_0x52365e['length']);
        for (let _0x10342c = 0x0; _0x10342c < _0x52365e['length']; _0x10342c++) {
            _0x5725e6[_0x10342c] = _0x52365e[_0x10342c] ^ _0x3fdeec[_0x10342c % _0x3fdeec['length']];
        }
        return _0x5725e6['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x369351) {
        return _0x49fed8;
    }
}
function generateMasterKey(_0x5c0125) {
    const _0x199e58 = [
        _0x5c0125['configAesKey'],
        _0x5c0125['configIdentifier'],
        _0x5c0125['configSalt'],
        _0x5c0125['configTimestamp'] ? String(_0x5c0125['configTimestamp']) : '',
        _0x5c0125['configExpiryTimestamp'] ? String(_0x5c0125['configExpiryTimestamp']) : '',
        _0x5c0125['lockModes'],
        _0x5c0125['lockModesHash'],
        _0x5c0125['configHwid'],
        _0x5c0125['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x3f718c['createHash']('sha256')['update'](_0x199e58, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x4d2d56) {
    try {
        const _0x7cdc4a = ehiParseBytes(_0x4d2d56);
        if (!_0x7cdc4a)
            return null;
        let _0x4695d9 = null;
        let _0x4fc47e = null;
        for (const _0x20c863 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0xca5df2 = _0x0_0x3f718c['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x20c863);
                const _0x642caa = Buffer['concat']([
                    _0xca5df2['update'](_0x7cdc4a),
                    _0xca5df2['final']()
                ])['toString']('utf-8');
                const _0x50d23c = _0x642caa['split'](':');
                if (_0x50d23c['length'] >= 0x3) {
                    const _0x409cb5 = _0x0_0x3f718c['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x50d23c[0x1], 'base64'));
                    const _0x8b4c84 = Buffer['concat']([
                        _0x409cb5['update'](Buffer['from'](_0x50d23c[0x1], 'base64')),
                        _0x409cb5['final']()
                    ]);
                    const _0xbec30 = xxteaDecrypt(_0x8b4c84, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x42763a = _0xbec30['indexOf'](0x7b);
                    if (_0x42763a !== -0x1) {
                        _0x4695d9 = JSON['parse'](_0xbec30['slice'](_0x42763a)['toString']('utf-8'));
                        _0x4fc47e = _0x20c863;
                        break;
                    }
                }
            } catch (_0x1ff9ef) {
                continue;
            }
        }
        if (!_0x4695d9)
            return null;
        const _0x27de55 = _0x4695d9['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x61fac7 => _0x61fac7['equals'](_0x4fc47e)) && _0x4695d9['configData']) {
            const _0x4036a1 = ehiDecryptXorLayer(_0x4695d9['configData'], _0x27de55);
            if (!_0x4036a1)
                return null;
            const _0x297dd4 = Buffer['from'](_0x4036a1, 'base64');
            const _0x1d53cf = _0x297dd4['slice'](0xa, 0x1a);
            const _0x143f1d = _0x297dd4['readUInt32LE'](0x1);
            const _0x46a7c6 = _0x297dd4['readUInt32LE'](0x5);
            const _0x4937b0 = _0x297dd4[0x9] || 0x1;
            const _0x20e3fb = generateMasterKey(_0x4695d9);
            const _0x4e07d6 = await _0x0_0x1a2df2['hash'](_0x20e3fb, {
                'salt': _0x1d53cf,
                'timeCost': _0x143f1d,
                'memoryCost': _0x46a7c6,
                'parallelism': _0x4937b0,
                'hashLength': 0x20,
                'type': _0x0_0x1a2df2['argon2id'],
                'raw': !![]
            });
            const _0x58bfcf = _0x0_0x3f718c['createDecipheriv']('chacha20-poly1305', _0x4e07d6, _0x297dd4['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x58bfcf['setAAD'](_0x297dd4['slice'](0x0, 0x1a));
            _0x58bfcf['setAuthTag'](_0x297dd4['slice'](-0x10));
            const _0x5abeb3 = Buffer['concat']([
                _0x58bfcf['update'](_0x297dd4['slice'](0x32, -0x10)),
                _0x58bfcf['final']()
            ]);
            _0x4695d9 = JSON['parse'](_0x5abeb3['toString']('utf-8'));
        }
        if (_0x4695d9['configMessage']) {
            _0x4695d9['configMessage'] = decodeJavaUtf16Xor(_0x4695d9['configMessage'], _0x27de55);
        }
        if (_0x4695d9['v2rRawJson'] && typeof _0x4695d9['v2rRawJson'] === 'string') {
            try {
                _0x4695d9['v2rRawJson'] = JSON['parse'](_0x4695d9['v2rRawJson']);
            } catch (_0x1e5d79) {
            }
        }
        if (_0x4695d9['overwriteServerData'] && typeof _0x4695d9['overwriteServerData'] === 'string') {
            try {
                _0x4695d9['overwriteServerData'] = JSON['parse'](_0x4695d9['overwriteServerData']);
            } catch (_0x5d7aa8) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x4695d9, null, 0x4);
    } catch (_0x14b656) {
        return null;
    }
}