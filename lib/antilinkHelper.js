import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3edee6 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x254c14 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x4b628b = await _0x0_0x254c14['getSetting']('global', 'antilinkSettings');
        return _0x4b628b || {};
    } else {
        if (_0x0_0x3edee6['existsSync'](antilinkFilePath)) {
            const _0x54d0b8 = _0x0_0x3edee6['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x54d0b8));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x1469cc) {
    if (HAS_DB) {
        await _0x0_0x254c14['saveSetting']('global', 'antilinkSettings', _0x1469cc);
    } else {
        _0x0_0x3edee6['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x1469cc, null, 0x2));
    }
}
async function setAntilinkSetting(_0x1153c3, _0x5d98ab) {
    const _0x4ffd11 = await loadAntilinkSettings();
    _0x4ffd11[_0x1153c3] = _0x5d98ab;
    await saveAntilinkSettings(_0x4ffd11);
}
async function getAntilinkSetting(_0x230d1e) {
    const _0x2766b4 = await loadAntilinkSettings();
    return _0x2766b4[_0x230d1e] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};