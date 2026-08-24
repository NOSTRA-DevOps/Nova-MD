import _0x0_0x29d926 from 'crypto';
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
function chacha20Decrypt(_0xc4146a, _0x2b7eac, _0x48e182) {
    try {
        const _0x3ab632 = _0x0_0x29d926['createDecipheriv']('chacha20', _0xc4146a, _0x2b7eac);
        _0x3ab632['setAutoPadding'](![]);
        const _0x136cff = Buffer['alloc'](0x40);
        _0x3ab632['update'](_0x136cff);
        return Buffer['concat']([
            _0x3ab632['update'](_0x48e182),
            _0x3ab632['final']()
        ]);
    } catch (_0x1287eb) {
        return null;
    }
}
function translateBrailleToAscii(_0x1d714e) {
    if (!_0x1d714e)
        return _0x1d714e;
    let _0x41ab18 = _0x1d714e;
    const _0x3d89c2 = Object['keys'](HC_CONSTANTS['BRAILLE_MAP'])['filter'](_0x15ebed => _0x15ebed['startsWith']('⠼'));
    for (const _0x1de162 of _0x3d89c2) {
        _0x41ab18 = _0x41ab18['split'](_0x1de162)['join'](HC_CONSTANTS['BRAILLE_MAP'][_0x1de162]);
    }
    for (const [_0x9b4c6d, _0x315bcc] of Object['entries'](HC_CONSTANTS['BRAILLE_MAP'])) {
        if (!_0x9b4c6d['startsWith']('⠼')) {
            _0x41ab18 = _0x41ab18['split'](_0x9b4c6d)['join'](_0x315bcc);
        }
    }
    return _0x41ab18;
}
function jklDecrypt(_0x39a6c5) {
    if (!_0x39a6c5)
        return _0x39a6c5;
    try {
        let _0x5e5f65 = _0x39a6c5;
        while (_0x5e5f65['length'] % 0x4 !== 0x0)
            _0x5e5f65 += '=';
        const _0x36effd = Buffer['from'](_0x5e5f65, 'base64');
        const _0x315207 = Buffer['alloc'](_0x36effd['length']);
        const _0x520fe9 = Buffer['from']([
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
        for (let _0x5af782 = 0x0; _0x5af782 < _0x36effd['length']; _0x5af782++) {
            const _0x440422 = _0x520fe9[_0x5af782 % 0x14];
            _0x315207[_0x5af782] = ((_0x36effd[_0x5af782] ^ 0xff) & 0xca | _0x36effd[_0x5af782] & 0x35) ^ ((_0x440422 ^ 0xff) & 0xca | _0x440422 & 0x35);
        }
        return translateBrailleToAscii(Buffer['from'](_0x315207['toString'](), 'base64')['toString']('utf-8'));
    } catch (_0x2b22f5) {
        return _0x39a6c5;
    }
}
export function decryptHTTPCustom(_0x58d325) {
    try {
        const _0x301c3b = Buffer['from']('e382e4b8adc386f09f9293', 'hex');
        const _0x5bd956 = Buffer['alloc'](_0x58d325['length']);
        for (let _0x429d45 = 0x0; _0x429d45 < _0x58d325['length']; _0x429d45++)
            _0x5bd956[_0x429d45] = _0x58d325[_0x429d45] ^ _0x301c3b[_0x429d45 % _0x301c3b['length']];
        const _0x39af9a = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x0], HC_CONSTANTS['STATIC_NONCE'], Buffer['from'](_0x5bd956['toString']('utf-8'), 'hex'));
        const _0x490fc3 = JSON['parse'](_0x39af9a['toString']('utf-8'));
        const _0x1370ee = !!_0x490fc3['cfg'];
        const _0x14f95c = _0x490fc3['cfg'] || {};
        const _0x31f663 = _0x490fc3['xy'] || _0x14f95c['content'];
        const _0x794057 = _0x490fc3['a'] || _0x14f95c['hwid'] || '';
        const _0x176a07 = _0x490fc3['p'] || _0x14f95c['password'] || '';
        const _0x55ba10 = _0x490fc3['b'] || _0x14f95c['area'] || '';
        const _0x59008e = _0x0_0x29d926['createHash']('md5')['update'](_0x794057 + _0x176a07 + _0x55ba10)['digest']();
        const _0x4b1d29 = Buffer['alloc'](0x8);
        for (let _0x4aa74b = 0x0; _0x4aa74b < 0x8; _0x4aa74b++)
            _0x4b1d29[_0x4aa74b] = HC_CONSTANTS['STATIC_NONCE'][_0x4aa74b] ^ _0x59008e[_0x4aa74b % 0x10];
        let _0x45d350 = null;
        if (_0x1370ee) {
            for (const _0x46447e of HC_CONSTANTS['RST_KEYS']) {
                try {
                    const _0x4e8f8b = _0x0_0x29d926['createHash']('md5')['update'](_0x46447e)['digest']();
                    const _0x38d0d5 = _0x0_0x29d926['createDecipheriv']('aes-128-ecb', _0x4e8f8b, null);
                    _0x45d350 = Buffer['concat']([
                        _0x38d0d5['update'](Buffer['from'](_0x31f663, 'hex')),
                        _0x38d0d5['final']()
                    ]);
                    if (_0x45d350['toString']('utf-8')['includes']('[splitConfig]'))
                        break;
                } catch (_0x2bfb83) {
                    _0x45d350 = null;
                }
            }
        }
        if (!_0x45d350) {
            _0x45d350 = chacha20Decrypt(HC_CONSTANTS['CHACHA_KEYS'][0x1], _0x4b1d29, Buffer['from'](_0x31f663, 'hex'));
        }
        const _0x1509b9 = _0x45d350['toString']('utf-8')['split']('[splitConfig]');
        const _0x4c351b = {};
        for (let _0x35e5c9 = 0x0; _0x35e5c9 < _0x1509b9['length']; _0x35e5c9++) {
            const _0x16564a = HC_CONSTANTS['TOKEN_MAP'][_0x35e5c9] || 'field_' + _0x35e5c9;
            let _0x1b96b2 = jklDecrypt(_0x1509b9[_0x35e5c9]);
            if (_0x16564a === 'sshField' && _0x1b96b2 && _0x1b96b2['includes']('z3a_')) {
                try {
                    const _0x253b27 = Buffer['from'](_0x1b96b2['replace']('z3a_', ''), 'base64')['toString']('utf-8');
                    _0x1b96b2 = translateBrailleToAscii(_0x253b27);
                } catch (_0x163208) {
                }
            }
            _0x4c351b[_0x16564a] = _0x1b96b2;
        }
        return 'Labokingfreesurf\x20HTTP\x20CUSTOM\x20CONFIG\x0a==============================\x0a\x0a' + JSON['stringify']({
            'Protections': {
                'hwid': _0x794057,
                'password': _0x176a07 ? 'PROTECTED_LOCK' : 'NONE',
                'area': _0x55ba10
            },
            'Config': _0x4c351b
        }, null, 0x4);
    } catch (_0xcacd54) {
        return null;
    }
}