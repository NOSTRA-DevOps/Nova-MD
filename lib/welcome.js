import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x69e30f, _0x9d2d7c, _0x351fb8, _0x3c1335) {
    if (!_0x3c1335) {
        return _0x69e30f['sendMessage'](_0x9d2d7c, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x351fb8
        });
    }
    const [_0x4c16c5, ..._0x35d944] = _0x3c1335['split']('\x20');
    const _0x1c6918 = _0x4c16c5['toLowerCase']();
    const _0x508c59 = _0x35d944['join']('\x20');
    if (_0x1c6918 === 'on') {
        if (await isWelcomeOn(_0x9d2d7c)) {
            return _0x69e30f['sendMessage'](_0x9d2d7c, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x351fb8
            });
        }
        await addWelcome(_0x9d2d7c, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x69e30f['sendMessage'](_0x9d2d7c, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x351fb8
        });
    }
    if (_0x1c6918 === 'off') {
        if (!await isWelcomeOn(_0x9d2d7c)) {
            return _0x69e30f['sendMessage'](_0x9d2d7c, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x351fb8
            });
        }
        await delWelcome(_0x9d2d7c);
        return _0x69e30f['sendMessage'](_0x9d2d7c, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x351fb8
        });
    }
    if (_0x1c6918 === 'set') {
        if (!_0x508c59) {
            return _0x69e30f['sendMessage'](_0x9d2d7c, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x351fb8
            });
        }
        await addWelcome(_0x9d2d7c, !![], _0x508c59);
        return _0x69e30f['sendMessage'](_0x9d2d7c, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x351fb8
        });
    }
    return _0x69e30f['sendMessage'](_0x9d2d7c, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x351fb8
    });
}
async function handleGoodbye(_0x50a2a3, _0x195c08, _0x164458, _0x214a42) {
    const _0x300054 = _0x214a42?.['toLowerCase']();
    if (!_0x214a42) {
        return _0x50a2a3['sendMessage'](_0x195c08, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x164458
        });
    }
    if (_0x300054 === 'on') {
        if (await isGoodByeOn(_0x195c08)) {
            return _0x50a2a3['sendMessage'](_0x195c08, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x164458
            });
        }
        await addGoodbye(_0x195c08, !![], 'Goodbye\x20{user}\x20👋');
        return _0x50a2a3['sendMessage'](_0x195c08, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x164458
        });
    }
    if (_0x300054 === 'off') {
        if (!await isGoodByeOn(_0x195c08)) {
            return _0x50a2a3['sendMessage'](_0x195c08, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x164458
            });
        }
        await delGoodBye(_0x195c08);
        return _0x50a2a3['sendMessage'](_0x195c08, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x164458
        });
    }
    if (_0x300054['startsWith']('set\x20')) {
        const _0x4badde = _0x214a42['substring'](0x4);
        if (!_0x4badde) {
            return _0x50a2a3['sendMessage'](_0x195c08, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x164458
            });
        }
        await addGoodbye(_0x195c08, !![], _0x4badde);
        return _0x50a2a3['sendMessage'](_0x195c08, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x164458
        });
    }
    return _0x50a2a3['sendMessage'](_0x195c08, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x164458
    });
}
export {
    handleWelcome,
    handleGoodbye
};