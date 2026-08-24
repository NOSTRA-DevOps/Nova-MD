import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x48a8cc from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x2a2569 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0xbf5918 = await _0x0_0x2a2569['getSetting']('global', 'userGroupData');
            return _0xbf5918?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x48a8cc['existsSync'](USER_GROUP_DATA)) {
                const _0xad21c7 = JSON['parse'](_0x0_0x48a8cc['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0xad21c7['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x5a42ec => {
    COMMAND_REACT_ENABLED = _0x5a42ec;
});
async function addCommandReaction(_0x17bce8, _0x3bcfe5) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x3bcfe5?.['key']?.['id'])
        return;
    await _0x17bce8['sendMessage'](_0x3bcfe5['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x3bcfe5['key']
        }
    });
}
async function setCommandReactState(_0x523e33) {
    COMMAND_REACT_ENABLED = _0x523e33;
    try {
        if (HAS_DB) {
            const _0x5a4e17 = await _0x0_0x2a2569['getSetting']('global', 'userGroupData') || {};
            _0x5a4e17['autoReaction'] = _0x523e33;
            await _0x0_0x2a2569['saveSetting']('global', 'userGroupData', _0x5a4e17);
        } else {
            let _0x413375 = {};
            if (_0x0_0x48a8cc['existsSync'](USER_GROUP_DATA)) {
                _0x413375 = JSON['parse'](_0x0_0x48a8cc['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x413375['autoReaction'] = _0x523e33;
            _0x0_0x48a8cc['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x413375, null, 0x2));
        }
    } catch (_0x3aa354) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x3aa354);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};