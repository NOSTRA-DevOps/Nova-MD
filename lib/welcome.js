import {
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn
} from '../lib/index.js';
async function handleWelcome(_0x277ec9, _0x14b37c, _0x5bc746, _0x4505d0) {
    if (!_0x4505d0) {
        return _0x277ec9['sendMessage'](_0x14b37c, {
            'text': '📥\x20*Welcome\x20Message\x20Setup*\x0a\x0a✅\x20*.welcome\x20on*\x20—\x20Enable\x20welcome\x20messages\x0a🛠️\x20*.welcome\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20welcome\x20message\x0a🚫\x20*.welcome\x20off*\x20—\x20Disable\x20welcome\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20new\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name\x0a•\x20{description}\x20-\x20Shows\x20group\x20description',
            'quoted': _0x5bc746
        });
    }
    const [_0x38083c, ..._0x3ad97e] = _0x4505d0['split']('\x20');
    const _0x10a810 = _0x38083c['toLowerCase']();
    const _0x23482a = _0x3ad97e['join']('\x20');
    if (_0x10a810 === 'on') {
        if (await isWelcomeOn(_0x14b37c)) {
            return _0x277ec9['sendMessage'](_0x14b37c, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x5bc746
            });
        }
        await addWelcome(_0x14b37c, !![], 'Welcome\x20{user}\x20to\x20{group}!\x20🎉');
        return _0x277ec9['sendMessage'](_0x14b37c, {
            'text': '✅\x20Welcome\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.welcome\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x5bc746
        });
    }
    if (_0x10a810 === 'off') {
        if (!await isWelcomeOn(_0x14b37c)) {
            return _0x277ec9['sendMessage'](_0x14b37c, {
                'text': '⚠️\x20Welcome\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x5bc746
            });
        }
        await delWelcome(_0x14b37c);
        return _0x277ec9['sendMessage'](_0x14b37c, {
            'text': '✅\x20Welcome\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x5bc746
        });
    }
    if (_0x10a810 === 'set') {
        if (!_0x23482a) {
            return _0x277ec9['sendMessage'](_0x14b37c, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20welcome\x20message.\x20Example:\x20*.welcome\x20set\x20Welcome\x20to\x20the\x20group!*',
                'quoted': _0x5bc746
            });
        }
        await addWelcome(_0x14b37c, !![], _0x23482a);
        return _0x277ec9['sendMessage'](_0x14b37c, {
            'text': '✅\x20Custom\x20welcome\x20message\x20*set\x20successfully*.',
            'quoted': _0x5bc746
        });
    }
    return _0x277ec9['sendMessage'](_0x14b37c, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.welcome\x20on*\x20-\x20Enable\x0a*.welcome\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.welcome\x20off*\x20-\x20Disable',
        'quoted': _0x5bc746
    });
}
async function handleGoodbye(_0x5ed019, _0x3f2b05, _0x3271ef, _0x12fa10) {
    const _0x4fc96b = _0x12fa10?.['toLowerCase']();
    if (!_0x12fa10) {
        return _0x5ed019['sendMessage'](_0x3f2b05, {
            'text': '📤\x20*Goodbye\x20Message\x20Setup*\x0a\x0a✅\x20*.goodbye\x20on*\x20—\x20Enable\x20goodbye\x20messages\x0a🛠️\x20*.goodbye\x20set\x20Your\x20custom\x20message*\x20—\x20Set\x20a\x20custom\x20goodbye\x20message\x0a🚫\x20*.goodbye\x20off*\x20—\x20Disable\x20goodbye\x20messages\x0a\x0a*Available\x20Variables:*\x0a•\x20{user}\x20-\x20Mentions\x20the\x20leaving\x20member\x0a•\x20{group}\x20-\x20Shows\x20group\x20name',
            'quoted': _0x3271ef
        });
    }
    if (_0x4fc96b === 'on') {
        if (await isGoodByeOn(_0x3f2b05)) {
            return _0x5ed019['sendMessage'](_0x3f2b05, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20enabled*.',
                'quoted': _0x3271ef
            });
        }
        await addGoodbye(_0x3f2b05, !![], 'Goodbye\x20{user}\x20👋');
        return _0x5ed019['sendMessage'](_0x3f2b05, {
            'text': '✅\x20Goodbye\x20messages\x20*enabled*\x20with\x20simple\x20message.\x20Use\x20*.goodbye\x20set\x20[your\x20message]*\x20to\x20customize.',
            'quoted': _0x3271ef
        });
    }
    if (_0x4fc96b === 'off') {
        if (!await isGoodByeOn(_0x3f2b05)) {
            return _0x5ed019['sendMessage'](_0x3f2b05, {
                'text': '⚠️\x20Goodbye\x20messages\x20are\x20*already\x20disabled*.',
                'quoted': _0x3271ef
            });
        }
        await delGoodBye(_0x3f2b05);
        return _0x5ed019['sendMessage'](_0x3f2b05, {
            'text': '✅\x20Goodbye\x20messages\x20*disabled*\x20for\x20this\x20group.',
            'quoted': _0x3271ef
        });
    }
    if (_0x4fc96b['startsWith']('set\x20')) {
        const _0x190326 = _0x12fa10['substring'](0x4);
        if (!_0x190326) {
            return _0x5ed019['sendMessage'](_0x3f2b05, {
                'text': '⚠️\x20Please\x20provide\x20a\x20custom\x20goodbye\x20message.\x20Example:\x20*.goodbye\x20set\x20Goodbye!*',
                'quoted': _0x3271ef
            });
        }
        await addGoodbye(_0x3f2b05, !![], _0x190326);
        return _0x5ed019['sendMessage'](_0x3f2b05, {
            'text': '✅\x20Custom\x20goodbye\x20message\x20*set\x20successfully*.',
            'quoted': _0x3271ef
        });
    }
    return _0x5ed019['sendMessage'](_0x3f2b05, {
        'text': '❌\x20Invalid\x20command.\x20Use:\x0a*.goodbye\x20on*\x20-\x20Enable\x0a*.goodbye\x20set\x20[message]*\x20-\x20Set\x20custom\x20message\x0a*.goodbye\x20off*\x20-\x20Disable',
        'quoted': _0x3271ef
    });
}
export {
    handleWelcome,
    handleGoodbye
};