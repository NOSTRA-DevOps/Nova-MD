import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x46ad65 from './lightweight_store.js';
import _0x0_0xcc200d from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x2c8f90) {
    try {
        if (HAS_DB) {
            const _0x5845bd = await _0x0_0x46ad65['getSetting'](_0x2c8f90, 'antibadword');
            return _0x5845bd || {};
        } else {
            const _0x385c2c = dataFile('userGroupData.json');
            if (!_0x0_0xcc200d['existsSync'](_0x385c2c)) {
                return {};
            }
            const _0x3ab89c = JSON['parse'](_0x0_0xcc200d['readFileSync'](_0x385c2c, 'utf-8')['toString']());
            return _0x3ab89c['antibadword']?.[_0x2c8f90] || {};
        }
    } catch (_0x4830cf) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x4830cf['message']);
        return {};
    }
}
async function setAntiBadword(_0x83d37a, _0x320ac9, _0x479b5f) {
    try {
        await _0x0_0x46ad65['saveSetting'](_0x83d37a, 'antibadword', {
            'enabled': !![],
            'action': _0x479b5f,
            'type': _0x320ac9
        });
        return !![];
    } catch (_0x211861) {
        console['error']('Error\x20setting\x20antibadword:', _0x211861);
        return ![];
    }
}
async function getAntiBadword(_0x42b182, _0x1ae743) {
    try {
        const _0x326341 = await _0x0_0x46ad65['getSetting'](_0x42b182, 'antibadword');
        return _0x326341 || null;
    } catch (_0x341982) {
        console['error']('Error\x20getting\x20antibadword:', _0x341982);
        return null;
    }
}
async function removeAntiBadword(_0x1d083d) {
    try {
        await _0x0_0x46ad65['saveSetting'](_0x1d083d, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0xbcd816) {
        console['error']('Error\x20removing\x20antibadword:', _0xbcd816);
        return ![];
    }
}
async function incrementWarningCount(_0x1b31c9, _0x43dab6) {
    try {
        const _0x305574 = 'antibadword_warnings';
        const _0x458888 = await _0x0_0x46ad65['getSetting'](_0x1b31c9, _0x305574) || {};
        if (!_0x458888[_0x43dab6]) {
            _0x458888[_0x43dab6] = 0x0;
        }
        _0x458888[_0x43dab6]++;
        await _0x0_0x46ad65['saveSetting'](_0x1b31c9, _0x305574, _0x458888);
        return _0x458888[_0x43dab6];
    } catch (_0x5340a2) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x5340a2);
        return 0x0;
    }
}
async function resetWarningCount(_0xcbbc6d, _0x1beb78) {
    try {
        const _0x215eaa = 'antibadword_warnings';
        const _0x33762c = await _0x0_0x46ad65['getSetting'](_0xcbbc6d, _0x215eaa) || {};
        if (_0x33762c[_0x1beb78]) {
            delete _0x33762c[_0x1beb78];
            await _0x0_0x46ad65['saveSetting'](_0xcbbc6d, _0x215eaa, _0x33762c);
        }
        return !![];
    } catch (_0x44956) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x44956);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x4758cc, _0x307107, _0x3cb699, _0x106094) {
    if (!_0x106094) {
        return _0x4758cc['sendMessage'](_0x307107, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x3cb699 });
    }
    if (_0x106094 === 'on') {
        const _0x2a81f0 = await getAntiBadword(_0x307107, 'on');
        if (_0x2a81f0?.['enabled']) {
            return _0x4758cc['sendMessage'](_0x307107, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x307107, 'on', 'delete');
        return _0x4758cc['sendMessage'](_0x307107, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x3cb699 });
    }
    if (_0x106094 === 'off') {
        const _0x582493 = await getAntiBadword(_0x307107, 'on');
        if (!_0x582493?.['enabled']) {
            return _0x4758cc['sendMessage'](_0x307107, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x3cb699 });
        }
        await removeAntiBadword(_0x307107);
        return _0x4758cc['sendMessage'](_0x307107, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x3cb699 });
    }
    if (_0x106094['startsWith']('set')) {
        const _0x917645 = _0x106094['split']('\x20')[0x1];
        if (!_0x917645 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x917645)) {
            return _0x4758cc['sendMessage'](_0x307107, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x3cb699 });
        }
        await setAntiBadword(_0x307107, 'on', _0x917645);
        return _0x4758cc['sendMessage'](_0x307107, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x917645 + '*' }, { 'quoted': _0x3cb699 });
    }
    return _0x4758cc['sendMessage'](_0x307107, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x3cb699 });
}
async function handleBadwordDetection(_0x596b2d, _0x13f35a, _0x1c6835, _0x3e37dd, _0x483fa9) {
    const _0x446cf9 = await loadAntibadwordConfig(_0x13f35a);
    if (!_0x446cf9['enabled'])
        return;
    if (!_0x13f35a['endsWith']('@g.us'))
        return;
    if (_0x1c6835['key']['fromMe'])
        return;
    const _0x376f9a = await getAntiBadword(_0x13f35a, 'on');
    if (!_0x376f9a?.['enabled']) {
        return;
    }
    const _0x412d9a = _0x3e37dd['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x475795 = [
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
    const _0x3a597d = _0x412d9a['split']('\x20');
    let _0x3b4ba5 = ![];
    for (const _0x1e1bf4 of _0x3a597d) {
        if (_0x1e1bf4['length'] < 0x2)
            continue;
        if (_0x475795['includes'](_0x1e1bf4)) {
            _0x3b4ba5 = !![];
            break;
        }
        for (const _0x334a1a of _0x475795) {
            if (_0x334a1a['includes']('\x20')) {
                if (_0x412d9a['includes'](_0x334a1a)) {
                    _0x3b4ba5 = !![];
                    break;
                }
            }
        }
        if (_0x3b4ba5)
            break;
    }
    if (!_0x3b4ba5)
        return;
    const _0x4eddb2 = await _0x596b2d['groupMetadata'](_0x13f35a);
    const _0x84aabe = _0x596b2d['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x3420f1 = _0x4eddb2['participants']['find'](_0x1c59fc => _0x1c59fc['id'] === _0x84aabe);
    if (!_0x3420f1?.['admin']) {
        return;
    }
    const _0xba4b2e = _0x4eddb2['participants']['find'](_0x13a929 => _0x13a929['id'] === _0x483fa9);
    if (_0xba4b2e?.['admin']) {
        return;
    }
    try {
        await _0x596b2d['sendMessage'](_0x13f35a, { 'delete': _0x1c6835['key'] });
    } catch (_0x426594) {
        console['error']('Error\x20deleting\x20message:', _0x426594);
        return;
    }
    switch (_0x376f9a['action']) {
    case 'delete':
        await _0x596b2d['sendMessage'](_0x13f35a, {
            'text': '*@' + _0x483fa9['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x483fa9]
        });
        break;
    case 'kick':
        try {
            await _0x596b2d['groupParticipantsUpdate'](_0x13f35a, [_0x483fa9], 'remove');
            await _0x596b2d['sendMessage'](_0x13f35a, {
                'text': '*@' + _0x483fa9['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x483fa9]
            });
        } catch (_0x49119e) {
            console['error']('Error\x20kicking\x20user:', _0x49119e);
        }
        break;
    case 'warn': {
            const _0x5a9c26 = await incrementWarningCount(_0x13f35a, _0x483fa9);
            if (_0x5a9c26 >= 0x3) {
                try {
                    await _0x596b2d['groupParticipantsUpdate'](_0x13f35a, [_0x483fa9], 'remove');
                    await resetWarningCount(_0x13f35a, _0x483fa9);
                    await _0x596b2d['sendMessage'](_0x13f35a, {
                        'text': '*@' + _0x483fa9['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x483fa9]
                    });
                } catch (_0x118752) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x118752);
                }
            } else {
                await _0x596b2d['sendMessage'](_0x13f35a, {
                    'text': '*@' + _0x483fa9['split']('@')[0x0] + '\x20warning\x20' + _0x5a9c26 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x483fa9]
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