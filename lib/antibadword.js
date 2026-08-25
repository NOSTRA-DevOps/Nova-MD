import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5c8c69 from './lightweight_store.js';
import _0x0_0x3a8cb4 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x13cf4b) {
    try {
        if (HAS_DB) {
            const _0x5f3b22 = await _0x0_0x5c8c69['getSetting'](_0x13cf4b, 'antibadword');
            return _0x5f3b22 || {};
        } else {
            const _0x1bf356 = dataFile('userGroupData.json');
            if (!_0x0_0x3a8cb4['existsSync'](_0x1bf356)) {
                return {};
            }
            const _0x69d31d = JSON['parse'](_0x0_0x3a8cb4['readFileSync'](_0x1bf356, 'utf-8')['toString']());
            return _0x69d31d['antibadword']?.[_0x13cf4b] || {};
        }
    } catch (_0x5abc85) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x5abc85['message']);
        return {};
    }
}
async function setAntiBadword(_0x407476, _0x3dfea1, _0x4058a2) {
    try {
        await _0x0_0x5c8c69['saveSetting'](_0x407476, 'antibadword', {
            'enabled': !![],
            'action': _0x4058a2,
            'type': _0x3dfea1
        });
        return !![];
    } catch (_0x37ba17) {
        console['error']('Error\x20setting\x20antibadword:', _0x37ba17);
        return ![];
    }
}
async function getAntiBadword(_0x905a05, _0x54e536) {
    try {
        const _0x12089e = await _0x0_0x5c8c69['getSetting'](_0x905a05, 'antibadword');
        return _0x12089e || null;
    } catch (_0x46979a) {
        console['error']('Error\x20getting\x20antibadword:', _0x46979a);
        return null;
    }
}
async function removeAntiBadword(_0x3498d1) {
    try {
        await _0x0_0x5c8c69['saveSetting'](_0x3498d1, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0xfb0774) {
        console['error']('Error\x20removing\x20antibadword:', _0xfb0774);
        return ![];
    }
}
async function incrementWarningCount(_0x18e7a6, _0x5404c7) {
    try {
        const _0x492acc = 'antibadword_warnings';
        const _0xc25bdd = await _0x0_0x5c8c69['getSetting'](_0x18e7a6, _0x492acc) || {};
        if (!_0xc25bdd[_0x5404c7]) {
            _0xc25bdd[_0x5404c7] = 0x0;
        }
        _0xc25bdd[_0x5404c7]++;
        await _0x0_0x5c8c69['saveSetting'](_0x18e7a6, _0x492acc, _0xc25bdd);
        return _0xc25bdd[_0x5404c7];
    } catch (_0x33e66e) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x33e66e);
        return 0x0;
    }
}
async function resetWarningCount(_0x4e117a, _0x4120c9) {
    try {
        const _0xe3a892 = 'antibadword_warnings';
        const _0x2f9d38 = await _0x0_0x5c8c69['getSetting'](_0x4e117a, _0xe3a892) || {};
        if (_0x2f9d38[_0x4120c9]) {
            delete _0x2f9d38[_0x4120c9];
            await _0x0_0x5c8c69['saveSetting'](_0x4e117a, _0xe3a892, _0x2f9d38);
        }
        return !![];
    } catch (_0x27ae22) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x27ae22);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x56824a, _0x4cecae, _0x1a0601, _0x206008) {
    if (!_0x206008) {
        return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x1a0601 });
    }
    if (_0x206008 === 'on') {
        const _0x5b112e = await getAntiBadword(_0x4cecae, 'on');
        if (_0x5b112e?.['enabled']) {
            return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x4cecae, 'on', 'delete');
        return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x1a0601 });
    }
    if (_0x206008 === 'off') {
        const _0x26781a = await getAntiBadword(_0x4cecae, 'on');
        if (!_0x26781a?.['enabled']) {
            return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1a0601 });
        }
        await removeAntiBadword(_0x4cecae);
        return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1a0601 });
    }
    if (_0x206008['startsWith']('set')) {
        const _0x3faade = _0x206008['split']('\x20')[0x1];
        if (!_0x3faade || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x3faade)) {
            return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x1a0601 });
        }
        await setAntiBadword(_0x4cecae, 'on', _0x3faade);
        return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x3faade + '*' }, { 'quoted': _0x1a0601 });
    }
    return _0x56824a['sendMessage'](_0x4cecae, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x1a0601 });
}
async function handleBadwordDetection(_0x340bce, _0x2f4294, _0x2b1526, _0x450a8a, _0x2513b9) {
    const _0xe30cf2 = await loadAntibadwordConfig(_0x2f4294);
    if (!_0xe30cf2['enabled'])
        return;
    if (!_0x2f4294['endsWith']('@g.us'))
        return;
    if (_0x2b1526['key']['fromMe'])
        return;
    const _0x2465ff = await getAntiBadword(_0x2f4294, 'on');
    if (!_0x2465ff?.['enabled']) {
        return;
    }
    const _0x1cf5e8 = _0x450a8a['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x3f0d47 = [
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
    const _0x414f82 = _0x1cf5e8['split']('\x20');
    let _0x364d46 = ![];
    for (const _0x1c6ee1 of _0x414f82) {
        if (_0x1c6ee1['length'] < 0x2)
            continue;
        if (_0x3f0d47['includes'](_0x1c6ee1)) {
            _0x364d46 = !![];
            break;
        }
        for (const _0x1370cd of _0x3f0d47) {
            if (_0x1370cd['includes']('\x20')) {
                if (_0x1cf5e8['includes'](_0x1370cd)) {
                    _0x364d46 = !![];
                    break;
                }
            }
        }
        if (_0x364d46)
            break;
    }
    if (!_0x364d46)
        return;
    const _0x59c8c0 = await _0x340bce['groupMetadata'](_0x2f4294);
    const _0x32947a = _0x340bce['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x38dc57 = _0x59c8c0['participants']['find'](_0x137e06 => _0x137e06['id'] === _0x32947a);
    if (!_0x38dc57?.['admin']) {
        return;
    }
    const _0xb535cb = _0x59c8c0['participants']['find'](_0x39160e => _0x39160e['id'] === _0x2513b9);
    if (_0xb535cb?.['admin']) {
        return;
    }
    try {
        await _0x340bce['sendMessage'](_0x2f4294, { 'delete': _0x2b1526['key'] });
    } catch (_0x22fe65) {
        console['error']('Error\x20deleting\x20message:', _0x22fe65);
        return;
    }
    switch (_0x2465ff['action']) {
    case 'delete':
        await _0x340bce['sendMessage'](_0x2f4294, {
            'text': '*@' + _0x2513b9['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x2513b9]
        });
        break;
    case 'kick':
        try {
            await _0x340bce['groupParticipantsUpdate'](_0x2f4294, [_0x2513b9], 'remove');
            await _0x340bce['sendMessage'](_0x2f4294, {
                'text': '*@' + _0x2513b9['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x2513b9]
            });
        } catch (_0x33f137) {
            console['error']('Error\x20kicking\x20user:', _0x33f137);
        }
        break;
    case 'warn': {
            const _0x3ce3dc = await incrementWarningCount(_0x2f4294, _0x2513b9);
            if (_0x3ce3dc >= 0x3) {
                try {
                    await _0x340bce['groupParticipantsUpdate'](_0x2f4294, [_0x2513b9], 'remove');
                    await resetWarningCount(_0x2f4294, _0x2513b9);
                    await _0x340bce['sendMessage'](_0x2f4294, {
                        'text': '*@' + _0x2513b9['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x2513b9]
                    });
                } catch (_0xa9f068) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0xa9f068);
                }
            } else {
                await _0x340bce['sendMessage'](_0x2f4294, {
                    'text': '*@' + _0x2513b9['split']('@')[0x0] + '\x20warning\x20' + _0x3ce3dc + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x2513b9]
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