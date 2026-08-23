import _0x0_0x4326b6 from 'crypto';
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
function chacha20Decrypt(_0x1eef8d, _0x30f8b9, _0x1e85a6) {
    try {
        const _0x48b724 = _0x0_0x4326b6['createDecipheriv']('chacha20', _0x1eef8d, _0x30f8b9);
        _0x48b724['setAutoPadding'](![]);
        const _0x578ad2 = Buffer['alloc'](0x40);
        _0x48b724['update'](_0x578ad2);
        return Buffer['concat']([
            _0x48b724['update'](_0x1e85a6),
            _0x48b724['final']()
        ]);
    } catch (_0x7d2c09) {
        return null;
    }
}
function cleanJSON(_0x20efdc) {
    if (!_0x20efdc)
        return null;
    try {
        const _0x5cb5cd = _0x20efdc['toString']('utf-8')['split']('\x00');
        const _0x377e37 = _0x5cb5cd['findIndex'](_0x1d9c6f => _0x1d9c6f['includes']('{'));
        if (_0x377e37 !== -0x1) {
            const _0x489505 = _0x5cb5cd['slice'](_0x377e37)['join']('');
            return JSON['parse'](_0x489505['substring'](_0x489505['indexOf']('{'), _0x489505['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x317026) {
    }
    return null;
}
export function decryptSSC(_0x157996) {
    try {
        let _0x48037c = _0x157996['toString']('utf-8')['trim']();
        if (_0x48037c['startsWith']('ssc://'))
            _0x48037c = _0x48037c['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x25fb21 = _0x48037c['replace'](/\s/g, '');
        const _0x1d2753 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x25fb21, 'hex'));
        const _0x480f65 = cleanJSON(_0x1d2753);
        if (!_0x480f65)
            return null;
        let _0x552d66 = _0x480f65;
        if (_0x480f65['c'] && typeof _0x480f65['a'] === 'string') {
            const _0x288444 = Buffer['from'](_0x480f65['a']['slice'](0x0, 0x10), 'hex');
            const _0x283414 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x288444, Buffer['from'](_0x480f65['c'], 'hex'));
            _0x552d66 = cleanJSON(_0x283414) || _0x480f65;
        }
        const _0x5226b1 = {};
        for (const [_0x4ccea6, _0x3f56ea] of Object['entries'](_0x552d66)) {
            const _0x2f444a = SSC_CONSTANTS['KEY_MAP'][_0x4ccea6] || _0x4ccea6;
            if (_0x2f444a === 'CONFIGS' && Array['isArray'](_0x3f56ea)) {
                _0x5226b1[_0x2f444a] = _0x3f56ea['map'](_0x7fd967 => {
                    const _0x21008e = {};
                    const _0x423b67 = _0x7fd967['b'] || 'DEFAULT';
                    const _0x908e32 = _0x0_0x4326b6['createHash']('md5')['update'](_0x423b67)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x14d334, _0x38e2ef] of Object['entries'](_0x7fd967)) {
                        const _0x219e10 = SSC_CONSTANTS['KEY_MAP'][_0x14d334] || _0x14d334;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x14d334) && typeof _0x38e2ef === 'string') {
                            const _0x560fd5 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x908e32, Buffer['from'](_0x38e2ef, 'hex'));
                            _0x21008e[_0x219e10] = _0x560fd5 ? _0x560fd5['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x38e2ef;
                        } else {
                            _0x21008e[_0x219e10] = _0x38e2ef;
                        }
                    }
                    return _0x21008e;
                });
            } else {
                _0x5226b1[_0x2f444a] = _0x3f56ea;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x5226b1, null, 0x4);
    } catch (_0xbdfcd6) {
        return null;
    }
}