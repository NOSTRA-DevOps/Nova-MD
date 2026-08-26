class TicTacToe {
    constructor(_0x87c3d3 = 'x', _0x387ede = 'o') {
        this['playerX'] = _0x87c3d3;
        this['playerO'] = _0x387ede;
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
        const _0x207adb = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x2bbb89 of _0x207adb) {
            if ((this['_x'] & _0x2bbb89) === _0x2bbb89) {
                return this['playerX'];
            }
        }
        for (const _0x69042d of _0x207adb) {
            if ((this['_o'] & _0x69042d) === _0x69042d) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x5ab0e2, _0x1feb45) {
        if (this['winner'] || _0x1feb45 < 0x0 || _0x1feb45 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x1feb45)
            return 0x0;
        const _0x1ea3f3 = 0x1 << _0x1feb45;
        if (this['_currentTurn']) {
            this['_o'] |= _0x1ea3f3;
        } else {
            this['_x'] |= _0x1ea3f3;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0xc01489, _0x3b9236) => {
            const _0x10d227 = 0x1 << _0x3b9236;
            return this['_x'] & _0x10d227 ? 'X' : this['_o'] & _0x10d227 ? 'O' : _0x3b9236 + 0x1;
        });
    }
}
export default TicTacToe;