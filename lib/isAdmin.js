async function isAdmin(_0x3e6b97, _0x49973d, _0x8aabd5) {
    try {
        const _0x52a478 = await _0x3e6b97['groupMetadata'](_0x49973d);
        const _0x417ce3 = _0x52a478['participants'] || [];
        const _0x3edda9 = _0x3e6b97['user']?.['id'] || '';
        const _0x3ed0a4 = _0x3e6b97['user']?.['lid'] || '';
        const _0x3c49fc = _0x3edda9['includes'](':') ? _0x3edda9['split'](':')[0x0] : _0x3edda9['includes']('@') ? _0x3edda9['split']('@')[0x0] : _0x3edda9;
        const _0x10b5b0 = _0x3edda9['includes']('@') ? _0x3edda9['split']('@')[0x0] : _0x3edda9;
        const _0x82c1ae = _0x3ed0a4['includes'](':') ? _0x3ed0a4['split'](':')[0x0] : _0x3ed0a4['includes']('@') ? _0x3ed0a4['split']('@')[0x0] : _0x3ed0a4;
        const _0x4fe18c = _0x3ed0a4['includes']('@') ? _0x3ed0a4['split']('@')[0x0] : _0x3ed0a4;
        const _0x14e1e5 = _0x8aabd5['includes'](':') ? _0x8aabd5['split'](':')[0x0] : _0x8aabd5['includes']('@') ? _0x8aabd5['split']('@')[0x0] : _0x8aabd5;
        const _0x2ce198 = _0x8aabd5['includes']('@') ? _0x8aabd5['split']('@')[0x0] : _0x8aabd5;
        const _0x1c55e0 = _0x417ce3['some'](_0x378fc0 => {
            const _0x3c77ae = _0x378fc0['phoneNumber'] ? _0x378fc0['phoneNumber']['split']('@')[0x0] : '';
            const _0x499843 = _0x378fc0['id'] ? _0x378fc0['id']['split']('@')[0x0] : '';
            const _0x3f0cc3 = _0x378fc0['lid'] ? _0x378fc0['lid']['split']('@')[0x0] : '';
            const _0xe38492 = _0x378fc0['id'] || '';
            const _0x27b9a6 = _0x378fc0['lid'] || '';
            const _0x424b35 = _0x3f0cc3['includes'](':') ? _0x3f0cc3['split'](':')[0x0] : _0x3f0cc3;
            const _0x401454 = _0x3edda9 === _0xe38492 || _0x3edda9 === _0x27b9a6 || _0x3ed0a4 === _0x27b9a6 || _0x82c1ae === _0x424b35 || _0x4fe18c === _0x3f0cc3 || _0x3c49fc === _0x3c77ae || _0x3c49fc === _0x499843 || _0x10b5b0 === _0x3c77ae || _0x10b5b0 === _0x499843 || _0x3ed0a4 && _0x3ed0a4['split']('@')[0x0]['split'](':')[0x0] === _0x3f0cc3;
            return _0x401454 && (_0x378fc0['admin'] === 'admin' || _0x378fc0['admin'] === 'superadmin');
        });
        const _0x44bf9f = _0x417ce3['some'](_0x3a0480 => {
            const _0x57ed84 = _0x3a0480['phoneNumber'] ? _0x3a0480['phoneNumber']['split']('@')[0x0] : '';
            const _0x4a4f46 = _0x3a0480['id'] ? _0x3a0480['id']['split']('@')[0x0] : '';
            const _0x2a66cb = _0x3a0480['lid'] ? _0x3a0480['lid']['split']('@')[0x0] : '';
            const _0x4814ee = _0x3a0480['id'] || '';
            const _0x5a195f = _0x3a0480['lid'] || '';
            const _0x33fd6d = _0x8aabd5 === _0x4814ee || _0x8aabd5 === _0x5a195f || _0x14e1e5 === _0x57ed84 || _0x14e1e5 === _0x4a4f46 || _0x2ce198 === _0x57ed84 || _0x2ce198 === _0x4a4f46 || _0x2a66cb && _0x2ce198 === _0x2a66cb;
            return _0x33fd6d && (_0x3a0480['admin'] === 'admin' || _0x3a0480['admin'] === 'superadmin');
        });
        return {
            'isSenderAdmin': _0x44bf9f,
            'isBotAdmin': _0x1c55e0
        };
    } catch (_0x958ce9) {
        console['error']('❌\x20Error\x20in\x20isAdmin:', _0x958ce9);
        return {
            'isSenderAdmin': ![],
            'isBotAdmin': ![]
        };
    }
}
export default isAdmin;