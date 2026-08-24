import _0x0_0x6d8d7f from 'crypto';
function aesCtrWhiteboxSimulate(_0x37e026, _0x2a03ad) {
    try {
        const _0xf7f6d6 = Math['ceil'](_0x37e026['length'] / 0x10);
        const _0x527105 = [];
        let _0x5de4cb = Buffer['from'](_0x2a03ad);
        for (let _0x4c60c0 = 0x0; _0x4c60c0 < _0xf7f6d6; _0x4c60c0++) {
            const _0x57e6ef = _0x0_0x6d8d7f['createHash']('sha256')['update'](_0x5de4cb)['digest']();
            _0x527105['push'](_0x57e6ef['slice'](0x0, 0x10));
            for (let _0x3cebeb = 0xf; _0x3cebeb >= 0x0; _0x3cebeb--) {
                _0x5de4cb[_0x3cebeb] = _0x5de4cb[_0x3cebeb] + 0x1 & 0xff;
                if (_0x5de4cb[_0x3cebeb] !== 0x0)
                    break;
            }
        }
        const _0x2adfbf = Buffer['concat'](_0x527105);
        const _0x2ff946 = Buffer['alloc'](_0x37e026['length']);
        for (let _0x231e26 = 0x0; _0x231e26 < _0x37e026['length']; _0x231e26++) {
            _0x2ff946[_0x231e26] = _0x37e026[_0x231e26] ^ _0x2adfbf[_0x231e26];
        }
        return _0x2ff946;
    } catch (_0x5c7800) {
        return _0x37e026;
    }
}
export function decryptNPVTunnel(_0x3f08bd) {
    try {
        let _0x4b4851 = _0x3f08bd['toString']('utf-8')['trim']();
        if (_0x4b4851['startsWith']('NPVTSUB1'))
            _0x4b4851 = _0x4b4851['slice'](0x8)['trim']();
        if (_0x4b4851['startsWith']('NPVT1'))
            _0x4b4851 = _0x4b4851['slice'](0x5)['trim']();
        const _0x29987b = _0x4b4851['split'](',');
        const _0xbb69f7 = _0x29987b[0x1] || _0x29987b[0x0];
        const _0x35f91e = Buffer['from'](_0xbb69f7, 'base64');
        if (_0x35f91e['length'] <= 0x10)
            return null;
        const _0x13caf4 = _0x35f91e['slice'](0x0, 0x10);
        const _0x14d1d5 = _0x35f91e['slice'](0x10);
        const _0x1e83d4 = aesCtrWhiteboxSimulate(_0x14d1d5, _0x13caf4);
        let _0x45a95f = _0x1e83d4['toString']('utf-8')['trim']();
        if (_0x45a95f['startsWith']('{') || _0x45a95f['startsWith']('[')) {
            try {
                const _0x6a0022 = JSON['parse'](_0x45a95f);
                if (Array['isArray'](_0x6a0022)) {
                    _0x45a95f = JSON['stringify'](_0x6a0022[0x0] || _0x6a0022, null, 0x4);
                } else {
                    _0x45a95f = JSON['stringify'](_0x6a0022, null, 0x4);
                }
            } catch (_0x521386) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x45a95f;
    } catch (_0x11c012) {
        return null;
    }
}