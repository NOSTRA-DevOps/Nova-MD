import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x5aee44, _0x4bd947) => {
    if (typeof _0x5aee44 === 'string')
        _0x5aee44 = Buffer['from'](_0x5aee44);
    const _0x3d60d4 = await new Storage({ ...auth })['ready'];
    try {
        const _0x357e80 = await _0x3d60d4['upload']({
            'name': _0x4bd947,
            'size': _0x5aee44['length']
        }, _0x5aee44)['complete'];
        const _0x6d8d50 = await _0x357e80['link']();
        return _0x6d8d50;
    } finally {
        _0x3d60d4['close']();
    }
};