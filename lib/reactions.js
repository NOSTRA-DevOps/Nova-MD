import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x33e6a3 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x3c5548 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x5f4b9f = await _0x0_0x3c5548['getSetting']('global', 'userGroupData');
            return _0x5f4b9f?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x33e6a3['existsSync'](USER_GROUP_DATA)) {
                const _0x3c44cb = JSON['parse'](_0x0_0x33e6a3['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x3c44cb['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x45368e => {
    COMMAND_REACT_ENABLED = _0x45368e;
});
async function addCommandReaction(_0x55ae00, _0x49e60e) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x49e60e?.['key']?.['id'])
        return;
    await _0x55ae00['sendMessage'](_0x49e60e['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x49e60e['key']
        }
    });
}
async function setCommandReactState(_0x350b20) {
    COMMAND_REACT_ENABLED = _0x350b20;
    try {
        if (HAS_DB) {
            const _0x84de00 = await _0x0_0x3c5548['getSetting']('global', 'userGroupData') || {};
            _0x84de00['autoReaction'] = _0x350b20;
            await _0x0_0x3c5548['saveSetting']('global', 'userGroupData', _0x84de00);
        } else {
            let _0xcc692b = {};
            if (_0x0_0x33e6a3['existsSync'](USER_GROUP_DATA)) {
                _0xcc692b = JSON['parse'](_0x0_0x33e6a3['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0xcc692b['autoReaction'] = _0x350b20;
            _0x0_0x33e6a3['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0xcc692b, null, 0x2));
        }
    } catch (_0xa8e479) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0xa8e479);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};