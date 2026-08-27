import _0x0_0x1fcece from 'crypto';
const HC_CONSTANTS = {
    'CHACHA_KEYS': [
        Buffer['from']('2be4342943c6f91ff58987f41a1aafd179eeb4e053f5cea55b11d6a7db58bd7d', 'hex'),
        Buffer['from']('3380aa278b744ba5b529a7f32fa803e48749280dae378345d9b526cf1dbce372', 'hex'),
        Buffer['from']('cea9305c95168b162a335b137c61983b8df54e6375da01136547890f14c5fac3', 'hex'),
        Buffer['from']('4beeace0e42bae8f29470cf40cf2dfacd5f4e1f751912bf52e803c8c85792193', 'hex'),
        Buffer['from']('f8e5f6ebea90558eb32229da24fd0fb7d813091dafe89bb2954fda33b4c60f63', 'hex'),
        Buffer['from']('81342f558a6273bac4548d473f54c4ffc7c41747dee81369acab9c787d41ab9c', 'hex'),
        Buffer['from']('45635e6fc70486e2fd10d3c2b4780f02d0b4c5f4aa929fc54f86bb8fa4417944', 'hex'),
        Buffer['from']('3d632a251c9820f2baf83e15498d27548fc67921cb437f8ce48505989378adea', 'hex')
    ],
    'RST_KEYS': [
        'JN1k3YHc2.6_v235',
        'JN1k3YHc_2.7_v71',
        'JN1k3YHc2.7.ps69',
        'JN1k3YHc2.7.6950',
        'Jn1K3yHc2.8.ps08',
        'Jn1K3yHc2.9.ps6c',
        'Zk:L7>WKaiK*s9>D',
        '!<f!&WIlM**R.B0X',
        'b4a5opinx2uloec6'
    ],
    'STATIC_NONCE': Buffer['alloc'](0x8, 0xdb),
    'BRAILLE_MAP': {
        '⠁': 'a',
        '⠃': 'b',
        '⠉': 'c',
        '⠙': 'd',
        '⠑': 'e',
        '⠋': 'f',
        '⠛': 'g',
        '⠓': 'h',
        '⠊': 'i',
        '⠚': 'j',
        '⠅': 'k',
        '⠇': 'l',
        '⠍': 'm',
        '⠝': 'n',
        '⠕': 'o',
        '⠏': 'p',
        '⠟': 'q',
        '⠗': 'r',
        '⠎': 's',
        '⠞': 't',
        '⠥': 'u',
        '⠧': 'v',
        '⠺': 'w',
        '⠭': 'x',
        '⠽': 'y',
        '⠵': 'z',
        '⠼⠁': '1',
        '⠼⠃': '2',
        '⠼⠉': '3',
        '⠼⠙': '4',
        '⠼⠑': '5',
        '⠼⠋': '6',
        '⠼⠛': '7',
        '⠼⠓': '8',
        '⠼⠊': '9',
        '⠼⠚': '0'
    },
    'TOKEN_MAP': {
        0x0: 'payload',
        0x1: 'proxy',
        0x2: 'lockAllConfig',
        0x3: 'blockedByRoot',
        0x4: 'expiryTime',
        0x5: 'noteEnabled',
        0x6: 'notes',
        0x7: 'sshField',
        0x8: 'mobileDataAndLockProvider',
        0x9: 'unlockUserAndPass',
        0xa: 'ovpnConfig',
        0xb: 'ovpnUserAndPass',
        0xc: 'sni',
        0xd: 'unlockUserAndPass2',
        0xf: 'blockedByHwid',
        0x10: 'cloudconfig',
        0x11: 'psiphon',
        0x12: 'name',
        0x13: 'blockArea',
        0x14: 'connectionMode',
        0x15: 'blockedByPassword',
        0x17: 'extraSniffer',
        0x19: 'v2rayEnabled',
        0x1a: 'v2rayConfig',
        0x1b: 'version',
        0x1c: 'slowdnsEnabled',
        0x1d: 'slowdnsServer',
        0x1e: 'slowdnsPublickey',
        0x1f: 'dnsResolver'
    }
};
function chacha20Decrypt(_0x1276f3, _0x29105e, _0x552e54) {
    try {
        const _0x343220 = _0x0_0x1fcece['createDecipheriv']('chacha20', _0x1276f3, _0x29105e);
        _0x343220['setAutoPadding'](![]);
        const _0x1917a0 = Buffer['alloc'](0x40);
        _0x343220['update'](_0x1917a0);
        return Buffer['concat']([
            _0x343220['update'](_0x552e54),
            _0x343220['final']()
        ]);
    } catch (_0x2703d2) {
        return null;
    }
}
function translateBrailleToAscii(_0x3b2714) {
    if (!_0x3b2714)
        return _0x3b2714;
    let _0x44b201 = _0x3b2714;
    const _0x26e59b = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x2c8717 => _0x2c8717['startsWith']('⠼'));
    for (const _0x4116f8 of _0x26e59b) {
        _0x44b201 = _0x44b201['split'](_0x4116f8)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x4116f8]);
    }
    for (const [_0x3a7a4f, _0x2e5400] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x3a7a4f['startsWith']('⠼')) {
            _0x44b201 = _0x44b201['split'](_0x3a7a4f)['join'](_0x2e5400);
        }
    }
    return _0x44b201;
}
function jklDecrypt(_0x33b074) {
    if (!_0x33b074)
        return _0x33b074;
    try {
        let _0x5d740f = _0x33b074;
        while (_0x5d740f['length'] % 0x4 !== 0x0)
            _0x5d740f += '=';
        const _0xea8c9d = Buffer['from'](_0x5d740f, 'base64');
        const _0x387133 = Buffer['alloc'](_0xea8c9d['length']);
        const _0x4f82cf = Buffer['from']([
            0xd5,
            0xd4,
            0xd3,
            0xd2,
            0xd1,
            0xd0,
            0xcf,
            0xce,
            0xcd,
            0xcc,
            0xbd,
            0xbc,
            0xbb,
            0xba,
            0xb9,
            0xb8,
            0xb7,
            0xb6,
            0xb5,
            0xb4
        ]);
        for (let _0x4a0d27 = 0x0; _0x4a0d27 < _0xea8c9d['length']; _0x4a0d27++) {
            const _0x3b7538 = _0x4f82cf[_0x4a0d27 % 0x14];
            _0x387133[_0x4a0d27] = ((_0xea8c9d[_0x4a0d27] ^ 0xff) & 0xca | _0xea8c9d[_0x4a0d27] & 0x35) ^ ((_0x3b7538 ^ 0xff) & 0xca | _0x3b7538 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x387133['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x5cecba) {
        return _0x33b074;
    }
}
export function decryptHTTPCustom(_0x12d019) {
    try {
        const _0x5845de = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x29b67a = Buffer['alloc'](_0x12d019['length']);
        for (let _0x4d8a74 = 0x0; _0x4d8a74 < _0x12d019['length']; _0x4d8a74++)
            _0x29b67a[_0x4d8a74] = _0x12d019[_0x4d8a74] ^ _0x5845de[_0x4d8a74 % _0x5845de['length']];
        const _0x1e5308 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x29b67a['toString']('utf-8'), 'hex'));
        const _0xce02fb = JSON['parse'](_0x1e5308['toString']('utf-8'));
        const _0x8f49c2 = !!_0xce02fb['cfg'];
        const _0x163379 = _0xce02fb['cfg'] || {};
        const _0x217114 = _0xce02fb['xy'] || _0x163379['content'];
        const _0x580c48 = _0xce02fb['a'] || _0x163379['hwid'] || '';
        const _0x31e467 = _0xce02fb['p'] || _0x163379['password'] || '';
        const _0x12ba96 = _0xce02fb['b'] || _0x163379['area'] || '';
        const _0x278242 = _0x0_0x1fcece['createHash']('md5')['update'](_0x580c48 + _0x31e467 + _0x12ba96)['digest']();
        const _0x432c0a = Buffer['alloc'](0x8);
        for (let _0x45991d = 0x0; _0x45991d < 0x8; _0x45991d++)
            _0x432c0a[_0x45991d] = HC_CONSTANTS['STATIC_NONCE'][_0x45991d] ^ _0x278242[_0x45991d % 0x10];
        let _0x2893d0 = null;
        if (_0x8f49c2) {
            for (const _0x1af061 of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x283344 = _0x0_0x1fcece['createHash']('md5')['update'](_0x1af061)['digest']();
                    const _0x3144ba = _0x0_0x1fcece['createDecipheriv']('aes-128-ecb', _0x283344, null);
                    _0x2893d0 = Buffer['concat']([
                        _0x3144ba['update'](Buffer['from'](_0x217114, 'hex')),
                        _0x3144ba['final']()
                    ]);
                    if (_0x2893d0['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x51246f) {
                    _0x2893d0 = null;
                }
            }
        }
        if (!_0x2893d0) {
            _0x2893d0 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x432c0a, Buffer['from'](_0x217114, 'hex'));
        }
        const _0x45784e = _0x2893d0['toString']('utf-8')['split']('[splitConfig]');
        const _0x489ba8 = {};
        for (let _0x121df8 = 0x0; _0x121df8 < _0x45784e['length']; _0x121df8++) {
            const _0x1eed2c = HC_CONSTANTS['TOKEN_MAP'][_0x121df8] || 'field_' + _0x121df8;
            let _0x363892 = jklDecrypt(_0x45784e[_0x121df8]);
            if (_0x1eed2c === 'sshField' && _0x363892 && _0x363892['includes']('z3a_')) {
                try {
                    const _0x44a47b = Buffer['from'](_0x363892['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x363892 = translateBrailleToAscii(_0x44a47b);
                } catch (_0x2cc77d) {
                }
            }
            _0x489ba8[_0x1eed2c] = _0x363892;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x580c48,
                'password': _0x31e467 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x12ba96
            },
            'Config': _0x489ba8
        }, null, 0x4);
    } catch (_0x4b9291) {
        return null;
    }
}