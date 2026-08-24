import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x128462, _0xa4be27, _0x2465fe, _0x1468fb) {
    if (!_0x1468fb) {
        return _0x128462['sendMessage'](_0xa4be27, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x2465fe
        });
    }
    const [_0x5bd870, ..._0x160ec1] = _0x1468fb['split']('\x20');
    const _0x358872 = _0x5bd870['toLowerCase']();
    const _0x4eb121 = _0x160ec1['join']('\x20');
    if (_0x358872 === 'on') {
        if (await isWelcomeOn(_0xa4be27)) {
            return _0x128462['sendMessage'](_0xa4be27, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x2465fe
            });
        }
        await addWelcome(_0xa4be27, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x128462['sendMessage'](_0xa4be27, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x2465fe
        });
    }
    if (_0x358872 === 'off') {
        if (!await isWelcomeOn(_0xa4be27)) {
            return _0x128462['sendMessage'](_0xa4be27, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x2465fe
            });
        }
        await delWelcome(_0xa4be27);
        return _0x128462['sendMessage'](_0xa4be27, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x2465fe
        });
    }
    if (_0x358872 === 'set') {
        if (!_0x4eb121) {
            return _0x128462['sendMessage'](_0xa4be27, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x2465fe
            });
        }
        await addWelcome(_0xa4be27, !![], _0x4eb121);
        return _0x128462['sendMessage'](_0xa4be27, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x2465fe
        });
    }
    return _0x128462['sendMessage'](_0xa4be27, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x2465fe
    });
}
async function handleGoodbye(_0xee4d22, _0x26636f, _0x21a562, _0x17c546) {
    const _0x2e4a22 = _0x17c546?.['toLowerCase']();
    if (!_0x17c546) {
        return _0xee4d22['sendMessage'](_0x26636f, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x21a562
        });
    }
    if (_0x2e4a22 === 'on') {
        if (await isGoodByeOn(_0x26636f)) {
            return _0xee4d22['sendMessage'](_0x26636f, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x21a562
            });
        }
        await addGoodbye(_0x26636f, !![], 'Goodbye\x20{user}\x20👋');
        return _0xee4d22['sendMessage'](_0x26636f, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x21a562
        });
    }
    if (_0x2e4a22 === 'off') {
        if (!await isGoodByeOn(_0x26636f)) {
            return _0xee4d22['sendMessage'](_0x26636f, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x21a562
            });
        }
        await delGoodBye(_0x26636f);
        return _0xee4d22['sendMessage'](_0x26636f, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x21a562
        });
    }
    if (_0x2e4a22['startsWith']('set\x20')) {
        const _0x2db4fa = _0x17c546['substring'](0x4);
        if (!_0x2db4fa) {
            return _0xee4d22['sendMessage'](_0x26636f, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x21a562
            });
        }
        await addGoodbye(_0x26636f, !![], _0x2db4fa);
        return _0xee4d22['sendMessage'](_0x26636f, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x21a562
        });
    }
    return _0xee4d22['sendMessage'](_0x26636f, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x21a562
    });
}
export {
    handleWelcome,
    handleGoodbye
};