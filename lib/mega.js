import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x2a8b1f, _0xd739e9) => {
    if (typeof _0x2a8b1f === 'string')
        _0x2a8b1f = Buffer['from'](_0x2a8b1f);
    const _0x5c03eb = await new Storage({ ...auth })['ready'];
    try {
        const _0x2ef610 = await _0x5c03eb['upload']({
            'name': _0xd739e9,
            'size': _0x2a8b1f['length']
        }, _0x2a8b1f)['complete'];
        const _0x1a8eb8 = await _0x2ef610['link']();
        return _0x1a8eb8;
    } finally {
        _0x5c03eb['close']();
    }
};