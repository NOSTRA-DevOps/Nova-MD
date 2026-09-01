import _0x0_0x51bc67 from 'axios';
import _0x0_0x3d2624 from 'form-data';
import _0x0_0x475b8d from 'fs';
async function uploadToCatbox(_0x160056) {
    try {
        const _0x5db124 = new _0x0_0x3d2624();
        _0x5db124['append']('reqtype', 'fileupload');
        _0x5db124['append']('fileToUpload', _0x0_0x475b8d['createReadStream'](_0x160056));
        const _0x300bb0 = await _0x0_0x51bc67['post']('https://catbox.moe/user/api.php', _0x5db124, {
            'headers': _0x5db124['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x300bb0['data']['trim']()
        };
    } catch (_0x3ed6e0) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x3ed6e0['message']);
    }
}
async function uploadToPomf2(_0x118e65) {
    try {
        const _0x236459 = new _0x0_0x3d2624();
        _0x236459['append']('files[]', _0x0_0x475b8d['createReadStream'](_0x118e65));
        const _0x44b043 = await _0x0_0x51bc67['post']('https://pomf2.lain.la/upload.php', _0x236459, {
            'headers': _0x236459['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x44b043['data']['success'] && _0x44b043['data']['files'] && _0x44b043['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x44b043['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x3b9a92) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x3b9a92['message']);
    }
}
async function uploadToImgbb(_0x486e12, _0x1313f1) {
    try {
        const _0x5ef751 = _0x0_0x475b8d['readFileSync'](_0x486e12);
        const _0x4a9bb2 = _0x5ef751['toString']('base64');
        const _0x265090 = new _0x0_0x3d2624();
        _0x265090['append']('image', _0x4a9bb2);
        const _0x4ac3f6 = await _0x0_0x51bc67['post']('https://api.imgbb.com/1/upload?key=' + _0x1313f1, _0x265090, { 'headers': _0x265090['getHeaders']() });
        if (_0x4ac3f6['data']['success']) {
            return {
                'status': !![],
                'url': _0x4ac3f6['data']['data']['url'],
                'display_url': _0x4ac3f6['data']['data']['display_url'],
                'delete_url': _0x4ac3f6['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x1b4e3e) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x1b4e3e['message']);
    }
}
async function uploadToFreeimage(_0x402b30) {
    try {
        const _0x425318 = new _0x0_0x3d2624();
        _0x425318['append']('source', _0x0_0x475b8d['createReadStream'](_0x402b30));
        _0x425318['append']('type', 'file');
        _0x425318['append']('action', 'upload');
        const _0x50fceb = await _0x0_0x51bc67['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x425318, {
            'headers': _0x425318['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x50fceb['data']['success']) {
            return {
                'status': !![],
                'url': _0x50fceb['data']['image']['url'],
                'display_url': _0x50fceb['data']['image']['display_url'],
                'delete_url': _0x50fceb['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5d1a87) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x5d1a87['message']);
    }
}
async function uploadToLitterbox(_0x48abed, _0x540d2e = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x540d2e)) {
            _0x540d2e = '1h';
        }
        const _0x530883 = new _0x0_0x3d2624();
        _0x530883['append']('reqtype', 'fileupload');
        _0x530883['append']('time', _0x540d2e);
        _0x530883['append']('fileToUpload', _0x0_0x475b8d['createReadStream'](_0x48abed));
        const _0x16482f = await _0x0_0x51bc67['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x530883, {
            'headers': _0x530883['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x16482f['data']['trim'](),
            'expires': _0x540d2e
        };
    } catch (_0x5a10ec) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x5a10ec['message']);
    }
}
async function uploadToPixhost(_0x289505) {
    try {
        const _0x4f31ff = new _0x0_0x3d2624();
        _0x4f31ff['append']('img', _0x0_0x475b8d['createReadStream'](_0x289505));
        _0x4f31ff['append']('content_type', '0');
        const _0x69e85a = await _0x0_0x51bc67['post']('https://api.pixhost.to/images', _0x4f31ff, {
            'headers': _0x4f31ff['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x69e85a['data']['show_url']) {
            const _0x1e0a78 = _0x69e85a['data']['show_url'];
            const _0x11d6dd = await _0x0_0x51bc67['get'](_0x1e0a78);
            const _0x522805 = _0x11d6dd['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x522805 && _0x522805[0x1]) {
                return {
                    'status': !![],
                    'url': _0x522805[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x2f8bf7) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x2f8bf7['message']);
    }
}
async function uploadToTmpfiles(_0x4cc05a) {
    try {
        const _0x7d4360 = new _0x0_0x3d2624();
        _0x7d4360['append']('file', _0x0_0x475b8d['createReadStream'](_0x4cc05a));
        const _0x17c17d = await _0x0_0x51bc67['post']('https://tmpfiles.org/api/v1/upload', _0x7d4360, {
            'headers': _0x7d4360['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x17c17d['data']['status'] === 'success') {
            const _0x1e5bd3 = _0x17c17d['data']['data']['url'];
            const _0x2218d2 = _0x1e5bd3['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x2218d2,
                'page_url': _0x1e5bd3
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x4285bc) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x4285bc['message']);
    }
}
async function uploadToQuax(_0xbe3f) {
    try {
        const _0x58280a = new _0x0_0x3d2624();
        _0x58280a['append']('files[]', _0x0_0x475b8d['createReadStream'](_0xbe3f));
        const _0x1b3902 = await _0x0_0x51bc67['post']('https://qu.ax/upload.php', _0x58280a, {
            'headers': _0x58280a['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1b3902['data']['success'] && _0x1b3902['data']['files'] && _0x1b3902['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x1b3902['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x50b29f) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x50b29f['message']);
    }
}
async function uploadToX0(_0xa30bc6) {
    try {
        const _0xc97fe4 = new _0x0_0x3d2624();
        _0xc97fe4['append']('file', _0x0_0x475b8d['createReadStream'](_0xa30bc6));
        const _0x3a05d4 = await _0x0_0x51bc67['post']('https://x0.at/', _0xc97fe4, {
            'headers': _0xc97fe4['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x3a05d4['data']['trim']()
        };
    } catch (_0xe39410) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0xe39410['message']);
    }
}
async function uploadToUguu(_0x2503e4) {
    try {
        const _0x45688e = new _0x0_0x3d2624();
        _0x45688e['append']('files[]', _0x0_0x475b8d['createReadStream'](_0x2503e4));
        const _0x548700 = await _0x0_0x51bc67['post']('https://uguu.se/upload.php', _0x45688e, {
            'headers': { ..._0x45688e['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x548700['data'] && _0x548700['data']['success'] && _0x548700['data']['files'] && _0x548700['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x548700['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x25415e) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x25415e['message']);
    }
}
async function uploadFile(_0x4569ac) {
    const _0x1b5836 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x4569ac)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x4569ac)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x4569ac)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x4569ac)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x4569ac)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x4569ac)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x4569ac)
        }
    ];
    for (const _0x350d16 of _0x1b5836) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x350d16['name'] + '...');
            const _0x202b8a = await _0x350d16['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x350d16['name']);
            return {
                ..._0x202b8a,
                'service': _0x350d16['name']
            };
        } catch (_0x54fdf3) {
            console['error']('[Upload]\x20✗\x20' + _0x350d16['name'] + '\x20failed:', _0x54fdf3['message']);
            continue;
        }
    }
    throw new Error('All\x20upload\x20services\x20failed');
}
export {
    uploadToCatbox,
    uploadToPomf2,
    uploadToImgbb,
    uploadToFreeimage,
    uploadToLitterbox,
    uploadToUguu,
    uploadToPixhost,
    uploadToTmpfiles,
    uploadToQuax,
    uploadToX0,
    uploadFile
};