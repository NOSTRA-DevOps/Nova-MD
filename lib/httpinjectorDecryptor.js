import _0x0_0x2abff3 from 'crypto';
import _0x0_0x58f53d from 'argon2';
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
function customB64DecodeEhi(_0x2af9ef) {
    const _0x2bd728 = _0x2af9ef['replace'](/\?/g, '');
    let _0x4287f3 = '';
    for (let _0x1edcc9 = 0x0; _0x1edcc9 < _0x2bd728['length']; _0x1edcc9++) {
        _0x4287f3 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x2bd728[_0x1edcc9]] || _0x2bd728[_0x1edcc9];
    }
    while (_0x4287f3['length'] % 0x4 !== 0x0)
        _0x4287f3 += '=';
    return Buffer['from'](_0x4287f3, 'base64');
}
function ehiDecryptXorLayer(_0x1a90e0, _0x555a16) {
    if (!_0x1a90e0 || !_0x1a90e0['trim']())
        return null;
    try {
        const _0x206177 = _0x1a90e0['split']('')['reverse']()['join']('');
        const _0x49e866 = customB64DecodeEhi(_0x206177);
        const _0x23bf94 = Buffer['from'](_0x49e866['toString']('ascii'), 'hex');
        const _0x2163a3 = Buffer['from'](_0x555a16);
        const _0x5e8d5c = [];
        for (let _0x242bb2 = 0x0; _0x242bb2 < _0x23bf94['length']; _0x242bb2++) {
            const _0x3de477 = _0x23bf94[_0x242bb2] ^ _0x2163a3[_0x242bb2 % _0x2163a3['length']];
            if (_0x3de477 !== 0x0)
                _0x5e8d5c['push'](_0x3de477);
        }
        return Buffer['from'](_0x5e8d5c)['toString']('utf-8');
    } catch (_0x7c10f) {
        return null;
    }
}
function xxteaDecrypt(_0x55c5e2, _0x4c9066) {
    if (_0x55c5e2['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x3210f2 = Math['floor'](_0x55c5e2['length'] / 0x4);
    const _0x1fde58 = new Uint32Array(_0x3210f2);
    for (let _0x263af5 = 0x0; _0x263af5 < _0x3210f2; _0x263af5++)
        _0x1fde58[_0x263af5] = _0x55c5e2['readUInt32LE'](_0x263af5 * 0x4);
    const _0x30c7d5 = new Uint32Array(0x4);
    for (let _0x1c2f6c = 0x0; _0x1c2f6c < 0x4; _0x1c2f6c++)
        _0x30c7d5[_0x1c2f6c] = _0x4c9066['readUInt32LE'](Math['min'](_0x1c2f6c * 0x4, _0x4c9066['length'] - 0x4));
    const _0x1acaf9 = 0x9e3779b9;
    let _0x2d6e07 = Math['floor'](0x6 + 0x34 / _0x3210f2);
    let _0x58484d = _0x2d6e07 * _0x1acaf9 & 0xffffffff;
    let _0x2efa89 = _0x1fde58;
    while (_0x58484d !== 0x0) {
        const _0x236787 = _0x58484d >> 0x2 & 0x3;
        for (let _0x31a732 = _0x3210f2 - 0x1; _0x31a732 > 0x0; _0x31a732--) {
            const _0x137443 = _0x1fde58[_0x31a732 - 0x1];
            const _0x4b8543 = (_0x137443 >> 0x5 ^ _0x2efa89 << 0x2) + (_0x2efa89 >> 0x3 ^ _0x137443 << 0x4) ^ (_0x58484d ^ _0x2efa89) + (_0x30c7d5[_0x31a732 & 0x3 ^ _0x236787] ^ _0x137443);
            _0x2efa89 = _0x1fde58[_0x31a732] = _0x1fde58[_0x31a732] - _0x4b8543 & 0xffffffff;
        }
        const _0x378a2c = _0x1fde58[_0x3210f2 - 0x1];
        const _0x43f000 = (_0x378a2c >> 0x5 ^ _0x2efa89 << 0x2) + (_0x2efa89 >> 0x3 ^ _0x378a2c << 0x4) ^ (_0x58484d ^ _0x2efa89) + (_0x30c7d5[0x0 & 0x3 ^ _0x236787] ^ _0x378a2c);
        _0x2efa89 = _0x1fde58 = _0x1fde58 - _0x43f000 & 0xffffffff;
        _0x58484d = _0x58484d - _0x1acaf9 & 0xffffffff;
    }
    const _0x189bd2 = Buffer['alloc'](_0x3210f2 * 0x4);
    for (let _0x2232b9 = 0x0; _0x2232b9 < _0x3210f2; _0x2232b9++)
        _0x189bd2['writeUInt32LE'](_0x1fde58[_0x2232b9], _0x2232b9 * 0x4);
    const _0x32d937 = _0x1fde58[_0x3210f2 - 0x1];
    return _0x32d937 > 0x0 && _0x32d937 <= _0x3210f2 * 0x4 ? _0x189bd2['slice'](0x0, _0x32d937) : _0x189bd2;
}
function ehiParseBytes(_0x185892) {
    try {
        let _0x4d9c99 = 0x0;
        if (_0x185892['readUInt16BE'](0x0) === 0xaced)
            _0x4d9c99 = 0x4;
        function _0x418ec7() {
            if (_0x4d9c99 + 0x2 > _0x185892['length'])
                return '';
            const _0x201540 = _0x185892['readUInt16BE'](_0x4d9c99);
            _0x4d9c99 += 0x2;
            const _0x23b45c = _0x185892['slice'](_0x4d9c99, _0x4d9c99 + _0x201540)['toString']('utf-8');
            _0x4d9c99 += _0x201540;
            return _0x23b45c;
        }
        _0x418ec7();
        _0x4d9c99 += 0x8;
        _0x418ec7();
        _0x4d9c99 += 0x8;
        if (_0x4d9c99 + 0x4 > _0x185892['length'])
            return null;
        const _0x4b800a = _0x185892['readUInt32BE'](_0x4d9c99);
        _0x4d9c99 += 0x4;
        _0x4d9c99 += 0x8;
        return _0x185892['slice'](_0x4d9c99, _0x4d9c99 + _0x4b800a);
    } catch (_0x538384) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x493bf6, _0x5c84d0) {
    if (!_0x493bf6)
        return _0x493bf6;
    try {
        const _0x117d44 = Buffer['from'](_0x5c84d0, 'utf-8');
        const _0x555162 = Buffer['from'](_0x493bf6, 'utf-16le');
        const _0x20f230 = Buffer['alloc'](_0x555162['length']);
        for (let _0x576771 = 0x0; _0x576771 < _0x555162['length']; _0x576771++) {
            _0x20f230[_0x576771] = _0x555162[_0x576771] ^ _0x117d44[_0x576771 % _0x117d44['length']];
        }
        return _0x20f230['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x1f9268) {
        return _0x493bf6;
    }
}
function generateMasterKey(_0x2fee3c) {
    const _0x250aed = [
        _0x2fee3c['configAesKey'],
        _0x2fee3c['configIdentifier'],
        _0x2fee3c['configSalt'],
        _0x2fee3c['configTimestamp'] ? String(_0x2fee3c['configTimestamp']) : '',
        _0x2fee3c['configExpiryTimestamp'] ? String(_0x2fee3c['configExpiryTimestamp']) : '',
        _0x2fee3c['lockModes'],
        _0x2fee3c['lockModesHash'],
        _0x2fee3c['configHwid'],
        _0x2fee3c['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x2abff3['createHash']('sha256')['update'](_0x250aed, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x33b6ef) {
    try {
        const _0x586070 = ehiParseBytes(_0x33b6ef);
        if (!_0x586070)
            return null;
        let _0x330515 = null;
        let _0x5194d9 = null;
        for (const _0x57b8ad of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x471eab = _0x0_0x2abff3['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x57b8ad);
                const _0x547745 = Buffer['concat']([
                    _0x471eab['update'](_0x586070),
                    _0x471eab['final']()
                ])['toString']('utf-8');
                const _0xe580a4 = _0x547745['split'](':');
                if (_0xe580a4['length'] >= 0x3) {
                    const _0xbc24c = _0x0_0x2abff3['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0xe580a4[0x1], 'base64'));
                    const _0x11d4b3 = Buffer['concat']([
                        _0xbc24c['update'](Buffer['from'](_0xe580a4[0x1], 'base64')),
                        _0xbc24c['final']()
                    ]);
                    const _0x31db4b = xxteaDecrypt(_0x11d4b3, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x216927 = _0x31db4b['indexOf'](0x7b);
                    if (_0x216927 !== -0x1) {
                        _0x330515 = JSON['parse'](_0x31db4b['slice'](_0x216927)['toString']('utf-8'));
                        _0x5194d9 = _0x57b8ad;
                        break;
                    }
                }
            } catch (_0x3977c9) {
                continue;
            }
        }
        if (!_0x330515)
            return null;
        const _0x49ca26 = _0x330515['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x170876 => _0x170876['equals'](_0x5194d9)) && _0x330515['configData']) {
            const _0x30beb1 = ehiDecryptXorLayer(_0x330515['configData'], _0x49ca26);
            if (!_0x30beb1)
                return null;
            const _0x27be0c = Buffer['from'](_0x30beb1, 'base64');
            const _0x41610b = _0x27be0c['slice'](0xa, 0x1a);
            const _0x30bf53 = _0x27be0c['readUInt32LE'](0x1);
            const _0x31758c = _0x27be0c['readUInt32LE'](0x5);
            const _0x171206 = _0x27be0c[0x9] || 0x1;
            const _0x46ea86 = generateMasterKey(_0x330515);
            const _0x1b1a75 = await _0x0_0x58f53d['hash'](_0x46ea86, {
                'salt': _0x41610b,
                'timeCost': _0x30bf53,
                'memoryCost': _0x31758c,
                'parallelism': _0x171206,
                'hashLength': 0x20,
                'type': _0x0_0x58f53d['argon2id'],
                'raw': !![]
            });
            const _0x3e3720 = _0x0_0x2abff3['createDecipheriv']('chacha20-poly1305', _0x1b1a75, _0x27be0c['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x3e3720['setAAD'](_0x27be0c['slice'](0x0, 0x1a));
            _0x3e3720['setAuthTag'](_0x27be0c['slice'](-0x10));
            const _0x179963 = Buffer['concat']([
                _0x3e3720['update'](_0x27be0c['slice'](0x32, -0x10)),
                _0x3e3720['final']()
            ]);
            _0x330515 = JSON['parse'](_0x179963['toString']('utf-8'));
        }
        if (_0x330515['configMessage']) {
            _0x330515['configMessage'] = decodeJavaUtf16Xor(_0x330515['configMessage'], _0x49ca26);
        }
        if (_0x330515['v2rRawJson'] && typeof _0x330515['v2rRawJson'] === 'string') {
            try {
                _0x330515['v2rRawJson'] = JSON['parse'](_0x330515['v2rRawJson']);
            } catch (_0x3d9dc5) {
            }
        }
        if (_0x330515['overwriteServerData'] && typeof _0x330515['overwriteServerData'] === 'string') {
            try {
                _0x330515['overwriteServerData'] = JSON['parse'](_0x330515['overwriteServerData']);
            } catch (_0x5e7d0f) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x330515, null, 0x4);
    } catch (_0x16cebd) {
        return null;
    }
}