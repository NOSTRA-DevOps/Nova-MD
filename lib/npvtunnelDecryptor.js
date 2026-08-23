import _0x0_0x41fb7a from 'crypto';
function aesCtrWhiteboxSimulate(_0x5369a0, _0x568540) {
    try {
        const _0x39bf6b = Math['ceil'](_0x5369a0['length'] / 0x10);
        const _0x17ce4d = [];
        let _0x2ee0a4 = Buffer['from'](_0x568540);
        for (let _0x399708 = 0x0; _0x399708 < _0x39bf6b; _0x399708++) {
            const _0x5db1e1 = _0x0_0x41fb7a['createHash']('sha256')['update'](_0x2ee0a4)['digest']();
            _0x17ce4d['push'](_0x5db1e1['slice'](0x0, 0x10));
            for (let _0x37a0aa = 0xf; _0x37a0aa >= 0x0; _0x37a0aa--) {
                _0x2ee0a4[_0x37a0aa] = _0x2ee0a4[_0x37a0aa] + 0x1 & 0xff;
                if (_0x2ee0a4[_0x37a0aa] !== 0x0)
                    break;
            }
        }
        const _0x14dc26 = Buffer['concat'](_0x17ce4d);
        const _0x24a5b9 = Buffer['alloc'](_0x5369a0['length']);
        for (let _0x10e028 = 0x0; _0x10e028 < _0x5369a0['length']; _0x10e028++) {
            _0x24a5b9[_0x10e028] = _0x5369a0[_0x10e028] ^ _0x14dc26[_0x10e028];
        }
        return _0x24a5b9;
    } catch (_0x322ca9) {
        return _0x5369a0;
    }
}
export function decryptNPVTunnel(_0x4eb21e) {
    try {
        let _0x2cf91b = _0x4eb21e['toString']('utf-8')['trim']();
        if (_0x2cf91b['startsWith']('NPVTSUB1'))
            _0x2cf91b = _0x2cf91b['slice'](0x8)['trim']();
        if (_0x2cf91b['startsWith']('NPVT1'))
            _0x2cf91b = _0x2cf91b['slice'](0x5)['trim']();
        const _0x5e2794 = _0x2cf91b['split'](',');
        const _0x5c387a = _0x5e2794[0x1] || _0x5e2794[0x0];
        const _0x10d376 = Buffer['from'](_0x5c387a, 'base64');
        if (_0x10d376['length'] <= 0x10)
            return null;
        const _0x32e8fc = _0x10d376['slice'](0x0, 0x10);
        const _0x158270 = _0x10d376['slice'](0x10);
        const _0x150769 = aesCtrWhiteboxSimulate(_0x158270, _0x32e8fc);
        let _0x30525d = _0x150769['toString']('utf-8')['trim']();
        if (_0x30525d['startsWith']('{') || _0x30525d['startsWith']('[')) {
            try {
                const _0x24f46b = JSON['parse'](_0x30525d);
                if (Array['isArray'](_0x24f46b)) {
                    _0x30525d = JSON['stringify'](_0x24f46b[0x0] || _0x24f46b, null, 0x4);
                } else {
                    _0x30525d = JSON['stringify'](_0x24f46b, null, 0x4);
                }
            } catch (_0x40f59b) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x30525d;
    } catch (_0x24e92b) {
        return null;
    }
}