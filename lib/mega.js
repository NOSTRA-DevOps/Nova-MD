import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x7c635, _0x2ede27) => {
    if (typeof _0x7c635 === 'string')
        _0x7c635 = Buffer['from'](_0x7c635);
    const _0x557f3f = await new Storage({ ...auth })['ready'];
    try {
        const _0x3b25f2 = await _0x557f3f['upload']({
            'name': _0x2ede27,
            'size': _0x7c635['length']
        }, _0x7c635)['complete'];
        const _0x1fe600 = await _0x3b25f2['link']();
        return _0x1fe600;
    } finally {
        _0x557f3f['close']();
    }
};