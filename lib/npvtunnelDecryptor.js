import _0x0_0x5a32bb from 'crypto';
function aesCtrWhiteboxSimulate(_0x4cc644, _0x2985dd) {
    try {
        const _0x6c363 = Math['ceil'](_0x4cc644['length'] / 0x10);
        const _0x28b23e = [];
        let _0x14b659 = Buffer['from'](_0x2985dd);
        for (let _0x33d59c = 0x0; _0x33d59c < _0x6c363; _0x33d59c++) {
            const _0x226af1 = _0x0_0x5a32bb['createHash']('sha256')['update'](_0x14b659)['digest']();
            _0x28b23e['push'](_0x226af1['slice'](0x0, 0x10));
            for (let _0x180e17 = 0xf; _0x180e17 >= 0x0; _0x180e17--) {
                _0x14b659[_0x180e17] = _0x14b659[_0x180e17] + 0x1 & 0xff;
                if (_0x14b659[_0x180e17] !== 0x0)
                    break;
            }
        }
        const _0x5cf485 = Buffer['concat'](_0x28b23e);
        const _0x464df5 = Buffer['alloc'](_0x4cc644['length']);
        for (let _0x50d6d5 = 0x0; _0x50d6d5 < _0x4cc644['length']; _0x50d6d5++) {
            _0x464df5[_0x50d6d5] = _0x4cc644[_0x50d6d5] ^ _0x5cf485[_0x50d6d5];
        }
        return _0x464df5;
    } catch (_0x534fa1) {
        return _0x4cc644;
    }
}
export function decryptNPVTunnel(_0x20dc43) {
    try {
        let _0x1a1a5c = _0x20dc43['toString']('utf-8')['trim']();
        if (_0x1a1a5c['startsWith']('NPVTSUB1'))
            _0x1a1a5c = _0x1a1a5c['slice'](0x8)['trim']();
        if (_0x1a1a5c['startsWith']('NPVT1'))
            _0x1a1a5c = _0x1a1a5c['slice'](0x5)['trim']();
        const _0x3b567f = _0x1a1a5c['split'](',');
        const _0xce0f0a = _0x3b567f[0x1] || _0x3b567f[0x0];
        const _0x3a5b24 = Buffer['from'](_0xce0f0a, 'base64');
        if (_0x3a5b24['length'] <= 0x10)
            return null;
        const _0x3f0d06 = _0x3a5b24['slice'](0x0, 0x10);
        const _0x45ec8f = _0x3a5b24['slice'](0x10);
        const _0x3a8067 = aesCtrWhiteboxSimulate(_0x45ec8f, _0x3f0d06);
        let _0x2661b9 = _0x3a8067['toString']('utf-8')['trim']();
        if (_0x2661b9['startsWith']('{') || _0x2661b9['startsWith']('[')) {
            try {
                const _0x39c5f9 = JSON['parse'](_0x2661b9);
                if (Array['isArray'](_0x39c5f9)) {
                    _0x2661b9 = JSON['stringify'](_0x39c5f9[0x0] || _0x39c5f9, null, 0x4);
                } else {
                    _0x2661b9 = JSON['stringify'](_0x39c5f9, null, 0x4);
                }
            } catch (_0x22200a) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x2661b9;
    } catch (_0x27efca) {
        return null;
    }
}