async function isAdmin(_0x44db2b, _0x51d7a0, _0x215711) {
    try {
        const _0x5113ef = await _0x44db2b['groupMetadata'](_0x51d7a0);
        const _0xd652f0 = _0x5113ef['participants'] || [];
        const _0x38b3ea = _0x44db2b['user']?.['id'] || '';
        const _0x42116e = _0x44db2b['user']?.['lid'] || '';
        const _0x431fe1 = _0x38b3ea['includes'](':') ? _0x38b3ea['split'](':')[0x0] : _0x38b3ea['includes']('@') ? _0x38b3ea['split']('@')[0x0] : _0x38b3ea;
        const _0x55e181 = _0x38b3ea['includes']('@') ? _0x38b3ea['split']('@')[0x0] : _0x38b3ea;
        const _0x462e7b = _0x42116e['includes'](':') ? _0x42116e['split'](':')[0x0] : _0x42116e['includes']('@') ? _0x42116e['split']('@')[0x0] : _0x42116e;
        const _0x474ea5 = _0x42116e['includes']('@') ? _0x42116e['split']('@')[0x0] : _0x42116e;
        const _0x18f684 = _0x215711['includes'](':') ? _0x215711['split'](':')[0x0] : _0x215711['includes']('@') ? _0x215711['split']('@')[0x0] : _0x215711;
        const _0x228f55 = _0x215711['includes']('@') ? _0x215711['split']('@')[0x0] : _0x215711;
        const _0x1cdad9 = _0xd652f0['some'](_0x38a8a4 => {
            const _0x391a00 = _0x38a8a4['phoneNumber'] ? _0x38a8a4['phoneNumber']['split']('@')[0x0] : '';
            const _0x4b7033 = _0x38a8a4['id'] ? _0x38a8a4['id']['split']('@')[0x0] : '';
            const _0x5f36fd = _0x38a8a4['lid'] ? _0x38a8a4['lid']['split']('@')[0x0] : '';
            const _0x405ad3 = _0x38a8a4['id'] || '';
            const _0x4a6d79 = _0x38a8a4['lid'] || '';
            const _0x343e95 = _0x5f36fd['includes'](':') ? _0x5f36fd['split'](':')[0x0] : _0x5f36fd;
            const _0xaa259b = _0x38b3ea === _0x405ad3 || _0x38b3ea === _0x4a6d79 || _0x42116e === _0x4a6d79 || _0x462e7b === _0x343e95 || _0x474ea5 === _0x5f36fd || _0x431fe1 === _0x391a00 || _0x431fe1 === _0x4b7033 || _0x55e181 === _0x391a00 || _0x55e181 === _0x4b7033 || _0x42116e && _0x42116e['split']('@')[0x0]['split'](':')[0x0] === _0x5f36fd;
            return _0xaa259b && (_0x38a8a4['admin'] === 'admin' || _0x38a8a4['admin'] === 'superadmin');
        });
        const _0x4df4dc = _0xd652f0['some'](_0x3e06c9 => {
            const _0x42c2d3 = _0x3e06c9['phoneNumber'] ? _0x3e06c9['phoneNumber']['split']('@')[0x0] : '';
            const _0x333990 = _0x3e06c9['id'] ? _0x3e06c9['id']['split']('@')[0x0] : '';
            const _0x488f71 = _0x3e06c9['lid'] ? _0x3e06c9['lid']['split']('@')[0x0] : '';
            const _0x103ef8 = _0x3e06c9['id'] || '';
            const _0x4cc996 = _0x3e06c9['lid'] || '';
            const _0x31e2cf = _0x215711 === _0x103ef8 || _0x215711 === _0x4cc996 || _0x18f684 === _0x42c2d3 || _0x18f684 === _0x333990 || _0x228f55 === _0x42c2d3 || _0x228f55 === _0x333990 || _0x488f71 && _0x228f55 === _0x488f71;
            return _0x31e2cf && (_0x3e06c9['admin'] === 'admin' || _0x3e06c9['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x4df4dc,
            'isBotAdmin': _0x1cdad9
        };
    } catch (_0x14ebeb) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x14ebeb);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;