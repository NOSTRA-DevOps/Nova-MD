import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x59e6c5 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x3d2159 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x48c854 = await _0x0_0x3d2159['getSetting']('global', 'antilinkSettings');
        return _0x48c854 || {};
    } else {
        if (_0x0_0x59e6c5['existsSync'](antilinkFilePath)) {
            const _0x2ba2ab = _0x0_0x59e6c5['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x2ba2ab));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x2a76f7) {
    if (HAS_DB) {
        await _0x0_0x3d2159['saveSetting']('global', 'antilinkSettings', _0x2a76f7);
    } else {
        _0x0_0x59e6c5['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x2a76f7, null, 0x2));
    }
}
async function setAntilinkSetting(_0x241d6e, _0x4d080b) {
    const _0x44b283 = await loadAntilinkSettings();
    _0x44b283[_0x241d6e] = _0x4d080b;
    await saveAntilinkSettings(_0x44b283);
}
async function getAntilinkSetting(_0x8bbc21) {
    const _0x18a2ab = await loadAntilinkSettings();
    return _0x18a2ab[_0x8bbc21] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};