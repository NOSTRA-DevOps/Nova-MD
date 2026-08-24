import _0x0_0x1e5eec from 'chalk';
import _0x0_0xf98014, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x3407d2 from '../config.js';
function extractPhoneNumber(_0x21bf56) {
    if (!_0x21bf56)
        return null;
    const _0x5d4f45 = _0x21bf56['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x5d4f45['length'] < 0xa && _0x21bf56['includes']('@lid')) {
        return null;
    }
    return _0x5d4f45;
}
async function getNameWithFallback(_0x3f15c6, _0x24aaf3, _0x2d4ad8) {
    try {
        if (_0x2d4ad8 && _0x2d4ad8['trim']()) {
            return _0x2d4ad8['trim']();
        }
        if (_0x24aaf3['store']?.['contacts']?.[_0x3f15c6]) {
            const _0x47c646 = _0x24aaf3['store']['contacts'][_0x3f15c6];
            if (_0x47c646['name'] || _0x47c646['notify']) {
                return _0x47c646['name'] || _0x47c646['notify'];
            }
        }
        const _0x4613cf = extractPhoneNumber(_0x3f15c6);
        if (_0x4613cf && _0x4613cf['length'] >= 0xa) {
            const _0x2d8f0d = _0x0_0xf98014('+' + _0x4613cf);
            if (_0x2d8f0d['valid']) {
                return null;
            }
        }
        return _0x3f15c6['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x41647c) {
        return _0x3f15c6['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x58ffa0, _0x22b289) {
    try {
        if (!_0x58ffa0?.['key'])
            return;
        const _0x49e9a4 = _0x58ffa0;
        const _0x2f3a89 = _0x49e9a4['key']['remoteJid'];
        const _0x386123 = _0x49e9a4['key']['participant'] || _0x49e9a4['key']['remoteJid'];
        const _0x419657 = _0x2f3a89['endsWith']('@g.us');
        const _0x4f2009 = _0x49e9a4['key']['fromMe'];
        let _0x25f305 = '';
        let _0x1440fe = '';
        try {
            if (_0x4f2009) {
                _0x25f305 = _0x22b289['user']?.['name'] || 'Owner';
                const _0x4109ff = extractPhoneNumber(_0x22b289['user']?.['id'] || _0x22b289['user']?.['jid']);
                if (_0x4109ff) {
                    const _0x2957c4 = parsePhoneNumber('+' + _0x4109ff);
                    _0x1440fe = _0x2957c4['valid'] ? _0x2957c4['number']?.['international'] || _0x4109ff : _0x4109ff;
                }
            } else {
                _0x25f305 = await getNameWithFallback(_0x386123, _0x22b289, _0x49e9a4['pushName']);
                const _0x37db70 = extractPhoneNumber(_0x386123);
                if (_0x37db70 && _0x37db70['length'] >= 0xa) {
                    const _0x3ede8f = _0x0_0xf98014('+' + _0x37db70);
                    _0x1440fe = _0x3ede8f['valid'] ? _0x3ede8f['getNumber']('international') : _0x37db70;
                } else {
                    _0x1440fe = _0x386123['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x310ce4) {
            _0x25f305 = _0x49e9a4['pushName'] || _0x386123['split']('@')[0x0];
            _0x1440fe = _0x386123['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0xb00e56 = null;
        try {
            if (_0x419657) {
                const _0x138428 = await _0x22b289['groupMetadata'](_0x2f3a89)['catch'](() => null);
                _0xb00e56 = _0x138428?.['subject'] || null;
            }
        } catch (_0x204065) {
            _0xb00e56 = null;
        }
        const _0x86d782 = Object['keys'](_0x49e9a4['message'] || {})[0x0];
        let _0x3b41a2 = '';
        let _0x9f5878 = 0x0;
        let _0x3fa693 = ![];
        if (_0x86d782 === 'senderKeyDistributionMessage' || _0x86d782 === 'protocolMessage' || _0x86d782 === 'reactionMessage') {
            _0x3fa693 = !![];
        }
        if (_0x3fa693)
            return;
        const _0x1bcf49 = {
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
        if (_0x49e9a4['message']) {
            if (_0x86d782 === 'conversation') {
                _0x3b41a2 = _0x49e9a4['message']['conversation'];
            } else if (_0x86d782 === 'extendedTextMessage') {
                _0x3b41a2 = _0x49e9a4['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x86d782 === 'imageMessage') {
                _0x3b41a2 = _0x49e9a4['message']['imageMessage']?.['caption'] || '[Image]';
                _0x9f5878 = _0x49e9a4['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x86d782 === 'videoMessage') {
                _0x3b41a2 = _0x49e9a4['message']['videoMessage']?.['caption'] || '[Video]';
                _0x9f5878 = _0x49e9a4['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x86d782 === 'audioMessage') {
                const _0x5056bf = _0x49e9a4['message']['audioMessage']?.['seconds'] || 0x0;
                _0x3b41a2 = '[Audio\x20' + Math['floor'](_0x5056bf / 0x3c) + ':' + (_0x5056bf % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x9f5878 = _0x49e9a4['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x86d782 === 'documentMessage') {
                const _0x4da411 = _0x49e9a4['message']['documentMessage']?.['fileName'] || 'Document';
                _0x3b41a2 = '[📄\x20' + _0x4da411 + ']';
                _0x9f5878 = _0x49e9a4['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x86d782 === 'stickerMessage') {
                _0x3b41a2 = '[Sticker]';
                _0x9f5878 = _0x49e9a4['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x86d782 === 'contactMessage') {
                _0x3b41a2 = '[👤\x20' + (_0x49e9a4['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x86d782 === 'locationMessage') {
                _0x3b41a2 = '[📍\x20Location]';
            } else {
                _0x3b41a2 = '[' + _0x86d782['replace']('Message', '') + ']';
            }
        }
        let _0x54db79 = '';
        if (_0x9f5878 > 0x0) {
            const _0x317029 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x44b972 = Math['floor'](Math['log'](_0x9f5878) / Math['log'](0x400));
            _0x54db79 = '\x20(' + (_0x9f5878 / Math['pow'](0x400, _0x44b972))['toFixed'](0x1) + '\x20' + _0x317029[_0x44b972] + ')';
        }
        const _0x3b3d0f = _0x49e9a4['messageTimestamp'] ? new Date((_0x49e9a4['messageTimestamp']['low'] || _0x49e9a4['messageTimestamp']) * 0x3e8) : new Date();
        const _0xf16e65 = _0x3b3d0f['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x3407d2['timeZone'] || 'Asia/Karachi'
        });
        const _0x32f18d = _0x3b41a2['startsWith']('.') || _0x3b41a2['startsWith']('!') || _0x3b41a2['startsWith']('#') || _0x3b41a2['startsWith']('/');
        const _0xd7da51 = _0x1bcf49[_0x86d782] || _0x86d782['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x1e5eec['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x1e5eec['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x1e5eec['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x1e5eec['black'](_0x0_0x1e5eec['bgCyan']['bold']('\x20' + _0xf16e65 + '\x20')) + '\x20' + _0x0_0x1e5eec['magenta']['bold'](_0xd7da51) + _0x0_0x1e5eec['gray']['bold'](_0x54db79));
        const _0x204092 = _0x25f305 && _0x25f305 !== _0x1440fe ? _0x25f305 + '\x20(' + _0x1440fe + ')' : _0x1440fe;
        console['log'](_0x0_0x1e5eec['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x4f2009 ? _0x0_0x1e5eec['green']['bold']('📤\x20ME') : _0x0_0x1e5eec['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x1e5eec['white']['bold'](_0x204092));
        if (_0x419657 && _0xb00e56) {
            console['log'](_0x0_0x1e5eec['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x1e5eec['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x1e5eec['white']['bold'](_0xb00e56));
        } else if (!_0x419657) {
            console['log'](_0x0_0x1e5eec['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x1e5eec['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x1e5eec['white']['bold']('Private\x20Chat'));
        }
        if (_0x3b41a2) {
            const _0x1798d1 = 0x64;
            const _0x47df12 = _0x3b41a2['length'] > _0x1798d1 ? _0x3b41a2['substring'](0x0, _0x1798d1) + '...' : _0x3b41a2;
            const _0xf93223 = _0x3b41a2['includes']('NOVA-MD') || _0x3b41a2['includes']('Pinging...') || _0x3b41a2['includes']('*🤖') || _0x4f2009 && _0x3b41a2['includes']('*');
            console['log'](_0x0_0x1e5eec['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x1e5eec['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x32f18d ? _0x0_0x1e5eec['greenBright']['bold'](_0x47df12) : _0xf93223 ? _0x0_0x1e5eec['cyan']['bold'](_0x47df12) : _0x4f2009 ? _0x0_0x1e5eec['blueBright']['bold'](_0x47df12) : _0x0_0x1e5eec['white']['bold'](_0x47df12)));
        }
        console['log'](_0x0_0x1e5eec['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x160407) {
        console['log'](_0x0_0x1e5eec['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x160407['message']);
        console['log'](_0x0_0x1e5eec['gray']['bold']('[' + (_0x58ffa0['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x58ffa0['key']?.['remoteJid']));
    }
}
function printLog(_0x5a8237, _0x5b6708) {
    const _0x355041 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x3407d2['timeZone'] || 'Asia/Karachi'
    });
    const _0x29125d = {
        'info': _0x0_0x1e5eec['blue'],
        'success': _0x0_0x1e5eec['green'],
        'warning': _0x0_0x1e5eec['yellow'],
        'error': _0x0_0x1e5eec['red'],
        'connection': _0x0_0x1e5eec['cyan'],
        'store': _0x0_0x1e5eec['magenta']
    };
    const _0x8e9a11 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x1033c1 = _0x29125d[_0x5a8237] || _0x0_0x1e5eec['white'];
    const _0x63cd6e = _0x8e9a11[_0x5a8237] || '•';
    console['log'](_0x0_0x1e5eec['gray']['bold']('[' + _0x355041 + ']') + '\x20' + _0x1033c1(_0x63cd6e) + '\x20' + _0x1033c1(_0x5b6708));
}
export {
    printMessage,
    printLog
};