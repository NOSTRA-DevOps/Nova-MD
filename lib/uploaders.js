import _0x0_0x571f65 from 'axios';
import _0x0_0x28edfa from 'form-data';
import _0x0_0x240e14 from 'fs';
async function uploadToCatbox(_0x528442) {
    try {
        const _0x2f3374 = new _0x0_0x28edfa();
        _0x2f3374['append']('reqtype', 'fileupload');
        _0x2f3374['append']('fileToUpload', _0x0_0x240e14['createReadStream'](_0x528442));
        const _0x34932c = await _0x0_0x571f65['post']('https://catbox.moe/user/api.php', _0x2f3374, {
            'headers': _0x2f3374['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x34932c['data']['trim']()
        };
    } catch (_0xce7577) {
        throw new Error('Catbox\x20upload\x20failed:\x20' + _0xce7577['message']);
    }
}
async function uploadToPomf2(_0x46d53e) {
    try {
        const _0x3db6c6 = new _0x0_0x28edfa();
        _0x3db6c6['append']('files[]', _0x0_0x240e14['createReadStream'](_0x46d53e));
        const _0x2c187c = await _0x0_0x571f65['post']('https://pomf2.lain.la/upload.php', _0x3db6c6, {
            'headers': _0x3db6c6['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
            'timeout': 0xea60
        });
        if (_0x2c187c['data']['success'] && _0x2c187c['data']['files'] && _0x2c187c['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': 'https://pomf2.lain.la/f/' + _0x2c187c['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x4ee831) {
        throw new Error('Pomf2\x20upload\x20failed:\x20' + _0x4ee831['message']);
    }
}
async function uploadToImgbb(_0x40ce91, _0x334c45) {
    try {
        const _0x281e25 = _0x0_0x240e14['readFileSync'](_0x40ce91);
        const _0x534cfd = _0x281e25['toString']('base64');
        const _0x5b79ed = new _0x0_0x28edfa();
        _0x5b79ed['append']('image', _0x534cfd);
        const _0x34096b = await _0x0_0x571f65['post']('https://api.imgbb.com/1/upload?key=' + _0x334c45, _0x5b79ed, { 'headers': _0x5b79ed['getHeaders']() });
        if (_0x34096b['data']['success']) {
            return {
                'status': !![],
                'url': _0x34096b['data']['data']['url'],
                'display_url': _0x34096b['data']['data']['display_url'],
                'delete_url': _0x34096b['data']['data']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x37295b) {
        throw new Error('Imgbb\x20upload\x20failed:\x20' + _0x37295b['message']);
    }
}
async function uploadToFreeimage(_0x2e8754) {
    try {
        const _0xbff60d = new _0x0_0x28edfa();
        _0xbff60d['append']('source', _0x0_0x240e14['createReadStream'](_0x2e8754));
        _0xbff60d['append']('type', 'file');
        _0xbff60d['append']('action', 'upload');
        const _0x1110b2 = await _0x0_0x571f65['post']('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', _0xbff60d, {
            'headers': _0xbff60d['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x1110b2['data']['success']) {
            return {
                'status': !![],
                'url': _0x1110b2['data']['image']['url'],
                'display_url': _0x1110b2['data']['image']['display_url'],
                'delete_url': _0x1110b2['data']['image']['delete_url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0xf11955) {
        throw new Error('Freeimage\x20upload\x20failed:\x20' + _0xf11955['message']);
    }
}
async function uploadToLitterbox(_0x314bc7, _0x5090f6 = '1h') {
    try {
        if (![
                '1h',
                '12h',
                '24h',
                '72h'
            ]['includes'](_0x5090f6)) {
            _0x5090f6 = '1h';
        }
        const _0x43bcd4 = new _0x0_0x28edfa();
        _0x43bcd4['append']('reqtype', 'fileupload');
        _0x43bcd4['append']('time', _0x5090f6);
        _0x43bcd4['append']('fileToUpload', _0x0_0x240e14['createReadStream'](_0x314bc7));
        const _0xbaee46 = await _0x0_0x571f65['post']('https://litterbox.catbox.moe/resources/internals/api.php', _0x43bcd4, {
            'headers': _0x43bcd4['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0xbaee46['data']['trim'](),
            'expires': _0x5090f6
        };
    } catch (_0x3c50a8) {
        throw new Error('Litterbox\x20upload\x20failed:\x20' + _0x3c50a8['message']);
    }
}
async function uploadToPixhost(_0x7d2e0e) {
    try {
        const _0x4df8b3 = new _0x0_0x28edfa();
        _0x4df8b3['append']('img', _0x0_0x240e14['createReadStream'](_0x7d2e0e));
        _0x4df8b3['append']('content_type', '0');
        const _0x53a135 = await _0x0_0x571f65['post']('https://api.pixhost.to/images', _0x4df8b3, {
            'headers': _0x4df8b3['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x53a135['data']['show_url']) {
            const _0x19a570 = _0x53a135['data']['show_url'];
            const _0x516a0f = await _0x0_0x571f65['get'](_0x19a570);
            const _0x4d50e9 = _0x516a0f['data']['match'](/<img id="image" src="([^"]+)"/);
            if (_0x4d50e9 && _0x4d50e9[0x1]) {
                return {
                    'status': !![],
                    'url': _0x4d50e9[0x1]
                };
            }
        }
        throw new Error('Failed\x20to\x20extract\x20image\x20URL\x20from\x20Pixhost');
    } catch (_0x40ebb6) {
        throw new Error('Pixhost\x20upload\x20failed:\x20' + _0x40ebb6['message']);
    }
}
async function uploadToTmpfiles(_0x2c1b59) {
    try {
        const _0x59e2fe = new _0x0_0x28edfa();
        _0x59e2fe['append']('file', _0x0_0x240e14['createReadStream'](_0x2c1b59));
        const _0x254557 = await _0x0_0x571f65['post']('https://tmpfiles.org/api/v1/upload', _0x59e2fe, {
            'headers': _0x59e2fe['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x254557['data']['status'] === 'success') {
            const _0x1940ea = _0x254557['data']['data']['url'];
            const _0x5e4c42 = _0x1940ea['replace']('tmpfiles.org/', 'tmpfiles.org/dl/');
            return {
                'status': !![],
                'url': _0x5e4c42,
                'page_url': _0x1940ea
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x44f2b6) {
        throw new Error('Tmpfiles\x20upload\x20failed:\x20' + _0x44f2b6['message']);
    }
}
async function uploadToQuax(_0x13d018) {
    try {
        const _0x1e542f = new _0x0_0x28edfa();
        _0x1e542f['append']('files[]', _0x0_0x240e14['createReadStream'](_0x13d018));
        const _0x2c7570 = await _0x0_0x571f65['post']('https://qu.ax/upload.php', _0x1e542f, {
            'headers': _0x1e542f['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x2c7570['data']['success'] && _0x2c7570['data']['files'] && _0x2c7570['data']['files']['length'] > 0x0) {
            return {
                'status': !![],
                'url': _0x2c7570['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Upload\x20failed');
        }
    } catch (_0x580bc1) {
        throw new Error('Qu.ax\x20upload\x20failed:\x20' + _0x580bc1['message']);
    }
}
async function uploadToX0(_0xf07a20) {
    try {
        const _0x283202 = new _0x0_0x28edfa();
        _0x283202['append']('file', _0x0_0x240e14['createReadStream'](_0xf07a20));
        const _0x606858 = await _0x0_0x571f65['post']('https://x0.at/', _0x283202, {
            'headers': _0x283202['getHeaders'](),
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        return {
            'status': !![],
            'url': _0x606858['data']['trim']()
        };
    } catch (_0x4b9cad) {
        throw new Error('X0.at\x20upload\x20failed:\x20' + _0x4b9cad['message']);
    }
}
async function uploadToUguu(_0x4f4a75) {
    try {
        const _0x46c448 = new _0x0_0x28edfa();
        _0x46c448['append']('files[]', _0x0_0x240e14['createReadStream'](_0x4f4a75));
        const _0x33e506 = await _0x0_0x571f65['post']('https://uguu.se/upload.php', _0x46c448, {
            'headers': { ..._0x46c448['getHeaders']() },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
        });
        if (_0x33e506['data'] && _0x33e506['data']['success'] && _0x33e506['data']['files'] && _0x33e506['data']['files'][0x0]) {
            return {
                'status': !![],
                'url': _0x33e506['data']['files'][0x0]['url']
            };
        } else {
            throw new Error('Invalid\x20response\x20structure');
        }
    } catch (_0x2ff871) {
        throw new Error('Uguu\x20upload\x20failed:\x20' + _0x2ff871['message']);
    }
}
async function uploadFile(_0x328c7a) {
    const _0x5d1cfb = [
        {
            'name': 'Catbox',
            'fn': () => uploadToCatbox(_0x328c7a)
        },
        {
            'name': 'Qu.ax',
            'fn': () => uploadToQuax(_0x328c7a)
        },
        {
            'name': 'Uguu',
            'fn': () => uploadToUguu(_0x328c7a)
        },
        {
            'name': 'Pomf2',
            'fn': () => uploadToPomf2(_0x328c7a)
        },
        {
            'name': 'Tmpfiles',
            'fn': () => uploadToTmpfiles(_0x328c7a)
        },
        {
            'name': 'Freeimage',
            'fn': () => uploadToFreeimage(_0x328c7a)
        },
        {
            'name': 'Pixhost',
            'fn': () => uploadToPixhost(_0x328c7a)
        }
    ];
    for (const _0x14086f of _0x5d1cfb) {
        try {
            console['log']('[Upload]\x20Trying\x20' + _0x14086f['name'] + '...');
            const _0x4b197d = await _0x14086f['fn']();
            console['log']('[Upload]\x20✓\x20Success\x20with\x20' + _0x14086f['name']);
            return {
                ..._0x4b197d,
                'service': _0x14086f['name']
            };
        } catch (_0x9f93e) {
            console['error']('[Upload]\x20✗\x20' + _0x14086f['name'] + '\x20failed:', _0x9f93e['message']);
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