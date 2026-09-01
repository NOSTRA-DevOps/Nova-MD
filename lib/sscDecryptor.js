import _0x0_0x331e8e from 'crypto';
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
function chacha20Decrypt(_0x4cfac2, _0x101328, _0x4be3de) {
    try {
        const _0x4a541f = _0x0_0x331e8e['createDecipheriv']('chacha20', _0x4cfac2, _0x101328);
        _0x4a541f['setAutoPadding'](![]);
        const _0x70d599 = Buffer['alloc'](0x40);
        _0x4a541f['update'](_0x70d599);
        return Buffer['concat']([
            _0x4a541f['update'](_0x4be3de),
            _0x4a541f['final']()
        ]);
    } catch (_0xe471bb) {
        return null;
    }
}
function cleanJSON(_0x570ea3) {
    if (!_0x570ea3)
        return null;
    try {
        const _0x5ea2b8 = _0x570ea3['toString']('utf-8')['split']('\x00');
        const _0x5b155c = _0x5ea2b8['findIndex'](_0x24177e => _0x24177e['includes']('{'));
        if (_0x5b155c !== -0x1) {
            const _0x57a45c = _0x5ea2b8['slice'](_0x5b155c)['join']('');
            return JSON['parse'](_0x57a45c['substring'](_0x57a45c['indexOf']('{'), _0x57a45c['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x157b02) {
    }
    return null;
}
export function decryptSSC(_0x348508) {
    try {
        let _0x2b2a2f = _0x348508['toString']('utf-8')['trim']();
        if (_0x2b2a2f['startsWith']('ssc://'))
            _0x2b2a2f = _0x2b2a2f['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x12a773 = _0x2b2a2f['replace'](/\s/g, '');
        const _0x4add50 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x12a773, 'hex'));
        const _0x29e2f4 = cleanJSON(_0x4add50);
        if (!_0x29e2f4)
            return null;
        let _0x5612ee = _0x29e2f4;
        if (_0x29e2f4['c'] && typeof _0x29e2f4['a'] === 'string') {
            const _0x57daf9 = Buffer['from'](_0x29e2f4['a']['slice'](0x0, 0x10), 'hex');
            const _0x9a2c10 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x57daf9, Buffer['from'](_0x29e2f4['c'], 'hex'));
            _0x5612ee = cleanJSON(_0x9a2c10) || _0x29e2f4;
        }
        const _0x59ef4d = {};
        for (const [_0x4fda41, _0x15aa67] of Object['entries'](_0x5612ee)) {
            const _0x446776 = SSC_CONSTANTS['KEY_MAP'][_0x4fda41] || _0x4fda41;
            if (_0x446776 === 'CONFIGS' && Array['isArray'](_0x15aa67)) {
                _0x59ef4d[_0x446776] = _0x15aa67['map'](_0x36c787 => {
                    const _0xe9f455 = {};
                    const _0x51daf2 = _0x36c787['b'] || 'DEFAULT';
                    const _0x266fbc = _0x0_0x331e8e['createHash']('md5')['update'](_0x51daf2)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x4cca60, _0x5e997f] of Object['entries'](_0x36c787)) {
                        const _0x45d05e = SSC_CONSTANTS['KEY_MAP'][_0x4cca60] || _0x4cca60;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x4cca60) && typeof _0x5e997f === 'string') {
                            const _0x2073f0 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x266fbc, Buffer['from'](_0x5e997f, 'hex'));
                            _0xe9f455[_0x45d05e] = _0x2073f0 ? _0x2073f0['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x5e997f;
                        } else {
                            _0xe9f455[_0x45d05e] = _0x5e997f;
                        }
                    }
                    return _0xe9f455;
                });
            } else {
                _0x59ef4d[_0x446776] = _0x15aa67;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x59ef4d, null, 0x4);
    } catch (_0x1cf535) {
        return null;
    }
}