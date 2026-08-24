import _0x0_0xfd60ea from 'chalk';
import _0x0_0x2ca6d2, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x1f42a4 from '../config.js';
function extractPhoneNumber(_0xc46653) {
    if (!_0xc46653)
        return null;
    const _0x43cab8 = _0xc46653['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x43cab8['length'] < 0xa && _0xc46653['includes']('@lid')) {
        return null;
    }
    return _0x43cab8;
}
async function getNameWithFallback(_0x56135d, _0x520c04, _0x4c844c) {
    try {
        if (_0x4c844c && _0x4c844c['trim']()) {
            return _0x4c844c['trim']();
        }
        if (_0x520c04['store']?.['contacts']?.[_0x56135d]) {
            const _0x573797 = _0x520c04['store']['contacts'][_0x56135d];
            if (_0x573797['name'] || _0x573797['notify']) {
                return _0x573797['name'] || _0x573797['notify'];
            }
        }
        const _0x35741f = extractPhoneNumber(_0x56135d);
        if (_0x35741f && _0x35741f['length'] >= 0xa) {
            const _0x226bea = _0x0_0x2ca6d2('+' + _0x35741f);
            if (_0x226bea['valid']) {
                return null;
            }
        }
        return _0x56135d['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x5adcac) {
        return _0x56135d['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x29a827, _0x477644) {
    try {
        if (!_0x29a827?.['key'])
            return;
        const _0x21bce6 = _0x29a827;
        const _0x4dc85b = _0x21bce6['key']['remoteJid'];
        const _0x5f37b2 = _0x21bce6['key']['participant'] || _0x21bce6['key']['remoteJid'];
        const _0x2de1eb = _0x4dc85b['endsWith']('@g.us');
        const _0x20af2b = _0x21bce6['key']['fromMe'];
        let _0xba4f53 = '';
        let _0x1fa6d1 = '';
        try {
            if (_0x20af2b) {
                _0xba4f53 = _0x477644['user']?.['name'] || 'Owner';
                const _0xe4107c = extractPhoneNumber(_0x477644['user']?.['id'] || _0x477644['user']?.['jid']);
                if (_0xe4107c) {
                    const _0x1510bf = parsePhoneNumber('+' + _0xe4107c);
                    _0x1fa6d1 = _0x1510bf['valid'] ? _0x1510bf['number']?.['international'] || _0xe4107c : _0xe4107c;
                }
            } else {
                _0xba4f53 = await getNameWithFallback(_0x5f37b2, _0x477644, _0x21bce6['pushName']);
                const _0x25817a = extractPhoneNumber(_0x5f37b2);
                if (_0x25817a && _0x25817a['length'] >= 0xa) {
                    const _0x5c6c21 = _0x0_0x2ca6d2('+' + _0x25817a);
                    _0x1fa6d1 = _0x5c6c21['valid'] ? _0x5c6c21['getNumber']('international') : _0x25817a;
                } else {
                    _0x1fa6d1 = _0x5f37b2['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x1725bf) {
            _0xba4f53 = _0x21bce6['pushName'] || _0x5f37b2['split']('@')[0x0];
            _0x1fa6d1 = _0x5f37b2['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x68a111 = null;
        try {
            if (_0x2de1eb) {
                const _0x4daf61 = await _0x477644['groupMetadata'](_0x4dc85b)['catch'](() => null);
                _0x68a111 = _0x4daf61?.['subject'] || null;
            }
        } catch (_0x5e24d2) {
            _0x68a111 = null;
        }
        const _0x209bb5 = Object['keys'](_0x21bce6['message'] || {})[0x0];
        let _0x5cf796 = '';
        let _0x2e0773 = 0x0;
        let _0x138f67 = ![];
        if (_0x209bb5 === 'senderKeyDistributionMessage' || _0x209bb5 === 'protocolMessage' || _0x209bb5 === 'reactionMessage') {
            _0x138f67 = !![];
        }
        if (_0x138f67)
            return;
        const _0x55ac35 = {
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
        if (_0x21bce6['message']) {
            if (_0x209bb5 === 'conversation') {
                _0x5cf796 = _0x21bce6['message']['conversation'];
            } else if (_0x209bb5 === 'extendedTextMessage') {
                _0x5cf796 = _0x21bce6['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x209bb5 === 'imageMessage') {
                _0x5cf796 = _0x21bce6['message']['imageMessage']?.['caption'] || '[Image]';
                _0x2e0773 = _0x21bce6['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x209bb5 === 'videoMessage') {
                _0x5cf796 = _0x21bce6['message']['videoMessage']?.['caption'] || '[Video]';
                _0x2e0773 = _0x21bce6['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x209bb5 === 'audioMessage') {
                const _0x34bca6 = _0x21bce6['message']['audioMessage']?.['seconds'] || 0x0;
                _0x5cf796 = '[Audio\x20' + Math['floor'](_0x34bca6 / 0x3c) + ':' + (_0x34bca6 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x2e0773 = _0x21bce6['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x209bb5 === 'documentMessage') {
                const _0x396086 = _0x21bce6['message']['documentMessage']?.['fileName'] || 'Document';
                _0x5cf796 = '[📄\x20' + _0x396086 + ']';
                _0x2e0773 = _0x21bce6['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x209bb5 === 'stickerMessage') {
                _0x5cf796 = '[Sticker]';
                _0x2e0773 = _0x21bce6['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x209bb5 === 'contactMessage') {
                _0x5cf796 = '[👤\x20' + (_0x21bce6['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x209bb5 === 'locationMessage') {
                _0x5cf796 = '[📍\x20Location]';
            } else {
                _0x5cf796 = '[' + _0x209bb5['replace']('Message', '') + ']';
            }
        }
        let _0x273b2e = '';
        if (_0x2e0773 > 0x0) {
            const _0x4375b7 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x2c784e = Math['floor'](Math['log'](_0x2e0773) / Math['log'](0x400));
            _0x273b2e = '\x20(' + (_0x2e0773 / Math['pow'](0x400, _0x2c784e))['toFixed'](0x1) + '\x20' + _0x4375b7[_0x2c784e] + ')';
        }
        const _0x199bc0 = _0x21bce6['messageTimestamp'] ? new Date((_0x21bce6['messageTimestamp']['low'] || _0x21bce6['messageTimestamp']) * 0x3e8) : new Date();
        const _0x444508 = _0x199bc0['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x1f42a4['timeZone'] || 'Asia/Karachi'
        });
        const _0x17a2a9 = _0x5cf796['startsWith']('.') || _0x5cf796['startsWith']('!') || _0x5cf796['startsWith']('#') || _0x5cf796['startsWith']('/');
        const _0x2e5585 = _0x55ac35[_0x209bb5] || _0x209bb5['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0xfd60ea['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0xfd60ea['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xfd60ea['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0xfd60ea['black'](_0x0_0xfd60ea['bgCyan']['bold']('\x20' + _0x444508 + '\x20')) + '\x20' + _0x0_0xfd60ea['magenta']['bold'](_0x2e5585) + _0x0_0xfd60ea['gray']['bold'](_0x273b2e));
        const _0x1badd8 = _0xba4f53 && _0xba4f53 !== _0x1fa6d1 ? _0xba4f53 + '\x20(' + _0x1fa6d1 + ')' : _0x1fa6d1;
        console['log'](_0x0_0xfd60ea['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x20af2b ? _0x0_0xfd60ea['green']['bold']('📤\x20ME') : _0x0_0xfd60ea['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0xfd60ea['white']['bold'](_0x1badd8));
        if (_0x2de1eb && _0x68a111) {
            console['log'](_0x0_0xfd60ea['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xfd60ea['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0xfd60ea['white']['bold'](_0x68a111));
        } else if (!_0x2de1eb) {
            console['log'](_0x0_0xfd60ea['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xfd60ea['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0xfd60ea['white']['bold']('Private\x20Chat'));
        }
        if (_0x5cf796) {
            const _0x5ed351 = 0x64;
            const _0x360c62 = _0x5cf796['length'] > _0x5ed351 ? _0x5cf796['substring'](0x0, _0x5ed351) + '...' : _0x5cf796;
            const _0x5d9865 = _0x5cf796['includes']('NOVA-MD') || _0x5cf796['includes']('Pinging...') || _0x5cf796['includes']('*🤖') || _0x20af2b && _0x5cf796['includes']('*');
            console['log'](_0x0_0xfd60ea['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0xfd60ea['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x17a2a9 ? _0x0_0xfd60ea['greenBright']['bold'](_0x360c62) : _0x5d9865 ? _0x0_0xfd60ea['cyan']['bold'](_0x360c62) : _0x20af2b ? _0x0_0xfd60ea['blueBright']['bold'](_0x360c62) : _0x0_0xfd60ea['white']['bold'](_0x360c62)));
        }
        console['log'](_0x0_0xfd60ea['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x179cfe) {
        console['log'](_0x0_0xfd60ea['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x179cfe['message']);
        console['log'](_0x0_0xfd60ea['gray']['bold']('[' + (_0x29a827['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x29a827['key']?.['remoteJid']));
    }
}
function printLog(_0x67e04e, _0x5b77d2) {
    const _0x41ead4 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x1f42a4['timeZone'] || 'Asia/Karachi'
    });
    const _0x2c82d9 = {
        'info': _0x0_0xfd60ea['blue'],
        'success': _0x0_0xfd60ea['green'],
        'warning': _0x0_0xfd60ea['yellow'],
        'error': _0x0_0xfd60ea['red'],
        'connection': _0x0_0xfd60ea['cyan'],
        'store': _0x0_0xfd60ea['magenta']
    };
    const _0x1bf128 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x4ee659 = _0x2c82d9[_0x67e04e] || _0x0_0xfd60ea['white'];
    const _0x1eba25 = _0x1bf128[_0x67e04e] || '•';
    console['log'](_0x0_0xfd60ea['gray']['bold']('[' + _0x41ead4 + ']') + '\x20' + _0x4ee659(_0x1eba25) + '\x20' + _0x4ee659(_0x5b77d2));
}
export {
    printMessage,
    printLog
};