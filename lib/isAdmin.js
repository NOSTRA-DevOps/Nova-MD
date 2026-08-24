async function isAdmin(_0x38ea93, _0x15f015, _0x2101a5) {
    try {
        const _0x2f11a1 = await _0x38ea93['groupMetadata'](_0x15f015);
        const _0x49e4ba = _0x2f11a1['participants'] || [];
        const _0x18ffde = _0x38ea93['user']?.['id'] || '';
        const _0x273347 = _0x38ea93['user']?.['lid'] || '';
        const _0x38e6f0 = _0x18ffde['includes'](':') ? _0x18ffde['split'](':')[0x0] : _0x18ffde['includes']('@') ? _0x18ffde['split']('@')[0x0] : _0x18ffde;
        const _0x3dac77 = _0x18ffde['includes']('@') ? _0x18ffde['split']('@')[0x0] : _0x18ffde;
        const _0x5aa228 = _0x273347['includes'](':') ? _0x273347['split'](':')[0x0] : _0x273347['includes']('@') ? _0x273347['split']('@')[0x0] : _0x273347;
        const _0x3d9850 = _0x273347['includes']('@') ? _0x273347['split']('@')[0x0] : _0x273347;
        const _0x494822 = _0x2101a5['includes'](':') ? _0x2101a5['split'](':')[0x0] : _0x2101a5['includes']('@') ? _0x2101a5['split']('@')[0x0] : _0x2101a5;
        const _0x5b015e = _0x2101a5['includes']('@') ? _0x2101a5['split']('@')[0x0] : _0x2101a5;
        const _0x4e4538 = _0x49e4ba['some'](_0x205b5a => {
            const _0x320ad7 = _0x205b5a['phoneNumber'] ? _0x205b5a['phoneNumber']['split']('@')[0x0] : '';
            const _0x14ed79 = _0x205b5a['id'] ? _0x205b5a['id']['split']('@')[0x0] : '';
            const _0x63ee79 = _0x205b5a['lid'] ? _0x205b5a['lid']['split']('@')[0x0] : '';
            const _0x80c477 = _0x205b5a['id'] || '';
            const _0x525bba = _0x205b5a['lid'] || '';
            const _0x411feb = _0x63ee79['includes'](':') ? _0x63ee79['split'](':')[0x0] : _0x63ee79;
            const _0x311676 = _0x18ffde === _0x80c477 || _0x18ffde === _0x525bba || _0x273347 === _0x525bba || _0x5aa228 === _0x411feb || _0x3d9850 === _0x63ee79 || _0x38e6f0 === _0x320ad7 || _0x38e6f0 === _0x14ed79 || _0x3dac77 === _0x320ad7 || _0x3dac77 === _0x14ed79 || _0x273347 && _0x273347['split']('@')[0x0]['split'](':')[0x0] === _0x63ee79;
            return _0x311676 && (_0x205b5a['admin'] === 'admin' || _0x205b5a['admin'] === 'superadmin');
        });
        const _0x1ca639 = _0x49e4ba['some'](_0x50ed03 => {
            const _0x23af37 = _0x50ed03['phoneNumber'] ? _0x50ed03['phoneNumber']['split']('@')[0x0] : '';
            const _0x448b39 = _0x50ed03['id'] ? _0x50ed03['id']['split']('@')[0x0] : '';
            const _0x3ebfc1 = _0x50ed03['lid'] ? _0x50ed03['lid']['split']('@')[0x0] : '';
            const _0x8c307d = _0x50ed03['id'] || '';
            const _0x5944b3 = _0x50ed03['lid'] || '';
            const _0x303429 = _0x2101a5 === _0x8c307d || _0x2101a5 === _0x5944b3 || _0x494822 === _0x23af37 || _0x494822 === _0x448b39 || _0x5b015e === _0x23af37 || _0x5b015e === _0x448b39 || _0x3ebfc1 && _0x5b015e === _0x3ebfc1;
            return _0x303429 && (_0x50ed03['admin'] === 'admin' || _0x50ed03['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x1ca639,
            'isBotAdmin': _0x4e4538
        };
    } catch (_0x13a99f) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x13a99f);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;