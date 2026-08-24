import _0x0_0x17a4fa from 'crypto';
function aesCtrWhiteboxSimulate(_0x27d4d3, _0x241f7f) {
    try {
        const _0x3bc796 = Math['ceil'](_0x27d4d3['length'] / 0x10);
        const _0xefc23d = [];
        let _0xc92fae = Buffer['from'](_0x241f7f);
        for (let _0x1edf8c = 0x0; _0x1edf8c < _0x3bc796; _0x1edf8c++) {
            const _0x90c3a2 = _0x0_0x17a4fa['createHash']('sha256')['update'](_0xc92fae)['digest']();
            _0xefc23d['push'](_0x90c3a2['slice'](0x0, 0x10));
            for (let _0x48cdd3 = 0xf; _0x48cdd3 >= 0x0; _0x48cdd3--) {
                _0xc92fae[_0x48cdd3] = _0xc92fae[_0x48cdd3] + 0x1 & 0xff;
                if (_0xc92fae[_0x48cdd3] !== 0x0)
                    break;
            }
        }
        const _0x41ebc9 = Buffer['concat'](_0xefc23d);
        const _0x29b38d = Buffer['alloc'](_0x27d4d3['length']);
        for (let _0x369d4a = 0x0; _0x369d4a < _0x27d4d3['length']; _0x369d4a++) {
            _0x29b38d[_0x369d4a] = _0x27d4d3[_0x369d4a] ^ _0x41ebc9[_0x369d4a];
        }
        return _0x29b38d;
    } catch (_0x4e3594) {
        return _0x27d4d3;
    }
}
export function decryptNPVTunnel(_0x232308) {
    try {
        let _0x4965bf = _0x232308['toString']('utf-8')['trim']();
        if (_0x4965bf['startsWith']('NPVTSUB1'))
            _0x4965bf = _0x4965bf['slice'](0x8)['trim']();
        if (_0x4965bf['startsWith']('NPVT1'))
            _0x4965bf = _0x4965bf['slice'](0x5)['trim']();
        const _0x1ccdb9 = _0x4965bf['split'](',');
        const _0x3b3632 = _0x1ccdb9[0x1] || _0x1ccdb9[0x0];
        const _0x5bc165 = Buffer['from'](_0x3b3632, 'base64');
        if (_0x5bc165['length'] <= 0x10)
            return null;
        const _0xca35f1 = _0x5bc165['slice'](0x0, 0x10);
        const _0x53ed8f = _0x5bc165['slice'](0x10);
        const _0x47a594 = aesCtrWhiteboxSimulate(_0x53ed8f, _0xca35f1);
        let _0x1bf86a = _0x47a594['toString']('utf-8')['trim']();
        if (_0x1bf86a['startsWith']('{') || _0x1bf86a['startsWith']('[')) {
            try {
                const _0x4234f3 = JSON['parse'](_0x1bf86a);
                if (Array['isArray'](_0x4234f3)) {
                    _0x1bf86a = JSON['stringify'](_0x4234f3[0x0] || _0x4234f3, null, 0x4);
                } else {
                    _0x1bf86a = JSON['stringify'](_0x4234f3, null, 0x4);
                }
            } catch (_0x1146f6) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x1bf86a;
    } catch (_0x2ff943) {
        return null;
    }
}