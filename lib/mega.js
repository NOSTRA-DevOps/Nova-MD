import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x5d691b, _0x5a25bc) => {
    if (typeof _0x5d691b === 'string')
        _0x5d691b = Buffer['from'](_0x5d691b);
    const _0x55fbe5 = await new Storage({ ...auth })['ready'];
    try {
        const _0x5bc8ef = await _0x55fbe5['upload']({
            'name': _0x5a25bc,
            'size': _0x5d691b['length']
        }, _0x5d691b)['complete'];
        const _0x4c1f86 = await _0x5bc8ef['link']();
        return _0x4c1f86;
    } finally {
        _0x55fbe5['close']();
    }
};