import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x3a2e4a from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x2ab6e8 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x74bb17 = await _0x0_0x2ab6e8['getSetting']('global', 'antilinkSettings');
        return _0x74bb17 || {};
    } else {
        if (_0x0_0x3a2e4a['existsSync'](antilinkFilePath)) {
            const _0x1f6b83 = _0x0_0x3a2e4a['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x1f6b83));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x116078) {
    if (HAS_DB) {
        await _0x0_0x2ab6e8['saveSetting']('global', 'antilinkSettings', _0x116078);
    } else {
        _0x0_0x3a2e4a['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x116078, null, 0x2));
    }
}
async function setAntilinkSetting(_0x1e067f, _0xdab1d0) {
    const _0x4f8fc3 = await loadAntilinkSettings();
    _0x4f8fc3[_0x1e067f] = _0xdab1d0;
    await saveAntilinkSettings(_0x4f8fc3);
}
async function getAntilinkSetting(_0x154659) {
    const _0x230060 = await loadAntilinkSettings();
    return _0x230060[_0x154659] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};