import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x377260 from './lightweight_store.js';
import _0x0_0x20a479 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x4dfe1c) {
    try {
        if (HAS_DB) {
            const _0x3bc30f = await _0x0_0x377260['getSetting'](_0x4dfe1c, 'antibadword');
            return _0x3bc30f || {};
        } else {
            const _0x3477b0 = dataFile('userGroupData.json');
            if (!_0x0_0x20a479['existsSync'](_0x3477b0)) {
                return {};
            }
            const _0x5b2477 = JSON['parse'](_0x0_0x20a479['readFileSync'](_0x3477b0, 'utf-8')['toString']());
            return _0x5b2477['antibadword']?.[_0x4dfe1c] || {};
        }
    } catch (_0x3a3bfb) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x3a3bfb['message']);
        return {};
    }
}
async function setAntiBadword(_0x2fbf16, _0x2102c7, _0x5acb7f) {
    try {
        await _0x0_0x377260['saveSetting'](_0x2fbf16, 'antibadword', {
            'enabled': !![],
            'action': _0x5acb7f,
            'type': _0x2102c7
        });
        return !![];
    } catch (_0x381ce9) {
        console['error']('Error\x20setting\x20antibadword:', _0x381ce9);
        return ![];
    }
}
async function getAntiBadword(_0x353976, _0x50fef6) {
    try {
        const _0x3a5dc8 = await _0x0_0x377260['getSetting'](_0x353976, 'antibadword');
        return _0x3a5dc8 || null;
    } catch (_0x566422) {
        console['error']('Error\x20getting\x20antibadword:', _0x566422);
        return null;
    }
}
async function removeAntiBadword(_0x98f215) {
    try {
        await _0x0_0x377260['saveSetting'](_0x98f215, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x4ee5af) {
        console['error']('Error\x20removing\x20antibadword:', _0x4ee5af);
        return ![];
    }
}
async function incrementWarningCount(_0xc3e4ec, _0x59949a) {
    try {
        const _0x12b2f8 = 'antibadword_warnings';
        const _0x4574b4 = await _0x0_0x377260['getSetting'](_0xc3e4ec, _0x12b2f8) || {};
        if (!_0x4574b4[_0x59949a]) {
            _0x4574b4[_0x59949a] = 0x0;
        }
        _0x4574b4[_0x59949a]++;
        await _0x0_0x377260['saveSetting'](_0xc3e4ec, _0x12b2f8, _0x4574b4);
        return _0x4574b4[_0x59949a];
    } catch (_0x10ab6a) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x10ab6a);
        return 0x0;
    }
}
async function resetWarningCount(_0x3e635c, _0x271edf) {
    try {
        const _0x747613 = 'antibadword_warnings';
        const _0x58fc6e = await _0x0_0x377260['getSetting'](_0x3e635c, _0x747613) || {};
        if (_0x58fc6e[_0x271edf]) {
            delete _0x58fc6e[_0x271edf];
            await _0x0_0x377260['saveSetting'](_0x3e635c, _0x747613, _0x58fc6e);
        }
        return !![];
    } catch (_0x4cf395) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x4cf395);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0xbeee60, _0x972bea, _0x5510e8, _0x209fb4) {
    if (!_0x209fb4) {
        return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x5510e8 });
    }
    if (_0x209fb4 === 'on') {
        const _0x476293 = await getAntiBadword(_0x972bea, 'on');
        if (_0x476293?.['enabled']) {
            return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x972bea, 'on', 'delete');
        return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x5510e8 });
    }
    if (_0x209fb4 === 'off') {
        const _0xeb571e = await getAntiBadword(_0x972bea, 'on');
        if (!_0xeb571e?.['enabled']) {
            return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x5510e8 });
        }
        await removeAntiBadword(_0x972bea);
        return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x5510e8 });
    }
    if (_0x209fb4['startsWith']('set')) {
        const _0x17b9dd = _0x209fb4['split']('\x20')[0x1];
        if (!_0x17b9dd || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x17b9dd)) {
            return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x5510e8 });
        }
        await setAntiBadword(_0x972bea, 'on', _0x17b9dd);
        return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x17b9dd + '*' }, { 'quoted': _0x5510e8 });
    }
    return _0xbeee60['sendMessage'](_0x972bea, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x5510e8 });
}
async function handleBadwordDetection(_0x1070ec, _0x14873a, _0x3453b4, _0x386248, _0x10e6cb) {
    const _0x25d362 = await loadAntibadwordConfig(_0x14873a);
    if (!_0x25d362['enabled'])
        return;
    if (!_0x14873a['endsWith']('@g.us'))
        return;
    if (_0x3453b4['key']['fromMe'])
        return;
    const _0x236192 = await getAntiBadword(_0x14873a, 'on');
    if (!_0x236192?.['enabled']) {
        return;
    }
    const _0x555131 = _0x386248['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x1379a0 = [
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
    const _0x189cfc = _0x555131['split']('\x20');
    let _0xaeb0b5 = ![];
    for (const _0x478561 of _0x189cfc) {
        if (_0x478561['length'] < 0x2)
            continue;
        if (_0x1379a0['includes'](_0x478561)) {
            _0xaeb0b5 = !![];
            break;
        }
        for (const _0x127a02 of _0x1379a0) {
            if (_0x127a02['includes']('\x20')) {
                if (_0x555131['includes'](_0x127a02)) {
                    _0xaeb0b5 = !![];
                    break;
                }
            }
        }
        if (_0xaeb0b5)
            break;
    }
    if (!_0xaeb0b5)
        return;
    const _0x5de98a = await _0x1070ec['groupMetadata'](_0x14873a);
    const _0x5ebfea = _0x1070ec['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x14342d = _0x5de98a['participants']['find'](_0x2cc30a => _0x2cc30a['id'] === _0x5ebfea);
    if (!_0x14342d?.['admin']) {
        return;
    }
    const _0x2b3287 = _0x5de98a['participants']['find'](_0x1ce97f => _0x1ce97f['id'] === _0x10e6cb);
    if (_0x2b3287?.['admin']) {
        return;
    }
    try {
        await _0x1070ec['sendMessage'](_0x14873a, { 'delete': _0x3453b4['key'] });
    } catch (_0x58944b) {
        console['error']('Error\x20deleting\x20message:', _0x58944b);
        return;
    }
    switch (_0x236192['action']) {
    case 'delete':
        await _0x1070ec['sendMessage'](_0x14873a, {
            'text': '*@' + _0x10e6cb['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x10e6cb]
        });
        break;
    case 'kick':
        try {
            await _0x1070ec['groupParticipantsUpdate'](_0x14873a, [_0x10e6cb], 'remove');
            await _0x1070ec['sendMessage'](_0x14873a, {
                'text': '*@' + _0x10e6cb['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x10e6cb]
            });
        } catch (_0x515d9e) {
            console['error']('Error\x20kicking\x20user:', _0x515d9e);
        }
        break;
    case 'warn': {
            const _0x16dad8 = await incrementWarningCount(_0x14873a, _0x10e6cb);
            if (_0x16dad8 >= 0x3) {
                try {
                    await _0x1070ec['groupParticipantsUpdate'](_0x14873a, [_0x10e6cb], 'remove');
                    await resetWarningCount(_0x14873a, _0x10e6cb);
                    await _0x1070ec['sendMessage'](_0x14873a, {
                        'text': '*@' + _0x10e6cb['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x10e6cb]
                    });
                } catch (_0x437244) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x437244);
                }
            } else {
                await _0x1070ec['sendMessage'](_0x14873a, {
                    'text': '*@' + _0x10e6cb['split']('@')[0x0] + '\x20warning\x20' + _0x16dad8 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x10e6cb]
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