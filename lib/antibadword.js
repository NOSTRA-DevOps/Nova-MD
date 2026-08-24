import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4d037a from './lightweight_store.js';
import _0x0_0x1b697b from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x3e8fdc) {
    try {
        if (HAS_DB) {
            const _0x5c2c6d = await _0x0_0x4d037a['getSetting'](_0x3e8fdc, 'antibadword');
            return _0x5c2c6d || {};
        } else {
            const _0xd90490 = dataFile('userGroupData.json');
            if (!_0x0_0x1b697b['existsSync'](_0xd90490)) {
                return {};
            }
            const _0x4aec96 = JSON['parse'](_0x0_0x1b697b['readFileSync'](_0xd90490, 'utf-8')['toString']());
            return _0x4aec96['antibadword']?.[_0x3e8fdc] || {};
        }
    } catch (_0x5e28e9) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x5e28e9['message']);
        return {};
    }
}
async function setAntiBadword(_0x1f9c05, _0x2c7c5d, _0xe87407) {
    try {
        await _0x0_0x4d037a['saveSetting'](_0x1f9c05, 'antibadword', {
            'enabled': !![],
            'action': _0xe87407,
            'type': _0x2c7c5d
        });
        return !![];
    } catch (_0x439783) {
        console['error']('Error\x20setting\x20antibadword:', _0x439783);
        return ![];
    }
}
async function getAntiBadword(_0x42cf15, _0x139978) {
    try {
        const _0x311895 = await _0x0_0x4d037a['getSetting'](_0x42cf15, 'antibadword');
        return _0x311895 || null;
    } catch (_0x111e03) {
        console['error']('Error\x20getting\x20antibadword:', _0x111e03);
        return null;
    }
}
async function removeAntiBadword(_0x1fccc5) {
    try {
        await _0x0_0x4d037a['saveSetting'](_0x1fccc5, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0xd49ccf) {
        console['error']('Error\x20removing\x20antibadword:', _0xd49ccf);
        return ![];
    }
}
async function incrementWarningCount(_0x42e345, _0x172534) {
    try {
        const _0x743b00 = 'antibadword_warnings';
        const _0x4996b8 = await _0x0_0x4d037a['getSetting'](_0x42e345, _0x743b00) || {};
        if (!_0x4996b8[_0x172534]) {
            _0x4996b8[_0x172534] = 0x0;
        }
        _0x4996b8[_0x172534]++;
        await _0x0_0x4d037a['saveSetting'](_0x42e345, _0x743b00, _0x4996b8);
        return _0x4996b8[_0x172534];
    } catch (_0x259333) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x259333);
        return 0x0;
    }
}
async function resetWarningCount(_0x3c378d, _0x15507d) {
    try {
        const _0x44e241 = 'antibadword_warnings';
        const _0x5b2eae = await _0x0_0x4d037a['getSetting'](_0x3c378d, _0x44e241) || {};
        if (_0x5b2eae[_0x15507d]) {
            delete _0x5b2eae[_0x15507d];
            await _0x0_0x4d037a['saveSetting'](_0x3c378d, _0x44e241, _0x5b2eae);
        }
        return !![];
    } catch (_0x43873a) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x43873a);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x5b23b7, _0x341377, _0x1fa9d6, _0x24d4c8) {
    if (!_0x24d4c8) {
        return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x1fa9d6 });
    }
    if (_0x24d4c8 === 'on') {
        const _0x29728d = await getAntiBadword(_0x341377, 'on');
        if (_0x29728d?.['enabled']) {
            return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x341377, 'on', 'delete');
        return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x1fa9d6 });
    }
    if (_0x24d4c8 === 'off') {
        const _0x5bfa55 = await getAntiBadword(_0x341377, 'on');
        if (!_0x5bfa55?.['enabled']) {
            return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1fa9d6 });
        }
        await removeAntiBadword(_0x341377);
        return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1fa9d6 });
    }
    if (_0x24d4c8['startsWith']('set')) {
        const _0x2ef45b = _0x24d4c8['split']('\x20')[0x1];
        if (!_0x2ef45b || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x2ef45b)) {
            return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x1fa9d6 });
        }
        await setAntiBadword(_0x341377, 'on', _0x2ef45b);
        return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x2ef45b + '*' }, { 'quoted': _0x1fa9d6 });
    }
    return _0x5b23b7['sendMessage'](_0x341377, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x1fa9d6 });
}
async function handleBadwordDetection(_0x11784a, _0x4f9c2b, _0x4dca58, _0x30a1c4, _0x4bba94) {
    const _0x5b53dd = await loadAntibadwordConfig(_0x4f9c2b);
    if (!_0x5b53dd['enabled'])
        return;
    if (!_0x4f9c2b['endsWith']('@g.us'))
        return;
    if (_0x4dca58['key']['fromMe'])
        return;
    const _0x4231f1 = await getAntiBadword(_0x4f9c2b, 'on');
    if (!_0x4231f1?.['enabled']) {
        return;
    }
    const _0x32be43 = _0x30a1c4['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x1ff538 = [
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
    const _0x2b72cd = _0x32be43['split']('\x20');
    let _0x539a5d = ![];
    for (const _0x43a391 of _0x2b72cd) {
        if (_0x43a391['length'] < 0x2)
            continue;
        if (_0x1ff538['includes'](_0x43a391)) {
            _0x539a5d = !![];
            break;
        }
        for (const _0x319a20 of _0x1ff538) {
            if (_0x319a20['includes']('\x20')) {
                if (_0x32be43['includes'](_0x319a20)) {
                    _0x539a5d = !![];
                    break;
                }
            }
        }
        if (_0x539a5d)
            break;
    }
    if (!_0x539a5d)
        return;
    const _0x1a4a09 = await _0x11784a['groupMetadata'](_0x4f9c2b);
    const _0x57be42 = _0x11784a['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x179a2b = _0x1a4a09['participants']['find'](_0x1d35bc => _0x1d35bc['id'] === _0x57be42);
    if (!_0x179a2b?.['admin']) {
        return;
    }
    const _0x239de5 = _0x1a4a09['participants']['find'](_0x2efa53 => _0x2efa53['id'] === _0x4bba94);
    if (_0x239de5?.['admin']) {
        return;
    }
    try {
        await _0x11784a['sendMessage'](_0x4f9c2b, { 'delete': _0x4dca58['key'] });
    } catch (_0x233766) {
        console['error']('Error\x20deleting\x20message:', _0x233766);
        return;
    }
    switch (_0x4231f1['action']) {
    case 'delete':
        await _0x11784a['sendMessage'](_0x4f9c2b, {
            'text': '*@' + _0x4bba94['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x4bba94]
        });
        break;
    case 'kick':
        try {
            await _0x11784a['groupParticipantsUpdate'](_0x4f9c2b, [_0x4bba94], 'remove');
            await _0x11784a['sendMessage'](_0x4f9c2b, {
                'text': '*@' + _0x4bba94['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x4bba94]
            });
        } catch (_0x2d9736) {
            console['error']('Error\x20kicking\x20user:', _0x2d9736);
        }
        break;
    case 'warn': {
            const _0x44831b = await incrementWarningCount(_0x4f9c2b, _0x4bba94);
            if (_0x44831b >= 0x3) {
                try {
                    await _0x11784a['groupParticipantsUpdate'](_0x4f9c2b, [_0x4bba94], 'remove');
                    await resetWarningCount(_0x4f9c2b, _0x4bba94);
                    await _0x11784a['sendMessage'](_0x4f9c2b, {
                        'text': '*@' + _0x4bba94['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x4bba94]
                    });
                } catch (_0x59e666) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x59e666);
                }
            } else {
                await _0x11784a['sendMessage'](_0x4f9c2b, {
                    'text': '*@' + _0x4bba94['split']('@')[0x0] + '\x20warning\x20' + _0x44831b + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x4bba94]
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