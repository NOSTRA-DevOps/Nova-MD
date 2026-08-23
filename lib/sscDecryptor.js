import _0x0_0x5535f1 from 'crypto';
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
function chacha20Decrypt(_0x53356f, _0x376a87, _0x2d0a86) {
    try {
        const _0x5e5d51 = _0x0_0x5535f1['createDecipheriv']('chacha20', _0x53356f, _0x376a87);
        _0x5e5d51['setAutoPadding'](![]);
        const _0x5082a4 = Buffer['alloc'](0x40);
        _0x5e5d51['update'](_0x5082a4);
        return Buffer['concat']([
            _0x5e5d51['update'](_0x2d0a86),
            _0x5e5d51['final']()
        ]);
    } catch (_0xf52cdc) {
        return null;
    }
}
function cleanJSON(_0x120e09) {
    if (!_0x120e09)
        return null;
    try {
        const _0x135f89 = _0x120e09['toString']('utf-8')['split']('\x00');
        const _0xfa70e3 = _0x135f89['findIndex'](_0x2eb839 => _0x2eb839['includes']('{'));
        if (_0xfa70e3 !== -0x1) {
            const _0x369918 = _0x135f89['slice'](_0xfa70e3)['join']('');
            return JSON['parse'](_0x369918['substring'](_0x369918['indexOf']('{'), _0x369918['lastIndexOf']('}') + 0x1));
        }
    } catch (_0xf89a89) {
    }
    return null;
}
export function decryptSSC(_0xd2d241) {
    try {
        let _0x26201c = _0xd2d241['toString']('utf-8')['trim']();
        if (_0x26201c['startsWith']('ssc://'))
            _0x26201c = _0x26201c['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x21b629 = _0x26201c['replace'](/\s/g, '');
        const _0x5070e0 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x21b629, 'hex'));
        const _0x30917f = cleanJSON(_0x5070e0);
        if (!_0x30917f)
            return null;
        let _0x1bfbd1 = _0x30917f;
        if (_0x30917f['c'] && typeof _0x30917f['a'] === 'string') {
            const _0x1d15dc = Buffer['from'](_0x30917f['a']['slice'](0x0, 0x10), 'hex');
            const _0x59ddda = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x1d15dc, Buffer['from'](_0x30917f['c'], 'hex'));
            _0x1bfbd1 = cleanJSON(_0x59ddda) || _0x30917f;
        }
        const _0x141909 = {};
        for (const [_0x27b9fe, _0x413af0] of Object['entries'](_0x1bfbd1)) {
            const _0x210736 = SSC_CONSTANTS['KEY_MAP'][_0x27b9fe] || _0x27b9fe;
            if (_0x210736 === 'CONFIGS' && Array['isArray'](_0x413af0)) {
                _0x141909[_0x210736] = _0x413af0['map'](_0x30f068 => {
                    const _0x19ae97 = {};
                    const _0x3054b0 = _0x30f068['b'] || 'DEFAULT';
                    const _0x140ef9 = _0x0_0x5535f1['createHash']('md5')['update'](_0x3054b0)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x32b620, _0x5113e2] of Object['entries'](_0x30f068)) {
                        const _0xbef986 = SSC_CONSTANTS['KEY_MAP'][_0x32b620] || _0x32b620;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x32b620) && typeof _0x5113e2 === 'string') {
                            const _0x3dfac6 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x140ef9, Buffer['from'](_0x5113e2, 'hex'));
                            _0x19ae97[_0xbef986] = _0x3dfac6 ? _0x3dfac6['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x5113e2;
                        } else {
                            _0x19ae97[_0xbef986] = _0x5113e2;
                        }
                    }
                    return _0x19ae97;
                });
            } else {
                _0x141909[_0x210736] = _0x413af0;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x141909, null, 0x4);
    } catch (_0x4ab6b4) {
        return null;
    }
}