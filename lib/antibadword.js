import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1fbea2 from './lightweight_store.js';
import _0x0_0x4f04ab from 'fs';
import { dataFile } from './paths.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL);
async function loadAntibadwordConfig(_0x2ccbce) {
    try {
        if (HAS_DB) {
            const _0x1d5691 = await _0x0_0x1fbea2['getSetting'](_0x2ccbce, 'antibadword');
            return _0x1d5691 || {};
        } else {
            const _0x5967dc = dataFile('userGroupData.json');
            if (!_0x0_0x4f04ab['existsSync'](_0x5967dc)) {
                return {};
            }
            const _0x39f0a4 = JSON['parse'](_0x0_0x4f04ab['readFileSync'](_0x5967dc, 'utf-8')['toString']());
            return _0x39f0a4['antibadword']?.[_0x2ccbce] || {};
        }
    } catch (_0x5af4e9) {
        console['error']('❌\x20Error\x20loading\x20antibadword\x20config:', _0x5af4e9['message']);
        return {};
    }
}
async function setAntiBadword(_0x111cb8, _0x55fd84, _0x5d8626) {
    try {
        await _0x0_0x1fbea2['saveSetting'](_0x111cb8, 'antibadword', {
            'enabled': !![],
            'action': _0x5d8626,
            'type': _0x55fd84
        });
        return !![];
    } catch (_0x3e311c) {
        console['error']('Error\x20setting\x20antibadword:', _0x3e311c);
        return ![];
    }
}
async function getAntiBadword(_0x386ca4, _0x14a8b1) {
    try {
        const _0x3d4dda = await _0x0_0x1fbea2['getSetting'](_0x386ca4, 'antibadword');
        return _0x3d4dda || null;
    } catch (_0x4f3c80) {
        console['error']('Error\x20getting\x20antibadword:', _0x4f3c80);
        return null;
    }
}
async function removeAntiBadword(_0x3545ff) {
    try {
        await _0x0_0x1fbea2['saveSetting'](_0x3545ff, 'antibadword', {
            'enabled': ![],
            'action': null,
            'type': null
        });
        return !![];
    } catch (_0x3eed62) {
        console['error']('Error\x20removing\x20antibadword:', _0x3eed62);
        return ![];
    }
}
async function incrementWarningCount(_0x55d3b7, _0x1ac671) {
    try {
        const _0x1f969b = 'antibadword_warnings';
        const _0x13e8d7 = await _0x0_0x1fbea2['getSetting'](_0x55d3b7, _0x1f969b) || {};
        if (!_0x13e8d7[_0x1ac671]) {
            _0x13e8d7[_0x1ac671] = 0x0;
        }
        _0x13e8d7[_0x1ac671]++;
        await _0x0_0x1fbea2['saveSetting'](_0x55d3b7, _0x1f969b, _0x13e8d7);
        return _0x13e8d7[_0x1ac671];
    } catch (_0x3394a2) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x3394a2);
        return 0x0;
    }
}
async function resetWarningCount(_0x5fe79c, _0x25375e) {
    try {
        const _0x42cbf9 = 'antibadword_warnings';
        const _0x3ba138 = await _0x0_0x1fbea2['getSetting'](_0x5fe79c, _0x42cbf9) || {};
        if (_0x3ba138[_0x25375e]) {
            delete _0x3ba138[_0x25375e];
            await _0x0_0x1fbea2['saveSetting'](_0x5fe79c, _0x42cbf9, _0x3ba138);
        }
        return !![];
    } catch (_0x11dc58) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x11dc58);
        return ![];
    }
}
async function handleAntiBadwordCommand(_0x3071fe, _0x465944, _0x1cdc79, _0x374598) {
    if (!_0x374598) {
        return _0x3071fe['sendMessage'](_0x465944, { 'text': '*ANTIBADWORD\x20SETUP*\x0a\x0a*.antibadword\x20on*\x0aTurn\x20on\x20antibadword\x0a\x0a*.antibadword\x20set\x20<action>*\x0aSet\x20action:\x20delete/kick/warn\x0a\x0a*.antibadword\x20off*\x0aDisables\x20antibadword\x20in\x20this\x20group\x0a\x0aStorage:\x20' + (HAS_DB ? 'Database' : 'File\x20System') }, { 'quoted': _0x1cdc79 });
    }
    if (_0x374598 === 'on') {
        const _0x4ee691 = await getAntiBadword(_0x465944, 'on');
        if (_0x4ee691?.['enabled']) {
            return _0x3071fe['sendMessage'](_0x465944, { 'text': '*AntiBadword\x20is\x20already\x20enabled\x20for\x20this\x20group*' });
        }
        await setAntiBadword(_0x465944, 'on', 'delete');
        return _0x3071fe['sendMessage'](_0x465944, { 'text': '*AntiBadword\x20has\x20been\x20enabled.\x20Use\x20.antibadword\x20set\x20<action>\x20to\x20customize\x20action*' }, { 'quoted': _0x1cdc79 });
    }
    if (_0x374598 === 'off') {
        const _0x3d9ea9 = await getAntiBadword(_0x465944, 'on');
        if (!_0x3d9ea9?.['enabled']) {
            return _0x3071fe['sendMessage'](_0x465944, { 'text': '*AntiBadword\x20is\x20already\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1cdc79 });
        }
        await removeAntiBadword(_0x465944);
        return _0x3071fe['sendMessage'](_0x465944, { 'text': '*AntiBadword\x20has\x20been\x20disabled\x20for\x20this\x20group*' }, { 'quoted': _0x1cdc79 });
    }
    if (_0x374598['startsWith']('set')) {
        const _0x531819 = _0x374598['split']('\x20')[0x1];
        if (!_0x531819 || ![
                'delete',
                'kick',
                'warn'
            ]['includes'](_0x531819)) {
            return _0x3071fe['sendMessage'](_0x465944, { 'text': '*Invalid\x20action.\x20Choose:\x20delete,\x20kick,\x20or\x20warn*' }, { 'quoted': _0x1cdc79 });
        }
        await setAntiBadword(_0x465944, 'on', _0x531819);
        return _0x3071fe['sendMessage'](_0x465944, { 'text': '*AntiBadword\x20action\x20set\x20to:\x20' + _0x531819 + '*' }, { 'quoted': _0x1cdc79 });
    }
    return _0x3071fe['sendMessage'](_0x465944, { 'text': '*Invalid\x20command.\x20Use\x20.antibadword\x20to\x20see\x20usage*' }, { 'quoted': _0x1cdc79 });
}
async function handleBadwordDetection(_0x32ff45, _0x3b935a, _0x534f9f, _0x54d792, _0x37407b) {
    const _0x341cdc = await loadAntibadwordConfig(_0x3b935a);
    if (!_0x341cdc['enabled'])
        return;
    if (!_0x3b935a['endsWith']('@g.us'))
        return;
    if (_0x534f9f['key']['fromMe'])
        return;
    const _0x2641a6 = await getAntiBadword(_0x3b935a, 'on');
    if (!_0x2641a6?.['enabled']) {
        return;
    }
    const _0x4533eb = _0x54d792['toLowerCase']()['replace'](/[^\w\s]/g, '\x20')['replace'](/\s+/g, '\x20')['trim']();
    const _0x5830d9 = [
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
    const _0x5e7a01 = _0x4533eb['split']('\x20');
    let _0x4c70eb = ![];
    for (const _0xb5ce8e of _0x5e7a01) {
        if (_0xb5ce8e['length'] < 0x2)
            continue;
        if (_0x5830d9['includes'](_0xb5ce8e)) {
            _0x4c70eb = !![];
            break;
        }
        for (const _0x44e5cb of _0x5830d9) {
            if (_0x44e5cb['includes']('\x20')) {
                if (_0x4533eb['includes'](_0x44e5cb)) {
                    _0x4c70eb = !![];
                    break;
                }
            }
        }
        if (_0x4c70eb)
            break;
    }
    if (!_0x4c70eb)
        return;
    const _0x333d71 = await _0x32ff45['groupMetadata'](_0x3b935a);
    const _0x87d62e = _0x32ff45['user']['id']['split'](':')[0x0] + '@s.whatsapp.net';
    const _0xaa33d5 = _0x333d71['participants']['find'](_0x24b60c => _0x24b60c['id'] === _0x87d62e);
    if (!_0xaa33d5?.['admin']) {
        return;
    }
    const _0x2bb9cb = _0x333d71['participants']['find'](_0x2ffc6a => _0x2ffc6a['id'] === _0x37407b);
    if (_0x2bb9cb?.['admin']) {
        return;
    }
    try {
        await _0x32ff45['sendMessage'](_0x3b935a, { 'delete': _0x534f9f['key'] });
    } catch (_0x24decf) {
        console['error']('Error\x20deleting\x20message:', _0x24decf);
        return;
    }
    switch (_0x2641a6['action']) {
    case 'delete':
        await _0x32ff45['sendMessage'](_0x3b935a, {
            'text': '*@' + _0x37407b['split']('@')[0x0] + '\x20bad\x20words\x20are\x20not\x20allowed\x20here*',
            'mentions': [_0x37407b]
        });
        break;
    case 'kick':
        try {
            await _0x32ff45['groupParticipantsUpdate'](_0x3b935a, [_0x37407b], 'remove');
            await _0x32ff45['sendMessage'](_0x3b935a, {
                'text': '*@' + _0x37407b['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20for\x20using\x20bad\x20words*',
                'mentions': [_0x37407b]
            });
        } catch (_0x2d5984) {
            console['error']('Error\x20kicking\x20user:', _0x2d5984);
        }
        break;
    case 'warn': {
            const _0x43bcae = await incrementWarningCount(_0x3b935a, _0x37407b);
            if (_0x43bcae >= 0x3) {
                try {
                    await _0x32ff45['groupParticipantsUpdate'](_0x3b935a, [_0x37407b], 'remove');
                    await resetWarningCount(_0x3b935a, _0x37407b);
                    await _0x32ff45['sendMessage'](_0x3b935a, {
                        'text': '*@' + _0x37407b['split']('@')[0x0] + '\x20has\x20been\x20kicked\x20after\x203\x20warnings*',
                        'mentions': [_0x37407b]
                    });
                } catch (_0x53f2bb) {
                    console['error']('Error\x20kicking\x20user\x20after\x20warnings:', _0x53f2bb);
                }
            } else {
                await _0x32ff45['sendMessage'](_0x3b935a, {
                    'text': '*@' + _0x37407b['split']('@')[0x0] + '\x20warning\x20' + _0x43bcae + '/3\x20for\x20using\x20bad\x20words*',
                    'mentions': [_0x37407b]
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