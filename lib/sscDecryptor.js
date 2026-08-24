import _0x0_0x11ea90 from 'crypto';
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
function chacha20Decrypt(_0x270d28, _0x7b0b89, _0x5bafea) {
    try {
        const _0x5586fa = _0x0_0x11ea90['createDecipheriv']('chacha20', _0x270d28, _0x7b0b89);
        _0x5586fa['setAutoPadding'](![]);
        const _0x119b37 = Buffer['alloc'](0x40);
        _0x5586fa['update'](_0x119b37);
        return Buffer['concat']([
            _0x5586fa['update'](_0x5bafea),
            _0x5586fa['final']()
        ]);
    } catch (_0x4ddbd9) {
        return null;
    }
}
function cleanJSON(_0x1b7864) {
    if (!_0x1b7864)
        return null;
    try {
        const _0x440efb = _0x1b7864['toString']('utf-8')['split']('\x00');
        const _0x22079e = _0x440efb['findIndex'](_0x542070 => _0x542070['includes']('{'));
        if (_0x22079e !== -0x1) {
            const _0x30aca5 = _0x440efb['slice'](_0x22079e)['join']('');
            return JSON['parse'](_0x30aca5['substring'](_0x30aca5['indexOf']('{'), _0x30aca5['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x1785d9) {
    }
    return null;
}
export function decryptSSC(_0x3e47d1) {
    try {
        let _0x51b71d = _0x3e47d1['toString']('utf-8')['trim']();
        if (_0x51b71d['startsWith']('ssc://'))
            _0x51b71d = _0x51b71d['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x4477ca = _0x51b71d['replace'](/\s/g, '');
        const _0x57ab00 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x4477ca, 'hex'));
        const _0x42275b = cleanJSON(_0x57ab00);
        if (!_0x42275b)
            return null;
        let _0x3a02f0 = _0x42275b;
        if (_0x42275b['c'] && typeof _0x42275b['a'] === 'string') {
            const _0x447f2b = Buffer['from'](_0x42275b['a']['slice'](0x0, 0x10), 'hex');
            const _0x52a741 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x447f2b, Buffer['from'](_0x42275b['c'], 'hex'));
            _0x3a02f0 = cleanJSON(_0x52a741) || _0x42275b;
        }
        const _0x19d153 = {};
        for (const [_0x214f29, _0x389e4a] of Object['entries'](_0x3a02f0)) {
            const _0xd18e22 = SSC_CONSTANTS['KEY_MAP'][_0x214f29] || _0x214f29;
            if (_0xd18e22 === 'CONFIGS' && Array['isArray'](_0x389e4a)) {
                _0x19d153[_0xd18e22] = _0x389e4a['map'](_0x32ee92 => {
                    const _0x4d25f7 = {};
                    const _0x48afaa = _0x32ee92['b'] || 'DEFAULT';
                    const _0x55c962 = _0x0_0x11ea90['createHash']('md5')['update'](_0x48afaa)['digest']()['slice'](0x0, 0x8);
                    for (const [_0xa68264, _0x230af1] of Object['entries'](_0x32ee92)) {
                        const _0x39617d = SSC_CONSTANTS['KEY_MAP'][_0xa68264] || _0xa68264;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0xa68264) && typeof _0x230af1 === 'string') {
                            const _0x2ea927 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x55c962, Buffer['from'](_0x230af1, 'hex'));
                            _0x4d25f7[_0x39617d] = _0x2ea927 ? _0x2ea927['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x230af1;
                        } else {
                            _0x4d25f7[_0x39617d] = _0x230af1;
                        }
                    }
                    return _0x4d25f7;
                });
            } else {
                _0x19d153[_0xd18e22] = _0x389e4a;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x19d153, null, 0x4);
    } catch (_0x215d03) {
        return null;
    }
}