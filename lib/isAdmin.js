async function isAdmin(_0x4bef0f, _0xe59b2e, _0x52d838) {
    try {
        const _0x4c42ad = await _0x4bef0f['groupMetadata'](_0xe59b2e);
        const _0x171fb2 = _0x4c42ad['participants'] || [];
        const _0x31f412 = _0x4bef0f['user']?.['id'] || '';
        const _0x8093a = _0x4bef0f['user']?.['lid'] || '';
        const _0x4a3d5f = _0x31f412['includes'](':') ? _0x31f412['split'](':')[0x0] : _0x31f412['includes']('@') ? _0x31f412['split']('@')[0x0] : _0x31f412;
        const _0x55990a = _0x31f412['includes']('@') ? _0x31f412['split']('@')[0x0] : _0x31f412;
        const _0x256721 = _0x8093a['includes'](':') ? _0x8093a['split'](':')[0x0] : _0x8093a['includes']('@') ? _0x8093a['split']('@')[0x0] : _0x8093a;
        const _0x38bede = _0x8093a['includes']('@') ? _0x8093a['split']('@')[0x0] : _0x8093a;
        const _0x22ed5b = _0x52d838['includes'](':') ? _0x52d838['split'](':')[0x0] : _0x52d838['includes']('@') ? _0x52d838['split']('@')[0x0] : _0x52d838;
        const _0x1021e0 = _0x52d838['includes']('@') ? _0x52d838['split']('@')[0x0] : _0x52d838;
        const _0x47ab7e = _0x171fb2['some'](_0x4001fb => {
            const _0x580bea = _0x4001fb['phoneNumber'] ? _0x4001fb['phoneNumber']['split']('@')[0x0] : '';
            const _0x2dfdf9 = _0x4001fb['id'] ? _0x4001fb['id']['split']('@')[0x0] : '';
            const _0xf932a9 = _0x4001fb['lid'] ? _0x4001fb['lid']['split']('@')[0x0] : '';
            const _0x2e1e5b = _0x4001fb['id'] || '';
            const _0x468eaf = _0x4001fb['lid'] || '';
            const _0x151181 = _0xf932a9['includes'](':') ? _0xf932a9['split'](':')[0x0] : _0xf932a9;
            const _0x2d392b = _0x31f412 === _0x2e1e5b || _0x31f412 === _0x468eaf || _0x8093a === _0x468eaf || _0x256721 === _0x151181 || _0x38bede === _0xf932a9 || _0x4a3d5f === _0x580bea || _0x4a3d5f === _0x2dfdf9 || _0x55990a === _0x580bea || _0x55990a === _0x2dfdf9 || _0x8093a && _0x8093a['split']('@')[0x0]['split'](':')[0x0] === _0xf932a9;
            return _0x2d392b && (_0x4001fb['admin'] === 'admin' || _0x4001fb['admin'] === 'superadmin');
        });
        const _0x26b6fb = _0x171fb2['some'](_0x663298 => {
            const _0x34bd14 = _0x663298['phoneNumber'] ? _0x663298['phoneNumber']['split']('@')[0x0] : '';
            const _0x3a4cd5 = _0x663298['id'] ? _0x663298['id']['split']('@')[0x0] : '';
            const _0x4f04c2 = _0x663298['lid'] ? _0x663298['lid']['split']('@')[0x0] : '';
            const _0x1baf44 = _0x663298['id'] || '';
            const _0x5b5469 = _0x663298['lid'] || '';
            const _0xae5a90 = _0x52d838 === _0x1baf44 || _0x52d838 === _0x5b5469 || _0x22ed5b === _0x34bd14 || _0x22ed5b === _0x3a4cd5 || _0x1021e0 === _0x34bd14 || _0x1021e0 === _0x3a4cd5 || _0x4f04c2 && _0x1021e0 === _0x4f04c2;
            return _0xae5a90 && (_0x663298['admin'] === 'admin' || _0x663298['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x26b6fb,
            'isBotAdmin': _0x47ab7e
        };
    } catch (_0x2d0cd5) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x2d0cd5);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;