import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x5c7606, _0x3ebc2d) => {
    if (typeof _0x5c7606 === 'string')
        _0x5c7606 = Buffer['from'](_0x5c7606);
    const _0x20c2d8 = await new Storage({ ...auth })['ready'];
    try {
        const _0x34620a = await _0x20c2d8['upload']({
            'name': _0x3ebc2d,
            'size': _0x5c7606['length']
        }, _0x5c7606)['complete'];
        const _0x12de8b = await _0x34620a['link']();
        return _0x12de8b;
    } finally {
        _0x20c2d8['close']();
    }
};