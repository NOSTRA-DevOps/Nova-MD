import _0x0_0x30d38a from 'chalk';
import _0x0_0x59fd69, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0xdc7f22 from '../config.js';
function extractPhoneNumber(_0x47986e) {
    if (!_0x47986e)
        return null;
    const _0x4e2d79 = _0x47986e['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x4e2d79['length'] < 0xa && _0x47986e['includes']('@lid')) {
        return null;
    }
    return _0x4e2d79;
}
async function getNameWithFallback(_0x1b6b6f, _0x34c95d, _0x4a0f05) {
    try {
        if (_0x4a0f05 && _0x4a0f05['trim']()) {
            return _0x4a0f05['trim']();
        }
        if (_0x34c95d['store']?.['contacts']?.[_0x1b6b6f]) {
            const _0x22f77b = _0x34c95d['store']['contacts'][_0x1b6b6f];
            if (_0x22f77b['name'] || _0x22f77b['notify']) {
                return _0x22f77b['name'] || _0x22f77b['notify'];
            }
        }
        const _0x1cb0e4 = extractPhoneNumber(_0x1b6b6f);
        if (_0x1cb0e4 && _0x1cb0e4['length'] >= 0xa) {
            const _0x3bc3de = _0x0_0x59fd69('+' + _0x1cb0e4);
            if (_0x3bc3de['valid']) {
                return null;
            }
        }
        return _0x1b6b6f['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x1262c4) {
        return _0x1b6b6f['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x57cb7e, _0xcb90ec) {
    try {
        if (!_0x57cb7e?.['key'])
            return;
        const _0x26a264 = _0x57cb7e;
        const _0x4c6d58 = _0x26a264['key']['remoteJid'];
        const _0x274043 = _0x26a264['key']['participant'] || _0x26a264['key']['remoteJid'];
        const _0x3c98fd = _0x4c6d58['endsWith']('@g.us');
        const _0x2ea408 = _0x26a264['key']['fromMe'];
        let _0x40f07b = '';
        let _0x564e04 = '';
        try {
            if (_0x2ea408) {
                _0x40f07b = _0xcb90ec['user']?.['name'] || 'Owner';
                const _0xf24ac6 = extractPhoneNumber(_0xcb90ec['user']?.['id'] || _0xcb90ec['user']?.['jid']);
                if (_0xf24ac6) {
                    const _0x5a7122 = parsePhoneNumber('+' + _0xf24ac6);
                    _0x564e04 = _0x5a7122['valid'] ? _0x5a7122['number']?.['international'] || _0xf24ac6 : _0xf24ac6;
                }
            } else {
                _0x40f07b = await getNameWithFallback(_0x274043, _0xcb90ec, _0x26a264['pushName']);
                const _0x59afe8 = extractPhoneNumber(_0x274043);
                if (_0x59afe8 && _0x59afe8['length'] >= 0xa) {
                    const _0x54b57a = _0x0_0x59fd69('+' + _0x59afe8);
                    _0x564e04 = _0x54b57a['valid'] ? _0x54b57a['getNumber']('international') : _0x59afe8;
                } else {
                    _0x564e04 = _0x274043['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x4e8e1f) {
            _0x40f07b = _0x26a264['pushName'] || _0x274043['split']('@')[0x0];
            _0x564e04 = _0x274043['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x5ee2c0 = null;
        try {
            if (_0x3c98fd) {
                const _0x62ebfd = await _0xcb90ec['groupMetadata'](_0x4c6d58)['catch'](() => null);
                _0x5ee2c0 = _0x62ebfd?.['subject'] || null;
            }
        } catch (_0x54fc66) {
            _0x5ee2c0 = null;
        }
        const _0x43f4fe = Object['keys'](_0x26a264['message'] || {})[0x0];
        let _0x5d32b7 = '';
        let _0x5327e1 = 0x0;
        let _0x307f28 = ![];
        if (_0x43f4fe === 'senderKeyDistributionMessage' || _0x43f4fe === 'protocolMessage' || _0x43f4fe === 'reactionMessage') {
            _0x307f28 = !![];
        }
        if (_0x307f28)
            return;
        const _0x97140a = {
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
        if (_0x26a264['message']) {
            if (_0x43f4fe === 'conversation') {
                _0x5d32b7 = _0x26a264['message']['conversation'];
            } else if (_0x43f4fe === 'extendedTextMessage') {
                _0x5d32b7 = _0x26a264['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x43f4fe === 'imageMessage') {
                _0x5d32b7 = _0x26a264['message']['imageMessage']?.['caption'] || '[Image]';
                _0x5327e1 = _0x26a264['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x43f4fe === 'videoMessage') {
                _0x5d32b7 = _0x26a264['message']['videoMessage']?.['caption'] || '[Video]';
                _0x5327e1 = _0x26a264['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x43f4fe === 'audioMessage') {
                const _0x2a466a = _0x26a264['message']['audioMessage']?.['seconds'] || 0x0;
                _0x5d32b7 = '[Audio\x20' + Math['floor'](_0x2a466a / 0x3c) + ':' + (_0x2a466a % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x5327e1 = _0x26a264['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x43f4fe === 'documentMessage') {
                const _0x377503 = _0x26a264['message']['documentMessage']?.['fileName'] || 'Document';
                _0x5d32b7 = '[📄\x20' + _0x377503 + ']';
                _0x5327e1 = _0x26a264['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x43f4fe === 'stickerMessage') {
                _0x5d32b7 = '[Sticker]';
                _0x5327e1 = _0x26a264['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x43f4fe === 'contactMessage') {
                _0x5d32b7 = '[👤\x20' + (_0x26a264['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x43f4fe === 'locationMessage') {
                _0x5d32b7 = '[📍\x20Location]';
            } else {
                _0x5d32b7 = '[' + _0x43f4fe['replace']('Message', '') + ']';
            }
        }
        let _0x51b204 = '';
        if (_0x5327e1 > 0x0) {
            const _0x12c681 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x1a07d9 = Math['floor'](Math['log'](_0x5327e1) / Math['log'](0x400));
            _0x51b204 = '\x20(' + (_0x5327e1 / Math['pow'](0x400, _0x1a07d9))['toFixed'](0x1) + '\x20' + _0x12c681[_0x1a07d9] + ')';
        }
        const _0xf1a893 = _0x26a264['messageTimestamp'] ? new Date((_0x26a264['messageTimestamp']['low'] || _0x26a264['messageTimestamp']) * 0x3e8) : new Date();
        const _0x5772ed = _0xf1a893['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0xdc7f22['timeZone'] || 'Asia/Karachi'
        });
        const _0xb95ed9 = _0x5d32b7['startsWith']('.') || _0x5d32b7['startsWith']('!') || _0x5d32b7['startsWith']('#') || _0x5d32b7['startsWith']('/');
        const _0x3d9969 = _0x97140a[_0x43f4fe] || _0x43f4fe['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x30d38a['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x30d38a['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x30d38a['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x30d38a['black'](_0x0_0x30d38a['bgCyan']['bold']('\x20' + _0x5772ed + '\x20')) + '\x20' + _0x0_0x30d38a['magenta']['bold'](_0x3d9969) + _0x0_0x30d38a['gray']['bold'](_0x51b204));
        const _0x263dcf = _0x40f07b && _0x40f07b !== _0x564e04 ? _0x40f07b + '\x20(' + _0x564e04 + ')' : _0x564e04;
        console['log'](_0x0_0x30d38a['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x2ea408 ? _0x0_0x30d38a['green']['bold']('📤\x20ME') : _0x0_0x30d38a['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x30d38a['white']['bold'](_0x263dcf));
        if (_0x3c98fd && _0x5ee2c0) {
            console['log'](_0x0_0x30d38a['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x30d38a['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x30d38a['white']['bold'](_0x5ee2c0));
        } else if (!_0x3c98fd) {
            console['log'](_0x0_0x30d38a['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x30d38a['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x30d38a['white']['bold']('Private\x20Chat'));
        }
        if (_0x5d32b7) {
            const _0x384938 = 0x64;
            const _0x53c3bc = _0x5d32b7['length'] > _0x384938 ? _0x5d32b7['substring'](0x0, _0x384938) + '...' : _0x5d32b7;
            const _0x15626f = _0x5d32b7['includes']('NOVA-MD') || _0x5d32b7['includes']('Pinging...') || _0x5d32b7['includes']('*🤖') || _0x2ea408 && _0x5d32b7['includes']('*');
            console['log'](_0x0_0x30d38a['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x30d38a['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0xb95ed9 ? _0x0_0x30d38a['greenBright']['bold'](_0x53c3bc) : _0x15626f ? _0x0_0x30d38a['cyan']['bold'](_0x53c3bc) : _0x2ea408 ? _0x0_0x30d38a['blueBright']['bold'](_0x53c3bc) : _0x0_0x30d38a['white']['bold'](_0x53c3bc)));
        }
        console['log'](_0x0_0x30d38a['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x11fe0e) {
        console['log'](_0x0_0x30d38a['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x11fe0e['message']);
        console['log'](_0x0_0x30d38a['gray']['bold']('[' + (_0x57cb7e['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x57cb7e['key']?.['remoteJid']));
    }
}
function printLog(_0x155449, _0x4c412e) {
    const _0x3707cf = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0xdc7f22['timeZone'] || 'Asia/Karachi'
    });
    const _0x796ef6 = {
        'info': _0x0_0x30d38a['blue'],
        'success': _0x0_0x30d38a['green'],
        'warning': _0x0_0x30d38a['yellow'],
        'error': _0x0_0x30d38a['red'],
        'connection': _0x0_0x30d38a['cyan'],
        'store': _0x0_0x30d38a['magenta']
    };
    const _0x5b873e = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x4c90e1 = _0x796ef6[_0x155449] || _0x0_0x30d38a['white'];
    const _0x5083f4 = _0x5b873e[_0x155449] || '•';
    console['log'](_0x0_0x30d38a['gray']['bold']('[' + _0x3707cf + ']') + '\x20' + _0x4c90e1(_0x5083f4) + '\x20' + _0x4c90e1(_0x4c412e));
}
export {
    printMessage,
    printLog
};