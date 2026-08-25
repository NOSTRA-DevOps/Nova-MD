import _0x0_0x5b3f72 from 'crypto';
import _0x0_0x777d75 from 'argon2';
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
function customB64DecodeEhi(_0x30de54) {
    const _0x1b89a8 = _0x30de54['replace'](/\?/g, '');
    let _0x2074d1 = '';
    for (let _0x57e4ef = 0x0; _0x57e4ef < _0x1b89a8['length']; _0x57e4ef++) {
        _0x2074d1 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x1b89a8[_0x57e4ef]] || _0x1b89a8[_0x57e4ef];
    }
    while (_0x2074d1['length'] % 0x4 !== 0x0)
        _0x2074d1 += '=';
    return Buffer['from'](_0x2074d1, 'base64');
}
function ehiDecryptXorLayer(_0xb28d5c, _0x2f5385) {
    if (!_0xb28d5c || !_0xb28d5c['trim']())
        return null;
    try {
        const _0x12e074 = _0xb28d5c['split']('')['reverse']()['join']('');
        const _0x2f5458 = customB64DecodeEhi(_0x12e074);
        const _0x226133 = Buffer['from'](_0x2f5458['toString']('ascii'), 'hex');
        const _0x224bf6 = Buffer['from'](_0x2f5385);
        const _0x55f816 = [];
        for (let _0x4aa13c = 0x0; _0x4aa13c < _0x226133['length']; _0x4aa13c++) {
            const _0x11087b = _0x226133[_0x4aa13c] ^ _0x224bf6[_0x4aa13c % _0x224bf6['length']];
            if (_0x11087b !== 0x0)
                _0x55f816['push'](_0x11087b);
        }
        return Buffer['from'](_0x55f816)['toString']('utf-8');
    } catch (_0xa67333) {
        return null;
    }
}
function xxteaDecrypt(_0x4bbcf1, _0x94b3b3) {
    if (_0x4bbcf1['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x2b1f61 = Math['floor'](_0x4bbcf1['length'] / 0x4);
    const _0x5960e2 = new Uint32Array(_0x2b1f61);
    for (let _0x5c6a2f = 0x0; _0x5c6a2f < _0x2b1f61; _0x5c6a2f++)
        _0x5960e2[_0x5c6a2f] = _0x4bbcf1['readUInt32LE'](_0x5c6a2f * 0x4);
    const _0xb01d0e = new Uint32Array(0x4);
    for (let _0x48dd7c = 0x0; _0x48dd7c < 0x4; _0x48dd7c++)
        _0xb01d0e[_0x48dd7c] = _0x94b3b3['readUInt32LE'](Math['min'](_0x48dd7c * 0x4, _0x94b3b3['length'] - 0x4));
    const _0x43f5c7 = 0x9e3779b9;
    let _0x5577cb = Math['floor'](0x6 + 0x34 / _0x2b1f61);
    let _0x2d619b = _0x5577cb * _0x43f5c7 & 0xffffffff;
    let _0xcab8ea = _0x5960e2;
    while (_0x2d619b !== 0x0) {
        const _0x11a74b = _0x2d619b >> 0x2 & 0x3;
        for (let _0x344da1 = _0x2b1f61 - 0x1; _0x344da1 > 0x0; _0x344da1--) {
            const _0x338a9e = _0x5960e2[_0x344da1 - 0x1];
            const _0x2c2338 = (_0x338a9e >> 0x5 ^ _0xcab8ea << 0x2) + (_0xcab8ea >> 0x3 ^ _0x338a9e << 0x4) ^ (_0x2d619b ^ _0xcab8ea) + (_0xb01d0e[_0x344da1 & 0x3 ^ _0x11a74b] ^ _0x338a9e);
            _0xcab8ea = _0x5960e2[_0x344da1] = _0x5960e2[_0x344da1] - _0x2c2338 & 0xffffffff;
        }
        const _0x3abcb2 = _0x5960e2[_0x2b1f61 - 0x1];
        const _0x4831e6 = (_0x3abcb2 >> 0x5 ^ _0xcab8ea << 0x2) + (_0xcab8ea >> 0x3 ^ _0x3abcb2 << 0x4) ^ (_0x2d619b ^ _0xcab8ea) + (_0xb01d0e[0x0 & 0x3 ^ _0x11a74b] ^ _0x3abcb2);
        _0xcab8ea = _0x5960e2 = _0x5960e2 - _0x4831e6 & 0xffffffff;
        _0x2d619b = _0x2d619b - _0x43f5c7 & 0xffffffff;
    }
    const _0x375ecf = Buffer['alloc'](_0x2b1f61 * 0x4);
    for (let _0x15a185 = 0x0; _0x15a185 < _0x2b1f61; _0x15a185++)
        _0x375ecf['writeUInt32LE'](_0x5960e2[_0x15a185], _0x15a185 * 0x4);
    const _0x4648f4 = _0x5960e2[_0x2b1f61 - 0x1];
    return _0x4648f4 > 0x0 && _0x4648f4 <= _0x2b1f61 * 0x4 ? _0x375ecf['slice'](0x0, _0x4648f4) : _0x375ecf;
}
function ehiParseBytes(_0x2c5e68) {
    try {
        let _0x3dbf1e = 0x0;
        if (_0x2c5e68['readUInt16BE'](0x0) === 0xaced)
            _0x3dbf1e = 0x4;
        function _0x28374a() {
            if (_0x3dbf1e + 0x2 > _0x2c5e68['length'])
                return '';
            const _0x5c8f8b = _0x2c5e68['readUInt16BE'](_0x3dbf1e);
            _0x3dbf1e += 0x2;
            const _0x2a6818 = _0x2c5e68['slice'](_0x3dbf1e, _0x3dbf1e + _0x5c8f8b)['toString']('utf-8');
            _0x3dbf1e += _0x5c8f8b;
            return _0x2a6818;
        }
        _0x28374a();
        _0x3dbf1e += 0x8;
        _0x28374a();
        _0x3dbf1e += 0x8;
        if (_0x3dbf1e + 0x4 > _0x2c5e68['length'])
            return null;
        const _0x43da03 = _0x2c5e68['readUInt32BE'](_0x3dbf1e);
        _0x3dbf1e += 0x4;
        _0x3dbf1e += 0x8;
        return _0x2c5e68['slice'](_0x3dbf1e, _0x3dbf1e + _0x43da03);
    } catch (_0x12b846) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x4ab0cd, _0x265693) {
    if (!_0x4ab0cd)
        return _0x4ab0cd;
    try {
        const _0xb6b97a = Buffer['from'](_0x265693, 'utf-8');
        const _0x4e576d = Buffer['from'](_0x4ab0cd, 'utf-16le');
        const _0x263cfc = Buffer['alloc'](_0x4e576d['length']);
        for (let _0x42ff1b = 0x0; _0x42ff1b < _0x4e576d['length']; _0x42ff1b++) {
            _0x263cfc[_0x42ff1b] = _0x4e576d[_0x42ff1b] ^ _0xb6b97a[_0x42ff1b % _0xb6b97a['length']];
        }
        return _0x263cfc['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0xb11f39) {
        return _0x4ab0cd;
    }
}
function generateMasterKey(_0x65e7f2) {
    const _0x42ec87 = [
        _0x65e7f2['configAesKey'],
        _0x65e7f2['configIdentifier'],
        _0x65e7f2['configSalt'],
        _0x65e7f2['configTimestamp'] ? String(_0x65e7f2['configTimestamp']) : '',
        _0x65e7f2['configExpiryTimestamp'] ? String(_0x65e7f2['configExpiryTimestamp']) : '',
        _0x65e7f2['lockModes'],
        _0x65e7f2['lockModesHash'],
        _0x65e7f2['configHwid'],
        _0x65e7f2['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x5b3f72['createHash']('sha256')['update'](_0x42ec87, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x20ebff) {
    try {
        const _0x3e98dd = ehiParseBytes(_0x20ebff);
        if (!_0x3e98dd)
            return null;
        let _0x492dcf = null;
        let _0x277d24 = null;
        for (const _0x1f54cd of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x4c0e81 = _0x0_0x5b3f72['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x1f54cd);
                const _0x491e31 = Buffer['concat']([
                    _0x4c0e81['update'](_0x3e98dd),
                    _0x4c0e81['final']()
                ])['toString']('utf-8');
                const _0x76c8aa = _0x491e31['split'](':');
                if (_0x76c8aa['length'] >= 0x3) {
                    const _0x1abd48 = _0x0_0x5b3f72['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x76c8aa[0x1], 'base64'));
                    const _0x3577b4 = Buffer['concat']([
                        _0x1abd48['update'](Buffer['from'](_0x76c8aa[0x1], 'base64')),
                        _0x1abd48['final']()
                    ]);
                    const _0x3b656a = xxteaDecrypt(_0x3577b4, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x2cf898 = _0x3b656a['indexOf'](0x7b);
                    if (_0x2cf898 !== -0x1) {
                        _0x492dcf = JSON['parse'](_0x3b656a['slice'](_0x2cf898)['toString']('utf-8'));
                        _0x277d24 = _0x1f54cd;
                        break;
                    }
                }
            } catch (_0x369f2b) {
                continue;
            }
        }
        if (!_0x492dcf)
            return null;
        const _0x2cda50 = _0x492dcf['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x405526 => _0x405526['equals'](_0x277d24)) && _0x492dcf['configData']) {
            const _0x4491c0 = ehiDecryptXorLayer(_0x492dcf['configData'], _0x2cda50);
            if (!_0x4491c0)
                return null;
            const _0x188561 = Buffer['from'](_0x4491c0, 'base64');
            const _0x245d23 = _0x188561['slice'](0xa, 0x1a);
            const _0x1c2fd3 = _0x188561['readUInt32LE'](0x1);
            const _0x545b8b = _0x188561['readUInt32LE'](0x5);
            const _0x2b4ddc = _0x188561[0x9] || 0x1;
            const _0x3e1e6e = generateMasterKey(_0x492dcf);
            const _0x20e135 = await _0x0_0x777d75['hash'](_0x3e1e6e, {
                'salt': _0x245d23,
                'timeCost': _0x1c2fd3,
                'memoryCost': _0x545b8b,
                'parallelism': _0x2b4ddc,
                'hashLength': 0x20,
                'type': _0x0_0x777d75['argon2id'],
                'raw': !![]
            });
            const _0x201fd6 = _0x0_0x5b3f72['createDecipheriv']('chacha20-poly1305', _0x20e135, _0x188561['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x201fd6['setAAD'](_0x188561['slice'](0x0, 0x1a));
            _0x201fd6['setAuthTag'](_0x188561['slice'](-0x10));
            const _0x5273d8 = Buffer['concat']([
                _0x201fd6['update'](_0x188561['slice'](0x32, -0x10)),
                _0x201fd6['final']()
            ]);
            _0x492dcf = JSON['parse'](_0x5273d8['toString']('utf-8'));
        }
        if (_0x492dcf['configMessage']) {
            _0x492dcf['configMessage'] = decodeJavaUtf16Xor(_0x492dcf['configMessage'], _0x2cda50);
        }
        if (_0x492dcf['v2rRawJson'] && typeof _0x492dcf['v2rRawJson'] === 'string') {
            try {
                _0x492dcf['v2rRawJson'] = JSON['parse'](_0x492dcf['v2rRawJson']);
            } catch (_0xc18b0e) {
            }
        }
        if (_0x492dcf['overwriteServerData'] && typeof _0x492dcf['overwriteServerData'] === 'string') {
            try {
                _0x492dcf['overwriteServerData'] = JSON['parse'](_0x492dcf['overwriteServerData']);
            } catch (_0x41bee6) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x492dcf, null, 0x4);
    } catch (_0x48bfe2) {
        return null;
    }
}