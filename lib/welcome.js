import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x2926c2, _0x13d76e, _0xac6277, _0x36443e) {
    if (!_0x36443e) {
        return _0x2926c2['sendMessage'](_0x13d76e, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0xac6277
        });
    }
    const [_0x13c63e, ..._0xe1e80c] = _0x36443e['split']('\x20');
    const _0x9003cf = _0x13c63e['toLowerCase']();
    const _0x3a2695 = _0xe1e80c['join']('\x20');
    if (_0x9003cf === 'on') {
        if (await isWelcomeOn(_0x13d76e)) {
            return _0x2926c2['sendMessage'](_0x13d76e, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0xac6277
            });
        }
        await addWelcome(_0x13d76e, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x2926c2['sendMessage'](_0x13d76e, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0xac6277
        });
    }
    if (_0x9003cf === 'off') {
        if (!await isWelcomeOn(_0x13d76e)) {
            return _0x2926c2['sendMessage'](_0x13d76e, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0xac6277
            });
        }
        await delWelcome(_0x13d76e);
        return _0x2926c2['sendMessage'](_0x13d76e, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0xac6277
        });
    }
    if (_0x9003cf === 'set') {
        if (!_0x3a2695) {
            return _0x2926c2['sendMessage'](_0x13d76e, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0xac6277
            });
        }
        await addWelcome(_0x13d76e, !![], _0x3a2695);
        return _0x2926c2['sendMessage'](_0x13d76e, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0xac6277
        });
    }
    return _0x2926c2['sendMessage'](_0x13d76e, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0xac6277
    });
}
async function handleGoodbye(_0x15094, _0x5c99a7, _0x5ca243, _0x38818c) {
    const _0x1f4a47 = _0x38818c?.['toLowerCase']();
    if (!_0x38818c) {
        return _0x15094['sendMessage'](_0x5c99a7, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x5ca243
        });
    }
    if (_0x1f4a47 === 'on') {
        if (await isGoodByeOn(_0x5c99a7)) {
            return _0x15094['sendMessage'](_0x5c99a7, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x5ca243
            });
        }
        await addGoodbye(_0x5c99a7, !![], 'Goodbye\x20{user}\x20👋');
        return _0x15094['sendMessage'](_0x5c99a7, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x5ca243
        });
    }
    if (_0x1f4a47 === 'off') {
        if (!await isGoodByeOn(_0x5c99a7)) {
            return _0x15094['sendMessage'](_0x5c99a7, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x5ca243
            });
        }
        await delGoodBye(_0x5c99a7);
        return _0x15094['sendMessage'](_0x5c99a7, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x5ca243
        });
    }
    if (_0x1f4a47['startsWith']('set\x20')) {
        const _0x303990 = _0x38818c['substring'](0x4);
        if (!_0x303990) {
            return _0x15094['sendMessage'](_0x5c99a7, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x5ca243
            });
        }
        await addGoodbye(_0x5c99a7, !![], _0x303990);
        return _0x15094['sendMessage'](_0x5c99a7, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x5ca243
        });
    }
    return _0x15094['sendMessage'](_0x5c99a7, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x5ca243
    });
}
export {
    handleWelcome,
    handleGoodbye
};