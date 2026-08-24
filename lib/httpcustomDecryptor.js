import _0x0_0x3cf1e0 from 'crypto';
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
function chacha20Decrypt(_0xe08379, _0x3d39dd, _0x14eeca) {
    try {
        const _0x5960b5 = _0x0_0x3cf1e0['createDecipheriv']('chacha20', _0xe08379, _0x3d39dd);
        _0x5960b5['setAutoPadding'](![]);
        const _0x4f3775 = Buffer['alloc'](0x40);
        _0x5960b5['update'](_0x4f3775);
        return Buffer['concat']([
            _0x5960b5['update'](_0x14eeca),
            _0x5960b5['final']()
        ]);
    } catch (_0x31e8df) {
        return null;
    }
}
function translateBrailleToAscii(_0xad696c) {
    if (!_0xad696c)
        return _0xad696c;
    let _0xd27c62 = _0xad696c;
    const _0x30b850 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x2d0ed4 => _0x2d0ed4['startsWith']('⠼'));
    for (const _0x13956d of _0x30b850) {
        _0xd27c62 = _0xd27c62['split'](_0x13956d)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x13956d]);
    }
    for (const [_0x20e645, _0x44b2e1] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x20e645['startsWith']('⠼')) {
            _0xd27c62 = _0xd27c62['split'](_0x20e645)['join'](_0x44b2e1);
        }
    }
    return _0xd27c62;
}
function jklDecrypt(_0x2d3003) {
    if (!_0x2d3003)
        return _0x2d3003;
    try {
        let _0x21eb68 = _0x2d3003;
        while (_0x21eb68['length'] % 0x4 !== 0x0)
            _0x21eb68 += '=';
        const _0x3872b8 = Buffer['from'](_0x21eb68, 'base64');
        const _0x1abdcd = Buffer['alloc'](_0x3872b8['length']);
        const _0x5757e1 = Buffer['from']([
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
        for (let _0x37fd8f = 0x0; _0x37fd8f < _0x3872b8['length']; _0x37fd8f++) {
            const _0x39891a = _0x5757e1[_0x37fd8f % 0x14];
            _0x1abdcd[_0x37fd8f] = ((_0x3872b8[_0x37fd8f] ^ 0xff) & 0xca | _0x3872b8[_0x37fd8f] & 0x35) ^ ((_0x39891a ^ 0xff) & 0xca | _0x39891a & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x1abdcd['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x10b372) {
        return _0x2d3003;
    }
}
export function decryptHTTPCustom(_0x54e315) {
    try {
        const _0x13c81d = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x15ece1 = Buffer['alloc'](_0x54e315['length']);
        for (let _0x583552 = 0x0; _0x583552 < _0x54e315['length']; _0x583552++)
            _0x15ece1[_0x583552] = _0x54e315[_0x583552] ^ _0x13c81d[_0x583552 % _0x13c81d['length']];
        const _0x4999df = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x15ece1['toString']('utf-8'), 'hex'));
        const _0x16708a = JSON['parse'](_0x4999df['toString']('utf-8'));
        const _0xbcff71 = !!_0x16708a['cfg'];
        const _0x4a61f8 = _0x16708a['cfg'] || {};
        const _0x47e0fb = _0x16708a['xy'] || _0x4a61f8['content'];
        const _0x25e4b6 = _0x16708a['a'] || _0x4a61f8['hwid'] || '';
        const _0x5e5ef9 = _0x16708a['p'] || _0x4a61f8['password'] || '';
        const _0x1d7833 = _0x16708a['b'] || _0x4a61f8['area'] || '';
        const _0x8e8a5c = _0x0_0x3cf1e0['createHash']('md5')['update'](_0x25e4b6 + _0x5e5ef9 + _0x1d7833)['digest']();
        const _0x5f0cee = Buffer['alloc'](0x8);
        for (let _0x35d32a = 0x0; _0x35d32a < 0x8; _0x35d32a++)
            _0x5f0cee[_0x35d32a] = HC_CONSTANTS['STATIC_NONCE'][_0x35d32a] ^ _0x8e8a5c[_0x35d32a % 0x10];
        let _0x4a66bc = null;
        if (_0xbcff71) {
            for (const _0xdb165a of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x1ac111 = _0x0_0x3cf1e0['createHash']('md5')['update'](_0xdb165a)['digest']();
                    const _0x1a11f6 = _0x0_0x3cf1e0['createDecipheriv']('aes-128-ecb', _0x1ac111, null);
                    _0x4a66bc = Buffer['concat']([
                        _0x1a11f6['update'](Buffer['from'](_0x47e0fb, 'hex')),
                        _0x1a11f6['final']()
                    ]);
                    if (_0x4a66bc['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x3509df) {
                    _0x4a66bc = null;
                }
            }
        }
        if (!_0x4a66bc) {
            _0x4a66bc = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x5f0cee, Buffer['from'](_0x47e0fb, 'hex'));
        }
        const _0x9897e9 = _0x4a66bc['toString']('utf-8')['split']('[splitConfig]');
        const _0x103d45 = {};
        for (let _0x42f4d1 = 0x0; _0x42f4d1 < _0x9897e9['length']; _0x42f4d1++) {
            const _0x32c94e = HC_CONSTANTS['TOKEN_MAP'][_0x42f4d1] || 'field_' + _0x42f4d1;
            let _0x24e622 = jklDecrypt(_0x9897e9[_0x42f4d1]);
            if (_0x32c94e === 'sshField' && _0x24e622 && _0x24e622['includes']('z3a_')) {
                try {
                    const _0x24ac19 = Buffer['from'](_0x24e622['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x24e622 = translateBrailleToAscii(_0x24ac19);
                } catch (_0x2d4a62) {
                }
            }
            _0x103d45[_0x32c94e] = _0x24e622;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x25e4b6,
                'password': _0x5e5ef9 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x1d7833
            },
            'Config': _0x103d45
        }, null, 0x4);
    } catch (_0x4281c7) {
        return null;
    }
}