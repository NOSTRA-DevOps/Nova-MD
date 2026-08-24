import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x571022, _0xf925c3, _0x55060d, _0x2dc00c) {
    if (!_0x2dc00c) {
        return _0x571022['sendMessage'](_0xf925c3, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x55060d
        });
    }
    const [_0x36c7ba, ..._0x30a070] = _0x2dc00c['split']('\x20');
    const _0x13beab = _0x36c7ba['toLowerCase']();
    const _0x4574a1 = _0x30a070['join']('\x20');
    if (_0x13beab === 'on') {
        if (await isWelcomeOn(_0xf925c3)) {
            return _0x571022['sendMessage'](_0xf925c3, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x55060d
            });
        }
        await addWelcome(_0xf925c3, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x571022['sendMessage'](_0xf925c3, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x55060d
        });
    }
    if (_0x13beab === 'off') {
        if (!await isWelcomeOn(_0xf925c3)) {
            return _0x571022['sendMessage'](_0xf925c3, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x55060d
            });
        }
        await delWelcome(_0xf925c3);
        return _0x571022['sendMessage'](_0xf925c3, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x55060d
        });
    }
    if (_0x13beab === 'set') {
        if (!_0x4574a1) {
            return _0x571022['sendMessage'](_0xf925c3, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x55060d
            });
        }
        await addWelcome(_0xf925c3, !![], _0x4574a1);
        return _0x571022['sendMessage'](_0xf925c3, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x55060d
        });
    }
    return _0x571022['sendMessage'](_0xf925c3, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x55060d
    });
}
async function handleGoodbye(_0x3f7c48, _0x439a79, _0x185839, _0x47b284) {
    const _0x93e67d = _0x47b284?.['toLowerCase']();
    if (!_0x47b284) {
        return _0x3f7c48['sendMessage'](_0x439a79, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x185839
        });
    }
    if (_0x93e67d === 'on') {
        if (await isGoodByeOn(_0x439a79)) {
            return _0x3f7c48['sendMessage'](_0x439a79, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x185839
            });
        }
        await addGoodbye(_0x439a79, !![], 'Goodbye\x20{user}\x20👋');
        return _0x3f7c48['sendMessage'](_0x439a79, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x185839
        });
    }
    if (_0x93e67d === 'off') {
        if (!await isGoodByeOn(_0x439a79)) {
            return _0x3f7c48['sendMessage'](_0x439a79, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x185839
            });
        }
        await delGoodBye(_0x439a79);
        return _0x3f7c48['sendMessage'](_0x439a79, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x185839
        });
    }
    if (_0x93e67d['startsWith']('set\x20')) {
        const _0x48975e = _0x47b284['substring'](0x4);
        if (!_0x48975e) {
            return _0x3f7c48['sendMessage'](_0x439a79, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x185839
            });
        }
        await addGoodbye(_0x439a79, !![], _0x48975e);
        return _0x3f7c48['sendMessage'](_0x439a79, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x185839
        });
    }
    return _0x3f7c48['sendMessage'](_0x439a79, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x185839
    });
}
export {
    handleWelcome,
    handleGoodbye
};