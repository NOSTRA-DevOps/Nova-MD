import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x192af9 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x4e0217 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x4f7ddc = await _0x0_0x4e0217['getSetting']('global', 'userGroupData');
            return _0x4f7ddc?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x192af9['existsSync'](USER_GROUP_DATA)) {
                const _0x5eccbd = JSON['parse'](_0x0_0x192af9['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x5eccbd['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x4fd254 => {
    COMMAND_REACT_ENABLED = _0x4fd254;
});
async function addCommandReaction(_0x21d18b, _0x4d825b) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x4d825b?.['key']?.['id'])
        return;
    await _0x21d18b['sendMessage'](_0x4d825b['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x4d825b['key']
        }
    });
}
async function setCommandReactState(_0x4aca08) {
    COMMAND_REACT_ENABLED = _0x4aca08;
    try {
        if (HAS_DB) {
            const _0x3aaf91 = await _0x0_0x4e0217['getSetting']('global', 'userGroupData') || {};
            _0x3aaf91['autoReaction'] = _0x4aca08;
            await _0x0_0x4e0217['saveSetting']('global', 'userGroupData', _0x3aaf91);
        } else {
            let _0x438a0a = {};
            if (_0x0_0x192af9['existsSync'](USER_GROUP_DATA)) {
                _0x438a0a = JSON['parse'](_0x0_0x192af9['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x438a0a['autoReaction'] = _0x4aca08;
            _0x0_0x192af9['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x438a0a, null, 0x2));
        }
    } catch (_0x2648c8) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x2648c8);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};