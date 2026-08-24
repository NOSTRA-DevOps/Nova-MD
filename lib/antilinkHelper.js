import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x38d755 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x56ccea from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x226d7e = await _0x0_0x56ccea['getSetting']('global', 'antilinkSettings');
        return _0x226d7e || {};
    } else {
        if (_0x0_0x38d755['existsSync'](antilinkFilePath)) {
            const _0x89cb8 = _0x0_0x38d755['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x89cb8));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x4ecec4) {
    if (HAS_DB) {
        await _0x0_0x56ccea['saveSetting']('global', 'antilinkSettings', _0x4ecec4);
    } else {
        _0x0_0x38d755['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x4ecec4, null, 0x2));
    }
}
async function setAntilinkSetting(_0x3c15bc, _0x580f32) {
    const _0x346b4c = await loadAntilinkSettings();
    _0x346b4c[_0x3c15bc] = _0x580f32;
    await saveAntilinkSettings(_0x346b4c);
}
async function getAntilinkSetting(_0x534d7a) {
    const _0x4f02e8 = await loadAntilinkSettings();
    return _0x4f02e8[_0x534d7a] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};