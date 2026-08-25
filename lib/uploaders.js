import _0x0_0x24f755 from 'axios';
import _0x0_0x322f5a from 'form-data';
import _0x0_0x4eaaeb from 'fs';
async function uploadToCatbox(_0x22213c) {
    try {
        const _0xadd9b2 = new _0x0_0x322f5a();
        _0xadd9b2['append']('reqtype', 'fileupload');
        _0xadd9b2['append']('fileToUpload', _0x0_0x4eaaeb['createReadStream'](_0x22213c));
        const _0x5f4adb = await _0x0_0x24f755['post']('https://catbox.moe/user/api.php', _0xadd9b2, {
            'headers': _0xadd9b2['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x5f4adb['data']['trim']()
        };
    } catch (_0x13ab95) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x13ab95['message']);
    }
}
async function uploadToPomf2(_0x58f2f4) {
    try {
        const _0x2ac6f3 = new _0x0_0x322f5a();
        _0x2ac6f3['append']('files[]', _0x0_0x4eaaeb['createReadStream'](_0x58f2f4));
        const _0x47b7a1 = await _0x0_0x24f755['post']('https://pomf2.lain.la/upload.php', _0x2ac6f3, {
            'headers': _0x2ac6f3['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x47b7a1['data']['success'] && _0x47b7a1['data']['files'] && _0x47b7a1['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x47b7a1['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x235488) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x235488['message']);
    }
}
async function uploadToImgbb(_0x176839, _0x46eb0c) {
    try {
        const _0x43e3b8 = _0x0_0x4eaaeb['readFileSync'](_0x176839);
        const _0x398d45 = _0x43e3b8['toString']('base64');
        const _0x773b7f = new _0x0_0x322f5a();
        _0x773b7f['append']('image', _0x398d45);
        const _0x165399 = await _0x0_0x24f755['post']('https://api.imgbb.com/1/upload?key=' + _0x46eb0c, _0x773b7f, { 'headers': _0x773b7f['getHeaders']() });
        if (_0x165399['data']['success']) {
            return {
                'status': !![],
                'url': _0x165399['data']['data']['url'],
                'display_url': _0x165399['data']['data']['display_url'],
                'delete_url': _0x165399['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x3f60c2) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x3f60c2['message']);
    }
}
async function uploadToFreeimage(_0x3a62f7) {
    try {
        const _0x5ef3a3 = new _0x0_0x322f5a();
        _0x5ef3a3['append']('source', _0x0_0x4eaaeb['createReadStream'](_0x3a62f7));
        _0x5ef3a3['append']('type', 'file');
        _0x5ef3a3['append']('action', 'upload');
        const _0xa0e21e = await _0x0_0x24f755['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x5ef3a3, {
            'headers': _0x5ef3a3['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0xa0e21e['data']['success']) {
            return {
                'status': !![],
                'url': _0xa0e21e['data']['image']['url'],
                'display_url': _0xa0e21e['data']['image']['display_url'],
                'delete_url': _0xa0e21e['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x4faca5) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x4faca5['message']);
    }
}
async function uploadToLitterbox(_0xf3c9eb, _0x5dc6b2 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x5dc6b2)) {
            _0x5dc6b2 = '1h';
        }
        const _0x11ebda = new _0x0_0x322f5a();
        _0x11ebda['append']('reqtype', 'fileupload');
        _0x11ebda['append']('time', _0x5dc6b2);
        _0x11ebda['append']('fileToUpload', _0x0_0x4eaaeb['createReadStream'](_0xf3c9eb));
        const _0x48269d = await _0x0_0x24f755['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x11ebda, {
            'headers': _0x11ebda['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x48269d['data']['trim'](),
            'expires': _0x5dc6b2
        };
    } catch (_0x5dd0c0) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x5dd0c0['message']);
    }
}
async function uploadToPixhost(_0x497e28) {
    try {
        const _0x32f10e = new _0x0_0x322f5a();
        _0x32f10e['append']('img', _0x0_0x4eaaeb['createReadStream'](_0x497e28));
        _0x32f10e['append']('content_type', '0');
        const _0xa050bc = await _0x0_0x24f755['post']('https://api.pixhost.to/images', _0x32f10e, {
            'headers': _0x32f10e['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0xa050bc['data']['show_url']) {
            const _0x29216e = _0xa050bc['data']['show_url'];
            const _0x1d0278 = await _0x0_0x24f755['get'](_0x29216e);
            const _0x306223 = _0x1d0278['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x306223 && _0x306223[0x1]) {
                return {
                    'status': !![],
                    'url': _0x306223[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x3020ea) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x3020ea['message']);
    }
}
async function uploadToTmpfiles(_0x925481) {
    try {
        const _0x2536b3 = new _0x0_0x322f5a();
        _0x2536b3['append']('file', _0x0_0x4eaaeb['createReadStream'](_0x925481));
        const _0x408366 = await _0x0_0x24f755['post']('https://tmpfiles.org/api/v1/upload', _0x2536b3, {
            'headers': _0x2536b3['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x408366['data']['status'] === 'success') {
            const _0x2852e5 = _0x408366['data']['data']['url'];
            const _0x11c83f = _0x2852e5['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x11c83f,
                'page_url': _0x2852e5
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5d4d6b) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x5d4d6b['message']);
    }
}
async function uploadToQuax(_0x5a11f1) {
    try {
        const _0x249209 = new _0x0_0x322f5a();
        _0x249209['append']('files[]', _0x0_0x4eaaeb['createReadStream'](_0x5a11f1));
        const _0xcedc97 = await _0x0_0x24f755['post']('https://qu.ax/upload.php', _0x249209, {
            'headers': _0x249209['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0xcedc97['data']['success'] && _0xcedc97['data']['files'] && _0xcedc97['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0xcedc97['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5ccb58) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x5ccb58['message']);
    }
}
async function uploadToX0(_0x5b020a) {
    try {
        const _0x3336dc = new _0x0_0x322f5a();
        _0x3336dc['append']('file', _0x0_0x4eaaeb['createReadStream'](_0x5b020a));
        const _0x4cb1de = await _0x0_0x24f755['post']('https://x0.at/', _0x3336dc, {
            'headers': _0x3336dc['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x4cb1de['data']['trim']()
        };
    } catch (_0x3cf819) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x3cf819['message']);
    }
}
async function uploadToUguu(_0xd06c57) {
    try {
        const _0x8b509e = new _0x0_0x322f5a();
        _0x8b509e['append']('files[]', _0x0_0x4eaaeb['createReadStream'](_0xd06c57));
        const _0x4a080b = await _0x0_0x24f755['post']('https://uguu.se/upload.php', _0x8b509e, {
            'headers': { ..._0x8b509e['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x4a080b['data'] && _0x4a080b['data']['success'] && _0x4a080b['data']['files'] && _0x4a080b['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x4a080b['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x525b11) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x525b11['message']);
    }
}
async function uploadFile(_0x3c6845) {
    const _0x5a79c3 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x3c6845)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x3c6845)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x3c6845)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x3c6845)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x3c6845)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x3c6845)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x3c6845)
        }
    ];
    for (const _0xcbdc47 of _0x5a79c3) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0xcbdc47['name'] + '...');
            const _0x182aa6 = await _0xcbdc47['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0xcbdc47['name']);
            return {
                ..._0x182aa6,
                'service': _0xcbdc47['name']
            };
        } catch (_0x10d47d) {
            console['error']('[Upload]\x20✗\x20' + _0xcbdc47['name'] + '\x20failed:', _0x10d47d['message']);
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