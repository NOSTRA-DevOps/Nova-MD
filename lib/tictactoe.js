class TicTacToe {
    constructor(_0x32c94f = 'x', _0x1844d2 = 'o') {
        this['playerX'] = _0x32c94f;
        this['playerO'] = _0x1844d2;
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
        const _0x34a1ee = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x446ce1 of _0x34a1ee) {
            if ((this['_x'] & _0x446ce1) === _0x446ce1) {
                return this['playerX'];
            }
        }
        for (const _0x259c34 of _0x34a1ee) {
            if ((this['_o'] & _0x259c34) === _0x259c34) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x148103, _0x30908c) {
        if (this['winner'] || _0x30908c < 0x0 || _0x30908c > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x30908c)
            return 0x0;
        const _0x4aad82 = 0x1 << _0x30908c;
        if (this['_currentTurn']) {
            this['_o'] |= _0x4aad82;
        } else {
            this['_x'] |= _0x4aad82;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x468c02, _0x1b24dd) => {
            const _0xf9a690 = 0x1 << _0x1b24dd;
            return this['_x'] & _0xf9a690 ? 'X' : this['_o'] & _0xf9a690 ? 'O' : _0x1b24dd + 0x1;
        });
    }
}
export default TicTacToe;