import _0x0_0x5a7fa3 from 'crypto';
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
function chacha20Decrypt(_0x55ec7d, _0x289f58, _0x1a9033) {
    try {
        const _0x33bf36 = _0x0_0x5a7fa3['createDecipheriv']('chacha20', _0x55ec7d, _0x289f58);
        _0x33bf36['setAutoPadding'](![]);
        const _0x431d27 = Buffer['alloc'](0x40);
        _0x33bf36['update'](_0x431d27);
        return Buffer['concat']([
            _0x33bf36['update'](_0x1a9033),
            _0x33bf36['final']()
        ]);
    } catch (_0xbbb979) {
        return null;
    }
}
function cleanJSON(_0xa1e586) {
    if (!_0xa1e586)
        return null;
    try {
        const _0x174c98 = _0xa1e586['toString']('utf-8')['split']('\x00');
        const _0x320e85 = _0x174c98['findIndex'](_0x12768d => _0x12768d['includes']('{'));
        if (_0x320e85 !== -0x1) {
            const _0x407b31 = _0x174c98['slice'](_0x320e85)['join']('');
            return JSON['parse'](_0x407b31['substring'](_0x407b31['indexOf']('{'), _0x407b31['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x465e50) {
    }
    return null;
}
export function decryptSSC(_0x3191c2) {
    try {
        let _0x2c5bf7 = _0x3191c2['toString']('utf-8')['trim']();
        if (_0x2c5bf7['startsWith']('ssc://'))
            _0x2c5bf7 = _0x2c5bf7['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x3e27ef = _0x2c5bf7['replace'](/\s/g, '');
        const _0x320b54 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x3e27ef, 'hex'));
        const _0x128f6a = cleanJSON(_0x320b54);
        if (!_0x128f6a)
            return null;
        let _0x1e69cf = _0x128f6a;
        if (_0x128f6a['c'] && typeof _0x128f6a['a'] === 'string') {
            const _0x37be9d = Buffer['from'](_0x128f6a['a']['slice'](0x0, 0x10), 'hex');
            const _0x569bc4 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x37be9d, Buffer['from'](_0x128f6a['c'], 'hex'));
            _0x1e69cf = cleanJSON(_0x569bc4) || _0x128f6a;
        }
        const _0x52a74b = {};
        for (const [_0x471cf4, _0x3e25c1] of Object['entries'](_0x1e69cf)) {
            const _0x27cc4e = SSC_CONSTANTS['KEY_MAP'][_0x471cf4] || _0x471cf4;
            if (_0x27cc4e === 'CONFIGS' && Array['isArray'](_0x3e25c1)) {
                _0x52a74b[_0x27cc4e] = _0x3e25c1['map'](_0x14fc1c => {
                    const _0x9b2afa = {};
                    const _0x4bc311 = _0x14fc1c['b'] || 'DEFAULT';
                    const _0x5228a7 = _0x0_0x5a7fa3['createHash']('md5')['update'](_0x4bc311)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x8a2c62, _0x65d6d] of Object['entries'](_0x14fc1c)) {
                        const _0x1729e2 = SSC_CONSTANTS['KEY_MAP'][_0x8a2c62] || _0x8a2c62;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x8a2c62) && typeof _0x65d6d === 'string') {
                            const _0x31624b = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x5228a7, Buffer['from'](_0x65d6d, 'hex'));
                            _0x9b2afa[_0x1729e2] = _0x31624b ? _0x31624b['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x65d6d;
                        } else {
                            _0x9b2afa[_0x1729e2] = _0x65d6d;
                        }
                    }
                    return _0x9b2afa;
                });
            } else {
                _0x52a74b[_0x27cc4e] = _0x3e25c1;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x52a74b, null, 0x4);
    } catch (_0x8cb3e1) {
        return null;
    }
}