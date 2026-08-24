import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1a79f3 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x1fdb85 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x5a2c85 = await _0x0_0x1fdb85['getSetting']('global', 'userGroupData');
            return _0x5a2c85?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x1a79f3['existsSync'](USER_GROUP_DATA)) {
                const _0x2193e1 = JSON['parse'](_0x0_0x1a79f3['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x2193e1['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x121a1c => {
    COMMAND_REACT_ENABLED = _0x121a1c;
});
async function addCommandReaction(_0x56360b, _0x492083) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x492083?.['key']?.['id'])
        return;
    await _0x56360b['sendMessage'](_0x492083['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x492083['key']
        }
    });
}
async function setCommandReactState(_0x4e8e04) {
    COMMAND_REACT_ENABLED = _0x4e8e04;
    try {
        if (HAS_DB) {
            const _0x498301 = await _0x0_0x1fdb85['getSetting']('global', 'userGroupData') || {};
            _0x498301['autoReaction'] = _0x4e8e04;
            await _0x0_0x1fdb85['saveSetting']('global', 'userGroupData', _0x498301);
        } else {
            let _0x466acd = {};
            if (_0x0_0x1a79f3['existsSync'](USER_GROUP_DATA)) {
                _0x466acd = JSON['parse'](_0x0_0x1a79f3['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x466acd['autoReaction'] = _0x4e8e04;
            _0x0_0x1a79f3['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x466acd, null, 0x2));
        }
    } catch (_0x260576) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x260576);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};