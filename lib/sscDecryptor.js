import _0x0_0x422c29 from 'crypto';
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
function chacha20Decrypt(_0x5e428d, _0x309ba9, _0x3c8036) {
    try {
        const _0x56bcd3 = _0x0_0x422c29['createDecipheriv']('chacha20', _0x5e428d, _0x309ba9);
        _0x56bcd3['setAutoPadding'](![]);
        const _0x2ba613 = Buffer['alloc'](0x40);
        _0x56bcd3['update'](_0x2ba613);
        return Buffer['concat']([
            _0x56bcd3['update'](_0x3c8036),
            _0x56bcd3['final']()
        ]);
    } catch (_0x2546b0) {
        return null;
    }
}
function cleanJSON(_0x52accf) {
    if (!_0x52accf)
        return null;
    try {
        const _0x4bc620 = _0x52accf['toString']('utf-8')['split']('\x00');
        const _0x3b8c20 = _0x4bc620['findIndex'](_0x3c2fa9 => _0x3c2fa9['includes']('{'));
        if (_0x3b8c20 !== -0x1) {
            const _0x39d97b = _0x4bc620['slice'](_0x3b8c20)['join']('');
            return JSON['parse'](_0x39d97b['substring'](_0x39d97b['indexOf']('{'), _0x39d97b['lastIndexOf']('}') + 0x1));
        }
    } catch (_0x4867cc) {
    }
    return null;
}
export function decryptSSC(_0x573be6) {
    try {
        let _0x5e1825 = _0x573be6['toString']('utf-8')['trim']();
        if (_0x5e1825['startsWith']('ssc://'))
            _0x5e1825 = _0x5e1825['slice'](0x6)['split']('')['reverse']()['join']('');
        const _0x1e64c8 = _0x5e1825['replace'](/\s/g, '');
        const _0x4ca1bb = chacha20Decrypt(SSC_CONSTANTS['L1_KEY'], SSC_CONSTANTS['FIXED_NONCE'], Buffer['from'](_0x1e64c8, 'hex'));
        const _0x5a3bef = cleanJSON(_0x4ca1bb);
        if (!_0x5a3bef)
            return null;
        let _0xc15822 = _0x5a3bef;
        if (_0x5a3bef['c'] && typeof _0x5a3bef['a'] === 'string') {
            const _0x77b855 = Buffer['from'](_0x5a3bef['a']['slice'](0x0, 0x10), 'hex');
            const _0x56ec2c = chacha20Decrypt(SSC_CONSTANTS['L2_KEY'], _0x77b855, Buffer['from'](_0x5a3bef['c'], 'hex'));
            _0xc15822 = cleanJSON(_0x56ec2c) || _0x5a3bef;
        }
        const _0x4614d5 = {};
        for (const [_0x1e550c, _0x2f57cb] of Object['entries'](_0xc15822)) {
            const _0x1e042e = SSC_CONSTANTS['KEY_MAP'][_0x1e550c] || _0x1e550c;
            if (_0x1e042e === 'CONFIGS' && Array['isArray'](_0x2f57cb)) {
                _0x4614d5[_0x1e042e] = _0x2f57cb['map'](_0x30d79f => {
                    const _0x4d97af = {};
                    const _0x47dddb = _0x30d79f['b'] || 'DEFAULT';
                    const _0x19b14a = _0x0_0x422c29['createHash']('md5')['update'](_0x47dddb)['digest']()['slice'](0x0, 0x8);
                    for (const [_0x41893d, _0x5967ff] of Object['entries'](_0x30d79f)) {
                        const _0x5044fd = SSC_CONSTANTS['KEY_MAP'][_0x41893d] || _0x41893d;
                        if ([
                                'g',
                                'h',
                                'l',
                                'o',
                                'p',
                                'v',
                                'x',
                                'w'
                            ]['includes'](_0x41893d) && typeof _0x5967ff === 'string') {
                            const _0x265e86 = chacha20Decrypt(SSC_CONSTANTS['L3_KEY'], _0x19b14a, Buffer['from'](_0x5967ff, 'hex'));
                            _0x4d97af[_0x5044fd] = _0x265e86 ? _0x265e86['toString']('utf-8')['replace'](/[\x00-\x1F]/g, '')['trim']() : _0x5967ff;
                        } else {
                            _0x4d97af[_0x5044fd] = _0x5967ff;
                        }
                    }
                    return _0x4d97af;
                });
            } else {
                _0x4614d5[_0x1e042e] = _0x2f57cb;
            }
        }
        return 'Labokingfreesurf\x20SSC\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify'](_0x4614d5, null, 0x4);
    } catch (_0x28084c) {
        return null;
    }
}