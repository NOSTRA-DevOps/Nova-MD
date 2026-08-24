import { fileURLToPath } from 'url';
import _0x0_0xbbb579, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5ca47a from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x27117e from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x17554b = await _0x0_0x27117e['getSetting']('global', 'userGroupData');
            return _0x17554b || {
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
            if (!_0x0_0x5ca47a['existsSync'](dataPath)) {
                const _0x1876d2 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x5ca47a['writeFileSync'](dataPath, JSON['stringify'](_0x1876d2, null, 0x2));
                return _0x1876d2;
            }
            const _0x18144d = JSON['parse'](_0x0_0x5ca47a['readFileSync'](dataPath, 'utf8'));
            return _0x18144d;
        }
    } catch (_0xaaa365) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0xaaa365);
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
async function saveUserGroupData(_0x276b0f) {
    try {
        if (HAS_DB) {
            await _0x0_0x27117e['saveSetting']('global', 'userGroupData', _0x276b0f);
        } else {
            const _0x28f31b = _0x0_0xbbb579['dirname'](dataPath);
            if (!_0x0_0x5ca47a['existsSync'](_0x28f31b)) {
                _0x0_0x5ca47a['mkdirSync'](_0x28f31b, { 'recursive': !![] });
            }
            _0x0_0x5ca47a['writeFileSync'](dataPath, JSON['stringify'](_0x276b0f, null, 0x2));
        }
        return !![];
    } catch (_0xd2c558) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0xd2c558);
        return ![];
    }
}
async function setAntilink(_0x1246e7, _0x5286c4, _0x5cc67d) {
    try {
        const _0x4fcb21 = await loadUserGroupData();
        if (!_0x4fcb21['antilink'])
            _0x4fcb21['antilink'] = {};
        if (!_0x4fcb21['antilink'][_0x1246e7])
            _0x4fcb21['antilink'][_0x1246e7] = {};
        _0x4fcb21['antilink'][_0x1246e7] = {
            'enabled': _0x5286c4 === 'on',
            'action': _0x5cc67d || 'delete'
        };
        await saveUserGroupData(_0x4fcb21);
        return !![];
    } catch (_0x14178c) {
        console['error']('Error\x20setting\x20antilink:', _0x14178c);
        return ![];
    }
}
async function getAntilink(_0x3da530, _0x1217fb) {
    try {
        const _0x165901 = await loadUserGroupData();
        if (!_0x165901['antilink'] || !_0x165901['antilink'][_0x3da530])
            return null;
        return _0x1217fb === 'on' ? _0x165901['antilink'][_0x3da530] : null;
    } catch (_0x50ecbb) {
        console['error']('Error\x20getting\x20antilink:', _0x50ecbb);
        return null;
    }
}
async function removeAntilink(_0x29c9cd, _0x13925b) {
    try {
        const _0x1a4af8 = await loadUserGroupData();
        if (_0x1a4af8['antilink'] && _0x1a4af8['antilink'][_0x29c9cd]) {
            delete _0x1a4af8['antilink'][_0x29c9cd];
            await saveUserGroupData(_0x1a4af8);
        }
        return !![];
    } catch (_0x4750fc) {
        console['error']('Error\x20removing\x20antilink:', _0x4750fc);
        return ![];
    }
}
async function setAntitag(_0x2df881, _0x17dbb3, _0x126f9b) {
    try {
        const _0x3e4944 = await loadUserGroupData();
        if (!_0x3e4944['antitag'])
            _0x3e4944['antitag'] = {};
        if (!_0x3e4944['antitag'][_0x2df881])
            _0x3e4944['antitag'][_0x2df881] = {};
        _0x3e4944['antitag'][_0x2df881] = {
            'enabled': _0x17dbb3 === 'on',
            'action': _0x126f9b || 'delete'
        };
        await saveUserGroupData(_0x3e4944);
        return !![];
    } catch (_0xa830cd) {
        console['error']('Error\x20setting\x20antitag:', _0xa830cd);
        return ![];
    }
}
async function getAntitag(_0x3e61dc, _0x23d1c3) {
    try {
        const _0x2774bf = await loadUserGroupData();
        if (!_0x2774bf['antitag'] || !_0x2774bf['antitag'][_0x3e61dc])
            return null;
        return _0x23d1c3 === 'on' ? _0x2774bf['antitag'][_0x3e61dc] : null;
    } catch (_0x5ecdf4) {
        console['error']('Error\x20getting\x20antitag:', _0x5ecdf4);
        return null;
    }
}
async function removeAntitag(_0x3f70b4, _0x21ccd9) {
    try {
        const _0x1f49c5 = await loadUserGroupData();
        if (_0x1f49c5['antitag'] && _0x1f49c5['antitag'][_0x3f70b4]) {
            delete _0x1f49c5['antitag'][_0x3f70b4];
            await saveUserGroupData(_0x1f49c5);
        }
        return !![];
    } catch (_0x3eebcc) {
        console['error']('Error\x20removing\x20antitag:', _0x3eebcc);
        return ![];
    }
}
async function incrementWarningCount(_0x1a74aa, _0x2a3672) {
    try {
        const _0x24b2b4 = await loadUserGroupData();
        if (!_0x24b2b4['warnings'])
            _0x24b2b4['warnings'] = {};
        if (!_0x24b2b4['warnings'][_0x1a74aa])
            _0x24b2b4['warnings'][_0x1a74aa] = {};
        if (!_0x24b2b4['warnings'][_0x1a74aa][_0x2a3672])
            _0x24b2b4['warnings'][_0x1a74aa][_0x2a3672] = 0x0;
        _0x24b2b4['warnings'][_0x1a74aa][_0x2a3672]++;
        await saveUserGroupData(_0x24b2b4);
        return _0x24b2b4['warnings'][_0x1a74aa][_0x2a3672];
    } catch (_0x445c3a) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x445c3a);
        return 0x0;
    }
}
async function resetWarningCount(_0x4764c5, _0x163713) {
    try {
        const _0x5bbeb0 = await loadUserGroupData();
        if (_0x5bbeb0['warnings'] && _0x5bbeb0['warnings'][_0x4764c5] && _0x5bbeb0['warnings'][_0x4764c5][_0x163713]) {
            _0x5bbeb0['warnings'][_0x4764c5][_0x163713] = 0x0;
            await saveUserGroupData(_0x5bbeb0);
        }
        return !![];
    } catch (_0x10eef2) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x10eef2);
        return ![];
    }
}
async function isSudo(_0x4d52f1) {
    try {
        const _0x48848e = await loadUserGroupData();
        return _0x48848e['sudo'] && _0x48848e['sudo']['includes'](_0x4d52f1);
    } catch (_0x2bba2) {
        console['error']('Error\x20checking\x20sudo:', _0x2bba2);
        return ![];
    }
}
async function addSudo(_0x446aab) {
    try {
        const _0x220086 = await loadUserGroupData();
        if (!_0x220086['sudo'])
            _0x220086['sudo'] = [];
        if (!_0x220086['sudo']['includes'](_0x446aab)) {
            _0x220086['sudo']['push'](_0x446aab);
            await saveUserGroupData(_0x220086);
        }
        return !![];
    } catch (_0x47eb96) {
        console['error']('Error\x20adding\x20sudo:', _0x47eb96);
        return ![];
    }
}
async function removeSudo(_0x4faa28) {
    try {
        const _0xf0db15 = await loadUserGroupData();
        if (!_0xf0db15['sudo'])
            _0xf0db15['sudo'] = [];
        const _0x4906d1 = _0xf0db15['sudo']['indexOf'](_0x4faa28);
        if (_0x4906d1 !== -0x1) {
            _0xf0db15['sudo']['splice'](_0x4906d1, 0x1);
            await saveUserGroupData(_0xf0db15);
        }
        return !![];
    } catch (_0x34aa84) {
        console['error']('Error\x20removing\x20sudo:', _0x34aa84);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x4df529 = await loadUserGroupData();
        return Array['isArray'](_0x4df529['sudo']) ? _0x4df529['sudo'] : [];
    } catch (_0x4f491b) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x4f491b);
        return [];
    }
}
async function addWelcome(_0x15b140, _0x4a60fe, _0x52ca2e) {
    try {
        const _0x1376c2 = await loadUserGroupData();
        if (!_0x1376c2['welcome'])
            _0x1376c2['welcome'] = {};
        _0x1376c2['welcome'][_0x15b140] = {
            'enabled': _0x4a60fe,
            'message': _0x52ca2e || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x1376c2);
        return !![];
    } catch (_0x35d89f) {
        console['error']('Error\x20in\x20addWelcome:', _0x35d89f);
        return ![];
    }
}
async function delWelcome(_0x50f912) {
    try {
        const _0x570dcd = await loadUserGroupData();
        if (_0x570dcd['welcome'] && _0x570dcd['welcome'][_0x50f912]) {
            delete _0x570dcd['welcome'][_0x50f912];
            await saveUserGroupData(_0x570dcd);
        }
        return !![];
    } catch (_0x471155) {
        console['error']('Error\x20in\x20delWelcome:', _0x471155);
        return ![];
    }
}
async function isWelcomeOn(_0x3431a8) {
    try {
        const _0x2eb353 = await loadUserGroupData();
        return _0x2eb353['welcome'] && _0x2eb353['welcome'][_0x3431a8] && _0x2eb353['welcome'][_0x3431a8]['enabled'];
    } catch (_0x1a85a4) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x1a85a4);
        return ![];
    }
}
async function addGoodbye(_0x4b8175, _0x1310cf, _0x520126) {
    try {
        const _0xb53ee0 = await loadUserGroupData();
        if (!_0xb53ee0['goodbye'])
            _0xb53ee0['goodbye'] = {};
        _0xb53ee0['goodbye'][_0x4b8175] = {
            'enabled': _0x1310cf,
            'message': _0x520126 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0xb53ee0);
        return !![];
    } catch (_0x323e9e) {
        console['error']('Error\x20in\x20addGoodbye:', _0x323e9e);
        return ![];
    }
}
async function delGoodBye(_0x2e099e) {
    try {
        const _0x437573 = await loadUserGroupData();
        if (_0x437573['goodbye'] && _0x437573['goodbye'][_0x2e099e]) {
            delete _0x437573['goodbye'][_0x2e099e];
            await saveUserGroupData(_0x437573);
        }
        return !![];
    } catch (_0x3b5bca) {
        console['error']('Error\x20in\x20delGoodBye:', _0x3b5bca);
        return ![];
    }
}
async function isGoodByeOn(_0x56c14f) {
    try {
        const _0x591b44 = await loadUserGroupData();
        return _0x591b44['goodbye'] && _0x591b44['goodbye'][_0x56c14f] && _0x591b44['goodbye'][_0x56c14f]['enabled'];
    } catch (_0x2480d4) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x2480d4);
        return ![];
    }
}
async function getWelcome(_0xc856e6) {
    try {
        const _0xed8d30 = await loadUserGroupData();
        return _0xed8d30['welcome'] && _0xed8d30['welcome'][_0xc856e6] ? _0xed8d30['welcome'][_0xc856e6]['message'] : null;
    } catch (_0x571e4e) {
        console['error']('Error\x20in\x20getWelcome:', _0x571e4e);
        return null;
    }
}
async function getGoodbye(_0x244819) {
    try {
        const _0x4b5f9f = await loadUserGroupData();
        return _0x4b5f9f['goodbye'] && _0x4b5f9f['goodbye'][_0x244819] ? _0x4b5f9f['goodbye'][_0x244819]['message'] : null;
    } catch (_0x15e68e) {
        console['error']('Error\x20in\x20getGoodbye:', _0x15e68e);
        return null;
    }
}
async function setAntiBadword(_0x594ccf, _0x47e461, _0x1cd21c) {
    try {
        const _0x233493 = await loadUserGroupData();
        if (!_0x233493['antibadword'])
            _0x233493['antibadword'] = {};
        if (!_0x233493['antibadword'][_0x594ccf])
            _0x233493['antibadword'][_0x594ccf] = {};
        _0x233493['antibadword'][_0x594ccf] = {
            'enabled': _0x47e461 === 'on',
            'action': _0x1cd21c || 'delete'
        };
        await saveUserGroupData(_0x233493);
        return !![];
    } catch (_0x6cc566) {
        console['error']('Error\x20setting\x20antibadword:', _0x6cc566);
        return ![];
    }
}
async function getAntiBadword(_0x365c53, _0x127df6) {
    try {
        const _0x750ea4 = await loadUserGroupData();
        if (!_0x750ea4['antibadword'] || !_0x750ea4['antibadword'][_0x365c53]) {
            return null;
        }
        const _0x418f0a = _0x750ea4['antibadword'][_0x365c53];
        return _0x127df6 === 'on' ? _0x418f0a : null;
    } catch (_0x4085d9) {
        console['error']('Error\x20getting\x20antibadword:', _0x4085d9);
        return null;
    }
}
async function removeAntiBadword(_0x4ae52b, _0xa0ee93) {
    try {
        const _0x1d1b91 = await loadUserGroupData();
        if (_0x1d1b91['antibadword'] && _0x1d1b91['antibadword'][_0x4ae52b]) {
            delete _0x1d1b91['antibadword'][_0x4ae52b];
            await saveUserGroupData(_0x1d1b91);
        }
        return !![];
    } catch (_0x5263ab) {
        console['error']('Error\x20removing\x20antibadword:', _0x5263ab);
        return ![];
    }
}
async function setChatbot(_0xbaf0b7, _0x1a525b) {
    try {
        const _0x2edc52 = await loadUserGroupData();
        if (!_0x2edc52['chatbot'])
            _0x2edc52['chatbot'] = {};
        _0x2edc52['chatbot'][_0xbaf0b7] = { 'enabled': _0x1a525b };
        await saveUserGroupData(_0x2edc52);
        return !![];
    } catch (_0x43f098) {
        console['error']('Error\x20setting\x20chatbot:', _0x43f098);
        return ![];
    }
}
async function getChatbot(_0x3e3962) {
    try {
        const _0x6b6a53 = await loadUserGroupData();
        return _0x6b6a53['chatbot']?.[_0x3e3962] || null;
    } catch (_0x150e57) {
        console['error']('Error\x20getting\x20chatbot:', _0x150e57);
        return null;
    }
}
async function removeChatbot(_0x34165b) {
    try {
        const _0x487009 = await loadUserGroupData();
        if (_0x487009['chatbot'] && _0x487009['chatbot'][_0x34165b]) {
            delete _0x487009['chatbot'][_0x34165b];
            await saveUserGroupData(_0x487009);
        }
        return !![];
    } catch (_0x59ec71) {
        console['error']('Error\x20removing\x20chatbot:', _0x59ec71);
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