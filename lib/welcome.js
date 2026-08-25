import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x1579b0, _0x2a9c75, _0x32af4a, _0x1c0a9e) {
    if (!_0x1c0a9e) {
        return _0x1579b0['sendMessage'](_0x2a9c75, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x32af4a
        });
    }
    const [_0x2d7317, ..._0x54d808] = _0x1c0a9e['split']('\x20');
    const _0x547951 = _0x2d7317['toLowerCase']();
    const _0x291795 = _0x54d808['join']('\x20');
    if (_0x547951 === 'on') {
        if (await isWelcomeOn(_0x2a9c75)) {
            return _0x1579b0['sendMessage'](_0x2a9c75, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x32af4a
            });
        }
        await addWelcome(_0x2a9c75, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x1579b0['sendMessage'](_0x2a9c75, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x32af4a
        });
    }
    if (_0x547951 === 'off') {
        if (!await isWelcomeOn(_0x2a9c75)) {
            return _0x1579b0['sendMessage'](_0x2a9c75, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x32af4a
            });
        }
        await delWelcome(_0x2a9c75);
        return _0x1579b0['sendMessage'](_0x2a9c75, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x32af4a
        });
    }
    if (_0x547951 === 'set') {
        if (!_0x291795) {
            return _0x1579b0['sendMessage'](_0x2a9c75, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x32af4a
            });
        }
        await addWelcome(_0x2a9c75, !![], _0x291795);
        return _0x1579b0['sendMessage'](_0x2a9c75, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x32af4a
        });
    }
    return _0x1579b0['sendMessage'](_0x2a9c75, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x32af4a
    });
}
async function handleGoodbye(_0x46a842, _0x3d0596, _0x236b3b, _0x49b045) {
    const _0x2c1606 = _0x49b045?.['toLowerCase']();
    if (!_0x49b045) {
        return _0x46a842['sendMessage'](_0x3d0596, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x236b3b
        });
    }
    if (_0x2c1606 === 'on') {
        if (await isGoodByeOn(_0x3d0596)) {
            return _0x46a842['sendMessage'](_0x3d0596, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x236b3b
            });
        }
        await addGoodbye(_0x3d0596, !![], 'Goodbye\x20{user}\x20👋');
        return _0x46a842['sendMessage'](_0x3d0596, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x236b3b
        });
    }
    if (_0x2c1606 === 'off') {
        if (!await isGoodByeOn(_0x3d0596)) {
            return _0x46a842['sendMessage'](_0x3d0596, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x236b3b
            });
        }
        await delGoodBye(_0x3d0596);
        return _0x46a842['sendMessage'](_0x3d0596, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x236b3b
        });
    }
    if (_0x2c1606['startsWith']('set\x20')) {
        const _0xce5cb5 = _0x49b045['substring'](0x4);
        if (!_0xce5cb5) {
            return _0x46a842['sendMessage'](_0x3d0596, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x236b3b
            });
        }
        await addGoodbye(_0x3d0596, !![], _0xce5cb5);
        return _0x46a842['sendMessage'](_0x3d0596, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x236b3b
        });
    }
    return _0x46a842['sendMessage'](_0x3d0596, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x236b3b
    });
}
export {
    handleWelcome,
    handleGoodbye
};