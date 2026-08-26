import _0x0_0x1e6119 from 'axios';
import _0x0_0x105cda from 'form-data';
import _0x0_0x11f7c9 from 'fs';
async function uploadToCatbox(_0x40ffba) {
    try {
        const _0x322620 = new _0x0_0x105cda();
        _0x322620['append']('reqtype', 'fileupload');
        _0x322620['append']('fileToUpload', _0x0_0x11f7c9['createReadStream'](_0x40ffba));
        const _0x5bc45f = await _0x0_0x1e6119['post']('https://catbox.moe/user/api.php', _0x322620, {
            'headers': _0x322620['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x5bc45f['data']['trim']()
        };
    } catch (_0x2215b3) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x2215b3['message']);
    }
}
async function uploadToPomf2(_0x1e5d4a) {
    try {
        const _0x144b0d = new _0x0_0x105cda();
        _0x144b0d['append']('files[]', _0x0_0x11f7c9['createReadStream'](_0x1e5d4a));
        const _0x3880fd = await _0x0_0x1e6119['post']('https://pomf2.lain.la/upload.php', _0x144b0d, {
            'headers': _0x144b0d['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x3880fd['data']['success'] && _0x3880fd['data']['files'] && _0x3880fd['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x3880fd['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xfa80e1) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0xfa80e1['message']);
    }
}
async function uploadToImgbb(_0x101a00, _0x2b19f3) {
    try {
        const _0x4b6402 = _0x0_0x11f7c9['readFileSync'](_0x101a00);
        const _0x250d31 = _0x4b6402['toString']('base64');
        const _0x47db44 = new _0x0_0x105cda();
        _0x47db44['append']('image', _0x250d31);
        const _0x27b8a8 = await _0x0_0x1e6119['post']('https://api.imgbb.com/1/upload?key=' + _0x2b19f3, _0x47db44, { 'headers': _0x47db44['getHeaders']() });
        if (_0x27b8a8['data']['success']) {
            return {
                'status': !![],
                'url': _0x27b8a8['data']['data']['url'],
                'display_url': _0x27b8a8['data']['data']['display_url'],
                'delete_url': _0x27b8a8['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5bd245) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x5bd245['message']);
    }
}
async function uploadToFreeimage(_0x4f3b10) {
    try {
        const _0x268673 = new _0x0_0x105cda();
        _0x268673['append']('source', _0x0_0x11f7c9['createReadStream'](_0x4f3b10));
        _0x268673['append']('type', 'file');
        _0x268673['append']('action', 'upload');
        const _0x222c54 = await _0x0_0x1e6119['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x268673, {
            'headers': _0x268673['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x222c54['data']['success']) {
            return {
                'status': !![],
                'url': _0x222c54['data']['image']['url'],
                'display_url': _0x222c54['data']['image']['display_url'],
                'delete_url': _0x222c54['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x6d3d1) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x6d3d1['message']);
    }
}
async function uploadToLitterbox(_0x34039c, _0x234c41 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x234c41)) {
            _0x234c41 = '1h';
        }
        const _0x38c7e1 = new _0x0_0x105cda();
        _0x38c7e1['append']('reqtype', 'fileupload');
        _0x38c7e1['append']('time', _0x234c41);
        _0x38c7e1['append']('fileToUpload', _0x0_0x11f7c9['createReadStream'](_0x34039c));
        const _0x4dcb21 = await _0x0_0x1e6119['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x38c7e1, {
            'headers': _0x38c7e1['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x4dcb21['data']['trim'](),
            'expires': _0x234c41
        };
    } catch (_0x579813) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x579813['message']);
    }
}
async function uploadToPixhost(_0x4a23e9) {
    try {
        const _0x5341bf = new _0x0_0x105cda();
        _0x5341bf['append']('img', _0x0_0x11f7c9['createReadStream'](_0x4a23e9));
        _0x5341bf['append']('content_type', '0');
        const _0x45cc38 = await _0x0_0x1e6119['post']('https://api.pixhost.to/images', _0x5341bf, {
            'headers': _0x5341bf['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x45cc38['data']['show_url']) {
            const _0x2c32e2 = _0x45cc38['data']['show_url'];
            const _0x161c36 = await _0x0_0x1e6119['get'](_0x2c32e2);
            const _0x4a3994 = _0x161c36['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x4a3994 && _0x4a3994[0x1]) {
                return {
                    'status': !![],
                    'url': _0x4a3994[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x16ba1e) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x16ba1e['message']);
    }
}
async function uploadToTmpfiles(_0x490831) {
    try {
        const _0x269d1b = new _0x0_0x105cda();
        _0x269d1b['append']('file', _0x0_0x11f7c9['createReadStream'](_0x490831));
        const _0x1e4888 = await _0x0_0x1e6119['post']('https://tmpfiles.org/api/v1/upload', _0x269d1b, {
            'headers': _0x269d1b['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1e4888['data']['status'] === 'success') {
            const _0x437365 = _0x1e4888['data']['data']['url'];
            const _0xe227a = _0x437365['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0xe227a,
                'page_url': _0x437365
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x52c92c) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x52c92c['message']);
    }
}
async function uploadToQuax(_0x33ec29) {
    try {
        const _0x477489 = new _0x0_0x105cda();
        _0x477489['append']('files[]', _0x0_0x11f7c9['createReadStream'](_0x33ec29));
        const _0x1373c7 = await _0x0_0x1e6119['post']('https://qu.ax/upload.php', _0x477489, {
            'headers': _0x477489['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1373c7['data']['success'] && _0x1373c7['data']['files'] && _0x1373c7['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x1373c7['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x19f7d6) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x19f7d6['message']);
    }
}
async function uploadToX0(_0x3c1e71) {
    try {
        const _0x231bcf = new _0x0_0x105cda();
        _0x231bcf['append']('file', _0x0_0x11f7c9['createReadStream'](_0x3c1e71));
        const _0x271964 = await _0x0_0x1e6119['post']('https://x0.at/', _0x231bcf, {
            'headers': _0x231bcf['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x271964['data']['trim']()
        };
    } catch (_0x8a8a3) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x8a8a3['message']);
    }
}
async function uploadToUguu(_0x11e52c) {
    try {
        const _0x46e237 = new _0x0_0x105cda();
        _0x46e237['append']('files[]', _0x0_0x11f7c9['createReadStream'](_0x11e52c));
        const _0x444af1 = await _0x0_0x1e6119['post']('https://uguu.se/upload.php', _0x46e237, {
            'headers': { ..._0x46e237['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x444af1['data'] && _0x444af1['data']['success'] && _0x444af1['data']['files'] && _0x444af1['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x444af1['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x4e2406) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x4e2406['message']);
    }
}
async function uploadFile(_0x4b75a8) {
    const _0x32baf4 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x4b75a8)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x4b75a8)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x4b75a8)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x4b75a8)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x4b75a8)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x4b75a8)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x4b75a8)
        }
    ];
    for (const _0x1049d5 of _0x32baf4) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x1049d5['name'] + '...');
            const _0x2b3e2f = await _0x1049d5['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x1049d5['name']);
            return {
                ..._0x2b3e2f,
                'service': _0x1049d5['name']
            };
        } catch (_0x4bfc07) {
            console['error']('[Upload]\x20✗\x20' + _0x1049d5['name'] + '\x20failed:', _0x4bfc07['message']);
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