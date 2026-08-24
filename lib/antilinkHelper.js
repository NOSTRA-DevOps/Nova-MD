import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x1de4ca from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x5b9226 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x58496c = await _0x0_0x5b9226['getSetting']('global', 'antilinkSettings');
        return _0x58496c || {};
    } else {
        if (_0x0_0x1de4ca['existsSync'](antilinkFilePath)) {
            const _0x580df2 = _0x0_0x1de4ca['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x580df2));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x391e18) {
    if (HAS_DB) {
        await _0x0_0x5b9226['saveSetting']('global', 'antilinkSettings', _0x391e18);
    } else {
        _0x0_0x1de4ca['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x391e18, null, 0x2));
    }
}
async function setAntilinkSetting(_0x211e0f, _0xda9d0b) {
    const _0x3959c6 = await loadAntilinkSettings();
    _0x3959c6[_0x211e0f] = _0xda9d0b;
    await saveAntilinkSettings(_0x3959c6);
}
async function getAntilinkSetting(_0x4a5b82) {
    const _0x5353bc = await loadAntilinkSettings();
    return _0x5353bc[_0x4a5b82] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};