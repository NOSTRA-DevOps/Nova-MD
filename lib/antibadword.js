import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xd18315 from './lightweight_store.js';
import _0x0_0x377703 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x40e3de) {
    try {
        if (HAS_DB) {
            const _0x49fa9f = await _0x0_0xd18315['getSetting'](_0x40e3de, 'antibadword');
            return _0x49fa9f || {};
        } else {
            const _0x363fc7 = dataFile('userGroupData.json');
            if (!_0x0_0x377703['existsSync'](_0x363fc7)) {
                return {};
            }
            const _0x2661a7 = JSON['parse'](_0x0_0x377703['readFileSync'](_0x363fc7, 'utf-8')['toString']());
            return _0x2661a7['antibadword']?.[_0x40e3de] || {};
        }
    } catch (_0x54a0a6) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x54a0a6['message']);
        return {};
    }
}
async function setAntiBadword(_0x242af9, _0x1260e2, _0x60e460) {
    try {
        await _0x0_0xd18315['saveSetting'](_0x242af9, 'antibadword', {
            'enabled': !![],
            'action': _0x60e460,
            'type': _0x1260e2
        });
        return !![];
    } catch (_0x5ec681) {
        console['error']('Error\x20setting\x20antibadword:', _0x5ec681);
        return ![];
    }
}
async function getAntiBadword(_0x21670e, _0x3f1fda) {
    try {
        const _0x475e95 = await _0x0_0xd18315['getSetting'](_0x21670e, 'antibadword');
        return _0x475e95 || null;
    } catch (_0x27fd8f) {
        console['error']('Error\x20getting\x20antibadword:', _0x27fd8f);
        return null;
    }
}
async function removeAntiBadword(_0x6c71da) {
    try {
        await _0x0_0xd18315['saveSetting'](_0x6c71da, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x365898) {
        console['error']('Error\x20removing\x20antibadword:', _0x365898);
        return ![];
    }
}
async function incrementWarningCount(_0x353829, _0x3f8ce6) {
    try {
        const _0x475920 = 'antibadword_warnings';
        const _0x547603 = await _0x0_0xd18315['getSetting'](_0x353829, _0x475920) || {};
        if (!_0x547603[_0x3f8ce6]) {
            _0x547603[_0x3f8ce6] = 0x0;
        }
        _0x547603[_0x3f8ce6]++;
        await _0x0_0xd18315['saveSetting'](_0x353829, _0x475920, _0x547603);
        return _0x547603[_0x3f8ce6];
    } catch (_0x53f924) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x53f924);
        return 0x0;
    }
}
async function resetWarningCount(_0x280e77, _0x11eed5) {
    try {
        const _0x27b07c = 'antibadword_warnings';
        const _0x4dd740 = await _0x0_0xd18315['getSetting'](_0x280e77, _0x27b07c) || {};
        if (_0x4dd740[_0x11eed5]) {
            delete _0x4dd740[_0x11eed5];
            await _0x0_0xd18315['saveSetting'](_0x280e77, _0x27b07c, _0x4dd740);
        }
        return !![];
    } catch (_0x51c97e) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x51c97e);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x2869f1, _0x84938f, _0x1bfdcd, _0x1a6e3b) {
    if (!_0x1a6e3b) {
        return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x1bfdcd });
    }
    if (_0x1a6e3b === 'on') {
        const _0x1c4ee5 = await getAntiBadword(_0x84938f, 'on');
        if (_0x1c4ee5?.['enabled']) {
            return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x84938f, 'on', 'delete');
        return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x1bfdcd });
    }
    if (_0x1a6e3b === 'off') {
        const _0x484a8d = await getAntiBadword(_0x84938f, 'on');
        if (!_0x484a8d?.['enabled']) {
            return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1bfdcd });
        }
        await removeAntiBadword(_0x84938f);
        return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1bfdcd });
    }
    if (_0x1a6e3b['startsWith']('set')) {
        const _0x27ad3f = _0x1a6e3b['split']('\x20')[0x1];
        if (!_0x27ad3f || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x27ad3f)) {
            return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x1bfdcd });
        }
        await setAntiBadword(_0x84938f, 'on', _0x27ad3f);
        return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x27ad3f + '*' }, { 'quoted': _0x1bfdcd });
    }
    return _0x2869f1['sendMessage'](_0x84938f, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x1bfdcd });
}
async function handleBadwordDetection(_0x31868c, _0x1d507b, _0x5b93e1, _0x579f4e, _0x1a067a) {
    const _0xc02c48 = await loadAntibadwordConfig(_0x1d507b);
    if (!_0xc02c48['enabled'])
        return;
    if (!_0x1d507b['endsWith']('@g.us'))
        return;
    if (_0x5b93e1['key']['fromMe'])
        return;
    const _0x253326 = await getAntiBadword(_0x1d507b, 'on');
    if (!_0x253326?.['enabled']) {
        return;
    }
    const _0x27cf42 = _0x579f4e['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x12ef5a = [
        'gandu',
        'madarchod',
        'bhosdike',
        'bsdk',
        'fucker',
        'bhosda',
        'lauda',
        'laude',
        'betichod',
        'chutiya',
        'maa\x20ki\x20chut',
        'behenchod',
        'behen\x20ki\x20chut',
        'tatto\x20ke\x20saudagar',
        'machar\x20ki\x20jhant',
        'jhant\x20ka\x20baal',
        'randi',
        'chuchi',
        'boobs',
        'boobies',
        'tits',
        'idiot',
        'nigga',
        'fuck',
        'dick',
        'bitch',
        'bastard',
        'asshole',
        'asu',
        'awyu',
        'teri\x20ma\x20ki\x20chut',
        'teri\x20maa\x20ki',
        'lund',
        'lund\x20ke\x20baal',
        'mc',
        'lodu',
        'benchod',
        'shit',
        'damn',
        'hell',
        'piss',
        'crap',
        'bastard',
        'slut',
        'whore',
        'prick',
        'motherfucker',
        'cock',
        'cunt',
        'pussy',
        'twat',
        'wanker',
        'douchebag',
        'jackass',
        'moron',
        'retard',
        'scumbag',
        'skank',
        'slutty',
        'arse',
        'bugger',
        'sod\x20off',
        'chut',
        'laude\x20ka\x20baal',
        'madar',
        'behen\x20ke\x20lode',
        'chodne',
        'sala\x20kutta',
        'harami',
        'randi\x20ki\x20aulad',
        'gaand\x20mara',
        'chodu',
        'lund\x20le',
        'gandu\x20saala',
        'kameena',
        'haramzada',
        'chamiya',
        'chodne\x20wala',
        'chudai',
        'chutiye\x20ke\x20baap',
        'fck',
        'fckr',
        'fcker',
        'fuk',
        'fukk',
        'fcuk',
        'btch',
        'bch',
        'bsdk',
        'f*ck',
        'assclown',
        'a**hole',
        'f@ck',
        'b!tch',
        'd!ck',
        'n!gga',
        'f***er',
        's***head',
        'a$$',
        'l0du',
        'lund69',
        'spic',
        'chink',
        'cracker',
        'towelhead',
        'gook',
        'kike',
        'paki',
        'honky',
        'wetback',
        'raghead',
        'jungle\x20bunny',
        'sand\x20nigger',
        'beaner',
        'blowjob',
        'handjob',
        'cum',
        'cumshot',
        'jizz',
        'deepthroat',
        'fap',
        'hentai',
        'MILF',
        'anal',
        'orgasm',
        'dildo',
        'vibrator',
        'gangbang',
        'threesome',
        'porn',
        'sex',
        'xxx',
        'fag',
        'faggot',
        'dyke',
        'tranny',
        'homo',
        'sissy',
        'fairy',
        'lesbo',
        'weed',
        'pot',
        'coke',
        'heroin',
        'meth',
        'crack',
        'dope',
        'bong',
        'kush',
        'hash',
        'trip',
        'rolling'
    ];
    const _0x29e026 = _0x27cf42['split']('\x20');
    let _0x3b1e6f = ![];
    for (const _0x261da1 of _0x29e026) {
        if (_0x261da1['length'] < 0x2)
            continue;
        if (_0x12ef5a['includes'](_0x261da1)) {
            _0x3b1e6f = !![];
            break;
        }
        for (const _0x350763 of _0x12ef5a) {
            if (_0x350763['includes']('\x20')) {
                if (_0x27cf42['includes'](_0x350763)) {
                    _0x3b1e6f = !![];
                    break;
                }
            }
        }
        if (_0x3b1e6f)
            break;
    }
    if (!_0x3b1e6f)
        return;
    const _0x393f88 = await _0x31868c['groupMetadata'](_0x1d507b);
    const _0x59473e = _0x31868c['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x564204 = _0x393f88['participants']['find'](_0x4b9522 => _0x4b9522['id'] === _0x59473e);
    if (!_0x564204?.['admin']) {
        return;
    }
    const _0x54d924 = _0x393f88['participants']['find'](_0x5013e1 => _0x5013e1['id'] === _0x1a067a);
    if (_0x54d924?.['admin']) {
        return;
    }
    try {
        await _0x31868c['sendMessage'](_0x1d507b, { 'delete': _0x5b93e1['key'] });
    } catch (_0x2b313c) {
        console['error']('Error\x20deleting\x20message:', _0x2b313c);
        return;
    }
    switch (_0x253326['action']) {
    case 'delete':
        await _0x31868c['sendMessage'](_0x1d507b, {
            'text': '*@' + _0x1a067a['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x1a067a]
        });
        break;
    case 'kick':
        try {
            await _0x31868c['groupParticipantsUpdate'](_0x1d507b, [_0x1a067a], 'remove');
            await _0x31868c['sendMessage'](_0x1d507b, {
                'text': '*@' + _0x1a067a['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x1a067a]
            });
        } catch (_0x3593de) {
            console['error']('Error\x20kicking\x20user:', _0x3593de);
        }
        break;
    case 'warn': {
            const _0x15e739 = await incrementWarningCount(_0x1d507b, _0x1a067a);
            if (_0x15e739 >= 0x3) {
                try {
                    await _0x31868c['groupParticipantsUpdate'](_0x1d507b, [_0x1a067a], 'remove');
                    await resetWarningCount(_0x1d507b, _0x1a067a);
                    await _0x31868c['sendMessage'](_0x1d507b, {
                        'text': '*@' + _0x1a067a['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x1a067a]
                    });
                } catch (_0x1fed47) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x1fed47);
                }
            } else {
                await _0x31868c['sendMessage'](_0x1d507b, {
                    'text': '*@' + _0x1a067a['split']('@')[0x0] + '\x20warning\x20' + _0x15e739 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x1a067a]
                });
            }
            break;
        }
    }
}
export {
    handleAntiBadwordCommand,
    handleBadwordDetection,
    setAntiBadword,
    getAntiBadword,
    removeAntiBadword,
    incrementWarningCount,
    resetWarningCount
};