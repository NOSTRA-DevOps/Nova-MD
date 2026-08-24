import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x592a57 from './lightweight_store.js';
import _0x0_0x30b8c8 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x478b2d) {
    try {
        if (HAS_DB) {
            const _0x1488c4 = await _0x0_0x592a57['getSetting'](_0x478b2d, 'antibadword');
            return _0x1488c4 || {};
        } else {
            const _0x5036d4 = dataFile('userGroupData.json');
            if (!_0x0_0x30b8c8['existsSync'](_0x5036d4)) {
                return {};
            }
            const _0x1e742f = JSON['parse'](_0x0_0x30b8c8['readFileSync'](_0x5036d4, 'utf-8')['toString']());
            return _0x1e742f['antibadword']?.[_0x478b2d] || {};
        }
    } catch (_0x3a7429) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x3a7429['message']);
        return {};
    }
}
async function setAntiBadword(_0x3ff60e, _0x24f87b, _0x31b300) {
    try {
        await _0x0_0x592a57['saveSetting'](_0x3ff60e, 'antibadword', {
            'enabled': !![],
            'action': _0x31b300,
            'type': _0x24f87b
        });
        return !![];
    } catch (_0x4689c3) {
        console['error']('Error\x20setting\x20antibadword:', _0x4689c3);
        return ![];
    }
}
async function getAntiBadword(_0x37d2c3, _0x2b9679) {
    try {
        const _0x49c8c6 = await _0x0_0x592a57['getSetting'](_0x37d2c3, 'antibadword');
        return _0x49c8c6 || null;
    } catch (_0x47845b) {
        console['error']('Error\x20getting\x20antibadword:', _0x47845b);
        return null;
    }
}
async function removeAntiBadword(_0x2f47e5) {
    try {
        await _0x0_0x592a57['saveSetting'](_0x2f47e5, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x487d9e) {
        console['error']('Error\x20removing\x20antibadword:', _0x487d9e);
        return ![];
    }
}
async function incrementWarningCount(_0x5286c4, _0x5a8266) {
    try {
        const _0x3db4fc = 'antibadword_warnings';
        const _0x2041c = await _0x0_0x592a57['getSetting'](_0x5286c4, _0x3db4fc) || {};
        if (!_0x2041c[_0x5a8266]) {
            _0x2041c[_0x5a8266] = 0x0;
        }
        _0x2041c[_0x5a8266]++;
        await _0x0_0x592a57['saveSetting'](_0x5286c4, _0x3db4fc, _0x2041c);
        return _0x2041c[_0x5a8266];
    } catch (_0x1a2248) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x1a2248);
        return 0x0;
    }
}
async function resetWarningCount(_0x59a228, _0x2358ba) {
    try {
        const _0xf4c494 = 'antibadword_warnings';
        const _0x1568f5 = await _0x0_0x592a57['getSetting'](_0x59a228, _0xf4c494) || {};
        if (_0x1568f5[_0x2358ba]) {
            delete _0x1568f5[_0x2358ba];
            await _0x0_0x592a57['saveSetting'](_0x59a228, _0xf4c494, _0x1568f5);
        }
        return !![];
    } catch (_0x3b91e3) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x3b91e3);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x3ec3e3, _0x57b089, _0x533df1, _0x18560c) {
    if (!_0x18560c) {
        return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x533df1 });
    }
    if (_0x18560c === 'on') {
        const _0x51d56c = await getAntiBadword(_0x57b089, 'on');
        if (_0x51d56c?.['enabled']) {
            return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x57b089, 'on', 'delete');
        return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x533df1 });
    }
    if (_0x18560c === 'off') {
        const _0x43b67e = await getAntiBadword(_0x57b089, 'on');
        if (!_0x43b67e?.['enabled']) {
            return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x533df1 });
        }
        await removeAntiBadword(_0x57b089);
        return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x533df1 });
    }
    if (_0x18560c['startsWith']('set')) {
        const _0x4a77ae = _0x18560c['split']('\x20')[0x1];
        if (!_0x4a77ae || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x4a77ae)) {
            return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x533df1 });
        }
        await setAntiBadword(_0x57b089, 'on', _0x4a77ae);
        return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x4a77ae + '*' }, { 'quoted': _0x533df1 });
    }
    return _0x3ec3e3['sendMessage'](_0x57b089, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x533df1 });
}
async function handleBadwordDetection(_0x396ba2, _0x40975b, _0x159ab9, _0x112bf9, _0x43d235) {
    const _0x1cf3dc = await loadAntibadwordConfig(_0x40975b);
    if (!_0x1cf3dc['enabled'])
        return;
    if (!_0x40975b['endsWith']('@g.us'))
        return;
    if (_0x159ab9['key']['fromMe'])
        return;
    const _0x593573 = await getAntiBadword(_0x40975b, 'on');
    if (!_0x593573?.['enabled']) {
        return;
    }
    const _0x29bdcc = _0x112bf9['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x3b7d61 = [
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
    const _0x48a552 = _0x29bdcc['split']('\x20');
    let _0x8bd5db = ![];
    for (const _0x26eb07 of _0x48a552) {
        if (_0x26eb07['length'] < 0x2)
            continue;
        if (_0x3b7d61['includes'](_0x26eb07)) {
            _0x8bd5db = !![];
            break;
        }
        for (const _0x3a0b96 of _0x3b7d61) {
            if (_0x3a0b96['includes']('\x20')) {
                if (_0x29bdcc['includes'](_0x3a0b96)) {
                    _0x8bd5db = !![];
                    break;
                }
            }
        }
        if (_0x8bd5db)
            break;
    }
    if (!_0x8bd5db)
        return;
    const _0xb125fe = await _0x396ba2['groupMetadata'](_0x40975b);
    const _0x3489b8 = _0x396ba2['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0xd72ccf = _0xb125fe['participants']['find'](_0x4a3332 => _0x4a3332['id'] === _0x3489b8);
    if (!_0xd72ccf?.['admin']) {
        return;
    }
    const _0x4124e0 = _0xb125fe['participants']['find'](_0x2dc602 => _0x2dc602['id'] === _0x43d235);
    if (_0x4124e0?.['admin']) {
        return;
    }
    try {
        await _0x396ba2['sendMessage'](_0x40975b, { 'delete': _0x159ab9['key'] });
    } catch (_0xf62df8) {
        console['error']('Error\x20deleting\x20message:', _0xf62df8);
        return;
    }
    switch (_0x593573['action']) {
    case 'delete':
        await _0x396ba2['sendMessage'](_0x40975b, {
            'text': '*@' + _0x43d235['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x43d235]
        });
        break;
    case 'kick':
        try {
            await _0x396ba2['groupParticipantsUpdate'](_0x40975b, [_0x43d235], 'remove');
            await _0x396ba2['sendMessage'](_0x40975b, {
                'text': '*@' + _0x43d235['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x43d235]
            });
        } catch (_0x3b210a) {
            console['error']('Error\x20kicking\x20user:', _0x3b210a);
        }
        break;
    case 'warn': {
            const _0x15e752 = await incrementWarningCount(_0x40975b, _0x43d235);
            if (_0x15e752 >= 0x3) {
                try {
                    await _0x396ba2['groupParticipantsUpdate'](_0x40975b, [_0x43d235], 'remove');
                    await resetWarningCount(_0x40975b, _0x43d235);
                    await _0x396ba2['sendMessage'](_0x40975b, {
                        'text': '*@' + _0x43d235['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x43d235]
                    });
                } catch (_0x40708b) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x40708b);
                }
            } else {
                await _0x396ba2['sendMessage'](_0x40975b, {
                    'text': '*@' + _0x43d235['split']('@')[0x0] + '\x20warning\x20' + _0x15e752 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x43d235]
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