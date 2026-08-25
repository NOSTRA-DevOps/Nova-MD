import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x26ef4c from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x317fcd from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x207283 = await _0x0_0x317fcd['getSetting']('global', 'antilinkSettings');
        return _0x207283 || {};
    } else {
        if (_0x0_0x26ef4c['existsSync'](antilinkFilePath)) {
            const _0xf2475d = _0x0_0x26ef4c['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0xf2475d));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x4c9c80) {
    if (HAS_DB) {
        await _0x0_0x317fcd['saveSetting']('global', 'antilinkSettings', _0x4c9c80);
    } else {
        _0x0_0x26ef4c['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x4c9c80, null, 0x2));
    }
}
async function setAntilinkSetting(_0x359308, _0x2632a7) {
    const _0x51804b = await loadAntilinkSettings();
    _0x51804b[_0x359308] = _0x2632a7;
    await saveAntilinkSettings(_0x51804b);
}
async function getAntilinkSetting(_0x17f352) {
    const _0x5afee6 = await loadAntilinkSettings();
    return _0x5afee6[_0x17f352] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};