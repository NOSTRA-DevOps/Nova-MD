import _0x0_0x3c4fbb from 'chalk';
import _0x0_0xa621e0, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x1c3708 from '../config.js';
function extractPhoneNumber(_0x3ce806) {
    if (!_0x3ce806)
        return null;
    const _0x1d4c48 = _0x3ce806['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x1d4c48['length'] < 0xa && _0x3ce806['includes']('@lid')) {
        return null;
    }
    return _0x1d4c48;
}
async function getNameWithFallback(_0x445f9a, _0x19d873, _0x2cf736) {
    try {
        if (_0x2cf736 && _0x2cf736['trim']()) {
            return _0x2cf736['trim']();
        }
        if (_0x19d873['store']?.['contacts']?.[_0x445f9a]) {
            const _0x4ce960 = _0x19d873['store']['contacts'][_0x445f9a];
            if (_0x4ce960['name'] || _0x4ce960['notify']) {
                return _0x4ce960['name'] || _0x4ce960['notify'];
            }
        }
        const _0x18a4b4 = extractPhoneNumber(_0x445f9a);
        if (_0x18a4b4 && _0x18a4b4['length'] >= 0xa) {
            const _0x51660b = _0x0_0xa621e0('+' + _0x18a4b4);
            if (_0x51660b['valid']) {
                return null;
            }
        }
        return _0x445f9a['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x58385b) {
        return _0x445f9a['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x4c9c29, _0x585b7f) {
    try {
        if (!_0x4c9c29?.['key'])
            return;
        const _0x4ad85d = _0x4c9c29;
        const _0x5aa6bb = _0x4ad85d['key']['remoteJid'];
        const _0x1ce97f = _0x4ad85d['key']['participant'] || _0x4ad85d['key']['remoteJid'];
        const _0x1cff0a = _0x5aa6bb['endsWith']('@g.us');
        const _0x3a9c0 = _0x4ad85d['key']['fromMe'];
        let _0x873b11 = '';
        let _0x5683c8 = '';
        try {
            if (_0x3a9c0) {
                _0x873b11 = _0x585b7f['user']?.['name'] || 'Owner';
                const _0x1bf078 = extractPhoneNumber(_0x585b7f['user']?.['id'] || _0x585b7f['user']?.['jid']);
                if (_0x1bf078) {
                    const _0x4d2ffa = parsePhoneNumber('+' + _0x1bf078);
                    _0x5683c8 = _0x4d2ffa['valid'] ? _0x4d2ffa['number']?.['international'] || _0x1bf078 : _0x1bf078;
                }
            } else {
                _0x873b11 = await getNameWithFallback(_0x1ce97f, _0x585b7f, _0x4ad85d['pushName']);
                const _0x2b7d62 = extractPhoneNumber(_0x1ce97f);
                if (_0x2b7d62 && _0x2b7d62['length'] >= 0xa) {
                    const _0x3b0eb1 = _0x0_0xa621e0('+' + _0x2b7d62);
                    _0x5683c8 = _0x3b0eb1['valid'] ? _0x3b0eb1['getNumber']('international') : _0x2b7d62;
                } else {
                    _0x5683c8 = _0x1ce97f['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x338804) {
            _0x873b11 = _0x4ad85d['pushName'] || _0x1ce97f['split']('@')[0x0];
            _0x5683c8 = _0x1ce97f['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x1abd5a = null;
        try {
            if (_0x1cff0a) {
                const _0x1753c0 = await _0x585b7f['groupMetadata'](_0x5aa6bb)['catch'](() => null);
                _0x1abd5a = _0x1753c0?.['subject'] || null;
            }
        } catch (_0x393867) {
            _0x1abd5a = null;
        }
        const _0xebd9b5 = Object['keys'](_0x4ad85d['message'] || {})[0x0];
        let _0x330d6e = '';
        let _0xc88cd5 = 0x0;
        let _0x465985 = ![];
        if (_0xebd9b5 === 'senderKeyDistributionMessage' || _0xebd9b5 === 'protocolMessage' || _0xebd9b5 === 'reactionMessage') {
            _0x465985 = !![];
        }
        if (_0x465985)
            return;
        const _0xa4937c = {
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
        if (_0x4ad85d['message']) {
            if (_0xebd9b5 === 'conversation') {
                _0x330d6e = _0x4ad85d['message']['conversation'];
            } else if (_0xebd9b5 === 'extendedTextMessage') {
                _0x330d6e = _0x4ad85d['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0xebd9b5 === 'imageMessage') {
                _0x330d6e = _0x4ad85d['message']['imageMessage']?.['caption'] || '[Image]';
                _0xc88cd5 = _0x4ad85d['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0xebd9b5 === 'videoMessage') {
                _0x330d6e = _0x4ad85d['message']['videoMessage']?.['caption'] || '[Video]';
                _0xc88cd5 = _0x4ad85d['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0xebd9b5 === 'audioMessage') {
                const _0x4519bb = _0x4ad85d['message']['audioMessage']?.['seconds'] || 0x0;
                _0x330d6e = '[Audio\x20' + Math['floor'](_0x4519bb / 0x3c) + ':' + (_0x4519bb % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0xc88cd5 = _0x4ad85d['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0xebd9b5 === 'documentMessage') {
                const _0x2306dc = _0x4ad85d['message']['documentMessage']?.['fileName'] || 'Document';
                _0x330d6e = '[📄\x20' + _0x2306dc + ']';
                _0xc88cd5 = _0x4ad85d['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0xebd9b5 === 'stickerMessage') {
                _0x330d6e = '[Sticker]';
                _0xc88cd5 = _0x4ad85d['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0xebd9b5 === 'contactMessage') {
                _0x330d6e = '[👤\x20' + (_0x4ad85d['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0xebd9b5 === 'locationMessage') {
                _0x330d6e = '[📍\x20Location]';
            } else {
                _0x330d6e = '[' + _0xebd9b5['replace']('Message', '') + ']';
            }
        }
        let _0x40dc1f = '';
        if (_0xc88cd5 > 0x0) {
            const _0x595668 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x569596 = Math['floor'](Math['log'](_0xc88cd5) / Math['log'](0x400));
            _0x40dc1f = '\x20(' + (_0xc88cd5 / Math['pow'](0x400, _0x569596))['toFixed'](0x1) + '\x20' + _0x595668[_0x569596] + ')';
        }
        const _0x11dcaf = _0x4ad85d['messageTimestamp'] ? new Date((_0x4ad85d['messageTimestamp']['low'] || _0x4ad85d['messageTimestamp']) * 0x3e8) : new Date();
        const _0x4a2f9a = _0x11dcaf['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x1c3708['timeZone'] || 'Asia/Karachi'
        });
        const _0x594b5d = _0x330d6e['startsWith']('.') || _0x330d6e['startsWith']('!') || _0x330d6e['startsWith']('#') || _0x330d6e['startsWith']('/');
        const _0x363aec = _0xa4937c[_0xebd9b5] || _0xebd9b5['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x3c4fbb['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x3c4fbb['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3c4fbb['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x3c4fbb['black'](_0x0_0x3c4fbb['bgCyan']['bold']('\x20' + _0x4a2f9a + '\x20')) + '\x20' + _0x0_0x3c4fbb['magenta']['bold'](_0x363aec) + _0x0_0x3c4fbb['gray']['bold'](_0x40dc1f));
        const _0x46971d = _0x873b11 && _0x873b11 !== _0x5683c8 ? _0x873b11 + '\x20(' + _0x5683c8 + ')' : _0x5683c8;
        console['log'](_0x0_0x3c4fbb['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x3a9c0 ? _0x0_0x3c4fbb['green']['bold']('📤\x20ME') : _0x0_0x3c4fbb['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x3c4fbb['white']['bold'](_0x46971d));
        if (_0x1cff0a && _0x1abd5a) {
            console['log'](_0x0_0x3c4fbb['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3c4fbb['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x3c4fbb['white']['bold'](_0x1abd5a));
        } else if (!_0x1cff0a) {
            console['log'](_0x0_0x3c4fbb['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3c4fbb['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x3c4fbb['white']['bold']('Private\x20Chat'));
        }
        if (_0x330d6e) {
            const _0x403030 = 0x64;
            const _0x50c71f = _0x330d6e['length'] > _0x403030 ? _0x330d6e['substring'](0x0, _0x403030) + '...' : _0x330d6e;
            const _0x1b15d1 = _0x330d6e['includes']('NOVA-MD') || _0x330d6e['includes']('Pinging...') || _0x330d6e['includes']('*🤖') || _0x3a9c0 && _0x330d6e['includes']('*');
            console['log'](_0x0_0x3c4fbb['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3c4fbb['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x594b5d ? _0x0_0x3c4fbb['greenBright']['bold'](_0x50c71f) : _0x1b15d1 ? _0x0_0x3c4fbb['cyan']['bold'](_0x50c71f) : _0x3a9c0 ? _0x0_0x3c4fbb['blueBright']['bold'](_0x50c71f) : _0x0_0x3c4fbb['white']['bold'](_0x50c71f)));
        }
        console['log'](_0x0_0x3c4fbb['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x5444a0) {
        console['log'](_0x0_0x3c4fbb['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x5444a0['message']);
        console['log'](_0x0_0x3c4fbb['gray']['bold']('[' + (_0x4c9c29['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x4c9c29['key']?.['remoteJid']));
    }
}
function printLog(_0x33ff94, _0x3ddc4a) {
    const _0xdf2ef0 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x1c3708['timeZone'] || 'Asia/Karachi'
    });
    const _0x45a638 = {
        'info': _0x0_0x3c4fbb['blue'],
        'success': _0x0_0x3c4fbb['green'],
        'warning': _0x0_0x3c4fbb['yellow'],
        'error': _0x0_0x3c4fbb['red'],
        'connection': _0x0_0x3c4fbb['cyan'],
        'store': _0x0_0x3c4fbb['magenta']
    };
    const _0x174df8 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x4eff0e = _0x45a638[_0x33ff94] || _0x0_0x3c4fbb['white'];
    const _0x1c6a28 = _0x174df8[_0x33ff94] || '•';
    console['log'](_0x0_0x3c4fbb['gray']['bold']('[' + _0xdf2ef0 + ']') + '\x20' + _0x4eff0e(_0x1c6a28) + '\x20' + _0x4eff0e(_0x3ddc4a));
}
export {
    printMessage,
    printLog
};