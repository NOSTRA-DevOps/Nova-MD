import _0x0_0x507655 from 'crypto';
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
function chacha20Decrypt(_0x3a12b3, _0xc632b9, _0x32bcb5) {
    try {
        const _0x383447 = _0x0_0x507655['createDecipheriv']('chacha20', _0x3a12b3, _0xc632b9);
        _0x383447['setAutoPadding'](![]);
        const _0x5bb2d1 = Buffer['alloc'](0x40);
        _0x383447['update'](_0x5bb2d1);
        return Buffer['concat']([
            _0x383447['update'](_0x32bcb5),
            _0x383447['final']()
        ]);
    } catch (_0x36943f) {
        return null;
    }
}
function translateBrailleToAscii(_0x448c20) {
    if (!_0x448c20)
        return _0x448c20;
    let _0x4e0624 = _0x448c20;
    const _0xb07a8d = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x175c9e => _0x175c9e['startsWith']('⠼'));
    for (const _0x4784de of _0xb07a8d) {
        _0x4e0624 = _0x4e0624['split'](_0x4784de)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x4784de]);
    }
    for (const [_0x3c01c9, _0x3921cc] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x3c01c9['startsWith']('⠼')) {
            _0x4e0624 = _0x4e0624['split'](_0x3c01c9)['join'](_0x3921cc);
        }
    }
    return _0x4e0624;
}
function jklDecrypt(_0x201a87) {
    if (!_0x201a87)
        return _0x201a87;
    try {
        let _0x273484 = _0x201a87;
        while (_0x273484['length'] % 0x4 !== 0x0)
            _0x273484 += '=';
        const _0x6aeaf9 = Buffer['from'](_0x273484, 'base64');
        const _0x3df741 = Buffer['alloc'](_0x6aeaf9['length']);
        const _0x12cc6f = Buffer['from']([
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
        for (let _0x57866b = 0x0; _0x57866b < _0x6aeaf9['length']; _0x57866b++) {
            const _0x419819 = _0x12cc6f[_0x57866b % 0x14];
            _0x3df741[_0x57866b] = ((_0x6aeaf9[_0x57866b] ^ 0xff) & 0xca | _0x6aeaf9[_0x57866b] & 0x35) ^ ((_0x419819 ^ 0xff) & 0xca | _0x419819 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x3df741['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x489f51) {
        return _0x201a87;
    }
}
export function decryptHTTPCustom(_0x26db3a) {
    try {
        const _0x27b762 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x3470be = Buffer['alloc'](_0x26db3a['length']);
        for (let _0x468c1f = 0x0; _0x468c1f < _0x26db3a['length']; _0x468c1f++)
            _0x3470be[_0x468c1f] = _0x26db3a[_0x468c1f] ^ _0x27b762[_0x468c1f % _0x27b762['length']];
        const _0x1a55b3 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x3470be['toString']('utf-8'), 'hex'));
        const _0x572ccf = JSON['parse'](_0x1a55b3['toString']('utf-8'));
        const _0x182c84 = !!_0x572ccf['cfg'];
        const _0x5416b3 = _0x572ccf['cfg'] || {};
        const _0x4de0f4 = _0x572ccf['xy'] || _0x5416b3['content'];
        const _0x4c51d5 = _0x572ccf['a'] || _0x5416b3['hwid'] || '';
        const _0x45ee9f = _0x572ccf['p'] || _0x5416b3['password'] || '';
        const _0x1cf1b0 = _0x572ccf['b'] || _0x5416b3['area'] || '';
        const _0x3ff131 = _0x0_0x507655['createHash']('md5')['update'](_0x4c51d5 + _0x45ee9f + _0x1cf1b0)['digest']();
        const _0x5a009e = Buffer['alloc'](0x8);
        for (let _0x3b0e67 = 0x0; _0x3b0e67 < 0x8; _0x3b0e67++)
            _0x5a009e[_0x3b0e67] = HC_CONSTANTS['STATIC_NONCE'][_0x3b0e67] ^ _0x3ff131[_0x3b0e67 % 0x10];
        let _0x26bf9d = null;
        if (_0x182c84) {
            for (const _0x3e8f3a of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x46efe2 = _0x0_0x507655['createHash']('md5')['update'](_0x3e8f3a)['digest']();
                    const _0xa0a378 = _0x0_0x507655['createDecipheriv']('aes-128-ecb', _0x46efe2, null);
                    _0x26bf9d = Buffer['concat']([
                        _0xa0a378['update'](Buffer['from'](_0x4de0f4, 'hex')),
                        _0xa0a378['final']()
                    ]);
                    if (_0x26bf9d['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x3db3ca) {
                    _0x26bf9d = null;
                }
            }
        }
        if (!_0x26bf9d) {
            _0x26bf9d = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x5a009e, Buffer['from'](_0x4de0f4, 'hex'));
        }
        const _0x2695d1 = _0x26bf9d['toString']('utf-8')['split']('[splitConfig]');
        const _0x342d11 = {};
        for (let _0x110dd3 = 0x0; _0x110dd3 < _0x2695d1['length']; _0x110dd3++) {
            const _0x361a42 = HC_CONSTANTS['TOKEN_MAP'][_0x110dd3] || 'field_' + _0x110dd3;
            let _0x245a50 = jklDecrypt(_0x2695d1[_0x110dd3]);
            if (_0x361a42 === 'sshField' && _0x245a50 && _0x245a50['includes']('z3a_')) {
                try {
                    const _0xb5660a = Buffer['from'](_0x245a50['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x245a50 = translateBrailleToAscii(_0xb5660a);
                } catch (_0x430328) {
                }
            }
            _0x342d11[_0x361a42] = _0x245a50;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x4c51d5,
                'password': _0x45ee9f ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x1cf1b0
            },
            'Config': _0x342d11
        }, null, 0x4);
    } catch (_0x3d3885) {
        return null;
    }
}