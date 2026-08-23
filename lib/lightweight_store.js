import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x21d771 from 'fs';
import _0x0_0x4118b8 from 'path';
import _0x0_0x27282b from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x1b4c66) {
    printLog = (_0x4ebfea, _0xed479e) => console['log']('[' + _0x4ebfea['toUpperCase']() + ']\x20' + _0xed479e);
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
} catch (_0x0_0x52fb0d) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x15564e => {
    try {
        return _0x0_0x27282b['deflateSync'](JSON['stringify'](_0x15564e));
    } catch (_0x4d7152) {
        console['error']('[STORE]\x20Compression\x20error:', _0x4d7152['message']);
        return Buffer['from'](JSON['stringify'](_0x15564e));
    }
};
const decompress = _0x4a7a20 => {
    try {
        return JSON['parse'](_0x0_0x27282b['inflateSync'](_0x4a7a20));
    } catch (_0x2af36d) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x2af36d['message']);
        try {
            return JSON['parse'](_0x4a7a20['toString']());
        } catch (_0x4b169f) {
            return null;
        }
    }
};
function slimMessage(_0xfd939e) {
    return {
        'key': _0xfd939e['key'],
        'message': _0xfd939e['message'],
        'messageTimestamp': _0xfd939e['messageTimestamp'],
        'participant': _0xfd939e['participant'],
        'pushName': _0xfd939e['pushName'],
        'broadcast': _0xfd939e['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x397e48 => console['error']('[MONGO]\x20Connection\x20error:', _0x397e48));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x3a7e7b, _0x2dd0c2, _0xfac83b) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x3a7e7b,
                        'id': _0x2dd0c2
                    }, {
                        'data': compress(_0xfac83b),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x21c4b5) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x21c4b5['message']);
                }
            },
            async 'load'(_0x414ebf, _0x90a7dd) {
                try {
                    const _0x6f3362 = await Msg['findOne']({
                        'jid': _0x414ebf,
                        'id': _0x90a7dd
                    });
                    return _0x6f3362 ? decompress(_0x6f3362['data']) : null;
                } catch (_0x476cbe) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x476cbe['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x4d6cb0, _0x396395) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x4d6cb0,
                        'userId': _0x396395
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x5d2300) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x5d2300['message']);
                }
            },
            async 'getCount'(_0x4a1d4a, _0x515be5) {
                try {
                    const _0x49e06f = await MsgCount['findOne']({
                        'chatId': _0x4a1d4a,
                        'userId': _0x515be5
                    });
                    return _0x49e06f ? _0x49e06f['count'] : 0x0;
                } catch (_0x5d9f04) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x5d9f04['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x5535fe = await MsgCount['find']({});
                    const _0x28f78b = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x5535fe['forEach'](_0x35712e => {
                        if (!_0x28f78b['messageCount'][_0x35712e['chatId']]) {
                            _0x28f78b['messageCount'][_0x35712e['chatId']] = {};
                        }
                        _0x28f78b['messageCount'][_0x35712e['chatId']][_0x35712e['userId']] = _0x35712e['count'];
                    });
                    const _0x56985d = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x56985d)
                        _0x28f78b['isPublic'] = _0x56985d['value'] === 'true';
                    return _0x28f78b;
                } catch (_0x7d3fed) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x7d3fed['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3927b2) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x3927b2['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x13f45d) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x13f45d['message']);
                }
            },
            async 'setMetadata'(_0x53d617, _0x2793a1) {
                try {
                    await Meta['updateOne']({ 'key': _0x53d617 }, {
                        'key': _0x53d617,
                        'value': _0x2793a1['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x3ada5a) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x3ada5a['message']);
                }
            },
            async 'getMetadata'(_0x44d29a) {
                try {
                    const _0xf50631 = await Meta['findOne']({ 'key': _0x44d29a });
                    return _0xf50631 ? _0xf50631['value'] : null;
                } catch (_0xa6093a) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0xa6093a['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x27478b, _0x3fe81c) {
                try {
                    await Contact['updateOne']({ 'jid': _0x27478b }, {
                        ..._0x3fe81c,
                        'jid': _0x27478b,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3515f4) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x3515f4['message']);
                }
            },
            async 'getContact'(_0x259041) {
                try {
                    return await Contact['findOne']({ 'jid': _0x259041 });
                } catch (_0x595787) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x595787['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x20fb4e = await Contact['find']({});
                    const _0x3f1362 = {};
                    _0x20fb4e['forEach'](_0x3e8a07 => {
                        _0x3f1362[_0x3e8a07['jid']] = {
                            'id': _0x3e8a07['jid'],
                            'name': _0x3e8a07['name'],
                            'notify': _0x3e8a07['notify']
                        };
                    });
                    return _0x3f1362;
                } catch (_0x4ab7a0) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x4ab7a0['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x56e1a5, _0x25896b) {
                try {
                    await Chat['updateOne']({ 'jid': _0x56e1a5 }, {
                        ..._0x25896b,
                        'jid': _0x56e1a5,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5c7a47) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x5c7a47['message']);
                }
            },
            async 'getChat'(_0x4cf25d) {
                try {
                    return await Chat['findOne']({ 'jid': _0x4cf25d });
                } catch (_0x411fc1) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x411fc1['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0xfc90f8 = await Chat['find']({});
                    const _0x5aadad = {};
                    _0xfc90f8['forEach'](_0x4062a1 => {
                        _0x5aadad[_0x4062a1['jid']] = {
                            'id': _0x4062a1['jid'],
                            'name': _0x4062a1['name'],
                            'conversationTimestamp': _0x4062a1['conversationTimestamp'],
                            'unreadCount': _0x4062a1['unreadCount']
                        };
                    });
                    return _0x5aadad;
                } catch (_0x4f03c1) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x4f03c1['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x32979c) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x32979c });
                } catch (_0x1a72cf) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x1a72cf['message']);
                }
            },
            async 'saveSetting'(_0x596174, _0x4c4f78, _0x492647) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x596174,
                        'key': _0x4c4f78
                    }, {
                        'chatId': _0x596174,
                        'key': _0x4c4f78,
                        'value': _0x492647,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4cdc2d) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x4cdc2d['message']);
                }
            },
            async 'getSetting'(_0x4bb2ad, _0x345590) {
                try {
                    const _0x5a9053 = await Setting['findOne']({
                        'chatId': _0x4bb2ad,
                        'key': _0x345590
                    });
                    return _0x5a9053 ? _0x5a9053['value'] : null;
                } catch (_0x750b0c) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x750b0c['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x5e5d71) {
                try {
                    const _0x28bc90 = await Setting['find']({ 'chatId': _0x5e5d71 });
                    const _0x119e66 = {};
                    _0x28bc90['forEach'](_0x4be2cc => {
                        _0x119e66[_0x4be2cc['key']] = _0x4be2cc['value'];
                    });
                    return _0x119e66;
                } catch (_0x35a9e8) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x35a9e8['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x22989e = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x22989e['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x22989e['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x45d970) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x45d970['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x371bdb) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x371bdb['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x2f3c65) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x2f3c65['message']);
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
        pool['on']('error', _0x4662de => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x4662de['message']);
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
                        const _0x4f4168 = await pool['connect']();
                        try {
                            await _0x4f4168['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f4168['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x4f4168['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x4f4168['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f4168['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f4168['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f4168['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f4168['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x4f4168['release']();
                        }
                    } catch (_0x50ea67) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x50ea67['message']);
                        this['initPromise'] = null;
                        throw _0x50ea67;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x590df5, _0x97b34a, _0xd6dd00) {
                try {
                    await this['init']();
                    const _0x124999 = await pool['connect']();
                    try {
                        await _0x124999['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x590df5,
                            _0x97b34a,
                            Date['now'](),
                            compress(_0xd6dd00)
                        ]);
                    } finally {
                        _0x124999['release']();
                    }
                } catch (_0x1f17df) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x1f17df['message']);
                }
            },
            async 'load'(_0x10a6c9, _0x46a5e5) {
                try {
                    await this['init']();
                    const _0x301adb = await pool['connect']();
                    try {
                        const _0x4afa77 = await _0x301adb['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x10a6c9,
                            _0x46a5e5
                        ]);
                        return _0x4afa77['rows'][0x0] ? decompress(_0x4afa77['rows'][0x0]['data']) : null;
                    } finally {
                        _0x301adb['release']();
                    }
                } catch (_0x3aa28b) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x3aa28b['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x278dad, _0x323eb4) {
                try {
                    await this['init']();
                    const _0x312fb8 = await pool['connect']();
                    try {
                        await _0x312fb8['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x278dad,
                            _0x323eb4
                        ]);
                    } finally {
                        _0x312fb8['release']();
                    }
                } catch (_0x3c15d3) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x3c15d3['message']);
                }
            },
            async 'getCount'(_0x114ca5, _0x262719) {
                try {
                    await this['init']();
                    const _0x4aca23 = await pool['connect']();
                    try {
                        const _0x547883 = await _0x4aca23['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x114ca5,
                            _0x262719
                        ]);
                        return _0x547883['rows'][0x0] ? _0x547883['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x4aca23['release']();
                    }
                } catch (_0xac2a8f) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0xac2a8f['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x301be9 = await pool['connect']();
                    try {
                        const _0x32e08b = await _0x301be9['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x2559d9 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x32e08b['rows']['forEach'](_0x26947d => {
                            if (!_0x2559d9['messageCount'][_0x26947d['chat_id']]) {
                                _0x2559d9['messageCount'][_0x26947d['chat_id']] = {};
                            }
                            _0x2559d9['messageCount'][_0x26947d['chat_id']][_0x26947d['user_id']] = _0x26947d['count'];
                        });
                        const _0x8a96de = await _0x301be9['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x8a96de['rows'][0x0])
                            _0x2559d9['isPublic'] = _0x8a96de['rows'][0x0]['value'] === 'true';
                        return _0x2559d9;
                    } finally {
                        _0x301be9['release']();
                    }
                } catch (_0x28b80f) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x28b80f['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x40c14e) {
                try {
                    await this['init']();
                    const _0x3e9886 = await pool['connect']();
                    try {
                        await _0x3e9886['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x40c14e['toString']()]);
                    } finally {
                        _0x3e9886['release']();
                    }
                } catch (_0x427aeb) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x427aeb['message']);
                }
            },
            async 'setMetadata'(_0x2529ce, _0x476c10) {
                try {
                    await this['init']();
                    const _0x4e4ef6 = await pool['connect']();
                    try {
                        await _0x4e4ef6['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x2529ce,
                            _0x476c10['toString']()
                        ]);
                    } finally {
                        _0x4e4ef6['release']();
                    }
                } catch (_0x1eef19) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x1eef19['message']);
                }
            },
            async 'getMetadata'(_0x23bceb) {
                try {
                    await this['init']();
                    const _0xd55f97 = await pool['connect']();
                    try {
                        const _0x32697c = await _0xd55f97['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x23bceb]);
                        return _0x32697c['rows'][0x0] ? _0x32697c['rows'][0x0]['value'] : null;
                    } finally {
                        _0xd55f97['release']();
                    }
                } catch (_0x287b51) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x287b51['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x5541d4, _0x3bb378) {
                try {
                    await this['init']();
                    const _0x7b769c = await pool['connect']();
                    try {
                        await _0x7b769c['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x5541d4,
                            _0x3bb378['name'] || '',
                            _0x3bb378['notify'] || '',
                            _0x3bb378['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x7b769c['release']();
                    }
                } catch (_0x439a44) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x439a44['message']);
                }
            },
            async 'getContact'(_0x596292) {
                try {
                    await this['init']();
                    const _0x5e0af6 = await pool['connect']();
                    try {
                        const _0x39a246 = await _0x5e0af6['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x596292]);
                        return _0x39a246['rows'][0x0] || null;
                    } finally {
                        _0x5e0af6['release']();
                    }
                } catch (_0x44b538) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x44b538['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x1b8d60 = await pool['connect']();
                    try {
                        const _0x11eefd = await _0x1b8d60['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x18f98d = {};
                        _0x11eefd['rows']['forEach'](_0x47d428 => {
                            _0x18f98d[_0x47d428['jid']] = {
                                'id': _0x47d428['jid'],
                                'name': _0x47d428['name'],
                                'notify': _0x47d428['notify']
                            };
                        });
                        return _0x18f98d;
                    } finally {
                        _0x1b8d60['release']();
                    }
                } catch (_0xe53bb2) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0xe53bb2['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x66d3b9, _0x4eb964) {
                try {
                    await this['init']();
                    const _0x272438 = await pool['connect']();
                    try {
                        await _0x272438['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x66d3b9,
                            _0x4eb964['name'] || '',
                            _0x4eb964['conversationTimestamp'] || 0x0,
                            _0x4eb964['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x272438['release']();
                    }
                } catch (_0x4c8ff9) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x4c8ff9['message']);
                }
            },
            async 'getChat'(_0x39f469) {
                try {
                    await this['init']();
                    const _0x1b1593 = await pool['connect']();
                    try {
                        const _0x4c6c5f = await _0x1b1593['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x39f469]);
                        return _0x4c6c5f['rows'][0x0] || null;
                    } finally {
                        _0x1b1593['release']();
                    }
                } catch (_0x5c2bbf) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x5c2bbf['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x2cc257 = await pool['connect']();
                    try {
                        const _0x511bfb = await _0x2cc257['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x3efe11 = {};
                        _0x511bfb['rows']['forEach'](_0x247354 => {
                            _0x3efe11[_0x247354['jid']] = {
                                'id': _0x247354['jid'],
                                'name': _0x247354['name'],
                                'conversationTimestamp': _0x247354['conversation_timestamp'],
                                'unreadCount': _0x247354['unread_count']
                            };
                        });
                        return _0x3efe11;
                    } finally {
                        _0x2cc257['release']();
                    }
                } catch (_0x4fec97) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x4fec97['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x579f89) {
                try {
                    await this['init']();
                    const _0x1aba04 = await pool['connect']();
                    try {
                        await _0x1aba04['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x579f89]);
                    } finally {
                        _0x1aba04['release']();
                    }
                } catch (_0xaeb799) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0xaeb799['message']);
                }
            },
            async 'saveSetting'(_0x158c5b, _0x8c2f2b, _0x4dc7e8) {
                try {
                    await this['init']();
                    const _0x1a0baf = await pool['connect']();
                    try {
                        await _0x1a0baf['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x158c5b,
                            _0x8c2f2b,
                            JSON['stringify'](_0x4dc7e8),
                            Date['now']()
                        ]);
                    } finally {
                        _0x1a0baf['release']();
                    }
                } catch (_0x53fc43) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x53fc43['message']);
                }
            },
            async 'getSetting'(_0x4c6744, _0x49cc31) {
                try {
                    await this['init']();
                    const _0x2a363b = await pool['connect']();
                    try {
                        const _0xf47565 = await _0x2a363b['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x4c6744,
                            _0x49cc31
                        ]);
                        return _0xf47565['rows'][0x0] ? JSON['parse'](_0xf47565['rows'][0x0]['value']) : null;
                    } finally {
                        _0x2a363b['release']();
                    }
                } catch (_0x41fc77) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x41fc77['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0xbef42c) {
                try {
                    await this['init']();
                    const _0x491a36 = await pool['connect']();
                    try {
                        const _0x103675 = await _0x491a36['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0xbef42c]);
                        const _0x36219c = {};
                        _0x103675['rows']['forEach'](_0x525690 => {
                            _0x36219c[_0x525690['key']] = JSON['parse'](_0x525690['value']);
                        });
                        return _0x36219c;
                    } finally {
                        _0x491a36['release']();
                    }
                } catch (_0x16aae4) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x16aae4['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x24ac7e = await pool['connect']();
                    try {
                        const _0x4108a1 = await _0x24ac7e['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x4108a1['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x4108a1['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x24ac7e['release']();
                    }
                } catch (_0x252837) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x252837['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x3b78c0) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x3b78c0['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x26cf34) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x26cf34['message']);
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
                    } catch (_0x56a53c) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x56a53c['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x56a53c;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x1d5da9, _0x1d5ca1, _0x4ff652) {
                try {
                    const _0x1e7244 = await this['getConn']();
                    await _0x1e7244['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x1d5da9,
                        _0x1d5ca1,
                        Date['now'](),
                        compress(_0x4ff652)
                    ]);
                } catch (_0x35a1a1) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x35a1a1['message']);
                }
            },
            async 'load'(_0x13db8c, _0x306852) {
                try {
                    const _0x642c89 = await this['getConn']();
                    const [_0xc9c82c] = await _0x642c89['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x13db8c,
                        _0x306852
                    ]);
                    return _0xc9c82c[0x0] ? decompress(_0xc9c82c[0x0]['data']) : null;
                } catch (_0x5cee03) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x5cee03['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x39edf8, _0x2f485e) {
                try {
                    const _0x165169 = await this['getConn']();
                    await _0x165169['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x39edf8,
                        _0x2f485e
                    ]);
                } catch (_0x3ee85d) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x3ee85d['message']);
                }
            },
            async 'getCount'(_0x5d62f4, _0x1523d6) {
                try {
                    const _0x3a5298 = await this['getConn']();
                    const [_0x2942af] = await _0x3a5298['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x5d62f4,
                        _0x1523d6
                    ]);
                    return _0x2942af[0x0] ? _0x2942af[0x0]['count'] : 0x0;
                } catch (_0x5c5e00) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x5c5e00['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x338185 = await this['getConn']();
                    const [_0x3228f6] = await _0x338185['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x2530d4 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3228f6['forEach'](_0x387cfd => {
                        if (!_0x2530d4['messageCount'][_0x387cfd['chat_id']]) {
                            _0x2530d4['messageCount'][_0x387cfd['chat_id']] = {};
                        }
                        _0x2530d4['messageCount'][_0x387cfd['chat_id']][_0x387cfd['user_id']] = _0x387cfd['count'];
                    });
                    const [_0x208ae0] = await _0x338185['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x208ae0[0x0])
                        _0x2530d4['isPublic'] = _0x208ae0[0x0]['value'] === 'true';
                    return _0x2530d4;
                } catch (_0x5621c3) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x5621c3['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x79f5c4) {
                try {
                    const _0x537739 = await this['getConn']();
                    await _0x537739['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x79f5c4['toString']()]);
                } catch (_0x2982c6) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x2982c6['message']);
                }
            },
            async 'setMetadata'(_0x5bfaa0, _0x4c350c) {
                try {
                    const _0x22f356 = await this['getConn']();
                    await _0x22f356['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x5bfaa0,
                        _0x4c350c['toString']()
                    ]);
                } catch (_0x73043a) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x73043a['message']);
                }
            },
            async 'getMetadata'(_0x1825a) {
                try {
                    const _0x160e45 = await this['getConn']();
                    const [_0x3294de] = await _0x160e45['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x1825a]);
                    return _0x3294de[0x0] ? _0x3294de[0x0]['value'] : null;
                } catch (_0x4b4711) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x4b4711['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x5a70fb, _0x191489) {
                try {
                    const _0x4fefb6 = await this['getConn']();
                    await _0x4fefb6['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x5a70fb,
                        _0x191489['name'] || '',
                        _0x191489['notify'] || '',
                        _0x191489['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0xecf91a) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0xecf91a['message']);
                }
            },
            async 'getContact'(_0x533b35) {
                try {
                    const _0x46a0a6 = await this['getConn']();
                    const [_0x43496f] = await _0x46a0a6['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x533b35]);
                    return _0x43496f[0x0] || null;
                } catch (_0x4da29c) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x4da29c['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x2ae152 = await this['getConn']();
                    const [_0x5ab30e] = await _0x2ae152['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x2e1555 = {};
                    _0x5ab30e['forEach'](_0x10a7ab => {
                        _0x2e1555[_0x10a7ab['jid']] = {
                            'id': _0x10a7ab['jid'],
                            'name': _0x10a7ab['name'],
                            'notify': _0x10a7ab['notify']
                        };
                    });
                    return _0x2e1555;
                } catch (_0x3a6e21) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x3a6e21['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x28290e, _0x23e56c) {
                try {
                    const _0xa4f1c7 = await this['getConn']();
                    await _0xa4f1c7['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x28290e,
                        _0x23e56c['name'] || '',
                        _0x23e56c['conversationTimestamp'] || 0x0,
                        _0x23e56c['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x2103e6) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x2103e6['message']);
                }
            },
            async 'getChat'(_0xa1d5e0) {
                try {
                    const _0x1ba408 = await this['getConn']();
                    const [_0x4fbea7] = await _0x1ba408['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0xa1d5e0]);
                    return _0x4fbea7[0x0] || null;
                } catch (_0x25fba6) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x25fba6['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x3dc978 = await this['getConn']();
                    const [_0x3759f0] = await _0x3dc978['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x983165 = {};
                    _0x3759f0['forEach'](_0x1a9d9a => {
                        _0x983165[_0x1a9d9a['jid']] = {
                            'id': _0x1a9d9a['jid'],
                            'name': _0x1a9d9a['name'],
                            'conversationTimestamp': _0x1a9d9a['conversation_timestamp'],
                            'unreadCount': _0x1a9d9a['unread_count']
                        };
                    });
                    return _0x983165;
                } catch (_0x16ea0b) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x16ea0b['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x16a0af) {
                try {
                    const _0x4819b5 = await this['getConn']();
                    await _0x4819b5['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x16a0af]);
                } catch (_0x2f20ac) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x2f20ac['message']);
                }
            },
            async 'saveSetting'(_0x472030, _0x17aaab, _0x5ac392) {
                try {
                    const _0xc1568e = await this['getConn']();
                    await _0xc1568e['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x472030,
                        _0x17aaab,
                        JSON['stringify'](_0x5ac392),
                        Date['now']()
                    ]);
                } catch (_0x4a296c) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x4a296c['message']);
                }
            },
            async 'getSetting'(_0x204b39, _0x2defdd) {
                try {
                    const _0x3cd3ac = await this['getConn']();
                    const [_0x40b6f7] = await _0x3cd3ac['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x204b39,
                        _0x2defdd
                    ]);
                    return _0x40b6f7[0x0] ? JSON['parse'](_0x40b6f7[0x0]['value']) : null;
                } catch (_0x259d47) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x259d47['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x424d36) {
                try {
                    const _0x4c81fa = await this['getConn']();
                    const [_0xd810f2] = await _0x4c81fa['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x424d36]);
                    const _0x540611 = {};
                    _0xd810f2['forEach'](_0x2daf38 => {
                        _0x540611[_0x2daf38['key']] = JSON['parse'](_0x2daf38['value']);
                    });
                    return _0x540611;
                } catch (_0x4c22c0) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x4c22c0['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x57a5c1 = await this['getConn']();
                    const [_0x37f5ca] = await _0x57a5c1['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x37f5ca['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x37f5ca['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x504464) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x504464['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x2a4058) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x2a4058['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x373d3f) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x373d3f['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x4118b8['dirname'](SQLITE_URL);
        if (!_0x0_0x21d771['existsSync'](dir))
            _0x0_0x21d771['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x432900, _0x46242d, _0x4a302b) {
                try {
                    saveStmt['run'](_0x432900, _0x46242d, Date['now'](), compress(_0x4a302b));
                    const {count: _0x2af0ea} = countStmt['get'](_0x432900);
                    if (_0x2af0ea > MESSAGE_LIMITS['sqlite']) {
                        const _0x2e4e2f = _0x2af0ea - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x432900, _0x432900, _0x2e4e2f);
                    }
                } catch (_0x4f31ad) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x4f31ad['message']);
                }
            },
            'load'(_0x191cd1, _0x2599bf) {
                try {
                    const _0x2a61f7 = loadStmt['get'](_0x191cd1, _0x2599bf);
                    return _0x2a61f7 ? decompress(_0x2a61f7['data']) : null;
                } catch (_0x10fc9e) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x10fc9e['message']);
                    return null;
                }
            },
            'incrementCount'(_0x4604e6, _0x12b8c0) {
                try {
                    incrementCountStmt['run'](_0x4604e6, _0x12b8c0);
                } catch (_0x5cae71) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x5cae71['message']);
                }
            },
            'getCount'(_0x55c37a, _0x5903b6) {
                try {
                    const _0x44e8ff = getCountStmt['get'](_0x55c37a, _0x5903b6);
                    return _0x44e8ff ? _0x44e8ff['count'] : 0x0;
                } catch (_0x291813) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x291813['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x58b873 = getAllCountsStmt['all']();
                    const _0x2e30d6 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x58b873['forEach'](_0x984295 => {
                        if (!_0x2e30d6['messageCount'][_0x984295['chat_id']]) {
                            _0x2e30d6['messageCount'][_0x984295['chat_id']] = {};
                        }
                        _0x2e30d6['messageCount'][_0x984295['chat_id']][_0x984295['user_id']] = _0x984295['count'];
                    });
                    const _0x5df89c = getMetaStmt['get']();
                    if (_0x5df89c)
                        _0x2e30d6['isPublic'] = _0x5df89c['value'] === 'true';
                    return _0x2e30d6;
                } catch (_0x1aa294) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x1aa294['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x34806c) {
                try {
                    setMetaStmt['run'](_0x34806c['toString']());
                } catch (_0x4c3e99) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x4c3e99['message']);
                }
            },
            'setMetadata'(_0x1583c9, _0x10bb28) {
                try {
                    setMetadataStmt['run'](_0x1583c9, _0x10bb28['toString']());
                } catch (_0x290f33) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x290f33['message']);
                }
            },
            'getMetadata'(_0x663502) {
                try {
                    const _0x31a802 = getMetadataStmt['get'](_0x663502);
                    return _0x31a802 ? _0x31a802['value'] : null;
                } catch (_0x307dca) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x307dca['message']);
                    return null;
                }
            },
            'saveContact'(_0x19a2fc, _0x468132) {
                try {
                    saveContactStmt['run'](_0x19a2fc, _0x468132['name'] || '', _0x468132['notify'] || '', _0x468132['verifiedName'] || '', Date['now']());
                } catch (_0x3ecc21) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x3ecc21['message']);
                }
            },
            'getContact'(_0x52dd13) {
                try {
                    return getContactStmt['get'](_0x52dd13) || null;
                } catch (_0x50d45f) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x50d45f['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x3a9d7f = getAllContactsStmt['all']();
                    const _0x804684 = {};
                    _0x3a9d7f['forEach'](_0x232c82 => {
                        _0x804684[_0x232c82['jid']] = {
                            'id': _0x232c82['jid'],
                            'name': _0x232c82['name'],
                            'notify': _0x232c82['notify']
                        };
                    });
                    return _0x804684;
                } catch (_0x5a6104) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x5a6104['message']);
                    return {};
                }
            },
            'saveChat'(_0x5c1e4c, _0x2ddfcf) {
                try {
                    saveChatStmt['run'](_0x5c1e4c, _0x2ddfcf['name'] || '', _0x2ddfcf['conversationTimestamp'] || 0x0, _0x2ddfcf['unreadCount'] || 0x0, Date['now']());
                } catch (_0x399fc9) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x399fc9['message']);
                }
            },
            'getChat'(_0xa5c692) {
                try {
                    return getChatStmt['get'](_0xa5c692) || null;
                } catch (_0x1070f6) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x1070f6['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x51cdff = getAllChatsStmt['all']();
                    const _0x2c4ead = {};
                    _0x51cdff['forEach'](_0x394640 => {
                        _0x2c4ead[_0x394640['jid']] = {
                            'id': _0x394640['jid'],
                            'name': _0x394640['name'],
                            'conversationTimestamp': _0x394640['conversation_timestamp'],
                            'unreadCount': _0x394640['unread_count']
                        };
                    });
                    return _0x2c4ead;
                } catch (_0x315d32) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x315d32['message']);
                    return {};
                }
            },
            'deleteChat'(_0x478eb2) {
                try {
                    deleteChatStmt['run'](_0x478eb2);
                } catch (_0x3f393a) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x3f393a['message']);
                }
            },
            'saveSetting'(_0x22573d, _0x3d28b8, _0xb73ebd) {
                try {
                    saveSettingStmt['run'](_0x22573d, _0x3d28b8, JSON['stringify'](_0xb73ebd), Date['now']());
                } catch (_0x49fd02) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x49fd02['message']);
                }
            },
            'getSetting'(_0x43f6a3, _0x3ead52) {
                try {
                    const _0x320682 = getSettingStmt['get'](_0x43f6a3, _0x3ead52);
                    return _0x320682 ? JSON['parse'](_0x320682['value']) : null;
                } catch (_0x28aff3) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x28aff3['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x45d166) {
                try {
                    const _0x3aca63 = getAllSettingsStmt['all'](_0x45d166);
                    const _0x180581 = {};
                    _0x3aca63['forEach'](_0x10c33e => {
                        _0x180581[_0x10c33e['key']] = JSON['parse'](_0x10c33e['value']);
                    });
                    return _0x180581;
                } catch (_0x238b5a) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x238b5a['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x3ac328 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x3ac328['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x3ac328['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x21613c) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x21613c['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x5ab5d2) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x5ab5d2['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x30a8cd) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x30a8cd['message']);
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
    async 'readFromFile'(_0xf18ce8 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x9064e1 = await adapters[backend]['getAllContacts']();
                const _0x30c9a1 = await adapters[backend]['getAllChats']();
                const _0x3bcc1c = await this['getBotMode']();
                this['contacts'] = _0x9064e1;
                this['chats'] = _0x30c9a1;
                this['botMode'] = _0x3bcc1c;
            } else {
                if (_0x0_0x21d771['existsSync'](_0xf18ce8)) {
                    const _0x4237ec = JSON['parse'](_0x0_0x21d771['readFileSync'](_0xf18ce8, 'utf-8'));
                    this['contacts'] = _0x4237ec['contacts'] || {};
                    this['chats'] = _0x4237ec['chats'] || {};
                    this['botMode'] = _0x4237ec['botMode'] || 'private';
                    this['messages'] = _0x4237ec['messages'] || {};
                    this['isPublic'] = _0x4237ec['isPublic'] !== undefined ? _0x4237ec['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x4502c9) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x4502c9['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x49722e = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x379927 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x21d771['writeFileSync'](_0x49722e, JSON['stringify'](_0x379927, null, 0x2));
        } catch (_0x31a71c) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x31a71c['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x21d771['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x1cbc92 = JSON['parse'](_0x0_0x21d771['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x1cbc92['messageCount'] || _0x1cbc92;
                    this['isPublic'] = typeof _0x1cbc92['isPublic'] === 'boolean' ? _0x1cbc92['isPublic'] : ![];
                }
            } catch (_0x2dfbb3) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x2dfbb3['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x51f966 = _0x0_0x4118b8['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x21d771['existsSync'](_0x51f966))
                    _0x0_0x21d771['mkdirSync'](_0x51f966, { 'recursive': !![] });
                const _0x55928d = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x21d771['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x55928d, null, 0x2));
            } catch (_0x376fa8) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x376fa8['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x2d3b49 => {
                if (typeof this['messages'][_0x2d3b49] === 'object' && !Array['isArray'](this['messages'][_0x2d3b49])) {
                    const _0x321624 = Object['values'](this['messages'][_0x2d3b49]);
                    this['messages'][_0x2d3b49] = _0x321624['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x2d3b49])) {
                    if (this['messages'][_0x2d3b49]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x2d3b49] = this['messages'][_0x2d3b49]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x51c2ec => {
                if (this['chats'][_0x51c2ec]['messages']) {
                    delete this['chats'][_0x51c2ec]['messages'];
                }
            });
        }
    },
    'bind'(_0x34f038) {
        _0x34f038['on']('messages.upsert', async ({messages: _0x3ccf06}) => {
            for (const _0xe23e82 of _0x3ccf06) {
                if (!_0xe23e82['key']?.['remoteJid'])
                    continue;
                const _0x2bd301 = _0xe23e82['key']['remoteJid'];
                const _0x5bfe61 = slimMessage(_0xe23e82);
                if (backend === 'memory') {
                    this['messages'][_0x2bd301] = this['messages'][_0x2bd301] || [];
                    this['messages'][_0x2bd301]['push'](_0x5bfe61);
                    if (this['messages'][_0x2bd301]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x2bd301] = this['messages'][_0x2bd301]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x2bd301, _0xe23e82['key']['id'], _0x5bfe61);
                    } catch (_0x2292fa) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0xe23e82['key']['id'] + ':', _0x2292fa['message']);
                    }
                }
            }
        });
        _0x34f038['on']('contacts.update', async _0x47b8e5 => {
            for (const _0x122b29 of _0x47b8e5) {
                if (_0x122b29['id']) {
                    const _0x1a697f = {
                        'id': _0x122b29['id'],
                        'name': _0x122b29['notify'] || _0x122b29['name'] || _0x122b29['verifiedName'] || '',
                        'notify': _0x122b29['notify'],
                        'verifiedName': _0x122b29['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x122b29['id']] = _0x1a697f;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x122b29['id'], _0x1a697f);
                        } catch (_0x1cf840) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x1cf840['message']);
                        }
                    }
                }
            }
        });
        _0x34f038['on']('contacts.set', async _0x40bb35 => {
            for (const _0x4f2f15 of _0x40bb35) {
                if (_0x4f2f15['id']) {
                    const _0x4bac7e = {
                        'id': _0x4f2f15['id'],
                        'name': _0x4f2f15['notify'] || _0x4f2f15['name'] || _0x4f2f15['verifiedName'] || '',
                        'notify': _0x4f2f15['notify'],
                        'verifiedName': _0x4f2f15['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x4f2f15['id']] = _0x4bac7e;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x4f2f15['id'], _0x4bac7e);
                        } catch (_0x2a7f97) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x2a7f97['message']);
                        }
                    }
                }
            }
        });
        _0x34f038['on']('chats.set', async _0x4878a0 => {
            for (const _0x33e61a of _0x4878a0) {
                if (_0x33e61a['id']) {
                    const _0x41fbb9 = {
                        'id': _0x33e61a['id'],
                        'name': _0x33e61a['name'] || _0x33e61a['subject'] || '',
                        'conversationTimestamp': _0x33e61a['conversationTimestamp'],
                        'unreadCount': _0x33e61a['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x33e61a['id']] = _0x41fbb9;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x33e61a['id'], _0x41fbb9);
                        } catch (_0xb32d5b) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0xb32d5b['message']);
                        }
                    }
                }
            }
        });
        _0x34f038['on']('chats.update', async _0x2ff203 => {
            for (const _0xc25198 of _0x2ff203) {
                if (_0xc25198['id']) {
                    if (backend === 'memory') {
                        const _0x5e7183 = this['chats'][_0xc25198['id']] || {};
                        this['chats'][_0xc25198['id']] = {
                            'id': _0xc25198['id'],
                            'name': _0xc25198['name'] || _0xc25198['subject'] || _0x5e7183['name'] || '',
                            'conversationTimestamp': _0xc25198['conversationTimestamp'] || _0x5e7183['conversationTimestamp'],
                            'unreadCount': _0xc25198['unreadCount'] !== undefined ? _0xc25198['unreadCount'] : _0x5e7183['unreadCount']
                        };
                    } else {
                        try {
                            const _0x30b6a9 = await adapters[backend]['getChat'](_0xc25198['id']) || {};
                            const _0x403cb6 = {
                                'id': _0xc25198['id'],
                                'name': _0xc25198['name'] || _0xc25198['subject'] || _0x30b6a9['name'] || '',
                                'conversationTimestamp': _0xc25198['conversationTimestamp'] || _0x30b6a9['conversation_timestamp'],
                                'unreadCount': _0xc25198['unreadCount'] !== undefined ? _0xc25198['unreadCount'] : _0x30b6a9['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0xc25198['id'], _0x403cb6);
                        } catch (_0x16e450) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x16e450['message']);
                        }
                    }
                }
            }
        });
        _0x34f038['on']('chats.delete', async _0x3a0f23 => {
            for (const _0x12d529 of _0x3a0f23) {
                if (backend === 'memory') {
                    delete this['chats'][_0x12d529];
                    delete this['messages'][_0x12d529];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x12d529);
                    } catch (_0x458695) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x458695['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x526ff3, _0x2f917d) {
        if (backend === 'memory') {
            const _0x5d9e02 = this['messages'][_0x526ff3]?.['find'](_0x558c28 => _0x558c28['key']['id'] === _0x2f917d) || null;
            return _0x5d9e02;
        } else {
            try {
                return await adapters[backend]['load'](_0x526ff3, _0x2f917d);
            } catch (_0x1bc5c6) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x2f917d + ':', _0x1bc5c6['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x321597, _0x5a8ecd, _0x4b2824) {
        if (backend === 'memory') {
            const _0x3c3f73 = './data';
            if (!_0x0_0x21d771['existsSync'](_0x3c3f73))
                _0x0_0x21d771['mkdirSync'](_0x3c3f73, { 'recursive': !![] });
            const _0x31a76a = _0x0_0x4118b8['join'](_0x3c3f73, _0x5a8ecd + '.json');
            try {
                _0x0_0x21d771['writeFileSync'](_0x31a76a, JSON['stringify'](_0x4b2824, null, 0x2));
            } catch (_0x10b4cf) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x5a8ecd + ':', _0x10b4cf['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x321597, _0x5a8ecd, _0x4b2824);
            } catch (_0x46ccef) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x5a8ecd + ':', _0x46ccef['message']);
            }
        }
    },
    async 'getSetting'(_0x15dd78, _0x2fdf3e) {
        if (backend === 'memory') {
            const _0x2b8b2a = './data';
            const _0x78a2f = _0x0_0x4118b8['join'](_0x2b8b2a, _0x2fdf3e + '.json');
            try {
                if (_0x0_0x21d771['existsSync'](_0x78a2f)) {
                    const _0x3dfa1e = JSON['parse'](_0x0_0x21d771['readFileSync'](_0x78a2f, 'utf-8'));
                    if (_0x3dfa1e['enabled'] !== undefined)
                        return _0x3dfa1e;
                    if (_0x3dfa1e[_0x15dd78] !== undefined)
                        return _0x3dfa1e[_0x15dd78];
                    return null;
                }
                return null;
            } catch (_0x206161) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2fdf3e + ':', _0x206161['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x15dd78, _0x2fdf3e);
            } catch (_0x1a8660) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2fdf3e + ':', _0x1a8660['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x30afe1) {
        if (backend === 'memory') {
            const _0x53ab9c = './data';
            const _0x3a0749 = {};
            try {
                if (_0x0_0x21d771['existsSync'](_0x53ab9c)) {
                    const _0x5eafb7 = _0x0_0x21d771['readdirSync'](_0x53ab9c)['filter'](_0x39b6ec => _0x39b6ec['endsWith']('.json'));
                    for (const _0x1dee76 of _0x5eafb7) {
                        const _0x321252 = _0x0_0x4118b8['basename'](_0x1dee76, '.json');
                        if (_0x321252 === 'messageCount' || _0x321252 === 'owner')
                            continue;
                        const _0xb80f54 = _0x0_0x4118b8['join'](_0x53ab9c, _0x1dee76);
                        const _0x2dbae2 = JSON['parse'](_0x0_0x21d771['readFileSync'](_0xb80f54, 'utf-8'));
                        if (_0x2dbae2[_0x30afe1]) {
                            _0x3a0749[_0x321252] = _0x2dbae2[_0x30afe1];
                        }
                    }
                }
                return _0x3a0749;
            } catch (_0x16bec3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x16bec3['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x30afe1);
            } catch (_0x114d0b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x114d0b['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x43b14d) {
        const _0x5b05ba = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x5b05ba['includes'](_0x43b14d)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x43b14d + ',\x20defaulting\x20to\x20private');
            _0x43b14d = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x43b14d;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x43b14d);
            } catch (_0x45d61d) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x45d61d['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x34d613 = await adapters[backend]['getMetadata']('botMode');
                return _0x34d613 || 'private';
            } catch (_0x27cb4d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x27cb4d['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0xa08dd4, _0x4dba47, _0x5bfc12) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0xa08dd4]) {
                this['messageCount'][_0xa08dd4] = {};
            }
            if (!this['messageCount'][_0xa08dd4][_0x4dba47]) {
                this['messageCount'][_0xa08dd4][_0x4dba47] = 0x0;
            }
            this['messageCount'][_0xa08dd4][_0x4dba47]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0xa08dd4, _0x4dba47);
            } catch (_0x19d9ac) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x4dba47 + ':', _0x19d9ac['message']);
            }
        }
    },
    async 'getMessageCount'(_0x4c88bb, _0x2c30a3) {
        if (backend === 'memory') {
            return this['messageCount'][_0x4c88bb]?.[_0x2c30a3] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x4c88bb, _0x2c30a3);
            } catch (_0xea2fe2) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x2c30a3 + ':', _0xea2fe2['message']);
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
            } catch (_0x4126fb) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x4126fb['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x30fa1d) {
        if (backend === 'memory') {
            this['isPublic'] = _0x30fa1d;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x30fa1d);
            } catch (_0x240545) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x240545['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x164265 = await adapters[backend]['getAllCounts']();
                return _0x164265['isPublic'];
            } catch (_0x2e3679) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x2e3679['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x3702a2) {
        const _0x384f09 = [
            'public',
            'private'
        ];
        if (!_0x384f09['includes'](_0x3702a2)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x3702a2);
            _0x3702a2 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x3702a2;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x3702a2);
            } catch (_0x108489) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x108489['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x51ce85 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x51ce85 || 'private';
            } catch (_0x5dd1b0) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x5dd1b0['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x2a7c88 = 0x0;
        const _0x4669ba = Object['keys'](this['contacts'])['length'];
        const _0xa508b1 = Object['keys'](this['chats'])['length'];
        let _0x4fcce5 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0xa4dd47 => {
                if (Array['isArray'](_0xa4dd47)) {
                    _0x2a7c88 += _0xa4dd47['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x1940e5 => {
                if (typeof _0x1940e5 === 'object') {
                    _0x4fcce5 += Object['keys'](_0x1940e5)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x2a7c88 : 'stored\x20in\x20database',
            'contacts': _0x4669ba,
            'chats': _0xa508b1,
            'messageCounts': backend === 'memory' ? _0x4fcce5 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0xf9c9a4 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0xf9c9a4));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x325d3e => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x325d3e));
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
        let _0x4d2812 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x212463 => {
            if (store['chats'][_0x212463]['messages']) {
                delete store['chats'][_0x212463]['messages'];
                _0x4d2812++;
            }
        });
        if (_0x4d2812 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x4d2812 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0xacc09 => {
    console['log']('[STORE]\x20Received\x20' + _0xacc09 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x4a2d4d) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x4a2d4d['message']);
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
process['on']('uncaughtException', _0x19ccc3 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x19ccc3);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x4f8dbf, _0x1c2b22) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x1c2b22, 'reason:', _0x4f8dbf);
});
export default store;