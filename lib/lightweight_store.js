import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x169502 from 'fs';
import _0x0_0x44ceb8 from 'path';
import _0x0_0x50bf34 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x5ae121) {
    printLog = (_0x479225, _0x43325a) => console['log']('[' + _0x479225['toUpperCase']() + ']\x20' + _0x43325a);
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
} catch (_0x0_0x1fd0b2) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x466b8f => {
    try {
        return _0x0_0x50bf34['deflateSync'](JSON['stringify'](_0x466b8f));
    } catch (_0x3a381a) {
        console['error']('[STORE]\x20Compression\x20error:', _0x3a381a['message']);
        return Buffer['from'](JSON['stringify'](_0x466b8f));
    }
};
const decompress = _0xc1af53 => {
    try {
        return JSON['parse'](_0x0_0x50bf34['inflateSync'](_0xc1af53));
    } catch (_0x246668) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x246668['message']);
        try {
            return JSON['parse'](_0xc1af53['toString']());
        } catch (_0x2ae58c) {
            return null;
        }
    }
};
function slimMessage(_0x42e190) {
    return {
        'key': _0x42e190['key'],
        'message': _0x42e190['message'],
        'messageTimestamp': _0x42e190['messageTimestamp'],
        'participant': _0x42e190['participant'],
        'pushName': _0x42e190['pushName'],
        'broadcast': _0x42e190['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x42c63c => console['error']('[MONGO]\x20Connection\x20error:', _0x42c63c));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x465eec, _0x5e990a, _0x1c4be2) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x465eec,
                        'id': _0x5e990a
                    }, {
                        'data': compress(_0x1c4be2),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x27f60d) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x27f60d['message']);
                }
            },
            async 'load'(_0x135703, _0x34d86b) {
                try {
                    const _0x4e5a68 = await Msg['findOne']({
                        'jid': _0x135703,
                        'id': _0x34d86b
                    });
                    return _0x4e5a68 ? decompress(_0x4e5a68['data']) : null;
                } catch (_0xbc206f) {
                    console['error']('[MONGO]\x20Load\x20error:', _0xbc206f['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x4fe84e, _0x5e0037) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x4fe84e,
                        'userId': _0x5e0037
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x5ab5f4) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x5ab5f4['message']);
                }
            },
            async 'getCount'(_0x23102e, _0x4fa3c1) {
                try {
                    const _0x15e461 = await MsgCount['findOne']({
                        'chatId': _0x23102e,
                        'userId': _0x4fa3c1
                    });
                    return _0x15e461 ? _0x15e461['count'] : 0x0;
                } catch (_0x291b87) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x291b87['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x3d1abe = await MsgCount['find']({});
                    const _0x148b0a = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3d1abe['forEach'](_0x590e47 => {
                        if (!_0x148b0a['messageCount'][_0x590e47['chatId']]) {
                            _0x148b0a['messageCount'][_0x590e47['chatId']] = {};
                        }
                        _0x148b0a['messageCount'][_0x590e47['chatId']][_0x590e47['userId']] = _0x590e47['count'];
                    });
                    const _0xc0d41e = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0xc0d41e)
                        _0x148b0a['isPublic'] = _0xc0d41e['value'] === 'true';
                    return _0x148b0a;
                } catch (_0x13f257) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x13f257['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x553d89) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x553d89['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x3baeda) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x3baeda['message']);
                }
            },
            async 'setMetadata'(_0x219318, _0x919cb) {
                try {
                    await Meta['updateOne']({ 'key': _0x219318 }, {
                        'key': _0x219318,
                        'value': _0x919cb['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x1612fb) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x1612fb['message']);
                }
            },
            async 'getMetadata'(_0x2b5503) {
                try {
                    const _0xcb554d = await Meta['findOne']({ 'key': _0x2b5503 });
                    return _0xcb554d ? _0xcb554d['value'] : null;
                } catch (_0x5b508d) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x5b508d['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x31506e, _0x23dd4c) {
                try {
                    await Contact['updateOne']({ 'jid': _0x31506e }, {
                        ..._0x23dd4c,
                        'jid': _0x31506e,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5dcd34) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x5dcd34['message']);
                }
            },
            async 'getContact'(_0x14482c) {
                try {
                    return await Contact['findOne']({ 'jid': _0x14482c });
                } catch (_0x5f4ab4) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x5f4ab4['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x20a969 = await Contact['find']({});
                    const _0x2de572 = {};
                    _0x20a969['forEach'](_0x405df4 => {
                        _0x2de572[_0x405df4['jid']] = {
                            'id': _0x405df4['jid'],
                            'name': _0x405df4['name'],
                            'notify': _0x405df4['notify']
                        };
                    });
                    return _0x2de572;
                } catch (_0x2eb867) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x2eb867['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x5e9612, _0x48dde0) {
                try {
                    await Chat['updateOne']({ 'jid': _0x5e9612 }, {
                        ..._0x48dde0,
                        'jid': _0x5e9612,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x48d7a1) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x48d7a1['message']);
                }
            },
            async 'getChat'(_0x35e787) {
                try {
                    return await Chat['findOne']({ 'jid': _0x35e787 });
                } catch (_0x5e9350) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x5e9350['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x345cb9 = await Chat['find']({});
                    const _0x322fda = {};
                    _0x345cb9['forEach'](_0x2903ac => {
                        _0x322fda[_0x2903ac['jid']] = {
                            'id': _0x2903ac['jid'],
                            'name': _0x2903ac['name'],
                            'conversationTimestamp': _0x2903ac['conversationTimestamp'],
                            'unreadCount': _0x2903ac['unreadCount']
                        };
                    });
                    return _0x322fda;
                } catch (_0xfcccdf) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0xfcccdf['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x3d7628) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x3d7628 });
                } catch (_0x41064e) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x41064e['message']);
                }
            },
            async 'saveSetting'(_0x1690f7, _0x12a61d, _0x5c0e62) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x1690f7,
                        'key': _0x12a61d
                    }, {
                        'chatId': _0x1690f7,
                        'key': _0x12a61d,
                        'value': _0x5c0e62,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4a72b4) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x4a72b4['message']);
                }
            },
            async 'getSetting'(_0xf554a6, _0x57aa8b) {
                try {
                    const _0x221cdb = await Setting['findOne']({
                        'chatId': _0xf554a6,
                        'key': _0x57aa8b
                    });
                    return _0x221cdb ? _0x221cdb['value'] : null;
                } catch (_0x4f2cb4) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x4f2cb4['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x19bcec) {
                try {
                    const _0x55cd80 = await Setting['find']({ 'chatId': _0x19bcec });
                    const _0x252f6c = {};
                    _0x55cd80['forEach'](_0x522ed7 => {
                        _0x252f6c[_0x522ed7['key']] = _0x522ed7['value'];
                    });
                    return _0x252f6c;
                } catch (_0x568ec0) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x568ec0['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x1765fb = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x1765fb['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x1765fb['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x497a63) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x497a63['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x335f21) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x335f21['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x8be422) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x8be422['message']);
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
        pool['on']('error', _0x5f465a => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x5f465a['message']);
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
                        const _0x17e5eb = await pool['connect']();
                        try {
                            await _0x17e5eb['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x17e5eb['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x17e5eb['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x17e5eb['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x17e5eb['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x17e5eb['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x17e5eb['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x17e5eb['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x17e5eb['release']();
                        }
                    } catch (_0x363351) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x363351['message']);
                        this['initPromise'] = null;
                        throw _0x363351;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x401e13, _0x150b56, _0x36c576) {
                try {
                    await this['init']();
                    const _0x5890cf = await pool['connect']();
                    try {
                        await _0x5890cf['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x401e13,
                            _0x150b56,
                            Date['now'](),
                            compress(_0x36c576)
                        ]);
                    } finally {
                        _0x5890cf['release']();
                    }
                } catch (_0xe7a281) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0xe7a281['message']);
                }
            },
            async 'load'(_0x54be56, _0x51c5a6) {
                try {
                    await this['init']();
                    const _0x136660 = await pool['connect']();
                    try {
                        const _0x2a5a85 = await _0x136660['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x54be56,
                            _0x51c5a6
                        ]);
                        return _0x2a5a85['rows'][0x0] ? decompress(_0x2a5a85['rows'][0x0]['data']) : null;
                    } finally {
                        _0x136660['release']();
                    }
                } catch (_0xc03d31) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0xc03d31['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x1ff08b, _0x2cd0da) {
                try {
                    await this['init']();
                    const _0x336525 = await pool['connect']();
                    try {
                        await _0x336525['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x1ff08b,
                            _0x2cd0da
                        ]);
                    } finally {
                        _0x336525['release']();
                    }
                } catch (_0x54e308) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x54e308['message']);
                }
            },
            async 'getCount'(_0x4cc0da, _0x2b18a0) {
                try {
                    await this['init']();
                    const _0x125566 = await pool['connect']();
                    try {
                        const _0x2937fe = await _0x125566['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x4cc0da,
                            _0x2b18a0
                        ]);
                        return _0x2937fe['rows'][0x0] ? _0x2937fe['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x125566['release']();
                    }
                } catch (_0x273c04) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x273c04['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x121ed6 = await pool['connect']();
                    try {
                        const _0x45dfaf = await _0x121ed6['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x2363d8 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x45dfaf['rows']['forEach'](_0x21fbed => {
                            if (!_0x2363d8['messageCount'][_0x21fbed['chat_id']]) {
                                _0x2363d8['messageCount'][_0x21fbed['chat_id']] = {};
                            }
                            _0x2363d8['messageCount'][_0x21fbed['chat_id']][_0x21fbed['user_id']] = _0x21fbed['count'];
                        });
                        const _0xa2c3d = await _0x121ed6['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0xa2c3d['rows'][0x0])
                            _0x2363d8['isPublic'] = _0xa2c3d['rows'][0x0]['value'] === 'true';
                        return _0x2363d8;
                    } finally {
                        _0x121ed6['release']();
                    }
                } catch (_0x115f94) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x115f94['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x6a2df8) {
                try {
                    await this['init']();
                    const _0xf9f3e1 = await pool['connect']();
                    try {
                        await _0xf9f3e1['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x6a2df8['toString']()]);
                    } finally {
                        _0xf9f3e1['release']();
                    }
                } catch (_0x4901c2) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x4901c2['message']);
                }
            },
            async 'setMetadata'(_0x5a8e62, _0x36359d) {
                try {
                    await this['init']();
                    const _0x1df72f = await pool['connect']();
                    try {
                        await _0x1df72f['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x5a8e62,
                            _0x36359d['toString']()
                        ]);
                    } finally {
                        _0x1df72f['release']();
                    }
                } catch (_0x167a83) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x167a83['message']);
                }
            },
            async 'getMetadata'(_0x4d94e9) {
                try {
                    await this['init']();
                    const _0x4100b0 = await pool['connect']();
                    try {
                        const _0x16e9c5 = await _0x4100b0['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x4d94e9]);
                        return _0x16e9c5['rows'][0x0] ? _0x16e9c5['rows'][0x0]['value'] : null;
                    } finally {
                        _0x4100b0['release']();
                    }
                } catch (_0x449f51) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x449f51['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xea2e2a, _0x3bda63) {
                try {
                    await this['init']();
                    const _0x3f0477 = await pool['connect']();
                    try {
                        await _0x3f0477['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0xea2e2a,
                            _0x3bda63['name'] || '',
                            _0x3bda63['notify'] || '',
                            _0x3bda63['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x3f0477['release']();
                    }
                } catch (_0x576e9a) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x576e9a['message']);
                }
            },
            async 'getContact'(_0x1ac740) {
                try {
                    await this['init']();
                    const _0x3a853a = await pool['connect']();
                    try {
                        const _0x1a6af9 = await _0x3a853a['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x1ac740]);
                        return _0x1a6af9['rows'][0x0] || null;
                    } finally {
                        _0x3a853a['release']();
                    }
                } catch (_0x597f0b) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x597f0b['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x800d81 = await pool['connect']();
                    try {
                        const _0x49d05b = await _0x800d81['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x259d4b = {};
                        _0x49d05b['rows']['forEach'](_0x4cb833 => {
                            _0x259d4b[_0x4cb833['jid']] = {
                                'id': _0x4cb833['jid'],
                                'name': _0x4cb833['name'],
                                'notify': _0x4cb833['notify']
                            };
                        });
                        return _0x259d4b;
                    } finally {
                        _0x800d81['release']();
                    }
                } catch (_0x28e7bb) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x28e7bb['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x1cb6ba, _0x357645) {
                try {
                    await this['init']();
                    const _0x152c55 = await pool['connect']();
                    try {
                        await _0x152c55['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x1cb6ba,
                            _0x357645['name'] || '',
                            _0x357645['conversationTimestamp'] || 0x0,
                            _0x357645['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x152c55['release']();
                    }
                } catch (_0x9acb68) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x9acb68['message']);
                }
            },
            async 'getChat'(_0x4e975b) {
                try {
                    await this['init']();
                    const _0xd5c55a = await pool['connect']();
                    try {
                        const _0x1652a7 = await _0xd5c55a['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x4e975b]);
                        return _0x1652a7['rows'][0x0] || null;
                    } finally {
                        _0xd5c55a['release']();
                    }
                } catch (_0xf4853d) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0xf4853d['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x335a4b = await pool['connect']();
                    try {
                        const _0x258940 = await _0x335a4b['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x426686 = {};
                        _0x258940['rows']['forEach'](_0x1d8135 => {
                            _0x426686[_0x1d8135['jid']] = {
                                'id': _0x1d8135['jid'],
                                'name': _0x1d8135['name'],
                                'conversationTimestamp': _0x1d8135['conversation_timestamp'],
                                'unreadCount': _0x1d8135['unread_count']
                            };
                        });
                        return _0x426686;
                    } finally {
                        _0x335a4b['release']();
                    }
                } catch (_0x40e7e9) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x40e7e9['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x588c62) {
                try {
                    await this['init']();
                    const _0x18ffe0 = await pool['connect']();
                    try {
                        await _0x18ffe0['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x588c62]);
                    } finally {
                        _0x18ffe0['release']();
                    }
                } catch (_0x579417) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x579417['message']);
                }
            },
            async 'saveSetting'(_0xf9af8c, _0x49be1d, _0xae9b93) {
                try {
                    await this['init']();
                    const _0x274539 = await pool['connect']();
                    try {
                        await _0x274539['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0xf9af8c,
                            _0x49be1d,
                            JSON['stringify'](_0xae9b93),
                            Date['now']()
                        ]);
                    } finally {
                        _0x274539['release']();
                    }
                } catch (_0x29c193) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x29c193['message']);
                }
            },
            async 'getSetting'(_0x1c5602, _0x5a127d) {
                try {
                    await this['init']();
                    const _0x11214f = await pool['connect']();
                    try {
                        const _0x570ff6 = await _0x11214f['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x1c5602,
                            _0x5a127d
                        ]);
                        return _0x570ff6['rows'][0x0] ? JSON['parse'](_0x570ff6['rows'][0x0]['value']) : null;
                    } finally {
                        _0x11214f['release']();
                    }
                } catch (_0x245df4) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x245df4['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x503bfd) {
                try {
                    await this['init']();
                    const _0x550457 = await pool['connect']();
                    try {
                        const _0x3b6f51 = await _0x550457['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x503bfd]);
                        const _0x546259 = {};
                        _0x3b6f51['rows']['forEach'](_0x422ddb => {
                            _0x546259[_0x422ddb['key']] = JSON['parse'](_0x422ddb['value']);
                        });
                        return _0x546259;
                    } finally {
                        _0x550457['release']();
                    }
                } catch (_0x2eb7e1) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x2eb7e1['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x16fe0c = await pool['connect']();
                    try {
                        const _0x1d3622 = await _0x16fe0c['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x1d3622['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x1d3622['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x16fe0c['release']();
                    }
                } catch (_0x194bd7) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x194bd7['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x3c2c40) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x3c2c40['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x4e0f68) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x4e0f68['message']);
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
                    } catch (_0x162f0e) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x162f0e['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x162f0e;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x31ab0e, _0x310983, _0x67a955) {
                try {
                    const _0x39c59c = await this['getConn']();
                    await _0x39c59c['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x31ab0e,
                        _0x310983,
                        Date['now'](),
                        compress(_0x67a955)
                    ]);
                } catch (_0x251aef) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x251aef['message']);
                }
            },
            async 'load'(_0x38f06f, _0x32b464) {
                try {
                    const _0x4f8c94 = await this['getConn']();
                    const [_0x3c00b2] = await _0x4f8c94['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x38f06f,
                        _0x32b464
                    ]);
                    return _0x3c00b2[0x0] ? decompress(_0x3c00b2[0x0]['data']) : null;
                } catch (_0x197318) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x197318['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x47387b, _0x5916fb) {
                try {
                    const _0x517064 = await this['getConn']();
                    await _0x517064['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x47387b,
                        _0x5916fb
                    ]);
                } catch (_0xa6aae0) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0xa6aae0['message']);
                }
            },
            async 'getCount'(_0x4649f5, _0x3e82b5) {
                try {
                    const _0x159b3e = await this['getConn']();
                    const [_0xaf71ea] = await _0x159b3e['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x4649f5,
                        _0x3e82b5
                    ]);
                    return _0xaf71ea[0x0] ? _0xaf71ea[0x0]['count'] : 0x0;
                } catch (_0xb57bc5) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0xb57bc5['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x5ecfcd = await this['getConn']();
                    const [_0x4faebd] = await _0x5ecfcd['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x247b1f = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x4faebd['forEach'](_0x3fb5dc => {
                        if (!_0x247b1f['messageCount'][_0x3fb5dc['chat_id']]) {
                            _0x247b1f['messageCount'][_0x3fb5dc['chat_id']] = {};
                        }
                        _0x247b1f['messageCount'][_0x3fb5dc['chat_id']][_0x3fb5dc['user_id']] = _0x3fb5dc['count'];
                    });
                    const [_0x3cfa9] = await _0x5ecfcd['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x3cfa9[0x0])
                        _0x247b1f['isPublic'] = _0x3cfa9[0x0]['value'] === 'true';
                    return _0x247b1f;
                } catch (_0xcfd514) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0xcfd514['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x44087f) {
                try {
                    const _0x3bb172 = await this['getConn']();
                    await _0x3bb172['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x44087f['toString']()]);
                } catch (_0xf98167) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0xf98167['message']);
                }
            },
            async 'setMetadata'(_0x4972b5, _0x66729b) {
                try {
                    const _0x128a4c = await this['getConn']();
                    await _0x128a4c['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x4972b5,
                        _0x66729b['toString']()
                    ]);
                } catch (_0xe172e1) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0xe172e1['message']);
                }
            },
            async 'getMetadata'(_0x2c3f8a) {
                try {
                    const _0x5362a4 = await this['getConn']();
                    const [_0x32ef4b] = await _0x5362a4['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x2c3f8a]);
                    return _0x32ef4b[0x0] ? _0x32ef4b[0x0]['value'] : null;
                } catch (_0x50e94b) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x50e94b['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x3e6ba3, _0x5e370e) {
                try {
                    const _0x46c270 = await this['getConn']();
                    await _0x46c270['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x3e6ba3,
                        _0x5e370e['name'] || '',
                        _0x5e370e['notify'] || '',
                        _0x5e370e['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x209d8c) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x209d8c['message']);
                }
            },
            async 'getContact'(_0x284f91) {
                try {
                    const _0xb1ce1d = await this['getConn']();
                    const [_0x3315df] = await _0xb1ce1d['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x284f91]);
                    return _0x3315df[0x0] || null;
                } catch (_0x4a9d3f) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x4a9d3f['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x4010db = await this['getConn']();
                    const [_0x493f12] = await _0x4010db['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x34e6db = {};
                    _0x493f12['forEach'](_0x4ba77b => {
                        _0x34e6db[_0x4ba77b['jid']] = {
                            'id': _0x4ba77b['jid'],
                            'name': _0x4ba77b['name'],
                            'notify': _0x4ba77b['notify']
                        };
                    });
                    return _0x34e6db;
                } catch (_0x4c6257) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x4c6257['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x521652, _0x4971fd) {
                try {
                    const _0x374059 = await this['getConn']();
                    await _0x374059['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x521652,
                        _0x4971fd['name'] || '',
                        _0x4971fd['conversationTimestamp'] || 0x0,
                        _0x4971fd['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x1981c8) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x1981c8['message']);
                }
            },
            async 'getChat'(_0x5de679) {
                try {
                    const _0x24967b = await this['getConn']();
                    const [_0x16fe47] = await _0x24967b['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x5de679]);
                    return _0x16fe47[0x0] || null;
                } catch (_0x4d5eef) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x4d5eef['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x2507f2 = await this['getConn']();
                    const [_0x5271f9] = await _0x2507f2['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x66205d = {};
                    _0x5271f9['forEach'](_0x48aa0b => {
                        _0x66205d[_0x48aa0b['jid']] = {
                            'id': _0x48aa0b['jid'],
                            'name': _0x48aa0b['name'],
                            'conversationTimestamp': _0x48aa0b['conversation_timestamp'],
                            'unreadCount': _0x48aa0b['unread_count']
                        };
                    });
                    return _0x66205d;
                } catch (_0x18aed9) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x18aed9['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0xe42d29) {
                try {
                    const _0x388cbb = await this['getConn']();
                    await _0x388cbb['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0xe42d29]);
                } catch (_0x140f75) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x140f75['message']);
                }
            },
            async 'saveSetting'(_0x43ee75, _0x7c4f55, _0x5ddc6c) {
                try {
                    const _0x3ed9c1 = await this['getConn']();
                    await _0x3ed9c1['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x43ee75,
                        _0x7c4f55,
                        JSON['stringify'](_0x5ddc6c),
                        Date['now']()
                    ]);
                } catch (_0x1dbcc8) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x1dbcc8['message']);
                }
            },
            async 'getSetting'(_0xf68a75, _0x173825) {
                try {
                    const _0x5b4da4 = await this['getConn']();
                    const [_0x2afef1] = await _0x5b4da4['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0xf68a75,
                        _0x173825
                    ]);
                    return _0x2afef1[0x0] ? JSON['parse'](_0x2afef1[0x0]['value']) : null;
                } catch (_0x370d92) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x370d92['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x39aa8e) {
                try {
                    const _0x22943c = await this['getConn']();
                    const [_0x2546c6] = await _0x22943c['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x39aa8e]);
                    const _0x1236d1 = {};
                    _0x2546c6['forEach'](_0x46c714 => {
                        _0x1236d1[_0x46c714['key']] = JSON['parse'](_0x46c714['value']);
                    });
                    return _0x1236d1;
                } catch (_0x496d86) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x496d86['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x446404 = await this['getConn']();
                    const [_0x59cee0] = await _0x446404['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x59cee0['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x59cee0['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x527de3) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x527de3['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x51efa3) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x51efa3['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x440248) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x440248['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x44ceb8['dirname'](SQLITE_URL);
        if (!_0x0_0x169502['existsSync'](dir))
            _0x0_0x169502['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0xdc5853, _0x3ff149, _0x56e8fe) {
                try {
                    saveStmt['run'](_0xdc5853, _0x3ff149, Date['now'](), compress(_0x56e8fe));
                    const {count: _0x2e224f} = countStmt['get'](_0xdc5853);
                    if (_0x2e224f > MESSAGE_LIMITS['sqlite']) {
                        const _0x552061 = _0x2e224f - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0xdc5853, _0xdc5853, _0x552061);
                    }
                } catch (_0x359c04) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x359c04['message']);
                }
            },
            'load'(_0x38b465, _0x1bf58f) {
                try {
                    const _0x330d00 = loadStmt['get'](_0x38b465, _0x1bf58f);
                    return _0x330d00 ? decompress(_0x330d00['data']) : null;
                } catch (_0x288c89) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x288c89['message']);
                    return null;
                }
            },
            'incrementCount'(_0x518b41, _0x3ca903) {
                try {
                    incrementCountStmt['run'](_0x518b41, _0x3ca903);
                } catch (_0x437cc2) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x437cc2['message']);
                }
            },
            'getCount'(_0x5a0fa2, _0x40c955) {
                try {
                    const _0x5e175b = getCountStmt['get'](_0x5a0fa2, _0x40c955);
                    return _0x5e175b ? _0x5e175b['count'] : 0x0;
                } catch (_0x29f48d) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x29f48d['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x9d091e = getAllCountsStmt['all']();
                    const _0x5da836 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x9d091e['forEach'](_0x29d21f => {
                        if (!_0x5da836['messageCount'][_0x29d21f['chat_id']]) {
                            _0x5da836['messageCount'][_0x29d21f['chat_id']] = {};
                        }
                        _0x5da836['messageCount'][_0x29d21f['chat_id']][_0x29d21f['user_id']] = _0x29d21f['count'];
                    });
                    const _0xe39a2f = getMetaStmt['get']();
                    if (_0xe39a2f)
                        _0x5da836['isPublic'] = _0xe39a2f['value'] === 'true';
                    return _0x5da836;
                } catch (_0x463076) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x463076['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x333434) {
                try {
                    setMetaStmt['run'](_0x333434['toString']());
                } catch (_0x2fefd1) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x2fefd1['message']);
                }
            },
            'setMetadata'(_0x1de3af, _0x167eee) {
                try {
                    setMetadataStmt['run'](_0x1de3af, _0x167eee['toString']());
                } catch (_0x2b376b) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x2b376b['message']);
                }
            },
            'getMetadata'(_0x1b919f) {
                try {
                    const _0x54936b = getMetadataStmt['get'](_0x1b919f);
                    return _0x54936b ? _0x54936b['value'] : null;
                } catch (_0x2df0fa) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x2df0fa['message']);
                    return null;
                }
            },
            'saveContact'(_0x75fea9, _0x5928de) {
                try {
                    saveContactStmt['run'](_0x75fea9, _0x5928de['name'] || '', _0x5928de['notify'] || '', _0x5928de['verifiedName'] || '', Date['now']());
                } catch (_0x2465f5) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x2465f5['message']);
                }
            },
            'getContact'(_0x346406) {
                try {
                    return getContactStmt['get'](_0x346406) || null;
                } catch (_0x97e2ae) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x97e2ae['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x4db4e3 = getAllContactsStmt['all']();
                    const _0x3e9318 = {};
                    _0x4db4e3['forEach'](_0xcd602c => {
                        _0x3e9318[_0xcd602c['jid']] = {
                            'id': _0xcd602c['jid'],
                            'name': _0xcd602c['name'],
                            'notify': _0xcd602c['notify']
                        };
                    });
                    return _0x3e9318;
                } catch (_0xcc1684) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0xcc1684['message']);
                    return {};
                }
            },
            'saveChat'(_0x30b78f, _0x143437) {
                try {
                    saveChatStmt['run'](_0x30b78f, _0x143437['name'] || '', _0x143437['conversationTimestamp'] || 0x0, _0x143437['unreadCount'] || 0x0, Date['now']());
                } catch (_0x3e055e) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x3e055e['message']);
                }
            },
            'getChat'(_0x5d5eb8) {
                try {
                    return getChatStmt['get'](_0x5d5eb8) || null;
                } catch (_0xb5fa56) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0xb5fa56['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x50d8c8 = getAllChatsStmt['all']();
                    const _0x279c9d = {};
                    _0x50d8c8['forEach'](_0x11174d => {
                        _0x279c9d[_0x11174d['jid']] = {
                            'id': _0x11174d['jid'],
                            'name': _0x11174d['name'],
                            'conversationTimestamp': _0x11174d['conversation_timestamp'],
                            'unreadCount': _0x11174d['unread_count']
                        };
                    });
                    return _0x279c9d;
                } catch (_0x3d4fce) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x3d4fce['message']);
                    return {};
                }
            },
            'deleteChat'(_0x4abf17) {
                try {
                    deleteChatStmt['run'](_0x4abf17);
                } catch (_0x4fee6a) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x4fee6a['message']);
                }
            },
            'saveSetting'(_0x1fbe4f, _0x4e50c9, _0x88f51) {
                try {
                    saveSettingStmt['run'](_0x1fbe4f, _0x4e50c9, JSON['stringify'](_0x88f51), Date['now']());
                } catch (_0x4e3ce3) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x4e3ce3['message']);
                }
            },
            'getSetting'(_0x110778, _0x23a764) {
                try {
                    const _0x547cc4 = getSettingStmt['get'](_0x110778, _0x23a764);
                    return _0x547cc4 ? JSON['parse'](_0x547cc4['value']) : null;
                } catch (_0x5745c6) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x5745c6['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x9e58ee) {
                try {
                    const _0x5c7dc4 = getAllSettingsStmt['all'](_0x9e58ee);
                    const _0x260abd = {};
                    _0x5c7dc4['forEach'](_0xc371c7 => {
                        _0x260abd[_0xc371c7['key']] = JSON['parse'](_0xc371c7['value']);
                    });
                    return _0x260abd;
                } catch (_0xfa071c) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0xfa071c['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x382fd1 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x382fd1['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x382fd1['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x533da1) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x533da1['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x40d199) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x40d199['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x4b2d9e) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x4b2d9e['message']);
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
    async 'readFromFile'(_0x38a1b9 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x7a4c20 = await adapters[backend]['getAllContacts']();
                const _0x9e91aa = await adapters[backend]['getAllChats']();
                const _0x37ce63 = await this['getBotMode']();
                this['contacts'] = _0x7a4c20;
                this['chats'] = _0x9e91aa;
                this['botMode'] = _0x37ce63;
            } else {
                if (_0x0_0x169502['existsSync'](_0x38a1b9)) {
                    const _0x4cac16 = JSON['parse'](_0x0_0x169502['readFileSync'](_0x38a1b9, 'utf-8'));
                    this['contacts'] = _0x4cac16['contacts'] || {};
                    this['chats'] = _0x4cac16['chats'] || {};
                    this['botMode'] = _0x4cac16['botMode'] || 'private';
                    this['messages'] = _0x4cac16['messages'] || {};
                    this['isPublic'] = _0x4cac16['isPublic'] !== undefined ? _0x4cac16['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x243a7c) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x243a7c['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x568674 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x2381f2 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x169502['writeFileSync'](_0x568674, JSON['stringify'](_0x2381f2, null, 0x2));
        } catch (_0x146332) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x146332['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x169502['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x4d2ed3 = JSON['parse'](_0x0_0x169502['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x4d2ed3['messageCount'] || _0x4d2ed3;
                    this['isPublic'] = typeof _0x4d2ed3['isPublic'] === 'boolean' ? _0x4d2ed3['isPublic'] : ![];
                }
            } catch (_0x584de9) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x584de9['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0xb2946c = _0x0_0x44ceb8['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x169502['existsSync'](_0xb2946c))
                    _0x0_0x169502['mkdirSync'](_0xb2946c, { 'recursive': !![] });
                const _0x86acc9 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x169502['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x86acc9, null, 0x2));
            } catch (_0x5bcd4e) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x5bcd4e['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x20b5bc => {
                if (typeof this['messages'][_0x20b5bc] === 'object' && !Array['isArray'](this['messages'][_0x20b5bc])) {
                    const _0x9fb58c = Object['values'](this['messages'][_0x20b5bc]);
                    this['messages'][_0x20b5bc] = _0x9fb58c['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x20b5bc])) {
                    if (this['messages'][_0x20b5bc]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x20b5bc] = this['messages'][_0x20b5bc]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x324b0c => {
                if (this['chats'][_0x324b0c]['messages']) {
                    delete this['chats'][_0x324b0c]['messages'];
                }
            });
        }
    },
    'bind'(_0x229d6c) {
        _0x229d6c['on']('messages.upsert', async ({messages: _0xd0598}) => {
            for (const _0x3ff98b of _0xd0598) {
                if (!_0x3ff98b['key']?.['remoteJid'])
                    continue;
                const _0x35f6dc = _0x3ff98b['key']['remoteJid'];
                const _0x3284ad = slimMessage(_0x3ff98b);
                if (backend === 'memory') {
                    this['messages'][_0x35f6dc] = this['messages'][_0x35f6dc] || [];
                    this['messages'][_0x35f6dc]['push'](_0x3284ad);
                    if (this['messages'][_0x35f6dc]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x35f6dc] = this['messages'][_0x35f6dc]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x35f6dc, _0x3ff98b['key']['id'], _0x3284ad);
                    } catch (_0x5eef4d) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x3ff98b['key']['id'] + ':', _0x5eef4d['message']);
                    }
                }
            }
        });
        _0x229d6c['on']('contacts.update', async _0x3cfe99 => {
            for (const _0x25a4a6 of _0x3cfe99) {
                if (_0x25a4a6['id']) {
                    const _0x15c3de = {
                        'id': _0x25a4a6['id'],
                        'name': _0x25a4a6['notify'] || _0x25a4a6['name'] || _0x25a4a6['verifiedName'] || '',
                        'notify': _0x25a4a6['notify'],
                        'verifiedName': _0x25a4a6['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x25a4a6['id']] = _0x15c3de;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x25a4a6['id'], _0x15c3de);
                        } catch (_0xfdcafe) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0xfdcafe['message']);
                        }
                    }
                }
            }
        });
        _0x229d6c['on']('contacts.set', async _0x40eab7 => {
            for (const _0x2c437b of _0x40eab7) {
                if (_0x2c437b['id']) {
                    const _0x55794b = {
                        'id': _0x2c437b['id'],
                        'name': _0x2c437b['notify'] || _0x2c437b['name'] || _0x2c437b['verifiedName'] || '',
                        'notify': _0x2c437b['notify'],
                        'verifiedName': _0x2c437b['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x2c437b['id']] = _0x55794b;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x2c437b['id'], _0x55794b);
                        } catch (_0x32b6db) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x32b6db['message']);
                        }
                    }
                }
            }
        });
        _0x229d6c['on']('chats.set', async _0x346e75 => {
            for (const _0x321d7a of _0x346e75) {
                if (_0x321d7a['id']) {
                    const _0x36bc33 = {
                        'id': _0x321d7a['id'],
                        'name': _0x321d7a['name'] || _0x321d7a['subject'] || '',
                        'conversationTimestamp': _0x321d7a['conversationTimestamp'],
                        'unreadCount': _0x321d7a['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x321d7a['id']] = _0x36bc33;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x321d7a['id'], _0x36bc33);
                        } catch (_0x7f589f) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x7f589f['message']);
                        }
                    }
                }
            }
        });
        _0x229d6c['on']('chats.update', async _0x4b5f8a => {
            for (const _0x1f2438 of _0x4b5f8a) {
                if (_0x1f2438['id']) {
                    if (backend === 'memory') {
                        const _0x1e192d = this['chats'][_0x1f2438['id']] || {};
                        this['chats'][_0x1f2438['id']] = {
                            'id': _0x1f2438['id'],
                            'name': _0x1f2438['name'] || _0x1f2438['subject'] || _0x1e192d['name'] || '',
                            'conversationTimestamp': _0x1f2438['conversationTimestamp'] || _0x1e192d['conversationTimestamp'],
                            'unreadCount': _0x1f2438['unreadCount'] !== undefined ? _0x1f2438['unreadCount'] : _0x1e192d['unreadCount']
                        };
                    } else {
                        try {
                            const _0x2041ff = await adapters[backend]['getChat'](_0x1f2438['id']) || {};
                            const _0x3d7366 = {
                                'id': _0x1f2438['id'],
                                'name': _0x1f2438['name'] || _0x1f2438['subject'] || _0x2041ff['name'] || '',
                                'conversationTimestamp': _0x1f2438['conversationTimestamp'] || _0x2041ff['conversation_timestamp'],
                                'unreadCount': _0x1f2438['unreadCount'] !== undefined ? _0x1f2438['unreadCount'] : _0x2041ff['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x1f2438['id'], _0x3d7366);
                        } catch (_0x49f0a1) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x49f0a1['message']);
                        }
                    }
                }
            }
        });
        _0x229d6c['on']('chats.delete', async _0x18e1df => {
            for (const _0x2c9399 of _0x18e1df) {
                if (backend === 'memory') {
                    delete this['chats'][_0x2c9399];
                    delete this['messages'][_0x2c9399];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x2c9399);
                    } catch (_0x5ea105) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x5ea105['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x487f70, _0x37c10f) {
        if (backend === 'memory') {
            const _0x5ad60a = this['messages'][_0x487f70]?.['find'](_0x154b5b => _0x154b5b['key']['id'] === _0x37c10f) || null;
            return _0x5ad60a;
        } else {
            try {
                return await adapters[backend]['load'](_0x487f70, _0x37c10f);
            } catch (_0x5923df) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x37c10f + ':', _0x5923df['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0xc19482, _0x50b910, _0x31da9f) {
        if (backend === 'memory') {
            const _0x2f1c14 = './data';
            if (!_0x0_0x169502['existsSync'](_0x2f1c14))
                _0x0_0x169502['mkdirSync'](_0x2f1c14, { 'recursive': !![] });
            const _0x30359c = _0x0_0x44ceb8['join'](_0x2f1c14, _0x50b910 + '.json');
            try {
                _0x0_0x169502['writeFileSync'](_0x30359c, JSON['stringify'](_0x31da9f, null, 0x2));
            } catch (_0x15b060) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x50b910 + ':', _0x15b060['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0xc19482, _0x50b910, _0x31da9f);
            } catch (_0x528ae7) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x50b910 + ':', _0x528ae7['message']);
            }
        }
    },
    async 'getSetting'(_0x20c441, _0x30a4a4) {
        if (backend === 'memory') {
            const _0x3388d3 = './data';
            const _0x37f587 = _0x0_0x44ceb8['join'](_0x3388d3, _0x30a4a4 + '.json');
            try {
                if (_0x0_0x169502['existsSync'](_0x37f587)) {
                    const _0x109a6a = JSON['parse'](_0x0_0x169502['readFileSync'](_0x37f587, 'utf-8'));
                    if (_0x109a6a['enabled'] !== undefined)
                        return _0x109a6a;
                    if (_0x109a6a[_0x20c441] !== undefined)
                        return _0x109a6a[_0x20c441];
                    return null;
                }
                return null;
            } catch (_0x2bf943) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x30a4a4 + ':', _0x2bf943['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x20c441, _0x30a4a4);
            } catch (_0x214047) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x30a4a4 + ':', _0x214047['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0xbe53e0) {
        if (backend === 'memory') {
            const _0x313256 = './data';
            const _0x233d48 = {};
            try {
                if (_0x0_0x169502['existsSync'](_0x313256)) {
                    const _0x88eee4 = _0x0_0x169502['readdirSync'](_0x313256)['filter'](_0x5b00fc => _0x5b00fc['endsWith']('.json'));
                    for (const _0x59e2cd of _0x88eee4) {
                        const _0x455fc0 = _0x0_0x44ceb8['basename'](_0x59e2cd, '.json');
                        if (_0x455fc0 === 'messageCount' || _0x455fc0 === 'owner')
                            continue;
                        const _0x2b7125 = _0x0_0x44ceb8['join'](_0x313256, _0x59e2cd);
                        const _0x230965 = JSON['parse'](_0x0_0x169502['readFileSync'](_0x2b7125, 'utf-8'));
                        if (_0x230965[_0xbe53e0]) {
                            _0x233d48[_0x455fc0] = _0x230965[_0xbe53e0];
                        }
                    }
                }
                return _0x233d48;
            } catch (_0x22f92b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x22f92b['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0xbe53e0);
            } catch (_0x48a60d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x48a60d['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x49288f) {
        const _0x372219 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x372219['includes'](_0x49288f)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x49288f + ',\x20defaulting\x20to\x20private');
            _0x49288f = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x49288f;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x49288f);
            } catch (_0x3f700a) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x3f700a['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x294753 = await adapters[backend]['getMetadata']('botMode');
                return _0x294753 || 'private';
            } catch (_0xbb4203) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0xbb4203['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x381486, _0x517e22, _0x1aea47) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x381486]) {
                this['messageCount'][_0x381486] = {};
            }
            if (!this['messageCount'][_0x381486][_0x517e22]) {
                this['messageCount'][_0x381486][_0x517e22] = 0x0;
            }
            this['messageCount'][_0x381486][_0x517e22]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x381486, _0x517e22);
            } catch (_0x260ff3) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x517e22 + ':', _0x260ff3['message']);
            }
        }
    },
    async 'getMessageCount'(_0x48ad15, _0x5479e7) {
        if (backend === 'memory') {
            return this['messageCount'][_0x48ad15]?.[_0x5479e7] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x48ad15, _0x5479e7);
            } catch (_0x57a59a) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x5479e7 + ':', _0x57a59a['message']);
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
            } catch (_0x15e3f5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x15e3f5['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x1a58b1) {
        if (backend === 'memory') {
            this['isPublic'] = _0x1a58b1;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x1a58b1);
            } catch (_0x750db4) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x750db4['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x2c82d4 = await adapters[backend]['getAllCounts']();
                return _0x2c82d4['isPublic'];
            } catch (_0x3d67fa) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x3d67fa['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x50ca4e) {
        const _0x149cff = [
            'public',
            'private'
        ];
        if (!_0x149cff['includes'](_0x50ca4e)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x50ca4e);
            _0x50ca4e = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x50ca4e;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x50ca4e);
            } catch (_0x3df091) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x3df091['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x512288 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x512288 || 'private';
            } catch (_0xd381aa) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0xd381aa['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x4c32d6 = 0x0;
        const _0x5ddc01 = Object['keys'](this['contacts'])['length'];
        const _0x41c348 = Object['keys'](this['chats'])['length'];
        let _0x540f85 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x38fabb => {
                if (Array['isArray'](_0x38fabb)) {
                    _0x4c32d6 += _0x38fabb['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x1971f5 => {
                if (typeof _0x1971f5 === 'object') {
                    _0x540f85 += Object['keys'](_0x1971f5)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x4c32d6 : 'stored\x20in\x20database',
            'contacts': _0x5ddc01,
            'chats': _0x41c348,
            'messageCounts': backend === 'memory' ? _0x540f85 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x72d794 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x72d794));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x3e1538 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x3e1538));
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
        let _0x10d4e0 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0xf50554 => {
            if (store['chats'][_0xf50554]['messages']) {
                delete store['chats'][_0xf50554]['messages'];
                _0x10d4e0++;
            }
        });
        if (_0x10d4e0 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x10d4e0 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x58934d => {
    console['log']('[STORE]\x20Received\x20' + _0x58934d + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x32306c) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x32306c['message']);
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
process['on']('uncaughtException', _0x447d12 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x447d12);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x3b6270, _0x81d8cc) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x81d8cc, 'reason:', _0x3b6270);
});
export default store;