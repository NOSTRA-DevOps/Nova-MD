import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x58ff3d from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x2d391e from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x1b5ec3 = await _0x0_0x2d391e['getSetting']('global', 'antilinkSettings');
        return _0x1b5ec3 || {};
    } else {
        if (_0x0_0x58ff3d['existsSync'](antilinkFilePath)) {
            const _0x56f351 = _0x0_0x58ff3d['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x56f351));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x2efe65) {
    if (HAS_DB) {
        await _0x0_0x2d391e['saveSetting']('global', 'antilinkSettings', _0x2efe65);
    } else {
        _0x0_0x58ff3d['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x2efe65, null, 0x2));
    }
}
async function setAntilinkSetting(_0x1f5144, _0x5b1422) {
    const _0x34a131 = await loadAntilinkSettings();
    _0x34a131[_0x1f5144] = _0x5b1422;
    await saveAntilinkSettings(_0x34a131);
}
async function getAntilinkSetting(_0x118057) {
    const _0x4771de = await loadAntilinkSettings();
    return _0x4771de[_0x118057] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};