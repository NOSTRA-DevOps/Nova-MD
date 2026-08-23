import _0x0_0x2c4b2f from 'crypto';
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
function chacha20Decrypt(_0x54d840, _0xc34823, _0x2b965e) {
    try {
        const _0x40fb46 = _0x0_0x2c4b2f['createDecipheriv']('chacha20', _0x54d840, _0xc34823);
        _0x40fb46['setAutoPadding'](![]);
        const _0x416013 = Buffer['alloc'](0x40);
        _0x40fb46['update'](_0x416013);
        return Buffer['concat']([
            _0x40fb46['update'](_0x2b965e),
            _0x40fb46['final']()
        ]);
    } catch (_0x2e9cc5) {
        return null;
    }
}
function cleanJSON(_0x45c563) {
    if (!_0x45c563)
        return null;
    try {
        const _0x14967c = _0x45c563['toString']('utf-8')['split']('\x00');
        const _0x3363c5 = _0x14967c['findIndex'](_0x1969f9 => _0x1969f9['includes']('{'));
        if (_0x3363c5 !== -0x1) {
            const _0x5ba48c = _0x14967c['slice'](_0x3363c5)['join']('');
            return JSON['parse'](_0x5ba48c['substring'](_0x5ba48c['indexOf']('{'), _0x5ba48c['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x468137) {
    }
    return null;
}
export function decryptSSC(_0x32def1) {
    try {
        let _0x95f0c8 = _0x32def1['toString']('utf-8')['trim']();
        if (_0x95f0c8['startsWith']('ssc://'))
            _0x95f0c8 = _0x95f0c8['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x1f5468 = _0x95f0c8['replace'](/\s/g, '');
        const _0x2f11e8 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x1f5468, 'hex'));
        const _0xfb8414 = cleanJSON(_0x2f11e8);
        if (!_0xfb8414)
            return null;
        let _0x283834 = _0xfb8414;
        if (_0xfb8414['c'] && typeof _0xfb8414['a'] === 'string') {
            const _0x42e666 = Buffer['from'](_0xfb8414['a']['slice'](0x0, 0x10), 'hex');
            const _0x1d876f = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x42e666, Buffer['from'](_0xfb8414['c'], 'hex'));
            _0x283834 = cleanJSON(_0x1d876f) || _0xfb8414;
        }
        const _0x12ff49 = {};
        for (const [_0xeed6e4, _0x193db3] of Object['entries'](_0x283834)) {
            const _0x57a5f8 = SSC_CONSTANTS['KEY_MAP'][_0xeed6e4] || _0xeed6e4;
            if (_0x57a5f8 === 'CONFIGS' && Array['isArray'](_0x193db3)) {
                _0x12ff49[_0x57a5f8] = _0x193db3['map'](_0x431b2f => {
                    const _0x5140a6 = {};
                    const _0x29cdcb = _0x431b2f['b'] || 'DEFAULT';
                    const _0x441672 = _0x0_0x2c4b2f['createHash']('md5')['update'](_0x29cdcb)['digest']()['slice'](0x0, 0x8);
                    for (const [_0xdb97c5, _0x5382a2] of Object['entries'](_0x431b2f)) {
                        const _0x393ce7 = SSC_CONSTANTS['KEY_MAP'][_0xdb97c5] || _0xdb97c5;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0xdb97c5) && typeof _0x5382a2 === 'string') {
                            const _0x3d3c97 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x441672, Buffer['from'](_0x5382a2, 'hex'));
                            _0x5140a6[_0x393ce7] = _0x3d3c97 ? _0x3d3c97['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x5382a2;
                        } else {
                            _0x5140a6[_0x393ce7] = _0x5382a2;
                        }
                    }
                    return _0x5140a6;
                });
            } else {
                _0x12ff49[_0x57a5f8] = _0x193db3;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x12ff49, null, 0x4);
    } catch (_0x482df3) {
        return null;
    }
}