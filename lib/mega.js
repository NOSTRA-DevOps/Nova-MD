import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x467d61, _0x4a6ebb) => {
    if (typeof _0x467d61 === 'string')
        _0x467d61 = Buffer['from'](_0x467d61);
    const _0x15f084 = await new Storage({ ...auth })['ready'];
    try {
        const _0xde5372 = await _0x15f084['upload']({
            'name': _0x4a6ebb,
            'size': _0x467d61['length']
        }, _0x467d61)['complete'];
        const _0x6ce92d = await _0xde5372['link']();
        return _0x6ce92d;
    } finally {
        _0x15f084['close']();
    }
};