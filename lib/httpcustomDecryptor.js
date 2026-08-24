import _0x0_0x5338d7 from 'crypto';
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
function chacha20Decrypt(_0x2f1ac5, _0x3ddd9c, _0x236719) {
    try {
        const _0x6c987a = _0x0_0x5338d7['createDecipheriv']('chacha20', _0x2f1ac5, _0x3ddd9c);
        _0x6c987a['setAutoPadding'](![]);
        const _0x4551ab = Buffer['alloc'](0x40);
        _0x6c987a['update'](_0x4551ab);
        return Buffer['concat']([
            _0x6c987a['update'](_0x236719),
            _0x6c987a['final']()
        ]);
    } catch (_0x536453) {
        return null;
    }
}
function translateBrailleToAscii(_0x7501cd) {
    if (!_0x7501cd)
        return _0x7501cd;
    let _0x2497aa = _0x7501cd;
    const _0x47d3d6 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x1347ea => _0x1347ea['startsWith']('⠼'));
    for (const _0xa2c8fd of _0x47d3d6) {
        _0x2497aa = _0x2497aa['split'](_0xa2c8fd)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0xa2c8fd]);
    }
    for (const [_0x591883, _0x3519fb] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x591883['startsWith']('⠼')) {
            _0x2497aa = _0x2497aa['split'](_0x591883)['join'](_0x3519fb);
        }
    }
    return _0x2497aa;
}
function jklDecrypt(_0x51fa9c) {
    if (!_0x51fa9c)
        return _0x51fa9c;
    try {
        let _0x324a95 = _0x51fa9c;
        while (_0x324a95['length'] % 0x4 !== 0x0)
            _0x324a95 += '=';
        const _0x466805 = Buffer['from'](_0x324a95, 'base64');
        const _0x40bcb7 = Buffer['alloc'](_0x466805['length']);
        const _0x1535c1 = Buffer['from']([
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
        for (let _0xa3af40 = 0x0; _0xa3af40 < _0x466805['length']; _0xa3af40++) {
            const _0x10fef9 = _0x1535c1[_0xa3af40 % 0x14];
            _0x40bcb7[_0xa3af40] = ((_0x466805[_0xa3af40] ^ 0xff) & 0xca | _0x466805[_0xa3af40] & 0x35) ^ ((_0x10fef9 ^ 0xff) & 0xca | _0x10fef9 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x40bcb7['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x40eb3c) {
        return _0x51fa9c;
    }
}
export function decryptHTTPCustom(_0x47d1fe) {
    try {
        const _0x1ad0a4 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x403e9d = Buffer['alloc'](_0x47d1fe['length']);
        for (let _0x74ee = 0x0; _0x74ee < _0x47d1fe['length']; _0x74ee++)
            _0x403e9d[_0x74ee] = _0x47d1fe[_0x74ee] ^ _0x1ad0a4[_0x74ee % _0x1ad0a4['length']];
        const _0x28a61d = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x403e9d['toString']('utf-8'), 'hex'));
        const _0x1aae6a = JSON['parse'](_0x28a61d['toString']('utf-8'));
        const _0x86ffdf = !!_0x1aae6a['cfg'];
        const _0x278bf2 = _0x1aae6a['cfg'] || {};
        const _0x41551a = _0x1aae6a['xy'] || _0x278bf2['content'];
        const _0x52c2bb = _0x1aae6a['a'] || _0x278bf2['hwid'] || '';
        const _0x5a0e43 = _0x1aae6a['p'] || _0x278bf2['password'] || '';
        const _0x262f91 = _0x1aae6a['b'] || _0x278bf2['area'] || '';
        const _0x74c1a2 = _0x0_0x5338d7['createHash']('md5')['update'](_0x52c2bb + _0x5a0e43 + _0x262f91)['digest']();
        const _0x5ab538 = Buffer['alloc'](0x8);
        for (let _0x2fccbd = 0x0; _0x2fccbd < 0x8; _0x2fccbd++)
            _0x5ab538[_0x2fccbd] = HC_CONSTANTS['STATIC_NONCE'][_0x2fccbd] ^ _0x74c1a2[_0x2fccbd % 0x10];
        let _0x3a5c12 = null;
        if (_0x86ffdf) {
            for (const _0x27a398 of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x38e2e7 = _0x0_0x5338d7['createHash']('md5')['update'](_0x27a398)['digest']();
                    const _0x28b228 = _0x0_0x5338d7['createDecipheriv']('aes-128-ecb', _0x38e2e7, null);
                    _0x3a5c12 = Buffer['concat']([
                        _0x28b228['update'](Buffer['from'](_0x41551a, 'hex')),
                        _0x28b228['final']()
                    ]);
                    if (_0x3a5c12['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x2ed4b4) {
                    _0x3a5c12 = null;
                }
            }
        }
        if (!_0x3a5c12) {
            _0x3a5c12 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x5ab538, Buffer['from'](_0x41551a, 'hex'));
        }
        const _0x4fe2bc = _0x3a5c12['toString']('utf-8')['split']('[splitConfig]');
        const _0x160848 = {};
        for (let _0x380ceb = 0x0; _0x380ceb < _0x4fe2bc['length']; _0x380ceb++) {
            const _0x2da159 = HC_CONSTANTS['TOKEN_MAP'][_0x380ceb] || 'field_' + _0x380ceb;
            let _0x505365 = jklDecrypt(_0x4fe2bc[_0x380ceb]);
            if (_0x2da159 === 'sshField' && _0x505365 && _0x505365['includes']('z3a_')) {
                try {
                    const _0x15c0ad = Buffer['from'](_0x505365['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x505365 = translateBrailleToAscii(_0x15c0ad);
                } catch (_0x27e719) {
                }
            }
            _0x160848[_0x2da159] = _0x505365;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x52c2bb,
                'password': _0x5a0e43 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x262f91
            },
            'Config': _0x160848
        }, null, 0x4);
    } catch (_0x3e18fe) {
        return null;
    }
}