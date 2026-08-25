import _0x0_0x32f876 from 'crypto';
function aesCtrWhiteboxSimulate(_0x1d0e99, _0x5c146d) {
    try {
        const _0x110e05 = Math['ceil'](_0x1d0e99['length'] / 0x10);
        const _0x5d55b8 = [];
        let _0x425c2f = Buffer['from'](_0x5c146d);
        for (let _0x38b36e = 0x0; _0x38b36e < _0x110e05; _0x38b36e++) {
            const _0x2f7690 = _0x0_0x32f876['createHash']('sha256')['update'](_0x425c2f)['digest']();
            _0x5d55b8['push'](_0x2f7690['slice'](0x0, 0x10));
            for (let _0x182dca = 0xf; _0x182dca >= 0x0; _0x182dca--) {
                _0x425c2f[_0x182dca] = _0x425c2f[_0x182dca] + 0x1 & 0xff;
                if (_0x425c2f[_0x182dca] !== 0x0)
                    break;
            }
        }
        const _0x5b981b = Buffer['concat'](_0x5d55b8);
        const _0x324c36 = Buffer['alloc'](_0x1d0e99['length']);
        for (let _0x2a64ed = 0x0; _0x2a64ed < _0x1d0e99['length']; _0x2a64ed++) {
            _0x324c36[_0x2a64ed] = _0x1d0e99[_0x2a64ed] ^ _0x5b981b[_0x2a64ed];
        }
        return _0x324c36;
    } catch (_0x23a666) {
        return _0x1d0e99;
    }
}
export function decryptNPVTunnel(_0x23407b) {
    try {
        let _0x1148c2 = _0x23407b['toString']('utf-8')['trim']();
        if (_0x1148c2['startsWith']('NPVTSUB1'))
            _0x1148c2 = _0x1148c2['slice'](0x8)['trim']();
        if (_0x1148c2['startsWith']('NPVT1'))
            _0x1148c2 = _0x1148c2['slice'](0x5)['trim']();
        const _0xac9bc0 = _0x1148c2['split'](',');
        const _0x3b5855 = _0xac9bc0[0x1] || _0xac9bc0[0x0];
        const _0x5202e3 = Buffer['from'](_0x3b5855, 'base64');
        if (_0x5202e3['length'] <= 0x10)
            return null;
        const _0x51d27c = _0x5202e3['slice'](0x0, 0x10);
        const _0x53a6a4 = _0x5202e3['slice'](0x10);
        const _0x55eb4f = aesCtrWhiteboxSimulate(_0x53a6a4, _0x51d27c);
        let _0x315468 = _0x55eb4f['toString']('utf-8')['trim']();
        if (_0x315468['startsWith']('{') || _0x315468['startsWith']('[')) {
            try {
                const _0x3a97b7 = JSON['parse'](_0x315468);
                if (Array['isArray'](_0x3a97b7)) {
                    _0x315468 = JSON['stringify'](_0x3a97b7[0x0] || _0x3a97b7, null, 0x4);
                } else {
                    _0x315468 = JSON['stringify'](_0x3a97b7, null, 0x4);
                }
            } catch (_0x585a15) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x315468;
    } catch (_0x3b7c46) {
        return null;
    }
}