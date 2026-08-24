import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x32aa3d from './lightweight_store.js';
import _0x0_0x4f9a9b from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x3509a3) {
    try {
        if (HAS_DB) {
            const _0x5dcfa8 = await _0x0_0x32aa3d['getSetting'](_0x3509a3, 'antibadword');
            return _0x5dcfa8 || {};
        } else {
            const _0x1a5b18 = dataFile('userGroupData.json');
            if (!_0x0_0x4f9a9b['existsSync'](_0x1a5b18)) {
                return {};
            }
            const _0x236cc7 = JSON['parse'](_0x0_0x4f9a9b['readFileSync'](_0x1a5b18, 'utf-8')['toString']());
            return _0x236cc7['antibadword']?.[_0x3509a3] || {};
        }
    } catch (_0x307a64) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x307a64['message']);
        return {};
    }
}
async function setAntiBadword(_0x5b6bad, _0xf2ea59, _0x3dcc8d) {
    try {
        await _0x0_0x32aa3d['saveSetting'](_0x5b6bad, 'antibadword', {
            'enabled': !![],
            'action': _0x3dcc8d,
            'type': _0xf2ea59
        });
        return !![];
    } catch (_0x57d2ae) {
        console['error']('Error\x20setting\x20antibadword:', _0x57d2ae);
        return ![];
    }
}
async function getAntiBadword(_0x1dabd8, _0x4b9fa9) {
    try {
        const _0x4d92fc = await _0x0_0x32aa3d['getSetting'](_0x1dabd8, 'antibadword');
        return _0x4d92fc || null;
    } catch (_0x578845) {
        console['error']('Error\x20getting\x20antibadword:', _0x578845);
        return null;
    }
}
async function removeAntiBadword(_0x2a9ee8) {
    try {
        await _0x0_0x32aa3d['saveSetting'](_0x2a9ee8, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x486335) {
        console['error']('Error\x20removing\x20antibadword:', _0x486335);
        return ![];
    }
}
async function incrementWarningCount(_0x22b0dd, _0xe0ae74) {
    try {
        const _0xb0f341 = 'antibadword_warnings';
        const _0x2b2e7c = await _0x0_0x32aa3d['getSetting'](_0x22b0dd, _0xb0f341) || {};
        if (!_0x2b2e7c[_0xe0ae74]) {
            _0x2b2e7c[_0xe0ae74] = 0x0;
        }
        _0x2b2e7c[_0xe0ae74]++;
        await _0x0_0x32aa3d['saveSetting'](_0x22b0dd, _0xb0f341, _0x2b2e7c);
        return _0x2b2e7c[_0xe0ae74];
    } catch (_0x366127) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x366127);
        return 0x0;
    }
}
async function resetWarningCount(_0x57c29a, _0x3fb028) {
    try {
        const _0x23d612 = 'antibadword_warnings';
        const _0x554df0 = await _0x0_0x32aa3d['getSetting'](_0x57c29a, _0x23d612) || {};
        if (_0x554df0[_0x3fb028]) {
            delete _0x554df0[_0x3fb028];
            await _0x0_0x32aa3d['saveSetting'](_0x57c29a, _0x23d612, _0x554df0);
        }
        return !![];
    } catch (_0x192007) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x192007);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x5b801f, _0x834675, _0x5021bc, _0x34d63c) {
    if (!_0x34d63c) {
        return _0x5b801f['sendMessage'](_0x834675, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x5021bc });
    }
    if (_0x34d63c === 'on') {
        const _0x117b7d = await getAntiBadword(_0x834675, 'on');
        if (_0x117b7d?.['enabled']) {
            return _0x5b801f['sendMessage'](_0x834675, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x834675, 'on', 'delete');
        return _0x5b801f['sendMessage'](_0x834675, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x5021bc });
    }
    if (_0x34d63c === 'off') {
        const _0x502fa3 = await getAntiBadword(_0x834675, 'on');
        if (!_0x502fa3?.['enabled']) {
            return _0x5b801f['sendMessage'](_0x834675, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x5021bc });
        }
        await removeAntiBadword(_0x834675);
        return _0x5b801f['sendMessage'](_0x834675, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x5021bc });
    }
    if (_0x34d63c['startsWith']('set')) {
        const _0x330ba9 = _0x34d63c['split']('\x20')[0x1];
        if (!_0x330ba9 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x330ba9)) {
            return _0x5b801f['sendMessage'](_0x834675, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x5021bc });
        }
        await setAntiBadword(_0x834675, 'on', _0x330ba9);
        return _0x5b801f['sendMessage'](_0x834675, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x330ba9 + '*' }, { 'quoted': _0x5021bc });
    }
    return _0x5b801f['sendMessage'](_0x834675, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x5021bc });
}
async function handleBadwordDetection(_0x361aa2, _0x2b7639, _0x23bd41, _0x21c46e, _0x1b04a7) {
    const _0x51be49 = await loadAntibadwordConfig(_0x2b7639);
    if (!_0x51be49['enabled'])
        return;
    if (!_0x2b7639['endsWith']('@g.us'))
        return;
    if (_0x23bd41['key']['fromMe'])
        return;
    const _0x166740 = await getAntiBadword(_0x2b7639, 'on');
    if (!_0x166740?.['enabled']) {
        return;
    }
    const _0x4347d5 = _0x21c46e['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x4403d7 = [
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
    const _0x35f8fe = _0x4347d5['split']('\x20');
    let _0x53806a = ![];
    for (const _0x306ca3 of _0x35f8fe) {
        if (_0x306ca3['length'] < 0x2)
            continue;
        if (_0x4403d7['includes'](_0x306ca3)) {
            _0x53806a = !![];
            break;
        }
        for (const _0x3aa84f of _0x4403d7) {
            if (_0x3aa84f['includes']('\x20')) {
                if (_0x4347d5['includes'](_0x3aa84f)) {
                    _0x53806a = !![];
                    break;
                }
            }
        }
        if (_0x53806a)
            break;
    }
    if (!_0x53806a)
        return;
    const _0x256b60 = await _0x361aa2['groupMetadata'](_0x2b7639);
    const _0x8bd09d = _0x361aa2['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x527610 = _0x256b60['participants']['find'](_0x1ebc1f => _0x1ebc1f['id'] === _0x8bd09d);
    if (!_0x527610?.['admin']) {
        return;
    }
    const _0x565d74 = _0x256b60['participants']['find'](_0x285409 => _0x285409['id'] === _0x1b04a7);
    if (_0x565d74?.['admin']) {
        return;
    }
    try {
        await _0x361aa2['sendMessage'](_0x2b7639, { 'delete': _0x23bd41['key'] });
    } catch (_0x176c1a) {
        console['error']('Error\x20deleting\x20message:', _0x176c1a);
        return;
    }
    switch (_0x166740['action']) {
    case 'delete':
        await _0x361aa2['sendMessage'](_0x2b7639, {
            'text': '*@' + _0x1b04a7['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x1b04a7]
        });
        break;
    case 'kick':
        try {
            await _0x361aa2['groupParticipantsUpdate'](_0x2b7639, [_0x1b04a7], 'remove');
            await _0x361aa2['sendMessage'](_0x2b7639, {
                'text': '*@' + _0x1b04a7['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x1b04a7]
            });
        } catch (_0x20f6b4) {
            console['error']('Error\x20kicking\x20user:', _0x20f6b4);
        }
        break;
    case 'warn': {
            const _0xd6e0df = await incrementWarningCount(_0x2b7639, _0x1b04a7);
            if (_0xd6e0df >= 0x3) {
                try {
                    await _0x361aa2['groupParticipantsUpdate'](_0x2b7639, [_0x1b04a7], 'remove');
                    await resetWarningCount(_0x2b7639, _0x1b04a7);
                    await _0x361aa2['sendMessage'](_0x2b7639, {
                        'text': '*@' + _0x1b04a7['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x1b04a7]
                    });
                } catch (_0x23a9a5) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x23a9a5);
                }
            } else {
                await _0x361aa2['sendMessage'](_0x2b7639, {
                    'text': '*@' + _0x1b04a7['split']('@')[0x0] + '\x20warning\x20' + _0xd6e0df + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x1b04a7]
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