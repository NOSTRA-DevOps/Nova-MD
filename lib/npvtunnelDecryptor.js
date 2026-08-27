import _0x0_0xbed33a from 'crypto';
function aesCtrWhiteboxSimulate(_0x37629c, _0x2f84ee) {
    try {
        const _0x39f755 = Math['ceil'](_0x37629c['length'] / 0x10);
        const _0x1d0cff = [];
        let _0x9abb3a = Buffer['from'](_0x2f84ee);
        for (let _0x4c5382 = 0x0; _0x4c5382 < _0x39f755; _0x4c5382++) {
            const _0x596b8c = _0x0_0xbed33a['createHash']('sha256')['update'](_0x9abb3a)['digest']();
            _0x1d0cff['push'](_0x596b8c['slice'](0x0, 0x10));
            for (let _0x17d035 = 0xf; _0x17d035 >= 0x0; _0x17d035--) {
                _0x9abb3a[_0x17d035] = _0x9abb3a[_0x17d035] + 0x1 & 0xff;
                if (_0x9abb3a[_0x17d035] !== 0x0)
                    break;
            }
        }
        const _0x6ae114 = Buffer['concat'](_0x1d0cff);
        const _0x3e3c65 = Buffer['alloc'](_0x37629c['length']);
        for (let _0x2e15e6 = 0x0; _0x2e15e6 < _0x37629c['length']; _0x2e15e6++) {
            _0x3e3c65[_0x2e15e6] = _0x37629c[_0x2e15e6] ^ _0x6ae114[_0x2e15e6];
        }
        return _0x3e3c65;
    } catch (_0x5c5de8) {
        return _0x37629c;
    }
}
export function decryptNPVTunnel(_0x9b9f55) {
    try {
        let _0x17a17d = _0x9b9f55['toString']('utf-8')['trim']();
        if (_0x17a17d['startsWith']('NPVTSUB1'))
            _0x17a17d = _0x17a17d['slice'](0x8)['trim']();
        if (_0x17a17d['startsWith']('NPVT1'))
            _0x17a17d = _0x17a17d['slice'](0x5)['trim']();
        const _0x268d80 = _0x17a17d['split'](',');
        const _0x551dc4 = _0x268d80[0x1] || _0x268d80[0x0];
        const _0x304d08 = Buffer['from'](_0x551dc4, 'base64');
        if (_0x304d08['length'] <= 0x10)
            return null;
        const _0x17ffaa = _0x304d08['slice'](0x0, 0x10);
        const _0x4f0bf8 = _0x304d08['slice'](0x10);
        const _0x3247c7 = aesCtrWhiteboxSimulate(_0x4f0bf8, _0x17ffaa);
        let _0x4b87cd = _0x3247c7['toString']('utf-8')['trim']();
        if (_0x4b87cd['startsWith']('{') || _0x4b87cd['startsWith']('[')) {
            try {
                const _0x46a160 = JSON['parse'](_0x4b87cd);
                if (Array['isArray'](_0x46a160)) {
                    _0x4b87cd = JSON['stringify'](_0x46a160[0x0] || _0x46a160, null, 0x4);
                } else {
                    _0x4b87cd = JSON['stringify'](_0x46a160, null, 0x4);
                }
            } catch (_0x5baa19) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x4b87cd;
    } catch (_0x51b148) {
        return null;
    }
}