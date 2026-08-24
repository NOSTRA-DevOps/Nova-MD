import _0x0_0x9d115e from 'chalk';
import _0x0_0x3a3796, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x34f85a from '../config.js';
function extractPhoneNumber(_0x5ae71a) {
    if (!_0x5ae71a)
        return null;
    const _0x737d43 = _0x5ae71a['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x737d43['length'] < 0xa && _0x5ae71a['includes']('@lid')) {
        return null;
    }
    return _0x737d43;
}
async function getNameWithFallback(_0x5dd847, _0x6381ef, _0x4d3d56) {
    try {
        if (_0x4d3d56 && _0x4d3d56['trim']()) {
            return _0x4d3d56['trim']();
        }
        if (_0x6381ef['store']?.['contacts']?.[_0x5dd847]) {
            const _0x5bba86 = _0x6381ef['store']['contacts'][_0x5dd847];
            if (_0x5bba86['name'] || _0x5bba86['notify']) {
                return _0x5bba86['name'] || _0x5bba86['notify'];
            }
        }
        const _0x338dc9 = extractPhoneNumber(_0x5dd847);
        if (_0x338dc9 && _0x338dc9['length'] >= 0xa) {
            const _0x29a384 = _0x0_0x3a3796('+' + _0x338dc9);
            if (_0x29a384['valid']) {
                return null;
            }
        }
        return _0x5dd847['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x169cf6) {
        return _0x5dd847['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x29c288, _0x18f151) {
    try {
        if (!_0x29c288?.['key'])
            return;
        const _0x3d075d = _0x29c288;
        const _0x2a428d = _0x3d075d['key']['remoteJid'];
        const _0x33c2ed = _0x3d075d['key']['participant'] || _0x3d075d['key']['remoteJid'];
        const _0x2c4fe8 = _0x2a428d['endsWith']('@g.us');
        const _0x227e39 = _0x3d075d['key']['fromMe'];
        let _0x432efc = '';
        let _0x2700db = '';
        try {
            if (_0x227e39) {
                _0x432efc = _0x18f151['user']?.['name'] || 'Owner';
                const _0x53bdc0 = extractPhoneNumber(_0x18f151['user']?.['id'] || _0x18f151['user']?.['jid']);
                if (_0x53bdc0) {
                    const _0x431d8e = parsePhoneNumber('+' + _0x53bdc0);
                    _0x2700db = _0x431d8e['valid'] ? _0x431d8e['number']?.['international'] || _0x53bdc0 : _0x53bdc0;
                }
            } else {
                _0x432efc = await getNameWithFallback(_0x33c2ed, _0x18f151, _0x3d075d['pushName']);
                const _0x320459 = extractPhoneNumber(_0x33c2ed);
                if (_0x320459 && _0x320459['length'] >= 0xa) {
                    const _0x2a283a = _0x0_0x3a3796('+' + _0x320459);
                    _0x2700db = _0x2a283a['valid'] ? _0x2a283a['getNumber']('international') : _0x320459;
                } else {
                    _0x2700db = _0x33c2ed['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x33dd42) {
            _0x432efc = _0x3d075d['pushName'] || _0x33c2ed['split']('@')[0x0];
            _0x2700db = _0x33c2ed['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x605dd0 = null;
        try {
            if (_0x2c4fe8) {
                const _0x576595 = await _0x18f151['groupMetadata'](_0x2a428d)['catch'](() => null);
                _0x605dd0 = _0x576595?.['subject'] || null;
            }
        } catch (_0x153401) {
            _0x605dd0 = null;
        }
        const _0x4699ca = Object['keys'](_0x3d075d['message'] || {})[0x0];
        let _0xaf5632 = '';
        let _0x281f10 = 0x0;
        let _0xc6af99 = ![];
        if (_0x4699ca === 'senderKeyDistributionMessage' || _0x4699ca === 'protocolMessage' || _0x4699ca === 'reactionMessage') {
            _0xc6af99 = !![];
        }
        if (_0xc6af99)
            return;
        const _0x16b8ed = {
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
        if (_0x3d075d['message']) {
            if (_0x4699ca === 'conversation') {
                _0xaf5632 = _0x3d075d['message']['conversation'];
            } else if (_0x4699ca === 'extendedTextMessage') {
                _0xaf5632 = _0x3d075d['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x4699ca === 'imageMessage') {
                _0xaf5632 = _0x3d075d['message']['imageMessage']?.['caption'] || '[Image]';
                _0x281f10 = _0x3d075d['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x4699ca === 'videoMessage') {
                _0xaf5632 = _0x3d075d['message']['videoMessage']?.['caption'] || '[Video]';
                _0x281f10 = _0x3d075d['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x4699ca === 'audioMessage') {
                const _0x26fe99 = _0x3d075d['message']['audioMessage']?.['seconds'] || 0x0;
                _0xaf5632 = '[Audio\x20' + Math['floor'](_0x26fe99 / 0x3c) + ':' + (_0x26fe99 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x281f10 = _0x3d075d['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x4699ca === 'documentMessage') {
                const _0x4fc63e = _0x3d075d['message']['documentMessage']?.['fileName'] || 'Document';
                _0xaf5632 = '[📄\x20' + _0x4fc63e + ']';
                _0x281f10 = _0x3d075d['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x4699ca === 'stickerMessage') {
                _0xaf5632 = '[Sticker]';
                _0x281f10 = _0x3d075d['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x4699ca === 'contactMessage') {
                _0xaf5632 = '[👤\x20' + (_0x3d075d['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x4699ca === 'locationMessage') {
                _0xaf5632 = '[📍\x20Location]';
            } else {
                _0xaf5632 = '[' + _0x4699ca['replace']('Message', '') + ']';
            }
        }
        let _0x2892a4 = '';
        if (_0x281f10 > 0x0) {
            const _0x3ef566 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x168fae = Math['floor'](Math['log'](_0x281f10) / Math['log'](0x400));
            _0x2892a4 = '\x20(' + (_0x281f10 / Math['pow'](0x400, _0x168fae))['toFixed'](0x1) + '\x20' + _0x3ef566[_0x168fae] + ')';
        }
        const _0xfaeae5 = _0x3d075d['messageTimestamp'] ? new Date((_0x3d075d['messageTimestamp']['low'] || _0x3d075d['messageTimestamp']) * 0x3e8) : new Date();
        const _0x109a18 = _0xfaeae5['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x34f85a['timeZone'] || 'Asia/Karachi'
        });
        const _0x4d1ff7 = _0xaf5632['startsWith']('.') || _0xaf5632['startsWith']('!') || _0xaf5632['startsWith']('#') || _0xaf5632['startsWith']('/');
        const _0x3eefdc = _0x16b8ed[_0x4699ca] || _0x4699ca['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x9d115e['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x9d115e['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x9d115e['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x9d115e['black'](_0x0_0x9d115e['bgCyan']['bold']('\x20' + _0x109a18 + '\x20')) + '\x20' + _0x0_0x9d115e['magenta']['bold'](_0x3eefdc) + _0x0_0x9d115e['gray']['bold'](_0x2892a4));
        const _0x4916b0 = _0x432efc && _0x432efc !== _0x2700db ? _0x432efc + '\x20(' + _0x2700db + ')' : _0x2700db;
        console['log'](_0x0_0x9d115e['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x227e39 ? _0x0_0x9d115e['green']['bold']('📤\x20ME') : _0x0_0x9d115e['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x9d115e['white']['bold'](_0x4916b0));
        if (_0x2c4fe8 && _0x605dd0) {
            console['log'](_0x0_0x9d115e['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x9d115e['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x9d115e['white']['bold'](_0x605dd0));
        } else if (!_0x2c4fe8) {
            console['log'](_0x0_0x9d115e['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x9d115e['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x9d115e['white']['bold']('Private\x20Chat'));
        }
        if (_0xaf5632) {
            const _0x425f90 = 0x64;
            const _0x460667 = _0xaf5632['length'] > _0x425f90 ? _0xaf5632['substring'](0x0, _0x425f90) + '...' : _0xaf5632;
            const _0x2edac6 = _0xaf5632['includes']('NOVA-MD') || _0xaf5632['includes']('Pinging...') || _0xaf5632['includes']('*🤖') || _0x227e39 && _0xaf5632['includes']('*');
            console['log'](_0x0_0x9d115e['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x9d115e['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x4d1ff7 ? _0x0_0x9d115e['greenBright']['bold'](_0x460667) : _0x2edac6 ? _0x0_0x9d115e['cyan']['bold'](_0x460667) : _0x227e39 ? _0x0_0x9d115e['blueBright']['bold'](_0x460667) : _0x0_0x9d115e['white']['bold'](_0x460667)));
        }
        console['log'](_0x0_0x9d115e['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x5f1625) {
        console['log'](_0x0_0x9d115e['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x5f1625['message']);
        console['log'](_0x0_0x9d115e['gray']['bold']('[' + (_0x29c288['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x29c288['key']?.['remoteJid']));
    }
}
function printLog(_0x4b345d, _0x32d240) {
    const _0x47bc1a = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x34f85a['timeZone'] || 'Asia/Karachi'
    });
    const _0x4f5898 = {
        'info': _0x0_0x9d115e['blue'],
        'success': _0x0_0x9d115e['green'],
        'warning': _0x0_0x9d115e['yellow'],
        'error': _0x0_0x9d115e['red'],
        'connection': _0x0_0x9d115e['cyan'],
        'store': _0x0_0x9d115e['magenta']
    };
    const _0x52df18 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x16ac3f = _0x4f5898[_0x4b345d] || _0x0_0x9d115e['white'];
    const _0x12228d = _0x52df18[_0x4b345d] || '•';
    console['log'](_0x0_0x9d115e['gray']['bold']('[' + _0x47bc1a + ']') + '\x20' + _0x16ac3f(_0x12228d) + '\x20' + _0x16ac3f(_0x32d240));
}
export {
    printMessage,
    printLog
};