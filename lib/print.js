import _0x0_0x10e776 from 'chalk';
import _0x0_0xe99c49, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x27d062 from '../config.js';
function extractPhoneNumber(_0x3fd8fb) {
    if (!_0x3fd8fb)
        return null;
    const _0x53ee82 = _0x3fd8fb['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x53ee82['length'] < 0xa && _0x3fd8fb['includes']('@lid')) {
        return null;
    }
    return _0x53ee82;
}
async function getNameWithFallback(_0x5b2caa, _0x52329c, _0x5655ef) {
    try {
        if (_0x5655ef && _0x5655ef['trim']()) {
            return _0x5655ef['trim']();
        }
        if (_0x52329c['store']?.['contacts']?.[_0x5b2caa]) {
            const _0xebbf5d = _0x52329c['store']['contacts'][_0x5b2caa];
            if (_0xebbf5d['name'] || _0xebbf5d['notify']) {
                return _0xebbf5d['name'] || _0xebbf5d['notify'];
            }
        }
        const _0x13244f = extractPhoneNumber(_0x5b2caa);
        if (_0x13244f && _0x13244f['length'] >= 0xa) {
            const _0x52f310 = _0x0_0xe99c49('+' + _0x13244f);
            if (_0x52f310['valid']) {
                return null;
            }
        }
        return _0x5b2caa['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x4e830f) {
        return _0x5b2caa['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0xd79cc6, _0x2ec574) {
    try {
        if (!_0xd79cc6?.['key'])
            return;
        const _0xfb62be = _0xd79cc6;
        const _0x59ff29 = _0xfb62be['key']['remoteJid'];
        const _0x59f0f4 = _0xfb62be['key']['participant'] || _0xfb62be['key']['remoteJid'];
        const _0x300e9b = _0x59ff29['endsWith']('@g.us');
        const _0x2ffebd = _0xfb62be['key']['fromMe'];
        let _0x461306 = '';
        let _0x7bbfae = '';
        try {
            if (_0x2ffebd) {
                _0x461306 = _0x2ec574['user']?.['name'] || 'Owner';
                const _0x41c34a = extractPhoneNumber(_0x2ec574['user']?.['id'] || _0x2ec574['user']?.['jid']);
                if (_0x41c34a) {
                    const _0x41df27 = parsePhoneNumber('+' + _0x41c34a);
                    _0x7bbfae = _0x41df27['valid'] ? _0x41df27['number']?.['international'] || _0x41c34a : _0x41c34a;
                }
            } else {
                _0x461306 = await getNameWithFallback(_0x59f0f4, _0x2ec574, _0xfb62be['pushName']);
                const _0x22379e = extractPhoneNumber(_0x59f0f4);
                if (_0x22379e && _0x22379e['length'] >= 0xa) {
                    const _0x47902d = _0x0_0xe99c49('+' + _0x22379e);
                    _0x7bbfae = _0x47902d['valid'] ? _0x47902d['getNumber']('international') : _0x22379e;
                } else {
                    _0x7bbfae = _0x59f0f4['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x5977c5) {
            _0x461306 = _0xfb62be['pushName'] || _0x59f0f4['split']('@')[0x0];
            _0x7bbfae = _0x59f0f4['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0xa64cca = null;
        try {
            if (_0x300e9b) {
                const _0x2162f8 = await _0x2ec574['groupMetadata'](_0x59ff29)['catch'](() => null);
                _0xa64cca = _0x2162f8?.['subject'] || null;
            }
        } catch (_0x1c5177) {
            _0xa64cca = null;
        }
        const _0x1f78a6 = Object['keys'](_0xfb62be['message'] || {})[0x0];
        let _0x3d67d4 = '';
        let _0x1f0c5f = 0x0;
        let _0x562d99 = ![];
        if (_0x1f78a6 === 'senderKeyDistributionMessage' || _0x1f78a6 === 'protocolMessage' || _0x1f78a6 === 'reactionMessage') {
            _0x562d99 = !![];
        }
        if (_0x562d99)
            return;
        const _0x42343d = {
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
        if (_0xfb62be['message']) {
            if (_0x1f78a6 === 'conversation') {
                _0x3d67d4 = _0xfb62be['message']['conversation'];
            } else if (_0x1f78a6 === 'extendedTextMessage') {
                _0x3d67d4 = _0xfb62be['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x1f78a6 === 'imageMessage') {
                _0x3d67d4 = _0xfb62be['message']['imageMessage']?.['caption'] || '[Image]';
                _0x1f0c5f = _0xfb62be['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x1f78a6 === 'videoMessage') {
                _0x3d67d4 = _0xfb62be['message']['videoMessage']?.['caption'] || '[Video]';
                _0x1f0c5f = _0xfb62be['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x1f78a6 === 'audioMessage') {
                const _0x18fe77 = _0xfb62be['message']['audioMessage']?.['seconds'] || 0x0;
                _0x3d67d4 = '[Audio\x20' + Math['floor'](_0x18fe77 / 0x3c) + ':' + (_0x18fe77 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x1f0c5f = _0xfb62be['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x1f78a6 === 'documentMessage') {
                const _0x161059 = _0xfb62be['message']['documentMessage']?.['fileName'] || 'Document';
                _0x3d67d4 = '[📄\x20' + _0x161059 + ']';
                _0x1f0c5f = _0xfb62be['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x1f78a6 === 'stickerMessage') {
                _0x3d67d4 = '[Sticker]';
                _0x1f0c5f = _0xfb62be['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x1f78a6 === 'contactMessage') {
                _0x3d67d4 = '[👤\x20' + (_0xfb62be['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x1f78a6 === 'locationMessage') {
                _0x3d67d4 = '[📍\x20Location]';
            } else {
                _0x3d67d4 = '[' + _0x1f78a6['replace']('Message', '') + ']';
            }
        }
        let _0x575d3e = '';
        if (_0x1f0c5f > 0x0) {
            const _0x2316df = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x89019a = Math['floor'](Math['log'](_0x1f0c5f) / Math['log'](0x400));
            _0x575d3e = '\x20(' + (_0x1f0c5f / Math['pow'](0x400, _0x89019a))['toFixed'](0x1) + '\x20' + _0x2316df[_0x89019a] + ')';
        }
        const _0x1c0aa6 = _0xfb62be['messageTimestamp'] ? new Date((_0xfb62be['messageTimestamp']['low'] || _0xfb62be['messageTimestamp']) * 0x3e8) : new Date();
        const _0x2ae48c = _0x1c0aa6['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x27d062['timeZone'] || 'Asia/Karachi'
        });
        const _0x33948e = _0x3d67d4['startsWith']('.') || _0x3d67d4['startsWith']('!') || _0x3d67d4['startsWith']('#') || _0x3d67d4['startsWith']('/');
        const _0x2fe124 = _0x42343d[_0x1f78a6] || _0x1f78a6['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x10e776['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x10e776['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x10e776['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x10e776['black'](_0x0_0x10e776['bgCyan']['bold']('\x20' + _0x2ae48c + '\x20')) + '\x20' + _0x0_0x10e776['magenta']['bold'](_0x2fe124) + _0x0_0x10e776['gray']['bold'](_0x575d3e));
        const _0x87df14 = _0x461306 && _0x461306 !== _0x7bbfae ? _0x461306 + '\x20(' + _0x7bbfae + ')' : _0x7bbfae;
        console['log'](_0x0_0x10e776['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x2ffebd ? _0x0_0x10e776['green']['bold']('📤\x20ME') : _0x0_0x10e776['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x10e776['white']['bold'](_0x87df14));
        if (_0x300e9b && _0xa64cca) {
            console['log'](_0x0_0x10e776['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x10e776['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x10e776['white']['bold'](_0xa64cca));
        } else if (!_0x300e9b) {
            console['log'](_0x0_0x10e776['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x10e776['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x10e776['white']['bold']('Private\x20Chat'));
        }
        if (_0x3d67d4) {
            const _0x126a1a = 0x64;
            const _0x10a766 = _0x3d67d4['length'] > _0x126a1a ? _0x3d67d4['substring'](0x0, _0x126a1a) + '...' : _0x3d67d4;
            const _0x4ea201 = _0x3d67d4['includes']('NOVA-MD') || _0x3d67d4['includes']('Pinging...') || _0x3d67d4['includes']('*🤖') || _0x2ffebd && _0x3d67d4['includes']('*');
            console['log'](_0x0_0x10e776['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x10e776['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x33948e ? _0x0_0x10e776['greenBright']['bold'](_0x10a766) : _0x4ea201 ? _0x0_0x10e776['cyan']['bold'](_0x10a766) : _0x2ffebd ? _0x0_0x10e776['blueBright']['bold'](_0x10a766) : _0x0_0x10e776['white']['bold'](_0x10a766)));
        }
        console['log'](_0x0_0x10e776['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x3642bf) {
        console['log'](_0x0_0x10e776['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x3642bf['message']);
        console['log'](_0x0_0x10e776['gray']['bold']('[' + (_0xd79cc6['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0xd79cc6['key']?.['remoteJid']));
    }
}
function printLog(_0x338f9e, _0x4e0011) {
    const _0x2534e9 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x27d062['timeZone'] || 'Asia/Karachi'
    });
    const _0x35ddd2 = {
        'info': _0x0_0x10e776['blue'],
        'success': _0x0_0x10e776['green'],
        'warning': _0x0_0x10e776['yellow'],
        'error': _0x0_0x10e776['red'],
        'connection': _0x0_0x10e776['cyan'],
        'store': _0x0_0x10e776['magenta']
    };
    const _0x5b67d1 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x29b29b = _0x35ddd2[_0x338f9e] || _0x0_0x10e776['white'];
    const _0x22bbd9 = _0x5b67d1[_0x338f9e] || '•';
    console['log'](_0x0_0x10e776['gray']['bold']('[' + _0x2534e9 + ']') + '\x20' + _0x29b29b(_0x22bbd9) + '\x20' + _0x29b29b(_0x4e0011));
}
export {
    printMessage,
    printLog
};