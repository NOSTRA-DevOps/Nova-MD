class TicTacToe {
    constructor(_0x4e789b = 'x', _0x162604 = 'o') {
        this['playerX'] = _0x4e789b;
        this['playerO'] = _0x162604;
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
        const _0x2a7824 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x4bc18d of _0x2a7824) {
            if ((this['_x'] & _0x4bc18d) === _0x4bc18d) {
                return this['playerX'];
            }
        }
        for (const _0x192f53 of _0x2a7824) {
            if ((this['_o'] & _0x192f53) === _0x192f53) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x11b70d, _0x13f9d2) {
        if (this['winner'] || _0x13f9d2 < 0x0 || _0x13f9d2 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x13f9d2)
            return 0x0;
        const _0x5bf0c8 = 0x1 << _0x13f9d2;
        if (this['_currentTurn']) {
            this['_o'] |= _0x5bf0c8;
        } else {
            this['_x'] |= _0x5bf0c8;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0xa0df8a, _0x5aae7b) => {
            const _0x1fa603 = 0x1 << _0x5aae7b;
            return this['_x'] & _0x1fa603 ? 'X' : this['_o'] & _0x1fa603 ? 'O' : _0x5aae7b + 0x1;
        });
    }
}
export default TicTacToe;