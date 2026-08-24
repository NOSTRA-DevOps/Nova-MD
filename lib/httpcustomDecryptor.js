import _0x0_0x3e9787 from 'crypto';
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
function chacha20Decrypt(_0x5c4016, _0x339b4e, _0xe85350) {
    try {
        const _0x3c8c70 = _0x0_0x3e9787['createDecipheriv']('chacha20', _0x5c4016, _0x339b4e);
        _0x3c8c70['setAutoPadding'](![]);
        const _0x2822e2 = Buffer['alloc'](0x40);
        _0x3c8c70['update'](_0x2822e2);
        return Buffer['concat']([
            _0x3c8c70['update'](_0xe85350),
            _0x3c8c70['final']()
        ]);
    } catch (_0x465506) {
        return null;
    }
}
function translateBrailleToAscii(_0x29cca1) {
    if (!_0x29cca1)
        return _0x29cca1;
    let _0x2547cc = _0x29cca1;
    const _0x4e2d4a = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x2a53c0 => _0x2a53c0['startsWith']('⠼'));
    for (const _0x2f4309 of _0x4e2d4a) {
        _0x2547cc = _0x2547cc['split'](_0x2f4309)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x2f4309]);
    }
    for (const [_0x4b14d9, _0x267f12] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x4b14d9['startsWith']('⠼')) {
            _0x2547cc = _0x2547cc['split'](_0x4b14d9)['join'](_0x267f12);
        }
    }
    return _0x2547cc;
}
function jklDecrypt(_0x2d56e1) {
    if (!_0x2d56e1)
        return _0x2d56e1;
    try {
        let _0x17caf3 = _0x2d56e1;
        while (_0x17caf3['length'] % 0x4 !== 0x0)
            _0x17caf3 += '=';
        const _0x467433 = Buffer['from'](_0x17caf3, 'base64');
        const _0x22d48e = Buffer['alloc'](_0x467433['length']);
        const _0x586cca = Buffer['from']([
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
        for (let _0x12232f = 0x0; _0x12232f < _0x467433['length']; _0x12232f++) {
            const _0x2c2d35 = _0x586cca[_0x12232f % 0x14];
            _0x22d48e[_0x12232f] = ((_0x467433[_0x12232f] ^ 0xff) & 0xca | _0x467433[_0x12232f] & 0x35) ^ ((_0x2c2d35 ^ 0xff) & 0xca | _0x2c2d35 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x22d48e['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x47bcf9) {
        return _0x2d56e1;
    }
}
export function decryptHTTPCustom(_0x53f624) {
    try {
        const _0x270041 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x521f39 = Buffer['alloc'](_0x53f624['length']);
        for (let _0x4cc815 = 0x0; _0x4cc815 < _0x53f624['length']; _0x4cc815++)
            _0x521f39[_0x4cc815] = _0x53f624[_0x4cc815] ^ _0x270041[_0x4cc815 % _0x270041['length']];
        const _0x47dde2 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x521f39['toString']('utf-8'), 'hex'));
        const _0x47c0c9 = JSON['parse'](_0x47dde2['toString']('utf-8'));
        const _0x20dfd5 = !!_0x47c0c9['cfg'];
        const _0x521c0c = _0x47c0c9['cfg'] || {};
        const _0x56c482 = _0x47c0c9['xy'] || _0x521c0c['content'];
        const _0x12dcd4 = _0x47c0c9['a'] || _0x521c0c['hwid'] || '';
        const _0x278bb8 = _0x47c0c9['p'] || _0x521c0c['password'] || '';
        const _0x4bb73e = _0x47c0c9['b'] || _0x521c0c['area'] || '';
        const _0x2e2ac3 = _0x0_0x3e9787['createHash']('md5')['update'](_0x12dcd4 + _0x278bb8 + _0x4bb73e)['digest']();
        const _0x58c956 = Buffer['alloc'](0x8);
        for (let _0x38363e = 0x0; _0x38363e < 0x8; _0x38363e++)
            _0x58c956[_0x38363e] = HC_CONSTANTS['STATIC_NONCE'][_0x38363e] ^ _0x2e2ac3[_0x38363e % 0x10];
        let _0x49d661 = null;
        if (_0x20dfd5) {
            for (const _0x118ba3 of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x25401c = _0x0_0x3e9787['createHash']('md5')['update'](_0x118ba3)['digest']();
                    const _0x918614 = _0x0_0x3e9787['createDecipheriv']('aes-128-ecb', _0x25401c, null);
                    _0x49d661 = Buffer['concat']([
                        _0x918614['update'](Buffer['from'](_0x56c482, 'hex')),
                        _0x918614['final']()
                    ]);
                    if (_0x49d661['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x217386) {
                    _0x49d661 = null;
                }
            }
        }
        if (!_0x49d661) {
            _0x49d661 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x58c956, Buffer['from'](_0x56c482, 'hex'));
        }
        const _0x2270ce = _0x49d661['toString']('utf-8')['split']('[splitConfig]');
        const _0x378607 = {};
        for (let _0x370e20 = 0x0; _0x370e20 < _0x2270ce['length']; _0x370e20++) {
            const _0x11be7b = HC_CONSTANTS['TOKEN_MAP'][_0x370e20] || 'field_' + _0x370e20;
            let _0x134dfa = jklDecrypt(_0x2270ce[_0x370e20]);
            if (_0x11be7b === 'sshField' && _0x134dfa && _0x134dfa['includes']('z3a_')) {
                try {
                    const _0x2d3c8e = Buffer['from'](_0x134dfa['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x134dfa = translateBrailleToAscii(_0x2d3c8e);
                } catch (_0x979196) {
                }
            }
            _0x378607[_0x11be7b] = _0x134dfa;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x12dcd4,
                'password': _0x278bb8 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x4bb73e
            },
            'Config': _0x378607
        }, null, 0x4);
    } catch (_0x18e913) {
        return null;
    }
}