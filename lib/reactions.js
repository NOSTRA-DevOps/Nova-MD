import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1e17d0 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0xab2655 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x3e6707 = await _0x0_0xab2655['getSetting']('global', 'userGroupData');
            return _0x3e6707?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x1e17d0['existsSync'](USER_GROUP_DATA)) {
                const _0x1e5010 = JSON['parse'](_0x0_0x1e17d0['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x1e5010['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x3ee720 => {
    COMMAND_REACT_ENABLED = _0x3ee720;
});
async function addCommandReaction(_0x5c7a7a, _0x4998b3) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x4998b3?.['key']?.['id'])
        return;
    await _0x5c7a7a['sendMessage'](_0x4998b3['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x4998b3['key']
        }
    });
}
async function setCommandReactState(_0x10ab55) {
    COMMAND_REACT_ENABLED = _0x10ab55;
    try {
        if (HAS_DB) {
            const _0x2c6979 = await _0x0_0xab2655['getSetting']('global', 'userGroupData') || {};
            _0x2c6979['autoReaction'] = _0x10ab55;
            await _0x0_0xab2655['saveSetting']('global', 'userGroupData', _0x2c6979);
        } else {
            let _0x1f8d53 = {};
            if (_0x0_0x1e17d0['existsSync'](USER_GROUP_DATA)) {
                _0x1f8d53 = JSON['parse'](_0x0_0x1e17d0['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x1f8d53['autoReaction'] = _0x10ab55;
            _0x0_0x1e17d0['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x1f8d53, null, 0x2));
        }
    } catch (_0x561d0b) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x561d0b);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};