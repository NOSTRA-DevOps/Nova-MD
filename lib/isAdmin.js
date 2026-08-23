async function isAdmin(_0x552d45, _0xc8f04d, _0x3e3ad3) {
    try {
        const _0x2249cb = await _0x552d45['groupMetadata'](_0xc8f04d);
        const _0x3687ee = _0x2249cb['participants'] || [];
        const _0x14adf4 = _0x552d45['user']?.['id'] || '';
        const _0x287221 = _0x552d45['user']?.['lid'] || '';
        const _0x4cd205 = _0x14adf4['includes'](':') ? _0x14adf4['split'](':')[0x0] : _0x14adf4['includes']('@') ? _0x14adf4['split']('@')[0x0] : _0x14adf4;
        const _0x50b15d = _0x14adf4['includes']('@') ? _0x14adf4['split']('@')[0x0] : _0x14adf4;
        const _0x127982 = _0x287221['includes'](':') ? _0x287221['split'](':')[0x0] : _0x287221['includes']('@') ? _0x287221['split']('@')[0x0] : _0x287221;
        const _0x3fbb28 = _0x287221['includes']('@') ? _0x287221['split']('@')[0x0] : _0x287221;
        const _0x1a546a = _0x3e3ad3['includes'](':') ? _0x3e3ad3['split'](':')[0x0] : _0x3e3ad3['includes']('@') ? _0x3e3ad3['split']('@')[0x0] : _0x3e3ad3;
        const _0x422cf7 = _0x3e3ad3['includes']('@') ? _0x3e3ad3['split']('@')[0x0] : _0x3e3ad3;
        const _0x5861d8 = _0x3687ee['some'](_0x5d7c81 => {
            const _0x28ab36 = _0x5d7c81['phoneNumber'] ? _0x5d7c81['phoneNumber']['split']('@')[0x0] : '';
            const _0x426d8e = _0x5d7c81['id'] ? _0x5d7c81['id']['split']('@')[0x0] : '';
            const _0x5479cb = _0x5d7c81['lid'] ? _0x5d7c81['lid']['split']('@')[0x0] : '';
            const _0x1c1a76 = _0x5d7c81['id'] || '';
            const _0x3eb361 = _0x5d7c81['lid'] || '';
            const _0x1bd563 = _0x5479cb['includes'](':') ? _0x5479cb['split'](':')[0x0] : _0x5479cb;
            const _0x394f90 = _0x14adf4 === _0x1c1a76 || _0x14adf4 === _0x3eb361 || _0x287221 === _0x3eb361 || _0x127982 === _0x1bd563 || _0x3fbb28 === _0x5479cb || _0x4cd205 === _0x28ab36 || _0x4cd205 === _0x426d8e || _0x50b15d === _0x28ab36 || _0x50b15d === _0x426d8e || _0x287221 && _0x287221['split']('@')[0x0]['split'](':')[0x0] === _0x5479cb;
            return _0x394f90 && (_0x5d7c81['admin'] === 'admin' || _0x5d7c81['admin'] === 'superadmin');
        });
        const _0x1463a1 = _0x3687ee['some'](_0x22da8b => {
            const _0x18d832 = _0x22da8b['phoneNumber'] ? _0x22da8b['phoneNumber']['split']('@')[0x0] : '';
            const _0x453ac1 = _0x22da8b['id'] ? _0x22da8b['id']['split']('@')[0x0] : '';
            const _0x450d87 = _0x22da8b['lid'] ? _0x22da8b['lid']['split']('@')[0x0] : '';
            const _0x1e146d = _0x22da8b['id'] || '';
            const _0x5df210 = _0x22da8b['lid'] || '';
            const _0x415610 = _0x3e3ad3 === _0x1e146d || _0x3e3ad3 === _0x5df210 || _0x1a546a === _0x18d832 || _0x1a546a === _0x453ac1 || _0x422cf7 === _0x18d832 || _0x422cf7 === _0x453ac1 || _0x450d87 && _0x422cf7 === _0x450d87;
            return _0x415610 && (_0x22da8b['admin'] === 'admin' || _0x22da8b['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x1463a1,
            'isBotAdmin': _0x5861d8
        };
    } catch (_0x34e135) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x34e135);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;