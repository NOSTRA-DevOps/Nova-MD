import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x39de5d from 'fs';
import _0x0_0x5b9209 from 'path';
import _0x0_0x394335 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x278c48) {
    printLog = (_0x592677, _0x4357e1) => console['log']('[' + _0x592677['toUpperCase']() + ']\x20' + _0x4357e1);
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
} catch (_0x0_0x1eae84) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x9b3b93 => {
    try {
        return _0x0_0x394335['deflateSync'](JSON['stringify'](_0x9b3b93));
    } catch (_0x3f5cfd) {
        console['error']('[STORE]\x20Compression\x20error:', _0x3f5cfd['message']);
        return Buffer['from'](JSON['stringify'](_0x9b3b93));
    }
};
const decompress = _0x598e89 => {
    try {
        return JSON['parse'](_0x0_0x394335['inflateSync'](_0x598e89));
    } catch (_0x5132a4) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x5132a4['message']);
        try {
            return JSON['parse'](_0x598e89['toString']());
        } catch (_0x4e5ffe) {
            return null;
        }
    }
};
function slimMessage(_0xc8f57f) {
    return {
        'key': _0xc8f57f['key'],
        'message': _0xc8f57f['message'],
        'messageTimestamp': _0xc8f57f['messageTimestamp'],
        'participant': _0xc8f57f['participant'],
        'pushName': _0xc8f57f['pushName'],
        'broadcast': _0xc8f57f['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x39260b => console['error']('[MONGO]\x20Connection\x20error:', _0x39260b));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x4b7e42, _0xb09081, _0x126b65) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x4b7e42,
                        'id': _0xb09081
                    }, {
                        'data': compress(_0x126b65),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x377b17) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x377b17['message']);
                }
            },
            async 'load'(_0xe36c17, _0x1314f6) {
                try {
                    const _0x45a80f = await Msg['findOne']({
                        'jid': _0xe36c17,
                        'id': _0x1314f6
                    });
                    return _0x45a80f ? decompress(_0x45a80f['data']) : null;
                } catch (_0x242f5e) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x242f5e['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x57a8c1, _0xd79045) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x57a8c1,
                        'userId': _0xd79045
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x565a24) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x565a24['message']);
                }
            },
            async 'getCount'(_0x1ee368, _0x76f5d6) {
                try {
                    const _0x14dcdd = await MsgCount['findOne']({
                        'chatId': _0x1ee368,
                        'userId': _0x76f5d6
                    });
                    return _0x14dcdd ? _0x14dcdd['count'] : 0x0;
                } catch (_0x275d5c) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x275d5c['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x265c03 = await MsgCount['find']({});
                    const _0x4f5ee0 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x265c03['forEach'](_0x2bca0e => {
                        if (!_0x4f5ee0['messageCount'][_0x2bca0e['chatId']]) {
                            _0x4f5ee0['messageCount'][_0x2bca0e['chatId']] = {};
                        }
                        _0x4f5ee0['messageCount'][_0x2bca0e['chatId']][_0x2bca0e['userId']] = _0x2bca0e['count'];
                    });
                    const _0x342d2b = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x342d2b)
                        _0x4f5ee0['isPublic'] = _0x342d2b['value'] === 'true';
                    return _0x4f5ee0;
                } catch (_0x2a5a4f) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x2a5a4f['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x5aec66) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x5aec66['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x3654fa) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x3654fa['message']);
                }
            },
            async 'setMetadata'(_0x418415, _0x30480) {
                try {
                    await Meta['updateOne']({ 'key': _0x418415 }, {
                        'key': _0x418415,
                        'value': _0x30480['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x2a7c99) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x2a7c99['message']);
                }
            },
            async 'getMetadata'(_0x53ba77) {
                try {
                    const _0x304a2e = await Meta['findOne']({ 'key': _0x53ba77 });
                    return _0x304a2e ? _0x304a2e['value'] : null;
                } catch (_0x302bcb) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x302bcb['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x51049c, _0x18a0a6) {
                try {
                    await Contact['updateOne']({ 'jid': _0x51049c }, {
                        ..._0x18a0a6,
                        'jid': _0x51049c,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x963c60) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x963c60['message']);
                }
            },
            async 'getContact'(_0x5debf7) {
                try {
                    return await Contact['findOne']({ 'jid': _0x5debf7 });
                } catch (_0x2d7a75) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x2d7a75['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x4f7b24 = await Contact['find']({});
                    const _0x528a15 = {};
                    _0x4f7b24['forEach'](_0xa3aa01 => {
                        _0x528a15[_0xa3aa01['jid']] = {
                            'id': _0xa3aa01['jid'],
                            'name': _0xa3aa01['name'],
                            'notify': _0xa3aa01['notify']
                        };
                    });
                    return _0x528a15;
                } catch (_0x277aa2) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x277aa2['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x35af71, _0x120f60) {
                try {
                    await Chat['updateOne']({ 'jid': _0x35af71 }, {
                        ..._0x120f60,
                        'jid': _0x35af71,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x35ee80) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x35ee80['message']);
                }
            },
            async 'getChat'(_0x138417) {
                try {
                    return await Chat['findOne']({ 'jid': _0x138417 });
                } catch (_0x57dff8) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x57dff8['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x4d22ef = await Chat['find']({});
                    const _0x58e46b = {};
                    _0x4d22ef['forEach'](_0x47f2f7 => {
                        _0x58e46b[_0x47f2f7['jid']] = {
                            'id': _0x47f2f7['jid'],
                            'name': _0x47f2f7['name'],
                            'conversationTimestamp': _0x47f2f7['conversationTimestamp'],
                            'unreadCount': _0x47f2f7['unreadCount']
                        };
                    });
                    return _0x58e46b;
                } catch (_0xc68206) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0xc68206['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x73337c) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x73337c });
                } catch (_0xe0311) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0xe0311['message']);
                }
            },
            async 'saveSetting'(_0x5748ad, _0x16fe73, _0x17aabc) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x5748ad,
                        'key': _0x16fe73
                    }, {
                        'chatId': _0x5748ad,
                        'key': _0x16fe73,
                        'value': _0x17aabc,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x36c2dc) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x36c2dc['message']);
                }
            },
            async 'getSetting'(_0x3e0216, _0x446fbf) {
                try {
                    const _0x43cb42 = await Setting['findOne']({
                        'chatId': _0x3e0216,
                        'key': _0x446fbf
                    });
                    return _0x43cb42 ? _0x43cb42['value'] : null;
                } catch (_0x1a6e41) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x1a6e41['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x1a11ff) {
                try {
                    const _0x54cd79 = await Setting['find']({ 'chatId': _0x1a11ff });
                    const _0x69d451 = {};
                    _0x54cd79['forEach'](_0xf36ebd => {
                        _0x69d451[_0xf36ebd['key']] = _0xf36ebd['value'];
                    });
                    return _0x69d451;
                } catch (_0x32873b) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x32873b['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x533057 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x533057['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x533057['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0xb85082) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0xb85082['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x53edf8) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x53edf8['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x127159) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x127159['message']);
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
        pool['on']('error', _0x26f687 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x26f687['message']);
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
                        const _0x10f73d = await pool['connect']();
                        try {
                            await _0x10f73d['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x10f73d['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x10f73d['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x10f73d['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x10f73d['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x10f73d['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x10f73d['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x10f73d['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x10f73d['release']();
                        }
                    } catch (_0x465df9) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x465df9['message']);
                        this['initPromise'] = null;
                        throw _0x465df9;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x503b46, _0x29c821, _0x17ac94) {
                try {
                    await this['init']();
                    const _0x6ec896 = await pool['connect']();
                    try {
                        await _0x6ec896['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x503b46,
                            _0x29c821,
                            Date['now'](),
                            compress(_0x17ac94)
                        ]);
                    } finally {
                        _0x6ec896['release']();
                    }
                } catch (_0x534a40) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x534a40['message']);
                }
            },
            async 'load'(_0x3a517b, _0x46d96d) {
                try {
                    await this['init']();
                    const _0x13f13b = await pool['connect']();
                    try {
                        const _0x45cb6c = await _0x13f13b['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x3a517b,
                            _0x46d96d
                        ]);
                        return _0x45cb6c['rows'][0x0] ? decompress(_0x45cb6c['rows'][0x0]['data']) : null;
                    } finally {
                        _0x13f13b['release']();
                    }
                } catch (_0x864bc1) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x864bc1['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x2dc87b, _0xdd3fde) {
                try {
                    await this['init']();
                    const _0x47c204 = await pool['connect']();
                    try {
                        await _0x47c204['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x2dc87b,
                            _0xdd3fde
                        ]);
                    } finally {
                        _0x47c204['release']();
                    }
                } catch (_0x113782) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x113782['message']);
                }
            },
            async 'getCount'(_0x127031, _0x3df5f9) {
                try {
                    await this['init']();
                    const _0x3e2977 = await pool['connect']();
                    try {
                        const _0xaf69ae = await _0x3e2977['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x127031,
                            _0x3df5f9
                        ]);
                        return _0xaf69ae['rows'][0x0] ? _0xaf69ae['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x3e2977['release']();
                    }
                } catch (_0x2ce81e) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x2ce81e['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x4fedc6 = await pool['connect']();
                    try {
                        const _0x343acf = await _0x4fedc6['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x305a8b = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x343acf['rows']['forEach'](_0x7e8304 => {
                            if (!_0x305a8b['messageCount'][_0x7e8304['chat_id']]) {
                                _0x305a8b['messageCount'][_0x7e8304['chat_id']] = {};
                            }
                            _0x305a8b['messageCount'][_0x7e8304['chat_id']][_0x7e8304['user_id']] = _0x7e8304['count'];
                        });
                        const _0x66d663 = await _0x4fedc6['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x66d663['rows'][0x0])
                            _0x305a8b['isPublic'] = _0x66d663['rows'][0x0]['value'] === 'true';
                        return _0x305a8b;
                    } finally {
                        _0x4fedc6['release']();
                    }
                } catch (_0x5e0105) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x5e0105['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x11603e) {
                try {
                    await this['init']();
                    const _0x1b2480 = await pool['connect']();
                    try {
                        await _0x1b2480['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x11603e['toString']()]);
                    } finally {
                        _0x1b2480['release']();
                    }
                } catch (_0x456080) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x456080['message']);
                }
            },
            async 'setMetadata'(_0x4683f1, _0x1592a1) {
                try {
                    await this['init']();
                    const _0x5115a2 = await pool['connect']();
                    try {
                        await _0x5115a2['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x4683f1,
                            _0x1592a1['toString']()
                        ]);
                    } finally {
                        _0x5115a2['release']();
                    }
                } catch (_0xeeec08) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0xeeec08['message']);
                }
            },
            async 'getMetadata'(_0x5de598) {
                try {
                    await this['init']();
                    const _0x2cf722 = await pool['connect']();
                    try {
                        const _0x5cf5fb = await _0x2cf722['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x5de598]);
                        return _0x5cf5fb['rows'][0x0] ? _0x5cf5fb['rows'][0x0]['value'] : null;
                    } finally {
                        _0x2cf722['release']();
                    }
                } catch (_0xc1ccd0) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0xc1ccd0['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xe0ac70, _0xbfbeb8) {
                try {
                    await this['init']();
                    const _0x1aca79 = await pool['connect']();
                    try {
                        await _0x1aca79['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0xe0ac70,
                            _0xbfbeb8['name'] || '',
                            _0xbfbeb8['notify'] || '',
                            _0xbfbeb8['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x1aca79['release']();
                    }
                } catch (_0x42b9ac) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x42b9ac['message']);
                }
            },
            async 'getContact'(_0x3c7407) {
                try {
                    await this['init']();
                    const _0x5e27df = await pool['connect']();
                    try {
                        const _0x1b43a1 = await _0x5e27df['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x3c7407]);
                        return _0x1b43a1['rows'][0x0] || null;
                    } finally {
                        _0x5e27df['release']();
                    }
                } catch (_0x504ead) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x504ead['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x44e3be = await pool['connect']();
                    try {
                        const _0x12325a = await _0x44e3be['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0xd7d2d6 = {};
                        _0x12325a['rows']['forEach'](_0xe14281 => {
                            _0xd7d2d6[_0xe14281['jid']] = {
                                'id': _0xe14281['jid'],
                                'name': _0xe14281['name'],
                                'notify': _0xe14281['notify']
                            };
                        });
                        return _0xd7d2d6;
                    } finally {
                        _0x44e3be['release']();
                    }
                } catch (_0x5aa749) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x5aa749['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x2c6f91, _0x56f45f) {
                try {
                    await this['init']();
                    const _0x7f72ad = await pool['connect']();
                    try {
                        await _0x7f72ad['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x2c6f91,
                            _0x56f45f['name'] || '',
                            _0x56f45f['conversationTimestamp'] || 0x0,
                            _0x56f45f['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x7f72ad['release']();
                    }
                } catch (_0xa1c64e) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0xa1c64e['message']);
                }
            },
            async 'getChat'(_0x46370e) {
                try {
                    await this['init']();
                    const _0x2e5ba0 = await pool['connect']();
                    try {
                        const _0x122abe = await _0x2e5ba0['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x46370e]);
                        return _0x122abe['rows'][0x0] || null;
                    } finally {
                        _0x2e5ba0['release']();
                    }
                } catch (_0x52f88a) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x52f88a['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x1cf6b3 = await pool['connect']();
                    try {
                        const _0x582d3d = await _0x1cf6b3['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x4504f5 = {};
                        _0x582d3d['rows']['forEach'](_0x23f084 => {
                            _0x4504f5[_0x23f084['jid']] = {
                                'id': _0x23f084['jid'],
                                'name': _0x23f084['name'],
                                'conversationTimestamp': _0x23f084['conversation_timestamp'],
                                'unreadCount': _0x23f084['unread_count']
                            };
                        });
                        return _0x4504f5;
                    } finally {
                        _0x1cf6b3['release']();
                    }
                } catch (_0x19f007) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x19f007['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x3820b2) {
                try {
                    await this['init']();
                    const _0x4eaa2c = await pool['connect']();
                    try {
                        await _0x4eaa2c['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x3820b2]);
                    } finally {
                        _0x4eaa2c['release']();
                    }
                } catch (_0x119d7d) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x119d7d['message']);
                }
            },
            async 'saveSetting'(_0x2cacaa, _0x4395d4, _0x1523d1) {
                try {
                    await this['init']();
                    const _0x349f85 = await pool['connect']();
                    try {
                        await _0x349f85['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x2cacaa,
                            _0x4395d4,
                            JSON['stringify'](_0x1523d1),
                            Date['now']()
                        ]);
                    } finally {
                        _0x349f85['release']();
                    }
                } catch (_0x589fa5) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x589fa5['message']);
                }
            },
            async 'getSetting'(_0x216517, _0x4e1bb8) {
                try {
                    await this['init']();
                    const _0x7b91d5 = await pool['connect']();
                    try {
                        const _0x584ea5 = await _0x7b91d5['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x216517,
                            _0x4e1bb8
                        ]);
                        return _0x584ea5['rows'][0x0] ? JSON['parse'](_0x584ea5['rows'][0x0]['value']) : null;
                    } finally {
                        _0x7b91d5['release']();
                    }
                } catch (_0x535896) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x535896['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x5a17e0) {
                try {
                    await this['init']();
                    const _0x204f8d = await pool['connect']();
                    try {
                        const _0x1a7b05 = await _0x204f8d['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x5a17e0]);
                        const _0x486965 = {};
                        _0x1a7b05['rows']['forEach'](_0x3930ce => {
                            _0x486965[_0x3930ce['key']] = JSON['parse'](_0x3930ce['value']);
                        });
                        return _0x486965;
                    } finally {
                        _0x204f8d['release']();
                    }
                } catch (_0x249bfe) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x249bfe['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x200001 = await pool['connect']();
                    try {
                        const _0x49a1f7 = await _0x200001['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x49a1f7['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x49a1f7['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x200001['release']();
                    }
                } catch (_0x3d773f) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x3d773f['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x29f5a3) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x29f5a3['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x19de3c) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x19de3c['message']);
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
                    } catch (_0x25ece5) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x25ece5['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x25ece5;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x47110a, _0x151d54, _0x55aeab) {
                try {
                    const _0x17dc53 = await this['getConn']();
                    await _0x17dc53['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x47110a,
                        _0x151d54,
                        Date['now'](),
                        compress(_0x55aeab)
                    ]);
                } catch (_0x49cbdc) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x49cbdc['message']);
                }
            },
            async 'load'(_0x5aa2dd, _0xf342c3) {
                try {
                    const _0x152d3e = await this['getConn']();
                    const [_0x48db52] = await _0x152d3e['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x5aa2dd,
                        _0xf342c3
                    ]);
                    return _0x48db52[0x0] ? decompress(_0x48db52[0x0]['data']) : null;
                } catch (_0x558faa) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x558faa['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x1e949d, _0x547cdd) {
                try {
                    const _0x2cf93d = await this['getConn']();
                    await _0x2cf93d['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x1e949d,
                        _0x547cdd
                    ]);
                } catch (_0x5bdeb9) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x5bdeb9['message']);
                }
            },
            async 'getCount'(_0x49b12f, _0x19da4f) {
                try {
                    const _0x2a7fbc = await this['getConn']();
                    const [_0x1c4c3a] = await _0x2a7fbc['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x49b12f,
                        _0x19da4f
                    ]);
                    return _0x1c4c3a[0x0] ? _0x1c4c3a[0x0]['count'] : 0x0;
                } catch (_0x1fcb3d) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x1fcb3d['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x5cd207 = await this['getConn']();
                    const [_0x4d0a35] = await _0x5cd207['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x485b49 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x4d0a35['forEach'](_0x59aac1 => {
                        if (!_0x485b49['messageCount'][_0x59aac1['chat_id']]) {
                            _0x485b49['messageCount'][_0x59aac1['chat_id']] = {};
                        }
                        _0x485b49['messageCount'][_0x59aac1['chat_id']][_0x59aac1['user_id']] = _0x59aac1['count'];
                    });
                    const [_0x2cf898] = await _0x5cd207['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x2cf898[0x0])
                        _0x485b49['isPublic'] = _0x2cf898[0x0]['value'] === 'true';
                    return _0x485b49;
                } catch (_0x61e583) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x61e583['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x58b1b7) {
                try {
                    const _0x429db2 = await this['getConn']();
                    await _0x429db2['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x58b1b7['toString']()]);
                } catch (_0xcd155e) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0xcd155e['message']);
                }
            },
            async 'setMetadata'(_0x5d8e3a, _0xf3be97) {
                try {
                    const _0x41ea75 = await this['getConn']();
                    await _0x41ea75['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x5d8e3a,
                        _0xf3be97['toString']()
                    ]);
                } catch (_0xf01188) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0xf01188['message']);
                }
            },
            async 'getMetadata'(_0xa4789b) {
                try {
                    const _0x49a081 = await this['getConn']();
                    const [_0x4bd141] = await _0x49a081['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0xa4789b]);
                    return _0x4bd141[0x0] ? _0x4bd141[0x0]['value'] : null;
                } catch (_0x5afc10) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x5afc10['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x363fbd, _0x5d9293) {
                try {
                    const _0x392788 = await this['getConn']();
                    await _0x392788['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x363fbd,
                        _0x5d9293['name'] || '',
                        _0x5d9293['notify'] || '',
                        _0x5d9293['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x29de8c) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x29de8c['message']);
                }
            },
            async 'getContact'(_0x5ea3e3) {
                try {
                    const _0x5929bf = await this['getConn']();
                    const [_0x147ca6] = await _0x5929bf['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x5ea3e3]);
                    return _0x147ca6[0x0] || null;
                } catch (_0x2274fa) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x2274fa['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x5e28a5 = await this['getConn']();
                    const [_0x87cb81] = await _0x5e28a5['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0xad81 = {};
                    _0x87cb81['forEach'](_0x9c450b => {
                        _0xad81[_0x9c450b['jid']] = {
                            'id': _0x9c450b['jid'],
                            'name': _0x9c450b['name'],
                            'notify': _0x9c450b['notify']
                        };
                    });
                    return _0xad81;
                } catch (_0x2f5a16) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x2f5a16['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x1e4498, _0x321c2c) {
                try {
                    const _0x51d87d = await this['getConn']();
                    await _0x51d87d['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x1e4498,
                        _0x321c2c['name'] || '',
                        _0x321c2c['conversationTimestamp'] || 0x0,
                        _0x321c2c['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x548eba) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x548eba['message']);
                }
            },
            async 'getChat'(_0x43d65d) {
                try {
                    const _0x1db0ff = await this['getConn']();
                    const [_0x25495d] = await _0x1db0ff['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x43d65d]);
                    return _0x25495d[0x0] || null;
                } catch (_0x3f5ba6) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x3f5ba6['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x5ef9fd = await this['getConn']();
                    const [_0x237753] = await _0x5ef9fd['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x5a9d56 = {};
                    _0x237753['forEach'](_0x59168d => {
                        _0x5a9d56[_0x59168d['jid']] = {
                            'id': _0x59168d['jid'],
                            'name': _0x59168d['name'],
                            'conversationTimestamp': _0x59168d['conversation_timestamp'],
                            'unreadCount': _0x59168d['unread_count']
                        };
                    });
                    return _0x5a9d56;
                } catch (_0x3d0540) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x3d0540['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0xda048b) {
                try {
                    const _0x3ea140 = await this['getConn']();
                    await _0x3ea140['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0xda048b]);
                } catch (_0x4fb685) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x4fb685['message']);
                }
            },
            async 'saveSetting'(_0x32c225, _0x1d36dd, _0x1413e3) {
                try {
                    const _0x4ca991 = await this['getConn']();
                    await _0x4ca991['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x32c225,
                        _0x1d36dd,
                        JSON['stringify'](_0x1413e3),
                        Date['now']()
                    ]);
                } catch (_0xf472ae) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0xf472ae['message']);
                }
            },
            async 'getSetting'(_0x1eb343, _0x146a8c) {
                try {
                    const _0x15b326 = await this['getConn']();
                    const [_0x37e698] = await _0x15b326['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x1eb343,
                        _0x146a8c
                    ]);
                    return _0x37e698[0x0] ? JSON['parse'](_0x37e698[0x0]['value']) : null;
                } catch (_0x1b9671) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x1b9671['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x48ee6e) {
                try {
                    const _0x2cc83b = await this['getConn']();
                    const [_0x18fd9b] = await _0x2cc83b['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x48ee6e]);
                    const _0x3da6b2 = {};
                    _0x18fd9b['forEach'](_0x19929d => {
                        _0x3da6b2[_0x19929d['key']] = JSON['parse'](_0x19929d['value']);
                    });
                    return _0x3da6b2;
                } catch (_0x4c4ee1) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x4c4ee1['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x1be949 = await this['getConn']();
                    const [_0x291498] = await _0x1be949['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x291498['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x291498['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x61783) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x61783['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x1d6bca) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x1d6bca['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x47ad89) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x47ad89['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x5b9209['dirname'](SQLITE_URL);
        if (!_0x0_0x39de5d['existsSync'](dir))
            _0x0_0x39de5d['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x21a0b0, _0x815dde, _0x4a9c25) {
                try {
                    saveStmt['run'](_0x21a0b0, _0x815dde, Date['now'](), compress(_0x4a9c25));
                    const {count: _0x12177c} = countStmt['get'](_0x21a0b0);
                    if (_0x12177c > MESSAGE_LIMITS['sqlite']) {
                        const _0x3b4df6 = _0x12177c - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x21a0b0, _0x21a0b0, _0x3b4df6);
                    }
                } catch (_0x513f47) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x513f47['message']);
                }
            },
            'load'(_0x3551d4, _0x3d28b4) {
                try {
                    const _0x451d74 = loadStmt['get'](_0x3551d4, _0x3d28b4);
                    return _0x451d74 ? decompress(_0x451d74['data']) : null;
                } catch (_0x1de35d) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x1de35d['message']);
                    return null;
                }
            },
            'incrementCount'(_0x5a44ae, _0x501663) {
                try {
                    incrementCountStmt['run'](_0x5a44ae, _0x501663);
                } catch (_0x3066c1) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x3066c1['message']);
                }
            },
            'getCount'(_0x16bbac, _0x3d4496) {
                try {
                    const _0x17da9b = getCountStmt['get'](_0x16bbac, _0x3d4496);
                    return _0x17da9b ? _0x17da9b['count'] : 0x0;
                } catch (_0x2052f4) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x2052f4['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x52bf24 = getAllCountsStmt['all']();
                    const _0x2e4e1a = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x52bf24['forEach'](_0x36b0fb => {
                        if (!_0x2e4e1a['messageCount'][_0x36b0fb['chat_id']]) {
                            _0x2e4e1a['messageCount'][_0x36b0fb['chat_id']] = {};
                        }
                        _0x2e4e1a['messageCount'][_0x36b0fb['chat_id']][_0x36b0fb['user_id']] = _0x36b0fb['count'];
                    });
                    const _0x183890 = getMetaStmt['get']();
                    if (_0x183890)
                        _0x2e4e1a['isPublic'] = _0x183890['value'] === 'true';
                    return _0x2e4e1a;
                } catch (_0x3435ab) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x3435ab['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x25e6e3) {
                try {
                    setMetaStmt['run'](_0x25e6e3['toString']());
                } catch (_0x4f5ab6) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x4f5ab6['message']);
                }
            },
            'setMetadata'(_0x5a13f8, _0x57843a) {
                try {
                    setMetadataStmt['run'](_0x5a13f8, _0x57843a['toString']());
                } catch (_0x4355a2) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x4355a2['message']);
                }
            },
            'getMetadata'(_0x6f5746) {
                try {
                    const _0x18af59 = getMetadataStmt['get'](_0x6f5746);
                    return _0x18af59 ? _0x18af59['value'] : null;
                } catch (_0x2ba1e8) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x2ba1e8['message']);
                    return null;
                }
            },
            'saveContact'(_0x24e045, _0x1de4a9) {
                try {
                    saveContactStmt['run'](_0x24e045, _0x1de4a9['name'] || '', _0x1de4a9['notify'] || '', _0x1de4a9['verifiedName'] || '', Date['now']());
                } catch (_0x2648b8) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x2648b8['message']);
                }
            },
            'getContact'(_0xea5449) {
                try {
                    return getContactStmt['get'](_0xea5449) || null;
                } catch (_0x459cd1) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x459cd1['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x5e6cfc = getAllContactsStmt['all']();
                    const _0x5b48af = {};
                    _0x5e6cfc['forEach'](_0x1d574c => {
                        _0x5b48af[_0x1d574c['jid']] = {
                            'id': _0x1d574c['jid'],
                            'name': _0x1d574c['name'],
                            'notify': _0x1d574c['notify']
                        };
                    });
                    return _0x5b48af;
                } catch (_0x119a69) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x119a69['message']);
                    return {};
                }
            },
            'saveChat'(_0x17666a, _0x19459d) {
                try {
                    saveChatStmt['run'](_0x17666a, _0x19459d['name'] || '', _0x19459d['conversationTimestamp'] || 0x0, _0x19459d['unreadCount'] || 0x0, Date['now']());
                } catch (_0x3aea39) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x3aea39['message']);
                }
            },
            'getChat'(_0x53e7db) {
                try {
                    return getChatStmt['get'](_0x53e7db) || null;
                } catch (_0x153d0d) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x153d0d['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x7adeeb = getAllChatsStmt['all']();
                    const _0x2fb832 = {};
                    _0x7adeeb['forEach'](_0x228059 => {
                        _0x2fb832[_0x228059['jid']] = {
                            'id': _0x228059['jid'],
                            'name': _0x228059['name'],
                            'conversationTimestamp': _0x228059['conversation_timestamp'],
                            'unreadCount': _0x228059['unread_count']
                        };
                    });
                    return _0x2fb832;
                } catch (_0x4a59f4) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x4a59f4['message']);
                    return {};
                }
            },
            'deleteChat'(_0x3d7bed) {
                try {
                    deleteChatStmt['run'](_0x3d7bed);
                } catch (_0x5e0dd9) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x5e0dd9['message']);
                }
            },
            'saveSetting'(_0x100e9a, _0x4f05b2, _0x3370c8) {
                try {
                    saveSettingStmt['run'](_0x100e9a, _0x4f05b2, JSON['stringify'](_0x3370c8), Date['now']());
                } catch (_0x1c8052) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x1c8052['message']);
                }
            },
            'getSetting'(_0x3f50e4, _0x2c9614) {
                try {
                    const _0xc4970 = getSettingStmt['get'](_0x3f50e4, _0x2c9614);
                    return _0xc4970 ? JSON['parse'](_0xc4970['value']) : null;
                } catch (_0x38693c) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x38693c['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x16bc48) {
                try {
                    const _0x25a714 = getAllSettingsStmt['all'](_0x16bc48);
                    const _0x6270a6 = {};
                    _0x25a714['forEach'](_0x5f08a9 => {
                        _0x6270a6[_0x5f08a9['key']] = JSON['parse'](_0x5f08a9['value']);
                    });
                    return _0x6270a6;
                } catch (_0x5258fe) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x5258fe['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x462473 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x462473['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x462473['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x551aef) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x551aef['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x20d4d9) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x20d4d9['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x32fe29) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x32fe29['message']);
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
    async 'readFromFile'(_0x11b58b = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0xa7b760 = await adapters[backend]['getAllContacts']();
                const _0x5d6769 = await adapters[backend]['getAllChats']();
                const _0x1819f9 = await this['getBotMode']();
                this['contacts'] = _0xa7b760;
                this['chats'] = _0x5d6769;
                this['botMode'] = _0x1819f9;
            } else {
                if (_0x0_0x39de5d['existsSync'](_0x11b58b)) {
                    const _0x2f6071 = JSON['parse'](_0x0_0x39de5d['readFileSync'](_0x11b58b, 'utf-8'));
                    this['contacts'] = _0x2f6071['contacts'] || {};
                    this['chats'] = _0x2f6071['chats'] || {};
                    this['botMode'] = _0x2f6071['botMode'] || 'private';
                    this['messages'] = _0x2f6071['messages'] || {};
                    this['isPublic'] = _0x2f6071['isPublic'] !== undefined ? _0x2f6071['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x4b2b71) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x4b2b71['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x5c6644 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0xb8f162 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x39de5d['writeFileSync'](_0x5c6644, JSON['stringify'](_0xb8f162, null, 0x2));
        } catch (_0x7bbe68) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x7bbe68['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x39de5d['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x3b861b = JSON['parse'](_0x0_0x39de5d['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x3b861b['messageCount'] || _0x3b861b;
                    this['isPublic'] = typeof _0x3b861b['isPublic'] === 'boolean' ? _0x3b861b['isPublic'] : ![];
                }
            } catch (_0x256f32) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x256f32['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x392c91 = _0x0_0x5b9209['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x39de5d['existsSync'](_0x392c91))
                    _0x0_0x39de5d['mkdirSync'](_0x392c91, { 'recursive': !![] });
                const _0x5c9380 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x39de5d['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x5c9380, null, 0x2));
            } catch (_0x1d6adc) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x1d6adc['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x1fe7af => {
                if (typeof this['messages'][_0x1fe7af] === 'object' && !Array['isArray'](this['messages'][_0x1fe7af])) {
                    const _0x22b7df = Object['values'](this['messages'][_0x1fe7af]);
                    this['messages'][_0x1fe7af] = _0x22b7df['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x1fe7af])) {
                    if (this['messages'][_0x1fe7af]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x1fe7af] = this['messages'][_0x1fe7af]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x4354b2 => {
                if (this['chats'][_0x4354b2]['messages']) {
                    delete this['chats'][_0x4354b2]['messages'];
                }
            });
        }
    },
    'bind'(_0xcb351a) {
        _0xcb351a['on']('messages.upsert', async ({messages: _0x24c848}) => {
            for (const _0x591bc3 of _0x24c848) {
                if (!_0x591bc3['key']?.['remoteJid'])
                    continue;
                const _0x5c11df = _0x591bc3['key']['remoteJid'];
                const _0x25083b = slimMessage(_0x591bc3);
                if (backend === 'memory') {
                    this['messages'][_0x5c11df] = this['messages'][_0x5c11df] || [];
                    this['messages'][_0x5c11df]['push'](_0x25083b);
                    if (this['messages'][_0x5c11df]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x5c11df] = this['messages'][_0x5c11df]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x5c11df, _0x591bc3['key']['id'], _0x25083b);
                    } catch (_0x49e354) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x591bc3['key']['id'] + ':', _0x49e354['message']);
                    }
                }
            }
        });
        _0xcb351a['on']('contacts.update', async _0x31f640 => {
            for (const _0x2f94bc of _0x31f640) {
                if (_0x2f94bc['id']) {
                    const _0x1a078e = {
                        'id': _0x2f94bc['id'],
                        'name': _0x2f94bc['notify'] || _0x2f94bc['name'] || _0x2f94bc['verifiedName'] || '',
                        'notify': _0x2f94bc['notify'],
                        'verifiedName': _0x2f94bc['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x2f94bc['id']] = _0x1a078e;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x2f94bc['id'], _0x1a078e);
                        } catch (_0x527818) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x527818['message']);
                        }
                    }
                }
            }
        });
        _0xcb351a['on']('contacts.set', async _0x4004e6 => {
            for (const _0x38ba19 of _0x4004e6) {
                if (_0x38ba19['id']) {
                    const _0x383105 = {
                        'id': _0x38ba19['id'],
                        'name': _0x38ba19['notify'] || _0x38ba19['name'] || _0x38ba19['verifiedName'] || '',
                        'notify': _0x38ba19['notify'],
                        'verifiedName': _0x38ba19['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x38ba19['id']] = _0x383105;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x38ba19['id'], _0x383105);
                        } catch (_0xd99cbd) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0xd99cbd['message']);
                        }
                    }
                }
            }
        });
        _0xcb351a['on']('chats.set', async _0x166adf => {
            for (const _0xcb8d01 of _0x166adf) {
                if (_0xcb8d01['id']) {
                    const _0x2d8ee0 = {
                        'id': _0xcb8d01['id'],
                        'name': _0xcb8d01['name'] || _0xcb8d01['subject'] || '',
                        'conversationTimestamp': _0xcb8d01['conversationTimestamp'],
                        'unreadCount': _0xcb8d01['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0xcb8d01['id']] = _0x2d8ee0;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0xcb8d01['id'], _0x2d8ee0);
                        } catch (_0x2ef488) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x2ef488['message']);
                        }
                    }
                }
            }
        });
        _0xcb351a['on']('chats.update', async _0x377eca => {
            for (const _0x1594d9 of _0x377eca) {
                if (_0x1594d9['id']) {
                    if (backend === 'memory') {
                        const _0x1b50cf = this['chats'][_0x1594d9['id']] || {};
                        this['chats'][_0x1594d9['id']] = {
                            'id': _0x1594d9['id'],
                            'name': _0x1594d9['name'] || _0x1594d9['subject'] || _0x1b50cf['name'] || '',
                            'conversationTimestamp': _0x1594d9['conversationTimestamp'] || _0x1b50cf['conversationTimestamp'],
                            'unreadCount': _0x1594d9['unreadCount'] !== undefined ? _0x1594d9['unreadCount'] : _0x1b50cf['unreadCount']
                        };
                    } else {
                        try {
                            const _0x5f4a30 = await adapters[backend]['getChat'](_0x1594d9['id']) || {};
                            const _0x1ccd86 = {
                                'id': _0x1594d9['id'],
                                'name': _0x1594d9['name'] || _0x1594d9['subject'] || _0x5f4a30['name'] || '',
                                'conversationTimestamp': _0x1594d9['conversationTimestamp'] || _0x5f4a30['conversation_timestamp'],
                                'unreadCount': _0x1594d9['unreadCount'] !== undefined ? _0x1594d9['unreadCount'] : _0x5f4a30['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x1594d9['id'], _0x1ccd86);
                        } catch (_0x9e977c) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x9e977c['message']);
                        }
                    }
                }
            }
        });
        _0xcb351a['on']('chats.delete', async _0x2b2373 => {
            for (const _0x52e683 of _0x2b2373) {
                if (backend === 'memory') {
                    delete this['chats'][_0x52e683];
                    delete this['messages'][_0x52e683];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x52e683);
                    } catch (_0x38c79d) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x38c79d['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x4c02c9, _0x1b0f14) {
        if (backend === 'memory') {
            const _0x41bd3f = this['messages'][_0x4c02c9]?.['find'](_0x116c8e => _0x116c8e['key']['id'] === _0x1b0f14) || null;
            return _0x41bd3f;
        } else {
            try {
                return await adapters[backend]['load'](_0x4c02c9, _0x1b0f14);
            } catch (_0xb2e2da) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x1b0f14 + ':', _0xb2e2da['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x53ad81, _0x1b1c54, _0x58982c) {
        if (backend === 'memory') {
            const _0xc6dcc6 = './data';
            if (!_0x0_0x39de5d['existsSync'](_0xc6dcc6))
                _0x0_0x39de5d['mkdirSync'](_0xc6dcc6, { 'recursive': !![] });
            const _0x1761f3 = _0x0_0x5b9209['join'](_0xc6dcc6, _0x1b1c54 + '.json');
            try {
                _0x0_0x39de5d['writeFileSync'](_0x1761f3, JSON['stringify'](_0x58982c, null, 0x2));
            } catch (_0x3b3364) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x1b1c54 + ':', _0x3b3364['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x53ad81, _0x1b1c54, _0x58982c);
            } catch (_0x13f4a7) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x1b1c54 + ':', _0x13f4a7['message']);
            }
        }
    },
    async 'getSetting'(_0x3a0f62, _0x81fad2) {
        if (backend === 'memory') {
            const _0x716bda = './data';
            const _0x516537 = _0x0_0x5b9209['join'](_0x716bda, _0x81fad2 + '.json');
            try {
                if (_0x0_0x39de5d['existsSync'](_0x516537)) {
                    const _0x522766 = JSON['parse'](_0x0_0x39de5d['readFileSync'](_0x516537, 'utf-8'));
                    if (_0x522766['enabled'] !== undefined)
                        return _0x522766;
                    if (_0x522766[_0x3a0f62] !== undefined)
                        return _0x522766[_0x3a0f62];
                    return null;
                }
                return null;
            } catch (_0x36344d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x81fad2 + ':', _0x36344d['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x3a0f62, _0x81fad2);
            } catch (_0x2133b5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x81fad2 + ':', _0x2133b5['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x18a41f) {
        if (backend === 'memory') {
            const _0x1012af = './data';
            const _0xb903ed = {};
            try {
                if (_0x0_0x39de5d['existsSync'](_0x1012af)) {
                    const _0x455ab9 = _0x0_0x39de5d['readdirSync'](_0x1012af)['filter'](_0x286a38 => _0x286a38['endsWith']('.json'));
                    for (const _0x25c4b2 of _0x455ab9) {
                        const _0x4aa381 = _0x0_0x5b9209['basename'](_0x25c4b2, '.json');
                        if (_0x4aa381 === 'messageCount' || _0x4aa381 === 'owner')
                            continue;
                        const _0x4c10d6 = _0x0_0x5b9209['join'](_0x1012af, _0x25c4b2);
                        const _0x4148c5 = JSON['parse'](_0x0_0x39de5d['readFileSync'](_0x4c10d6, 'utf-8'));
                        if (_0x4148c5[_0x18a41f]) {
                            _0xb903ed[_0x4aa381] = _0x4148c5[_0x18a41f];
                        }
                    }
                }
                return _0xb903ed;
            } catch (_0x393edc) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x393edc['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x18a41f);
            } catch (_0x37c44a) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x37c44a['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x5a132c) {
        const _0x37c348 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x37c348['includes'](_0x5a132c)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x5a132c + ',\x20defaulting\x20to\x20private');
            _0x5a132c = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x5a132c;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x5a132c);
            } catch (_0x46ca81) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x46ca81['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x10948c = await adapters[backend]['getMetadata']('botMode');
                return _0x10948c || 'private';
            } catch (_0x1ec3e3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x1ec3e3['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x3138fe, _0x9ecfc7, _0x4fee3a) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x3138fe]) {
                this['messageCount'][_0x3138fe] = {};
            }
            if (!this['messageCount'][_0x3138fe][_0x9ecfc7]) {
                this['messageCount'][_0x3138fe][_0x9ecfc7] = 0x0;
            }
            this['messageCount'][_0x3138fe][_0x9ecfc7]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x3138fe, _0x9ecfc7);
            } catch (_0x26cbef) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x9ecfc7 + ':', _0x26cbef['message']);
            }
        }
    },
    async 'getMessageCount'(_0x4a5889, _0x4af609) {
        if (backend === 'memory') {
            return this['messageCount'][_0x4a5889]?.[_0x4af609] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x4a5889, _0x4af609);
            } catch (_0x10bfc3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x4af609 + ':', _0x10bfc3['message']);
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
            } catch (_0x1afd3d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x1afd3d['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x3f6f0b) {
        if (backend === 'memory') {
            this['isPublic'] = _0x3f6f0b;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x3f6f0b);
            } catch (_0x5dcbe4) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x5dcbe4['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x24476c = await adapters[backend]['getAllCounts']();
                return _0x24476c['isPublic'];
            } catch (_0x12535d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x12535d['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x2ebdba) {
        const _0xa0747f = [
            'public',
            'private'
        ];
        if (!_0xa0747f['includes'](_0x2ebdba)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x2ebdba);
            _0x2ebdba = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x2ebdba;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x2ebdba);
            } catch (_0x1af938) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x1af938['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x401429 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x401429 || 'private';
            } catch (_0x18bb5e) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x18bb5e['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x4fbc0a = 0x0;
        const _0x37d270 = Object['keys'](this['contacts'])['length'];
        const _0x1a6bc4 = Object['keys'](this['chats'])['length'];
        let _0x2db9bd = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x4a28d2 => {
                if (Array['isArray'](_0x4a28d2)) {
                    _0x4fbc0a += _0x4a28d2['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x5bf2f7 => {
                if (typeof _0x5bf2f7 === 'object') {
                    _0x2db9bd += Object['keys'](_0x5bf2f7)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x4fbc0a : 'stored\x20in\x20database',
            'contacts': _0x37d270,
            'chats': _0x1a6bc4,
            'messageCounts': backend === 'memory' ? _0x2db9bd : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x2334fe => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x2334fe));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x38b899 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x38b899));
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
        let _0x2f0f4a = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x9e8aa6 => {
            if (store['chats'][_0x9e8aa6]['messages']) {
                delete store['chats'][_0x9e8aa6]['messages'];
                _0x2f0f4a++;
            }
        });
        if (_0x2f0f4a > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x2f0f4a + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x43a29d => {
    console['log']('[STORE]\x20Received\x20' + _0x43a29d + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x17033d) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x17033d['message']);
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
process['on']('uncaughtException', _0x175de1 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x175de1);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x425d72, _0x3ffd19) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x3ffd19, 'reason:', _0x425d72);
});
export default store;