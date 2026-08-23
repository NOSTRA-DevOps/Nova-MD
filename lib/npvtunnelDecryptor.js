import _0x0_0x506f2a from 'crypto';
function aesCtrWhiteboxSimulate(_0x2a27f0, _0x1f3460) {
    try {
        const _0x567649 = Math['ceil'](_0x2a27f0['length'] / 0x10);
        const _0x2ef34b = [];
        let _0xd6e6c4 = Buffer['from'](_0x1f3460);
        for (let _0xe31d52 = 0x0; _0xe31d52 < _0x567649; _0xe31d52++) {
            const _0x225d45 = _0x0_0x506f2a['createHash']('sha256')['update'](_0xd6e6c4)['digest']();
            _0x2ef34b['push'](_0x225d45['slice'](0x0, 0x10));
            for (let _0x858c47 = 0xf; _0x858c47 >= 0x0; _0x858c47--) {
                _0xd6e6c4[_0x858c47] = _0xd6e6c4[_0x858c47] + 0x1 & 0xff;
                if (_0xd6e6c4[_0x858c47] !== 0x0)
                    break;
            }
        }
        const _0x366bc0 = Buffer['concat'](_0x2ef34b);
        const _0x16748b = Buffer['alloc'](_0x2a27f0['length']);
        for (let _0x1477da = 0x0; _0x1477da < _0x2a27f0['length']; _0x1477da++) {
            _0x16748b[_0x1477da] = _0x2a27f0[_0x1477da] ^ _0x366bc0[_0x1477da];
        }
        return _0x16748b;
    } catch (_0x2ba622) {
        return _0x2a27f0;
    }
}
export function decryptNPVTunnel(_0x1d3ad0) {
    try {
        let _0x544593 = _0x1d3ad0['toString']('utf-8')['trim']();
        if (_0x544593['startsWith']('NPVTSUB1'))
            _0x544593 = _0x544593['slice'](0x8)['trim']();
        if (_0x544593['startsWith']('NPVT1'))
            _0x544593 = _0x544593['slice'](0x5)['trim']();
        const _0x18c949 = _0x544593['split'](',');
        const _0x97efdb = _0x18c949[0x1] || _0x18c949[0x0];
        const _0x341379 = Buffer['from'](_0x97efdb, 'base64');
        if (_0x341379['length'] <= 0x10)
            return null;
        const _0x28fed5 = _0x341379['slice'](0x0, 0x10);
        const _0x34d252 = _0x341379['slice'](0x10);
        const _0x137a0c = aesCtrWhiteboxSimulate(_0x34d252, _0x28fed5);
        let _0x233e99 = _0x137a0c['toString']('utf-8')['trim']();
        if (_0x233e99['startsWith']('{') || _0x233e99['startsWith']('[')) {
            try {
                const _0x346a58 = JSON['parse'](_0x233e99);
                if (Array['isArray'](_0x346a58)) {
                    _0x233e99 = JSON['stringify'](_0x346a58[0x0] || _0x346a58, null, 0x4);
                } else {
                    _0x233e99 = JSON['stringify'](_0x346a58, null, 0x4);
                }
            } catch (_0x997ad6) {
            }
        }
        return 'Labokingfreesurf\x20NPVTUNNEL\x20CONFIG\x0a==============================\x0a\x0a' + _0x233e99;
    } catch (_0xea55f4) {
        return null;
    }
}