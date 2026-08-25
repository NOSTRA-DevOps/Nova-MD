import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x33978c from './lightweight_store.js';
import _0x0_0x18c3a7 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x1592fa) {
    try {
        if (HAS_DB) {
            const _0x2fd49d = await _0x0_0x33978c['getSetting'](_0x1592fa, 'antibadword');
            return _0x2fd49d || {};
        } else {
            const _0x3ad937 = dataFile('userGroupData.json');
            if (!_0x0_0x18c3a7['existsSync'](_0x3ad937)) {
                return {};
            }
            const _0x5c83ec = JSON['parse'](_0x0_0x18c3a7['readFileSync'](_0x3ad937, 'utf-8')['toString']());
            return _0x5c83ec['antibadword']?.[_0x1592fa] || {};
        }
    } catch (_0x29a49c) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x29a49c['message']);
        return {};
    }
}
async function setAntiBadword(_0x2205ea, _0x52c002, _0x7f9848) {
    try {
        await _0x0_0x33978c['saveSetting'](_0x2205ea, 'antibadword', {
            'enabled': !![],
            'action': _0x7f9848,
            'type': _0x52c002
        });
        return !![];
    } catch (_0x406fc7) {
        console['error']('Error\x20setting\x20antibadword:', _0x406fc7);
        return ![];
    }
}
async function getAntiBadword(_0x32fbbb, _0x2be3d7) {
    try {
        const _0x2bbb97 = await _0x0_0x33978c['getSetting'](_0x32fbbb, 'antibadword');
        return _0x2bbb97 || null;
    } catch (_0x5c2a52) {
        console['error']('Error\x20getting\x20antibadword:', _0x5c2a52);
        return null;
    }
}
async function removeAntiBadword(_0x3b9ad0) {
    try {
        await _0x0_0x33978c['saveSetting'](_0x3b9ad0, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x69424d) {
        console['error']('Error\x20removing\x20antibadword:', _0x69424d);
        return ![];
    }
}
async function incrementWarningCount(_0x2400f4, _0x24dcec) {
    try {
        const _0x2b66a2 = 'antibadword_warnings';
        const _0x4d2984 = await _0x0_0x33978c['getSetting'](_0x2400f4, _0x2b66a2) || {};
        if (!_0x4d2984[_0x24dcec]) {
            _0x4d2984[_0x24dcec] = 0x0;
        }
        _0x4d2984[_0x24dcec]++;
        await _0x0_0x33978c['saveSetting'](_0x2400f4, _0x2b66a2, _0x4d2984);
        return _0x4d2984[_0x24dcec];
    } catch (_0x504192) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x504192);
        return 0x0;
    }
}
async function resetWarningCount(_0x46e452, _0x2635e5) {
    try {
        const _0x28a5da = 'antibadword_warnings';
        const _0x2d8cb5 = await _0x0_0x33978c['getSetting'](_0x46e452, _0x28a5da) || {};
        if (_0x2d8cb5[_0x2635e5]) {
            delete _0x2d8cb5[_0x2635e5];
            await _0x0_0x33978c['saveSetting'](_0x46e452, _0x28a5da, _0x2d8cb5);
        }
        return !![];
    } catch (_0x310cd2) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x310cd2);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x436fc9, _0x4294c3, _0x34578a, _0x4e2cc7) {
    if (!_0x4e2cc7) {
        return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x34578a });
    }
    if (_0x4e2cc7 === 'on') {
        const _0x41d5f1 = await getAntiBadword(_0x4294c3, 'on');
        if (_0x41d5f1?.['enabled']) {
            return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x4294c3, 'on', 'delete');
        return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x34578a });
    }
    if (_0x4e2cc7 === 'off') {
        const _0x4747ee = await getAntiBadword(_0x4294c3, 'on');
        if (!_0x4747ee?.['enabled']) {
            return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x34578a });
        }
        await removeAntiBadword(_0x4294c3);
        return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x34578a });
    }
    if (_0x4e2cc7['startsWith']('set')) {
        const _0x312d51 = _0x4e2cc7['split']('\x20')[0x1];
        if (!_0x312d51 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x312d51)) {
            return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x34578a });
        }
        await setAntiBadword(_0x4294c3, 'on', _0x312d51);
        return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x312d51 + '*' }, { 'quoted': _0x34578a });
    }
    return _0x436fc9['sendMessage'](_0x4294c3, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x34578a });
}
async function handleBadwordDetection(_0x17d4e7, _0x539af7, _0x3a3187, _0x1f5a8d, _0x8e97a8) {
    const _0x10c91d = await loadAntibadwordConfig(_0x539af7);
    if (!_0x10c91d['enabled'])
        return;
    if (!_0x539af7['endsWith']('@g.us'))
        return;
    if (_0x3a3187['key']['fromMe'])
        return;
    const _0x213d1a = await getAntiBadword(_0x539af7, 'on');
    if (!_0x213d1a?.['enabled']) {
        return;
    }
    const _0x3bd8ac = _0x1f5a8d['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x2dd61f = [
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
    const _0x40ef5d = _0x3bd8ac['split']('\x20');
    let _0x5ef83f = ![];
    for (const _0x595a83 of _0x40ef5d) {
        if (_0x595a83['length'] < 0x2)
            continue;
        if (_0x2dd61f['includes'](_0x595a83)) {
            _0x5ef83f = !![];
            break;
        }
        for (const _0x1cd1d9 of _0x2dd61f) {
            if (_0x1cd1d9['includes']('\x20')) {
                if (_0x3bd8ac['includes'](_0x1cd1d9)) {
                    _0x5ef83f = !![];
                    break;
                }
            }
        }
        if (_0x5ef83f)
            break;
    }
    if (!_0x5ef83f)
        return;
    const _0x42259a = await _0x17d4e7['groupMetadata'](_0x539af7);
    const _0x4737a5 = _0x17d4e7['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x150ab1 = _0x42259a['participants']['find'](_0x10a41b => _0x10a41b['id'] === _0x4737a5);
    if (!_0x150ab1?.['admin']) {
        return;
    }
    const _0x3a8c66 = _0x42259a['participants']['find'](_0xf37c80 => _0xf37c80['id'] === _0x8e97a8);
    if (_0x3a8c66?.['admin']) {
        return;
    }
    try {
        await _0x17d4e7['sendMessage'](_0x539af7, { 'delete': _0x3a3187['key'] });
    } catch (_0x3335e4) {
        console['error']('Error\x20deleting\x20message:', _0x3335e4);
        return;
    }
    switch (_0x213d1a['action']) {
    case 'delete':
        await _0x17d4e7['sendMessage'](_0x539af7, {
            'text': '*@' + _0x8e97a8['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x8e97a8]
        });
        break;
    case 'kick':
        try {
            await _0x17d4e7['groupParticipantsUpdate'](_0x539af7, [_0x8e97a8], 'remove');
            await _0x17d4e7['sendMessage'](_0x539af7, {
                'text': '*@' + _0x8e97a8['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x8e97a8]
            });
        } catch (_0x22ffbb) {
            console['error']('Error\x20kicking\x20user:', _0x22ffbb);
        }
        break;
    case 'warn': {
            const _0x49ca48 = await incrementWarningCount(_0x539af7, _0x8e97a8);
            if (_0x49ca48 >= 0x3) {
                try {
                    await _0x17d4e7['groupParticipantsUpdate'](_0x539af7, [_0x8e97a8], 'remove');
                    await resetWarningCount(_0x539af7, _0x8e97a8);
                    await _0x17d4e7['sendMessage'](_0x539af7, {
                        'text': '*@' + _0x8e97a8['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x8e97a8]
                    });
                } catch (_0x35ab3a) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x35ab3a);
                }
            } else {
                await _0x17d4e7['sendMessage'](_0x539af7, {
                    'text': '*@' + _0x8e97a8['split']('@')[0x0] + '\x20warning\x20' + _0x49ca48 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x8e97a8]
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