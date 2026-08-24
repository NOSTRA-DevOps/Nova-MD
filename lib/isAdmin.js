async function isAdmin(_0x3a2e4a, _0x4fea07, _0x373d39) {
    try {
        const _0x384ad1 = await _0x3a2e4a['groupMetadata'](_0x4fea07);
        const _0x126bd7 = _0x384ad1['participants'] || [];
        const _0x5dbe50 = _0x3a2e4a['user']?.['id'] || '';
        const _0x4d0379 = _0x3a2e4a['user']?.['lid'] || '';
        const _0x3c2236 = _0x5dbe50['includes'](':') ? _0x5dbe50['split'](':')[0x0] : _0x5dbe50['includes']('@') ? _0x5dbe50['split']('@')[0x0] : _0x5dbe50;
        const _0x434c22 = _0x5dbe50['includes']('@') ? _0x5dbe50['split']('@')[0x0] : _0x5dbe50;
        const _0x31a731 = _0x4d0379['includes'](':') ? _0x4d0379['split'](':')[0x0] : _0x4d0379['includes']('@') ? _0x4d0379['split']('@')[0x0] : _0x4d0379;
        const _0x4d5b3b = _0x4d0379['includes']('@') ? _0x4d0379['split']('@')[0x0] : _0x4d0379;
        const _0x47efef = _0x373d39['includes'](':') ? _0x373d39['split'](':')[0x0] : _0x373d39['includes']('@') ? _0x373d39['split']('@')[0x0] : _0x373d39;
        const _0x457aba = _0x373d39['includes']('@') ? _0x373d39['split']('@')[0x0] : _0x373d39;
        const _0x526c03 = _0x126bd7['some'](_0x4aef04 => {
            const _0x13f2c2 = _0x4aef04['phoneNumber'] ? _0x4aef04['phoneNumber']['split']('@')[0x0] : '';
            const _0x46b05c = _0x4aef04['id'] ? _0x4aef04['id']['split']('@')[0x0] : '';
            const _0x1f955e = _0x4aef04['lid'] ? _0x4aef04['lid']['split']('@')[0x0] : '';
            const _0x2e5c7f = _0x4aef04['id'] || '';
            const _0x13c6c = _0x4aef04['lid'] || '';
            const _0x4a0605 = _0x1f955e['includes'](':') ? _0x1f955e['split'](':')[0x0] : _0x1f955e;
            const _0x2372d8 = _0x5dbe50 === _0x2e5c7f || _0x5dbe50 === _0x13c6c || _0x4d0379 === _0x13c6c || _0x31a731 === _0x4a0605 || _0x4d5b3b === _0x1f955e || _0x3c2236 === _0x13f2c2 || _0x3c2236 === _0x46b05c || _0x434c22 === _0x13f2c2 || _0x434c22 === _0x46b05c || _0x4d0379 && _0x4d0379['split']('@')[0x0]['split'](':')[0x0] === _0x1f955e;
            return _0x2372d8 && (_0x4aef04['admin'] === 'admin' || _0x4aef04['admin'] === 'superadmin');
        });
        const _0x13dde0 = _0x126bd7['some'](_0xadad38 => {
            const _0x5bd668 = _0xadad38['phoneNumber'] ? _0xadad38['phoneNumber']['split']('@')[0x0] : '';
            const _0x11f0ec = _0xadad38['id'] ? _0xadad38['id']['split']('@')[0x0] : '';
            const _0x487ed2 = _0xadad38['lid'] ? _0xadad38['lid']['split']('@')[0x0] : '';
            const _0x5d2f4e = _0xadad38['id'] || '';
            const _0x4ead5b = _0xadad38['lid'] || '';
            const _0x4bb9c4 = _0x373d39 === _0x5d2f4e || _0x373d39 === _0x4ead5b || _0x47efef === _0x5bd668 || _0x47efef === _0x11f0ec || _0x457aba === _0x5bd668 || _0x457aba === _0x11f0ec || _0x487ed2 && _0x457aba === _0x487ed2;
            return _0x4bb9c4 && (_0xadad38['admin'] === 'admin' || _0xadad38['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x13dde0,
            'isBotAdmin': _0x526c03
        };
    } catch (_0x5e08a9) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x5e08a9);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;