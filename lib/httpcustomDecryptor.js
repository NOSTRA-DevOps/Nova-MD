import _0x0_0x5b629d from 'crypto';
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
function chacha20Decrypt(_0x275610, _0x266df1, _0x920c4d) {
    try {
        const _0x326115 = _0x0_0x5b629d['createDecipheriv']('chacha20', _0x275610, _0x266df1);
        _0x326115['setAutoPadding'](![]);
        const _0x5ca181 = Buffer['alloc'](0x40);
        _0x326115['update'](_0x5ca181);
        return Buffer['concat']([
            _0x326115['update'](_0x920c4d),
            _0x326115['final']()
        ]);
    } catch (_0x1285c9) {
        return null;
    }
}
function translateBrailleToAscii(_0x51c44c) {
    if (!_0x51c44c)
        return _0x51c44c;
    let _0x366161 = _0x51c44c;
    const _0x1d238d = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x1572b3 => _0x1572b3['startsWith']('⠼'));
    for (const _0x364983 of _0x1d238d) {
        _0x366161 = _0x366161['split'](_0x364983)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x364983]);
    }
    for (const [_0x2cfb7f, _0x22089f] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x2cfb7f['startsWith']('⠼')) {
            _0x366161 = _0x366161['split'](_0x2cfb7f)['join'](_0x22089f);
        }
    }
    return _0x366161;
}
function jklDecrypt(_0x2f82a7) {
    if (!_0x2f82a7)
        return _0x2f82a7;
    try {
        let _0x427880 = _0x2f82a7;
        while (_0x427880['length'] % 0x4 !== 0x0)
            _0x427880 += '=';
        const _0xea39e7 = Buffer['from'](_0x427880, 'base64');
        const _0x46a221 = Buffer['alloc'](_0xea39e7['length']);
        const _0x5cf67d = Buffer['from']([
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
        for (let _0x4b64d9 = 0x0; _0x4b64d9 < _0xea39e7['length']; _0x4b64d9++) {
            const _0x3bbd93 = _0x5cf67d[_0x4b64d9 % 0x14];
            _0x46a221[_0x4b64d9] = ((_0xea39e7[_0x4b64d9] ^ 0xff) & 0xca | _0xea39e7[_0x4b64d9] & 0x35) ^ ((_0x3bbd93 ^ 0xff) & 0xca | _0x3bbd93 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x46a221['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x5857b8) {
        return _0x2f82a7;
    }
}
export function decryptHTTPCustom(_0x3102e5) {
    try {
        const _0x15d529 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x4d8cc8 = Buffer['alloc'](_0x3102e5['length']);
        for (let _0x5aa484 = 0x0; _0x5aa484 < _0x3102e5['length']; _0x5aa484++)
            _0x4d8cc8[_0x5aa484] = _0x3102e5[_0x5aa484] ^ _0x15d529[_0x5aa484 % _0x15d529['length']];
        const _0x5f0159 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x4d8cc8['toString']('utf-8'), 'hex'));
        const _0x3b983a = JSON['parse'](_0x5f0159['toString']('utf-8'));
        const _0xe9621f = !!_0x3b983a['cfg'];
        const _0x70047 = _0x3b983a['cfg'] || {};
        const _0x18892e = _0x3b983a['xy'] || _0x70047['content'];
        const _0x51eca6 = _0x3b983a['a'] || _0x70047['hwid'] || '';
        const _0x26ce7e = _0x3b983a['p'] || _0x70047['password'] || '';
        const _0x355520 = _0x3b983a['b'] || _0x70047['area'] || '';
        const _0x49be20 = _0x0_0x5b629d['createHash']('md5')['update'](_0x51eca6 + _0x26ce7e + _0x355520)['digest']();
        const _0x2c2735 = Buffer['alloc'](0x8);
        for (let _0x296fdd = 0x0; _0x296fdd < 0x8; _0x296fdd++)
            _0x2c2735[_0x296fdd] = HC_CONSTANTS['STATIC_NONCE'][_0x296fdd] ^ _0x49be20[_0x296fdd % 0x10];
        let _0x3be430 = null;
        if (_0xe9621f) {
            for (const _0x175335 of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x4ff1a1 = _0x0_0x5b629d['createHash']('md5')['update'](_0x175335)['digest']();
                    const _0x6d5ec2 = _0x0_0x5b629d['createDecipheriv']('aes-128-ecb', _0x4ff1a1, null);
                    _0x3be430 = Buffer['concat']([
                        _0x6d5ec2['update'](Buffer['from'](_0x18892e, 'hex')),
                        _0x6d5ec2['final']()
                    ]);
                    if (_0x3be430['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x2d6f19) {
                    _0x3be430 = null;
                }
            }
        }
        if (!_0x3be430) {
            _0x3be430 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x2c2735, Buffer['from'](_0x18892e, 'hex'));
        }
        const _0x7213f6 = _0x3be430['toString']('utf-8')['split']('[splitConfig]');
        const _0x30f4c5 = {};
        for (let _0x44c3b1 = 0x0; _0x44c3b1 < _0x7213f6['length']; _0x44c3b1++) {
            const _0x3a2977 = HC_CONSTANTS['TOKEN_MAP'][_0x44c3b1] || 'field_' + _0x44c3b1;
            let _0x52f42a = jklDecrypt(_0x7213f6[_0x44c3b1]);
            if (_0x3a2977 === 'sshField' && _0x52f42a && _0x52f42a['includes']('z3a_')) {
                try {
                    const _0x3357aa = Buffer['from'](_0x52f42a['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x52f42a = translateBrailleToAscii(_0x3357aa);
                } catch (_0x257c2f) {
                }
            }
            _0x30f4c5[_0x3a2977] = _0x52f42a;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x51eca6,
                'password': _0x26ce7e ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x355520
            },
            'Config': _0x30f4c5
        }, null, 0x4);
    } catch (_0x613f98) {
        return null;
    }
}