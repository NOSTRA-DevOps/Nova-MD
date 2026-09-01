import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x49f494, _0x52ce37) => {
    if (typeof _0x49f494 === 'string')
        _0x49f494 = Buffer['from'](_0x49f494);
    const _0x43458f = await new Storage({ ...auth })['ready'];
    try {
        const _0x49bc5c = await _0x43458f['upload']({
            'name': _0x52ce37,
            'size': _0x49f494['length']
        }, _0x49f494)['complete'];
        const _0x306787 = await _0x49bc5c['link']();
        return _0x306787;
    } finally {
        _0x43458f['close']();
    }
};