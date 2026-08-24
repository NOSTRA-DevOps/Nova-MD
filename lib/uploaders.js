import _0x0_0x5c1899 from 'axios';
import _0x0_0x7100a6 from 'form-data';
import _0x0_0x30279e from 'fs';
async function uploadToCatbox(_0xb0012f) {
    try {
        const _0x4e379f = new _0x0_0x7100a6();
        _0x4e379f['append']('reqtype', 'fileupload');
        _0x4e379f['append']('fileToUpload', _0x0_0x30279e['createReadStream'](_0xb0012f));
        const _0x198d4e = await _0x0_0x5c1899['post']('https://catbox.moe/user/api.php', _0x4e379f, {
            'headers': _0x4e379f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x198d4e['data']['trim']()
        };
    } catch (_0x3fd6b4) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x3fd6b4['message']);
    }
}
async function uploadToPomf2(_0x586d0e) {
    try {
        const _0x4120dc = new _0x0_0x7100a6();
        _0x4120dc['append']('files[]', _0x0_0x30279e['createReadStream'](_0x586d0e));
        const _0x1149bc = await _0x0_0x5c1899['post']('https://pomf2.lain.la/upload.php', _0x4120dc, {
            'headers': _0x4120dc['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x1149bc['data']['success'] && _0x1149bc['data']['files'] && _0x1149bc['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x1149bc['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x384667) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x384667['message']);
    }
}
async function uploadToImgbb(_0x451056, _0x5eafb4) {
    try {
        const _0x241164 = _0x0_0x30279e['readFileSync'](_0x451056);
        const _0x255692 = _0x241164['toString']('base64');
        const _0x36c167 = new _0x0_0x7100a6();
        _0x36c167['append']('image', _0x255692);
        const _0x4803f0 = await _0x0_0x5c1899['post']('https://api.imgbb.com/1/upload?key=' + _0x5eafb4, _0x36c167, { 'headers': _0x36c167['getHeaders']() });
        if (_0x4803f0['data']['success']) {
            return {
                'status': !![],
                'url': _0x4803f0['data']['data']['url'],
                'display_url': _0x4803f0['data']['data']['display_url'],
                'delete_url': _0x4803f0['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x650616) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x650616['message']);
    }
}
async function uploadToFreeimage(_0x284d60) {
    try {
        const _0xce7e43 = new _0x0_0x7100a6();
        _0xce7e43['append']('source', _0x0_0x30279e['createReadStream'](_0x284d60));
        _0xce7e43['append']('type', 'file');
        _0xce7e43['append']('action', 'upload');
        const _0xd2eafe = await _0x0_0x5c1899['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0xce7e43, {
            'headers': _0xce7e43['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0xd2eafe['data']['success']) {
            return {
                'status': !![],
                'url': _0xd2eafe['data']['image']['url'],
                'display_url': _0xd2eafe['data']['image']['display_url'],
                'delete_url': _0xd2eafe['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x27b40c) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x27b40c['message']);
    }
}
async function uploadToLitterbox(_0x279205, _0x2865dd = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x2865dd)) {
            _0x2865dd = '1h';
        }
        const _0x2e9791 = new _0x0_0x7100a6();
        _0x2e9791['append']('reqtype', 'fileupload');
        _0x2e9791['append']('time', _0x2865dd);
        _0x2e9791['append']('fileToUpload', _0x0_0x30279e['createReadStream'](_0x279205));
        const _0x59969c = await _0x0_0x5c1899['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x2e9791, {
            'headers': _0x2e9791['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x59969c['data']['trim'](),
            'expires': _0x2865dd
        };
    } catch (_0x5a54cd) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x5a54cd['message']);
    }
}
async function uploadToPixhost(_0x33cda7) {
    try {
        const _0x5940df = new _0x0_0x7100a6();
        _0x5940df['append']('img', _0x0_0x30279e['createReadStream'](_0x33cda7));
        _0x5940df['append']('content_type', '0');
        const _0x2b7f3c = await _0x0_0x5c1899['post']('https://api.pixhost.to/images', _0x5940df, {
            'headers': _0x5940df['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2b7f3c['data']['show_url']) {
            const _0x2baa9f = _0x2b7f3c['data']['show_url'];
            const _0x3440ec = await _0x0_0x5c1899['get'](_0x2baa9f);
            const _0x419835 = _0x3440ec['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x419835 && _0x419835[0x1]) {
                return {
                    'status': !![],
                    'url': _0x419835[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x4633c0) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x4633c0['message']);
    }
}
async function uploadToTmpfiles(_0x5433d5) {
    try {
        const _0x1cc05f = new _0x0_0x7100a6();
        _0x1cc05f['append']('file', _0x0_0x30279e['createReadStream'](_0x5433d5));
        const _0x14acca = await _0x0_0x5c1899['post']('https://tmpfiles.org/api/v1/upload', _0x1cc05f, {
            'headers': _0x1cc05f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x14acca['data']['status'] === 'success') {
            const _0x460194 = _0x14acca['data']['data']['url'];
            const _0x2119b5 = _0x460194['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x2119b5,
                'page_url': _0x460194
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x308acf) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x308acf['message']);
    }
}
async function uploadToQuax(_0x46d44d) {
    try {
        const _0x432e72 = new _0x0_0x7100a6();
        _0x432e72['append']('files[]', _0x0_0x30279e['createReadStream'](_0x46d44d));
        const _0x17d1e5 = await _0x0_0x5c1899['post']('https://qu.ax/upload.php', _0x432e72, {
            'headers': _0x432e72['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x17d1e5['data']['success'] && _0x17d1e5['data']['files'] && _0x17d1e5['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x17d1e5['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xb17b21) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0xb17b21['message']);
    }
}
async function uploadToX0(_0x3c2bb2) {
    try {
        const _0x41649f = new _0x0_0x7100a6();
        _0x41649f['append']('file', _0x0_0x30279e['createReadStream'](_0x3c2bb2));
        const _0x2e6321 = await _0x0_0x5c1899['post']('https://x0.at/', _0x41649f, {
            'headers': _0x41649f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x2e6321['data']['trim']()
        };
    } catch (_0x36f786) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x36f786['message']);
    }
}
async function uploadToUguu(_0x5be344) {
    try {
        const _0x531cf4 = new _0x0_0x7100a6();
        _0x531cf4['append']('files[]', _0x0_0x30279e['createReadStream'](_0x5be344));
        const _0x17fd2d = await _0x0_0x5c1899['post']('https://uguu.se/upload.php', _0x531cf4, {
            'headers': { ..._0x531cf4['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x17fd2d['data'] && _0x17fd2d['data']['success'] && _0x17fd2d['data']['files'] && _0x17fd2d['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x17fd2d['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x17567f) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x17567f['message']);
    }
}
async function uploadFile(_0x527c8e) {
    const _0x1713b0 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x527c8e)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x527c8e)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x527c8e)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x527c8e)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x527c8e)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x527c8e)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x527c8e)
        }
    ];
    for (const _0xecbb39 of _0x1713b0) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0xecbb39['name'] + '...');
            const _0x579080 = await _0xecbb39['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0xecbb39['name']);
            return {
                ..._0x579080,
                'service': _0xecbb39['name']
            };
        } catch (_0x561fa7) {
            console['error']('[Upload]\x20✗\x20' + _0xecbb39['name'] + '\x20failed:', _0x561fa7['message']);
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