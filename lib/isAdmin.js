async function isAdmin(_0x4978b0, _0x3ec5b7, _0x52e679) {
    try {
        const _0x156084 = await _0x4978b0['groupMetadata'](_0x3ec5b7);
        const _0x46069b = _0x156084['participants'] || [];
        const _0x27da61 = _0x4978b0['user']?.['id'] || '';
        const _0x1885c6 = _0x4978b0['user']?.['lid'] || '';
        const _0x28140d = _0x27da61['includes'](':') ? _0x27da61['split'](':')[0x0] : _0x27da61['includes']('@') ? _0x27da61['split']('@')[0x0] : _0x27da61;
        const _0x5bf091 = _0x27da61['includes']('@') ? _0x27da61['split']('@')[0x0] : _0x27da61;
        const _0x4cdb7b = _0x1885c6['includes'](':') ? _0x1885c6['split'](':')[0x0] : _0x1885c6['includes']('@') ? _0x1885c6['split']('@')[0x0] : _0x1885c6;
        const _0x2f9e19 = _0x1885c6['includes']('@') ? _0x1885c6['split']('@')[0x0] : _0x1885c6;
        const _0x38c9a6 = _0x52e679['includes'](':') ? _0x52e679['split'](':')[0x0] : _0x52e679['includes']('@') ? _0x52e679['split']('@')[0x0] : _0x52e679;
        const _0x255df2 = _0x52e679['includes']('@') ? _0x52e679['split']('@')[0x0] : _0x52e679;
        const _0xc20466 = _0x46069b['some'](_0x1efb13 => {
            const _0x68a1b4 = _0x1efb13['phoneNumber'] ? _0x1efb13['phoneNumber']['split']('@')[0x0] : '';
            const _0x4c6fc0 = _0x1efb13['id'] ? _0x1efb13['id']['split']('@')[0x0] : '';
            const _0x2cb9e1 = _0x1efb13['lid'] ? _0x1efb13['lid']['split']('@')[0x0] : '';
            const _0x3e2559 = _0x1efb13['id'] || '';
            const _0x163b05 = _0x1efb13['lid'] || '';
            const _0x5a5d03 = _0x2cb9e1['includes'](':') ? _0x2cb9e1['split'](':')[0x0] : _0x2cb9e1;
            const _0x51204e = _0x27da61 === _0x3e2559 || _0x27da61 === _0x163b05 || _0x1885c6 === _0x163b05 || _0x4cdb7b === _0x5a5d03 || _0x2f9e19 === _0x2cb9e1 || _0x28140d === _0x68a1b4 || _0x28140d === _0x4c6fc0 || _0x5bf091 === _0x68a1b4 || _0x5bf091 === _0x4c6fc0 || _0x1885c6 && _0x1885c6['split']('@')[0x0]['split'](':')[0x0] === _0x2cb9e1;
            return _0x51204e && (_0x1efb13['admin'] === 'admin' || _0x1efb13['admin'] === 'superadmin');
        });
        const _0x2c9bbb = _0x46069b['some'](_0x501a0b => {
            const _0x10a6e9 = _0x501a0b['phoneNumber'] ? _0x501a0b['phoneNumber']['split']('@')[0x0] : '';
            const _0x5edfa7 = _0x501a0b['id'] ? _0x501a0b['id']['split']('@')[0x0] : '';
            const _0x2ee144 = _0x501a0b['lid'] ? _0x501a0b['lid']['split']('@')[0x0] : '';
            const _0xbc993a = _0x501a0b['id'] || '';
            const _0x30445b = _0x501a0b['lid'] || '';
            const _0x4e85a1 = _0x52e679 === _0xbc993a || _0x52e679 === _0x30445b || _0x38c9a6 === _0x10a6e9 || _0x38c9a6 === _0x5edfa7 || _0x255df2 === _0x10a6e9 || _0x255df2 === _0x5edfa7 || _0x2ee144 && _0x255df2 === _0x2ee144;
            return _0x4e85a1 && (_0x501a0b['admin'] === 'admin' || _0x501a0b['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x2c9bbb,
            'isBotAdmin': _0xc20466
        };
    } catch (_0x57c92e) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x57c92e);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;