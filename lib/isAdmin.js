async function isAdmin(_0x3dfeae, _0x4b2b6a, _0x2870b2) {
    try {
        const _0x924c6 = await _0x3dfeae['groupMetadata'](_0x4b2b6a);
        const _0x446b9d = _0x924c6['participants'] || [];
        const _0x24e712 = _0x3dfeae['user']?.['id'] || '';
        const _0x24e394 = _0x3dfeae['user']?.['lid'] || '';
        const _0xb8f4d7 = _0x24e712['includes'](':') ? _0x24e712['split'](':')[0x0] : _0x24e712['includes']('@') ? _0x24e712['split']('@')[0x0] : _0x24e712;
        const _0xf236f6 = _0x24e712['includes']('@') ? _0x24e712['split']('@')[0x0] : _0x24e712;
        const _0x8d8f3c = _0x24e394['includes'](':') ? _0x24e394['split'](':')[0x0] : _0x24e394['includes']('@') ? _0x24e394['split']('@')[0x0] : _0x24e394;
        const _0x4cfce1 = _0x24e394['includes']('@') ? _0x24e394['split']('@')[0x0] : _0x24e394;
        const _0x200d3f = _0x2870b2['includes'](':') ? _0x2870b2['split'](':')[0x0] : _0x2870b2['includes']('@') ? _0x2870b2['split']('@')[0x0] : _0x2870b2;
        const _0x134821 = _0x2870b2['includes']('@') ? _0x2870b2['split']('@')[0x0] : _0x2870b2;
        const _0x5eaf92 = _0x446b9d['some'](_0x38344d => {
            const _0x76af6b = _0x38344d['phoneNumber'] ? _0x38344d['phoneNumber']['split']('@')[0x0] : '';
            const _0x210f87 = _0x38344d['id'] ? _0x38344d['id']['split']('@')[0x0] : '';
            const _0x2f9b50 = _0x38344d['lid'] ? _0x38344d['lid']['split']('@')[0x0] : '';
            const _0x169b24 = _0x38344d['id'] || '';
            const _0x202968 = _0x38344d['lid'] || '';
            const _0x5e9409 = _0x2f9b50['includes'](':') ? _0x2f9b50['split'](':')[0x0] : _0x2f9b50;
            const _0x25823d = _0x24e712 === _0x169b24 || _0x24e712 === _0x202968 || _0x24e394 === _0x202968 || _0x8d8f3c === _0x5e9409 || _0x4cfce1 === _0x2f9b50 || _0xb8f4d7 === _0x76af6b || _0xb8f4d7 === _0x210f87 || _0xf236f6 === _0x76af6b || _0xf236f6 === _0x210f87 || _0x24e394 && _0x24e394['split']('@')[0x0]['split'](':')[0x0] === _0x2f9b50;
            return _0x25823d && (_0x38344d['admin'] === 'admin' || _0x38344d['admin'] === 'superadmin');
        });
        const _0x171a36 = _0x446b9d['some'](_0x8f223d => {
            const _0x1b4fff = _0x8f223d['phoneNumber'] ? _0x8f223d['phoneNumber']['split']('@')[0x0] : '';
            const _0x3ad54b = _0x8f223d['id'] ? _0x8f223d['id']['split']('@')[0x0] : '';
            const _0x4b8f1a = _0x8f223d['lid'] ? _0x8f223d['lid']['split']('@')[0x0] : '';
            const _0x3c745c = _0x8f223d['id'] || '';
            const _0x3089d5 = _0x8f223d['lid'] || '';
            const _0x3e4b99 = _0x2870b2 === _0x3c745c || _0x2870b2 === _0x3089d5 || _0x200d3f === _0x1b4fff || _0x200d3f === _0x3ad54b || _0x134821 === _0x1b4fff || _0x134821 === _0x3ad54b || _0x4b8f1a && _0x134821 === _0x4b8f1a;
            return _0x3e4b99 && (_0x8f223d['admin'] === 'admin' || _0x8f223d['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x171a36,
            'isBotAdmin': _0x5eaf92
        };
    } catch (_0x201a65) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x201a65);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;