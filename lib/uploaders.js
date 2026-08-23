import _0x0_0x54e625 from 'axios';
import _0x0_0x308dcb from 'form-data';
import _0x0_0x537d6f from 'fs';
async function uploadToCatbox(_0x2eff0c) {
    try {
        const _0x43c75a = new _0x0_0x308dcb();
        _0x43c75a['append']('reqtype', 'fileupload');
        _0x43c75a['append']('fileToUpload', _0x0_0x537d6f['createReadStream'](_0x2eff0c));
        const _0x465779 = await _0x0_0x54e625['post']('https://catbox.moe/user/api.php', _0x43c75a, {
            'headers': _0x43c75a['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x465779['data']['trim']()
        };
    } catch (_0x24e37e) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x24e37e['message']);
    }
}
async function uploadToPomf2(_0x98badc) {
    try {
        const _0x3d9bf3 = new _0x0_0x308dcb();
        _0x3d9bf3['append']('files[]', _0x0_0x537d6f['createReadStream'](_0x98badc));
        const _0x4d6b3c = await _0x0_0x54e625['post']('https://pomf2.lain.la/upload.php', _0x3d9bf3, {
            'headers': _0x3d9bf3['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x4d6b3c['data']['success'] && _0x4d6b3c['data']['files'] && _0x4d6b3c['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x4d6b3c['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x20325a) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x20325a['message']);
    }
}
async function uploadToImgbb(_0x3b350d, _0x18d663) {
    try {
        const _0x285534 = _0x0_0x537d6f['readFileSync'](_0x3b350d);
        const _0x18de46 = _0x285534['toString']('base64');
        const _0x21a7ae = new _0x0_0x308dcb();
        _0x21a7ae['append']('image', _0x18de46);
        const _0x494143 = await _0x0_0x54e625['post']('https://api.imgbb.com/1/upload?key=' + _0x18d663, _0x21a7ae, { 'headers': _0x21a7ae['getHeaders']() });
        if (_0x494143['data']['success']) {
            return {
                'status': !![],
                'url': _0x494143['data']['data']['url'],
                'display_url': _0x494143['data']['data']['display_url'],
                'delete_url': _0x494143['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5dde32) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x5dde32['message']);
    }
}
async function uploadToFreeimage(_0x34ff77) {
    try {
        const _0xaa43b8 = new _0x0_0x308dcb();
        _0xaa43b8['append']('source', _0x0_0x537d6f['createReadStream'](_0x34ff77));
        _0xaa43b8['append']('type', 'file');
        _0xaa43b8['append']('action', 'upload');
        const _0x3d1f72 = await _0x0_0x54e625['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0xaa43b8, {
            'headers': _0xaa43b8['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x3d1f72['data']['success']) {
            return {
                'status': !![],
                'url': _0x3d1f72['data']['image']['url'],
                'display_url': _0x3d1f72['data']['image']['display_url'],
                'delete_url': _0x3d1f72['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xb48ace) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0xb48ace['message']);
    }
}
async function uploadToLitterbox(_0x48c1a7, _0x230c43 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x230c43)) {
            _0x230c43 = '1h';
        }
        const _0x2daf3f = new _0x0_0x308dcb();
        _0x2daf3f['append']('reqtype', 'fileupload');
        _0x2daf3f['append']('time', _0x230c43);
        _0x2daf3f['append']('fileToUpload', _0x0_0x537d6f['createReadStream'](_0x48c1a7));
        const _0x15c977 = await _0x0_0x54e625['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x2daf3f, {
            'headers': _0x2daf3f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x15c977['data']['trim'](),
            'expires': _0x230c43
        };
    } catch (_0x1abdf8) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x1abdf8['message']);
    }
}
async function uploadToPixhost(_0xd0b0e9) {
    try {
        const _0x5fbde7 = new _0x0_0x308dcb();
        _0x5fbde7['append']('img', _0x0_0x537d6f['createReadStream'](_0xd0b0e9));
        _0x5fbde7['append']('content_type', '0');
        const _0x547ebb = await _0x0_0x54e625['post']('https://api.pixhost.to/images', _0x5fbde7, {
            'headers': _0x5fbde7['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x547ebb['data']['show_url']) {
            const _0x8224c6 = _0x547ebb['data']['show_url'];
            const _0x3992d1 = await _0x0_0x54e625['get'](_0x8224c6);
            const _0x8e0700 = _0x3992d1['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x8e0700 && _0x8e0700[0x1]) {
                return {
                    'status': !![],
                    'url': _0x8e0700[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x8504d5) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x8504d5['message']);
    }
}
async function uploadToTmpfiles(_0x5401e4) {
    try {
        const _0x3051e8 = new _0x0_0x308dcb();
        _0x3051e8['append']('file', _0x0_0x537d6f['createReadStream'](_0x5401e4));
        const _0x441189 = await _0x0_0x54e625['post']('https://tmpfiles.org/api/v1/upload', _0x3051e8, {
            'headers': _0x3051e8['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x441189['data']['status'] === 'success') {
            const _0x551235 = _0x441189['data']['data']['url'];
            const _0x854392 = _0x551235['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x854392,
                'page_url': _0x551235
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x28ba2b) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x28ba2b['message']);
    }
}
async function uploadToQuax(_0x203765) {
    try {
        const _0x28f980 = new _0x0_0x308dcb();
        _0x28f980['append']('files[]', _0x0_0x537d6f['createReadStream'](_0x203765));
        const _0x59d387 = await _0x0_0x54e625['post']('https://qu.ax/upload.php', _0x28f980, {
            'headers': _0x28f980['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x59d387['data']['success'] && _0x59d387['data']['files'] && _0x59d387['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x59d387['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x2391d2) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x2391d2['message']);
    }
}
async function uploadToX0(_0x1c0ac5) {
    try {
        const _0x247055 = new _0x0_0x308dcb();
        _0x247055['append']('file', _0x0_0x537d6f['createReadStream'](_0x1c0ac5));
        const _0x2c779e = await _0x0_0x54e625['post']('https://x0.at/', _0x247055, {
            'headers': _0x247055['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x2c779e['data']['trim']()
        };
    } catch (_0x36966a) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x36966a['message']);
    }
}
async function uploadToUguu(_0x44a092) {
    try {
        const _0x139ba1 = new _0x0_0x308dcb();
        _0x139ba1['append']('files[]', _0x0_0x537d6f['createReadStream'](_0x44a092));
        const _0x194684 = await _0x0_0x54e625['post']('https://uguu.se/upload.php', _0x139ba1, {
            'headers': { ..._0x139ba1['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x194684['data'] && _0x194684['data']['success'] && _0x194684['data']['files'] && _0x194684['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x194684['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x1b35a7) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x1b35a7['message']);
    }
}
async function uploadFile(_0x2b1fdd) {
    const _0x573d9d = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x2b1fdd)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x2b1fdd)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x2b1fdd)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x2b1fdd)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x2b1fdd)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x2b1fdd)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x2b1fdd)
        }
    ];
    for (const _0x5b5a5 of _0x573d9d) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x5b5a5['name'] + '...');
            const _0x1efc1a = await _0x5b5a5['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x5b5a5['name']);
            return {
                ..._0x1efc1a,
                'service': _0x5b5a5['name']
            };
        } catch (_0x4e399c) {
            console['error']('[Upload]\x20✗\x20' + _0x5b5a5['name'] + '\x20failed:', _0x4e399c['message']);
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