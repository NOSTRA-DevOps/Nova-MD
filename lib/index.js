import { fileURLToPath } from 'url';
import _0x0_0x3bbe59, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1490f9 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x3cf0d2 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x35d280 = await _0x0_0x3cf0d2['getSetting']('global', 'userGroupData');
            return _0x35d280 || {
                'antibadword': {},
                'antilink': {},
                'welcome': {},
                'goodbye': {},
                'chatbot': {},
                'warnings': {},
                'sudo': [],
                'antitag': {}
            };
        } else {
            if (!_0x0_0x1490f9['existsSync'](dataPath)) {
                const _0x521e97 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x1490f9['writeFileSync'](dataPath, JSON['stringify'](_0x521e97, null, 0x2));
                return _0x521e97;
            }
            const _0x21ce38 = JSON['parse'](_0x0_0x1490f9['readFileSync'](dataPath, 'utf8'));
            return _0x21ce38;
        }
    } catch (_0xa673bb) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0xa673bb);
        return {
            'antibadword': {},
            'antilink': {},
            'welcome': {},
            'goodbye': {},
            'chatbot': {},
            'warnings': {},
            'sudo': [],
            'antitag': {}
        };
    }
}
async function saveUserGroupData(_0x5c2dcb) {
    try {
        if (HAS_DB) {
            await _0x0_0x3cf0d2['saveSetting']('global', 'userGroupData', _0x5c2dcb);
        } else {
            const _0x5d81a5 = _0x0_0x3bbe59['dirname'](dataPath);
            if (!_0x0_0x1490f9['existsSync'](_0x5d81a5)) {
                _0x0_0x1490f9['mkdirSync'](_0x5d81a5, { 'recursive': !![] });
            }
            _0x0_0x1490f9['writeFileSync'](dataPath, JSON['stringify'](_0x5c2dcb, null, 0x2));
        }
        return !![];
    } catch (_0x11d18f) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x11d18f);
        return ![];
    }
}
async function setAntilink(_0x1c673f, _0x5651c4, _0x4b3dcb) {
    try {
        const _0x11f985 = await loadUserGroupData();
        if (!_0x11f985['antilink'])
            _0x11f985['antilink'] = {};
        if (!_0x11f985['antilink'][_0x1c673f])
            _0x11f985['antilink'][_0x1c673f] = {};
        _0x11f985['antilink'][_0x1c673f] = {
            'enabled': _0x5651c4 === 'on',
            'action': _0x4b3dcb || 'delete'
        };
        await saveUserGroupData(_0x11f985);
        return !![];
    } catch (_0x23d2c8) {
        console['error']('Error\x20setting\x20antilink:', _0x23d2c8);
        return ![];
    }
}
async function getAntilink(_0x400300, _0x534be0) {
    try {
        const _0x4f02d4 = await loadUserGroupData();
        if (!_0x4f02d4['antilink'] || !_0x4f02d4['antilink'][_0x400300])
            return null;
        return _0x534be0 === 'on' ? _0x4f02d4['antilink'][_0x400300] : null;
    } catch (_0x383e6b) {
        console['error']('Error\x20getting\x20antilink:', _0x383e6b);
        return null;
    }
}
async function removeAntilink(_0x2bce37, _0x2b01d1) {
    try {
        const _0x5cfc88 = await loadUserGroupData();
        if (_0x5cfc88['antilink'] && _0x5cfc88['antilink'][_0x2bce37]) {
            delete _0x5cfc88['antilink'][_0x2bce37];
            await saveUserGroupData(_0x5cfc88);
        }
        return !![];
    } catch (_0x30a5f0) {
        console['error']('Error\x20removing\x20antilink:', _0x30a5f0);
        return ![];
    }
}
async function setAntitag(_0x521fe1, _0x5a7e75, _0x1eca08) {
    try {
        const _0x130f61 = await loadUserGroupData();
        if (!_0x130f61['antitag'])
            _0x130f61['antitag'] = {};
        if (!_0x130f61['antitag'][_0x521fe1])
            _0x130f61['antitag'][_0x521fe1] = {};
        _0x130f61['antitag'][_0x521fe1] = {
            'enabled': _0x5a7e75 === 'on',
            'action': _0x1eca08 || 'delete'
        };
        await saveUserGroupData(_0x130f61);
        return !![];
    } catch (_0x50a690) {
        console['error']('Error\x20setting\x20antitag:', _0x50a690);
        return ![];
    }
}
async function getAntitag(_0x5ef550, _0x530390) {
    try {
        const _0x7ddc45 = await loadUserGroupData();
        if (!_0x7ddc45['antitag'] || !_0x7ddc45['antitag'][_0x5ef550])
            return null;
        return _0x530390 === 'on' ? _0x7ddc45['antitag'][_0x5ef550] : null;
    } catch (_0x2373b4) {
        console['error']('Error\x20getting\x20antitag:', _0x2373b4);
        return null;
    }
}
async function removeAntitag(_0x52eaaa, _0x8c5d20) {
    try {
        const _0x4b3f8c = await loadUserGroupData();
        if (_0x4b3f8c['antitag'] && _0x4b3f8c['antitag'][_0x52eaaa]) {
            delete _0x4b3f8c['antitag'][_0x52eaaa];
            await saveUserGroupData(_0x4b3f8c);
        }
        return !![];
    } catch (_0x54142c) {
        console['error']('Error\x20removing\x20antitag:', _0x54142c);
        return ![];
    }
}
async function incrementWarningCount(_0x448bb0, _0xec5624) {
    try {
        const _0xd3726c = await loadUserGroupData();
        if (!_0xd3726c['warnings'])
            _0xd3726c['warnings'] = {};
        if (!_0xd3726c['warnings'][_0x448bb0])
            _0xd3726c['warnings'][_0x448bb0] = {};
        if (!_0xd3726c['warnings'][_0x448bb0][_0xec5624])
            _0xd3726c['warnings'][_0x448bb0][_0xec5624] = 0x0;
        _0xd3726c['warnings'][_0x448bb0][_0xec5624]++;
        await saveUserGroupData(_0xd3726c);
        return _0xd3726c['warnings'][_0x448bb0][_0xec5624];
    } catch (_0xdbf1df) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0xdbf1df);
        return 0x0;
    }
}
async function resetWarningCount(_0x4597fe, _0x43cb8f) {
    try {
        const _0x5c1960 = await loadUserGroupData();
        if (_0x5c1960['warnings'] && _0x5c1960['warnings'][_0x4597fe] && _0x5c1960['warnings'][_0x4597fe][_0x43cb8f]) {
            _0x5c1960['warnings'][_0x4597fe][_0x43cb8f] = 0x0;
            await saveUserGroupData(_0x5c1960);
        }
        return !![];
    } catch (_0x32d685) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x32d685);
        return ![];
    }
}
async function isSudo(_0x705bd) {
    try {
        const _0x1c05dd = await loadUserGroupData();
        return _0x1c05dd['sudo'] && _0x1c05dd['sudo']['includes'](_0x705bd);
    } catch (_0x319629) {
        console['error']('Error\x20checking\x20sudo:', _0x319629);
        return ![];
    }
}
async function addSudo(_0x11159e) {
    try {
        const _0x544ee5 = await loadUserGroupData();
        if (!_0x544ee5['sudo'])
            _0x544ee5['sudo'] = [];
        if (!_0x544ee5['sudo']['includes'](_0x11159e)) {
            _0x544ee5['sudo']['push'](_0x11159e);
            await saveUserGroupData(_0x544ee5);
        }
        return !![];
    } catch (_0x4078b3) {
        console['error']('Error\x20adding\x20sudo:', _0x4078b3);
        return ![];
    }
}
async function removeSudo(_0x164c21) {
    try {
        const _0x249592 = await loadUserGroupData();
        if (!_0x249592['sudo'])
            _0x249592['sudo'] = [];
        const _0x473f93 = _0x249592['sudo']['indexOf'](_0x164c21);
        if (_0x473f93 !== -0x1) {
            _0x249592['sudo']['splice'](_0x473f93, 0x1);
            await saveUserGroupData(_0x249592);
        }
        return !![];
    } catch (_0x1b3824) {
        console['error']('Error\x20removing\x20sudo:', _0x1b3824);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x3c2d8e = await loadUserGroupData();
        return Array['isArray'](_0x3c2d8e['sudo']) ? _0x3c2d8e['sudo'] : [];
    } catch (_0x5d2e22) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x5d2e22);
        return [];
    }
}
async function addWelcome(_0x4993a0, _0x443e5b, _0x1cd2ef) {
    try {
        const _0x549dca = await loadUserGroupData();
        if (!_0x549dca['welcome'])
            _0x549dca['welcome'] = {};
        _0x549dca['welcome'][_0x4993a0] = {
            'enabled': _0x443e5b,
            'message': _0x1cd2ef || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x549dca);
        return !![];
    } catch (_0x24feed) {
        console['error']('Error\x20in\x20addWelcome:', _0x24feed);
        return ![];
    }
}
async function delWelcome(_0x53c3fb) {
    try {
        const _0x2a1c60 = await loadUserGroupData();
        if (_0x2a1c60['welcome'] && _0x2a1c60['welcome'][_0x53c3fb]) {
            delete _0x2a1c60['welcome'][_0x53c3fb];
            await saveUserGroupData(_0x2a1c60);
        }
        return !![];
    } catch (_0x2866fe) {
        console['error']('Error\x20in\x20delWelcome:', _0x2866fe);
        return ![];
    }
}
async function isWelcomeOn(_0xa7818d) {
    try {
        const _0x33ddf2 = await loadUserGroupData();
        return _0x33ddf2['welcome'] && _0x33ddf2['welcome'][_0xa7818d] && _0x33ddf2['welcome'][_0xa7818d]['enabled'];
    } catch (_0x4e2579) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x4e2579);
        return ![];
    }
}
async function addGoodbye(_0x4a23a2, _0x127d1c, _0x96538a) {
    try {
        const _0x385672 = await loadUserGroupData();
        if (!_0x385672['goodbye'])
            _0x385672['goodbye'] = {};
        _0x385672['goodbye'][_0x4a23a2] = {
            'enabled': _0x127d1c,
            'message': _0x96538a || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x385672);
        return !![];
    } catch (_0x2b06a0) {
        console['error']('Error\x20in\x20addGoodbye:', _0x2b06a0);
        return ![];
    }
}
async function delGoodBye(_0x575701) {
    try {
        const _0x26e950 = await loadUserGroupData();
        if (_0x26e950['goodbye'] && _0x26e950['goodbye'][_0x575701]) {
            delete _0x26e950['goodbye'][_0x575701];
            await saveUserGroupData(_0x26e950);
        }
        return !![];
    } catch (_0x503c76) {
        console['error']('Error\x20in\x20delGoodBye:', _0x503c76);
        return ![];
    }
}
async function isGoodByeOn(_0x71ecc1) {
    try {
        const _0x2ccd7f = await loadUserGroupData();
        return _0x2ccd7f['goodbye'] && _0x2ccd7f['goodbye'][_0x71ecc1] && _0x2ccd7f['goodbye'][_0x71ecc1]['enabled'];
    } catch (_0x4a102f) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x4a102f);
        return ![];
    }
}
async function getWelcome(_0x49e4d4) {
    try {
        const _0xde3742 = await loadUserGroupData();
        return _0xde3742['welcome'] && _0xde3742['welcome'][_0x49e4d4] ? _0xde3742['welcome'][_0x49e4d4]['message'] : null;
    } catch (_0x2fd74d) {
        console['error']('Error\x20in\x20getWelcome:', _0x2fd74d);
        return null;
    }
}
async function getGoodbye(_0x446463) {
    try {
        const _0x1378f2 = await loadUserGroupData();
        return _0x1378f2['goodbye'] && _0x1378f2['goodbye'][_0x446463] ? _0x1378f2['goodbye'][_0x446463]['message'] : null;
    } catch (_0x56cb5c) {
        console['error']('Error\x20in\x20getGoodbye:', _0x56cb5c);
        return null;
    }
}
async function setAntiBadword(_0x47d033, _0x34025f, _0x3c4ba2) {
    try {
        const _0x2016da = await loadUserGroupData();
        if (!_0x2016da['antibadword'])
            _0x2016da['antibadword'] = {};
        if (!_0x2016da['antibadword'][_0x47d033])
            _0x2016da['antibadword'][_0x47d033] = {};
        _0x2016da['antibadword'][_0x47d033] = {
            'enabled': _0x34025f === 'on',
            'action': _0x3c4ba2 || 'delete'
        };
        await saveUserGroupData(_0x2016da);
        return !![];
    } catch (_0xb0ca34) {
        console['error']('Error\x20setting\x20antibadword:', _0xb0ca34);
        return ![];
    }
}
async function getAntiBadword(_0x2ea5aa, _0x48ff9f) {
    try {
        const _0x45a663 = await loadUserGroupData();
        if (!_0x45a663['antibadword'] || !_0x45a663['antibadword'][_0x2ea5aa]) {
            return null;
        }
        const _0x4e4dbc = _0x45a663['antibadword'][_0x2ea5aa];
        return _0x48ff9f === 'on' ? _0x4e4dbc : null;
    } catch (_0x585479) {
        console['error']('Error\x20getting\x20antibadword:', _0x585479);
        return null;
    }
}
async function removeAntiBadword(_0x56223e, _0x3969ef) {
    try {
        const _0x44066e = await loadUserGroupData();
        if (_0x44066e['antibadword'] && _0x44066e['antibadword'][_0x56223e]) {
            delete _0x44066e['antibadword'][_0x56223e];
            await saveUserGroupData(_0x44066e);
        }
        return !![];
    } catch (_0x311a0b) {
        console['error']('Error\x20removing\x20antibadword:', _0x311a0b);
        return ![];
    }
}
async function setChatbot(_0x14fa77, _0x16373c) {
    try {
        const _0x1adf8e = await loadUserGroupData();
        if (!_0x1adf8e['chatbot'])
            _0x1adf8e['chatbot'] = {};
        _0x1adf8e['chatbot'][_0x14fa77] = { 'enabled': _0x16373c };
        await saveUserGroupData(_0x1adf8e);
        return !![];
    } catch (_0x3eca4a) {
        console['error']('Error\x20setting\x20chatbot:', _0x3eca4a);
        return ![];
    }
}
async function getChatbot(_0x1fa7a2) {
    try {
        const _0x1605f3 = await loadUserGroupData();
        return _0x1605f3['chatbot']?.[_0x1fa7a2] || null;
    } catch (_0x2a8488) {
        console['error']('Error\x20getting\x20chatbot:', _0x2a8488);
        return null;
    }
}
async function removeChatbot(_0x5c0be8) {
    try {
        const _0x39f26f = await loadUserGroupData();
        if (_0x39f26f['chatbot'] && _0x39f26f['chatbot'][_0x5c0be8]) {
            delete _0x39f26f['chatbot'][_0x5c0be8];
            await saveUserGroupData(_0x39f26f);
        }
        return !![];
    } catch (_0x264c30) {
        console['error']('Error\x20removing\x20chatbot:', _0x264c30);
        return ![];
    }
}
export {
    setAntilink,
    getAntilink,
    removeAntilink,
    setAntitag,
    getAntitag,
    removeAntitag,
    incrementWarningCount,
    resetWarningCount,
    isSudo,
    addSudo,
    removeSudo,
    getSudoList,
    addWelcome,
    delWelcome,
    isWelcomeOn,
    getWelcome,
    addGoodbye,
    delGoodBye,
    isGoodByeOn,
    getGoodbye,
    setAntiBadword,
    getAntiBadword,
    removeAntiBadword,
    setChatbot,
    getChatbot,
    removeChatbot,
    loadUserGroupData,
    saveUserGroupData
};