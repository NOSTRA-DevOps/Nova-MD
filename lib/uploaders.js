import _0x0_0x33cbf7 from 'axios';
import _0x0_0x249839 from 'form-data';
import _0x0_0x2d8f1e from 'fs';
async function uploadToCatbox(_0x2b8f23) {
    try {
        const _0x3b5f2 = new _0x0_0x249839();
        _0x3b5f2['append']('reqtype', 'fileupload');
        _0x3b5f2['append']('fileToUpload', _0x0_0x2d8f1e['createReadStream'](_0x2b8f23));
        const _0x240f00 = await _0x0_0x33cbf7['post']('https://catbox.moe/user/api.php', _0x3b5f2, {
            'headers': _0x3b5f2['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x240f00['data']['trim']()
        };
    } catch (_0x102a11) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x102a11['message']);
    }
}
async function uploadToPomf2(_0x3ec77d) {
    try {
        const _0x13221d = new _0x0_0x249839();
        _0x13221d['append']('files[]', _0x0_0x2d8f1e['createReadStream'](_0x3ec77d));
        const _0xe9c1d2 = await _0x0_0x33cbf7['post']('https://pomf2.lain.la/upload.php', _0x13221d, {
            'headers': _0x13221d['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0xe9c1d2['data']['success'] && _0xe9c1d2['data']['files'] && _0xe9c1d2['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0xe9c1d2['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x481ce4) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x481ce4['message']);
    }
}
async function uploadToImgbb(_0x39c3c9, _0x53d07e) {
    try {
        const _0x33ed77 = _0x0_0x2d8f1e['readFileSync'](_0x39c3c9);
        const _0xa7c64b = _0x33ed77['toString']('base64');
        const _0x1c41e9 = new _0x0_0x249839();
        _0x1c41e9['append']('image', _0xa7c64b);
        const _0x311bff = await _0x0_0x33cbf7['post']('https://api.imgbb.com/1/upload?key=' + _0x53d07e, _0x1c41e9, { 'headers': _0x1c41e9['getHeaders']() });
        if (_0x311bff['data']['success']) {
            return {
                'status': !![],
                'url': _0x311bff['data']['data']['url'],
                'display_url': _0x311bff['data']['data']['display_url'],
                'delete_url': _0x311bff['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x848d62) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x848d62['message']);
    }
}
async function uploadToFreeimage(_0xadc882) {
    try {
        const _0x3ab3b6 = new _0x0_0x249839();
        _0x3ab3b6['append']('source', _0x0_0x2d8f1e['createReadStream'](_0xadc882));
        _0x3ab3b6['append']('type', 'file');
        _0x3ab3b6['append']('action', 'upload');
        const _0x50ab9b = await _0x0_0x33cbf7['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x3ab3b6, {
            'headers': _0x3ab3b6['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x50ab9b['data']['success']) {
            return {
                'status': !![],
                'url': _0x50ab9b['data']['image']['url'],
                'display_url': _0x50ab9b['data']['image']['display_url'],
                'delete_url': _0x50ab9b['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x449a97) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x449a97['message']);
    }
}
async function uploadToLitterbox(_0x2fdfb3, _0x2ff279 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x2ff279)) {
            _0x2ff279 = '1h';
        }
        const _0x313dbc = new _0x0_0x249839();
        _0x313dbc['append']('reqtype', 'fileupload');
        _0x313dbc['append']('time', _0x2ff279);
        _0x313dbc['append']('fileToUpload', _0x0_0x2d8f1e['createReadStream'](_0x2fdfb3));
        const _0x53c7a9 = await _0x0_0x33cbf7['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x313dbc, {
            'headers': _0x313dbc['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x53c7a9['data']['trim'](),
            'expires': _0x2ff279
        };
    } catch (_0x2b8272) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x2b8272['message']);
    }
}
async function uploadToPixhost(_0x10d697) {
    try {
        const _0x59e2c0 = new _0x0_0x249839();
        _0x59e2c0['append']('img', _0x0_0x2d8f1e['createReadStream'](_0x10d697));
        _0x59e2c0['append']('content_type', '0');
        const _0xe6f74c = await _0x0_0x33cbf7['post']('https://api.pixhost.to/images', _0x59e2c0, {
            'headers': _0x59e2c0['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0xe6f74c['data']['show_url']) {
            const _0x308684 = _0xe6f74c['data']['show_url'];
            const _0x3362f7 = await _0x0_0x33cbf7['get'](_0x308684);
            const _0x294bc1 = _0x3362f7['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x294bc1 && _0x294bc1[0x1]) {
                return {
                    'status': !![],
                    'url': _0x294bc1[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x26ec75) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x26ec75['message']);
    }
}
async function uploadToTmpfiles(_0x42162e) {
    try {
        const _0x488f2a = new _0x0_0x249839();
        _0x488f2a['append']('file', _0x0_0x2d8f1e['createReadStream'](_0x42162e));
        const _0x2c8800 = await _0x0_0x33cbf7['post']('https://tmpfiles.org/api/v1/upload', _0x488f2a, {
            'headers': _0x488f2a['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2c8800['data']['status'] === 'success') {
            const _0xeff983 = _0x2c8800['data']['data']['url'];
            const _0x5865e6 = _0xeff983['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x5865e6,
                'page_url': _0xeff983
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x42cf9a) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x42cf9a['message']);
    }
}
async function uploadToQuax(_0x308378) {
    try {
        const _0x11da76 = new _0x0_0x249839();
        _0x11da76['append']('files[]', _0x0_0x2d8f1e['createReadStream'](_0x308378));
        const _0x575720 = await _0x0_0x33cbf7['post']('https://qu.ax/upload.php', _0x11da76, {
            'headers': _0x11da76['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x575720['data']['success'] && _0x575720['data']['files'] && _0x575720['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x575720['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5c7bf5) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x5c7bf5['message']);
    }
}
async function uploadToX0(_0x8ceeb8) {
    try {
        const _0x2bfdd1 = new _0x0_0x249839();
        _0x2bfdd1['append']('file', _0x0_0x2d8f1e['createReadStream'](_0x8ceeb8));
        const _0x1d9183 = await _0x0_0x33cbf7['post']('https://x0.at/', _0x2bfdd1, {
            'headers': _0x2bfdd1['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x1d9183['data']['trim']()
        };
    } catch (_0x38f9ff) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x38f9ff['message']);
    }
}
async function uploadToUguu(_0x409707) {
    try {
        const _0x4fffde = new _0x0_0x249839();
        _0x4fffde['append']('files[]', _0x0_0x2d8f1e['createReadStream'](_0x409707));
        const _0x159444 = await _0x0_0x33cbf7['post']('https://uguu.se/upload.php', _0x4fffde, {
            'headers': { ..._0x4fffde['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x159444['data'] && _0x159444['data']['success'] && _0x159444['data']['files'] && _0x159444['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x159444['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x591de9) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x591de9['message']);
    }
}
async function uploadFile(_0x517806) {
    const _0x45fbb7 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x517806)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x517806)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x517806)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x517806)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x517806)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x517806)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x517806)
        }
    ];
    for (const _0x7b646c of _0x45fbb7) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x7b646c['name'] + '...');
            const _0x4f88bb = await _0x7b646c['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x7b646c['name']);
            return {
                ..._0x4f88bb,
                'service': _0x7b646c['name']
            };
        } catch (_0x1efbfb) {
            console['error']('[Upload]\x20✗\x20' + _0x7b646c['name'] + '\x20failed:', _0x1efbfb['message']);
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