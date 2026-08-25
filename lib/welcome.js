import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x575de9, _0x1cea90, _0x59caf8, _0x2c8196) {
    if (!_0x2c8196) {
        return _0x575de9['sendMessage'](_0x1cea90, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x59caf8
        });
    }
    const [_0x36427f, ..._0x2870a9] = _0x2c8196['split']('\x20');
    const _0xfdd288 = _0x36427f['toLowerCase']();
    const _0x3bcc93 = _0x2870a9['join']('\x20');
    if (_0xfdd288 === 'on') {
        if (await isWelcomeOn(_0x1cea90)) {
            return _0x575de9['sendMessage'](_0x1cea90, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x59caf8
            });
        }
        await addWelcome(_0x1cea90, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x575de9['sendMessage'](_0x1cea90, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x59caf8
        });
    }
    if (_0xfdd288 === 'off') {
        if (!await isWelcomeOn(_0x1cea90)) {
            return _0x575de9['sendMessage'](_0x1cea90, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x59caf8
            });
        }
        await delWelcome(_0x1cea90);
        return _0x575de9['sendMessage'](_0x1cea90, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x59caf8
        });
    }
    if (_0xfdd288 === 'set') {
        if (!_0x3bcc93) {
            return _0x575de9['sendMessage'](_0x1cea90, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x59caf8
            });
        }
        await addWelcome(_0x1cea90, !![], _0x3bcc93);
        return _0x575de9['sendMessage'](_0x1cea90, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x59caf8
        });
    }
    return _0x575de9['sendMessage'](_0x1cea90, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x59caf8
    });
}
async function handleGoodbye(_0x8fd627, _0x57982a, _0x25976c, _0x37cd31) {
    const _0x3afd94 = _0x37cd31?.['toLowerCase']();
    if (!_0x37cd31) {
        return _0x8fd627['sendMessage'](_0x57982a, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x25976c
        });
    }
    if (_0x3afd94 === 'on') {
        if (await isGoodByeOn(_0x57982a)) {
            return _0x8fd627['sendMessage'](_0x57982a, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x25976c
            });
        }
        await addGoodbye(_0x57982a, !![], 'Goodbye\x20{user}\x20👋');
        return _0x8fd627['sendMessage'](_0x57982a, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x25976c
        });
    }
    if (_0x3afd94 === 'off') {
        if (!await isGoodByeOn(_0x57982a)) {
            return _0x8fd627['sendMessage'](_0x57982a, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x25976c
            });
        }
        await delGoodBye(_0x57982a);
        return _0x8fd627['sendMessage'](_0x57982a, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x25976c
        });
    }
    if (_0x3afd94['startsWith']('set\x20')) {
        const _0x211c4f = _0x37cd31['substring'](0x4);
        if (!_0x211c4f) {
            return _0x8fd627['sendMessage'](_0x57982a, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x25976c
            });
        }
        await addGoodbye(_0x57982a, !![], _0x211c4f);
        return _0x8fd627['sendMessage'](_0x57982a, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x25976c
        });
    }
    return _0x8fd627['sendMessage'](_0x57982a, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x25976c
    });
}
export {
    handleWelcome,
    handleGoodbye
};