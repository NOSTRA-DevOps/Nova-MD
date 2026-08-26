import _0x0_0x82685f from 'crypto';
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
function chacha20Decrypt(_0x40ea57, _0x152bdd, _0x219176) {
    try {
        const _0x4488a7 = _0x0_0x82685f['createDecipheriv']('chacha20', _0x40ea57, _0x152bdd);
        _0x4488a7['setAutoPadding'](![]);
        const _0x3bf10b = Buffer['alloc'](0x40);
        _0x4488a7['update'](_0x3bf10b);
        return Buffer['concat']([
            _0x4488a7['update'](_0x219176),
            _0x4488a7['final']()
        ]);
    } catch (_0x2da5e6) {
        return null;
    }
}
function translateBrailleToAscii(_0x16b6a0) {
    if (!_0x16b6a0)
        return _0x16b6a0;
    let _0x799e38 = _0x16b6a0;
    const _0x38f91a = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x2ec343 => _0x2ec343['startsWith']('⠼'));
    for (const _0x44a181 of _0x38f91a) {
        _0x799e38 = _0x799e38['split'](_0x44a181)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x44a181]);
    }
    for (const [_0xc535b8, _0xa26bf3] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0xc535b8['startsWith']('⠼')) {
            _0x799e38 = _0x799e38['split'](_0xc535b8)['join'](_0xa26bf3);
        }
    }
    return _0x799e38;
}
function jklDecrypt(_0x3800d5) {
    if (!_0x3800d5)
        return _0x3800d5;
    try {
        let _0x1c51d = _0x3800d5;
        while (_0x1c51d['length'] % 0x4 !== 0x0)
            _0x1c51d += '=';
        const _0x4e86fe = Buffer['from'](_0x1c51d, 'base64');
        const _0x568f6a = Buffer['alloc'](_0x4e86fe['length']);
        const _0x23c6fc = Buffer['from']([
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
        for (let _0x3c6877 = 0x0; _0x3c6877 < _0x4e86fe['length']; _0x3c6877++) {
            const _0x1eca7d = _0x23c6fc[_0x3c6877 % 0x14];
            _0x568f6a[_0x3c6877] = ((_0x4e86fe[_0x3c6877] ^ 0xff) & 0xca | _0x4e86fe[_0x3c6877] & 0x35) ^ ((_0x1eca7d ^ 0xff) & 0xca | _0x1eca7d & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x568f6a['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x443752) {
        return _0x3800d5;
    }
}
export function decryptHTTPCustom(_0xcf93b3) {
    try {
        const _0x305ac0 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x225013 = Buffer['alloc'](_0xcf93b3['length']);
        for (let _0x29cdfa = 0x0; _0x29cdfa < _0xcf93b3['length']; _0x29cdfa++)
            _0x225013[_0x29cdfa] = _0xcf93b3[_0x29cdfa] ^ _0x305ac0[_0x29cdfa % _0x305ac0['length']];
        const _0x5c65a3 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x225013['toString']('utf-8'), 'hex'));
        const _0x1433de = JSON['parse'](_0x5c65a3['toString']('utf-8'));
        const _0x24b344 = !!_0x1433de['cfg'];
        const _0x361006 = _0x1433de['cfg'] || {};
        const _0x67d363 = _0x1433de['xy'] || _0x361006['content'];
        const _0x1bb7cb = _0x1433de['a'] || _0x361006['hwid'] || '';
        const _0x4ac016 = _0x1433de['p'] || _0x361006['password'] || '';
        const _0x29e7d6 = _0x1433de['b'] || _0x361006['area'] || '';
        const _0x4993e3 = _0x0_0x82685f['createHash']('md5')['update'](_0x1bb7cb + _0x4ac016 + _0x29e7d6)['digest']();
        const _0x472a03 = Buffer['alloc'](0x8);
        for (let _0x536716 = 0x0; _0x536716 < 0x8; _0x536716++)
            _0x472a03[_0x536716] = HC_CONSTANTS['STATIC_NONCE'][_0x536716] ^ _0x4993e3[_0x536716 % 0x10];
        let _0x1db325 = null;
        if (_0x24b344) {
            for (const _0x250a9c of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x55ec07 = _0x0_0x82685f['createHash']('md5')['update'](_0x250a9c)['digest']();
                    const _0x363545 = _0x0_0x82685f['createDecipheriv']('aes-128-ecb', _0x55ec07, null);
                    _0x1db325 = Buffer['concat']([
                        _0x363545['update'](Buffer['from'](_0x67d363, 'hex')),
                        _0x363545['final']()
                    ]);
                    if (_0x1db325['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x30a16e) {
                    _0x1db325 = null;
                }
            }
        }
        if (!_0x1db325) {
            _0x1db325 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x472a03, Buffer['from'](_0x67d363, 'hex'));
        }
        const _0x5ce64c = _0x1db325['toString']('utf-8')['split']('[splitConfig]');
        const _0x6607cf = {};
        for (let _0x4bc200 = 0x0; _0x4bc200 < _0x5ce64c['length']; _0x4bc200++) {
            const _0x23a8c7 = HC_CONSTANTS['TOKEN_MAP'][_0x4bc200] || 'field_' + _0x4bc200;
            let _0x400039 = jklDecrypt(_0x5ce64c[_0x4bc200]);
            if (_0x23a8c7 === 'sshField' && _0x400039 && _0x400039['includes']('z3a_')) {
                try {
                    const _0x9d8390 = Buffer['from'](_0x400039['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x400039 = translateBrailleToAscii(_0x9d8390);
                } catch (_0x51ea7a) {
                }
            }
            _0x6607cf[_0x23a8c7] = _0x400039;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x1bb7cb,
                'password': _0x4ac016 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x29e7d6
            },
            'Config': _0x6607cf
        }, null, 0x4);
    } catch (_0x1bbd25) {
        return null;
    }
}