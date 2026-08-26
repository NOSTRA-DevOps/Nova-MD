import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2a1ff0 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x6d0ba3 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x4840c6 = await _0x0_0x6d0ba3['getSetting']('global', 'userGroupData');
            return _0x4840c6?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x2a1ff0['existsSync'](USER_GROUP_DATA)) {
                const _0x20258d = JSON['parse'](_0x0_0x2a1ff0['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x20258d['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x51c9ba => {
    COMMAND_REACT_ENABLED = _0x51c9ba;
});
async function addCommandReaction(_0x48f20f, _0x3c3349) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x3c3349?.['key']?.['id'])
        return;
    await _0x48f20f['sendMessage'](_0x3c3349['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x3c3349['key']
        }
    });
}
async function setCommandReactState(_0x1539c2) {
    COMMAND_REACT_ENABLED = _0x1539c2;
    try {
        if (HAS_DB) {
            const _0x3593b6 = await _0x0_0x6d0ba3['getSetting']('global', 'userGroupData') || {};
            _0x3593b6['autoReaction'] = _0x1539c2;
            await _0x0_0x6d0ba3['saveSetting']('global', 'userGroupData', _0x3593b6);
        } else {
            let _0x149cab = {};
            if (_0x0_0x2a1ff0['existsSync'](USER_GROUP_DATA)) {
                _0x149cab = JSON['parse'](_0x0_0x2a1ff0['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x149cab['autoReaction'] = _0x1539c2;
            _0x0_0x2a1ff0['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x149cab, null, 0x2));
        }
    } catch (_0x25e98d) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x25e98d);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};