import _0x0_0x295fdc from 'crypto';
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
function chacha20Decrypt(_0x357cfd, _0x57c742, _0x2271cf) {
    try {
        const _0x35ba2d = _0x0_0x295fdc['createDecipheriv']('chacha20', _0x357cfd, _0x57c742);
        _0x35ba2d['setAutoPadding'](![]);
        const _0x39f1c6 = Buffer['alloc'](0x40);
        _0x35ba2d['update'](_0x39f1c6);
        return Buffer['concat']([
            _0x35ba2d['update'](_0x2271cf),
            _0x35ba2d['final']()
        ]);
    } catch (_0x5edee8) {
        return null;
    }
}
function translateBrailleToAscii(_0x19b4dd) {
    if (!_0x19b4dd)
        return _0x19b4dd;
    let _0x5b6f16 = _0x19b4dd;
    const _0x2c25ea = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x579a90 => _0x579a90['startsWith']('⠼'));
    for (const _0x436b45 of _0x2c25ea) {
        _0x5b6f16 = _0x5b6f16['split'](_0x436b45)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x436b45]);
    }
    for (const [_0x825fc4, _0x4adb01] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x825fc4['startsWith']('⠼')) {
            _0x5b6f16 = _0x5b6f16['split'](_0x825fc4)['join'](_0x4adb01);
        }
    }
    return _0x5b6f16;
}
function jklDecrypt(_0x1e9754) {
    if (!_0x1e9754)
        return _0x1e9754;
    try {
        let _0x5cada8 = _0x1e9754;
        while (_0x5cada8['length'] % 0x4 !== 0x0)
            _0x5cada8 += '=';
        const _0x1a97a0 = Buffer['from'](_0x5cada8, 'base64');
        const _0x390119 = Buffer['alloc'](_0x1a97a0['length']);
        const _0x1e2f87 = Buffer['from']([
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
        for (let _0x21580d = 0x0; _0x21580d < _0x1a97a0['length']; _0x21580d++) {
            const _0x46f70d = _0x1e2f87[_0x21580d % 0x14];
            _0x390119[_0x21580d] = ((_0x1a97a0[_0x21580d] ^ 0xff) & 0xca | _0x1a97a0[_0x21580d] & 0x35) ^ ((_0x46f70d ^ 0xff) & 0xca | _0x46f70d & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x390119['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x249f2b) {
        return _0x1e9754;
    }
}
export function decryptHTTPCustom(_0xbab41c) {
    try {
        const _0x5bfbd1 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x5f4eaa = Buffer['alloc'](_0xbab41c['length']);
        for (let _0x32e503 = 0x0; _0x32e503 < _0xbab41c['length']; _0x32e503++)
            _0x5f4eaa[_0x32e503] = _0xbab41c[_0x32e503] ^ _0x5bfbd1[_0x32e503 % _0x5bfbd1['length']];
        const _0x239fc9 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x5f4eaa['toString']('utf-8'), 'hex'));
        const _0x261351 = JSON['parse'](_0x239fc9['toString']('utf-8'));
        const _0x2840be = !!_0x261351['cfg'];
        const _0x488108 = _0x261351['cfg'] || {};
        const _0x216018 = _0x261351['xy'] || _0x488108['content'];
        const _0x2cb0dd = _0x261351['a'] || _0x488108['hwid'] || '';
        const _0x390391 = _0x261351['p'] || _0x488108['password'] || '';
        const _0x2af6d0 = _0x261351['b'] || _0x488108['area'] || '';
        const _0x438b48 = _0x0_0x295fdc['createHash']('md5')['update'](_0x2cb0dd + _0x390391 + _0x2af6d0)['digest']();
        const _0x3df5f8 = Buffer['alloc'](0x8);
        for (let _0x4158b5 = 0x0; _0x4158b5 < 0x8; _0x4158b5++)
            _0x3df5f8[_0x4158b5] = HC_CONSTANTS['STATIC_NONCE'][_0x4158b5] ^ _0x438b48[_0x4158b5 % 0x10];
        let _0x290650 = null;
        if (_0x2840be) {
            for (const _0x2fdd6e of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x49a7fd = _0x0_0x295fdc['createHash']('md5')['update'](_0x2fdd6e)['digest']();
                    const _0x12b683 = _0x0_0x295fdc['createDecipheriv']('aes-128-ecb', _0x49a7fd, null);
                    _0x290650 = Buffer['concat']([
                        _0x12b683['update'](Buffer['from'](_0x216018, 'hex')),
                        _0x12b683['final']()
                    ]);
                    if (_0x290650['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x589057) {
                    _0x290650 = null;
                }
            }
        }
        if (!_0x290650) {
            _0x290650 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x3df5f8, Buffer['from'](_0x216018, 'hex'));
        }
        const _0x37dfa5 = _0x290650['toString']('utf-8')['split']('[splitConfig]');
        const _0x2ec4f0 = {};
        for (let _0x141a10 = 0x0; _0x141a10 < _0x37dfa5['length']; _0x141a10++) {
            const _0x1c17f2 = HC_CONSTANTS['TOKEN_MAP'][_0x141a10] || 'field_' + _0x141a10;
            let _0x1f6670 = jklDecrypt(_0x37dfa5[_0x141a10]);
            if (_0x1c17f2 === 'sshField' && _0x1f6670 && _0x1f6670['includes']('z3a_')) {
                try {
                    const _0x2a8c79 = Buffer['from'](_0x1f6670['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x1f6670 = translateBrailleToAscii(_0x2a8c79);
                } catch (_0x46bcbb) {
                }
            }
            _0x2ec4f0[_0x1c17f2] = _0x1f6670;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x2cb0dd,
                'password': _0x390391 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x2af6d0
            },
            'Config': _0x2ec4f0
        }, null, 0x4);
    } catch (_0x290655) {
        return null;
    }
}