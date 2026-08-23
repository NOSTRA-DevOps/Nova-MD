import _0x0_0x5d40b3 from 'crypto';
import _0x0_0x5683f7 from 'argon2';
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
function customB64DecodeEhi(_0x39570b) {
    const _0xd5c5a4 = _0x39570b['replace'](/\?/g, '');
    let _0x353298 = '';
    for (let _0x531cf6 = 0x0; _0x531cf6 < _0xd5c5a4['length']; _0x531cf6++) {
        _0x353298 += EHI_CONSTANTS['TRANSLATION_MAP'][_0xd5c5a4[_0x531cf6]] || _0xd5c5a4[_0x531cf6];
    }
    while (_0x353298['length'] % 0x4 !== 0x0)
        _0x353298 += '=';
    return Buffer['from'](_0x353298, 'base64');
}
function ehiDecryptXorLayer(_0x96f225, _0x39376f) {
    if (!_0x96f225 || !_0x96f225['trim']())
        return null;
    try {
        const _0x5c4cdf = _0x96f225['split']('')['reverse']()['join']('');
        const _0x5cf358 = customB64DecodeEhi(_0x5c4cdf);
        const _0xfd2e62 = Buffer['from'](_0x5cf358['toString']('ascii'), 'hex');
        const _0x2b6155 = Buffer['from'](_0x39376f);
        const _0x1ab523 = [];
        for (let _0xfa59d = 0x0; _0xfa59d < _0xfd2e62['length']; _0xfa59d++) {
            const _0x499d56 = _0xfd2e62[_0xfa59d] ^ _0x2b6155[_0xfa59d % _0x2b6155['length']];
            if (_0x499d56 !== 0x0)
                _0x1ab523['push'](_0x499d56);
        }
        return Buffer['from'](_0x1ab523)['toString']('utf-8');
    } catch (_0x1603d8) {
        return null;
    }
}
function xxteaDecrypt(_0x5da709, _0x2f4e1d) {
    if (_0x5da709['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x268a2c = Math['floor'](_0x5da709['length'] / 0x4);
    const _0x313810 = new Uint32Array(_0x268a2c);
    for (let _0x2815ce = 0x0; _0x2815ce < _0x268a2c; _0x2815ce++)
        _0x313810[_0x2815ce] = _0x5da709['readUInt32LE'](_0x2815ce * 0x4);
    const _0x3f8057 = new Uint32Array(0x4);
    for (let _0x57c8b8 = 0x0; _0x57c8b8 < 0x4; _0x57c8b8++)
        _0x3f8057[_0x57c8b8] = _0x2f4e1d['readUInt32LE'](Math['min'](_0x57c8b8 * 0x4, _0x2f4e1d['length'] - 0x4));
    const _0x3d13b6 = 0x9e3779b9;
    let _0x6ecfee = Math['floor'](0x6 + 0x34 / _0x268a2c);
    let _0x3b0ee5 = _0x6ecfee * _0x3d13b6 & 0xffffffff;
    let _0xb8dbe0 = _0x313810;
    while (_0x3b0ee5 !== 0x0) {
        const _0x2f61d3 = _0x3b0ee5 >> 0x2 & 0x3;
        for (let _0x2f9456 = _0x268a2c - 0x1; _0x2f9456 > 0x0; _0x2f9456--) {
            const _0x42529e = _0x313810[_0x2f9456 - 0x1];
            const _0x2e918a = (_0x42529e >> 0x5 ^ _0xb8dbe0 << 0x2) + (_0xb8dbe0 >> 0x3 ^ _0x42529e << 0x4) ^ (_0x3b0ee5 ^ _0xb8dbe0) + (_0x3f8057[_0x2f9456 & 0x3 ^ _0x2f61d3] ^ _0x42529e);
            _0xb8dbe0 = _0x313810[_0x2f9456] = _0x313810[_0x2f9456] - _0x2e918a & 0xffffffff;
        }
        const _0x39b177 = _0x313810[_0x268a2c - 0x1];
        const _0xbe7c78 = (_0x39b177 >> 0x5 ^ _0xb8dbe0 << 0x2) + (_0xb8dbe0 >> 0x3 ^ _0x39b177 << 0x4) ^ (_0x3b0ee5 ^ _0xb8dbe0) + (_0x3f8057[0x0 & 0x3 ^ _0x2f61d3] ^ _0x39b177);
        _0xb8dbe0 = _0x313810 = _0x313810 - _0xbe7c78 & 0xffffffff;
        _0x3b0ee5 = _0x3b0ee5 - _0x3d13b6 & 0xffffffff;
    }
    const _0x579663 = Buffer['alloc'](_0x268a2c * 0x4);
    for (let _0x25eade = 0x0; _0x25eade < _0x268a2c; _0x25eade++)
        _0x579663['writeUInt32LE'](_0x313810[_0x25eade], _0x25eade * 0x4);
    const _0x159d00 = _0x313810[_0x268a2c - 0x1];
    return _0x159d00 > 0x0 && _0x159d00 <= _0x268a2c * 0x4 ? _0x579663['slice'](0x0, _0x159d00) : _0x579663;
}
function ehiParseBytes(_0x317208) {
    try {
        let _0x30828a = 0x0;
        if (_0x317208['readUInt16BE'](0x0) === 0xaced)
            _0x30828a = 0x4;
        function _0x308913() {
            if (_0x30828a + 0x2 > _0x317208['length'])
                return '';
            const _0x17213b = _0x317208['readUInt16BE'](_0x30828a);
            _0x30828a += 0x2;
            const _0x30350a = _0x317208['slice'](_0x30828a, _0x30828a + _0x17213b)['toString']('utf-8');
            _0x30828a += _0x17213b;
            return _0x30350a;
        }
        _0x308913();
        _0x30828a += 0x8;
        _0x308913();
        _0x30828a += 0x8;
        if (_0x30828a + 0x4 > _0x317208['length'])
            return null;
        const _0x1eb36f = _0x317208['readUInt32BE'](_0x30828a);
        _0x30828a += 0x4;
        _0x30828a += 0x8;
        return _0x317208['slice'](_0x30828a, _0x30828a + _0x1eb36f);
    } catch (_0x1fbef8) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x5e1eaa, _0x47c16f) {
    if (!_0x5e1eaa)
        return _0x5e1eaa;
    try {
        const _0x1de3b2 = Buffer['from'](_0x47c16f, 'utf-8');
        const _0x3803ee = Buffer['from'](_0x5e1eaa, 'utf-16le');
        const _0x4d402a = Buffer['alloc'](_0x3803ee['length']);
        for (let _0x2882f5 = 0x0; _0x2882f5 < _0x3803ee['length']; _0x2882f5++) {
            _0x4d402a[_0x2882f5] = _0x3803ee[_0x2882f5] ^ _0x1de3b2[_0x2882f5 % _0x1de3b2['length']];
        }
        return _0x4d402a['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x16c88a) {
        return _0x5e1eaa;
    }
}
function generateMasterKey(_0x1b96e4) {
    const _0x2943ef = [
        _0x1b96e4['configAesKey'],
        _0x1b96e4['configIdentifier'],
        _0x1b96e4['configSalt'],
        _0x1b96e4['configTimestamp'] ? String(_0x1b96e4['configTimestamp']) : '',
        _0x1b96e4['configExpiryTimestamp'] ? String(_0x1b96e4['configExpiryTimestamp']) : '',
        _0x1b96e4['lockModes'],
        _0x1b96e4['lockModesHash'],
        _0x1b96e4['configHwid'],
        _0x1b96e4['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x5d40b3['createHash']('sha256')['update'](_0x2943ef, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x577c18) {
    try {
        const _0x13e0c1 = ehiParseBytes(_0x577c18);
        if (!_0x13e0c1)
            return null;
        let _0x219385 = null;
        let _0x24cf1a = null;
        for (const _0x10a8a3 of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x40886f = _0x0_0x5d40b3['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x10a8a3);
                const _0x13a238 = Buffer['concat']([
                    _0x40886f['update'](_0x13e0c1),
                    _0x40886f['final']()
                ])['toString']('utf-8');
                const _0x34a0fd = _0x13a238['split'](':');
                if (_0x34a0fd['length'] >= 0x3) {
                    const _0x5e7a96 = _0x0_0x5d40b3['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x34a0fd[0x1], 'base64'));
                    const _0xeb5ea1 = Buffer['concat']([
                        _0x5e7a96['update'](Buffer['from'](_0x34a0fd[0x1], 'base64')),
                        _0x5e7a96['final']()
                    ]);
                    const _0x24b809 = xxteaDecrypt(_0xeb5ea1, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x67c433 = _0x24b809['indexOf'](0x7b);
                    if (_0x67c433 !== -0x1) {
                        _0x219385 = JSON['parse'](_0x24b809['slice'](_0x67c433)['toString']('utf-8'));
                        _0x24cf1a = _0x10a8a3;
                        break;
                    }
                }
            } catch (_0x44f9d1) {
                continue;
            }
        }
        if (!_0x219385)
            return null;
        const _0x70df4d = _0x219385['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x30f782 => _0x30f782['equals'](_0x24cf1a)) && _0x219385['configData']) {
            const _0x2f2a3e = ehiDecryptXorLayer(_0x219385['configData'], _0x70df4d);
            if (!_0x2f2a3e)
                return null;
            const _0x47a9f1 = Buffer['from'](_0x2f2a3e, 'base64');
            const _0x33575d = _0x47a9f1['slice'](0xa, 0x1a);
            const _0x28e793 = _0x47a9f1['readUInt32LE'](0x1);
            const _0x1af94a = _0x47a9f1['readUInt32LE'](0x5);
            const _0x2a9dd1 = _0x47a9f1[0x9] || 0x1;
            const _0x4e7448 = generateMasterKey(_0x219385);
            const _0x5f8c13 = await _0x0_0x5683f7['hash'](_0x4e7448, {
                'salt': _0x33575d,
                'timeCost': _0x28e793,
                'memoryCost': _0x1af94a,
                'parallelism': _0x2a9dd1,
                'hashLength': 0x20,
                'type': _0x0_0x5683f7['argon2id'],
                'raw': !![]
            });
            const _0x43f479 = _0x0_0x5d40b3['createDecipheriv']('chacha20-poly1305', _0x5f8c13, _0x47a9f1['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x43f479['setAAD'](_0x47a9f1['slice'](0x0, 0x1a));
            _0x43f479['setAuthTag'](_0x47a9f1['slice'](-0x10));
            const _0x2bb97f = Buffer['concat']([
                _0x43f479['update'](_0x47a9f1['slice'](0x32, -0x10)),
                _0x43f479['final']()
            ]);
            _0x219385 = JSON['parse'](_0x2bb97f['toString']('utf-8'));
        }
        if (_0x219385['configMessage']) {
            _0x219385['configMessage'] = decodeJavaUtf16Xor(_0x219385['configMessage'], _0x70df4d);
        }
        if (_0x219385['v2rRawJson'] && typeof _0x219385['v2rRawJson'] === 'string') {
            try {
                _0x219385['v2rRawJson'] = JSON['parse'](_0x219385['v2rRawJson']);
            } catch (_0x2c0cbb) {
            }
        }
        if (_0x219385['overwriteServerData'] && typeof _0x219385['overwriteServerData'] === 'string') {
            try {
                _0x219385['overwriteServerData'] = JSON['parse'](_0x219385['overwriteServerData']);
            } catch (_0x510acb) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x219385, null, 0x4);
    } catch (_0x3997bd) {
        return null;
    }
}