async function isAdmin(_0x38ec15, _0x920e4e, _0x380069) {
    try {
        const _0x33e21a = await _0x38ec15['groupMetadata'](_0x920e4e);
        const _0xdca971 = _0x33e21a['participants'] || [];
        const _0x18924b = _0x38ec15['user']?.['id'] || '';
        const _0x2645cf = _0x38ec15['user']?.['lid'] || '';
        const _0x10e77e = _0x18924b['includes'](':') ? _0x18924b['split'](':')[0x0] : _0x18924b['includes']('@') ? _0x18924b['split']('@')[0x0] : _0x18924b;
        const _0xa4a55d = _0x18924b['includes']('@') ? _0x18924b['split']('@')[0x0] : _0x18924b;
        const _0x1c8fd4 = _0x2645cf['includes'](':') ? _0x2645cf['split'](':')[0x0] : _0x2645cf['includes']('@') ? _0x2645cf['split']('@')[0x0] : _0x2645cf;
        const _0x36c384 = _0x2645cf['includes']('@') ? _0x2645cf['split']('@')[0x0] : _0x2645cf;
        const _0x218bf1 = _0x380069['includes'](':') ? _0x380069['split'](':')[0x0] : _0x380069['includes']('@') ? _0x380069['split']('@')[0x0] : _0x380069;
        const _0x42a96b = _0x380069['includes']('@') ? _0x380069['split']('@')[0x0] : _0x380069;
        const _0x424b9d = _0xdca971['some'](_0x4a60ad => {
            const _0x239020 = _0x4a60ad['phoneNumber'] ? _0x4a60ad['phoneNumber']['split']('@')[0x0] : '';
            const _0xe9e9e7 = _0x4a60ad['id'] ? _0x4a60ad['id']['split']('@')[0x0] : '';
            const _0x2c33af = _0x4a60ad['lid'] ? _0x4a60ad['lid']['split']('@')[0x0] : '';
            const _0x44eb6f = _0x4a60ad['id'] || '';
            const _0x10de5f = _0x4a60ad['lid'] || '';
            const _0x5d2049 = _0x2c33af['includes'](':') ? _0x2c33af['split'](':')[0x0] : _0x2c33af;
            const _0x54e51d = _0x18924b === _0x44eb6f || _0x18924b === _0x10de5f || _0x2645cf === _0x10de5f || _0x1c8fd4 === _0x5d2049 || _0x36c384 === _0x2c33af || _0x10e77e === _0x239020 || _0x10e77e === _0xe9e9e7 || _0xa4a55d === _0x239020 || _0xa4a55d === _0xe9e9e7 || _0x2645cf && _0x2645cf['split']('@')[0x0]['split'](':')[0x0] === _0x2c33af;
            return _0x54e51d && (_0x4a60ad['admin'] === 'admin' || _0x4a60ad['admin'] === 'superadmin');
        });
        const _0x523448 = _0xdca971['some'](_0x2fd06c => {
            const _0xe64a7c = _0x2fd06c['phoneNumber'] ? _0x2fd06c['phoneNumber']['split']('@')[0x0] : '';
            const _0x5c5452 = _0x2fd06c['id'] ? _0x2fd06c['id']['split']('@')[0x0] : '';
            const _0x55a61a = _0x2fd06c['lid'] ? _0x2fd06c['lid']['split']('@')[0x0] : '';
            const _0x399b35 = _0x2fd06c['id'] || '';
            const _0x4b7e30 = _0x2fd06c['lid'] || '';
            const _0x3464e4 = _0x380069 === _0x399b35 || _0x380069 === _0x4b7e30 || _0x218bf1 === _0xe64a7c || _0x218bf1 === _0x5c5452 || _0x42a96b === _0xe64a7c || _0x42a96b === _0x5c5452 || _0x55a61a && _0x42a96b === _0x55a61a;
            return _0x3464e4 && (_0x2fd06c['admin'] === 'admin' || _0x2fd06c['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x523448,
            'isBotAdmin': _0x424b9d
        };
    } catch (_0x521ad7) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x521ad7);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;