import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x26828f, _0xe2d94) => {
    if (typeof _0x26828f === 'string')
        _0x26828f = Buffer['from'](_0x26828f);
    const _0x1e210d = await new Storage({ ...auth })['ready'];
    try {
        const _0x3001d6 = await _0x1e210d['upload']({
            'name': _0xe2d94,
            'size': _0x26828f['length']
        }, _0x26828f)['complete'];
        const _0x2761b5 = await _0x3001d6['link']();
        return _0x2761b5;
    } finally {
        _0x1e210d['close']();
    }
};