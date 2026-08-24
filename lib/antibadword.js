import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1711fc from './lightweight_store.js';
import _0x0_0xf6d9a6 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x1f2d86) {
    try {
        if (HAS_DB) {
            const _0x3161f6 = await _0x0_0x1711fc['getSetting'](_0x1f2d86, 'antibadword');
            return _0x3161f6 || {};
        } else {
            const _0x2c7bb2 = dataFile('userGroupData.json');
            if (!_0x0_0xf6d9a6['existsSync'](_0x2c7bb2)) {
                return {};
            }
            const _0x396a85 = JSON['parse'](_0x0_0xf6d9a6['readFileSync'](_0x2c7bb2, 'utf-8')['toString']());
            return _0x396a85['antibadword']?.[_0x1f2d86] || {};
        }
    } catch (_0x425769) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x425769['message']);
        return {};
    }
}
async function setAntiBadword(_0x119ba5, _0xe68d83, _0x1ba373) {
    try {
        await _0x0_0x1711fc['saveSetting'](_0x119ba5, 'antibadword', {
            'enabled': !![],
            'action': _0x1ba373,
            'type': _0xe68d83
        });
        return !![];
    } catch (_0x4b69d0) {
        console['error']('Error\x20setting\x20antibadword:', _0x4b69d0);
        return ![];
    }
}
async function getAntiBadword(_0x42ec97, _0x5e2eda) {
    try {
        const _0x3457d9 = await _0x0_0x1711fc['getSetting'](_0x42ec97, 'antibadword');
        return _0x3457d9 || null;
    } catch (_0x5ad056) {
        console['error']('Error\x20getting\x20antibadword:', _0x5ad056);
        return null;
    }
}
async function removeAntiBadword(_0x5f50f4) {
    try {
        await _0x0_0x1711fc['saveSetting'](_0x5f50f4, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x1c947b) {
        console['error']('Error\x20removing\x20antibadword:', _0x1c947b);
        return ![];
    }
}
async function incrementWarningCount(_0x4b39b5, _0x12398f) {
    try {
        const _0x3037f2 = 'antibadword_warnings';
        const _0x360dfe = await _0x0_0x1711fc['getSetting'](_0x4b39b5, _0x3037f2) || {};
        if (!_0x360dfe[_0x12398f]) {
            _0x360dfe[_0x12398f] = 0x0;
        }
        _0x360dfe[_0x12398f]++;
        await _0x0_0x1711fc['saveSetting'](_0x4b39b5, _0x3037f2, _0x360dfe);
        return _0x360dfe[_0x12398f];
    } catch (_0x5cdb1c) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x5cdb1c);
        return 0x0;
    }
}
async function resetWarningCount(_0x3eb9d3, _0x1a6a22) {
    try {
        const _0x30593c = 'antibadword_warnings';
        const _0x35fab8 = await _0x0_0x1711fc['getSetting'](_0x3eb9d3, _0x30593c) || {};
        if (_0x35fab8[_0x1a6a22]) {
            delete _0x35fab8[_0x1a6a22];
            await _0x0_0x1711fc['saveSetting'](_0x3eb9d3, _0x30593c, _0x35fab8);
        }
        return !![];
    } catch (_0x517809) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x517809);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x54c868, _0x1c6de8, _0x20af6a, _0x389d9e) {
    if (!_0x389d9e) {
        return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x20af6a });
    }
    if (_0x389d9e === 'on') {
        const _0x38448f = await getAntiBadword(_0x1c6de8, 'on');
        if (_0x38448f?.['enabled']) {
            return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x1c6de8, 'on', 'delete');
        return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x20af6a });
    }
    if (_0x389d9e === 'off') {
        const _0x31a8ba = await getAntiBadword(_0x1c6de8, 'on');
        if (!_0x31a8ba?.['enabled']) {
            return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x20af6a });
        }
        await removeAntiBadword(_0x1c6de8);
        return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x20af6a });
    }
    if (_0x389d9e['startsWith']('set')) {
        const _0x2386d0 = _0x389d9e['split']('\x20')[0x1];
        if (!_0x2386d0 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x2386d0)) {
            return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x20af6a });
        }
        await setAntiBadword(_0x1c6de8, 'on', _0x2386d0);
        return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x2386d0 + '*' }, { 'quoted': _0x20af6a });
    }
    return _0x54c868['sendMessage'](_0x1c6de8, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x20af6a });
}
async function handleBadwordDetection(_0x1587dc, _0x14e07c, _0x11deb5, _0x316dc5, _0x142961) {
    const _0x3f77c4 = await loadAntibadwordConfig(_0x14e07c);
    if (!_0x3f77c4['enabled'])
        return;
    if (!_0x14e07c['endsWith']('@g.us'))
        return;
    if (_0x11deb5['key']['fromMe'])
        return;
    const _0x56c5ae = await getAntiBadword(_0x14e07c, 'on');
    if (!_0x56c5ae?.['enabled']) {
        return;
    }
    const _0x7095f2 = _0x316dc5['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x3f3e08 = [
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
    const _0x37e779 = _0x7095f2['split']('\x20');
    let _0x4a2184 = ![];
    for (const _0x3db025 of _0x37e779) {
        if (_0x3db025['length'] < 0x2)
            continue;
        if (_0x3f3e08['includes'](_0x3db025)) {
            _0x4a2184 = !![];
            break;
        }
        for (const _0x1eca3d of _0x3f3e08) {
            if (_0x1eca3d['includes']('\x20')) {
                if (_0x7095f2['includes'](_0x1eca3d)) {
                    _0x4a2184 = !![];
                    break;
                }
            }
        }
        if (_0x4a2184)
            break;
    }
    if (!_0x4a2184)
        return;
    const _0x47b90d = await _0x1587dc['groupMetadata'](_0x14e07c);
    const _0x59904a = _0x1587dc['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x22d706 = _0x47b90d['participants']['find'](_0x28b40b => _0x28b40b['id'] === _0x59904a);
    if (!_0x22d706?.['admin']) {
        return;
    }
    const _0x4c6dac = _0x47b90d['participants']['find'](_0x3ab399 => _0x3ab399['id'] === _0x142961);
    if (_0x4c6dac?.['admin']) {
        return;
    }
    try {
        await _0x1587dc['sendMessage'](_0x14e07c, { 'delete': _0x11deb5['key'] });
    } catch (_0x3f9525) {
        console['error']('Error\x20deleting\x20message:', _0x3f9525);
        return;
    }
    switch (_0x56c5ae['action']) {
    case 'delete':
        await _0x1587dc['sendMessage'](_0x14e07c, {
            'text': '*@' + _0x142961['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x142961]
        });
        break;
    case 'kick':
        try {
            await _0x1587dc['groupParticipantsUpdate'](_0x14e07c, [_0x142961], 'remove');
            await _0x1587dc['sendMessage'](_0x14e07c, {
                'text': '*@' + _0x142961['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x142961]
            });
        } catch (_0x3530f6) {
            console['error']('Error\x20kicking\x20user:', _0x3530f6);
        }
        break;
    case 'warn': {
            const _0x1f274d = await incrementWarningCount(_0x14e07c, _0x142961);
            if (_0x1f274d >= 0x3) {
                try {
                    await _0x1587dc['groupParticipantsUpdate'](_0x14e07c, [_0x142961], 'remove');
                    await resetWarningCount(_0x14e07c, _0x142961);
                    await _0x1587dc['sendMessage'](_0x14e07c, {
                        'text': '*@' + _0x142961['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x142961]
                    });
                } catch (_0xfc1639) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0xfc1639);
                }
            } else {
                await _0x1587dc['sendMessage'](_0x14e07c, {
                    'text': '*@' + _0x142961['split']('@')[0x0] + '\x20warning\x20' + _0x1f274d + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x142961]
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