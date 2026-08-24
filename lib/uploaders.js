import _0x0_0x24d50d from 'axios';
import _0x0_0x407224 from 'form-data';
import _0x0_0x4bbeef from 'fs';
async function uploadToCatbox(_0x2ec875) {
    try {
        const _0x27c4dc = new _0x0_0x407224();
        _0x27c4dc['append']('reqtype', 'fileupload');
        _0x27c4dc['append']('fileToUpload', _0x0_0x4bbeef['createReadStream'](_0x2ec875));
        const _0x43049e = await _0x0_0x24d50d['post']('https://catbox.moe/user/api.php', _0x27c4dc, {
            'headers': _0x27c4dc['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x43049e['data']['trim']()
        };
    } catch (_0x5e03c1) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x5e03c1['message']);
    }
}
async function uploadToPomf2(_0x11ba8c) {
    try {
        const _0x41f4a7 = new _0x0_0x407224();
        _0x41f4a7['append']('files[]', _0x0_0x4bbeef['createReadStream'](_0x11ba8c));
        const _0x16727d = await _0x0_0x24d50d['post']('https://pomf2.lain.la/upload.php', _0x41f4a7, {
            'headers': _0x41f4a7['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x16727d['data']['success'] && _0x16727d['data']['files'] && _0x16727d['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x16727d['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x3f1cec) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x3f1cec['message']);
    }
}
async function uploadToImgbb(_0x5cedb5, _0x9ffe92) {
    try {
        const _0x452909 = _0x0_0x4bbeef['readFileSync'](_0x5cedb5);
        const _0x4ff16b = _0x452909['toString']('base64');
        const _0x29945b = new _0x0_0x407224();
        _0x29945b['append']('image', _0x4ff16b);
        const _0x58cff1 = await _0x0_0x24d50d['post']('https://api.imgbb.com/1/upload?key=' + _0x9ffe92, _0x29945b, { 'headers': _0x29945b['getHeaders']() });
        if (_0x58cff1['data']['success']) {
            return {
                'status': !![],
                'url': _0x58cff1['data']['data']['url'],
                'display_url': _0x58cff1['data']['data']['display_url'],
                'delete_url': _0x58cff1['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x1b0595) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x1b0595['message']);
    }
}
async function uploadToFreeimage(_0x3dc708) {
    try {
        const _0x4f8219 = new _0x0_0x407224();
        _0x4f8219['append']('source', _0x0_0x4bbeef['createReadStream'](_0x3dc708));
        _0x4f8219['append']('type', 'file');
        _0x4f8219['append']('action', 'upload');
        const _0x1c69d0 = await _0x0_0x24d50d['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x4f8219, {
            'headers': _0x4f8219['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1c69d0['data']['success']) {
            return {
                'status': !![],
                'url': _0x1c69d0['data']['image']['url'],
                'display_url': _0x1c69d0['data']['image']['display_url'],
                'delete_url': _0x1c69d0['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x586222) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x586222['message']);
    }
}
async function uploadToLitterbox(_0x54447d, _0x1d6acc = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x1d6acc)) {
            _0x1d6acc = '1h';
        }
        const _0x317b70 = new _0x0_0x407224();
        _0x317b70['append']('reqtype', 'fileupload');
        _0x317b70['append']('time', _0x1d6acc);
        _0x317b70['append']('fileToUpload', _0x0_0x4bbeef['createReadStream'](_0x54447d));
        const _0x344ef3 = await _0x0_0x24d50d['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x317b70, {
            'headers': _0x317b70['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x344ef3['data']['trim'](),
            'expires': _0x1d6acc
        };
    } catch (_0x58440d) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x58440d['message']);
    }
}
async function uploadToPixhost(_0x312245) {
    try {
        const _0x2623d1 = new _0x0_0x407224();
        _0x2623d1['append']('img', _0x0_0x4bbeef['createReadStream'](_0x312245));
        _0x2623d1['append']('content_type', '0');
        const _0x2ea2c8 = await _0x0_0x24d50d['post']('https://api.pixhost.to/images', _0x2623d1, {
            'headers': _0x2623d1['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2ea2c8['data']['show_url']) {
            const _0x48ea05 = _0x2ea2c8['data']['show_url'];
            const _0x560a52 = await _0x0_0x24d50d['get'](_0x48ea05);
            const _0x54a008 = _0x560a52['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x54a008 && _0x54a008[0x1]) {
                return {
                    'status': !![],
                    'url': _0x54a008[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x15c591) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x15c591['message']);
    }
}
async function uploadToTmpfiles(_0x54b1ff) {
    try {
        const _0x3bea05 = new _0x0_0x407224();
        _0x3bea05['append']('file', _0x0_0x4bbeef['createReadStream'](_0x54b1ff));
        const _0x12b371 = await _0x0_0x24d50d['post']('https://tmpfiles.org/api/v1/upload', _0x3bea05, {
            'headers': _0x3bea05['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x12b371['data']['status'] === 'success') {
            const _0x5f3413 = _0x12b371['data']['data']['url'];
            const _0x41bccc = _0x5f3413['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x41bccc,
                'page_url': _0x5f3413
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x3ca3c3) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x3ca3c3['message']);
    }
}
async function uploadToQuax(_0x2eec97) {
    try {
        const _0x82905a = new _0x0_0x407224();
        _0x82905a['append']('files[]', _0x0_0x4bbeef['createReadStream'](_0x2eec97));
        const _0x3ab556 = await _0x0_0x24d50d['post']('https://qu.ax/upload.php', _0x82905a, {
            'headers': _0x82905a['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x3ab556['data']['success'] && _0x3ab556['data']['files'] && _0x3ab556['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x3ab556['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xadeed3) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0xadeed3['message']);
    }
}
async function uploadToX0(_0x4ad782) {
    try {
        const _0x1cca5a = new _0x0_0x407224();
        _0x1cca5a['append']('file', _0x0_0x4bbeef['createReadStream'](_0x4ad782));
        const _0x3b068b = await _0x0_0x24d50d['post']('https://x0.at/', _0x1cca5a, {
            'headers': _0x1cca5a['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x3b068b['data']['trim']()
        };
    } catch (_0xd4773) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0xd4773['message']);
    }
}
async function uploadToUguu(_0x44e02a) {
    try {
        const _0x424d62 = new _0x0_0x407224();
        _0x424d62['append']('files[]', _0x0_0x4bbeef['createReadStream'](_0x44e02a));
        const _0x5cc293 = await _0x0_0x24d50d['post']('https://uguu.se/upload.php', _0x424d62, {
            'headers': { ..._0x424d62['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x5cc293['data'] && _0x5cc293['data']['success'] && _0x5cc293['data']['files'] && _0x5cc293['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x5cc293['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x4f3368) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x4f3368['message']);
    }
}
async function uploadFile(_0x21db66) {
    const _0x27e1f1 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x21db66)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x21db66)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x21db66)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x21db66)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x21db66)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x21db66)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x21db66)
        }
    ];
    for (const _0xf1c3ca of _0x27e1f1) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0xf1c3ca['name'] + '...');
            const _0x13f93c = await _0xf1c3ca['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0xf1c3ca['name']);
            return {
                ..._0x13f93c,
                'service': _0xf1c3ca['name']
            };
        } catch (_0x2874a1) {
            console['error']('[Upload]\x20✗\x20' + _0xf1c3ca['name'] + '\x20failed:', _0x2874a1['message']);
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