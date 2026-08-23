import _0x0_0x420e0d from 'crypto';
function aesCtrWhiteboxSimulate(_0x5d3cd3, _0x39915d) {
    try {
        const _0x490d99 = Math['ceil'](_0x5d3cd3['length'] / 0x10);
        const _0x3a4dc2 = [];
        let _0x5ce358 = Buffer['from'](_0x39915d);
        for (let _0x107251 = 0x0; _0x107251 < _0x490d99; _0x107251++) {
            const _0x2512ec = _0x0_0x420e0d['createHash']('sha256')['update'](_0x5ce358)['digest']();
            _0x3a4dc2['push'](_0x2512ec['slice'](0x0, 0x10));
            for (let _0x146f51 = 0xf; _0x146f51 >= 0x0; _0x146f51--) {
                _0x5ce358[_0x146f51] = _0x5ce358[_0x146f51] + 0x1 & 0xff;
                if (_0x5ce358[_0x146f51] !== 0x0)
                    break;
            }
        }
        const _0x25c4bb = Buffer['concat'](_0x3a4dc2);
        const _0x3c3ad9 = Buffer['alloc'](_0x5d3cd3['length']);
        for (let _0x58f88c = 0x0; _0x58f88c < _0x5d3cd3['length']; _0x58f88c++) {
            _0x3c3ad9[_0x58f88c] = _0x5d3cd3[_0x58f88c] ^ _0x25c4bb[_0x58f88c];
        }
        return _0x3c3ad9;
    } catch (_0x51f1ac) {
        return _0x5d3cd3;
    }
}
export function decryptNPVTunnel(_0x543351) {
    try {
        let _0x8b53b4 = _0x543351['toString']('utf-8')['trim']();
        if (_0x8b53b4['startsWith']('NPVTSUB1'))
            _0x8b53b4 = _0x8b53b4['slice'](0x8)['trim']();
        if (_0x8b53b4['startsWith']('NPVT1'))
            _0x8b53b4 = _0x8b53b4['slice'](0x5)['trim']();
        const _0x5b7fd7 = _0x8b53b4['split'](',');
        const _0x1dd7d8 = _0x5b7fd7[0x1] || _0x5b7fd7[0x0];
        const _0x4e4862 = Buffer['from'](_0x1dd7d8, 'base64');
        if (_0x4e4862['length'] <= 0x10)
            return null;
        const _0x56eb9d = _0x4e4862['slice'](0x0, 0x10);
        const _0x39056a = _0x4e4862['slice'](0x10);
        const _0x15e7cb = aesCtrWhiteboxSimulate(_0x39056a, _0x56eb9d);
        let _0x191e54 = _0x15e7cb['toString']('utf-8')['trim']();
        if (_0x191e54['startsWith']('{') || _0x191e54['startsWith']('[')) {
            try {
                const _0x4df4b9 = JSON['parse'](_0x191e54);
                if (Array['isArray'](_0x4df4b9)) {
                    _0x191e54 = JSON['stringify'](_0x4df4b9[0x0] || _0x4df4b9, null, 0x4);
                } else {
                    _0x191e54 = JSON['stringify'](_0x4df4b9, null, 0x4);
                }
            } catch (_0x1147c1) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x191e54;
    } catch (_0x38fca3) {
        return null;
    }
}