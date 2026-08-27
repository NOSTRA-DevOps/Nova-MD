class TicTacToe {
    constructor(_0x5d9b2f = 'x', _0x295760 = 'o') {
        this['playerX'] = _0x5d9b2f;
        this['playerO'] = _0x295760;
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
        const _0x4a87aa = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x38e119 of _0x4a87aa) {
            if ((this['_x'] & _0x38e119) === _0x38e119) {
                return this['playerX'];
            }
        }
        for (const _0x327553 of _0x4a87aa) {
            if ((this['_o'] & _0x327553) === _0x327553) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x1ee1c5, _0x8c2e0c) {
        if (this['winner'] || _0x8c2e0c < 0x0 || _0x8c2e0c > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x8c2e0c)
            return 0x0;
        const _0x587e71 = 0x1 << _0x8c2e0c;
        if (this['_currentTurn']) {
            this['_o'] |= _0x587e71;
        } else {
            this['_x'] |= _0x587e71;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x54a022, _0x48008e) => {
            const _0x81eac3 = 0x1 << _0x48008e;
            return this['_x'] & _0x81eac3 ? 'X' : this['_o'] & _0x81eac3 ? 'O' : _0x48008e + 0x1;
        });
    }
}
export default TicTacToe;