import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4c84c7 from './lightweight_store.js';
import _0x0_0x250f1a from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x5742f0) {
    try {
        if (HAS_DB) {
            const _0xb19b9e = await _0x0_0x4c84c7['getSetting'](_0x5742f0, 'antibadword');
            return _0xb19b9e || {};
        } else {
            const _0x285b4f = dataFile('userGroupData.json');
            if (!_0x0_0x250f1a['existsSync'](_0x285b4f)) {
                return {};
            }
            const _0x1c56f7 = JSON['parse'](_0x0_0x250f1a['readFileSync'](_0x285b4f, 'utf-8')['toString']());
            return _0x1c56f7['antibadword']?.[_0x5742f0] || {};
        }
    } catch (_0x548348) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x548348['message']);
        return {};
    }
}
async function setAntiBadword(_0x5e8f88, _0x1dd154, _0x4df8c3) {
    try {
        await _0x0_0x4c84c7['saveSetting'](_0x5e8f88, 'antibadword', {
            'enabled': !![],
            'action': _0x4df8c3,
            'type': _0x1dd154
        });
        return !![];
    } catch (_0x73eccd) {
        console['error']('Error\x20setting\x20antibadword:', _0x73eccd);
        return ![];
    }
}
async function getAntiBadword(_0x5ad418, _0x473f4f) {
    try {
        const _0x27b696 = await _0x0_0x4c84c7['getSetting'](_0x5ad418, 'antibadword');
        return _0x27b696 || null;
    } catch (_0x56a8a3) {
        console['error']('Error\x20getting\x20antibadword:', _0x56a8a3);
        return null;
    }
}
async function removeAntiBadword(_0x27fb83) {
    try {
        await _0x0_0x4c84c7['saveSetting'](_0x27fb83, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x39b85f) {
        console['error']('Error\x20removing\x20antibadword:', _0x39b85f);
        return ![];
    }
}
async function incrementWarningCount(_0x14ae70, _0x45b5e6) {
    try {
        const _0x4d3675 = 'antibadword_warnings';
        const _0x925539 = await _0x0_0x4c84c7['getSetting'](_0x14ae70, _0x4d3675) || {};
        if (!_0x925539[_0x45b5e6]) {
            _0x925539[_0x45b5e6] = 0x0;
        }
        _0x925539[_0x45b5e6]++;
        await _0x0_0x4c84c7['saveSetting'](_0x14ae70, _0x4d3675, _0x925539);
        return _0x925539[_0x45b5e6];
    } catch (_0x2baa58) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x2baa58);
        return 0x0;
    }
}
async function resetWarningCount(_0x349f50, _0x1f9c60) {
    try {
        const _0x56eed6 = 'antibadword_warnings';
        const _0x58e7b4 = await _0x0_0x4c84c7['getSetting'](_0x349f50, _0x56eed6) || {};
        if (_0x58e7b4[_0x1f9c60]) {
            delete _0x58e7b4[_0x1f9c60];
            await _0x0_0x4c84c7['saveSetting'](_0x349f50, _0x56eed6, _0x58e7b4);
        }
        return !![];
    } catch (_0x3baa3a) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x3baa3a);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x12da37, _0xac7cb6, _0x27fc52, _0x3032bc) {
    if (!_0x3032bc) {
        return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x27fc52 });
    }
    if (_0x3032bc === 'on') {
        const _0x39fff2 = await getAntiBadword(_0xac7cb6, 'on');
        if (_0x39fff2?.['enabled']) {
            return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0xac7cb6, 'on', 'delete');
        return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x27fc52 });
    }
    if (_0x3032bc === 'off') {
        const _0x39a870 = await getAntiBadword(_0xac7cb6, 'on');
        if (!_0x39a870?.['enabled']) {
            return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x27fc52 });
        }
        await removeAntiBadword(_0xac7cb6);
        return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x27fc52 });
    }
    if (_0x3032bc['startsWith']('set')) {
        const _0x499a1c = _0x3032bc['split']('\x20')[0x1];
        if (!_0x499a1c || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x499a1c)) {
            return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x27fc52 });
        }
        await setAntiBadword(_0xac7cb6, 'on', _0x499a1c);
        return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x499a1c + '*' }, { 'quoted': _0x27fc52 });
    }
    return _0x12da37['sendMessage'](_0xac7cb6, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x27fc52 });
}
async function handleBadwordDetection(_0x386b50, _0x172bf7, _0x3f17bc, _0x567da9, _0x378ef1) {
    const _0x3c2534 = await loadAntibadwordConfig(_0x172bf7);
    if (!_0x3c2534['enabled'])
        return;
    if (!_0x172bf7['endsWith']('@g.us'))
        return;
    if (_0x3f17bc['key']['fromMe'])
        return;
    const _0x1a9e83 = await getAntiBadword(_0x172bf7, 'on');
    if (!_0x1a9e83?.['enabled']) {
        return;
    }
    const _0x473869 = _0x567da9['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x10a735 = [
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
    const _0x205401 = _0x473869['split']('\x20');
    let _0x4b9fca = ![];
    for (const _0x5bc1b5 of _0x205401) {
        if (_0x5bc1b5['length'] < 0x2)
            continue;
        if (_0x10a735['includes'](_0x5bc1b5)) {
            _0x4b9fca = !![];
            break;
        }
        for (const _0x19192b of _0x10a735) {
            if (_0x19192b['includes']('\x20')) {
                if (_0x473869['includes'](_0x19192b)) {
                    _0x4b9fca = !![];
                    break;
                }
            }
        }
        if (_0x4b9fca)
            break;
    }
    if (!_0x4b9fca)
        return;
    const _0x5215f4 = await _0x386b50['groupMetadata'](_0x172bf7);
    const _0x182572 = _0x386b50['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x52cbae = _0x5215f4['participants']['find'](_0x4d44ab => _0x4d44ab['id'] === _0x182572);
    if (!_0x52cbae?.['admin']) {
        return;
    }
    const _0x57188e = _0x5215f4['participants']['find'](_0x3b82f4 => _0x3b82f4['id'] === _0x378ef1);
    if (_0x57188e?.['admin']) {
        return;
    }
    try {
        await _0x386b50['sendMessage'](_0x172bf7, { 'delete': _0x3f17bc['key'] });
    } catch (_0x4d22dd) {
        console['error']('Error\x20deleting\x20message:', _0x4d22dd);
        return;
    }
    switch (_0x1a9e83['action']) {
    case 'delete':
        await _0x386b50['sendMessage'](_0x172bf7, {
            'text': '*@' + _0x378ef1['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x378ef1]
        });
        break;
    case 'kick':
        try {
            await _0x386b50['groupParticipantsUpdate'](_0x172bf7, [_0x378ef1], 'remove');
            await _0x386b50['sendMessage'](_0x172bf7, {
                'text': '*@' + _0x378ef1['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x378ef1]
            });
        } catch (_0x4df2ef) {
            console['error']('Error\x20kicking\x20user:', _0x4df2ef);
        }
        break;
    case 'warn': {
            const _0x4cc675 = await incrementWarningCount(_0x172bf7, _0x378ef1);
            if (_0x4cc675 >= 0x3) {
                try {
                    await _0x386b50['groupParticipantsUpdate'](_0x172bf7, [_0x378ef1], 'remove');
                    await resetWarningCount(_0x172bf7, _0x378ef1);
                    await _0x386b50['sendMessage'](_0x172bf7, {
                        'text': '*@' + _0x378ef1['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x378ef1]
                    });
                } catch (_0x59a09d) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x59a09d);
                }
            } else {
                await _0x386b50['sendMessage'](_0x172bf7, {
                    'text': '*@' + _0x378ef1['split']('@')[0x0] + '\x20warning\x20' + _0x4cc675 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x378ef1]
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