import _0x0_0x3fb2ff from 'axios';
import _0x0_0xf38caf from 'form-data';
import _0x0_0x51554b from 'fs';
async function uploadToCatbox(_0x2e5d18) {
    try {
        const _0x51e7e5 = new _0x0_0xf38caf();
        _0x51e7e5['append']('reqtype', 'fileupload');
        _0x51e7e5['append']('fileToUpload', _0x0_0x51554b['createReadStream'](_0x2e5d18));
        const _0x35ddc6 = await _0x0_0x3fb2ff['post']('https://catbox.moe/user/api.php', _0x51e7e5, {
            'headers': _0x51e7e5['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x35ddc6['data']['trim']()
        };
    } catch (_0x5d5833) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0x5d5833['message']);
    }
}
async function uploadToPomf2(_0x3fbcca) {
    try {
        const _0x592f89 = new _0x0_0xf38caf();
        _0x592f89['append']('files[]', _0x0_0x51554b['createReadStream'](_0x3fbcca));
        const _0x4174b4 = await _0x0_0x3fb2ff['post']('https://pomf2.lain.la/upload.php', _0x592f89, {
            'headers': _0x592f89['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x4174b4['data']['success'] && _0x4174b4['data']['files'] && _0x4174b4['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x4174b4['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x55cb62) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x55cb62['message']);
    }
}
async function uploadToImgbb(_0x54ff9f, _0x571a5f) {
    try {
        const _0x295017 = _0x0_0x51554b['readFileSync'](_0x54ff9f);
        const _0x378d29 = _0x295017['toString']('base64');
        const _0x2d2cd2 = new _0x0_0xf38caf();
        _0x2d2cd2['append']('image', _0x378d29);
        const _0x544643 = await _0x0_0x3fb2ff['post']('https://api.imgbb.com/1/upload?key=' + _0x571a5f, _0x2d2cd2, { 'headers': _0x2d2cd2['getHeaders']() });
        if (_0x544643['data']['success']) {
            return {
                'status': !![],
                'url': _0x544643['data']['data']['url'],
                'display_url': _0x544643['data']['data']['display_url'],
                'delete_url': _0x544643['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x521f89) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x521f89['message']);
    }
}
async function uploadToFreeimage(_0x28864a) {
    try {
        const _0x504e09 = new _0x0_0xf38caf();
        _0x504e09['append']('source', _0x0_0x51554b['createReadStream'](_0x28864a));
        _0x504e09['append']('type', 'file');
        _0x504e09['append']('action', 'upload');
        const _0x2f29a1 = await _0x0_0x3fb2ff['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0x504e09, {
            'headers': _0x504e09['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2f29a1['data']['success']) {
            return {
                'status': !![],
                'url': _0x2f29a1['data']['image']['url'],
                'display_url': _0x2f29a1['data']['image']['display_url'],
                'delete_url': _0x2f29a1['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x5437ae) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0x5437ae['message']);
    }
}
async function uploadToLitterbox(_0x964140, _0x1f944a = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x1f944a)) {
            _0x1f944a = '1h';
        }
        const _0xcbb596 = new _0x0_0xf38caf();
        _0xcbb596['append']('reqtype', 'fileupload');
        _0xcbb596['append']('time', _0x1f944a);
        _0xcbb596['append']('fileToUpload', _0x0_0x51554b['createReadStream'](_0x964140));
        const _0x178192 = await _0x0_0x3fb2ff['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0xcbb596, {
            'headers': _0xcbb596['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x178192['data']['trim'](),
            'expires': _0x1f944a
        };
    } catch (_0x52c727) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x52c727['message']);
    }
}
async function uploadToPixhost(_0x361fc3) {
    try {
        const _0x1695e6 = new _0x0_0xf38caf();
        _0x1695e6['append']('img', _0x0_0x51554b['createReadStream'](_0x361fc3));
        _0x1695e6['append']('content_type', '0');
        const _0x33077b = await _0x0_0x3fb2ff['post']('https://api.pixhost.to/images', _0x1695e6, {
            'headers': _0x1695e6['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x33077b['data']['show_url']) {
            const _0x1fd0de = _0x33077b['data']['show_url'];
            const _0x176dac = await _0x0_0x3fb2ff['get'](_0x1fd0de);
            const _0x49bd93 = _0x176dac['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x49bd93 && _0x49bd93[0x1]) {
                return {
                    'status': !![],
                    'url': _0x49bd93[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x55abe5) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x55abe5['message']);
    }
}
async function uploadToTmpfiles(_0x4467d7) {
    try {
        const _0x358200 = new _0x0_0xf38caf();
        _0x358200['append']('file', _0x0_0x51554b['createReadStream'](_0x4467d7));
        const _0x116608 = await _0x0_0x3fb2ff['post']('https://tmpfiles.org/api/v1/upload', _0x358200, {
            'headers': _0x358200['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x116608['data']['status'] === 'success') {
            const _0x2ede85 = _0x116608['data']['data']['url'];
            const _0x158c60 = _0x2ede85['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x158c60,
                'page_url': _0x2ede85
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xa75d62) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0xa75d62['message']);
    }
}
async function uploadToQuax(_0x25a4d0) {
    try {
        const _0x6b702c = new _0x0_0xf38caf();
        _0x6b702c['append']('files[]', _0x0_0x51554b['createReadStream'](_0x25a4d0));
        const _0x1bd1b6 = await _0x0_0x3fb2ff['post']('https://qu.ax/upload.php', _0x6b702c, {
            'headers': _0x6b702c['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1bd1b6['data']['success'] && _0x1bd1b6['data']['files'] && _0x1bd1b6['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x1bd1b6['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x4de998) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x4de998['message']);
    }
}
async function uploadToX0(_0x59378d) {
    try {
        const _0x152a1 = new _0x0_0xf38caf();
        _0x152a1['append']('file', _0x0_0x51554b['createReadStream'](_0x59378d));
        const _0x56d143 = await _0x0_0x3fb2ff['post']('https://x0.at/', _0x152a1, {
            'headers': _0x152a1['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x56d143['data']['trim']()
        };
    } catch (_0x25936c) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x25936c['message']);
    }
}
async function uploadToUguu(_0x3825c0) {
    try {
        const _0x5cc4f7 = new _0x0_0xf38caf();
        _0x5cc4f7['append']('files[]', _0x0_0x51554b['createReadStream'](_0x3825c0));
        const _0x1d9a07 = await _0x0_0x3fb2ff['post']('https://uguu.se/upload.php', _0x5cc4f7, {
            'headers': { ..._0x5cc4f7['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1d9a07['data'] && _0x1d9a07['data']['success'] && _0x1d9a07['data']['files'] && _0x1d9a07['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x1d9a07['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x3ca496) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x3ca496['message']);
    }
}
async function uploadFile(_0x101800) {
    const _0x3362e = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x101800)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x101800)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x101800)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x101800)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x101800)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x101800)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x101800)
        }
    ];
    for (const _0x4833cf of _0x3362e) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x4833cf['name'] + '...');
            const _0x30f103 = await _0x4833cf['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x4833cf['name']);
            return {
                ..._0x30f103,
                'service': _0x4833cf['name']
            };
        } catch (_0x3ce8eb) {
            console['error']('[Upload]\x20✗\x20' + _0x4833cf['name'] + '\x20failed:', _0x3ce8eb['message']);
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