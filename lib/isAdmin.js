async function isAdmin(_0x37e9d7, _0x738ff0, _0x3511df) {
    try {
        const _0x39327e = await _0x37e9d7['groupMetadata'](_0x738ff0);
        const _0x131ca6 = _0x39327e['participants'] || [];
        const _0x3b6b4b = _0x37e9d7['user']?.['id'] || '';
        const _0x3874ab = _0x37e9d7['user']?.['lid'] || '';
        const _0x5124e4 = _0x3b6b4b['includes'](':') ? _0x3b6b4b['split'](':')[0x0] : _0x3b6b4b['includes']('@') ? _0x3b6b4b['split']('@')[0x0] : _0x3b6b4b;
        const _0x9119f = _0x3b6b4b['includes']('@') ? _0x3b6b4b['split']('@')[0x0] : _0x3b6b4b;
        const _0x1c9c92 = _0x3874ab['includes'](':') ? _0x3874ab['split'](':')[0x0] : _0x3874ab['includes']('@') ? _0x3874ab['split']('@')[0x0] : _0x3874ab;
        const _0x344db8 = _0x3874ab['includes']('@') ? _0x3874ab['split']('@')[0x0] : _0x3874ab;
        const _0x35992a = _0x3511df['includes'](':') ? _0x3511df['split'](':')[0x0] : _0x3511df['includes']('@') ? _0x3511df['split']('@')[0x0] : _0x3511df;
        const _0x301331 = _0x3511df['includes']('@') ? _0x3511df['split']('@')[0x0] : _0x3511df;
        const _0x144f3e = _0x131ca6['some'](_0xb27e1b => {
            const _0x38795f = _0xb27e1b['phoneNumber'] ? _0xb27e1b['phoneNumber']['split']('@')[0x0] : '';
            const _0x4252a3 = _0xb27e1b['id'] ? _0xb27e1b['id']['split']('@')[0x0] : '';
            const _0x358ee8 = _0xb27e1b['lid'] ? _0xb27e1b['lid']['split']('@')[0x0] : '';
            const _0x3d0ee3 = _0xb27e1b['id'] || '';
            const _0x49e0b7 = _0xb27e1b['lid'] || '';
            const _0x1149dc = _0x358ee8['includes'](':') ? _0x358ee8['split'](':')[0x0] : _0x358ee8;
            const _0x36a7ea = _0x3b6b4b === _0x3d0ee3 || _0x3b6b4b === _0x49e0b7 || _0x3874ab === _0x49e0b7 || _0x1c9c92 === _0x1149dc || _0x344db8 === _0x358ee8 || _0x5124e4 === _0x38795f || _0x5124e4 === _0x4252a3 || _0x9119f === _0x38795f || _0x9119f === _0x4252a3 || _0x3874ab && _0x3874ab['split']('@')[0x0]['split'](':')[0x0] === _0x358ee8;
            return _0x36a7ea && (_0xb27e1b['admin'] === 'admin' || _0xb27e1b['admin'] === 'superadmin');
        });
        const _0x10f43e = _0x131ca6['some'](_0x55ddcc => {
            const _0x45dd1e = _0x55ddcc['phoneNumber'] ? _0x55ddcc['phoneNumber']['split']('@')[0x0] : '';
            const _0xadb235 = _0x55ddcc['id'] ? _0x55ddcc['id']['split']('@')[0x0] : '';
            const _0x2b89ad = _0x55ddcc['lid'] ? _0x55ddcc['lid']['split']('@')[0x0] : '';
            const _0x2063bb = _0x55ddcc['id'] || '';
            const _0xb329e2 = _0x55ddcc['lid'] || '';
            const _0x485ca7 = _0x3511df === _0x2063bb || _0x3511df === _0xb329e2 || _0x35992a === _0x45dd1e || _0x35992a === _0xadb235 || _0x301331 === _0x45dd1e || _0x301331 === _0xadb235 || _0x2b89ad && _0x301331 === _0x2b89ad;
            return _0x485ca7 && (_0x55ddcc['admin'] === 'admin' || _0x55ddcc['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x10f43e,
            'isBotAdmin': _0x144f3e
        };
    } catch (_0x3e6980) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x3e6980);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;