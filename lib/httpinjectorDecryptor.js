import _0x0_0x43f14f from 'crypto';
import _0x0_0x4e9053 from 'argon2';
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
function customB64DecodeEhi(_0x1a238d) {
    const _0x2063f0 = _0x1a238d['replace'](/\?/g, '');
    let _0x11ed80 = '';
    for (let _0x466f75 = 0x0; _0x466f75 < _0x2063f0['length']; _0x466f75++) {
        _0x11ed80 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x2063f0[_0x466f75]] || _0x2063f0[_0x466f75];
    }
    while (_0x11ed80['length'] % 0x4 !== 0x0)
        _0x11ed80 += '=';
    return Buffer['from'](_0x11ed80, 'base64');
}
function ehiDecryptXorLayer(_0x45ecd2, _0x203a54) {
    if (!_0x45ecd2 || !_0x45ecd2['trim']())
        return null;
    try {
        const _0x5aa279 = _0x45ecd2['split']('')['reverse']()['join']('');
        const _0x18683f = customB64DecodeEhi(_0x5aa279);
        const _0x22fa94 = Buffer['from'](_0x18683f['toString']('ascii'), 'hex');
        const _0x112ffc = Buffer['from'](_0x203a54);
        const _0x4605ae = [];
        for (let _0x1928f0 = 0x0; _0x1928f0 < _0x22fa94['length']; _0x1928f0++) {
            const _0x139e0a = _0x22fa94[_0x1928f0] ^ _0x112ffc[_0x1928f0 % _0x112ffc['length']];
            if (_0x139e0a !== 0x0)
                _0x4605ae['push'](_0x139e0a);
        }
        return Buffer['from'](_0x4605ae)['toString']('utf-8');
    } catch (_0xfccdaa) {
        return null;
    }
}
function xxteaDecrypt(_0x59dbab, _0x4ef605) {
    if (_0x59dbab['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x40034b = Math['floor'](_0x59dbab['length'] / 0x4);
    const _0x10f58c = new Uint32Array(_0x40034b);
    for (let _0x26f484 = 0x0; _0x26f484 < _0x40034b; _0x26f484++)
        _0x10f58c[_0x26f484] = _0x59dbab['readUInt32LE'](_0x26f484 * 0x4);
    const _0x5c0cb2 = new Uint32Array(0x4);
    for (let _0x4b4187 = 0x0; _0x4b4187 < 0x4; _0x4b4187++)
        _0x5c0cb2[_0x4b4187] = _0x4ef605['readUInt32LE'](Math['min'](_0x4b4187 * 0x4, _0x4ef605['length'] - 0x4));
    const _0x21823e = 0x9e3779b9;
    let _0x5d561f = Math['floor'](0x6 + 0x34 / _0x40034b);
    let _0x4c7683 = _0x5d561f * _0x21823e & 0xffffffff;
    let _0x313978 = _0x10f58c;
    while (_0x4c7683 !== 0x0) {
        const _0x37d381 = _0x4c7683 >> 0x2 & 0x3;
        for (let _0x5996e1 = _0x40034b - 0x1; _0x5996e1 > 0x0; _0x5996e1--) {
            const _0x292b76 = _0x10f58c[_0x5996e1 - 0x1];
            const _0x95ccf6 = (_0x292b76 >> 0x5 ^ _0x313978 << 0x2) + (_0x313978 >> 0x3 ^ _0x292b76 << 0x4) ^ (_0x4c7683 ^ _0x313978) + (_0x5c0cb2[_0x5996e1 & 0x3 ^ _0x37d381] ^ _0x292b76);
            _0x313978 = _0x10f58c[_0x5996e1] = _0x10f58c[_0x5996e1] - _0x95ccf6 & 0xffffffff;
        }
        const _0x589e23 = _0x10f58c[_0x40034b - 0x1];
        const _0x10d4cc = (_0x589e23 >> 0x5 ^ _0x313978 << 0x2) + (_0x313978 >> 0x3 ^ _0x589e23 << 0x4) ^ (_0x4c7683 ^ _0x313978) + (_0x5c0cb2[0x0 & 0x3 ^ _0x37d381] ^ _0x589e23);
        _0x313978 = _0x10f58c = _0x10f58c - _0x10d4cc & 0xffffffff;
        _0x4c7683 = _0x4c7683 - _0x21823e & 0xffffffff;
    }
    const _0x18b408 = Buffer['alloc'](_0x40034b * 0x4);
    for (let _0x40d505 = 0x0; _0x40d505 < _0x40034b; _0x40d505++)
        _0x18b408['writeUInt32LE'](_0x10f58c[_0x40d505], _0x40d505 * 0x4);
    const _0x3e7bb4 = _0x10f58c[_0x40034b - 0x1];
    return _0x3e7bb4 > 0x0 && _0x3e7bb4 <= _0x40034b * 0x4 ? _0x18b408['slice'](0x0, _0x3e7bb4) : _0x18b408;
}
function ehiParseBytes(_0x408863) {
    try {
        let _0x3a7c57 = 0x0;
        if (_0x408863['readUInt16BE'](0x0) === 0xaced)
            _0x3a7c57 = 0x4;
        function _0x213b0d() {
            if (_0x3a7c57 + 0x2 > _0x408863['length'])
                return '';
            const _0xb0a337 = _0x408863['readUInt16BE'](_0x3a7c57);
            _0x3a7c57 += 0x2;
            const _0x458dd9 = _0x408863['slice'](_0x3a7c57, _0x3a7c57 + _0xb0a337)['toString']('utf-8');
            _0x3a7c57 += _0xb0a337;
            return _0x458dd9;
        }
        _0x213b0d();
        _0x3a7c57 += 0x8;
        _0x213b0d();
        _0x3a7c57 += 0x8;
        if (_0x3a7c57 + 0x4 > _0x408863['length'])
            return null;
        const _0x53c8f6 = _0x408863['readUInt32BE'](_0x3a7c57);
        _0x3a7c57 += 0x4;
        _0x3a7c57 += 0x8;
        return _0x408863['slice'](_0x3a7c57, _0x3a7c57 + _0x53c8f6);
    } catch (_0xfc1369) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x464604, _0x5919c1) {
    if (!_0x464604)
        return _0x464604;
    try {
        const _0x23308f = Buffer['from'](_0x5919c1, 'utf-8');
        const _0x312cc4 = Buffer['from'](_0x464604, 'utf-16le');
        const _0x46c477 = Buffer['alloc'](_0x312cc4['length']);
        for (let _0x3d6d66 = 0x0; _0x3d6d66 < _0x312cc4['length']; _0x3d6d66++) {
            _0x46c477[_0x3d6d66] = _0x312cc4[_0x3d6d66] ^ _0x23308f[_0x3d6d66 % _0x23308f['length']];
        }
        return _0x46c477['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x1a3620) {
        return _0x464604;
    }
}
function generateMasterKey(_0x19bb99) {
    const _0x17e639 = [
        _0x19bb99['configAesKey'],
        _0x19bb99['configIdentifier'],
        _0x19bb99['configSalt'],
        _0x19bb99['configTimestamp'] ? String(_0x19bb99['configTimestamp']) : '',
        _0x19bb99['configExpiryTimestamp'] ? String(_0x19bb99['configExpiryTimestamp']) : '',
        _0x19bb99['lockModes'],
        _0x19bb99['lockModesHash'],
        _0x19bb99['configHwid'],
        _0x19bb99['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x43f14f['createHash']('sha256')['update'](_0x17e639, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x203e2c) {
    try {
        const _0x21243e = ehiParseBytes(_0x203e2c);
        if (!_0x21243e)
            return null;
        let _0x556b7f = null;
        let _0xb03e71 = null;
        for (const _0x43dac0 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0xf06e5c = _0x0_0x43f14f['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x43dac0);
                const _0x12f897 = Buffer['concat']([
                    _0xf06e5c['update'](_0x21243e),
                    _0xf06e5c['final']()
                ])['toString']('utf-8');
                const _0x3e56fb = _0x12f897['split'](':');
                if (_0x3e56fb['length'] >= 0x3) {
                    const _0x47b886 = _0x0_0x43f14f['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x3e56fb[0x1], 'base64'));
                    const _0x18c206 = Buffer['concat']([
                        _0x47b886['update'](Buffer['from'](_0x3e56fb[0x1], 'base64')),
                        _0x47b886['final']()
                    ]);
                    const _0x2dbc5c = xxteaDecrypt(_0x18c206, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x3b40b0 = _0x2dbc5c['indexOf'](0x7b);
                    if (_0x3b40b0 !== -0x1) {
                        _0x556b7f = JSON['parse'](_0x2dbc5c['slice'](_0x3b40b0)['toString']('utf-8'));
                        _0xb03e71 = _0x43dac0;
                        break;
                    }
                }
            } catch (_0x1e9744) {
                continue;
            }
        }
        if (!_0x556b7f)
            return null;
        const _0x27e89b = _0x556b7f['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x27f7ca => _0x27f7ca['equals'](_0xb03e71)) && _0x556b7f['configData']) {
            const _0x5d3274 = ehiDecryptXorLayer(_0x556b7f['configData'], _0x27e89b);
            if (!_0x5d3274)
                return null;
            const _0x1193fe = Buffer['from'](_0x5d3274, 'base64');
            const _0x38d942 = _0x1193fe['slice'](0xa, 0x1a);
            const _0x309d46 = _0x1193fe['readUInt32LE'](0x1);
            const _0x40d7aa = _0x1193fe['readUInt32LE'](0x5);
            const _0x170f4a = _0x1193fe[0x9] || 0x1;
            const _0x27db5c = generateMasterKey(_0x556b7f);
            const _0x3adfa5 = await _0x0_0x4e9053['hash'](_0x27db5c, {
                'salt': _0x38d942,
                'timeCost': _0x309d46,
                'memoryCost': _0x40d7aa,
                'parallelism': _0x170f4a,
                'hashLength': 0x20,
                'type': _0x0_0x4e9053['argon2id'],
                'raw': !![]
            });
            const _0xb1bcb4 = _0x0_0x43f14f['createDecipheriv']('chacha20-poly1305', _0x3adfa5, _0x1193fe['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0xb1bcb4['setAAD'](_0x1193fe['slice'](0x0, 0x1a));
            _0xb1bcb4['setAuthTag'](_0x1193fe['slice'](-0x10));
            const _0x325204 = Buffer['concat']([
                _0xb1bcb4['update'](_0x1193fe['slice'](0x32, -0x10)),
                _0xb1bcb4['final']()
            ]);
            _0x556b7f = JSON['parse'](_0x325204['toString']('utf-8'));
        }
        if (_0x556b7f['configMessage']) {
            _0x556b7f['configMessage'] = decodeJavaUtf16Xor(_0x556b7f['configMessage'], _0x27e89b);
        }
        if (_0x556b7f['v2rRawJson'] && typeof _0x556b7f['v2rRawJson'] === 'string') {
            try {
                _0x556b7f['v2rRawJson'] = JSON['parse'](_0x556b7f['v2rRawJson']);
            } catch (_0x880aac) {
            }
        }
        if (_0x556b7f['overwriteServerData'] && typeof _0x556b7f['overwriteServerData'] === 'string') {
            try {
                _0x556b7f['overwriteServerData'] = JSON['parse'](_0x556b7f['overwriteServerData']);
            } catch (_0x599f4d) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x556b7f, null, 0x4);
    } catch (_0x185a80) {
        return null;
    }
}