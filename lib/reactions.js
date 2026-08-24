import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x858e04 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x22c26d from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x2209f3 = await _0x0_0x22c26d['getSetting']('global', 'userGroupData');
            return _0x2209f3?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x858e04['existsSync'](USER_GROUP_DATA)) {
                const _0x45326f = JSON['parse'](_0x0_0x858e04['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x45326f['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x58c70d => {
    COMMAND_REACT_ENABLED = _0x58c70d;
});
async function addCommandReaction(_0x3edecd, _0x3d0d56) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x3d0d56?.['key']?.['id'])
        return;
    await _0x3edecd['sendMessage'](_0x3d0d56['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x3d0d56['key']
        }
    });
}
async function setCommandReactState(_0x5173b5) {
    COMMAND_REACT_ENABLED = _0x5173b5;
    try {
        if (HAS_DB) {
            const _0x4ff771 = await _0x0_0x22c26d['getSetting']('global', 'userGroupData') || {};
            _0x4ff771['autoReaction'] = _0x5173b5;
            await _0x0_0x22c26d['saveSetting']('global', 'userGroupData', _0x4ff771);
        } else {
            let _0x1f7c4f = {};
            if (_0x0_0x858e04['existsSync'](USER_GROUP_DATA)) {
                _0x1f7c4f = JSON['parse'](_0x0_0x858e04['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x1f7c4f['autoReaction'] = _0x5173b5;
            _0x0_0x858e04['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x1f7c4f, null, 0x2));
        }
    } catch (_0x1771a8) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x1771a8);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};