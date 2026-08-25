async function isAdmin(_0x852a33, _0x5c102b, _0x2b47e0) {
    try {
        const _0x184f71 = await _0x852a33['groupMetadata'](_0x5c102b);
        const _0x21de8f = _0x184f71['participants'] || [];
        const _0x4da7e1 = _0x852a33['user']?.['id'] || '';
        const _0x527313 = _0x852a33['user']?.['lid'] || '';
        const _0x550599 = _0x4da7e1['includes'](':') ? _0x4da7e1['split'](':')[0x0] : _0x4da7e1['includes']('@') ? _0x4da7e1['split']('@')[0x0] : _0x4da7e1;
        const _0x363bfc = _0x4da7e1['includes']('@') ? _0x4da7e1['split']('@')[0x0] : _0x4da7e1;
        const _0xe4e869 = _0x527313['includes'](':') ? _0x527313['split'](':')[0x0] : _0x527313['includes']('@') ? _0x527313['split']('@')[0x0] : _0x527313;
        const _0x521e09 = _0x527313['includes']('@') ? _0x527313['split']('@')[0x0] : _0x527313;
        const _0x312b05 = _0x2b47e0['includes'](':') ? _0x2b47e0['split'](':')[0x0] : _0x2b47e0['includes']('@') ? _0x2b47e0['split']('@')[0x0] : _0x2b47e0;
        const _0x270ebb = _0x2b47e0['includes']('@') ? _0x2b47e0['split']('@')[0x0] : _0x2b47e0;
        const _0x4aa4ab = _0x21de8f['some'](_0x295f76 => {
            const _0x1d631a = _0x295f76['phoneNumber'] ? _0x295f76['phoneNumber']['split']('@')[0x0] : '';
            const _0x36956a = _0x295f76['id'] ? _0x295f76['id']['split']('@')[0x0] : '';
            const _0x234acc = _0x295f76['lid'] ? _0x295f76['lid']['split']('@')[0x0] : '';
            const _0x8ef2b0 = _0x295f76['id'] || '';
            const _0x4aab4a = _0x295f76['lid'] || '';
            const _0x30b43b = _0x234acc['includes'](':') ? _0x234acc['split'](':')[0x0] : _0x234acc;
            const _0x506341 = _0x4da7e1 === _0x8ef2b0 || _0x4da7e1 === _0x4aab4a || _0x527313 === _0x4aab4a || _0xe4e869 === _0x30b43b || _0x521e09 === _0x234acc || _0x550599 === _0x1d631a || _0x550599 === _0x36956a || _0x363bfc === _0x1d631a || _0x363bfc === _0x36956a || _0x527313 && _0x527313['split']('@')[0x0]['split'](':')[0x0] === _0x234acc;
            return _0x506341 && (_0x295f76['admin'] === 'admin' || _0x295f76['admin'] === 'superadmin');
        });
        const _0x2bf9c3 = _0x21de8f['some'](_0x1b3a9a => {
            const _0x35622b = _0x1b3a9a['phoneNumber'] ? _0x1b3a9a['phoneNumber']['split']('@')[0x0] : '';
            const _0x301b8f = _0x1b3a9a['id'] ? _0x1b3a9a['id']['split']('@')[0x0] : '';
            const _0x27e3f9 = _0x1b3a9a['lid'] ? _0x1b3a9a['lid']['split']('@')[0x0] : '';
            const _0x3d9cc8 = _0x1b3a9a['id'] || '';
            const _0x56a57f = _0x1b3a9a['lid'] || '';
            const _0x46d2d2 = _0x2b47e0 === _0x3d9cc8 || _0x2b47e0 === _0x56a57f || _0x312b05 === _0x35622b || _0x312b05 === _0x301b8f || _0x270ebb === _0x35622b || _0x270ebb === _0x301b8f || _0x27e3f9 && _0x270ebb === _0x27e3f9;
            return _0x46d2d2 && (_0x1b3a9a['admin'] === 'admin' || _0x1b3a9a['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x2bf9c3,
            'isBotAdmin': _0x4aa4ab
        };
    } catch (_0x232c84) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x232c84);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;