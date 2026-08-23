class TicTacToe {
    constructor(_0x12da39 = 'x', _0x1bcfd = 'o') {
        this['playerX'] = _0x12da39;
        this['playerO'] = _0x1bcfd;
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
        const _0xeed380 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x1c0039 of _0xeed380) {
            if ((this['_x'] & _0x1c0039) === _0x1c0039) {
                return this['playerX'];
            }
        }
        for (const _0x54bded of _0xeed380) {
            if ((this['_o'] & _0x54bded) === _0x54bded) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x5cd7d0, _0x4db1aa) {
        if (this['winner'] || _0x4db1aa < 0x0 || _0x4db1aa > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x4db1aa)
            return 0x0;
        const _0x5e7379 = 0x1 << _0x4db1aa;
        if (this['_currentTurn']) {
            this['_o'] |= _0x5e7379;
        } else {
            this['_x'] |= _0x5e7379;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x33c302, _0x2f4089) => {
            const _0x373c71 = 0x1 << _0x2f4089;
            return this['_x'] & _0x373c71 ? 'X' : this['_o'] & _0x373c71 ? 'O' : _0x2f4089 + 0x1;
        });
    }
}
export default TicTacToe;