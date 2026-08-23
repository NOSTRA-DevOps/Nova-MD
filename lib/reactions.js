import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2a439b from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x4d7f61 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0x3ed49c = await _0x0_0x4d7f61['getSetting']('global', 'userGroupData');
            return _0x3ed49c?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x2a439b['existsSync'](USER_GROUP_DATA)) {
                const _0x59d3ae = JSON['parse'](_0x0_0x2a439b['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x59d3ae['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0x19d8f3 => {
    COMMAND_REACT_ENABLED = _0x19d8f3;
});
async function addCommandReaction(_0x248cc3, _0x5463d9) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x5463d9?.['key']?.['id'])
        return;
    await _0x248cc3['sendMessage'](_0x5463d9['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x5463d9['key']
        }
    });
}
async function setCommandReactState(_0x43ec5b) {
    COMMAND_REACT_ENABLED = _0x43ec5b;
    try {
        if (HAS_DB) {
            const _0x528cde = await _0x0_0x4d7f61['getSetting']('global', 'userGroupData') || {};
            _0x528cde['autoReaction'] = _0x43ec5b;
            await _0x0_0x4d7f61['saveSetting']('global', 'userGroupData', _0x528cde);
        } else {
            let _0x1a3170 = {};
            if (_0x0_0x2a439b['existsSync'](USER_GROUP_DATA)) {
                _0x1a3170 = JSON['parse'](_0x0_0x2a439b['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0x1a3170['autoReaction'] = _0x43ec5b;
            _0x0_0x2a439b['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0x1a3170, null, 0x2));
        }
    } catch (_0x17c3ce) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x17c3ce);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};