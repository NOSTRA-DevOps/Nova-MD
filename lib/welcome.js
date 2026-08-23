import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x2bf965, _0x5e2cc6, _0xfe1f57, _0x308825) {
    if (!_0x308825) {
        return _0x2bf965['sendMessage'](_0x5e2cc6, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0xfe1f57
        });
    }
    const [_0x472c4c, ..._0x41596d] = _0x308825['split']('\x20');
    const _0xbfec00 = _0x472c4c['toLowerCase']();
    const _0x3a49a1 = _0x41596d['join']('\x20');
    if (_0xbfec00 === 'on') {
        if (await isWelcomeOn(_0x5e2cc6)) {
            return _0x2bf965['sendMessage'](_0x5e2cc6, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0xfe1f57
            });
        }
        await addWelcome(_0x5e2cc6, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x2bf965['sendMessage'](_0x5e2cc6, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0xfe1f57
        });
    }
    if (_0xbfec00 === 'off') {
        if (!await isWelcomeOn(_0x5e2cc6)) {
            return _0x2bf965['sendMessage'](_0x5e2cc6, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0xfe1f57
            });
        }
        await delWelcome(_0x5e2cc6);
        return _0x2bf965['sendMessage'](_0x5e2cc6, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0xfe1f57
        });
    }
    if (_0xbfec00 === 'set') {
        if (!_0x3a49a1) {
            return _0x2bf965['sendMessage'](_0x5e2cc6, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0xfe1f57
            });
        }
        await addWelcome(_0x5e2cc6, !![], _0x3a49a1);
        return _0x2bf965['sendMessage'](_0x5e2cc6, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0xfe1f57
        });
    }
    return _0x2bf965['sendMessage'](_0x5e2cc6, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0xfe1f57
    });
}
async function handleGoodbye(_0x127c38, _0x3021f0, _0x58281d, _0x35a59f) {
    const _0x1032ec = _0x35a59f?.['toLowerCase']();
    if (!_0x35a59f) {
        return _0x127c38['sendMessage'](_0x3021f0, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x58281d
        });
    }
    if (_0x1032ec === 'on') {
        if (await isGoodByeOn(_0x3021f0)) {
            return _0x127c38['sendMessage'](_0x3021f0, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x58281d
            });
        }
        await addGoodbye(_0x3021f0, !![], 'Goodbye\x20{user}\x20👋');
        return _0x127c38['sendMessage'](_0x3021f0, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x58281d
        });
    }
    if (_0x1032ec === 'off') {
        if (!await isGoodByeOn(_0x3021f0)) {
            return _0x127c38['sendMessage'](_0x3021f0, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x58281d
            });
        }
        await delGoodBye(_0x3021f0);
        return _0x127c38['sendMessage'](_0x3021f0, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x58281d
        });
    }
    if (_0x1032ec['startsWith']('set\x20')) {
        const _0x316e11 = _0x35a59f['substring'](0x4);
        if (!_0x316e11) {
            return _0x127c38['sendMessage'](_0x3021f0, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x58281d
            });
        }
        await addGoodbye(_0x3021f0, !![], _0x316e11);
        return _0x127c38['sendMessage'](_0x3021f0, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x58281d
        });
    }
    return _0x127c38['sendMessage'](_0x3021f0, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x58281d
    });
}
export {
    handleWelcome,
    handleGoodbye
};