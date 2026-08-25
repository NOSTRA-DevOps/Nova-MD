class TicTacToe {
    constructor(_0x5b249c = 'x', _0x544360 = 'o') {
        this['playerX'] = _0x5b249c;
        this['playerO'] = _0x544360;
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
        const _0x99b00c = [
            0x1c0,
            0x38,
            0x7,
            0x124,
            0x92,
            0x49,
            0x111,
            0x54
        ];
        for (const _0x5a16ad of _0x99b00c) {
            if ((this['_x'] & _0x5a16ad) === _0x5a16ad) {
                return this['playerX'];
            }
        }
        for (const _0x4723c2 of _0x99b00c) {
            if ((this['_o'] & _0x4723c2) === _0x4723c2) {
                return this['playerO'];
            }
        }
        return null;
    }
    ['turn'](_0x3d077e, _0x236dc5) {
        if (this['winner'] || _0x236dc5 < 0x0 || _0x236dc5 > 0x8)
            return -0x1;
        if ((this['_x'] | this['_o']) & 0x1 << _0x236dc5)
            return 0x0;
        const _0x5e00cd = 0x1 << _0x236dc5;
        if (this['_currentTurn']) {
            this['_o'] |= _0x5e00cd;
        } else {
            this['_x'] |= _0x5e00cd;
        }
        this['_currentTurn'] = !this['_currentTurn'];
        this['turns']++;
        return 0x1;
    }
    ['render']() {
        return [...Array(0x9)]['map']((_0x4bdce8, _0x391059) => {
            const _0x150c53 = 0x1 << _0x391059;
            return this['_x'] & _0x150c53 ? 'X' : this['_o'] & _0x150c53 ? 'O' : _0x391059 + 0x1;
        });
    }
}
export default TicTacToe;