class TicTacToe {
    constructor(_0x9d5dca = 'x', _0x583bb2 = 'o') {
        this['playerX'] = _0x9d5dca;
        this['playerO'] = _0x583bb2;
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
        const _0x55a552 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x4ff956 of _0x55a552) {
            if ((this['_x'] & _0x4ff956) === _0x4ff956) {
                return this['playerX'];
            }
        }
        for (const _0x5f30c8 of _0x55a552) {
            if ((this['_o'] & _0x5f30c8) === _0x5f30c8) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x138684, _0x4bd271) {
        if (this['winner'] || _0x4bd271 < 0x0 || _0x4bd271 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x4bd271)
            return 0x0;
        const _0x1e7bcd = 0x1 << _0x4bd271;
        if (this['_currentTurn']) {
            this['_o'] |= _0x1e7bcd;
        } else {
            this['_x'] |= _0x1e7bcd;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x583a77, _0x4b206b) => {
            const _0x496126 = 0x1 << _0x4b206b;
            return this['_x'] & _0x496126 ? 'X' : this['_o'] & _0x496126 ? 'O' : _0x4b206b + 0x1;
        });
    }
}
export default TicTacToe;