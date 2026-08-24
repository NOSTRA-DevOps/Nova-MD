import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x24830e from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x5740f4 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x7304ec = await _0x0_0x5740f4['getSetting']('global', 'userGroupData');
            return _0x7304ec?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x24830e['existsSync'](USER_GROUP_DATA)) {
                const _0x3d6e22 = JSON['parse'](_0x0_0x24830e['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x3d6e22['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x4d7458 => {
    COMMAND_REACT_ENABLED = _0x4d7458;
});
async function addCommandReaction(_0x3c8bdf, _0x494ffd) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x494ffd?.['key']?.['id'])
        return;
    await _0x3c8bdf['sendMessage'](_0x494ffd['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x494ffd['key']
        }
    });
}
async function setCommandReactState(_0x4445c7) {
    COMMAND_REACT_ENABLED = _0x4445c7;
    try {
        if (HAS_DB) {
            const _0x287748 = await _0x0_0x5740f4['getSetting']('global', 'userGroupData') || {};
            _0x287748['autoReaction'] = _0x4445c7;
            await _0x0_0x5740f4['saveSetting']('global', 'userGroupData', _0x287748);
        } else {
            let _0xa2eebc = {};
            if (_0x0_0x24830e['existsSync'](USER_GROUP_DATA)) {
                _0xa2eebc = JSON['parse'](_0x0_0x24830e['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0xa2eebc['autoReaction'] = _0x4445c7;
            _0x0_0x24830e['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0xa2eebc, null, 0x2));
        }
    } catch (_0x2b504f) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x2b504f);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};