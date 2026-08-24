import _0x0_0x263ecd from 'chalk';
import _0x0_0x3323a5, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x3f6d8b from '../config.js';
function extractPhoneNumber(_0x3099d8) {
    if (!_0x3099d8)
        return null;
    const _0x283794 = _0x3099d8['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x283794['length'] < 0xa && _0x3099d8['includes']('@lid')) {
        return null;
    }
    return _0x283794;
}
async function getNameWithFallback(_0x41a4ce, _0x302b77, _0x2c823e) {
    try {
        if (_0x2c823e && _0x2c823e['trim']()) {
            return _0x2c823e['trim']();
        }
        if (_0x302b77['store']?.['contacts']?.[_0x41a4ce]) {
            const _0x25e75d = _0x302b77['store']['contacts'][_0x41a4ce];
            if (_0x25e75d['name'] || _0x25e75d['notify']) {
                return _0x25e75d['name'] || _0x25e75d['notify'];
            }
        }
        const _0x288e54 = extractPhoneNumber(_0x41a4ce);
        if (_0x288e54 && _0x288e54['length'] >= 0xa) {
            const _0x465e0d = _0x0_0x3323a5('+' + _0x288e54);
            if (_0x465e0d['valid']) {
                return null;
            }
        }
        return _0x41a4ce['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x4076b4) {
        return _0x41a4ce['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x373478, _0xb6f6c4) {
    try {
        if (!_0x373478?.['key'])
            return;
        const _0x214579 = _0x373478;
        const _0x5c85db = _0x214579['key']['remoteJid'];
        const _0x7fa393 = _0x214579['key']['participant'] || _0x214579['key']['remoteJid'];
        const _0x222b2f = _0x5c85db['endsWith']('@g.us');
        const _0x4cbe24 = _0x214579['key']['fromMe'];
        let _0xeadf2 = '';
        let _0x47f812 = '';
        try {
            if (_0x4cbe24) {
                _0xeadf2 = _0xb6f6c4['user']?.['name'] || 'Owner';
                const _0x896cad = extractPhoneNumber(_0xb6f6c4['user']?.['id'] || _0xb6f6c4['user']?.['jid']);
                if (_0x896cad) {
                    const _0x2b6626 = parsePhoneNumber('+' + _0x896cad);
                    _0x47f812 = _0x2b6626['valid'] ? _0x2b6626['number']?.['international'] || _0x896cad : _0x896cad;
                }
            } else {
                _0xeadf2 = await getNameWithFallback(_0x7fa393, _0xb6f6c4, _0x214579['pushName']);
                const _0x3d9caf = extractPhoneNumber(_0x7fa393);
                if (_0x3d9caf && _0x3d9caf['length'] >= 0xa) {
                    const _0xef0273 = _0x0_0x3323a5('+' + _0x3d9caf);
                    _0x47f812 = _0xef0273['valid'] ? _0xef0273['getNumber']('international') : _0x3d9caf;
                } else {
                    _0x47f812 = _0x7fa393['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x189703) {
            _0xeadf2 = _0x214579['pushName'] || _0x7fa393['split']('@')[0x0];
            _0x47f812 = _0x7fa393['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x45524e = null;
        try {
            if (_0x222b2f) {
                const _0x278b7e = await _0xb6f6c4['groupMetadata'](_0x5c85db)['catch'](() => null);
                _0x45524e = _0x278b7e?.['subject'] || null;
            }
        } catch (_0x46c221) {
            _0x45524e = null;
        }
        const _0x3f0cf0 = Object['keys'](_0x214579['message'] || {})[0x0];
        let _0x386327 = '';
        let _0x246f71 = 0x0;
        let _0x191a44 = ![];
        if (_0x3f0cf0 === 'senderKeyDistributionMessage' || _0x3f0cf0 === 'protocolMessage' || _0x3f0cf0 === 'reactionMessage') {
            _0x191a44 = !![];
        }
        if (_0x191a44)
            return;
        const _0x31bff7 = {
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
        if (_0x214579['message']) {
            if (_0x3f0cf0 === 'conversation') {
                _0x386327 = _0x214579['message']['conversation'];
            } else if (_0x3f0cf0 === 'extendedTextMessage') {
                _0x386327 = _0x214579['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x3f0cf0 === 'imageMessage') {
                _0x386327 = _0x214579['message']['imageMessage']?.['caption'] || '[Image]';
                _0x246f71 = _0x214579['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x3f0cf0 === 'videoMessage') {
                _0x386327 = _0x214579['message']['videoMessage']?.['caption'] || '[Video]';
                _0x246f71 = _0x214579['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x3f0cf0 === 'audioMessage') {
                const _0x3d56c3 = _0x214579['message']['audioMessage']?.['seconds'] || 0x0;
                _0x386327 = '[Audio\x20' + Math['floor'](_0x3d56c3 / 0x3c) + ':' + (_0x3d56c3 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x246f71 = _0x214579['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x3f0cf0 === 'documentMessage') {
                const _0x11d9fd = _0x214579['message']['documentMessage']?.['fileName'] || 'Document';
                _0x386327 = '[📄\x20' + _0x11d9fd + ']';
                _0x246f71 = _0x214579['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x3f0cf0 === 'stickerMessage') {
                _0x386327 = '[Sticker]';
                _0x246f71 = _0x214579['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x3f0cf0 === 'contactMessage') {
                _0x386327 = '[👤\x20' + (_0x214579['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x3f0cf0 === 'locationMessage') {
                _0x386327 = '[📍\x20Location]';
            } else {
                _0x386327 = '[' + _0x3f0cf0['replace']('Message', '') + ']';
            }
        }
        let _0x23eb71 = '';
        if (_0x246f71 > 0x0) {
            const _0x374582 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x4b73f0 = Math['floor'](Math['log'](_0x246f71) / Math['log'](0x400));
            _0x23eb71 = '\x20(' + (_0x246f71 / Math['pow'](0x400, _0x4b73f0))['toFixed'](0x1) + '\x20' + _0x374582[_0x4b73f0] + ')';
        }
        const _0x5926a6 = _0x214579['messageTimestamp'] ? new Date((_0x214579['messageTimestamp']['low'] || _0x214579['messageTimestamp']) * 0x3e8) : new Date();
        const _0x31658e = _0x5926a6['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x3f6d8b['timeZone'] || 'Asia/Karachi'
        });
        const _0x1f3726 = _0x386327['startsWith']('.') || _0x386327['startsWith']('!') || _0x386327['startsWith']('#') || _0x386327['startsWith']('/');
        const _0x4934f1 = _0x31bff7[_0x3f0cf0] || _0x3f0cf0['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x263ecd['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x263ecd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x263ecd['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x263ecd['black'](_0x0_0x263ecd['bgCyan']['bold']('\x20' + _0x31658e + '\x20')) + '\x20' + _0x0_0x263ecd['magenta']['bold'](_0x4934f1) + _0x0_0x263ecd['gray']['bold'](_0x23eb71));
        const _0x4170db = _0xeadf2 && _0xeadf2 !== _0x47f812 ? _0xeadf2 + '\x20(' + _0x47f812 + ')' : _0x47f812;
        console['log'](_0x0_0x263ecd['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x4cbe24 ? _0x0_0x263ecd['green']['bold']('📤\x20ME') : _0x0_0x263ecd['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x263ecd['white']['bold'](_0x4170db));
        if (_0x222b2f && _0x45524e) {
            console['log'](_0x0_0x263ecd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x263ecd['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x263ecd['white']['bold'](_0x45524e));
        } else if (!_0x222b2f) {
            console['log'](_0x0_0x263ecd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x263ecd['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x263ecd['white']['bold']('Private\x20Chat'));
        }
        if (_0x386327) {
            const _0x3caa43 = 0x64;
            const _0x3b35fc = _0x386327['length'] > _0x3caa43 ? _0x386327['substring'](0x0, _0x3caa43) + '...' : _0x386327;
            const _0x25509f = _0x386327['includes']('NOVA-MD') || _0x386327['includes']('Pinging...') || _0x386327['includes']('*🤖') || _0x4cbe24 && _0x386327['includes']('*');
            console['log'](_0x0_0x263ecd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x263ecd['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x1f3726 ? _0x0_0x263ecd['greenBright']['bold'](_0x3b35fc) : _0x25509f ? _0x0_0x263ecd['cyan']['bold'](_0x3b35fc) : _0x4cbe24 ? _0x0_0x263ecd['blueBright']['bold'](_0x3b35fc) : _0x0_0x263ecd['white']['bold'](_0x3b35fc)));
        }
        console['log'](_0x0_0x263ecd['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x354920) {
        console['log'](_0x0_0x263ecd['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x354920['message']);
        console['log'](_0x0_0x263ecd['gray']['bold']('[' + (_0x373478['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x373478['key']?.['remoteJid']));
    }
}
function printLog(_0x2e4f32, _0x324975) {
    const _0xa2601a = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x3f6d8b['timeZone'] || 'Asia/Karachi'
    });
    const _0x222ea5 = {
        'info': _0x0_0x263ecd['blue'],
        'success': _0x0_0x263ecd['green'],
        'warning': _0x0_0x263ecd['yellow'],
        'error': _0x0_0x263ecd['red'],
        'connection': _0x0_0x263ecd['cyan'],
        'store': _0x0_0x263ecd['magenta']
    };
    const _0x4a900a = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x3dbe5f = _0x222ea5[_0x2e4f32] || _0x0_0x263ecd['white'];
    const _0x2ac8c6 = _0x4a900a[_0x2e4f32] || '•';
    console['log'](_0x0_0x263ecd['gray']['bold']('[' + _0xa2601a + ']') + '\x20' + _0x3dbe5f(_0x2ac8c6) + '\x20' + _0x3dbe5f(_0x324975));
}
export {
    printMessage,
    printLog
};