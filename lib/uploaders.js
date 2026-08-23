import _0x0_0x172303 from 'axios';
import _0x0_0x94e6ac from 'form-data';
import _0x0_0x33cc6c from 'fs';
async function uploadToCatbox(_0x4a3384) {
    try {
        const _0x5e05ae = new _0x0_0x94e6ac();
        _0x5e05ae['append']('reqtype', 'fileupload');
        _0x5e05ae['append']('fileToUpload', _0x0_0x33cc6c['createReadStream'](_0x4a3384));
        const _0x4d1110 = await _0x0_0x172303['post']('https://catbox.moe/user/api.php', _0x5e05ae, {
            'headers': _0x5e05ae['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x4d1110['data']['trim']()
        };
    } catch (_0x25399c) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x25399c['message']);
    }
}
async function uploadToPomf2(_0x229786) {
    try {
        const _0x419cbe = new _0x0_0x94e6ac();
        _0x419cbe['append']('files[]', _0x0_0x33cc6c['createReadStream'](_0x229786));
        const _0x1cfb79 = await _0x0_0x172303['post']('https://pomf2.lain.la/upload.php', _0x419cbe, {
            'headers': _0x419cbe['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x1cfb79['data']['success'] && _0x1cfb79['data']['files'] && _0x1cfb79['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x1cfb79['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xd66f63) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0xd66f63['message']);
    }
}
async function uploadToImgbb(_0x355db2, _0x2cab10) {
    try {
        const _0x52cd64 = _0x0_0x33cc6c['readFileSync'](_0x355db2);
        const _0x544765 = _0x52cd64['toString']('base64');
        const _0x22ccf4 = new _0x0_0x94e6ac();
        _0x22ccf4['append']('image', _0x544765);
        const _0x510669 = await _0x0_0x172303['post']('https://api.imgbb.com/1/upload?key=' + _0x2cab10, _0x22ccf4, { 'headers': _0x22ccf4['getHeaders']() });
        if (_0x510669['data']['success']) {
            return {
                'status': !![],
                'url': _0x510669['data']['data']['url'],
                'display_url': _0x510669['data']['data']['display_url'],
                'delete_url': _0x510669['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x2ed242) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x2ed242['message']);
    }
}
async function uploadToFreeimage(_0x2e4d8a) {
    try {
        const _0x506f3b = new _0x0_0x94e6ac();
        _0x506f3b['append']('source', _0x0_0x33cc6c['createReadStream'](_0x2e4d8a));
        _0x506f3b['append']('type', 'file');
        _0x506f3b['append']('action', 'upload');
        const _0x2e5eff = await _0x0_0x172303['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x506f3b, {
            'headers': _0x506f3b['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2e5eff['data']['success']) {
            return {
                'status': !![],
                'url': _0x2e5eff['data']['image']['url'],
                'display_url': _0x2e5eff['data']['image']['display_url'],
                'delete_url': _0x2e5eff['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x1e2270) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x1e2270['message']);
    }
}
async function uploadToLitterbox(_0x8f6a18, _0x15b20c = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x15b20c)) {
            _0x15b20c = '1h';
        }
        const _0x581c0c = new _0x0_0x94e6ac();
        _0x581c0c['append']('reqtype', 'fileupload');
        _0x581c0c['append']('time', _0x15b20c);
        _0x581c0c['append']('fileToUpload', _0x0_0x33cc6c['createReadStream'](_0x8f6a18));
        const _0x448bad = await _0x0_0x172303['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x581c0c, {
            'headers': _0x581c0c['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x448bad['data']['trim'](),
            'expires': _0x15b20c
        };
    } catch (_0x1bce9c) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x1bce9c['message']);
    }
}
async function uploadToPixhost(_0x5485a8) {
    try {
        const _0x48f8c2 = new _0x0_0x94e6ac();
        _0x48f8c2['append']('img', _0x0_0x33cc6c['createReadStream'](_0x5485a8));
        _0x48f8c2['append']('content_type', '0');
        const _0x20d6d6 = await _0x0_0x172303['post']('https://api.pixhost.to/images', _0x48f8c2, {
            'headers': _0x48f8c2['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x20d6d6['data']['show_url']) {
            const _0x15c63d = _0x20d6d6['data']['show_url'];
            const _0x4f58f9 = await _0x0_0x172303['get'](_0x15c63d);
            const _0x3e46ee = _0x4f58f9['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x3e46ee && _0x3e46ee[0x1]) {
                return {
                    'status': !![],
                    'url': _0x3e46ee[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x418897) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x418897['message']);
    }
}
async function uploadToTmpfiles(_0xa28592) {
    try {
        const _0x89cca8 = new _0x0_0x94e6ac();
        _0x89cca8['append']('file', _0x0_0x33cc6c['createReadStream'](_0xa28592));
        const _0x2f39d8 = await _0x0_0x172303['post']('https://tmpfiles.org/api/v1/upload', _0x89cca8, {
            'headers': _0x89cca8['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2f39d8['data']['status'] === 'success') {
            const _0x513354 = _0x2f39d8['data']['data']['url'];
            const _0x1b0028 = _0x513354['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x1b0028,
                'page_url': _0x513354
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x13c87d) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x13c87d['message']);
    }
}
async function uploadToQuax(_0x303f0f) {
    try {
        const _0x5bf6b0 = new _0x0_0x94e6ac();
        _0x5bf6b0['append']('files[]', _0x0_0x33cc6c['createReadStream'](_0x303f0f));
        const _0x5192c9 = await _0x0_0x172303['post']('https://qu.ax/upload.php', _0x5bf6b0, {
            'headers': _0x5bf6b0['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x5192c9['data']['success'] && _0x5192c9['data']['files'] && _0x5192c9['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x5192c9['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x20f7b1) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x20f7b1['message']);
    }
}
async function uploadToX0(_0x51c39f) {
    try {
        const _0x3a380c = new _0x0_0x94e6ac();
        _0x3a380c['append']('file', _0x0_0x33cc6c['createReadStream'](_0x51c39f));
        const _0x53c4d9 = await _0x0_0x172303['post']('https://x0.at/', _0x3a380c, {
            'headers': _0x3a380c['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x53c4d9['data']['trim']()
        };
    } catch (_0x10b9bb) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x10b9bb['message']);
    }
}
async function uploadToUguu(_0x5219a8) {
    try {
        const _0x42839a = new _0x0_0x94e6ac();
        _0x42839a['append']('files[]', _0x0_0x33cc6c['createReadStream'](_0x5219a8));
        const _0x41cedc = await _0x0_0x172303['post']('https://uguu.se/upload.php', _0x42839a, {
            'headers': { ..._0x42839a['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x41cedc['data'] && _0x41cedc['data']['success'] && _0x41cedc['data']['files'] && _0x41cedc['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x41cedc['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x5cc90a) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x5cc90a['message']);
    }
}
async function uploadFile(_0x994d71) {
    const _0x26eb7e = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x994d71)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x994d71)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x994d71)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x994d71)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x994d71)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x994d71)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x994d71)
        }
    ];
    for (const _0x3207c8 of _0x26eb7e) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x3207c8['name'] + '...');
            const _0x10faac = await _0x3207c8['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x3207c8['name']);
            return {
                ..._0x10faac,
                'service': _0x3207c8['name']
            };
        } catch (_0x4153af) {
            console['error']('[Upload]\x20✗\x20' + _0x3207c8['name'] + '\x20failed:', _0x4153af['message']);
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