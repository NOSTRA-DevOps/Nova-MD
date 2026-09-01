import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x48056b from './lightweight_store.js';
import _0x0_0x2c725d from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x19c1e2) {
    try {
        if (HAS_DB) {
            const _0x4ea3cc = await _0x0_0x48056b['getSetting'](_0x19c1e2, 'antibadword');
            return _0x4ea3cc || {};
        } else {
            const _0x39c5f2 = dataFile('userGroupData.json');
            if (!_0x0_0x2c725d['existsSync'](_0x39c5f2)) {
                return {};
            }
            const _0x21e919 = JSON['parse'](_0x0_0x2c725d['readFileSync'](_0x39c5f2, 'utf-8')['toString']());
            return _0x21e919['antibadword']?.[_0x19c1e2] || {};
        }
    } catch (_0x2ee430) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x2ee430['message']);
        return {};
    }
}
async function setAntiBadword(_0x5efd5f, _0xb37c5d, _0x4d1948) {
    try {
        await _0x0_0x48056b['saveSetting'](_0x5efd5f, 'antibadword', {
            'enabled': !![],
            'action': _0x4d1948,
            'type': _0xb37c5d
        });
        return !![];
    } catch (_0x39b367) {
        console['error']('Error\x20setting\x20antibadword:', _0x39b367);
        return ![];
    }
}
async function getAntiBadword(_0x418877, _0x36e1e2) {
    try {
        const _0x22eeb3 = await _0x0_0x48056b['getSetting'](_0x418877, 'antibadword');
        return _0x22eeb3 || null;
    } catch (_0x18fb57) {
        console['error']('Error\x20getting\x20antibadword:', _0x18fb57);
        return null;
    }
}
async function removeAntiBadword(_0x6e0b12) {
    try {
        await _0x0_0x48056b['saveSetting'](_0x6e0b12, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x3f5c3e) {
        console['error']('Error\x20removing\x20antibadword:', _0x3f5c3e);
        return ![];
    }
}
async function incrementWarningCount(_0x21db9f, _0x3da31a) {
    try {
        const _0x3a47a3 = 'antibadword_warnings';
        const _0x47b917 = await _0x0_0x48056b['getSetting'](_0x21db9f, _0x3a47a3) || {};
        if (!_0x47b917[_0x3da31a]) {
            _0x47b917[_0x3da31a] = 0x0;
        }
        _0x47b917[_0x3da31a]++;
        await _0x0_0x48056b['saveSetting'](_0x21db9f, _0x3a47a3, _0x47b917);
        return _0x47b917[_0x3da31a];
    } catch (_0xac963) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0xac963);
        return 0x0;
    }
}
async function resetWarningCount(_0x360786, _0x2fdd87) {
    try {
        const _0x24dabd = 'antibadword_warnings';
        const _0x19ebbc = await _0x0_0x48056b['getSetting'](_0x360786, _0x24dabd) || {};
        if (_0x19ebbc[_0x2fdd87]) {
            delete _0x19ebbc[_0x2fdd87];
            await _0x0_0x48056b['saveSetting'](_0x360786, _0x24dabd, _0x19ebbc);
        }
        return !![];
    } catch (_0x301612) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x301612);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x2cc02b, _0x368142, _0x5cd24f, _0x2af7ab) {
    if (!_0x2af7ab) {
        return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x5cd24f });
    }
    if (_0x2af7ab === 'on') {
        const _0x55b98f = await getAntiBadword(_0x368142, 'on');
        if (_0x55b98f?.['enabled']) {
            return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x368142, 'on', 'delete');
        return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x5cd24f });
    }
    if (_0x2af7ab === 'off') {
        const _0x2a28e0 = await getAntiBadword(_0x368142, 'on');
        if (!_0x2a28e0?.['enabled']) {
            return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x5cd24f });
        }
        await removeAntiBadword(_0x368142);
        return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x5cd24f });
    }
    if (_0x2af7ab['startsWith']('set')) {
        const _0x22ff46 = _0x2af7ab['split']('\x20')[0x1];
        if (!_0x22ff46 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x22ff46)) {
            return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x5cd24f });
        }
        await setAntiBadword(_0x368142, 'on', _0x22ff46);
        return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x22ff46 + '*' }, { 'quoted': _0x5cd24f });
    }
    return _0x2cc02b['sendMessage'](_0x368142, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x5cd24f });
}
async function handleBadwordDetection(_0x3b6b99, _0x59cd42, _0x3863e1, _0x1036b2, _0x3a6855) {
    const _0x5a6b09 = await loadAntibadwordConfig(_0x59cd42);
    if (!_0x5a6b09['enabled'])
        return;
    if (!_0x59cd42['endsWith']('@g.us'))
        return;
    if (_0x3863e1['key']['fromMe'])
        return;
    const _0x30c9f6 = await getAntiBadword(_0x59cd42, 'on');
    if (!_0x30c9f6?.['enabled']) {
        return;
    }
    const _0x26b3b3 = _0x1036b2['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x58c0b3 = [
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
    const _0x2c4578 = _0x26b3b3['split']('\x20');
    let _0x4e2341 = ![];
    for (const _0x4bbb48 of _0x2c4578) {
        if (_0x4bbb48['length'] < 0x2)
            continue;
        if (_0x58c0b3['includes'](_0x4bbb48)) {
            _0x4e2341 = !![];
            break;
        }
        for (const _0xcc0483 of _0x58c0b3) {
            if (_0xcc0483['includes']('\x20')) {
                if (_0x26b3b3['includes'](_0xcc0483)) {
                    _0x4e2341 = !![];
                    break;
                }
            }
        }
        if (_0x4e2341)
            break;
    }
    if (!_0x4e2341)
        return;
    const _0x1791d4 = await _0x3b6b99['groupMetadata'](_0x59cd42);
    const _0x27098a = _0x3b6b99['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x381d9e = _0x1791d4['participants']['find'](_0x5ba192 => _0x5ba192['id'] === _0x27098a);
    if (!_0x381d9e?.['admin']) {
        return;
    }
    const _0x19218b = _0x1791d4['participants']['find'](_0x44ed37 => _0x44ed37['id'] === _0x3a6855);
    if (_0x19218b?.['admin']) {
        return;
    }
    try {
        await _0x3b6b99['sendMessage'](_0x59cd42, { 'delete': _0x3863e1['key'] });
    } catch (_0x14d7d5) {
        console['error']('Error\x20deleting\x20message:', _0x14d7d5);
        return;
    }
    switch (_0x30c9f6['action']) {
    case 'delete':
        await _0x3b6b99['sendMessage'](_0x59cd42, {
            'text': '*@' + _0x3a6855['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x3a6855]
        });
        break;
    case 'kick':
        try {
            await _0x3b6b99['groupParticipantsUpdate'](_0x59cd42, [_0x3a6855], 'remove');
            await _0x3b6b99['sendMessage'](_0x59cd42, {
                'text': '*@' + _0x3a6855['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x3a6855]
            });
        } catch (_0x467b1f) {
            console['error']('Error\x20kicking\x20user:', _0x467b1f);
        }
        break;
    case 'warn': {
            const _0x2222df = await incrementWarningCount(_0x59cd42, _0x3a6855);
            if (_0x2222df >= 0x3) {
                try {
                    await _0x3b6b99['groupParticipantsUpdate'](_0x59cd42, [_0x3a6855], 'remove');
                    await resetWarningCount(_0x59cd42, _0x3a6855);
                    await _0x3b6b99['sendMessage'](_0x59cd42, {
                        'text': '*@' + _0x3a6855['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x3a6855]
                    });
                } catch (_0x209f61) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x209f61);
                }
            } else {
                await _0x3b6b99['sendMessage'](_0x59cd42, {
                    'text': '*@' + _0x3a6855['split']('@')[0x0] + '\x20warning\x20' + _0x2222df + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x3a6855]
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