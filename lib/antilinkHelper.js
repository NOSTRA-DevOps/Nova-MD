import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import _0x0_0x286509 from 'fs';
import { dataFile } from './paths.js';
import _0x0_0x4cc981 from './lightweight_store.js';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const HAS_DB = !!(MONGO_URL || POSTGRES_URL || MYSQL_URL || SQLITE_URL);
const antilinkFilePath = dataFile('antilinkSettings.json');
async function loadAntilinkSettings() {
    if (HAS_DB) {
        const _0x5bb173 = await _0x0_0x4cc981['getSetting']('global', 'antilinkSettings');
        return _0x5bb173 || {};
    } else {
        if (_0x0_0x286509['existsSync'](antilinkFilePath)) {
            const _0x4685eb = _0x0_0x286509['readFileSync'](antilinkFilePath);
            return JSON['parse'](String(_0x4685eb));
        }
        return {};
    }
}
async function saveAntilinkSettings(_0x3a77d7) {
    if (HAS_DB) {
        await _0x0_0x4cc981['saveSetting']('global', 'antilinkSettings', _0x3a77d7);
    } else {
        _0x0_0x286509['writeFileSync'](antilinkFilePath, JSON['stringify'](_0x3a77d7, null, 0x2));
    }
}
async function setAntilinkSetting(_0x18bb9d, _0x26c8b5) {
    const _0x23b915 = await loadAntilinkSettings();
    _0x23b915[_0x18bb9d] = _0x26c8b5;
    await saveAntilinkSettings(_0x23b915);
}
async function getAntilinkSetting(_0x1e8941) {
    const _0x5be001 = await loadAntilinkSettings();
    return _0x5be001[_0x1e8941] || 'off';
}
export {
    setAntilinkSetting,
    getAntilinkSetting,
    loadAntilinkSettings,
    saveAntilinkSettings
};