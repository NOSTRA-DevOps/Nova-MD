import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x314f2b from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x160c31 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x15f1f3 = await _0x0_0x160c31['getSetting']('global', 'userGroupData');
            return _0x15f1f3?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x314f2b['existsSync'](USER_GROUP_DATA)) {
                const _0x2bf4da = JSON['parse'](_0x0_0x314f2b['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x2bf4da['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0xf00e93 => {
    COMMAND_REACT_ENABLED = _0xf00e93;
});
async function addCommandReaction(_0x3938d7, _0x5a96b8) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x5a96b8?.['key']?.['id'])
        return;
    await _0x3938d7['sendMessage'](_0x5a96b8['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x5a96b8['key']
        }
    });
}
async function setCommandReactState(_0xa2846b) {
    COMMAND_REACT_ENABLED = _0xa2846b;
    try {
        if (HAS_DB) {
            const _0x151fa5 = await _0x0_0x160c31['getSetting']('global', 'userGroupData') || {};
            _0x151fa5['autoReaction'] = _0xa2846b;
            await _0x0_0x160c31['saveSetting']('global', 'userGroupData', _0x151fa5);
        } else {
            let _0xb3b4b1 = {};
            if (_0x0_0x314f2b['existsSync'](USER_GROUP_DATA)) {
                _0xb3b4b1 = JSON['parse'](_0x0_0x314f2b['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0xb3b4b1['autoReaction'] = _0xa2846b;
            _0x0_0x314f2b['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0xb3b4b1, null, 0x2));
        }
    } catch (_0x593ea8) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x593ea8);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};