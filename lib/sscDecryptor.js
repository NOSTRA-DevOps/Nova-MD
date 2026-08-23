import _0x0_0x5d4a67 from 'crypto';
const SSC_CONSTANTS = {
    'FIXED_NONCE': Buffer['from']([
        0x74,
        0xd0,
        0xf3,
        0x87,
        0x9f,
        0x9d,
        0x47,
        0xf7
    ]),
    'L1_KEY': Buffer['from']('c8a6a8ea102d5a0baf8fdb1b39cd615c0d07c1edcbde4e82cfdd309bc4587f6b', 'hex'),
    'L2_KEY': Buffer['from']('7f9db48ffde449ad19f9ed44b8b27eee334ab4a85b972dca8ff20e4e8ed44e4e', 'hex'),
    'L3_KEY': Buffer['from']('d39394517a48971f6e8555e994bee5bd835e5ab2f85fbd76bbd99800f32b967e', 'hex'),
    'KEY_MAP': {
        'a': 'CONFIGS',
        'b': 'NOTE',
        'c': 'EXPIRY\x20DATE',
        'e': 'CONFIGNAME',
        'f': 'PAYLOAD\x20ENABLED',
        'g': 'PAYLOAD',
        'h': 'PROXY',
        'i': 'PROXY\x20PORT',
        'j': 'TYPE',
        'k': 'PROXY\x20ENABLED',
        'l': 'ADDRESS',
        'm': 'PORT',
        'n': 'IS\x20PREMIUM',
        'o': 'USERNAME',
        'p': 'PASSWORD',
        'q': 'TIMEOUT',
        'r': 'PROTOCOL',
        's': 'VERSION',
        't': 'ENCRYPTION',
        'u': 'COMPRESSIONLEVEL',
        'v': 'DNS',
        'w': 'NSSERVER',
        'x': 'PUBKEY',
        'y': 'ISDEFAULT',
        'z': 'LOCALPORT'
    }
};
function chacha20Decrypt(_0xa6e3d2, _0x43135d, _0x17d032) {
    try {
        const _0x23a220 = _0x0_0x5d4a67['createDecipheriv']('chacha20', _0xa6e3d2, _0x43135d);
        _0x23a220['setAutoPadding'](![]);
        const _0x4a5cf3 = Buffer['alloc'](0x40);
        _0x23a220['update'](_0x4a5cf3);
        return Buffer['concat']([
            _0x23a220['update'](_0x17d032),
            _0x23a220['final']()
        ]);
    } catch (_0x46728d) {
        return null;
    }
}
function cleanJSON(_0x9750b8) {
    if (!_0x9750b8)
        return null;
    try {
        const _0x2c2412 = _0x9750b8['toString']('utf-8')['split']('\x00');
        const _0x2ee2ab = _0x2c2412['findIndex'](_0xa3aed6 => _0xa3aed6['includes']('{'));
        if (_0x2ee2ab !== -0x1) {
            const _0xdb5c1d = _0x2c2412['slice'](_0x2ee2ab)['join']('');
            return JSON['parse'](_0xdb5c1d['substring'](_0xdb5c1d['indexOf']('{'), _0xdb5c1d['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x3639ce) {
    }
    return null;
}
export function decryptSSC(_0x1bd3c6) {
    try {
        let _0x88870 = _0x1bd3c6['toString']('utf-8')['trim']();
        if (_0x88870['startsWith']('ssc://'))
            _0x88870 = _0x88870['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0xc96bde = _0x88870['replace'](/\s/g, '');
        const _0x3422a4 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0xc96bde, 'hex'));
        const _0x4c7f64 = cleanJSON(_0x3422a4);
        if (!_0x4c7f64)
            return null;
        let _0x3b4081 = _0x4c7f64;
        if (_0x4c7f64['c'] && typeof _0x4c7f64['a'] === 'string') {
            const _0x37c21b = Buffer['from'](_0x4c7f64['a']['slice'](0x0, 0x10), 'hex');
            const _0x442e53 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x37c21b, Buffer['from'](_0x4c7f64['c'], 'hex'));
            _0x3b4081 = cleanJSON(_0x442e53) || _0x4c7f64;
        }
        const _0x45607b = {};
        for (const [_0x454786, _0xbff57] of Object['entries'](_0x3b4081)) {
            const _0x24ffc7 = SSC_CONSTANTS['KEY_MAP'][_0x454786] || _0x454786;
            if (_0x24ffc7 === 'CONFIGS' && Array['isArray'](_0xbff57)) {
                _0x45607b[_0x24ffc7] = _0xbff57['map'](_0x5f0b5c => {
                    const _0x1b2605 = {};
                    const _0x5b200f = _0x5f0b5c['b'] || 'DEFAULT';
                    const _0x38383c = _0x0_0x5d4a67['createHash']('md5')['update'](_0x5b200f)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x11719a, _0x83dd6d] of Object['entries'](_0x5f0b5c)) {
                        const _0x42a3e2 = SSC_CONSTANTS['KEY_MAP'][_0x11719a] || _0x11719a;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x11719a) && typeof _0x83dd6d === 'string') {
                            const _0x4ba8fd = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x38383c, Buffer['from'](_0x83dd6d, 'hex'));
                            _0x1b2605[_0x42a3e2] = _0x4ba8fd ? _0x4ba8fd['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x83dd6d;
                        } else {
                            _0x1b2605[_0x42a3e2] = _0x83dd6d;
                        }
                    }
                    return _0x1b2605;
                });
            } else {
                _0x45607b[_0x24ffc7] = _0xbff57;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x45607b, null, 0x4);
    } catch (_0x3d840e) {
        return null;
    }
}