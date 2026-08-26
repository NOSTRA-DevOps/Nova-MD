import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2c3e96 from './lightweight_store.js';
import _0x0_0x23c4fd from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x4d3b5b) {
    try {
        if (HAS_DB) {
            const _0x3edab7 = await _0x0_0x2c3e96['getSetting'](_0x4d3b5b, 'antibadword');
            return _0x3edab7 || {};
        } else {
            const _0x526686 = dataFile('userGroupData.json');
            if (!_0x0_0x23c4fd['existsSync'](_0x526686)) {
                return {};
            }
            const _0x23e20f = JSON['parse'](_0x0_0x23c4fd['readFileSync'](_0x526686, 'utf-8')['toString']());
            return _0x23e20f['antibadword']?.[_0x4d3b5b] || {};
        }
    } catch (_0x1e97ff) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x1e97ff['message']);
        return {};
    }
}
async function setAntiBadword(_0x1ad244, _0x58ca54, _0x173efc) {
    try {
        await _0x0_0x2c3e96['saveSetting'](_0x1ad244, 'antibadword', {
            'enabled': !![],
            'action': _0x173efc,
            'type': _0x58ca54
        });
        return !![];
    } catch (_0x4e1032) {
        console['error']('Error\x20setting\x20antibadword:', _0x4e1032);
        return ![];
    }
}
async function getAntiBadword(_0xd8f006, _0x176938) {
    try {
        const _0x21afe5 = await _0x0_0x2c3e96['getSetting'](_0xd8f006, 'antibadword');
        return _0x21afe5 || null;
    } catch (_0xadf72d) {
        console['error']('Error\x20getting\x20antibadword:', _0xadf72d);
        return null;
    }
}
async function removeAntiBadword(_0x245177) {
    try {
        await _0x0_0x2c3e96['saveSetting'](_0x245177, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x18489a) {
        console['error']('Error\x20removing\x20antibadword:', _0x18489a);
        return ![];
    }
}
async function incrementWarningCount(_0x52c3d9, _0x1ec14c) {
    try {
        const _0x27d88d = 'antibadword_warnings';
        const _0x15138e = await _0x0_0x2c3e96['getSetting'](_0x52c3d9, _0x27d88d) || {};
        if (!_0x15138e[_0x1ec14c]) {
            _0x15138e[_0x1ec14c] = 0x0;
        }
        _0x15138e[_0x1ec14c]++;
        await _0x0_0x2c3e96['saveSetting'](_0x52c3d9, _0x27d88d, _0x15138e);
        return _0x15138e[_0x1ec14c];
    } catch (_0x7cc0c4) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x7cc0c4);
        return 0x0;
    }
}
async function resetWarningCount(_0x52c602, _0x445376) {
    try {
        const _0x81f319 = 'antibadword_warnings';
        const _0x17c2f4 = await _0x0_0x2c3e96['getSetting'](_0x52c602, _0x81f319) || {};
        if (_0x17c2f4[_0x445376]) {
            delete _0x17c2f4[_0x445376];
            await _0x0_0x2c3e96['saveSetting'](_0x52c602, _0x81f319, _0x17c2f4);
        }
        return !![];
    } catch (_0xea4c4c) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0xea4c4c);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x5247ff, _0x3afe42, _0x3b6c1f, _0x22794a) {
    if (!_0x22794a) {
        return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x3b6c1f });
    }
    if (_0x22794a === 'on') {
        const _0x5ab7a5 = await getAntiBadword(_0x3afe42, 'on');
        if (_0x5ab7a5?.['enabled']) {
            return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x3afe42, 'on', 'delete');
        return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x3b6c1f });
    }
    if (_0x22794a === 'off') {
        const _0x5aec4f = await getAntiBadword(_0x3afe42, 'on');
        if (!_0x5aec4f?.['enabled']) {
            return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x3b6c1f });
        }
        await removeAntiBadword(_0x3afe42);
        return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x3b6c1f });
    }
    if (_0x22794a['startsWith']('set')) {
        const _0x41c0e1 = _0x22794a['split']('\x20')[0x1];
        if (!_0x41c0e1 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x41c0e1)) {
            return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x3b6c1f });
        }
        await setAntiBadword(_0x3afe42, 'on', _0x41c0e1);
        return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x41c0e1 + '*' }, { 'quoted': _0x3b6c1f });
    }
    return _0x5247ff['sendMessage'](_0x3afe42, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x3b6c1f });
}
async function handleBadwordDetection(_0x356c32, _0xf39609, _0x234999, _0x1f62e5, _0x6fe0bd) {
    const _0x52d73c = await loadAntibadwordConfig(_0xf39609);
    if (!_0x52d73c['enabled'])
        return;
    if (!_0xf39609['endsWith']('@g.us'))
        return;
    if (_0x234999['key']['fromMe'])
        return;
    const _0x167f9d = await getAntiBadword(_0xf39609, 'on');
    if (!_0x167f9d?.['enabled']) {
        return;
    }
    const _0x1d5009 = _0x1f62e5['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x3f4132 = [
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
    const _0x1931e3 = _0x1d5009['split']('\x20');
    let _0x2bc1ce = ![];
    for (const _0x2ea951 of _0x1931e3) {
        if (_0x2ea951['length'] < 0x2)
            continue;
        if (_0x3f4132['includes'](_0x2ea951)) {
            _0x2bc1ce = !![];
            break;
        }
        for (const _0x699e0a of _0x3f4132) {
            if (_0x699e0a['includes']('\x20')) {
                if (_0x1d5009['includes'](_0x699e0a)) {
                    _0x2bc1ce = !![];
                    break;
                }
            }
        }
        if (_0x2bc1ce)
            break;
    }
    if (!_0x2bc1ce)
        return;
    const _0x288cdd = await _0x356c32['groupMetadata'](_0xf39609);
    const _0x50b251 = _0x356c32['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x3d96ec = _0x288cdd['participants']['find'](_0x2937bb => _0x2937bb['id'] === _0x50b251);
    if (!_0x3d96ec?.['admin']) {
        return;
    }
    const _0x4a1940 = _0x288cdd['participants']['find'](_0x4ea58b => _0x4ea58b['id'] === _0x6fe0bd);
    if (_0x4a1940?.['admin']) {
        return;
    }
    try {
        await _0x356c32['sendMessage'](_0xf39609, { 'delete': _0x234999['key'] });
    } catch (_0x21050f) {
        console['error']('Error\x20deleting\x20message:', _0x21050f);
        return;
    }
    switch (_0x167f9d['action']) {
    case 'delete':
        await _0x356c32['sendMessage'](_0xf39609, {
            'text': '*@' + _0x6fe0bd['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x6fe0bd]
        });
        break;
    case 'kick':
        try {
            await _0x356c32['groupParticipantsUpdate'](_0xf39609, [_0x6fe0bd], 'remove');
            await _0x356c32['sendMessage'](_0xf39609, {
                'text': '*@' + _0x6fe0bd['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x6fe0bd]
            });
        } catch (_0x477e7f) {
            console['error']('Error\x20kicking\x20user:', _0x477e7f);
        }
        break;
    case 'warn': {
            const _0x31bbb7 = await incrementWarningCount(_0xf39609, _0x6fe0bd);
            if (_0x31bbb7 >= 0x3) {
                try {
                    await _0x356c32['groupParticipantsUpdate'](_0xf39609, [_0x6fe0bd], 'remove');
                    await resetWarningCount(_0xf39609, _0x6fe0bd);
                    await _0x356c32['sendMessage'](_0xf39609, {
                        'text': '*@' + _0x6fe0bd['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x6fe0bd]
                    });
                } catch (_0x3d96f2) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x3d96f2);
                }
            } else {
                await _0x356c32['sendMessage'](_0xf39609, {
                    'text': '*@' + _0x6fe0bd['split']('@')[0x0] + '\x20warning\x20' + _0x31bbb7 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x6fe0bd]
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