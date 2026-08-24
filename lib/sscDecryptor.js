import _0x0_0x476ba5 from 'crypto';
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
function chacha20Decrypt(_0x3525cc, _0x11e952, _0x456695) {
    try {
        const _0x238190 = _0x0_0x476ba5['createDecipheriv']('chacha20', _0x3525cc, _0x11e952);
        _0x238190['setAutoPadding'](![]);
        const _0x275d70 = Buffer['alloc'](0x40);
        _0x238190['update'](_0x275d70);
        return Buffer['concat']([
            _0x238190['update'](_0x456695),
            _0x238190['final']()
        ]);
    } catch (_0x1b4778) {
        return null;
    }
}
function cleanJSON(_0x1d9f7e) {
    if (!_0x1d9f7e)
        return null;
    try {
        const _0x4ba570 = _0x1d9f7e['toString']('utf-8')['split']('\x00');
        const _0xc8bc3a = _0x4ba570['findIndex'](_0x377ca3 => _0x377ca3['includes']('{'));
        if (_0xc8bc3a !== -0x1) {
            const _0x41453f = _0x4ba570['slice'](_0xc8bc3a)['join']('');
            return JSON['parse'](_0x41453f['substring'](_0x41453f['indexOf']('{'), _0x41453f['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x5c078e) {
    }
    return null;
}
export function decryptSSC(_0x5286f3) {
    try {
        let _0x40aed4 = _0x5286f3['toString']('utf-8')['trim']();
        if (_0x40aed4['startsWith']('ssc://'))
            _0x40aed4 = _0x40aed4['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x3dd08b = _0x40aed4['replace'](/\s/g, '');
        const _0x14be04 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x3dd08b, 'hex'));
        const _0x35a38b = cleanJSON(_0x14be04);
        if (!_0x35a38b)
            return null;
        let _0x477b7d = _0x35a38b;
        if (_0x35a38b['c'] && typeof _0x35a38b['a'] === 'string') {
            const _0x393e60 = Buffer['from'](_0x35a38b['a']['slice'](0x0, 0x10), 'hex');
            const _0xc285a9 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x393e60, Buffer['from'](_0x35a38b['c'], 'hex'));
            _0x477b7d = cleanJSON(_0xc285a9) || _0x35a38b;
        }
        const _0x5ab6d6 = {};
        for (const [_0x21e401, _0x39c85e] of Object['entries'](_0x477b7d)) {
            const _0x45f644 = SSC_CONSTANTS['KEY_MAP'][_0x21e401] || _0x21e401;
            if (_0x45f644 === 'CONFIGS' && Array['isArray'](_0x39c85e)) {
                _0x5ab6d6[_0x45f644] = _0x39c85e['map'](_0x61e024 => {
                    const _0x2a31e4 = {};
                    const _0x5b5eb0 = _0x61e024['b'] || 'DEFAULT';
                    const _0x3d0e9a = _0x0_0x476ba5['createHash']('md5')['update'](_0x5b5eb0)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x2358e9, _0x5cc189] of Object['entries'](_0x61e024)) {
                        const _0x5d68c3 = SSC_CONSTANTS['KEY_MAP'][_0x2358e9] || _0x2358e9;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x2358e9) && typeof _0x5cc189 === 'string') {
                            const _0x2fdb18 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x3d0e9a, Buffer['from'](_0x5cc189, 'hex'));
                            _0x2a31e4[_0x5d68c3] = _0x2fdb18 ? _0x2fdb18['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x5cc189;
                        } else {
                            _0x2a31e4[_0x5d68c3] = _0x5cc189;
                        }
                    }
                    return _0x2a31e4;
                });
            } else {
                _0x5ab6d6[_0x45f644] = _0x39c85e;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x5ab6d6, null, 0x4);
    } catch (_0x328a87) {
        return null;
    }
}