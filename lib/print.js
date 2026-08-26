import _0x0_0x453bd7 from 'chalk';
import _0x0_0x2cfcf6, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x3f96e1 from '../config.js';
function extractPhoneNumber(_0x1bd537) {
    if (!_0x1bd537)
        return null;
    const _0x4544e1 = _0x1bd537['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x4544e1['length'] < 0xa && _0x1bd537['includes']('@lid')) {
        return null;
    }
    return _0x4544e1;
}
async function getNameWithFallback(_0x540ec1, _0x4554b7, _0x782641) {
    try {
        if (_0x782641 && _0x782641['trim']()) {
            return _0x782641['trim']();
        }
        if (_0x4554b7['store']?.['contacts']?.[_0x540ec1]) {
            const _0x571a73 = _0x4554b7['store']['contacts'][_0x540ec1];
            if (_0x571a73['name'] || _0x571a73['notify']) {
                return _0x571a73['name'] || _0x571a73['notify'];
            }
        }
        const _0x143a32 = extractPhoneNumber(_0x540ec1);
        if (_0x143a32 && _0x143a32['length'] >= 0xa) {
            const _0x1349ae = _0x0_0x2cfcf6('+' + _0x143a32);
            if (_0x1349ae['valid']) {
                return null;
            }
        }
        return _0x540ec1['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x43b2d7) {
        return _0x540ec1['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x5e4dea, _0x93e43a) {
    try {
        if (!_0x5e4dea?.['key'])
            return;
        const _0x5af87e = _0x5e4dea;
        const _0x539184 = _0x5af87e['key']['remoteJid'];
        const _0x11e63f = _0x5af87e['key']['participant'] || _0x5af87e['key']['remoteJid'];
        const _0x1d7ee2 = _0x539184['endsWith']('@g.us');
        const _0x36eeea = _0x5af87e['key']['fromMe'];
        let _0x154e23 = '';
        let _0x2e4f0c = '';
        try {
            if (_0x36eeea) {
                _0x154e23 = _0x93e43a['user']?.['name'] || 'Owner';
                const _0x371f8b = extractPhoneNumber(_0x93e43a['user']?.['id'] || _0x93e43a['user']?.['jid']);
                if (_0x371f8b) {
                    const _0x3b51a6 = parsePhoneNumber('+' + _0x371f8b);
                    _0x2e4f0c = _0x3b51a6['valid'] ? _0x3b51a6['number']?.['international'] || _0x371f8b : _0x371f8b;
                }
            } else {
                _0x154e23 = await getNameWithFallback(_0x11e63f, _0x93e43a, _0x5af87e['pushName']);
                const _0x4054f7 = extractPhoneNumber(_0x11e63f);
                if (_0x4054f7 && _0x4054f7['length'] >= 0xa) {
                    const _0x59abfa = _0x0_0x2cfcf6('+' + _0x4054f7);
                    _0x2e4f0c = _0x59abfa['valid'] ? _0x59abfa['getNumber']('international') : _0x4054f7;
                } else {
                    _0x2e4f0c = _0x11e63f['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x34c864) {
            _0x154e23 = _0x5af87e['pushName'] || _0x11e63f['split']('@')[0x0];
            _0x2e4f0c = _0x11e63f['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x54d08d = null;
        try {
            if (_0x1d7ee2) {
                const _0x152c9 = await _0x93e43a['groupMetadata'](_0x539184)['catch'](() => null);
                _0x54d08d = _0x152c9?.['subject'] || null;
            }
        } catch (_0x4401dd) {
            _0x54d08d = null;
        }
        const _0xd315fb = Object['keys'](_0x5af87e['message'] || {})[0x0];
        let _0x20d9d9 = '';
        let _0x5dca65 = 0x0;
        let _0x351b56 = ![];
        if (_0xd315fb === 'senderKeyDistributionMessage' || _0xd315fb === 'protocolMessage' || _0xd315fb === 'reactionMessage') {
            _0x351b56 = !![];
        }
        if (_0x351b56)
            return;
        const _0x465010 = {
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
        if (_0x5af87e['message']) {
            if (_0xd315fb === 'conversation') {
                _0x20d9d9 = _0x5af87e['message']['conversation'];
            } else if (_0xd315fb === 'extendedTextMessage') {
                _0x20d9d9 = _0x5af87e['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0xd315fb === 'imageMessage') {
                _0x20d9d9 = _0x5af87e['message']['imageMessage']?.['caption'] || '[Image]';
                _0x5dca65 = _0x5af87e['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0xd315fb === 'videoMessage') {
                _0x20d9d9 = _0x5af87e['message']['videoMessage']?.['caption'] || '[Video]';
                _0x5dca65 = _0x5af87e['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0xd315fb === 'audioMessage') {
                const _0x19032f = _0x5af87e['message']['audioMessage']?.['seconds'] || 0x0;
                _0x20d9d9 = '[Audio\x20' + Math['floor'](_0x19032f / 0x3c) + ':' + (_0x19032f % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x5dca65 = _0x5af87e['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0xd315fb === 'documentMessage') {
                const _0x2af6 = _0x5af87e['message']['documentMessage']?.['fileName'] || 'Document';
                _0x20d9d9 = '[📄\x20' + _0x2af6 + ']';
                _0x5dca65 = _0x5af87e['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0xd315fb === 'stickerMessage') {
                _0x20d9d9 = '[Sticker]';
                _0x5dca65 = _0x5af87e['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0xd315fb === 'contactMessage') {
                _0x20d9d9 = '[👤\x20' + (_0x5af87e['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0xd315fb === 'locationMessage') {
                _0x20d9d9 = '[📍\x20Location]';
            } else {
                _0x20d9d9 = '[' + _0xd315fb['replace']('Message', '') + ']';
            }
        }
        let _0x309655 = '';
        if (_0x5dca65 > 0x0) {
            const _0x3ce788 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x3ecae5 = Math['floor'](Math['log'](_0x5dca65) / Math['log'](0x400));
            _0x309655 = '\x20(' + (_0x5dca65 / Math['pow'](0x400, _0x3ecae5))['toFixed'](0x1) + '\x20' + _0x3ce788[_0x3ecae5] + ')';
        }
        const _0xda1702 = _0x5af87e['messageTimestamp'] ? new Date((_0x5af87e['messageTimestamp']['low'] || _0x5af87e['messageTimestamp']) * 0x3e8) : new Date();
        const _0x5d279b = _0xda1702['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x3f96e1['timeZone'] || 'Asia/Karachi'
        });
        const _0x478ffd = _0x20d9d9['startsWith']('.') || _0x20d9d9['startsWith']('!') || _0x20d9d9['startsWith']('#') || _0x20d9d9['startsWith']('/');
        const _0x31b382 = _0x465010[_0xd315fb] || _0xd315fb['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x453bd7['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x453bd7['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x453bd7['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x453bd7['black'](_0x0_0x453bd7['bgCyan']['bold']('\x20' + _0x5d279b + '\x20')) + '\x20' + _0x0_0x453bd7['magenta']['bold'](_0x31b382) + _0x0_0x453bd7['gray']['bold'](_0x309655));
        const _0x3456cb = _0x154e23 && _0x154e23 !== _0x2e4f0c ? _0x154e23 + '\x20(' + _0x2e4f0c + ')' : _0x2e4f0c;
        console['log'](_0x0_0x453bd7['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x36eeea ? _0x0_0x453bd7['green']['bold']('📤\x20ME') : _0x0_0x453bd7['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x453bd7['white']['bold'](_0x3456cb));
        if (_0x1d7ee2 && _0x54d08d) {
            console['log'](_0x0_0x453bd7['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x453bd7['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x453bd7['white']['bold'](_0x54d08d));
        } else if (!_0x1d7ee2) {
            console['log'](_0x0_0x453bd7['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x453bd7['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x453bd7['white']['bold']('Private\x20Chat'));
        }
        if (_0x20d9d9) {
            const _0xb0fe4e = 0x64;
            const _0x2f39e7 = _0x20d9d9['length'] > _0xb0fe4e ? _0x20d9d9['substring'](0x0, _0xb0fe4e) + '...' : _0x20d9d9;
            const _0x36d598 = _0x20d9d9['includes']('NOVA-MD') || _0x20d9d9['includes']('Pinging...') || _0x20d9d9['includes']('*🤖') || _0x36eeea && _0x20d9d9['includes']('*');
            console['log'](_0x0_0x453bd7['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x453bd7['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x478ffd ? _0x0_0x453bd7['greenBright']['bold'](_0x2f39e7) : _0x36d598 ? _0x0_0x453bd7['cyan']['bold'](_0x2f39e7) : _0x36eeea ? _0x0_0x453bd7['blueBright']['bold'](_0x2f39e7) : _0x0_0x453bd7['white']['bold'](_0x2f39e7)));
        }
        console['log'](_0x0_0x453bd7['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x134641) {
        console['log'](_0x0_0x453bd7['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x134641['message']);
        console['log'](_0x0_0x453bd7['gray']['bold']('[' + (_0x5e4dea['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x5e4dea['key']?.['remoteJid']));
    }
}
function printLog(_0x6489d7, _0x21ab96) {
    const _0x4f4dc2 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x3f96e1['timeZone'] || 'Asia/Karachi'
    });
    const _0x51e767 = {
        'info': _0x0_0x453bd7['blue'],
        'success': _0x0_0x453bd7['green'],
        'warning': _0x0_0x453bd7['yellow'],
        'error': _0x0_0x453bd7['red'],
        'connection': _0x0_0x453bd7['cyan'],
        'store': _0x0_0x453bd7['magenta']
    };
    const _0x42fbad = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x330f14 = _0x51e767[_0x6489d7] || _0x0_0x453bd7['white'];
    const _0x5cdfcb = _0x42fbad[_0x6489d7] || '•';
    console['log'](_0x0_0x453bd7['gray']['bold']('[' + _0x4f4dc2 + ']') + '\x20' + _0x330f14(_0x5cdfcb) + '\x20' + _0x330f14(_0x21ab96));
}
export {
    printMessage,
    printLog
};