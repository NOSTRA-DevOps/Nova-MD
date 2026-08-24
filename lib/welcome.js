import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x13565c, _0x174839, _0x379970, _0x5d747c) {
    if (!_0x5d747c) {
        return _0x13565c['sendMessage'](_0x174839, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x379970
        });
    }
    const [_0x37cd67, ..._0xd76e81] = _0x5d747c['split']('\x20');
    const _0xc652e5 = _0x37cd67['toLowerCase']();
    const _0x4c65a8 = _0xd76e81['join']('\x20');
    if (_0xc652e5 === 'on') {
        if (await isWelcomeOn(_0x174839)) {
            return _0x13565c['sendMessage'](_0x174839, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x379970
            });
        }
        await addWelcome(_0x174839, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x13565c['sendMessage'](_0x174839, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x379970
        });
    }
    if (_0xc652e5 === 'off') {
        if (!await isWelcomeOn(_0x174839)) {
            return _0x13565c['sendMessage'](_0x174839, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x379970
            });
        }
        await delWelcome(_0x174839);
        return _0x13565c['sendMessage'](_0x174839, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x379970
        });
    }
    if (_0xc652e5 === 'set') {
        if (!_0x4c65a8) {
            return _0x13565c['sendMessage'](_0x174839, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x379970
            });
        }
        await addWelcome(_0x174839, !![], _0x4c65a8);
        return _0x13565c['sendMessage'](_0x174839, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x379970
        });
    }
    return _0x13565c['sendMessage'](_0x174839, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x379970
    });
}
async function handleGoodbye(_0x3ed38e, _0x5390c7, _0x41a85d, _0x2717da) {
    const _0x357d4c = _0x2717da?.['toLowerCase']();
    if (!_0x2717da) {
        return _0x3ed38e['sendMessage'](_0x5390c7, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x41a85d
        });
    }
    if (_0x357d4c === 'on') {
        if (await isGoodByeOn(_0x5390c7)) {
            return _0x3ed38e['sendMessage'](_0x5390c7, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x41a85d
            });
        }
        await addGoodbye(_0x5390c7, !![], 'Goodbye\x20{user}\x20👋');
        return _0x3ed38e['sendMessage'](_0x5390c7, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x41a85d
        });
    }
    if (_0x357d4c === 'off') {
        if (!await isGoodByeOn(_0x5390c7)) {
            return _0x3ed38e['sendMessage'](_0x5390c7, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x41a85d
            });
        }
        await delGoodBye(_0x5390c7);
        return _0x3ed38e['sendMessage'](_0x5390c7, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x41a85d
        });
    }
    if (_0x357d4c['startsWith']('set\x20')) {
        const _0x1ad089 = _0x2717da['substring'](0x4);
        if (!_0x1ad089) {
            return _0x3ed38e['sendMessage'](_0x5390c7, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x41a85d
            });
        }
        await addGoodbye(_0x5390c7, !![], _0x1ad089);
        return _0x3ed38e['sendMessage'](_0x5390c7, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x41a85d
        });
    }
    return _0x3ed38e['sendMessage'](_0x5390c7, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x41a85d
    });
}
export {
    handleWelcome,
    handleGoodbye
};