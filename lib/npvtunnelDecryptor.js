import _0x0_0x4fff66 from 'crypto';
function aesCtrWhiteboxSimulate(_0x184d86, _0x38e6b2) {
    try {
        const _0x1e69f0 = Math['ceil'](_0x184d86['length'] / 0x10);
        const _0x58de57 = [];
        let _0x2643c2 = Buffer['from'](_0x38e6b2);
        for (let _0x5e4ad4 = 0x0; _0x5e4ad4 < _0x1e69f0; _0x5e4ad4++) {
            const _0x184636 = _0x0_0x4fff66['createHash']('sha256')['update'](_0x2643c2)['digest']();
            _0x58de57['push'](_0x184636['slice'](0x0, 0x10));
            for (let _0x3ac1fb = 0xf; _0x3ac1fb >= 0x0; _0x3ac1fb--) {
                _0x2643c2[_0x3ac1fb] = _0x2643c2[_0x3ac1fb] + 0x1 & 0xff;
                if (_0x2643c2[_0x3ac1fb] !== 0x0)
                    break;
            }
        }
        const _0x495a5b = Buffer['concat'](_0x58de57);
        const _0x13693f = Buffer['alloc'](_0x184d86['length']);
        for (let _0x157f35 = 0x0; _0x157f35 < _0x184d86['length']; _0x157f35++) {
            _0x13693f[_0x157f35] = _0x184d86[_0x157f35] ^ _0x495a5b[_0x157f35];
        }
        return _0x13693f;
    } catch (_0x43f418) {
        return _0x184d86;
    }
}
export function decryptNPVTunnel(_0x2033de) {
    try {
        let _0x474b49 = _0x2033de['toString']('utf-8')['trim']();
        if (_0x474b49['startsWith']('NPVTSUB1'))
            _0x474b49 = _0x474b49['slice'](0x8)['trim']();
        if (_0x474b49['startsWith']('NPVT1'))
            _0x474b49 = _0x474b49['slice'](0x5)['trim']();
        const _0x3d85c6 = _0x474b49['split'](',');
        const _0x957837 = _0x3d85c6[0x1] || _0x3d85c6[0x0];
        const _0x2cd1d9 = Buffer['from'](_0x957837, 'base64');
        if (_0x2cd1d9['length'] <= 0x10)
            return null;
        const _0x590a50 = _0x2cd1d9['slice'](0x0, 0x10);
        const _0x369c80 = _0x2cd1d9['slice'](0x10);
        const _0xca1544 = aesCtrWhiteboxSimulate(_0x369c80, _0x590a50);
        let _0x7d411 = _0xca1544['toString']('utf-8')['trim']();
        if (_0x7d411['startsWith']('{') || _0x7d411['startsWith']('[')) {
            try {
                const _0xbfc931 = JSON['parse'](_0x7d411);
                if (Array['isArray'](_0xbfc931)) {
                    _0x7d411 = JSON['stringify'](_0xbfc931[0x0] || _0xbfc931, null, 0x4);
                } else {
                    _0x7d411 = JSON['stringify'](_0xbfc931, null, 0x4);
                }
            } catch (_0x35a0ef) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x7d411;
    } catch (_0x179356) {
        return null;
    }
}