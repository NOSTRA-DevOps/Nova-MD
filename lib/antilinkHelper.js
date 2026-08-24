import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2dd66e from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x4f1296 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x3c6de9 = await _0x0_0x4f1296['getSetting']('global', 'antilinkSettings');
        return _0x3c6de9 || {};
    } else {
        if (_0x0_0x2dd66e['existsSync'](antilinkFilePath)) {
            const _0xe3c6e9 = _0x0_0x2dd66e['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0xe3c6e9));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x5a2778) {
    if (HAS_DB) {
        await _0x0_0x4f1296['saveSetting']('global', 'antilinkSettings', _0x5a2778);
    } else {
        _0x0_0x2dd66e['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x5a2778, null, 0x2));
    }
}
async function setAntilinkSetting(_0x16a9b7, _0x57a617) {
    const _0x3daded = await loadAntilinkSettings();
    _0x3daded[_0x16a9b7] = _0x57a617;
    await saveAntilinkSettings(_0x3daded);
}
async function getAntilinkSetting(_0xdc6d36) {
    const _0x3c96d5 = await loadAntilinkSettings();
    return _0x3c96d5[_0xdc6d36] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};