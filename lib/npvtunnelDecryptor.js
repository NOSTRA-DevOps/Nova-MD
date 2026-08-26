import _0x0_0x163cc3 from 'crypto';
function aesCtrWhiteboxSimulate(_0x43e858, _0x14d987) {
    try {
        const _0x176ae7 = Math['ceil'](_0x43e858['length'] / 0x10);
        const _0x3009a2 = [];
        let _0x1acbc3 = Buffer['from'](_0x14d987);
        for (let _0x4647d0 = 0x0; _0x4647d0 < _0x176ae7; _0x4647d0++) {
            const _0xfbba78 = _0x0_0x163cc3['createHash']('sha256')['update'](_0x1acbc3)['digest']();
            _0x3009a2['push'](_0xfbba78['slice'](0x0, 0x10));
            for (let _0x5a5dac = 0xf; _0x5a5dac >= 0x0; _0x5a5dac--) {
                _0x1acbc3[_0x5a5dac] = _0x1acbc3[_0x5a5dac] + 0x1 & 0xff;
                if (_0x1acbc3[_0x5a5dac] !== 0x0)
                    break;
            }
        }
        const _0x279d5f = Buffer['concat'](_0x3009a2);
        const _0xde5663 = Buffer['alloc'](_0x43e858['length']);
        for (let _0x2a7049 = 0x0; _0x2a7049 < _0x43e858['length']; _0x2a7049++) {
            _0xde5663[_0x2a7049] = _0x43e858[_0x2a7049] ^ _0x279d5f[_0x2a7049];
        }
        return _0xde5663;
    } catch (_0x2fbef8) {
        return _0x43e858;
    }
}
export function decryptNPVTunnel(_0x14781f) {
    try {
        let _0x1eb714 = _0x14781f['toString']('utf-8')['trim']();
        if (_0x1eb714['startsWith']('NPVTSUB1'))
            _0x1eb714 = _0x1eb714['slice'](0x8)['trim']();
        if (_0x1eb714['startsWith']('NPVT1'))
            _0x1eb714 = _0x1eb714['slice'](0x5)['trim']();
        const _0x826388 = _0x1eb714['split'](',');
        const _0x5121a4 = _0x826388[0x1] || _0x826388[0x0];
        const _0x52d812 = Buffer['from'](_0x5121a4, 'base64');
        if (_0x52d812['length'] <= 0x10)
            return null;
        const _0x7612ce = _0x52d812['slice'](0x0, 0x10);
        const _0x24a300 = _0x52d812['slice'](0x10);
        const _0x463f89 = aesCtrWhiteboxSimulate(_0x24a300, _0x7612ce);
        let _0x531dc4 = _0x463f89['toString']('utf-8')['trim']();
        if (_0x531dc4['startsWith']('{') || _0x531dc4['startsWith']('[')) {
            try {
                const _0x5d7c9f = JSON['parse'](_0x531dc4);
                if (Array['isArray'](_0x5d7c9f)) {
                    _0x531dc4 = JSON['stringify'](_0x5d7c9f[0x0] || _0x5d7c9f, null, 0x4);
                } else {
                    _0x531dc4 = JSON['stringify'](_0x5d7c9f, null, 0x4);
                }
            } catch (_0xf5e9e2) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x531dc4;
    } catch (_0x1f5388) {
        return null;
    }
}