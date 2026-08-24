class TicTacToe {
    constructor(_0x4ca276 = 'x', _0x4c270b = 'o') {
        this['playerX'] = _0x4ca276;
        this['playerO'] = _0x4c270b;
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
        const _0x29e921 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x3acf94 of _0x29e921) {
            if ((this['_x'] & _0x3acf94) === _0x3acf94) {
                return this['playerX'];
            }
        }
        for (const _0x3c6407 of _0x29e921) {
            if ((this['_o'] & _0x3c6407) === _0x3c6407) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x43e9d6, _0x1a6e4f) {
        if (this['winner'] || _0x1a6e4f < 0x0 || _0x1a6e4f > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x1a6e4f)
            return 0x0;
        const _0x473fcb = 0x1 << _0x1a6e4f;
        if (this['_currentTurn']) {
            this['_o'] |= _0x473fcb;
        } else {
            this['_x'] |= _0x473fcb;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x45791c, _0x460688) => {
            const _0x26cd50 = 0x1 << _0x460688;
            return this['_x'] & _0x26cd50 ? 'X' : this['_o'] & _0x26cd50 ? 'O' : _0x460688 + 0x1;
        });
    }
}
export default TicTacToe;