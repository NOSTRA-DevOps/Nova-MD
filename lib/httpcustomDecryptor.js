import _0x0_0x31b8bb from 'crypto';
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
function chacha20Decrypt(_0x38a74a, _0x12d7ff, _0x3f2e4c) {
    try {
        const _0x97349e = _0x0_0x31b8bb['createDecipheriv']('chacha20', _0x38a74a, _0x12d7ff);
        _0x97349e['setAutoPadding'](![]);
        const _0x51647d = Buffer['alloc'](0x40);
        _0x97349e['update'](_0x51647d);
        return Buffer['concat']([
            _0x97349e['update'](_0x3f2e4c),
            _0x97349e['final']()
        ]);
    } catch (_0xb80543) {
        return null;
    }
}
function translateBrailleToAscii(_0xd8cf23) {
    if (!_0xd8cf23)
        return _0xd8cf23;
    let _0x17c986 = _0xd8cf23;
    const _0x15109e = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x5b8b2c => _0x5b8b2c['startsWith']('⠼'));
    for (const _0x23c3a7 of _0x15109e) {
        _0x17c986 = _0x17c986['split'](_0x23c3a7)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x23c3a7]);
    }
    for (const [_0x1f0c53, _0x12de90] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x1f0c53['startsWith']('⠼')) {
            _0x17c986 = _0x17c986['split'](_0x1f0c53)['join'](_0x12de90);
        }
    }
    return _0x17c986;
}
function jklDecrypt(_0x28b885) {
    if (!_0x28b885)
        return _0x28b885;
    try {
        let _0x12b53d = _0x28b885;
        while (_0x12b53d['length'] % 0x4 !== 0x0)
            _0x12b53d += '=';
        const _0x5bb3c8 = Buffer['from'](_0x12b53d, 'base64');
        const _0x245091 = Buffer['alloc'](_0x5bb3c8['length']);
        const _0x4c18ee = Buffer['from']([
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
        for (let _0x3b6b91 = 0x0; _0x3b6b91 < _0x5bb3c8['length']; _0x3b6b91++) {
            const _0x51884a = _0x4c18ee[_0x3b6b91 % 0x14];
            _0x245091[_0x3b6b91] = ((_0x5bb3c8[_0x3b6b91] ^ 0xff) & 0xca | _0x5bb3c8[_0x3b6b91] & 0x35) ^ ((_0x51884a ^ 0xff) & 0xca | _0x51884a & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x245091['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x347069) {
        return _0x28b885;
    }
}
export function decryptHTTPCustom(_0x2776bf) {
    try {
        const _0x44b088 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x45b6f5 = Buffer['alloc'](_0x2776bf['length']);
        for (let _0x3e04c6 = 0x0; _0x3e04c6 < _0x2776bf['length']; _0x3e04c6++)
            _0x45b6f5[_0x3e04c6] = _0x2776bf[_0x3e04c6] ^ _0x44b088[_0x3e04c6 % _0x44b088['length']];
        const _0x384904 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x45b6f5['toString']('utf-8'), 'hex'));
        const _0x50553f = JSON['parse'](_0x384904['toString']('utf-8'));
        const _0x13d688 = !!_0x50553f['cfg'];
        const _0x1da7d7 = _0x50553f['cfg'] || {};
        const _0x37a2a1 = _0x50553f['xy'] || _0x1da7d7['content'];
        const _0x24d333 = _0x50553f['a'] || _0x1da7d7['hwid'] || '';
        const _0x3a2fbe = _0x50553f['p'] || _0x1da7d7['password'] || '';
        const _0x5e32f9 = _0x50553f['b'] || _0x1da7d7['area'] || '';
        const _0x321823 = _0x0_0x31b8bb['createHash']('md5')['update'](_0x24d333 + _0x3a2fbe + _0x5e32f9)['digest']();
        const _0x19565a = Buffer['alloc'](0x8);
        for (let _0xe341fb = 0x0; _0xe341fb < 0x8; _0xe341fb++)
            _0x19565a[_0xe341fb] = HC_CONSTANTS['STATIC_NONCE'][_0xe341fb] ^ _0x321823[_0xe341fb % 0x10];
        let _0x192fc7 = null;
        if (_0x13d688) {
            for (const _0xa6594f of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0xa1cf6f = _0x0_0x31b8bb['createHash']('md5')['update'](_0xa6594f)['digest']();
                    const _0x15d90e = _0x0_0x31b8bb['createDecipheriv']('aes-128-ecb', _0xa1cf6f, null);
                    _0x192fc7 = Buffer['concat']([
                        _0x15d90e['update'](Buffer['from'](_0x37a2a1, 'hex')),
                        _0x15d90e['final']()
                    ]);
                    if (_0x192fc7['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x3d7a12) {
                    _0x192fc7 = null;
                }
            }
        }
        if (!_0x192fc7) {
            _0x192fc7 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x19565a, Buffer['from'](_0x37a2a1, 'hex'));
        }
        const _0x55afed = _0x192fc7['toString']('utf-8')['split']('[splitConfig]');
        const _0x1d45b0 = {};
        for (let _0x2df223 = 0x0; _0x2df223 < _0x55afed['length']; _0x2df223++) {
            const _0x35bbc0 = HC_CONSTANTS['TOKEN_MAP'][_0x2df223] || 'field_' + _0x2df223;
            let _0x30ae27 = jklDecrypt(_0x55afed[_0x2df223]);
            if (_0x35bbc0 === 'sshField' && _0x30ae27 && _0x30ae27['includes']('z3a_')) {
                try {
                    const _0xa6abc6 = Buffer['from'](_0x30ae27['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x30ae27 = translateBrailleToAscii(_0xa6abc6);
                } catch (_0x1678f8) {
                }
            }
            _0x1d45b0[_0x35bbc0] = _0x30ae27;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x24d333,
                'password': _0x3a2fbe ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x5e32f9
            },
            'Config': _0x1d45b0
        }, null, 0x4);
    } catch (_0x25394d) {
        return null;
    }
}