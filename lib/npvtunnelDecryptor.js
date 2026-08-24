import _0x0_0x3eeef6 from 'crypto';
function aesCtrWhiteboxSimulate(_0x5ddd00, _0xd912e5) {
    try {
        const _0x38d275 = Math['ceil'](_0x5ddd00['length'] / 0x10);
        const _0x45a067 = [];
        let _0xbfc9c1 = Buffer['from'](_0xd912e5);
        for (let _0x2c39dc = 0x0; _0x2c39dc < _0x38d275; _0x2c39dc++) {
            const _0x18d10f = _0x0_0x3eeef6['createHash']('sha256')['update'](_0xbfc9c1)['digest']();
            _0x45a067['push'](_0x18d10f['slice'](0x0, 0x10));
            for (let _0x2f2319 = 0xf; _0x2f2319 >= 0x0; _0x2f2319--) {
                _0xbfc9c1[_0x2f2319] = _0xbfc9c1[_0x2f2319] + 0x1 & 0xff;
                if (_0xbfc9c1[_0x2f2319] !== 0x0)
                    break;
            }
        }
        const _0xa7be81 = Buffer['concat'](_0x45a067);
        const _0x378f20 = Buffer['alloc'](_0x5ddd00['length']);
        for (let _0x468750 = 0x0; _0x468750 < _0x5ddd00['length']; _0x468750++) {
            _0x378f20[_0x468750] = _0x5ddd00[_0x468750] ^ _0xa7be81[_0x468750];
        }
        return _0x378f20;
    } catch (_0x392c23) {
        return _0x5ddd00;
    }
}
export function decryptNPVTunnel(_0x286a79) {
    try {
        let _0x3c1557 = _0x286a79['toString']('utf-8')['trim']();
        if (_0x3c1557['startsWith']('NPVTSUB1'))
            _0x3c1557 = _0x3c1557['slice'](0x8)['trim']();
        if (_0x3c1557['startsWith']('NPVT1'))
            _0x3c1557 = _0x3c1557['slice'](0x5)['trim']();
        const _0x1200d1 = _0x3c1557['split'](',');
        const _0x27e7b1 = _0x1200d1[0x1] || _0x1200d1[0x0];
        const _0xb53ba0 = Buffer['from'](_0x27e7b1, 'base64');
        if (_0xb53ba0['length'] <= 0x10)
            return null;
        const _0x26aafa = _0xb53ba0['slice'](0x0, 0x10);
        const _0x245bb4 = _0xb53ba0['slice'](0x10);
        const _0xc60935 = aesCtrWhiteboxSimulate(_0x245bb4, _0x26aafa);
        let _0x1c3cc9 = _0xc60935['toString']('utf-8')['trim']();
        if (_0x1c3cc9['startsWith']('{') || _0x1c3cc9['startsWith']('[')) {
            try {
                const _0x5c9514 = JSON['parse'](_0x1c3cc9);
                if (Array['isArray'](_0x5c9514)) {
                    _0x1c3cc9 = JSON['stringify'](_0x5c9514[0x0] || _0x5c9514, null, 0x4);
                } else {
                    _0x1c3cc9 = JSON['stringify'](_0x5c9514, null, 0x4);
                }
            } catch (_0x393af2) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x1c3cc9;
    } catch (_0x133060) {
        return null;
    }
}