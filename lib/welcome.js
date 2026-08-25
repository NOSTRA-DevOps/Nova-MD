import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x5e3185, _0x4c5c76, _0x3786f1, _0x1cc7fc) {
    if (!_0x1cc7fc) {
        return _0x5e3185['sendMessage'](_0x4c5c76, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x3786f1
        });
    }
    const [_0xb64296, ..._0x323466] = _0x1cc7fc['split']('\x20');
    const _0x441035 = _0xb64296['toLowerCase']();
    const _0xd89ee5 = _0x323466['join']('\x20');
    if (_0x441035 === 'on') {
        if (await isWelcomeOn(_0x4c5c76)) {
            return _0x5e3185['sendMessage'](_0x4c5c76, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x3786f1
            });
        }
        await addWelcome(_0x4c5c76, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x5e3185['sendMessage'](_0x4c5c76, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x3786f1
        });
    }
    if (_0x441035 === 'off') {
        if (!await isWelcomeOn(_0x4c5c76)) {
            return _0x5e3185['sendMessage'](_0x4c5c76, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x3786f1
            });
        }
        await delWelcome(_0x4c5c76);
        return _0x5e3185['sendMessage'](_0x4c5c76, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x3786f1
        });
    }
    if (_0x441035 === 'set') {
        if (!_0xd89ee5) {
            return _0x5e3185['sendMessage'](_0x4c5c76, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x3786f1
            });
        }
        await addWelcome(_0x4c5c76, !![], _0xd89ee5);
        return _0x5e3185['sendMessage'](_0x4c5c76, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x3786f1
        });
    }
    return _0x5e3185['sendMessage'](_0x4c5c76, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x3786f1
    });
}
async function handleGoodbye(_0x350b30, _0x2b7a6e, _0x473b03, _0x4c4093) {
    const _0x43cbc4 = _0x4c4093?.['toLowerCase']();
    if (!_0x4c4093) {
        return _0x350b30['sendMessage'](_0x2b7a6e, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x473b03
        });
    }
    if (_0x43cbc4 === 'on') {
        if (await isGoodByeOn(_0x2b7a6e)) {
            return _0x350b30['sendMessage'](_0x2b7a6e, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x473b03
            });
        }
        await addGoodbye(_0x2b7a6e, !![], 'Goodbye\x20{user}\x20👋');
        return _0x350b30['sendMessage'](_0x2b7a6e, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x473b03
        });
    }
    if (_0x43cbc4 === 'off') {
        if (!await isGoodByeOn(_0x2b7a6e)) {
            return _0x350b30['sendMessage'](_0x2b7a6e, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x473b03
            });
        }
        await delGoodBye(_0x2b7a6e);
        return _0x350b30['sendMessage'](_0x2b7a6e, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x473b03
        });
    }
    if (_0x43cbc4['startsWith']('set\x20')) {
        const _0x5c9bd4 = _0x4c4093['substring'](0x4);
        if (!_0x5c9bd4) {
            return _0x350b30['sendMessage'](_0x2b7a6e, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x473b03
            });
        }
        await addGoodbye(_0x2b7a6e, !![], _0x5c9bd4);
        return _0x350b30['sendMessage'](_0x2b7a6e, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x473b03
        });
    }
    return _0x350b30['sendMessage'](_0x2b7a6e, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x473b03
    });
}
export {
    handleWelcome,
    handleGoodbye
};