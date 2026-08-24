import { fileURLToPath } from 'url';
import _0x0_0xa57849, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x298725 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x8b5ca5 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x54f598 = await _0x0_0x8b5ca5['getSetting']('global', 'userGroupData');
            return _0x54f598 || {
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
            if (!_0x0_0x298725['existsSync'](dataPath)) {
                const _0x248bcc = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x298725['writeFileSync'](dataPath, JSON['stringify'](_0x248bcc, null, 0x2));
                return _0x248bcc;
            }
            const _0x549974 = JSON['parse'](_0x0_0x298725['readFileSync'](dataPath, 'utf8'));
            return _0x549974;
        }
    } catch (_0x5e20f5) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x5e20f5);
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
async function saveUserGroupData(_0x5c45a6) {
    try {
        if (HAS_DB) {
            await _0x0_0x8b5ca5['saveSetting']('global', 'userGroupData', _0x5c45a6);
        } else {
            const _0x2d7f23 = _0x0_0xa57849['dirname'](dataPath);
            if (!_0x0_0x298725['existsSync'](_0x2d7f23)) {
                _0x0_0x298725['mkdirSync'](_0x2d7f23, { 'recursive': !![] });
            }
            _0x0_0x298725['writeFileSync'](dataPath, JSON['stringify'](_0x5c45a6, null, 0x2));
        }
        return !![];
    } catch (_0x14b09f) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x14b09f);
        return ![];
    }
}
async function setAntilink(_0x21ae0f, _0x1e56fb, _0x3b256c) {
    try {
        const _0x12614d = await loadUserGroupData();
        if (!_0x12614d['antilink'])
            _0x12614d['antilink'] = {};
        if (!_0x12614d['antilink'][_0x21ae0f])
            _0x12614d['antilink'][_0x21ae0f] = {};
        _0x12614d['antilink'][_0x21ae0f] = {
            'enabled': _0x1e56fb === 'on',
            'action': _0x3b256c || 'delete'
        };
        await saveUserGroupData(_0x12614d);
        return !![];
    } catch (_0x2747a0) {
        console['error']('Error\x20setting\x20antilink:', _0x2747a0);
        return ![];
    }
}
async function getAntilink(_0x66170e, _0x16ac48) {
    try {
        const _0x3fc423 = await loadUserGroupData();
        if (!_0x3fc423['antilink'] || !_0x3fc423['antilink'][_0x66170e])
            return null;
        return _0x16ac48 === 'on' ? _0x3fc423['antilink'][_0x66170e] : null;
    } catch (_0x19cbe2) {
        console['error']('Error\x20getting\x20antilink:', _0x19cbe2);
        return null;
    }
}
async function removeAntilink(_0x22aff1, _0x19c635) {
    try {
        const _0x586482 = await loadUserGroupData();
        if (_0x586482['antilink'] && _0x586482['antilink'][_0x22aff1]) {
            delete _0x586482['antilink'][_0x22aff1];
            await saveUserGroupData(_0x586482);
        }
        return !![];
    } catch (_0x54fbc9) {
        console['error']('Error\x20removing\x20antilink:', _0x54fbc9);
        return ![];
    }
}
async function setAntitag(_0x45b593, _0x1f802e, _0x5a9306) {
    try {
        const _0x3df41e = await loadUserGroupData();
        if (!_0x3df41e['antitag'])
            _0x3df41e['antitag'] = {};
        if (!_0x3df41e['antitag'][_0x45b593])
            _0x3df41e['antitag'][_0x45b593] = {};
        _0x3df41e['antitag'][_0x45b593] = {
            'enabled': _0x1f802e === 'on',
            'action': _0x5a9306 || 'delete'
        };
        await saveUserGroupData(_0x3df41e);
        return !![];
    } catch (_0x32805e) {
        console['error']('Error\x20setting\x20antitag:', _0x32805e);
        return ![];
    }
}
async function getAntitag(_0x37d405, _0x361265) {
    try {
        const _0xf0cf41 = await loadUserGroupData();
        if (!_0xf0cf41['antitag'] || !_0xf0cf41['antitag'][_0x37d405])
            return null;
        return _0x361265 === 'on' ? _0xf0cf41['antitag'][_0x37d405] : null;
    } catch (_0x5f02cd) {
        console['error']('Error\x20getting\x20antitag:', _0x5f02cd);
        return null;
    }
}
async function removeAntitag(_0x867dc, _0xad48ae) {
    try {
        const _0x343be5 = await loadUserGroupData();
        if (_0x343be5['antitag'] && _0x343be5['antitag'][_0x867dc]) {
            delete _0x343be5['antitag'][_0x867dc];
            await saveUserGroupData(_0x343be5);
        }
        return !![];
    } catch (_0x3237d9) {
        console['error']('Error\x20removing\x20antitag:', _0x3237d9);
        return ![];
    }
}
async function incrementWarningCount(_0x578888, _0x3a1812) {
    try {
        const _0x365ee5 = await loadUserGroupData();
        if (!_0x365ee5['warnings'])
            _0x365ee5['warnings'] = {};
        if (!_0x365ee5['warnings'][_0x578888])
            _0x365ee5['warnings'][_0x578888] = {};
        if (!_0x365ee5['warnings'][_0x578888][_0x3a1812])
            _0x365ee5['warnings'][_0x578888][_0x3a1812] = 0x0;
        _0x365ee5['warnings'][_0x578888][_0x3a1812]++;
        await saveUserGroupData(_0x365ee5);
        return _0x365ee5['warnings'][_0x578888][_0x3a1812];
    } catch (_0x7c4e2a) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x7c4e2a);
        return 0x0;
    }
}
async function resetWarningCount(_0x5d3271, _0x468297) {
    try {
        const _0x22dd58 = await loadUserGroupData();
        if (_0x22dd58['warnings'] && _0x22dd58['warnings'][_0x5d3271] && _0x22dd58['warnings'][_0x5d3271][_0x468297]) {
            _0x22dd58['warnings'][_0x5d3271][_0x468297] = 0x0;
            await saveUserGroupData(_0x22dd58);
        }
        return !![];
    } catch (_0x3af2bb) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x3af2bb);
        return ![];
    }
}
async function isSudo(_0x1da662) {
    try {
        const _0x4a6103 = await loadUserGroupData();
        return _0x4a6103['sudo'] && _0x4a6103['sudo']['includes'](_0x1da662);
    } catch (_0x40ca18) {
        console['error']('Error\x20checking\x20sudo:', _0x40ca18);
        return ![];
    }
}
async function addSudo(_0x1bb55c) {
    try {
        const _0x20f433 = await loadUserGroupData();
        if (!_0x20f433['sudo'])
            _0x20f433['sudo'] = [];
        if (!_0x20f433['sudo']['includes'](_0x1bb55c)) {
            _0x20f433['sudo']['push'](_0x1bb55c);
            await saveUserGroupData(_0x20f433);
        }
        return !![];
    } catch (_0x1256dd) {
        console['error']('Error\x20adding\x20sudo:', _0x1256dd);
        return ![];
    }
}
async function removeSudo(_0x499a27) {
    try {
        const _0x25b51c = await loadUserGroupData();
        if (!_0x25b51c['sudo'])
            _0x25b51c['sudo'] = [];
        const _0x16233c = _0x25b51c['sudo']['indexOf'](_0x499a27);
        if (_0x16233c !== -0x1) {
            _0x25b51c['sudo']['splice'](_0x16233c, 0x1);
            await saveUserGroupData(_0x25b51c);
        }
        return !![];
    } catch (_0x17d795) {
        console['error']('Error\x20removing\x20sudo:', _0x17d795);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x42e2cd = await loadUserGroupData();
        return Array['isArray'](_0x42e2cd['sudo']) ? _0x42e2cd['sudo'] : [];
    } catch (_0x21fd89) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x21fd89);
        return [];
    }
}
async function addWelcome(_0x29fd7c, _0x2aa7cc, _0x35f9b1) {
    try {
        const _0x485a0d = await loadUserGroupData();
        if (!_0x485a0d['welcome'])
            _0x485a0d['welcome'] = {};
        _0x485a0d['welcome'][_0x29fd7c] = {
            'enabled': _0x2aa7cc,
            'message': _0x35f9b1 || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x485a0d);
        return !![];
    } catch (_0x5387cb) {
        console['error']('Error\x20in\x20addWelcome:', _0x5387cb);
        return ![];
    }
}
async function delWelcome(_0x162468) {
    try {
        const _0x489d0a = await loadUserGroupData();
        if (_0x489d0a['welcome'] && _0x489d0a['welcome'][_0x162468]) {
            delete _0x489d0a['welcome'][_0x162468];
            await saveUserGroupData(_0x489d0a);
        }
        return !![];
    } catch (_0x168f41) {
        console['error']('Error\x20in\x20delWelcome:', _0x168f41);
        return ![];
    }
}
async function isWelcomeOn(_0x4b80a2) {
    try {
        const _0x3762d7 = await loadUserGroupData();
        return _0x3762d7['welcome'] && _0x3762d7['welcome'][_0x4b80a2] && _0x3762d7['welcome'][_0x4b80a2]['enabled'];
    } catch (_0x1228d9) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x1228d9);
        return ![];
    }
}
async function addGoodbye(_0x15482b, _0x51b7bb, _0x2c29f5) {
    try {
        const _0x5b765c = await loadUserGroupData();
        if (!_0x5b765c['goodbye'])
            _0x5b765c['goodbye'] = {};
        _0x5b765c['goodbye'][_0x15482b] = {
            'enabled': _0x51b7bb,
            'message': _0x2c29f5 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x5b765c);
        return !![];
    } catch (_0x51fd61) {
        console['error']('Error\x20in\x20addGoodbye:', _0x51fd61);
        return ![];
    }
}
async function delGoodBye(_0x21a99f) {
    try {
        const _0x16b5d0 = await loadUserGroupData();
        if (_0x16b5d0['goodbye'] && _0x16b5d0['goodbye'][_0x21a99f]) {
            delete _0x16b5d0['goodbye'][_0x21a99f];
            await saveUserGroupData(_0x16b5d0);
        }
        return !![];
    } catch (_0x9307d1) {
        console['error']('Error\x20in\x20delGoodBye:', _0x9307d1);
        return ![];
    }
}
async function isGoodByeOn(_0x13d80f) {
    try {
        const _0x2415cc = await loadUserGroupData();
        return _0x2415cc['goodbye'] && _0x2415cc['goodbye'][_0x13d80f] && _0x2415cc['goodbye'][_0x13d80f]['enabled'];
    } catch (_0x592373) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x592373);
        return ![];
    }
}
async function getWelcome(_0x262b74) {
    try {
        const _0x2c6c35 = await loadUserGroupData();
        return _0x2c6c35['welcome'] && _0x2c6c35['welcome'][_0x262b74] ? _0x2c6c35['welcome'][_0x262b74]['message'] : null;
    } catch (_0x3698c4) {
        console['error']('Error\x20in\x20getWelcome:', _0x3698c4);
        return null;
    }
}
async function getGoodbye(_0x21eee5) {
    try {
        const _0x8a8493 = await loadUserGroupData();
        return _0x8a8493['goodbye'] && _0x8a8493['goodbye'][_0x21eee5] ? _0x8a8493['goodbye'][_0x21eee5]['message'] : null;
    } catch (_0x2caf56) {
        console['error']('Error\x20in\x20getGoodbye:', _0x2caf56);
        return null;
    }
}
async function setAntiBadword(_0x225756, _0xee395c, _0x313ea5) {
    try {
        const _0x30fcd0 = await loadUserGroupData();
        if (!_0x30fcd0['antibadword'])
            _0x30fcd0['antibadword'] = {};
        if (!_0x30fcd0['antibadword'][_0x225756])
            _0x30fcd0['antibadword'][_0x225756] = {};
        _0x30fcd0['antibadword'][_0x225756] = {
            'enabled': _0xee395c === 'on',
            'action': _0x313ea5 || 'delete'
        };
        await saveUserGroupData(_0x30fcd0);
        return !![];
    } catch (_0x37df54) {
        console['error']('Error\x20setting\x20antibadword:', _0x37df54);
        return ![];
    }
}
async function getAntiBadword(_0x3da35e, _0x519ecf) {
    try {
        const _0x45d0bb = await loadUserGroupData();
        if (!_0x45d0bb['antibadword'] || !_0x45d0bb['antibadword'][_0x3da35e]) {
            return null;
        }
        const _0x2709aa = _0x45d0bb['antibadword'][_0x3da35e];
        return _0x519ecf === 'on' ? _0x2709aa : null;
    } catch (_0x2c6051) {
        console['error']('Error\x20getting\x20antibadword:', _0x2c6051);
        return null;
    }
}
async function removeAntiBadword(_0x1f1658, _0x2ea353) {
    try {
        const _0x5e71cb = await loadUserGroupData();
        if (_0x5e71cb['antibadword'] && _0x5e71cb['antibadword'][_0x1f1658]) {
            delete _0x5e71cb['antibadword'][_0x1f1658];
            await saveUserGroupData(_0x5e71cb);
        }
        return !![];
    } catch (_0x4c6e1d) {
        console['error']('Error\x20removing\x20antibadword:', _0x4c6e1d);
        return ![];
    }
}
async function setChatbot(_0x389935, _0x3fe985) {
    try {
        const _0x41b2f5 = await loadUserGroupData();
        if (!_0x41b2f5['chatbot'])
            _0x41b2f5['chatbot'] = {};
        _0x41b2f5['chatbot'][_0x389935] = { 'enabled': _0x3fe985 };
        await saveUserGroupData(_0x41b2f5);
        return !![];
    } catch (_0x3fc88e) {
        console['error']('Error\x20setting\x20chatbot:', _0x3fc88e);
        return ![];
    }
}
async function getChatbot(_0x155430) {
    try {
        const _0x1d47ab = await loadUserGroupData();
        return _0x1d47ab['chatbot']?.[_0x155430] || null;
    } catch (_0xe4f7a2) {
        console['error']('Error\x20getting\x20chatbot:', _0xe4f7a2);
        return null;
    }
}
async function removeChatbot(_0x54b5e5) {
    try {
        const _0x48be5d = await loadUserGroupData();
        if (_0x48be5d['chatbot'] && _0x48be5d['chatbot'][_0x54b5e5]) {
            delete _0x48be5d['chatbot'][_0x54b5e5];
            await saveUserGroupData(_0x48be5d);
        }
        return !![];
    } catch (_0x514588) {
        console['error']('Error\x20removing\x20chatbot:', _0x514588);
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