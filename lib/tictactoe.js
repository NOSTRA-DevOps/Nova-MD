class TicTacToe {
    constructor(_0x53c0ec = 'x', _0x59740 = 'o') {
        this['playerX'] = _0x53c0ec;
        this['playerO'] = _0x59740;
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
        const _0x338350 = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x24f423 of _0x338350) {
            if ((this['_x'] & _0x24f423) === _0x24f423) {
                return this['playerX'];
            }
        }
        for (const _0x3050c4 of _0x338350) {
            if ((this['_o'] & _0x3050c4) === _0x3050c4) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0xd04b2b, _0x32e873) {
        if (this['winner'] || _0x32e873 < 0x0 || _0x32e873 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x32e873)
            return 0x0;
        const _0x2d379d = 0x1 << _0x32e873;
        if (this['_currentTurn']) {
            this['_o'] |= _0x2d379d;
        } else {
            this['_x'] |= _0x2d379d;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x3b4616, _0x3d6511) => {
            const _0x439fd3 = 0x1 << _0x3d6511;
            return this['_x'] & _0x439fd3 ? 'X' : this['_o'] & _0x439fd3 ? 'O' : _0x3d6511 + 0x1;
        });
    }
}
export default TicTacToe;