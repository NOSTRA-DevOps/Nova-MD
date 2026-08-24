import _0x0_0x5511e4 from 'crypto';
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
function chacha20Decrypt(_0x32bcd8, _0x1afeaa, _0x6a0ed6) {
    try {
        const _0x2ef8d1 = _0x0_0x5511e4['createDecipheriv']('chacha20', _0x32bcd8, _0x1afeaa);
        _0x2ef8d1['setAutoPadding'](![]);
        const _0x2bf825 = Buffer['alloc'](0x40);
        _0x2ef8d1['update'](_0x2bf825);
        return Buffer['concat']([
            _0x2ef8d1['update'](_0x6a0ed6),
            _0x2ef8d1['final']()
        ]);
    } catch (_0x4fc9d6) {
        return null;
    }
}
function cleanJSON(_0x2ec899) {
    if (!_0x2ec899)
        return null;
    try {
        const _0x1d8b8a = _0x2ec899['toString']('utf-8')['split']('\x00');
        const _0x1513bc = _0x1d8b8a['findIndex'](_0x31db12 => _0x31db12['includes']('{'));
        if (_0x1513bc !== -0x1) {
            const _0x2802e3 = _0x1d8b8a['slice'](_0x1513bc)['join']('');
            return JSON['parse'](_0x2802e3['substring'](_0x2802e3['indexOf']('{'), _0x2802e3['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x551452) {
    }
    return null;
}
export function decryptSSC(_0x24acce) {
    try {
        let _0x5b94ca = _0x24acce['toString']('utf-8')['trim']();
        if (_0x5b94ca['startsWith']('ssc://'))
            _0x5b94ca = _0x5b94ca['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x33df3e = _0x5b94ca['replace'](/\s/g, '');
        const _0x391b78 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x33df3e, 'hex'));
        const _0x4b8426 = cleanJSON(_0x391b78);
        if (!_0x4b8426)
            return null;
        let _0x584e73 = _0x4b8426;
        if (_0x4b8426['c'] && typeof _0x4b8426['a'] === 'string') {
            const _0xf05cf8 = Buffer['from'](_0x4b8426['a']['slice'](0x0, 0x10), 'hex');
            const _0x133605 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0xf05cf8, Buffer['from'](_0x4b8426['c'], 'hex'));
            _0x584e73 = cleanJSON(_0x133605) || _0x4b8426;
        }
        const _0x638b3d = {};
        for (const [_0x343dd9, _0x33ee88] of Object['entries'](_0x584e73)) {
            const _0x17de41 = SSC_CONSTANTS['KEY_MAP'][_0x343dd9] || _0x343dd9;
            if (_0x17de41 === 'CONFIGS' && Array['isArray'](_0x33ee88)) {
                _0x638b3d[_0x17de41] = _0x33ee88['map'](_0x2b38f3 => {
                    const _0x38da33 = {};
                    const _0x3bf43d = _0x2b38f3['b'] || 'DEFAULT';
                    const _0x4d4281 = _0x0_0x5511e4['createHash']('md5')['update'](_0x3bf43d)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x540f86, _0x26e984] of Object['entries'](_0x2b38f3)) {
                        const _0xc6bb1a = SSC_CONSTANTS['KEY_MAP'][_0x540f86] || _0x540f86;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x540f86) && typeof _0x26e984 === 'string') {
                            const _0x430940 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x4d4281, Buffer['from'](_0x26e984, 'hex'));
                            _0x38da33[_0xc6bb1a] = _0x430940 ? _0x430940['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x26e984;
                        } else {
                            _0x38da33[_0xc6bb1a] = _0x26e984;
                        }
                    }
                    return _0x38da33;
                });
            } else {
                _0x638b3d[_0x17de41] = _0x33ee88;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x638b3d, null, 0x4);
    } catch (_0x574bd0) {
        return null;
    }
}