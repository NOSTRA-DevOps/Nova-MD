import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0xc684ee from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x5289c6 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x4b6703 = await _0x0_0x5289c6['getSetting']('global', 'antilinkSettings');
        return _0x4b6703 || {};
    } else {
        if (_0x0_0xc684ee['existsSync'](antilinkFilePath)) {
            const _0x226b01 = _0x0_0xc684ee['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x226b01));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x4a46ea) {
    if (HAS_DB) {
        await _0x0_0x5289c6['saveSetting']('global', 'antilinkSettings', _0x4a46ea);
    } else {
        _0x0_0xc684ee['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x4a46ea, null, 0x2));
    }
}
async function setAntilinkSetting(_0x510c01, _0x5f4475) {
    const _0x572a0e = await loadAntilinkSettings();
    _0x572a0e[_0x510c01] = _0x5f4475;
    await saveAntilinkSettings(_0x572a0e);
}
async function getAntilinkSetting(_0x37dbd9) {
    const _0x561d13 = await loadAntilinkSettings();
    return _0x561d13[_0x37dbd9] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};