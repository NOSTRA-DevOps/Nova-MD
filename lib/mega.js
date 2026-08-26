import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x35ef5b, _0x1fc3c1) => {
    if (typeof _0x35ef5b === 'string')
        _0x35ef5b = Buffer['from'](_0x35ef5b);
    const _0x29bc42 = await new Storage({ ...auth })['ready'];
    try {
        const _0x161234 = await _0x29bc42['upload']({
            'name': _0x1fc3c1,
            'size': _0x35ef5b['length']
        }, _0x35ef5b)['complete'];
        const _0xf64315 = await _0x161234['link']();
        return _0xf64315;
    } finally {
        _0x29bc42['close']();
    }
};