import _0x0_0x270e55 from 'crypto';
import _0x0_0x5cb155 from 'argon2';
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
function customB64DecodeEhi(_0xf7688b) {
    const _0x42dccf = _0xf7688b['replace'](/\?/g, '');
    let _0x3c9ae7 = '';
    for (let _0x12ff66 = 0x0; _0x12ff66 < _0x42dccf['length']; _0x12ff66++) {
        _0x3c9ae7 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x42dccf[_0x12ff66]] || _0x42dccf[_0x12ff66];
    }
    while (_0x3c9ae7['length'] % 0x4 !== 0x0)
        _0x3c9ae7 += '=';
    return Buffer['from'](_0x3c9ae7, 'base64');
}
function ehiDecryptXorLayer(_0x46b86f, _0x160d8e) {
    if (!_0x46b86f || !_0x46b86f['trim']())
        return null;
    try {
        const _0x1b8895 = _0x46b86f['split']('')['reverse']()['join']('');
        const _0x3aa56c = customB64DecodeEhi(_0x1b8895);
        const _0x2117b4 = Buffer['from'](_0x3aa56c['toString']('ascii'), 'hex');
        const _0x54bd81 = Buffer['from'](_0x160d8e);
        const _0x19d2a8 = [];
        for (let _0x478394 = 0x0; _0x478394 < _0x2117b4['length']; _0x478394++) {
            const _0x4239dd = _0x2117b4[_0x478394] ^ _0x54bd81[_0x478394 % _0x54bd81['length']];
            if (_0x4239dd !== 0x0)
                _0x19d2a8['push'](_0x4239dd);
        }
        return Buffer['from'](_0x19d2a8)['toString']('utf-8');
    } catch (_0xf7900c) {
        return null;
    }
}
function xxteaDecrypt(_0x1e1995, _0x46df18) {
    if (_0x1e1995['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x289542 = Math['floor'](_0x1e1995['length'] / 0x4);
    const _0x326d74 = new Uint32Array(_0x289542);
    for (let _0x2f6909 = 0x0; _0x2f6909 < _0x289542; _0x2f6909++)
        _0x326d74[_0x2f6909] = _0x1e1995['readUInt32LE'](_0x2f6909 * 0x4);
    const _0x47384c = new Uint32Array(0x4);
    for (let _0x4543c6 = 0x0; _0x4543c6 < 0x4; _0x4543c6++)
        _0x47384c[_0x4543c6] = _0x46df18['readUInt32LE'](Math['min'](_0x4543c6 * 0x4, _0x46df18['length'] - 0x4));
    const _0x4a0338 = 0x9e3779b9;
    let _0x1a94e5 = Math['floor'](0x6 + 0x34 / _0x289542);
    let _0x509923 = _0x1a94e5 * _0x4a0338 & 0xffffffff;
    let _0x4c5aaf = _0x326d74;
    while (_0x509923 !== 0x0) {
        const _0xdd0a4f = _0x509923 >> 0x2 & 0x3;
        for (let _0x5ec189 = _0x289542 - 0x1; _0x5ec189 > 0x0; _0x5ec189--) {
            const _0x36e9c4 = _0x326d74[_0x5ec189 - 0x1];
            const _0x3a4573 = (_0x36e9c4 >> 0x5 ^ _0x4c5aaf << 0x2) + (_0x4c5aaf >> 0x3 ^ _0x36e9c4 << 0x4) ^ (_0x509923 ^ _0x4c5aaf) + (_0x47384c[_0x5ec189 & 0x3 ^ _0xdd0a4f] ^ _0x36e9c4);
            _0x4c5aaf = _0x326d74[_0x5ec189] = _0x326d74[_0x5ec189] - _0x3a4573 & 0xffffffff;
        }
        const _0xf61341 = _0x326d74[_0x289542 - 0x1];
        const _0x43c43a = (_0xf61341 >> 0x5 ^ _0x4c5aaf << 0x2) + (_0x4c5aaf >> 0x3 ^ _0xf61341 << 0x4) ^ (_0x509923 ^ _0x4c5aaf) + (_0x47384c[0x0 & 0x3 ^ _0xdd0a4f] ^ _0xf61341);
        _0x4c5aaf = _0x326d74 = _0x326d74 - _0x43c43a & 0xffffffff;
        _0x509923 = _0x509923 - _0x4a0338 & 0xffffffff;
    }
    const _0x2718b7 = Buffer['alloc'](_0x289542 * 0x4);
    for (let _0x41152f = 0x0; _0x41152f < _0x289542; _0x41152f++)
        _0x2718b7['writeUInt32LE'](_0x326d74[_0x41152f], _0x41152f * 0x4);
    const _0x328461 = _0x326d74[_0x289542 - 0x1];
    return _0x328461 > 0x0 && _0x328461 <= _0x289542 * 0x4 ? _0x2718b7['slice'](0x0, _0x328461) : _0x2718b7;
}
function ehiParseBytes(_0x23bf49) {
    try {
        let _0x58e4a8 = 0x0;
        if (_0x23bf49['readUInt16BE'](0x0) === 0xaced)
            _0x58e4a8 = 0x4;
        function _0x4f63fe() {
            if (_0x58e4a8 + 0x2 > _0x23bf49['length'])
                return '';
            const _0x4639de = _0x23bf49['readUInt16BE'](_0x58e4a8);
            _0x58e4a8 += 0x2;
            const _0x230167 = _0x23bf49['slice'](_0x58e4a8, _0x58e4a8 + _0x4639de)['toString']('utf-8');
            _0x58e4a8 += _0x4639de;
            return _0x230167;
        }
        _0x4f63fe();
        _0x58e4a8 += 0x8;
        _0x4f63fe();
        _0x58e4a8 += 0x8;
        if (_0x58e4a8 + 0x4 > _0x23bf49['length'])
            return null;
        const _0x44888a = _0x23bf49['readUInt32BE'](_0x58e4a8);
        _0x58e4a8 += 0x4;
        _0x58e4a8 += 0x8;
        return _0x23bf49['slice'](_0x58e4a8, _0x58e4a8 + _0x44888a);
    } catch (_0x30d684) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x10f11a, _0x178e82) {
    if (!_0x10f11a)
        return _0x10f11a;
    try {
        const _0x19b4ec = Buffer['from'](_0x178e82, 'utf-8');
        const _0x215a3d = Buffer['from'](_0x10f11a, 'utf-16le');
        const _0x1144a6 = Buffer['alloc'](_0x215a3d['length']);
        for (let _0x1159ea = 0x0; _0x1159ea < _0x215a3d['length']; _0x1159ea++) {
            _0x1144a6[_0x1159ea] = _0x215a3d[_0x1159ea] ^ _0x19b4ec[_0x1159ea % _0x19b4ec['length']];
        }
        return _0x1144a6['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x2a2fe7) {
        return _0x10f11a;
    }
}
function generateMasterKey(_0x504264) {
    const _0x599bfc = [
        _0x504264['configAesKey'],
        _0x504264['configIdentifier'],
        _0x504264['configSalt'],
        _0x504264['configTimestamp'] ? String(_0x504264['configTimestamp']) : '',
        _0x504264['configExpiryTimestamp'] ? String(_0x504264['configExpiryTimestamp']) : '',
        _0x504264['lockModes'],
        _0x504264['lockModesHash'],
        _0x504264['configHwid'],
        _0x504264['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x270e55['createHash']('sha256')['update'](_0x599bfc, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x3b7460) {
    try {
        const _0x3ad94a = ehiParseBytes(_0x3b7460);
        if (!_0x3ad94a)
            return null;
        let _0x352790 = null;
        let _0x2b691e = null;
        for (const _0x2cee10 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x34151d = _0x0_0x270e55['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x2cee10);
                const _0x29bbbe = Buffer['concat']([
                    _0x34151d['update'](_0x3ad94a),
                    _0x34151d['final']()
                ])['toString']('utf-8');
                const _0x1879ee = _0x29bbbe['split'](':');
                if (_0x1879ee['length'] >= 0x3) {
                    const _0x159032 = _0x0_0x270e55['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x1879ee[0x1], 'base64'));
                    const _0x54a293 = Buffer['concat']([
                        _0x159032['update'](Buffer['from'](_0x1879ee[0x1], 'base64')),
                        _0x159032['final']()
                    ]);
                    const _0x3a36c5 = xxteaDecrypt(_0x54a293, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x569885 = _0x3a36c5['indexOf'](0x7b);
                    if (_0x569885 !== -0x1) {
                        _0x352790 = JSON['parse'](_0x3a36c5['slice'](_0x569885)['toString']('utf-8'));
                        _0x2b691e = _0x2cee10;
                        break;
                    }
                }
            } catch (_0x33e366) {
                continue;
            }
        }
        if (!_0x352790)
            return null;
        const _0x4f8954 = _0x352790['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x18bc08 => _0x18bc08['equals'](_0x2b691e)) && _0x352790['configData']) {
            const _0x4144bd = ehiDecryptXorLayer(_0x352790['configData'], _0x4f8954);
            if (!_0x4144bd)
                return null;
            const _0x511794 = Buffer['from'](_0x4144bd, 'base64');
            const _0x2ebccc = _0x511794['slice'](0xa, 0x1a);
            const _0xbc198 = _0x511794['readUInt32LE'](0x1);
            const _0x25f833 = _0x511794['readUInt32LE'](0x5);
            const _0x496983 = _0x511794[0x9] || 0x1;
            const _0x1ba60a = generateMasterKey(_0x352790);
            const _0x2f5e32 = await _0x0_0x5cb155['hash'](_0x1ba60a, {
                'salt': _0x2ebccc,
                'timeCost': _0xbc198,
                'memoryCost': _0x25f833,
                'parallelism': _0x496983,
                'hashLength': 0x20,
                'type': _0x0_0x5cb155['argon2id'],
                'raw': !![]
            });
            const _0x28f01b = _0x0_0x270e55['createDecipheriv']('chacha20-poly1305', _0x2f5e32, _0x511794['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x28f01b['setAAD'](_0x511794['slice'](0x0, 0x1a));
            _0x28f01b['setAuthTag'](_0x511794['slice'](-0x10));
            const _0x4f36df = Buffer['concat']([
                _0x28f01b['update'](_0x511794['slice'](0x32, -0x10)),
                _0x28f01b['final']()
            ]);
            _0x352790 = JSON['parse'](_0x4f36df['toString']('utf-8'));
        }
        if (_0x352790['configMessage']) {
            _0x352790['configMessage'] = decodeJavaUtf16Xor(_0x352790['configMessage'], _0x4f8954);
        }
        if (_0x352790['v2rRawJson'] && typeof _0x352790['v2rRawJson'] === 'string') {
            try {
                _0x352790['v2rRawJson'] = JSON['parse'](_0x352790['v2rRawJson']);
            } catch (_0x2ddab6) {
            }
        }
        if (_0x352790['overwriteServerData'] && typeof _0x352790['overwriteServerData'] === 'string') {
            try {
                _0x352790['overwriteServerData'] = JSON['parse'](_0x352790['overwriteServerData']);
            } catch (_0x3314ef) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x352790, null, 0x4);
    } catch (_0x1384e5) {
        return null;
    }
}