import { fileURLToPath } from 'url';
import _0x0_0x55beee, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1228de from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x495e87 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const dataPath = dataFile('userGroupData.json');
async function loadUserGroupData() {
    try {
        if (HAS_DB) {
            const _0x20b7f2 = await _0x0_0x495e87['getSetting']('global', 'userGroupData');
            return _0x20b7f2 || {
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
            if (!_0x0_0x1228de['existsSync'](dataPath)) {
                const _0x520862 = {
                    'antibadword': {},
                    'antilink': {},
                    'welcome': {},
                    'goodbye': {},
                    'chatbot': {},
                    'warnings': {},
                    'sudo': [],
                    'antitag': {}
                };
                _0x0_0x1228de['writeFileSync'](dataPath, JSON['stringify'](_0x520862, null, 0x2));
                return _0x520862;
            }
            const _0x4ed1e2 = JSON['parse'](_0x0_0x1228de['readFileSync'](dataPath, 'utf8'));
            return _0x4ed1e2;
        }
    } catch (_0x10a34e) {
        console['error']('Error\x20loading\x20user\x20group\x20data:', _0x10a34e);
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
async function saveUserGroupData(_0x304c47) {
    try {
        if (HAS_DB) {
            await _0x0_0x495e87['saveSetting']('global', 'userGroupData', _0x304c47);
        } else {
            const _0x56b03a = _0x0_0x55beee['dirname'](dataPath);
            if (!_0x0_0x1228de['existsSync'](_0x56b03a)) {
                _0x0_0x1228de['mkdirSync'](_0x56b03a, { 'recursive': !![] });
            }
            _0x0_0x1228de['writeFileSync'](dataPath, JSON['stringify'](_0x304c47, null, 0x2));
        }
        return !![];
    } catch (_0x340de2) {
        console['error']('Error\x20saving\x20user\x20group\x20data:', _0x340de2);
        return ![];
    }
}
async function setAntilink(_0xff71ca, _0xa94fac, _0x172dc8) {
    try {
        const _0x19bd27 = await loadUserGroupData();
        if (!_0x19bd27['antilink'])
            _0x19bd27['antilink'] = {};
        if (!_0x19bd27['antilink'][_0xff71ca])
            _0x19bd27['antilink'][_0xff71ca] = {};
        _0x19bd27['antilink'][_0xff71ca] = {
            'enabled': _0xa94fac === 'on',
            'action': _0x172dc8 || 'delete'
        };
        await saveUserGroupData(_0x19bd27);
        return !![];
    } catch (_0x31f6c2) {
        console['error']('Error\x20setting\x20antilink:', _0x31f6c2);
        return ![];
    }
}
async function getAntilink(_0x1e67b7, _0x5801d9) {
    try {
        const _0x1110b1 = await loadUserGroupData();
        if (!_0x1110b1['antilink'] || !_0x1110b1['antilink'][_0x1e67b7])
            return null;
        return _0x5801d9 === 'on' ? _0x1110b1['antilink'][_0x1e67b7] : null;
    } catch (_0x3f23b2) {
        console['error']('Error\x20getting\x20antilink:', _0x3f23b2);
        return null;
    }
}
async function removeAntilink(_0x34b5b0, _0x44a926) {
    try {
        const _0x2dbcb8 = await loadUserGroupData();
        if (_0x2dbcb8['antilink'] && _0x2dbcb8['antilink'][_0x34b5b0]) {
            delete _0x2dbcb8['antilink'][_0x34b5b0];
            await saveUserGroupData(_0x2dbcb8);
        }
        return !![];
    } catch (_0x44aec0) {
        console['error']('Error\x20removing\x20antilink:', _0x44aec0);
        return ![];
    }
}
async function setAntitag(_0x2504b1, _0x20909f, _0x509191) {
    try {
        const _0x1a1298 = await loadUserGroupData();
        if (!_0x1a1298['antitag'])
            _0x1a1298['antitag'] = {};
        if (!_0x1a1298['antitag'][_0x2504b1])
            _0x1a1298['antitag'][_0x2504b1] = {};
        _0x1a1298['antitag'][_0x2504b1] = {
            'enabled': _0x20909f === 'on',
            'action': _0x509191 || 'delete'
        };
        await saveUserGroupData(_0x1a1298);
        return !![];
    } catch (_0xd8bbc5) {
        console['error']('Error\x20setting\x20antitag:', _0xd8bbc5);
        return ![];
    }
}
async function getAntitag(_0x466f1f, _0x1c2ce5) {
    try {
        const _0x5147b6 = await loadUserGroupData();
        if (!_0x5147b6['antitag'] || !_0x5147b6['antitag'][_0x466f1f])
            return null;
        return _0x1c2ce5 === 'on' ? _0x5147b6['antitag'][_0x466f1f] : null;
    } catch (_0x19b754) {
        console['error']('Error\x20getting\x20antitag:', _0x19b754);
        return null;
    }
}
async function removeAntitag(_0x37c161, _0x17c443) {
    try {
        const _0x2240e2 = await loadUserGroupData();
        if (_0x2240e2['antitag'] && _0x2240e2['antitag'][_0x37c161]) {
            delete _0x2240e2['antitag'][_0x37c161];
            await saveUserGroupData(_0x2240e2);
        }
        return !![];
    } catch (_0x3d2fcd) {
        console['error']('Error\x20removing\x20antitag:', _0x3d2fcd);
        return ![];
    }
}
async function incrementWarningCount(_0x36546f, _0x14fa15) {
    try {
        const _0x24bd44 = await loadUserGroupData();
        if (!_0x24bd44['warnings'])
            _0x24bd44['warnings'] = {};
        if (!_0x24bd44['warnings'][_0x36546f])
            _0x24bd44['warnings'][_0x36546f] = {};
        if (!_0x24bd44['warnings'][_0x36546f][_0x14fa15])
            _0x24bd44['warnings'][_0x36546f][_0x14fa15] = 0x0;
        _0x24bd44['warnings'][_0x36546f][_0x14fa15]++;
        await saveUserGroupData(_0x24bd44);
        return _0x24bd44['warnings'][_0x36546f][_0x14fa15];
    } catch (_0x27edd8) {
        console['error']('Error\x20incrementing\x20warning\x20count:', _0x27edd8);
        return 0x0;
    }
}
async function resetWarningCount(_0x2f8d11, _0xb8d278) {
    try {
        const _0x387d04 = await loadUserGroupData();
        if (_0x387d04['warnings'] && _0x387d04['warnings'][_0x2f8d11] && _0x387d04['warnings'][_0x2f8d11][_0xb8d278]) {
            _0x387d04['warnings'][_0x2f8d11][_0xb8d278] = 0x0;
            await saveUserGroupData(_0x387d04);
        }
        return !![];
    } catch (_0x52d4b1) {
        console['error']('Error\x20resetting\x20warning\x20count:', _0x52d4b1);
        return ![];
    }
}
async function isSudo(_0x458eec) {
    try {
        const _0x106f15 = await loadUserGroupData();
        return _0x106f15['sudo'] && _0x106f15['sudo']['includes'](_0x458eec);
    } catch (_0x1e51e1) {
        console['error']('Error\x20checking\x20sudo:', _0x1e51e1);
        return ![];
    }
}
async function addSudo(_0x5d68b4) {
    try {
        const _0x3b9760 = await loadUserGroupData();
        if (!_0x3b9760['sudo'])
            _0x3b9760['sudo'] = [];
        if (!_0x3b9760['sudo']['includes'](_0x5d68b4)) {
            _0x3b9760['sudo']['push'](_0x5d68b4);
            await saveUserGroupData(_0x3b9760);
        }
        return !![];
    } catch (_0x3764fc) {
        console['error']('Error\x20adding\x20sudo:', _0x3764fc);
        return ![];
    }
}
async function removeSudo(_0x20f096) {
    try {
        const _0x2dda32 = await loadUserGroupData();
        if (!_0x2dda32['sudo'])
            _0x2dda32['sudo'] = [];
        const _0x12c42f = _0x2dda32['sudo']['indexOf'](_0x20f096);
        if (_0x12c42f !== -0x1) {
            _0x2dda32['sudo']['splice'](_0x12c42f, 0x1);
            await saveUserGroupData(_0x2dda32);
        }
        return !![];
    } catch (_0x18dd96) {
        console['error']('Error\x20removing\x20sudo:', _0x18dd96);
        return ![];
    }
}
async function getSudoList() {
    try {
        const _0x473169 = await loadUserGroupData();
        return Array['isArray'](_0x473169['sudo']) ? _0x473169['sudo'] : [];
    } catch (_0x4eb508) {
        console['error']('Error\x20getting\x20sudo\x20list:', _0x4eb508);
        return [];
    }
}
async function addWelcome(_0x482ca6, _0x511997, _0x2dbdba) {
    try {
        const _0x166be9 = await loadUserGroupData();
        if (!_0x166be9['welcome'])
            _0x166be9['welcome'] = {};
        _0x166be9['welcome'][_0x482ca6] = {
            'enabled': _0x511997,
            'message': _0x2dbdba || '╔═⚔️\x20WELCOME\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20📜\x20Message:\x0a║\x20{description}\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x166be9);
        return !![];
    } catch (_0x2cdcf8) {
        console['error']('Error\x20in\x20addWelcome:', _0x2cdcf8);
        return ![];
    }
}
async function delWelcome(_0x294192) {
    try {
        const _0xf5dc07 = await loadUserGroupData();
        if (_0xf5dc07['welcome'] && _0xf5dc07['welcome'][_0x294192]) {
            delete _0xf5dc07['welcome'][_0x294192];
            await saveUserGroupData(_0xf5dc07);
        }
        return !![];
    } catch (_0x31abd2) {
        console['error']('Error\x20in\x20delWelcome:', _0x31abd2);
        return ![];
    }
}
async function isWelcomeOn(_0x1561e5) {
    try {
        const _0x275f95 = await loadUserGroupData();
        return _0x275f95['welcome'] && _0x275f95['welcome'][_0x1561e5] && _0x275f95['welcome'][_0x1561e5]['enabled'];
    } catch (_0x27b3fe) {
        console['error']('Error\x20in\x20isWelcomeOn:', _0x27b3fe);
        return ![];
    }
}
async function addGoodbye(_0x4767e3, _0x41e416, _0x58759d) {
    try {
        const _0x32dad2 = await loadUserGroupData();
        if (!_0x32dad2['goodbye'])
            _0x32dad2['goodbye'] = {};
        _0x32dad2['goodbye'][_0x4767e3] = {
            'enabled': _0x41e416,
            'message': _0x58759d || '╔═⚔️\x20GOODBYE\x20⚔️═╗\x0a║\x20🛡️\x20User:\x20{user}\x0a║\x20🏰\x20Kingdom:\x20{group}\x0a╠═══════════════╣\x0a║\x20⚰️\x20We\x20will\x20never\x20miss\x20you!\x0a╚═══════════════╝',
            'channelId': '120363429019355682@newsletter'
        };
        await saveUserGroupData(_0x32dad2);
        return !![];
    } catch (_0x503f9e) {
        console['error']('Error\x20in\x20addGoodbye:', _0x503f9e);
        return ![];
    }
}
async function delGoodBye(_0xde4a6c) {
    try {
        const _0x5a03ba = await loadUserGroupData();
        if (_0x5a03ba['goodbye'] && _0x5a03ba['goodbye'][_0xde4a6c]) {
            delete _0x5a03ba['goodbye'][_0xde4a6c];
            await saveUserGroupData(_0x5a03ba);
        }
        return !![];
    } catch (_0x36cb4d) {
        console['error']('Error\x20in\x20delGoodBye:', _0x36cb4d);
        return ![];
    }
}
async function isGoodByeOn(_0x1c7c45) {
    try {
        const _0x1d4314 = await loadUserGroupData();
        return _0x1d4314['goodbye'] && _0x1d4314['goodbye'][_0x1c7c45] && _0x1d4314['goodbye'][_0x1c7c45]['enabled'];
    } catch (_0x4dc5a1) {
        console['error']('Error\x20in\x20isGoodByeOn:', _0x4dc5a1);
        return ![];
    }
}
async function getWelcome(_0x50e098) {
    try {
        const _0x185418 = await loadUserGroupData();
        return _0x185418['welcome'] && _0x185418['welcome'][_0x50e098] ? _0x185418['welcome'][_0x50e098]['message'] : null;
    } catch (_0xd20ca5) {
        console['error']('Error\x20in\x20getWelcome:', _0xd20ca5);
        return null;
    }
}
async function getGoodbye(_0x3d4cfa) {
    try {
        const _0x1e9333 = await loadUserGroupData();
        return _0x1e9333['goodbye'] && _0x1e9333['goodbye'][_0x3d4cfa] ? _0x1e9333['goodbye'][_0x3d4cfa]['message'] : null;
    } catch (_0x5e1c01) {
        console['error']('Error\x20in\x20getGoodbye:', _0x5e1c01);
        return null;
    }
}
async function setAntiBadword(_0x443922, _0x2b616e, _0xd61a23) {
    try {
        const _0x57a96a = await loadUserGroupData();
        if (!_0x57a96a['antibadword'])
            _0x57a96a['antibadword'] = {};
        if (!_0x57a96a['antibadword'][_0x443922])
            _0x57a96a['antibadword'][_0x443922] = {};
        _0x57a96a['antibadword'][_0x443922] = {
            'enabled': _0x2b616e === 'on',
            'action': _0xd61a23 || 'delete'
        };
        await saveUserGroupData(_0x57a96a);
        return !![];
    } catch (_0x2d7443) {
        console['error']('Error\x20setting\x20antibadword:', _0x2d7443);
        return ![];
    }
}
async function getAntiBadword(_0x590643, _0x5ad3c3) {
    try {
        const _0x3f5e85 = await loadUserGroupData();
        if (!_0x3f5e85['antibadword'] || !_0x3f5e85['antibadword'][_0x590643]) {
            return null;
        }
        const _0x39cbad = _0x3f5e85['antibadword'][_0x590643];
        return _0x5ad3c3 === 'on' ? _0x39cbad : null;
    } catch (_0x1f7e1c) {
        console['error']('Error\x20getting\x20antibadword:', _0x1f7e1c);
        return null;
    }
}
async function removeAntiBadword(_0x1a77bf, _0x132182) {
    try {
        const _0x480532 = await loadUserGroupData();
        if (_0x480532['antibadword'] && _0x480532['antibadword'][_0x1a77bf]) {
            delete _0x480532['antibadword'][_0x1a77bf];
            await saveUserGroupData(_0x480532);
        }
        return !![];
    } catch (_0x5f63cd) {
        console['error']('Error\x20removing\x20antibadword:', _0x5f63cd);
        return ![];
    }
}
async function setChatbot(_0x382d72, _0x6d5238) {
    try {
        const _0x480e2d = await loadUserGroupData();
        if (!_0x480e2d['chatbot'])
            _0x480e2d['chatbot'] = {};
        _0x480e2d['chatbot'][_0x382d72] = { 'enabled': _0x6d5238 };
        await saveUserGroupData(_0x480e2d);
        return !![];
    } catch (_0x5b9be4) {
        console['error']('Error\x20setting\x20chatbot:', _0x5b9be4);
        return ![];
    }
}
async function getChatbot(_0x3a1926) {
    try {
        const _0x169ece = await loadUserGroupData();
        return _0x169ece['chatbot']?.[_0x3a1926] || null;
    } catch (_0x470340) {
        console['error']('Error\x20getting\x20chatbot:', _0x470340);
        return null;
    }
}
async function removeChatbot(_0x4b77e2) {
    try {
        const _0x2e92f7 = await loadUserGroupData();
        if (_0x2e92f7['chatbot'] && _0x2e92f7['chatbot'][_0x4b77e2]) {
            delete _0x2e92f7['chatbot'][_0x4b77e2];
            await saveUserGroupData(_0x2e92f7);
        }
        return !![];
    } catch (_0x55feec) {
        console['error']('Error\x20removing\x20chatbot:', _0x55feec);
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