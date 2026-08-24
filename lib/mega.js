import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x2a9f49, _0x451f73) => {
    if (typeof _0x2a9f49 === 'string')
        _0x2a9f49 = Buffer['from'](_0x2a9f49);
    const _0x220c4d = await new Storage({ ...auth })['ready'];
    try {
        const _0x1135ef = await _0x220c4d['upload']({
            'name': _0x451f73,
            'size': _0x2a9f49['length']
        }, _0x2a9f49)['complete'];
        const _0x3eb5cc = await _0x1135ef['link']();
        return _0x3eb5cc;
    } finally {
        _0x220c4d['close']();
    }
};