import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3b8ccf from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x53f881 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x2ea041 = await _0x0_0x53f881['getSetting']('global', 'antilinkSettings');
        return _0x2ea041 || {};
    } else {
        if (_0x0_0x3b8ccf['existsSync'](antilinkFilePath)) {
            const _0x39f5e2 = _0x0_0x3b8ccf['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x39f5e2));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x313a86) {
    if (HAS_DB) {
        await _0x0_0x53f881['saveSetting']('global', 'antilinkSettings', _0x313a86);
    } else {
        _0x0_0x3b8ccf['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x313a86, null, 0x2));
    }
}
async function setAntilinkSetting(_0x3c88c1, _0x19ae60) {
    const _0x26aebd = await loadAntilinkSettings();
    _0x26aebd[_0x3c88c1] = _0x19ae60;
    await saveAntilinkSettings(_0x26aebd);
}
async function getAntilinkSetting(_0x4c1c8a) {
    const _0xd349c7 = await loadAntilinkSettings();
    return _0xd349c7[_0x4c1c8a] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};