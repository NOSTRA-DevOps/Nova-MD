import _0x0_0x3baf35 from 'crypto';
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
function chacha20Decrypt(_0x51272e, _0x3e009a, _0x436083) {
    try {
        const _0x43480e = _0x0_0x3baf35['createDecipheriv']('chacha20', _0x51272e, _0x3e009a);
        _0x43480e['setAutoPadding'](![]);
        const _0x50f921 = Buffer['alloc'](0x40);
        _0x43480e['update'](_0x50f921);
        return Buffer['concat']([
            _0x43480e['update'](_0x436083),
            _0x43480e['final']()
        ]);
    } catch (_0x2876e) {
        return null;
    }
}
function translateBrailleToAscii(_0xe55a11) {
    if (!_0xe55a11)
        return _0xe55a11;
    let _0x31d3fc = _0xe55a11;
    const _0xe2c973 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x72961a => _0x72961a['startsWith']('⠼'));
    for (const _0x4512cb of _0xe2c973) {
        _0x31d3fc = _0x31d3fc['split'](_0x4512cb)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x4512cb]);
    }
    for (const [_0x598303, _0x446e50] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x598303['startsWith']('⠼')) {
            _0x31d3fc = _0x31d3fc['split'](_0x598303)['join'](_0x446e50);
        }
    }
    return _0x31d3fc;
}
function jklDecrypt(_0xa26f11) {
    if (!_0xa26f11)
        return _0xa26f11;
    try {
        let _0x155ee3 = _0xa26f11;
        while (_0x155ee3['length'] % 0x4 !== 0x0)
            _0x155ee3 += '=';
        const _0x598edd = Buffer['from'](_0x155ee3, 'base64');
        const _0x489721 = Buffer['alloc'](_0x598edd['length']);
        const _0x154404 = Buffer['from']([
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
        for (let _0x1f5fee = 0x0; _0x1f5fee < _0x598edd['length']; _0x1f5fee++) {
            const _0x14546f = _0x154404[_0x1f5fee % 0x14];
            _0x489721[_0x1f5fee] = ((_0x598edd[_0x1f5fee] ^ 0xff) & 0xca | _0x598edd[_0x1f5fee] & 0x35) ^ ((_0x14546f ^ 0xff) & 0xca | _0x14546f & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x489721['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x12183a) {
        return _0xa26f11;
    }
}
export function decryptHTTPCustom(_0x4f3060) {
    try {
        const _0x3eeaab = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x105c47 = Buffer['alloc'](_0x4f3060['length']);
        for (let _0x1594b6 = 0x0; _0x1594b6 < _0x4f3060['length']; _0x1594b6++)
            _0x105c47[_0x1594b6] = _0x4f3060[_0x1594b6] ^ _0x3eeaab[_0x1594b6 % _0x3eeaab['length']];
        const _0x50c796 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x105c47['toString']('utf-8'), 'hex'));
        const _0x54cb85 = JSON['parse'](_0x50c796['toString']('utf-8'));
        const _0x14a781 = !!_0x54cb85['cfg'];
        const _0x55f2e5 = _0x54cb85['cfg'] || {};
        const _0x87ac8f = _0x54cb85['xy'] || _0x55f2e5['content'];
        const _0x2112a9 = _0x54cb85['a'] || _0x55f2e5['hwid'] || '';
        const _0x238711 = _0x54cb85['p'] || _0x55f2e5['password'] || '';
        const _0xe13d25 = _0x54cb85['b'] || _0x55f2e5['area'] || '';
        const _0x552b1b = _0x0_0x3baf35['createHash']('md5')['update'](_0x2112a9 + _0x238711 + _0xe13d25)['digest']();
        const _0x1e775c = Buffer['alloc'](0x8);
        for (let _0x26f6c1 = 0x0; _0x26f6c1 < 0x8; _0x26f6c1++)
            _0x1e775c[_0x26f6c1] = HC_CONSTANTS['STATIC_NONCE'][_0x26f6c1] ^ _0x552b1b[_0x26f6c1 % 0x10];
        let _0x4a87a6 = null;
        if (_0x14a781) {
            for (const _0x40074e of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x3d768c = _0x0_0x3baf35['createHash']('md5')['update'](_0x40074e)['digest']();
                    const _0x5c3808 = _0x0_0x3baf35['createDecipheriv']('aes-128-ecb', _0x3d768c, null);
                    _0x4a87a6 = Buffer['concat']([
                        _0x5c3808['update'](Buffer['from'](_0x87ac8f, 'hex')),
                        _0x5c3808['final']()
                    ]);
                    if (_0x4a87a6['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x36b6ee) {
                    _0x4a87a6 = null;
                }
            }
        }
        if (!_0x4a87a6) {
            _0x4a87a6 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x1e775c, Buffer['from'](_0x87ac8f, 'hex'));
        }
        const _0x87761e = _0x4a87a6['toString']('utf-8')['split']('[splitConfig]');
        const _0x4770cc = {};
        for (let _0x318f86 = 0x0; _0x318f86 < _0x87761e['length']; _0x318f86++) {
            const _0x5447b2 = HC_CONSTANTS['TOKEN_MAP'][_0x318f86] || 'field_' + _0x318f86;
            let _0xa2681e = jklDecrypt(_0x87761e[_0x318f86]);
            if (_0x5447b2 === 'sshField' && _0xa2681e && _0xa2681e['includes']('z3a_')) {
                try {
                    const _0x4db006 = Buffer['from'](_0xa2681e['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0xa2681e = translateBrailleToAscii(_0x4db006);
                } catch (_0x35b7ba) {
                }
            }
            _0x4770cc[_0x5447b2] = _0xa2681e;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x2112a9,
                'password': _0x238711 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0xe13d25
            },
            'Config': _0x4770cc
        }, null, 0x4);
    } catch (_0x256afe) {
        return null;
    }
}