import _0x0_0x70c4d from 'crypto';
import _0x0_0x329322 from 'argon2';
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
function customB64DecodeEhi(_0x31e4fa) {
    const _0x27b81a = _0x31e4fa['replace'](/\?/g, '');
    let _0x494811 = '';
    for (let _0x39fa9a = 0x0; _0x39fa9a < _0x27b81a['length']; _0x39fa9a++) {
        _0x494811 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x27b81a[_0x39fa9a]] || _0x27b81a[_0x39fa9a];
    }
    while (_0x494811['length'] % 0x4 !== 0x0)
        _0x494811 += '=';
    return Buffer['from'](_0x494811, 'base64');
}
function ehiDecryptXorLayer(_0x1a01ab, _0x3fa423) {
    if (!_0x1a01ab || !_0x1a01ab['trim']())
        return null;
    try {
        const _0x32ede4 = _0x1a01ab['split']('')['reverse']()['join']('');
        const _0x431bb1 = customB64DecodeEhi(_0x32ede4);
        const _0x3c17bd = Buffer['from'](_0x431bb1['toString']('ascii'), 'hex');
        const _0x3b5b45 = Buffer['from'](_0x3fa423);
        const _0x99b0ca = [];
        for (let _0x3e3342 = 0x0; _0x3e3342 < _0x3c17bd['length']; _0x3e3342++) {
            const _0xbbf30d = _0x3c17bd[_0x3e3342] ^ _0x3b5b45[_0x3e3342 % _0x3b5b45['length']];
            if (_0xbbf30d !== 0x0)
                _0x99b0ca['push'](_0xbbf30d);
        }
        return Buffer['from'](_0x99b0ca)['toString']('utf-8');
    } catch (_0x3ccc6e) {
        return null;
    }
}
function xxteaDecrypt(_0x155582, _0x482665) {
    if (_0x155582['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x4c2144 = Math['floor'](_0x155582['length'] / 0x4);
    const _0x1ba0f1 = new Uint32Array(_0x4c2144);
    for (let _0x452c34 = 0x0; _0x452c34 < _0x4c2144; _0x452c34++)
        _0x1ba0f1[_0x452c34] = _0x155582['readUInt32LE'](_0x452c34 * 0x4);
    const _0xa69f35 = new Uint32Array(0x4);
    for (let _0x36d49d = 0x0; _0x36d49d < 0x4; _0x36d49d++)
        _0xa69f35[_0x36d49d] = _0x482665['readUInt32LE'](Math['min'](_0x36d49d * 0x4, _0x482665['length'] - 0x4));
    const _0x316091 = 0x9e3779b9;
    let _0x45f263 = Math['floor'](0x6 + 0x34 / _0x4c2144);
    let _0x51b3b5 = _0x45f263 * _0x316091 & 0xffffffff;
    let _0x3919f2 = _0x1ba0f1;
    while (_0x51b3b5 !== 0x0) {
        const _0x2e2931 = _0x51b3b5 >> 0x2 & 0x3;
        for (let _0x4862ae = _0x4c2144 - 0x1; _0x4862ae > 0x0; _0x4862ae--) {
            const _0x5540f1 = _0x1ba0f1[_0x4862ae - 0x1];
            const _0x1c412d = (_0x5540f1 >> 0x5 ^ _0x3919f2 << 0x2) + (_0x3919f2 >> 0x3 ^ _0x5540f1 << 0x4) ^ (_0x51b3b5 ^ _0x3919f2) + (_0xa69f35[_0x4862ae & 0x3 ^ _0x2e2931] ^ _0x5540f1);
            _0x3919f2 = _0x1ba0f1[_0x4862ae] = _0x1ba0f1[_0x4862ae] - _0x1c412d & 0xffffffff;
        }
        const _0x4275cf = _0x1ba0f1[_0x4c2144 - 0x1];
        const _0x358acd = (_0x4275cf >> 0x5 ^ _0x3919f2 << 0x2) + (_0x3919f2 >> 0x3 ^ _0x4275cf << 0x4) ^ (_0x51b3b5 ^ _0x3919f2) + (_0xa69f35[0x0 & 0x3 ^ _0x2e2931] ^ _0x4275cf);
        _0x3919f2 = _0x1ba0f1 = _0x1ba0f1 - _0x358acd & 0xffffffff;
        _0x51b3b5 = _0x51b3b5 - _0x316091 & 0xffffffff;
    }
    const _0x290b68 = Buffer['alloc'](_0x4c2144 * 0x4);
    for (let _0x4b22b7 = 0x0; _0x4b22b7 < _0x4c2144; _0x4b22b7++)
        _0x290b68['writeUInt32LE'](_0x1ba0f1[_0x4b22b7], _0x4b22b7 * 0x4);
    const _0x442c0c = _0x1ba0f1[_0x4c2144 - 0x1];
    return _0x442c0c > 0x0 && _0x442c0c <= _0x4c2144 * 0x4 ? _0x290b68['slice'](0x0, _0x442c0c) : _0x290b68;
}
function ehiParseBytes(_0x2e11ee) {
    try {
        let _0x25653a = 0x0;
        if (_0x2e11ee['readUInt16BE'](0x0) === 0xaced)
            _0x25653a = 0x4;
        function _0x46d37d() {
            if (_0x25653a + 0x2 > _0x2e11ee['length'])
                return '';
            const _0x3fe700 = _0x2e11ee['readUInt16BE'](_0x25653a);
            _0x25653a += 0x2;
            const _0x26182c = _0x2e11ee['slice'](_0x25653a, _0x25653a + _0x3fe700)['toString']('utf-8');
            _0x25653a += _0x3fe700;
            return _0x26182c;
        }
        _0x46d37d();
        _0x25653a += 0x8;
        _0x46d37d();
        _0x25653a += 0x8;
        if (_0x25653a + 0x4 > _0x2e11ee['length'])
            return null;
        const _0x24c30d = _0x2e11ee['readUInt32BE'](_0x25653a);
        _0x25653a += 0x4;
        _0x25653a += 0x8;
        return _0x2e11ee['slice'](_0x25653a, _0x25653a + _0x24c30d);
    } catch (_0x1e3c95) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0x1d6ee0, _0x54b393) {
    if (!_0x1d6ee0)
        return _0x1d6ee0;
    try {
        const _0x521984 = Buffer['from'](_0x54b393, 'utf-8');
        const _0x17410e = Buffer['from'](_0x1d6ee0, 'utf-16le');
        const _0x5bd8b2 = Buffer['alloc'](_0x17410e['length']);
        for (let _0x207699 = 0x0; _0x207699 < _0x17410e['length']; _0x207699++) {
            _0x5bd8b2[_0x207699] = _0x17410e[_0x207699] ^ _0x521984[_0x207699 % _0x521984['length']];
        }
        return _0x5bd8b2['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x49e532) {
        return _0x1d6ee0;
    }
}
function generateMasterKey(_0x493d92) {
    const _0x2ccd22 = [
        _0x493d92['configAesKey'],
        _0x493d92['configIdentifier'],
        _0x493d92['configSalt'],
        _0x493d92['configTimestamp'] ? String(_0x493d92['configTimestamp']) : '',
        _0x493d92['configExpiryTimestamp'] ? String(_0x493d92['configExpiryTimestamp']) : '',
        _0x493d92['lockModes'],
        _0x493d92['lockModesHash'],
        _0x493d92['configHwid'],
        _0x493d92['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x70c4d['createHash']('sha256')['update'](_0x2ccd22, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x454d70) {
    try {
        const _0x20685b = ehiParseBytes(_0x454d70);
        if (!_0x20685b)
            return null;
        let _0xedd044 = null;
        let _0x13958a = null;
        for (const _0x1b01dc of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x1c8319 = _0x0_0x70c4d['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x1b01dc);
                const _0xc6dd34 = Buffer['concat']([
                    _0x1c8319['update'](_0x20685b),
                    _0x1c8319['final']()
                ])['toString']('utf-8');
                const _0x19cc67 = _0xc6dd34['split'](':');
                if (_0x19cc67['length'] >= 0x3) {
                    const _0x526f0a = _0x0_0x70c4d['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x19cc67[0x1], 'base64'));
                    const _0x19543f = Buffer['concat']([
                        _0x526f0a['update'](Buffer['from'](_0x19cc67[0x1], 'base64')),
                        _0x526f0a['final']()
                    ]);
                    const _0x3ae09c = xxteaDecrypt(_0x19543f, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x5b5a26 = _0x3ae09c['indexOf'](0x7b);
                    if (_0x5b5a26 !== -0x1) {
                        _0xedd044 = JSON['parse'](_0x3ae09c['slice'](_0x5b5a26)['toString']('utf-8'));
                        _0x13958a = _0x1b01dc;
                        break;
                    }
                }
            } catch (_0x1600c0) {
                continue;
            }
        }
        if (!_0xedd044)
            return null;
        const _0x281e79 = _0xedd044['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x138598 => _0x138598['equals'](_0x13958a)) && _0xedd044['configData']) {
            const _0x206ec4 = ehiDecryptXorLayer(_0xedd044['configData'], _0x281e79);
            if (!_0x206ec4)
                return null;
            const _0x18c802 = Buffer['from'](_0x206ec4, 'base64');
            const _0x4d64d7 = _0x18c802['slice'](0xa, 0x1a);
            const _0x4fe4f6 = _0x18c802['readUInt32LE'](0x1);
            const _0x3714ad = _0x18c802['readUInt32LE'](0x5);
            const _0x230e67 = _0x18c802[0x9] || 0x1;
            const _0x481cde = generateMasterKey(_0xedd044);
            const _0x2ea165 = await _0x0_0x329322['hash'](_0x481cde, {
                'salt': _0x4d64d7,
                'timeCost': _0x4fe4f6,
                'memoryCost': _0x3714ad,
                'parallelism': _0x230e67,
                'hashLength': 0x20,
                'type': _0x0_0x329322['argon2id'],
                'raw': !![]
            });
            const _0x56f8e7 = _0x0_0x70c4d['createDecipheriv']('chacha20-poly1305', _0x2ea165, _0x18c802['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x56f8e7['setAAD'](_0x18c802['slice'](0x0, 0x1a));
            _0x56f8e7['setAuthTag'](_0x18c802['slice'](-0x10));
            const _0x120e2e = Buffer['concat']([
                _0x56f8e7['update'](_0x18c802['slice'](0x32, -0x10)),
                _0x56f8e7['final']()
            ]);
            _0xedd044 = JSON['parse'](_0x120e2e['toString']('utf-8'));
        }
        if (_0xedd044['configMessage']) {
            _0xedd044['configMessage'] = decodeJavaUtf16Xor(_0xedd044['configMessage'], _0x281e79);
        }
        if (_0xedd044['v2rRawJson'] && typeof _0xedd044['v2rRawJson'] === 'string') {
            try {
                _0xedd044['v2rRawJson'] = JSON['parse'](_0xedd044['v2rRawJson']);
            } catch (_0x3b753b) {
            }
        }
        if (_0xedd044['overwriteServerData'] && typeof _0xedd044['overwriteServerData'] === 'string') {
            try {
                _0xedd044['overwriteServerData'] = JSON['parse'](_0xedd044['overwriteServerData']);
            } catch (_0x2d6618) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0xedd044, null, 0x4);
    } catch (_0x1abc6e) {
        return null;
    }
}