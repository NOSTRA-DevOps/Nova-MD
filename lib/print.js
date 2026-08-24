import _0x0_0xaf1fdf from 'chalk';
import _0x0_0x5e696d, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x2a5126 from '../config.js';
function extractPhoneNumber(_0x59b943) {
    if (!_0x59b943)
        return null;
    const _0x11ff7f = _0x59b943['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x11ff7f['length'] < 0xa && _0x59b943['includes']('@lid')) {
        return null;
    }
    return _0x11ff7f;
}
async function getNameWithFallback(_0x38782a, _0x3cbf5e, _0x359018) {
    try {
        if (_0x359018 && _0x359018['trim']()) {
            return _0x359018['trim']();
        }
        if (_0x3cbf5e['store']?.['contacts']?.[_0x38782a]) {
            const _0x1b592d = _0x3cbf5e['store']['contacts'][_0x38782a];
            if (_0x1b592d['name'] || _0x1b592d['notify']) {
                return _0x1b592d['name'] || _0x1b592d['notify'];
            }
        }
        const _0x1e15f3 = extractPhoneNumber(_0x38782a);
        if (_0x1e15f3 && _0x1e15f3['length'] >= 0xa) {
            const _0x456d0e = _0x0_0x5e696d('+' + _0x1e15f3);
            if (_0x456d0e['valid']) {
                return null;
            }
        }
        return _0x38782a['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x287510) {
        return _0x38782a['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x32c187, _0x342fc7) {
    try {
        if (!_0x32c187?.['key'])
            return;
        const _0x29e9f2 = _0x32c187;
        const _0x5644fc = _0x29e9f2['key']['remoteJid'];
        const _0x287fd8 = _0x29e9f2['key']['participant'] || _0x29e9f2['key']['remoteJid'];
        const _0xd50377 = _0x5644fc['endsWith']('@g.us');
        const _0x1d7e26 = _0x29e9f2['key']['fromMe'];
        let _0x30fecc = '';
        let _0x276496 = '';
        try {
            if (_0x1d7e26) {
                _0x30fecc = _0x342fc7['user']?.['name'] || 'Owner';
                const _0x598a15 = extractPhoneNumber(_0x342fc7['user']?.['id'] || _0x342fc7['user']?.['jid']);
                if (_0x598a15) {
                    const _0x17c6af = parsePhoneNumber('+' + _0x598a15);
                    _0x276496 = _0x17c6af['valid'] ? _0x17c6af['number']?.['international'] || _0x598a15 : _0x598a15;
                }
            } else {
                _0x30fecc = await getNameWithFallback(_0x287fd8, _0x342fc7, _0x29e9f2['pushName']);
                const _0x1c76d0 = extractPhoneNumber(_0x287fd8);
                if (_0x1c76d0 && _0x1c76d0['length'] >= 0xa) {
                    const _0x57db6d = _0x0_0x5e696d('+' + _0x1c76d0);
                    _0x276496 = _0x57db6d['valid'] ? _0x57db6d['getNumber']('international') : _0x1c76d0;
                } else {
                    _0x276496 = _0x287fd8['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x5ddabb) {
            _0x30fecc = _0x29e9f2['pushName'] || _0x287fd8['split']('@')[0x0];
            _0x276496 = _0x287fd8['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x48998c = null;
        try {
            if (_0xd50377) {
                const _0x4d2c98 = await _0x342fc7['groupMetadata'](_0x5644fc)['catch'](() => null);
                _0x48998c = _0x4d2c98?.['subject'] || null;
            }
        } catch (_0x13e921) {
            _0x48998c = null;
        }
        const _0x1bfe7c = Object['keys'](_0x29e9f2['message'] || {})[0x0];
        let _0x1c667e = '';
        let _0xe41535 = 0x0;
        let _0x28f679 = ![];
        if (_0x1bfe7c === 'senderKeyDistributionMessage' || _0x1bfe7c === 'protocolMessage' || _0x1bfe7c === 'reactionMessage') {
            _0x28f679 = !![];
        }
        if (_0x28f679)
            return;
        const _0xf50763 = {
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
        if (_0x29e9f2['message']) {
            if (_0x1bfe7c === 'conversation') {
                _0x1c667e = _0x29e9f2['message']['conversation'];
            } else if (_0x1bfe7c === 'extendedTextMessage') {
                _0x1c667e = _0x29e9f2['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x1bfe7c === 'imageMessage') {
                _0x1c667e = _0x29e9f2['message']['imageMessage']?.['caption'] || '[Image]';
                _0xe41535 = _0x29e9f2['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x1bfe7c === 'videoMessage') {
                _0x1c667e = _0x29e9f2['message']['videoMessage']?.['caption'] || '[Video]';
                _0xe41535 = _0x29e9f2['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x1bfe7c === 'audioMessage') {
                const _0x46152d = _0x29e9f2['message']['audioMessage']?.['seconds'] || 0x0;
                _0x1c667e = '[Audio\x20' + Math['floor'](_0x46152d / 0x3c) + ':' + (_0x46152d % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0xe41535 = _0x29e9f2['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x1bfe7c === 'documentMessage') {
                const _0xb7f5df = _0x29e9f2['message']['documentMessage']?.['fileName'] || 'Document';
                _0x1c667e = '[📄\x20' + _0xb7f5df + ']';
                _0xe41535 = _0x29e9f2['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x1bfe7c === 'stickerMessage') {
                _0x1c667e = '[Sticker]';
                _0xe41535 = _0x29e9f2['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x1bfe7c === 'contactMessage') {
                _0x1c667e = '[👤\x20' + (_0x29e9f2['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x1bfe7c === 'locationMessage') {
                _0x1c667e = '[📍\x20Location]';
            } else {
                _0x1c667e = '[' + _0x1bfe7c['replace']('Message', '') + ']';
            }
        }
        let _0x193111 = '';
        if (_0xe41535 > 0x0) {
            const _0x3fdefa = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x556797 = Math['floor'](Math['log'](_0xe41535) / Math['log'](0x400));
            _0x193111 = '\x20(' + (_0xe41535 / Math['pow'](0x400, _0x556797))['toFixed'](0x1) + '\x20' + _0x3fdefa[_0x556797] + ')';
        }
        const _0xbc837c = _0x29e9f2['messageTimestamp'] ? new Date((_0x29e9f2['messageTimestamp']['low'] || _0x29e9f2['messageTimestamp']) * 0x3e8) : new Date();
        const _0x4a687e = _0xbc837c['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x2a5126['timeZone'] || 'Asia/Karachi'
        });
        const _0x434cbb = _0x1c667e['startsWith']('.') || _0x1c667e['startsWith']('!') || _0x1c667e['startsWith']('#') || _0x1c667e['startsWith']('/');
        const _0x2e446c = _0xf50763[_0x1bfe7c] || _0x1bfe7c['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0xaf1fdf['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0xaf1fdf['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xaf1fdf['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0xaf1fdf['black'](_0x0_0xaf1fdf['bgCyan']['bold']('\x20' + _0x4a687e + '\x20')) + '\x20' + _0x0_0xaf1fdf['magenta']['bold'](_0x2e446c) + _0x0_0xaf1fdf['gray']['bold'](_0x193111));
        const _0x4e9d11 = _0x30fecc && _0x30fecc !== _0x276496 ? _0x30fecc + '\x20(' + _0x276496 + ')' : _0x276496;
        console['log'](_0x0_0xaf1fdf['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x1d7e26 ? _0x0_0xaf1fdf['green']['bold']('📤\x20ME') : _0x0_0xaf1fdf['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0xaf1fdf['white']['bold'](_0x4e9d11));
        if (_0xd50377 && _0x48998c) {
            console['log'](_0x0_0xaf1fdf['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xaf1fdf['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0xaf1fdf['white']['bold'](_0x48998c));
        } else if (!_0xd50377) {
            console['log'](_0x0_0xaf1fdf['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xaf1fdf['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0xaf1fdf['white']['bold']('Private\x20Chat'));
        }
        if (_0x1c667e) {
            const _0x40e75a = 0x64;
            const _0x559bcd = _0x1c667e['length'] > _0x40e75a ? _0x1c667e['substring'](0x0, _0x40e75a) + '...' : _0x1c667e;
            const _0xfe919e = _0x1c667e['includes']('NOVA-MD') || _0x1c667e['includes']('Pinging...') || _0x1c667e['includes']('*🤖') || _0x1d7e26 && _0x1c667e['includes']('*');
            console['log'](_0x0_0xaf1fdf['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xaf1fdf['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x434cbb ? _0x0_0xaf1fdf['greenBright']['bold'](_0x559bcd) : _0xfe919e ? _0x0_0xaf1fdf['cyan']['bold'](_0x559bcd) : _0x1d7e26 ? _0x0_0xaf1fdf['blueBright']['bold'](_0x559bcd) : _0x0_0xaf1fdf['white']['bold'](_0x559bcd)));
        }
        console['log'](_0x0_0xaf1fdf['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x2f3ee6) {
        console['log'](_0x0_0xaf1fdf['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x2f3ee6['message']);
        console['log'](_0x0_0xaf1fdf['gray']['bold']('[' + (_0x32c187['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x32c187['key']?.['remoteJid']));
    }
}
function printLog(_0x211d6c, _0x5bc426) {
    const _0x456fbb = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x2a5126['timeZone'] || 'Asia/Karachi'
    });
    const _0x3dc889 = {
        'info': _0x0_0xaf1fdf['blue'],
        'success': _0x0_0xaf1fdf['green'],
        'warning': _0x0_0xaf1fdf['yellow'],
        'error': _0x0_0xaf1fdf['red'],
        'connection': _0x0_0xaf1fdf['cyan'],
        'store': _0x0_0xaf1fdf['magenta']
    };
    const _0x17f02a = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0xdd6ce7 = _0x3dc889[_0x211d6c] || _0x0_0xaf1fdf['white'];
    const _0x4e5d65 = _0x17f02a[_0x211d6c] || '•';
    console['log'](_0x0_0xaf1fdf['gray']['bold']('[' + _0x456fbb + ']') + '\x20' + _0xdd6ce7(_0x4e5d65) + '\x20' + _0xdd6ce7(_0x5bc426));
}
export {
    printMessage,
    printLog
};