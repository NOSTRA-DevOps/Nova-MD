import _0x0_0x442e5a from 'crypto';
import _0x0_0x27b16e from 'argon2';
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
function customB64DecodeEhi(_0xc3f6f6) {
    const _0x2700bf = _0xc3f6f6['replace'](/\?/g, '');
    let _0x3a010f = '';
    for (let _0x46224c = 0x0; _0x46224c < _0x2700bf['length']; _0x46224c++) {
        _0x3a010f += EHI_CONSTANTS['TRANSLATION_MAP'][_0x2700bf[_0x46224c]] || _0x2700bf[_0x46224c];
    }
    while (_0x3a010f['length'] % 0x4 !== 0x0)
        _0x3a010f += '=';
    return Buffer['from'](_0x3a010f, 'base64');
}
function ehiDecryptXorLayer(_0x38c482, _0x291ef6) {
    if (!_0x38c482 || !_0x38c482['trim']())
        return null;
    try {
        const _0x3e6987 = _0x38c482['split']('')['reverse']()['join']('');
        const _0x12758a = customB64DecodeEhi(_0x3e6987);
        const _0x454655 = Buffer['from'](_0x12758a['toString']('ascii'), 'hex');
        const _0x1c8928 = Buffer['from'](_0x291ef6);
        const _0x1ef8e8 = [];
        for (let _0x46a866 = 0x0; _0x46a866 < _0x454655['length']; _0x46a866++) {
            const _0x228b0d = _0x454655[_0x46a866] ^ _0x1c8928[_0x46a866 % _0x1c8928['length']];
            if (_0x228b0d !== 0x0)
                _0x1ef8e8['push'](_0x228b0d);
        }
        return Buffer['from'](_0x1ef8e8)['toString']('utf-8');
    } catch (_0x1183a7) {
        return null;
    }
}
function xxteaDecrypt(_0x412341, _0x2a4ac4) {
    if (_0x412341['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x2e2d05 = Math['floor'](_0x412341['length'] / 0x4);
    const _0x3f3a36 = new Uint32Array(_0x2e2d05);
    for (let _0x746316 = 0x0; _0x746316 < _0x2e2d05; _0x746316++)
        _0x3f3a36[_0x746316] = _0x412341['readUInt32LE'](_0x746316 * 0x4);
    const _0x58e7a3 = new Uint32Array(0x4);
    for (let _0x44d986 = 0x0; _0x44d986 < 0x4; _0x44d986++)
        _0x58e7a3[_0x44d986] = _0x2a4ac4['readUInt32LE'](Math['min'](_0x44d986 * 0x4, _0x2a4ac4['length'] - 0x4));
    const _0x4c4007 = 0x9e3779b9;
    let _0x3a0111 = Math['floor'](0x6 + 0x34 / _0x2e2d05);
    let _0x1339bf = _0x3a0111 * _0x4c4007 & 0xffffffff;
    let _0x624783 = _0x3f3a36;
    while (_0x1339bf !== 0x0) {
        const _0x18d94d = _0x1339bf >> 0x2 & 0x3;
        for (let _0x52ce86 = _0x2e2d05 - 0x1; _0x52ce86 > 0x0; _0x52ce86--) {
            const _0x4f05a6 = _0x3f3a36[_0x52ce86 - 0x1];
            const _0x2fb35b = (_0x4f05a6 >> 0x5 ^ _0x624783 << 0x2) + (_0x624783 >> 0x3 ^ _0x4f05a6 << 0x4) ^ (_0x1339bf ^ _0x624783) + (_0x58e7a3[_0x52ce86 & 0x3 ^ _0x18d94d] ^ _0x4f05a6);
            _0x624783 = _0x3f3a36[_0x52ce86] = _0x3f3a36[_0x52ce86] - _0x2fb35b & 0xffffffff;
        }
        const _0x3864c6 = _0x3f3a36[_0x2e2d05 - 0x1];
        const _0x5dc126 = (_0x3864c6 >> 0x5 ^ _0x624783 << 0x2) + (_0x624783 >> 0x3 ^ _0x3864c6 << 0x4) ^ (_0x1339bf ^ _0x624783) + (_0x58e7a3[0x0 & 0x3 ^ _0x18d94d] ^ _0x3864c6);
        _0x624783 = _0x3f3a36 = _0x3f3a36 - _0x5dc126 & 0xffffffff;
        _0x1339bf = _0x1339bf - _0x4c4007 & 0xffffffff;
    }
    const _0x23c7dd = Buffer['alloc'](_0x2e2d05 * 0x4);
    for (let _0x2f5c57 = 0x0; _0x2f5c57 < _0x2e2d05; _0x2f5c57++)
        _0x23c7dd['writeUInt32LE'](_0x3f3a36[_0x2f5c57], _0x2f5c57 * 0x4);
    const _0x152d4e = _0x3f3a36[_0x2e2d05 - 0x1];
    return _0x152d4e > 0x0 && _0x152d4e <= _0x2e2d05 * 0x4 ? _0x23c7dd['slice'](0x0, _0x152d4e) : _0x23c7dd;
}
function ehiParseBytes(_0x98e6dc) {
    try {
        let _0x4d09d0 = 0x0;
        if (_0x98e6dc['readUInt16BE'](0x0) === 0xaced)
            _0x4d09d0 = 0x4;
        function _0x225c6c() {
            if (_0x4d09d0 + 0x2 > _0x98e6dc['length'])
                return '';
            const _0x5277a7 = _0x98e6dc['readUInt16BE'](_0x4d09d0);
            _0x4d09d0 += 0x2;
            const _0x25aca3 = _0x98e6dc['slice'](_0x4d09d0, _0x4d09d0 + _0x5277a7)['toString']('utf-8');
            _0x4d09d0 += _0x5277a7;
            return _0x25aca3;
        }
        _0x225c6c();
        _0x4d09d0 += 0x8;
        _0x225c6c();
        _0x4d09d0 += 0x8;
        if (_0x4d09d0 + 0x4 > _0x98e6dc['length'])
            return null;
        const _0x1351f4 = _0x98e6dc['readUInt32BE'](_0x4d09d0);
        _0x4d09d0 += 0x4;
        _0x4d09d0 += 0x8;
        return _0x98e6dc['slice'](_0x4d09d0, _0x4d09d0 + _0x1351f4);
    } catch (_0x1df2d0) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x217d95, _0x1f291e) {
    if (!_0x217d95)
        return _0x217d95;
    try {
        const _0x34bd6e = Buffer['from'](_0x1f291e, 'utf-8');
        const _0x12a8c7 = Buffer['from'](_0x217d95, 'utf-16le');
        const _0x5ca3b2 = Buffer['alloc'](_0x12a8c7['length']);
        for (let _0x15f5ac = 0x0; _0x15f5ac < _0x12a8c7['length']; _0x15f5ac++) {
            _0x5ca3b2[_0x15f5ac] = _0x12a8c7[_0x15f5ac] ^ _0x34bd6e[_0x15f5ac % _0x34bd6e['length']];
        }
        return _0x5ca3b2['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x472a27) {
        return _0x217d95;
    }
}
function generateMasterKey(_0x129f87) {
    const _0xb4581d = [
        _0x129f87['configAesKey'],
        _0x129f87['configIdentifier'],
        _0x129f87['configSalt'],
        _0x129f87['configTimestamp'] ? String(_0x129f87['configTimestamp']) : '',
        _0x129f87['configExpiryTimestamp'] ? String(_0x129f87['configExpiryTimestamp']) : '',
        _0x129f87['lockModes'],
        _0x129f87['lockModesHash'],
        _0x129f87['configHwid'],
        _0x129f87['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x442e5a['createHash']('sha256')['update'](_0xb4581d, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x1be603) {
    try {
        const _0x547231 = ehiParseBytes(_0x1be603);
        if (!_0x547231)
            return null;
        let _0x2f2850 = null;
        let _0x36df1f = null;
        for (const _0x2ba723 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x4612d5 = _0x0_0x442e5a['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x2ba723);
                const _0x5c3dde = Buffer['concat']([
                    _0x4612d5['update'](_0x547231),
                    _0x4612d5['final']()
                ])['toString']('utf-8');
                const _0x2c2f4f = _0x5c3dde['split'](':');
                if (_0x2c2f4f['length'] >= 0x3) {
                    const _0x16c2f3 = _0x0_0x442e5a['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x2c2f4f[0x1], 'base64'));
                    const _0x6f156f = Buffer['concat']([
                        _0x16c2f3['update'](Buffer['from'](_0x2c2f4f[0x1], 'base64')),
                        _0x16c2f3['final']()
                    ]);
                    const _0x465472 = xxteaDecrypt(_0x6f156f, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x240538 = _0x465472['indexOf'](0x7b);
                    if (_0x240538 !== -0x1) {
                        _0x2f2850 = JSON['parse'](_0x465472['slice'](_0x240538)['toString']('utf-8'));
                        _0x36df1f = _0x2ba723;
                        break;
                    }
                }
            } catch (_0x289e8c) {
                continue;
            }
        }
        if (!_0x2f2850)
            return null;
        const _0x57128e = _0x2f2850['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x437aa8 => _0x437aa8['equals'](_0x36df1f)) && _0x2f2850['configData']) {
            const _0x58b1d1 = ehiDecryptXorLayer(_0x2f2850['configData'], _0x57128e);
            if (!_0x58b1d1)
                return null;
            const _0x5b2b50 = Buffer['from'](_0x58b1d1, 'base64');
            const _0x3f298b = _0x5b2b50['slice'](0xa, 0x1a);
            const _0x53f547 = _0x5b2b50['readUInt32LE'](0x1);
            const _0x53bf6f = _0x5b2b50['readUInt32LE'](0x5);
            const _0xd8990b = _0x5b2b50[0x9] || 0x1;
            const _0x374de0 = generateMasterKey(_0x2f2850);
            const _0x350eb3 = await _0x0_0x27b16e['hash'](_0x374de0, {
                'salt': _0x3f298b,
                'timeCost': _0x53f547,
                'memoryCost': _0x53bf6f,
                'parallelism': _0xd8990b,
                'hashLength': 0x20,
                'type': _0x0_0x27b16e['argon2id'],
                'raw': !![]
            });
            const _0xa8478f = _0x0_0x442e5a['createDecipheriv']('chacha20-poly1305', _0x350eb3, _0x5b2b50['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0xa8478f['setAAD'](_0x5b2b50['slice'](0x0, 0x1a));
            _0xa8478f['setAuthTag'](_0x5b2b50['slice'](-0x10));
            const _0x93129e = Buffer['concat']([
                _0xa8478f['update'](_0x5b2b50['slice'](0x32, -0x10)),
                _0xa8478f['final']()
            ]);
            _0x2f2850 = JSON['parse'](_0x93129e['toString']('utf-8'));
        }
        if (_0x2f2850['configMessage']) {
            _0x2f2850['configMessage'] = decodeJavaUtf16Xor(_0x2f2850['configMessage'], _0x57128e);
        }
        if (_0x2f2850['v2rRawJson'] && typeof _0x2f2850['v2rRawJson'] === 'string') {
            try {
                _0x2f2850['v2rRawJson'] = JSON['parse'](_0x2f2850['v2rRawJson']);
            } catch (_0x80701a) {
            }
        }
        if (_0x2f2850['overwriteServerData'] && typeof _0x2f2850['overwriteServerData'] === 'string') {
            try {
                _0x2f2850['overwriteServerData'] = JSON['parse'](_0x2f2850['overwriteServerData']);
            } catch (_0x423153) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x2f2850, null, 0x4);
    } catch (_0x126f92) {
        return null;
    }
}