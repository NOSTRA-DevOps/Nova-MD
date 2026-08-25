import _0x0_0x350900 from 'axios';
import _0x0_0x1381d2 from 'form-data';
import _0x0_0x8a850c from 'fs';
async function uploadToCatbox(_0x42af4b) {
    try {
        const _0x2fd201 = new _0x0_0x1381d2();
        _0x2fd201['append']('reqtype', 'fileupload');
        _0x2fd201['append']('fileToUpload', _0x0_0x8a850c['createReadStream'](_0x42af4b));
        const _0x4ad4b0 = await _0x0_0x350900['post']('https://catbox.moe/user/api.php', _0x2fd201, {
            'headers': _0x2fd201['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x4ad4b0['data']['trim']()
        };
    } catch (_0x4de9e3) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x4de9e3['message']);
    }
}
async function uploadToPomf2(_0x57c744) {
    try {
        const _0x107be1 = new _0x0_0x1381d2();
        _0x107be1['append']('files[]', _0x0_0x8a850c['createReadStream'](_0x57c744));
        const _0x4b6db1 = await _0x0_0x350900['post']('https://pomf2.lain.la/upload.php', _0x107be1, {
            'headers': _0x107be1['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x4b6db1['data']['success'] && _0x4b6db1['data']['files'] && _0x4b6db1['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x4b6db1['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x2ac579) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x2ac579['message']);
    }
}
async function uploadToImgbb(_0x41d410, _0x36a15b) {
    try {
        const _0x3805e2 = _0x0_0x8a850c['readFileSync'](_0x41d410);
        const _0xfb01cd = _0x3805e2['toString']('base64');
        const _0xb14f98 = new _0x0_0x1381d2();
        _0xb14f98['append']('image', _0xfb01cd);
        const _0x2e3469 = await _0x0_0x350900['post']('https://api.imgbb.com/1/upload?key=' + _0x36a15b, _0xb14f98, { 'headers': _0xb14f98['getHeaders']() });
        if (_0x2e3469['data']['success']) {
            return {
                'status': !![],
                'url': _0x2e3469['data']['data']['url'],
                'display_url': _0x2e3469['data']['data']['display_url'],
                'delete_url': _0x2e3469['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x45cf28) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x45cf28['message']);
    }
}
async function uploadToFreeimage(_0x3c7791) {
    try {
        const _0x3cfb67 = new _0x0_0x1381d2();
        _0x3cfb67['append']('source', _0x0_0x8a850c['createReadStream'](_0x3c7791));
        _0x3cfb67['append']('type', 'file');
        _0x3cfb67['append']('action', 'upload');
        const _0x2e773f = await _0x0_0x350900['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x3cfb67, {
            'headers': _0x3cfb67['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2e773f['data']['success']) {
            return {
                'status': !![],
                'url': _0x2e773f['data']['image']['url'],
                'display_url': _0x2e773f['data']['image']['display_url'],
                'delete_url': _0x2e773f['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x4c971e) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x4c971e['message']);
    }
}
async function uploadToLitterbox(_0x430867, _0x5a018c = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x5a018c)) {
            _0x5a018c = '1h';
        }
        const _0x3af4d9 = new _0x0_0x1381d2();
        _0x3af4d9['append']('reqtype', 'fileupload');
        _0x3af4d9['append']('time', _0x5a018c);
        _0x3af4d9['append']('fileToUpload', _0x0_0x8a850c['createReadStream'](_0x430867));
        const _0x20e65e = await _0x0_0x350900['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x3af4d9, {
            'headers': _0x3af4d9['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x20e65e['data']['trim'](),
            'expires': _0x5a018c
        };
    } catch (_0x5e3324) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x5e3324['message']);
    }
}
async function uploadToPixhost(_0x37ca1b) {
    try {
        const _0x4b6938 = new _0x0_0x1381d2();
        _0x4b6938['append']('img', _0x0_0x8a850c['createReadStream'](_0x37ca1b));
        _0x4b6938['append']('content_type', '0');
        const _0x17851f = await _0x0_0x350900['post']('https://api.pixhost.to/images', _0x4b6938, {
            'headers': _0x4b6938['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x17851f['data']['show_url']) {
            const _0x976836 = _0x17851f['data']['show_url'];
            const _0x13682e = await _0x0_0x350900['get'](_0x976836);
            const _0x2d43fd = _0x13682e['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x2d43fd && _0x2d43fd[0x1]) {
                return {
                    'status': !![],
                    'url': _0x2d43fd[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x429b27) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x429b27['message']);
    }
}
async function uploadToTmpfiles(_0x732bf1) {
    try {
        const _0x2d754e = new _0x0_0x1381d2();
        _0x2d754e['append']('file', _0x0_0x8a850c['createReadStream'](_0x732bf1));
        const _0x508d82 = await _0x0_0x350900['post']('https://tmpfiles.org/api/v1/upload', _0x2d754e, {
            'headers': _0x2d754e['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x508d82['data']['status'] === 'success') {
            const _0x59894e = _0x508d82['data']['data']['url'];
            const _0x47846f = _0x59894e['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x47846f,
                'page_url': _0x59894e
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x1a2cd4) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x1a2cd4['message']);
    }
}
async function uploadToQuax(_0x562153) {
    try {
        const _0x588759 = new _0x0_0x1381d2();
        _0x588759['append']('files[]', _0x0_0x8a850c['createReadStream'](_0x562153));
        const _0x28a4be = await _0x0_0x350900['post']('https://qu.ax/upload.php', _0x588759, {
            'headers': _0x588759['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x28a4be['data']['success'] && _0x28a4be['data']['files'] && _0x28a4be['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x28a4be['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x4a0ac0) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x4a0ac0['message']);
    }
}
async function uploadToX0(_0x59d0df) {
    try {
        const _0x46fb63 = new _0x0_0x1381d2();
        _0x46fb63['append']('file', _0x0_0x8a850c['createReadStream'](_0x59d0df));
        const _0x49e35b = await _0x0_0x350900['post']('https://x0.at/', _0x46fb63, {
            'headers': _0x46fb63['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x49e35b['data']['trim']()
        };
    } catch (_0x1ae978) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x1ae978['message']);
    }
}
async function uploadToUguu(_0x123dd7) {
    try {
        const _0x1bfbf2 = new _0x0_0x1381d2();
        _0x1bfbf2['append']('files[]', _0x0_0x8a850c['createReadStream'](_0x123dd7));
        const _0x47e83c = await _0x0_0x350900['post']('https://uguu.se/upload.php', _0x1bfbf2, {
            'headers': { ..._0x1bfbf2['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x47e83c['data'] && _0x47e83c['data']['success'] && _0x47e83c['data']['files'] && _0x47e83c['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x47e83c['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x408e2d) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x408e2d['message']);
    }
}
async function uploadFile(_0x4cd621) {
    const _0x4a4051 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x4cd621)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x4cd621)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x4cd621)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x4cd621)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x4cd621)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x4cd621)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x4cd621)
        }
    ];
    for (const _0x551902 of _0x4a4051) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x551902['name'] + '...');
            const _0x244ed1 = await _0x551902['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x551902['name']);
            return {
                ..._0x244ed1,
                'service': _0x551902['name']
            };
        } catch (_0x46f43d) {
            console['error']('[Upload]\x20✗\x20' + _0x551902['name'] + '\x20failed:', _0x46f43d['message']);
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