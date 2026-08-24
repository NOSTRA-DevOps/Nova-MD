import _0x0_0x4ded31 from 'chalk';
import _0x0_0x3f9732, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x1de9b1 from '../config.js';
function extractPhoneNumber(_0xeaf1a1) {
    if (!_0xeaf1a1)
        return null;
    const _0x3ed203 = _0xeaf1a1['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x3ed203['length'] < 0xa && _0xeaf1a1['includes']('@lid')) {
        return null;
    }
    return _0x3ed203;
}
async function getNameWithFallback(_0x37a705, _0x292c95, _0x4083b5) {
    try {
        if (_0x4083b5 && _0x4083b5['trim']()) {
            return _0x4083b5['trim']();
        }
        if (_0x292c95['store']?.['contacts']?.[_0x37a705]) {
            const _0x100e7c = _0x292c95['store']['contacts'][_0x37a705];
            if (_0x100e7c['name'] || _0x100e7c['notify']) {
                return _0x100e7c['name'] || _0x100e7c['notify'];
            }
        }
        const _0xc88cc3 = extractPhoneNumber(_0x37a705);
        if (_0xc88cc3 && _0xc88cc3['length'] >= 0xa) {
            const _0x8d2c7 = _0x0_0x3f9732('+' + _0xc88cc3);
            if (_0x8d2c7['valid']) {
                return null;
            }
        }
        return _0x37a705['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x425bca) {
        return _0x37a705['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x54bea0, _0x5740c6) {
    try {
        if (!_0x54bea0?.['key'])
            return;
        const _0x40fe93 = _0x54bea0;
        const _0x137437 = _0x40fe93['key']['remoteJid'];
        const _0x5b1905 = _0x40fe93['key']['participant'] || _0x40fe93['key']['remoteJid'];
        const _0x3d1e59 = _0x137437['endsWith']('@g.us');
        const _0x5b54a0 = _0x40fe93['key']['fromMe'];
        let _0x16336f = '';
        let _0x2b532b = '';
        try {
            if (_0x5b54a0) {
                _0x16336f = _0x5740c6['user']?.['name'] || 'Owner';
                const _0x3278f8 = extractPhoneNumber(_0x5740c6['user']?.['id'] || _0x5740c6['user']?.['jid']);
                if (_0x3278f8) {
                    const _0x916a2c = parsePhoneNumber('+' + _0x3278f8);
                    _0x2b532b = _0x916a2c['valid'] ? _0x916a2c['number']?.['international'] || _0x3278f8 : _0x3278f8;
                }
            } else {
                _0x16336f = await getNameWithFallback(_0x5b1905, _0x5740c6, _0x40fe93['pushName']);
                const _0x12c6eb = extractPhoneNumber(_0x5b1905);
                if (_0x12c6eb && _0x12c6eb['length'] >= 0xa) {
                    const _0x319b9a = _0x0_0x3f9732('+' + _0x12c6eb);
                    _0x2b532b = _0x319b9a['valid'] ? _0x319b9a['getNumber']('international') : _0x12c6eb;
                } else {
                    _0x2b532b = _0x5b1905['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x3a7095) {
            _0x16336f = _0x40fe93['pushName'] || _0x5b1905['split']('@')[0x0];
            _0x2b532b = _0x5b1905['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x5c11c0 = null;
        try {
            if (_0x3d1e59) {
                const _0x50cfe3 = await _0x5740c6['groupMetadata'](_0x137437)['catch'](() => null);
                _0x5c11c0 = _0x50cfe3?.['subject'] || null;
            }
        } catch (_0x2e5294) {
            _0x5c11c0 = null;
        }
        const _0x2c3623 = Object['keys'](_0x40fe93['message'] || {})[0x0];
        let _0x321611 = '';
        let _0x205557 = 0x0;
        let _0x1652e3 = ![];
        if (_0x2c3623 === 'senderKeyDistributionMessage' || _0x2c3623 === 'protocolMessage' || _0x2c3623 === 'reactionMessage') {
            _0x1652e3 = !![];
        }
        if (_0x1652e3)
            return;
        const _0x438bfb = {
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
        if (_0x40fe93['message']) {
            if (_0x2c3623 === 'conversation') {
                _0x321611 = _0x40fe93['message']['conversation'];
            } else if (_0x2c3623 === 'extendedTextMessage') {
                _0x321611 = _0x40fe93['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x2c3623 === 'imageMessage') {
                _0x321611 = _0x40fe93['message']['imageMessage']?.['caption'] || '[Image]';
                _0x205557 = _0x40fe93['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x2c3623 === 'videoMessage') {
                _0x321611 = _0x40fe93['message']['videoMessage']?.['caption'] || '[Video]';
                _0x205557 = _0x40fe93['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x2c3623 === 'audioMessage') {
                const _0x5b0be4 = _0x40fe93['message']['audioMessage']?.['seconds'] || 0x0;
                _0x321611 = '[Audio\x20' + Math['floor'](_0x5b0be4 / 0x3c) + ':' + (_0x5b0be4 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x205557 = _0x40fe93['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x2c3623 === 'documentMessage') {
                const _0x2fb9db = _0x40fe93['message']['documentMessage']?.['fileName'] || 'Document';
                _0x321611 = '[📄\x20' + _0x2fb9db + ']';
                _0x205557 = _0x40fe93['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x2c3623 === 'stickerMessage') {
                _0x321611 = '[Sticker]';
                _0x205557 = _0x40fe93['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x2c3623 === 'contactMessage') {
                _0x321611 = '[👤\x20' + (_0x40fe93['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x2c3623 === 'locationMessage') {
                _0x321611 = '[📍\x20Location]';
            } else {
                _0x321611 = '[' + _0x2c3623['replace']('Message', '') + ']';
            }
        }
        let _0x1dde5d = '';
        if (_0x205557 > 0x0) {
            const _0x5d0f8a = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x2411ba = Math['floor'](Math['log'](_0x205557) / Math['log'](0x400));
            _0x1dde5d = '\x20(' + (_0x205557 / Math['pow'](0x400, _0x2411ba))['toFixed'](0x1) + '\x20' + _0x5d0f8a[_0x2411ba] + ')';
        }
        const _0x4b0c05 = _0x40fe93['messageTimestamp'] ? new Date((_0x40fe93['messageTimestamp']['low'] || _0x40fe93['messageTimestamp']) * 0x3e8) : new Date();
        const _0x3eda50 = _0x4b0c05['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x1de9b1['timeZone'] || 'Asia/Karachi'
        });
        const _0x24d5f0 = _0x321611['startsWith']('.') || _0x321611['startsWith']('!') || _0x321611['startsWith']('#') || _0x321611['startsWith']('/');
        const _0x589c85 = _0x438bfb[_0x2c3623] || _0x2c3623['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x4ded31['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x4ded31['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4ded31['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x4ded31['black'](_0x0_0x4ded31['bgCyan']['bold']('\x20' + _0x3eda50 + '\x20')) + '\x20' + _0x0_0x4ded31['magenta']['bold'](_0x589c85) + _0x0_0x4ded31['gray']['bold'](_0x1dde5d));
        const _0x333f1f = _0x16336f && _0x16336f !== _0x2b532b ? _0x16336f + '\x20(' + _0x2b532b + ')' : _0x2b532b;
        console['log'](_0x0_0x4ded31['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x5b54a0 ? _0x0_0x4ded31['green']['bold']('📤\x20ME') : _0x0_0x4ded31['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x4ded31['white']['bold'](_0x333f1f));
        if (_0x3d1e59 && _0x5c11c0) {
            console['log'](_0x0_0x4ded31['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4ded31['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x4ded31['white']['bold'](_0x5c11c0));
        } else if (!_0x3d1e59) {
            console['log'](_0x0_0x4ded31['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4ded31['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x4ded31['white']['bold']('Private\x20Chat'));
        }
        if (_0x321611) {
            const _0x172e0a = 0x64;
            const _0x2a1eef = _0x321611['length'] > _0x172e0a ? _0x321611['substring'](0x0, _0x172e0a) + '...' : _0x321611;
            const _0x38081d = _0x321611['includes']('NOVA-MD') || _0x321611['includes']('Pinging...') || _0x321611['includes']('*🤖') || _0x5b54a0 && _0x321611['includes']('*');
            console['log'](_0x0_0x4ded31['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4ded31['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x24d5f0 ? _0x0_0x4ded31['greenBright']['bold'](_0x2a1eef) : _0x38081d ? _0x0_0x4ded31['cyan']['bold'](_0x2a1eef) : _0x5b54a0 ? _0x0_0x4ded31['blueBright']['bold'](_0x2a1eef) : _0x0_0x4ded31['white']['bold'](_0x2a1eef)));
        }
        console['log'](_0x0_0x4ded31['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x411606) {
        console['log'](_0x0_0x4ded31['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x411606['message']);
        console['log'](_0x0_0x4ded31['gray']['bold']('[' + (_0x54bea0['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x54bea0['key']?.['remoteJid']));
    }
}
function printLog(_0x57a5f7, _0x381007) {
    const _0xdfbea1 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x1de9b1['timeZone'] || 'Asia/Karachi'
    });
    const _0x428a4e = {
        'info': _0x0_0x4ded31['blue'],
        'success': _0x0_0x4ded31['green'],
        'warning': _0x0_0x4ded31['yellow'],
        'error': _0x0_0x4ded31['red'],
        'connection': _0x0_0x4ded31['cyan'],
        'store': _0x0_0x4ded31['magenta']
    };
    const _0xfd15e7 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x479d8b = _0x428a4e[_0x57a5f7] || _0x0_0x4ded31['white'];
    const _0x275b42 = _0xfd15e7[_0x57a5f7] || '•';
    console['log'](_0x0_0x4ded31['gray']['bold']('[' + _0xdfbea1 + ']') + '\x20' + _0x479d8b(_0x275b42) + '\x20' + _0x479d8b(_0x381007));
}
export {
    printMessage,
    printLog
};