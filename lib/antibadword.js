import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1fa495 from './lightweight_store.js';
import _0x0_0x59db47 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x2eb5b1) {
    try {
        if (HAS_DB) {
            const _0x402915 = await _0x0_0x1fa495['getSetting'](_0x2eb5b1, 'antibadword');
            return _0x402915 || {};
        } else {
            const _0x530d76 = dataFile('userGroupData.json');
            if (!_0x0_0x59db47['existsSync'](_0x530d76)) {
                return {};
            }
            const _0x1e4129 = JSON['parse'](_0x0_0x59db47['readFileSync'](_0x530d76, 'utf-8')['toString']());
            return _0x1e4129['antibadword']?.[_0x2eb5b1] || {};
        }
    } catch (_0x1f5a25) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x1f5a25['message']);
        return {};
    }
}
async function setAntiBadword(_0x5ce7bd, _0x48b989, _0x8a0872) {
    try {
        await _0x0_0x1fa495['saveSetting'](_0x5ce7bd, 'antibadword', {
            'enabled': !![],
            'action': _0x8a0872,
            'type': _0x48b989
        });
        return !![];
    } catch (_0x55a6e4) {
        console['error']('Error\x20setting\x20antibadword:', _0x55a6e4);
        return ![];
    }
}
async function getAntiBadword(_0x4fde38, _0x26fc7f) {
    try {
        const _0x43a430 = await _0x0_0x1fa495['getSetting'](_0x4fde38, 'antibadword');
        return _0x43a430 || null;
    } catch (_0x22c7c2) {
        console['error']('Error\x20getting\x20antibadword:', _0x22c7c2);
        return null;
    }
}
async function removeAntiBadword(_0x2fb38d) {
    try {
        await _0x0_0x1fa495['saveSetting'](_0x2fb38d, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x346212) {
        console['error']('Error\x20removing\x20antibadword:', _0x346212);
        return ![];
    }
}
async function incrementWarningCount(_0x3c7456, _0x4238f9) {
    try {
        const _0x22d3a1 = 'antibadword_warnings';
        const _0x250d1c = await _0x0_0x1fa495['getSetting'](_0x3c7456, _0x22d3a1) || {};
        if (!_0x250d1c[_0x4238f9]) {
            _0x250d1c[_0x4238f9] = 0x0;
        }
        _0x250d1c[_0x4238f9]++;
        await _0x0_0x1fa495['saveSetting'](_0x3c7456, _0x22d3a1, _0x250d1c);
        return _0x250d1c[_0x4238f9];
    } catch (_0x2fe60b) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x2fe60b);
        return 0x0;
    }
}
async function resetWarningCount(_0x563a4d, _0x8403ec) {
    try {
        const _0x20dba6 = 'antibadword_warnings';
        const _0x2f1b2c = await _0x0_0x1fa495['getSetting'](_0x563a4d, _0x20dba6) || {};
        if (_0x2f1b2c[_0x8403ec]) {
            delete _0x2f1b2c[_0x8403ec];
            await _0x0_0x1fa495['saveSetting'](_0x563a4d, _0x20dba6, _0x2f1b2c);
        }
        return !![];
    } catch (_0x205657) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x205657);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x4f26d1, _0x57cf45, _0x41c3e4, _0xaa8a49) {
    if (!_0xaa8a49) {
        return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x41c3e4 });
    }
    if (_0xaa8a49 === 'on') {
        const _0x58f6b7 = await getAntiBadword(_0x57cf45, 'on');
        if (_0x58f6b7?.['enabled']) {
            return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x57cf45, 'on', 'delete');
        return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x41c3e4 });
    }
    if (_0xaa8a49 === 'off') {
        const _0x5531e0 = await getAntiBadword(_0x57cf45, 'on');
        if (!_0x5531e0?.['enabled']) {
            return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x41c3e4 });
        }
        await removeAntiBadword(_0x57cf45);
        return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x41c3e4 });
    }
    if (_0xaa8a49['startsWith']('set')) {
        const _0xb2197e = _0xaa8a49['split']('\x20')[0x1];
        if (!_0xb2197e || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0xb2197e)) {
            return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x41c3e4 });
        }
        await setAntiBadword(_0x57cf45, 'on', _0xb2197e);
        return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0xb2197e + '*' }, { 'quoted': _0x41c3e4 });
    }
    return _0x4f26d1['sendMessage'](_0x57cf45, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x41c3e4 });
}
async function handleBadwordDetection(_0x457148, _0x11896c, _0x328bdd, _0x10a86f, _0x1a6d83) {
    const _0x15590e = await loadAntibadwordConfig(_0x11896c);
    if (!_0x15590e['enabled'])
        return;
    if (!_0x11896c['endsWith']('@g.us'))
        return;
    if (_0x328bdd['key']['fromMe'])
        return;
    const _0x235ba7 = await getAntiBadword(_0x11896c, 'on');
    if (!_0x235ba7?.['enabled']) {
        return;
    }
    const _0x2b4283 = _0x10a86f['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x4ce664 = [
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
    const _0x3f684e = _0x2b4283['split']('\x20');
    let _0x210da1 = ![];
    for (const _0x2336dc of _0x3f684e) {
        if (_0x2336dc['length'] < 0x2)
            continue;
        if (_0x4ce664['includes'](_0x2336dc)) {
            _0x210da1 = !![];
            break;
        }
        for (const _0x393389 of _0x4ce664) {
            if (_0x393389['includes']('\x20')) {
                if (_0x2b4283['includes'](_0x393389)) {
                    _0x210da1 = !![];
                    break;
                }
            }
        }
        if (_0x210da1)
            break;
    }
    if (!_0x210da1)
        return;
    const _0x3f2787 = await _0x457148['groupMetadata'](_0x11896c);
    const _0x5838b0 = _0x457148['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x237673 = _0x3f2787['participants']['find'](_0x47a2b0 => _0x47a2b0['id'] === _0x5838b0);
    if (!_0x237673?.['admin']) {
        return;
    }
    const _0x458dee = _0x3f2787['participants']['find'](_0x5f1df3 => _0x5f1df3['id'] === _0x1a6d83);
    if (_0x458dee?.['admin']) {
        return;
    }
    try {
        await _0x457148['sendMessage'](_0x11896c, { 'delete': _0x328bdd['key'] });
    } catch (_0x3de280) {
        console['error']('Error\x20deleting\x20message:', _0x3de280);
        return;
    }
    switch (_0x235ba7['action']) {
    case 'delete':
        await _0x457148['sendMessage'](_0x11896c, {
            'text': '*@' + _0x1a6d83['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x1a6d83]
        });
        break;
    case 'kick':
        try {
            await _0x457148['groupParticipantsUpdate'](_0x11896c, [_0x1a6d83], 'remove');
            await _0x457148['sendMessage'](_0x11896c, {
                'text': '*@' + _0x1a6d83['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x1a6d83]
            });
        } catch (_0x4cb2bf) {
            console['error']('Error\x20kicking\x20user:', _0x4cb2bf);
        }
        break;
    case 'warn': {
            const _0x941158 = await incrementWarningCount(_0x11896c, _0x1a6d83);
            if (_0x941158 >= 0x3) {
                try {
                    await _0x457148['groupParticipantsUpdate'](_0x11896c, [_0x1a6d83], 'remove');
                    await resetWarningCount(_0x11896c, _0x1a6d83);
                    await _0x457148['sendMessage'](_0x11896c, {
                        'text': '*@' + _0x1a6d83['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x1a6d83]
                    });
                } catch (_0x38934b) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x38934b);
                }
            } else {
                await _0x457148['sendMessage'](_0x11896c, {
                    'text': '*@' + _0x1a6d83['split']('@')[0x0] + '\x20warning\x20' + _0x941158 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x1a6d83]
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