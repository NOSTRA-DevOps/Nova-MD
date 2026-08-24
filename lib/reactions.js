import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5d3510 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x2389d9 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x1aab93 = await _0x0_0x2389d9['getSetting']('global', 'userGroupData');
            return _0x1aab93?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x5d3510['existsSync'](USER_GROUP_DATA)) {
                const _0x11211a = JSON['parse'](_0x0_0x5d3510['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x11211a['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x3c4af0 => {
    COMMAND_REACT_ENABLED = _0x3c4af0;
});
async function addCommandReaction(_0xce40db, _0x5468b8) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x5468b8?.['key']?.['id'])
        return;
    await _0xce40db['sendMessage'](_0x5468b8['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x5468b8['key']
        }
    });
}
async function setCommandReactState(_0x4796c2) {
    COMMAND_REACT_ENABLED = _0x4796c2;
    try {
        if (HAS_DB) {
            const _0x489caf = await _0x0_0x2389d9['getSetting']('global', 'userGroupData') || {};
            _0x489caf['autoReaction'] = _0x4796c2;
            await _0x0_0x2389d9['saveSetting']('global', 'userGroupData', _0x489caf);
        } else {
            let _0x2da03e = {};
            if (_0x0_0x5d3510['existsSync'](USER_GROUP_DATA)) {
                _0x2da03e = JSON['parse'](_0x0_0x5d3510['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x2da03e['autoReaction'] = _0x4796c2;
            _0x0_0x5d3510['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x2da03e, null, 0x2));
        }
    } catch (_0xf8220a) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0xf8220a);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};