import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x285bdb from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x435138 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x1c6ee8 = await _0x0_0x435138['getSetting']('global', 'antilinkSettings');
        return _0x1c6ee8 || {};
    } else {
        if (_0x0_0x285bdb['existsSync'](antilinkFilePath)) {
            const _0xbcc789 = _0x0_0x285bdb['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0xbcc789));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x1139d9) {
    if (HAS_DB) {
        await _0x0_0x435138['saveSetting']('global', 'antilinkSettings', _0x1139d9);
    } else {
        _0x0_0x285bdb['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x1139d9, null, 0x2));
    }
}
async function setAntilinkSetting(_0x258b58, _0x29174e) {
    const _0x4a9208 = await loadAntilinkSettings();
    _0x4a9208[_0x258b58] = _0x29174e;
    await saveAntilinkSettings(_0x4a9208);
}
async function getAntilinkSetting(_0x1563a9) {
    const _0x19946b = await loadAntilinkSettings();
    return _0x19946b[_0x1563a9] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};