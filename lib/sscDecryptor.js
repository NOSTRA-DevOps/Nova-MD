import _0x0_0x5d65bb from 'crypto';
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
function chacha20Decrypt(_0x646e16, _0x15e353, _0xe819c9) {
    try {
        const _0x2a5a22 = _0x0_0x5d65bb['createDecipheriv']('chacha20', _0x646e16, _0x15e353);
        _0x2a5a22['setAutoPadding'](![]);
        const _0x37f08c = Buffer['alloc'](0x40);
        _0x2a5a22['update'](_0x37f08c);
        return Buffer['concat']([
            _0x2a5a22['update'](_0xe819c9),
            _0x2a5a22['final']()
        ]);
    } catch (_0x380ccd) {
        return null;
    }
}
function cleanJSON(_0x513598) {
    if (!_0x513598)
        return null;
    try {
        const _0xb55652 = _0x513598['toString']('utf-8')['split']('\x00');
        const _0x2be248 = _0xb55652['findIndex'](_0x532139 => _0x532139['includes']('{'));
        if (_0x2be248 !== -0x1) {
            const _0x462b2f = _0xb55652['slice'](_0x2be248)['join']('');
            return JSON['parse'](_0x462b2f['substring'](_0x462b2f['indexOf']('{'), _0x462b2f['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x1ad6dc) {
    }
    return null;
}
export function decryptSSC(_0xc04015) {
    try {
        let _0x9e4988 = _0xc04015['toString']('utf-8')['trim']();
        if (_0x9e4988['startsWith']('ssc://'))
            _0x9e4988 = _0x9e4988['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x197fa8 = _0x9e4988['replace'](/\s/g, '');
        const _0xd0ac8f = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x197fa8, 'hex'));
        const _0x4d164d = cleanJSON(_0xd0ac8f);
        if (!_0x4d164d)
            return null;
        let _0xcf2f5c = _0x4d164d;
        if (_0x4d164d['c'] && typeof _0x4d164d['a'] === 'string') {
            const _0x43dc05 = Buffer['from'](_0x4d164d['a']['slice'](0x0, 0x10), 'hex');
            const _0x57da58 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x43dc05, Buffer['from'](_0x4d164d['c'], 'hex'));
            _0xcf2f5c = cleanJSON(_0x57da58) || _0x4d164d;
        }
        const _0x249035 = {};
        for (const [_0x55cd52, _0x18a6e5] of Object['entries'](_0xcf2f5c)) {
            const _0x3b3c2b = SSC_CONSTANTS['KEY_MAP'][_0x55cd52] || _0x55cd52;
            if (_0x3b3c2b === 'CONFIGS' && Array['isArray'](_0x18a6e5)) {
                _0x249035[_0x3b3c2b] = _0x18a6e5['map'](_0x46d048 => {
                    const _0x137050 = {};
                    const _0x14e38f = _0x46d048['b'] || 'DEFAULT';
                    const _0x19cdd1 = _0x0_0x5d65bb['createHash']('md5')['update'](_0x14e38f)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x56a846, _0x109001] of Object['entries'](_0x46d048)) {
                        const _0x2d9ac4 = SSC_CONSTANTS['KEY_MAP'][_0x56a846] || _0x56a846;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x56a846) && typeof _0x109001 === 'string') {
                            const _0x44756d = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x19cdd1, Buffer['from'](_0x109001, 'hex'));
                            _0x137050[_0x2d9ac4] = _0x44756d ? _0x44756d['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x109001;
                        } else {
                            _0x137050[_0x2d9ac4] = _0x109001;
                        }
                    }
                    return _0x137050;
                });
            } else {
                _0x249035[_0x3b3c2b] = _0x18a6e5;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x249035, null, 0x4);
    } catch (_0x4f6bed) {
        return null;
    }
}