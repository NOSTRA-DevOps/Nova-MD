async function isAdmin(_0x3a04d7, _0x586520, _0x3f5913) {
    try {
        const _0x42aac8 = await _0x3a04d7['groupMetadata'](_0x586520);
        const _0x3a4925 = _0x42aac8['participants'] || [];
        const _0x4d8e68 = _0x3a04d7['user']?.['id'] || '';
        const _0xc0edfd = _0x3a04d7['user']?.['lid'] || '';
        const _0xdf781c = _0x4d8e68['includes'](':') ? _0x4d8e68['split'](':')[0x0] : _0x4d8e68['includes']('@') ? _0x4d8e68['split']('@')[0x0] : _0x4d8e68;
        const _0x44ef8d = _0x4d8e68['includes']('@') ? _0x4d8e68['split']('@')[0x0] : _0x4d8e68;
        const _0x2229ef = _0xc0edfd['includes'](':') ? _0xc0edfd['split'](':')[0x0] : _0xc0edfd['includes']('@') ? _0xc0edfd['split']('@')[0x0] : _0xc0edfd;
        const _0x5a76fd = _0xc0edfd['includes']('@') ? _0xc0edfd['split']('@')[0x0] : _0xc0edfd;
        const _0xadacaa = _0x3f5913['includes'](':') ? _0x3f5913['split'](':')[0x0] : _0x3f5913['includes']('@') ? _0x3f5913['split']('@')[0x0] : _0x3f5913;
        const _0x2e3769 = _0x3f5913['includes']('@') ? _0x3f5913['split']('@')[0x0] : _0x3f5913;
        const _0x48fe29 = _0x3a4925['some'](_0x2d1616 => {
            const _0x42377f = _0x2d1616['phoneNumber'] ? _0x2d1616['phoneNumber']['split']('@')[0x0] : '';
            const _0x23c58f = _0x2d1616['id'] ? _0x2d1616['id']['split']('@')[0x0] : '';
            const _0x32db80 = _0x2d1616['lid'] ? _0x2d1616['lid']['split']('@')[0x0] : '';
            const _0x296799 = _0x2d1616['id'] || '';
            const _0x1ea1de = _0x2d1616['lid'] || '';
            const _0x164dba = _0x32db80['includes'](':') ? _0x32db80['split'](':')[0x0] : _0x32db80;
            const _0x43225d = _0x4d8e68 === _0x296799 || _0x4d8e68 === _0x1ea1de || _0xc0edfd === _0x1ea1de || _0x2229ef === _0x164dba || _0x5a76fd === _0x32db80 || _0xdf781c === _0x42377f || _0xdf781c === _0x23c58f || _0x44ef8d === _0x42377f || _0x44ef8d === _0x23c58f || _0xc0edfd && _0xc0edfd['split']('@')[0x0]['split'](':')[0x0] === _0x32db80;
            return _0x43225d && (_0x2d1616['admin'] === 'admin' || _0x2d1616['admin'] === 'superadmin');
        });
        const _0x1217c8 = _0x3a4925['some'](_0x2760d1 => {
            const _0x54814e = _0x2760d1['phoneNumber'] ? _0x2760d1['phoneNumber']['split']('@')[0x0] : '';
            const _0xf0c08a = _0x2760d1['id'] ? _0x2760d1['id']['split']('@')[0x0] : '';
            const _0x10bad3 = _0x2760d1['lid'] ? _0x2760d1['lid']['split']('@')[0x0] : '';
            const _0x44779c = _0x2760d1['id'] || '';
            const _0x17e0d8 = _0x2760d1['lid'] || '';
            const _0x1d7d3d = _0x3f5913 === _0x44779c || _0x3f5913 === _0x17e0d8 || _0xadacaa === _0x54814e || _0xadacaa === _0xf0c08a || _0x2e3769 === _0x54814e || _0x2e3769 === _0xf0c08a || _0x10bad3 && _0x2e3769 === _0x10bad3;
            return _0x1d7d3d && (_0x2760d1['admin'] === 'admin' || _0x2760d1['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x1217c8,
            'isBotAdmin': _0x48fe29
        };
    } catch (_0x2974b0) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x2974b0);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;