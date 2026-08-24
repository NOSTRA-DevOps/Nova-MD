import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x550dce from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x3650c3 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x71f1e2 = await _0x0_0x3650c3['getSetting']('global', 'antilinkSettings');
        return _0x71f1e2 || {};
    } else {
        if (_0x0_0x550dce['existsSync'](antilinkFilePath)) {
            const _0x5123d7 = _0x0_0x550dce['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x5123d7));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x52f4cf) {
    if (HAS_DB) {
        await _0x0_0x3650c3['saveSetting']('global', 'antilinkSettings', _0x52f4cf);
    } else {
        _0x0_0x550dce['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x52f4cf, null, 0x2));
    }
}
async function setAntilinkSetting(_0x42d996, _0x358db1) {
    const _0x2b97f7 = await loadAntilinkSettings();
    _0x2b97f7[_0x42d996] = _0x358db1;
    await saveAntilinkSettings(_0x2b97f7);
}
async function getAntilinkSetting(_0x4ab59d) {
    const _0x41895c = await loadAntilinkSettings();
    return _0x41895c[_0x4ab59d] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};