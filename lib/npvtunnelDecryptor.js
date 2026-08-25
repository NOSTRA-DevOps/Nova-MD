import _0x0_0x3fcbc1 from 'crypto';
function aesCtrWhiteboxSimulate(_0x425a4a, _0x2a5bda) {
    try {
        const _0x20de9d = Math['ceil'](_0x425a4a['length'] / 0x10);
        const _0x12307f = [];
        let _0x133db5 = Buffer['from'](_0x2a5bda);
        for (let _0x3c786a = 0x0; _0x3c786a < _0x20de9d; _0x3c786a++) {
            const _0x1eee3d = _0x0_0x3fcbc1['createHash']('sha256')['update'](_0x133db5)['digest']();
            _0x12307f['push'](_0x1eee3d['slice'](0x0, 0x10));
            for (let _0x4bd4a3 = 0xf; _0x4bd4a3 >= 0x0; _0x4bd4a3--) {
                _0x133db5[_0x4bd4a3] = _0x133db5[_0x4bd4a3] + 0x1 & 0xff;
                if (_0x133db5[_0x4bd4a3] !== 0x0)
                    break;
            }
        }
        const _0x13931d = Buffer['concat'](_0x12307f);
        const _0xe4954a = Buffer['alloc'](_0x425a4a['length']);
        for (let _0x4df980 = 0x0; _0x4df980 < _0x425a4a['length']; _0x4df980++) {
            _0xe4954a[_0x4df980] = _0x425a4a[_0x4df980] ^ _0x13931d[_0x4df980];
        }
        return _0xe4954a;
    } catch (_0x21d01b) {
        return _0x425a4a;
    }
}
export function decryptNPVTunnel(_0x5198ad) {
    try {
        let _0xb18b87 = _0x5198ad['toString']('utf-8')['trim']();
        if (_0xb18b87['startsWith']('NPVTSUB1'))
            _0xb18b87 = _0xb18b87['slice'](0x8)['trim']();
        if (_0xb18b87['startsWith']('NPVT1'))
            _0xb18b87 = _0xb18b87['slice'](0x5)['trim']();
        const _0x48f800 = _0xb18b87['split'](',');
        const _0x8926db = _0x48f800[0x1] || _0x48f800[0x0];
        const _0x977b0c = Buffer['from'](_0x8926db, 'base64');
        if (_0x977b0c['length'] <= 0x10)
            return null;
        const _0x5eefcc = _0x977b0c['slice'](0x0, 0x10);
        const _0x3de561 = _0x977b0c['slice'](0x10);
        const _0x35547a = aesCtrWhiteboxSimulate(_0x3de561, _0x5eefcc);
        let _0x487240 = _0x35547a['toString']('utf-8')['trim']();
        if (_0x487240['startsWith']('{') || _0x487240['startsWith']('[')) {
            try {
                const _0x573d3e = JSON['parse'](_0x487240);
                if (Array['isArray'](_0x573d3e)) {
                    _0x487240 = JSON['stringify'](_0x573d3e[0x0] || _0x573d3e, null, 0x4);
                } else {
                    _0x487240 = JSON['stringify'](_0x573d3e, null, 0x4);
                }
            } catch (_0x250290) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x487240;
    } catch (_0x4faf67) {
        return null;
    }
}