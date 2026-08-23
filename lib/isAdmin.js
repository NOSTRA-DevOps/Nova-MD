async function isAdmin(_0x258546, _0x4b9e3a, _0x50a751) {
    try {
        const _0xb688a9 = await _0x258546['groupMetadata'](_0x4b9e3a);
        const _0x7088fe = _0xb688a9['participants'] || [];
        const _0x54d210 = _0x258546['user']?.['id'] || '';
        const _0x338c8b = _0x258546['user']?.['lid'] || '';
        const _0x4a858e = _0x54d210['includes'](':') ? _0x54d210['split'](':')[0x0] : _0x54d210['includes']('@') ? _0x54d210['split']('@')[0x0] : _0x54d210;
        const _0x356aec = _0x54d210['includes']('@') ? _0x54d210['split']('@')[0x0] : _0x54d210;
        const _0x5813c6 = _0x338c8b['includes'](':') ? _0x338c8b['split'](':')[0x0] : _0x338c8b['includes']('@') ? _0x338c8b['split']('@')[0x0] : _0x338c8b;
        const _0xb11d6 = _0x338c8b['includes']('@') ? _0x338c8b['split']('@')[0x0] : _0x338c8b;
        const _0x4141f3 = _0x50a751['includes'](':') ? _0x50a751['split'](':')[0x0] : _0x50a751['includes']('@') ? _0x50a751['split']('@')[0x0] : _0x50a751;
        const _0x23ff12 = _0x50a751['includes']('@') ? _0x50a751['split']('@')[0x0] : _0x50a751;
        const _0x19c0d9 = _0x7088fe['some'](_0x13b4cf => {
            const _0x56f2eb = _0x13b4cf['phoneNumber'] ? _0x13b4cf['phoneNumber']['split']('@')[0x0] : '';
            const _0x5ae86e = _0x13b4cf['id'] ? _0x13b4cf['id']['split']('@')[0x0] : '';
            const _0x27b848 = _0x13b4cf['lid'] ? _0x13b4cf['lid']['split']('@')[0x0] : '';
            const _0x469ce2 = _0x13b4cf['id'] || '';
            const _0x3b5e02 = _0x13b4cf['lid'] || '';
            const _0x55876e = _0x27b848['includes'](':') ? _0x27b848['split'](':')[0x0] : _0x27b848;
            const _0x3a00e3 = _0x54d210 === _0x469ce2 || _0x54d210 === _0x3b5e02 || _0x338c8b === _0x3b5e02 || _0x5813c6 === _0x55876e || _0xb11d6 === _0x27b848 || _0x4a858e === _0x56f2eb || _0x4a858e === _0x5ae86e || _0x356aec === _0x56f2eb || _0x356aec === _0x5ae86e || _0x338c8b && _0x338c8b['split']('@')[0x0]['split'](':')[0x0] === _0x27b848;
            return _0x3a00e3 && (_0x13b4cf['admin'] === 'admin' || _0x13b4cf['admin'] === 'superadmin');
        });
        const _0x5d11f5 = _0x7088fe['some'](_0x272f2c => {
            const _0x3d3dce = _0x272f2c['phoneNumber'] ? _0x272f2c['phoneNumber']['split']('@')[0x0] : '';
            const _0x2f3dd7 = _0x272f2c['id'] ? _0x272f2c['id']['split']('@')[0x0] : '';
            const _0x1bead8 = _0x272f2c['lid'] ? _0x272f2c['lid']['split']('@')[0x0] : '';
            const _0x10f379 = _0x272f2c['id'] || '';
            const _0x5255b7 = _0x272f2c['lid'] || '';
            const _0x181e45 = _0x50a751 === _0x10f379 || _0x50a751 === _0x5255b7 || _0x4141f3 === _0x3d3dce || _0x4141f3 === _0x2f3dd7 || _0x23ff12 === _0x3d3dce || _0x23ff12 === _0x2f3dd7 || _0x1bead8 && _0x23ff12 === _0x1bead8;
            return _0x181e45 && (_0x272f2c['admin'] === 'admin' || _0x272f2c['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x5d11f5,
            'isBotAdmin': _0x19c0d9
        };
    } catch (_0x32f102) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x32f102);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;