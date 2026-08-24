import _0x0_0x1d3d10 from 'axios';
import _0x0_0x39d1bf from 'form-data';
import _0x0_0x45a46c from 'fs';
async function uploadToCatbox(_0x2cb1c8) {
    try {
        const _0x3ab414 = new _0x0_0x39d1bf();
        _0x3ab414['append']('reqtype', 'fileupload');
        _0x3ab414['append']('fileToUpload', _0x0_0x45a46c['createReadStream'](_0x2cb1c8));
        const _0x29fbf1 = await _0x0_0x1d3d10['post']('https://catbox.moe/user/api.php', _0x3ab414, {
            'headers': _0x3ab414['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x29fbf1['data']['trim']()
        };
    } catch (_0x3983fd) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x3983fd['message']);
    }
}
async function uploadToPomf2(_0x473521) {
    try {
        const _0x3013f0 = new _0x0_0x39d1bf();
        _0x3013f0['append']('files[]', _0x0_0x45a46c['createReadStream'](_0x473521));
        const _0xb9b387 = await _0x0_0x1d3d10['post']('https://pomf2.lain.la/upload.php', _0x3013f0, {
            'headers': _0x3013f0['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0xb9b387['data']['success'] && _0xb9b387['data']['files'] && _0xb9b387['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0xb9b387['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x3e1f63) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x3e1f63['message']);
    }
}
async function uploadToImgbb(_0x14a35f, _0x552c43) {
    try {
        const _0x32bab9 = _0x0_0x45a46c['readFileSync'](_0x14a35f);
        const _0x24ae6b = _0x32bab9['toString']('base64');
        const _0x542bb9 = new _0x0_0x39d1bf();
        _0x542bb9['append']('image', _0x24ae6b);
        const _0x44f92f = await _0x0_0x1d3d10['post']('https://api.imgbb.com/1/upload?key=' + _0x552c43, _0x542bb9, { 'headers': _0x542bb9['getHeaders']() });
        if (_0x44f92f['data']['success']) {
            return {
                'status': !![],
                'url': _0x44f92f['data']['data']['url'],
                'display_url': _0x44f92f['data']['data']['display_url'],
                'delete_url': _0x44f92f['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xcfce4b) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0xcfce4b['message']);
    }
}
async function uploadToFreeimage(_0x5e013) {
    try {
        const _0x562b31 = new _0x0_0x39d1bf();
        _0x562b31['append']('source', _0x0_0x45a46c['createReadStream'](_0x5e013));
        _0x562b31['append']('type', 'file');
        _0x562b31['append']('action', 'upload');
        const _0x584280 = await _0x0_0x1d3d10['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x562b31, {
            'headers': _0x562b31['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x584280['data']['success']) {
            return {
                'status': !![],
                'url': _0x584280['data']['image']['url'],
                'display_url': _0x584280['data']['image']['display_url'],
                'delete_url': _0x584280['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x300b6e) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x300b6e['message']);
    }
}
async function uploadToLitterbox(_0x106894, _0x389998 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x389998)) {
            _0x389998 = '1h';
        }
        const _0x4534ce = new _0x0_0x39d1bf();
        _0x4534ce['append']('reqtype', 'fileupload');
        _0x4534ce['append']('time', _0x389998);
        _0x4534ce['append']('fileToUpload', _0x0_0x45a46c['createReadStream'](_0x106894));
        const _0x3ce793 = await _0x0_0x1d3d10['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x4534ce, {
            'headers': _0x4534ce['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x3ce793['data']['trim'](),
            'expires': _0x389998
        };
    } catch (_0x370e12) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x370e12['message']);
    }
}
async function uploadToPixhost(_0x5afd04) {
    try {
        const _0x14ac83 = new _0x0_0x39d1bf();
        _0x14ac83['append']('img', _0x0_0x45a46c['createReadStream'](_0x5afd04));
        _0x14ac83['append']('content_type', '0');
        const _0x458655 = await _0x0_0x1d3d10['post']('https://api.pixhost.to/images', _0x14ac83, {
            'headers': _0x14ac83['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x458655['data']['show_url']) {
            const _0xb6f49e = _0x458655['data']['show_url'];
            const _0x3d3f2b = await _0x0_0x1d3d10['get'](_0xb6f49e);
            const _0x360406 = _0x3d3f2b['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x360406 && _0x360406[0x1]) {
                return {
                    'status': !![],
                    'url': _0x360406[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x22c57f) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x22c57f['message']);
    }
}
async function uploadToTmpfiles(_0xf1ae4f) {
    try {
        const _0x56b299 = new _0x0_0x39d1bf();
        _0x56b299['append']('file', _0x0_0x45a46c['createReadStream'](_0xf1ae4f));
        const _0x3bbbcb = await _0x0_0x1d3d10['post']('https://tmpfiles.org/api/v1/upload', _0x56b299, {
            'headers': _0x56b299['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x3bbbcb['data']['status'] === 'success') {
            const _0x4b55b1 = _0x3bbbcb['data']['data']['url'];
            const _0x5332b8 = _0x4b55b1['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x5332b8,
                'page_url': _0x4b55b1
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x59de0c) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x59de0c['message']);
    }
}
async function uploadToQuax(_0x3a23b4) {
    try {
        const _0x231b6c = new _0x0_0x39d1bf();
        _0x231b6c['append']('files[]', _0x0_0x45a46c['createReadStream'](_0x3a23b4));
        const _0x3eea96 = await _0x0_0x1d3d10['post']('https://qu.ax/upload.php', _0x231b6c, {
            'headers': _0x231b6c['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x3eea96['data']['success'] && _0x3eea96['data']['files'] && _0x3eea96['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x3eea96['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x39832c) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x39832c['message']);
    }
}
async function uploadToX0(_0x12cfb4) {
    try {
        const _0x20215f = new _0x0_0x39d1bf();
        _0x20215f['append']('file', _0x0_0x45a46c['createReadStream'](_0x12cfb4));
        const _0x1aefc8 = await _0x0_0x1d3d10['post']('https://x0.at/', _0x20215f, {
            'headers': _0x20215f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x1aefc8['data']['trim']()
        };
    } catch (_0x190ab7) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x190ab7['message']);
    }
}
async function uploadToUguu(_0x5b072b) {
    try {
        const _0x2dfdd8 = new _0x0_0x39d1bf();
        _0x2dfdd8['append']('files[]', _0x0_0x45a46c['createReadStream'](_0x5b072b));
        const _0x1ab2cd = await _0x0_0x1d3d10['post']('https://uguu.se/upload.php', _0x2dfdd8, {
            'headers': { ..._0x2dfdd8['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1ab2cd['data'] && _0x1ab2cd['data']['success'] && _0x1ab2cd['data']['files'] && _0x1ab2cd['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x1ab2cd['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x1b0def) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x1b0def['message']);
    }
}
async function uploadFile(_0x3f2ab8) {
    const _0x5958bd = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x3f2ab8)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x3f2ab8)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x3f2ab8)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x3f2ab8)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x3f2ab8)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x3f2ab8)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x3f2ab8)
        }
    ];
    for (const _0x27bbc8 of _0x5958bd) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x27bbc8['name'] + '...');
            const _0x4b76f7 = await _0x27bbc8['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x27bbc8['name']);
            return {
                ..._0x4b76f7,
                'service': _0x27bbc8['name']
            };
        } catch (_0x29ac98) {
            console['error']('[Upload]\x20✗\x20' + _0x27bbc8['name'] + '\x20failed:', _0x29ac98['message']);
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