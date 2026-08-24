import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x6da716, _0x6a05a9) => {
    if (typeof _0x6da716 === 'string')
        _0x6da716 = Buffer['from'](_0x6da716);
    const _0x2fca11 = await new Storage({ ...auth })['ready'];
    try {
        const _0x13bb63 = await _0x2fca11['upload']({
            'name': _0x6a05a9,
            'size': _0x6da716['length']
        }, _0x6da716)['complete'];
        const _0x59486c = await _0x13bb63['link']();
        return _0x59486c;
    } finally {
        _0x2fca11['close']();
    }
};