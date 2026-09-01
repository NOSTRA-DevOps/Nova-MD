import _0x0_0x2a8179 from 'crypto';
import _0x0_0x354ce3 from 'argon2';
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
function customB64DecodeEhi(_0x1e9060) {
    const _0x36e47e = _0x1e9060['replace'](/\?/g, '');
    let _0x3bcbcf = '';
    for (let _0x121ab3 = 0x0; _0x121ab3 < _0x36e47e['length']; _0x121ab3++) {
        _0x3bcbcf += EHI_CONSTANTS['TRANSLATION_MAP'][_0x36e47e[_0x121ab3]] || _0x36e47e[_0x121ab3];
    }
    while (_0x3bcbcf['length'] % 0x4 !== 0x0)
        _0x3bcbcf += '=';
    return Buffer['from'](_0x3bcbcf, 'base64');
}
function ehiDecryptXorLayer(_0x503fbd, _0x5af6f5) {
    if (!_0x503fbd || !_0x503fbd['trim']())
        return null;
    try {
        const _0x254c22 = _0x503fbd['split']('')['reverse']()['join']('');
        const _0x520afb = customB64DecodeEhi(_0x254c22);
        const _0x43ab8d = Buffer['from'](_0x520afb['toString']('ascii'), 'hex');
        const _0xd3216c = Buffer['from'](_0x5af6f5);
        const _0x511226 = [];
        for (let _0x419ee2 = 0x0; _0x419ee2 < _0x43ab8d['length']; _0x419ee2++) {
            const _0xb9cd29 = _0x43ab8d[_0x419ee2] ^ _0xd3216c[_0x419ee2 % _0xd3216c['length']];
            if (_0xb9cd29 !== 0x0)
                _0x511226['push'](_0xb9cd29);
        }
        return Buffer['from'](_0x511226)['toString']('utf-8');
    } catch (_0x369316) {
        return null;
    }
}
function xxteaDecrypt(_0x10e2ff, _0x6df79a) {
    if (_0x10e2ff['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x3e5263 = Math['floor'](_0x10e2ff['length'] / 0x4);
    const _0x3e8a5a = new Uint32Array(_0x3e5263);
    for (let _0x2854ab = 0x0; _0x2854ab < _0x3e5263; _0x2854ab++)
        _0x3e8a5a[_0x2854ab] = _0x10e2ff['readUInt32LE'](_0x2854ab * 0x4);
    const _0x9e10e7 = new Uint32Array(0x4);
    for (let _0x149975 = 0x0; _0x149975 < 0x4; _0x149975++)
        _0x9e10e7[_0x149975] = _0x6df79a['readUInt32LE'](Math['min'](_0x149975 * 0x4, _0x6df79a['length'] - 0x4));
    const _0x45b07b = 0x9e3779b9;
    let _0xa415bb = Math['floor'](0x6 + 0x34 / _0x3e5263);
    let _0x3a2a1c = _0xa415bb * _0x45b07b & 0xffffffff;
    let _0x14c9a9 = _0x3e8a5a;
    while (_0x3a2a1c !== 0x0) {
        const _0x416bae = _0x3a2a1c >> 0x2 & 0x3;
        for (let _0x48675e = _0x3e5263 - 0x1; _0x48675e > 0x0; _0x48675e--) {
            const _0x155e95 = _0x3e8a5a[_0x48675e - 0x1];
            const _0x4c40b0 = (_0x155e95 >> 0x5 ^ _0x14c9a9 << 0x2) + (_0x14c9a9 >> 0x3 ^ _0x155e95 << 0x4) ^ (_0x3a2a1c ^ _0x14c9a9) + (_0x9e10e7[_0x48675e & 0x3 ^ _0x416bae] ^ _0x155e95);
            _0x14c9a9 = _0x3e8a5a[_0x48675e] = _0x3e8a5a[_0x48675e] - _0x4c40b0 & 0xffffffff;
        }
        const _0x2cc6db = _0x3e8a5a[_0x3e5263 - 0x1];
        const _0x1dfb0e = (_0x2cc6db >> 0x5 ^ _0x14c9a9 << 0x2) + (_0x14c9a9 >> 0x3 ^ _0x2cc6db << 0x4) ^ (_0x3a2a1c ^ _0x14c9a9) + (_0x9e10e7[0x0 & 0x3 ^ _0x416bae] ^ _0x2cc6db);
        _0x14c9a9 = _0x3e8a5a = _0x3e8a5a - _0x1dfb0e & 0xffffffff;
        _0x3a2a1c = _0x3a2a1c - _0x45b07b & 0xffffffff;
    }
    const _0x1b64b9 = Buffer['alloc'](_0x3e5263 * 0x4);
    for (let _0x48e263 = 0x0; _0x48e263 < _0x3e5263; _0x48e263++)
        _0x1b64b9['writeUInt32LE'](_0x3e8a5a[_0x48e263], _0x48e263 * 0x4);
    const _0x2cb8f1 = _0x3e8a5a[_0x3e5263 - 0x1];
    return _0x2cb8f1 > 0x0 && _0x2cb8f1 <= _0x3e5263 * 0x4 ? _0x1b64b9['slice'](0x0, _0x2cb8f1) : _0x1b64b9;
}
function ehiParseBytes(_0x40da20) {
    try {
        let _0x5e3038 = 0x0;
        if (_0x40da20['readUInt16BE'](0x0) === 0xaced)
            _0x5e3038 = 0x4;
        function _0x58fd5b() {
            if (_0x5e3038 + 0x2 > _0x40da20['length'])
                return '';
            const _0x436c20 = _0x40da20['readUInt16BE'](_0x5e3038);
            _0x5e3038 += 0x2;
            const _0x399522 = _0x40da20['slice'](_0x5e3038, _0x5e3038 + _0x436c20)['toString']('utf-8');
            _0x5e3038 += _0x436c20;
            return _0x399522;
        }
        _0x58fd5b();
        _0x5e3038 += 0x8;
        _0x58fd5b();
        _0x5e3038 += 0x8;
        if (_0x5e3038 + 0x4 > _0x40da20['length'])
            return null;
        const _0xe631cc = _0x40da20['readUInt32BE'](_0x5e3038);
        _0x5e3038 += 0x4;
        _0x5e3038 += 0x8;
        return _0x40da20['slice'](_0x5e3038, _0x5e3038 + _0xe631cc);
    } catch (_0x50fb9e) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x3d12c4, _0x3ac76c) {
    if (!_0x3d12c4)
        return _0x3d12c4;
    try {
        const _0x331685 = Buffer['from'](_0x3ac76c, 'utf-8');
        const _0x495c0e = Buffer['from'](_0x3d12c4, 'utf-16le');
        const _0x49e00b = Buffer['alloc'](_0x495c0e['length']);
        for (let _0x2e73ae = 0x0; _0x2e73ae < _0x495c0e['length']; _0x2e73ae++) {
            _0x49e00b[_0x2e73ae] = _0x495c0e[_0x2e73ae] ^ _0x331685[_0x2e73ae % _0x331685['length']];
        }
        return _0x49e00b['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x472d37) {
        return _0x3d12c4;
    }
}
function generateMasterKey(_0x4e77c4) {
    const _0x5e8617 = [
        _0x4e77c4['configAesKey'],
        _0x4e77c4['configIdentifier'],
        _0x4e77c4['configSalt'],
        _0x4e77c4['configTimestamp'] ? String(_0x4e77c4['configTimestamp']) : '',
        _0x4e77c4['configExpiryTimestamp'] ? String(_0x4e77c4['configExpiryTimestamp']) : '',
        _0x4e77c4['lockModes'],
        _0x4e77c4['lockModesHash'],
        _0x4e77c4['configHwid'],
        _0x4e77c4['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x2a8179['createHash']('sha256')['update'](_0x5e8617, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x2405f6) {
    try {
        const _0x2fe0ea = ehiParseBytes(_0x2405f6);
        if (!_0x2fe0ea)
            return null;
        let _0x309bd3 = null;
        let _0x49fd9f = null;
        for (const _0x3f61d6 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x34da5b = _0x0_0x2a8179['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x3f61d6);
                const _0x3671a9 = Buffer['concat']([
                    _0x34da5b['update'](_0x2fe0ea),
                    _0x34da5b['final']()
                ])['toString']('utf-8');
                const _0x39f42e = _0x3671a9['split'](':');
                if (_0x39f42e['length'] >= 0x3) {
                    const _0x3a46fb = _0x0_0x2a8179['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x39f42e[0x1], 'base64'));
                    const _0x1eb15b = Buffer['concat']([
                        _0x3a46fb['update'](Buffer['from'](_0x39f42e[0x1], 'base64')),
                        _0x3a46fb['final']()
                    ]);
                    const _0x2ff94f = xxteaDecrypt(_0x1eb15b, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x51862a = _0x2ff94f['indexOf'](0x7b);
                    if (_0x51862a !== -0x1) {
                        _0x309bd3 = JSON['parse'](_0x2ff94f['slice'](_0x51862a)['toString']('utf-8'));
                        _0x49fd9f = _0x3f61d6;
                        break;
                    }
                }
            } catch (_0x3237dc) {
                continue;
            }
        }
        if (!_0x309bd3)
            return null;
        const _0x3d142b = _0x309bd3['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x15f6b8 => _0x15f6b8['equals'](_0x49fd9f)) && _0x309bd3['configData']) {
            const _0x1f1408 = ehiDecryptXorLayer(_0x309bd3['configData'], _0x3d142b);
            if (!_0x1f1408)
                return null;
            const _0x1b8db9 = Buffer['from'](_0x1f1408, 'base64');
            const _0x229f2b = _0x1b8db9['slice'](0xa, 0x1a);
            const _0x41f50c = _0x1b8db9['readUInt32LE'](0x1);
            const _0x516568 = _0x1b8db9['readUInt32LE'](0x5);
            const _0x2622d0 = _0x1b8db9[0x9] || 0x1;
            const _0x5b5f90 = generateMasterKey(_0x309bd3);
            const _0x54b452 = await _0x0_0x354ce3['hash'](_0x5b5f90, {
                'salt': _0x229f2b,
                'timeCost': _0x41f50c,
                'memoryCost': _0x516568,
                'parallelism': _0x2622d0,
                'hashLength': 0x20,
                'type': _0x0_0x354ce3['argon2id'],
                'raw': !![]
            });
            const _0x54e791 = _0x0_0x2a8179['createDecipheriv']('chacha20-poly1305', _0x54b452, _0x1b8db9['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x54e791['setAAD'](_0x1b8db9['slice'](0x0, 0x1a));
            _0x54e791['setAuthTag'](_0x1b8db9['slice'](-0x10));
            const _0xb969d = Buffer['concat']([
                _0x54e791['update'](_0x1b8db9['slice'](0x32, -0x10)),
                _0x54e791['final']()
            ]);
            _0x309bd3 = JSON['parse'](_0xb969d['toString']('utf-8'));
        }
        if (_0x309bd3['configMessage']) {
            _0x309bd3['configMessage'] = decodeJavaUtf16Xor(_0x309bd3['configMessage'], _0x3d142b);
        }
        if (_0x309bd3['v2rRawJson'] && typeof _0x309bd3['v2rRawJson'] === 'string') {
            try {
                _0x309bd3['v2rRawJson'] = JSON['parse'](_0x309bd3['v2rRawJson']);
            } catch (_0x4db2f2) {
            }
        }
        if (_0x309bd3['overwriteServerData'] && typeof _0x309bd3['overwriteServerData'] === 'string') {
            try {
                _0x309bd3['overwriteServerData'] = JSON['parse'](_0x309bd3['overwriteServerData']);
            } catch (_0x31fe58) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x309bd3, null, 0x4);
    } catch (_0x4a5eea) {
        return null;
    }
}