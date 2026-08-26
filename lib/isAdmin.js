async function isAdmin(_0x2eeb71, _0x4855de, _0x300d37) {
    try {
        const _0x25c2f9 = await _0x2eeb71['groupMetadata'](_0x4855de);
        const _0x3eb86b = _0x25c2f9['participants'] || [];
        const _0x2bfcdd = _0x2eeb71['user']?.['id'] || '';
        const _0x4a5986 = _0x2eeb71['user']?.['lid'] || '';
        const _0x1aca55 = _0x2bfcdd['includes'](':') ? _0x2bfcdd['split'](':')[0x0] : _0x2bfcdd['includes']('@') ? _0x2bfcdd['split']('@')[0x0] : _0x2bfcdd;
        const _0x16ee9a = _0x2bfcdd['includes']('@') ? _0x2bfcdd['split']('@')[0x0] : _0x2bfcdd;
        const _0x164023 = _0x4a5986['includes'](':') ? _0x4a5986['split'](':')[0x0] : _0x4a5986['includes']('@') ? _0x4a5986['split']('@')[0x0] : _0x4a5986;
        const _0x1e653e = _0x4a5986['includes']('@') ? _0x4a5986['split']('@')[0x0] : _0x4a5986;
        const _0x1322fa = _0x300d37['includes'](':') ? _0x300d37['split'](':')[0x0] : _0x300d37['includes']('@') ? _0x300d37['split']('@')[0x0] : _0x300d37;
        const _0xd1a6f9 = _0x300d37['includes']('@') ? _0x300d37['split']('@')[0x0] : _0x300d37;
        const _0x5999f0 = _0x3eb86b['some'](_0x1cf094 => {
            const _0x694973 = _0x1cf094['phoneNumber'] ? _0x1cf094['phoneNumber']['split']('@')[0x0] : '';
            const _0x25ff5b = _0x1cf094['id'] ? _0x1cf094['id']['split']('@')[0x0] : '';
            const _0xe0ec0a = _0x1cf094['lid'] ? _0x1cf094['lid']['split']('@')[0x0] : '';
            const _0x12c6fe = _0x1cf094['id'] || '';
            const _0x1ba991 = _0x1cf094['lid'] || '';
            const _0x1ec646 = _0xe0ec0a['includes'](':') ? _0xe0ec0a['split'](':')[0x0] : _0xe0ec0a;
            const _0x42742e = _0x2bfcdd === _0x12c6fe || _0x2bfcdd === _0x1ba991 || _0x4a5986 === _0x1ba991 || _0x164023 === _0x1ec646 || _0x1e653e === _0xe0ec0a || _0x1aca55 === _0x694973 || _0x1aca55 === _0x25ff5b || _0x16ee9a === _0x694973 || _0x16ee9a === _0x25ff5b || _0x4a5986 && _0x4a5986['split']('@')[0x0]['split'](':')[0x0] === _0xe0ec0a;
            return _0x42742e && (_0x1cf094['admin'] === 'admin' || _0x1cf094['admin'] === 'superadmin');
        });
        const _0xa70342 = _0x3eb86b['some'](_0x58b302 => {
            const _0x230369 = _0x58b302['phoneNumber'] ? _0x58b302['phoneNumber']['split']('@')[0x0] : '';
            const _0x4ec5d9 = _0x58b302['id'] ? _0x58b302['id']['split']('@')[0x0] : '';
            const _0x8bf246 = _0x58b302['lid'] ? _0x58b302['lid']['split']('@')[0x0] : '';
            const _0x5a13df = _0x58b302['id'] || '';
            const _0x304256 = _0x58b302['lid'] || '';
            const _0x3ac254 = _0x300d37 === _0x5a13df || _0x300d37 === _0x304256 || _0x1322fa === _0x230369 || _0x1322fa === _0x4ec5d9 || _0xd1a6f9 === _0x230369 || _0xd1a6f9 === _0x4ec5d9 || _0x8bf246 && _0xd1a6f9 === _0x8bf246;
            return _0x3ac254 && (_0x58b302['admin'] === 'admin' || _0x58b302['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0xa70342,
            'isBotAdmin': _0x5999f0
        };
    } catch (_0x4bc9a9) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x4bc9a9);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;