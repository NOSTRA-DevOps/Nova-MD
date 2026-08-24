import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x140e49 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x71d0fe from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x3d3400 = await _0x0_0x71d0fe['getSetting']('global', 'antilinkSettings');
        return _0x3d3400 || {};
    } else {
        if (_0x0_0x140e49['existsSync'](antilinkFilePath)) {
            const _0x1ac7d5 = _0x0_0x140e49['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x1ac7d5));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x511597) {
    if (HAS_DB) {
        await _0x0_0x71d0fe['saveSetting']('global', 'antilinkSettings', _0x511597);
    } else {
        _0x0_0x140e49['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x511597, null, 0x2));
    }
}
async function setAntilinkSetting(_0x102921, _0x37c773) {
    const _0x647601 = await loadAntilinkSettings();
    _0x647601[_0x102921] = _0x37c773;
    await saveAntilinkSettings(_0x647601);
}
async function getAntilinkSetting(_0x59ec72) {
    const _0x2ce289 = await loadAntilinkSettings();
    return _0x2ce289[_0x59ec72] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};