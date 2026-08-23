import _0x0_0x4dcd68 from 'chalk';
import _0x0_0x241dfd, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x13d01a from '../config.js';
function extractPhoneNumber(_0x5d7fdd) {
    if (!_0x5d7fdd)
        return null;
    const _0x4e2103 = _0x5d7fdd['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x4e2103['length'] < 0xa && _0x5d7fdd['includes']('@lid')) {
        return null;
    }
    return _0x4e2103;
}
async function getNameWithFallback(_0x346a52, _0xc29fe5, _0xa8815d) {
    try {
        if (_0xa8815d && _0xa8815d['trim']()) {
            return _0xa8815d['trim']();
        }
        if (_0xc29fe5['store']?.['contacts']?.[_0x346a52]) {
            const _0x4bb753 = _0xc29fe5['store']['contacts'][_0x346a52];
            if (_0x4bb753['name'] || _0x4bb753['notify']) {
                return _0x4bb753['name'] || _0x4bb753['notify'];
            }
        }
        const _0xdfbce = extractPhoneNumber(_0x346a52);
        if (_0xdfbce && _0xdfbce['length'] >= 0xa) {
            const _0x1bcd9a = _0x0_0x241dfd('+' + _0xdfbce);
            if (_0x1bcd9a['valid']) {
                return null;
            }
        }
        return _0x346a52['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x517476) {
        return _0x346a52['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x1c0c08, _0x2db3ba) {
    try {
        if (!_0x1c0c08?.['key'])
            return;
        const _0x4e636c = _0x1c0c08;
        const _0x368db9 = _0x4e636c['key']['remoteJid'];
        const _0x325a52 = _0x4e636c['key']['participant'] || _0x4e636c['key']['remoteJid'];
        const _0x4c99ca = _0x368db9['endsWith']('@g.us');
        const _0x5e0d88 = _0x4e636c['key']['fromMe'];
        let _0x2c600a = '';
        let _0x429def = '';
        try {
            if (_0x5e0d88) {
                _0x2c600a = _0x2db3ba['user']?.['name'] || 'Owner';
                const _0xcc3f56 = extractPhoneNumber(_0x2db3ba['user']?.['id'] || _0x2db3ba['user']?.['jid']);
                if (_0xcc3f56) {
                    const _0x498388 = parsePhoneNumber('+' + _0xcc3f56);
                    _0x429def = _0x498388['valid'] ? _0x498388['number']?.['international'] || _0xcc3f56 : _0xcc3f56;
                }
            } else {
                _0x2c600a = await getNameWithFallback(_0x325a52, _0x2db3ba, _0x4e636c['pushName']);
                const _0x6333d = extractPhoneNumber(_0x325a52);
                if (_0x6333d && _0x6333d['length'] >= 0xa) {
                    const _0x2d95a4 = _0x0_0x241dfd('+' + _0x6333d);
                    _0x429def = _0x2d95a4['valid'] ? _0x2d95a4['getNumber']('international') : _0x6333d;
                } else {
                    _0x429def = _0x325a52['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x11f342) {
            _0x2c600a = _0x4e636c['pushName'] || _0x325a52['split']('@')[0x0];
            _0x429def = _0x325a52['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x3d91db = null;
        try {
            if (_0x4c99ca) {
                const _0xc74c3d = await _0x2db3ba['groupMetadata'](_0x368db9)['catch'](() => null);
                _0x3d91db = _0xc74c3d?.['subject'] || null;
            }
        } catch (_0x4c9374) {
            _0x3d91db = null;
        }
        const _0x3dd163 = Object['keys'](_0x4e636c['message'] || {})[0x0];
        let _0x45f0d6 = '';
        let _0x5c8ec2 = 0x0;
        let _0x243103 = ![];
        if (_0x3dd163 === 'senderKeyDistributionMessage' || _0x3dd163 === 'protocolMessage' || _0x3dd163 === 'reactionMessage') {
            _0x243103 = !![];
        }
        if (_0x243103)
            return;
        const _0x261763 = {
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
        if (_0x4e636c['message']) {
            if (_0x3dd163 === 'conversation') {
                _0x45f0d6 = _0x4e636c['message']['conversation'];
            } else if (_0x3dd163 === 'extendedTextMessage') {
                _0x45f0d6 = _0x4e636c['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x3dd163 === 'imageMessage') {
                _0x45f0d6 = _0x4e636c['message']['imageMessage']?.['caption'] || '[Image]';
                _0x5c8ec2 = _0x4e636c['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x3dd163 === 'videoMessage') {
                _0x45f0d6 = _0x4e636c['message']['videoMessage']?.['caption'] || '[Video]';
                _0x5c8ec2 = _0x4e636c['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x3dd163 === 'audioMessage') {
                const _0x3fbe04 = _0x4e636c['message']['audioMessage']?.['seconds'] || 0x0;
                _0x45f0d6 = '[Audio\x20' + Math['floor'](_0x3fbe04 / 0x3c) + ':' + (_0x3fbe04 % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x5c8ec2 = _0x4e636c['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x3dd163 === 'documentMessage') {
                const _0x4a6973 = _0x4e636c['message']['documentMessage']?.['fileName'] || 'Document';
                _0x45f0d6 = '[📄\x20' + _0x4a6973 + ']';
                _0x5c8ec2 = _0x4e636c['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x3dd163 === 'stickerMessage') {
                _0x45f0d6 = '[Sticker]';
                _0x5c8ec2 = _0x4e636c['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x3dd163 === 'contactMessage') {
                _0x45f0d6 = '[👤\x20' + (_0x4e636c['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x3dd163 === 'locationMessage') {
                _0x45f0d6 = '[📍\x20Location]';
            } else {
                _0x45f0d6 = '[' + _0x3dd163['replace']('Message', '') + ']';
            }
        }
        let _0x48395e = '';
        if (_0x5c8ec2 > 0x0) {
            const _0x2c955c = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x4aad9c = Math['floor'](Math['log'](_0x5c8ec2) / Math['log'](0x400));
            _0x48395e = '\x20(' + (_0x5c8ec2 / Math['pow'](0x400, _0x4aad9c))['toFixed'](0x1) + '\x20' + _0x2c955c[_0x4aad9c] + ')';
        }
        const _0x21f368 = _0x4e636c['messageTimestamp'] ? new Date((_0x4e636c['messageTimestamp']['low'] || _0x4e636c['messageTimestamp']) * 0x3e8) : new Date();
        const _0x4e7d7a = _0x21f368['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x13d01a['timeZone'] || 'Asia/Karachi'
        });
        const _0x45d46b = _0x45f0d6['startsWith']('.') || _0x45f0d6['startsWith']('!') || _0x45f0d6['startsWith']('#') || _0x45f0d6['startsWith']('/');
        const _0x3116ba = _0x261763[_0x3dd163] || _0x3dd163['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x4dcd68['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x4dcd68['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4dcd68['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x4dcd68['black'](_0x0_0x4dcd68['bgCyan']['bold']('\x20' + _0x4e7d7a + '\x20')) + '\x20' + _0x0_0x4dcd68['magenta']['bold'](_0x3116ba) + _0x0_0x4dcd68['gray']['bold'](_0x48395e));
        const _0x44130d = _0x2c600a && _0x2c600a !== _0x429def ? _0x2c600a + '\x20(' + _0x429def + ')' : _0x429def;
        console['log'](_0x0_0x4dcd68['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x5e0d88 ? _0x0_0x4dcd68['green']['bold']('📤\x20ME') : _0x0_0x4dcd68['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x4dcd68['white']['bold'](_0x44130d));
        if (_0x4c99ca && _0x3d91db) {
            console['log'](_0x0_0x4dcd68['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4dcd68['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x4dcd68['white']['bold'](_0x3d91db));
        } else if (!_0x4c99ca) {
            console['log'](_0x0_0x4dcd68['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4dcd68['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x4dcd68['white']['bold']('Private\x20Chat'));
        }
        if (_0x45f0d6) {
            const _0x4319d9 = 0x64;
            const _0x30cc6c = _0x45f0d6['length'] > _0x4319d9 ? _0x45f0d6['substring'](0x0, _0x4319d9) + '...' : _0x45f0d6;
            const _0x5dcca4 = _0x45f0d6['includes']('NOVA-MD') || _0x45f0d6['includes']('Pinging...') || _0x45f0d6['includes']('*🤖') || _0x5e0d88 && _0x45f0d6['includes']('*');
            console['log'](_0x0_0x4dcd68['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x4dcd68['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x45d46b ? _0x0_0x4dcd68['greenBright']['bold'](_0x30cc6c) : _0x5dcca4 ? _0x0_0x4dcd68['cyan']['bold'](_0x30cc6c) : _0x5e0d88 ? _0x0_0x4dcd68['blueBright']['bold'](_0x30cc6c) : _0x0_0x4dcd68['white']['bold'](_0x30cc6c)));
        }
        console['log'](_0x0_0x4dcd68['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x37bce5) {
        console['log'](_0x0_0x4dcd68['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x37bce5['message']);
        console['log'](_0x0_0x4dcd68['gray']['bold']('[' + (_0x1c0c08['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x1c0c08['key']?.['remoteJid']));
    }
}
function printLog(_0x1bd243, _0x1de962) {
    const _0x294bb7 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x13d01a['timeZone'] || 'Asia/Karachi'
    });
    const _0x53b36a = {
        'info': _0x0_0x4dcd68['blue'],
        'success': _0x0_0x4dcd68['green'],
        'warning': _0x0_0x4dcd68['yellow'],
        'error': _0x0_0x4dcd68['red'],
        'connection': _0x0_0x4dcd68['cyan'],
        'store': _0x0_0x4dcd68['magenta']
    };
    const _0x325e30 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x5ceb2b = _0x53b36a[_0x1bd243] || _0x0_0x4dcd68['white'];
    const _0x2d4c2e = _0x325e30[_0x1bd243] || '•';
    console['log'](_0x0_0x4dcd68['gray']['bold']('[' + _0x294bb7 + ']') + '\x20' + _0x5ceb2b(_0x2d4c2e) + '\x20' + _0x5ceb2b(_0x1de962));
}
export {
    printMessage,
    printLog
};