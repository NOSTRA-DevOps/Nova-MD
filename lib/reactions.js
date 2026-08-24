import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2aa112 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x10bdf9 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x4fe7cf = await _0x0_0x10bdf9['getSetting']('global', 'userGroupData');
            return _0x4fe7cf?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x2aa112['existsSync'](USER_GROUP_DATA)) {
                const _0x570870 = JSON['parse'](_0x0_0x2aa112['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x570870['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x236c5e => {
    COMMAND_REACT_ENABLED = _0x236c5e;
});
async function addCommandReaction(_0x1f7390, _0x46fff5) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x46fff5?.['key']?.['id'])
        return;
    await _0x1f7390['sendMessage'](_0x46fff5['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x46fff5['key']
        }
    });
}
async function setCommandReactState(_0x40c6c4) {
    COMMAND_REACT_ENABLED = _0x40c6c4;
    try {
        if (HAS_DB) {
            const _0x6304cf = await _0x0_0x10bdf9['getSetting']('global', 'userGroupData') || {};
            _0x6304cf['autoReaction'] = _0x40c6c4;
            await _0x0_0x10bdf9['saveSetting']('global', 'userGroupData', _0x6304cf);
        } else {
            let _0x5b510c = {};
            if (_0x0_0x2aa112['existsSync'](USER_GROUP_DATA)) {
                _0x5b510c = JSON['parse'](_0x0_0x2aa112['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x5b510c['autoReaction'] = _0x40c6c4;
            _0x0_0x2aa112['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x5b510c, null, 0x2));
        }
    } catch (_0x15a1ac) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x15a1ac);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};