import _0x0_0x557c35 from 'chalk';
import _0x0_0x2f071b, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x68ec2d from '../config.js';
function extractPhoneNumber(_0x239cda) {
    if (!_0x239cda)
        return null;
    const _0x33c937 = _0x239cda['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x33c937['length'] < 0xa && _0x239cda['includes']('@lid')) {
        return null;
    }
    return _0x33c937;
}
async function getNameWithFallback(_0x17bfb1, _0x2dc69f, _0x6f396d) {
    try {
        if (_0x6f396d && _0x6f396d['trim']()) {
            return _0x6f396d['trim']();
        }
        if (_0x2dc69f['store']?.['contacts']?.[_0x17bfb1]) {
            const _0xddb6e = _0x2dc69f['store']['contacts'][_0x17bfb1];
            if (_0xddb6e['name'] || _0xddb6e['notify']) {
                return _0xddb6e['name'] || _0xddb6e['notify'];
            }
        }
        const _0x1cb71e = extractPhoneNumber(_0x17bfb1);
        if (_0x1cb71e && _0x1cb71e['length'] >= 0xa) {
            const _0x43e00d = _0x0_0x2f071b('+' + _0x1cb71e);
            if (_0x43e00d['valid']) {
                return null;
            }
        }
        return _0x17bfb1['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x49d23a) {
        return _0x17bfb1['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x54955e, _0x2709a1) {
    try {
        if (!_0x54955e?.['key'])
            return;
        const _0x111cc2 = _0x54955e;
        const _0x3d943a = _0x111cc2['key']['remoteJid'];
        const _0x33efb6 = _0x111cc2['key']['participant'] || _0x111cc2['key']['remoteJid'];
        const _0x47cfcb = _0x3d943a['endsWith']('@g.us');
        const _0x2c2e07 = _0x111cc2['key']['fromMe'];
        let _0x57d66e = '';
        let _0x32c89d = '';
        try {
            if (_0x2c2e07) {
                _0x57d66e = _0x2709a1['user']?.['name'] || 'Owner';
                const _0x80acf4 = extractPhoneNumber(_0x2709a1['user']?.['id'] || _0x2709a1['user']?.['jid']);
                if (_0x80acf4) {
                    const _0x3b55a6 = parsePhoneNumber('+' + _0x80acf4);
                    _0x32c89d = _0x3b55a6['valid'] ? _0x3b55a6['number']?.['international'] || _0x80acf4 : _0x80acf4;
                }
            } else {
                _0x57d66e = await getNameWithFallback(_0x33efb6, _0x2709a1, _0x111cc2['pushName']);
                const _0x88477 = extractPhoneNumber(_0x33efb6);
                if (_0x88477 && _0x88477['length'] >= 0xa) {
                    const _0x4c9c4b = _0x0_0x2f071b('+' + _0x88477);
                    _0x32c89d = _0x4c9c4b['valid'] ? _0x4c9c4b['getNumber']('international') : _0x88477;
                } else {
                    _0x32c89d = _0x33efb6['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x240295) {
            _0x57d66e = _0x111cc2['pushName'] || _0x33efb6['split']('@')[0x0];
            _0x32c89d = _0x33efb6['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x5a3d12 = null;
        try {
            if (_0x47cfcb) {
                const _0x41d502 = await _0x2709a1['groupMetadata'](_0x3d943a)['catch'](() => null);
                _0x5a3d12 = _0x41d502?.['subject'] || null;
            }
        } catch (_0x23af5d) {
            _0x5a3d12 = null;
        }
        const _0x25f33c = Object['keys'](_0x111cc2['message'] || {})[0x0];
        let _0x4e95d9 = '';
        let _0x27abf2 = 0x0;
        let _0x1e60b0 = ![];
        if (_0x25f33c === 'senderKeyDistributionMessage' || _0x25f33c === 'protocolMessage' || _0x25f33c === 'reactionMessage') {
            _0x1e60b0 = !![];
        }
        if (_0x1e60b0)
            return;
        const _0x1e8c41 = {
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
        if (_0x111cc2['message']) {
            if (_0x25f33c === 'conversation') {
                _0x4e95d9 = _0x111cc2['message']['conversation'];
            } else if (_0x25f33c === 'extendedTextMessage') {
                _0x4e95d9 = _0x111cc2['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x25f33c === 'imageMessage') {
                _0x4e95d9 = _0x111cc2['message']['imageMessage']?.['caption'] || '[Image]';
                _0x27abf2 = _0x111cc2['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x25f33c === 'videoMessage') {
                _0x4e95d9 = _0x111cc2['message']['videoMessage']?.['caption'] || '[Video]';
                _0x27abf2 = _0x111cc2['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x25f33c === 'audioMessage') {
                const _0x3f17ef = _0x111cc2['message']['audioMessage']?.['seconds'] || 0x0;
                _0x4e95d9 = '[Audio\x20' + Math['floor'](_0x3f17ef / 0x3c) + ':' + (_0x3f17ef % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x27abf2 = _0x111cc2['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x25f33c === 'documentMessage') {
                const _0x486d55 = _0x111cc2['message']['documentMessage']?.['fileName'] || 'Document';
                _0x4e95d9 = '[📄\x20' + _0x486d55 + ']';
                _0x27abf2 = _0x111cc2['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x25f33c === 'stickerMessage') {
                _0x4e95d9 = '[Sticker]';
                _0x27abf2 = _0x111cc2['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x25f33c === 'contactMessage') {
                _0x4e95d9 = '[👤\x20' + (_0x111cc2['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x25f33c === 'locationMessage') {
                _0x4e95d9 = '[📍\x20Location]';
            } else {
                _0x4e95d9 = '[' + _0x25f33c['replace']('Message', '') + ']';
            }
        }
        let _0x2fbfac = '';
        if (_0x27abf2 > 0x0) {
            const _0x12b60c = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x205bd3 = Math['floor'](Math['log'](_0x27abf2) / Math['log'](0x400));
            _0x2fbfac = '\x20(' + (_0x27abf2 / Math['pow'](0x400, _0x205bd3))['toFixed'](0x1) + '\x20' + _0x12b60c[_0x205bd3] + ')';
        }
        const _0x5298c6 = _0x111cc2['messageTimestamp'] ? new Date((_0x111cc2['messageTimestamp']['low'] || _0x111cc2['messageTimestamp']) * 0x3e8) : new Date();
        const _0x32ed2e = _0x5298c6['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x68ec2d['timeZone'] || 'Asia/Karachi'
        });
        const _0x106f78 = _0x4e95d9['startsWith']('.') || _0x4e95d9['startsWith']('!') || _0x4e95d9['startsWith']('#') || _0x4e95d9['startsWith']('/');
        const _0x3629a5 = _0x1e8c41[_0x25f33c] || _0x25f33c['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x557c35['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x557c35['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x557c35['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x557c35['black'](_0x0_0x557c35['bgCyan']['bold']('\x20' + _0x32ed2e + '\x20')) + '\x20' + _0x0_0x557c35['magenta']['bold'](_0x3629a5) + _0x0_0x557c35['gray']['bold'](_0x2fbfac));
        const _0x4542f0 = _0x57d66e && _0x57d66e !== _0x32c89d ? _0x57d66e + '\x20(' + _0x32c89d + ')' : _0x32c89d;
        console['log'](_0x0_0x557c35['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x2c2e07 ? _0x0_0x557c35['green']['bold']('📤\x20ME') : _0x0_0x557c35['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x557c35['white']['bold'](_0x4542f0));
        if (_0x47cfcb && _0x5a3d12) {
            console['log'](_0x0_0x557c35['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x557c35['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x557c35['white']['bold'](_0x5a3d12));
        } else if (!_0x47cfcb) {
            console['log'](_0x0_0x557c35['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x557c35['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x557c35['white']['bold']('Private\x20Chat'));
        }
        if (_0x4e95d9) {
            const _0x34dd32 = 0x64;
            const _0x25d25f = _0x4e95d9['length'] > _0x34dd32 ? _0x4e95d9['substring'](0x0, _0x34dd32) + '...' : _0x4e95d9;
            const _0x16d509 = _0x4e95d9['includes']('NOVA-MD') || _0x4e95d9['includes']('Pinging...') || _0x4e95d9['includes']('*🤖') || _0x2c2e07 && _0x4e95d9['includes']('*');
            console['log'](_0x0_0x557c35['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x557c35['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x106f78 ? _0x0_0x557c35['greenBright']['bold'](_0x25d25f) : _0x16d509 ? _0x0_0x557c35['cyan']['bold'](_0x25d25f) : _0x2c2e07 ? _0x0_0x557c35['blueBright']['bold'](_0x25d25f) : _0x0_0x557c35['white']['bold'](_0x25d25f)));
        }
        console['log'](_0x0_0x557c35['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x278636) {
        console['log'](_0x0_0x557c35['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x278636['message']);
        console['log'](_0x0_0x557c35['gray']['bold']('[' + (_0x54955e['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x54955e['key']?.['remoteJid']));
    }
}
function printLog(_0x3b2cfd, _0x1fd9c4) {
    const _0x4a0dd9 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x68ec2d['timeZone'] || 'Asia/Karachi'
    });
    const _0x550f5d = {
        'info': _0x0_0x557c35['blue'],
        'success': _0x0_0x557c35['green'],
        'warning': _0x0_0x557c35['yellow'],
        'error': _0x0_0x557c35['red'],
        'connection': _0x0_0x557c35['cyan'],
        'store': _0x0_0x557c35['magenta']
    };
    const _0x1275aa = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0xa8a395 = _0x550f5d[_0x3b2cfd] || _0x0_0x557c35['white'];
    const _0x1bc76d = _0x1275aa[_0x3b2cfd] || '•';
    console['log'](_0x0_0x557c35['gray']['bold']('[' + _0x4a0dd9 + ']') + '\x20' + _0xa8a395(_0x1bc76d) + '\x20' + _0xa8a395(_0x1fd9c4));
}
export {
    printMessage,
    printLog
};