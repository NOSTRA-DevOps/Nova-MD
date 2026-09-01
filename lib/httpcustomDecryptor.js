import _0x0_0x3bce41 from 'crypto';
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
function chacha20Decrypt(_0x29d1b5, _0x4ee551, _0x52397b) {
    try {
        const _0x5015d9 = _0x0_0x3bce41['createDecipheriv']('chacha20', _0x29d1b5, _0x4ee551);
        _0x5015d9['setAutoPadding'](![]);
        const _0x2cc915 = Buffer['alloc'](0x40);
        _0x5015d9['update'](_0x2cc915);
        return Buffer['concat']([
            _0x5015d9['update'](_0x52397b),
            _0x5015d9['final']()
        ]);
    } catch (_0x313410) {
        return null;
    }
}
function translateBrailleToAscii(_0x14e081) {
    if (!_0x14e081)
        return _0x14e081;
    let _0x4dc448 = _0x14e081;
    const _0x5d77f4 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x527ef2 => _0x527ef2['startsWith']('⠼'));
    for (const _0x285478 of _0x5d77f4) {
        _0x4dc448 = _0x4dc448['split'](_0x285478)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x285478]);
    }
    for (const [_0x5a14ec, _0x290635] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x5a14ec['startsWith']('⠼')) {
            _0x4dc448 = _0x4dc448['split'](_0x5a14ec)['join'](_0x290635);
        }
    }
    return _0x4dc448;
}
function jklDecrypt(_0x45837c) {
    if (!_0x45837c)
        return _0x45837c;
    try {
        let _0x21f493 = _0x45837c;
        while (_0x21f493['length'] % 0x4 !== 0x0)
            _0x21f493 += '=';
        const _0x407fc4 = Buffer['from'](_0x21f493, 'base64');
        const _0x19550f = Buffer['alloc'](_0x407fc4['length']);
        const _0x3665de = Buffer['from']([
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
        for (let _0x26abab = 0x0; _0x26abab < _0x407fc4['length']; _0x26abab++) {
            const _0x3b6a9c = _0x3665de[_0x26abab % 0x14];
            _0x19550f[_0x26abab] = ((_0x407fc4[_0x26abab] ^ 0xff) & 0xca | _0x407fc4[_0x26abab] & 0x35) ^ ((_0x3b6a9c ^ 0xff) & 0xca | _0x3b6a9c & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x19550f['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0xe2ff43) {
        return _0x45837c;
    }
}
export function decryptHTTPCustom(_0x4b8f2d) {
    try {
        const _0x218aaf = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0xc1da25 = Buffer['alloc'](_0x4b8f2d['length']);
        for (let _0x48a965 = 0x0; _0x48a965 < _0x4b8f2d['length']; _0x48a965++)
            _0xc1da25[_0x48a965] = _0x4b8f2d[_0x48a965] ^ _0x218aaf[_0x48a965 % _0x218aaf['length']];
        const _0x14a000 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0xc1da25['toString']('utf-8'), 'hex'));
        const _0x54bc13 = JSON['parse'](_0x14a000['toString']('utf-8'));
        const _0x3bae18 = !!_0x54bc13['cfg'];
        const _0x5431bf = _0x54bc13['cfg'] || {};
        const _0xab44f9 = _0x54bc13['xy'] || _0x5431bf['content'];
        const _0xd2640c = _0x54bc13['a'] || _0x5431bf['hwid'] || '';
        const _0x404a90 = _0x54bc13['p'] || _0x5431bf['password'] || '';
        const _0x2df736 = _0x54bc13['b'] || _0x5431bf['area'] || '';
        const _0x34b4d6 = _0x0_0x3bce41['createHash']('md5')['update'](_0xd2640c + _0x404a90 + _0x2df736)['digest']();
        const _0x5f3c77 = Buffer['alloc'](0x8);
        for (let _0x38bf48 = 0x0; _0x38bf48 < 0x8; _0x38bf48++)
            _0x5f3c77[_0x38bf48] = HC_CONSTANTS['STATIC_NONCE'][_0x38bf48] ^ _0x34b4d6[_0x38bf48 % 0x10];
        let _0xfbcaa4 = null;
        if (_0x3bae18) {
            for (const _0x344d4c of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x3faadc = _0x0_0x3bce41['createHash']('md5')['update'](_0x344d4c)['digest']();
                    const _0x1b0f38 = _0x0_0x3bce41['createDecipheriv']('aes-128-ecb', _0x3faadc, null);
                    _0xfbcaa4 = Buffer['concat']([
                        _0x1b0f38['update'](Buffer['from'](_0xab44f9, 'hex')),
                        _0x1b0f38['final']()
                    ]);
                    if (_0xfbcaa4['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x298560) {
                    _0xfbcaa4 = null;
                }
            }
        }
        if (!_0xfbcaa4) {
            _0xfbcaa4 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x5f3c77, Buffer['from'](_0xab44f9, 'hex'));
        }
        const _0x46c86f = _0xfbcaa4['toString']('utf-8')['split']('[splitConfig]');
        const _0x2b1478 = {};
        for (let _0x14d082 = 0x0; _0x14d082 < _0x46c86f['length']; _0x14d082++) {
            const _0x29b0ff = HC_CONSTANTS['TOKEN_MAP'][_0x14d082] || 'field_' + _0x14d082;
            let _0x36a4cd = jklDecrypt(_0x46c86f[_0x14d082]);
            if (_0x29b0ff === 'sshField' && _0x36a4cd && _0x36a4cd['includes']('z3a_')) {
                try {
                    const _0x48e7d3 = Buffer['from'](_0x36a4cd['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x36a4cd = translateBrailleToAscii(_0x48e7d3);
                } catch (_0x223622) {
                }
            }
            _0x2b1478[_0x29b0ff] = _0x36a4cd;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0xd2640c,
                'password': _0x404a90 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x2df736
            },
            'Config': _0x2b1478
        }, null, 0x4);
    } catch (_0x39ec7f) {
        return null;
    }
}