import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x562bc1 from './lightweight_store.js';
import _0x0_0x1ff652 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x244dce) {
    try {
        if (HAS_DB) {
            const _0x2d18e3 = await _0x0_0x562bc1['getSetting'](_0x244dce, 'antibadword');
            return _0x2d18e3 || {};
        } else {
            const _0x1f4720 = dataFile('userGroupData.json');
            if (!_0x0_0x1ff652['existsSync'](_0x1f4720)) {
                return {};
            }
            const _0x419c03 = JSON['parse'](_0x0_0x1ff652['readFileSync'](_0x1f4720, 'utf-8')['toString']());
            return _0x419c03['antibadword']?.[_0x244dce] || {};
        }
    } catch (_0x13bb81) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x13bb81['message']);
        return {};
    }
}
async function setAntiBadword(_0x1d28c8, _0x58d413, _0x5cf660) {
    try {
        await _0x0_0x562bc1['saveSetting'](_0x1d28c8, 'antibadword', {
            'enabled': !![],
            'action': _0x5cf660,
            'type': _0x58d413
        });
        return !![];
    } catch (_0x35d0a3) {
        console['error']('Error\x20setting\x20antibadword:', _0x35d0a3);
        return ![];
    }
}
async function getAntiBadword(_0x2202fe, _0x1e8a74) {
    try {
        const _0x3485a6 = await _0x0_0x562bc1['getSetting'](_0x2202fe, 'antibadword');
        return _0x3485a6 || null;
    } catch (_0x436743) {
        console['error']('Error\x20getting\x20antibadword:', _0x436743);
        return null;
    }
}
async function removeAntiBadword(_0x4945ae) {
    try {
        await _0x0_0x562bc1['saveSetting'](_0x4945ae, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x16e8ad) {
        console['error']('Error\x20removing\x20antibadword:', _0x16e8ad);
        return ![];
    }
}
async function incrementWarningCount(_0x1ec700, _0x3d88d1) {
    try {
        const _0x3546c2 = 'antibadword_warnings';
        const _0x46abf5 = await _0x0_0x562bc1['getSetting'](_0x1ec700, _0x3546c2) || {};
        if (!_0x46abf5[_0x3d88d1]) {
            _0x46abf5[_0x3d88d1] = 0x0;
        }
        _0x46abf5[_0x3d88d1]++;
        await _0x0_0x562bc1['saveSetting'](_0x1ec700, _0x3546c2, _0x46abf5);
        return _0x46abf5[_0x3d88d1];
    } catch (_0xb0794) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0xb0794);
        return 0x0;
    }
}
async function resetWarningCount(_0x41ef19, _0x108aad) {
    try {
        const _0x3d8f16 = 'antibadword_warnings';
        const _0x18cbba = await _0x0_0x562bc1['getSetting'](_0x41ef19, _0x3d8f16) || {};
        if (_0x18cbba[_0x108aad]) {
            delete _0x18cbba[_0x108aad];
            await _0x0_0x562bc1['saveSetting'](_0x41ef19, _0x3d8f16, _0x18cbba);
        }
        return !![];
    } catch (_0x2144e4) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x2144e4);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x618b0d, _0x5569fa, _0x33d130, _0x54dff5) {
    if (!_0x54dff5) {
        return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x33d130 });
    }
    if (_0x54dff5 === 'on') {
        const _0x3ce62a = await getAntiBadword(_0x5569fa, 'on');
        if (_0x3ce62a?.['enabled']) {
            return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x5569fa, 'on', 'delete');
        return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x33d130 });
    }
    if (_0x54dff5 === 'off') {
        const _0x4b6dbd = await getAntiBadword(_0x5569fa, 'on');
        if (!_0x4b6dbd?.['enabled']) {
            return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x33d130 });
        }
        await removeAntiBadword(_0x5569fa);
        return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x33d130 });
    }
    if (_0x54dff5['startsWith']('set')) {
        const _0x1f5f24 = _0x54dff5['split']('\x20')[0x1];
        if (!_0x1f5f24 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x1f5f24)) {
            return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x33d130 });
        }
        await setAntiBadword(_0x5569fa, 'on', _0x1f5f24);
        return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x1f5f24 + '*' }, { 'quoted': _0x33d130 });
    }
    return _0x618b0d['sendMessage'](_0x5569fa, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x33d130 });
}
async function handleBadwordDetection(_0x29ce37, _0x209ac9, _0x5de8fa, _0x546758, _0x186701) {
    const _0x714300 = await loadAntibadwordConfig(_0x209ac9);
    if (!_0x714300['enabled'])
        return;
    if (!_0x209ac9['endsWith']('@g.us'))
        return;
    if (_0x5de8fa['key']['fromMe'])
        return;
    const _0x4269d2 = await getAntiBadword(_0x209ac9, 'on');
    if (!_0x4269d2?.['enabled']) {
        return;
    }
    const _0x45bf49 = _0x546758['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x2655c5 = [
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
    const _0x3f4358 = _0x45bf49['split']('\x20');
    let _0x3419f0 = ![];
    for (const _0x23134d of _0x3f4358) {
        if (_0x23134d['length'] < 0x2)
            continue;
        if (_0x2655c5['includes'](_0x23134d)) {
            _0x3419f0 = !![];
            break;
        }
        for (const _0x367cf4 of _0x2655c5) {
            if (_0x367cf4['includes']('\x20')) {
                if (_0x45bf49['includes'](_0x367cf4)) {
                    _0x3419f0 = !![];
                    break;
                }
            }
        }
        if (_0x3419f0)
            break;
    }
    if (!_0x3419f0)
        return;
    const _0x233cbb = await _0x29ce37['groupMetadata'](_0x209ac9);
    const _0x45c928 = _0x29ce37['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x4c9adb = _0x233cbb['participants']['find'](_0x36ca7a => _0x36ca7a['id'] === _0x45c928);
    if (!_0x4c9adb?.['admin']) {
        return;
    }
    const _0x68e1fa = _0x233cbb['participants']['find'](_0x4b6ea9 => _0x4b6ea9['id'] === _0x186701);
    if (_0x68e1fa?.['admin']) {
        return;
    }
    try {
        await _0x29ce37['sendMessage'](_0x209ac9, { 'delete': _0x5de8fa['key'] });
    } catch (_0x3c4ecf) {
        console['error']('Error\x20deleting\x20message:', _0x3c4ecf);
        return;
    }
    switch (_0x4269d2['action']) {
    case 'delete':
        await _0x29ce37['sendMessage'](_0x209ac9, {
            'text': '*@' + _0x186701['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x186701]
        });
        break;
    case 'kick':
        try {
            await _0x29ce37['groupParticipantsUpdate'](_0x209ac9, [_0x186701], 'remove');
            await _0x29ce37['sendMessage'](_0x209ac9, {
                'text': '*@' + _0x186701['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x186701]
            });
        } catch (_0x3b2e5c) {
            console['error']('Error\x20kicking\x20user:', _0x3b2e5c);
        }
        break;
    case 'warn': {
            const _0x4fe9d4 = await incrementWarningCount(_0x209ac9, _0x186701);
            if (_0x4fe9d4 >= 0x3) {
                try {
                    await _0x29ce37['groupParticipantsUpdate'](_0x209ac9, [_0x186701], 'remove');
                    await resetWarningCount(_0x209ac9, _0x186701);
                    await _0x29ce37['sendMessage'](_0x209ac9, {
                        'text': '*@' + _0x186701['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x186701]
                    });
                } catch (_0x30da1c) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x30da1c);
                }
            } else {
                await _0x29ce37['sendMessage'](_0x209ac9, {
                    'text': '*@' + _0x186701['split']('@')[0x0] + '\x20warning\x20' + _0x4fe9d4 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x186701]
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