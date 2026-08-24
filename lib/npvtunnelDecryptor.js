import _0x0_0x52121b from 'crypto';
function aesCtrWhiteboxSimulate(_0x2ef0d8, _0x3fcc83) {
    try {
        const _0x4566ac = Math['ceil'](_0x2ef0d8['length'] / 0x10);
        const _0x4642af = [];
        let _0x50dcdd = Buffer['from'](_0x3fcc83);
        for (let _0x2f1aa9 = 0x0; _0x2f1aa9 < _0x4566ac; _0x2f1aa9++) {
            const _0x476d20 = _0x0_0x52121b['createHash']('sha256')['update'](_0x50dcdd)['digest']();
            _0x4642af['push'](_0x476d20['slice'](0x0, 0x10));
            for (let _0x91e006 = 0xf; _0x91e006 >= 0x0; _0x91e006--) {
                _0x50dcdd[_0x91e006] = _0x50dcdd[_0x91e006] + 0x1 & 0xff;
                if (_0x50dcdd[_0x91e006] !== 0x0)
                    break;
            }
        }
        const _0x3d452a = Buffer['concat'](_0x4642af);
        const _0x52dca4 = Buffer['alloc'](_0x2ef0d8['length']);
        for (let _0x29c7b3 = 0x0; _0x29c7b3 < _0x2ef0d8['length']; _0x29c7b3++) {
            _0x52dca4[_0x29c7b3] = _0x2ef0d8[_0x29c7b3] ^ _0x3d452a[_0x29c7b3];
        }
        return _0x52dca4;
    } catch (_0x174b4b) {
        return _0x2ef0d8;
    }
}
export function decryptNPVTunnel(_0x578a3f) {
    try {
        let _0x320099 = _0x578a3f['toString']('utf-8')['trim']();
        if (_0x320099['startsWith']('NPVTSUB1'))
            _0x320099 = _0x320099['slice'](0x8)['trim']();
        if (_0x320099['startsWith']('NPVT1'))
            _0x320099 = _0x320099['slice'](0x5)['trim']();
        const _0xb1588f = _0x320099['split'](',');
        const _0x55a3a7 = _0xb1588f[0x1] || _0xb1588f[0x0];
        const _0x35de84 = Buffer['from'](_0x55a3a7, 'base64');
        if (_0x35de84['length'] <= 0x10)
            return null;
        const _0x4c21cd = _0x35de84['slice'](0x0, 0x10);
        const _0x2ef5b1 = _0x35de84['slice'](0x10);
        const _0x5407cf = aesCtrWhiteboxSimulate(_0x2ef5b1, _0x4c21cd);
        let _0x28cf5a = _0x5407cf['toString']('utf-8')['trim']();
        if (_0x28cf5a['startsWith']('{') || _0x28cf5a['startsWith']('[')) {
            try {
                const _0x8337b7 = JSON['parse'](_0x28cf5a);
                if (Array['isArray'](_0x8337b7)) {
                    _0x28cf5a = JSON['stringify'](_0x8337b7[0x0] || _0x8337b7, null, 0x4);
                } else {
                    _0x28cf5a = JSON['stringify'](_0x8337b7, null, 0x4);
                }
            } catch (_0x127daa) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x28cf5a;
    } catch (_0x1aae1a) {
        return null;
    }
}