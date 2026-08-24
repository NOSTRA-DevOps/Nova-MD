import _0x0_0x5478fb from 'crypto';
function aesCtrWhiteboxSimulate(_0x6ed6e9, _0x96258c) {
    try {
        const _0xeb94de = Math['ceil'](_0x6ed6e9['length'] / 0x10);
        const _0x4756f8 = [];
        let _0x5481f7 = Buffer['from'](_0x96258c);
        for (let _0x474048 = 0x0; _0x474048 < _0xeb94de; _0x474048++) {
            const _0x512bf3 = _0x0_0x5478fb['createHash']('sha256')['update'](_0x5481f7)['digest']();
            _0x4756f8['push'](_0x512bf3['slice'](0x0, 0x10));
            for (let _0x74541 = 0xf; _0x74541 >= 0x0; _0x74541--) {
                _0x5481f7[_0x74541] = _0x5481f7[_0x74541] + 0x1 & 0xff;
                if (_0x5481f7[_0x74541] !== 0x0)
                    break;
            }
        }
        const _0x4110ac = Buffer['concat'](_0x4756f8);
        const _0xb1f12c = Buffer['alloc'](_0x6ed6e9['length']);
        for (let _0x554a4d = 0x0; _0x554a4d < _0x6ed6e9['length']; _0x554a4d++) {
            _0xb1f12c[_0x554a4d] = _0x6ed6e9[_0x554a4d] ^ _0x4110ac[_0x554a4d];
        }
        return _0xb1f12c;
    } catch (_0x6200e8) {
        return _0x6ed6e9;
    }
}
export function decryptNPVTunnel(_0x102fb7) {
    try {
        let _0x45b9d3 = _0x102fb7['toString']('utf-8')['trim']();
        if (_0x45b9d3['startsWith']('NPVTSUB1'))
            _0x45b9d3 = _0x45b9d3['slice'](0x8)['trim']();
        if (_0x45b9d3['startsWith']('NPVT1'))
            _0x45b9d3 = _0x45b9d3['slice'](0x5)['trim']();
        const _0x1f94b3 = _0x45b9d3['split'](',');
        const _0x2ca439 = _0x1f94b3[0x1] || _0x1f94b3[0x0];
        const _0x25d68d = Buffer['from'](_0x2ca439, 'base64');
        if (_0x25d68d['length'] <= 0x10)
            return null;
        const _0x15594d = _0x25d68d['slice'](0x0, 0x10);
        const _0x276f2b = _0x25d68d['slice'](0x10);
        const _0x4fb9cf = aesCtrWhiteboxSimulate(_0x276f2b, _0x15594d);
        let _0x43be93 = _0x4fb9cf['toString']('utf-8')['trim']();
        if (_0x43be93['startsWith']('{') || _0x43be93['startsWith']('[')) {
            try {
                const _0x398602 = JSON['parse'](_0x43be93);
                if (Array['isArray'](_0x398602)) {
                    _0x43be93 = JSON['stringify'](_0x398602[0x0] || _0x398602, null, 0x4);
                } else {
                    _0x43be93 = JSON['stringify'](_0x398602, null, 0x4);
                }
            } catch (_0x1052f3) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x43be93;
    } catch (_0x1f6d63) {
        return null;
    }
}