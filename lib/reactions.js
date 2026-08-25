import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x4d3244 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x38ca94 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x2daa2e = await _0x0_0x38ca94['getSetting']('global', 'userGroupData');
            return _0x2daa2e?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x4d3244['existsSync'](USER_GROUP_DATA)) {
                const _0x13caac = JSON['parse'](_0x0_0x4d3244['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x13caac['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x2400b0 => {
    COMMAND_REACT_ENABLED = _0x2400b0;
});
async function addCommandReaction(_0x48f683, _0xfeac75) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0xfeac75?.['key']?.['id'])
        return;
    await _0x48f683['sendMessage'](_0xfeac75['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0xfeac75['key']
        }
    });
}
async function setCommandReactState(_0x278d38) {
    COMMAND_REACT_ENABLED = _0x278d38;
    try {
        if (HAS_DB) {
            const _0xe7949 = await _0x0_0x38ca94['getSetting']('global', 'userGroupData') || {};
            _0xe7949['autoReaction'] = _0x278d38;
            await _0x0_0x38ca94['saveSetting']('global', 'userGroupData', _0xe7949);
        } else {
            let _0x2bc530 = {};
            if (_0x0_0x4d3244['existsSync'](USER_GROUP_DATA)) {
                _0x2bc530 = JSON['parse'](_0x0_0x4d3244['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x2bc530['autoReaction'] = _0x278d38;
            _0x0_0x4d3244['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x2bc530, null, 0x2));
        }
    } catch (_0x1737a7) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x1737a7);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};