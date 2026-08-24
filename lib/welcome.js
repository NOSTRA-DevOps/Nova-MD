import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0xcc6447, _0x3ac5a9, _0x2f9bfb, _0x37132c) {
    if (!_0x37132c) {
        return _0xcc6447['sendMessage'](_0x3ac5a9, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x2f9bfb
        });
    }
    const [_0x364aa4, ..._0x2395b1] = _0x37132c['split']('\x20');
    const _0x57e7a4 = _0x364aa4['toLowerCase']();
    const _0x231c5d = _0x2395b1['join']('\x20');
    if (_0x57e7a4 === 'on') {
        if (await isWelcomeOn(_0x3ac5a9)) {
            return _0xcc6447['sendMessage'](_0x3ac5a9, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x2f9bfb
            });
        }
        await addWelcome(_0x3ac5a9, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0xcc6447['sendMessage'](_0x3ac5a9, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x2f9bfb
        });
    }
    if (_0x57e7a4 === 'off') {
        if (!await isWelcomeOn(_0x3ac5a9)) {
            return _0xcc6447['sendMessage'](_0x3ac5a9, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x2f9bfb
            });
        }
        await delWelcome(_0x3ac5a9);
        return _0xcc6447['sendMessage'](_0x3ac5a9, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x2f9bfb
        });
    }
    if (_0x57e7a4 === 'set') {
        if (!_0x231c5d) {
            return _0xcc6447['sendMessage'](_0x3ac5a9, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x2f9bfb
            });
        }
        await addWelcome(_0x3ac5a9, !![], _0x231c5d);
        return _0xcc6447['sendMessage'](_0x3ac5a9, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x2f9bfb
        });
    }
    return _0xcc6447['sendMessage'](_0x3ac5a9, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x2f9bfb
    });
}
async function handleGoodbye(_0x23b1b4, _0xdf9960, _0x11e752, _0x212a81) {
    const _0x3fb03e = _0x212a81?.['toLowerCase']();
    if (!_0x212a81) {
        return _0x23b1b4['sendMessage'](_0xdf9960, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x11e752
        });
    }
    if (_0x3fb03e === 'on') {
        if (await isGoodByeOn(_0xdf9960)) {
            return _0x23b1b4['sendMessage'](_0xdf9960, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x11e752
            });
        }
        await addGoodbye(_0xdf9960, !![], 'Goodbye\x20{user}\x20👋');
        return _0x23b1b4['sendMessage'](_0xdf9960, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x11e752
        });
    }
    if (_0x3fb03e === 'off') {
        if (!await isGoodByeOn(_0xdf9960)) {
            return _0x23b1b4['sendMessage'](_0xdf9960, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x11e752
            });
        }
        await delGoodBye(_0xdf9960);
        return _0x23b1b4['sendMessage'](_0xdf9960, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x11e752
        });
    }
    if (_0x3fb03e['startsWith']('set\x20')) {
        const _0x56e840 = _0x212a81['substring'](0x4);
        if (!_0x56e840) {
            return _0x23b1b4['sendMessage'](_0xdf9960, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x11e752
            });
        }
        await addGoodbye(_0xdf9960, !![], _0x56e840);
        return _0x23b1b4['sendMessage'](_0xdf9960, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x11e752
        });
    }
    return _0x23b1b4['sendMessage'](_0xdf9960, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x11e752
    });
}
export {
    handleWelcome,
    handleGoodbye
};