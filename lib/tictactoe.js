class TicTacToe {
    constructor(_0x5e83a3 = 'x', _0x2d002f = 'o') {
        this['playerX'] = _0x5e83a3;
        this['playerO'] = _0x2d002f;
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
        const _0x2335d3 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x4ac242 of _0x2335d3) {
            if ((this['_x'] & _0x4ac242) === _0x4ac242) {
                return this['playerX'];
            }
        }
        for (const _0x1cf1fc of _0x2335d3) {
            if ((this['_o'] & _0x1cf1fc) === _0x1cf1fc) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x40ef18, _0x2fd8f9) {
        if (this['winner'] || _0x2fd8f9 < 0x0 || _0x2fd8f9 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x2fd8f9)
            return 0x0;
        const _0x51668b = 0x1 << _0x2fd8f9;
        if (this['_currentTurn']) {
            this['_o'] |= _0x51668b;
        } else {
            this['_x'] |= _0x51668b;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x116f6b, _0x395da1) => {
            const _0x3bc187 = 0x1 << _0x395da1;
            return this['_x'] & _0x3bc187 ? 'X' : this['_o'] & _0x3bc187 ? 'O' : _0x395da1 + 0x1;
        });
    }
}
export default TicTacToe;