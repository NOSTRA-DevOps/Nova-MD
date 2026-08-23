import _0x0_0x3b5bae from 'chalk';
import _0x0_0x264ded, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x50620c from '../config.js';
function extractPhoneNumber(_0x30a522) {
    if (!_0x30a522)
        return null;
    const _0x5059cb = _0x30a522['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x5059cb['length'] < 0xa && _0x30a522['includes']('@lid')) {
        return null;
    }
    return _0x5059cb;
}
async function getNameWithFallback(_0x2029f7, _0x550fd6, _0x1858fd) {
    try {
        if (_0x1858fd && _0x1858fd['trim']()) {
            return _0x1858fd['trim']();
        }
        if (_0x550fd6['store']?.['contacts']?.[_0x2029f7]) {
            const _0x24438f = _0x550fd6['store']['contacts'][_0x2029f7];
            if (_0x24438f['name'] || _0x24438f['notify']) {
                return _0x24438f['name'] || _0x24438f['notify'];
            }
        }
        const _0x46a468 = extractPhoneNumber(_0x2029f7);
        if (_0x46a468 && _0x46a468['length'] >= 0xa) {
            const _0xa35ffe = _0x0_0x264ded('+' + _0x46a468);
            if (_0xa35ffe['valid']) {
                return null;
            }
        }
        return _0x2029f7['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x21e7c9) {
        return _0x2029f7['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x3f6264, _0x19abae) {
    try {
        if (!_0x3f6264?.['key'])
            return;
        const _0x30663f = _0x3f6264;
        const _0x21621e = _0x30663f['key']['remoteJid'];
        const _0x392431 = _0x30663f['key']['participant'] || _0x30663f['key']['remoteJid'];
        const _0x2a08e1 = _0x21621e['endsWith']('@g.us');
        const _0x57a678 = _0x30663f['key']['fromMe'];
        let _0x13f00a = '';
        let _0x310c90 = '';
        try {
            if (_0x57a678) {
                _0x13f00a = _0x19abae['user']?.['name'] || 'Owner';
                const _0x335170 = extractPhoneNumber(_0x19abae['user']?.['id'] || _0x19abae['user']?.['jid']);
                if (_0x335170) {
                    const _0x4115ec = parsePhoneNumber('+' + _0x335170);
                    _0x310c90 = _0x4115ec['valid'] ? _0x4115ec['number']?.['international'] || _0x335170 : _0x335170;
                }
            } else {
                _0x13f00a = await getNameWithFallback(_0x392431, _0x19abae, _0x30663f['pushName']);
                const _0x5c4b5e = extractPhoneNumber(_0x392431);
                if (_0x5c4b5e && _0x5c4b5e['length'] >= 0xa) {
                    const _0x4af497 = _0x0_0x264ded('+' + _0x5c4b5e);
                    _0x310c90 = _0x4af497['valid'] ? _0x4af497['getNumber']('international') : _0x5c4b5e;
                } else {
                    _0x310c90 = _0x392431['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x5602d5) {
            _0x13f00a = _0x30663f['pushName'] || _0x392431['split']('@')[0x0];
            _0x310c90 = _0x392431['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x40e3ad = null;
        try {
            if (_0x2a08e1) {
                const _0x3fd5ed = await _0x19abae['groupMetadata'](_0x21621e)['catch'](() => null);
                _0x40e3ad = _0x3fd5ed?.['subject'] || null;
            }
        } catch (_0x2210cd) {
            _0x40e3ad = null;
        }
        const _0x2755c8 = Object['keys'](_0x30663f['message'] || {})[0x0];
        let _0x9d97a9 = '';
        let _0xbc09d4 = 0x0;
        let _0x4673c3 = ![];
        if (_0x2755c8 === 'senderKeyDistributionMessage' || _0x2755c8 === 'protocolMessage' || _0x2755c8 === 'reactionMessage') {
            _0x4673c3 = !![];
        }
        if (_0x4673c3)
            return;
        const _0x3d636d = {
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
        if (_0x30663f['message']) {
            if (_0x2755c8 === 'conversation') {
                _0x9d97a9 = _0x30663f['message']['conversation'];
            } else if (_0x2755c8 === 'extendedTextMessage') {
                _0x9d97a9 = _0x30663f['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x2755c8 === 'imageMessage') {
                _0x9d97a9 = _0x30663f['message']['imageMessage']?.['caption'] || '[Image]';
                _0xbc09d4 = _0x30663f['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x2755c8 === 'videoMessage') {
                _0x9d97a9 = _0x30663f['message']['videoMessage']?.['caption'] || '[Video]';
                _0xbc09d4 = _0x30663f['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x2755c8 === 'audioMessage') {
                const _0x2ee60a = _0x30663f['message']['audioMessage']?.['seconds'] || 0x0;
                _0x9d97a9 = '[Audio\x20' + Math['floor'](_0x2ee60a / 0x3c) + ':' + (_0x2ee60a % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0xbc09d4 = _0x30663f['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x2755c8 === 'documentMessage') {
                const _0x126fcc = _0x30663f['message']['documentMessage']?.['fileName'] || 'Document';
                _0x9d97a9 = '[📄\x20' + _0x126fcc + ']';
                _0xbc09d4 = _0x30663f['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x2755c8 === 'stickerMessage') {
                _0x9d97a9 = '[Sticker]';
                _0xbc09d4 = _0x30663f['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x2755c8 === 'contactMessage') {
                _0x9d97a9 = '[👤\x20' + (_0x30663f['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x2755c8 === 'locationMessage') {
                _0x9d97a9 = '[📍\x20Location]';
            } else {
                _0x9d97a9 = '[' + _0x2755c8['replace']('Message', '') + ']';
            }
        }
        let _0x1e0189 = '';
        if (_0xbc09d4 > 0x0) {
            const _0x150cac = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x232ad1 = Math['floor'](Math['log'](_0xbc09d4) / Math['log'](0x400));
            _0x1e0189 = '\x20(' + (_0xbc09d4 / Math['pow'](0x400, _0x232ad1))['toFixed'](0x1) + '\x20' + _0x150cac[_0x232ad1] + ')';
        }
        const _0x1335de = _0x30663f['messageTimestamp'] ? new Date((_0x30663f['messageTimestamp']['low'] || _0x30663f['messageTimestamp']) * 0x3e8) : new Date();
        const _0x3b8ece = _0x1335de['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x50620c['timeZone'] || 'Asia/Karachi'
        });
        const _0xf680e0 = _0x9d97a9['startsWith']('.') || _0x9d97a9['startsWith']('!') || _0x9d97a9['startsWith']('#') || _0x9d97a9['startsWith']('/');
        const _0x233405 = _0x3d636d[_0x2755c8] || _0x2755c8['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x3b5bae['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x3b5bae['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3b5bae['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x3b5bae['black'](_0x0_0x3b5bae['bgCyan']['bold']('\x20' + _0x3b8ece + '\x20')) + '\x20' + _0x0_0x3b5bae['magenta']['bold'](_0x233405) + _0x0_0x3b5bae['gray']['bold'](_0x1e0189));
        const _0x1467f3 = _0x13f00a && _0x13f00a !== _0x310c90 ? _0x13f00a + '\x20(' + _0x310c90 + ')' : _0x310c90;
        console['log'](_0x0_0x3b5bae['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x57a678 ? _0x0_0x3b5bae['green']['bold']('📤\x20ME') : _0x0_0x3b5bae['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x3b5bae['white']['bold'](_0x1467f3));
        if (_0x2a08e1 && _0x40e3ad) {
            console['log'](_0x0_0x3b5bae['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3b5bae['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x3b5bae['white']['bold'](_0x40e3ad));
        } else if (!_0x2a08e1) {
            console['log'](_0x0_0x3b5bae['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3b5bae['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x3b5bae['white']['bold']('Private\x20Chat'));
        }
        if (_0x9d97a9) {
            const _0x4c1704 = 0x64;
            const _0x478ecc = _0x9d97a9['length'] > _0x4c1704 ? _0x9d97a9['substring'](0x0, _0x4c1704) + '...' : _0x9d97a9;
            const _0xc10909 = _0x9d97a9['includes']('NOVA-MD') || _0x9d97a9['includes']('Pinging...') || _0x9d97a9['includes']('*🤖') || _0x57a678 && _0x9d97a9['includes']('*');
            console['log'](_0x0_0x3b5bae['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x3b5bae['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0xf680e0 ? _0x0_0x3b5bae['greenBright']['bold'](_0x478ecc) : _0xc10909 ? _0x0_0x3b5bae['cyan']['bold'](_0x478ecc) : _0x57a678 ? _0x0_0x3b5bae['blueBright']['bold'](_0x478ecc) : _0x0_0x3b5bae['white']['bold'](_0x478ecc)));
        }
        console['log'](_0x0_0x3b5bae['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x15295b) {
        console['log'](_0x0_0x3b5bae['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x15295b['message']);
        console['log'](_0x0_0x3b5bae['gray']['bold']('[' + (_0x3f6264['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x3f6264['key']?.['remoteJid']));
    }
}
function printLog(_0x9d1635, _0x15419b) {
    const _0x4582cc = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x50620c['timeZone'] || 'Asia/Karachi'
    });
    const _0x380ec4 = {
        'info': _0x0_0x3b5bae['blue'],
        'success': _0x0_0x3b5bae['green'],
        'warning': _0x0_0x3b5bae['yellow'],
        'error': _0x0_0x3b5bae['red'],
        'connection': _0x0_0x3b5bae['cyan'],
        'store': _0x0_0x3b5bae['magenta']
    };
    const _0x6f1ec7 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x2f7023 = _0x380ec4[_0x9d1635] || _0x0_0x3b5bae['white'];
    const _0x31f77 = _0x6f1ec7[_0x9d1635] || '•';
    console['log'](_0x0_0x3b5bae['gray']['bold']('[' + _0x4582cc + ']') + '\x20' + _0x2f7023(_0x31f77) + '\x20' + _0x2f7023(_0x15419b));
}
export {
    printMessage,
    printLog
};