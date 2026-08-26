import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x3b09b7, _0x24de0a, _0x57c39a, _0x314fd4) {
    if (!_0x314fd4) {
        return _0x3b09b7['sendMessage'](_0x24de0a, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x57c39a
        });
    }
    const [_0x2d5ef7, ..._0x45eadc] = _0x314fd4['split']('\x20');
    const _0x4deea2 = _0x2d5ef7['toLowerCase']();
    const _0x3c5db4 = _0x45eadc['join']('\x20');
    if (_0x4deea2 === 'on') {
        if (await isWelcomeOn(_0x24de0a)) {
            return _0x3b09b7['sendMessage'](_0x24de0a, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x57c39a
            });
        }
        await addWelcome(_0x24de0a, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x3b09b7['sendMessage'](_0x24de0a, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x57c39a
        });
    }
    if (_0x4deea2 === 'off') {
        if (!await isWelcomeOn(_0x24de0a)) {
            return _0x3b09b7['sendMessage'](_0x24de0a, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x57c39a
            });
        }
        await delWelcome(_0x24de0a);
        return _0x3b09b7['sendMessage'](_0x24de0a, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x57c39a
        });
    }
    if (_0x4deea2 === 'set') {
        if (!_0x3c5db4) {
            return _0x3b09b7['sendMessage'](_0x24de0a, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x57c39a
            });
        }
        await addWelcome(_0x24de0a, !![], _0x3c5db4);
        return _0x3b09b7['sendMessage'](_0x24de0a, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x57c39a
        });
    }
    return _0x3b09b7['sendMessage'](_0x24de0a, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x57c39a
    });
}
async function handleGoodbye(_0x19515c, _0x11b5bc, _0x210aec, _0x52f48a) {
    const _0x225bc1 = _0x52f48a?.['toLowerCase']();
    if (!_0x52f48a) {
        return _0x19515c['sendMessage'](_0x11b5bc, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x210aec
        });
    }
    if (_0x225bc1 === 'on') {
        if (await isGoodByeOn(_0x11b5bc)) {
            return _0x19515c['sendMessage'](_0x11b5bc, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x210aec
            });
        }
        await addGoodbye(_0x11b5bc, !![], 'Goodbye\x20{user}\x20👋');
        return _0x19515c['sendMessage'](_0x11b5bc, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x210aec
        });
    }
    if (_0x225bc1 === 'off') {
        if (!await isGoodByeOn(_0x11b5bc)) {
            return _0x19515c['sendMessage'](_0x11b5bc, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x210aec
            });
        }
        await delGoodBye(_0x11b5bc);
        return _0x19515c['sendMessage'](_0x11b5bc, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x210aec
        });
    }
    if (_0x225bc1['startsWith']('set\x20')) {
        const _0x3f1e50 = _0x52f48a['substring'](0x4);
        if (!_0x3f1e50) {
            return _0x19515c['sendMessage'](_0x11b5bc, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x210aec
            });
        }
        await addGoodbye(_0x11b5bc, !![], _0x3f1e50);
        return _0x19515c['sendMessage'](_0x11b5bc, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x210aec
        });
    }
    return _0x19515c['sendMessage'](_0x11b5bc, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x210aec
    });
}
export {
    handleWelcome,
    handleGoodbye
};