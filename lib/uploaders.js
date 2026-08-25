import _0x0_0x55ab92 from 'axios';
import _0x0_0x37fdf6 from 'form-data';
import _0x0_0x1aa74d from 'fs';
async function uploadToCatbox(_0x85d1b3) {
    try {
        const _0x406ab4 = new _0x0_0x37fdf6();
        _0x406ab4['append']('reqtype', 'fileupload');
        _0x406ab4['append']('fileToUpload', _0x0_0x1aa74d['createReadStream'](_0x85d1b3));
        const _0x45c1f0 = await _0x0_0x55ab92['post']('https://catbox.moe/user/api.php', _0x406ab4, {
            'headers': _0x406ab4['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x45c1f0['data']['trim']()
        };
    } catch (_0x348f59) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x348f59['message']);
    }
}
async function uploadToPomf2(_0xf0aca9) {
    try {
        const _0x4e58aa = new _0x0_0x37fdf6();
        _0x4e58aa['append']('files[]', _0x0_0x1aa74d['createReadStream'](_0xf0aca9));
        const _0x32c7d8 = await _0x0_0x55ab92['post']('https://pomf2.lain.la/upload.php', _0x4e58aa, {
            'headers': _0x4e58aa['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x32c7d8['data']['success'] && _0x32c7d8['data']['files'] && _0x32c7d8['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x32c7d8['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x596064) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x596064['message']);
    }
}
async function uploadToImgbb(_0x129f2f, _0x572069) {
    try {
        const _0x103d6d = _0x0_0x1aa74d['readFileSync'](_0x129f2f);
        const _0x1eb58f = _0x103d6d['toString']('base64');
        const _0x375c7f = new _0x0_0x37fdf6();
        _0x375c7f['append']('image', _0x1eb58f);
        const _0x2dfeba = await _0x0_0x55ab92['post']('https://api.imgbb.com/1/upload?key=' + _0x572069, _0x375c7f, { 'headers': _0x375c7f['getHeaders']() });
        if (_0x2dfeba['data']['success']) {
            return {
                'status': !![],
                'url': _0x2dfeba['data']['data']['url'],
                'display_url': _0x2dfeba['data']['data']['display_url'],
                'delete_url': _0x2dfeba['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x335db1) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x335db1['message']);
    }
}
async function uploadToFreeimage(_0x4d6a36) {
    try {
        const _0x4955e9 = new _0x0_0x37fdf6();
        _0x4955e9['append']('source', _0x0_0x1aa74d['createReadStream'](_0x4d6a36));
        _0x4955e9['append']('type', 'file');
        _0x4955e9['append']('action', 'upload');
        const _0x2eab8d = await _0x0_0x55ab92['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x4955e9, {
            'headers': _0x4955e9['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2eab8d['data']['success']) {
            return {
                'status': !![],
                'url': _0x2eab8d['data']['image']['url'],
                'display_url': _0x2eab8d['data']['image']['display_url'],
                'delete_url': _0x2eab8d['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xe6d4ca) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0xe6d4ca['message']);
    }
}
async function uploadToLitterbox(_0x3679c5, _0x5b7d37 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x5b7d37)) {
            _0x5b7d37 = '1h';
        }
        const _0x40e42e = new _0x0_0x37fdf6();
        _0x40e42e['append']('reqtype', 'fileupload');
        _0x40e42e['append']('time', _0x5b7d37);
        _0x40e42e['append']('fileToUpload', _0x0_0x1aa74d['createReadStream'](_0x3679c5));
        const _0x5a79f0 = await _0x0_0x55ab92['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x40e42e, {
            'headers': _0x40e42e['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x5a79f0['data']['trim'](),
            'expires': _0x5b7d37
        };
    } catch (_0x314ac8) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x314ac8['message']);
    }
}
async function uploadToPixhost(_0x520ee9) {
    try {
        const _0x46352f = new _0x0_0x37fdf6();
        _0x46352f['append']('img', _0x0_0x1aa74d['createReadStream'](_0x520ee9));
        _0x46352f['append']('content_type', '0');
        const _0x36ea08 = await _0x0_0x55ab92['post']('https://api.pixhost.to/images', _0x46352f, {
            'headers': _0x46352f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x36ea08['data']['show_url']) {
            const _0x17acdf = _0x36ea08['data']['show_url'];
            const _0x4b0d55 = await _0x0_0x55ab92['get'](_0x17acdf);
            const _0x40008d = _0x4b0d55['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x40008d && _0x40008d[0x1]) {
                return {
                    'status': !![],
                    'url': _0x40008d[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x4bf225) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x4bf225['message']);
    }
}
async function uploadToTmpfiles(_0x5214fe) {
    try {
        const _0x305bfe = new _0x0_0x37fdf6();
        _0x305bfe['append']('file', _0x0_0x1aa74d['createReadStream'](_0x5214fe));
        const _0x4d9472 = await _0x0_0x55ab92['post']('https://tmpfiles.org/api/v1/upload', _0x305bfe, {
            'headers': _0x305bfe['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x4d9472['data']['status'] === 'success') {
            const _0x1277fd = _0x4d9472['data']['data']['url'];
            const _0xdeb7da = _0x1277fd['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0xdeb7da,
                'page_url': _0x1277fd
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5734fa) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x5734fa['message']);
    }
}
async function uploadToQuax(_0x284a2e) {
    try {
        const _0x4674d2 = new _0x0_0x37fdf6();
        _0x4674d2['append']('files[]', _0x0_0x1aa74d['createReadStream'](_0x284a2e));
        const _0x5b1da3 = await _0x0_0x55ab92['post']('https://qu.ax/upload.php', _0x4674d2, {
            'headers': _0x4674d2['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x5b1da3['data']['success'] && _0x5b1da3['data']['files'] && _0x5b1da3['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x5b1da3['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x54e7b7) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x54e7b7['message']);
    }
}
async function uploadToX0(_0x4c6a4c) {
    try {
        const _0x4e240b = new _0x0_0x37fdf6();
        _0x4e240b['append']('file', _0x0_0x1aa74d['createReadStream'](_0x4c6a4c));
        const _0x51fdfc = await _0x0_0x55ab92['post']('https://x0.at/', _0x4e240b, {
            'headers': _0x4e240b['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x51fdfc['data']['trim']()
        };
    } catch (_0x2aed51) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x2aed51['message']);
    }
}
async function uploadToUguu(_0x17babe) {
    try {
        const _0x57b5e7 = new _0x0_0x37fdf6();
        _0x57b5e7['append']('files[]', _0x0_0x1aa74d['createReadStream'](_0x17babe));
        const _0x375018 = await _0x0_0x55ab92['post']('https://uguu.se/upload.php', _0x57b5e7, {
            'headers': { ..._0x57b5e7['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x375018['data'] && _0x375018['data']['success'] && _0x375018['data']['files'] && _0x375018['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x375018['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x14dd85) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x14dd85['message']);
    }
}
async function uploadFile(_0x36fd6b) {
    const _0x3c9211 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x36fd6b)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x36fd6b)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x36fd6b)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x36fd6b)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x36fd6b)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x36fd6b)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x36fd6b)
        }
    ];
    for (const _0x4e2031 of _0x3c9211) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x4e2031['name'] + '...');
            const _0x3ccddb = await _0x4e2031['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x4e2031['name']);
            return {
                ..._0x3ccddb,
                'service': _0x4e2031['name']
            };
        } catch (_0xe9e1c7) {
            console['error']('[Upload]\x20✗\x20' + _0x4e2031['name'] + '\x20failed:', _0xe9e1c7['message']);
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