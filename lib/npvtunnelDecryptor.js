import _0x0_0x1ea6e4 from 'crypto';
function aesCtrWhiteboxSimulate(_0x317ad3, _0x1f8c9e) {
    try {
        const _0x4f8ca1 = Math['ceil'](_0x317ad3['length'] / 0x10);
        const _0x370e45 = [];
        let _0x53ca4f = Buffer['from'](_0x1f8c9e);
        for (let _0x5cefd7 = 0x0; _0x5cefd7 < _0x4f8ca1; _0x5cefd7++) {
            const _0x2e59f8 = _0x0_0x1ea6e4['createHash']('sha256')['update'](_0x53ca4f)['digest']();
            _0x370e45['push'](_0x2e59f8['slice'](0x0, 0x10));
            for (let _0xd9fad0 = 0xf; _0xd9fad0 >= 0x0; _0xd9fad0--) {
                _0x53ca4f[_0xd9fad0] = _0x53ca4f[_0xd9fad0] + 0x1 & 0xff;
                if (_0x53ca4f[_0xd9fad0] !== 0x0)
                    break;
            }
        }
        const _0x42e9aa = Buffer['concat'](_0x370e45);
        const _0x49dcc9 = Buffer['alloc'](_0x317ad3['length']);
        for (let _0x1c26e7 = 0x0; _0x1c26e7 < _0x317ad3['length']; _0x1c26e7++) {
            _0x49dcc9[_0x1c26e7] = _0x317ad3[_0x1c26e7] ^ _0x42e9aa[_0x1c26e7];
        }
        return _0x49dcc9;
    } catch (_0x5d0f18) {
        return _0x317ad3;
    }
}
export function decryptNPVTunnel(_0x2ef1c0) {
    try {
        let _0xb0d0e7 = _0x2ef1c0['toString']('utf-8')['trim']();
        if (_0xb0d0e7['startsWith']('NPVTSUB1'))
            _0xb0d0e7 = _0xb0d0e7['slice'](0x8)['trim']();
        if (_0xb0d0e7['startsWith']('NPVT1'))
            _0xb0d0e7 = _0xb0d0e7['slice'](0x5)['trim']();
        const _0x577312 = _0xb0d0e7['split'](',');
        const _0x11d470 = _0x577312[0x1] || _0x577312[0x0];
        const _0x4b090e = Buffer['from'](_0x11d470, 'base64');
        if (_0x4b090e['length'] <= 0x10)
            return null;
        const _0x2c09be = _0x4b090e['slice'](0x0, 0x10);
        const _0x36de3a = _0x4b090e['slice'](0x10);
        const _0x37eb4e = aesCtrWhiteboxSimulate(_0x36de3a, _0x2c09be);
        let _0x24853e = _0x37eb4e['toString']('utf-8')['trim']();
        if (_0x24853e['startsWith']('{') || _0x24853e['startsWith']('[')) {
            try {
                const _0x477397 = JSON['parse'](_0x24853e);
                if (Array['isArray'](_0x477397)) {
                    _0x24853e = JSON['stringify'](_0x477397[0x0] || _0x477397, null, 0x4);
                } else {
                    _0x24853e = JSON['stringify'](_0x477397, null, 0x4);
                }
            } catch (_0xaedfa0) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x24853e;
    } catch (_0x75e20) {
        return null;
    }
}