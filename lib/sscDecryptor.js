import _0x0_0x5adce7 from 'crypto';
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
function chacha20Decrypt(_0x373e1c, _0x1d9030, _0x9b0fce) {
    try {
        const _0x3f1ea9 = _0x0_0x5adce7['createDecipheriv']('chacha20', _0x373e1c, _0x1d9030);
        _0x3f1ea9['setAutoPadding'](![]);
        const _0x3a3ac = Buffer['alloc'](0x40);
        _0x3f1ea9['update'](_0x3a3ac);
        return Buffer['concat']([
            _0x3f1ea9['update'](_0x9b0fce),
            _0x3f1ea9['final']()
        ]);
    } catch (_0x5cd30f) {
        return null;
    }
}
function cleanJSON(_0x38d61b) {
    if (!_0x38d61b)
        return null;
    try {
        const _0x1b37e9 = _0x38d61b['toString']('utf-8')['split']('\x00');
        const _0x1abab9 = _0x1b37e9['findIndex'](_0x4b693b => _0x4b693b['includes']('{'));
        if (_0x1abab9 !== -0x1) {
            const _0x2a9b5b = _0x1b37e9['slice'](_0x1abab9)['join']('');
            return JSON['parse'](_0x2a9b5b['substring'](_0x2a9b5b['indexOf']('{'), _0x2a9b5b['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x2e8d6c) {
    }
    return null;
}
export function decryptSSC(_0x336ba9) {
    try {
        let _0x1061a4 = _0x336ba9['toString']('utf-8')['trim']();
        if (_0x1061a4['startsWith']('ssc://'))
            _0x1061a4 = _0x1061a4['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x312a62 = _0x1061a4['replace'](/\s/g, '');
        const _0x2e6766 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x312a62, 'hex'));
        const _0x774a6f = cleanJSON(_0x2e6766);
        if (!_0x774a6f)
            return null;
        let _0x247cd5 = _0x774a6f;
        if (_0x774a6f['c'] && typeof _0x774a6f['a'] === 'string') {
            const _0xa256d3 = Buffer['from'](_0x774a6f['a']['slice'](0x0, 0x10), 'hex');
            const _0x3ba274 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0xa256d3, Buffer['from'](_0x774a6f['c'], 'hex'));
            _0x247cd5 = cleanJSON(_0x3ba274) || _0x774a6f;
        }
        const _0x14b6b3 = {};
        for (const [_0x2dc890, _0x186c9f] of Object['entries'](_0x247cd5)) {
            const _0x4da6b4 = SSC_CONSTANTS['KEY_MAP'][_0x2dc890] || _0x2dc890;
            if (_0x4da6b4 === 'CONFIGS' && Array['isArray'](_0x186c9f)) {
                _0x14b6b3[_0x4da6b4] = _0x186c9f['map'](_0x1b6024 => {
                    const _0x416f66 = {};
                    const _0x38fac4 = _0x1b6024['b'] || 'DEFAULT';
                    const _0x2f54ab = _0x0_0x5adce7['createHash']('md5')['update'](_0x38fac4)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x57c967, _0x4ec427] of Object['entries'](_0x1b6024)) {
                        const _0x53b3be = SSC_CONSTANTS['KEY_MAP'][_0x57c967] || _0x57c967;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x57c967) && typeof _0x4ec427 === 'string') {
                            const _0x21ede1 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x2f54ab, Buffer['from'](_0x4ec427, 'hex'));
                            _0x416f66[_0x53b3be] = _0x21ede1 ? _0x21ede1['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x4ec427;
                        } else {
                            _0x416f66[_0x53b3be] = _0x4ec427;
                        }
                    }
                    return _0x416f66;
                });
            } else {
                _0x14b6b3[_0x4da6b4] = _0x186c9f;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x14b6b3, null, 0x4);
    } catch (_0x2be962) {
        return null;
    }
}