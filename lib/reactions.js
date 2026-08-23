import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3c7f37 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x4e48cb from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x7580f7 = await _0x0_0x4e48cb['getSetting']('global', 'userGroupData');
            return _0x7580f7?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x3c7f37['existsSync'](USER_GROUP_DATA)) {
                const _0x1ac168 = JSON['parse'](_0x0_0x3c7f37['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x1ac168['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x4907db => {
    COMMAND_REACT_ENABLED = _0x4907db;
});
async function addCommandReaction(_0x38c2a4, _0x33f44f) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x33f44f?.['key']?.['id'])
        return;
    await _0x38c2a4['sendMessage'](_0x33f44f['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x33f44f['key']
        }
    });
}
async function setCommandReactState(_0x5dd144) {
    COMMAND_REACT_ENABLED = _0x5dd144;
    try {
        if (HAS_DB) {
            const _0x4fbd54 = await _0x0_0x4e48cb['getSetting']('global', 'userGroupData') || {};
            _0x4fbd54['autoReaction'] = _0x5dd144;
            await _0x0_0x4e48cb['saveSetting']('global', 'userGroupData', _0x4fbd54);
        } else {
            let _0x159666 = {};
            if (_0x0_0x3c7f37['existsSync'](USER_GROUP_DATA)) {
                _0x159666 = JSON['parse'](_0x0_0x3c7f37['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x159666['autoReaction'] = _0x5dd144;
            _0x0_0x3c7f37['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x159666, null, 0x2));
        }
    } catch (_0x2dbc66) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x2dbc66);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};