import _0x0_0x3ca4e5 from 'crypto';
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
function chacha20Decrypt(_0x3cfaec, _0x415160, _0x813227) {
    try {
        const _0x1a254e = _0x0_0x3ca4e5['createDecipheriv']('chacha20', _0x3cfaec, _0x415160);
        _0x1a254e['setAutoPadding'](![]);
        const _0x21c8a7 = Buffer['alloc'](0x40);
        _0x1a254e['update'](_0x21c8a7);
        return Buffer['concat']([
            _0x1a254e['update'](_0x813227),
            _0x1a254e['final']()
        ]);
    } catch (_0x37440d) {
        return null;
    }
}
function cleanJSON(_0x11cb0d) {
    if (!_0x11cb0d)
        return null;
    try {
        const _0x237090 = _0x11cb0d['toString']('utf-8')['split']('\x00');
        const _0x3924e3 = _0x237090['findIndex'](_0x548f85 => _0x548f85['includes']('{'));
        if (_0x3924e3 !== -0x1) {
            const _0x599054 = _0x237090['slice'](_0x3924e3)['join']('');
            return JSON['parse'](_0x599054['substring'](_0x599054['indexOf']('{'), _0x599054['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x83ba97) {
    }
    return null;
}
export function decryptSSC(_0x5130f8) {
    try {
        let _0x4bdb12 = _0x5130f8['toString']('utf-8')['trim']();
        if (_0x4bdb12['startsWith']('ssc://'))
            _0x4bdb12 = _0x4bdb12['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x4a3097 = _0x4bdb12['replace'](/\s/g, '');
        const _0x3eca90 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x4a3097, 'hex'));
        const _0x16c357 = cleanJSON(_0x3eca90);
        if (!_0x16c357)
            return null;
        let _0x53a684 = _0x16c357;
        if (_0x16c357['c'] && typeof _0x16c357['a'] === 'string') {
            const _0x435304 = Buffer['from'](_0x16c357['a']['slice'](0x0, 0x10), 'hex');
            const _0x65eac5 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x435304, Buffer['from'](_0x16c357['c'], 'hex'));
            _0x53a684 = cleanJSON(_0x65eac5) || _0x16c357;
        }
        const _0x530438 = {};
        for (const [_0x6637bb, _0x155a97] of Object['entries'](_0x53a684)) {
            const _0x4afea4 = SSC_CONSTANTS['KEY_MAP'][_0x6637bb] || _0x6637bb;
            if (_0x4afea4 === 'CONFIGS' && Array['isArray'](_0x155a97)) {
                _0x530438[_0x4afea4] = _0x155a97['map'](_0x583753 => {
                    const _0x54d6df = {};
                    const _0x5227ac = _0x583753['b'] || 'DEFAULT';
                    const _0x542226 = _0x0_0x3ca4e5['createHash']('md5')['update'](_0x5227ac)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x3789cd, _0x4e29f5] of Object['entries'](_0x583753)) {
                        const _0x5d36eb = SSC_CONSTANTS['KEY_MAP'][_0x3789cd] || _0x3789cd;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x3789cd) && typeof _0x4e29f5 === 'string') {
                            const _0x3eef53 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x542226, Buffer['from'](_0x4e29f5, 'hex'));
                            _0x54d6df[_0x5d36eb] = _0x3eef53 ? _0x3eef53['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x4e29f5;
                        } else {
                            _0x54d6df[_0x5d36eb] = _0x4e29f5;
                        }
                    }
                    return _0x54d6df;
                });
            } else {
                _0x530438[_0x4afea4] = _0x155a97;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x530438, null, 0x4);
    } catch (_0x5a4f7b) {
        return null;
    }
}