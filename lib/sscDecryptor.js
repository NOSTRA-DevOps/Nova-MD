import _0x0_0x5938dc from 'crypto';
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
function chacha20Decrypt(_0x43de32, _0x42bb8e, _0x44822e) {
    try {
        const _0x28c146 = _0x0_0x5938dc['createDecipheriv']('chacha20', _0x43de32, _0x42bb8e);
        _0x28c146['setAutoPadding'](![]);
        const _0x16b143 = Buffer['alloc'](0x40);
        _0x28c146['update'](_0x16b143);
        return Buffer['concat']([
            _0x28c146['update'](_0x44822e),
            _0x28c146['final']()
        ]);
    } catch (_0x32bfca) {
        return null;
    }
}
function cleanJSON(_0x5a3c31) {
    if (!_0x5a3c31)
        return null;
    try {
        const _0x2ca249 = _0x5a3c31['toString']('utf-8')['split']('\x00');
        const _0x4e2e39 = _0x2ca249['findIndex'](_0x29b7bb => _0x29b7bb['includes']('{'));
        if (_0x4e2e39 !== -0x1) {
            const _0x3296d2 = _0x2ca249['slice'](_0x4e2e39)['join']('');
            return JSON['parse'](_0x3296d2['substring'](_0x3296d2['indexOf']('{'), _0x3296d2['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x3ff6b9) {
    }
    return null;
}
export function decryptSSC(_0x474dc8) {
    try {
        let _0x1ac62e = _0x474dc8['toString']('utf-8')['trim']();
        if (_0x1ac62e['startsWith']('ssc://'))
            _0x1ac62e = _0x1ac62e['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x1a90f2 = _0x1ac62e['replace'](/\s/g, '');
        const _0x442adc = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x1a90f2, 'hex'));
        const _0x2be005 = cleanJSON(_0x442adc);
        if (!_0x2be005)
            return null;
        let _0x32dce8 = _0x2be005;
        if (_0x2be005['c'] && typeof _0x2be005['a'] === 'string') {
            const _0x1f2c69 = Buffer['from'](_0x2be005['a']['slice'](0x0, 0x10), 'hex');
            const _0xbefa4a = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x1f2c69, Buffer['from'](_0x2be005['c'], 'hex'));
            _0x32dce8 = cleanJSON(_0xbefa4a) || _0x2be005;
        }
        const _0x111b53 = {};
        for (const [_0x225e1a, _0x4d1cfd] of Object['entries'](_0x32dce8)) {
            const _0x419bbf = SSC_CONSTANTS['KEY_MAP'][_0x225e1a] || _0x225e1a;
            if (_0x419bbf === 'CONFIGS' && Array['isArray'](_0x4d1cfd)) {
                _0x111b53[_0x419bbf] = _0x4d1cfd['map'](_0x5423d9 => {
                    const _0x5e2b1e = {};
                    const _0x2add33 = _0x5423d9['b'] || 'DEFAULT';
                    const _0x19cd12 = _0x0_0x5938dc['createHash']('md5')['update'](_0x2add33)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x41ebb2, _0x572d62] of Object['entries'](_0x5423d9)) {
                        const _0x4fd614 = SSC_CONSTANTS['KEY_MAP'][_0x41ebb2] || _0x41ebb2;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x41ebb2) && typeof _0x572d62 === 'string') {
                            const _0x409c67 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x19cd12, Buffer['from'](_0x572d62, 'hex'));
                            _0x5e2b1e[_0x4fd614] = _0x409c67 ? _0x409c67['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x572d62;
                        } else {
                            _0x5e2b1e[_0x4fd614] = _0x572d62;
                        }
                    }
                    return _0x5e2b1e;
                });
            } else {
                _0x111b53[_0x419bbf] = _0x4d1cfd;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x111b53, null, 0x4);
    } catch (_0x3f3984) {
        return null;
    }
}