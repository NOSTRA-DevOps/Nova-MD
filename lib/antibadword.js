import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xbae00a from './lightweight_store.js';
import _0x0_0x20f789 from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x4da902) {
    try {
        if (HAS_DB) {
            const _0x5c8b78 = await _0x0_0xbae00a['getSetting'](_0x4da902, 'antibadword');
            return _0x5c8b78 || {};
        } else {
            const _0x8bf274 = dataFile('userGroupData.json');
            if (!_0x0_0x20f789['existsSync'](_0x8bf274)) {
                return {};
            }
            const _0x2c79d5 = JSON['parse'](_0x0_0x20f789['readFileSync'](_0x8bf274, 'utf-8')['toString']());
            return _0x2c79d5['antibadword']?.[_0x4da902] || {};
        }
    } catch (_0x51153d) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x51153d['message']);
        return {};
    }
}
async function setAntiBadword(_0x76938a, _0x5df13f, _0x265937) {
    try {
        await _0x0_0xbae00a['saveSetting'](_0x76938a, 'antibadword', {
            'enabled': !![],
            'action': _0x265937,
            'type': _0x5df13f
        });
        return !![];
    } catch (_0x386fdf) {
        console['error']('Error\x20setting\x20antibadword:', _0x386fdf);
        return ![];
    }
}
async function getAntiBadword(_0x17c127, _0xc56863) {
    try {
        const _0x322144 = await _0x0_0xbae00a['getSetting'](_0x17c127, 'antibadword');
        return _0x322144 || null;
    } catch (_0x3e9455) {
        console['error']('Error\x20getting\x20antibadword:', _0x3e9455);
        return null;
    }
}
async function removeAntiBadword(_0xecd19f) {
    try {
        await _0x0_0xbae00a['saveSetting'](_0xecd19f, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x17adb0) {
        console['error']('Error\x20removing\x20antibadword:', _0x17adb0);
        return ![];
    }
}
async function incrementWarningCount(_0x80eebf, _0xb0e4e8) {
    try {
        const _0x11ad99 = 'antibadword_warnings';
        const _0x590b1b = await _0x0_0xbae00a['getSetting'](_0x80eebf, _0x11ad99) || {};
        if (!_0x590b1b[_0xb0e4e8]) {
            _0x590b1b[_0xb0e4e8] = 0x0;
        }
        _0x590b1b[_0xb0e4e8]++;
        await _0x0_0xbae00a['saveSetting'](_0x80eebf, _0x11ad99, _0x590b1b);
        return _0x590b1b[_0xb0e4e8];
    } catch (_0x548616) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x548616);
        return 0x0;
    }
}
async function resetWarningCount(_0x2ecf6e, _0x4578fe) {
    try {
        const _0x228443 = 'antibadword_warnings';
        const _0x2eaaae = await _0x0_0xbae00a['getSetting'](_0x2ecf6e, _0x228443) || {};
        if (_0x2eaaae[_0x4578fe]) {
            delete _0x2eaaae[_0x4578fe];
            await _0x0_0xbae00a['saveSetting'](_0x2ecf6e, _0x228443, _0x2eaaae);
        }
        return !![];
    } catch (_0x1b06d7) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x1b06d7);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x356c8c, _0xc009cb, _0x13bd72, _0x5ce9ea) {
    if (!_0x5ce9ea) {
        return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x13bd72 });
    }
    if (_0x5ce9ea === 'on') {
        const _0xee02c9 = await getAntiBadword(_0xc009cb, 'on');
        if (_0xee02c9?.['enabled']) {
            return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0xc009cb, 'on', 'delete');
        return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x13bd72 });
    }
    if (_0x5ce9ea === 'off') {
        const _0x461c1c = await getAntiBadword(_0xc009cb, 'on');
        if (!_0x461c1c?.['enabled']) {
            return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x13bd72 });
        }
        await removeAntiBadword(_0xc009cb);
        return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x13bd72 });
    }
    if (_0x5ce9ea['startsWith']('set')) {
        const _0x3ef014 = _0x5ce9ea['split']('\x20')[0x1];
        if (!_0x3ef014 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x3ef014)) {
            return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x13bd72 });
        }
        await setAntiBadword(_0xc009cb, 'on', _0x3ef014);
        return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x3ef014 + '*' }, { 'quoted': _0x13bd72 });
    }
    return _0x356c8c['sendMessage'](_0xc009cb, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x13bd72 });
}
async function handleBadwordDetection(_0x1b8d1a, _0x2cb0d1, _0x2bdc63, _0x2f5ba1, _0x602206) {
    const _0x52048a = await loadAntibadwordConfig(_0x2cb0d1);
    if (!_0x52048a['enabled'])
        return;
    if (!_0x2cb0d1['endsWith']('@g.us'))
        return;
    if (_0x2bdc63['key']['fromMe'])
        return;
    const _0x50527d = await getAntiBadword(_0x2cb0d1, 'on');
    if (!_0x50527d?.['enabled']) {
        return;
    }
    const _0x32e93b = _0x2f5ba1['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x35b3e0 = [
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
    const _0x3d606e = _0x32e93b['split']('\x20');
    let _0x297b36 = ![];
    for (const _0x5e9aa0 of _0x3d606e) {
        if (_0x5e9aa0['length'] < 0x2)
            continue;
        if (_0x35b3e0['includes'](_0x5e9aa0)) {
            _0x297b36 = !![];
            break;
        }
        for (const _0x5b9930 of _0x35b3e0) {
            if (_0x5b9930['includes']('\x20')) {
                if (_0x32e93b['includes'](_0x5b9930)) {
                    _0x297b36 = !![];
                    break;
                }
            }
        }
        if (_0x297b36)
            break;
    }
    if (!_0x297b36)
        return;
    const _0x1f0434 = await _0x1b8d1a['groupMetadata'](_0x2cb0d1);
    const _0x5d6532 = _0x1b8d1a['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0x138a12 = _0x1f0434['participants']['find'](_0x2b786a => _0x2b786a['id'] === _0x5d6532);
    if (!_0x138a12?.['admin']) {
        return;
    }
    const _0x1ee661 = _0x1f0434['participants']['find'](_0x193a71 => _0x193a71['id'] === _0x602206);
    if (_0x1ee661?.['admin']) {
        return;
    }
    try {
        await _0x1b8d1a['sendMessage'](_0x2cb0d1, { 'delete': _0x2bdc63['key'] });
    } catch (_0x46d23a) {
        console['error']('Error\x20deleting\x20message:', _0x46d23a);
        return;
    }
    switch (_0x50527d['action']) {
    case 'delete':
        await _0x1b8d1a['sendMessage'](_0x2cb0d1, {
            'text': '*@' + _0x602206['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x602206]
        });
        break;
    case 'kick':
        try {
            await _0x1b8d1a['groupParticipantsUpdate'](_0x2cb0d1, [_0x602206], 'remove');
            await _0x1b8d1a['sendMessage'](_0x2cb0d1, {
                'text': '*@' + _0x602206['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x602206]
            });
        } catch (_0x52c997) {
            console['error']('Error\x20kicking\x20user:', _0x52c997);
        }
        break;
    case 'warn': {
            const _0x35a845 = await incrementWarningCount(_0x2cb0d1, _0x602206);
            if (_0x35a845 >= 0x3) {
                try {
                    await _0x1b8d1a['groupParticipantsUpdate'](_0x2cb0d1, [_0x602206], 'remove');
                    await resetWarningCount(_0x2cb0d1, _0x602206);
                    await _0x1b8d1a['sendMessage'](_0x2cb0d1, {
                        'text': '*@' + _0x602206['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x602206]
                    });
                } catch (_0x5749f3) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x5749f3);
                }
            } else {
                await _0x1b8d1a['sendMessage'](_0x2cb0d1, {
                    'text': '*@' + _0x602206['split']('@')[0x0] + '\x20warning\x20' + _0x35a845 + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x602206]
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