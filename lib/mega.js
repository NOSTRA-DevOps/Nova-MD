import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x5622e2, _0x43ade6) => {
    if (typeof _0x5622e2 === 'string')
        _0x5622e2 = Buffer['from'](_0x5622e2);
    const _0x274109 = await new Storage({ ...auth })['ready'];
    try {
        const _0x4ee0e9 = await _0x274109['upload']({
            'name': _0x43ade6,
            'size': _0x5622e2['length']
        }, _0x5622e2)['complete'];
        const _0x5981e4 = await _0x4ee0e9['link']();
        return _0x5981e4;
    } finally {
        _0x274109['close']();
    }
};