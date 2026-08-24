import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2a3a4a from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x10c8ae from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x113272 = await _0x0_0x10c8ae['getSetting']('global', 'userGroupData');
            return _0x113272?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x2a3a4a['existsSync'](USER_GROUP_DATA)) {
                const _0x2bab02 = JSON['parse'](_0x0_0x2a3a4a['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x2bab02['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0xe34af7 => {
    COMMAND_REACT_ENABLED = _0xe34af7;
});
async function addCommandReaction(_0xc01a70, _0x2ba402) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x2ba402?.['key']?.['id'])
        return;
    await _0xc01a70['sendMessage'](_0x2ba402['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x2ba402['key']
        }
    });
}
async function setCommandReactState(_0x1afb95) {
    COMMAND_REACT_ENABLED = _0x1afb95;
    try {
        if (HAS_DB) {
            const _0x5c78cb = await _0x0_0x10c8ae['getSetting']('global', 'userGroupData') || {};
            _0x5c78cb['autoReaction'] = _0x1afb95;
            await _0x0_0x10c8ae['saveSetting']('global', 'userGroupData', _0x5c78cb);
        } else {
            let _0x512f0c = {};
            if (_0x0_0x2a3a4a['existsSync'](USER_GROUP_DATA)) {
                _0x512f0c = JSON['parse'](_0x0_0x2a3a4a['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x512f0c['autoReaction'] = _0x1afb95;
            _0x0_0x2a3a4a['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x512f0c, null, 0x2));
        }
    } catch (_0x9afe66) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x9afe66);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};