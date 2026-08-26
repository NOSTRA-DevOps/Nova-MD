import _0x0_0x763b6e from 'crypto';
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
function chacha20Decrypt(_0xa10be3, _0x5572fb, _0x396b39) {
    try {
        const _0x34cefd = _0x0_0x763b6e['createDecipheriv']('chacha20', _0xa10be3, _0x5572fb);
        _0x34cefd['setAutoPadding'](![]);
        const _0x168d05 = Buffer['alloc'](0x40);
        _0x34cefd['update'](_0x168d05);
        return Buffer['concat']([
            _0x34cefd['update'](_0x396b39),
            _0x34cefd['final']()
        ]);
    } catch (_0x31e8e5) {
        return null;
    }
}
function cleanJSON(_0x18ba11) {
    if (!_0x18ba11)
        return null;
    try {
        const _0x4fd27c = _0x18ba11['toString']('utf-8')['split']('\x00');
        const _0x46dc39 = _0x4fd27c['findIndex'](_0x52a868 => _0x52a868['includes']('{'));
        if (_0x46dc39 !== -0x1) {
            const _0x273a36 = _0x4fd27c['slice'](_0x46dc39)['join']('');
            return JSON['parse'](_0x273a36['substring'](_0x273a36['indexOf']('{'), _0x273a36['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x3f5fc1) {
    }
    return null;
}
export function decryptSSC(_0x5dabe5) {
    try {
        let _0x289a71 = _0x5dabe5['toString']('utf-8')['trim']();
        if (_0x289a71['startsWith']('ssc://'))
            _0x289a71 = _0x289a71['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x170816 = _0x289a71['replace'](/\s/g, '');
        const _0x45af8b = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x170816, 'hex'));
        const _0x32481b = cleanJSON(_0x45af8b);
        if (!_0x32481b)
            return null;
        let _0x5ab2ff = _0x32481b;
        if (_0x32481b['c'] && typeof _0x32481b['a'] === 'string') {
            const _0x2e25a2 = Buffer['from'](_0x32481b['a']['slice'](0x0, 0x10), 'hex');
            const _0x11c746 = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x2e25a2, Buffer['from'](_0x32481b['c'], 'hex'));
            _0x5ab2ff = cleanJSON(_0x11c746) || _0x32481b;
        }
        const _0x35871d = {};
        for (const [_0x3ce553, _0x362394] of Object['entries'](_0x5ab2ff)) {
            const _0x196141 = SSC_CONSTANTS['KEY_MAP'][_0x3ce553] || _0x3ce553;
            if (_0x196141 === 'CONFIGS' && Array['isArray'](_0x362394)) {
                _0x35871d[_0x196141] = _0x362394['map'](_0xeafbb => {
                    const _0x3c3ab9 = {};
                    const _0x4eb8d5 = _0xeafbb['b'] || 'DEFAULT';
                    const _0x5d6d8f = _0x0_0x763b6e['createHash']('md5')['update'](_0x4eb8d5)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x205728, _0x1a0d08] of Object['entries'](_0xeafbb)) {
                        const _0x23f93e = SSC_CONSTANTS['KEY_MAP'][_0x205728] || _0x205728;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x205728) && typeof _0x1a0d08 === 'string') {
                            const _0x5402b0 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x5d6d8f, Buffer['from'](_0x1a0d08, 'hex'));
                            _0x3c3ab9[_0x23f93e] = _0x5402b0 ? _0x5402b0['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x1a0d08;
                        } else {
                            _0x3c3ab9[_0x23f93e] = _0x1a0d08;
                        }
                    }
                    return _0x3c3ab9;
                });
            } else {
                _0x35871d[_0x196141] = _0x362394;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x35871d, null, 0x4);
    } catch (_0x3fa069) {
        return null;
    }
}