import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3af0fb from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x1da65b from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0xc321f9 = await _0x0_0x1da65b['getSetting']('global', 'userGroupData');
            return _0xc321f9?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x3af0fb['existsSync'](USER_GROUP_DATA)) {
                const _0x373e13 = JSON['parse'](_0x0_0x3af0fb['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x373e13['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x5b1826 => {
    COMMAND_REACT_ENABLED = _0x5b1826;
});
async function addCommandReaction(_0x1e556f, _0xdd478) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0xdd478?.['key']?.['id'])
        return;
    await _0x1e556f['sendMessage'](_0xdd478['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0xdd478['key']
        }
    });
}
async function setCommandReactState(_0x39c3d1) {
    COMMAND_REACT_ENABLED = _0x39c3d1;
    try {
        if (HAS_DB) {
            const _0x1dd74c = await _0x0_0x1da65b['getSetting']('global', 'userGroupData') || {};
            _0x1dd74c['autoReaction'] = _0x39c3d1;
            await _0x0_0x1da65b['saveSetting']('global', 'userGroupData', _0x1dd74c);
        } else {
            let _0x5295bc = {};
            if (_0x0_0x3af0fb['existsSync'](USER_GROUP_DATA)) {
                _0x5295bc = JSON['parse'](_0x0_0x3af0fb['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x5295bc['autoReaction'] = _0x39c3d1;
            _0x0_0x3af0fb['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x5295bc, null, 0x2));
        }
    } catch (_0x380e04) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x380e04);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};