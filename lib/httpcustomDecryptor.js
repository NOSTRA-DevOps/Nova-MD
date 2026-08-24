import _0x0_0x159655 from 'crypto';
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
function chacha20Decrypt(_0x5aaeb5, _0x21bc91, _0x11ba96) {
    try {
        const _0x4fd63 = _0x0_0x159655['createDecipheriv']('chacha20', _0x5aaeb5, _0x21bc91);
        _0x4fd63['setAutoPadding'](![]);
        const _0x228585 = Buffer['alloc'](0x40);
        _0x4fd63['update'](_0x228585);
        return Buffer['concat']([
            _0x4fd63['update'](_0x11ba96),
            _0x4fd63['final']()
        ]);
    } catch (_0x1c07b) {
        return null;
    }
}
function translateBrailleToAscii(_0x41aded) {
    if (!_0x41aded)
        return _0x41aded;
    let _0x53606f = _0x41aded;
    const _0x1e25e3 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x1d3a8d => _0x1d3a8d['startsWith']('⠼'));
    for (const _0x516449 of _0x1e25e3) {
        _0x53606f = _0x53606f['split'](_0x516449)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x516449]);
    }
    for (const [_0x15bbdf, _0x59d557] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x15bbdf['startsWith']('⠼')) {
            _0x53606f = _0x53606f['split'](_0x15bbdf)['join'](_0x59d557);
        }
    }
    return _0x53606f;
}
function jklDecrypt(_0x26bdb5) {
    if (!_0x26bdb5)
        return _0x26bdb5;
    try {
        let _0x8e7f81 = _0x26bdb5;
        while (_0x8e7f81['length'] % 0x4 !== 0x0)
            _0x8e7f81 += '=';
        const _0x4eeab9 = Buffer['from'](_0x8e7f81, 'base64');
        const _0x450307 = Buffer['alloc'](_0x4eeab9['length']);
        const _0x32e0b4 = Buffer['from']([
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
        for (let _0x2b1291 = 0x0; _0x2b1291 < _0x4eeab9['length']; _0x2b1291++) {
            const _0x54a2c6 = _0x32e0b4[_0x2b1291 % 0x14];
            _0x450307[_0x2b1291] = ((_0x4eeab9[_0x2b1291] ^ 0xff) & 0xca | _0x4eeab9[_0x2b1291] & 0x35) ^ ((_0x54a2c6 ^ 0xff) & 0xca | _0x54a2c6 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x450307['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x2b432f) {
        return _0x26bdb5;
    }
}
export function decryptHTTPCustom(_0x3821e0) {
    try {
        const _0x5d1d5c = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x339647 = Buffer['alloc'](_0x3821e0['length']);
        for (let _0x52b112 = 0x0; _0x52b112 < _0x3821e0['length']; _0x52b112++)
            _0x339647[_0x52b112] = _0x3821e0[_0x52b112] ^ _0x5d1d5c[_0x52b112 % _0x5d1d5c['length']];
        const _0x2b1477 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x339647['toString']('utf-8'), 'hex'));
        const _0x5b08b5 = JSON['parse'](_0x2b1477['toString']('utf-8'));
        const _0x46a295 = !!_0x5b08b5['cfg'];
        const _0x357339 = _0x5b08b5['cfg'] || {};
        const _0x53fae6 = _0x5b08b5['xy'] || _0x357339['content'];
        const _0xf2080e = _0x5b08b5['a'] || _0x357339['hwid'] || '';
        const _0x2f5c9a = _0x5b08b5['p'] || _0x357339['password'] || '';
        const _0xb72bc1 = _0x5b08b5['b'] || _0x357339['area'] || '';
        const _0x374597 = _0x0_0x159655['createHash']('md5')['update'](_0xf2080e + _0x2f5c9a + _0xb72bc1)['digest']();
        const _0x259816 = Buffer['alloc'](0x8);
        for (let _0x5b0228 = 0x0; _0x5b0228 < 0x8; _0x5b0228++)
            _0x259816[_0x5b0228] = HC_CONSTANTS['STATIC_NONCE'][_0x5b0228] ^ _0x374597[_0x5b0228 % 0x10];
        let _0x348dcd = null;
        if (_0x46a295) {
            for (const _0x10e6bc of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x76ba05 = _0x0_0x159655['createHash']('md5')['update'](_0x10e6bc)['digest']();
                    const _0x302259 = _0x0_0x159655['createDecipheriv']('aes-128-ecb', _0x76ba05, null);
                    _0x348dcd = Buffer['concat']([
                        _0x302259['update'](Buffer['from'](_0x53fae6, 'hex')),
                        _0x302259['final']()
                    ]);
                    if (_0x348dcd['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x2b9a47) {
                    _0x348dcd = null;
                }
            }
        }
        if (!_0x348dcd) {
            _0x348dcd = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x259816, Buffer['from'](_0x53fae6, 'hex'));
        }
        const _0x29b722 = _0x348dcd['toString']('utf-8')['split']('[splitConfig]');
        const _0x431811 = {};
        for (let _0x2ccb35 = 0x0; _0x2ccb35 < _0x29b722['length']; _0x2ccb35++) {
            const _0x7f7827 = HC_CONSTANTS['TOKEN_MAP'][_0x2ccb35] || 'field_' + _0x2ccb35;
            let _0x2440bd = jklDecrypt(_0x29b722[_0x2ccb35]);
            if (_0x7f7827 === 'sshField' && _0x2440bd && _0x2440bd['includes']('z3a_')) {
                try {
                    const _0x42bc52 = Buffer['from'](_0x2440bd['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x2440bd = translateBrailleToAscii(_0x42bc52);
                } catch (_0x2c37bc) {
                }
            }
            _0x431811[_0x7f7827] = _0x2440bd;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0xf2080e,
                'password': _0x2f5c9a ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0xb72bc1
            },
            'Config': _0x431811
        }, null, 0x4);
    } catch (_0x2a4a38) {
        return null;
    }
}