import _0x0_0x8c3664 from 'chalk';
import _0x0_0xbd7473, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x1cb896 from '../config.js';
function extractPhoneNumber(_0x343b50) {
    if (!_0x343b50)
        return null;
    const _0x5df7fa = _0x343b50['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x5df7fa['length'] < 0xa && _0x343b50['includes']('@lid')) {
        return null;
    }
    return _0x5df7fa;
}
async function getNameWithFallback(_0xbca8dd, _0x31b794, _0x2e3351) {
    try {
        if (_0x2e3351 && _0x2e3351['trim']()) {
            return _0x2e3351['trim']();
        }
        if (_0x31b794['store']?.['contacts']?.[_0xbca8dd]) {
            const _0x590a7c = _0x31b794['store']['contacts'][_0xbca8dd];
            if (_0x590a7c['name'] || _0x590a7c['notify']) {
                return _0x590a7c['name'] || _0x590a7c['notify'];
            }
        }
        const _0x587ab1 = extractPhoneNumber(_0xbca8dd);
        if (_0x587ab1 && _0x587ab1['length'] >= 0xa) {
            const _0x325e8d = _0x0_0xbd7473('+' + _0x587ab1);
            if (_0x325e8d['valid']) {
                return null;
            }
        }
        return _0xbca8dd['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x4e5eb6) {
        return _0xbca8dd['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x4c6a2d, _0x161b63) {
    try {
        if (!_0x4c6a2d?.['key'])
            return;
        const _0x32b392 = _0x4c6a2d;
        const _0x4e01c5 = _0x32b392['key']['remoteJid'];
        const _0x2cf799 = _0x32b392['key']['participant'] || _0x32b392['key']['remoteJid'];
        const _0x3e14c3 = _0x4e01c5['endsWith']('@g.us');
        const _0x474497 = _0x32b392['key']['fromMe'];
        let _0x224ca4 = '';
        let _0x17315e = '';
        try {
            if (_0x474497) {
                _0x224ca4 = _0x161b63['user']?.['name'] || 'Owner';
                const _0x16a840 = extractPhoneNumber(_0x161b63['user']?.['id'] || _0x161b63['user']?.['jid']);
                if (_0x16a840) {
                    const _0x51fe14 = parsePhoneNumber('+' + _0x16a840);
                    _0x17315e = _0x51fe14['valid'] ? _0x51fe14['number']?.['international'] || _0x16a840 : _0x16a840;
                }
            } else {
                _0x224ca4 = await getNameWithFallback(_0x2cf799, _0x161b63, _0x32b392['pushName']);
                const _0x3c3f47 = extractPhoneNumber(_0x2cf799);
                if (_0x3c3f47 && _0x3c3f47['length'] >= 0xa) {
                    const _0x29ac99 = _0x0_0xbd7473('+' + _0x3c3f47);
                    _0x17315e = _0x29ac99['valid'] ? _0x29ac99['getNumber']('international') : _0x3c3f47;
                } else {
                    _0x17315e = _0x2cf799['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x263e03) {
            _0x224ca4 = _0x32b392['pushName'] || _0x2cf799['split']('@')[0x0];
            _0x17315e = _0x2cf799['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x4eb84b = null;
        try {
            if (_0x3e14c3) {
                const _0x5930cc = await _0x161b63['groupMetadata'](_0x4e01c5)['catch'](() => null);
                _0x4eb84b = _0x5930cc?.['subject'] || null;
            }
        } catch (_0x75b477) {
            _0x4eb84b = null;
        }
        const _0x23da80 = Object['keys'](_0x32b392['message'] || {})[0x0];
        let _0x1baba8 = '';
        let _0x1b7348 = 0x0;
        let _0x5389ca = ![];
        if (_0x23da80 === 'senderKeyDistributionMessage' || _0x23da80 === 'protocolMessage' || _0x23da80 === 'reactionMessage') {
            _0x5389ca = !![];
        }
        if (_0x5389ca)
            return;
        const _0x38dcb4 = {
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
        if (_0x32b392['message']) {
            if (_0x23da80 === 'conversation') {
                _0x1baba8 = _0x32b392['message']['conversation'];
            } else if (_0x23da80 === 'extendedTextMessage') {
                _0x1baba8 = _0x32b392['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x23da80 === 'imageMessage') {
                _0x1baba8 = _0x32b392['message']['imageMessage']?.['caption'] || '[Image]';
                _0x1b7348 = _0x32b392['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x23da80 === 'videoMessage') {
                _0x1baba8 = _0x32b392['message']['videoMessage']?.['caption'] || '[Video]';
                _0x1b7348 = _0x32b392['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x23da80 === 'audioMessage') {
                const _0x1ee257 = _0x32b392['message']['audioMessage']?.['seconds'] || 0x0;
                _0x1baba8 = '[Audio\x20' + Math['floor'](_0x1ee257 / 0x3c) + ':' + (_0x1ee257 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x1b7348 = _0x32b392['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x23da80 === 'documentMessage') {
                const _0x39f854 = _0x32b392['message']['documentMessage']?.['fileName'] || 'Document';
                _0x1baba8 = '[📄\x20' + _0x39f854 + ']';
                _0x1b7348 = _0x32b392['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x23da80 === 'stickerMessage') {
                _0x1baba8 = '[Sticker]';
                _0x1b7348 = _0x32b392['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x23da80 === 'contactMessage') {
                _0x1baba8 = '[👤\x20' + (_0x32b392['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x23da80 === 'locationMessage') {
                _0x1baba8 = '[📍\x20Location]';
            } else {
                _0x1baba8 = '[' + _0x23da80['replace']('Message', '') + ']';
            }
        }
        let _0x1220a3 = '';
        if (_0x1b7348 > 0x0) {
            const _0x8b5453 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x5055b8 = Math['floor'](Math['log'](_0x1b7348) / Math['log'](0x400));
            _0x1220a3 = '\x20(' + (_0x1b7348 / Math['pow'](0x400, _0x5055b8))['toFixed'](0x1) + '\x20' + _0x8b5453[_0x5055b8] + ')';
        }
        const _0x58dd88 = _0x32b392['messageTimestamp'] ? new Date((_0x32b392['messageTimestamp']['low'] || _0x32b392['messageTimestamp']) * 0x3e8) : new Date();
        const _0x58d5ed = _0x58dd88['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x1cb896['timeZone'] || 'Asia/Karachi'
        });
        const _0x3be844 = _0x1baba8['startsWith']('.') || _0x1baba8['startsWith']('!') || _0x1baba8['startsWith']('#') || _0x1baba8['startsWith']('/');
        const _0x49fda5 = _0x38dcb4[_0x23da80] || _0x23da80['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x8c3664['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x8c3664['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x8c3664['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x8c3664['black'](_0x0_0x8c3664['bgCyan']['bold']('\x20' + _0x58d5ed + '\x20')) + '\x20' + _0x0_0x8c3664['magenta']['bold'](_0x49fda5) + _0x0_0x8c3664['gray']['bold'](_0x1220a3));
        const _0x19b8f9 = _0x224ca4 && _0x224ca4 !== _0x17315e ? _0x224ca4 + '\x20(' + _0x17315e + ')' : _0x17315e;
        console['log'](_0x0_0x8c3664['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x474497 ? _0x0_0x8c3664['green']['bold']('📤\x20ME') : _0x0_0x8c3664['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x8c3664['white']['bold'](_0x19b8f9));
        if (_0x3e14c3 && _0x4eb84b) {
            console['log'](_0x0_0x8c3664['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x8c3664['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x8c3664['white']['bold'](_0x4eb84b));
        } else if (!_0x3e14c3) {
            console['log'](_0x0_0x8c3664['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x8c3664['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x8c3664['white']['bold']('Private\x20Chat'));
        }
        if (_0x1baba8) {
            const _0x1c2650 = 0x64;
            const _0x1c9f74 = _0x1baba8['length'] > _0x1c2650 ? _0x1baba8['substring'](0x0, _0x1c2650) + '...' : _0x1baba8;
            const _0x4d0f3b = _0x1baba8['includes']('NOVA-MD') || _0x1baba8['includes']('Pinging...') || _0x1baba8['includes']('*🤖') || _0x474497 && _0x1baba8['includes']('*');
            console['log'](_0x0_0x8c3664['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x8c3664['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x3be844 ? _0x0_0x8c3664['greenBright']['bold'](_0x1c9f74) : _0x4d0f3b ? _0x0_0x8c3664['cyan']['bold'](_0x1c9f74) : _0x474497 ? _0x0_0x8c3664['blueBright']['bold'](_0x1c9f74) : _0x0_0x8c3664['white']['bold'](_0x1c9f74)));
        }
        console['log'](_0x0_0x8c3664['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x16ee20) {
        console['log'](_0x0_0x8c3664['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x16ee20['message']);
        console['log'](_0x0_0x8c3664['gray']['bold']('[' + (_0x4c6a2d['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x4c6a2d['key']?.['remoteJid']));
    }
}
function printLog(_0x38862e, _0x3b58b6) {
    const _0x1e8e61 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x1cb896['timeZone'] || 'Asia/Karachi'
    });
    const _0x23e13c = {
        'info': _0x0_0x8c3664['blue'],
        'success': _0x0_0x8c3664['green'],
        'warning': _0x0_0x8c3664['yellow'],
        'error': _0x0_0x8c3664['red'],
        'connection': _0x0_0x8c3664['cyan'],
        'store': _0x0_0x8c3664['magenta']
    };
    const _0x2d6dd7 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x489b8c = _0x23e13c[_0x38862e] || _0x0_0x8c3664['white'];
    const _0x58f5af = _0x2d6dd7[_0x38862e] || '•';
    console['log'](_0x0_0x8c3664['gray']['bold']('[' + _0x1e8e61 + ']') + '\x20' + _0x489b8c(_0x58f5af) + '\x20' + _0x489b8c(_0x3b58b6));
}
export {
    printMessage,
    printLog
};