import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x2aa928 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x7fdb8b from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x227219 = await _0x0_0x7fdb8b['getSetting']('global', 'antilinkSettings');
        return _0x227219 || {};
    } else {
        if (_0x0_0x2aa928['existsSync'](antilinkFilePath)) {
            const _0x4726bd = _0x0_0x2aa928['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x4726bd));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x4853fa) {
    if (HAS_DB) {
        await _0x0_0x7fdb8b['saveSetting']('global', 'antilinkSettings', _0x4853fa);
    } else {
        _0x0_0x2aa928['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x4853fa, null, 0x2));
    }
}
async function setAntilinkSetting(_0x48ace2, _0x2f3cec) {
    const _0x518415 = await loadAntilinkSettings();
    _0x518415[_0x48ace2] = _0x2f3cec;
    await saveAntilinkSettings(_0x518415);
}
async function getAntilinkSetting(_0x391e07) {
    const _0x40c9f2 = await loadAntilinkSettings();
    return _0x40c9f2[_0x391e07] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};