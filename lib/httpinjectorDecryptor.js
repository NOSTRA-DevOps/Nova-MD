import _0x0_0x5db3e4 from 'crypto';
import _0x0_0x45c6cd from 'argon2';
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
function customB64DecodeEhi(_0x12d73b) {
    const _0x1e14a3 = _0x12d73b['replace'](/\?/g, '');
    let _0x4d782c = '';
    for (let _0x204622 = 0x0; _0x204622 < _0x1e14a3['length']; _0x204622++) {
        _0x4d782c += EHI_CONSTANTS['TRANSLATION_MAP'][_0x1e14a3[_0x204622]] || _0x1e14a3[_0x204622];
    }
    while (_0x4d782c['length'] % 0x4 !== 0x0)
        _0x4d782c += '=';
    return Buffer['from'](_0x4d782c, 'base64');
}
function ehiDecryptXorLayer(_0x399a3f, _0x36ba16) {
    if (!_0x399a3f || !_0x399a3f['trim']())
        return null;
    try {
        const _0xfbd6c7 = _0x399a3f['split']('')['reverse']()['join']('');
        const _0x22f6de = customB64DecodeEhi(_0xfbd6c7);
        const _0x5de150 = Buffer['from'](_0x22f6de['toString']('ascii'), 'hex');
        const _0x53cc04 = Buffer['from'](_0x36ba16);
        const _0x134af8 = [];
        for (let _0x1f2acf = 0x0; _0x1f2acf < _0x5de150['length']; _0x1f2acf++) {
            const _0x5eff7b = _0x5de150[_0x1f2acf] ^ _0x53cc04[_0x1f2acf % _0x53cc04['length']];
            if (_0x5eff7b !== 0x0)
                _0x134af8['push'](_0x5eff7b);
        }
        return Buffer['from'](_0x134af8)['toString']('utf-8');
    } catch (_0x1f2c16) {
        return null;
    }
}
function xxteaDecrypt(_0x8e3b46, _0x5325eb) {
    if (_0x8e3b46['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x3a21f3 = Math['floor'](_0x8e3b46['length'] / 0x4);
    const _0x1fc660 = new Uint32Array(_0x3a21f3);
    for (let _0x377569 = 0x0; _0x377569 < _0x3a21f3; _0x377569++)
        _0x1fc660[_0x377569] = _0x8e3b46['readUInt32LE'](_0x377569 * 0x4);
    const _0x38e312 = new Uint32Array(0x4);
    for (let _0x33b9f0 = 0x0; _0x33b9f0 < 0x4; _0x33b9f0++)
        _0x38e312[_0x33b9f0] = _0x5325eb['readUInt32LE'](Math['min'](_0x33b9f0 * 0x4, _0x5325eb['length'] - 0x4));
    const _0x3ace8a = 0x9e3779b9;
    let _0x199115 = Math['floor'](0x6 + 0x34 / _0x3a21f3);
    let _0x114d5b = _0x199115 * _0x3ace8a & 0xffffffff;
    let _0x1fcfcb = _0x1fc660;
    while (_0x114d5b !== 0x0) {
        const _0x6b30e = _0x114d5b >> 0x2 & 0x3;
        for (let _0x5f3a5b = _0x3a21f3 - 0x1; _0x5f3a5b > 0x0; _0x5f3a5b--) {
            const _0x38c3e3 = _0x1fc660[_0x5f3a5b - 0x1];
            const _0x5da8ee = (_0x38c3e3 >> 0x5 ^ _0x1fcfcb << 0x2) + (_0x1fcfcb >> 0x3 ^ _0x38c3e3 << 0x4) ^ (_0x114d5b ^ _0x1fcfcb) + (_0x38e312[_0x5f3a5b & 0x3 ^ _0x6b30e] ^ _0x38c3e3);
            _0x1fcfcb = _0x1fc660[_0x5f3a5b] = _0x1fc660[_0x5f3a5b] - _0x5da8ee & 0xffffffff;
        }
        const _0x303804 = _0x1fc660[_0x3a21f3 - 0x1];
        const _0x161500 = (_0x303804 >> 0x5 ^ _0x1fcfcb << 0x2) + (_0x1fcfcb >> 0x3 ^ _0x303804 << 0x4) ^ (_0x114d5b ^ _0x1fcfcb) + (_0x38e312[0x0 & 0x3 ^ _0x6b30e] ^ _0x303804);
        _0x1fcfcb = _0x1fc660 = _0x1fc660 - _0x161500 & 0xffffffff;
        _0x114d5b = _0x114d5b - _0x3ace8a & 0xffffffff;
    }
    const _0x4d4fc6 = Buffer['alloc'](_0x3a21f3 * 0x4);
    for (let _0x3a7164 = 0x0; _0x3a7164 < _0x3a21f3; _0x3a7164++)
        _0x4d4fc6['writeUInt32LE'](_0x1fc660[_0x3a7164], _0x3a7164 * 0x4);
    const _0x36190a = _0x1fc660[_0x3a21f3 - 0x1];
    return _0x36190a > 0x0 && _0x36190a <= _0x3a21f3 * 0x4 ? _0x4d4fc6['slice'](0x0, _0x36190a) : _0x4d4fc6;
}
function ehiParseBytes(_0x3eab81) {
    try {
        let _0x4973b7 = 0x0;
        if (_0x3eab81['readUInt16BE'](0x0) === 0xaced)
            _0x4973b7 = 0x4;
        function _0x4a9354() {
            if (_0x4973b7 + 0x2 > _0x3eab81['length'])
                return '';
            const _0x169bc0 = _0x3eab81['readUInt16BE'](_0x4973b7);
            _0x4973b7 += 0x2;
            const _0x53903c = _0x3eab81['slice'](_0x4973b7, _0x4973b7 + _0x169bc0)['toString']('utf-8');
            _0x4973b7 += _0x169bc0;
            return _0x53903c;
        }
        _0x4a9354();
        _0x4973b7 += 0x8;
        _0x4a9354();
        _0x4973b7 += 0x8;
        if (_0x4973b7 + 0x4 > _0x3eab81['length'])
            return null;
        const _0x1f65b6 = _0x3eab81['readUInt32BE'](_0x4973b7);
        _0x4973b7 += 0x4;
        _0x4973b7 += 0x8;
        return _0x3eab81['slice'](_0x4973b7, _0x4973b7 + _0x1f65b6);
    } catch (_0x2fe668) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x8a6564, _0x1a6479) {
    if (!_0x8a6564)
        return _0x8a6564;
    try {
        const _0x106f60 = Buffer['from'](_0x1a6479, 'utf-8');
        const _0x44aacd = Buffer['from'](_0x8a6564, 'utf-16le');
        const _0x5421b1 = Buffer['alloc'](_0x44aacd['length']);
        for (let _0x5f236a = 0x0; _0x5f236a < _0x44aacd['length']; _0x5f236a++) {
            _0x5421b1[_0x5f236a] = _0x44aacd[_0x5f236a] ^ _0x106f60[_0x5f236a % _0x106f60['length']];
        }
        return _0x5421b1['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x17ee6f) {
        return _0x8a6564;
    }
}
function generateMasterKey(_0x25c85c) {
    const _0x321e75 = [
        _0x25c85c['configAesKey'],
        _0x25c85c['configIdentifier'],
        _0x25c85c['configSalt'],
        _0x25c85c['configTimestamp'] ? String(_0x25c85c['configTimestamp']) : '',
        _0x25c85c['configExpiryTimestamp'] ? String(_0x25c85c['configExpiryTimestamp']) : '',
        _0x25c85c['lockModes'],
        _0x25c85c['lockModesHash'],
        _0x25c85c['configHwid'],
        _0x25c85c['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x5db3e4['createHash']('sha256')['update'](_0x321e75, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x3bd65b) {
    try {
        const _0x2d8b25 = ehiParseBytes(_0x3bd65b);
        if (!_0x2d8b25)
            return null;
        let _0x25b62c = null;
        let _0x3c9284 = null;
        for (const _0x1a7b90 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x1ed4d7 = _0x0_0x5db3e4['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x1a7b90);
                const _0x49f6c7 = Buffer['concat']([
                    _0x1ed4d7['update'](_0x2d8b25),
                    _0x1ed4d7['final']()
                ])['toString']('utf-8');
                const _0x43e994 = _0x49f6c7['split'](':');
                if (_0x43e994['length'] >= 0x3) {
                    const _0x134bdb = _0x0_0x5db3e4['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x43e994[0x1], 'base64'));
                    const _0x43f74a = Buffer['concat']([
                        _0x134bdb['update'](Buffer['from'](_0x43e994[0x1], 'base64')),
                        _0x134bdb['final']()
                    ]);
                    const _0x52a0f3 = xxteaDecrypt(_0x43f74a, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x10bd6c = _0x52a0f3['indexOf'](0x7b);
                    if (_0x10bd6c !== -0x1) {
                        _0x25b62c = JSON['parse'](_0x52a0f3['slice'](_0x10bd6c)['toString']('utf-8'));
                        _0x3c9284 = _0x1a7b90;
                        break;
                    }
                }
            } catch (_0x2a7614) {
                continue;
            }
        }
        if (!_0x25b62c)
            return null;
        const _0x3475d1 = _0x25b62c['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x8f5383 => _0x8f5383['equals'](_0x3c9284)) && _0x25b62c['configData']) {
            const _0x33aab4 = ehiDecryptXorLayer(_0x25b62c['configData'], _0x3475d1);
            if (!_0x33aab4)
                return null;
            const _0x519eab = Buffer['from'](_0x33aab4, 'base64');
            const _0x100889 = _0x519eab['slice'](0xa, 0x1a);
            const _0x521474 = _0x519eab['readUInt32LE'](0x1);
            const _0x50e83e = _0x519eab['readUInt32LE'](0x5);
            const _0x2ed975 = _0x519eab[0x9] || 0x1;
            const _0x2b6e47 = generateMasterKey(_0x25b62c);
            const _0x2896e0 = await _0x0_0x45c6cd['hash'](_0x2b6e47, {
                'salt': _0x100889,
                'timeCost': _0x521474,
                'memoryCost': _0x50e83e,
                'parallelism': _0x2ed975,
                'hashLength': 0x20,
                'type': _0x0_0x45c6cd['argon2id'],
                'raw': !![]
            });
            const _0x2e0308 = _0x0_0x5db3e4['createDecipheriv']('chacha20-poly1305', _0x2896e0, _0x519eab['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x2e0308['setAAD'](_0x519eab['slice'](0x0, 0x1a));
            _0x2e0308['setAuthTag'](_0x519eab['slice'](-0x10));
            const _0x23d365 = Buffer['concat']([
                _0x2e0308['update'](_0x519eab['slice'](0x32, -0x10)),
                _0x2e0308['final']()
            ]);
            _0x25b62c = JSON['parse'](_0x23d365['toString']('utf-8'));
        }
        if (_0x25b62c['configMessage']) {
            _0x25b62c['configMessage'] = decodeJavaUtf16Xor(_0x25b62c['configMessage'], _0x3475d1);
        }
        if (_0x25b62c['v2rRawJson'] && typeof _0x25b62c['v2rRawJson'] === 'string') {
            try {
                _0x25b62c['v2rRawJson'] = JSON['parse'](_0x25b62c['v2rRawJson']);
            } catch (_0x374e88) {
            }
        }
        if (_0x25b62c['overwriteServerData'] && typeof _0x25b62c['overwriteServerData'] === 'string') {
            try {
                _0x25b62c['overwriteServerData'] = JSON['parse'](_0x25b62c['overwriteServerData']);
            } catch (_0x4370f3) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x25b62c, null, 0x4);
    } catch (_0x3676fc) {
        return null;
    }
}