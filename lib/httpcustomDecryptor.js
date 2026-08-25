import _0x0_0x495b24 from 'crypto';
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
function chacha20Decrypt(_0x5dc502, _0xd8c328, _0xd9be73) {
    try {
        const _0x90ca47 = _0x0_0x495b24['createDecipheriv']('chacha20', _0x5dc502, _0xd8c328);
        _0x90ca47['setAutoPadding'](![]);
        const _0x5eadd6 = Buffer['alloc'](0x40);
        _0x90ca47['update'](_0x5eadd6);
        return Buffer['concat']([
            _0x90ca47['update'](_0xd9be73),
            _0x90ca47['final']()
        ]);
    } catch (_0x4465ca) {
        return null;
    }
}
function translateBrailleToAscii(_0x26134d) {
    if (!_0x26134d)
        return _0x26134d;
    let _0x3d6a00 = _0x26134d;
    const _0xa247fd = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x1d996a => _0x1d996a['startsWith']('⠼'));
    for (const _0xa4aea9 of _0xa247fd) {
        _0x3d6a00 = _0x3d6a00['split'](_0xa4aea9)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0xa4aea9]);
    }
    for (const [_0x23dcdd, _0x2aea6e] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x23dcdd['startsWith']('⠼')) {
            _0x3d6a00 = _0x3d6a00['split'](_0x23dcdd)['join'](_0x2aea6e);
        }
    }
    return _0x3d6a00;
}
function jklDecrypt(_0x3046b4) {
    if (!_0x3046b4)
        return _0x3046b4;
    try {
        let _0x304d4a = _0x3046b4;
        while (_0x304d4a['length'] % 0x4 !== 0x0)
            _0x304d4a += '=';
        const _0x4ed49f = Buffer['from'](_0x304d4a, 'base64');
        const _0x166014 = Buffer['alloc'](_0x4ed49f['length']);
        const _0x17fea8 = Buffer['from']([
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
        for (let _0x523097 = 0x0; _0x523097 < _0x4ed49f['length']; _0x523097++) {
            const _0x5e02e0 = _0x17fea8[_0x523097 % 0x14];
            _0x166014[_0x523097] = ((_0x4ed49f[_0x523097] ^ 0xff) & 0xca | _0x4ed49f[_0x523097] & 0x35) ^ ((_0x5e02e0 ^ 0xff) & 0xca | _0x5e02e0 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x166014['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x2d387c) {
        return _0x3046b4;
    }
}
export function decryptHTTPCustom(_0x3a8021) {
    try {
        const _0x490c1d = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x505f60 = Buffer['alloc'](_0x3a8021['length']);
        for (let _0x120ec5 = 0x0; _0x120ec5 < _0x3a8021['length']; _0x120ec5++)
            _0x505f60[_0x120ec5] = _0x3a8021[_0x120ec5] ^ _0x490c1d[_0x120ec5 % _0x490c1d['length']];
        const _0x247887 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x505f60['toString']('utf-8'), 'hex'));
        const _0x2ced3b = JSON['parse'](_0x247887['toString']('utf-8'));
        const _0x101b99 = !!_0x2ced3b['cfg'];
        const _0x31eaf6 = _0x2ced3b['cfg'] || {};
        const _0x5c764a = _0x2ced3b['xy'] || _0x31eaf6['content'];
        const _0x456659 = _0x2ced3b['a'] || _0x31eaf6['hwid'] || '';
        const _0x330211 = _0x2ced3b['p'] || _0x31eaf6['password'] || '';
        const _0x43232f = _0x2ced3b['b'] || _0x31eaf6['area'] || '';
        const _0x905e0c = _0x0_0x495b24['createHash']('md5')['update'](_0x456659 + _0x330211 + _0x43232f)['digest']();
        const _0x16881d = Buffer['alloc'](0x8);
        for (let _0x458324 = 0x0; _0x458324 < 0x8; _0x458324++)
            _0x16881d[_0x458324] = HC_CONSTANTS['STATIC_NONCE'][_0x458324] ^ _0x905e0c[_0x458324 % 0x10];
        let _0xa0e5d2 = null;
        if (_0x101b99) {
            for (const _0x2101df of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x89f21b = _0x0_0x495b24['createHash']('md5')['update'](_0x2101df)['digest']();
                    const _0x3ec248 = _0x0_0x495b24['createDecipheriv']('aes-128-ecb', _0x89f21b, null);
                    _0xa0e5d2 = Buffer['concat']([
                        _0x3ec248['update'](Buffer['from'](_0x5c764a, 'hex')),
                        _0x3ec248['final']()
                    ]);
                    if (_0xa0e5d2['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x45c157) {
                    _0xa0e5d2 = null;
                }
            }
        }
        if (!_0xa0e5d2) {
            _0xa0e5d2 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x16881d, Buffer['from'](_0x5c764a, 'hex'));
        }
        const _0x217aa5 = _0xa0e5d2['toString']('utf-8')['split']('[splitConfig]');
        const _0x1aba6f = {};
        for (let _0x32d8da = 0x0; _0x32d8da < _0x217aa5['length']; _0x32d8da++) {
            const _0x8e71c5 = HC_CONSTANTS['TOKEN_MAP'][_0x32d8da] || 'field_' + _0x32d8da;
            let _0x539e13 = jklDecrypt(_0x217aa5[_0x32d8da]);
            if (_0x8e71c5 === 'sshField' && _0x539e13 && _0x539e13['includes']('z3a_')) {
                try {
                    const _0x5557fb = Buffer['from'](_0x539e13['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x539e13 = translateBrailleToAscii(_0x5557fb);
                } catch (_0x32ca50) {
                }
            }
            _0x1aba6f[_0x8e71c5] = _0x539e13;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x456659,
                'password': _0x330211 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x43232f
            },
            'Config': _0x1aba6f
        }, null, 0x4);
    } catch (_0x5072db) {
        return null;
    }
}