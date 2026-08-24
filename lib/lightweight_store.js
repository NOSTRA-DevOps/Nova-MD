import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0xc0aea1 from 'fs';
import _0x0_0x2c0521 from 'path';
import _0x0_0x509f3d from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x142eac) {
    printLog = (_0x3f5208, _0x4154d3) => console['log']('[' + _0x3f5208['toUpperCase']() + ']\x20' + _0x4154d3);
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
} catch (_0x0_0xf61e83) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x51d6c7 => {
    try {
        return _0x0_0x509f3d['deflateSync'](JSON['stringify'](_0x51d6c7));
    } catch (_0x425dff) {
        console['error']('[STORE]\x20Compression\x20error:', _0x425dff['message']);
        return Buffer['from'](JSON['stringify'](_0x51d6c7));
    }
};
const decompress = _0xba597c => {
    try {
        return JSON['parse'](_0x0_0x509f3d['inflateSync'](_0xba597c));
    } catch (_0x97eb2b) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x97eb2b['message']);
        try {
            return JSON['parse'](_0xba597c['toString']());
        } catch (_0x118ffc) {
            return null;
        }
    }
};
function slimMessage(_0x6ad3e3) {
    return {
        'key': _0x6ad3e3['key'],
        'message': _0x6ad3e3['message'],
        'messageTimestamp': _0x6ad3e3['messageTimestamp'],
        'participant': _0x6ad3e3['participant'],
        'pushName': _0x6ad3e3['pushName'],
        'broadcast': _0x6ad3e3['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x254efe => console['error']('[MONGO]\x20Connection\x20error:', _0x254efe));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x2d98fc, _0x3d1e82, _0x1636c4) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x2d98fc,
                        'id': _0x3d1e82
                    }, {
                        'data': compress(_0x1636c4),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x52bb17) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x52bb17['message']);
                }
            },
            async 'load'(_0x2cba7e, _0x1c7663) {
                try {
                    const _0x5f2ddf = await Msg['findOne']({
                        'jid': _0x2cba7e,
                        'id': _0x1c7663
                    });
                    return _0x5f2ddf ? decompress(_0x5f2ddf['data']) : null;
                } catch (_0x267b3c) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x267b3c['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x505e7d, _0x5b393e) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x505e7d,
                        'userId': _0x5b393e
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x22cd62) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x22cd62['message']);
                }
            },
            async 'getCount'(_0x13d7d6, _0xf55a7a) {
                try {
                    const _0xbfbd8a = await MsgCount['findOne']({
                        'chatId': _0x13d7d6,
                        'userId': _0xf55a7a
                    });
                    return _0xbfbd8a ? _0xbfbd8a['count'] : 0x0;
                } catch (_0x43807e) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x43807e['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x59b6fd = await MsgCount['find']({});
                    const _0x49bfe5 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x59b6fd['forEach'](_0x4835b4 => {
                        if (!_0x49bfe5['messageCount'][_0x4835b4['chatId']]) {
                            _0x49bfe5['messageCount'][_0x4835b4['chatId']] = {};
                        }
                        _0x49bfe5['messageCount'][_0x4835b4['chatId']][_0x4835b4['userId']] = _0x4835b4['count'];
                    });
                    const _0x597f0d = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x597f0d)
                        _0x49bfe5['isPublic'] = _0x597f0d['value'] === 'true';
                    return _0x49bfe5;
                } catch (_0x58bc28) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x58bc28['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x470a22) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x470a22['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x2b086a) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x2b086a['message']);
                }
            },
            async 'setMetadata'(_0x3f6359, _0x1ce0a3) {
                try {
                    await Meta['updateOne']({ 'key': _0x3f6359 }, {
                        'key': _0x3f6359,
                        'value': _0x1ce0a3['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x97a6c8) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x97a6c8['message']);
                }
            },
            async 'getMetadata'(_0x4f26b7) {
                try {
                    const _0x5df7d3 = await Meta['findOne']({ 'key': _0x4f26b7 });
                    return _0x5df7d3 ? _0x5df7d3['value'] : null;
                } catch (_0x2b0df2) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x2b0df2['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x35a72b, _0x24b0b4) {
                try {
                    await Contact['updateOne']({ 'jid': _0x35a72b }, {
                        ..._0x24b0b4,
                        'jid': _0x35a72b,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5bd7cd) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x5bd7cd['message']);
                }
            },
            async 'getContact'(_0x5876bd) {
                try {
                    return await Contact['findOne']({ 'jid': _0x5876bd });
                } catch (_0xbcb08) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0xbcb08['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x2a2983 = await Contact['find']({});
                    const _0x1a5f5f = {};
                    _0x2a2983['forEach'](_0x56a422 => {
                        _0x1a5f5f[_0x56a422['jid']] = {
                            'id': _0x56a422['jid'],
                            'name': _0x56a422['name'],
                            'notify': _0x56a422['notify']
                        };
                    });
                    return _0x1a5f5f;
                } catch (_0x588551) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x588551['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x586ef3, _0x22a822) {
                try {
                    await Chat['updateOne']({ 'jid': _0x586ef3 }, {
                        ..._0x22a822,
                        'jid': _0x586ef3,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x239888) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x239888['message']);
                }
            },
            async 'getChat'(_0x4cd3f3) {
                try {
                    return await Chat['findOne']({ 'jid': _0x4cd3f3 });
                } catch (_0x3ba7e8) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x3ba7e8['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x448222 = await Chat['find']({});
                    const _0x2dc1c6 = {};
                    _0x448222['forEach'](_0x18db8e => {
                        _0x2dc1c6[_0x18db8e['jid']] = {
                            'id': _0x18db8e['jid'],
                            'name': _0x18db8e['name'],
                            'conversationTimestamp': _0x18db8e['conversationTimestamp'],
                            'unreadCount': _0x18db8e['unreadCount']
                        };
                    });
                    return _0x2dc1c6;
                } catch (_0x4288a5) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x4288a5['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x588c94) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x588c94 });
                } catch (_0x3930f0) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x3930f0['message']);
                }
            },
            async 'saveSetting'(_0x5afb2d, _0x101253, _0x54b2a3) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x5afb2d,
                        'key': _0x101253
                    }, {
                        'chatId': _0x5afb2d,
                        'key': _0x101253,
                        'value': _0x54b2a3,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4883cc) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x4883cc['message']);
                }
            },
            async 'getSetting'(_0x1826e9, _0x5e49c4) {
                try {
                    const _0xb1a98b = await Setting['findOne']({
                        'chatId': _0x1826e9,
                        'key': _0x5e49c4
                    });
                    return _0xb1a98b ? _0xb1a98b['value'] : null;
                } catch (_0x37bb7) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x37bb7['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x2019a9) {
                try {
                    const _0x1db32b = await Setting['find']({ 'chatId': _0x2019a9 });
                    const _0x2d05cd = {};
                    _0x1db32b['forEach'](_0x1b2ef9 => {
                        _0x2d05cd[_0x1b2ef9['key']] = _0x1b2ef9['value'];
                    });
                    return _0x2d05cd;
                } catch (_0x8ff233) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x8ff233['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x592028 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x592028['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x592028['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x9d54c1) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x9d54c1['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x2b6d74) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x2b6d74['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x525aa4) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x525aa4['message']);
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
        pool['on']('error', _0x5bb942 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x5bb942['message']);
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
                        const _0x49f112 = await pool['connect']();
                        try {
                            await _0x49f112['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x49f112['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x49f112['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x49f112['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x49f112['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x49f112['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x49f112['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x49f112['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x49f112['release']();
                        }
                    } catch (_0x5cceec) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x5cceec['message']);
                        this['initPromise'] = null;
                        throw _0x5cceec;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x299759, _0x50f793, _0x12d8f5) {
                try {
                    await this['init']();
                    const _0x305e18 = await pool['connect']();
                    try {
                        await _0x305e18['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x299759,
                            _0x50f793,
                            Date['now'](),
                            compress(_0x12d8f5)
                        ]);
                    } finally {
                        _0x305e18['release']();
                    }
                } catch (_0x5ebfec) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x5ebfec['message']);
                }
            },
            async 'load'(_0x2e3838, _0x5b5b9f) {
                try {
                    await this['init']();
                    const _0x3e3501 = await pool['connect']();
                    try {
                        const _0x3c20b9 = await _0x3e3501['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x2e3838,
                            _0x5b5b9f
                        ]);
                        return _0x3c20b9['rows'][0x0] ? decompress(_0x3c20b9['rows'][0x0]['data']) : null;
                    } finally {
                        _0x3e3501['release']();
                    }
                } catch (_0x30d9c8) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x30d9c8['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x396275, _0x5c76e5) {
                try {
                    await this['init']();
                    const _0x1d6e5d = await pool['connect']();
                    try {
                        await _0x1d6e5d['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x396275,
                            _0x5c76e5
                        ]);
                    } finally {
                        _0x1d6e5d['release']();
                    }
                } catch (_0x4ac07e) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x4ac07e['message']);
                }
            },
            async 'getCount'(_0x4c4d1f, _0x4aa525) {
                try {
                    await this['init']();
                    const _0x52d115 = await pool['connect']();
                    try {
                        const _0x1358b0 = await _0x52d115['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x4c4d1f,
                            _0x4aa525
                        ]);
                        return _0x1358b0['rows'][0x0] ? _0x1358b0['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x52d115['release']();
                    }
                } catch (_0x50eb8e) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x50eb8e['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x3b4b80 = await pool['connect']();
                    try {
                        const _0x5de484 = await _0x3b4b80['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x51391b = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x5de484['rows']['forEach'](_0xd2162c => {
                            if (!_0x51391b['messageCount'][_0xd2162c['chat_id']]) {
                                _0x51391b['messageCount'][_0xd2162c['chat_id']] = {};
                            }
                            _0x51391b['messageCount'][_0xd2162c['chat_id']][_0xd2162c['user_id']] = _0xd2162c['count'];
                        });
                        const _0x33fae5 = await _0x3b4b80['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x33fae5['rows'][0x0])
                            _0x51391b['isPublic'] = _0x33fae5['rows'][0x0]['value'] === 'true';
                        return _0x51391b;
                    } finally {
                        _0x3b4b80['release']();
                    }
                } catch (_0x420166) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x420166['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x315adc) {
                try {
                    await this['init']();
                    const _0x291b25 = await pool['connect']();
                    try {
                        await _0x291b25['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x315adc['toString']()]);
                    } finally {
                        _0x291b25['release']();
                    }
                } catch (_0x461ab0) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x461ab0['message']);
                }
            },
            async 'setMetadata'(_0x398c1f, _0x1d7c7e) {
                try {
                    await this['init']();
                    const _0x53ce97 = await pool['connect']();
                    try {
                        await _0x53ce97['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x398c1f,
                            _0x1d7c7e['toString']()
                        ]);
                    } finally {
                        _0x53ce97['release']();
                    }
                } catch (_0x18b303) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x18b303['message']);
                }
            },
            async 'getMetadata'(_0x22e5a6) {
                try {
                    await this['init']();
                    const _0x5e5c0e = await pool['connect']();
                    try {
                        const _0xcb0251 = await _0x5e5c0e['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x22e5a6]);
                        return _0xcb0251['rows'][0x0] ? _0xcb0251['rows'][0x0]['value'] : null;
                    } finally {
                        _0x5e5c0e['release']();
                    }
                } catch (_0x5b75d9) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x5b75d9['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x2cb696, _0x4249c5) {
                try {
                    await this['init']();
                    const _0x379851 = await pool['connect']();
                    try {
                        await _0x379851['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x2cb696,
                            _0x4249c5['name'] || '',
                            _0x4249c5['notify'] || '',
                            _0x4249c5['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x379851['release']();
                    }
                } catch (_0x1062b0) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x1062b0['message']);
                }
            },
            async 'getContact'(_0x46fef7) {
                try {
                    await this['init']();
                    const _0x1fc31b = await pool['connect']();
                    try {
                        const _0x76637b = await _0x1fc31b['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x46fef7]);
                        return _0x76637b['rows'][0x0] || null;
                    } finally {
                        _0x1fc31b['release']();
                    }
                } catch (_0x2f53d5) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x2f53d5['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x26329f = await pool['connect']();
                    try {
                        const _0x118a3a = await _0x26329f['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x1b08e3 = {};
                        _0x118a3a['rows']['forEach'](_0x422a35 => {
                            _0x1b08e3[_0x422a35['jid']] = {
                                'id': _0x422a35['jid'],
                                'name': _0x422a35['name'],
                                'notify': _0x422a35['notify']
                            };
                        });
                        return _0x1b08e3;
                    } finally {
                        _0x26329f['release']();
                    }
                } catch (_0x572fef) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x572fef['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x511631, _0x434a69) {
                try {
                    await this['init']();
                    const _0x2c954a = await pool['connect']();
                    try {
                        await _0x2c954a['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x511631,
                            _0x434a69['name'] || '',
                            _0x434a69['conversationTimestamp'] || 0x0,
                            _0x434a69['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x2c954a['release']();
                    }
                } catch (_0x4749a6) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x4749a6['message']);
                }
            },
            async 'getChat'(_0x92f2c) {
                try {
                    await this['init']();
                    const _0x5a66f1 = await pool['connect']();
                    try {
                        const _0x4a175d = await _0x5a66f1['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x92f2c]);
                        return _0x4a175d['rows'][0x0] || null;
                    } finally {
                        _0x5a66f1['release']();
                    }
                } catch (_0x3de378) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x3de378['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x2ce8b1 = await pool['connect']();
                    try {
                        const _0x34cc2d = await _0x2ce8b1['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x1c8d70 = {};
                        _0x34cc2d['rows']['forEach'](_0x2f5b0a => {
                            _0x1c8d70[_0x2f5b0a['jid']] = {
                                'id': _0x2f5b0a['jid'],
                                'name': _0x2f5b0a['name'],
                                'conversationTimestamp': _0x2f5b0a['conversation_timestamp'],
                                'unreadCount': _0x2f5b0a['unread_count']
                            };
                        });
                        return _0x1c8d70;
                    } finally {
                        _0x2ce8b1['release']();
                    }
                } catch (_0x21c2d0) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x21c2d0['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x5b3195) {
                try {
                    await this['init']();
                    const _0x29bf1b = await pool['connect']();
                    try {
                        await _0x29bf1b['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x5b3195]);
                    } finally {
                        _0x29bf1b['release']();
                    }
                } catch (_0x3ff6d3) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x3ff6d3['message']);
                }
            },
            async 'saveSetting'(_0x3b2614, _0xd45d9d, _0x33a525) {
                try {
                    await this['init']();
                    const _0x4ad134 = await pool['connect']();
                    try {
                        await _0x4ad134['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x3b2614,
                            _0xd45d9d,
                            JSON['stringify'](_0x33a525),
                            Date['now']()
                        ]);
                    } finally {
                        _0x4ad134['release']();
                    }
                } catch (_0x25bc37) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x25bc37['message']);
                }
            },
            async 'getSetting'(_0x2e3614, _0x27bb09) {
                try {
                    await this['init']();
                    const _0x527a12 = await pool['connect']();
                    try {
                        const _0x1eed06 = await _0x527a12['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x2e3614,
                            _0x27bb09
                        ]);
                        return _0x1eed06['rows'][0x0] ? JSON['parse'](_0x1eed06['rows'][0x0]['value']) : null;
                    } finally {
                        _0x527a12['release']();
                    }
                } catch (_0x19c030) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x19c030['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x2cc2a8) {
                try {
                    await this['init']();
                    const _0x1f379c = await pool['connect']();
                    try {
                        const _0x283ed4 = await _0x1f379c['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x2cc2a8]);
                        const _0x48a266 = {};
                        _0x283ed4['rows']['forEach'](_0x5cc125 => {
                            _0x48a266[_0x5cc125['key']] = JSON['parse'](_0x5cc125['value']);
                        });
                        return _0x48a266;
                    } finally {
                        _0x1f379c['release']();
                    }
                } catch (_0x1e398b) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x1e398b['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x512d27 = await pool['connect']();
                    try {
                        const _0x4d3856 = await _0x512d27['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x4d3856['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x4d3856['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x512d27['release']();
                    }
                } catch (_0x1025c6) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x1025c6['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x28e79a) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x28e79a['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x4537fa) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x4537fa['message']);
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
                    } catch (_0x5b2222) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x5b2222['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x5b2222;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x3aab8f, _0x2dff0c, _0x201a71) {
                try {
                    const _0x4865b9 = await this['getConn']();
                    await _0x4865b9['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x3aab8f,
                        _0x2dff0c,
                        Date['now'](),
                        compress(_0x201a71)
                    ]);
                } catch (_0x823dd5) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x823dd5['message']);
                }
            },
            async 'load'(_0x2309f9, _0x1babd5) {
                try {
                    const _0x352572 = await this['getConn']();
                    const [_0x5d82ca] = await _0x352572['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x2309f9,
                        _0x1babd5
                    ]);
                    return _0x5d82ca[0x0] ? decompress(_0x5d82ca[0x0]['data']) : null;
                } catch (_0x1f3c19) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x1f3c19['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x1a67c7, _0x40b867) {
                try {
                    const _0x318a68 = await this['getConn']();
                    await _0x318a68['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x1a67c7,
                        _0x40b867
                    ]);
                } catch (_0x185cc1) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x185cc1['message']);
                }
            },
            async 'getCount'(_0x2f79d1, _0x53ff29) {
                try {
                    const _0x531fbf = await this['getConn']();
                    const [_0x4260eb] = await _0x531fbf['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x2f79d1,
                        _0x53ff29
                    ]);
                    return _0x4260eb[0x0] ? _0x4260eb[0x0]['count'] : 0x0;
                } catch (_0x2584db) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x2584db['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x1b976f = await this['getConn']();
                    const [_0x2ac8b3] = await _0x1b976f['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x13b955 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2ac8b3['forEach'](_0x16ee5a => {
                        if (!_0x13b955['messageCount'][_0x16ee5a['chat_id']]) {
                            _0x13b955['messageCount'][_0x16ee5a['chat_id']] = {};
                        }
                        _0x13b955['messageCount'][_0x16ee5a['chat_id']][_0x16ee5a['user_id']] = _0x16ee5a['count'];
                    });
                    const [_0x6bf509] = await _0x1b976f['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x6bf509[0x0])
                        _0x13b955['isPublic'] = _0x6bf509[0x0]['value'] === 'true';
                    return _0x13b955;
                } catch (_0x193269) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x193269['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x1babe0) {
                try {
                    const _0x7a58c2 = await this['getConn']();
                    await _0x7a58c2['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x1babe0['toString']()]);
                } catch (_0x11174d) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x11174d['message']);
                }
            },
            async 'setMetadata'(_0x146f02, _0x528b91) {
                try {
                    const _0x3f1fb6 = await this['getConn']();
                    await _0x3f1fb6['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x146f02,
                        _0x528b91['toString']()
                    ]);
                } catch (_0x238053) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x238053['message']);
                }
            },
            async 'getMetadata'(_0x5f3e0d) {
                try {
                    const _0x354c1d = await this['getConn']();
                    const [_0x18146b] = await _0x354c1d['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x5f3e0d]);
                    return _0x18146b[0x0] ? _0x18146b[0x0]['value'] : null;
                } catch (_0x2ca960) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x2ca960['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xa64e39, _0x57e711) {
                try {
                    const _0x14111c = await this['getConn']();
                    await _0x14111c['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0xa64e39,
                        _0x57e711['name'] || '',
                        _0x57e711['notify'] || '',
                        _0x57e711['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x4cc4c3) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x4cc4c3['message']);
                }
            },
            async 'getContact'(_0x207472) {
                try {
                    const _0xd47df5 = await this['getConn']();
                    const [_0x58db6d] = await _0xd47df5['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x207472]);
                    return _0x58db6d[0x0] || null;
                } catch (_0x4eda52) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x4eda52['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x29ff4c = await this['getConn']();
                    const [_0x4968ca] = await _0x29ff4c['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x3050dd = {};
                    _0x4968ca['forEach'](_0x15b6b7 => {
                        _0x3050dd[_0x15b6b7['jid']] = {
                            'id': _0x15b6b7['jid'],
                            'name': _0x15b6b7['name'],
                            'notify': _0x15b6b7['notify']
                        };
                    });
                    return _0x3050dd;
                } catch (_0x15c43a) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x15c43a['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x546987, _0x4638fa) {
                try {
                    const _0x9f3e6e = await this['getConn']();
                    await _0x9f3e6e['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x546987,
                        _0x4638fa['name'] || '',
                        _0x4638fa['conversationTimestamp'] || 0x0,
                        _0x4638fa['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x48a5bf) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x48a5bf['message']);
                }
            },
            async 'getChat'(_0x2587eb) {
                try {
                    const _0x331dff = await this['getConn']();
                    const [_0x582d62] = await _0x331dff['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x2587eb]);
                    return _0x582d62[0x0] || null;
                } catch (_0x140d15) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x140d15['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x14463c = await this['getConn']();
                    const [_0x320b06] = await _0x14463c['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x4e3cf4 = {};
                    _0x320b06['forEach'](_0x3e12d8 => {
                        _0x4e3cf4[_0x3e12d8['jid']] = {
                            'id': _0x3e12d8['jid'],
                            'name': _0x3e12d8['name'],
                            'conversationTimestamp': _0x3e12d8['conversation_timestamp'],
                            'unreadCount': _0x3e12d8['unread_count']
                        };
                    });
                    return _0x4e3cf4;
                } catch (_0xefd93e) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0xefd93e['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x56a175) {
                try {
                    const _0x4455e3 = await this['getConn']();
                    await _0x4455e3['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x56a175]);
                } catch (_0x45615e) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x45615e['message']);
                }
            },
            async 'saveSetting'(_0x298c9f, _0x3fbde3, _0x208b96) {
                try {
                    const _0x56967e = await this['getConn']();
                    await _0x56967e['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x298c9f,
                        _0x3fbde3,
                        JSON['stringify'](_0x208b96),
                        Date['now']()
                    ]);
                } catch (_0x444049) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x444049['message']);
                }
            },
            async 'getSetting'(_0x3b347c, _0x26c55c) {
                try {
                    const _0x52609c = await this['getConn']();
                    const [_0x2b4057] = await _0x52609c['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x3b347c,
                        _0x26c55c
                    ]);
                    return _0x2b4057[0x0] ? JSON['parse'](_0x2b4057[0x0]['value']) : null;
                } catch (_0x1bbac9) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x1bbac9['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x3384dd) {
                try {
                    const _0x32f0c6 = await this['getConn']();
                    const [_0xefd28] = await _0x32f0c6['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x3384dd]);
                    const _0x3770cf = {};
                    _0xefd28['forEach'](_0x19c410 => {
                        _0x3770cf[_0x19c410['key']] = JSON['parse'](_0x19c410['value']);
                    });
                    return _0x3770cf;
                } catch (_0x27aa05) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x27aa05['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x28ac87 = await this['getConn']();
                    const [_0xbff737] = await _0x28ac87['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0xbff737['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0xbff737['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x3efa7c) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x3efa7c['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x4799d0) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x4799d0['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x2e80ad) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x2e80ad['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x2c0521['dirname'](SQLITE_URL);
        if (!_0x0_0xc0aea1['existsSync'](dir))
            _0x0_0xc0aea1['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x390fe7, _0x152450, _0x34a785) {
                try {
                    saveStmt['run'](_0x390fe7, _0x152450, Date['now'](), compress(_0x34a785));
                    const {count: _0x387782} = countStmt['get'](_0x390fe7);
                    if (_0x387782 > MESSAGE_LIMITS['sqlite']) {
                        const _0xcc7082 = _0x387782 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x390fe7, _0x390fe7, _0xcc7082);
                    }
                } catch (_0x5a3672) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x5a3672['message']);
                }
            },
            'load'(_0x117f87, _0x53c5f6) {
                try {
                    const _0x5271bb = loadStmt['get'](_0x117f87, _0x53c5f6);
                    return _0x5271bb ? decompress(_0x5271bb['data']) : null;
                } catch (_0x32df80) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x32df80['message']);
                    return null;
                }
            },
            'incrementCount'(_0x5af751, _0x1fb088) {
                try {
                    incrementCountStmt['run'](_0x5af751, _0x1fb088);
                } catch (_0x676825) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x676825['message']);
                }
            },
            'getCount'(_0x4bc993, _0x453bf5) {
                try {
                    const _0x5c6618 = getCountStmt['get'](_0x4bc993, _0x453bf5);
                    return _0x5c6618 ? _0x5c6618['count'] : 0x0;
                } catch (_0x84107f) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x84107f['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x1df0ed = getAllCountsStmt['all']();
                    const _0x23d8af = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x1df0ed['forEach'](_0x4416b3 => {
                        if (!_0x23d8af['messageCount'][_0x4416b3['chat_id']]) {
                            _0x23d8af['messageCount'][_0x4416b3['chat_id']] = {};
                        }
                        _0x23d8af['messageCount'][_0x4416b3['chat_id']][_0x4416b3['user_id']] = _0x4416b3['count'];
                    });
                    const _0x257baa = getMetaStmt['get']();
                    if (_0x257baa)
                        _0x23d8af['isPublic'] = _0x257baa['value'] === 'true';
                    return _0x23d8af;
                } catch (_0x5c8d44) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x5c8d44['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x277ed3) {
                try {
                    setMetaStmt['run'](_0x277ed3['toString']());
                } catch (_0x3586da) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x3586da['message']);
                }
            },
            'setMetadata'(_0x5d168c, _0x50f931) {
                try {
                    setMetadataStmt['run'](_0x5d168c, _0x50f931['toString']());
                } catch (_0x4b2936) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x4b2936['message']);
                }
            },
            'getMetadata'(_0x296ed0) {
                try {
                    const _0x16b0fe = getMetadataStmt['get'](_0x296ed0);
                    return _0x16b0fe ? _0x16b0fe['value'] : null;
                } catch (_0xf4d995) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0xf4d995['message']);
                    return null;
                }
            },
            'saveContact'(_0x406072, _0x101bee) {
                try {
                    saveContactStmt['run'](_0x406072, _0x101bee['name'] || '', _0x101bee['notify'] || '', _0x101bee['verifiedName'] || '', Date['now']());
                } catch (_0x728d91) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x728d91['message']);
                }
            },
            'getContact'(_0x1cd4be) {
                try {
                    return getContactStmt['get'](_0x1cd4be) || null;
                } catch (_0x13de7d) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x13de7d['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x453af2 = getAllContactsStmt['all']();
                    const _0x3e9536 = {};
                    _0x453af2['forEach'](_0x48884e => {
                        _0x3e9536[_0x48884e['jid']] = {
                            'id': _0x48884e['jid'],
                            'name': _0x48884e['name'],
                            'notify': _0x48884e['notify']
                        };
                    });
                    return _0x3e9536;
                } catch (_0x4846b5) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x4846b5['message']);
                    return {};
                }
            },
            'saveChat'(_0x5ec646, _0x3031b3) {
                try {
                    saveChatStmt['run'](_0x5ec646, _0x3031b3['name'] || '', _0x3031b3['conversationTimestamp'] || 0x0, _0x3031b3['unreadCount'] || 0x0, Date['now']());
                } catch (_0x10ce32) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x10ce32['message']);
                }
            },
            'getChat'(_0x320f25) {
                try {
                    return getChatStmt['get'](_0x320f25) || null;
                } catch (_0x1fda0c) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x1fda0c['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x3085a6 = getAllChatsStmt['all']();
                    const _0x22aebd = {};
                    _0x3085a6['forEach'](_0x208747 => {
                        _0x22aebd[_0x208747['jid']] = {
                            'id': _0x208747['jid'],
                            'name': _0x208747['name'],
                            'conversationTimestamp': _0x208747['conversation_timestamp'],
                            'unreadCount': _0x208747['unread_count']
                        };
                    });
                    return _0x22aebd;
                } catch (_0x6d760f) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x6d760f['message']);
                    return {};
                }
            },
            'deleteChat'(_0x343a79) {
                try {
                    deleteChatStmt['run'](_0x343a79);
                } catch (_0x13c1f5) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x13c1f5['message']);
                }
            },
            'saveSetting'(_0x55a0bd, _0x59dbe1, _0xb28eac) {
                try {
                    saveSettingStmt['run'](_0x55a0bd, _0x59dbe1, JSON['stringify'](_0xb28eac), Date['now']());
                } catch (_0x4e3618) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x4e3618['message']);
                }
            },
            'getSetting'(_0x36f4c2, _0x71d97d) {
                try {
                    const _0xcd3f2a = getSettingStmt['get'](_0x36f4c2, _0x71d97d);
                    return _0xcd3f2a ? JSON['parse'](_0xcd3f2a['value']) : null;
                } catch (_0x637ddb) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x637ddb['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x1c1680) {
                try {
                    const _0x17fcd1 = getAllSettingsStmt['all'](_0x1c1680);
                    const _0x457f5d = {};
                    _0x17fcd1['forEach'](_0x4703c0 => {
                        _0x457f5d[_0x4703c0['key']] = JSON['parse'](_0x4703c0['value']);
                    });
                    return _0x457f5d;
                } catch (_0x3f8f1b) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x3f8f1b['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x33eb4c = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x33eb4c['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x33eb4c['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x49723e) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x49723e['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x5d416f) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x5d416f['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x2fec29) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x2fec29['message']);
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
    async 'readFromFile'(_0x2a46e3 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x12a9f9 = await adapters[backend]['getAllContacts']();
                const _0x3a2e9a = await adapters[backend]['getAllChats']();
                const _0x45ca7f = await this['getBotMode']();
                this['contacts'] = _0x12a9f9;
                this['chats'] = _0x3a2e9a;
                this['botMode'] = _0x45ca7f;
            } else {
                if (_0x0_0xc0aea1['existsSync'](_0x2a46e3)) {
                    const _0x42f9fe = JSON['parse'](_0x0_0xc0aea1['readFileSync'](_0x2a46e3, 'utf-8'));
                    this['contacts'] = _0x42f9fe['contacts'] || {};
                    this['chats'] = _0x42f9fe['chats'] || {};
                    this['botMode'] = _0x42f9fe['botMode'] || 'private';
                    this['messages'] = _0x42f9fe['messages'] || {};
                    this['isPublic'] = _0x42f9fe['isPublic'] !== undefined ? _0x42f9fe['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x2d5ed5) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x2d5ed5['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x57538e = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x39583d = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0xc0aea1['writeFileSync'](_0x57538e, JSON['stringify'](_0x39583d, null, 0x2));
        } catch (_0x18ee76) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x18ee76['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0xc0aea1['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x4ab8b2 = JSON['parse'](_0x0_0xc0aea1['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x4ab8b2['messageCount'] || _0x4ab8b2;
                    this['isPublic'] = typeof _0x4ab8b2['isPublic'] === 'boolean' ? _0x4ab8b2['isPublic'] : ![];
                }
            } catch (_0x18cb7d) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x18cb7d['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x48c8e4 = _0x0_0x2c0521['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0xc0aea1['existsSync'](_0x48c8e4))
                    _0x0_0xc0aea1['mkdirSync'](_0x48c8e4, { 'recursive': !![] });
                const _0x5036dd = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0xc0aea1['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x5036dd, null, 0x2));
            } catch (_0x2b19a4) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x2b19a4['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x3e002c => {
                if (typeof this['messages'][_0x3e002c] === 'object' && !Array['isArray'](this['messages'][_0x3e002c])) {
                    const _0x5a4613 = Object['values'](this['messages'][_0x3e002c]);
                    this['messages'][_0x3e002c] = _0x5a4613['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x3e002c])) {
                    if (this['messages'][_0x3e002c]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x3e002c] = this['messages'][_0x3e002c]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x38d953 => {
                if (this['chats'][_0x38d953]['messages']) {
                    delete this['chats'][_0x38d953]['messages'];
                }
            });
        }
    },
    'bind'(_0x30dc0f) {
        _0x30dc0f['on']('messages.upsert', async ({messages: _0x28d83c}) => {
            for (const _0x14955a of _0x28d83c) {
                if (!_0x14955a['key']?.['remoteJid'])
                    continue;
                const _0x3a7d25 = _0x14955a['key']['remoteJid'];
                const _0x3bc0b6 = slimMessage(_0x14955a);
                if (backend === 'memory') {
                    this['messages'][_0x3a7d25] = this['messages'][_0x3a7d25] || [];
                    this['messages'][_0x3a7d25]['push'](_0x3bc0b6);
                    if (this['messages'][_0x3a7d25]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x3a7d25] = this['messages'][_0x3a7d25]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x3a7d25, _0x14955a['key']['id'], _0x3bc0b6);
                    } catch (_0xb9e623) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x14955a['key']['id'] + ':', _0xb9e623['message']);
                    }
                }
            }
        });
        _0x30dc0f['on']('contacts.update', async _0x291815 => {
            for (const _0x907607 of _0x291815) {
                if (_0x907607['id']) {
                    const _0x5bb3cc = {
                        'id': _0x907607['id'],
                        'name': _0x907607['notify'] || _0x907607['name'] || _0x907607['verifiedName'] || '',
                        'notify': _0x907607['notify'],
                        'verifiedName': _0x907607['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x907607['id']] = _0x5bb3cc;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x907607['id'], _0x5bb3cc);
                        } catch (_0x2edd1f) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x2edd1f['message']);
                        }
                    }
                }
            }
        });
        _0x30dc0f['on']('contacts.set', async _0x4c374f => {
            for (const _0x370edd of _0x4c374f) {
                if (_0x370edd['id']) {
                    const _0x3b3db9 = {
                        'id': _0x370edd['id'],
                        'name': _0x370edd['notify'] || _0x370edd['name'] || _0x370edd['verifiedName'] || '',
                        'notify': _0x370edd['notify'],
                        'verifiedName': _0x370edd['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x370edd['id']] = _0x3b3db9;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x370edd['id'], _0x3b3db9);
                        } catch (_0x4cdc1e) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x4cdc1e['message']);
                        }
                    }
                }
            }
        });
        _0x30dc0f['on']('chats.set', async _0x20d26a => {
            for (const _0x32e5f5 of _0x20d26a) {
                if (_0x32e5f5['id']) {
                    const _0x29a3b7 = {
                        'id': _0x32e5f5['id'],
                        'name': _0x32e5f5['name'] || _0x32e5f5['subject'] || '',
                        'conversationTimestamp': _0x32e5f5['conversationTimestamp'],
                        'unreadCount': _0x32e5f5['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x32e5f5['id']] = _0x29a3b7;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x32e5f5['id'], _0x29a3b7);
                        } catch (_0x54fa08) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x54fa08['message']);
                        }
                    }
                }
            }
        });
        _0x30dc0f['on']('chats.update', async _0x351c1d => {
            for (const _0x54aeab of _0x351c1d) {
                if (_0x54aeab['id']) {
                    if (backend === 'memory') {
                        const _0x6c599e = this['chats'][_0x54aeab['id']] || {};
                        this['chats'][_0x54aeab['id']] = {
                            'id': _0x54aeab['id'],
                            'name': _0x54aeab['name'] || _0x54aeab['subject'] || _0x6c599e['name'] || '',
                            'conversationTimestamp': _0x54aeab['conversationTimestamp'] || _0x6c599e['conversationTimestamp'],
                            'unreadCount': _0x54aeab['unreadCount'] !== undefined ? _0x54aeab['unreadCount'] : _0x6c599e['unreadCount']
                        };
                    } else {
                        try {
                            const _0x4cea47 = await adapters[backend]['getChat'](_0x54aeab['id']) || {};
                            const _0x172d76 = {
                                'id': _0x54aeab['id'],
                                'name': _0x54aeab['name'] || _0x54aeab['subject'] || _0x4cea47['name'] || '',
                                'conversationTimestamp': _0x54aeab['conversationTimestamp'] || _0x4cea47['conversation_timestamp'],
                                'unreadCount': _0x54aeab['unreadCount'] !== undefined ? _0x54aeab['unreadCount'] : _0x4cea47['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x54aeab['id'], _0x172d76);
                        } catch (_0x5c3354) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x5c3354['message']);
                        }
                    }
                }
            }
        });
        _0x30dc0f['on']('chats.delete', async _0x3e5003 => {
            for (const _0x5a93c6 of _0x3e5003) {
                if (backend === 'memory') {
                    delete this['chats'][_0x5a93c6];
                    delete this['messages'][_0x5a93c6];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x5a93c6);
                    } catch (_0x23780b) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x23780b['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x504516, _0x173534) {
        if (backend === 'memory') {
            const _0x8d95a4 = this['messages'][_0x504516]?.['find'](_0x3484d8 => _0x3484d8['key']['id'] === _0x173534) || null;
            return _0x8d95a4;
        } else {
            try {
                return await adapters[backend]['load'](_0x504516, _0x173534);
            } catch (_0xf74a4a) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x173534 + ':', _0xf74a4a['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x227a0f, _0x1bfc94, _0x2b9818) {
        if (backend === 'memory') {
            const _0xa5d297 = './data';
            if (!_0x0_0xc0aea1['existsSync'](_0xa5d297))
                _0x0_0xc0aea1['mkdirSync'](_0xa5d297, { 'recursive': !![] });
            const _0x396056 = _0x0_0x2c0521['join'](_0xa5d297, _0x1bfc94 + '.json');
            try {
                _0x0_0xc0aea1['writeFileSync'](_0x396056, JSON['stringify'](_0x2b9818, null, 0x2));
            } catch (_0x2d6d56) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x1bfc94 + ':', _0x2d6d56['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x227a0f, _0x1bfc94, _0x2b9818);
            } catch (_0x3e5f3e) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x1bfc94 + ':', _0x3e5f3e['message']);
            }
        }
    },
    async 'getSetting'(_0x249275, _0x35a1a2) {
        if (backend === 'memory') {
            const _0x4699da = './data';
            const _0x540ddf = _0x0_0x2c0521['join'](_0x4699da, _0x35a1a2 + '.json');
            try {
                if (_0x0_0xc0aea1['existsSync'](_0x540ddf)) {
                    const _0x4d9409 = JSON['parse'](_0x0_0xc0aea1['readFileSync'](_0x540ddf, 'utf-8'));
                    if (_0x4d9409['enabled'] !== undefined)
                        return _0x4d9409;
                    if (_0x4d9409[_0x249275] !== undefined)
                        return _0x4d9409[_0x249275];
                    return null;
                }
                return null;
            } catch (_0x2d2e78) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x35a1a2 + ':', _0x2d2e78['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x249275, _0x35a1a2);
            } catch (_0xba5852) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x35a1a2 + ':', _0xba5852['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0xe20e4c) {
        if (backend === 'memory') {
            const _0x260353 = './data';
            const _0x556963 = {};
            try {
                if (_0x0_0xc0aea1['existsSync'](_0x260353)) {
                    const _0x38d460 = _0x0_0xc0aea1['readdirSync'](_0x260353)['filter'](_0x3cfed7 => _0x3cfed7['endsWith']('.json'));
                    for (const _0x18c3da of _0x38d460) {
                        const _0xb9aa3f = _0x0_0x2c0521['basename'](_0x18c3da, '.json');
                        if (_0xb9aa3f === 'messageCount' || _0xb9aa3f === 'owner')
                            continue;
                        const _0xc4545b = _0x0_0x2c0521['join'](_0x260353, _0x18c3da);
                        const _0x5abd3d = JSON['parse'](_0x0_0xc0aea1['readFileSync'](_0xc4545b, 'utf-8'));
                        if (_0x5abd3d[_0xe20e4c]) {
                            _0x556963[_0xb9aa3f] = _0x5abd3d[_0xe20e4c];
                        }
                    }
                }
                return _0x556963;
            } catch (_0x41acf7) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x41acf7['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0xe20e4c);
            } catch (_0x1e5b99) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x1e5b99['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x37c9f8) {
        const _0x12aadd = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x12aadd['includes'](_0x37c9f8)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x37c9f8 + ',\x20defaulting\x20to\x20private');
            _0x37c9f8 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x37c9f8;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x37c9f8);
            } catch (_0x7064ef) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x7064ef['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x124f8a = await adapters[backend]['getMetadata']('botMode');
                return _0x124f8a || 'private';
            } catch (_0x1f8fe5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x1f8fe5['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x52ab6f, _0x1bb7dd, _0x47a42e) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x52ab6f]) {
                this['messageCount'][_0x52ab6f] = {};
            }
            if (!this['messageCount'][_0x52ab6f][_0x1bb7dd]) {
                this['messageCount'][_0x52ab6f][_0x1bb7dd] = 0x0;
            }
            this['messageCount'][_0x52ab6f][_0x1bb7dd]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x52ab6f, _0x1bb7dd);
            } catch (_0x3d9ac7) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x1bb7dd + ':', _0x3d9ac7['message']);
            }
        }
    },
    async 'getMessageCount'(_0x46b352, _0x313a60) {
        if (backend === 'memory') {
            return this['messageCount'][_0x46b352]?.[_0x313a60] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x46b352, _0x313a60);
            } catch (_0x1c4263) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x313a60 + ':', _0x1c4263['message']);
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
            } catch (_0x28ed32) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x28ed32['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x4f7b3c) {
        if (backend === 'memory') {
            this['isPublic'] = _0x4f7b3c;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x4f7b3c);
            } catch (_0x4a32c6) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x4a32c6['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x46d07f = await adapters[backend]['getAllCounts']();
                return _0x46d07f['isPublic'];
            } catch (_0x315afc) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x315afc['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x3950eb) {
        const _0x98eb7a = [
            'public',
            'private'
        ];
        if (!_0x98eb7a['includes'](_0x3950eb)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x3950eb);
            _0x3950eb = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x3950eb;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x3950eb);
            } catch (_0x571f21) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x571f21['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x46af30 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x46af30 || 'private';
            } catch (_0xca65af) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0xca65af['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x268dc6 = 0x0;
        const _0xfdec79 = Object['keys'](this['contacts'])['length'];
        const _0x5369d3 = Object['keys'](this['chats'])['length'];
        let _0x315b08 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x5ea128 => {
                if (Array['isArray'](_0x5ea128)) {
                    _0x268dc6 += _0x5ea128['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x3cbc76 => {
                if (typeof _0x3cbc76 === 'object') {
                    _0x315b08 += Object['keys'](_0x3cbc76)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x268dc6 : 'stored\x20in\x20database',
            'contacts': _0xfdec79,
            'chats': _0x5369d3,
            'messageCounts': backend === 'memory' ? _0x315b08 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0xd02515 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0xd02515));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x3d3654 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x3d3654));
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
        let _0x3481e4 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x1f59a1 => {
            if (store['chats'][_0x1f59a1]['messages']) {
                delete store['chats'][_0x1f59a1]['messages'];
                _0x3481e4++;
            }
        });
        if (_0x3481e4 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x3481e4 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x42f8a2 => {
    console['log']('[STORE]\x20Received\x20' + _0x42f8a2 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x14018a) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x14018a['message']);
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
process['on']('uncaughtException', _0x4d3c9a => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x4d3c9a);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x357c1f, _0x324326) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x324326, 'reason:', _0x357c1f);
});
export default store;