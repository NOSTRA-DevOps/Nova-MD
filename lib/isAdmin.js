async function isAdmin(_0xa899f7, _0x31d15b, _0x2f06c7) {
    try {
        const _0x4ac371 = await _0xa899f7['groupMetadata'](_0x31d15b);
        const _0x540b54 = _0x4ac371['participants'] || [];
        const _0x3fe073 = _0xa899f7['user']?.['id'] || '';
        const _0x427be8 = _0xa899f7['user']?.['lid'] || '';
        const _0x7c58e9 = _0x3fe073['includes'](':') ? _0x3fe073['split'](':')[0x0] : _0x3fe073['includes']('@') ? _0x3fe073['split']('@')[0x0] : _0x3fe073;
        const _0x3fdf1c = _0x3fe073['includes']('@') ? _0x3fe073['split']('@')[0x0] : _0x3fe073;
        const _0x24391e = _0x427be8['includes'](':') ? _0x427be8['split'](':')[0x0] : _0x427be8['includes']('@') ? _0x427be8['split']('@')[0x0] : _0x427be8;
        const _0x1e4142 = _0x427be8['includes']('@') ? _0x427be8['split']('@')[0x0] : _0x427be8;
        const _0x452401 = _0x2f06c7['includes'](':') ? _0x2f06c7['split'](':')[0x0] : _0x2f06c7['includes']('@') ? _0x2f06c7['split']('@')[0x0] : _0x2f06c7;
        const _0x321cfb = _0x2f06c7['includes']('@') ? _0x2f06c7['split']('@')[0x0] : _0x2f06c7;
        const _0x68af55 = _0x540b54['some'](_0x5e9009 => {
            const _0x556f31 = _0x5e9009['phoneNumber'] ? _0x5e9009['phoneNumber']['split']('@')[0x0] : '';
            const _0x1c5edf = _0x5e9009['id'] ? _0x5e9009['id']['split']('@')[0x0] : '';
            const _0x11489e = _0x5e9009['lid'] ? _0x5e9009['lid']['split']('@')[0x0] : '';
            const _0x18781c = _0x5e9009['id'] || '';
            const _0xfca80a = _0x5e9009['lid'] || '';
            const _0x5a426a = _0x11489e['includes'](':') ? _0x11489e['split'](':')[0x0] : _0x11489e;
            const _0x225ec1 = _0x3fe073 === _0x18781c || _0x3fe073 === _0xfca80a || _0x427be8 === _0xfca80a || _0x24391e === _0x5a426a || _0x1e4142 === _0x11489e || _0x7c58e9 === _0x556f31 || _0x7c58e9 === _0x1c5edf || _0x3fdf1c === _0x556f31 || _0x3fdf1c === _0x1c5edf || _0x427be8 && _0x427be8['split']('@')[0x0]['split'](':')[0x0] === _0x11489e;
            return _0x225ec1 && (_0x5e9009['admin'] === 'admin' || _0x5e9009['admin'] === 'superadmin');
        });
        const _0x1f5d4c = _0x540b54['some'](_0x3a88ca => {
            const _0x2b0c5c = _0x3a88ca['phoneNumber'] ? _0x3a88ca['phoneNumber']['split']('@')[0x0] : '';
            const _0x16e06b = _0x3a88ca['id'] ? _0x3a88ca['id']['split']('@')[0x0] : '';
            const _0x5e802a = _0x3a88ca['lid'] ? _0x3a88ca['lid']['split']('@')[0x0] : '';
            const _0x2f5289 = _0x3a88ca['id'] || '';
            const _0x590a48 = _0x3a88ca['lid'] || '';
            const _0x40c17 = _0x2f06c7 === _0x2f5289 || _0x2f06c7 === _0x590a48 || _0x452401 === _0x2b0c5c || _0x452401 === _0x16e06b || _0x321cfb === _0x2b0c5c || _0x321cfb === _0x16e06b || _0x5e802a && _0x321cfb === _0x5e802a;
            return _0x40c17 && (_0x3a88ca['admin'] === 'admin' || _0x3a88ca['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x1f5d4c,
            'isBotAdmin': _0x68af55
        };
    } catch (_0xba1edd) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0xba1edd);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;