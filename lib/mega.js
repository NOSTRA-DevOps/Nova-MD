import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x427715, _0x3c98d4) => {
    if (typeof _0x427715 === 'string')
        _0x427715 = Buffer['from'](_0x427715);
    const _0x27ee02 = await new Storage({ ...auth })['ready'];
    try {
        const _0x52d010 = await _0x27ee02['upload']({
            'name': _0x3c98d4,
            'size': _0x427715['length']
        }, _0x427715)['complete'];
        const _0x5e8d1b = await _0x52d010['link']();
        return _0x5e8d1b;
    } finally {
        _0x27ee02['close']();
    }
};