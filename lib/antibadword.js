import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x526142 from './lightweight_store.js';
import _0x0_0x2b0f1b from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x32da70) {
    try {
        if (HAS_DB) {
            const _0xaadf07 = await _0x0_0x526142['getSetting'](_0x32da70, 'antibadword');
            return _0xaadf07 || {};
        } else {
            const _0x5845bf = dataFile('userGroupData.json');
            if (!_0x0_0x2b0f1b['existsSync'](_0x5845bf)) {
                return {};
            }
            const _0xa11866 = JSON['parse'](_0x0_0x2b0f1b['readFileSync'](_0x5845bf, 'utf-8')['toString']());
            return _0xa11866['antibadword']?.[_0x32da70] || {};
        }
    } catch (_0x50a7a0) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x50a7a0['message']);
        return {};
    }
}
async function setAntiBadword(_0x294fff, _0x4c5766, _0xc916b5) {
    try {
        await _0x0_0x526142['saveSetting'](_0x294fff, 'antibadword', {
            'enabled': !![],
            'action': _0xc916b5,
            'type': _0x4c5766
        });
        return !![];
    } catch (_0x40b587) {
        console['error']('Error\x20setting\x20antibadword:', _0x40b587);
        return ![];
    }
}
async function getAntiBadword(_0x12d8bb, _0x587a6b) {
    try {
        const _0x5a4fed = await _0x0_0x526142['getSetting'](_0x12d8bb, 'antibadword');
        return _0x5a4fed || null;
    } catch (_0x1b880b) {
        console['error']('Error\x20getting\x20antibadword:', _0x1b880b);
        return null;
    }
}
async function removeAntiBadword(_0x305184) {
    try {
        await _0x0_0x526142['saveSetting'](_0x305184, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0xf2d3f0) {
        console['error']('Error\x20removing\x20antibadword:', _0xf2d3f0);
        return ![];
    }
}
async function incrementWarningCount(_0x379d09, _0x26ca08) {
    try {
        const _0x1310de = 'antibadword_warnings';
        const _0x20a0e9 = await _0x0_0x526142['getSetting'](_0x379d09, _0x1310de) || {};
        if (!_0x20a0e9[_0x26ca08]) {
            _0x20a0e9[_0x26ca08] = 0x0;
        }
        _0x20a0e9[_0x26ca08]++;
        await _0x0_0x526142['saveSetting'](_0x379d09, _0x1310de, _0x20a0e9);
        return _0x20a0e9[_0x26ca08];
    } catch (_0x2a14a3) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x2a14a3);
        return 0x0;
    }
}
async function resetWarningCount(_0x17ba9e, _0x5d15e0) {
    try {
        const _0x37078f = 'antibadword_warnings';
        const _0x25ddcf = await _0x0_0x526142['getSetting'](_0x17ba9e, _0x37078f) || {};
        if (_0x25ddcf[_0x5d15e0]) {
            delete _0x25ddcf[_0x5d15e0];
            await _0x0_0x526142['saveSetting'](_0x17ba9e, _0x37078f, _0x25ddcf);
        }
        return !![];
    } catch (_0x5dcb25) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x5dcb25);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x46c0b5, _0x3ded11, _0x575798, _0x12c0e2) {
    if (!_0x12c0e2) {
        return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x575798 });
    }
    if (_0x12c0e2 === 'on') {
        const _0x35eec6 = await getAntiBadword(_0x3ded11, 'on');
        if (_0x35eec6?.['enabled']) {
            return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x3ded11, 'on', 'delete');
        return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x575798 });
    }
    if (_0x12c0e2 === 'off') {
        const _0x6e3716 = await getAntiBadword(_0x3ded11, 'on');
        if (!_0x6e3716?.['enabled']) {
            return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x575798 });
        }
        await removeAntiBadword(_0x3ded11);
        return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x575798 });
    }
    if (_0x12c0e2['startsWith']('set')) {
        const _0x406022 = _0x12c0e2['split']('\x20')[0x1];
        if (!_0x406022 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x406022)) {
            return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x575798 });
        }
        await setAntiBadword(_0x3ded11, 'on', _0x406022);
        return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x406022 + '*' }, { 'quoted': _0x575798 });
    }
    return _0x46c0b5['sendMessage'](_0x3ded11, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x575798 });
}
async function handleBadwordDetection(_0x14040d, _0x14a8a5, _0x58ddb3, _0x3c900b, _0x2cbc39) {
    const _0x488ea = await loadAntibadwordConfig(_0x14a8a5);
    if (!_0x488ea['enabled'])
        return;
    if (!_0x14a8a5['endsWith']('@g.us'))
        return;
    if (_0x58ddb3['key']['fromMe'])
        return;
    const _0x2e0449 = await getAntiBadword(_0x14a8a5, 'on');
    if (!_0x2e0449?.['enabled']) {
        return;
    }
    const _0x85103a = _0x3c900b['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x5a1a5f = [
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
    const _0x4d882a = _0x85103a['split']('\x20');
    let _0xea36d3 = ![];
    for (const _0x1c53ba of _0x4d882a) {
        if (_0x1c53ba['length'] < 0x2)
            continue;
        if (_0x5a1a5f['includes'](_0x1c53ba)) {
            _0xea36d3 = !![];
            break;
        }
        for (const _0x3301c0 of _0x5a1a5f) {
            if (_0x3301c0['includes']('\x20')) {
                if (_0x85103a['includes'](_0x3301c0)) {
                    _0xea36d3 = !![];
                    break;
                }
            }
        }
        if (_0xea36d3)
            break;
    }
    if (!_0xea36d3)
        return;
    const _0x2b7c73 = await _0x14040d['groupMetadata'](_0x14a8a5);
    const _0x3bdf09 = _0x14040d['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x25fd1b = _0x2b7c73['participants']['find'](_0x2a1329 => _0x2a1329['id'] === _0x3bdf09);
    if (!_0x25fd1b?.['admin']) {
        return;
    }
    const _0x2a6fcc = _0x2b7c73['participants']['find'](_0x2fbe15 => _0x2fbe15['id'] === _0x2cbc39);
    if (_0x2a6fcc?.['admin']) {
        return;
    }
    try {
        await _0x14040d['sendMessage'](_0x14a8a5, { 'delete': _0x58ddb3['key'] });
    } catch (_0x12b543) {
        console['error']('Error\x20deleting\x20message:', _0x12b543);
        return;
    }
    switch (_0x2e0449['action']) {
    case 'delete':
        await _0x14040d['sendMessage'](_0x14a8a5, {
            'text': '*@' + _0x2cbc39['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x2cbc39]
        });
        break;
    case 'kick':
        try {
            await _0x14040d['groupParticipantsUpdate'](_0x14a8a5, [_0x2cbc39], 'remove');
            await _0x14040d['sendMessage'](_0x14a8a5, {
                'text': '*@' + _0x2cbc39['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x2cbc39]
            });
        } catch (_0x1ae20f) {
            console['error']('Error\x20kicking\x20user:', _0x1ae20f);
        }
        break;
    case 'warn': {
            const _0x38d21a = await incrementWarningCount(_0x14a8a5, _0x2cbc39);
            if (_0x38d21a >= 0x3) {
                try {
                    await _0x14040d['groupParticipantsUpdate'](_0x14a8a5, [_0x2cbc39], 'remove');
                    await resetWarningCount(_0x14a8a5, _0x2cbc39);
                    await _0x14040d['sendMessage'](_0x14a8a5, {
                        'text': '*@' + _0x2cbc39['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x2cbc39]
                    });
                } catch (_0x4bfd8d) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x4bfd8d);
                }
            } else {
                await _0x14040d['sendMessage'](_0x14a8a5, {
                    'text': '*@' + _0x2cbc39['split']('@')[0x0] + '\x20warning\x20' + _0x38d21a + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x2cbc39]
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