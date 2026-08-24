import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x535adf from 'fs';
import _0x0_0x26519f from 'path';
import _0x0_0x3acdb1 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x88ed76) {
    printLog = (_0x1885e4, _0x1b415e) => console['log']('[' + _0x1885e4['toUpperCase']() + ']\x20' + _0x1b415e);
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
} catch (_0x0_0x36f138) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x5a75f4 => {
    try {
        return _0x0_0x3acdb1['deflateSync'](JSON['stringify'](_0x5a75f4));
    } catch (_0x39f011) {
        console['error']('[STORE]\x20Compression\x20error:', _0x39f011['message']);
        return Buffer['from'](JSON['stringify'](_0x5a75f4));
    }
};
const decompress = _0x134e47 => {
    try {
        return JSON['parse'](_0x0_0x3acdb1['inflateSync'](_0x134e47));
    } catch (_0x6216ca) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x6216ca['message']);
        try {
            return JSON['parse'](_0x134e47['toString']());
        } catch (_0x176e31) {
            return null;
        }
    }
};
function slimMessage(_0x5c0f7c) {
    return {
        'key': _0x5c0f7c['key'],
        'message': _0x5c0f7c['message'],
        'messageTimestamp': _0x5c0f7c['messageTimestamp'],
        'participant': _0x5c0f7c['participant'],
        'pushName': _0x5c0f7c['pushName'],
        'broadcast': _0x5c0f7c['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x24b13c => console['error']('[MONGO]\x20Connection\x20error:', _0x24b13c));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x263ffc, _0x1b6904, _0x5a13f6) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x263ffc,
                        'id': _0x1b6904
                    }, {
                        'data': compress(_0x5a13f6),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x1523e6) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x1523e6['message']);
                }
            },
            async 'load'(_0x397c4d, _0xa69dd1) {
                try {
                    const _0x3f3534 = await Msg['findOne']({
                        'jid': _0x397c4d,
                        'id': _0xa69dd1
                    });
                    return _0x3f3534 ? decompress(_0x3f3534['data']) : null;
                } catch (_0x53e724) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x53e724['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x14f4c7, _0x63221b) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x14f4c7,
                        'userId': _0x63221b
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x5a7905) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x5a7905['message']);
                }
            },
            async 'getCount'(_0x5a6f9c, _0x6e4eb9) {
                try {
                    const _0x22f671 = await MsgCount['findOne']({
                        'chatId': _0x5a6f9c,
                        'userId': _0x6e4eb9
                    });
                    return _0x22f671 ? _0x22f671['count'] : 0x0;
                } catch (_0xe10748) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0xe10748['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x1924ed = await MsgCount['find']({});
                    const _0x4e0189 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x1924ed['forEach'](_0x288d14 => {
                        if (!_0x4e0189['messageCount'][_0x288d14['chatId']]) {
                            _0x4e0189['messageCount'][_0x288d14['chatId']] = {};
                        }
                        _0x4e0189['messageCount'][_0x288d14['chatId']][_0x288d14['userId']] = _0x288d14['count'];
                    });
                    const _0x4588e4 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x4588e4)
                        _0x4e0189['isPublic'] = _0x4588e4['value'] === 'true';
                    return _0x4e0189;
                } catch (_0x46e0ae) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x46e0ae['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x5a3c48) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x5a3c48['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x316d3b) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x316d3b['message']);
                }
            },
            async 'setMetadata'(_0x30bd88, _0x2b5396) {
                try {
                    await Meta['updateOne']({ 'key': _0x30bd88 }, {
                        'key': _0x30bd88,
                        'value': _0x2b5396['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x42be77) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x42be77['message']);
                }
            },
            async 'getMetadata'(_0x534bad) {
                try {
                    const _0x3a1fcc = await Meta['findOne']({ 'key': _0x534bad });
                    return _0x3a1fcc ? _0x3a1fcc['value'] : null;
                } catch (_0x26f05d) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x26f05d['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x5d8d5f, _0x37abed) {
                try {
                    await Contact['updateOne']({ 'jid': _0x5d8d5f }, {
                        ..._0x37abed,
                        'jid': _0x5d8d5f,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0xb8fa14) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0xb8fa14['message']);
                }
            },
            async 'getContact'(_0x15996c) {
                try {
                    return await Contact['findOne']({ 'jid': _0x15996c });
                } catch (_0x2a570c) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x2a570c['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x5a906b = await Contact['find']({});
                    const _0x2ecb0b = {};
                    _0x5a906b['forEach'](_0x3af5f4 => {
                        _0x2ecb0b[_0x3af5f4['jid']] = {
                            'id': _0x3af5f4['jid'],
                            'name': _0x3af5f4['name'],
                            'notify': _0x3af5f4['notify']
                        };
                    });
                    return _0x2ecb0b;
                } catch (_0x54ec2f) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x54ec2f['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x5d5a1d, _0x1cf985) {
                try {
                    await Chat['updateOne']({ 'jid': _0x5d5a1d }, {
                        ..._0x1cf985,
                        'jid': _0x5d5a1d,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x38b9d0) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x38b9d0['message']);
                }
            },
            async 'getChat'(_0x31d62b) {
                try {
                    return await Chat['findOne']({ 'jid': _0x31d62b });
                } catch (_0x4f6de3) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x4f6de3['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0xb1bf12 = await Chat['find']({});
                    const _0x3a20c5 = {};
                    _0xb1bf12['forEach'](_0x114abf => {
                        _0x3a20c5[_0x114abf['jid']] = {
                            'id': _0x114abf['jid'],
                            'name': _0x114abf['name'],
                            'conversationTimestamp': _0x114abf['conversationTimestamp'],
                            'unreadCount': _0x114abf['unreadCount']
                        };
                    });
                    return _0x3a20c5;
                } catch (_0x1e26af) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x1e26af['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x420192) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x420192 });
                } catch (_0x120ca1) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x120ca1['message']);
                }
            },
            async 'saveSetting'(_0x4dfc71, _0x49ea27, _0x17ac65) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x4dfc71,
                        'key': _0x49ea27
                    }, {
                        'chatId': _0x4dfc71,
                        'key': _0x49ea27,
                        'value': _0x17ac65,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x2225d8) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x2225d8['message']);
                }
            },
            async 'getSetting'(_0x2adbad, _0x395330) {
                try {
                    const _0x2657fa = await Setting['findOne']({
                        'chatId': _0x2adbad,
                        'key': _0x395330
                    });
                    return _0x2657fa ? _0x2657fa['value'] : null;
                } catch (_0x41df64) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x41df64['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x460dfc) {
                try {
                    const _0x5ebf09 = await Setting['find']({ 'chatId': _0x460dfc });
                    const _0x1970bb = {};
                    _0x5ebf09['forEach'](_0x5b9529 => {
                        _0x1970bb[_0x5b9529['key']] = _0x5b9529['value'];
                    });
                    return _0x1970bb;
                } catch (_0x491872) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x491872['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x420318 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x420318['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x420318['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x1aa242) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x1aa242['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x5dd962) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x5dd962['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x1206ce) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x1206ce['message']);
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
        pool['on']('error', _0x549c0a => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x549c0a['message']);
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
                        const _0x4f6fde = await pool['connect']();
                        try {
                            await _0x4f6fde['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f6fde['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x4f6fde['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x4f6fde['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f6fde['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f6fde['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f6fde['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x4f6fde['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x4f6fde['release']();
                        }
                    } catch (_0x14bffc) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x14bffc['message']);
                        this['initPromise'] = null;
                        throw _0x14bffc;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x52a965, _0x5f5c8f, _0x569246) {
                try {
                    await this['init']();
                    const _0x2bb2aa = await pool['connect']();
                    try {
                        await _0x2bb2aa['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x52a965,
                            _0x5f5c8f,
                            Date['now'](),
                            compress(_0x569246)
                        ]);
                    } finally {
                        _0x2bb2aa['release']();
                    }
                } catch (_0x5f493c) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x5f493c['message']);
                }
            },
            async 'load'(_0x10445e, _0x2b041b) {
                try {
                    await this['init']();
                    const _0xc82886 = await pool['connect']();
                    try {
                        const _0x1dff95 = await _0xc82886['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x10445e,
                            _0x2b041b
                        ]);
                        return _0x1dff95['rows'][0x0] ? decompress(_0x1dff95['rows'][0x0]['data']) : null;
                    } finally {
                        _0xc82886['release']();
                    }
                } catch (_0xb8f152) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0xb8f152['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x513829, _0x54429e) {
                try {
                    await this['init']();
                    const _0x1eb759 = await pool['connect']();
                    try {
                        await _0x1eb759['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x513829,
                            _0x54429e
                        ]);
                    } finally {
                        _0x1eb759['release']();
                    }
                } catch (_0x48f6e1) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x48f6e1['message']);
                }
            },
            async 'getCount'(_0xc05941, _0x503b3e) {
                try {
                    await this['init']();
                    const _0x1a829b = await pool['connect']();
                    try {
                        const _0x108853 = await _0x1a829b['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0xc05941,
                            _0x503b3e
                        ]);
                        return _0x108853['rows'][0x0] ? _0x108853['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x1a829b['release']();
                    }
                } catch (_0xf51ecc) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0xf51ecc['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x59f212 = await pool['connect']();
                    try {
                        const _0x321263 = await _0x59f212['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x3639fd = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x321263['rows']['forEach'](_0x51dc41 => {
                            if (!_0x3639fd['messageCount'][_0x51dc41['chat_id']]) {
                                _0x3639fd['messageCount'][_0x51dc41['chat_id']] = {};
                            }
                            _0x3639fd['messageCount'][_0x51dc41['chat_id']][_0x51dc41['user_id']] = _0x51dc41['count'];
                        });
                        const _0x1b8b8f = await _0x59f212['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x1b8b8f['rows'][0x0])
                            _0x3639fd['isPublic'] = _0x1b8b8f['rows'][0x0]['value'] === 'true';
                        return _0x3639fd;
                    } finally {
                        _0x59f212['release']();
                    }
                } catch (_0x4551a1) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x4551a1['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x1d55ef) {
                try {
                    await this['init']();
                    const _0x27d100 = await pool['connect']();
                    try {
                        await _0x27d100['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x1d55ef['toString']()]);
                    } finally {
                        _0x27d100['release']();
                    }
                } catch (_0xd5a398) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0xd5a398['message']);
                }
            },
            async 'setMetadata'(_0x650f7a, _0x553634) {
                try {
                    await this['init']();
                    const _0x28fc70 = await pool['connect']();
                    try {
                        await _0x28fc70['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x650f7a,
                            _0x553634['toString']()
                        ]);
                    } finally {
                        _0x28fc70['release']();
                    }
                } catch (_0x1aa61d) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x1aa61d['message']);
                }
            },
            async 'getMetadata'(_0x1e11dd) {
                try {
                    await this['init']();
                    const _0x57fd18 = await pool['connect']();
                    try {
                        const _0x1784f = await _0x57fd18['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x1e11dd]);
                        return _0x1784f['rows'][0x0] ? _0x1784f['rows'][0x0]['value'] : null;
                    } finally {
                        _0x57fd18['release']();
                    }
                } catch (_0x2309a6) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x2309a6['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x24cfab, _0x370e57) {
                try {
                    await this['init']();
                    const _0x33f8d2 = await pool['connect']();
                    try {
                        await _0x33f8d2['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x24cfab,
                            _0x370e57['name'] || '',
                            _0x370e57['notify'] || '',
                            _0x370e57['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x33f8d2['release']();
                    }
                } catch (_0x146805) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x146805['message']);
                }
            },
            async 'getContact'(_0x3f0caa) {
                try {
                    await this['init']();
                    const _0x127c39 = await pool['connect']();
                    try {
                        const _0x7456b4 = await _0x127c39['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x3f0caa]);
                        return _0x7456b4['rows'][0x0] || null;
                    } finally {
                        _0x127c39['release']();
                    }
                } catch (_0x5153ab) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x5153ab['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x4510f6 = await pool['connect']();
                    try {
                        const _0x326292 = await _0x4510f6['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0xc58f42 = {};
                        _0x326292['rows']['forEach'](_0x4a893e => {
                            _0xc58f42[_0x4a893e['jid']] = {
                                'id': _0x4a893e['jid'],
                                'name': _0x4a893e['name'],
                                'notify': _0x4a893e['notify']
                            };
                        });
                        return _0xc58f42;
                    } finally {
                        _0x4510f6['release']();
                    }
                } catch (_0x193fa7) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x193fa7['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x4124e2, _0x4668ff) {
                try {
                    await this['init']();
                    const _0x3cdc46 = await pool['connect']();
                    try {
                        await _0x3cdc46['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x4124e2,
                            _0x4668ff['name'] || '',
                            _0x4668ff['conversationTimestamp'] || 0x0,
                            _0x4668ff['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x3cdc46['release']();
                    }
                } catch (_0x30262d) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x30262d['message']);
                }
            },
            async 'getChat'(_0x233c4a) {
                try {
                    await this['init']();
                    const _0x16b1b1 = await pool['connect']();
                    try {
                        const _0x44bdda = await _0x16b1b1['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x233c4a]);
                        return _0x44bdda['rows'][0x0] || null;
                    } finally {
                        _0x16b1b1['release']();
                    }
                } catch (_0x2aa076) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x2aa076['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x406f7c = await pool['connect']();
                    try {
                        const _0xfd5bac = await _0x406f7c['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x5be34c = {};
                        _0xfd5bac['rows']['forEach'](_0xa50d63 => {
                            _0x5be34c[_0xa50d63['jid']] = {
                                'id': _0xa50d63['jid'],
                                'name': _0xa50d63['name'],
                                'conversationTimestamp': _0xa50d63['conversation_timestamp'],
                                'unreadCount': _0xa50d63['unread_count']
                            };
                        });
                        return _0x5be34c;
                    } finally {
                        _0x406f7c['release']();
                    }
                } catch (_0xeca4c2) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0xeca4c2['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x22100f) {
                try {
                    await this['init']();
                    const _0x5ada64 = await pool['connect']();
                    try {
                        await _0x5ada64['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x22100f]);
                    } finally {
                        _0x5ada64['release']();
                    }
                } catch (_0x21bc68) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x21bc68['message']);
                }
            },
            async 'saveSetting'(_0x178950, _0x1b590a, _0x3c847f) {
                try {
                    await this['init']();
                    const _0x44aad3 = await pool['connect']();
                    try {
                        await _0x44aad3['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x178950,
                            _0x1b590a,
                            JSON['stringify'](_0x3c847f),
                            Date['now']()
                        ]);
                    } finally {
                        _0x44aad3['release']();
                    }
                } catch (_0x531295) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x531295['message']);
                }
            },
            async 'getSetting'(_0x29b63f, _0x30659) {
                try {
                    await this['init']();
                    const _0x3337cd = await pool['connect']();
                    try {
                        const _0x35a144 = await _0x3337cd['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x29b63f,
                            _0x30659
                        ]);
                        return _0x35a144['rows'][0x0] ? JSON['parse'](_0x35a144['rows'][0x0]['value']) : null;
                    } finally {
                        _0x3337cd['release']();
                    }
                } catch (_0xf1df04) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0xf1df04['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x1be8b1) {
                try {
                    await this['init']();
                    const _0x21046f = await pool['connect']();
                    try {
                        const _0x58acf1 = await _0x21046f['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x1be8b1]);
                        const _0x2ae56e = {};
                        _0x58acf1['rows']['forEach'](_0x2a5eb7 => {
                            _0x2ae56e[_0x2a5eb7['key']] = JSON['parse'](_0x2a5eb7['value']);
                        });
                        return _0x2ae56e;
                    } finally {
                        _0x21046f['release']();
                    }
                } catch (_0x79cb98) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x79cb98['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x3638eb = await pool['connect']();
                    try {
                        const _0x16a61d = await _0x3638eb['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x16a61d['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x16a61d['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x3638eb['release']();
                    }
                } catch (_0x25c58a) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x25c58a['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x173573) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x173573['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x1cb860) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x1cb860['message']);
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
                    } catch (_0x2a9194) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x2a9194['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x2a9194;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x14a034, _0x3e3a5f, _0x3f506e) {
                try {
                    const _0xb8bcbf = await this['getConn']();
                    await _0xb8bcbf['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x14a034,
                        _0x3e3a5f,
                        Date['now'](),
                        compress(_0x3f506e)
                    ]);
                } catch (_0x56edc3) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x56edc3['message']);
                }
            },
            async 'load'(_0x231267, _0x1e1245) {
                try {
                    const _0x6e4d31 = await this['getConn']();
                    const [_0x47deb7] = await _0x6e4d31['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x231267,
                        _0x1e1245
                    ]);
                    return _0x47deb7[0x0] ? decompress(_0x47deb7[0x0]['data']) : null;
                } catch (_0x548789) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x548789['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x54f716, _0x219664) {
                try {
                    const _0x4acaf5 = await this['getConn']();
                    await _0x4acaf5['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x54f716,
                        _0x219664
                    ]);
                } catch (_0x444a57) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x444a57['message']);
                }
            },
            async 'getCount'(_0xce5ade, _0x2e1f7d) {
                try {
                    const _0x1d7821 = await this['getConn']();
                    const [_0x1aab75] = await _0x1d7821['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0xce5ade,
                        _0x2e1f7d
                    ]);
                    return _0x1aab75[0x0] ? _0x1aab75[0x0]['count'] : 0x0;
                } catch (_0x13f061) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x13f061['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x4f40cb = await this['getConn']();
                    const [_0x3b7c3b] = await _0x4f40cb['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x49b9e8 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3b7c3b['forEach'](_0x1e37f2 => {
                        if (!_0x49b9e8['messageCount'][_0x1e37f2['chat_id']]) {
                            _0x49b9e8['messageCount'][_0x1e37f2['chat_id']] = {};
                        }
                        _0x49b9e8['messageCount'][_0x1e37f2['chat_id']][_0x1e37f2['user_id']] = _0x1e37f2['count'];
                    });
                    const [_0x206076] = await _0x4f40cb['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x206076[0x0])
                        _0x49b9e8['isPublic'] = _0x206076[0x0]['value'] === 'true';
                    return _0x49b9e8;
                } catch (_0x411b21) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x411b21['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x8facc2) {
                try {
                    const _0x372554 = await this['getConn']();
                    await _0x372554['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x8facc2['toString']()]);
                } catch (_0x303244) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x303244['message']);
                }
            },
            async 'setMetadata'(_0x28181b, _0x2c7548) {
                try {
                    const _0x381d20 = await this['getConn']();
                    await _0x381d20['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x28181b,
                        _0x2c7548['toString']()
                    ]);
                } catch (_0x2ff24a) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x2ff24a['message']);
                }
            },
            async 'getMetadata'(_0x461731) {
                try {
                    const _0x11d620 = await this['getConn']();
                    const [_0xf16f6e] = await _0x11d620['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x461731]);
                    return _0xf16f6e[0x0] ? _0xf16f6e[0x0]['value'] : null;
                } catch (_0x10e86b) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x10e86b['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x5f1bc3, _0x35988c) {
                try {
                    const _0x48996f = await this['getConn']();
                    await _0x48996f['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x5f1bc3,
                        _0x35988c['name'] || '',
                        _0x35988c['notify'] || '',
                        _0x35988c['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x421f7b) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x421f7b['message']);
                }
            },
            async 'getContact'(_0x589904) {
                try {
                    const _0x1de680 = await this['getConn']();
                    const [_0x34f16f] = await _0x1de680['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x589904]);
                    return _0x34f16f[0x0] || null;
                } catch (_0x13cecc) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x13cecc['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x264f8d = await this['getConn']();
                    const [_0x52a3ec] = await _0x264f8d['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x3f0ef6 = {};
                    _0x52a3ec['forEach'](_0x541812 => {
                        _0x3f0ef6[_0x541812['jid']] = {
                            'id': _0x541812['jid'],
                            'name': _0x541812['name'],
                            'notify': _0x541812['notify']
                        };
                    });
                    return _0x3f0ef6;
                } catch (_0x4057e7) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x4057e7['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x545fea, _0x6ecfaa) {
                try {
                    const _0x3f3b5a = await this['getConn']();
                    await _0x3f3b5a['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x545fea,
                        _0x6ecfaa['name'] || '',
                        _0x6ecfaa['conversationTimestamp'] || 0x0,
                        _0x6ecfaa['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x274e0c) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x274e0c['message']);
                }
            },
            async 'getChat'(_0x37a7c0) {
                try {
                    const _0x528bcd = await this['getConn']();
                    const [_0x4d6898] = await _0x528bcd['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x37a7c0]);
                    return _0x4d6898[0x0] || null;
                } catch (_0x4c744b) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x4c744b['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x183350 = await this['getConn']();
                    const [_0x6b39a9] = await _0x183350['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x4b8521 = {};
                    _0x6b39a9['forEach'](_0x2445a4 => {
                        _0x4b8521[_0x2445a4['jid']] = {
                            'id': _0x2445a4['jid'],
                            'name': _0x2445a4['name'],
                            'conversationTimestamp': _0x2445a4['conversation_timestamp'],
                            'unreadCount': _0x2445a4['unread_count']
                        };
                    });
                    return _0x4b8521;
                } catch (_0x11be73) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x11be73['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x4cc295) {
                try {
                    const _0x456770 = await this['getConn']();
                    await _0x456770['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x4cc295]);
                } catch (_0x27cde7) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x27cde7['message']);
                }
            },
            async 'saveSetting'(_0x33bdc3, _0x1f9d69, _0xbb472b) {
                try {
                    const _0x79292a = await this['getConn']();
                    await _0x79292a['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x33bdc3,
                        _0x1f9d69,
                        JSON['stringify'](_0xbb472b),
                        Date['now']()
                    ]);
                } catch (_0x5ef117) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x5ef117['message']);
                }
            },
            async 'getSetting'(_0x423d7b, _0x32fcb1) {
                try {
                    const _0x3b9d6c = await this['getConn']();
                    const [_0x16056c] = await _0x3b9d6c['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x423d7b,
                        _0x32fcb1
                    ]);
                    return _0x16056c[0x0] ? JSON['parse'](_0x16056c[0x0]['value']) : null;
                } catch (_0xd92324) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0xd92324['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x14151c) {
                try {
                    const _0x318931 = await this['getConn']();
                    const [_0x1ad7f7] = await _0x318931['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x14151c]);
                    const _0x26f0d5 = {};
                    _0x1ad7f7['forEach'](_0x2b3ccf => {
                        _0x26f0d5[_0x2b3ccf['key']] = JSON['parse'](_0x2b3ccf['value']);
                    });
                    return _0x26f0d5;
                } catch (_0x2275f8) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x2275f8['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x4baf8a = await this['getConn']();
                    const [_0x509b62] = await _0x4baf8a['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x509b62['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x509b62['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x508103) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x508103['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0xc4b92a) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0xc4b92a['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x317ac2) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x317ac2['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x26519f['dirname'](SQLITE_URL);
        if (!_0x0_0x535adf['existsSync'](dir))
            _0x0_0x535adf['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x3c90a5, _0x1ec2e4, _0x3eb033) {
                try {
                    saveStmt['run'](_0x3c90a5, _0x1ec2e4, Date['now'](), compress(_0x3eb033));
                    const {count: _0x27d9a2} = countStmt['get'](_0x3c90a5);
                    if (_0x27d9a2 > MESSAGE_LIMITS['sqlite']) {
                        const _0xed704 = _0x27d9a2 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x3c90a5, _0x3c90a5, _0xed704);
                    }
                } catch (_0x215d63) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x215d63['message']);
                }
            },
            'load'(_0x374503, _0x48ea87) {
                try {
                    const _0x24075f = loadStmt['get'](_0x374503, _0x48ea87);
                    return _0x24075f ? decompress(_0x24075f['data']) : null;
                } catch (_0x3503b7) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x3503b7['message']);
                    return null;
                }
            },
            'incrementCount'(_0x4e1326, _0x41c78b) {
                try {
                    incrementCountStmt['run'](_0x4e1326, _0x41c78b);
                } catch (_0x5eaf99) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x5eaf99['message']);
                }
            },
            'getCount'(_0x138134, _0x106e49) {
                try {
                    const _0x1d7e0b = getCountStmt['get'](_0x138134, _0x106e49);
                    return _0x1d7e0b ? _0x1d7e0b['count'] : 0x0;
                } catch (_0xdf0fe8) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0xdf0fe8['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x446642 = getAllCountsStmt['all']();
                    const _0x2ceab4 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x446642['forEach'](_0x5a54a5 => {
                        if (!_0x2ceab4['messageCount'][_0x5a54a5['chat_id']]) {
                            _0x2ceab4['messageCount'][_0x5a54a5['chat_id']] = {};
                        }
                        _0x2ceab4['messageCount'][_0x5a54a5['chat_id']][_0x5a54a5['user_id']] = _0x5a54a5['count'];
                    });
                    const _0x536e42 = getMetaStmt['get']();
                    if (_0x536e42)
                        _0x2ceab4['isPublic'] = _0x536e42['value'] === 'true';
                    return _0x2ceab4;
                } catch (_0x2a6169) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x2a6169['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x752142) {
                try {
                    setMetaStmt['run'](_0x752142['toString']());
                } catch (_0x3172c4) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x3172c4['message']);
                }
            },
            'setMetadata'(_0x356adc, _0x4aec8d) {
                try {
                    setMetadataStmt['run'](_0x356adc, _0x4aec8d['toString']());
                } catch (_0x5e4a07) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x5e4a07['message']);
                }
            },
            'getMetadata'(_0x345858) {
                try {
                    const _0x12e36c = getMetadataStmt['get'](_0x345858);
                    return _0x12e36c ? _0x12e36c['value'] : null;
                } catch (_0x48a73d) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x48a73d['message']);
                    return null;
                }
            },
            'saveContact'(_0x581ed6, _0x28c88d) {
                try {
                    saveContactStmt['run'](_0x581ed6, _0x28c88d['name'] || '', _0x28c88d['notify'] || '', _0x28c88d['verifiedName'] || '', Date['now']());
                } catch (_0x162f6c) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x162f6c['message']);
                }
            },
            'getContact'(_0x413201) {
                try {
                    return getContactStmt['get'](_0x413201) || null;
                } catch (_0x259f35) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x259f35['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x1554bd = getAllContactsStmt['all']();
                    const _0x4436ff = {};
                    _0x1554bd['forEach'](_0x2fe76c => {
                        _0x4436ff[_0x2fe76c['jid']] = {
                            'id': _0x2fe76c['jid'],
                            'name': _0x2fe76c['name'],
                            'notify': _0x2fe76c['notify']
                        };
                    });
                    return _0x4436ff;
                } catch (_0x304d86) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x304d86['message']);
                    return {};
                }
            },
            'saveChat'(_0x1735a2, _0x3e51d7) {
                try {
                    saveChatStmt['run'](_0x1735a2, _0x3e51d7['name'] || '', _0x3e51d7['conversationTimestamp'] || 0x0, _0x3e51d7['unreadCount'] || 0x0, Date['now']());
                } catch (_0x48e554) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x48e554['message']);
                }
            },
            'getChat'(_0x236951) {
                try {
                    return getChatStmt['get'](_0x236951) || null;
                } catch (_0x91daf1) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x91daf1['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0xaca00b = getAllChatsStmt['all']();
                    const _0x13f939 = {};
                    _0xaca00b['forEach'](_0x27c9a2 => {
                        _0x13f939[_0x27c9a2['jid']] = {
                            'id': _0x27c9a2['jid'],
                            'name': _0x27c9a2['name'],
                            'conversationTimestamp': _0x27c9a2['conversation_timestamp'],
                            'unreadCount': _0x27c9a2['unread_count']
                        };
                    });
                    return _0x13f939;
                } catch (_0x132b57) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x132b57['message']);
                    return {};
                }
            },
            'deleteChat'(_0x37f14c) {
                try {
                    deleteChatStmt['run'](_0x37f14c);
                } catch (_0x333cf6) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x333cf6['message']);
                }
            },
            'saveSetting'(_0x55d8eb, _0xb527c0, _0x323321) {
                try {
                    saveSettingStmt['run'](_0x55d8eb, _0xb527c0, JSON['stringify'](_0x323321), Date['now']());
                } catch (_0x9c587f) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x9c587f['message']);
                }
            },
            'getSetting'(_0x2c6c9f, _0x5a4ecd) {
                try {
                    const _0x13f4ac = getSettingStmt['get'](_0x2c6c9f, _0x5a4ecd);
                    return _0x13f4ac ? JSON['parse'](_0x13f4ac['value']) : null;
                } catch (_0x576f24) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x576f24['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x235972) {
                try {
                    const _0x26ad5e = getAllSettingsStmt['all'](_0x235972);
                    const _0x37f55f = {};
                    _0x26ad5e['forEach'](_0x11d920 => {
                        _0x37f55f[_0x11d920['key']] = JSON['parse'](_0x11d920['value']);
                    });
                    return _0x37f55f;
                } catch (_0x255c92) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x255c92['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x8a38c5 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x8a38c5['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x8a38c5['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x5e805e) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x5e805e['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x4c1aac) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x4c1aac['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x478314) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x478314['message']);
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
    async 'readFromFile'(_0x50a8c1 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x3b0634 = await adapters[backend]['getAllContacts']();
                const _0x32e662 = await adapters[backend]['getAllChats']();
                const _0x44de40 = await this['getBotMode']();
                this['contacts'] = _0x3b0634;
                this['chats'] = _0x32e662;
                this['botMode'] = _0x44de40;
            } else {
                if (_0x0_0x535adf['existsSync'](_0x50a8c1)) {
                    const _0x2ea676 = JSON['parse'](_0x0_0x535adf['readFileSync'](_0x50a8c1, 'utf-8'));
                    this['contacts'] = _0x2ea676['contacts'] || {};
                    this['chats'] = _0x2ea676['chats'] || {};
                    this['botMode'] = _0x2ea676['botMode'] || 'private';
                    this['messages'] = _0x2ea676['messages'] || {};
                    this['isPublic'] = _0x2ea676['isPublic'] !== undefined ? _0x2ea676['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x16217e) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x16217e['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x21e24f = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x507e87 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x535adf['writeFileSync'](_0x21e24f, JSON['stringify'](_0x507e87, null, 0x2));
        } catch (_0x18817a) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x18817a['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x535adf['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x392e74 = JSON['parse'](_0x0_0x535adf['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x392e74['messageCount'] || _0x392e74;
                    this['isPublic'] = typeof _0x392e74['isPublic'] === 'boolean' ? _0x392e74['isPublic'] : ![];
                }
            } catch (_0x46f1d3) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x46f1d3['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x5a39f5 = _0x0_0x26519f['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x535adf['existsSync'](_0x5a39f5))
                    _0x0_0x535adf['mkdirSync'](_0x5a39f5, { 'recursive': !![] });
                const _0x27f3a6 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x535adf['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x27f3a6, null, 0x2));
            } catch (_0x385246) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x385246['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x48ed46 => {
                if (typeof this['messages'][_0x48ed46] === 'object' && !Array['isArray'](this['messages'][_0x48ed46])) {
                    const _0x253985 = Object['values'](this['messages'][_0x48ed46]);
                    this['messages'][_0x48ed46] = _0x253985['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x48ed46])) {
                    if (this['messages'][_0x48ed46]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x48ed46] = this['messages'][_0x48ed46]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0xbe3b12 => {
                if (this['chats'][_0xbe3b12]['messages']) {
                    delete this['chats'][_0xbe3b12]['messages'];
                }
            });
        }
    },
    'bind'(_0x52c5ca) {
        _0x52c5ca['on']('messages.upsert', async ({messages: _0x138718}) => {
            for (const _0x378e5f of _0x138718) {
                if (!_0x378e5f['key']?.['remoteJid'])
                    continue;
                const _0xc7b69d = _0x378e5f['key']['remoteJid'];
                const _0x4df49a = slimMessage(_0x378e5f);
                if (backend === 'memory') {
                    this['messages'][_0xc7b69d] = this['messages'][_0xc7b69d] || [];
                    this['messages'][_0xc7b69d]['push'](_0x4df49a);
                    if (this['messages'][_0xc7b69d]['length'] > MAX_MESSAGES) {
                        this['messages'][_0xc7b69d] = this['messages'][_0xc7b69d]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0xc7b69d, _0x378e5f['key']['id'], _0x4df49a);
                    } catch (_0x1856c4) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x378e5f['key']['id'] + ':', _0x1856c4['message']);
                    }
                }
            }
        });
        _0x52c5ca['on']('contacts.update', async _0x319dee => {
            for (const _0xf10fc9 of _0x319dee) {
                if (_0xf10fc9['id']) {
                    const _0x3bb132 = {
                        'id': _0xf10fc9['id'],
                        'name': _0xf10fc9['notify'] || _0xf10fc9['name'] || _0xf10fc9['verifiedName'] || '',
                        'notify': _0xf10fc9['notify'],
                        'verifiedName': _0xf10fc9['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0xf10fc9['id']] = _0x3bb132;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0xf10fc9['id'], _0x3bb132);
                        } catch (_0x3b781e) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x3b781e['message']);
                        }
                    }
                }
            }
        });
        _0x52c5ca['on']('contacts.set', async _0x7a56b1 => {
            for (const _0x5cb5b0 of _0x7a56b1) {
                if (_0x5cb5b0['id']) {
                    const _0x3e0fc0 = {
                        'id': _0x5cb5b0['id'],
                        'name': _0x5cb5b0['notify'] || _0x5cb5b0['name'] || _0x5cb5b0['verifiedName'] || '',
                        'notify': _0x5cb5b0['notify'],
                        'verifiedName': _0x5cb5b0['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x5cb5b0['id']] = _0x3e0fc0;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x5cb5b0['id'], _0x3e0fc0);
                        } catch (_0x3dfe99) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x3dfe99['message']);
                        }
                    }
                }
            }
        });
        _0x52c5ca['on']('chats.set', async _0x157b7c => {
            for (const _0x42ed60 of _0x157b7c) {
                if (_0x42ed60['id']) {
                    const _0x299329 = {
                        'id': _0x42ed60['id'],
                        'name': _0x42ed60['name'] || _0x42ed60['subject'] || '',
                        'conversationTimestamp': _0x42ed60['conversationTimestamp'],
                        'unreadCount': _0x42ed60['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x42ed60['id']] = _0x299329;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x42ed60['id'], _0x299329);
                        } catch (_0x478b08) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x478b08['message']);
                        }
                    }
                }
            }
        });
        _0x52c5ca['on']('chats.update', async _0x47bea1 => {
            for (const _0x11f814 of _0x47bea1) {
                if (_0x11f814['id']) {
                    if (backend === 'memory') {
                        const _0x36da6f = this['chats'][_0x11f814['id']] || {};
                        this['chats'][_0x11f814['id']] = {
                            'id': _0x11f814['id'],
                            'name': _0x11f814['name'] || _0x11f814['subject'] || _0x36da6f['name'] || '',
                            'conversationTimestamp': _0x11f814['conversationTimestamp'] || _0x36da6f['conversationTimestamp'],
                            'unreadCount': _0x11f814['unreadCount'] !== undefined ? _0x11f814['unreadCount'] : _0x36da6f['unreadCount']
                        };
                    } else {
                        try {
                            const _0x584522 = await adapters[backend]['getChat'](_0x11f814['id']) || {};
                            const _0x40bd23 = {
                                'id': _0x11f814['id'],
                                'name': _0x11f814['name'] || _0x11f814['subject'] || _0x584522['name'] || '',
                                'conversationTimestamp': _0x11f814['conversationTimestamp'] || _0x584522['conversation_timestamp'],
                                'unreadCount': _0x11f814['unreadCount'] !== undefined ? _0x11f814['unreadCount'] : _0x584522['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x11f814['id'], _0x40bd23);
                        } catch (_0x11bfed) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x11bfed['message']);
                        }
                    }
                }
            }
        });
        _0x52c5ca['on']('chats.delete', async _0x2b4a5e => {
            for (const _0x4f93ca of _0x2b4a5e) {
                if (backend === 'memory') {
                    delete this['chats'][_0x4f93ca];
                    delete this['messages'][_0x4f93ca];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x4f93ca);
                    } catch (_0x34a172) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x34a172['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0xeaaa39, _0x5d46e3) {
        if (backend === 'memory') {
            const _0xb90551 = this['messages'][_0xeaaa39]?.['find'](_0x136709 => _0x136709['key']['id'] === _0x5d46e3) || null;
            return _0xb90551;
        } else {
            try {
                return await adapters[backend]['load'](_0xeaaa39, _0x5d46e3);
            } catch (_0x488319) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x5d46e3 + ':', _0x488319['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x2b9074, _0x5d0730, _0x979315) {
        if (backend === 'memory') {
            const _0x26ca6d = './data';
            if (!_0x0_0x535adf['existsSync'](_0x26ca6d))
                _0x0_0x535adf['mkdirSync'](_0x26ca6d, { 'recursive': !![] });
            const _0x47af95 = _0x0_0x26519f['join'](_0x26ca6d, _0x5d0730 + '.json');
            try {
                _0x0_0x535adf['writeFileSync'](_0x47af95, JSON['stringify'](_0x979315, null, 0x2));
            } catch (_0x592795) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x5d0730 + ':', _0x592795['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x2b9074, _0x5d0730, _0x979315);
            } catch (_0xa30853) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x5d0730 + ':', _0xa30853['message']);
            }
        }
    },
    async 'getSetting'(_0x4d9d5, _0x302603) {
        if (backend === 'memory') {
            const _0x1d9f68 = './data';
            const _0x4c2a35 = _0x0_0x26519f['join'](_0x1d9f68, _0x302603 + '.json');
            try {
                if (_0x0_0x535adf['existsSync'](_0x4c2a35)) {
                    const _0x429f3a = JSON['parse'](_0x0_0x535adf['readFileSync'](_0x4c2a35, 'utf-8'));
                    if (_0x429f3a['enabled'] !== undefined)
                        return _0x429f3a;
                    if (_0x429f3a[_0x4d9d5] !== undefined)
                        return _0x429f3a[_0x4d9d5];
                    return null;
                }
                return null;
            } catch (_0xb3e163) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x302603 + ':', _0xb3e163['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x4d9d5, _0x302603);
            } catch (_0x2c1e5d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x302603 + ':', _0x2c1e5d['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0xe072ce) {
        if (backend === 'memory') {
            const _0x56e261 = './data';
            const _0x585760 = {};
            try {
                if (_0x0_0x535adf['existsSync'](_0x56e261)) {
                    const _0x2943bf = _0x0_0x535adf['readdirSync'](_0x56e261)['filter'](_0x5c0a51 => _0x5c0a51['endsWith']('.json'));
                    for (const _0x5c033c of _0x2943bf) {
                        const _0x327b80 = _0x0_0x26519f['basename'](_0x5c033c, '.json');
                        if (_0x327b80 === 'messageCount' || _0x327b80 === 'owner')
                            continue;
                        const _0x482e9e = _0x0_0x26519f['join'](_0x56e261, _0x5c033c);
                        const _0x448784 = JSON['parse'](_0x0_0x535adf['readFileSync'](_0x482e9e, 'utf-8'));
                        if (_0x448784[_0xe072ce]) {
                            _0x585760[_0x327b80] = _0x448784[_0xe072ce];
                        }
                    }
                }
                return _0x585760;
            } catch (_0x2d9b04) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x2d9b04['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0xe072ce);
            } catch (_0x40f983) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x40f983['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x1bbae3) {
        const _0x12fc05 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x12fc05['includes'](_0x1bbae3)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x1bbae3 + ',\x20defaulting\x20to\x20private');
            _0x1bbae3 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x1bbae3;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x1bbae3);
            } catch (_0x2f0cb1) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x2f0cb1['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x17c8e4 = await adapters[backend]['getMetadata']('botMode');
                return _0x17c8e4 || 'private';
            } catch (_0x55d07e) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x55d07e['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x574136, _0x4bd90b, _0x15c7d9) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x574136]) {
                this['messageCount'][_0x574136] = {};
            }
            if (!this['messageCount'][_0x574136][_0x4bd90b]) {
                this['messageCount'][_0x574136][_0x4bd90b] = 0x0;
            }
            this['messageCount'][_0x574136][_0x4bd90b]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x574136, _0x4bd90b);
            } catch (_0x1b30e9) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x4bd90b + ':', _0x1b30e9['message']);
            }
        }
    },
    async 'getMessageCount'(_0x5623a2, _0xbcd3d2) {
        if (backend === 'memory') {
            return this['messageCount'][_0x5623a2]?.[_0xbcd3d2] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x5623a2, _0xbcd3d2);
            } catch (_0x13e05c) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0xbcd3d2 + ':', _0x13e05c['message']);
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
            } catch (_0x2dfbd5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x2dfbd5['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x76cf75) {
        if (backend === 'memory') {
            this['isPublic'] = _0x76cf75;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x76cf75);
            } catch (_0x77a923) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x77a923['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x46a9a2 = await adapters[backend]['getAllCounts']();
                return _0x46a9a2['isPublic'];
            } catch (_0x46fa7e) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x46fa7e['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0xe0109d) {
        const _0x6ca0dc = [
            'public',
            'private'
        ];
        if (!_0x6ca0dc['includes'](_0xe0109d)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0xe0109d);
            _0xe0109d = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0xe0109d;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0xe0109d);
            } catch (_0x51e41c) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x51e41c['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x4bd326 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x4bd326 || 'private';
            } catch (_0x33de52) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x33de52['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x2284aa = 0x0;
        const _0x3d8485 = Object['keys'](this['contacts'])['length'];
        const _0x14b7ee = Object['keys'](this['chats'])['length'];
        let _0x3e2ebe = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x31dac6 => {
                if (Array['isArray'](_0x31dac6)) {
                    _0x2284aa += _0x31dac6['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x592f12 => {
                if (typeof _0x592f12 === 'object') {
                    _0x3e2ebe += Object['keys'](_0x592f12)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x2284aa : 'stored\x20in\x20database',
            'contacts': _0x3d8485,
            'chats': _0x14b7ee,
            'messageCounts': backend === 'memory' ? _0x3e2ebe : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x4d2c65 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x4d2c65));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x38d475 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x38d475));
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
        let _0x2afae2 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0xad7997 => {
            if (store['chats'][_0xad7997]['messages']) {
                delete store['chats'][_0xad7997]['messages'];
                _0x2afae2++;
            }
        });
        if (_0x2afae2 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x2afae2 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x520c8e => {
    console['log']('[STORE]\x20Received\x20' + _0x520c8e + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x2753db) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x2753db['message']);
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
process['on']('uncaughtException', _0x3353e0 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x3353e0);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x3aad5c, _0x344c2f) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x344c2f, 'reason:', _0x3aad5c);
});
export default store;