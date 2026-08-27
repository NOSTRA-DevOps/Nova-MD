import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x1095cf, _0x39d33d, _0x1f4cb7, _0x4414f5) {
    if (!_0x4414f5) {
        return _0x1095cf['sendMessage'](_0x39d33d, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x1f4cb7
        });
    }
    const [_0x55cc55, ..._0x115f80] = _0x4414f5['split']('\x20');
    const _0x369886 = _0x55cc55['toLowerCase']();
    const _0x374e2c = _0x115f80['join']('\x20');
    if (_0x369886 === 'on') {
        if (await isWelcomeOn(_0x39d33d)) {
            return _0x1095cf['sendMessage'](_0x39d33d, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x1f4cb7
            });
        }
        await addWelcome(_0x39d33d, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x1095cf['sendMessage'](_0x39d33d, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x1f4cb7
        });
    }
    if (_0x369886 === 'off') {
        if (!await isWelcomeOn(_0x39d33d)) {
            return _0x1095cf['sendMessage'](_0x39d33d, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x1f4cb7
            });
        }
        await delWelcome(_0x39d33d);
        return _0x1095cf['sendMessage'](_0x39d33d, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x1f4cb7
        });
    }
    if (_0x369886 === 'set') {
        if (!_0x374e2c) {
            return _0x1095cf['sendMessage'](_0x39d33d, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x1f4cb7
            });
        }
        await addWelcome(_0x39d33d, !![], _0x374e2c);
        return _0x1095cf['sendMessage'](_0x39d33d, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x1f4cb7
        });
    }
    return _0x1095cf['sendMessage'](_0x39d33d, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x1f4cb7
    });
}
async function handleGoodbye(_0x18dbd1, _0x551aed, _0xfb3557, _0x27e8e9) {
    const _0x43d423 = _0x27e8e9?.['toLowerCase']();
    if (!_0x27e8e9) {
        return _0x18dbd1['sendMessage'](_0x551aed, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0xfb3557
        });
    }
    if (_0x43d423 === 'on') {
        if (await isGoodByeOn(_0x551aed)) {
            return _0x18dbd1['sendMessage'](_0x551aed, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0xfb3557
            });
        }
        await addGoodbye(_0x551aed, !![], 'Goodbye\x20{user}\x20👋');
        return _0x18dbd1['sendMessage'](_0x551aed, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0xfb3557
        });
    }
    if (_0x43d423 === 'off') {
        if (!await isGoodByeOn(_0x551aed)) {
            return _0x18dbd1['sendMessage'](_0x551aed, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0xfb3557
            });
        }
        await delGoodBye(_0x551aed);
        return _0x18dbd1['sendMessage'](_0x551aed, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0xfb3557
        });
    }
    if (_0x43d423['startsWith']('set\x20')) {
        const _0x3424ec = _0x27e8e9['substring'](0x4);
        if (!_0x3424ec) {
            return _0x18dbd1['sendMessage'](_0x551aed, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0xfb3557
            });
        }
        await addGoodbye(_0x551aed, !![], _0x3424ec);
        return _0x18dbd1['sendMessage'](_0x551aed, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0xfb3557
        });
    }
    return _0x18dbd1['sendMessage'](_0x551aed, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0xfb3557
    });
}
export {
    handleWelcome,
    handleGoodbye
};