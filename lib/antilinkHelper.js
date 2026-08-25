import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x47c313 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x16765b from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x4380c4 = await _0x0_0x16765b['getSetting']('global', 'antilinkSettings');
        return _0x4380c4 || {};
    } else {
        if (_0x0_0x47c313['existsSync'](antilinkFilePath)) {
            const _0x2a0f48 = _0x0_0x47c313['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x2a0f48));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x15755b) {
    if (HAS_DB) {
        await _0x0_0x16765b['saveSetting']('global', 'antilinkSettings', _0x15755b);
    } else {
        _0x0_0x47c313['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x15755b, null, 0x2));
    }
}
async function setAntilinkSetting(_0x41b4ed, _0x80549a) {
    const _0x384b17 = await loadAntilinkSettings();
    _0x384b17[_0x41b4ed] = _0x80549a;
    await saveAntilinkSettings(_0x384b17);
}
async function getAntilinkSetting(_0x3a32a9) {
    const _0x1724c9 = await loadAntilinkSettings();
    return _0x1724c9[_0x3a32a9] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};