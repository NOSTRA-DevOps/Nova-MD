import _0x0_0x504a45 from 'crypto';
import _0x0_0x142bb8 from 'argon2';
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
function customB64DecodeEhi(_0x159b49) {
    const _0x1d9163 = _0x159b49['replace'](/\?/g, '');
    let _0x3db160 = '';
    for (let _0x375727 = 0x0; _0x375727 < _0x1d9163['length']; _0x375727++) {
        _0x3db160 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x1d9163[_0x375727]] || _0x1d9163[_0x375727];
    }
    while (_0x3db160['length'] % 0x4 !== 0x0)
        _0x3db160 += '=';
    return Buffer['from'](_0x3db160, 'base64');
}
function ehiDecryptXorLayer(_0x3dd082, _0x3d4b56) {
    if (!_0x3dd082 || !_0x3dd082['trim']())
        return null;
    try {
        const _0x41fa3f = _0x3dd082['split']('')['reverse']()['join']('');
        const _0x30893d = customB64DecodeEhi(_0x41fa3f);
        const _0x1f028e = Buffer['from'](_0x30893d['toString']('ascii'), 'hex');
        const _0x23d062 = Buffer['from'](_0x3d4b56);
        const _0x536d3d = [];
        for (let _0x3045a8 = 0x0; _0x3045a8 < _0x1f028e['length']; _0x3045a8++) {
            const _0x51a7e6 = _0x1f028e[_0x3045a8] ^ _0x23d062[_0x3045a8 % _0x23d062['length']];
            if (_0x51a7e6 !== 0x0)
                _0x536d3d['push'](_0x51a7e6);
        }
        return Buffer['from'](_0x536d3d)['toString']('utf-8');
    } catch (_0x3fcceb) {
        return null;
    }
}
function xxteaDecrypt(_0x45c2df, _0x129b3b) {
    if (_0x45c2df['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x510c66 = Math['floor'](_0x45c2df['length'] / 0x4);
    const _0x5e12c1 = new Uint32Array(_0x510c66);
    for (let _0x15a435 = 0x0; _0x15a435 < _0x510c66; _0x15a435++)
        _0x5e12c1[_0x15a435] = _0x45c2df['readUInt32LE'](_0x15a435 * 0x4);
    const _0x42f570 = new Uint32Array(0x4);
    for (let _0x2ff01a = 0x0; _0x2ff01a < 0x4; _0x2ff01a++)
        _0x42f570[_0x2ff01a] = _0x129b3b['readUInt32LE'](Math['min'](_0x2ff01a * 0x4, _0x129b3b['length'] - 0x4));
    const _0x33fa8e = 0x9e3779b9;
    let _0xd0d532 = Math['floor'](0x6 + 0x34 / _0x510c66);
    let _0x415624 = _0xd0d532 * _0x33fa8e & 0xffffffff;
    let _0x448434 = _0x5e12c1;
    while (_0x415624 !== 0x0) {
        const _0x55bb15 = _0x415624 >> 0x2 & 0x3;
        for (let _0x245fa2 = _0x510c66 - 0x1; _0x245fa2 > 0x0; _0x245fa2--) {
            const _0x14d4ac = _0x5e12c1[_0x245fa2 - 0x1];
            const _0x4dbb5b = (_0x14d4ac >> 0x5 ^ _0x448434 << 0x2) + (_0x448434 >> 0x3 ^ _0x14d4ac << 0x4) ^ (_0x415624 ^ _0x448434) + (_0x42f570[_0x245fa2 & 0x3 ^ _0x55bb15] ^ _0x14d4ac);
            _0x448434 = _0x5e12c1[_0x245fa2] = _0x5e12c1[_0x245fa2] - _0x4dbb5b & 0xffffffff;
        }
        const _0x5e7e5f = _0x5e12c1[_0x510c66 - 0x1];
        const _0x33a696 = (_0x5e7e5f >> 0x5 ^ _0x448434 << 0x2) + (_0x448434 >> 0x3 ^ _0x5e7e5f << 0x4) ^ (_0x415624 ^ _0x448434) + (_0x42f570[0x0 & 0x3 ^ _0x55bb15] ^ _0x5e7e5f);
        _0x448434 = _0x5e12c1 = _0x5e12c1 - _0x33a696 & 0xffffffff;
        _0x415624 = _0x415624 - _0x33fa8e & 0xffffffff;
    }
    const _0x4253d4 = Buffer['alloc'](_0x510c66 * 0x4);
    for (let _0x285c44 = 0x0; _0x285c44 < _0x510c66; _0x285c44++)
        _0x4253d4['writeUInt32LE'](_0x5e12c1[_0x285c44], _0x285c44 * 0x4);
    const _0x4db916 = _0x5e12c1[_0x510c66 - 0x1];
    return _0x4db916 > 0x0 && _0x4db916 <= _0x510c66 * 0x4 ? _0x4253d4['slice'](0x0, _0x4db916) : _0x4253d4;
}
function ehiParseBytes(_0x1c4745) {
    try {
        let _0x598a41 = 0x0;
        if (_0x1c4745['readUInt16BE'](0x0) === 0xaced)
            _0x598a41 = 0x4;
        function _0x55e54a() {
            if (_0x598a41 + 0x2 > _0x1c4745['length'])
                return '';
            const _0x3c4a1b = _0x1c4745['readUInt16BE'](_0x598a41);
            _0x598a41 += 0x2;
            const _0x27464c = _0x1c4745['slice'](_0x598a41, _0x598a41 + _0x3c4a1b)['toString']('utf-8');
            _0x598a41 += _0x3c4a1b;
            return _0x27464c;
        }
        _0x55e54a();
        _0x598a41 += 0x8;
        _0x55e54a();
        _0x598a41 += 0x8;
        if (_0x598a41 + 0x4 > _0x1c4745['length'])
            return null;
        const _0xcc033 = _0x1c4745['readUInt32BE'](_0x598a41);
        _0x598a41 += 0x4;
        _0x598a41 += 0x8;
        return _0x1c4745['slice'](_0x598a41, _0x598a41 + _0xcc033);
    } catch (_0x1c208e) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x1ffe74, _0x5ddee6) {
    if (!_0x1ffe74)
        return _0x1ffe74;
    try {
        const _0x2c1e81 = Buffer['from'](_0x5ddee6, 'utf-8');
        const _0x320e46 = Buffer['from'](_0x1ffe74, 'utf-16le');
        const _0x3362ce = Buffer['alloc'](_0x320e46['length']);
        for (let _0x1e1017 = 0x0; _0x1e1017 < _0x320e46['length']; _0x1e1017++) {
            _0x3362ce[_0x1e1017] = _0x320e46[_0x1e1017] ^ _0x2c1e81[_0x1e1017 % _0x2c1e81['length']];
        }
        return _0x3362ce['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x358e7c) {
        return _0x1ffe74;
    }
}
function generateMasterKey(_0x454858) {
    const _0x56e9da = [
        _0x454858['configAesKey'],
        _0x454858['configIdentifier'],
        _0x454858['configSalt'],
        _0x454858['configTimestamp'] ? String(_0x454858['configTimestamp']) : '',
        _0x454858['configExpiryTimestamp'] ? String(_0x454858['configExpiryTimestamp']) : '',
        _0x454858['lockModes'],
        _0x454858['lockModesHash'],
        _0x454858['configHwid'],
        _0x454858['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x504a45['createHash']('sha256')['update'](_0x56e9da, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0xf8f8ad) {
    try {
        const _0x10bc89 = ehiParseBytes(_0xf8f8ad);
        if (!_0x10bc89)
            return null;
        let _0x45c1f5 = null;
        let _0x45e12b = null;
        for (const _0x24eca1 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x4cdc3d = _0x0_0x504a45['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x24eca1);
                const _0x32b9ce = Buffer['concat']([
                    _0x4cdc3d['update'](_0x10bc89),
                    _0x4cdc3d['final']()
                ])['toString']('utf-8');
                const _0x2f6328 = _0x32b9ce['split'](':');
                if (_0x2f6328['length'] >= 0x3) {
                    const _0x48c077 = _0x0_0x504a45['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x2f6328[0x1], 'base64'));
                    const _0x6dadcd = Buffer['concat']([
                        _0x48c077['update'](Buffer['from'](_0x2f6328[0x1], 'base64')),
                        _0x48c077['final']()
                    ]);
                    const _0x39927a = xxteaDecrypt(_0x6dadcd, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x1e027e = _0x39927a['indexOf'](0x7b);
                    if (_0x1e027e !== -0x1) {
                        _0x45c1f5 = JSON['parse'](_0x39927a['slice'](_0x1e027e)['toString']('utf-8'));
                        _0x45e12b = _0x24eca1;
                        break;
                    }
                }
            } catch (_0x305c7b) {
                continue;
            }
        }
        if (!_0x45c1f5)
            return null;
        const _0x13c912 = _0x45c1f5['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x48e3e4 => _0x48e3e4['equals'](_0x45e12b)) && _0x45c1f5['configData']) {
            const _0x3d851e = ehiDecryptXorLayer(_0x45c1f5['configData'], _0x13c912);
            if (!_0x3d851e)
                return null;
            const _0x35f63f = Buffer['from'](_0x3d851e, 'base64');
            const _0x418b0c = _0x35f63f['slice'](0xa, 0x1a);
            const _0x21f324 = _0x35f63f['readUInt32LE'](0x1);
            const _0x5bba26 = _0x35f63f['readUInt32LE'](0x5);
            const _0x2ea524 = _0x35f63f[0x9] || 0x1;
            const _0x17e807 = generateMasterKey(_0x45c1f5);
            const _0x51ea0b = await _0x0_0x142bb8['hash'](_0x17e807, {
                'salt': _0x418b0c,
                'timeCost': _0x21f324,
                'memoryCost': _0x5bba26,
                'parallelism': _0x2ea524,
                'hashLength': 0x20,
                'type': _0x0_0x142bb8['argon2id'],
                'raw': !![]
            });
            const _0x447062 = _0x0_0x504a45['createDecipheriv']('chacha20-poly1305', _0x51ea0b, _0x35f63f['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x447062['setAAD'](_0x35f63f['slice'](0x0, 0x1a));
            _0x447062['setAuthTag'](_0x35f63f['slice'](-0x10));
            const _0x1a40d7 = Buffer['concat']([
                _0x447062['update'](_0x35f63f['slice'](0x32, -0x10)),
                _0x447062['final']()
            ]);
            _0x45c1f5 = JSON['parse'](_0x1a40d7['toString']('utf-8'));
        }
        if (_0x45c1f5['configMessage']) {
            _0x45c1f5['configMessage'] = decodeJavaUtf16Xor(_0x45c1f5['configMessage'], _0x13c912);
        }
        if (_0x45c1f5['v2rRawJson'] && typeof _0x45c1f5['v2rRawJson'] === 'string') {
            try {
                _0x45c1f5['v2rRawJson'] = JSON['parse'](_0x45c1f5['v2rRawJson']);
            } catch (_0x4de6cc) {
            }
        }
        if (_0x45c1f5['overwriteServerData'] && typeof _0x45c1f5['overwriteServerData'] === 'string') {
            try {
                _0x45c1f5['overwriteServerData'] = JSON['parse'](_0x45c1f5['overwriteServerData']);
            } catch (_0x3d805a) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x45c1f5, null, 0x4);
    } catch (_0x330124) {
        return null;
    }
}