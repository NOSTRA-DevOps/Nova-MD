import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x542f9f, _0x16f415) => {
    if (typeof _0x542f9f === 'string')
        _0x542f9f = Buffer['from'](_0x542f9f);
    const _0x4de2fe = await new Storage({ ...auth })['ready'];
    try {
        const _0x2dc590 = await _0x4de2fe['upload']({
            'name': _0x16f415,
            'size': _0x542f9f['length']
        }, _0x542f9f)['complete'];
        const _0x434c2b = await _0x2dc590['link']();
        return _0x434c2b;
    } finally {
        _0x4de2fe['close']();
    }
};