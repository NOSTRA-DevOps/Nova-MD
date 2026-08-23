class TicTacToe {
    constructor(_0x760d07 = 'x', _0x1ae2d = 'o') {
        this['playerX'] = _0x760d07;
        this['playerO'] = _0x1ae2d;
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
        const _0x3e9731 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x29fab4 of _0x3e9731) {
            if ((this['_x'] & _0x29fab4) === _0x29fab4) {
                return this['playerX'];
            }
        }
        for (const _0x554320 of _0x3e9731) {
            if ((this['_o'] & _0x554320) === _0x554320) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x4c783a, _0x8d296e) {
        if (this['winner'] || _0x8d296e < 0x0 || _0x8d296e > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x8d296e)
            return 0x0;
        const _0x55eedf = 0x1 << _0x8d296e;
        if (this['_currentTurn']) {
            this['_o'] |= _0x55eedf;
        } else {
            this['_x'] |= _0x55eedf;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x550400, _0x57c9f7) => {
            const _0x61d404 = 0x1 << _0x57c9f7;
            return this['_x'] & _0x61d404 ? 'X' : this['_o'] & _0x61d404 ? 'O' : _0x57c9f7 + 0x1;
        });
    }
}
export default TicTacToe;