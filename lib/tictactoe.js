class TicTacToe {
    constructor(_0x5313f6 = 'x', _0x270c80 = 'o') {
        this['playerX'] = _0x5313f6;
        this['playerO'] = _0x270c80;
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
        const _0x20efa2 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x52ba3f of _0x20efa2) {
            if ((this['_x'] & _0x52ba3f) === _0x52ba3f) {
                return this['playerX'];
            }
        }
        for (const _0x2a105e of _0x20efa2) {
            if ((this['_o'] & _0x2a105e) === _0x2a105e) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x220294, _0x2ac6a1) {
        if (this['winner'] || _0x2ac6a1 < 0x0 || _0x2ac6a1 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x2ac6a1)
            return 0x0;
        const _0x24335f = 0x1 << _0x2ac6a1;
        if (this['_currentTurn']) {
            this['_o'] |= _0x24335f;
        } else {
            this['_x'] |= _0x24335f;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x4c010a, _0x27a27a) => {
            const _0x2c058e = 0x1 << _0x27a27a;
            return this['_x'] & _0x2c058e ? 'X' : this['_o'] & _0x2c058e ? 'O' : _0x27a27a + 0x1;
        });
    }
}
export default TicTacToe;