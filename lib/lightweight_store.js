import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x20f183 from 'fs';
import _0x0_0xc6ceab from 'path';
import _0x0_0xb99cbf from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x539e3d) {
    printLog = (_0x14252b, _0x3409bb) => console['log']('[' + _0x14252b['toUpperCase']() + ']\x20' + _0x3409bb);
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
} catch (_0x0_0x189a2f) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0xff89cd => {
    try {
        return _0x0_0xb99cbf['deflateSync'](JSON['stringify'](_0xff89cd));
    } catch (_0x181327) {
        console['error']('[STORE]\x20Compression\x20error:', _0x181327['message']);
        return Buffer['from'](JSON['stringify'](_0xff89cd));
    }
};
const decompress = _0x3e7159 => {
    try {
        return JSON['parse'](_0x0_0xb99cbf['inflateSync'](_0x3e7159));
    } catch (_0x13d6ef) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x13d6ef['message']);
        try {
            return JSON['parse'](_0x3e7159['toString']());
        } catch (_0x4c331a) {
            return null;
        }
    }
};
function slimMessage(_0x3bee7a) {
    return {
        'key': _0x3bee7a['key'],
        'message': _0x3bee7a['message'],
        'messageTimestamp': _0x3bee7a['messageTimestamp'],
        'participant': _0x3bee7a['participant'],
        'pushName': _0x3bee7a['pushName'],
        'broadcast': _0x3bee7a['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x15c883 => console['error']('[MONGO]\x20Connection\x20error:', _0x15c883));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x2bb046, _0xbd938e, _0x30f66a) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x2bb046,
                        'id': _0xbd938e
                    }, {
                        'data': compress(_0x30f66a),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x37a37c) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x37a37c['message']);
                }
            },
            async 'load'(_0x3a9116, _0x29d001) {
                try {
                    const _0x8c3c3a = await Msg['findOne']({
                        'jid': _0x3a9116,
                        'id': _0x29d001
                    });
                    return _0x8c3c3a ? decompress(_0x8c3c3a['data']) : null;
                } catch (_0x59f03a) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x59f03a['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x3b7f11, _0x128b5c) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x3b7f11,
                        'userId': _0x128b5c
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x3f1d76) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x3f1d76['message']);
                }
            },
            async 'getCount'(_0x24364b, _0x3a5ad3) {
                try {
                    const _0x12d4a4 = await MsgCount['findOne']({
                        'chatId': _0x24364b,
                        'userId': _0x3a5ad3
                    });
                    return _0x12d4a4 ? _0x12d4a4['count'] : 0x0;
                } catch (_0x15f6d2) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x15f6d2['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x143195 = await MsgCount['find']({});
                    const _0x2ccc11 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x143195['forEach'](_0x1578af => {
                        if (!_0x2ccc11['messageCount'][_0x1578af['chatId']]) {
                            _0x2ccc11['messageCount'][_0x1578af['chatId']] = {};
                        }
                        _0x2ccc11['messageCount'][_0x1578af['chatId']][_0x1578af['userId']] = _0x1578af['count'];
                    });
                    const _0x248244 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x248244)
                        _0x2ccc11['isPublic'] = _0x248244['value'] === 'true';
                    return _0x2ccc11;
                } catch (_0x4a193f) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x4a193f['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x2448d6) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x2448d6['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x4866b6) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x4866b6['message']);
                }
            },
            async 'setMetadata'(_0x3229a0, _0x37f993) {
                try {
                    await Meta['updateOne']({ 'key': _0x3229a0 }, {
                        'key': _0x3229a0,
                        'value': _0x37f993['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x29c1e8) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x29c1e8['message']);
                }
            },
            async 'getMetadata'(_0x5280f7) {
                try {
                    const _0x5f3072 = await Meta['findOne']({ 'key': _0x5280f7 });
                    return _0x5f3072 ? _0x5f3072['value'] : null;
                } catch (_0x147406) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x147406['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x5727fe, _0x3a9102) {
                try {
                    await Contact['updateOne']({ 'jid': _0x5727fe }, {
                        ..._0x3a9102,
                        'jid': _0x5727fe,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x13a5bc) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x13a5bc['message']);
                }
            },
            async 'getContact'(_0xe401d2) {
                try {
                    return await Contact['findOne']({ 'jid': _0xe401d2 });
                } catch (_0x2fb5ae) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x2fb5ae['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0xa1b7d = await Contact['find']({});
                    const _0x5c03b9 = {};
                    _0xa1b7d['forEach'](_0x5774b1 => {
                        _0x5c03b9[_0x5774b1['jid']] = {
                            'id': _0x5774b1['jid'],
                            'name': _0x5774b1['name'],
                            'notify': _0x5774b1['notify']
                        };
                    });
                    return _0x5c03b9;
                } catch (_0x19c951) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x19c951['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x4f2f8a, _0xf28d83) {
                try {
                    await Chat['updateOne']({ 'jid': _0x4f2f8a }, {
                        ..._0xf28d83,
                        'jid': _0x4f2f8a,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3998ae) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x3998ae['message']);
                }
            },
            async 'getChat'(_0x40b369) {
                try {
                    return await Chat['findOne']({ 'jid': _0x40b369 });
                } catch (_0x2abe1d) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x2abe1d['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x13d1d1 = await Chat['find']({});
                    const _0x49bb8b = {};
                    _0x13d1d1['forEach'](_0x30be46 => {
                        _0x49bb8b[_0x30be46['jid']] = {
                            'id': _0x30be46['jid'],
                            'name': _0x30be46['name'],
                            'conversationTimestamp': _0x30be46['conversationTimestamp'],
                            'unreadCount': _0x30be46['unreadCount']
                        };
                    });
                    return _0x49bb8b;
                } catch (_0x5864bc) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x5864bc['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x4f8176) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x4f8176 });
                } catch (_0x2f0258) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x2f0258['message']);
                }
            },
            async 'saveSetting'(_0x1b0cf3, _0x1b5638, _0x36f707) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x1b0cf3,
                        'key': _0x1b5638
                    }, {
                        'chatId': _0x1b0cf3,
                        'key': _0x1b5638,
                        'value': _0x36f707,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4c7ff0) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x4c7ff0['message']);
                }
            },
            async 'getSetting'(_0xe72513, _0x4d31c6) {
                try {
                    const _0x5f4adf = await Setting['findOne']({
                        'chatId': _0xe72513,
                        'key': _0x4d31c6
                    });
                    return _0x5f4adf ? _0x5f4adf['value'] : null;
                } catch (_0xfbc56f) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0xfbc56f['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x323697) {
                try {
                    const _0x4b41c2 = await Setting['find']({ 'chatId': _0x323697 });
                    const _0x2e7bf5 = {};
                    _0x4b41c2['forEach'](_0x1d56ba => {
                        _0x2e7bf5[_0x1d56ba['key']] = _0x1d56ba['value'];
                    });
                    return _0x2e7bf5;
                } catch (_0x552c52) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x552c52['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x252a0b = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x252a0b['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x252a0b['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x5bd0cf) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x5bd0cf['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x54a4cf) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x54a4cf['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x360fc1) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x360fc1['message']);
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
        pool['on']('error', _0x1138e2 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x1138e2['message']);
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
                        const _0x58bc9f = await pool['connect']();
                        try {
                            await _0x58bc9f['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x58bc9f['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x58bc9f['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x58bc9f['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x58bc9f['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x58bc9f['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x58bc9f['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x58bc9f['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x58bc9f['release']();
                        }
                    } catch (_0x58d028) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x58d028['message']);
                        this['initPromise'] = null;
                        throw _0x58d028;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x403b30, _0x29dcf2, _0x388287) {
                try {
                    await this['init']();
                    const _0x502f65 = await pool['connect']();
                    try {
                        await _0x502f65['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x403b30,
                            _0x29dcf2,
                            Date['now'](),
                            compress(_0x388287)
                        ]);
                    } finally {
                        _0x502f65['release']();
                    }
                } catch (_0x3e1dc2) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x3e1dc2['message']);
                }
            },
            async 'load'(_0x2bbdec, _0x93dd7b) {
                try {
                    await this['init']();
                    const _0x56fc66 = await pool['connect']();
                    try {
                        const _0x45015b = await _0x56fc66['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x2bbdec,
                            _0x93dd7b
                        ]);
                        return _0x45015b['rows'][0x0] ? decompress(_0x45015b['rows'][0x0]['data']) : null;
                    } finally {
                        _0x56fc66['release']();
                    }
                } catch (_0x27acca) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x27acca['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x8d4491, _0x4771da) {
                try {
                    await this['init']();
                    const _0x1862cc = await pool['connect']();
                    try {
                        await _0x1862cc['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x8d4491,
                            _0x4771da
                        ]);
                    } finally {
                        _0x1862cc['release']();
                    }
                } catch (_0xcd82b6) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0xcd82b6['message']);
                }
            },
            async 'getCount'(_0xa05151, _0x412dd3) {
                try {
                    await this['init']();
                    const _0x4a315d = await pool['connect']();
                    try {
                        const _0x39569a = await _0x4a315d['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0xa05151,
                            _0x412dd3
                        ]);
                        return _0x39569a['rows'][0x0] ? _0x39569a['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x4a315d['release']();
                    }
                } catch (_0xc473e7) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0xc473e7['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x3c2049 = await pool['connect']();
                    try {
                        const _0x2eddf6 = await _0x3c2049['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x344128 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x2eddf6['rows']['forEach'](_0x23f362 => {
                            if (!_0x344128['messageCount'][_0x23f362['chat_id']]) {
                                _0x344128['messageCount'][_0x23f362['chat_id']] = {};
                            }
                            _0x344128['messageCount'][_0x23f362['chat_id']][_0x23f362['user_id']] = _0x23f362['count'];
                        });
                        const _0x560510 = await _0x3c2049['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x560510['rows'][0x0])
                            _0x344128['isPublic'] = _0x560510['rows'][0x0]['value'] === 'true';
                        return _0x344128;
                    } finally {
                        _0x3c2049['release']();
                    }
                } catch (_0x2928ba) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x2928ba['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x2ac52f) {
                try {
                    await this['init']();
                    const _0x393fb4 = await pool['connect']();
                    try {
                        await _0x393fb4['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x2ac52f['toString']()]);
                    } finally {
                        _0x393fb4['release']();
                    }
                } catch (_0x58d761) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x58d761['message']);
                }
            },
            async 'setMetadata'(_0x170de, _0x5c65e1) {
                try {
                    await this['init']();
                    const _0x2cd42c = await pool['connect']();
                    try {
                        await _0x2cd42c['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x170de,
                            _0x5c65e1['toString']()
                        ]);
                    } finally {
                        _0x2cd42c['release']();
                    }
                } catch (_0x221e0b) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x221e0b['message']);
                }
            },
            async 'getMetadata'(_0x595a3b) {
                try {
                    await this['init']();
                    const _0x351efb = await pool['connect']();
                    try {
                        const _0x46f60c = await _0x351efb['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x595a3b]);
                        return _0x46f60c['rows'][0x0] ? _0x46f60c['rows'][0x0]['value'] : null;
                    } finally {
                        _0x351efb['release']();
                    }
                } catch (_0x325a5d) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x325a5d['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x681bc3, _0x50a135) {
                try {
                    await this['init']();
                    const _0x24fc8f = await pool['connect']();
                    try {
                        await _0x24fc8f['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x681bc3,
                            _0x50a135['name'] || '',
                            _0x50a135['notify'] || '',
                            _0x50a135['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x24fc8f['release']();
                    }
                } catch (_0x1cda37) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x1cda37['message']);
                }
            },
            async 'getContact'(_0x41213b) {
                try {
                    await this['init']();
                    const _0x3a5d41 = await pool['connect']();
                    try {
                        const _0x42f06e = await _0x3a5d41['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x41213b]);
                        return _0x42f06e['rows'][0x0] || null;
                    } finally {
                        _0x3a5d41['release']();
                    }
                } catch (_0x3b972a) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x3b972a['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x1f5e53 = await pool['connect']();
                    try {
                        const _0x268a87 = await _0x1f5e53['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x40b3b6 = {};
                        _0x268a87['rows']['forEach'](_0xf8bf4c => {
                            _0x40b3b6[_0xf8bf4c['jid']] = {
                                'id': _0xf8bf4c['jid'],
                                'name': _0xf8bf4c['name'],
                                'notify': _0xf8bf4c['notify']
                            };
                        });
                        return _0x40b3b6;
                    } finally {
                        _0x1f5e53['release']();
                    }
                } catch (_0x45c2aa) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x45c2aa['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x3a8aa3, _0xe9b7fb) {
                try {
                    await this['init']();
                    const _0x5b8189 = await pool['connect']();
                    try {
                        await _0x5b8189['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x3a8aa3,
                            _0xe9b7fb['name'] || '',
                            _0xe9b7fb['conversationTimestamp'] || 0x0,
                            _0xe9b7fb['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x5b8189['release']();
                    }
                } catch (_0x458d91) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x458d91['message']);
                }
            },
            async 'getChat'(_0x3f403f) {
                try {
                    await this['init']();
                    const _0x528584 = await pool['connect']();
                    try {
                        const _0x4ebb00 = await _0x528584['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x3f403f]);
                        return _0x4ebb00['rows'][0x0] || null;
                    } finally {
                        _0x528584['release']();
                    }
                } catch (_0x2aee21) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x2aee21['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0xa4c18f = await pool['connect']();
                    try {
                        const _0x459c9c = await _0xa4c18f['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x54e05a = {};
                        _0x459c9c['rows']['forEach'](_0x475995 => {
                            _0x54e05a[_0x475995['jid']] = {
                                'id': _0x475995['jid'],
                                'name': _0x475995['name'],
                                'conversationTimestamp': _0x475995['conversation_timestamp'],
                                'unreadCount': _0x475995['unread_count']
                            };
                        });
                        return _0x54e05a;
                    } finally {
                        _0xa4c18f['release']();
                    }
                } catch (_0x8917b6) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x8917b6['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x157572) {
                try {
                    await this['init']();
                    const _0x5aa52a = await pool['connect']();
                    try {
                        await _0x5aa52a['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x157572]);
                    } finally {
                        _0x5aa52a['release']();
                    }
                } catch (_0x5af5c8) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x5af5c8['message']);
                }
            },
            async 'saveSetting'(_0x5bf5d1, _0x462be5, _0x11a582) {
                try {
                    await this['init']();
                    const _0x50898e = await pool['connect']();
                    try {
                        await _0x50898e['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x5bf5d1,
                            _0x462be5,
                            JSON['stringify'](_0x11a582),
                            Date['now']()
                        ]);
                    } finally {
                        _0x50898e['release']();
                    }
                } catch (_0x42b9e9) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x42b9e9['message']);
                }
            },
            async 'getSetting'(_0x9fba21, _0x17fac5) {
                try {
                    await this['init']();
                    const _0x25e7fd = await pool['connect']();
                    try {
                        const _0xf6acf5 = await _0x25e7fd['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x9fba21,
                            _0x17fac5
                        ]);
                        return _0xf6acf5['rows'][0x0] ? JSON['parse'](_0xf6acf5['rows'][0x0]['value']) : null;
                    } finally {
                        _0x25e7fd['release']();
                    }
                } catch (_0x22b2c5) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x22b2c5['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x33f80b) {
                try {
                    await this['init']();
                    const _0x4faf4a = await pool['connect']();
                    try {
                        const _0x1184e4 = await _0x4faf4a['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x33f80b]);
                        const _0x2f9d84 = {};
                        _0x1184e4['rows']['forEach'](_0x58d298 => {
                            _0x2f9d84[_0x58d298['key']] = JSON['parse'](_0x58d298['value']);
                        });
                        return _0x2f9d84;
                    } finally {
                        _0x4faf4a['release']();
                    }
                } catch (_0x1b3c7d) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x1b3c7d['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x5ab660 = await pool['connect']();
                    try {
                        const _0x25e554 = await _0x5ab660['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x25e554['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x25e554['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x5ab660['release']();
                    }
                } catch (_0xe30430) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0xe30430['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x133583) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x133583['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x11af3a) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x11af3a['message']);
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
                    } catch (_0x5730d7) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x5730d7['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x5730d7;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x2c211a, _0x3a7296, _0x2d53ef) {
                try {
                    const _0x3a0b9d = await this['getConn']();
                    await _0x3a0b9d['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x2c211a,
                        _0x3a7296,
                        Date['now'](),
                        compress(_0x2d53ef)
                    ]);
                } catch (_0x4eb532) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x4eb532['message']);
                }
            },
            async 'load'(_0x37602e, _0x42296e) {
                try {
                    const _0x3b477a = await this['getConn']();
                    const [_0x1951ec] = await _0x3b477a['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x37602e,
                        _0x42296e
                    ]);
                    return _0x1951ec[0x0] ? decompress(_0x1951ec[0x0]['data']) : null;
                } catch (_0x5be0a3) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x5be0a3['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x28e89a, _0x272957) {
                try {
                    const _0x406ed0 = await this['getConn']();
                    await _0x406ed0['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x28e89a,
                        _0x272957
                    ]);
                } catch (_0x1d7079) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x1d7079['message']);
                }
            },
            async 'getCount'(_0x93ebe3, _0xdce7c0) {
                try {
                    const _0xbce0b = await this['getConn']();
                    const [_0x4359c5] = await _0xbce0b['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x93ebe3,
                        _0xdce7c0
                    ]);
                    return _0x4359c5[0x0] ? _0x4359c5[0x0]['count'] : 0x0;
                } catch (_0x1ed2f0) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x1ed2f0['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x3f0b5f = await this['getConn']();
                    const [_0x363888] = await _0x3f0b5f['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x239094 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x363888['forEach'](_0x53a581 => {
                        if (!_0x239094['messageCount'][_0x53a581['chat_id']]) {
                            _0x239094['messageCount'][_0x53a581['chat_id']] = {};
                        }
                        _0x239094['messageCount'][_0x53a581['chat_id']][_0x53a581['user_id']] = _0x53a581['count'];
                    });
                    const [_0x3b4885] = await _0x3f0b5f['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x3b4885[0x0])
                        _0x239094['isPublic'] = _0x3b4885[0x0]['value'] === 'true';
                    return _0x239094;
                } catch (_0x54cc85) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x54cc85['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0xc88656) {
                try {
                    const _0x25a653 = await this['getConn']();
                    await _0x25a653['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0xc88656['toString']()]);
                } catch (_0x5717bb) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x5717bb['message']);
                }
            },
            async 'setMetadata'(_0x4ae335, _0x2b8176) {
                try {
                    const _0x40d154 = await this['getConn']();
                    await _0x40d154['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x4ae335,
                        _0x2b8176['toString']()
                    ]);
                } catch (_0x239e90) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x239e90['message']);
                }
            },
            async 'getMetadata'(_0x188366) {
                try {
                    const _0x25d67a = await this['getConn']();
                    const [_0x291d9e] = await _0x25d67a['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x188366]);
                    return _0x291d9e[0x0] ? _0x291d9e[0x0]['value'] : null;
                } catch (_0x1d96c0) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x1d96c0['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x584d3d, _0x3810d9) {
                try {
                    const _0x41adfd = await this['getConn']();
                    await _0x41adfd['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x584d3d,
                        _0x3810d9['name'] || '',
                        _0x3810d9['notify'] || '',
                        _0x3810d9['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x71c48c) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x71c48c['message']);
                }
            },
            async 'getContact'(_0x4fe773) {
                try {
                    const _0x5e4485 = await this['getConn']();
                    const [_0x1dec5e] = await _0x5e4485['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x4fe773]);
                    return _0x1dec5e[0x0] || null;
                } catch (_0xc8aeca) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0xc8aeca['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x5b0b71 = await this['getConn']();
                    const [_0x52ecfd] = await _0x5b0b71['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x16d333 = {};
                    _0x52ecfd['forEach'](_0x8a766 => {
                        _0x16d333[_0x8a766['jid']] = {
                            'id': _0x8a766['jid'],
                            'name': _0x8a766['name'],
                            'notify': _0x8a766['notify']
                        };
                    });
                    return _0x16d333;
                } catch (_0x163fec) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x163fec['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x577c9c, _0x42c502) {
                try {
                    const _0xd0c958 = await this['getConn']();
                    await _0xd0c958['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x577c9c,
                        _0x42c502['name'] || '',
                        _0x42c502['conversationTimestamp'] || 0x0,
                        _0x42c502['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x103012) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x103012['message']);
                }
            },
            async 'getChat'(_0x391617) {
                try {
                    const _0x5ab185 = await this['getConn']();
                    const [_0x30c600] = await _0x5ab185['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x391617]);
                    return _0x30c600[0x0] || null;
                } catch (_0x33a5cd) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x33a5cd['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x5a08b2 = await this['getConn']();
                    const [_0x2b0242] = await _0x5a08b2['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x2f81f5 = {};
                    _0x2b0242['forEach'](_0x3c2a5e => {
                        _0x2f81f5[_0x3c2a5e['jid']] = {
                            'id': _0x3c2a5e['jid'],
                            'name': _0x3c2a5e['name'],
                            'conversationTimestamp': _0x3c2a5e['conversation_timestamp'],
                            'unreadCount': _0x3c2a5e['unread_count']
                        };
                    });
                    return _0x2f81f5;
                } catch (_0x58df84) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x58df84['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x58398b) {
                try {
                    const _0x16136c = await this['getConn']();
                    await _0x16136c['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x58398b]);
                } catch (_0x478a6c) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x478a6c['message']);
                }
            },
            async 'saveSetting'(_0xe87322, _0x34ad46, _0x713052) {
                try {
                    const _0x1387c3 = await this['getConn']();
                    await _0x1387c3['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0xe87322,
                        _0x34ad46,
                        JSON['stringify'](_0x713052),
                        Date['now']()
                    ]);
                } catch (_0x3a2ece) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x3a2ece['message']);
                }
            },
            async 'getSetting'(_0x14827f, _0x243dd5) {
                try {
                    const _0x16cc77 = await this['getConn']();
                    const [_0x1d85fc] = await _0x16cc77['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x14827f,
                        _0x243dd5
                    ]);
                    return _0x1d85fc[0x0] ? JSON['parse'](_0x1d85fc[0x0]['value']) : null;
                } catch (_0x3a1acd) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x3a1acd['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x528445) {
                try {
                    const _0x311f9a = await this['getConn']();
                    const [_0x9ac226] = await _0x311f9a['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x528445]);
                    const _0x58e75 = {};
                    _0x9ac226['forEach'](_0x19fc0a => {
                        _0x58e75[_0x19fc0a['key']] = JSON['parse'](_0x19fc0a['value']);
                    });
                    return _0x58e75;
                } catch (_0x438395) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x438395['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x2f92e5 = await this['getConn']();
                    const [_0x5073a5] = await _0x2f92e5['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x5073a5['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x5073a5['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x27518c) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x27518c['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x17221a) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x17221a['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x231264) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x231264['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0xc6ceab['dirname'](SQLITE_URL);
        if (!_0x0_0x20f183['existsSync'](dir))
            _0x0_0x20f183['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x2f880a, _0x15d992, _0x2738b9) {
                try {
                    saveStmt['run'](_0x2f880a, _0x15d992, Date['now'](), compress(_0x2738b9));
                    const {count: _0x5d2509} = countStmt['get'](_0x2f880a);
                    if (_0x5d2509 > MESSAGE_LIMITS['sqlite']) {
                        const _0x33a136 = _0x5d2509 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x2f880a, _0x2f880a, _0x33a136);
                    }
                } catch (_0xe2682e) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0xe2682e['message']);
                }
            },
            'load'(_0x404cd8, _0xbcb596) {
                try {
                    const _0xcede9f = loadStmt['get'](_0x404cd8, _0xbcb596);
                    return _0xcede9f ? decompress(_0xcede9f['data']) : null;
                } catch (_0x3ca92a) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x3ca92a['message']);
                    return null;
                }
            },
            'incrementCount'(_0x42aaa4, _0x3dc0ef) {
                try {
                    incrementCountStmt['run'](_0x42aaa4, _0x3dc0ef);
                } catch (_0x2d2e18) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x2d2e18['message']);
                }
            },
            'getCount'(_0x3129ab, _0xf89558) {
                try {
                    const _0x3bab0d = getCountStmt['get'](_0x3129ab, _0xf89558);
                    return _0x3bab0d ? _0x3bab0d['count'] : 0x0;
                } catch (_0x41ab21) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x41ab21['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x2447e8 = getAllCountsStmt['all']();
                    const _0x5d917f = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2447e8['forEach'](_0xaf7dc2 => {
                        if (!_0x5d917f['messageCount'][_0xaf7dc2['chat_id']]) {
                            _0x5d917f['messageCount'][_0xaf7dc2['chat_id']] = {};
                        }
                        _0x5d917f['messageCount'][_0xaf7dc2['chat_id']][_0xaf7dc2['user_id']] = _0xaf7dc2['count'];
                    });
                    const _0x51d35f = getMetaStmt['get']();
                    if (_0x51d35f)
                        _0x5d917f['isPublic'] = _0x51d35f['value'] === 'true';
                    return _0x5d917f;
                } catch (_0x4de7c9) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x4de7c9['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x328f9a) {
                try {
                    setMetaStmt['run'](_0x328f9a['toString']());
                } catch (_0x3e7782) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x3e7782['message']);
                }
            },
            'setMetadata'(_0x12dcb1, _0x4a5445) {
                try {
                    setMetadataStmt['run'](_0x12dcb1, _0x4a5445['toString']());
                } catch (_0x5af8fe) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x5af8fe['message']);
                }
            },
            'getMetadata'(_0x463155) {
                try {
                    const _0x43f9c8 = getMetadataStmt['get'](_0x463155);
                    return _0x43f9c8 ? _0x43f9c8['value'] : null;
                } catch (_0xe5e696) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0xe5e696['message']);
                    return null;
                }
            },
            'saveContact'(_0x15d913, _0x2faf5b) {
                try {
                    saveContactStmt['run'](_0x15d913, _0x2faf5b['name'] || '', _0x2faf5b['notify'] || '', _0x2faf5b['verifiedName'] || '', Date['now']());
                } catch (_0x26e094) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x26e094['message']);
                }
            },
            'getContact'(_0x3a151e) {
                try {
                    return getContactStmt['get'](_0x3a151e) || null;
                } catch (_0x3b3b60) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x3b3b60['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x2398a6 = getAllContactsStmt['all']();
                    const _0x2b9ace = {};
                    _0x2398a6['forEach'](_0x2e916d => {
                        _0x2b9ace[_0x2e916d['jid']] = {
                            'id': _0x2e916d['jid'],
                            'name': _0x2e916d['name'],
                            'notify': _0x2e916d['notify']
                        };
                    });
                    return _0x2b9ace;
                } catch (_0x1c1db4) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x1c1db4['message']);
                    return {};
                }
            },
            'saveChat'(_0x4bd6f5, _0x55a8cf) {
                try {
                    saveChatStmt['run'](_0x4bd6f5, _0x55a8cf['name'] || '', _0x55a8cf['conversationTimestamp'] || 0x0, _0x55a8cf['unreadCount'] || 0x0, Date['now']());
                } catch (_0x1e4571) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x1e4571['message']);
                }
            },
            'getChat'(_0x465f98) {
                try {
                    return getChatStmt['get'](_0x465f98) || null;
                } catch (_0x2caf39) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x2caf39['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x548f74 = getAllChatsStmt['all']();
                    const _0xad9f85 = {};
                    _0x548f74['forEach'](_0x2bc5a9 => {
                        _0xad9f85[_0x2bc5a9['jid']] = {
                            'id': _0x2bc5a9['jid'],
                            'name': _0x2bc5a9['name'],
                            'conversationTimestamp': _0x2bc5a9['conversation_timestamp'],
                            'unreadCount': _0x2bc5a9['unread_count']
                        };
                    });
                    return _0xad9f85;
                } catch (_0x4977cd) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x4977cd['message']);
                    return {};
                }
            },
            'deleteChat'(_0x5bc0bd) {
                try {
                    deleteChatStmt['run'](_0x5bc0bd);
                } catch (_0x513693) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x513693['message']);
                }
            },
            'saveSetting'(_0x4be49a, _0x30f42f, _0x34296a) {
                try {
                    saveSettingStmt['run'](_0x4be49a, _0x30f42f, JSON['stringify'](_0x34296a), Date['now']());
                } catch (_0x49389e) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x49389e['message']);
                }
            },
            'getSetting'(_0x4716d1, _0x40d867) {
                try {
                    const _0x32f7a0 = getSettingStmt['get'](_0x4716d1, _0x40d867);
                    return _0x32f7a0 ? JSON['parse'](_0x32f7a0['value']) : null;
                } catch (_0x4bff5c) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x4bff5c['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x4a17a5) {
                try {
                    const _0x44c417 = getAllSettingsStmt['all'](_0x4a17a5);
                    const _0x249f66 = {};
                    _0x44c417['forEach'](_0x37fa0a => {
                        _0x249f66[_0x37fa0a['key']] = JSON['parse'](_0x37fa0a['value']);
                    });
                    return _0x249f66;
                } catch (_0x2c6447) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x2c6447['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x3f389d = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x3f389d['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x3f389d['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x317202) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x317202['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x22916d) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x22916d['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x15ea80) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x15ea80['message']);
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
    async 'readFromFile'(_0x469412 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x3928ee = await adapters[backend]['getAllContacts']();
                const _0x3ac891 = await adapters[backend]['getAllChats']();
                const _0x37639d = await this['getBotMode']();
                this['contacts'] = _0x3928ee;
                this['chats'] = _0x3ac891;
                this['botMode'] = _0x37639d;
            } else {
                if (_0x0_0x20f183['existsSync'](_0x469412)) {
                    const _0x107ced = JSON['parse'](_0x0_0x20f183['readFileSync'](_0x469412, 'utf-8'));
                    this['contacts'] = _0x107ced['contacts'] || {};
                    this['chats'] = _0x107ced['chats'] || {};
                    this['botMode'] = _0x107ced['botMode'] || 'private';
                    this['messages'] = _0x107ced['messages'] || {};
                    this['isPublic'] = _0x107ced['isPublic'] !== undefined ? _0x107ced['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x158f3d) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x158f3d['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x2d747b = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x89b1e7 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x20f183['writeFileSync'](_0x2d747b, JSON['stringify'](_0x89b1e7, null, 0x2));
        } catch (_0x825a61) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x825a61['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x20f183['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x5f0b34 = JSON['parse'](_0x0_0x20f183['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x5f0b34['messageCount'] || _0x5f0b34;
                    this['isPublic'] = typeof _0x5f0b34['isPublic'] === 'boolean' ? _0x5f0b34['isPublic'] : ![];
                }
            } catch (_0x271025) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x271025['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x194501 = _0x0_0xc6ceab['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x20f183['existsSync'](_0x194501))
                    _0x0_0x20f183['mkdirSync'](_0x194501, { 'recursive': !![] });
                const _0x3e7507 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x20f183['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x3e7507, null, 0x2));
            } catch (_0x2925b8) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x2925b8['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x5f0f8e => {
                if (typeof this['messages'][_0x5f0f8e] === 'object' && !Array['isArray'](this['messages'][_0x5f0f8e])) {
                    const _0x4955c1 = Object['values'](this['messages'][_0x5f0f8e]);
                    this['messages'][_0x5f0f8e] = _0x4955c1['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x5f0f8e])) {
                    if (this['messages'][_0x5f0f8e]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x5f0f8e] = this['messages'][_0x5f0f8e]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x37879c => {
                if (this['chats'][_0x37879c]['messages']) {
                    delete this['chats'][_0x37879c]['messages'];
                }
            });
        }
    },
    'bind'(_0x4667ec) {
        _0x4667ec['on']('messages.upsert', async ({messages: _0x45a02b}) => {
            for (const _0x4bf594 of _0x45a02b) {
                if (!_0x4bf594['key']?.['remoteJid'])
                    continue;
                const _0x4e9d7a = _0x4bf594['key']['remoteJid'];
                const _0x494651 = slimMessage(_0x4bf594);
                if (backend === 'memory') {
                    this['messages'][_0x4e9d7a] = this['messages'][_0x4e9d7a] || [];
                    this['messages'][_0x4e9d7a]['push'](_0x494651);
                    if (this['messages'][_0x4e9d7a]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x4e9d7a] = this['messages'][_0x4e9d7a]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x4e9d7a, _0x4bf594['key']['id'], _0x494651);
                    } catch (_0x4d9661) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x4bf594['key']['id'] + ':', _0x4d9661['message']);
                    }
                }
            }
        });
        _0x4667ec['on']('contacts.update', async _0xd3235b => {
            for (const _0x3cc594 of _0xd3235b) {
                if (_0x3cc594['id']) {
                    const _0x34a8f7 = {
                        'id': _0x3cc594['id'],
                        'name': _0x3cc594['notify'] || _0x3cc594['name'] || _0x3cc594['verifiedName'] || '',
                        'notify': _0x3cc594['notify'],
                        'verifiedName': _0x3cc594['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x3cc594['id']] = _0x34a8f7;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x3cc594['id'], _0x34a8f7);
                        } catch (_0x5339c5) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x5339c5['message']);
                        }
                    }
                }
            }
        });
        _0x4667ec['on']('contacts.set', async _0x403595 => {
            for (const _0x2b0d58 of _0x403595) {
                if (_0x2b0d58['id']) {
                    const _0xc868dc = {
                        'id': _0x2b0d58['id'],
                        'name': _0x2b0d58['notify'] || _0x2b0d58['name'] || _0x2b0d58['verifiedName'] || '',
                        'notify': _0x2b0d58['notify'],
                        'verifiedName': _0x2b0d58['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x2b0d58['id']] = _0xc868dc;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x2b0d58['id'], _0xc868dc);
                        } catch (_0x5aa6d2) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x5aa6d2['message']);
                        }
                    }
                }
            }
        });
        _0x4667ec['on']('chats.set', async _0x14026a => {
            for (const _0x9679ec of _0x14026a) {
                if (_0x9679ec['id']) {
                    const _0x2f7be1 = {
                        'id': _0x9679ec['id'],
                        'name': _0x9679ec['name'] || _0x9679ec['subject'] || '',
                        'conversationTimestamp': _0x9679ec['conversationTimestamp'],
                        'unreadCount': _0x9679ec['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x9679ec['id']] = _0x2f7be1;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x9679ec['id'], _0x2f7be1);
                        } catch (_0x2845a4) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x2845a4['message']);
                        }
                    }
                }
            }
        });
        _0x4667ec['on']('chats.update', async _0x3499c6 => {
            for (const _0x59da1a of _0x3499c6) {
                if (_0x59da1a['id']) {
                    if (backend === 'memory') {
                        const _0x5c753e = this['chats'][_0x59da1a['id']] || {};
                        this['chats'][_0x59da1a['id']] = {
                            'id': _0x59da1a['id'],
                            'name': _0x59da1a['name'] || _0x59da1a['subject'] || _0x5c753e['name'] || '',
                            'conversationTimestamp': _0x59da1a['conversationTimestamp'] || _0x5c753e['conversationTimestamp'],
                            'unreadCount': _0x59da1a['unreadCount'] !== undefined ? _0x59da1a['unreadCount'] : _0x5c753e['unreadCount']
                        };
                    } else {
                        try {
                            const _0x19f180 = await adapters[backend]['getChat'](_0x59da1a['id']) || {};
                            const _0x13f9a0 = {
                                'id': _0x59da1a['id'],
                                'name': _0x59da1a['name'] || _0x59da1a['subject'] || _0x19f180['name'] || '',
                                'conversationTimestamp': _0x59da1a['conversationTimestamp'] || _0x19f180['conversation_timestamp'],
                                'unreadCount': _0x59da1a['unreadCount'] !== undefined ? _0x59da1a['unreadCount'] : _0x19f180['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x59da1a['id'], _0x13f9a0);
                        } catch (_0x42f638) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x42f638['message']);
                        }
                    }
                }
            }
        });
        _0x4667ec['on']('chats.delete', async _0xe2c989 => {
            for (const _0x43396a of _0xe2c989) {
                if (backend === 'memory') {
                    delete this['chats'][_0x43396a];
                    delete this['messages'][_0x43396a];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x43396a);
                    } catch (_0x5d563c) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x5d563c['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x2c5ece, _0xa0a110) {
        if (backend === 'memory') {
            const _0x19912f = this['messages'][_0x2c5ece]?.['find'](_0x1719d2 => _0x1719d2['key']['id'] === _0xa0a110) || null;
            return _0x19912f;
        } else {
            try {
                return await adapters[backend]['load'](_0x2c5ece, _0xa0a110);
            } catch (_0x3c937b) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0xa0a110 + ':', _0x3c937b['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x1e8872, _0x23cf1f, _0x4df171) {
        if (backend === 'memory') {
            const _0x3bd681 = './data';
            if (!_0x0_0x20f183['existsSync'](_0x3bd681))
                _0x0_0x20f183['mkdirSync'](_0x3bd681, { 'recursive': !![] });
            const _0x308b23 = _0x0_0xc6ceab['join'](_0x3bd681, _0x23cf1f + '.json');
            try {
                _0x0_0x20f183['writeFileSync'](_0x308b23, JSON['stringify'](_0x4df171, null, 0x2));
            } catch (_0x29b0df) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x23cf1f + ':', _0x29b0df['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x1e8872, _0x23cf1f, _0x4df171);
            } catch (_0x169520) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x23cf1f + ':', _0x169520['message']);
            }
        }
    },
    async 'getSetting'(_0x2deb73, _0x4bac3e) {
        if (backend === 'memory') {
            const _0xc9e5b6 = './data';
            const _0x2c2b71 = _0x0_0xc6ceab['join'](_0xc9e5b6, _0x4bac3e + '.json');
            try {
                if (_0x0_0x20f183['existsSync'](_0x2c2b71)) {
                    const _0x332c73 = JSON['parse'](_0x0_0x20f183['readFileSync'](_0x2c2b71, 'utf-8'));
                    if (_0x332c73['enabled'] !== undefined)
                        return _0x332c73;
                    if (_0x332c73[_0x2deb73] !== undefined)
                        return _0x332c73[_0x2deb73];
                    return null;
                }
                return null;
            } catch (_0xbaee50) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x4bac3e + ':', _0xbaee50['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x2deb73, _0x4bac3e);
            } catch (_0x392046) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x4bac3e + ':', _0x392046['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x284a97) {
        if (backend === 'memory') {
            const _0x529765 = './data';
            const _0x361f47 = {};
            try {
                if (_0x0_0x20f183['existsSync'](_0x529765)) {
                    const _0x5676c6 = _0x0_0x20f183['readdirSync'](_0x529765)['filter'](_0x5522e2 => _0x5522e2['endsWith']('.json'));
                    for (const _0x2035d1 of _0x5676c6) {
                        const _0x9913b8 = _0x0_0xc6ceab['basename'](_0x2035d1, '.json');
                        if (_0x9913b8 === 'messageCount' || _0x9913b8 === 'owner')
                            continue;
                        const _0x265b82 = _0x0_0xc6ceab['join'](_0x529765, _0x2035d1);
                        const _0x324cca = JSON['parse'](_0x0_0x20f183['readFileSync'](_0x265b82, 'utf-8'));
                        if (_0x324cca[_0x284a97]) {
                            _0x361f47[_0x9913b8] = _0x324cca[_0x284a97];
                        }
                    }
                }
                return _0x361f47;
            } catch (_0x11a623) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x11a623['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x284a97);
            } catch (_0x1e7c37) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x1e7c37['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0xecc3f8) {
        const _0x5ecd01 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x5ecd01['includes'](_0xecc3f8)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0xecc3f8 + ',\x20defaulting\x20to\x20private');
            _0xecc3f8 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0xecc3f8;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0xecc3f8);
            } catch (_0x34875f) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x34875f['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x1f3dfa = await adapters[backend]['getMetadata']('botMode');
                return _0x1f3dfa || 'private';
            } catch (_0x2b47fb) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x2b47fb['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x461965, _0x47d274, _0x75b0f6) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x461965]) {
                this['messageCount'][_0x461965] = {};
            }
            if (!this['messageCount'][_0x461965][_0x47d274]) {
                this['messageCount'][_0x461965][_0x47d274] = 0x0;
            }
            this['messageCount'][_0x461965][_0x47d274]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x461965, _0x47d274);
            } catch (_0x2962a5) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x47d274 + ':', _0x2962a5['message']);
            }
        }
    },
    async 'getMessageCount'(_0x56eda2, _0x3e4e55) {
        if (backend === 'memory') {
            return this['messageCount'][_0x56eda2]?.[_0x3e4e55] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x56eda2, _0x3e4e55);
            } catch (_0x595339) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x3e4e55 + ':', _0x595339['message']);
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
            } catch (_0xe79170) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0xe79170['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x503f14) {
        if (backend === 'memory') {
            this['isPublic'] = _0x503f14;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x503f14);
            } catch (_0x5aef29) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x5aef29['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x1cdea6 = await adapters[backend]['getAllCounts']();
                return _0x1cdea6['isPublic'];
            } catch (_0x158ce9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x158ce9['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x16df9c) {
        const _0x39546a = [
            'public',
            'private'
        ];
        if (!_0x39546a['includes'](_0x16df9c)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x16df9c);
            _0x16df9c = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x16df9c;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x16df9c);
            } catch (_0x1b795d) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x1b795d['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x1527b8 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x1527b8 || 'private';
            } catch (_0x5f1e9a) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x5f1e9a['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x15549e = 0x0;
        const _0x397ec4 = Object['keys'](this['contacts'])['length'];
        const _0x343f94 = Object['keys'](this['chats'])['length'];
        let _0x48c0e6 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x4faf27 => {
                if (Array['isArray'](_0x4faf27)) {
                    _0x15549e += _0x4faf27['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x5645b2 => {
                if (typeof _0x5645b2 === 'object') {
                    _0x48c0e6 += Object['keys'](_0x5645b2)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x15549e : 'stored\x20in\x20database',
            'contacts': _0x397ec4,
            'chats': _0x343f94,
            'messageCounts': backend === 'memory' ? _0x48c0e6 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0xa9b70b => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0xa9b70b));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x5a08fa => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x5a08fa));
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
        let _0x9b4514 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x1fd218 => {
            if (store['chats'][_0x1fd218]['messages']) {
                delete store['chats'][_0x1fd218]['messages'];
                _0x9b4514++;
            }
        });
        if (_0x9b4514 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x9b4514 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x4e157e => {
    console['log']('[STORE]\x20Received\x20' + _0x4e157e + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x468a43) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x468a43['message']);
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
process['on']('uncaughtException', _0x2028d1 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x2028d1);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x461f3e, _0x3b0e39) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x3b0e39, 'reason:', _0x461f3e);
});
export default store;