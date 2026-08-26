import _0x0_0x39122e from 'crypto';
import _0x0_0x18089a from 'argon2';
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
function customB64DecodeEhi(_0x1dafc8) {
    const _0xd41f91 = _0x1dafc8['replace'](/\?/g, '');
    let _0x24bf5b = '';
    for (let _0x361a5d = 0x0; _0x361a5d < _0xd41f91['length']; _0x361a5d++) {
        _0x24bf5b += EHI_CONSTANTS['TRANSLATION_MAP'][_0xd41f91[_0x361a5d]] || _0xd41f91[_0x361a5d];
    }
    while (_0x24bf5b['length'] % 0x4 !== 0x0)
        _0x24bf5b += '=';
    return Buffer['from'](_0x24bf5b, 'base64');
}
function ehiDecryptXorLayer(_0x44fb43, _0x5d826e) {
    if (!_0x44fb43 || !_0x44fb43['trim']())
        return null;
    try {
        const _0x2425a8 = _0x44fb43['split']('')['reverse']()['join']('');
        const _0x3bd688 = customB64DecodeEhi(_0x2425a8);
        const _0x1eb7e0 = Buffer['from'](_0x3bd688['toString']('ascii'), 'hex');
        const _0x32767f = Buffer['from'](_0x5d826e);
        const _0xd1877 = [];
        for (let _0x3bc7ca = 0x0; _0x3bc7ca < _0x1eb7e0['length']; _0x3bc7ca++) {
            const _0x3339de = _0x1eb7e0[_0x3bc7ca] ^ _0x32767f[_0x3bc7ca % _0x32767f['length']];
            if (_0x3339de !== 0x0)
                _0xd1877['push'](_0x3339de);
        }
        return Buffer['from'](_0xd1877)['toString']('utf-8');
    } catch (_0xb25c82) {
        return null;
    }
}
function xxteaDecrypt(_0x177910, _0x4e66c7) {
    if (_0x177910['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x365b64 = Math['floor'](_0x177910['length'] / 0x4);
    const _0x5c96e4 = new Uint32Array(_0x365b64);
    for (let _0x273159 = 0x0; _0x273159 < _0x365b64; _0x273159++)
        _0x5c96e4[_0x273159] = _0x177910['readUInt32LE'](_0x273159 * 0x4);
    const _0x37a81e = new Uint32Array(0x4);
    for (let _0x27b619 = 0x0; _0x27b619 < 0x4; _0x27b619++)
        _0x37a81e[_0x27b619] = _0x4e66c7['readUInt32LE'](Math['min'](_0x27b619 * 0x4, _0x4e66c7['length'] - 0x4));
    const _0x58805a = 0x9e3779b9;
    let _0x295e60 = Math['floor'](0x6 + 0x34 / _0x365b64);
    let _0x551ae2 = _0x295e60 * _0x58805a & 0xffffffff;
    let _0x3cb9e5 = _0x5c96e4;
    while (_0x551ae2 !== 0x0) {
        const _0x2584a3 = _0x551ae2 >> 0x2 & 0x3;
        for (let _0x2b69fe = _0x365b64 - 0x1; _0x2b69fe > 0x0; _0x2b69fe--) {
            const _0x60e21d = _0x5c96e4[_0x2b69fe - 0x1];
            const _0x3df201 = (_0x60e21d >> 0x5 ^ _0x3cb9e5 << 0x2) + (_0x3cb9e5 >> 0x3 ^ _0x60e21d << 0x4) ^ (_0x551ae2 ^ _0x3cb9e5) + (_0x37a81e[_0x2b69fe & 0x3 ^ _0x2584a3] ^ _0x60e21d);
            _0x3cb9e5 = _0x5c96e4[_0x2b69fe] = _0x5c96e4[_0x2b69fe] - _0x3df201 & 0xffffffff;
        }
        const _0x2b3405 = _0x5c96e4[_0x365b64 - 0x1];
        const _0x40dd18 = (_0x2b3405 >> 0x5 ^ _0x3cb9e5 << 0x2) + (_0x3cb9e5 >> 0x3 ^ _0x2b3405 << 0x4) ^ (_0x551ae2 ^ _0x3cb9e5) + (_0x37a81e[0x0 & 0x3 ^ _0x2584a3] ^ _0x2b3405);
        _0x3cb9e5 = _0x5c96e4 = _0x5c96e4 - _0x40dd18 & 0xffffffff;
        _0x551ae2 = _0x551ae2 - _0x58805a & 0xffffffff;
    }
    const _0x5928f3 = Buffer['alloc'](_0x365b64 * 0x4);
    for (let _0x331137 = 0x0; _0x331137 < _0x365b64; _0x331137++)
        _0x5928f3['writeUInt32LE'](_0x5c96e4[_0x331137], _0x331137 * 0x4);
    const _0x4c2a25 = _0x5c96e4[_0x365b64 - 0x1];
    return _0x4c2a25 > 0x0 && _0x4c2a25 <= _0x365b64 * 0x4 ? _0x5928f3['slice'](0x0, _0x4c2a25) : _0x5928f3;
}
function ehiParseBytes(_0x9dada5) {
    try {
        let _0x4267d7 = 0x0;
        if (_0x9dada5['readUInt16BE'](0x0) === 0xaced)
            _0x4267d7 = 0x4;
        function _0x54b8df() {
            if (_0x4267d7 + 0x2 > _0x9dada5['length'])
                return '';
            const _0x207e64 = _0x9dada5['readUInt16BE'](_0x4267d7);
            _0x4267d7 += 0x2;
            const _0x15e3ea = _0x9dada5['slice'](_0x4267d7, _0x4267d7 + _0x207e64)['toString']('utf-8');
            _0x4267d7 += _0x207e64;
            return _0x15e3ea;
        }
        _0x54b8df();
        _0x4267d7 += 0x8;
        _0x54b8df();
        _0x4267d7 += 0x8;
        if (_0x4267d7 + 0x4 > _0x9dada5['length'])
            return null;
        const _0x440b93 = _0x9dada5['readUInt32BE'](_0x4267d7);
        _0x4267d7 += 0x4;
        _0x4267d7 += 0x8;
        return _0x9dada5['slice'](_0x4267d7, _0x4267d7 + _0x440b93);
    } catch (_0xaa8842) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x33d221, _0x53626c) {
    if (!_0x33d221)
        return _0x33d221;
    try {
        const _0x545603 = Buffer['from'](_0x53626c, 'utf-8');
        const _0x3f5e2c = Buffer['from'](_0x33d221, 'utf-16le');
        const _0x1d1ad0 = Buffer['alloc'](_0x3f5e2c['length']);
        for (let _0xd4bdaa = 0x0; _0xd4bdaa < _0x3f5e2c['length']; _0xd4bdaa++) {
            _0x1d1ad0[_0xd4bdaa] = _0x3f5e2c[_0xd4bdaa] ^ _0x545603[_0xd4bdaa % _0x545603['length']];
        }
        return _0x1d1ad0['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x558bf4) {
        return _0x33d221;
    }
}
function generateMasterKey(_0x1cae59) {
    const _0x59bf75 = [
        _0x1cae59['configAesKey'],
        _0x1cae59['configIdentifier'],
        _0x1cae59['configSalt'],
        _0x1cae59['configTimestamp'] ? String(_0x1cae59['configTimestamp']) : '',
        _0x1cae59['configExpiryTimestamp'] ? String(_0x1cae59['configExpiryTimestamp']) : '',
        _0x1cae59['lockModes'],
        _0x1cae59['lockModesHash'],
        _0x1cae59['configHwid'],
        _0x1cae59['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x39122e['createHash']('sha256')['update'](_0x59bf75, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x3d2e30) {
    try {
        const _0x30d4af = ehiParseBytes(_0x3d2e30);
        if (!_0x30d4af)
            return null;
        let _0x3b9e60 = null;
        let _0x3acace = null;
        for (const _0xcf9cbd of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x5e3c74 = _0x0_0x39122e['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0xcf9cbd);
                const _0x135968 = Buffer['concat']([
                    _0x5e3c74['update'](_0x30d4af),
                    _0x5e3c74['final']()
                ])['toString']('utf-8');
                const _0x9d566c = _0x135968['split'](':');
                if (_0x9d566c['length'] >= 0x3) {
                    const _0x5e7aab = _0x0_0x39122e['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x9d566c[0x1], 'base64'));
                    const _0x3cb317 = Buffer['concat']([
                        _0x5e7aab['update'](Buffer['from'](_0x9d566c[0x1], 'base64')),
                        _0x5e7aab['final']()
                    ]);
                    const _0x5a4e28 = xxteaDecrypt(_0x3cb317, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x2a7340 = _0x5a4e28['indexOf'](0x7b);
                    if (_0x2a7340 !== -0x1) {
                        _0x3b9e60 = JSON['parse'](_0x5a4e28['slice'](_0x2a7340)['toString']('utf-8'));
                        _0x3acace = _0xcf9cbd;
                        break;
                    }
                }
            } catch (_0x23aa2f) {
                continue;
            }
        }
        if (!_0x3b9e60)
            return null;
        const _0x32be96 = _0x3b9e60['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x19a87e => _0x19a87e['equals'](_0x3acace)) && _0x3b9e60['configData']) {
            const _0x311824 = ehiDecryptXorLayer(_0x3b9e60['configData'], _0x32be96);
            if (!_0x311824)
                return null;
            const _0x35ab44 = Buffer['from'](_0x311824, 'base64');
            const _0x309923 = _0x35ab44['slice'](0xa, 0x1a);
            const _0x1a6600 = _0x35ab44['readUInt32LE'](0x1);
            const _0x41d023 = _0x35ab44['readUInt32LE'](0x5);
            const _0x29e1ea = _0x35ab44[0x9] || 0x1;
            const _0x2b6766 = generateMasterKey(_0x3b9e60);
            const _0x398d65 = await _0x0_0x18089a['hash'](_0x2b6766, {
                'salt': _0x309923,
                'timeCost': _0x1a6600,
                'memoryCost': _0x41d023,
                'parallelism': _0x29e1ea,
                'hashLength': 0x20,
                'type': _0x0_0x18089a['argon2id'],
                'raw': !![]
            });
            const _0x52e6b3 = _0x0_0x39122e['createDecipheriv']('chacha20-poly1305', _0x398d65, _0x35ab44['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x52e6b3['setAAD'](_0x35ab44['slice'](0x0, 0x1a));
            _0x52e6b3['setAuthTag'](_0x35ab44['slice'](-0x10));
            const _0x269f23 = Buffer['concat']([
                _0x52e6b3['update'](_0x35ab44['slice'](0x32, -0x10)),
                _0x52e6b3['final']()
            ]);
            _0x3b9e60 = JSON['parse'](_0x269f23['toString']('utf-8'));
        }
        if (_0x3b9e60['configMessage']) {
            _0x3b9e60['configMessage'] = decodeJavaUtf16Xor(_0x3b9e60['configMessage'], _0x32be96);
        }
        if (_0x3b9e60['v2rRawJson'] && typeof _0x3b9e60['v2rRawJson'] === 'string') {
            try {
                _0x3b9e60['v2rRawJson'] = JSON['parse'](_0x3b9e60['v2rRawJson']);
            } catch (_0x5bdf35) {
            }
        }
        if (_0x3b9e60['overwriteServerData'] && typeof _0x3b9e60['overwriteServerData'] === 'string') {
            try {
                _0x3b9e60['overwriteServerData'] = JSON['parse'](_0x3b9e60['overwriteServerData']);
            } catch (_0x5f5a02) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x3b9e60, null, 0x4);
    } catch (_0x35e9a5) {
        return null;
    }
}