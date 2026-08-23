import _0x0_0x55f2eb from 'crypto';
function aesCtrWhiteboxSimulate(_0x69e620, _0xc4bb97) {
    try {
        const _0x227d92 = Math['ceil'](_0x69e620['length'] / 0x10);
        const _0x35461f = [];
        let _0x133bc8 = Buffer['from'](_0xc4bb97);
        for (let _0x381da2 = 0x0; _0x381da2 < _0x227d92; _0x381da2++) {
            const _0x39dd95 = _0x0_0x55f2eb['createHash']('sha256')['update'](_0x133bc8)['digest']();
            _0x35461f['push'](_0x39dd95['slice'](0x0, 0x10));
            for (let _0x2c7692 = 0xf; _0x2c7692 >= 0x0; _0x2c7692--) {
                _0x133bc8[_0x2c7692] = _0x133bc8[_0x2c7692] + 0x1 & 0xff;
                if (_0x133bc8[_0x2c7692] !== 0x0)
                    break;
            }
        }
        const _0x15c86e = Buffer['concat'](_0x35461f);
        const _0x462074 = Buffer['alloc'](_0x69e620['length']);
        for (let _0x46ae85 = 0x0; _0x46ae85 < _0x69e620['length']; _0x46ae85++) {
            _0x462074[_0x46ae85] = _0x69e620[_0x46ae85] ^ _0x15c86e[_0x46ae85];
        }
        return _0x462074;
    } catch (_0x42c2c4) {
        return _0x69e620;
    }
}
export function decryptNPVTunnel(_0x3926a6) {
    try {
        let _0x5af9b1 = _0x3926a6['toString']('utf-8')['trim']();
        if (_0x5af9b1['startsWith']('NPVTSUB1'))
            _0x5af9b1 = _0x5af9b1['slice'](0x8)['trim']();
        if (_0x5af9b1['startsWith']('NPVT1'))
            _0x5af9b1 = _0x5af9b1['slice'](0x5)['trim']();
        const _0x5314fc = _0x5af9b1['split'](',');
        const _0x9ff43c = _0x5314fc[0x1] || _0x5314fc[0x0];
        const _0x2bbf27 = Buffer['from'](_0x9ff43c, 'base64');
        if (_0x2bbf27['length'] <= 0x10)
            return null;
        const _0x963a56 = _0x2bbf27['slice'](0x0, 0x10);
        const _0x344db0 = _0x2bbf27['slice'](0x10);
        const _0x2bc26b = aesCtrWhiteboxSimulate(_0x344db0, _0x963a56);
        let _0x3dec41 = _0x2bc26b['toString']('utf-8')['trim']();
        if (_0x3dec41['startsWith']('{') || _0x3dec41['startsWith']('[')) {
            try {
                const _0x4581bf = JSON['parse'](_0x3dec41);
                if (Array['isArray'](_0x4581bf)) {
                    _0x3dec41 = JSON['stringify'](_0x4581bf[0x0] || _0x4581bf, null, 0x4);
                } else {
                    _0x3dec41 = JSON['stringify'](_0x4581bf, null, 0x4);
                }
            } catch (_0x12e42d) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x3dec41;
    } catch (_0x18b6ad) {
        return null;
    }
}