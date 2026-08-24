import _0x0_0x391446 from 'crypto';
import _0x0_0x54845e from 'argon2';
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
function customB64DecodeEhi(_0x3165b3) {
    const _0x5c0646 = _0x3165b3['replace'](/\?/g, '');
    let _0x550331 = '';
    for (let _0x31e87d = 0x0; _0x31e87d < _0x5c0646['length']; _0x31e87d++) {
        _0x550331 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x5c0646[_0x31e87d]] || _0x5c0646[_0x31e87d];
    }
    while (_0x550331['length'] % 0x4 !== 0x0)
        _0x550331 += '=';
    return Buffer['from'](_0x550331, 'base64');
}
function ehiDecryptXorLayer(_0x48b2ab, _0xa64e2c) {
    if (!_0x48b2ab || !_0x48b2ab['trim']())
        return null;
    try {
        const _0x553d5d = _0x48b2ab['split']('')['reverse']()['join']('');
        const _0x19a10a = customB64DecodeEhi(_0x553d5d);
        const _0x10638d = Buffer['from'](_0x19a10a['toString']('ascii'), 'hex');
        const _0x37eb88 = Buffer['from'](_0xa64e2c);
        const _0x2cdc88 = [];
        for (let _0x385659 = 0x0; _0x385659 < _0x10638d['length']; _0x385659++) {
            const _0x2cb4be = _0x10638d[_0x385659] ^ _0x37eb88[_0x385659 % _0x37eb88['length']];
            if (_0x2cb4be !== 0x0)
                _0x2cdc88['push'](_0x2cb4be);
        }
        return Buffer['from'](_0x2cdc88)['toString']('utf-8');
    } catch (_0x5f4c3a) {
        return null;
    }
}
function xxteaDecrypt(_0xcaf09, _0x156238) {
    if (_0xcaf09['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x19cd52 = Math['floor'](_0xcaf09['length'] / 0x4);
    const _0x17faff = new Uint32Array(_0x19cd52);
    for (let _0x158fe3 = 0x0; _0x158fe3 < _0x19cd52; _0x158fe3++)
        _0x17faff[_0x158fe3] = _0xcaf09['readUInt32LE'](_0x158fe3 * 0x4);
    const _0x3bab37 = new Uint32Array(0x4);
    for (let _0x495feb = 0x0; _0x495feb < 0x4; _0x495feb++)
        _0x3bab37[_0x495feb] = _0x156238['readUInt32LE'](Math['min'](_0x495feb * 0x4, _0x156238['length'] - 0x4));
    const _0x5a09c8 = 0x9e3779b9;
    let _0x2d1d07 = Math['floor'](0x6 + 0x34 / _0x19cd52);
    let _0x30676b = _0x2d1d07 * _0x5a09c8 & 0xffffffff;
    let _0x45392e = _0x17faff;
    while (_0x30676b !== 0x0) {
        const _0x219a34 = _0x30676b >> 0x2 & 0x3;
        for (let _0x363234 = _0x19cd52 - 0x1; _0x363234 > 0x0; _0x363234--) {
            const _0x1a34ba = _0x17faff[_0x363234 - 0x1];
            const _0xb73d92 = (_0x1a34ba >> 0x5 ^ _0x45392e << 0x2) + (_0x45392e >> 0x3 ^ _0x1a34ba << 0x4) ^ (_0x30676b ^ _0x45392e) + (_0x3bab37[_0x363234 & 0x3 ^ _0x219a34] ^ _0x1a34ba);
            _0x45392e = _0x17faff[_0x363234] = _0x17faff[_0x363234] - _0xb73d92 & 0xffffffff;
        }
        const _0x2047a1 = _0x17faff[_0x19cd52 - 0x1];
        const _0x19c069 = (_0x2047a1 >> 0x5 ^ _0x45392e << 0x2) + (_0x45392e >> 0x3 ^ _0x2047a1 << 0x4) ^ (_0x30676b ^ _0x45392e) + (_0x3bab37[0x0 & 0x3 ^ _0x219a34] ^ _0x2047a1);
        _0x45392e = _0x17faff = _0x17faff - _0x19c069 & 0xffffffff;
        _0x30676b = _0x30676b - _0x5a09c8 & 0xffffffff;
    }
    const _0x561b87 = Buffer['alloc'](_0x19cd52 * 0x4);
    for (let _0x284a9c = 0x0; _0x284a9c < _0x19cd52; _0x284a9c++)
        _0x561b87['writeUInt32LE'](_0x17faff[_0x284a9c], _0x284a9c * 0x4);
    const _0x4b01c1 = _0x17faff[_0x19cd52 - 0x1];
    return _0x4b01c1 > 0x0 && _0x4b01c1 <= _0x19cd52 * 0x4 ? _0x561b87['slice'](0x0, _0x4b01c1) : _0x561b87;
}
function ehiParseBytes(_0x50fc6b) {
    try {
        let _0x19b678 = 0x0;
        if (_0x50fc6b['readUInt16BE'](0x0) === 0xaced)
            _0x19b678 = 0x4;
        function _0x262f9a() {
            if (_0x19b678 + 0x2 > _0x50fc6b['length'])
                return '';
            const _0x4dfb5f = _0x50fc6b['readUInt16BE'](_0x19b678);
            _0x19b678 += 0x2;
            const _0x37677e = _0x50fc6b['slice'](_0x19b678, _0x19b678 + _0x4dfb5f)['toString']('utf-8');
            _0x19b678 += _0x4dfb5f;
            return _0x37677e;
        }
        _0x262f9a();
        _0x19b678 += 0x8;
        _0x262f9a();
        _0x19b678 += 0x8;
        if (_0x19b678 + 0x4 > _0x50fc6b['length'])
            return null;
        const _0x27c46a = _0x50fc6b['readUInt32BE'](_0x19b678);
        _0x19b678 += 0x4;
        _0x19b678 += 0x8;
        return _0x50fc6b['slice'](_0x19b678, _0x19b678 + _0x27c46a);
    } catch (_0x288d12) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x3c309c, _0x2f019a) {
    if (!_0x3c309c)
        return _0x3c309c;
    try {
        const _0x126225 = Buffer['from'](_0x2f019a, 'utf-8');
        const _0x2b44b9 = Buffer['from'](_0x3c309c, 'utf-16le');
        const _0x2afd17 = Buffer['alloc'](_0x2b44b9['length']);
        for (let _0x1c35db = 0x0; _0x1c35db < _0x2b44b9['length']; _0x1c35db++) {
            _0x2afd17[_0x1c35db] = _0x2b44b9[_0x1c35db] ^ _0x126225[_0x1c35db % _0x126225['length']];
        }
        return _0x2afd17['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x3e7b9c) {
        return _0x3c309c;
    }
}
function generateMasterKey(_0x9f98ea) {
    const _0x5012bc = [
        _0x9f98ea['configAesKey'],
        _0x9f98ea['configIdentifier'],
        _0x9f98ea['configSalt'],
        _0x9f98ea['configTimestamp'] ? String(_0x9f98ea['configTimestamp']) : '',
        _0x9f98ea['configExpiryTimestamp'] ? String(_0x9f98ea['configExpiryTimestamp']) : '',
        _0x9f98ea['lockModes'],
        _0x9f98ea['lockModesHash'],
        _0x9f98ea['configHwid'],
        _0x9f98ea['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x391446['createHash']('sha256')['update'](_0x5012bc, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x315b1b) {
    try {
        const _0x1ae568 = ehiParseBytes(_0x315b1b);
        if (!_0x1ae568)
            return null;
        let _0x31d846 = null;
        let _0x407ead = null;
        for (const _0x201e20 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x249d7f = _0x0_0x391446['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x201e20);
                const _0x55e616 = Buffer['concat']([
                    _0x249d7f['update'](_0x1ae568),
                    _0x249d7f['final']()
                ])['toString']('utf-8');
                const _0x2c007c = _0x55e616['split'](':');
                if (_0x2c007c['length'] >= 0x3) {
                    const _0x4ce584 = _0x0_0x391446['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x2c007c[0x1], 'base64'));
                    const _0x3364ab = Buffer['concat']([
                        _0x4ce584['update'](Buffer['from'](_0x2c007c[0x1], 'base64')),
                        _0x4ce584['final']()
                    ]);
                    const _0x512b60 = xxteaDecrypt(_0x3364ab, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x4db945 = _0x512b60['indexOf'](0x7b);
                    if (_0x4db945 !== -0x1) {
                        _0x31d846 = JSON['parse'](_0x512b60['slice'](_0x4db945)['toString']('utf-8'));
                        _0x407ead = _0x201e20;
                        break;
                    }
                }
            } catch (_0x4f5c27) {
                continue;
            }
        }
        if (!_0x31d846)
            return null;
        const _0x2e98f2 = _0x31d846['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0xc98d31 => _0xc98d31['equals'](_0x407ead)) && _0x31d846['configData']) {
            const _0x9963c0 = ehiDecryptXorLayer(_0x31d846['configData'], _0x2e98f2);
            if (!_0x9963c0)
                return null;
            const _0x324e16 = Buffer['from'](_0x9963c0, 'base64');
            const _0x2d396e = _0x324e16['slice'](0xa, 0x1a);
            const _0x35f881 = _0x324e16['readUInt32LE'](0x1);
            const _0x546993 = _0x324e16['readUInt32LE'](0x5);
            const _0x2bd497 = _0x324e16[0x9] || 0x1;
            const _0x347ded = generateMasterKey(_0x31d846);
            const _0x534fc2 = await _0x0_0x54845e['hash'](_0x347ded, {
                'salt': _0x2d396e,
                'timeCost': _0x35f881,
                'memoryCost': _0x546993,
                'parallelism': _0x2bd497,
                'hashLength': 0x20,
                'type': _0x0_0x54845e['argon2id'],
                'raw': !![]
            });
            const _0x194823 = _0x0_0x391446['createDecipheriv']('chacha20-poly1305', _0x534fc2, _0x324e16['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x194823['setAAD'](_0x324e16['slice'](0x0, 0x1a));
            _0x194823['setAuthTag'](_0x324e16['slice'](-0x10));
            const _0x48dea2 = Buffer['concat']([
                _0x194823['update'](_0x324e16['slice'](0x32, -0x10)),
                _0x194823['final']()
            ]);
            _0x31d846 = JSON['parse'](_0x48dea2['toString']('utf-8'));
        }
        if (_0x31d846['configMessage']) {
            _0x31d846['configMessage'] = decodeJavaUtf16Xor(_0x31d846['configMessage'], _0x2e98f2);
        }
        if (_0x31d846['v2rRawJson'] && typeof _0x31d846['v2rRawJson'] === 'string') {
            try {
                _0x31d846['v2rRawJson'] = JSON['parse'](_0x31d846['v2rRawJson']);
            } catch (_0x5cf6ac) {
            }
        }
        if (_0x31d846['overwriteServerData'] && typeof _0x31d846['overwriteServerData'] === 'string') {
            try {
                _0x31d846['overwriteServerData'] = JSON['parse'](_0x31d846['overwriteServerData']);
            } catch (_0x221015) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x31d846, null, 0x4);
    } catch (_0x1d36af) {
        return null;
    }
}