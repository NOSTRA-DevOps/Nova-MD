import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5c9f2b from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x15c24e from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x5b755 = await _0x0_0x15c24e['getSetting']('global', 'userGroupData');
            return _0x5b755?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x5c9f2b['existsSync'](USER_GROUP_DATA)) {
                const _0x277de7 = JSON['parse'](_0x0_0x5c9f2b['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x277de7['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x404fe7 => {
    COMMAND_REACT_ENABLED = _0x404fe7;
});
async function addCommandReaction(_0x13270e, _0xdee941) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0xdee941?.['key']?.['id'])
        return;
    await _0x13270e['sendMessage'](_0xdee941['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0xdee941['key']
        }
    });
}
async function setCommandReactState(_0x2eb1ad) {
    COMMAND_REACT_ENABLED = _0x2eb1ad;
    try {
        if (HAS_DB) {
            const _0x532157 = await _0x0_0x15c24e['getSetting']('global', 'userGroupData') || {};
            _0x532157['autoReaction'] = _0x2eb1ad;
            await _0x0_0x15c24e['saveSetting']('global', 'userGroupData', _0x532157);
        } else {
            let _0x4f969e = {};
            if (_0x0_0x5c9f2b['existsSync'](USER_GROUP_DATA)) {
                _0x4f969e = JSON['parse'](_0x0_0x5c9f2b['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x4f969e['autoReaction'] = _0x2eb1ad;
            _0x0_0x5c9f2b['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x4f969e, null, 0x2));
        }
    } catch (_0x5e1263) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x5e1263);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};