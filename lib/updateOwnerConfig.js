import _0x0_0x1d6105 from 'fs-extra';
export async function updateOwnerNumberFromSession() {
    try {
        const _0x575029 = './session/creds.json';
        if (_0x0_0x1d6105['existsSync'](_0x575029)) {
            const _0x2084bb = JSON['parse'](_0x0_0x1d6105['readFileSync'](_0x575029, 'utf-8'));
            if (_0x2084bb['me'] && _0x2084bb['me']['id']) {
                const _0x7e2518 = _0x2084bb['me']['id']['split'](':')[0x0]['split']('@')[0x0];
                let _0x19b427 = _0x0_0x1d6105['readFileSync']('.env', 'utf-8');
                if (_0x19b427['includes']('OWNER_NUMBER=')) {
                    _0x19b427 = _0x19b427['replace'](/OWNER_NUMBER=.*/g, 'OWNER_NUMBER=' + _0x7e2518);
                } else {
                    _0x19b427 += '\x0aOWNER_NUMBER=' + _0x7e2518;
                }
                _0x0_0x1d6105['writeFileSync']('.env', _0x19b427);
                console['log']('✅\x20Owner\x20number\x20updated\x20to:\x20' + _0x7e2518);
                return _0x7e2518;
            }
        }
    } catch (_0x23368c) {
        console['error']('❌\x20Failed\x20to\x20update\x20owner\x20number:', _0x23368c);
    }
    return null;
}