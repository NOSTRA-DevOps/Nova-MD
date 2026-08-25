import _0x0_0x1831a4 from 'crypto';
function aesCtrWhiteboxSimulate(_0x4cdc65, _0x506f86) {
    try {
        const _0x598f8e = Math['ceil'](_0x4cdc65['length'] / 0x10);
        const _0x29e0f4 = [];
        let _0x5b777a = Buffer['from'](_0x506f86);
        for (let _0x80cbf6 = 0x0; _0x80cbf6 < _0x598f8e; _0x80cbf6++) {
            const _0x3ace6d = _0x0_0x1831a4['createHash']('sha256')['update'](_0x5b777a)['digest']();
            _0x29e0f4['push'](_0x3ace6d['slice'](0x0, 0x10));
            for (let _0x2656b7 = 0xf; _0x2656b7 >= 0x0; _0x2656b7--) {
                _0x5b777a[_0x2656b7] = _0x5b777a[_0x2656b7] + 0x1 & 0xff;
                if (_0x5b777a[_0x2656b7] !== 0x0)
                    break;
            }
        }
        const _0x1e0fe0 = Buffer['concat'](_0x29e0f4);
        const _0x35bc82 = Buffer['alloc'](_0x4cdc65['length']);
        for (let _0x19b397 = 0x0; _0x19b397 < _0x4cdc65['length']; _0x19b397++) {
            _0x35bc82[_0x19b397] = _0x4cdc65[_0x19b397] ^ _0x1e0fe0[_0x19b397];
        }
        return _0x35bc82;
    } catch (_0x2948a9) {
        return _0x4cdc65;
    }
}
export function decryptNPVTunnel(_0x3e5004) {
    try {
        let _0x5f6f5d = _0x3e5004['toString']('utf-8')['trim']();
        if (_0x5f6f5d['startsWith']('NPVTSUB1'))
            _0x5f6f5d = _0x5f6f5d['slice'](0x8)['trim']();
        if (_0x5f6f5d['startsWith']('NPVT1'))
            _0x5f6f5d = _0x5f6f5d['slice'](0x5)['trim']();
        const _0x38aafa = _0x5f6f5d['split'](',');
        const _0xeb2c5 = _0x38aafa[0x1] || _0x38aafa[0x0];
        const _0x5dc5b9 = Buffer['from'](_0xeb2c5, 'base64');
        if (_0x5dc5b9['length'] <= 0x10)
            return null;
        const _0x5b6172 = _0x5dc5b9['slice'](0x0, 0x10);
        const _0x3f5ae9 = _0x5dc5b9['slice'](0x10);
        const _0x304c9e = aesCtrWhiteboxSimulate(_0x3f5ae9, _0x5b6172);
        let _0x440b02 = _0x304c9e['toString']('utf-8')['trim']();
        if (_0x440b02['startsWith']('{') || _0x440b02['startsWith']('[')) {
            try {
                const _0x15f1d8 = JSON['parse'](_0x440b02);
                if (Array['isArray'](_0x15f1d8)) {
                    _0x440b02 = JSON['stringify'](_0x15f1d8[0x0] || _0x15f1d8, null, 0x4);
                } else {
                    _0x440b02 = JSON['stringify'](_0x15f1d8, null, 0x4);
                }
            } catch (_0x516599) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x440b02;
    } catch (_0x4bbbd4) {
        return null;
    }
}