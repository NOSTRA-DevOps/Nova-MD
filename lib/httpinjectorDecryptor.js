import _0x0_0x29ef4c from 'crypto';
import _0x0_0x12ae19 from 'argon2';
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
function customB64DecodeEhi(_0x42ade8) {
    const _0x2b823c = _0x42ade8['replace'](/\?/g, '');
    let _0x240a7c = '';
    for (let _0x20beb9 = 0x0; _0x20beb9 < _0x2b823c['length']; _0x20beb9++) {
        _0x240a7c += EHI_CONSTANTS['TRANSLATION_MAP'][_0x2b823c[_0x20beb9]] || _0x2b823c[_0x20beb9];
    }
    while (_0x240a7c['length'] % 0x4 !== 0x0)
        _0x240a7c += '=';
    return Buffer['from'](_0x240a7c, 'base64');
}
function ehiDecryptXorLayer(_0x606dfc, _0xc5ea77) {
    if (!_0x606dfc || !_0x606dfc['trim']())
        return null;
    try {
        const _0x456e6e = _0x606dfc['split']('')['reverse']()['join']('');
        const _0x577647 = customB64DecodeEhi(_0x456e6e);
        const _0x33e70b = Buffer['from'](_0x577647['toString']('ascii'), 'hex');
        const _0x16741b = Buffer['from'](_0xc5ea77);
        const _0x38566c = [];
        for (let _0x58ae37 = 0x0; _0x58ae37 < _0x33e70b['length']; _0x58ae37++) {
            const _0x3a602b = _0x33e70b[_0x58ae37] ^ _0x16741b[_0x58ae37 % _0x16741b['length']];
            if (_0x3a602b !== 0x0)
                _0x38566c['push'](_0x3a602b);
        }
        return Buffer['from'](_0x38566c)['toString']('utf-8');
    } catch (_0x3e9e1e) {
        return null;
    }
}
function xxteaDecrypt(_0x442c5f, _0x344261) {
    if (_0x442c5f['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x2308b4 = Math['floor'](_0x442c5f['length'] / 0x4);
    const _0x459ddd = new Uint32Array(_0x2308b4);
    for (let _0x4b6daa = 0x0; _0x4b6daa < _0x2308b4; _0x4b6daa++)
        _0x459ddd[_0x4b6daa] = _0x442c5f['readUInt32LE'](_0x4b6daa * 0x4);
    const _0x5315a7 = new Uint32Array(0x4);
    for (let _0x37e5fc = 0x0; _0x37e5fc < 0x4; _0x37e5fc++)
        _0x5315a7[_0x37e5fc] = _0x344261['readUInt32LE'](Math['min'](_0x37e5fc * 0x4, _0x344261['length'] - 0x4));
    const _0x30a892 = 0x9e3779b9;
    let _0x24e51d = Math['floor'](0x6 + 0x34 / _0x2308b4);
    let _0x3fd079 = _0x24e51d * _0x30a892 & 0xffffffff;
    let _0x523174 = _0x459ddd;
    while (_0x3fd079 !== 0x0) {
        const _0x5d3362 = _0x3fd079 >> 0x2 & 0x3;
        for (let _0x1caa9c = _0x2308b4 - 0x1; _0x1caa9c > 0x0; _0x1caa9c--) {
            const _0x37ce5b = _0x459ddd[_0x1caa9c - 0x1];
            const _0x5e8de4 = (_0x37ce5b >> 0x5 ^ _0x523174 << 0x2) + (_0x523174 >> 0x3 ^ _0x37ce5b << 0x4) ^ (_0x3fd079 ^ _0x523174) + (_0x5315a7[_0x1caa9c & 0x3 ^ _0x5d3362] ^ _0x37ce5b);
            _0x523174 = _0x459ddd[_0x1caa9c] = _0x459ddd[_0x1caa9c] - _0x5e8de4 & 0xffffffff;
        }
        const _0x10e12f = _0x459ddd[_0x2308b4 - 0x1];
        const _0x55b2ca = (_0x10e12f >> 0x5 ^ _0x523174 << 0x2) + (_0x523174 >> 0x3 ^ _0x10e12f << 0x4) ^ (_0x3fd079 ^ _0x523174) + (_0x5315a7[0x0 & 0x3 ^ _0x5d3362] ^ _0x10e12f);
        _0x523174 = _0x459ddd = _0x459ddd - _0x55b2ca & 0xffffffff;
        _0x3fd079 = _0x3fd079 - _0x30a892 & 0xffffffff;
    }
    const _0x246b3b = Buffer['alloc'](_0x2308b4 * 0x4);
    for (let _0x38cc6f = 0x0; _0x38cc6f < _0x2308b4; _0x38cc6f++)
        _0x246b3b['writeUInt32LE'](_0x459ddd[_0x38cc6f], _0x38cc6f * 0x4);
    const _0x1aed34 = _0x459ddd[_0x2308b4 - 0x1];
    return _0x1aed34 > 0x0 && _0x1aed34 <= _0x2308b4 * 0x4 ? _0x246b3b['slice'](0x0, _0x1aed34) : _0x246b3b;
}
function ehiParseBytes(_0x9b9e11) {
    try {
        let _0x4a2c06 = 0x0;
        if (_0x9b9e11['readUInt16BE'](0x0) === 0xaced)
            _0x4a2c06 = 0x4;
        function _0x3e84ff() {
            if (_0x4a2c06 + 0x2 > _0x9b9e11['length'])
                return '';
            const _0x104fb6 = _0x9b9e11['readUInt16BE'](_0x4a2c06);
            _0x4a2c06 += 0x2;
            const _0x53151f = _0x9b9e11['slice'](_0x4a2c06, _0x4a2c06 + _0x104fb6)['toString']('utf-8');
            _0x4a2c06 += _0x104fb6;
            return _0x53151f;
        }
        _0x3e84ff();
        _0x4a2c06 += 0x8;
        _0x3e84ff();
        _0x4a2c06 += 0x8;
        if (_0x4a2c06 + 0x4 > _0x9b9e11['length'])
            return null;
        const _0x1af262 = _0x9b9e11['readUInt32BE'](_0x4a2c06);
        _0x4a2c06 += 0x4;
        _0x4a2c06 += 0x8;
        return _0x9b9e11['slice'](_0x4a2c06, _0x4a2c06 + _0x1af262);
    } catch (_0x58ab8e) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x545988, _0x4f7382) {
    if (!_0x545988)
        return _0x545988;
    try {
        const _0x458d1b = Buffer['from'](_0x4f7382, 'utf-8');
        const _0x5e99d7 = Buffer['from'](_0x545988, 'utf-16le');
        const _0x1ca608 = Buffer['alloc'](_0x5e99d7['length']);
        for (let _0x2e13ff = 0x0; _0x2e13ff < _0x5e99d7['length']; _0x2e13ff++) {
            _0x1ca608[_0x2e13ff] = _0x5e99d7[_0x2e13ff] ^ _0x458d1b[_0x2e13ff % _0x458d1b['length']];
        }
        return _0x1ca608['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x3f21bd) {
        return _0x545988;
    }
}
function generateMasterKey(_0x1e5f93) {
    const _0x54db94 = [
        _0x1e5f93['configAesKey'],
        _0x1e5f93['configIdentifier'],
        _0x1e5f93['configSalt'],
        _0x1e5f93['configTimestamp'] ? String(_0x1e5f93['configTimestamp']) : '',
        _0x1e5f93['configExpiryTimestamp'] ? String(_0x1e5f93['configExpiryTimestamp']) : '',
        _0x1e5f93['lockModes'],
        _0x1e5f93['lockModesHash'],
        _0x1e5f93['configHwid'],
        _0x1e5f93['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x29ef4c['createHash']('sha256')['update'](_0x54db94, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x4ec91c) {
    try {
        const _0x3a4004 = ehiParseBytes(_0x4ec91c);
        if (!_0x3a4004)
            return null;
        let _0xa41774 = null;
        let _0x42d7b7 = null;
        for (const _0x5f3fa7 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x1546b8 = _0x0_0x29ef4c['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x5f3fa7);
                const _0x5568c8 = Buffer['concat']([
                    _0x1546b8['update'](_0x3a4004),
                    _0x1546b8['final']()
                ])['toString']('utf-8');
                const _0x557f2e = _0x5568c8['split'](':');
                if (_0x557f2e['length'] >= 0x3) {
                    const _0x4785ff = _0x0_0x29ef4c['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x557f2e[0x1], 'base64'));
                    const _0x21d484 = Buffer['concat']([
                        _0x4785ff['update'](Buffer['from'](_0x557f2e[0x1], 'base64')),
                        _0x4785ff['final']()
                    ]);
                    const _0x5ad0a0 = xxteaDecrypt(_0x21d484, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x361d08 = _0x5ad0a0['indexOf'](0x7b);
                    if (_0x361d08 !== -0x1) {
                        _0xa41774 = JSON['parse'](_0x5ad0a0['slice'](_0x361d08)['toString']('utf-8'));
                        _0x42d7b7 = _0x5f3fa7;
                        break;
                    }
                }
            } catch (_0x5d127c) {
                continue;
            }
        }
        if (!_0xa41774)
            return null;
        const _0x3cf3d8 = _0xa41774['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0xe4fe24 => _0xe4fe24['equals'](_0x42d7b7)) && _0xa41774['configData']) {
            const _0x3bb655 = ehiDecryptXorLayer(_0xa41774['configData'], _0x3cf3d8);
            if (!_0x3bb655)
                return null;
            const _0x32843d = Buffer['from'](_0x3bb655, 'base64');
            const _0x3bbdec = _0x32843d['slice'](0xa, 0x1a);
            const _0x33ad5d = _0x32843d['readUInt32LE'](0x1);
            const _0x2f2501 = _0x32843d['readUInt32LE'](0x5);
            const _0x108674 = _0x32843d[0x9] || 0x1;
            const _0x36653f = generateMasterKey(_0xa41774);
            const _0x1092d1 = await _0x0_0x12ae19['hash'](_0x36653f, {
                'salt': _0x3bbdec,
                'timeCost': _0x33ad5d,
                'memoryCost': _0x2f2501,
                'parallelism': _0x108674,
                'hashLength': 0x20,
                'type': _0x0_0x12ae19['argon2id'],
                'raw': !![]
            });
            const _0x2b2ea9 = _0x0_0x29ef4c['createDecipheriv']('chacha20-poly1305', _0x1092d1, _0x32843d['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x2b2ea9['setAAD'](_0x32843d['slice'](0x0, 0x1a));
            _0x2b2ea9['setAuthTag'](_0x32843d['slice'](-0x10));
            const _0x350d13 = Buffer['concat']([
                _0x2b2ea9['update'](_0x32843d['slice'](0x32, -0x10)),
                _0x2b2ea9['final']()
            ]);
            _0xa41774 = JSON['parse'](_0x350d13['toString']('utf-8'));
        }
        if (_0xa41774['configMessage']) {
            _0xa41774['configMessage'] = decodeJavaUtf16Xor(_0xa41774['configMessage'], _0x3cf3d8);
        }
        if (_0xa41774['v2rRawJson'] && typeof _0xa41774['v2rRawJson'] === 'string') {
            try {
                _0xa41774['v2rRawJson'] = JSON['parse'](_0xa41774['v2rRawJson']);
            } catch (_0x639af9) {
            }
        }
        if (_0xa41774['overwriteServerData'] && typeof _0xa41774['overwriteServerData'] === 'string') {
            try {
                _0xa41774['overwriteServerData'] = JSON['parse'](_0xa41774['overwriteServerData']);
            } catch (_0x226787) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0xa41774, null, 0x4);
    } catch (_0x1d60d9) {
        return null;
    }
}