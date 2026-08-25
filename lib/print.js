import _0x0_0x268cab from 'chalk';
import _0x0_0x57a490, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x4db86a from '../config.js';
function extractPhoneNumber(_0x1c522a) {
    if (!_0x1c522a)
        return null;
    const _0x2077ac = _0x1c522a['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x2077ac['length'] < 0xa && _0x1c522a['includes']('@lid')) {
        return null;
    }
    return _0x2077ac;
}
async function getNameWithFallback(_0x2183b7, _0x9b27f0, _0x3fd83b) {
    try {
        if (_0x3fd83b && _0x3fd83b['trim']()) {
            return _0x3fd83b['trim']();
        }
        if (_0x9b27f0['store']?.['contacts']?.[_0x2183b7]) {
            const _0x1f6c94 = _0x9b27f0['store']['contacts'][_0x2183b7];
            if (_0x1f6c94['name'] || _0x1f6c94['notify']) {
                return _0x1f6c94['name'] || _0x1f6c94['notify'];
            }
        }
        const _0x30b05b = extractPhoneNumber(_0x2183b7);
        if (_0x30b05b && _0x30b05b['length'] >= 0xa) {
            const _0x29f1d2 = _0x0_0x57a490('+' + _0x30b05b);
            if (_0x29f1d2['valid']) {
                return null;
            }
        }
        return _0x2183b7['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x56b4f2) {
        return _0x2183b7['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x4e326f, _0x22a74d) {
    try {
        if (!_0x4e326f?.['key'])
            return;
        const _0x3172c9 = _0x4e326f;
        const _0x5e18e3 = _0x3172c9['key']['remoteJid'];
        const _0x15c227 = _0x3172c9['key']['participant'] || _0x3172c9['key']['remoteJid'];
        const _0x230694 = _0x5e18e3['endsWith']('@g.us');
        const _0x5a572f = _0x3172c9['key']['fromMe'];
        let _0xb11ab6 = '';
        let _0x20d64f = '';
        try {
            if (_0x5a572f) {
                _0xb11ab6 = _0x22a74d['user']?.['name'] || 'Owner';
                const _0x4ac9f3 = extractPhoneNumber(_0x22a74d['user']?.['id'] || _0x22a74d['user']?.['jid']);
                if (_0x4ac9f3) {
                    const _0x47ffe7 = parsePhoneNumber('+' + _0x4ac9f3);
                    _0x20d64f = _0x47ffe7['valid'] ? _0x47ffe7['number']?.['international'] || _0x4ac9f3 : _0x4ac9f3;
                }
            } else {
                _0xb11ab6 = await getNameWithFallback(_0x15c227, _0x22a74d, _0x3172c9['pushName']);
                const _0x32b09e = extractPhoneNumber(_0x15c227);
                if (_0x32b09e && _0x32b09e['length'] >= 0xa) {
                    const _0xd78cf9 = _0x0_0x57a490('+' + _0x32b09e);
                    _0x20d64f = _0xd78cf9['valid'] ? _0xd78cf9['getNumber']('international') : _0x32b09e;
                } else {
                    _0x20d64f = _0x15c227['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x2bb23d) {
            _0xb11ab6 = _0x3172c9['pushName'] || _0x15c227['split']('@')[0x0];
            _0x20d64f = _0x15c227['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x3bf6cb = null;
        try {
            if (_0x230694) {
                const _0x31025b = await _0x22a74d['groupMetadata'](_0x5e18e3)['catch'](() => null);
                _0x3bf6cb = _0x31025b?.['subject'] || null;
            }
        } catch (_0x191e73) {
            _0x3bf6cb = null;
        }
        const _0x879a8 = Object['keys'](_0x3172c9['message'] || {})[0x0];
        let _0x460c4e = '';
        let _0x1462f5 = 0x0;
        let _0x194ade = ![];
        if (_0x879a8 === 'senderKeyDistributionMessage' || _0x879a8 === 'protocolMessage' || _0x879a8 === 'reactionMessage') {
            _0x194ade = !![];
        }
        if (_0x194ade)
            return;
        const _0x352b25 = {
            'conversation': 'TEXT',
            'extendedTextMessage': 'TEXT',
            'imageMessage': 'IMAGE',
            'videoMessage': 'VIDEO',
            'audioMessage': 'AUDIO',
            'documentMessage': 'DOCUMENT',
            'stickerMessage': 'STICKER',
            'contactMessage': 'CONTACT',
            'locationMessage': 'LOCATION'
        };
        if (_0x3172c9['message']) {
            if (_0x879a8 === 'conversation') {
                _0x460c4e = _0x3172c9['message']['conversation'];
            } else if (_0x879a8 === 'extendedTextMessage') {
                _0x460c4e = _0x3172c9['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x879a8 === 'imageMessage') {
                _0x460c4e = _0x3172c9['message']['imageMessage']?.['caption'] || '[Image]';
                _0x1462f5 = _0x3172c9['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x879a8 === 'videoMessage') {
                _0x460c4e = _0x3172c9['message']['videoMessage']?.['caption'] || '[Video]';
                _0x1462f5 = _0x3172c9['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x879a8 === 'audioMessage') {
                const _0x510344 = _0x3172c9['message']['audioMessage']?.['seconds'] || 0x0;
                _0x460c4e = '[Audio\x20' + Math['floor'](_0x510344 / 0x3c) + ':' + (_0x510344 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x1462f5 = _0x3172c9['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x879a8 === 'documentMessage') {
                const _0x4136d0 = _0x3172c9['message']['documentMessage']?.['fileName'] || 'Document';
                _0x460c4e = '[📄\x20' + _0x4136d0 + ']';
                _0x1462f5 = _0x3172c9['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x879a8 === 'stickerMessage') {
                _0x460c4e = '[Sticker]';
                _0x1462f5 = _0x3172c9['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x879a8 === 'contactMessage') {
                _0x460c4e = '[👤\x20' + (_0x3172c9['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x879a8 === 'locationMessage') {
                _0x460c4e = '[📍\x20Location]';
            } else {
                _0x460c4e = '[' + _0x879a8['replace']('Message', '') + ']';
            }
        }
        let _0x209960 = '';
        if (_0x1462f5 > 0x0) {
            const _0x22769a = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x245060 = Math['floor'](Math['log'](_0x1462f5) / Math['log'](0x400));
            _0x209960 = '\x20(' + (_0x1462f5 / Math['pow'](0x400, _0x245060))['toFixed'](0x1) + '\x20' + _0x22769a[_0x245060] + ')';
        }
        const _0xb2835 = _0x3172c9['messageTimestamp'] ? new Date((_0x3172c9['messageTimestamp']['low'] || _0x3172c9['messageTimestamp']) * 0x3e8) : new Date();
        const _0x36b9c2 = _0xb2835['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x4db86a['timeZone'] || 'Asia/Karachi'
        });
        const _0x401a33 = _0x460c4e['startsWith']('.') || _0x460c4e['startsWith']('!') || _0x460c4e['startsWith']('#') || _0x460c4e['startsWith']('/');
        const _0x2b4baf = _0x352b25[_0x879a8] || _0x879a8['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x268cab['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x268cab['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x268cab['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x268cab['black'](_0x0_0x268cab['bgCyan']['bold']('\x20' + _0x36b9c2 + '\x20')) + '\x20' + _0x0_0x268cab['magenta']['bold'](_0x2b4baf) + _0x0_0x268cab['gray']['bold'](_0x209960));
        const _0x2ccb9e = _0xb11ab6 && _0xb11ab6 !== _0x20d64f ? _0xb11ab6 + '\x20(' + _0x20d64f + ')' : _0x20d64f;
        console['log'](_0x0_0x268cab['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x5a572f ? _0x0_0x268cab['green']['bold']('📤\x20ME') : _0x0_0x268cab['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x268cab['white']['bold'](_0x2ccb9e));
        if (_0x230694 && _0x3bf6cb) {
            console['log'](_0x0_0x268cab['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x268cab['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x268cab['white']['bold'](_0x3bf6cb));
        } else if (!_0x230694) {
            console['log'](_0x0_0x268cab['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x268cab['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x268cab['white']['bold']('Private\x20Chat'));
        }
        if (_0x460c4e) {
            const _0x519bef = 0x64;
            const _0x94254e = _0x460c4e['length'] > _0x519bef ? _0x460c4e['substring'](0x0, _0x519bef) + '...' : _0x460c4e;
            const _0x299930 = _0x460c4e['includes']('NOVA-MD') || _0x460c4e['includes']('Pinging...') || _0x460c4e['includes']('*🤖') || _0x5a572f && _0x460c4e['includes']('*');
            console['log'](_0x0_0x268cab['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x268cab['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x401a33 ? _0x0_0x268cab['greenBright']['bold'](_0x94254e) : _0x299930 ? _0x0_0x268cab['cyan']['bold'](_0x94254e) : _0x5a572f ? _0x0_0x268cab['blueBright']['bold'](_0x94254e) : _0x0_0x268cab['white']['bold'](_0x94254e)));
        }
        console['log'](_0x0_0x268cab['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0xaeeab9) {
        console['log'](_0x0_0x268cab['red']['bold']('❌\x20Error\x20logging\x20message:'), _0xaeeab9['message']);
        console['log'](_0x0_0x268cab['gray']['bold']('[' + (_0x4e326f['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x4e326f['key']?.['remoteJid']));
    }
}
function printLog(_0x5d989f, _0x2c42f3) {
    const _0x261c3d = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x4db86a['timeZone'] || 'Asia/Karachi'
    });
    const _0x39d6c5 = {
        'info': _0x0_0x268cab['blue'],
        'success': _0x0_0x268cab['green'],
        'warning': _0x0_0x268cab['yellow'],
        'error': _0x0_0x268cab['red'],
        'connection': _0x0_0x268cab['cyan'],
        'store': _0x0_0x268cab['magenta']
    };
    const _0x361bd5 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x11d458 = _0x39d6c5[_0x5d989f] || _0x0_0x268cab['white'];
    const _0x3af9ce = _0x361bd5[_0x5d989f] || '•';
    console['log'](_0x0_0x268cab['gray']['bold']('[' + _0x261c3d + ']') + '\x20' + _0x11d458(_0x3af9ce) + '\x20' + _0x11d458(_0x2c42f3));
}
export {
    printMessage,
    printLog
};