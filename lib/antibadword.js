import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x46ff18 from './lightweight_store.js';
import _0x0_0x1edff2 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x39b4c0) {
    try {
        if (HAS_DB) {
            const _0x11a772 = await _0x0_0x46ff18['getSetting'](_0x39b4c0, 'antibadword');
            return _0x11a772 || {};
        } else {
            const _0x5cec8f = dataFile('userGroupData.json');
            if (!_0x0_0x1edff2['existsSync'](_0x5cec8f)) {
                return {};
            }
            const _0x4d88ab = JSON['parse'](_0x0_0x1edff2['readFileSync'](_0x5cec8f, 'utf-8')['toString']());
            return _0x4d88ab['antibadword']?.[_0x39b4c0] || {};
        }
    } catch (_0xd9682) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0xd9682['message']);
        return {};
    }
}
async function setAntiBadword(_0x2ccb75, _0x3aa826, _0x18aa15) {
    try {
        await _0x0_0x46ff18['saveSetting'](_0x2ccb75, 'antibadword', {
            'enabled': !![],
            'action': _0x18aa15,
            'type': _0x3aa826
        });
        return !![];
    } catch (_0x4516da) {
        console['error']('Error\x20setting\x20antibadword:', _0x4516da);
        return ![];
    }
}
async function getAntiBadword(_0x433dd3, _0x5a255f) {
    try {
        const _0xd4792b = await _0x0_0x46ff18['getSetting'](_0x433dd3, 'antibadword');
        return _0xd4792b || null;
    } catch (_0x3878e6) {
        console['error']('Error\x20getting\x20antibadword:', _0x3878e6);
        return null;
    }
}
async function removeAntiBadword(_0x393ed9) {
    try {
        await _0x0_0x46ff18['saveSetting'](_0x393ed9, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x34323a) {
        console['error']('Error\x20removing\x20antibadword:', _0x34323a);
        return ![];
    }
}
async function incrementWarningCount(_0x19f766, _0x35d7dc) {
    try {
        const _0x546356 = 'antibadword_warnings';
        const _0x34569a = await _0x0_0x46ff18['getSetting'](_0x19f766, _0x546356) || {};
        if (!_0x34569a[_0x35d7dc]) {
            _0x34569a[_0x35d7dc] = 0x0;
        }
        _0x34569a[_0x35d7dc]++;
        await _0x0_0x46ff18['saveSetting'](_0x19f766, _0x546356, _0x34569a);
        return _0x34569a[_0x35d7dc];
    } catch (_0x5a5674) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x5a5674);
        return 0x0;
    }
}
async function resetWarningCount(_0x456c2a, _0x8ef024) {
    try {
        const _0x5472c7 = 'antibadword_warnings';
        const _0x17b69f = await _0x0_0x46ff18['getSetting'](_0x456c2a, _0x5472c7) || {};
        if (_0x17b69f[_0x8ef024]) {
            delete _0x17b69f[_0x8ef024];
            await _0x0_0x46ff18['saveSetting'](_0x456c2a, _0x5472c7, _0x17b69f);
        }
        return !![];
    } catch (_0xf00c84) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0xf00c84);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x128f49, _0x4d7277, _0x37325a, _0x663c80) {
    if (!_0x663c80) {
        return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x37325a });
    }
    if (_0x663c80 === 'on') {
        const _0x16a431 = await getAntiBadword(_0x4d7277, 'on');
        if (_0x16a431?.['enabled']) {
            return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x4d7277, 'on', 'delete');
        return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x37325a });
    }
    if (_0x663c80 === 'off') {
        const _0x3b5c23 = await getAntiBadword(_0x4d7277, 'on');
        if (!_0x3b5c23?.['enabled']) {
            return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x37325a });
        }
        await removeAntiBadword(_0x4d7277);
        return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x37325a });
    }
    if (_0x663c80['startsWith']('set')) {
        const _0x46a1a9 = _0x663c80['split']('\x20')[0x1];
        if (!_0x46a1a9 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x46a1a9)) {
            return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x37325a });
        }
        await setAntiBadword(_0x4d7277, 'on', _0x46a1a9);
        return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x46a1a9 + '*' }, { 'quoted': _0x37325a });
    }
    return _0x128f49['sendMessage'](_0x4d7277, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x37325a });
}
async function handleBadwordDetection(_0x15d685, _0x11b6b6, _0x37aa17, _0x56c7d6, _0x35930f) {
    const _0x2a0a47 = await loadAntibadwordConfig(_0x11b6b6);
    if (!_0x2a0a47['enabled'])
        return;
    if (!_0x11b6b6['endsWith']('@g.us'))
        return;
    if (_0x37aa17['key']['fromMe'])
        return;
    const _0x4efe08 = await getAntiBadword(_0x11b6b6, 'on');
    if (!_0x4efe08?.['enabled']) {
        return;
    }
    const _0x40fed5 = _0x56c7d6['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x32525c = [
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
    const _0xe65ae7 = _0x40fed5['split']('\x20');
    let _0x3efa9e = ![];
    for (const _0x4b4e8a of _0xe65ae7) {
        if (_0x4b4e8a['length'] < 0x2)
            continue;
        if (_0x32525c['includes'](_0x4b4e8a)) {
            _0x3efa9e = !![];
            break;
        }
        for (const _0x1d6787 of _0x32525c) {
            if (_0x1d6787['includes']('\x20')) {
                if (_0x40fed5['includes'](_0x1d6787)) {
                    _0x3efa9e = !![];
                    break;
                }
            }
        }
        if (_0x3efa9e)
            break;
    }
    if (!_0x3efa9e)
        return;
    const _0x192ec9 = await _0x15d685['groupMetadata'](_0x11b6b6);
    const _0x411be4 = _0x15d685['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x1979dd = _0x192ec9['participants']['find'](_0x5269ee => _0x5269ee['id'] === _0x411be4);
    if (!_0x1979dd?.['admin']) {
        return;
    }
    const _0x15a9f1 = _0x192ec9['participants']['find'](_0x140734 => _0x140734['id'] === _0x35930f);
    if (_0x15a9f1?.['admin']) {
        return;
    }
    try {
        await _0x15d685['sendMessage'](_0x11b6b6, { 'delete': _0x37aa17['key'] });
    } catch (_0x3034db) {
        console['error']('Error\x20deleting\x20message:', _0x3034db);
        return;
    }
    switch (_0x4efe08['action']) {
    case 'delete':
        await _0x15d685['sendMessage'](_0x11b6b6, {
            'text': '*@' + _0x35930f['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x35930f]
        });
        break;
    case 'kick':
        try {
            await _0x15d685['groupParticipantsUpdate'](_0x11b6b6, [_0x35930f], 'remove');
            await _0x15d685['sendMessage'](_0x11b6b6, {
                'text': '*@' + _0x35930f['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x35930f]
            });
        } catch (_0x4b7e7c) {
            console['error']('Error\x20kicking\x20user:', _0x4b7e7c);
        }
        break;
    case 'warn': {
            const _0x57acbe = await incrementWarningCount(_0x11b6b6, _0x35930f);
            if (_0x57acbe >= 0x3) {
                try {
                    await _0x15d685['groupParticipantsUpdate'](_0x11b6b6, [_0x35930f], 'remove');
                    await resetWarningCount(_0x11b6b6, _0x35930f);
                    await _0x15d685['sendMessage'](_0x11b6b6, {
                        'text': '*@' + _0x35930f['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x35930f]
                    });
                } catch (_0x21c438) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x21c438);
                }
            } else {
                await _0x15d685['sendMessage'](_0x11b6b6, {
                    'text': '*@' + _0x35930f['split']('@')[0x0] + '\x20warning\x20' + _0x57acbe + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x35930f]
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