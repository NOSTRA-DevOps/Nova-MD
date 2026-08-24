import _0x0_0x294c4e from 'axios';
import _0x0_0x3a7cbb from 'form-data';
import _0x0_0x55a29a from 'fs';
async function uploadToCatbox(_0x1c85b4) {
    try {
        const _0x12fa13 = new _0x0_0x3a7cbb();
        _0x12fa13['append']('reqtype', 'fileupload');
        _0x12fa13['append']('fileToUpload', _0x0_0x55a29a['createReadStream'](_0x1c85b4));
        const _0x5e1c2b = await _0x0_0x294c4e['post']('https://catbox.moe/user/api.php', _0x12fa13, {
            'headers': _0x12fa13['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x5e1c2b['data']['trim']()
        };
    } catch (_0x9b5a5a) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x9b5a5a['message']);
    }
}
async function uploadToPomf2(_0x69c6d0) {
    try {
        const _0x5c74b6 = new _0x0_0x3a7cbb();
        _0x5c74b6['append']('files[]', _0x0_0x55a29a['createReadStream'](_0x69c6d0));
        const _0x344540 = await _0x0_0x294c4e['post']('https://pomf2.lain.la/upload.php', _0x5c74b6, {
            'headers': _0x5c74b6['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x344540['data']['success'] && _0x344540['data']['files'] && _0x344540['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x344540['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x24d7a4) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x24d7a4['message']);
    }
}
async function uploadToImgbb(_0x447a44, _0xd3f2a1) {
    try {
        const _0x42707d = _0x0_0x55a29a['readFileSync'](_0x447a44);
        const _0x4fe11f = _0x42707d['toString']('base64');
        const _0x3ff1b5 = new _0x0_0x3a7cbb();
        _0x3ff1b5['append']('image', _0x4fe11f);
        const _0x37bae0 = await _0x0_0x294c4e['post']('https://api.imgbb.com/1/upload?key=' + _0xd3f2a1, _0x3ff1b5, { 'headers': _0x3ff1b5['getHeaders']() });
        if (_0x37bae0['data']['success']) {
            return {
                'status': !![],
                'url': _0x37bae0['data']['data']['url'],
                'display_url': _0x37bae0['data']['data']['display_url'],
                'delete_url': _0x37bae0['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x3c85ee) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x3c85ee['message']);
    }
}
async function uploadToFreeimage(_0x7e16f7) {
    try {
        const _0x3bcb64 = new _0x0_0x3a7cbb();
        _0x3bcb64['append']('source', _0x0_0x55a29a['createReadStream'](_0x7e16f7));
        _0x3bcb64['append']('type', 'file');
        _0x3bcb64['append']('action', 'upload');
        const _0x3e81e7 = await _0x0_0x294c4e['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x3bcb64, {
            'headers': _0x3bcb64['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x3e81e7['data']['success']) {
            return {
                'status': !![],
                'url': _0x3e81e7['data']['image']['url'],
                'display_url': _0x3e81e7['data']['image']['display_url'],
                'delete_url': _0x3e81e7['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x147c52) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x147c52['message']);
    }
}
async function uploadToLitterbox(_0x94f1a0, _0xc9bfc7 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0xc9bfc7)) {
            _0xc9bfc7 = '1h';
        }
        const _0x2f7176 = new _0x0_0x3a7cbb();
        _0x2f7176['append']('reqtype', 'fileupload');
        _0x2f7176['append']('time', _0xc9bfc7);
        _0x2f7176['append']('fileToUpload', _0x0_0x55a29a['createReadStream'](_0x94f1a0));
        const _0xa32c6f = await _0x0_0x294c4e['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x2f7176, {
            'headers': _0x2f7176['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0xa32c6f['data']['trim'](),
            'expires': _0xc9bfc7
        };
    } catch (_0x3f864) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x3f864['message']);
    }
}
async function uploadToPixhost(_0x3a909e) {
    try {
        const _0x2abac9 = new _0x0_0x3a7cbb();
        _0x2abac9['append']('img', _0x0_0x55a29a['createReadStream'](_0x3a909e));
        _0x2abac9['append']('content_type', '0');
        const _0x2a6dbd = await _0x0_0x294c4e['post']('https://api.pixhost.to/images', _0x2abac9, {
            'headers': _0x2abac9['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2a6dbd['data']['show_url']) {
            const _0x3edcf1 = _0x2a6dbd['data']['show_url'];
            const _0xa5d648 = await _0x0_0x294c4e['get'](_0x3edcf1);
            const _0x3f5e23 = _0xa5d648['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x3f5e23 && _0x3f5e23[0x1]) {
                return {
                    'status': !![],
                    'url': _0x3f5e23[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x2629ce) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x2629ce['message']);
    }
}
async function uploadToTmpfiles(_0xfa355d) {
    try {
        const _0x1f3843 = new _0x0_0x3a7cbb();
        _0x1f3843['append']('file', _0x0_0x55a29a['createReadStream'](_0xfa355d));
        const _0x1f3aa4 = await _0x0_0x294c4e['post']('https://tmpfiles.org/api/v1/upload', _0x1f3843, {
            'headers': _0x1f3843['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1f3aa4['data']['status'] === 'success') {
            const _0x468459 = _0x1f3aa4['data']['data']['url'];
            const _0x4d04b1 = _0x468459['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x4d04b1,
                'page_url': _0x468459
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x168841) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x168841['message']);
    }
}
async function uploadToQuax(_0x4b06d5) {
    try {
        const _0x1eca91 = new _0x0_0x3a7cbb();
        _0x1eca91['append']('files[]', _0x0_0x55a29a['createReadStream'](_0x4b06d5));
        const _0x372e44 = await _0x0_0x294c4e['post']('https://qu.ax/upload.php', _0x1eca91, {
            'headers': _0x1eca91['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x372e44['data']['success'] && _0x372e44['data']['files'] && _0x372e44['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x372e44['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x18f3b5) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x18f3b5['message']);
    }
}
async function uploadToX0(_0x27b183) {
    try {
        const _0x243fee = new _0x0_0x3a7cbb();
        _0x243fee['append']('file', _0x0_0x55a29a['createReadStream'](_0x27b183));
        const _0x90967e = await _0x0_0x294c4e['post']('https://x0.at/', _0x243fee, {
            'headers': _0x243fee['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x90967e['data']['trim']()
        };
    } catch (_0x520111) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x520111['message']);
    }
}
async function uploadToUguu(_0x3f23a9) {
    try {
        const _0x168579 = new _0x0_0x3a7cbb();
        _0x168579['append']('files[]', _0x0_0x55a29a['createReadStream'](_0x3f23a9));
        const _0x4468c0 = await _0x0_0x294c4e['post']('https://uguu.se/upload.php', _0x168579, {
            'headers': { ..._0x168579['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x4468c0['data'] && _0x4468c0['data']['success'] && _0x4468c0['data']['files'] && _0x4468c0['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x4468c0['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x23ac85) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x23ac85['message']);
    }
}
async function uploadFile(_0x5dff5c) {
    const _0x106ee5 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x5dff5c)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x5dff5c)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x5dff5c)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x5dff5c)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x5dff5c)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x5dff5c)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x5dff5c)
        }
    ];
    for (const _0x33d045 of _0x106ee5) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x33d045['name'] + '...');
            const _0x51a427 = await _0x33d045['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x33d045['name']);
            return {
                ..._0x51a427,
                'service': _0x33d045['name']
            };
        } catch (_0x3076b6) {
            console['error']('[Upload]\x20✗\x20' + _0x33d045['name'] + '\x20failed:', _0x3076b6['message']);
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