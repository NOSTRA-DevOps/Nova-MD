class TicTacToe {
    constructor(_0x5e5fb7 = 'x', _0x123fa8 = 'o') {
        this['playerX'] = _0x5e5fb7;
        this['playerO'] = _0x123fa8;
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
        const _0x3d2b98 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x4b4e54 of _0x3d2b98) {
            if ((this['_x'] & _0x4b4e54) === _0x4b4e54) {
                return this['playerX'];
            }
        }
        for (const _0x476874 of _0x3d2b98) {
            if ((this['_o'] & _0x476874) === _0x476874) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x173b1b, _0x7dd2a2) {
        if (this['winner'] || _0x7dd2a2 < 0x0 || _0x7dd2a2 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x7dd2a2)
            return 0x0;
        const _0xe34aeb = 0x1 << _0x7dd2a2;
        if (this['_currentTurn']) {
            this['_o'] |= _0xe34aeb;
        } else {
            this['_x'] |= _0xe34aeb;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x394b7e, _0x1b19d8) => {
            const _0x173fb0 = 0x1 << _0x1b19d8;
            return this['_x'] & _0x173fb0 ? 'X' : this['_o'] & _0x173fb0 ? 'O' : _0x1b19d8 + 0x1;
        });
    }
}
export default TicTacToe;