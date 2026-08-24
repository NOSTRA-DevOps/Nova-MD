import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x331dbb, _0x4eca2f, _0x4e54d8, _0x2dbc29) {
    if (!_0x2dbc29) {
        return _0x331dbb['sendMessage'](_0x4eca2f, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x4e54d8
        });
    }
    const [_0x415ee7, ..._0xf1664d] = _0x2dbc29['split']('\x20');
    const _0x3d0bb9 = _0x415ee7['toLowerCase']();
    const _0xc0fe5e = _0xf1664d['join']('\x20');
    if (_0x3d0bb9 === 'on') {
        if (await isWelcomeOn(_0x4eca2f)) {
            return _0x331dbb['sendMessage'](_0x4eca2f, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x4e54d8
            });
        }
        await addWelcome(_0x4eca2f, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x331dbb['sendMessage'](_0x4eca2f, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x4e54d8
        });
    }
    if (_0x3d0bb9 === 'off') {
        if (!await isWelcomeOn(_0x4eca2f)) {
            return _0x331dbb['sendMessage'](_0x4eca2f, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x4e54d8
            });
        }
        await delWelcome(_0x4eca2f);
        return _0x331dbb['sendMessage'](_0x4eca2f, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x4e54d8
        });
    }
    if (_0x3d0bb9 === 'set') {
        if (!_0xc0fe5e) {
            return _0x331dbb['sendMessage'](_0x4eca2f, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x4e54d8
            });
        }
        await addWelcome(_0x4eca2f, !![], _0xc0fe5e);
        return _0x331dbb['sendMessage'](_0x4eca2f, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x4e54d8
        });
    }
    return _0x331dbb['sendMessage'](_0x4eca2f, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x4e54d8
    });
}
async function handleGoodbye(_0x2858f3, _0x386512, _0x2a12f7, _0x20ee99) {
    const _0x41cbb8 = _0x20ee99?.['toLowerCase']();
    if (!_0x20ee99) {
        return _0x2858f3['sendMessage'](_0x386512, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x2a12f7
        });
    }
    if (_0x41cbb8 === 'on') {
        if (await isGoodByeOn(_0x386512)) {
            return _0x2858f3['sendMessage'](_0x386512, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x2a12f7
            });
        }
        await addGoodbye(_0x386512, !![], 'Goodbye\x20{user}\x20👋');
        return _0x2858f3['sendMessage'](_0x386512, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x2a12f7
        });
    }
    if (_0x41cbb8 === 'off') {
        if (!await isGoodByeOn(_0x386512)) {
            return _0x2858f3['sendMessage'](_0x386512, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x2a12f7
            });
        }
        await delGoodBye(_0x386512);
        return _0x2858f3['sendMessage'](_0x386512, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x2a12f7
        });
    }
    if (_0x41cbb8['startsWith']('set\x20')) {
        const _0x5e6374 = _0x20ee99['substring'](0x4);
        if (!_0x5e6374) {
            return _0x2858f3['sendMessage'](_0x386512, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x2a12f7
            });
        }
        await addGoodbye(_0x386512, !![], _0x5e6374);
        return _0x2858f3['sendMessage'](_0x386512, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x2a12f7
        });
    }
    return _0x2858f3['sendMessage'](_0x386512, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x2a12f7
    });
}
export {
    handleWelcome,
    handleGoodbye
};