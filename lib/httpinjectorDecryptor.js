import _0x0_0x36a1d8 from 'crypto';
import _0x0_0x148d3b from 'argon2';
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
function customB64DecodeEhi(_0x182d10) {
    const _0x23679f = _0x182d10['replace'](/\?/g, '');
    let _0x3da1e3 = '';
    for (let _0x4e396d = 0x0; _0x4e396d < _0x23679f['length']; _0x4e396d++) {
        _0x3da1e3 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x23679f[_0x4e396d]] || _0x23679f[_0x4e396d];
    }
    while (_0x3da1e3['length'] % 0x4 !== 0x0)
        _0x3da1e3 += '=';
    return Buffer['from'](_0x3da1e3, 'base64');
}
function ehiDecryptXorLayer(_0x5bcaeb, _0x51ecdc) {
    if (!_0x5bcaeb || !_0x5bcaeb['trim']())
        return null;
    try {
        const _0x55a7b2 = _0x5bcaeb['split']('')['reverse']()['join']('');
        const _0x3a2e55 = customB64DecodeEhi(_0x55a7b2);
        const _0x899b56 = Buffer['from'](_0x3a2e55['toString']('ascii'), 'hex');
        const _0xb2477f = Buffer['from'](_0x51ecdc);
        const _0x1e46e2 = [];
        for (let _0x1f1fd2 = 0x0; _0x1f1fd2 < _0x899b56['length']; _0x1f1fd2++) {
            const _0x441a6a = _0x899b56[_0x1f1fd2] ^ _0xb2477f[_0x1f1fd2 % _0xb2477f['length']];
            if (_0x441a6a !== 0x0)
                _0x1e46e2['push'](_0x441a6a);
        }
        return Buffer['from'](_0x1e46e2)['toString']('utf-8');
    } catch (_0x1a26b4) {
        return null;
    }
}
function xxteaDecrypt(_0x786d50, _0x3d6e49) {
    if (_0x786d50['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x56b180 = Math['floor'](_0x786d50['length'] / 0x4);
    const _0x469927 = new Uint32Array(_0x56b180);
    for (let _0x11a175 = 0x0; _0x11a175 < _0x56b180; _0x11a175++)
        _0x469927[_0x11a175] = _0x786d50['readUInt32LE'](_0x11a175 * 0x4);
    const _0x3141c4 = new Uint32Array(0x4);
    for (let _0x147781 = 0x0; _0x147781 < 0x4; _0x147781++)
        _0x3141c4[_0x147781] = _0x3d6e49['readUInt32LE'](Math['min'](_0x147781 * 0x4, _0x3d6e49['length'] - 0x4));
    const _0xa62d92 = 0x9e3779b9;
    let _0x1c12a9 = Math['floor'](0x6 + 0x34 / _0x56b180);
    let _0x53e3f3 = _0x1c12a9 * _0xa62d92 & 0xffffffff;
    let _0x1ab6f5 = _0x469927;
    while (_0x53e3f3 !== 0x0) {
        const _0xddfae8 = _0x53e3f3 >> 0x2 & 0x3;
        for (let _0x5d792c = _0x56b180 - 0x1; _0x5d792c > 0x0; _0x5d792c--) {
            const _0x427e4e = _0x469927[_0x5d792c - 0x1];
            const _0xcdcf8a = (_0x427e4e >> 0x5 ^ _0x1ab6f5 << 0x2) + (_0x1ab6f5 >> 0x3 ^ _0x427e4e << 0x4) ^ (_0x53e3f3 ^ _0x1ab6f5) + (_0x3141c4[_0x5d792c & 0x3 ^ _0xddfae8] ^ _0x427e4e);
            _0x1ab6f5 = _0x469927[_0x5d792c] = _0x469927[_0x5d792c] - _0xcdcf8a & 0xffffffff;
        }
        const _0x333461 = _0x469927[_0x56b180 - 0x1];
        const _0x1c3703 = (_0x333461 >> 0x5 ^ _0x1ab6f5 << 0x2) + (_0x1ab6f5 >> 0x3 ^ _0x333461 << 0x4) ^ (_0x53e3f3 ^ _0x1ab6f5) + (_0x3141c4[0x0 & 0x3 ^ _0xddfae8] ^ _0x333461);
        _0x1ab6f5 = _0x469927 = _0x469927 - _0x1c3703 & 0xffffffff;
        _0x53e3f3 = _0x53e3f3 - _0xa62d92 & 0xffffffff;
    }
    const _0x5689d0 = Buffer['alloc'](_0x56b180 * 0x4);
    for (let _0x2d8918 = 0x0; _0x2d8918 < _0x56b180; _0x2d8918++)
        _0x5689d0['writeUInt32LE'](_0x469927[_0x2d8918], _0x2d8918 * 0x4);
    const _0x3d6199 = _0x469927[_0x56b180 - 0x1];
    return _0x3d6199 > 0x0 && _0x3d6199 <= _0x56b180 * 0x4 ? _0x5689d0['slice'](0x0, _0x3d6199) : _0x5689d0;
}
function ehiParseBytes(_0xfe0679) {
    try {
        let _0x102486 = 0x0;
        if (_0xfe0679['readUInt16BE'](0x0) === 0xaced)
            _0x102486 = 0x4;
        function _0x40b269() {
            if (_0x102486 + 0x2 > _0xfe0679['length'])
                return '';
            const _0xda642a = _0xfe0679['readUInt16BE'](_0x102486);
            _0x102486 += 0x2;
            const _0x54089e = _0xfe0679['slice'](_0x102486, _0x102486 + _0xda642a)['toString']('utf-8');
            _0x102486 += _0xda642a;
            return _0x54089e;
        }
        _0x40b269();
        _0x102486 += 0x8;
        _0x40b269();
        _0x102486 += 0x8;
        if (_0x102486 + 0x4 > _0xfe0679['length'])
            return null;
        const _0x3338a8 = _0xfe0679['readUInt32BE'](_0x102486);
        _0x102486 += 0x4;
        _0x102486 += 0x8;
        return _0xfe0679['slice'](_0x102486, _0x102486 + _0x3338a8);
    } catch (_0x2124c7) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x3ac82b, _0x57e33f) {
    if (!_0x3ac82b)
        return _0x3ac82b;
    try {
        const _0xacc368 = Buffer['from'](_0x57e33f, 'utf-8');
        const _0x58fd8b = Buffer['from'](_0x3ac82b, 'utf-16le');
        const _0x3ec7b6 = Buffer['alloc'](_0x58fd8b['length']);
        for (let _0x4138fb = 0x0; _0x4138fb < _0x58fd8b['length']; _0x4138fb++) {
            _0x3ec7b6[_0x4138fb] = _0x58fd8b[_0x4138fb] ^ _0xacc368[_0x4138fb % _0xacc368['length']];
        }
        return _0x3ec7b6['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x536560) {
        return _0x3ac82b;
    }
}
function generateMasterKey(_0x3808dc) {
    const _0x456d01 = [
        _0x3808dc['configAesKey'],
        _0x3808dc['configIdentifier'],
        _0x3808dc['configSalt'],
        _0x3808dc['configTimestamp'] ? String(_0x3808dc['configTimestamp']) : '',
        _0x3808dc['configExpiryTimestamp'] ? String(_0x3808dc['configExpiryTimestamp']) : '',
        _0x3808dc['lockModes'],
        _0x3808dc['lockModesHash'],
        _0x3808dc['configHwid'],
        _0x3808dc['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x36a1d8['createHash']('sha256')['update'](_0x456d01, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x301325) {
    try {
        const _0x71f49d = ehiParseBytes(_0x301325);
        if (!_0x71f49d)
            return null;
        let _0x469e66 = null;
        let _0x34e3fe = null;
        for (const _0x27e25e of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x400c22 = _0x0_0x36a1d8['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x27e25e);
                const _0x5ceb14 = Buffer['concat']([
                    _0x400c22['update'](_0x71f49d),
                    _0x400c22['final']()
                ])['toString']('utf-8');
                const _0x2df1a6 = _0x5ceb14['split'](':');
                if (_0x2df1a6['length'] >= 0x3) {
                    const _0x1e5da9 = _0x0_0x36a1d8['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x2df1a6[0x1], 'base64'));
                    const _0x4b68fd = Buffer['concat']([
                        _0x1e5da9['update'](Buffer['from'](_0x2df1a6[0x1], 'base64')),
                        _0x1e5da9['final']()
                    ]);
                    const _0x25ed60 = xxteaDecrypt(_0x4b68fd, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x132034 = _0x25ed60['indexOf'](0x7b);
                    if (_0x132034 !== -0x1) {
                        _0x469e66 = JSON['parse'](_0x25ed60['slice'](_0x132034)['toString']('utf-8'));
                        _0x34e3fe = _0x27e25e;
                        break;
                    }
                }
            } catch (_0x200a1e) {
                continue;
            }
        }
        if (!_0x469e66)
            return null;
        const _0x55a34a = _0x469e66['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x4aad2c => _0x4aad2c['equals'](_0x34e3fe)) && _0x469e66['configData']) {
            const _0x50b80f = ehiDecryptXorLayer(_0x469e66['configData'], _0x55a34a);
            if (!_0x50b80f)
                return null;
            const _0x31fe8f = Buffer['from'](_0x50b80f, 'base64');
            const _0x4301f9 = _0x31fe8f['slice'](0xa, 0x1a);
            const _0x138bdf = _0x31fe8f['readUInt32LE'](0x1);
            const _0x5d70c8 = _0x31fe8f['readUInt32LE'](0x5);
            const _0x497472 = _0x31fe8f[0x9] || 0x1;
            const _0x2c1b53 = generateMasterKey(_0x469e66);
            const _0x3521bc = await _0x0_0x148d3b['hash'](_0x2c1b53, {
                'salt': _0x4301f9,
                'timeCost': _0x138bdf,
                'memoryCost': _0x5d70c8,
                'parallelism': _0x497472,
                'hashLength': 0x20,
                'type': _0x0_0x148d3b['argon2id'],
                'raw': !![]
            });
            const _0x6e648a = _0x0_0x36a1d8['createDecipheriv']('chacha20-poly1305', _0x3521bc, _0x31fe8f['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x6e648a['setAAD'](_0x31fe8f['slice'](0x0, 0x1a));
            _0x6e648a['setAuthTag'](_0x31fe8f['slice'](-0x10));
            const _0x9d3fd0 = Buffer['concat']([
                _0x6e648a['update'](_0x31fe8f['slice'](0x32, -0x10)),
                _0x6e648a['final']()
            ]);
            _0x469e66 = JSON['parse'](_0x9d3fd0['toString']('utf-8'));
        }
        if (_0x469e66['configMessage']) {
            _0x469e66['configMessage'] = decodeJavaUtf16Xor(_0x469e66['configMessage'], _0x55a34a);
        }
        if (_0x469e66['v2rRawJson'] && typeof _0x469e66['v2rRawJson'] === 'string') {
            try {
                _0x469e66['v2rRawJson'] = JSON['parse'](_0x469e66['v2rRawJson']);
            } catch (_0x4a5066) {
            }
        }
        if (_0x469e66['overwriteServerData'] && typeof _0x469e66['overwriteServerData'] === 'string') {
            try {
                _0x469e66['overwriteServerData'] = JSON['parse'](_0x469e66['overwriteServerData']);
            } catch (_0xa25e2f) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x469e66, null, 0x4);
    } catch (_0x2817c3) {
        return null;
    }
}