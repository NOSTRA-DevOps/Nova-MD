class TicTacToe {
    constructor(_0x270bb5 = 'x', _0x23880a = 'o') {
        this['playerX'] = _0x270bb5;
        this['playerO'] = _0x23880a;
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
        const _0x18e2c7 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x26ddbf of _0x18e2c7) {
            if ((this['_x'] & _0x26ddbf) === _0x26ddbf) {
                return this['playerX'];
            }
        }
        for (const _0x8ca80f of _0x18e2c7) {
            if ((this['_o'] & _0x8ca80f) === _0x8ca80f) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x178fdb, _0x47df29) {
        if (this['winner'] || _0x47df29 < 0x0 || _0x47df29 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x47df29)
            return 0x0;
        const _0x34b29d = 0x1 << _0x47df29;
        if (this['_currentTurn']) {
            this['_o'] |= _0x34b29d;
        } else {
            this['_x'] |= _0x34b29d;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x549151, _0x5b57c0) => {
            const _0x58de6e = 0x1 << _0x5b57c0;
            return this['_x'] & _0x58de6e ? 'X' : this['_o'] & _0x58de6e ? 'O' : _0x5b57c0 + 0x1;
        });
    }
}
export default TicTacToe;