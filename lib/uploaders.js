import _0x0_0x452628 from 'axios';
import _0x0_0x5251a9 from 'form-data';
import _0x0_0x2b7760 from 'fs';
async function uploadToCatbox(_0x300e4f) {
    try {
        const _0x354e27 = new _0x0_0x5251a9();
        _0x354e27['append']('reqtype', 'fileupload');
        _0x354e27['append']('fileToUpload', _0x0_0x2b7760['createReadStream'](_0x300e4f));
        const _0x2d843a = await _0x0_0x452628['post']('https://catbox.moe/user/api.php', _0x354e27, {
            'headers': _0x354e27['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x2d843a['data']['trim']()
        };
    } catch (_0x44f42e) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x44f42e['message']);
    }
}
async function uploadToPomf2(_0x1f4399) {
    try {
        const _0x2797df = new _0x0_0x5251a9();
        _0x2797df['append']('files[]', _0x0_0x2b7760['createReadStream'](_0x1f4399));
        const _0x2025b0 = await _0x0_0x452628['post']('https://pomf2.lain.la/upload.php', _0x2797df, {
            'headers': _0x2797df['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x2025b0['data']['success'] && _0x2025b0['data']['files'] && _0x2025b0['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x2025b0['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x212183) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x212183['message']);
    }
}
async function uploadToImgbb(_0x3310d4, _0x3422ce) {
    try {
        const _0x2bb250 = _0x0_0x2b7760['readFileSync'](_0x3310d4);
        const _0x545881 = _0x2bb250['toString']('base64');
        const _0xfdc0d8 = new _0x0_0x5251a9();
        _0xfdc0d8['append']('image', _0x545881);
        const _0x234422 = await _0x0_0x452628['post']('https://api.imgbb.com/1/upload?key=' + _0x3422ce, _0xfdc0d8, { 'headers': _0xfdc0d8['getHeaders']() });
        if (_0x234422['data']['success']) {
            return {
                'status': !![],
                'url': _0x234422['data']['data']['url'],
                'display_url': _0x234422['data']['data']['display_url'],
                'delete_url': _0x234422['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x13f091) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x13f091['message']);
    }
}
async function uploadToFreeimage(_0x2c4e65) {
    try {
        const _0x58e47f = new _0x0_0x5251a9();
        _0x58e47f['append']('source', _0x0_0x2b7760['createReadStream'](_0x2c4e65));
        _0x58e47f['append']('type', 'file');
        _0x58e47f['append']('action', 'upload');
        const _0x3cccc7 = await _0x0_0x452628['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x58e47f, {
            'headers': _0x58e47f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x3cccc7['data']['success']) {
            return {
                'status': !![],
                'url': _0x3cccc7['data']['image']['url'],
                'display_url': _0x3cccc7['data']['image']['display_url'],
                'delete_url': _0x3cccc7['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x47460d) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x47460d['message']);
    }
}
async function uploadToLitterbox(_0x35c558, _0x3cbb78 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x3cbb78)) {
            _0x3cbb78 = '1h';
        }
        const _0x2a572d = new _0x0_0x5251a9();
        _0x2a572d['append']('reqtype', 'fileupload');
        _0x2a572d['append']('time', _0x3cbb78);
        _0x2a572d['append']('fileToUpload', _0x0_0x2b7760['createReadStream'](_0x35c558));
        const _0x46cd5e = await _0x0_0x452628['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x2a572d, {
            'headers': _0x2a572d['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x46cd5e['data']['trim'](),
            'expires': _0x3cbb78
        };
    } catch (_0x286ffd) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x286ffd['message']);
    }
}
async function uploadToPixhost(_0x3d1657) {
    try {
        const _0x33ffb8 = new _0x0_0x5251a9();
        _0x33ffb8['append']('img', _0x0_0x2b7760['createReadStream'](_0x3d1657));
        _0x33ffb8['append']('content_type', '0');
        const _0x5a964a = await _0x0_0x452628['post']('https://api.pixhost.to/images', _0x33ffb8, {
            'headers': _0x33ffb8['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x5a964a['data']['show_url']) {
            const _0xc1b60c = _0x5a964a['data']['show_url'];
            const _0x12b007 = await _0x0_0x452628['get'](_0xc1b60c);
            const _0x3dbe46 = _0x12b007['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x3dbe46 && _0x3dbe46[0x1]) {
                return {
                    'status': !![],
                    'url': _0x3dbe46[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x595d8b) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x595d8b['message']);
    }
}
async function uploadToTmpfiles(_0x4855da) {
    try {
        const _0x2ab1c5 = new _0x0_0x5251a9();
        _0x2ab1c5['append']('file', _0x0_0x2b7760['createReadStream'](_0x4855da));
        const _0x36c14c = await _0x0_0x452628['post']('https://tmpfiles.org/api/v1/upload', _0x2ab1c5, {
            'headers': _0x2ab1c5['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x36c14c['data']['status'] === 'success') {
            const _0x39041f = _0x36c14c['data']['data']['url'];
            const _0x1cf30b = _0x39041f['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x1cf30b,
                'page_url': _0x39041f
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x6c5d12) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x6c5d12['message']);
    }
}
async function uploadToQuax(_0x426139) {
    try {
        const _0x15aa65 = new _0x0_0x5251a9();
        _0x15aa65['append']('files[]', _0x0_0x2b7760['createReadStream'](_0x426139));
        const _0x2cf655 = await _0x0_0x452628['post']('https://qu.ax/upload.php', _0x15aa65, {
            'headers': _0x15aa65['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2cf655['data']['success'] && _0x2cf655['data']['files'] && _0x2cf655['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x2cf655['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x467c33) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x467c33['message']);
    }
}
async function uploadToX0(_0x54f6be) {
    try {
        const _0x255a12 = new _0x0_0x5251a9();
        _0x255a12['append']('file', _0x0_0x2b7760['createReadStream'](_0x54f6be));
        const _0x1e2db6 = await _0x0_0x452628['post']('https://x0.at/', _0x255a12, {
            'headers': _0x255a12['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x1e2db6['data']['trim']()
        };
    } catch (_0xc0b691) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0xc0b691['message']);
    }
}
async function uploadToUguu(_0x15d8e2) {
    try {
        const _0x13d2d1 = new _0x0_0x5251a9();
        _0x13d2d1['append']('files[]', _0x0_0x2b7760['createReadStream'](_0x15d8e2));
        const _0x5c8b73 = await _0x0_0x452628['post']('https://uguu.se/upload.php', _0x13d2d1, {
            'headers': { ..._0x13d2d1['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x5c8b73['data'] && _0x5c8b73['data']['success'] && _0x5c8b73['data']['files'] && _0x5c8b73['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x5c8b73['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x3a36c9) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x3a36c9['message']);
    }
}
async function uploadFile(_0x25d30f) {
    const _0x3b1c4c = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x25d30f)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x25d30f)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x25d30f)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x25d30f)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x25d30f)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x25d30f)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x25d30f)
        }
    ];
    for (const _0x22c361 of _0x3b1c4c) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x22c361['name'] + '...');
            const _0x234591 = await _0x22c361['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x22c361['name']);
            return {
                ..._0x234591,
                'service': _0x22c361['name']
            };
        } catch (_0x4b99d9) {
            console['error']('[Upload]\x20✗\x20' + _0x22c361['name'] + '\x20failed:', _0x4b99d9['message']);
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