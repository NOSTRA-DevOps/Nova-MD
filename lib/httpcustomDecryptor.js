import _0x0_0x23e00a from 'crypto';
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
function chacha20Decrypt(_0x3c04a7, _0x3b6300, _0x35ec2) {
    try {
        const _0x28bc28 = _0x0_0x23e00a['createDecipheriv']('chacha20', _0x3c04a7, _0x3b6300);
        _0x28bc28['setAutoPadding'](![]);
        const _0x367d43 = Buffer['alloc'](0x40);
        _0x28bc28['update'](_0x367d43);
        return Buffer['concat']([
            _0x28bc28['update'](_0x35ec2),
            _0x28bc28['final']()
        ]);
    } catch (_0x4fc0d) {
        return null;
    }
}
function translateBrailleToAscii(_0x5ad304) {
    if (!_0x5ad304)
        return _0x5ad304;
    let _0x3e30c6 = _0x5ad304;
    const _0x25ca8b = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x364012 => _0x364012['startsWith']('⠼'));
    for (const _0x30f752 of _0x25ca8b) {
        _0x3e30c6 = _0x3e30c6['split'](_0x30f752)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x30f752]);
    }
    for (const [_0x345894, _0x190b50] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x345894['startsWith']('⠼')) {
            _0x3e30c6 = _0x3e30c6['split'](_0x345894)['join'](_0x190b50);
        }
    }
    return _0x3e30c6;
}
function jklDecrypt(_0x30cf49) {
    if (!_0x30cf49)
        return _0x30cf49;
    try {
        let _0x8114c8 = _0x30cf49;
        while (_0x8114c8['length'] % 0x4 !== 0x0)
            _0x8114c8 += '=';
        const _0x316cc7 = Buffer['from'](_0x8114c8, 'base64');
        const _0x584744 = Buffer['alloc'](_0x316cc7['length']);
        const _0x49e883 = Buffer['from']([
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
        for (let _0x160eb4 = 0x0; _0x160eb4 < _0x316cc7['length']; _0x160eb4++) {
            const _0x12a4f9 = _0x49e883[_0x160eb4 % 0x14];
            _0x584744[_0x160eb4] = ((_0x316cc7[_0x160eb4] ^ 0xff) & 0xca | _0x316cc7[_0x160eb4] & 0x35) ^ ((_0x12a4f9 ^ 0xff) & 0xca | _0x12a4f9 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x584744['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x2cb948) {
        return _0x30cf49;
    }
}
export function decryptHTTPCustom(_0x50e4f5) {
    try {
        const _0x32b7a7 = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x1a6d25 = Buffer['alloc'](_0x50e4f5['length']);
        for (let _0x4d7752 = 0x0; _0x4d7752 < _0x50e4f5['length']; _0x4d7752++)
            _0x1a6d25[_0x4d7752] = _0x50e4f5[_0x4d7752] ^ _0x32b7a7[_0x4d7752 % _0x32b7a7['length']];
        const _0x26284a = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x1a6d25['toString']('utf-8'), 'hex'));
        const _0x1ac481 = JSON['parse'](_0x26284a['toString']('utf-8'));
        const _0x1690b5 = !!_0x1ac481['cfg'];
        const _0x2f24ce = _0x1ac481['cfg'] || {};
        const _0x1f4730 = _0x1ac481['xy'] || _0x2f24ce['content'];
        const _0x3c2fd6 = _0x1ac481['a'] || _0x2f24ce['hwid'] || '';
        const _0x59fe49 = _0x1ac481['p'] || _0x2f24ce['password'] || '';
        const _0x1d1381 = _0x1ac481['b'] || _0x2f24ce['area'] || '';
        const _0x427c51 = _0x0_0x23e00a['createHash']('md5')['update'](_0x3c2fd6 + _0x59fe49 + _0x1d1381)['digest']();
        const _0x3b67c7 = Buffer['alloc'](0x8);
        for (let _0x480d11 = 0x0; _0x480d11 < 0x8; _0x480d11++)
            _0x3b67c7[_0x480d11] = HC_CONSTANTS['STATIC_NONCE'][_0x480d11] ^ _0x427c51[_0x480d11 % 0x10];
        let _0x438218 = null;
        if (_0x1690b5) {
            for (const _0x490dc of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x24c295 = _0x0_0x23e00a['createHash']('md5')['update'](_0x490dc)['digest']();
                    const _0x5c4a88 = _0x0_0x23e00a['createDecipheriv']('aes-128-ecb', _0x24c295, null);
                    _0x438218 = Buffer['concat']([
                        _0x5c4a88['update'](Buffer['from'](_0x1f4730, 'hex')),
                        _0x5c4a88['final']()
                    ]);
                    if (_0x438218['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x1ffd13) {
                    _0x438218 = null;
                }
            }
        }
        if (!_0x438218) {
            _0x438218 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x3b67c7, Buffer['from'](_0x1f4730, 'hex'));
        }
        const _0x408f11 = _0x438218['toString']('utf-8')['split']('[splitConfig]');
        const _0x36ed22 = {};
        for (let _0x1e2751 = 0x0; _0x1e2751 < _0x408f11['length']; _0x1e2751++) {
            const _0x5619c4 = HC_CONSTANTS['TOKEN_MAP'][_0x1e2751] || 'field_' + _0x1e2751;
            let _0xbbe20d = jklDecrypt(_0x408f11[_0x1e2751]);
            if (_0x5619c4 === 'sshField' && _0xbbe20d && _0xbbe20d['includes']('z3a_')) {
                try {
                    const _0x2de4da = Buffer['from'](_0xbbe20d['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0xbbe20d = translateBrailleToAscii(_0x2de4da);
                } catch (_0x47a8ae) {
                }
            }
            _0x36ed22[_0x5619c4] = _0xbbe20d;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x3c2fd6,
                'password': _0x59fe49 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x1d1381
            },
            'Config': _0x36ed22
        }, null, 0x4);
    } catch (_0x473044) {
        return null;
    }
}