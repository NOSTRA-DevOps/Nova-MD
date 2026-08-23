import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x5e454f from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x5cab1a from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const USER_GROUP_DATA = dataFile('userGroupData.json');
async function loadCommandReactState() {
    try {
        if (HAS_DB) {
            const _0xcfc556 = await _0x0_0x5cab1a['getSetting']('global', 'userGroupData');
            return _0xcfc556?.['autoReaction'] || ![];
        } else {
            if (_0x0_0x5e454f['existsSync'](USER_GROUP_DATA)) {
                const _0x1d3d71 = JSON['parse'](_0x0_0x5e454f['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
                return _0x1d3d71['autoReaction'] || ![];
            }
        }
    } catch {
    }
    return ![];
}
let COMMAND_REACT_ENABLED = ![];
loadCommandReactState()['then'](_0xe39961 => {
    COMMAND_REACT_ENABLED = _0xe39961;
});
async function addCommandReaction(_0x4625ed, _0x409683) {
    if (!COMMAND_REACT_ENABLED)
        return;
    if (!_0x409683?.['key']?.['id'])
        return;
    await _0x4625ed['sendMessage'](_0x409683['key']['remoteJid'], {
        'react': {
            'text': '⏳',
            'key': _0x409683['key']
        }
    });
}
async function setCommandReactState(_0x316957) {
    COMMAND_REACT_ENABLED = _0x316957;
    try {
        if (HAS_DB) {
            const _0xedf36b = await _0x0_0x5cab1a['getSetting']('global', 'userGroupData') || {};
            _0xedf36b['autoReaction'] = _0x316957;
            await _0x0_0x5cab1a['saveSetting']('global', 'userGroupData', _0xedf36b);
        } else {
            let _0xcf3bb0 = {};
            if (_0x0_0x5e454f['existsSync'](USER_GROUP_DATA)) {
                _0xcf3bb0 = JSON['parse'](_0x0_0x5e454f['readFileSync'](USER_GROUP_DATA, 'utf-8')['toString']());
            }
            _0xcf3bb0['autoReaction'] = _0x316957;
            _0x0_0x5e454f['writeFileSync'](USER_GROUP_DATA, JSON['stringify'](_0xcf3bb0, null, 0x2));
        }
    } catch (_0x26688a) {
        console['error']('Error\x20saving\x20command\x20react\x20state:', _0x26688a);
    }
}
export {
    addCommandReaction,
    setCommandReactState,
    loadCommandReactState
};