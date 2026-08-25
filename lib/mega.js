import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x9b2e18, _0x32b066) => {
    if (typeof _0x9b2e18 === 'string')
        _0x9b2e18 = Buffer['from'](_0x9b2e18);
    const _0x3b3f88 = await new Storage({ ...auth })['ready'];
    try {
        const _0x4f5577 = await _0x3b3f88['upload']({
            'name': _0x32b066,
            'size': _0x9b2e18['length']
        }, _0x9b2e18)['complete'];
        const _0x5f3bb6 = await _0x4f5577['link']();
        return _0x5f3bb6;
    } finally {
        _0x3b3f88['close']();
    }
};