import _0x0_0x1ba8f9 from 'crypto';
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
function chacha20Decrypt(_0x529311, _0x373670, _0x3c7a97) {
    try {
        const _0x2766ae = _0x0_0x1ba8f9['createDecipheriv']('chacha20', _0x529311, _0x373670);
        _0x2766ae['setAutoPadding'](![]);
        const _0x5ac435 = Buffer['alloc'](0x40);
        _0x2766ae['update'](_0x5ac435);
        return Buffer['concat']([
            _0x2766ae['update'](_0x3c7a97),
            _0x2766ae['final']()
        ]);
    } catch (_0x2dd6fb) {
        return null;
    }
}
function translateBrailleToAscii(_0x36b6ba) {
    if (!_0x36b6ba)
        return _0x36b6ba;
    let _0x30c697 = _0x36b6ba;
    const _0xe3fb88 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x177c5c => _0x177c5c['startsWith']('⠼'));
    for (const _0x4b726c of _0xe3fb88) {
        _0x30c697 = _0x30c697['split'](_0x4b726c)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x4b726c]);
    }
    for (const [_0x29a94c, _0x422591] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x29a94c['startsWith']('⠼')) {
            _0x30c697 = _0x30c697['split'](_0x29a94c)['join'](_0x422591);
        }
    }
    return _0x30c697;
}
function jklDecrypt(_0x4475a6) {
    if (!_0x4475a6)
        return _0x4475a6;
    try {
        let _0x3e7783 = _0x4475a6;
        while (_0x3e7783['length'] % 0x4 !== 0x0)
            _0x3e7783 += '=';
        const _0x474fa6 = Buffer['from'](_0x3e7783, 'base64');
        const _0x1c2cc2 = Buffer['alloc'](_0x474fa6['length']);
        const _0x1b3151 = Buffer['from']([
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
        for (let _0x3bba1a = 0x0; _0x3bba1a < _0x474fa6['length']; _0x3bba1a++) {
            const _0x37bd58 = _0x1b3151[_0x3bba1a % 0x14];
            _0x1c2cc2[_0x3bba1a] = ((_0x474fa6[_0x3bba1a] ^ 0xff) & 0xca | _0x474fa6[_0x3bba1a] & 0x35) ^ ((_0x37bd58 ^ 0xff) & 0xca | _0x37bd58 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x1c2cc2['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x27491c) {
        return _0x4475a6;
    }
}
export function decryptHTTPCustom(_0x33c397) {
    try {
        const _0xa88db = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x10bd69 = Buffer['alloc'](_0x33c397['length']);
        for (let _0x57a8d8 = 0x0; _0x57a8d8 < _0x33c397['length']; _0x57a8d8++)
            _0x10bd69[_0x57a8d8] = _0x33c397[_0x57a8d8] ^ _0xa88db[_0x57a8d8 % _0xa88db['length']];
        const _0xc206b8 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x10bd69['toString']('utf-8'), 'hex'));
        const _0x2b6c2b = JSON['parse'](_0xc206b8['toString']('utf-8'));
        const _0x32f692 = !!_0x2b6c2b['cfg'];
        const _0x5a3709 = _0x2b6c2b['cfg'] || {};
        const _0x58a08f = _0x2b6c2b['xy'] || _0x5a3709['content'];
        const _0x5d3761 = _0x2b6c2b['a'] || _0x5a3709['hwid'] || '';
        const _0x458c55 = _0x2b6c2b['p'] || _0x5a3709['password'] || '';
        const _0x40b16c = _0x2b6c2b['b'] || _0x5a3709['area'] || '';
        const _0x169832 = _0x0_0x1ba8f9['createHash']('md5')['update'](_0x5d3761 + _0x458c55 + _0x40b16c)['digest']();
        const _0x6d50a = Buffer['alloc'](0x8);
        for (let _0x311e0d = 0x0; _0x311e0d < 0x8; _0x311e0d++)
            _0x6d50a[_0x311e0d] = HC_CONSTANTS['STATIC_NONCE'][_0x311e0d] ^ _0x169832[_0x311e0d % 0x10];
        let _0x346d73 = null;
        if (_0x32f692) {
            for (const _0x348138 of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0xebf23b = _0x0_0x1ba8f9['createHash']('md5')['update'](_0x348138)['digest']();
                    const _0x4febd4 = _0x0_0x1ba8f9['createDecipheriv']('aes-128-ecb', _0xebf23b, null);
                    _0x346d73 = Buffer['concat']([
                        _0x4febd4['update'](Buffer['from'](_0x58a08f, 'hex')),
                        _0x4febd4['final']()
                    ]);
                    if (_0x346d73['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x53081f) {
                    _0x346d73 = null;
                }
            }
        }
        if (!_0x346d73) {
            _0x346d73 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x6d50a, Buffer['from'](_0x58a08f, 'hex'));
        }
        const _0x598f79 = _0x346d73['toString']('utf-8')['split']('[splitConfig]');
        const _0xcb2819 = {};
        for (let _0xf263d = 0x0; _0xf263d < _0x598f79['length']; _0xf263d++) {
            const _0x251b03 = HC_CONSTANTS['TOKEN_MAP'][_0xf263d] || 'field_' + _0xf263d;
            let _0x71365a = jklDecrypt(_0x598f79[_0xf263d]);
            if (_0x251b03 === 'sshField' && _0x71365a && _0x71365a['includes']('z3a_')) {
                try {
                    const _0x4bbd34 = Buffer['from'](_0x71365a['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x71365a = translateBrailleToAscii(_0x4bbd34);
                } catch (_0x2098e8) {
                }
            }
            _0xcb2819[_0x251b03] = _0x71365a;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x5d3761,
                'password': _0x458c55 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x40b16c
            },
            'Config': _0xcb2819
        }, null, 0x4);
    } catch (_0x6c29cf) {
        return null;
    }
}