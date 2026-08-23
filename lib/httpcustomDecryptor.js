import _0x0_0x34086 from 'crypto';
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
function chacha20Decrypt(_0x1a0eb2, _0x2761ab, _0x2c5c9a) {
    try {
        const _0x566491 = _0x0_0x34086['createDecipheriv']('chacha20', _0x1a0eb2, _0x2761ab);
        _0x566491['setAutoPadding'](![]);
        const _0x741ece = Buffer['alloc'](0x40);
        _0x566491['update'](_0x741ece);
        return Buffer['concat']([
            _0x566491['update'](_0x2c5c9a),
            _0x566491['final']()
        ]);
    } catch (_0xd85d98) {
        return null;
    }
}
function translateBrailleToAscii(_0x391318) {
    if (!_0x391318)
        return _0x391318;
    let _0x29b5c1 = _0x391318;
    const _0x8752e = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x4afc17 => _0x4afc17['startsWith']('⠼'));
    for (const _0xccdfe6 of _0x8752e) {
        _0x29b5c1 = _0x29b5c1['split'](_0xccdfe6)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0xccdfe6]);
    }
    for (const [_0x1f33de, _0x2b8880] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x1f33de['startsWith']('⠼')) {
            _0x29b5c1 = _0x29b5c1['split'](_0x1f33de)['join'](_0x2b8880);
        }
    }
    return _0x29b5c1;
}
function jklDecrypt(_0x3be0d9) {
    if (!_0x3be0d9)
        return _0x3be0d9;
    try {
        let _0x48c98f = _0x3be0d9;
        while (_0x48c98f['length'] % 0x4 !== 0x0)
            _0x48c98f += '=';
        const _0x13b7f3 = Buffer['from'](_0x48c98f, 'base64');
        const _0x1bf847 = Buffer['alloc'](_0x13b7f3['length']);
        const _0x12a514 = Buffer['from']([
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
        for (let _0x309ca0 = 0x0; _0x309ca0 < _0x13b7f3['length']; _0x309ca0++) {
            const _0x10a53e = _0x12a514[_0x309ca0 % 0x14];
            _0x1bf847[_0x309ca0] = ((_0x13b7f3[_0x309ca0] ^ 0xff) & 0xca | _0x13b7f3[_0x309ca0] & 0x35) ^ ((_0x10a53e ^ 0xff) & 0xca | _0x10a53e & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x1bf847['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x5c001d) {
        return _0x3be0d9;
    }
}
export function decryptHTTPCustom(_0x45caf1) {
    try {
        const _0x39b9f3 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x1535ff = Buffer['alloc'](_0x45caf1['length']);
        for (let _0x23f2b5 = 0x0; _0x23f2b5 < _0x45caf1['length']; _0x23f2b5++)
            _0x1535ff[_0x23f2b5] = _0x45caf1[_0x23f2b5] ^ _0x39b9f3[_0x23f2b5 % _0x39b9f3['length']];
        const _0x50f85a = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x1535ff['toString']('utf-8'), 'hex'));
        const _0x491b20 = JSON['parse'](_0x50f85a['toString']('utf-8'));
        const _0x140800 = !!_0x491b20['cfg'];
        const _0xd120e8 = _0x491b20['cfg'] || {};
        const _0x2a78cf = _0x491b20['xy'] || _0xd120e8['content'];
        const _0xef0e5 = _0x491b20['a'] || _0xd120e8['hwid'] || '';
        const _0xe62665 = _0x491b20['p'] || _0xd120e8['password'] || '';
        const _0x593d89 = _0x491b20['b'] || _0xd120e8['area'] || '';
        const _0x23dae4 = _0x0_0x34086['createHash']('md5')['update'](_0xef0e5 + _0xe62665 + _0x593d89)['digest']();
        const _0x9476ec = Buffer['alloc'](0x8);
        for (let _0x12e043 = 0x0; _0x12e043 < 0x8; _0x12e043++)
            _0x9476ec[_0x12e043] = HC_CONSTANTS['STATIC_NONCE'][_0x12e043] ^ _0x23dae4[_0x12e043 % 0x10];
        let _0x5604d5 = null;
        if (_0x140800) {
            for (const _0x468a15 of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x57f71d = _0x0_0x34086['createHash']('md5')['update'](_0x468a15)['digest']();
                    const _0x5a571 = _0x0_0x34086['createDecipheriv']('aes-128-ecb', _0x57f71d, null);
                    _0x5604d5 = Buffer['concat']([
                        _0x5a571['update'](Buffer['from'](_0x2a78cf, 'hex')),
                        _0x5a571['final']()
                    ]);
                    if (_0x5604d5['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x21c7dd) {
                    _0x5604d5 = null;
                }
            }
        }
        if (!_0x5604d5) {
            _0x5604d5 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x9476ec, Buffer['from'](_0x2a78cf, 'hex'));
        }
        const _0x38601b = _0x5604d5['toString']('utf-8')['split']('[splitConfig]');
        const _0x48a197 = {};
        for (let _0x37e3b4 = 0x0; _0x37e3b4 < _0x38601b['length']; _0x37e3b4++) {
            const _0x4a329b = HC_CONSTANTS['TOKEN_MAP'][_0x37e3b4] || 'field_' + _0x37e3b4;
            let _0xefcc7 = jklDecrypt(_0x38601b[_0x37e3b4]);
            if (_0x4a329b === 'sshField' && _0xefcc7 && _0xefcc7['includes']('z3a_')) {
                try {
                    const _0x59cad5 = Buffer['from'](_0xefcc7['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0xefcc7 = translateBrailleToAscii(_0x59cad5);
                } catch (_0x58e22a) {
                }
            }
            _0x48a197[_0x4a329b] = _0xefcc7;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0xef0e5,
                'password': _0xe62665 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x593d89
            },
            'Config': _0x48a197
        }, null, 0x4);
    } catch (_0x4b9c0a) {
        return null;
    }
}