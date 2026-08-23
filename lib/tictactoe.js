class TicTacToe {
    constructor(_0x33ff31 = 'x', _0x2b8e00 = 'o') {
        this['playerX'] = _0x33ff31;
        this['playerO'] = _0x2b8e00;
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
        const _0x41664c = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x5eaf94 of _0x41664c) {
            if ((this['_x'] & _0x5eaf94) === _0x5eaf94) {
                return this['playerX'];
            }
        }
        for (const _0x2336fd of _0x41664c) {
            if ((this['_o'] & _0x2336fd) === _0x2336fd) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0xe2eb5f, _0x22441c) {
        if (this['winner'] || _0x22441c < 0x0 || _0x22441c > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x22441c)
            return 0x0;
        const _0x36fa81 = 0x1 << _0x22441c;
        if (this['_currentTurn']) {
            this['_o'] |= _0x36fa81;
        } else {
            this['_x'] |= _0x36fa81;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x35aeda, _0x532940) => {
            const _0xfdfeab = 0x1 << _0x532940;
            return this['_x'] & _0xfdfeab ? 'X' : this['_o'] & _0xfdfeab ? 'O' : _0x532940 + 0x1;
        });
    }
}
export default TicTacToe;