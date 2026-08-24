import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x3cd93e, _0x3c79d4, _0x270602, _0x502257) {
    if (!_0x502257) {
        return _0x3cd93e['sendMessage'](_0x3c79d4, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x270602
        });
    }
    const [_0x10de4c, ..._0x46caed] = _0x502257['split']('\x20');
    const _0x3064a0 = _0x10de4c['toLowerCase']();
    const _0x35c1f7 = _0x46caed['join']('\x20');
    if (_0x3064a0 === 'on') {
        if (await isWelcomeOn(_0x3c79d4)) {
            return _0x3cd93e['sendMessage'](_0x3c79d4, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x270602
            });
        }
        await addWelcome(_0x3c79d4, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x3cd93e['sendMessage'](_0x3c79d4, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x270602
        });
    }
    if (_0x3064a0 === 'off') {
        if (!await isWelcomeOn(_0x3c79d4)) {
            return _0x3cd93e['sendMessage'](_0x3c79d4, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x270602
            });
        }
        await delWelcome(_0x3c79d4);
        return _0x3cd93e['sendMessage'](_0x3c79d4, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x270602
        });
    }
    if (_0x3064a0 === 'set') {
        if (!_0x35c1f7) {
            return _0x3cd93e['sendMessage'](_0x3c79d4, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x270602
            });
        }
        await addWelcome(_0x3c79d4, !![], _0x35c1f7);
        return _0x3cd93e['sendMessage'](_0x3c79d4, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x270602
        });
    }
    return _0x3cd93e['sendMessage'](_0x3c79d4, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x270602
    });
}
async function handleGoodbye(_0x6ed75a, _0x955dc9, _0x5056ba, _0x2d0678) {
    const _0x1658d7 = _0x2d0678?.['toLowerCase']();
    if (!_0x2d0678) {
        return _0x6ed75a['sendMessage'](_0x955dc9, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x5056ba
        });
    }
    if (_0x1658d7 === 'on') {
        if (await isGoodByeOn(_0x955dc9)) {
            return _0x6ed75a['sendMessage'](_0x955dc9, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x5056ba
            });
        }
        await addGoodbye(_0x955dc9, !![], 'Goodbye\x20{user}\x20👋');
        return _0x6ed75a['sendMessage'](_0x955dc9, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x5056ba
        });
    }
    if (_0x1658d7 === 'off') {
        if (!await isGoodByeOn(_0x955dc9)) {
            return _0x6ed75a['sendMessage'](_0x955dc9, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x5056ba
            });
        }
        await delGoodBye(_0x955dc9);
        return _0x6ed75a['sendMessage'](_0x955dc9, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x5056ba
        });
    }
    if (_0x1658d7['startsWith']('set\x20')) {
        const _0x3dc1be = _0x2d0678['substring'](0x4);
        if (!_0x3dc1be) {
            return _0x6ed75a['sendMessage'](_0x955dc9, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x5056ba
            });
        }
        await addGoodbye(_0x955dc9, !![], _0x3dc1be);
        return _0x6ed75a['sendMessage'](_0x955dc9, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x5056ba
        });
    }
    return _0x6ed75a['sendMessage'](_0x955dc9, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x5056ba
    });
}
export {
    handleWelcome,
    handleGoodbye
};