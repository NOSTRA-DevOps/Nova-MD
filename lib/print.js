import _0x0_0x273f9d from 'chalk';
import _0x0_0x253f60, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x2a394c from '../config.js';
function extractPhoneNumber(_0xbd4b7e) {
    if (!_0xbd4b7e)
        return null;
    const _0x1a5c63 = _0xbd4b7e['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x1a5c63['length'] < 0xa && _0xbd4b7e['includes']('@lid')) {
        return null;
    }
    return _0x1a5c63;
}
async function getNameWithFallback(_0x4d32b5, _0x4fce99, _0xce8bcb) {
    try {
        if (_0xce8bcb && _0xce8bcb['trim']()) {
            return _0xce8bcb['trim']();
        }
        if (_0x4fce99['store']?.['contacts']?.[_0x4d32b5]) {
            const _0x3f0ad1 = _0x4fce99['store']['contacts'][_0x4d32b5];
            if (_0x3f0ad1['name'] || _0x3f0ad1['notify']) {
                return _0x3f0ad1['name'] || _0x3f0ad1['notify'];
            }
        }
        const _0x1c2589 = extractPhoneNumber(_0x4d32b5);
        if (_0x1c2589 && _0x1c2589['length'] >= 0xa) {
            const _0x42bf93 = _0x0_0x253f60('+' + _0x1c2589);
            if (_0x42bf93['valid']) {
                return null;
            }
        }
        return _0x4d32b5['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x458823) {
        return _0x4d32b5['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0xc3aea1, _0x557fb8) {
    try {
        if (!_0xc3aea1?.['key'])
            return;
        const _0x4b974d = _0xc3aea1;
        const _0x487fa8 = _0x4b974d['key']['remoteJid'];
        const _0x468135 = _0x4b974d['key']['participant'] || _0x4b974d['key']['remoteJid'];
        const _0x5954b1 = _0x487fa8['endsWith']('@g.us');
        const _0x5650fc = _0x4b974d['key']['fromMe'];
        let _0x23d07d = '';
        let _0x376ced = '';
        try {
            if (_0x5650fc) {
                _0x23d07d = _0x557fb8['user']?.['name'] || 'Owner';
                const _0x35fb9d = extractPhoneNumber(_0x557fb8['user']?.['id'] || _0x557fb8['user']?.['jid']);
                if (_0x35fb9d) {
                    const _0x3a15d5 = parsePhoneNumber('+' + _0x35fb9d);
                    _0x376ced = _0x3a15d5['valid'] ? _0x3a15d5['number']?.['international'] || _0x35fb9d : _0x35fb9d;
                }
            } else {
                _0x23d07d = await getNameWithFallback(_0x468135, _0x557fb8, _0x4b974d['pushName']);
                const _0x295960 = extractPhoneNumber(_0x468135);
                if (_0x295960 && _0x295960['length'] >= 0xa) {
                    const _0x26e423 = _0x0_0x253f60('+' + _0x295960);
                    _0x376ced = _0x26e423['valid'] ? _0x26e423['getNumber']('international') : _0x295960;
                } else {
                    _0x376ced = _0x468135['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x436e32) {
            _0x23d07d = _0x4b974d['pushName'] || _0x468135['split']('@')[0x0];
            _0x376ced = _0x468135['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x43c16 = null;
        try {
            if (_0x5954b1) {
                const _0x2df354 = await _0x557fb8['groupMetadata'](_0x487fa8)['catch'](() => null);
                _0x43c16 = _0x2df354?.['subject'] || null;
            }
        } catch (_0x4e19d0) {
            _0x43c16 = null;
        }
        const _0x5bd9d3 = Object['keys'](_0x4b974d['message'] || {})[0x0];
        let _0x4ea09b = '';
        let _0x1882ac = 0x0;
        let _0x11b741 = ![];
        if (_0x5bd9d3 === 'senderKeyDistributionMessage' || _0x5bd9d3 === 'protocolMessage' || _0x5bd9d3 === 'reactionMessage') {
            _0x11b741 = !![];
        }
        if (_0x11b741)
            return;
        const _0x521d90 = {
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
        if (_0x4b974d['message']) {
            if (_0x5bd9d3 === 'conversation') {
                _0x4ea09b = _0x4b974d['message']['conversation'];
            } else if (_0x5bd9d3 === 'extendedTextMessage') {
                _0x4ea09b = _0x4b974d['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x5bd9d3 === 'imageMessage') {
                _0x4ea09b = _0x4b974d['message']['imageMessage']?.['caption'] || '[Image]';
                _0x1882ac = _0x4b974d['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x5bd9d3 === 'videoMessage') {
                _0x4ea09b = _0x4b974d['message']['videoMessage']?.['caption'] || '[Video]';
                _0x1882ac = _0x4b974d['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x5bd9d3 === 'audioMessage') {
                const _0x5d25c7 = _0x4b974d['message']['audioMessage']?.['seconds'] || 0x0;
                _0x4ea09b = '[Audio\x20' + Math['floor'](_0x5d25c7 / 0x3c) + ':' + (_0x5d25c7 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x1882ac = _0x4b974d['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x5bd9d3 === 'documentMessage') {
                const _0x33873 = _0x4b974d['message']['documentMessage']?.['fileName'] || 'Document';
                _0x4ea09b = '[📄\x20' + _0x33873 + ']';
                _0x1882ac = _0x4b974d['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x5bd9d3 === 'stickerMessage') {
                _0x4ea09b = '[Sticker]';
                _0x1882ac = _0x4b974d['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x5bd9d3 === 'contactMessage') {
                _0x4ea09b = '[👤\x20' + (_0x4b974d['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x5bd9d3 === 'locationMessage') {
                _0x4ea09b = '[📍\x20Location]';
            } else {
                _0x4ea09b = '[' + _0x5bd9d3['replace']('Message', '') + ']';
            }
        }
        let _0x479565 = '';
        if (_0x1882ac > 0x0) {
            const _0x15e7ea = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x1563b5 = Math['floor'](Math['log'](_0x1882ac) / Math['log'](0x400));
            _0x479565 = '\x20(' + (_0x1882ac / Math['pow'](0x400, _0x1563b5))['toFixed'](0x1) + '\x20' + _0x15e7ea[_0x1563b5] + ')';
        }
        const _0x418b1b = _0x4b974d['messageTimestamp'] ? new Date((_0x4b974d['messageTimestamp']['low'] || _0x4b974d['messageTimestamp']) * 0x3e8) : new Date();
        const _0x1a0f3e = _0x418b1b['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x2a394c['timeZone'] || 'Asia/Karachi'
        });
        const _0x1a307e = _0x4ea09b['startsWith']('.') || _0x4ea09b['startsWith']('!') || _0x4ea09b['startsWith']('#') || _0x4ea09b['startsWith']('/');
        const _0x19d31a = _0x521d90[_0x5bd9d3] || _0x5bd9d3['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x273f9d['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x273f9d['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x273f9d['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x273f9d['black'](_0x0_0x273f9d['bgCyan']['bold']('\x20' + _0x1a0f3e + '\x20')) + '\x20' + _0x0_0x273f9d['magenta']['bold'](_0x19d31a) + _0x0_0x273f9d['gray']['bold'](_0x479565));
        const _0x3d9486 = _0x23d07d && _0x23d07d !== _0x376ced ? _0x23d07d + '\x20(' + _0x376ced + ')' : _0x376ced;
        console['log'](_0x0_0x273f9d['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x5650fc ? _0x0_0x273f9d['green']['bold']('📤\x20ME') : _0x0_0x273f9d['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x273f9d['white']['bold'](_0x3d9486));
        if (_0x5954b1 && _0x43c16) {
            console['log'](_0x0_0x273f9d['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x273f9d['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x273f9d['white']['bold'](_0x43c16));
        } else if (!_0x5954b1) {
            console['log'](_0x0_0x273f9d['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x273f9d['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x273f9d['white']['bold']('Private\x20Chat'));
        }
        if (_0x4ea09b) {
            const _0x3e7e35 = 0x64;
            const _0x5b2ed7 = _0x4ea09b['length'] > _0x3e7e35 ? _0x4ea09b['substring'](0x0, _0x3e7e35) + '...' : _0x4ea09b;
            const _0x14910f = _0x4ea09b['includes']('NOVA-MD') || _0x4ea09b['includes']('Pinging...') || _0x4ea09b['includes']('*🤖') || _0x5650fc && _0x4ea09b['includes']('*');
            console['log'](_0x0_0x273f9d['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x273f9d['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x1a307e ? _0x0_0x273f9d['greenBright']['bold'](_0x5b2ed7) : _0x14910f ? _0x0_0x273f9d['cyan']['bold'](_0x5b2ed7) : _0x5650fc ? _0x0_0x273f9d['blueBright']['bold'](_0x5b2ed7) : _0x0_0x273f9d['white']['bold'](_0x5b2ed7)));
        }
        console['log'](_0x0_0x273f9d['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x4afdde) {
        console['log'](_0x0_0x273f9d['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x4afdde['message']);
        console['log'](_0x0_0x273f9d['gray']['bold']('[' + (_0xc3aea1['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0xc3aea1['key']?.['remoteJid']));
    }
}
function printLog(_0x11430b, _0x366063) {
    const _0x19db98 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x2a394c['timeZone'] || 'Asia/Karachi'
    });
    const _0xdcd8bd = {
        'info': _0x0_0x273f9d['blue'],
        'success': _0x0_0x273f9d['green'],
        'warning': _0x0_0x273f9d['yellow'],
        'error': _0x0_0x273f9d['red'],
        'connection': _0x0_0x273f9d['cyan'],
        'store': _0x0_0x273f9d['magenta']
    };
    const _0x2037d5 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0xc05ecd = _0xdcd8bd[_0x11430b] || _0x0_0x273f9d['white'];
    const _0x29a3e1 = _0x2037d5[_0x11430b] || '•';
    console['log'](_0x0_0x273f9d['gray']['bold']('[' + _0x19db98 + ']') + '\x20' + _0xc05ecd(_0x29a3e1) + '\x20' + _0xc05ecd(_0x366063));
}
export {
    printMessage,
    printLog
};