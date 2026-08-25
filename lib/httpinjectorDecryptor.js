import _0x0_0x18db2b from 'crypto';
import _0x0_0x2d4a3d from 'argon2';
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
function customB64DecodeEhi(_0x53648a) {
    const _0x9c3e0d = _0x53648a['replace'](/\?/g, '');
    let _0x1af560 = '';
    for (let _0x361137 = 0x0; _0x361137 < _0x9c3e0d['length']; _0x361137++) {
        _0x1af560 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x9c3e0d[_0x361137]] || _0x9c3e0d[_0x361137];
    }
    while (_0x1af560['length'] % 0x4 !== 0x0)
        _0x1af560 += '=';
    return Buffer['from'](_0x1af560, 'base64');
}
function ehiDecryptXorLayer(_0x41acbb, _0x51ba23) {
    if (!_0x41acbb || !_0x41acbb['trim']())
        return null;
    try {
        const _0x249419 = _0x41acbb['split']('')['reverse']()['join']('');
        const _0x1104b0 = customB64DecodeEhi(_0x249419);
        const _0x42a3ea = Buffer['from'](_0x1104b0['toString']('ascii'), 'hex');
        const _0x55e590 = Buffer['from'](_0x51ba23);
        const _0x53742b = [];
        for (let _0x3005fd = 0x0; _0x3005fd < _0x42a3ea['length']; _0x3005fd++) {
            const _0x4203b0 = _0x42a3ea[_0x3005fd] ^ _0x55e590[_0x3005fd % _0x55e590['length']];
            if (_0x4203b0 !== 0x0)
                _0x53742b['push'](_0x4203b0);
        }
        return Buffer['from'](_0x53742b)['toString']('utf-8');
    } catch (_0x2bd5f0) {
        return null;
    }
}
function xxteaDecrypt(_0x368cd2, _0x217785) {
    if (_0x368cd2['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x3412b6 = Math['floor'](_0x368cd2['length'] / 0x4);
    const _0x31d09a = new Uint32Array(_0x3412b6);
    for (let _0x3cb495 = 0x0; _0x3cb495 < _0x3412b6; _0x3cb495++)
        _0x31d09a[_0x3cb495] = _0x368cd2['readUInt32LE'](_0x3cb495 * 0x4);
    const _0x5f30d7 = new Uint32Array(0x4);
    for (let _0x434446 = 0x0; _0x434446 < 0x4; _0x434446++)
        _0x5f30d7[_0x434446] = _0x217785['readUInt32LE'](Math['min'](_0x434446 * 0x4, _0x217785['length'] - 0x4));
    const _0xeaa3e4 = 0x9e3779b9;
    let _0x30bfa5 = Math['floor'](0x6 + 0x34 / _0x3412b6);
    let _0x1eec73 = _0x30bfa5 * _0xeaa3e4 & 0xffffffff;
    let _0xa0ca8 = _0x31d09a;
    while (_0x1eec73 !== 0x0) {
        const _0x2b465d = _0x1eec73 >> 0x2 & 0x3;
        for (let _0x6afc35 = _0x3412b6 - 0x1; _0x6afc35 > 0x0; _0x6afc35--) {
            const _0x4cce33 = _0x31d09a[_0x6afc35 - 0x1];
            const _0x5cd89e = (_0x4cce33 >> 0x5 ^ _0xa0ca8 << 0x2) + (_0xa0ca8 >> 0x3 ^ _0x4cce33 << 0x4) ^ (_0x1eec73 ^ _0xa0ca8) + (_0x5f30d7[_0x6afc35 & 0x3 ^ _0x2b465d] ^ _0x4cce33);
            _0xa0ca8 = _0x31d09a[_0x6afc35] = _0x31d09a[_0x6afc35] - _0x5cd89e & 0xffffffff;
        }
        const _0x13c4e7 = _0x31d09a[_0x3412b6 - 0x1];
        const _0x179dd1 = (_0x13c4e7 >> 0x5 ^ _0xa0ca8 << 0x2) + (_0xa0ca8 >> 0x3 ^ _0x13c4e7 << 0x4) ^ (_0x1eec73 ^ _0xa0ca8) + (_0x5f30d7[0x0 & 0x3 ^ _0x2b465d] ^ _0x13c4e7);
        _0xa0ca8 = _0x31d09a = _0x31d09a - _0x179dd1 & 0xffffffff;
        _0x1eec73 = _0x1eec73 - _0xeaa3e4 & 0xffffffff;
    }
    const _0x5b3edf = Buffer['alloc'](_0x3412b6 * 0x4);
    for (let _0x58d074 = 0x0; _0x58d074 < _0x3412b6; _0x58d074++)
        _0x5b3edf['writeUInt32LE'](_0x31d09a[_0x58d074], _0x58d074 * 0x4);
    const _0x14e88e = _0x31d09a[_0x3412b6 - 0x1];
    return _0x14e88e > 0x0 && _0x14e88e <= _0x3412b6 * 0x4 ? _0x5b3edf['slice'](0x0, _0x14e88e) : _0x5b3edf;
}
function ehiParseBytes(_0x2eba15) {
    try {
        let _0x2e88f1 = 0x0;
        if (_0x2eba15['readUInt16BE'](0x0) === 0xaced)
            _0x2e88f1 = 0x4;
        function _0x23deec() {
            if (_0x2e88f1 + 0x2 > _0x2eba15['length'])
                return '';
            const _0x4ce273 = _0x2eba15['readUInt16BE'](_0x2e88f1);
            _0x2e88f1 += 0x2;
            const _0x3e10d5 = _0x2eba15['slice'](_0x2e88f1, _0x2e88f1 + _0x4ce273)['toString']('utf-8');
            _0x2e88f1 += _0x4ce273;
            return _0x3e10d5;
        }
        _0x23deec();
        _0x2e88f1 += 0x8;
        _0x23deec();
        _0x2e88f1 += 0x8;
        if (_0x2e88f1 + 0x4 > _0x2eba15['length'])
            return null;
        const _0x336dec = _0x2eba15['readUInt32BE'](_0x2e88f1);
        _0x2e88f1 += 0x4;
        _0x2e88f1 += 0x8;
        return _0x2eba15['slice'](_0x2e88f1, _0x2e88f1 + _0x336dec);
    } catch (_0x5991d3) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x5d4d1c, _0x3ef814) {
    if (!_0x5d4d1c)
        return _0x5d4d1c;
    try {
        const _0x52c68c = Buffer['from'](_0x3ef814, 'utf-8');
        const _0x39f854 = Buffer['from'](_0x5d4d1c, 'utf-16le');
        const _0x2dd3fd = Buffer['alloc'](_0x39f854['length']);
        for (let _0xe5ad23 = 0x0; _0xe5ad23 < _0x39f854['length']; _0xe5ad23++) {
            _0x2dd3fd[_0xe5ad23] = _0x39f854[_0xe5ad23] ^ _0x52c68c[_0xe5ad23 % _0x52c68c['length']];
        }
        return _0x2dd3fd['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x1638d6) {
        return _0x5d4d1c;
    }
}
function generateMasterKey(_0x32b644) {
    const _0xa1a8e9 = [
        _0x32b644['configAesKey'],
        _0x32b644['configIdentifier'],
        _0x32b644['configSalt'],
        _0x32b644['configTimestamp'] ? String(_0x32b644['configTimestamp']) : '',
        _0x32b644['configExpiryTimestamp'] ? String(_0x32b644['configExpiryTimestamp']) : '',
        _0x32b644['lockModes'],
        _0x32b644['lockModesHash'],
        _0x32b644['configHwid'],
        _0x32b644['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x18db2b['createHash']('sha256')['update'](_0xa1a8e9, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x32e1f6) {
    try {
        const _0x5435ae = ehiParseBytes(_0x32e1f6);
        if (!_0x5435ae)
            return null;
        let _0x3e9f39 = null;
        let _0x27edcc = null;
        for (const _0xdae6ba of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x611227 = _0x0_0x18db2b['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0xdae6ba);
                const _0x4f0a95 = Buffer['concat']([
                    _0x611227['update'](_0x5435ae),
                    _0x611227['final']()
                ])['toString']('utf-8');
                const _0x4e7055 = _0x4f0a95['split'](':');
                if (_0x4e7055['length'] >= 0x3) {
                    const _0x4c5678 = _0x0_0x18db2b['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x4e7055[0x1], 'base64'));
                    const _0x49dcc7 = Buffer['concat']([
                        _0x4c5678['update'](Buffer['from'](_0x4e7055[0x1], 'base64')),
                        _0x4c5678['final']()
                    ]);
                    const _0x2ece12 = xxteaDecrypt(_0x49dcc7, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x1c28a8 = _0x2ece12['indexOf'](0x7b);
                    if (_0x1c28a8 !== -0x1) {
                        _0x3e9f39 = JSON['parse'](_0x2ece12['slice'](_0x1c28a8)['toString']('utf-8'));
                        _0x27edcc = _0xdae6ba;
                        break;
                    }
                }
            } catch (_0x2d8400) {
                continue;
            }
        }
        if (!_0x3e9f39)
            return null;
        const _0x18c86b = _0x3e9f39['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x469637 => _0x469637['equals'](_0x27edcc)) && _0x3e9f39['configData']) {
            const _0x8d53a8 = ehiDecryptXorLayer(_0x3e9f39['configData'], _0x18c86b);
            if (!_0x8d53a8)
                return null;
            const _0xa29880 = Buffer['from'](_0x8d53a8, 'base64');
            const _0x534ca4 = _0xa29880['slice'](0xa, 0x1a);
            const _0x2b7eee = _0xa29880['readUInt32LE'](0x1);
            const _0x2a321f = _0xa29880['readUInt32LE'](0x5);
            const _0x169056 = _0xa29880[0x9] || 0x1;
            const _0x189be3 = generateMasterKey(_0x3e9f39);
            const _0x16e909 = await _0x0_0x2d4a3d['hash'](_0x189be3, {
                'salt': _0x534ca4,
                'timeCost': _0x2b7eee,
                'memoryCost': _0x2a321f,
                'parallelism': _0x169056,
                'hashLength': 0x20,
                'type': _0x0_0x2d4a3d['argon2id'],
                'raw': !![]
            });
            const _0x2e8125 = _0x0_0x18db2b['createDecipheriv']('chacha20-poly1305', _0x16e909, _0xa29880['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x2e8125['setAAD'](_0xa29880['slice'](0x0, 0x1a));
            _0x2e8125['setAuthTag'](_0xa29880['slice'](-0x10));
            const _0x117ca5 = Buffer['concat']([
                _0x2e8125['update'](_0xa29880['slice'](0x32, -0x10)),
                _0x2e8125['final']()
            ]);
            _0x3e9f39 = JSON['parse'](_0x117ca5['toString']('utf-8'));
        }
        if (_0x3e9f39['configMessage']) {
            _0x3e9f39['configMessage'] = decodeJavaUtf16Xor(_0x3e9f39['configMessage'], _0x18c86b);
        }
        if (_0x3e9f39['v2rRawJson'] && typeof _0x3e9f39['v2rRawJson'] === 'string') {
            try {
                _0x3e9f39['v2rRawJson'] = JSON['parse'](_0x3e9f39['v2rRawJson']);
            } catch (_0xf74e9a) {
            }
        }
        if (_0x3e9f39['overwriteServerData'] && typeof _0x3e9f39['overwriteServerData'] === 'string') {
            try {
                _0x3e9f39['overwriteServerData'] = JSON['parse'](_0x3e9f39['overwriteServerData']);
            } catch (_0x317dad) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x3e9f39, null, 0x4);
    } catch (_0x4da693) {
        return null;
    }
}