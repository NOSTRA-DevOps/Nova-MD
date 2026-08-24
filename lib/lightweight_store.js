import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x140f11 from 'fs';
import _0x0_0x15dfa1 from 'path';
import _0x0_0x2a552f from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x5899fd) {
    printLog = (_0x534714, _0x5f3131) => console['log']('[' + _0x534714['toUpperCase']() + ']\x20' + _0x5f3131);
}
const STORE_FILE = './data/baileys_store.json';
const MESSAGE_COUNT_FILE = './data/messageCount.json';
const MONGO_URL = process.env.MONGO_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const MYSQL_URL = process.env.MYSQL_URL;
const SQLITE_URL = process.env.DB_URL;
const MESSAGE_LIMITS = {
    'memory': 0x14,
    'sqlite': 0x46,
    'mongo': Infinity,
    'postgres': Infinity,
    'mysql': Infinity
};
let MAX_MESSAGES = 0x14;
try {
    const config = require('../config.js');
    if (config['maxStoreMessages'] && typeof config['maxStoreMessages'] === 'number') {
        MAX_MESSAGES = config['maxStoreMessages'];
    }
} catch (_0x0_0x22167e) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x12681d => {
    try {
        return _0x0_0x2a552f['deflateSync'](JSON['stringify'](_0x12681d));
    } catch (_0x2d2b9b) {
        console['error']('[STORE]\x20Compression\x20error:', _0x2d2b9b['message']);
        return Buffer['from'](JSON['stringify'](_0x12681d));
    }
};
const decompress = _0x131955 => {
    try {
        return JSON['parse'](_0x0_0x2a552f['inflateSync'](_0x131955));
    } catch (_0x34b1d5) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x34b1d5['message']);
        try {
            return JSON['parse'](_0x131955['toString']());
        } catch (_0x22b595) {
            return null;
        }
    }
};
function slimMessage(_0x536c95) {
    return {
        'key': _0x536c95['key'],
        'message': _0x536c95['message'],
        'messageTimestamp': _0x536c95['messageTimestamp'],
        'participant': _0x536c95['participant'],
        'pushName': _0x536c95['pushName'],
        'broadcast': _0x536c95['broadcast']
    };
}
let backend = 'memory';
const adapters = {};
let cleanupTimer = null;
let messageLimit = MESSAGE_LIMITS['memory'];
if (MONGO_URL) {
    try {
        const mongoose = require('mongoose');
        const msgSchema = new mongoose['Schema']({
            'jid': {
                'type': String,
                'index': !![]
            },
            'id': {
                'type': String,
                'unique': !![]
            },
            'data': Buffer,
            'ts': {
                'type': Number,
                'index': !![]
            }
        });
        const countSchema = new mongoose['Schema']({
            'chatId': {
                'type': String,
                'required': !![]
            },
            'userId': {
                'type': String,
                'required': !![]
            },
            'count': {
                'type': Number,
                'default': 0x0
            }
        });
        countSchema['index']({
            'chatId': 0x1,
            'userId': 0x1
        }, { 'unique': !![] });
        const metaSchema = new mongoose['Schema']({
            'key': {
                'type': String,
                'unique': !![],
                'required': !![]
            },
            'value': {
                'type': String,
                'required': !![]
            }
        });
        const contactSchema = new mongoose['Schema']({
            'jid': {
                'type': String,
                'unique': !![],
                'required': !![]
            },
            'name': {
                'type': String,
                'default': ''
            },
            'notify': String,
            'verifiedName': String,
            'ts': {
                'type': Number,
                'default': Date['now']
            }
        });
        const chatSchema = new mongoose['Schema']({
            'jid': {
                'type': String,
                'unique': !![],
                'required': !![]
            },
            'name': String,
            'conversationTimestamp': Number,
            'unreadCount': {
                'type': Number,
                'default': 0x0
            },
            'ts': {
                'type': Number,
                'default': Date['now']
            }
        });
        const settingSchema = new mongoose['Schema']({
            'chatId': {
                'type': String,
                'required': !![]
            },
            'key': {
                'type': String,
                'required': !![]
            },
            'value': mongoose['Schema']['Types']['Mixed'],
            'ts': {
                'type': Number,
                'default': Date['now']
            }
        });
        settingSchema['index']({
            'chatId': 0x1,
            'key': 0x1
        }, { 'unique': !![] });
        mongoose['connect'](MONGO_URL)['catch'](_0x236c70 => console['error']('[MONGO]\x20Connection\x20error:', _0x236c70));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x4c3ccf, _0x31ad6d, _0x2288de) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x4c3ccf,
                        'id': _0x31ad6d
                    }, {
                        'data': compress(_0x2288de),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3a009d) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x3a009d['message']);
                }
            },
            async 'load'(_0x3b5a16, _0x4926a5) {
                try {
                    const _0x34415b = await Msg['findOne']({
                        'jid': _0x3b5a16,
                        'id': _0x4926a5
                    });
                    return _0x34415b ? decompress(_0x34415b['data']) : null;
                } catch (_0x9a7513) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x9a7513['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x34b000, _0x33ee49) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x34b000,
                        'userId': _0x33ee49
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x4a53fb) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x4a53fb['message']);
                }
            },
            async 'getCount'(_0x57f8cd, _0x4243da) {
                try {
                    const _0x3eb494 = await MsgCount['findOne']({
                        'chatId': _0x57f8cd,
                        'userId': _0x4243da
                    });
                    return _0x3eb494 ? _0x3eb494['count'] : 0x0;
                } catch (_0x1f84d3) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x1f84d3['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0xc239e5 = await MsgCount['find']({});
                    const _0x32110c = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0xc239e5['forEach'](_0x27187b => {
                        if (!_0x32110c['messageCount'][_0x27187b['chatId']]) {
                            _0x32110c['messageCount'][_0x27187b['chatId']] = {};
                        }
                        _0x32110c['messageCount'][_0x27187b['chatId']][_0x27187b['userId']] = _0x27187b['count'];
                    });
                    const _0x4f359b = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x4f359b)
                        _0x32110c['isPublic'] = _0x4f359b['value'] === 'true';
                    return _0x32110c;
                } catch (_0x4916e0) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x4916e0['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x236266) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x236266['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x36e83b) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x36e83b['message']);
                }
            },
            async 'setMetadata'(_0xe29597, _0x1680bf) {
                try {
                    await Meta['updateOne']({ 'key': _0xe29597 }, {
                        'key': _0xe29597,
                        'value': _0x1680bf['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x5bd71e) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x5bd71e['message']);
                }
            },
            async 'getMetadata'(_0x45f000) {
                try {
                    const _0x4a7062 = await Meta['findOne']({ 'key': _0x45f000 });
                    return _0x4a7062 ? _0x4a7062['value'] : null;
                } catch (_0x4fb932) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x4fb932['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x3a467a, _0xb5742f) {
                try {
                    await Contact['updateOne']({ 'jid': _0x3a467a }, {
                        ..._0xb5742f,
                        'jid': _0x3a467a,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x186e7f) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x186e7f['message']);
                }
            },
            async 'getContact'(_0x29cff6) {
                try {
                    return await Contact['findOne']({ 'jid': _0x29cff6 });
                } catch (_0x543e9d) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x543e9d['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x2e4646 = await Contact['find']({});
                    const _0x3e7043 = {};
                    _0x2e4646['forEach'](_0x37ed7b => {
                        _0x3e7043[_0x37ed7b['jid']] = {
                            'id': _0x37ed7b['jid'],
                            'name': _0x37ed7b['name'],
                            'notify': _0x37ed7b['notify']
                        };
                    });
                    return _0x3e7043;
                } catch (_0x1162ee) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x1162ee['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x117324, _0x458c3a) {
                try {
                    await Chat['updateOne']({ 'jid': _0x117324 }, {
                        ..._0x458c3a,
                        'jid': _0x117324,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4148fa) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x4148fa['message']);
                }
            },
            async 'getChat'(_0x5f57d9) {
                try {
                    return await Chat['findOne']({ 'jid': _0x5f57d9 });
                } catch (_0x2562bc) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x2562bc['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x3e4fc4 = await Chat['find']({});
                    const _0x432ed8 = {};
                    _0x3e4fc4['forEach'](_0x3cda9b => {
                        _0x432ed8[_0x3cda9b['jid']] = {
                            'id': _0x3cda9b['jid'],
                            'name': _0x3cda9b['name'],
                            'conversationTimestamp': _0x3cda9b['conversationTimestamp'],
                            'unreadCount': _0x3cda9b['unreadCount']
                        };
                    });
                    return _0x432ed8;
                } catch (_0x43294f) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x43294f['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x2bbb44) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x2bbb44 });
                } catch (_0x203975) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x203975['message']);
                }
            },
            async 'saveSetting'(_0x4ae85b, _0x257492, _0x286e87) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x4ae85b,
                        'key': _0x257492
                    }, {
                        'chatId': _0x4ae85b,
                        'key': _0x257492,
                        'value': _0x286e87,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5588c3) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x5588c3['message']);
                }
            },
            async 'getSetting'(_0x5ae43b, _0x54155a) {
                try {
                    const _0x7ae44e = await Setting['findOne']({
                        'chatId': _0x5ae43b,
                        'key': _0x54155a
                    });
                    return _0x7ae44e ? _0x7ae44e['value'] : null;
                } catch (_0x393be1) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x393be1['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0xfdfa93) {
                try {
                    const _0xb303fb = await Setting['find']({ 'chatId': _0xfdfa93 });
                    const _0x30e6c3 = {};
                    _0xb303fb['forEach'](_0x25958d => {
                        _0x30e6c3[_0x25958d['key']] = _0x25958d['value'];
                    });
                    return _0x30e6c3;
                } catch (_0x272d50) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x272d50['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x3caa32 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x3caa32['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x3caa32['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x4a1b1b) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x4a1b1b['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x5bfe52) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x5bfe52['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x400e48) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x400e48['message']);
    }
}
if (backend === 'memory' && POSTGRES_URL) {
    try {
        const {Pool} = require('pg');
        const pool = new Pool({
            'connectionString': POSTGRES_URL,
            'ssl': { 'rejectUnauthorized': ![] },
            'max': 0x14,
            'min': 0x2,
            'idleTimeoutMillis': 0xea60,
            'connectionTimeoutMillis': 0x2710,
            'keepAlive': !![],
            'keepAliveInitialDelayMillis': 0x2710
        });
        pool['on']('error', _0x17f381 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x17f381['message']);
        });
        adapters['postgres'] = {
            'initialized': ![],
            'initPromise': null,
            async 'init'() {
                if (this['initialized'])
                    return;
                if (this['initPromise'])
                    return this['initPromise'];
                this['initPromise'] = ((async () => {
                    try {
                        const _0x516394 = await pool['connect']();
                        try {
                            await _0x516394['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x516394['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x516394['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x516394['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x516394['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x516394['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x516394['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x516394['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x516394['release']();
                        }
                    } catch (_0x156a7b) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x156a7b['message']);
                        this['initPromise'] = null;
                        throw _0x156a7b;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x765833, _0xae84f7, _0x50caed) {
                try {
                    await this['init']();
                    const _0x2a1466 = await pool['connect']();
                    try {
                        await _0x2a1466['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x765833,
                            _0xae84f7,
                            Date['now'](),
                            compress(_0x50caed)
                        ]);
                    } finally {
                        _0x2a1466['release']();
                    }
                } catch (_0x2fb4db) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x2fb4db['message']);
                }
            },
            async 'load'(_0x3ce239, _0x26a5ab) {
                try {
                    await this['init']();
                    const _0x569e54 = await pool['connect']();
                    try {
                        const _0x4fadb2 = await _0x569e54['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x3ce239,
                            _0x26a5ab
                        ]);
                        return _0x4fadb2['rows'][0x0] ? decompress(_0x4fadb2['rows'][0x0]['data']) : null;
                    } finally {
                        _0x569e54['release']();
                    }
                } catch (_0x460245) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x460245['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x5a4e28, _0x4388ff) {
                try {
                    await this['init']();
                    const _0x18584a = await pool['connect']();
                    try {
                        await _0x18584a['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x5a4e28,
                            _0x4388ff
                        ]);
                    } finally {
                        _0x18584a['release']();
                    }
                } catch (_0x1e0bc6) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x1e0bc6['message']);
                }
            },
            async 'getCount'(_0x3b4394, _0x6ba558) {
                try {
                    await this['init']();
                    const _0x242f29 = await pool['connect']();
                    try {
                        const _0x131767 = await _0x242f29['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x3b4394,
                            _0x6ba558
                        ]);
                        return _0x131767['rows'][0x0] ? _0x131767['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x242f29['release']();
                    }
                } catch (_0x371c22) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x371c22['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x57174b = await pool['connect']();
                    try {
                        const _0x18902a = await _0x57174b['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x5dbb55 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x18902a['rows']['forEach'](_0x3020d7 => {
                            if (!_0x5dbb55['messageCount'][_0x3020d7['chat_id']]) {
                                _0x5dbb55['messageCount'][_0x3020d7['chat_id']] = {};
                            }
                            _0x5dbb55['messageCount'][_0x3020d7['chat_id']][_0x3020d7['user_id']] = _0x3020d7['count'];
                        });
                        const _0xf20ed2 = await _0x57174b['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0xf20ed2['rows'][0x0])
                            _0x5dbb55['isPublic'] = _0xf20ed2['rows'][0x0]['value'] === 'true';
                        return _0x5dbb55;
                    } finally {
                        _0x57174b['release']();
                    }
                } catch (_0x1ddb90) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x1ddb90['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x379442) {
                try {
                    await this['init']();
                    const _0x11b884 = await pool['connect']();
                    try {
                        await _0x11b884['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x379442['toString']()]);
                    } finally {
                        _0x11b884['release']();
                    }
                } catch (_0x4304d3) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x4304d3['message']);
                }
            },
            async 'setMetadata'(_0x3b716b, _0x4b0bd8) {
                try {
                    await this['init']();
                    const _0x288d79 = await pool['connect']();
                    try {
                        await _0x288d79['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x3b716b,
                            _0x4b0bd8['toString']()
                        ]);
                    } finally {
                        _0x288d79['release']();
                    }
                } catch (_0x39f061) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x39f061['message']);
                }
            },
            async 'getMetadata'(_0x231bf6) {
                try {
                    await this['init']();
                    const _0x1e4b5b = await pool['connect']();
                    try {
                        const _0x5ab8f9 = await _0x1e4b5b['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x231bf6]);
                        return _0x5ab8f9['rows'][0x0] ? _0x5ab8f9['rows'][0x0]['value'] : null;
                    } finally {
                        _0x1e4b5b['release']();
                    }
                } catch (_0x11b8e0) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x11b8e0['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x2cec99, _0x17a997) {
                try {
                    await this['init']();
                    const _0x1912bd = await pool['connect']();
                    try {
                        await _0x1912bd['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x2cec99,
                            _0x17a997['name'] || '',
                            _0x17a997['notify'] || '',
                            _0x17a997['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x1912bd['release']();
                    }
                } catch (_0x6914f5) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x6914f5['message']);
                }
            },
            async 'getContact'(_0x519aa9) {
                try {
                    await this['init']();
                    const _0x3e6d46 = await pool['connect']();
                    try {
                        const _0xf3548f = await _0x3e6d46['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x519aa9]);
                        return _0xf3548f['rows'][0x0] || null;
                    } finally {
                        _0x3e6d46['release']();
                    }
                } catch (_0x4e4a97) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x4e4a97['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x2018b8 = await pool['connect']();
                    try {
                        const _0x5bbbed = await _0x2018b8['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0xf51fef = {};
                        _0x5bbbed['rows']['forEach'](_0x282c0d => {
                            _0xf51fef[_0x282c0d['jid']] = {
                                'id': _0x282c0d['jid'],
                                'name': _0x282c0d['name'],
                                'notify': _0x282c0d['notify']
                            };
                        });
                        return _0xf51fef;
                    } finally {
                        _0x2018b8['release']();
                    }
                } catch (_0x5bf075) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x5bf075['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x21e165, _0x49fdaa) {
                try {
                    await this['init']();
                    const _0x3f591a = await pool['connect']();
                    try {
                        await _0x3f591a['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x21e165,
                            _0x49fdaa['name'] || '',
                            _0x49fdaa['conversationTimestamp'] || 0x0,
                            _0x49fdaa['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x3f591a['release']();
                    }
                } catch (_0x200149) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x200149['message']);
                }
            },
            async 'getChat'(_0x2c3aa3) {
                try {
                    await this['init']();
                    const _0x37e46b = await pool['connect']();
                    try {
                        const _0x3c3107 = await _0x37e46b['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x2c3aa3]);
                        return _0x3c3107['rows'][0x0] || null;
                    } finally {
                        _0x37e46b['release']();
                    }
                } catch (_0x338546) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x338546['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x17668c = await pool['connect']();
                    try {
                        const _0xe470b4 = await _0x17668c['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x30df17 = {};
                        _0xe470b4['rows']['forEach'](_0x1cd534 => {
                            _0x30df17[_0x1cd534['jid']] = {
                                'id': _0x1cd534['jid'],
                                'name': _0x1cd534['name'],
                                'conversationTimestamp': _0x1cd534['conversation_timestamp'],
                                'unreadCount': _0x1cd534['unread_count']
                            };
                        });
                        return _0x30df17;
                    } finally {
                        _0x17668c['release']();
                    }
                } catch (_0x5f2f72) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x5f2f72['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x456920) {
                try {
                    await this['init']();
                    const _0x5eb9c0 = await pool['connect']();
                    try {
                        await _0x5eb9c0['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x456920]);
                    } finally {
                        _0x5eb9c0['release']();
                    }
                } catch (_0x364390) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x364390['message']);
                }
            },
            async 'saveSetting'(_0x439572, _0x347ab9, _0x4e8817) {
                try {
                    await this['init']();
                    const _0x32f1b5 = await pool['connect']();
                    try {
                        await _0x32f1b5['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x439572,
                            _0x347ab9,
                            JSON['stringify'](_0x4e8817),
                            Date['now']()
                        ]);
                    } finally {
                        _0x32f1b5['release']();
                    }
                } catch (_0x2f3c05) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x2f3c05['message']);
                }
            },
            async 'getSetting'(_0x4ca60a, _0x2e7fce) {
                try {
                    await this['init']();
                    const _0x1e4565 = await pool['connect']();
                    try {
                        const _0x1c5e6a = await _0x1e4565['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x4ca60a,
                            _0x2e7fce
                        ]);
                        return _0x1c5e6a['rows'][0x0] ? JSON['parse'](_0x1c5e6a['rows'][0x0]['value']) : null;
                    } finally {
                        _0x1e4565['release']();
                    }
                } catch (_0x383532) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x383532['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x19f7a1) {
                try {
                    await this['init']();
                    const _0xc7a5bd = await pool['connect']();
                    try {
                        const _0x5d8162 = await _0xc7a5bd['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x19f7a1]);
                        const _0xaab85 = {};
                        _0x5d8162['rows']['forEach'](_0x54c276 => {
                            _0xaab85[_0x54c276['key']] = JSON['parse'](_0x54c276['value']);
                        });
                        return _0xaab85;
                    } finally {
                        _0xc7a5bd['release']();
                    }
                } catch (_0x5874e2) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x5874e2['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x3d358f = await pool['connect']();
                    try {
                        const _0x4edb68 = await _0x3d358f['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x4edb68['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x4edb68['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x3d358f['release']();
                    }
                } catch (_0x3bb2cd) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x3bb2cd['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x2fcfc5) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x2fcfc5['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x431cda) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x431cda['message']);
    }
}
if (backend === 'memory' && MYSQL_URL) {
    try {
        const mysql = require('mysql2/promise');
        let mysqlConn = null;
        let connectPromise = null;
        let connectionAttempts = 0x0;
        let connectionFailed = ![];
        const MAX_RETRIES = 0x3;
        adapters['mysql'] = {
            async 'getConn'() {
                if (connectionFailed) {
                    throw new Error('MySQL\x20connection\x20permanently\x20failed\x20after\x20multiple\x20attempts');
                }
                if (mysqlConn)
                    return mysqlConn;
                if (connectPromise)
                    return connectPromise;
                if (connectionAttempts >= MAX_RETRIES) {
                    connectionFailed = !![];
                    printLog('error', 'MySQL:\x20Max\x20connection\x20attempts\x20reached,\x20disabling\x20MySQL\x20adapter');
                    throw new Error('Max\x20MySQL\x20connection\x20attempts\x20reached');
                }
                connectPromise = ((async () => {
                    try {
                        connectionAttempts++;
                        mysqlConn = await mysql['createConnection'](MYSQL_URL);
                        await mysqlConn['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20VARCHAR(255)\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20VARCHAR(255)\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20LONGBLOB\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20INDEX\x20idx_jid\x20(jid),\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20INDEX\x20idx_ts\x20(ts)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                        await mysqlConn['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20VARCHAR(255)\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20VARCHAR(255)\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INT\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                        await mysqlConn['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20`key`\x20VARCHAR(255)\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                        await mysqlConn['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20VARCHAR(255)\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                        await mysqlConn['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20VARCHAR(255)\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INT\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                        await mysqlConn['execute']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20VARCHAR(255)\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20`key`\x20VARCHAR(255)\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20`key`)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x20ENGINE=InnoDB\x20DEFAULT\x20CHARSET=utf8mb4\x20COLLATE=utf8mb4_unicode_ci\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                        printLog('store', 'MySQL\x20connection\x20established\x20and\x20tables\x20ready');
                        return mysqlConn;
                    } catch (_0x363f5a) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x363f5a['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x363f5a;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x510150, _0x21496c, _0x4a7161) {
                try {
                    const _0x1f0509 = await this['getConn']();
                    await _0x1f0509['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x510150,
                        _0x21496c,
                        Date['now'](),
                        compress(_0x4a7161)
                    ]);
                } catch (_0x1882b1) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x1882b1['message']);
                }
            },
            async 'load'(_0x3edb04, _0xa19481) {
                try {
                    const _0x518332 = await this['getConn']();
                    const [_0x199d9d] = await _0x518332['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x3edb04,
                        _0xa19481
                    ]);
                    return _0x199d9d[0x0] ? decompress(_0x199d9d[0x0]['data']) : null;
                } catch (_0x17d3c1) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x17d3c1['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x28751a, _0x4c355f) {
                try {
                    const _0x28b504 = await this['getConn']();
                    await _0x28b504['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x28751a,
                        _0x4c355f
                    ]);
                } catch (_0x74c3a0) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x74c3a0['message']);
                }
            },
            async 'getCount'(_0x24a3b0, _0x4c70fd) {
                try {
                    const _0x714acb = await this['getConn']();
                    const [_0x184687] = await _0x714acb['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x24a3b0,
                        _0x4c70fd
                    ]);
                    return _0x184687[0x0] ? _0x184687[0x0]['count'] : 0x0;
                } catch (_0x21fdee) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x21fdee['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x46f344 = await this['getConn']();
                    const [_0x79afe4] = await _0x46f344['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x576d16 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x79afe4['forEach'](_0x22de83 => {
                        if (!_0x576d16['messageCount'][_0x22de83['chat_id']]) {
                            _0x576d16['messageCount'][_0x22de83['chat_id']] = {};
                        }
                        _0x576d16['messageCount'][_0x22de83['chat_id']][_0x22de83['user_id']] = _0x22de83['count'];
                    });
                    const [_0x585ae7] = await _0x46f344['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x585ae7[0x0])
                        _0x576d16['isPublic'] = _0x585ae7[0x0]['value'] === 'true';
                    return _0x576d16;
                } catch (_0x34a9e4) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x34a9e4['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0xf9b9c1) {
                try {
                    const _0xc98886 = await this['getConn']();
                    await _0xc98886['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0xf9b9c1['toString']()]);
                } catch (_0x2ac8f0) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x2ac8f0['message']);
                }
            },
            async 'setMetadata'(_0x588195, _0x59ef59) {
                try {
                    const _0x5a2991 = await this['getConn']();
                    await _0x5a2991['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x588195,
                        _0x59ef59['toString']()
                    ]);
                } catch (_0x1ee168) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x1ee168['message']);
                }
            },
            async 'getMetadata'(_0x2d273b) {
                try {
                    const _0x119a54 = await this['getConn']();
                    const [_0x174c5b] = await _0x119a54['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x2d273b]);
                    return _0x174c5b[0x0] ? _0x174c5b[0x0]['value'] : null;
                } catch (_0x224d4b) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x224d4b['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x50b456, _0x2b62c3) {
                try {
                    const _0x1e2357 = await this['getConn']();
                    await _0x1e2357['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x50b456,
                        _0x2b62c3['name'] || '',
                        _0x2b62c3['notify'] || '',
                        _0x2b62c3['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x22fb20) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x22fb20['message']);
                }
            },
            async 'getContact'(_0x20aef5) {
                try {
                    const _0x136cfd = await this['getConn']();
                    const [_0x3b0464] = await _0x136cfd['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x20aef5]);
                    return _0x3b0464[0x0] || null;
                } catch (_0x47823b) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x47823b['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x267239 = await this['getConn']();
                    const [_0x4fe504] = await _0x267239['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x55b28a = {};
                    _0x4fe504['forEach'](_0x33099c => {
                        _0x55b28a[_0x33099c['jid']] = {
                            'id': _0x33099c['jid'],
                            'name': _0x33099c['name'],
                            'notify': _0x33099c['notify']
                        };
                    });
                    return _0x55b28a;
                } catch (_0x5bab89) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x5bab89['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x12bf70, _0x26ab28) {
                try {
                    const _0x112b00 = await this['getConn']();
                    await _0x112b00['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x12bf70,
                        _0x26ab28['name'] || '',
                        _0x26ab28['conversationTimestamp'] || 0x0,
                        _0x26ab28['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x12c362) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x12c362['message']);
                }
            },
            async 'getChat'(_0x308fcf) {
                try {
                    const _0x4f4be2 = await this['getConn']();
                    const [_0x1e3d96] = await _0x4f4be2['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x308fcf]);
                    return _0x1e3d96[0x0] || null;
                } catch (_0x47bffe) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x47bffe['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x3d7d65 = await this['getConn']();
                    const [_0x1c0d01] = await _0x3d7d65['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x473f00 = {};
                    _0x1c0d01['forEach'](_0x521bee => {
                        _0x473f00[_0x521bee['jid']] = {
                            'id': _0x521bee['jid'],
                            'name': _0x521bee['name'],
                            'conversationTimestamp': _0x521bee['conversation_timestamp'],
                            'unreadCount': _0x521bee['unread_count']
                        };
                    });
                    return _0x473f00;
                } catch (_0x41d329) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x41d329['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x40faf5) {
                try {
                    const _0x31d9d3 = await this['getConn']();
                    await _0x31d9d3['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x40faf5]);
                } catch (_0xd6639b) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0xd6639b['message']);
                }
            },
            async 'saveSetting'(_0x5cfd1d, _0x54bb85, _0x34e3bd) {
                try {
                    const _0x3a3212 = await this['getConn']();
                    await _0x3a3212['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x5cfd1d,
                        _0x54bb85,
                        JSON['stringify'](_0x34e3bd),
                        Date['now']()
                    ]);
                } catch (_0x5d38fe) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x5d38fe['message']);
                }
            },
            async 'getSetting'(_0x495f5f, _0x342e5c) {
                try {
                    const _0x571699 = await this['getConn']();
                    const [_0x320aee] = await _0x571699['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x495f5f,
                        _0x342e5c
                    ]);
                    return _0x320aee[0x0] ? JSON['parse'](_0x320aee[0x0]['value']) : null;
                } catch (_0x39e637) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x39e637['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x9d5915) {
                try {
                    const _0x3eb345 = await this['getConn']();
                    const [_0x4e8b13] = await _0x3eb345['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x9d5915]);
                    const _0xa1d2dc = {};
                    _0x4e8b13['forEach'](_0x4921f4 => {
                        _0xa1d2dc[_0x4921f4['key']] = JSON['parse'](_0x4921f4['value']);
                    });
                    return _0xa1d2dc;
                } catch (_0x19efc8) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x19efc8['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x558295 = await this['getConn']();
                    const [_0x3953ef] = await _0x558295['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x3953ef['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x3953ef['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x499146) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x499146['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x52ffd5) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x52ffd5['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x1c6e54) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x1c6e54['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x15dfa1['dirname'](SQLITE_URL);
        if (!_0x0_0x140f11['existsSync'](dir))
            _0x0_0x140f11['mkdirSync'](dir, { 'recursive': !![] });
        const sqlite = new Database(SQLITE_URL);
        sqlite['pragma']('journal_mode\x20=\x20WAL');
        sqlite['pragma']('synchronous\x20=\x20NORMAL');
        sqlite['pragma']('cache_size\x20=\x20-64000');
        sqlite['pragma']('temp_store\x20=\x20MEMORY');
        sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20INTEGER\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BLOB\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20')['run']();
        sqlite['prepare']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)')['run']();
        sqlite['prepare']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)')['run']();
        sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20')['run']();
        sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20')['run']();
        sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20INTEGER\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20')['run']();
        sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20INTEGER,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20INTEGER\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20')['run']();
        sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20INTEGER\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20')['run']();
        const saveStmt = sqlite['prepare']('INSERT\x20OR\x20REPLACE\x20INTO\x20messages\x20VALUES\x20(?,?,?,?)');
        const loadStmt = sqlite['prepare']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?');
        const cleanupStmt = sqlite['prepare']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?');
        const countStmt = sqlite['prepare']('SELECT\x20COUNT(*)\x20as\x20count\x20FROM\x20messages\x20WHERE\x20jid=?');
        const deleteOldestStmt = sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20DELETE\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id\x20IN\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20SELECT\x20id\x20FROM\x20messages\x20WHERE\x20jid=?\x20ORDER\x20BY\x20ts\x20ASC\x20LIMIT\x20?\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20');
        const incrementCountStmt = sqlite['prepare']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20count\x20+\x201\x0a\x20\x20\x20\x20\x20\x20\x20\x20');
        const getCountStmt = sqlite['prepare']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?');
        const getAllCountsStmt = sqlite['prepare']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
        const getMetaStmt = sqlite['prepare']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
        const setMetaStmt = sqlite['prepare']('INSERT\x20OR\x20REPLACE\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)');
        const getMetadataStmt = sqlite['prepare']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=?');
        const setMetadataStmt = sqlite['prepare']('INSERT\x20OR\x20REPLACE\x20INTO\x20metadata(key,\x20value)\x20VALUES(?,\x20?)');
        const saveContactStmt = sqlite['prepare']('INSERT\x20OR\x20REPLACE\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)');
        const getContactStmt = sqlite['prepare']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?');
        const getAllContactsStmt = sqlite['prepare']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
        const saveChatStmt = sqlite['prepare']('INSERT\x20OR\x20REPLACE\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)');
        const getChatStmt = sqlite['prepare']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?');
        const getAllChatsStmt = sqlite['prepare']('SELECT\x20*\x20FROM\x20chats');
        const deleteChatStmt = sqlite['prepare']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?');
        const saveSettingStmt = sqlite['prepare']('INSERT\x20OR\x20REPLACE\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)');
        const getSettingStmt = sqlite['prepare']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20key=?');
        const getAllSettingsStmt = sqlite['prepare']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?');
        adapters['sqlite'] = {
            'save'(_0xf6ffe8, _0x26759d, _0x12d63a) {
                try {
                    saveStmt['run'](_0xf6ffe8, _0x26759d, Date['now'](), compress(_0x12d63a));
                    const {count: _0x5b8922} = countStmt['get'](_0xf6ffe8);
                    if (_0x5b8922 > MESSAGE_LIMITS['sqlite']) {
                        const _0x3abeab = _0x5b8922 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0xf6ffe8, _0xf6ffe8, _0x3abeab);
                    }
                } catch (_0x3a274c) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x3a274c['message']);
                }
            },
            'load'(_0x2afa9b, _0x57e676) {
                try {
                    const _0x30281c = loadStmt['get'](_0x2afa9b, _0x57e676);
                    return _0x30281c ? decompress(_0x30281c['data']) : null;
                } catch (_0x2bde2a) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x2bde2a['message']);
                    return null;
                }
            },
            'incrementCount'(_0x33b8f9, _0xaa63) {
                try {
                    incrementCountStmt['run'](_0x33b8f9, _0xaa63);
                } catch (_0x58b087) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x58b087['message']);
                }
            },
            'getCount'(_0x63a249, _0x5c527c) {
                try {
                    const _0x5f322c = getCountStmt['get'](_0x63a249, _0x5c527c);
                    return _0x5f322c ? _0x5f322c['count'] : 0x0;
                } catch (_0x40bb4f) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x40bb4f['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x2300db = getAllCountsStmt['all']();
                    const _0x58902b = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2300db['forEach'](_0x5e3aa0 => {
                        if (!_0x58902b['messageCount'][_0x5e3aa0['chat_id']]) {
                            _0x58902b['messageCount'][_0x5e3aa0['chat_id']] = {};
                        }
                        _0x58902b['messageCount'][_0x5e3aa0['chat_id']][_0x5e3aa0['user_id']] = _0x5e3aa0['count'];
                    });
                    const _0x46e4d8 = getMetaStmt['get']();
                    if (_0x46e4d8)
                        _0x58902b['isPublic'] = _0x46e4d8['value'] === 'true';
                    return _0x58902b;
                } catch (_0x308584) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x308584['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x4ab5d6) {
                try {
                    setMetaStmt['run'](_0x4ab5d6['toString']());
                } catch (_0x39b147) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x39b147['message']);
                }
            },
            'setMetadata'(_0x1eb600, _0x1b7597) {
                try {
                    setMetadataStmt['run'](_0x1eb600, _0x1b7597['toString']());
                } catch (_0x4011d5) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x4011d5['message']);
                }
            },
            'getMetadata'(_0x26a6a4) {
                try {
                    const _0x4882b1 = getMetadataStmt['get'](_0x26a6a4);
                    return _0x4882b1 ? _0x4882b1['value'] : null;
                } catch (_0xfb5991) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0xfb5991['message']);
                    return null;
                }
            },
            'saveContact'(_0xaf88f, _0x3fd966) {
                try {
                    saveContactStmt['run'](_0xaf88f, _0x3fd966['name'] || '', _0x3fd966['notify'] || '', _0x3fd966['verifiedName'] || '', Date['now']());
                } catch (_0xda8eed) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0xda8eed['message']);
                }
            },
            'getContact'(_0x6ce47b) {
                try {
                    return getContactStmt['get'](_0x6ce47b) || null;
                } catch (_0x143c1d) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x143c1d['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x4c373f = getAllContactsStmt['all']();
                    const _0x2a1c89 = {};
                    _0x4c373f['forEach'](_0x289a83 => {
                        _0x2a1c89[_0x289a83['jid']] = {
                            'id': _0x289a83['jid'],
                            'name': _0x289a83['name'],
                            'notify': _0x289a83['notify']
                        };
                    });
                    return _0x2a1c89;
                } catch (_0x1c79e6) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x1c79e6['message']);
                    return {};
                }
            },
            'saveChat'(_0x384e77, _0x385c80) {
                try {
                    saveChatStmt['run'](_0x384e77, _0x385c80['name'] || '', _0x385c80['conversationTimestamp'] || 0x0, _0x385c80['unreadCount'] || 0x0, Date['now']());
                } catch (_0x5da29d) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x5da29d['message']);
                }
            },
            'getChat'(_0x31df8d) {
                try {
                    return getChatStmt['get'](_0x31df8d) || null;
                } catch (_0x5b1c84) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x5b1c84['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0xb5d35b = getAllChatsStmt['all']();
                    const _0x430c7f = {};
                    _0xb5d35b['forEach'](_0xe52709 => {
                        _0x430c7f[_0xe52709['jid']] = {
                            'id': _0xe52709['jid'],
                            'name': _0xe52709['name'],
                            'conversationTimestamp': _0xe52709['conversation_timestamp'],
                            'unreadCount': _0xe52709['unread_count']
                        };
                    });
                    return _0x430c7f;
                } catch (_0x3e1941) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x3e1941['message']);
                    return {};
                }
            },
            'deleteChat'(_0x21569b) {
                try {
                    deleteChatStmt['run'](_0x21569b);
                } catch (_0x514a2b) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x514a2b['message']);
                }
            },
            'saveSetting'(_0x42a0e0, _0xf0acfb, _0x417f6e) {
                try {
                    saveSettingStmt['run'](_0x42a0e0, _0xf0acfb, JSON['stringify'](_0x417f6e), Date['now']());
                } catch (_0x20de68) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x20de68['message']);
                }
            },
            'getSetting'(_0x3585b1, _0x229380) {
                try {
                    const _0xcedb8 = getSettingStmt['get'](_0x3585b1, _0x229380);
                    return _0xcedb8 ? JSON['parse'](_0xcedb8['value']) : null;
                } catch (_0x25fa3c) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x25fa3c['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x2c39c6) {
                try {
                    const _0x36a655 = getAllSettingsStmt['all'](_0x2c39c6);
                    const _0x4edf6c = {};
                    _0x36a655['forEach'](_0x5baafa => {
                        _0x4edf6c[_0x5baafa['key']] = JSON['parse'](_0x5baafa['value']);
                    });
                    return _0x4edf6c;
                } catch (_0x2a573a) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x2a573a['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x46ff81 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x46ff81['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x46ff81['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x425747) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x425747['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x11e8ad) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x11e8ad['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x34efe7) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x34efe7['message']);
        printLog('info', 'Falling\x20back\x20to\x20memory\x20+\x20JSON\x20file\x20storage');
    }
}
if (backend === 'memory') {
    printLog('store', 'Using\x20JSON\x20-\x20Max\x20' + MESSAGE_LIMITS['memory'] + '\x20messages\x20per\x20chat');
}
const store = {
    'messages': {},
    'contacts': {},
    'chats': {},
    'messageCount': {},
    'isPublic': ![],
    'botMode': 'private',
    async 'readFromFile'(_0x3add1c = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x4ec177 = await adapters[backend]['getAllContacts']();
                const _0x3b8957 = await adapters[backend]['getAllChats']();
                const _0x3d7763 = await this['getBotMode']();
                this['contacts'] = _0x4ec177;
                this['chats'] = _0x3b8957;
                this['botMode'] = _0x3d7763;
            } else {
                if (_0x0_0x140f11['existsSync'](_0x3add1c)) {
                    const _0x4260d2 = JSON['parse'](_0x0_0x140f11['readFileSync'](_0x3add1c, 'utf-8'));
                    this['contacts'] = _0x4260d2['contacts'] || {};
                    this['chats'] = _0x4260d2['chats'] || {};
                    this['botMode'] = _0x4260d2['botMode'] || 'private';
                    this['messages'] = _0x4260d2['messages'] || {};
                    this['isPublic'] = _0x4260d2['isPublic'] !== undefined ? _0x4260d2['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x3a0aaf) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x3a0aaf['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x52ff1c = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x29cb28 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x140f11['writeFileSync'](_0x52ff1c, JSON['stringify'](_0x29cb28, null, 0x2));
        } catch (_0x4f0825) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x4f0825['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x140f11['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x4ddfcb = JSON['parse'](_0x0_0x140f11['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x4ddfcb['messageCount'] || _0x4ddfcb;
                    this['isPublic'] = typeof _0x4ddfcb['isPublic'] === 'boolean' ? _0x4ddfcb['isPublic'] : ![];
                }
            } catch (_0x303620) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x303620['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x1640da = _0x0_0x15dfa1['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x140f11['existsSync'](_0x1640da))
                    _0x0_0x140f11['mkdirSync'](_0x1640da, { 'recursive': !![] });
                const _0x431730 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x140f11['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x431730, null, 0x2));
            } catch (_0x1c45a1) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x1c45a1['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x3bf63a => {
                if (typeof this['messages'][_0x3bf63a] === 'object' && !Array['isArray'](this['messages'][_0x3bf63a])) {
                    const _0x346c10 = Object['values'](this['messages'][_0x3bf63a]);
                    this['messages'][_0x3bf63a] = _0x346c10['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x3bf63a])) {
                    if (this['messages'][_0x3bf63a]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x3bf63a] = this['messages'][_0x3bf63a]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x3560b5 => {
                if (this['chats'][_0x3560b5]['messages']) {
                    delete this['chats'][_0x3560b5]['messages'];
                }
            });
        }
    },
    'bind'(_0x2f178e) {
        _0x2f178e['on']('messages.upsert', async ({messages: _0x1b5fa5}) => {
            for (const _0x1688c5 of _0x1b5fa5) {
                if (!_0x1688c5['key']?.['remoteJid'])
                    continue;
                const _0x76d9b0 = _0x1688c5['key']['remoteJid'];
                const _0x54cb98 = slimMessage(_0x1688c5);
                if (backend === 'memory') {
                    this['messages'][_0x76d9b0] = this['messages'][_0x76d9b0] || [];
                    this['messages'][_0x76d9b0]['push'](_0x54cb98);
                    if (this['messages'][_0x76d9b0]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x76d9b0] = this['messages'][_0x76d9b0]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x76d9b0, _0x1688c5['key']['id'], _0x54cb98);
                    } catch (_0x385530) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x1688c5['key']['id'] + ':', _0x385530['message']);
                    }
                }
            }
        });
        _0x2f178e['on']('contacts.update', async _0x2298bc => {
            for (const _0x5f4122 of _0x2298bc) {
                if (_0x5f4122['id']) {
                    const _0x31cdc7 = {
                        'id': _0x5f4122['id'],
                        'name': _0x5f4122['notify'] || _0x5f4122['name'] || _0x5f4122['verifiedName'] || '',
                        'notify': _0x5f4122['notify'],
                        'verifiedName': _0x5f4122['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x5f4122['id']] = _0x31cdc7;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x5f4122['id'], _0x31cdc7);
                        } catch (_0x40c578) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x40c578['message']);
                        }
                    }
                }
            }
        });
        _0x2f178e['on']('contacts.set', async _0x1762f1 => {
            for (const _0x8e7651 of _0x1762f1) {
                if (_0x8e7651['id']) {
                    const _0xe740b0 = {
                        'id': _0x8e7651['id'],
                        'name': _0x8e7651['notify'] || _0x8e7651['name'] || _0x8e7651['verifiedName'] || '',
                        'notify': _0x8e7651['notify'],
                        'verifiedName': _0x8e7651['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x8e7651['id']] = _0xe740b0;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x8e7651['id'], _0xe740b0);
                        } catch (_0x194ffe) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x194ffe['message']);
                        }
                    }
                }
            }
        });
        _0x2f178e['on']('chats.set', async _0x3a6e86 => {
            for (const _0x5633c0 of _0x3a6e86) {
                if (_0x5633c0['id']) {
                    const _0x1887f8 = {
                        'id': _0x5633c0['id'],
                        'name': _0x5633c0['name'] || _0x5633c0['subject'] || '',
                        'conversationTimestamp': _0x5633c0['conversationTimestamp'],
                        'unreadCount': _0x5633c0['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x5633c0['id']] = _0x1887f8;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x5633c0['id'], _0x1887f8);
                        } catch (_0xfdbd9c) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0xfdbd9c['message']);
                        }
                    }
                }
            }
        });
        _0x2f178e['on']('chats.update', async _0xdab891 => {
            for (const _0x227290 of _0xdab891) {
                if (_0x227290['id']) {
                    if (backend === 'memory') {
                        const _0x4eea49 = this['chats'][_0x227290['id']] || {};
                        this['chats'][_0x227290['id']] = {
                            'id': _0x227290['id'],
                            'name': _0x227290['name'] || _0x227290['subject'] || _0x4eea49['name'] || '',
                            'conversationTimestamp': _0x227290['conversationTimestamp'] || _0x4eea49['conversationTimestamp'],
                            'unreadCount': _0x227290['unreadCount'] !== undefined ? _0x227290['unreadCount'] : _0x4eea49['unreadCount']
                        };
                    } else {
                        try {
                            const _0x3f6a35 = await adapters[backend]['getChat'](_0x227290['id']) || {};
                            const _0x5e0b63 = {
                                'id': _0x227290['id'],
                                'name': _0x227290['name'] || _0x227290['subject'] || _0x3f6a35['name'] || '',
                                'conversationTimestamp': _0x227290['conversationTimestamp'] || _0x3f6a35['conversation_timestamp'],
                                'unreadCount': _0x227290['unreadCount'] !== undefined ? _0x227290['unreadCount'] : _0x3f6a35['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x227290['id'], _0x5e0b63);
                        } catch (_0x5eedce) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x5eedce['message']);
                        }
                    }
                }
            }
        });
        _0x2f178e['on']('chats.delete', async _0x5248da => {
            for (const _0x408ab7 of _0x5248da) {
                if (backend === 'memory') {
                    delete this['chats'][_0x408ab7];
                    delete this['messages'][_0x408ab7];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x408ab7);
                    } catch (_0x2f4f9e) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x2f4f9e['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x423bd3, _0x3cc970) {
        if (backend === 'memory') {
            const _0x23065c = this['messages'][_0x423bd3]?.['find'](_0xb9fd38 => _0xb9fd38['key']['id'] === _0x3cc970) || null;
            return _0x23065c;
        } else {
            try {
                return await adapters[backend]['load'](_0x423bd3, _0x3cc970);
            } catch (_0x4a46af) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x3cc970 + ':', _0x4a46af['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x377a54, _0x3f1530, _0x39661c) {
        if (backend === 'memory') {
            const _0x1d3231 = './data';
            if (!_0x0_0x140f11['existsSync'](_0x1d3231))
                _0x0_0x140f11['mkdirSync'](_0x1d3231, { 'recursive': !![] });
            const _0x417006 = _0x0_0x15dfa1['join'](_0x1d3231, _0x3f1530 + '.json');
            try {
                _0x0_0x140f11['writeFileSync'](_0x417006, JSON['stringify'](_0x39661c, null, 0x2));
            } catch (_0x2dbfb8) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x3f1530 + ':', _0x2dbfb8['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x377a54, _0x3f1530, _0x39661c);
            } catch (_0x207e28) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x3f1530 + ':', _0x207e28['message']);
            }
        }
    },
    async 'getSetting'(_0x14556a, _0x144167) {
        if (backend === 'memory') {
            const _0x3be5c4 = './data';
            const _0x1397b5 = _0x0_0x15dfa1['join'](_0x3be5c4, _0x144167 + '.json');
            try {
                if (_0x0_0x140f11['existsSync'](_0x1397b5)) {
                    const _0xcca466 = JSON['parse'](_0x0_0x140f11['readFileSync'](_0x1397b5, 'utf-8'));
                    if (_0xcca466['enabled'] !== undefined)
                        return _0xcca466;
                    if (_0xcca466[_0x14556a] !== undefined)
                        return _0xcca466[_0x14556a];
                    return null;
                }
                return null;
            } catch (_0x42dc11) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x144167 + ':', _0x42dc11['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x14556a, _0x144167);
            } catch (_0xe0c554) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x144167 + ':', _0xe0c554['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x339ef2) {
        if (backend === 'memory') {
            const _0x5e1e94 = './data';
            const _0x3bcded = {};
            try {
                if (_0x0_0x140f11['existsSync'](_0x5e1e94)) {
                    const _0x1f03b5 = _0x0_0x140f11['readdirSync'](_0x5e1e94)['filter'](_0x243878 => _0x243878['endsWith']('.json'));
                    for (const _0x66f261 of _0x1f03b5) {
                        const _0x36a786 = _0x0_0x15dfa1['basename'](_0x66f261, '.json');
                        if (_0x36a786 === 'messageCount' || _0x36a786 === 'owner')
                            continue;
                        const _0x614848 = _0x0_0x15dfa1['join'](_0x5e1e94, _0x66f261);
                        const _0x3c3c5a = JSON['parse'](_0x0_0x140f11['readFileSync'](_0x614848, 'utf-8'));
                        if (_0x3c3c5a[_0x339ef2]) {
                            _0x3bcded[_0x36a786] = _0x3c3c5a[_0x339ef2];
                        }
                    }
                }
                return _0x3bcded;
            } catch (_0x46a152) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x46a152['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x339ef2);
            } catch (_0x440cc8) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x440cc8['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x1aa316) {
        const _0x682cb0 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x682cb0['includes'](_0x1aa316)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x1aa316 + ',\x20defaulting\x20to\x20private');
            _0x1aa316 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x1aa316;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x1aa316);
            } catch (_0x1ac416) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x1ac416['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x15dc18 = await adapters[backend]['getMetadata']('botMode');
                return _0x15dc18 || 'private';
            } catch (_0x42e8ef) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x42e8ef['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x51257e, _0x47cc9e, _0x5544c4) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x51257e]) {
                this['messageCount'][_0x51257e] = {};
            }
            if (!this['messageCount'][_0x51257e][_0x47cc9e]) {
                this['messageCount'][_0x51257e][_0x47cc9e] = 0x0;
            }
            this['messageCount'][_0x51257e][_0x47cc9e]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x51257e, _0x47cc9e);
            } catch (_0x1aacc5) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x47cc9e + ':', _0x1aacc5['message']);
            }
        }
    },
    async 'getMessageCount'(_0x16a0c9, _0x213fdf) {
        if (backend === 'memory') {
            return this['messageCount'][_0x16a0c9]?.[_0x213fdf] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x16a0c9, _0x213fdf);
            } catch (_0x5da5a9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x213fdf + ':', _0x5da5a9['message']);
                return 0x0;
            }
        }
    },
    async 'getAllMessageCounts'() {
        if (backend === 'memory') {
            return {
                'isPublic': this['isPublic'],
                'messageCount': this['messageCount']
            };
        } else {
            try {
                return await adapters[backend]['getAllCounts']();
            } catch (_0x3953f3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x3953f3['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x24c2e3) {
        if (backend === 'memory') {
            this['isPublic'] = _0x24c2e3;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x24c2e3);
            } catch (_0x4d9a54) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x4d9a54['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x50b383 = await adapters[backend]['getAllCounts']();
                return _0x50b383['isPublic'];
            } catch (_0x11e6d9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x11e6d9['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x5a30ad) {
        const _0x36d68a = [
            'public',
            'private'
        ];
        if (!_0x36d68a['includes'](_0x5a30ad)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x5a30ad);
            _0x5a30ad = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x5a30ad;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x5a30ad);
            } catch (_0x174ab4) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x174ab4['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x2ad63a = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x2ad63a || 'private';
            } catch (_0xd6a46e) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0xd6a46e['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x37c95d = 0x0;
        const _0x45d73d = Object['keys'](this['contacts'])['length'];
        const _0x24db62 = Object['keys'](this['chats'])['length'];
        let _0x451aa3 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x575382 => {
                if (Array['isArray'](_0x575382)) {
                    _0x37c95d += _0x575382['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x87641e => {
                if (typeof _0x87641e === 'object') {
                    _0x451aa3 += Object['keys'](_0x87641e)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x37c95d : 'stored\x20in\x20database',
            'contacts': _0x45d73d,
            'chats': _0x24db62,
            'messageCounts': backend === 'memory' ? _0x451aa3 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x3f2de9 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x3f2de9));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x1b5688 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x1b5688));
        }
    }, CLEANUP_INTERVAL);
}
if (backend === 'memory') {
    setInterval(() => {
        store['writeToFile']();
    }, 0x5 * 0x3c * 0x3e8);
}
setInterval(() => {
    if (store['chats']) {
        let _0x8aa96e = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x4bb181 => {
            if (store['chats'][_0x4bb181]['messages']) {
                delete store['chats'][_0x4bb181]['messages'];
                _0x8aa96e++;
            }
        });
        if (_0x8aa96e > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x8aa96e + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x2d3c7f => {
    console['log']('[STORE]\x20Received\x20' + _0x2d3c7f + ',\x20shutting\x20down\x20gracefully...');
    if (cleanupTimer) {
        clearInterval(cleanupTimer);
        cleanupTimer = null;
    }
    if (backend === 'memory') {
        store['writeToFile']();
    }
    if (backend !== 'memory' && adapters[backend]['close']) {
        try {
            await adapters[backend]['close']();
        } catch (_0x2e9830) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x2e9830['message']);
        }
    }
    console['log']('[STORE]\x20Shutdown\x20complete');
};
process['on']('SIGINT', async () => {
    await gracefulShutdown('SIGINT');
    process['exit'](0x0);
});
process['on']('SIGTERM', async () => {
    await gracefulShutdown('SIGTERM');
    process['exit'](0x0);
});
process['on']('beforeExit', async () => {
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('uncaughtException', _0x399746 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x399746);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x17c706, _0x36b53b) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x36b53b, 'reason:', _0x17c706);
});
export default store;