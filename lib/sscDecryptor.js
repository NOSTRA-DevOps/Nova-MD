import _0x0_0x4ad6e9 from 'crypto';
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
function chacha20Decrypt(_0x31dfa4, _0x57249f, _0x114cf8) {
    try {
        const _0x51a730 = _0x0_0x4ad6e9['createDecipheriv']('chacha20', _0x31dfa4, _0x57249f);
        _0x51a730['setAutoPadding'](![]);
        const _0x58f9b5 = Buffer['alloc'](0x40);
        _0x51a730['update'](_0x58f9b5);
        return Buffer['concat']([
            _0x51a730['update'](_0x114cf8),
            _0x51a730['final']()
        ]);
    } catch (_0x3066ae) {
        return null;
    }
}
function cleanJSON(_0x1d04a6) {
    if (!_0x1d04a6)
        return null;
    try {
        const _0x4d2c79 = _0x1d04a6['toString']('utf-8')['split']('\x00');
        const _0xa7f0ca = _0x4d2c79['findIndex'](_0x5958da => _0x5958da['includes']('{'));
        if (_0xa7f0ca !== -0x1) {
            const _0xee910b = _0x4d2c79['slice'](_0xa7f0ca)['join']('');
            return JSON['parse'](_0xee910b['substring'](_0xee910b['indexOf']('{'), _0xee910b['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x334f9d) {
    }
    return null;
}
export function decryptSSC(_0x3dd5b1) {
    try {
        let _0x14e35b = _0x3dd5b1['toString']('utf-8')['trim']();
        if (_0x14e35b['startsWith']('ssc://'))
            _0x14e35b = _0x14e35b['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x87d3b7 = _0x14e35b['replace'](/\s/g, '');
        const _0xac9b7c = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x87d3b7, 'hex'));
        const _0x120116 = cleanJSON(_0xac9b7c);
        if (!_0x120116)
            return null;
        let _0x148342 = _0x120116;
        if (_0x120116['c'] && typeof _0x120116['a'] === 'string') {
            const _0x39048a = Buffer['from'](_0x120116['a']['slice'](0x0, 0x10), 'hex');
            const _0x4c6db0 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x39048a, Buffer['from'](_0x120116['c'], 'hex'));
            _0x148342 = cleanJSON(_0x4c6db0) || _0x120116;
        }
        const _0x250271 = {};
        for (const [_0x5379a7, _0x3596a4] of Object['entries'](_0x148342)) {
            const _0x805eed = SSC_CONSTANTS['KEY_MAP'][_0x5379a7] || _0x5379a7;
            if (_0x805eed === 'CONFIGS' && Array['isArray'](_0x3596a4)) {
                _0x250271[_0x805eed] = _0x3596a4['map'](_0x1edd14 => {
                    const _0x94c2c2 = {};
                    const _0x16abc7 = _0x1edd14['b'] || 'DEFAULT';
                    const _0xb38841 = _0x0_0x4ad6e9['createHash']('md5')['update'](_0x16abc7)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x1b3e69, _0x5f0383] of Object['entries'](_0x1edd14)) {
                        const _0x1bf7aa = SSC_CONSTANTS['KEY_MAP'][_0x1b3e69] || _0x1b3e69;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x1b3e69) && typeof _0x5f0383 === 'string') {
                            const _0x5d5950 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0xb38841, Buffer['from'](_0x5f0383, 'hex'));
                            _0x94c2c2[_0x1bf7aa] = _0x5d5950 ? _0x5d5950['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x5f0383;
                        } else {
                            _0x94c2c2[_0x1bf7aa] = _0x5f0383;
                        }
                    }
                    return _0x94c2c2;
                });
            } else {
                _0x250271[_0x805eed] = _0x3596a4;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x250271, null, 0x4);
    } catch (_0x53e890) {
        return null;
    }
}