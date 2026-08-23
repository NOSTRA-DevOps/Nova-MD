import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x3f58b1, _0x3e9b85, _0x80db51, _0x26dfd3) {
    if (!_0x26dfd3) {
        return _0x3f58b1['sendMessage'](_0x3e9b85, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x80db51
        });
    }
    const [_0x528385, ..._0x45c991] = _0x26dfd3['split']('\x20');
    const _0x1ee5ec = _0x528385['toLowerCase']();
    const _0x57c370 = _0x45c991['join']('\x20');
    if (_0x1ee5ec === 'on') {
        if (await isWelcomeOn(_0x3e9b85)) {
            return _0x3f58b1['sendMessage'](_0x3e9b85, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x80db51
            });
        }
        await addWelcome(_0x3e9b85, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x3f58b1['sendMessage'](_0x3e9b85, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x80db51
        });
    }
    if (_0x1ee5ec === 'off') {
        if (!await isWelcomeOn(_0x3e9b85)) {
            return _0x3f58b1['sendMessage'](_0x3e9b85, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x80db51
            });
        }
        await delWelcome(_0x3e9b85);
        return _0x3f58b1['sendMessage'](_0x3e9b85, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x80db51
        });
    }
    if (_0x1ee5ec === 'set') {
        if (!_0x57c370) {
            return _0x3f58b1['sendMessage'](_0x3e9b85, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x80db51
            });
        }
        await addWelcome(_0x3e9b85, !![], _0x57c370);
        return _0x3f58b1['sendMessage'](_0x3e9b85, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x80db51
        });
    }
    return _0x3f58b1['sendMessage'](_0x3e9b85, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x80db51
    });
}
async function handleGoodbye(_0x35da9c, _0x150bff, _0x4e9f90, _0x4c4cb4) {
    const _0xfbdae6 = _0x4c4cb4?.['toLowerCase']();
    if (!_0x4c4cb4) {
        return _0x35da9c['sendMessage'](_0x150bff, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x4e9f90
        });
    }
    if (_0xfbdae6 === 'on') {
        if (await isGoodByeOn(_0x150bff)) {
            return _0x35da9c['sendMessage'](_0x150bff, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x4e9f90
            });
        }
        await addGoodbye(_0x150bff, !![], 'Goodbye\x20{user}\x20👋');
        return _0x35da9c['sendMessage'](_0x150bff, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x4e9f90
        });
    }
    if (_0xfbdae6 === 'off') {
        if (!await isGoodByeOn(_0x150bff)) {
            return _0x35da9c['sendMessage'](_0x150bff, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x4e9f90
            });
        }
        await delGoodBye(_0x150bff);
        return _0x35da9c['sendMessage'](_0x150bff, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x4e9f90
        });
    }
    if (_0xfbdae6['startsWith']('set\x20')) {
        const _0x39a08e = _0x4c4cb4['substring'](0x4);
        if (!_0x39a08e) {
            return _0x35da9c['sendMessage'](_0x150bff, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x4e9f90
            });
        }
        await addGoodbye(_0x150bff, !![], _0x39a08e);
        return _0x35da9c['sendMessage'](_0x150bff, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x4e9f90
        });
    }
    return _0x35da9c['sendMessage'](_0x150bff, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x4e9f90
    });
}
export {
    handleWelcome,
    handleGoodbye
};