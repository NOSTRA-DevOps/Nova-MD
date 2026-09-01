import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x287ba7 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x1efcfb from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x2564d3 = await _0x0_0x1efcfb['getSetting']('global', 'antilinkSettings');
        return _0x2564d3 || {};
    } else {
        if (_0x0_0x287ba7['existsSync'](antilinkFilePath)) {
            const _0x296a0c = _0x0_0x287ba7['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x296a0c));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x51bff9) {
    if (HAS_DB) {
        await _0x0_0x1efcfb['saveSetting']('global', 'antilinkSettings', _0x51bff9);
    } else {
        _0x0_0x287ba7['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x51bff9, null, 0x2));
    }
}
async function setAntilinkSetting(_0xa0d9b9, _0x514cf6) {
    const _0x2483ee = await loadAntilinkSettings();
    _0x2483ee[_0xa0d9b9] = _0x514cf6;
    await saveAntilinkSettings(_0x2483ee);
}
async function getAntilinkSetting(_0x4a5075) {
    const _0x415094 = await loadAntilinkSettings();
    return _0x415094[_0x4a5075] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};