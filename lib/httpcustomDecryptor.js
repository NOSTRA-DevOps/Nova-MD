import _0x0_0x65ce7e from 'crypto';
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
function chacha20Decrypt(_0x13cca1, _0x14b4a8, _0x2a6f4f) {
    try {
        const _0x47fb57 = _0x0_0x65ce7e['createDecipheriv']('chacha20', _0x13cca1, _0x14b4a8);
        _0x47fb57['setAutoPadding'](![]);
        const _0x4870c3 = Buffer['alloc'](0x40);
        _0x47fb57['update'](_0x4870c3);
        return Buffer['concat']([
            _0x47fb57['update'](_0x2a6f4f),
            _0x47fb57['final']()
        ]);
    } catch (_0x598b35) {
        return null;
    }
}
function translateBrailleToAscii(_0x235609) {
    if (!_0x235609)
        return _0x235609;
    let _0x2af7c1 = _0x235609;
    const _0x25cfd7 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x4a52cd => _0x4a52cd['startsWith']('⠼'));
    for (const _0x5830a7 of _0x25cfd7) {
        _0x2af7c1 = _0x2af7c1['split'](_0x5830a7)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x5830a7]);
    }
    for (const [_0x4a16c0, _0x3140af] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x4a16c0['startsWith']('⠼')) {
            _0x2af7c1 = _0x2af7c1['split'](_0x4a16c0)['join'](_0x3140af);
        }
    }
    return _0x2af7c1;
}
function jklDecrypt(_0x3fee65) {
    if (!_0x3fee65)
        return _0x3fee65;
    try {
        let _0x243314 = _0x3fee65;
        while (_0x243314['length'] % 0x4 !== 0x0)
            _0x243314 += '=';
        const _0x1a8be8 = Buffer['from'](_0x243314, 'base64');
        const _0x432bd1 = Buffer['alloc'](_0x1a8be8['length']);
        const _0x27828b = Buffer['from']([
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
        for (let _0x5229bd = 0x0; _0x5229bd < _0x1a8be8['length']; _0x5229bd++) {
            const _0x2c8967 = _0x27828b[_0x5229bd % 0x14];
            _0x432bd1[_0x5229bd] = ((_0x1a8be8[_0x5229bd] ^ 0xff) & 0xca | _0x1a8be8[_0x5229bd] & 0x35) ^ ((_0x2c8967 ^ 0xff) & 0xca | _0x2c8967 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x432bd1['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0xd72723) {
        return _0x3fee65;
    }
}
export function decryptHTTPCustom(_0xce24bc) {
    try {
        const _0x4e68c1 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x13c23b = Buffer['alloc'](_0xce24bc['length']);
        for (let _0x4cdba8 = 0x0; _0x4cdba8 < _0xce24bc['length']; _0x4cdba8++)
            _0x13c23b[_0x4cdba8] = _0xce24bc[_0x4cdba8] ^ _0x4e68c1[_0x4cdba8 % _0x4e68c1['length']];
        const _0x33105b = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x13c23b['toString']('utf-8'), 'hex'));
        const _0x1097cb = JSON['parse'](_0x33105b['toString']('utf-8'));
        const _0x156ce6 = !!_0x1097cb['cfg'];
        const _0x1cee1c = _0x1097cb['cfg'] || {};
        const _0x2697a4 = _0x1097cb['xy'] || _0x1cee1c['content'];
        const _0x5c0f2b = _0x1097cb['a'] || _0x1cee1c['hwid'] || '';
        const _0x31858b = _0x1097cb['p'] || _0x1cee1c['password'] || '';
        const _0x3a2a55 = _0x1097cb['b'] || _0x1cee1c['area'] || '';
        const _0x2867d7 = _0x0_0x65ce7e['createHash']('md5')['update'](_0x5c0f2b + _0x31858b + _0x3a2a55)['digest']();
        const _0x1a9509 = Buffer['alloc'](0x8);
        for (let _0x3204c7 = 0x0; _0x3204c7 < 0x8; _0x3204c7++)
            _0x1a9509[_0x3204c7] = HC_CONSTANTS['STATIC_NONCE'][_0x3204c7] ^ _0x2867d7[_0x3204c7 % 0x10];
        let _0x16693a = null;
        if (_0x156ce6) {
            for (const _0x5e8138 of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x21b57e = _0x0_0x65ce7e['createHash']('md5')['update'](_0x5e8138)['digest']();
                    const _0x225d98 = _0x0_0x65ce7e['createDecipheriv']('aes-128-ecb', _0x21b57e, null);
                    _0x16693a = Buffer['concat']([
                        _0x225d98['update'](Buffer['from'](_0x2697a4, 'hex')),
                        _0x225d98['final']()
                    ]);
                    if (_0x16693a['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x1f1791) {
                    _0x16693a = null;
                }
            }
        }
        if (!_0x16693a) {
            _0x16693a = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x1a9509, Buffer['from'](_0x2697a4, 'hex'));
        }
        const _0x5e6364 = _0x16693a['toString']('utf-8')['split']('[splitConfig]');
        const _0x4202f3 = {};
        for (let _0x107b1e = 0x0; _0x107b1e < _0x5e6364['length']; _0x107b1e++) {
            const _0x57a894 = HC_CONSTANTS['TOKEN_MAP'][_0x107b1e] || 'field_' + _0x107b1e;
            let _0x30f234 = jklDecrypt(_0x5e6364[_0x107b1e]);
            if (_0x57a894 === 'sshField' && _0x30f234 && _0x30f234['includes']('z3a_')) {
                try {
                    const _0x3d2df4 = Buffer['from'](_0x30f234['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x30f234 = translateBrailleToAscii(_0x3d2df4);
                } catch (_0x1aaf62) {
                }
            }
            _0x4202f3[_0x57a894] = _0x30f234;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x5c0f2b,
                'password': _0x31858b ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x3a2a55
            },
            'Config': _0x4202f3
        }, null, 0x4);
    } catch (_0x427f8a) {
        return null;
    }
}