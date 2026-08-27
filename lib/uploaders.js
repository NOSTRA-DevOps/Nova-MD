import _0x0_0xff1128 from 'axios';
import _0x0_0x2a8b21 from 'form-data';
import _0x0_0x4b28e4 from 'fs';
async function uploadToCatbox(_0x6b49a4) {
    try {
        const _0x2b8943 = new _0x0_0x2a8b21();
        _0x2b8943['append']('reqtype', 'fileupload');
        _0x2b8943['append']('fileToUpload', _0x0_0x4b28e4['createReadStream'](_0x6b49a4));
        const _0x3659be = await _0x0_0xff1128['post']('https://catbox.moe/user/api.php', _0x2b8943, {
            'headers': _0x2b8943['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x3659be['data']['trim']()
        };
    } catch (_0x11bad1) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x11bad1['message']);
    }
}
async function uploadToPomf2(_0x6b2394) {
    try {
        const _0x2bb050 = new _0x0_0x2a8b21();
        _0x2bb050['append']('files[]', _0x0_0x4b28e4['createReadStream'](_0x6b2394));
        const _0x2995a9 = await _0x0_0xff1128['post']('https://pomf2.lain.la/upload.php', _0x2bb050, {
            'headers': _0x2bb050['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x2995a9['data']['success'] && _0x2995a9['data']['files'] && _0x2995a9['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x2995a9['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x209666) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x209666['message']);
    }
}
async function uploadToImgbb(_0x411bd2, _0x40aaad) {
    try {
        const _0x2118d5 = _0x0_0x4b28e4['readFileSync'](_0x411bd2);
        const _0x178bb4 = _0x2118d5['toString']('base64');
        const _0x4f87c4 = new _0x0_0x2a8b21();
        _0x4f87c4['append']('image', _0x178bb4);
        const _0x4d2ea3 = await _0x0_0xff1128['post']('https://api.imgbb.com/1/upload?key=' + _0x40aaad, _0x4f87c4, { 'headers': _0x4f87c4['getHeaders']() });
        if (_0x4d2ea3['data']['success']) {
            return {
                'status': !![],
                'url': _0x4d2ea3['data']['data']['url'],
                'display_url': _0x4d2ea3['data']['data']['display_url'],
                'delete_url': _0x4d2ea3['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xd8f61) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0xd8f61['message']);
    }
}
async function uploadToFreeimage(_0xaa6606) {
    try {
        const _0x3fc41d = new _0x0_0x2a8b21();
        _0x3fc41d['append']('source', _0x0_0x4b28e4['createReadStream'](_0xaa6606));
        _0x3fc41d['append']('type', 'file');
        _0x3fc41d['append']('action', 'upload');
        const _0x28a978 = await _0x0_0xff1128['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x3fc41d, {
            'headers': _0x3fc41d['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x28a978['data']['success']) {
            return {
                'status': !![],
                'url': _0x28a978['data']['image']['url'],
                'display_url': _0x28a978['data']['image']['display_url'],
                'delete_url': _0x28a978['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x2164d5) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x2164d5['message']);
    }
}
async function uploadToLitterbox(_0x2f2185, _0x38710b = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x38710b)) {
            _0x38710b = '1h';
        }
        const _0x8bae77 = new _0x0_0x2a8b21();
        _0x8bae77['append']('reqtype', 'fileupload');
        _0x8bae77['append']('time', _0x38710b);
        _0x8bae77['append']('fileToUpload', _0x0_0x4b28e4['createReadStream'](_0x2f2185));
        const _0x38c6ff = await _0x0_0xff1128['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x8bae77, {
            'headers': _0x8bae77['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x38c6ff['data']['trim'](),
            'expires': _0x38710b
        };
    } catch (_0x120f57) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x120f57['message']);
    }
}
async function uploadToPixhost(_0x33c5ae) {
    try {
        const _0x2b3ac2 = new _0x0_0x2a8b21();
        _0x2b3ac2['append']('img', _0x0_0x4b28e4['createReadStream'](_0x33c5ae));
        _0x2b3ac2['append']('content_type', '0');
        const _0x44053c = await _0x0_0xff1128['post']('https://api.pixhost.to/images', _0x2b3ac2, {
            'headers': _0x2b3ac2['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x44053c['data']['show_url']) {
            const _0x41d2e7 = _0x44053c['data']['show_url'];
            const _0x4653c6 = await _0x0_0xff1128['get'](_0x41d2e7);
            const _0x253ae8 = _0x4653c6['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x253ae8 && _0x253ae8[0x1]) {
                return {
                    'status': !![],
                    'url': _0x253ae8[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x13c95d) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x13c95d['message']);
    }
}
async function uploadToTmpfiles(_0x5acef9) {
    try {
        const _0x6bf8c7 = new _0x0_0x2a8b21();
        _0x6bf8c7['append']('file', _0x0_0x4b28e4['createReadStream'](_0x5acef9));
        const _0x504bea = await _0x0_0xff1128['post']('https://tmpfiles.org/api/v1/upload', _0x6bf8c7, {
            'headers': _0x6bf8c7['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x504bea['data']['status'] === 'success') {
            const _0x1ee5fc = _0x504bea['data']['data']['url'];
            const _0x3d32ae = _0x1ee5fc['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x3d32ae,
                'page_url': _0x1ee5fc
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x47fb76) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x47fb76['message']);
    }
}
async function uploadToQuax(_0x1035b7) {
    try {
        const _0x325a17 = new _0x0_0x2a8b21();
        _0x325a17['append']('files[]', _0x0_0x4b28e4['createReadStream'](_0x1035b7));
        const _0x57b718 = await _0x0_0xff1128['post']('https://qu.ax/upload.php', _0x325a17, {
            'headers': _0x325a17['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x57b718['data']['success'] && _0x57b718['data']['files'] && _0x57b718['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x57b718['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x52b4a9) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x52b4a9['message']);
    }
}
async function uploadToX0(_0xef26b5) {
    try {
        const _0x356782 = new _0x0_0x2a8b21();
        _0x356782['append']('file', _0x0_0x4b28e4['createReadStream'](_0xef26b5));
        const _0x44ded5 = await _0x0_0xff1128['post']('https://x0.at/', _0x356782, {
            'headers': _0x356782['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x44ded5['data']['trim']()
        };
    } catch (_0x21a7ce) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x21a7ce['message']);
    }
}
async function uploadToUguu(_0x3d99b2) {
    try {
        const _0x212cbb = new _0x0_0x2a8b21();
        _0x212cbb['append']('files[]', _0x0_0x4b28e4['createReadStream'](_0x3d99b2));
        const _0x4200d9 = await _0x0_0xff1128['post']('https://uguu.se/upload.php', _0x212cbb, {
            'headers': { ..._0x212cbb['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x4200d9['data'] && _0x4200d9['data']['success'] && _0x4200d9['data']['files'] && _0x4200d9['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x4200d9['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x3c3828) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x3c3828['message']);
    }
}
async function uploadFile(_0x3adcf6) {
    const _0x5e67e4 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x3adcf6)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x3adcf6)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x3adcf6)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x3adcf6)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x3adcf6)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x3adcf6)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x3adcf6)
        }
    ];
    for (const _0x32158d of _0x5e67e4) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x32158d['name'] + '...');
            const _0x771a43 = await _0x32158d['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x32158d['name']);
            return {
                ..._0x771a43,
                'service': _0x32158d['name']
            };
        } catch (_0x2184a0) {
            console['error']('[Upload]\x20✗\x20' + _0x32158d['name'] + '\x20failed:', _0x2184a0['message']);
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