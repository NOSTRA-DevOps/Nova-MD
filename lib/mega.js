import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x5ef794, _0x17f07b) => {
    if (typeof _0x5ef794 === 'string')
        _0x5ef794 = Buffer['from'](_0x5ef794);
    const _0x1d2289 = await new Storage({ ...auth })['ready'];
    try {
        const _0x2ecb31 = await _0x1d2289['upload']({
            'name': _0x17f07b,
            'size': _0x5ef794['length']
        }, _0x5ef794)['complete'];
        const _0x52913b = await _0x2ecb31['link']();
        return _0x52913b;
    } finally {
        _0x1d2289['close']();
    }
};