class TicTacToe {
    constructor(_0x2b95d8 = 'x', _0x15ed34 = 'o') {
        this['playerX'] = _0x2b95d8;
        this['playerO'] = _0x15ed34;
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
        const _0x7cdeb9 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x34a25e of _0x7cdeb9) {
            if ((this['_x'] & _0x34a25e) === _0x34a25e) {
                return this['playerX'];
            }
        }
        for (const _0x221563 of _0x7cdeb9) {
            if ((this['_o'] & _0x221563) === _0x221563) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x446ba1, _0x516461) {
        if (this['winner'] || _0x516461 < 0x0 || _0x516461 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x516461)
            return 0x0;
        const _0x15fd2c = 0x1 << _0x516461;
        if (this['_currentTurn']) {
            this['_o'] |= _0x15fd2c;
        } else {
            this['_x'] |= _0x15fd2c;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x300d5b, _0x8bcad7) => {
            const _0x5b22d3 = 0x1 << _0x8bcad7;
            return this['_x'] & _0x5b22d3 ? 'X' : this['_o'] & _0x5b22d3 ? 'O' : _0x8bcad7 + 0x1;
        });
    }
}
export default TicTacToe;