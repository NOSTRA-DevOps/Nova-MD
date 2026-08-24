import _0x0_0x376087 from 'crypto';
function aesCtrWhiteboxSimulate(_0x245d32, _0xcfef5d) {
    try {
        const _0x2077f8 = Math['ceil'](_0x245d32['length'] / 0x10);
        const _0x156368 = [];
        let _0x46f40e = Buffer['from'](_0xcfef5d);
        for (let _0x1a0acf = 0x0; _0x1a0acf < _0x2077f8; _0x1a0acf++) {
            const _0x389180 = _0x0_0x376087['createHash']('sha256')['update'](_0x46f40e)['digest']();
            _0x156368['push'](_0x389180['slice'](0x0, 0x10));
            for (let _0x17c7a2 = 0xf; _0x17c7a2 >= 0x0; _0x17c7a2--) {
                _0x46f40e[_0x17c7a2] = _0x46f40e[_0x17c7a2] + 0x1 & 0xff;
                if (_0x46f40e[_0x17c7a2] !== 0x0)
                    break;
            }
        }
        const _0x2b4bec = Buffer['concat'](_0x156368);
        const _0x4904fb = Buffer['alloc'](_0x245d32['length']);
        for (let _0xf518a5 = 0x0; _0xf518a5 < _0x245d32['length']; _0xf518a5++) {
            _0x4904fb[_0xf518a5] = _0x245d32[_0xf518a5] ^ _0x2b4bec[_0xf518a5];
        }
        return _0x4904fb;
    } catch (_0x470c26) {
        return _0x245d32;
    }
}
export function decryptNPVTunnel(_0x186dcc) {
    try {
        let _0x879d2a = _0x186dcc['toString']('utf-8')['trim']();
        if (_0x879d2a['startsWith']('NPVTSUB1'))
            _0x879d2a = _0x879d2a['slice'](0x8)['trim']();
        if (_0x879d2a['startsWith']('NPVT1'))
            _0x879d2a = _0x879d2a['slice'](0x5)['trim']();
        const _0x53e5de = _0x879d2a['split'](',');
        const _0x35620e = _0x53e5de[0x1] || _0x53e5de[0x0];
        const _0x147113 = Buffer['from'](_0x35620e, 'base64');
        if (_0x147113['length'] <= 0x10)
            return null;
        const _0x103690 = _0x147113['slice'](0x0, 0x10);
        const _0x2cfa14 = _0x147113['slice'](0x10);
        const _0x1cc778 = aesCtrWhiteboxSimulate(_0x2cfa14, _0x103690);
        let _0x5c81db = _0x1cc778['toString']('utf-8')['trim']();
        if (_0x5c81db['startsWith']('{') || _0x5c81db['startsWith']('[')) {
            try {
                const _0x1c19ec = JSON['parse'](_0x5c81db);
                if (Array['isArray'](_0x1c19ec)) {
                    _0x5c81db = JSON['stringify'](_0x1c19ec[0x0] || _0x1c19ec, null, 0x4);
                } else {
                    _0x5c81db = JSON['stringify'](_0x1c19ec, null, 0x4);
                }
            } catch (_0x53ab60) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x5c81db;
    } catch (_0x5ab62b) {
        return null;
    }
}