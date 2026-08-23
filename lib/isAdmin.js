async function isAdmin(_0xcf26d8, _0x150718, _0x8799f8) {
    try {
        const _0x1521f3 = await _0xcf26d8['groupMetadata'](_0x150718);
        const _0x3781d9 = _0x1521f3['participants'] || [];
        const _0xa4ceb5 = _0xcf26d8['user']?.['id'] || '';
        const _0x5d8b06 = _0xcf26d8['user']?.['lid'] || '';
        const _0x2487ca = _0xa4ceb5['includes'](':') ? _0xa4ceb5['split'](':')[0x0] : _0xa4ceb5['includes']('@') ? _0xa4ceb5['split']('@')[0x0] : _0xa4ceb5;
        const _0x100dc1 = _0xa4ceb5['includes']('@') ? _0xa4ceb5['split']('@')[0x0] : _0xa4ceb5;
        const _0x412a8a = _0x5d8b06['includes'](':') ? _0x5d8b06['split'](':')[0x0] : _0x5d8b06['includes']('@') ? _0x5d8b06['split']('@')[0x0] : _0x5d8b06;
        const _0x22e56b = _0x5d8b06['includes']('@') ? _0x5d8b06['split']('@')[0x0] : _0x5d8b06;
        const _0x33899a = _0x8799f8['includes'](':') ? _0x8799f8['split'](':')[0x0] : _0x8799f8['includes']('@') ? _0x8799f8['split']('@')[0x0] : _0x8799f8;
        const _0x4d685d = _0x8799f8['includes']('@') ? _0x8799f8['split']('@')[0x0] : _0x8799f8;
        const _0x46619e = _0x3781d9['some'](_0x5d4ac9 => {
            const _0x14ded4 = _0x5d4ac9['phoneNumber'] ? _0x5d4ac9['phoneNumber']['split']('@')[0x0] : '';
            const _0x24ae49 = _0x5d4ac9['id'] ? _0x5d4ac9['id']['split']('@')[0x0] : '';
            const _0x17b87e = _0x5d4ac9['lid'] ? _0x5d4ac9['lid']['split']('@')[0x0] : '';
            const _0x74d1a9 = _0x5d4ac9['id'] || '';
            const _0x30ed30 = _0x5d4ac9['lid'] || '';
            const _0x13d94d = _0x17b87e['includes'](':') ? _0x17b87e['split'](':')[0x0] : _0x17b87e;
            const _0x45934b = _0xa4ceb5 === _0x74d1a9 || _0xa4ceb5 === _0x30ed30 || _0x5d8b06 === _0x30ed30 || _0x412a8a === _0x13d94d || _0x22e56b === _0x17b87e || _0x2487ca === _0x14ded4 || _0x2487ca === _0x24ae49 || _0x100dc1 === _0x14ded4 || _0x100dc1 === _0x24ae49 || _0x5d8b06 && _0x5d8b06['split']('@')[0x0]['split'](':')[0x0] === _0x17b87e;
            return _0x45934b && (_0x5d4ac9['admin'] === 'admin' || _0x5d4ac9['admin'] === 'superadmin');
        });
        const _0x5069b3 = _0x3781d9['some'](_0x38917d => {
            const _0x3e55a4 = _0x38917d['phoneNumber'] ? _0x38917d['phoneNumber']['split']('@')[0x0] : '';
            const _0x840d6f = _0x38917d['id'] ? _0x38917d['id']['split']('@')[0x0] : '';
            const _0x408e79 = _0x38917d['lid'] ? _0x38917d['lid']['split']('@')[0x0] : '';
            const _0x1d8df4 = _0x38917d['id'] || '';
            const _0x421fab = _0x38917d['lid'] || '';
            const _0x20d79d = _0x8799f8 === _0x1d8df4 || _0x8799f8 === _0x421fab || _0x33899a === _0x3e55a4 || _0x33899a === _0x840d6f || _0x4d685d === _0x3e55a4 || _0x4d685d === _0x840d6f || _0x408e79 && _0x4d685d === _0x408e79;
            return _0x20d79d && (_0x38917d['admin'] === 'admin' || _0x38917d['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x5069b3,
            'isBotAdmin': _0x46619e
        };
    } catch (_0x503cc2) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x503cc2);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;