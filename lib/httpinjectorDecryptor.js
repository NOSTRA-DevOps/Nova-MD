import _0x0_0x557196 from 'crypto';
import _0x0_0x4e3e4a from 'argon2';
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
function customB64DecodeEhi(_0x1daaa1) {
    const _0x5b6e30 = _0x1daaa1['replace'](/\?/g, '');
    let _0x38f694 = '';
    for (let _0x5f37ec = 0x0; _0x5f37ec < _0x5b6e30['length']; _0x5f37ec++) {
        _0x38f694 += EHI_CONSTANTS['TRANSLATION_MAP'][_0x5b6e30[_0x5f37ec]] || _0x5b6e30[_0x5f37ec];
    }
    while (_0x38f694['length'] % 0x4 !== 0x0)
        _0x38f694 += '=';
    return Buffer['from'](_0x38f694, 'base64');
}
function ehiDecryptXorLayer(_0x3abd58, _0x5868a3) {
    if (!_0x3abd58 || !_0x3abd58['trim']())
        return null;
    try {
        const _0x5eb68c = _0x3abd58['split']('')['reverse']()['join']('');
        const _0x2ae66a = customB64DecodeEhi(_0x5eb68c);
        const _0xc939c7 = Buffer['from'](_0x2ae66a['toString']('ascii'), 'hex');
        const _0x4473ef = Buffer['from'](_0x5868a3);
        const _0x2da066 = [];
        for (let _0x8c667d = 0x0; _0x8c667d < _0xc939c7['length']; _0x8c667d++) {
            const _0x17eedf = _0xc939c7[_0x8c667d] ^ _0x4473ef[_0x8c667d % _0x4473ef['length']];
            if (_0x17eedf !== 0x0)
                _0x2da066['push'](_0x17eedf);
        }
        return Buffer['from'](_0x2da066)['toString']('utf-8');
    } catch (_0x32e675) {
        return null;
    }
}
function xxteaDecrypt(_0x29427f, _0x34f95b) {
    if (_0x29427f['length'] === 0x0)
        return Buffer['alloc'](0x0);
    const _0x20e7c4 = Math['floor'](_0x29427f['length'] / 0x4);
    const _0x50c67e = new Uint32Array(_0x20e7c4);
    for (let _0x325d26 = 0x0; _0x325d26 < _0x20e7c4; _0x325d26++)
        _0x50c67e[_0x325d26] = _0x29427f['readUInt32LE'](_0x325d26 * 0x4);
    const _0x67da47 = new Uint32Array(0x4);
    for (let _0x18db9d = 0x0; _0x18db9d < 0x4; _0x18db9d++)
        _0x67da47[_0x18db9d] = _0x34f95b['readUInt32LE'](Math['min'](_0x18db9d * 0x4, _0x34f95b['length'] - 0x4));
    const _0x5c4b49 = 0x9e3779b9;
    let _0x2cb8f1 = Math['floor'](0x6 + 0x34 / _0x20e7c4);
    let _0x4651f1 = _0x2cb8f1 * _0x5c4b49 & 0xffffffff;
    let _0x350f5a = _0x50c67e;
    while (_0x4651f1 !== 0x0) {
        const _0x45c927 = _0x4651f1 >> 0x2 & 0x3;
        for (let _0xa839cf = _0x20e7c4 - 0x1; _0xa839cf > 0x0; _0xa839cf--) {
            const _0x518640 = _0x50c67e[_0xa839cf - 0x1];
            const _0x23ac0c = (_0x518640 >> 0x5 ^ _0x350f5a << 0x2) + (_0x350f5a >> 0x3 ^ _0x518640 << 0x4) ^ (_0x4651f1 ^ _0x350f5a) + (_0x67da47[_0xa839cf & 0x3 ^ _0x45c927] ^ _0x518640);
            _0x350f5a = _0x50c67e[_0xa839cf] = _0x50c67e[_0xa839cf] - _0x23ac0c & 0xffffffff;
        }
        const _0x5967dc = _0x50c67e[_0x20e7c4 - 0x1];
        const _0x1cc8f2 = (_0x5967dc >> 0x5 ^ _0x350f5a << 0x2) + (_0x350f5a >> 0x3 ^ _0x5967dc << 0x4) ^ (_0x4651f1 ^ _0x350f5a) + (_0x67da47[0x0 & 0x3 ^ _0x45c927] ^ _0x5967dc);
        _0x350f5a = _0x50c67e = _0x50c67e - _0x1cc8f2 & 0xffffffff;
        _0x4651f1 = _0x4651f1 - _0x5c4b49 & 0xffffffff;
    }
    const _0x3282c4 = Buffer['alloc'](_0x20e7c4 * 0x4);
    for (let _0x306407 = 0x0; _0x306407 < _0x20e7c4; _0x306407++)
        _0x3282c4['writeUInt32LE'](_0x50c67e[_0x306407], _0x306407 * 0x4);
    const _0x48b7ed = _0x50c67e[_0x20e7c4 - 0x1];
    return _0x48b7ed > 0x0 && _0x48b7ed <= _0x20e7c4 * 0x4 ? _0x3282c4['slice'](0x0, _0x48b7ed) : _0x3282c4;
}
function ehiParseBytes(_0x83d130) {
    try {
        let _0x495b12 = 0x0;
        if (_0x83d130['readUInt16BE'](0x0) === 0xaced)
            _0x495b12 = 0x4;
        function _0x582561() {
            if (_0x495b12 + 0x2 > _0x83d130['length'])
                return '';
            const _0xdee73b = _0x83d130['readUInt16BE'](_0x495b12);
            _0x495b12 += 0x2;
            const _0x3d7d77 = _0x83d130['slice'](_0x495b12, _0x495b12 + _0xdee73b)['toString']('utf-8');
            _0x495b12 += _0xdee73b;
            return _0x3d7d77;
        }
        _0x582561();
        _0x495b12 += 0x8;
        _0x582561();
        _0x495b12 += 0x8;
        if (_0x495b12 + 0x4 > _0x83d130['length'])
            return null;
        const _0x571301 = _0x83d130['readUInt32BE'](_0x495b12);
        _0x495b12 += 0x4;
        _0x495b12 += 0x8;
        return _0x83d130['slice'](_0x495b12, _0x495b12 + _0x571301);
    } catch (_0x860299) {
        return null;
    }
}
function decodeJavaUtf16Xor(_0xd639b2, _0x289637) {
    if (!_0xd639b2)
        return _0xd639b2;
    try {
        const _0x62474c = Buffer['from'](_0x289637, 'utf-8');
        const _0x2ce546 = Buffer['from'](_0xd639b2, 'utf-16le');
        const _0x242198 = Buffer['alloc'](_0x2ce546['length']);
        for (let _0x4d9724 = 0x0; _0x4d9724 < _0x2ce546['length']; _0x4d9724++) {
            _0x242198[_0x4d9724] = _0x2ce546[_0x4d9724] ^ _0x62474c[_0x4d9724 % _0x62474c['length']];
        }
        return _0x242198['toString']('utf-16le')['replace'](/\x00/g, '');
    } catch (_0x33eda3) {
        return _0xd639b2;
    }
}
function generateMasterKey(_0x13621c) {
    const _0x261500 = [
        _0x13621c['configAesKey'],
        _0x13621c['configIdentifier'],
        _0x13621c['configSalt'],
        _0x13621c['configTimestamp'] ? String(_0x13621c['configTimestamp']) : '',
        _0x13621c['configExpiryTimestamp'] ? String(_0x13621c['configExpiryTimestamp']) : '',
        _0x13621c['lockModes'],
        _0x13621c['lockModesHash'],
        _0x13621c['configHwid'],
        _0x13621c['configLockMobileOperatorId']
    ]['filter'](Boolean)['join']('');
    return _0x0_0x557196['createHash']('sha256')['update'](_0x261500, 'utf-8')['digest']();
}
export async function decryptHTTPInjector(_0x7566d8) {
    try {
        const _0x211cc4 = ehiParseBytes(_0x7566d8);
        if (!_0x211cc4)
            return null;
        let _0x25240d = null;
        let _0x117128 = null;
        for (const _0x20977a of [
                ...EHI_CONSTANTS['BYPASS_IVS'],
                ...EHI_CONSTANTS['STANDARD_IVS']
            ]) {
            try {
                const _0x3567ae = _0x0_0x557196['createDecipheriv']('aes-256-cbc', EHI_CONSTANTS['L1_KEY'], _0x20977a);
                const _0x180e69 = Buffer['concat']([
                    _0x3567ae['update'](_0x211cc4),
                    _0x3567ae['final']()
                ])['toString']('utf-8');
                const _0x1801dd = _0x180e69['split'](':');
                if (_0x1801dd['length'] >= 0x3) {
                    const _0xc35a25 = _0x0_0x557196['createDecipheriv']('aes-128-cbc', EHI_CONSTANTS['L2_KEY_STATIC'], Buffer['from'](_0x1801dd[0x1], 'base64'));
                    const _0x5a9623 = Buffer['concat']([
                        _0xc35a25['update'](Buffer['from'](_0x1801dd[0x1], 'base64')),
                        _0xc35a25['final']()
                    ]);
                    const _0x53de10 = xxteaDecrypt(_0x5a9623, EHI_CONSTANTS['EOO_MASTER_KEY']);
                    const _0x3f6402 = _0x53de10['indexOf'](0x7b);
                    if (_0x3f6402 !== -0x1) {
                        _0x25240d = JSON['parse'](_0x53de10['slice'](_0x3f6402)['toString']('utf-8'));
                        _0x117128 = _0x20977a;
                        break;
                    }
                }
            } catch (_0x537e57) {
                continue;
            }
        }
        if (!_0x25240d)
            return null;
        const _0x50eeee = _0x25240d['configSalt'] || 'EVZJNI';
        if (!EHI_CONSTANTS['BYPASS_IVS']['some'](_0x3aca59 => _0x3aca59['equals'](_0x117128)) && _0x25240d['configData']) {
            const _0x29f488 = ehiDecryptXorLayer(_0x25240d['configData'], _0x50eeee);
            if (!_0x29f488)
                return null;
            const _0x14f0ca = Buffer['from'](_0x29f488, 'base64');
            const _0x3e2904 = _0x14f0ca['slice'](0xa, 0x1a);
            const _0x5ac13d = _0x14f0ca['readUInt32LE'](0x1);
            const _0x47eb13 = _0x14f0ca['readUInt32LE'](0x5);
            const _0x55c3a9 = _0x14f0ca[0x9] || 0x1;
            const _0x29784a = generateMasterKey(_0x25240d);
            const _0x4cc1eb = await _0x0_0x4e3e4a['hash'](_0x29784a, {
                'salt': _0x3e2904,
                'timeCost': _0x5ac13d,
                'memoryCost': _0x47eb13,
                'parallelism': _0x55c3a9,
                'hashLength': 0x20,
                'type': _0x0_0x4e3e4a['argon2id'],
                'raw': !![]
            });
            const _0x2e3580 = _0x0_0x557196['createDecipheriv']('chacha20-poly1305', _0x4cc1eb, _0x14f0ca['slice'](0x1a, 0x32), { 'authTagLength': 0x10 });
            _0x2e3580['setAAD'](_0x14f0ca['slice'](0x0, 0x1a));
            _0x2e3580['setAuthTag'](_0x14f0ca['slice'](-0x10));
            const _0x31266b = Buffer['concat']([
                _0x2e3580['update'](_0x14f0ca['slice'](0x32, -0x10)),
                _0x2e3580['final']()
            ]);
            _0x25240d = JSON['parse'](_0x31266b['toString']('utf-8'));
        }
        if (_0x25240d['configMessage']) {
            _0x25240d['configMessage'] = decodeJavaUtf16Xor(_0x25240d['configMessage'], _0x50eeee);
        }
        if (_0x25240d['v2rRawJson'] && typeof _0x25240d['v2rRawJson'] === 'string') {
            try {
                _0x25240d['v2rRawJson'] = JSON['parse'](_0x25240d['v2rRawJson']);
            } catch (_0x3f8efa) {
            }
        }
        if (_0x25240d['overwriteServerData'] && typeof _0x25240d['overwriteServerData'] === 'string') {
            try {
                _0x25240d['overwriteServerData'] = JSON['parse'](_0x25240d['overwriteServerData']);
            } catch (_0x4c397a) {
            }
        }
        return 'Labokingfreesurf\x20HTTP\x20INJECTOR\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x25240d, null, 0x4);
    } catch (_0x5a0c7e) {
        return null;
    }
}