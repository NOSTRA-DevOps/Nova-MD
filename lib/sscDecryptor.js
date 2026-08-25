import _0x0_0x288574 from 'crypto';
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
function chacha20Decrypt(_0x59243f, _0x1bd4eb, _0x383e90) {
    try {
        const _0x495ade = _0x0_0x288574['createDecipheriv']('chacha20', _0x59243f, _0x1bd4eb);
        _0x495ade['setAutoPadding'](![]);
        const _0x3e0d0f = Buffer['alloc'](0x40);
        _0x495ade['update'](_0x3e0d0f);
        return Buffer['concat']([
            _0x495ade['update'](_0x383e90),
            _0x495ade['final']()
        ]);
    } catch (_0x5eb9fc) {
        return null;
    }
}
function cleanJSON(_0x1be75a) {
    if (!_0x1be75a)
        return null;
    try {
        const _0x44ae33 = _0x1be75a['toString']('utf-8')['split']('\x00');
        const _0x25130e = _0x44ae33['findIndex'](_0x5f5abf => _0x5f5abf['includes']('{'));
        if (_0x25130e !== -0x1) {
            const _0x2efae0 = _0x44ae33['slice'](_0x25130e)['join']('');
            return JSON['parse'](_0x2efae0['substring'](_0x2efae0['indexOf']('{'), _0x2efae0['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x535c87) {
    }
    return null;
}
export function decryptSSC(_0x573693) {
    try {
        let _0x508adb = _0x573693['toString']('utf-8')['trim']();
        if (_0x508adb['startsWith']('ssc://'))
            _0x508adb = _0x508adb['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x5e9b84 = _0x508adb['replace'](/\s/g, '');
        const _0x3ea5e5 = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x5e9b84, 'hex'));
        const _0x40bcbb = cleanJSON(_0x3ea5e5);
        if (!_0x40bcbb)
            return null;
        let _0x59e8bc = _0x40bcbb;
        if (_0x40bcbb['c'] && typeof _0x40bcbb['a'] === 'string') {
            const _0x213045 = Buffer['from'](_0x40bcbb['a']['slice'](0x0, 0x10), 'hex');
            const _0x10961f = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x213045, Buffer['from'](_0x40bcbb['c'], 'hex'));
            _0x59e8bc = cleanJSON(_0x10961f) || _0x40bcbb;
        }
        const _0x5382ab = {};
        for (const [_0x32720f, _0x5022bf] of Object['entries'](_0x59e8bc)) {
            const _0x1411b6 = SSC_CONSTANTS['KEY_MAP'][_0x32720f] || _0x32720f;
            if (_0x1411b6 === 'CONFIGS' && Array['isArray'](_0x5022bf)) {
                _0x5382ab[_0x1411b6] = _0x5022bf['map'](_0x2b7d86 => {
                    const _0x5b08df = {};
                    const _0xf99ad5 = _0x2b7d86['b'] || 'DEFAULT';
                    const _0x5ce466 = _0x0_0x288574['createHash']('md5')['update'](_0xf99ad5)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x1cee18, _0x2663f6] of Object['entries'](_0x2b7d86)) {
                        const _0x342df3 = SSC_CONSTANTS['KEY_MAP'][_0x1cee18] || _0x1cee18;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x1cee18) && typeof _0x2663f6 === 'string') {
                            const _0x2c2154 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x5ce466, Buffer['from'](_0x2663f6, 'hex'));
                            _0x5b08df[_0x342df3] = _0x2c2154 ? _0x2c2154['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x2663f6;
                        } else {
                            _0x5b08df[_0x342df3] = _0x2663f6;
                        }
                    }
                    return _0x5b08df;
                });
            } else {
                _0x5382ab[_0x1411b6] = _0x5022bf;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x5382ab, null, 0x4);
    } catch (_0x30fa0f) {
        return null;
    }
}