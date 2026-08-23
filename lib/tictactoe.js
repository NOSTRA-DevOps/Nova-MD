class TicTacToe {
    constructor(_0x525539 = 'x', _0x3afff4 = 'o') {
        this['playerX'] = _0x525539;
        this['playerO'] = _0x3afff4;
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
        const _0x452414 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x8b7adb of _0x452414) {
            if ((this['_x'] & _0x8b7adb) === _0x8b7adb) {
                return this['playerX'];
            }
        }
        for (const _0x12b94a of _0x452414) {
            if ((this['_o'] & _0x12b94a) === _0x12b94a) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x6b50f4, _0x1b1c73) {
        if (this['winner'] || _0x1b1c73 < 0x0 || _0x1b1c73 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x1b1c73)
            return 0x0;
        const _0x14f5ab = 0x1 << _0x1b1c73;
        if (this['_currentTurn']) {
            this['_o'] |= _0x14f5ab;
        } else {
            this['_x'] |= _0x14f5ab;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x4c6ede, _0x5b6fad) => {
            const _0x1133ca = 0x1 << _0x5b6fad;
            return this['_x'] & _0x1133ca ? 'X' : this['_o'] & _0x1133ca ? 'O' : _0x5b6fad + 0x1;
        });
    }
}
export default TicTacToe;