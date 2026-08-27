import _0x0_0x341edd from 'chalk';
import _0x0_0x4aaf3f, { parsePhoneNumber } from 'awesome-phonenumber';
import _0x0_0x8acda6 from '../config.js';
function extractPhoneNumber(_0x3b8adf) {
    if (!_0x3b8adf)
        return null;
    const _0x242a21 = _0x3b8adf['replace']('@s.whatsapp.net', '')['replace']('@lid', '')['replace']('@g.us', '')['split'](':')[0x0];
    if (_0x242a21['length'] < 0xa && _0x3b8adf['includes']('@lid')) {
        return null;
    }
    return _0x242a21;
}
async function getNameWithFallback(_0x1726da, _0x18d5e4, _0x95c866) {
    try {
        if (_0x95c866 && _0x95c866['trim']()) {
            return _0x95c866['trim']();
        }
        if (_0x18d5e4['store']?.['contacts']?.[_0x1726da]) {
            const _0x3e7cc4 = _0x18d5e4['store']['contacts'][_0x1726da];
            if (_0x3e7cc4['name'] || _0x3e7cc4['notify']) {
                return _0x3e7cc4['name'] || _0x3e7cc4['notify'];
            }
        }
        const _0x378649 = extractPhoneNumber(_0x1726da);
        if (_0x378649 && _0x378649['length'] >= 0xa) {
            const _0x323232 = _0x0_0x4aaf3f('+' + _0x378649);
            if (_0x323232['valid']) {
                return null;
            }
        }
        return _0x1726da['split']('@')[0x0]['split'](':')[0x0];
    } catch (_0x5712ff) {
        return _0x1726da['split']('@')[0x0]['split'](':')[0x0];
    }
}
async function printMessage(_0x5d048e, _0x442df1) {
    try {
        if (!_0x5d048e?.['key'])
            return;
        const _0x15657b = _0x5d048e;
        const _0xd42d65 = _0x15657b['key']['remoteJid'];
        const _0xc77604 = _0x15657b['key']['participant'] || _0x15657b['key']['remoteJid'];
        const _0x117fbd = _0xd42d65['endsWith']('@g.us');
        const _0x57f9d9 = _0x15657b['key']['fromMe'];
        let _0x4a76c0 = '';
        let _0xe88f9a = '';
        try {
            if (_0x57f9d9) {
                _0x4a76c0 = _0x442df1['user']?.['name'] || 'Owner';
                const _0x4d61d4 = extractPhoneNumber(_0x442df1['user']?.['id'] || _0x442df1['user']?.['jid']);
                if (_0x4d61d4) {
                    const _0x4b3514 = parsePhoneNumber('+' + _0x4d61d4);
                    _0xe88f9a = _0x4b3514['valid'] ? _0x4b3514['number']?.['international'] || _0x4d61d4 : _0x4d61d4;
                }
            } else {
                _0x4a76c0 = await getNameWithFallback(_0xc77604, _0x442df1, _0x15657b['pushName']);
                const _0x21b073 = extractPhoneNumber(_0xc77604);
                if (_0x21b073 && _0x21b073['length'] >= 0xa) {
                    const _0x221371 = _0x0_0x4aaf3f('+' + _0x21b073);
                    _0xe88f9a = _0x221371['valid'] ? _0x221371['getNumber']('international') : _0x21b073;
                } else {
                    _0xe88f9a = _0xc77604['split']('@')[0x0]['split'](':')[0x0];
                }
            }
        } catch (_0x5bc8ae) {
            _0x4a76c0 = _0x15657b['pushName'] || _0xc77604['split']('@')[0x0];
            _0xe88f9a = _0xc77604['split']('@')[0x0]['split'](':')[0x0];
        }
        let _0x479b1d = null;
        try {
            if (_0x117fbd) {
                const _0x43e182 = await _0x442df1['groupMetadata'](_0xd42d65)['catch'](() => null);
                _0x479b1d = _0x43e182?.['subject'] || null;
            }
        } catch (_0x409975) {
            _0x479b1d = null;
        }
        const _0x27cfaa = Object['keys'](_0x15657b['message'] || {})[0x0];
        let _0x513166 = '';
        let _0x1046a9 = 0x0;
        let _0x3ac145 = ![];
        if (_0x27cfaa === 'senderKeyDistributionMessage' || _0x27cfaa === 'protocolMessage' || _0x27cfaa === 'reactionMessage') {
            _0x3ac145 = !![];
        }
        if (_0x3ac145)
            return;
        const _0x57bdac = {
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
        if (_0x15657b['message']) {
            if (_0x27cfaa === 'conversation') {
                _0x513166 = _0x15657b['message']['conversation'];
            } else if (_0x27cfaa === 'extendedTextMessage') {
                _0x513166 = _0x15657b['message']['extendedTextMessage']?.['text'] || '';
            } else if (_0x27cfaa === 'imageMessage') {
                _0x513166 = _0x15657b['message']['imageMessage']?.['caption'] || '[Image]';
                _0x1046a9 = _0x15657b['message']['imageMessage']?.['fileLength'] || 0x0;
            } else if (_0x27cfaa === 'videoMessage') {
                _0x513166 = _0x15657b['message']['videoMessage']?.['caption'] || '[Video]';
                _0x1046a9 = _0x15657b['message']['videoMessage']?.['fileLength'] || 0x0;
            } else if (_0x27cfaa === 'audioMessage') {
                const _0x4ba11b = _0x15657b['message']['audioMessage']?.['seconds'] || 0x0;
                _0x513166 = '[Audio\x20' + Math['floor'](_0x4ba11b / 0x3c) + ':' + (_0x4ba11b % 0x3c)['toString']()['padStart'](0x2, '0') + ']';
                _0x1046a9 = _0x15657b['message']['audioMessage']?.['fileLength'] || 0x0;
            } else if (_0x27cfaa === 'documentMessage') {
                const _0x6e3396 = _0x15657b['message']['documentMessage']?.['fileName'] || 'Document';
                _0x513166 = '[📄\x20' + _0x6e3396 + ']';
                _0x1046a9 = _0x15657b['message']['documentMessage']?.['fileLength'] || 0x0;
            } else if (_0x27cfaa === 'stickerMessage') {
                _0x513166 = '[Sticker]';
                _0x1046a9 = _0x15657b['message']['stickerMessage']?.['fileLength'] || 0x0;
            } else if (_0x27cfaa === 'contactMessage') {
                _0x513166 = '[👤\x20' + (_0x15657b['message']['contactMessage']?.['displayName'] || 'Contact') + ']';
            } else if (_0x27cfaa === 'locationMessage') {
                _0x513166 = '[📍\x20Location]';
            } else {
                _0x513166 = '[' + _0x27cfaa['replace']('Message', '') + ']';
            }
        }
        let _0x8abe8c = '';
        if (_0x1046a9 > 0x0) {
            const _0x488123 = [
                'B',
                'KB',
                'MB',
                'GB'
            ];
            const _0x17823e = Math['floor'](Math['log'](_0x1046a9) / Math['log'](0x400));
            _0x8abe8c = '\x20(' + (_0x1046a9 / Math['pow'](0x400, _0x17823e))['toFixed'](0x1) + '\x20' + _0x488123[_0x17823e] + ')';
        }
        const _0x2cc1b4 = _0x15657b['messageTimestamp'] ? new Date((_0x15657b['messageTimestamp']['low'] || _0x15657b['messageTimestamp']) * 0x3e8) : new Date();
        const _0x347cc2 = _0x2cc1b4['toLocaleTimeString']('en-US', {
            'hour': '2-digit',
            'minute': '2-digit',
            'second': '2-digit',
            'hour12': ![],
            'timeZone': _0x0_0x8acda6['timeZone'] || 'Asia/Karachi'
        });
        const _0x21d2b1 = _0x513166['startsWith']('.') || _0x513166['startsWith']('!') || _0x513166['startsWith']('#') || _0x513166['startsWith']('/');
        const _0x353080 = _0x57bdac[_0x27cfaa] || _0x27cfaa['replace']('Message', '')['toUpperCase']();
        console['log'](_0x0_0x341edd['hex']('#00D9FF')['bold']('╭─────────────────────────────────'));
        console['log'](_0x0_0x341edd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x341edd['cyan']['bold']('🤖\x20Bot') + '\x20' + _0x0_0x341edd['black'](_0x0_0x341edd['bgCyan']['bold']('\x20' + _0x347cc2 + '\x20')) + '\x20' + _0x0_0x341edd['magenta']['bold'](_0x353080) + _0x0_0x341edd['gray']['bold'](_0x8abe8c));
        const _0x3b6cae = _0x4a76c0 && _0x4a76c0 !== _0xe88f9a ? _0x4a76c0 + '\x20(' + _0xe88f9a + ')' : _0xe88f9a;
        console['log'](_0x0_0x341edd['hex']('#00D9FF')['bold']('│') + '\x20' + (_0x57f9d9 ? _0x0_0x341edd['green']['bold']('📤\x20ME') : _0x0_0x341edd['yellow']['bold']('📨\x20FROM')) + '\x20' + _0x0_0x341edd['white']['bold'](_0x3b6cae));
        if (_0x117fbd && _0x479b1d) {
            console['log'](_0x0_0x341edd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x341edd['blue']['bold']('👥\x20GROUP') + '\x20' + _0x0_0x341edd['white']['bold'](_0x479b1d));
        } else if (!_0x117fbd) {
            console['log'](_0x0_0x341edd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x341edd['magenta']['bold']('💬\x20PRIVATE') + '\x20' + _0x0_0x341edd['white']['bold']('Private\x20Chat'));
        }
        if (_0x513166) {
            const _0x575b21 = 0x64;
            const _0x2f2387 = _0x513166['length'] > _0x575b21 ? _0x513166['substring'](0x0, _0x575b21) + '...' : _0x513166;
            const _0x55e636 = _0x513166['includes']('NOVA-MD') || _0x513166['includes']('Pinging...') || _0x513166['includes']('*🤖') || _0x57f9d9 && _0x513166['includes']('*');
            console['log'](_0x0_0x341edd['hex']('#00D9FF')['bold']('│') + '\x20' + _0x0_0x341edd['hex']('#FFD700')['bold']('💭\x20MSG') + '\x20' + (_0x21d2b1 ? _0x0_0x341edd['greenBright']['bold'](_0x2f2387) : _0x55e636 ? _0x0_0x341edd['cyan']['bold'](_0x2f2387) : _0x57f9d9 ? _0x0_0x341edd['blueBright']['bold'](_0x2f2387) : _0x0_0x341edd['white']['bold'](_0x2f2387)));
        }
        console['log'](_0x0_0x341edd['hex']('#00D9FF')['bold']('╰─────────────────────────────────'));
        console['log']();
    } catch (_0x5ebe54) {
        console['log'](_0x0_0x341edd['red']['bold']('❌\x20Error\x20logging\x20message:'), _0x5ebe54['message']);
        console['log'](_0x0_0x341edd['gray']['bold']('[' + (_0x5d048e['key']?.['fromMe'] ? 'ME' : 'MSG') + ']\x20' + _0x5d048e['key']?.['remoteJid']));
    }
}
function printLog(_0x45d285, _0x572033) {
    const _0x38e186 = new Date()['toLocaleTimeString']('en-US', {
        'hour': '2-digit',
        'minute': '2-digit',
        'second': '2-digit',
        'hour12': ![],
        'timeZone': _0x0_0x8acda6['timeZone'] || 'Asia/Karachi'
    });
    const _0x5e5489 = {
        'info': _0x0_0x341edd['blue'],
        'success': _0x0_0x341edd['green'],
        'warning': _0x0_0x341edd['yellow'],
        'error': _0x0_0x341edd['red'],
        'connection': _0x0_0x341edd['cyan'],
        'store': _0x0_0x341edd['magenta']
    };
    const _0x25e162 = {
        'info': '💡',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌',
        'connection': '🔌',
        'store': '🗄️'
    };
    const _0x1d8528 = _0x5e5489[_0x45d285] || _0x0_0x341edd['white'];
    const _0xbcc55e = _0x25e162[_0x45d285] || '•';
    console['log'](_0x0_0x341edd['gray']['bold']('[' + _0x38e186 + ']') + '\x20' + _0x1d8528(_0xbcc55e) + '\x20' + _0x1d8528(_0x572033));
}
export {
    printMessage,
    printLog
};