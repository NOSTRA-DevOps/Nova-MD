import _0x0_0x5eeb75 from 'crypto';
import _0x0_0x220825 from 'argon2';
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
function customB64DecodeEhi(_0x1c7f4f) {
    const _0x520896 = _0x1c7f4f['replace'](/\?/g, '');
    let _0x214ca1 = '';
    for (let _0xdd162b = 0x0; _0xdd162b < _0x520896['length']; _0xdd162b++) {
        _0x214ca1 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x520896[_0xdd162b]] || _0x520896[_0xdd162b];
    }
    while (_0x214ca1['length'] % 0x4 !== 0x0)
        _0x214ca1 += '=';
    return Buffer['from'](_0x214ca1, 'base64');
}
function ehiDecryptXorLayer(_0x37dd5d, _0x27c0ea) {
    if (!_0x37dd5d || !_0x37dd5d['trim']())
        return null;
    try {
        const _0x40e8fe = _0x37dd5d['split']('')['reverse']()['join']('');
        const _0x5826ee = customB64DecodeEhi(_0x40e8fe);
        const _0x28c939 = Buffer['from'](_0x5826ee['toString']('ascii'), 'hex');
        const _0x439484 = Buffer['from'](_0x27c0ea);
        const _0x58ad49 = [];
        for (let _0x468453 = 0x0; _0x468453 < _0x28c939['length']; _0x468453++) {
            const _0x9a46be = _0x28c939[_0x468453] ^ _0x439484[_0x468453 % _0x439484['length']];
            if (_0x9a46be !== 0x0)
                _0x58ad49['push'](_0x9a46be);
        }
        return Buffer['from'](_0x58ad49)['toString']('utf-8');
    } catch (_0x1fe461) {
        return null;
    }
}
function xxteaDecrypt(_0xdaef74, _0x3b52d3) {
    if (_0xdaef74['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x3717d0 = Math['floor'](_0xdaef74['length'] / 0x4);
    const _0x2437de = new Uint32Array(_0x3717d0);
    for (let _0x13d045 = 0x0; _0x13d045 < _0x3717d0; _0x13d045++)
        _0x2437de[_0x13d045] = _0xdaef74['readUInt32LE'](_0x13d045 * 0x4);
    const _0x5ec0a0 = new Uint32Array(0x4);
    for (let _0x188f1a = 0x0; _0x188f1a < 0x4; _0x188f1a++)
        _0x5ec0a0[_0x188f1a] = _0x3b52d3['readUInt32LE'](Math['min'](_0x188f1a * 0x4, _0x3b52d3['length'] - 0x4));
    const _0xfbaf07 = 0x9e3779b9;
    let _0x1b5041 = Math['floor'](0x6 + 0x34 / _0x3717d0);
    let _0x2578ff = _0x1b5041 * _0xfbaf07 & 0xffffffff;
    let _0x294f37 = _0x2437de;
    while (_0x2578ff !== 0x0) {
        const _0xd2528c = _0x2578ff >> 0x2 & 0x3;
        for (let _0x5230df = _0x3717d0 - 0x1; _0x5230df > 0x0; _0x5230df--) {
            const _0x4e8c20 = _0x2437de[_0x5230df - 0x1];
            const _0x2d1ce7 = (_0x4e8c20 >> 0x5 ^ _0x294f37 << 0x2) + (_0x294f37 >> 0x3 ^ _0x4e8c20 << 0x4) ^ (_0x2578ff ^ _0x294f37) + (_0x5ec0a0[_0x5230df & 0x3 ^ _0xd2528c] ^ _0x4e8c20);
            _0x294f37 = _0x2437de[_0x5230df] = _0x2437de[_0x5230df] - _0x2d1ce7 & 0xffffffff;
        }
        const _0x362701 = _0x2437de[_0x3717d0 - 0x1];
        const _0x5112e0 = (_0x362701 >> 0x5 ^ _0x294f37 << 0x2) + (_0x294f37 >> 0x3 ^ _0x362701 << 0x4) ^ (_0x2578ff ^ _0x294f37) + (_0x5ec0a0[0x0 & 0x3 ^ _0xd2528c] ^ _0x362701);
        _0x294f37 = _0x2437de = _0x2437de - _0x5112e0 & 0xffffffff;
        _0x2578ff = _0x2578ff - _0xfbaf07 & 0xffffffff;
    }
    const _0xa84c3f = Buffer['alloc'](_0x3717d0 * 0x4);
    for (let _0x3d7980 = 0x0; _0x3d7980 < _0x3717d0; _0x3d7980++)
        _0xa84c3f['writeUInt32LE'](_0x2437de[_0x3d7980], _0x3d7980 * 0x4);
    const _0x37ddf6 = _0x2437de[_0x3717d0 - 0x1];
    return _0x37ddf6 > 0x0 && _0x37ddf6 <= _0x3717d0 * 0x4 ? _0xa84c3f['slice'](0x0, _0x37ddf6) : _0xa84c3f;
}
function ehiParseBytes(_0xf6d0a5) {
    try {
        let _0x1104f7 = 0x0;
        if (_0xf6d0a5['readUInt16BE'](0x0) === 0xaced)
            _0x1104f7 = 0x4;
        function _0x2ec1d2() {
            if (_0x1104f7 + 0x2 > _0xf6d0a5['length'])
                return '';
            const _0x2020be = _0xf6d0a5['readUInt16BE'](_0x1104f7);
            _0x1104f7 += 0x2;
            const _0x2bb57f = _0xf6d0a5['slice'](_0x1104f7, _0x1104f7 + _0x2020be)['toString']('utf-8');
            _0x1104f7 += _0x2020be;
            return _0x2bb57f;
        }
        _0x2ec1d2();
        _0x1104f7 += 0x8;
        _0x2ec1d2();
        _0x1104f7 += 0x8;
        if (_0x1104f7 + 0x4 > _0xf6d0a5['length'])
            return null;
        const _0x173ad4 = _0xf6d0a5['readUInt32BE'](_0x1104f7);
        _0x1104f7 += 0x4;
        _0x1104f7 += 0x8;
        return _0xf6d0a5['slice'](_0x1104f7, _0x1104f7 + _0x173ad4);
    } catch (_0x569e02) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x4b8757, _0x11c176) {
    if (!_0x4b8757)
        return _0x4b8757;
    try {
        const _0x5af76a = Buffer['from'](_0x11c176, 'utf-8');
        const _0xcc1f2a = Buffer['from'](_0x4b8757, 'utf-16le');
        const _0x27afaf = Buffer['alloc'](_0xcc1f2a['length']);
        for (let _0x5c26c8 = 0x0; _0x5c26c8 < _0xcc1f2a['length']; _0x5c26c8++) {
            _0x27afaf[_0x5c26c8] = _0xcc1f2a[_0x5c26c8] ^ _0x5af76a[_0x5c26c8 % _0x5af76a['length']];
        }
        return _0x27afaf['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x229da0) {
        return _0x4b8757;
    }
}
function generateMasterKey(_0x14453f) {
    const _0x271fff = [
        _0x14453f['configAesKey'],
        _0x14453f['configIdentifier'],
        _0x14453f['configSalt'],
        _0x14453f['configTimestamp'] ? String(_0x14453f['configTimestamp']) : '',
        _0x14453f['configExpiryTimestamp'] ? String(_0x14453f['configExpiryTimestamp']) : '',
        _0x14453f['lockModes'],
        _0x14453f['lockModesHash'],
        _0x14453f['configHwid'],
        _0x14453f['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x5eeb75['createHash']('sha256')['update'](_0x271fff, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x146d4c) {
    try {
        const _0x2c0fd2 = ehiParseBytes(_0x146d4c);
        if (!_0x2c0fd2)
            return null;
        let _0x151faa = null;
        let _0x44c86e = null;
        for (const _0x4aa25f of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x518160 = _0x0_0x5eeb75['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x4aa25f);
                const _0x14958d = Buffer['concat']([
                    _0x518160['update'](_0x2c0fd2),
                    _0x518160['final']()
                ])['toString']('utf-8');
                const _0x3ef457 = _0x14958d['split'](':');
                if (_0x3ef457['length'] >= 0x3) {
                    const _0x198368 = _0x0_0x5eeb75['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x3ef457[0x1], 'base64'));
                    const _0x1a3835 = Buffer['concat']([
                        _0x198368['update'](Buffer['from'](_0x3ef457[0x1], 'base64')),
                        _0x198368['final']()
                    ]);
                    const _0x29ed48 = xxteaDecrypt(_0x1a3835, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x29ea6e = _0x29ed48['indexOf'](0x7b);
                    if (_0x29ea6e !== -0x1) {
                        _0x151faa = JSON['parse'](_0x29ed48['slice'](_0x29ea6e)['toString']('utf-8'));
                        _0x44c86e = _0x4aa25f;
                        break;
                    }
                }
            } catch (_0x1b8ff4) {
                continue;
            }
        }
        if (!_0x151faa)
            return null;
        const _0x49c08b = _0x151faa['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x557a3c => _0x557a3c['equals'](_0x44c86e)) && _0x151faa['configData']) {
            const _0x12b6eb = ehiDecryptXorLayer(_0x151faa['configData'], _0x49c08b);
            if (!_0x12b6eb)
                return null;
            const _0x4e971c = Buffer['from'](_0x12b6eb, 'base64');
            const _0x47288d = _0x4e971c['slice'](0xa, 0x1a);
            const _0x2869c2 = _0x4e971c['readUInt32LE'](0x1);
            const _0x59dd28 = _0x4e971c['readUInt32LE'](0x5);
            const _0x5769a7 = _0x4e971c[0x9] || 0x1;
            const _0x5dff09 = generateMasterKey(_0x151faa);
            const _0x920688 = await _0x0_0x220825['hash'](_0x5dff09, {
                'salt': _0x47288d,
                'timeCost': _0x2869c2,
                'memoryCost': _0x59dd28,
                'parallelism': _0x5769a7,
                'hashLength': 0x20,
                'type': _0x0_0x220825['argon2id'],
                'raw': !![]
            });
            const _0x50b016 = _0x0_0x5eeb75['createDecipheriv']('chacha20-poly1305', _0x920688, _0x4e971c['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x50b016['setAAD'](_0x4e971c['slice'](0x0, 0x1a));
            _0x50b016['setAuthTag'](_0x4e971c['slice'](-0x10));
            const _0x2f7d5f = Buffer['concat']([
                _0x50b016['update'](_0x4e971c['slice'](0x32, -0x10)),
                _0x50b016['final']()
            ]);
            _0x151faa = JSON['parse'](_0x2f7d5f['toString']('utf-8'));
        }
        if (_0x151faa['configMessage']) {
            _0x151faa['configMessage'] = decodeJavaUtf16Xor(_0x151faa['configMessage'], _0x49c08b);
        }
        if (_0x151faa['v2rRawJson'] && typeof _0x151faa['v2rRawJson'] === 'string') {
            try {
                _0x151faa['v2rRawJson'] = JSON['parse'](_0x151faa['v2rRawJson']);
            } catch (_0x833e2c) {
            }
        }
        if (_0x151faa['overwriteServerData'] && typeof _0x151faa['overwriteServerData'] === 'string') {
            try {
                _0x151faa['overwriteServerData'] = JSON['parse'](_0x151faa['overwriteServerData']);
            } catch (_0x1749a9) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x151faa, null, 0x4);
    } catch (_0x1e7b28) {
        return null;
    }
}