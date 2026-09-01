async function isAdmin(_0x5b0142, _0x17ca99, _0x38c78c) {
    try {
        const _0x5b5038 = await _0x5b0142['groupMetadata'](_0x17ca99);
        const _0x155484 = _0x5b5038['participants'] || [];
        const _0x2c86e9 = _0x5b0142['user']?.['id'] || '';
        const _0x1822dc = _0x5b0142['user']?.['lid'] || '';
        const _0x5152c6 = _0x2c86e9['includes'](':') ? _0x2c86e9['split'](':')[0x0] : _0x2c86e9['includes']('@') ? _0x2c86e9['split']('@')[0x0] : _0x2c86e9;
        const _0x519095 = _0x2c86e9['includes']('@') ? _0x2c86e9['split']('@')[0x0] : _0x2c86e9;
        const _0x6a9f56 = _0x1822dc['includes'](':') ? _0x1822dc['split'](':')[0x0] : _0x1822dc['includes']('@') ? _0x1822dc['split']('@')[0x0] : _0x1822dc;
        const _0x5a06a9 = _0x1822dc['includes']('@') ? _0x1822dc['split']('@')[0x0] : _0x1822dc;
        const _0x500c17 = _0x38c78c['includes'](':') ? _0x38c78c['split'](':')[0x0] : _0x38c78c['includes']('@') ? _0x38c78c['split']('@')[0x0] : _0x38c78c;
        const _0x19ffa2 = _0x38c78c['includes']('@') ? _0x38c78c['split']('@')[0x0] : _0x38c78c;
        const _0x8cdc41 = _0x155484['some'](_0x25cb5d => {
            const _0x23e993 = _0x25cb5d['phoneNumber'] ? _0x25cb5d['phoneNumber']['split']('@')[0x0] : '';
            const _0x1a698c = _0x25cb5d['id'] ? _0x25cb5d['id']['split']('@')[0x0] : '';
            const _0x3b5ffa = _0x25cb5d['lid'] ? _0x25cb5d['lid']['split']('@')[0x0] : '';
            const _0x5b5fa0 = _0x25cb5d['id'] || '';
            const _0x2ca5e9 = _0x25cb5d['lid'] || '';
            const _0x2ec128 = _0x3b5ffa['includes'](':') ? _0x3b5ffa['split'](':')[0x0] : _0x3b5ffa;
            const _0x2af5ba = _0x2c86e9 === _0x5b5fa0 || _0x2c86e9 === _0x2ca5e9 || _0x1822dc === _0x2ca5e9 || _0x6a9f56 === _0x2ec128 || _0x5a06a9 === _0x3b5ffa || _0x5152c6 === _0x23e993 || _0x5152c6 === _0x1a698c || _0x519095 === _0x23e993 || _0x519095 === _0x1a698c || _0x1822dc && _0x1822dc['split']('@')[0x0]['split'](':')[0x0] === _0x3b5ffa;
            return _0x2af5ba && (_0x25cb5d['admin'] === 'admin' || _0x25cb5d['admin'] === 'superadmin');
        });
        const _0x134b3e = _0x155484['some'](_0x3017f9 => {
            const _0x247bb2 = _0x3017f9['phoneNumber'] ? _0x3017f9['phoneNumber']['split']('@')[0x0] : '';
            const _0x3f7c20 = _0x3017f9['id'] ? _0x3017f9['id']['split']('@')[0x0] : '';
            const _0x44bc68 = _0x3017f9['lid'] ? _0x3017f9['lid']['split']('@')[0x0] : '';
            const _0xee366c = _0x3017f9['id'] || '';
            const _0x4e4583 = _0x3017f9['lid'] || '';
            const _0x65ff05 = _0x38c78c === _0xee366c || _0x38c78c === _0x4e4583 || _0x500c17 === _0x247bb2 || _0x500c17 === _0x3f7c20 || _0x19ffa2 === _0x247bb2 || _0x19ffa2 === _0x3f7c20 || _0x44bc68 && _0x19ffa2 === _0x44bc68;
            return _0x65ff05 && (_0x3017f9['admin'] === 'admin' || _0x3017f9['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x134b3e,
            'isBotAdmin': _0x8cdc41
        };
    } catch (_0x72b84a) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x72b84a);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;