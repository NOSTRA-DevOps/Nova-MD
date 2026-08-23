import { fileURLToPath } from 'url';
import _0x0_0x40beaa, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5ed959 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x4bc109 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x3b87a0 = await _0x0_0x4bc109['getSetting']('global', 'userGroupData');
            return _0x3b87a0 || {
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
            if (!_0x0_0x5ed959['existsSync'](dataPath)) {
                const _0x1727cd = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x5ed959['writeFileSync'](dataPath, JSON['stringify'](_0x1727cd, null, 0x2));
                return _0x1727cd;
            }
            const _0x67cfc2 = JSON['parse'](_0x0_0x5ed959['readFileSync'](dataPath, 'utf8'));
            return _0x67cfc2;
        }
    } catch (_0x14ea27) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x14ea27);
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
async function saveUserGroupData(_0xe6cdc6) {
    try {
        if (HAS_DB) {
            await _0x0_0x4bc109['saveSetting']('global', 'userGroupData', _0xe6cdc6);
        } else {
            const _0x117cfd = _0x0_0x40beaa['dirname'](dataPath);
            if (!_0x0_0x5ed959['existsSync'](_0x117cfd)) {
                _0x0_0x5ed959['mkdirSync'](_0x117cfd, { 'recursive': !![] });
            }
            _0x0_0x5ed959['writeFileSync'](dataPath, JSON['stringify'](_0xe6cdc6, null, 0x2));
        }
        return !![];
    } catch (_0x11f595) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x11f595);
        return ![];
    }
}
async function setAntilink(_0x4df86c, _0xbf1a95, _0x503499) {
    try {
        const _0x578246 = await loadUserGroupData();
        if (!_0x578246['antilink'])
            _0x578246['antilink'] = {};
        if (!_0x578246['antilink'][_0x4df86c])
            _0x578246['antilink'][_0x4df86c] = {};
        _0x578246['antilink'][_0x4df86c] = {
            'enabled': _0xbf1a95 === 'on',
            'action': _0x503499 || 'delete'
        };
        await saveUserGroupData(_0x578246);
        return !![];
    } catch (_0x1d4007) {
        console['error']('Error\x20setting\x20antilink:', _0x1d4007);
        return ![];
    }
}
async function getAntilink(_0x18de48, _0x4b335d) {
    try {
        const _0x189708 = await loadUserGroupData();
        if (!_0x189708['antilink'] || !_0x189708['antilink'][_0x18de48])
            return null;
        return _0x4b335d === 'on' ? _0x189708['antilink'][_0x18de48] : null;
    } catch (_0x14af89) {
        console['error']('Error\x20getting\x20antilink:', _0x14af89);
        return null;
    }
}
async function removeAntilink(_0x55f098, _0x570146) {
    try {
        const _0x5ccc6e = await loadUserGroupData();
        if (_0x5ccc6e['antilink'] && _0x5ccc6e['antilink'][_0x55f098]) {
            delete _0x5ccc6e['antilink'][_0x55f098];
            await saveUserGroupData(_0x5ccc6e);
        }
        return !![];
    } catch (_0x5b2cd0) {
        console['error']('Error\x20removing\x20antilink:', _0x5b2cd0);
        return ![];
    }
}
async function setAntitag(_0x2ddd52, _0x550e5f, _0x28c498) {
    try {
        const _0x35df50 = await loadUserGroupData();
        if (!_0x35df50['antitag'])
            _0x35df50['antitag'] = {};
        if (!_0x35df50['antitag'][_0x2ddd52])
            _0x35df50['antitag'][_0x2ddd52] = {};
        _0x35df50['antitag'][_0x2ddd52] = {
            'enabled': _0x550e5f === 'on',
            'action': _0x28c498 || 'delete'
        };
        await saveUserGroupData(_0x35df50);
        return !![];
    } catch (_0x50a461) {
        console['error']('Error\x20setting\x20antitag:', _0x50a461);
        return ![];
    }
}
async function getAntitag(_0x2dca19, _0x246a9f) {
    try {
        const _0xb3977c = await loadUserGroupData();
        if (!_0xb3977c['antitag'] || !_0xb3977c['antitag'][_0x2dca19])
            return null;
        return _0x246a9f === 'on' ? _0xb3977c['antitag'][_0x2dca19] : null;
    } catch (_0x2e8dc3) {
        console['error']('Error\x20getting\x20antitag:', _0x2e8dc3);
        return null;
    }
}
async function removeAntitag(_0x5dddb2, _0x31ea02) {
    try {
        const _0xaeaa7 = await loadUserGroupData();
        if (_0xaeaa7['antitag'] && _0xaeaa7['antitag'][_0x5dddb2]) {
            delete _0xaeaa7['antitag'][_0x5dddb2];
            await saveUserGroupData(_0xaeaa7);
        }
        return !![];
    } catch (_0x340831) {
        console['error']('Error\x20removing\x20antitag:', _0x340831);
        return ![];
    }
}
async function incrementWarningCount(_0x50b483, _0x19836c) {
    try {
        const _0x6743ea = await loadUserGroupData();
        if (!_0x6743ea['warnings'])
            _0x6743ea['warnings'] = {};
        if (!_0x6743ea['warnings'][_0x50b483])
            _0x6743ea['warnings'][_0x50b483] = {};
        if (!_0x6743ea['warnings'][_0x50b483][_0x19836c])
            _0x6743ea['warnings'][_0x50b483][_0x19836c] = 0x0;
        _0x6743ea['warnings'][_0x50b483][_0x19836c]++;
        await saveUserGroupData(_0x6743ea);
        return _0x6743ea['warnings'][_0x50b483][_0x19836c];
    } catch (_0x41bc59) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x41bc59);
        return 0x0;
    }
}
async function resetWarningCount(_0x471846, _0x5399e3) {
    try {
        const _0x4961b5 = await loadUserGroupData();
        if (_0x4961b5['warnings'] && _0x4961b5['warnings'][_0x471846] && _0x4961b5['warnings'][_0x471846][_0x5399e3]) {
            _0x4961b5['warnings'][_0x471846][_0x5399e3] = 0x0;
            await saveUserGroupData(_0x4961b5);
        }
        return !![];
    } catch (_0x263066) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x263066);
        return ![];
    }
}
async function isSudo(_0x484bdf) {
    try {
        const _0x1f949c = await loadUserGroupData();
        return _0x1f949c['sudo'] && _0x1f949c['sudo']['includes'](_0x484bdf);
    } catch (_0x134f22) {
        console['error']('Error\x20checking\x20sudo:', _0x134f22);
        return ![];
    }
}
async function addSudo(_0x2b121b) {
    try {
        const _0x172d76 = await loadUserGroupData();
        if (!_0x172d76['sudo'])
            _0x172d76['sudo'] = [];
        if (!_0x172d76['sudo']['includes'](_0x2b121b)) {
            _0x172d76['sudo']['push'](_0x2b121b);
            await saveUserGroupData(_0x172d76);
        }
        return !![];
    } catch (_0x4f7c70) {
        console['error']('Error\x20adding\x20sudo:', _0x4f7c70);
        return ![];
    }
}
async function removeSudo(_0x2f5b76) {
    try {
        const _0x47ffb5 = await loadUserGroupData();
        if (!_0x47ffb5['sudo'])
            _0x47ffb5['sudo'] = [];
        const _0x5eac66 = _0x47ffb5['sudo']['indexOf'](_0x2f5b76);
        if (_0x5eac66 !== -0x1) {
            _0x47ffb5['sudo']['splice'](_0x5eac66, 0x1);
            await saveUserGroupData(_0x47ffb5);
        }
        return !![];
    } catch (_0x387c5b) {
        console['error']('Error\x20removing\x20sudo:', _0x387c5b);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x9db090 = await loadUserGroupData();
        return Array['isArray'](_0x9db090['sudo']) ? _0x9db090['sudo'] : [];
    } catch (_0x12c844) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x12c844);
        return [];
    }
}
async function addWelcome(_0x111bb5, _0x295c47, _0x37206d) {
    try {
        const _0x368723 = await loadUserGroupData();
        if (!_0x368723['welcome'])
            _0x368723['welcome'] = {};
        _0x368723['welcome'][_0x111bb5] = {
            'enabled': _0x295c47,
            'message': _0x37206d || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x368723);
        return !![];
    } catch (_0x62a50e) {
        console['error']('Error\x20in\x20addWelcome:', _0x62a50e);
        return ![];
    }
}
async function delWelcome(_0x46e60c) {
    try {
        const _0x15788b = await loadUserGroupData();
        if (_0x15788b['welcome'] && _0x15788b['welcome'][_0x46e60c]) {
            delete _0x15788b['welcome'][_0x46e60c];
            await saveUserGroupData(_0x15788b);
        }
        return !![];
    } catch (_0x14e28d) {
        console['error']('Error\x20in\x20delWelcome:', _0x14e28d);
        return ![];
    }
}
async function isWelcomeOn(_0x332b17) {
    try {
        const _0x3e56f0 = await loadUserGroupData();
        return _0x3e56f0['welcome'] && _0x3e56f0['welcome'][_0x332b17] && _0x3e56f0['welcome'][_0x332b17]['enabled'];
    } catch (_0xb4c693) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0xb4c693);
        return ![];
    }
}
async function addGoodbye(_0x2ed952, _0x5c9ea3, _0x583bb8) {
    try {
        const _0x3a8919 = await loadUserGroupData();
        if (!_0x3a8919['goodbye'])
            _0x3a8919['goodbye'] = {};
        _0x3a8919['goodbye'][_0x2ed952] = {
            'enabled': _0x5c9ea3,
            'message': _0x583bb8 || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x3a8919);
        return !![];
    } catch (_0x3ff207) {
        console['error']('Error\x20in\x20addGoodbye:', _0x3ff207);
        return ![];
    }
}
async function delGoodBye(_0x422b0e) {
    try {
        const _0x2fce17 = await loadUserGroupData();
        if (_0x2fce17['goodbye'] && _0x2fce17['goodbye'][_0x422b0e]) {
            delete _0x2fce17['goodbye'][_0x422b0e];
            await saveUserGroupData(_0x2fce17);
        }
        return !![];
    } catch (_0x416378) {
        console['error']('Error\x20in\x20delGoodBye:', _0x416378);
        return ![];
    }
}
async function isGoodByeOn(_0x5c0704) {
    try {
        const _0x14ef5d = await loadUserGroupData();
        return _0x14ef5d['goodbye'] && _0x14ef5d['goodbye'][_0x5c0704] && _0x14ef5d['goodbye'][_0x5c0704]['enabled'];
    } catch (_0x267ce7) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x267ce7);
        return ![];
    }
}
async function getWelcome(_0x16907a) {
    try {
        const _0x262b88 = await loadUserGroupData();
        return _0x262b88['welcome'] && _0x262b88['welcome'][_0x16907a] ? _0x262b88['welcome'][_0x16907a]['message'] : null;
    } catch (_0x54aea7) {
        console['error']('Error\x20in\x20getWelcome:', _0x54aea7);
        return null;
    }
}
async function getGoodbye(_0x40fffe) {
    try {
        const _0x2c4326 = await loadUserGroupData();
        return _0x2c4326['goodbye'] && _0x2c4326['goodbye'][_0x40fffe] ? _0x2c4326['goodbye'][_0x40fffe]['message'] : null;
    } catch (_0x16c9a8) {
        console['error']('Error\x20in\x20getGoodbye:', _0x16c9a8);
        return null;
    }
}
async function setAntiBadword(_0x54bebc, _0x3955d7, _0x5820b9) {
    try {
        const _0x3e8c42 = await loadUserGroupData();
        if (!_0x3e8c42['antibadword'])
            _0x3e8c42['antibadword'] = {};
        if (!_0x3e8c42['antibadword'][_0x54bebc])
            _0x3e8c42['antibadword'][_0x54bebc] = {};
        _0x3e8c42['antibadword'][_0x54bebc] = {
            'enabled': _0x3955d7 === 'on',
            'action': _0x5820b9 || 'delete'
        };
        await saveUserGroupData(_0x3e8c42);
        return !![];
    } catch (_0x448243) {
        console['error']('Error\x20setting\x20antibadword:', _0x448243);
        return ![];
    }
}
async function getAntiBadword(_0x503a8f, _0x45d41b) {
    try {
        const _0x104b61 = await loadUserGroupData();
        if (!_0x104b61['antibadword'] || !_0x104b61['antibadword'][_0x503a8f]) {
            return null;
        }
        const _0x1e8f3f = _0x104b61['antibadword'][_0x503a8f];
        return _0x45d41b === 'on' ? _0x1e8f3f : null;
    } catch (_0x49b645) {
        console['error']('Error\x20getting\x20antibadword:', _0x49b645);
        return null;
    }
}
async function removeAntiBadword(_0x548839, _0x4af69a) {
    try {
        const _0x2217cc = await loadUserGroupData();
        if (_0x2217cc['antibadword'] && _0x2217cc['antibadword'][_0x548839]) {
            delete _0x2217cc['antibadword'][_0x548839];
            await saveUserGroupData(_0x2217cc);
        }
        return !![];
    } catch (_0x507ec2) {
        console['error']('Error\x20removing\x20antibadword:', _0x507ec2);
        return ![];
    }
}
async function setChatbot(_0x43d783, _0x5f56b6) {
    try {
        const _0x25933a = await loadUserGroupData();
        if (!_0x25933a['chatbot'])
            _0x25933a['chatbot'] = {};
        _0x25933a['chatbot'][_0x43d783] = { 'enabled': _0x5f56b6 };
        await saveUserGroupData(_0x25933a);
        return !![];
    } catch (_0x2d2cda) {
        console['error']('Error\x20setting\x20chatbot:', _0x2d2cda);
        return ![];
    }
}
async function getChatbot(_0x11e25e) {
    try {
        const _0x97f279 = await loadUserGroupData();
        return _0x97f279['chatbot']?.[_0x11e25e] || null;
    } catch (_0x4f3884) {
        console['error']('Error\x20getting\x20chatbot:', _0x4f3884);
        return null;
    }
}
async function removeChatbot(_0x1e0248) {
    try {
        const _0x440d2b = await loadUserGroupData();
        if (_0x440d2b['chatbot'] && _0x440d2b['chatbot'][_0x1e0248]) {
            delete _0x440d2b['chatbot'][_0x1e0248];
            await saveUserGroupData(_0x440d2b);
        }
        return !![];
    } catch (_0x188b3b) {
        console['error']('Error\x20removing\x20chatbot:', _0x188b3b);
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