async function isAdmin(_0x683667, _0x527570, _0x3a158a) {
    try {
        const _0x186128 = await _0x683667['groupMetadata'](_0x527570);
        const _0x18bb9f = _0x186128['participants'] || [];
        const _0x990e45 = _0x683667['user']?.['id'] || '';
        const _0x205848 = _0x683667['user']?.['lid'] || '';
        const _0x26dafa = _0x990e45['includes'](':') ? _0x990e45['split'](':')[0x0] : _0x990e45['includes']('@') ? _0x990e45['split']('@')[0x0] : _0x990e45;
        const _0x4ce9b6 = _0x990e45['includes']('@') ? _0x990e45['split']('@')[0x0] : _0x990e45;
        const _0x32a2bb = _0x205848['includes'](':') ? _0x205848['split'](':')[0x0] : _0x205848['includes']('@') ? _0x205848['split']('@')[0x0] : _0x205848;
        const _0x1650a6 = _0x205848['includes']('@') ? _0x205848['split']('@')[0x0] : _0x205848;
        const _0x1aa15b = _0x3a158a['includes'](':') ? _0x3a158a['split'](':')[0x0] : _0x3a158a['includes']('@') ? _0x3a158a['split']('@')[0x0] : _0x3a158a;
        const _0x2132d5 = _0x3a158a['includes']('@') ? _0x3a158a['split']('@')[0x0] : _0x3a158a;
        const _0x59fa62 = _0x18bb9f['some'](_0x39a823 => {
            const _0x5a2603 = _0x39a823['phoneNumber'] ? _0x39a823['phoneNumber']['split']('@')[0x0] : '';
            const _0x5df7ef = _0x39a823['id'] ? _0x39a823['id']['split']('@')[0x0] : '';
            const _0xa72c74 = _0x39a823['lid'] ? _0x39a823['lid']['split']('@')[0x0] : '';
            const _0x454bdd = _0x39a823['id'] || '';
            const _0x39b352 = _0x39a823['lid'] || '';
            const _0x57058c = _0xa72c74['includes'](':') ? _0xa72c74['split'](':')[0x0] : _0xa72c74;
            const _0x2dab1b = _0x990e45 === _0x454bdd || _0x990e45 === _0x39b352 || _0x205848 === _0x39b352 || _0x32a2bb === _0x57058c || _0x1650a6 === _0xa72c74 || _0x26dafa === _0x5a2603 || _0x26dafa === _0x5df7ef || _0x4ce9b6 === _0x5a2603 || _0x4ce9b6 === _0x5df7ef || _0x205848 && _0x205848['split']('@')[0x0]['split'](':')[0x0] === _0xa72c74;
            return _0x2dab1b && (_0x39a823['admin'] === 'admin' || _0x39a823['admin'] === 'superadmin');
        });
        const _0x3ae584 = _0x18bb9f['some'](_0x5ea07a => {
            const _0x335023 = _0x5ea07a['phoneNumber'] ? _0x5ea07a['phoneNumber']['split']('@')[0x0] : '';
            const _0x379f41 = _0x5ea07a['id'] ? _0x5ea07a['id']['split']('@')[0x0] : '';
            const _0x2a5e6b = _0x5ea07a['lid'] ? _0x5ea07a['lid']['split']('@')[0x0] : '';
            const _0x48409f = _0x5ea07a['id'] || '';
            const _0x191a8a = _0x5ea07a['lid'] || '';
            const _0x54fe8f = _0x3a158a === _0x48409f || _0x3a158a === _0x191a8a || _0x1aa15b === _0x335023 || _0x1aa15b === _0x379f41 || _0x2132d5 === _0x335023 || _0x2132d5 === _0x379f41 || _0x2a5e6b && _0x2132d5 === _0x2a5e6b;
            return _0x54fe8f && (_0x5ea07a['admin'] === 'admin' || _0x5ea07a['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x3ae584,
            'isBotAdmin': _0x59fa62
        };
    } catch (_0x5e673f) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x5e673f);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;