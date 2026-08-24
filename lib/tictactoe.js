class TicTacToe {
    constructor(_0xfadfec = 'x', _0x41240a = 'o') {
        this['playerX'] = _0xfadfec;
        this['playerO'] = _0x41240a;
        this['_currentTurn'] = ![];
        this['_x'] = 0x0;
        this['_o'] = 0x0;
        this['turns'] = 0x0;
    }
    get ['board']() {
        return this['_x'] | this['_o'];
    }
    get ['currentTurn']() {
        return this['_currentTurn'] ? this['playerO'] : this['playerX'];
    }
    get ['winner']() {
        const _0x19b570 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x46a192 of _0x19b570) {
            if ((this['_x'] & _0x46a192) === _0x46a192) {
                return this['playerX'];
            }
        }
        for (const _0xeb5872 of _0x19b570) {
            if ((this['_o'] & _0xeb5872) === _0xeb5872) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x2f3bd8, _0xc0ea21) {
        if (this['winner'] || _0xc0ea21 < 0x0 || _0xc0ea21 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0xc0ea21)
            return 0x0;
        const _0x2c882e = 0x1 << _0xc0ea21;
        if (this['_currentTurn']) {
            this['_o'] |= _0x2c882e;
        } else {
            this['_x'] |= _0x2c882e;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x5576f1, _0x22512a) => {
            const _0x2d28bb = 0x1 << _0x22512a;
            return this['_x'] & _0x2d28bb ? 'X' : this['_o'] & _0x2d28bb ? 'O' : _0x22512a + 0x1;
        });
    }
}
export default TicTacToe;