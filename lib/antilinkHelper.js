import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xa3c8b6 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x291fae from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x69ad2f = await _0x0_0x291fae['getSetting']('global', 'antilinkSettings');
        return _0x69ad2f || {};
    } else {
        if (_0x0_0xa3c8b6['existsSync'](antilinkFilePath)) {
            const _0x28ae36 = _0x0_0xa3c8b6['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x28ae36));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x5520b3) {
    if (HAS_DB) {
        await _0x0_0x291fae['saveSetting']('global', 'antilinkSettings', _0x5520b3);
    } else {
        _0x0_0xa3c8b6['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x5520b3, null, 0x2));
    }
}
async function setAntilinkSetting(_0xc23eea, _0x3cfc53) {
    const _0x13ebd5 = await loadAntilinkSettings();
    _0x13ebd5[_0xc23eea] = _0x3cfc53;
    await saveAntilinkSettings(_0x13ebd5);
}
async function getAntilinkSetting(_0x49ca51) {
    const _0x5111ab = await loadAntilinkSettings();
    return _0x5111ab[_0x49ca51] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};