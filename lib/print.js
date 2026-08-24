import _0x0_0x3d20bc from 'chalk';
import _0x0_0x1578c4, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x3125b7 from '../config.js';
function extractPhoneNumber(_0x2b4e0f) {
    if (!_0x2b4e0f)
        return null;
    const _0xe3a153 = _0x2b4e0f['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0xe3a153['length'] < 0xa && _0x2b4e0f['includes']('@lid')) {
        return null;
    }
    return _0xe3a153;
}
async function getNameWithFallback(_0x129536, _0x51b384, _0x335422) {
    try {
        if (_0x335422 && _0x335422['trim']()) {
            return _0x335422['trim']();
        }
        if (_0x51b384['store']?.['contacts']?.[_0x129536]) {
            const _0xd05966 = _0x51b384['store']['contacts'][_0x129536];
            if (_0xd05966['name'] || _0xd05966['notify']) {
                return _0xd05966['name'] || _0xd05966['notify'];
            }
        }
        const _0x2d8008 = extractPhoneNumber(_0x129536);
        if (_0x2d8008 && _0x2d8008['length'] >= 0xa) {
            const _0x4c2be8 = _0x0_0x1578c4('+' + _0x2d8008);
            if (_0x4c2be8['valid']) {
                return null;
            }
        }
        return _0x129536['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x2fe7b0) {
        return _0x129536['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x19eb71, _0x12753d) {
    try {
        if (!_0x19eb71?.['key'])
            return;
        const _0x3bdd8b = _0x19eb71;
        const _0xb15b39 = _0x3bdd8b['key']['remoteJid'];
        const _0x1211fa = _0x3bdd8b['key']['participant'] || _0x3bdd8b['key']['remoteJid'];
        const _0x3b5b86 = _0xb15b39['endsWith']('@g.us');
        const _0x3bf1ad = _0x3bdd8b['key']['fromMe'];
        let _0x54cc27 = '';
        let _0x33b10c = '';
        try {
            if (_0x3bf1ad) {
                _0x54cc27 = _0x12753d['user']?.['name'] || 'Owner';
                const _0x5028bd = extractPhoneNumber(_0x12753d['user']?.['id'] || _0x12753d['user']?.['jid']);
                if (_0x5028bd) {
                    const _0x26ab52 = parsePhoneNumber('+' + _0x5028bd);
                    _0x33b10c = _0x26ab52['valid'] ? _0x26ab52['number']?.['international'] || _0x5028bd : _0x5028bd;
                }
            } else {
                _0x54cc27 = await getNameWithFallback(_0x1211fa, _0x12753d, _0x3bdd8b['pushName']);
                const _0x213be9 = extractPhoneNumber(_0x1211fa);
                if (_0x213be9 && _0x213be9['length'] >= 0xa) {
                    const _0x4a1427 = _0x0_0x1578c4('+' + _0x213be9);
                    _0x33b10c = _0x4a1427['valid'] ? _0x4a1427['getNumber']('international') : _0x213be9;
                } else {
                    _0x33b10c = _0x1211fa['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x1eb87f) {
            _0x54cc27 = _0x3bdd8b['pushName'] || _0x1211fa['split']('@')[0x0];
            _0x33b10c = _0x1211fa['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0xc5be99 = null;
        try {
            if (_0x3b5b86) {
                const _0x315391 = await _0x12753d['groupMetadata'](_0xb15b39)['catch'](() => null);
                _0xc5be99 = _0x315391?.['subject'] || null;
            }
        } catch (_0x2ac06e) {
            _0xc5be99 = null;
        }
        const _0x5e53ff = Object['keys'](_0x3bdd8b['message'] || {})[0x0];
        let _0xe643db = '';
        let _0x2cadde = 0x0;
        let _0x2972e5 = ![];
        if (_0x5e53ff === 'senderKeyDistributionMessage' || _0x5e53ff === 'protocolMessage' || _0x5e53ff === 'reactionMessage') {
            _0x2972e5 = !![];
        }
        if (_0x2972e5)
            return;
        const _0x231b46 = {
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
        if (_0x3bdd8b['message']) {
            if (_0x5e53ff === 'conversation') {
                _0xe643db = _0x3bdd8b['message']['conversation'];
            } else if (_0x5e53ff === 'extendedTextMessage') {
                _0xe643db = _0x3bdd8b['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x5e53ff === 'imageMessage') {
                _0xe643db = _0x3bdd8b['message']['imageMessage']?.['caption'] || '[Image]';
                _0x2cadde = _0x3bdd8b['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x5e53ff === 'videoMessage') {
                _0xe643db = _0x3bdd8b['message']['videoMessage']?.['caption'] || '[Video]';
                _0x2cadde = _0x3bdd8b['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x5e53ff === 'audioMessage') {
                const _0x22e2c4 = _0x3bdd8b['message']['audioMessage']?.['seconds'] || 0x0;
                _0xe643db = '[Audio\x20' + Math['floor'](_0x22e2c4 / 0x3c) + ':' + (_0x22e2c4 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x2cadde = _0x3bdd8b['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x5e53ff === 'documentMessage') {
                const _0x32895e = _0x3bdd8b['message']['documentMessage']?.['fileName'] || 'Document';
                _0xe643db = '[📄\x20' + _0x32895e + ']';
                _0x2cadde = _0x3bdd8b['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x5e53ff === 'stickerMessage') {
                _0xe643db = '[Sticker]';
                _0x2cadde = _0x3bdd8b['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x5e53ff === 'contactMessage') {
                _0xe643db = '[👤\x20' + (_0x3bdd8b['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x5e53ff === 'locationMessage') {
                _0xe643db = '[📍\x20Location]';
            } else {
                _0xe643db = '[' + _0x5e53ff['replace']('Message', '') + ']';
            }
        }
        let _0x574fbd = '';
        if (_0x2cadde > 0x0) {
            const _0x12860d = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x47dbb9 = Math['floor'](Math['log'](_0x2cadde) / Math['log'](0x400));
            _0x574fbd = '\x20(' + (_0x2cadde / Math['pow'](0x400, _0x47dbb9))['toFixed'](0x1) + '\x20' + _0x12860d[_0x47dbb9] + ')';
        }
        const _0x2eefb8 = _0x3bdd8b['messageTimestamp'] ? new Date((_0x3bdd8b['messageTimestamp']['low'] || _0x3bdd8b['messageTimestamp']) * 0x3e8) : new Date();
        const _0x114d17 = _0x2eefb8['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x3125b7['timeZone'] || 'Asia/Karachi'
        });
        const _0x2d8c51 = _0xe643db['startsWith']('.') || _0xe643db['startsWith']('!') || _0xe643db['startsWith']('#') || _0xe643db['startsWith']('/');
        const _0x5422a2 = _0x231b46[_0x5e53ff] || _0x5e53ff['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x3d20bc['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x3d20bc['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3d20bc['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x3d20bc['black'](_0x0_0x3d20bc['bgCyan']['bold']('\x20' + _0x114d17 + '\x20')) + '\x20' + _0x0_0x3d20bc['magenta']['bold'](_0x5422a2) + _0x0_0x3d20bc['gray']['bold'](_0x574fbd));
        const _0x552aff = _0x54cc27 && _0x54cc27 !== _0x33b10c ? _0x54cc27 + '\x20(' + _0x33b10c + ')' : _0x33b10c;
        console['log'](_0x0_0x3d20bc['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x3bf1ad ? _0x0_0x3d20bc['green']['bold']('📤\x20ME') : _0x0_0x3d20bc['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x3d20bc['white']['bold'](_0x552aff));
        if (_0x3b5b86 && _0xc5be99) {
            console['log'](_0x0_0x3d20bc['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3d20bc['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x3d20bc['white']['bold'](_0xc5be99));
        } else if (!_0x3b5b86) {
            console['log'](_0x0_0x3d20bc['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3d20bc['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x3d20bc['white']['bold']('Private\x20Chat'));
        }
        if (_0xe643db) {
            const _0x25ed91 = 0x64;
            const _0x4e2bb7 = _0xe643db['length'] > _0x25ed91 ? _0xe643db['substring'](0x0, _0x25ed91) + '...' : _0xe643db;
            const _0x20499c = _0xe643db['includes']('NOVA-MD') || _0xe643db['includes']('Pinging...') || _0xe643db['includes']('*🤖') || _0x3bf1ad && _0xe643db['includes']('*');
            console['log'](_0x0_0x3d20bc['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3d20bc['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x2d8c51 ? _0x0_0x3d20bc['greenBright']['bold'](_0x4e2bb7) : _0x20499c ? _0x0_0x3d20bc['cyan']['bold'](_0x4e2bb7) : _0x3bf1ad ? _0x0_0x3d20bc['blueBright']['bold'](_0x4e2bb7) : _0x0_0x3d20bc['white']['bold'](_0x4e2bb7)));
        }
        console['log'](_0x0_0x3d20bc['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0xa1fcb0) {
        console['log'](_0x0_0x3d20bc['red']['bold']('❌\x20Error\x20logging\x20message:'), _0xa1fcb0['message']);
        console['log'](_0x0_0x3d20bc['gray']['bold']('[' + (_0x19eb71['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x19eb71['key']?.['remoteJid']));
    }
}
function printLog(_0x3761bc, _0x18fce4) {
    const _0xd09d1 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x3125b7['timeZone'] || 'Asia/Karachi'
    });
    const _0x4785a8 = {
        'info': _0x0_0x3d20bc['blue'],
        'success': _0x0_0x3d20bc['green'],
        'warning': _0x0_0x3d20bc['yellow'],
        'error': _0x0_0x3d20bc['red'],
        'connection': _0x0_0x3d20bc['cyan'],
        'store': _0x0_0x3d20bc['magenta']
    };
    const _0xfd8420 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x447fd5 = _0x4785a8[_0x3761bc] || _0x0_0x3d20bc['white'];
    const _0x372c7e = _0xfd8420[_0x3761bc] || '•';
    console['log'](_0x0_0x3d20bc['gray']['bold']('[' + _0xd09d1 + ']') + '\x20' + _0x447fd5(_0x372c7e) + '\x20' + _0x447fd5(_0x18fce4));
}
export {
    printMessage,
    printLog
};