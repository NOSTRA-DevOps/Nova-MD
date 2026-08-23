import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x4c43d2, _0x5eaecf, _0x491465, _0x306fcb) {
    if (!_0x306fcb) {
        return _0x4c43d2['sendMessage'](_0x5eaecf, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x491465
        });
    }
    const [_0x4cbe8a, ..._0x1f2316] = _0x306fcb['split']('\x20');
    const _0x102e18 = _0x4cbe8a['toLowerCase']();
    const _0x310ad9 = _0x1f2316['join']('\x20');
    if (_0x102e18 === 'on') {
        if (await isWelcomeOn(_0x5eaecf)) {
            return _0x4c43d2['sendMessage'](_0x5eaecf, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x491465
            });
        }
        await addWelcome(_0x5eaecf, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x4c43d2['sendMessage'](_0x5eaecf, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x491465
        });
    }
    if (_0x102e18 === 'off') {
        if (!await isWelcomeOn(_0x5eaecf)) {
            return _0x4c43d2['sendMessage'](_0x5eaecf, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x491465
            });
        }
        await delWelcome(_0x5eaecf);
        return _0x4c43d2['sendMessage'](_0x5eaecf, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x491465
        });
    }
    if (_0x102e18 === 'set') {
        if (!_0x310ad9) {
            return _0x4c43d2['sendMessage'](_0x5eaecf, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x491465
            });
        }
        await addWelcome(_0x5eaecf, !![], _0x310ad9);
        return _0x4c43d2['sendMessage'](_0x5eaecf, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x491465
        });
    }
    return _0x4c43d2['sendMessage'](_0x5eaecf, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x491465
    });
}
async function handleGoodbye(_0x3f6387, _0xcf09b2, _0x1a0475, _0xe682ae) {
    const _0x215674 = _0xe682ae?.['toLowerCase']();
    if (!_0xe682ae) {
        return _0x3f6387['sendMessage'](_0xcf09b2, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x1a0475
        });
    }
    if (_0x215674 === 'on') {
        if (await isGoodByeOn(_0xcf09b2)) {
            return _0x3f6387['sendMessage'](_0xcf09b2, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x1a0475
            });
        }
        await addGoodbye(_0xcf09b2, !![], 'Goodbye\x20{user}\x20👋');
        return _0x3f6387['sendMessage'](_0xcf09b2, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x1a0475
        });
    }
    if (_0x215674 === 'off') {
        if (!await isGoodByeOn(_0xcf09b2)) {
            return _0x3f6387['sendMessage'](_0xcf09b2, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x1a0475
            });
        }
        await delGoodBye(_0xcf09b2);
        return _0x3f6387['sendMessage'](_0xcf09b2, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x1a0475
        });
    }
    if (_0x215674['startsWith']('set\x20')) {
        const _0x3c2c4a = _0xe682ae['substring'](0x4);
        if (!_0x3c2c4a) {
            return _0x3f6387['sendMessage'](_0xcf09b2, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x1a0475
            });
        }
        await addGoodbye(_0xcf09b2, !![], _0x3c2c4a);
        return _0x3f6387['sendMessage'](_0xcf09b2, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x1a0475
        });
    }
    return _0x3f6387['sendMessage'](_0xcf09b2, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x1a0475
    });
}
export {
    handleWelcome,
    handleGoodbye
};