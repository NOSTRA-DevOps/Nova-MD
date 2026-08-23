import { Storage } from 'megajs';
const auth = {
    'email': process.env.MEGA_EMAIL || 'yane.mboula@facsciences-uy1.cm',
    'password': process.env.MEGA_PASSWORD || '123NOVA-MD',
    'userAgent': 'Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/42.0.2311.135\x20Safari/537.36\x20Edge/12.246'
};
export const upload = async (_0x4e2ce7, _0x159402) => {
    if (typeof _0x4e2ce7 === 'string')
        _0x4e2ce7 = Buffer['from'](_0x4e2ce7);
    const _0x158503 = await new Storage({ ...auth })['ready'];
    try {
        const _0x39533c = await _0x158503['upload']({
            'name': _0x159402,
            'size': _0x4e2ce7['length']
        }, _0x4e2ce7)['complete'];
        const _0x41f628 = await _0x39533c['link']();
        return _0x41f628;
    } finally {
        _0x158503['close']();
    }
};