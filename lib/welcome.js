import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x5c6424, _0xee9b05, _0x11f2ae, _0x4cb5b2) {
    if (!_0x4cb5b2) {
        return _0x5c6424['sendMessage'](_0xee9b05, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x11f2ae
        });
    }
    const [_0x3f541f, ..._0x5303aa] = _0x4cb5b2['split']('\x20');
    const _0x553d2a = _0x3f541f['toLowerCase']();
    const _0xc14126 = _0x5303aa['join']('\x20');
    if (_0x553d2a === 'on') {
        if (await isWelcomeOn(_0xee9b05)) {
            return _0x5c6424['sendMessage'](_0xee9b05, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x11f2ae
            });
        }
        await addWelcome(_0xee9b05, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x5c6424['sendMessage'](_0xee9b05, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x11f2ae
        });
    }
    if (_0x553d2a === 'off') {
        if (!await isWelcomeOn(_0xee9b05)) {
            return _0x5c6424['sendMessage'](_0xee9b05, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x11f2ae
            });
        }
        await delWelcome(_0xee9b05);
        return _0x5c6424['sendMessage'](_0xee9b05, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x11f2ae
        });
    }
    if (_0x553d2a === 'set') {
        if (!_0xc14126) {
            return _0x5c6424['sendMessage'](_0xee9b05, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x11f2ae
            });
        }
        await addWelcome(_0xee9b05, !![], _0xc14126);
        return _0x5c6424['sendMessage'](_0xee9b05, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x11f2ae
        });
    }
    return _0x5c6424['sendMessage'](_0xee9b05, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x11f2ae
    });
}
async function handleGoodbye(_0x4a7c8b, _0x7c35df, _0x3793de, _0x1689a7) {
    const _0x37e721 = _0x1689a7?.['toLowerCase']();
    if (!_0x1689a7) {
        return _0x4a7c8b['sendMessage'](_0x7c35df, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x3793de
        });
    }
    if (_0x37e721 === 'on') {
        if (await isGoodByeOn(_0x7c35df)) {
            return _0x4a7c8b['sendMessage'](_0x7c35df, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x3793de
            });
        }
        await addGoodbye(_0x7c35df, !![], 'Goodbye\x20{user}\x20👋');
        return _0x4a7c8b['sendMessage'](_0x7c35df, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x3793de
        });
    }
    if (_0x37e721 === 'off') {
        if (!await isGoodByeOn(_0x7c35df)) {
            return _0x4a7c8b['sendMessage'](_0x7c35df, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x3793de
            });
        }
        await delGoodBye(_0x7c35df);
        return _0x4a7c8b['sendMessage'](_0x7c35df, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x3793de
        });
    }
    if (_0x37e721['startsWith']('set\x20')) {
        const _0x3ad079 = _0x1689a7['substring'](0x4);
        if (!_0x3ad079) {
            return _0x4a7c8b['sendMessage'](_0x7c35df, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x3793de
            });
        }
        await addGoodbye(_0x7c35df, !![], _0x3ad079);
        return _0x4a7c8b['sendMessage'](_0x7c35df, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x3793de
        });
    }
    return _0x4a7c8b['sendMessage'](_0x7c35df, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x3793de
    });
}
export {
    handleWelcome,
    handleGoodbye
};