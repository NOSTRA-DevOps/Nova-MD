import _0x0_0x74bb32 from 'axios';
import _0x0_0x18ba4d from 'form-data';
import _0x0_0x18d993 from 'fs';
async function uploadToCatbox(_0x2b27b0) {
    try {
        const _0xfac49a = new _0x0_0x18ba4d();
        _0xfac49a['append']('reqtype', 'fileupload');
        _0xfac49a['append']('fileToUpload', _0x0_0x18d993['createReadStream'](_0x2b27b0));
        const _0x10a341 = await _0x0_0x74bb32['post']('https://catbox.moe/user/api.php', _0xfac49a, {
            'headers': _0xfac49a['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x10a341['data']['trim']()
        };
    } catch (_0x224cf1) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x224cf1['message']);
    }
}
async function uploadToPomf2(_0x205266) {
    try {
        const _0x46f6be = new _0x0_0x18ba4d();
        _0x46f6be['append']('files[]', _0x0_0x18d993['createReadStream'](_0x205266));
        const _0x54b6c2 = await _0x0_0x74bb32['post']('https://pomf2.lain.la/upload.php', _0x46f6be, {
            'headers': _0x46f6be['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x54b6c2['data']['success'] && _0x54b6c2['data']['files'] && _0x54b6c2['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x54b6c2['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x54bb55) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x54bb55['message']);
    }
}
async function uploadToImgbb(_0x3bd7c1, _0x24e99c) {
    try {
        const _0x29b2c3 = _0x0_0x18d993['readFileSync'](_0x3bd7c1);
        const _0x2f878d = _0x29b2c3['toString']('base64');
        const _0x23ab15 = new _0x0_0x18ba4d();
        _0x23ab15['append']('image', _0x2f878d);
        const _0x1baad5 = await _0x0_0x74bb32['post']('https://api.imgbb.com/1/upload?key=' + _0x24e99c, _0x23ab15, { 'headers': _0x23ab15['getHeaders']() });
        if (_0x1baad5['data']['success']) {
            return {
                'status': !![],
                'url': _0x1baad5['data']['data']['url'],
                'display_url': _0x1baad5['data']['data']['display_url'],
                'delete_url': _0x1baad5['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x7c3297) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x7c3297['message']);
    }
}
async function uploadToFreeimage(_0x265b2f) {
    try {
        const _0x2531c6 = new _0x0_0x18ba4d();
        _0x2531c6['append']('source', _0x0_0x18d993['createReadStream'](_0x265b2f));
        _0x2531c6['append']('type', 'file');
        _0x2531c6['append']('action', 'upload');
        const _0x47f881 = await _0x0_0x74bb32['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x2531c6, {
            'headers': _0x2531c6['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x47f881['data']['success']) {
            return {
                'status': !![],
                'url': _0x47f881['data']['image']['url'],
                'display_url': _0x47f881['data']['image']['display_url'],
                'delete_url': _0x47f881['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x1be8cf) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x1be8cf['message']);
    }
}
async function uploadToLitterbox(_0x4f475f, _0x466e2e = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x466e2e)) {
            _0x466e2e = '1h';
        }
        const _0x3f7668 = new _0x0_0x18ba4d();
        _0x3f7668['append']('reqtype', 'fileupload');
        _0x3f7668['append']('time', _0x466e2e);
        _0x3f7668['append']('fileToUpload', _0x0_0x18d993['createReadStream'](_0x4f475f));
        const _0x18d2c5 = await _0x0_0x74bb32['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x3f7668, {
            'headers': _0x3f7668['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x18d2c5['data']['trim'](),
            'expires': _0x466e2e
        };
    } catch (_0x3a2a7d) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x3a2a7d['message']);
    }
}
async function uploadToPixhost(_0x4871b3) {
    try {
        const _0x4e8f1c = new _0x0_0x18ba4d();
        _0x4e8f1c['append']('img', _0x0_0x18d993['createReadStream'](_0x4871b3));
        _0x4e8f1c['append']('content_type', '0');
        const _0x5d317b = await _0x0_0x74bb32['post']('https://api.pixhost.to/images', _0x4e8f1c, {
            'headers': _0x4e8f1c['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x5d317b['data']['show_url']) {
            const _0x36e7d9 = _0x5d317b['data']['show_url'];
            const _0x1d0dd9 = await _0x0_0x74bb32['get'](_0x36e7d9);
            const _0x3dcdff = _0x1d0dd9['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x3dcdff && _0x3dcdff[0x1]) {
                return {
                    'status': !![],
                    'url': _0x3dcdff[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x512367) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x512367['message']);
    }
}
async function uploadToTmpfiles(_0x49e05c) {
    try {
        const _0x312685 = new _0x0_0x18ba4d();
        _0x312685['append']('file', _0x0_0x18d993['createReadStream'](_0x49e05c));
        const _0x50ee63 = await _0x0_0x74bb32['post']('https://tmpfiles.org/api/v1/upload', _0x312685, {
            'headers': _0x312685['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x50ee63['data']['status'] === 'success') {
            const _0x5c907e = _0x50ee63['data']['data']['url'];
            const _0x34c396 = _0x5c907e['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x34c396,
                'page_url': _0x5c907e
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x45f9ad) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x45f9ad['message']);
    }
}
async function uploadToQuax(_0x363672) {
    try {
        const _0x2d33ed = new _0x0_0x18ba4d();
        _0x2d33ed['append']('files[]', _0x0_0x18d993['createReadStream'](_0x363672));
        const _0x1b0ccf = await _0x0_0x74bb32['post']('https://qu.ax/upload.php', _0x2d33ed, {
            'headers': _0x2d33ed['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1b0ccf['data']['success'] && _0x1b0ccf['data']['files'] && _0x1b0ccf['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x1b0ccf['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x30003f) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x30003f['message']);
    }
}
async function uploadToX0(_0x20f56b) {
    try {
        const _0x259622 = new _0x0_0x18ba4d();
        _0x259622['append']('file', _0x0_0x18d993['createReadStream'](_0x20f56b));
        const _0x2bf1ca = await _0x0_0x74bb32['post']('https://x0.at/', _0x259622, {
            'headers': _0x259622['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x2bf1ca['data']['trim']()
        };
    } catch (_0x2e33e3) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x2e33e3['message']);
    }
}
async function uploadToUguu(_0x3733cb) {
    try {
        const _0x3a0a11 = new _0x0_0x18ba4d();
        _0x3a0a11['append']('files[]', _0x0_0x18d993['createReadStream'](_0x3733cb));
        const _0x5b5641 = await _0x0_0x74bb32['post']('https://uguu.se/upload.php', _0x3a0a11, {
            'headers': { ..._0x3a0a11['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x5b5641['data'] && _0x5b5641['data']['success'] && _0x5b5641['data']['files'] && _0x5b5641['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x5b5641['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0xc9936) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0xc9936['message']);
    }
}
async function uploadFile(_0x44a348) {
    const _0x1358af = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x44a348)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x44a348)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x44a348)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x44a348)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x44a348)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x44a348)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x44a348)
        }
    ];
    for (const _0xf70f6c of _0x1358af) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0xf70f6c['name'] + '...');
            const _0x42a285 = await _0xf70f6c['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0xf70f6c['name']);
            return {
                ..._0x42a285,
                'service': _0xf70f6c['name']
            };
        } catch (_0x3b36ba) {
            console['error']('[Upload]\x20✗\x20' + _0xf70f6c['name'] + '\x20failed:', _0x3b36ba['message']);
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