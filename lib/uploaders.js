import _0x0_0x5cd968 from 'axios';
import _0x0_0xe75dcd from 'form-data';
import _0x0_0x115062 from 'fs';
async function uploadToCatbox(_0x740553) {
    try {
        const _0x19569e = new _0x0_0xe75dcd();
        _0x19569e['append']('reqtype', 'fileupload');
        _0x19569e['append']('fileToUpload', _0x0_0x115062['createReadStream'](_0x740553));
        const _0x4951ff = await _0x0_0x5cd968['post']('https://catbox.moe/user/api.php', _0x19569e, {
            'headers': _0x19569e['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x4951ff['data']['trim']()
        };
    } catch (_0x7d88be) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x7d88be['message']);
    }
}
async function uploadToPomf2(_0xe0ce8a) {
    try {
        const _0xdab3a9 = new _0x0_0xe75dcd();
        _0xdab3a9['append']('files[]', _0x0_0x115062['createReadStream'](_0xe0ce8a));
        const _0x5a4f29 = await _0x0_0x5cd968['post']('https://pomf2.lain.la/upload.php', _0xdab3a9, {
            'headers': _0xdab3a9['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x5a4f29['data']['success'] && _0x5a4f29['data']['files'] && _0x5a4f29['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x5a4f29['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x217077) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x217077['message']);
    }
}
async function uploadToImgbb(_0x5ea6e8, _0x30ea1b) {
    try {
        const _0x3652f3 = _0x0_0x115062['readFileSync'](_0x5ea6e8);
        const _0x59652d = _0x3652f3['toString']('base64');
        const _0x5c2951 = new _0x0_0xe75dcd();
        _0x5c2951['append']('image', _0x59652d);
        const _0x272d5a = await _0x0_0x5cd968['post']('https://api.imgbb.com/1/upload?key=' + _0x30ea1b, _0x5c2951, { 'headers': _0x5c2951['getHeaders']() });
        if (_0x272d5a['data']['success']) {
            return {
                'status': !![],
                'url': _0x272d5a['data']['data']['url'],
                'display_url': _0x272d5a['data']['data']['display_url'],
                'delete_url': _0x272d5a['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x40ea7a) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x40ea7a['message']);
    }
}
async function uploadToFreeimage(_0x35cef7) {
    try {
        const _0x58cb98 = new _0x0_0xe75dcd();
        _0x58cb98['append']('source', _0x0_0x115062['createReadStream'](_0x35cef7));
        _0x58cb98['append']('type', 'file');
        _0x58cb98['append']('action', 'upload');
        const _0x512dab = await _0x0_0x5cd968['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x58cb98, {
            'headers': _0x58cb98['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x512dab['data']['success']) {
            return {
                'status': !![],
                'url': _0x512dab['data']['image']['url'],
                'display_url': _0x512dab['data']['image']['display_url'],
                'delete_url': _0x512dab['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x43565d) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x43565d['message']);
    }
}
async function uploadToLitterbox(_0x3bc59f, _0x18a890 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x18a890)) {
            _0x18a890 = '1h';
        }
        const _0x3855a5 = new _0x0_0xe75dcd();
        _0x3855a5['append']('reqtype', 'fileupload');
        _0x3855a5['append']('time', _0x18a890);
        _0x3855a5['append']('fileToUpload', _0x0_0x115062['createReadStream'](_0x3bc59f));
        const _0x5af5b1 = await _0x0_0x5cd968['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x3855a5, {
            'headers': _0x3855a5['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x5af5b1['data']['trim'](),
            'expires': _0x18a890
        };
    } catch (_0x27c97c) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x27c97c['message']);
    }
}
async function uploadToPixhost(_0xf7b736) {
    try {
        const _0x512c18 = new _0x0_0xe75dcd();
        _0x512c18['append']('img', _0x0_0x115062['createReadStream'](_0xf7b736));
        _0x512c18['append']('content_type', '0');
        const _0x3c8400 = await _0x0_0x5cd968['post']('https://api.pixhost.to/images', _0x512c18, {
            'headers': _0x512c18['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x3c8400['data']['show_url']) {
            const _0xa4ba01 = _0x3c8400['data']['show_url'];
            const _0x3a0dcd = await _0x0_0x5cd968['get'](_0xa4ba01);
            const _0x4186ed = _0x3a0dcd['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x4186ed && _0x4186ed[0x1]) {
                return {
                    'status': !![],
                    'url': _0x4186ed[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x5ed6a8) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x5ed6a8['message']);
    }
}
async function uploadToTmpfiles(_0x52a013) {
    try {
        const _0x4485b8 = new _0x0_0xe75dcd();
        _0x4485b8['append']('file', _0x0_0x115062['createReadStream'](_0x52a013));
        const _0x53a0a0 = await _0x0_0x5cd968['post']('https://tmpfiles.org/api/v1/upload', _0x4485b8, {
            'headers': _0x4485b8['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x53a0a0['data']['status'] === 'success') {
            const _0x22f623 = _0x53a0a0['data']['data']['url'];
            const _0x52bea1 = _0x22f623['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x52bea1,
                'page_url': _0x22f623
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x594242) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x594242['message']);
    }
}
async function uploadToQuax(_0x203bbd) {
    try {
        const _0x396627 = new _0x0_0xe75dcd();
        _0x396627['append']('files[]', _0x0_0x115062['createReadStream'](_0x203bbd));
        const _0x275ee9 = await _0x0_0x5cd968['post']('https://qu.ax/upload.php', _0x396627, {
            'headers': _0x396627['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x275ee9['data']['success'] && _0x275ee9['data']['files'] && _0x275ee9['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x275ee9['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x1ef21d) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x1ef21d['message']);
    }
}
async function uploadToX0(_0x1c927a) {
    try {
        const _0x1fc2ee = new _0x0_0xe75dcd();
        _0x1fc2ee['append']('file', _0x0_0x115062['createReadStream'](_0x1c927a));
        const _0x597e3d = await _0x0_0x5cd968['post']('https://x0.at/', _0x1fc2ee, {
            'headers': _0x1fc2ee['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x597e3d['data']['trim']()
        };
    } catch (_0x214733) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x214733['message']);
    }
}
async function uploadToUguu(_0x4fb520) {
    try {
        const _0xe8b1aa = new _0x0_0xe75dcd();
        _0xe8b1aa['append']('files[]', _0x0_0x115062['createReadStream'](_0x4fb520));
        const _0x351860 = await _0x0_0x5cd968['post']('https://uguu.se/upload.php', _0xe8b1aa, {
            'headers': { ..._0xe8b1aa['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x351860['data'] && _0x351860['data']['success'] && _0x351860['data']['files'] && _0x351860['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x351860['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x3c9036) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x3c9036['message']);
    }
}
async function uploadFile(_0x234f7a) {
    const _0x21d297 = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x234f7a)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x234f7a)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x234f7a)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x234f7a)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x234f7a)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x234f7a)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x234f7a)
        }
    ];
    for (const _0x2c2669 of _0x21d297) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x2c2669['name'] + '...');
            const _0x4c636b = await _0x2c2669['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x2c2669['name']);
            return {
                ..._0x4c636b,
                'service': _0x2c2669['name']
            };
        } catch (_0x1fbac0) {
            console['error']('[Upload]\x20✗\x20' + _0x2c2669['name'] + '\x20failed:', _0x1fbac0['message']);
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