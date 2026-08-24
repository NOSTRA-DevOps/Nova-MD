import _0x0_0x230a65 from 'crypto';
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
function chacha20Decrypt(_0x41d59d, _0x2ccdd0, _0x512363) {
    try {
        const _0x59856e = _0x0_0x230a65['createDecipheriv']('chacha20', _0x41d59d, _0x2ccdd0);
        _0x59856e['setAutoPadding'](![]);
        const _0x53903f = Buffer['alloc'](0x40);
        _0x59856e['update'](_0x53903f);
        return Buffer['concat']([
            _0x59856e['update'](_0x512363),
            _0x59856e['final']()
        ]);
    } catch (_0x56da13) {
        return null;
    }
}
function cleanJSON(_0x378607) {
    if (!_0x378607)
        return null;
    try {
        const _0x48b096 = _0x378607['toString']('utf-8')['split']('\x00');
        const _0x5ee17f = _0x48b096['findIndex'](_0x32e7d2 => _0x32e7d2['includes']('{'));
        if (_0x5ee17f !== -0x1) {
            const _0x3970e0 = _0x48b096['slice'](_0x5ee17f)['join']('');
            return JSON['parse'](_0x3970e0['substring'](_0x3970e0['indexOf']('{'), _0x3970e0['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x540148) {
    }
    return null;
}
export function decryptSSC(_0x35fc03) {
    try {
        let _0x241f78 = _0x35fc03['toString']('utf-8')['trim']();
        if (_0x241f78['startsWith']('ssc://'))
            _0x241f78 = _0x241f78['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x587f16 = _0x241f78['replace'](/\s/g, '');
        const _0x2a5ad7 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x587f16, 'hex'));
        const _0x527e2c = cleanJSON(_0x2a5ad7);
        if (!_0x527e2c)
            return null;
        let _0x32a1e5 = _0x527e2c;
        if (_0x527e2c['c'] && typeof _0x527e2c['a'] === 'string') {
            const _0x1b6de0 = Buffer['from'](_0x527e2c['a']['slice'](0x0, 0x10), 'hex');
            const _0x19c3ad = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x1b6de0, Buffer['from'](_0x527e2c['c'], 'hex'));
            _0x32a1e5 = cleanJSON(_0x19c3ad) || _0x527e2c;
        }
        const _0x3d6ef3 = {};
        for (const [_0x977695, _0x14a00c] of Object['entries'](_0x32a1e5)) {
            const _0x5ca4f4 = SSC_CONSTANTS['KEY_MAP'][_0x977695] || _0x977695;
            if (_0x5ca4f4 === 'CONFIGS' && Array['isArray'](_0x14a00c)) {
                _0x3d6ef3[_0x5ca4f4] = _0x14a00c['map'](_0xeba98e => {
                    const _0x4fb021 = {};
                    const _0x4937be = _0xeba98e['b'] || 'DEFAULT';
                    const _0x50e682 = _0x0_0x230a65['createHash']('md5')['update'](_0x4937be)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x551fcf, _0xf0749d] of Object['entries'](_0xeba98e)) {
                        const _0xd61323 = SSC_CONSTANTS['KEY_MAP'][_0x551fcf] || _0x551fcf;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x551fcf) && typeof _0xf0749d === 'string') {
                            const _0x2f1fb9 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x50e682, Buffer['from'](_0xf0749d, 'hex'));
                            _0x4fb021[_0xd61323] = _0x2f1fb9 ? _0x2f1fb9['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0xf0749d;
                        } else {
                            _0x4fb021[_0xd61323] = _0xf0749d;
                        }
                    }
                    return _0x4fb021;
                });
            } else {
                _0x3d6ef3[_0x5ca4f4] = _0x14a00c;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x3d6ef3, null, 0x4);
    } catch (_0x59a667) {
        return null;
    }
}