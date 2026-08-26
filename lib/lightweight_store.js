import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x42be3d from 'fs';
import _0x0_0xcf804b from 'path';
import _0x0_0x5b6c97 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x3893da) {
    printLog = (_0x2ba56a, _0x3021f7) => console['log']('[' + _0x2ba56a['toUpperCase']() + ']\x20' + _0x3021f7);
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
} catch (_0x0_0x324246) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x53b087 => {
    try {
        return _0x0_0x5b6c97['deflateSync'](JSON['stringify'](_0x53b087));
    } catch (_0x56215f) {
        console['error']('[STORE]\x20Compression\x20error:', _0x56215f['message']);
        return Buffer['from'](JSON['stringify'](_0x53b087));
    }
};
const decompress = _0x2af398 => {
    try {
        return JSON['parse'](_0x0_0x5b6c97['inflateSync'](_0x2af398));
    } catch (_0x53615e) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x53615e['message']);
        try {
            return JSON['parse'](_0x2af398['toString']());
        } catch (_0x13339d) {
            return null;
        }
    }
};
function slimMessage(_0x793d3f) {
    return {
        'key': _0x793d3f['key'],
        'message': _0x793d3f['message'],
        'messageTimestamp': _0x793d3f['messageTimestamp'],
        'participant': _0x793d3f['participant'],
        'pushName': _0x793d3f['pushName'],
        'broadcast': _0x793d3f['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x598d97 => console['error']('[MONGO]\x20Connection\x20error:', _0x598d97));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x5cd578, _0x3f2430, _0x4b151e) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x5cd578,
                        'id': _0x3f2430
                    }, {
                        'data': compress(_0x4b151e),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3306be) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x3306be['message']);
                }
            },
            async 'load'(_0x229737, _0x2bb59c) {
                try {
                    const _0x2a62e0 = await Msg['findOne']({
                        'jid': _0x229737,
                        'id': _0x2bb59c
                    });
                    return _0x2a62e0 ? decompress(_0x2a62e0['data']) : null;
                } catch (_0x10d71f) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x10d71f['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x1dc31c, _0x55ce47) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x1dc31c,
                        'userId': _0x55ce47
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x7d9fce) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x7d9fce['message']);
                }
            },
            async 'getCount'(_0x1bb636, _0xffb693) {
                try {
                    const _0x2fed32 = await MsgCount['findOne']({
                        'chatId': _0x1bb636,
                        'userId': _0xffb693
                    });
                    return _0x2fed32 ? _0x2fed32['count'] : 0x0;
                } catch (_0x3a5e58) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x3a5e58['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x4496a7 = await MsgCount['find']({});
                    const _0x4aae6f = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x4496a7['forEach'](_0x59e164 => {
                        if (!_0x4aae6f['messageCount'][_0x59e164['chatId']]) {
                            _0x4aae6f['messageCount'][_0x59e164['chatId']] = {};
                        }
                        _0x4aae6f['messageCount'][_0x59e164['chatId']][_0x59e164['userId']] = _0x59e164['count'];
                    });
                    const _0x16103c = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x16103c)
                        _0x4aae6f['isPublic'] = _0x16103c['value'] === 'true';
                    return _0x4aae6f;
                } catch (_0xc3f70e) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0xc3f70e['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x6e6ca8) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x6e6ca8['toString']()
                    }, { 'upsert': !![] });
                } catch (_0xada9e6) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0xada9e6['message']);
                }
            },
            async 'setMetadata'(_0x251e55, _0x3b7414) {
                try {
                    await Meta['updateOne']({ 'key': _0x251e55 }, {
                        'key': _0x251e55,
                        'value': _0x3b7414['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x15e660) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x15e660['message']);
                }
            },
            async 'getMetadata'(_0x57cc5b) {
                try {
                    const _0x3887e1 = await Meta['findOne']({ 'key': _0x57cc5b });
                    return _0x3887e1 ? _0x3887e1['value'] : null;
                } catch (_0x47240b) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x47240b['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x356f46, _0x126402) {
                try {
                    await Contact['updateOne']({ 'jid': _0x356f46 }, {
                        ..._0x126402,
                        'jid': _0x356f46,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4ceaa2) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x4ceaa2['message']);
                }
            },
            async 'getContact'(_0x35334e) {
                try {
                    return await Contact['findOne']({ 'jid': _0x35334e });
                } catch (_0x585d4c) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x585d4c['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x254ee6 = await Contact['find']({});
                    const _0x2e97a0 = {};
                    _0x254ee6['forEach'](_0x4ae1b1 => {
                        _0x2e97a0[_0x4ae1b1['jid']] = {
                            'id': _0x4ae1b1['jid'],
                            'name': _0x4ae1b1['name'],
                            'notify': _0x4ae1b1['notify']
                        };
                    });
                    return _0x2e97a0;
                } catch (_0x21d86b) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x21d86b['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x30ad8f, _0x163f1c) {
                try {
                    await Chat['updateOne']({ 'jid': _0x30ad8f }, {
                        ..._0x163f1c,
                        'jid': _0x30ad8f,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x12ebf6) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x12ebf6['message']);
                }
            },
            async 'getChat'(_0x882a) {
                try {
                    return await Chat['findOne']({ 'jid': _0x882a });
                } catch (_0x2d9aa4) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x2d9aa4['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x5530b9 = await Chat['find']({});
                    const _0x63099d = {};
                    _0x5530b9['forEach'](_0x366f79 => {
                        _0x63099d[_0x366f79['jid']] = {
                            'id': _0x366f79['jid'],
                            'name': _0x366f79['name'],
                            'conversationTimestamp': _0x366f79['conversationTimestamp'],
                            'unreadCount': _0x366f79['unreadCount']
                        };
                    });
                    return _0x63099d;
                } catch (_0x44de1f) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x44de1f['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x404514) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x404514 });
                } catch (_0x2c0585) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x2c0585['message']);
                }
            },
            async 'saveSetting'(_0x2ba0d7, _0x5158d2, _0x583e7e) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x2ba0d7,
                        'key': _0x5158d2
                    }, {
                        'chatId': _0x2ba0d7,
                        'key': _0x5158d2,
                        'value': _0x583e7e,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x634c62) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x634c62['message']);
                }
            },
            async 'getSetting'(_0x336047, _0x5d42b9) {
                try {
                    const _0x349ffc = await Setting['findOne']({
                        'chatId': _0x336047,
                        'key': _0x5d42b9
                    });
                    return _0x349ffc ? _0x349ffc['value'] : null;
                } catch (_0x5cc13a) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x5cc13a['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x196874) {
                try {
                    const _0x567f17 = await Setting['find']({ 'chatId': _0x196874 });
                    const _0x9e81c9 = {};
                    _0x567f17['forEach'](_0x103732 => {
                        _0x9e81c9[_0x103732['key']] = _0x103732['value'];
                    });
                    return _0x9e81c9;
                } catch (_0x6290bb) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x6290bb['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x34ef6f = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x34ef6f['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x34ef6f['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x102b1e) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x102b1e['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x1c3884) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x1c3884['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x5c7a1f) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x5c7a1f['message']);
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
        pool['on']('error', _0x1a45ff => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x1a45ff['message']);
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
                        const _0x5d0ecf = await pool['connect']();
                        try {
                            await _0x5d0ecf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d0ecf['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x5d0ecf['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x5d0ecf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d0ecf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d0ecf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d0ecf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d0ecf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x5d0ecf['release']();
                        }
                    } catch (_0x86ff2e) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x86ff2e['message']);
                        this['initPromise'] = null;
                        throw _0x86ff2e;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x480326, _0x4e3d23, _0x29c78b) {
                try {
                    await this['init']();
                    const _0x14320e = await pool['connect']();
                    try {
                        await _0x14320e['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x480326,
                            _0x4e3d23,
                            Date['now'](),
                            compress(_0x29c78b)
                        ]);
                    } finally {
                        _0x14320e['release']();
                    }
                } catch (_0xf44a47) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0xf44a47['message']);
                }
            },
            async 'load'(_0x11bcbf, _0x3a4803) {
                try {
                    await this['init']();
                    const _0x55727b = await pool['connect']();
                    try {
                        const _0x3b1f02 = await _0x55727b['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x11bcbf,
                            _0x3a4803
                        ]);
                        return _0x3b1f02['rows'][0x0] ? decompress(_0x3b1f02['rows'][0x0]['data']) : null;
                    } finally {
                        _0x55727b['release']();
                    }
                } catch (_0x1373f7) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x1373f7['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x3a2663, _0xc4a264) {
                try {
                    await this['init']();
                    const _0x252237 = await pool['connect']();
                    try {
                        await _0x252237['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x3a2663,
                            _0xc4a264
                        ]);
                    } finally {
                        _0x252237['release']();
                    }
                } catch (_0x216b21) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x216b21['message']);
                }
            },
            async 'getCount'(_0x21efb2, _0x15efc4) {
                try {
                    await this['init']();
                    const _0x259d6b = await pool['connect']();
                    try {
                        const _0x3267ab = await _0x259d6b['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x21efb2,
                            _0x15efc4
                        ]);
                        return _0x3267ab['rows'][0x0] ? _0x3267ab['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x259d6b['release']();
                    }
                } catch (_0x221558) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x221558['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x13553a = await pool['connect']();
                    try {
                        const _0x49fc05 = await _0x13553a['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x1ef4e3 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x49fc05['rows']['forEach'](_0xa9cbb2 => {
                            if (!_0x1ef4e3['messageCount'][_0xa9cbb2['chat_id']]) {
                                _0x1ef4e3['messageCount'][_0xa9cbb2['chat_id']] = {};
                            }
                            _0x1ef4e3['messageCount'][_0xa9cbb2['chat_id']][_0xa9cbb2['user_id']] = _0xa9cbb2['count'];
                        });
                        const _0x29d948 = await _0x13553a['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x29d948['rows'][0x0])
                            _0x1ef4e3['isPublic'] = _0x29d948['rows'][0x0]['value'] === 'true';
                        return _0x1ef4e3;
                    } finally {
                        _0x13553a['release']();
                    }
                } catch (_0x3e5317) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x3e5317['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x480f9c) {
                try {
                    await this['init']();
                    const _0x97fc02 = await pool['connect']();
                    try {
                        await _0x97fc02['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x480f9c['toString']()]);
                    } finally {
                        _0x97fc02['release']();
                    }
                } catch (_0x3a9cb5) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x3a9cb5['message']);
                }
            },
            async 'setMetadata'(_0x14990a, _0x258825) {
                try {
                    await this['init']();
                    const _0x3d84cd = await pool['connect']();
                    try {
                        await _0x3d84cd['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x14990a,
                            _0x258825['toString']()
                        ]);
                    } finally {
                        _0x3d84cd['release']();
                    }
                } catch (_0x3acdd9) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x3acdd9['message']);
                }
            },
            async 'getMetadata'(_0x470521) {
                try {
                    await this['init']();
                    const _0x5d6414 = await pool['connect']();
                    try {
                        const _0x5e4d75 = await _0x5d6414['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x470521]);
                        return _0x5e4d75['rows'][0x0] ? _0x5e4d75['rows'][0x0]['value'] : null;
                    } finally {
                        _0x5d6414['release']();
                    }
                } catch (_0x44cffc) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x44cffc['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x2fc877, _0x5cb2f6) {
                try {
                    await this['init']();
                    const _0x447c60 = await pool['connect']();
                    try {
                        await _0x447c60['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x2fc877,
                            _0x5cb2f6['name'] || '',
                            _0x5cb2f6['notify'] || '',
                            _0x5cb2f6['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x447c60['release']();
                    }
                } catch (_0x1e205b) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x1e205b['message']);
                }
            },
            async 'getContact'(_0x5936d5) {
                try {
                    await this['init']();
                    const _0x3c9af1 = await pool['connect']();
                    try {
                        const _0xeed485 = await _0x3c9af1['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x5936d5]);
                        return _0xeed485['rows'][0x0] || null;
                    } finally {
                        _0x3c9af1['release']();
                    }
                } catch (_0x3f2871) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x3f2871['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x1effec = await pool['connect']();
                    try {
                        const _0x4c7a5f = await _0x1effec['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x7e143a = {};
                        _0x4c7a5f['rows']['forEach'](_0x45e7aa => {
                            _0x7e143a[_0x45e7aa['jid']] = {
                                'id': _0x45e7aa['jid'],
                                'name': _0x45e7aa['name'],
                                'notify': _0x45e7aa['notify']
                            };
                        });
                        return _0x7e143a;
                    } finally {
                        _0x1effec['release']();
                    }
                } catch (_0x40baef) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x40baef['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x41f23b, _0x340943) {
                try {
                    await this['init']();
                    const _0x495637 = await pool['connect']();
                    try {
                        await _0x495637['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x41f23b,
                            _0x340943['name'] || '',
                            _0x340943['conversationTimestamp'] || 0x0,
                            _0x340943['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x495637['release']();
                    }
                } catch (_0x3fab77) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x3fab77['message']);
                }
            },
            async 'getChat'(_0x38cb97) {
                try {
                    await this['init']();
                    const _0x1f8985 = await pool['connect']();
                    try {
                        const _0x4af0f9 = await _0x1f8985['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x38cb97]);
                        return _0x4af0f9['rows'][0x0] || null;
                    } finally {
                        _0x1f8985['release']();
                    }
                } catch (_0x5b95aa) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x5b95aa['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x12230a = await pool['connect']();
                    try {
                        const _0x190254 = await _0x12230a['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x2777d7 = {};
                        _0x190254['rows']['forEach'](_0x51e715 => {
                            _0x2777d7[_0x51e715['jid']] = {
                                'id': _0x51e715['jid'],
                                'name': _0x51e715['name'],
                                'conversationTimestamp': _0x51e715['conversation_timestamp'],
                                'unreadCount': _0x51e715['unread_count']
                            };
                        });
                        return _0x2777d7;
                    } finally {
                        _0x12230a['release']();
                    }
                } catch (_0x11127c) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x11127c['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x328a25) {
                try {
                    await this['init']();
                    const _0x4bc393 = await pool['connect']();
                    try {
                        await _0x4bc393['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x328a25]);
                    } finally {
                        _0x4bc393['release']();
                    }
                } catch (_0x9f06a7) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x9f06a7['message']);
                }
            },
            async 'saveSetting'(_0xccfd4, _0x55ede8, _0x23f7e7) {
                try {
                    await this['init']();
                    const _0x1390b4 = await pool['connect']();
                    try {
                        await _0x1390b4['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0xccfd4,
                            _0x55ede8,
                            JSON['stringify'](_0x23f7e7),
                            Date['now']()
                        ]);
                    } finally {
                        _0x1390b4['release']();
                    }
                } catch (_0x5b2bb5) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x5b2bb5['message']);
                }
            },
            async 'getSetting'(_0x28e44c, _0x57443d) {
                try {
                    await this['init']();
                    const _0x1716e = await pool['connect']();
                    try {
                        const _0x62c6a9 = await _0x1716e['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x28e44c,
                            _0x57443d
                        ]);
                        return _0x62c6a9['rows'][0x0] ? JSON['parse'](_0x62c6a9['rows'][0x0]['value']) : null;
                    } finally {
                        _0x1716e['release']();
                    }
                } catch (_0x154eb3) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x154eb3['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x508e7e) {
                try {
                    await this['init']();
                    const _0x5a2aac = await pool['connect']();
                    try {
                        const _0x59eced = await _0x5a2aac['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x508e7e]);
                        const _0x1ad4e1 = {};
                        _0x59eced['rows']['forEach'](_0x11d1f2 => {
                            _0x1ad4e1[_0x11d1f2['key']] = JSON['parse'](_0x11d1f2['value']);
                        });
                        return _0x1ad4e1;
                    } finally {
                        _0x5a2aac['release']();
                    }
                } catch (_0x138a10) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x138a10['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x3ea64b = await pool['connect']();
                    try {
                        const _0x2dec45 = await _0x3ea64b['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x2dec45['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x2dec45['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x3ea64b['release']();
                    }
                } catch (_0x4418de) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x4418de['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x4c6bfa) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x4c6bfa['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x2ed20a) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x2ed20a['message']);
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
                    } catch (_0x3ece27) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x3ece27['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x3ece27;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x305f58, _0x2cb0e0, _0x2a1e01) {
                try {
                    const _0x4763e3 = await this['getConn']();
                    await _0x4763e3['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x305f58,
                        _0x2cb0e0,
                        Date['now'](),
                        compress(_0x2a1e01)
                    ]);
                } catch (_0x5cde12) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x5cde12['message']);
                }
            },
            async 'load'(_0x292207, _0x556e78) {
                try {
                    const _0x59b0fc = await this['getConn']();
                    const [_0x5e5499] = await _0x59b0fc['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x292207,
                        _0x556e78
                    ]);
                    return _0x5e5499[0x0] ? decompress(_0x5e5499[0x0]['data']) : null;
                } catch (_0x83fefa) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x83fefa['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x4f885c, _0xb294d6) {
                try {
                    const _0x24e5f2 = await this['getConn']();
                    await _0x24e5f2['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x4f885c,
                        _0xb294d6
                    ]);
                } catch (_0x153e87) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x153e87['message']);
                }
            },
            async 'getCount'(_0x46e35e, _0x218bd0) {
                try {
                    const _0x33b66f = await this['getConn']();
                    const [_0x346f37] = await _0x33b66f['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x46e35e,
                        _0x218bd0
                    ]);
                    return _0x346f37[0x0] ? _0x346f37[0x0]['count'] : 0x0;
                } catch (_0x5117b8) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x5117b8['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0xd03319 = await this['getConn']();
                    const [_0x1f2695] = await _0xd03319['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x4e83cb = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x1f2695['forEach'](_0x2fe649 => {
                        if (!_0x4e83cb['messageCount'][_0x2fe649['chat_id']]) {
                            _0x4e83cb['messageCount'][_0x2fe649['chat_id']] = {};
                        }
                        _0x4e83cb['messageCount'][_0x2fe649['chat_id']][_0x2fe649['user_id']] = _0x2fe649['count'];
                    });
                    const [_0x2a4094] = await _0xd03319['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x2a4094[0x0])
                        _0x4e83cb['isPublic'] = _0x2a4094[0x0]['value'] === 'true';
                    return _0x4e83cb;
                } catch (_0x19b65a) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x19b65a['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x5dcfcf) {
                try {
                    const _0x53d4be = await this['getConn']();
                    await _0x53d4be['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x5dcfcf['toString']()]);
                } catch (_0x27927d) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x27927d['message']);
                }
            },
            async 'setMetadata'(_0x19d366, _0xcab68c) {
                try {
                    const _0x38be31 = await this['getConn']();
                    await _0x38be31['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x19d366,
                        _0xcab68c['toString']()
                    ]);
                } catch (_0x3dbe38) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x3dbe38['message']);
                }
            },
            async 'getMetadata'(_0x92107f) {
                try {
                    const _0x76a266 = await this['getConn']();
                    const [_0x4a5307] = await _0x76a266['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x92107f]);
                    return _0x4a5307[0x0] ? _0x4a5307[0x0]['value'] : null;
                } catch (_0x3af8c5) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x3af8c5['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x25e798, _0x120aa0) {
                try {
                    const _0x2d9323 = await this['getConn']();
                    await _0x2d9323['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x25e798,
                        _0x120aa0['name'] || '',
                        _0x120aa0['notify'] || '',
                        _0x120aa0['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x39910a) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x39910a['message']);
                }
            },
            async 'getContact'(_0x4d6982) {
                try {
                    const _0x78e645 = await this['getConn']();
                    const [_0x4995d1] = await _0x78e645['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x4d6982]);
                    return _0x4995d1[0x0] || null;
                } catch (_0x4b0dc3) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x4b0dc3['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0xa953bb = await this['getConn']();
                    const [_0x466d34] = await _0xa953bb['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x436460 = {};
                    _0x466d34['forEach'](_0x26ab69 => {
                        _0x436460[_0x26ab69['jid']] = {
                            'id': _0x26ab69['jid'],
                            'name': _0x26ab69['name'],
                            'notify': _0x26ab69['notify']
                        };
                    });
                    return _0x436460;
                } catch (_0x111763) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x111763['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x13485a, _0x573434) {
                try {
                    const _0x2e56c5 = await this['getConn']();
                    await _0x2e56c5['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x13485a,
                        _0x573434['name'] || '',
                        _0x573434['conversationTimestamp'] || 0x0,
                        _0x573434['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x3685b7) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x3685b7['message']);
                }
            },
            async 'getChat'(_0x58500f) {
                try {
                    const _0x3225d3 = await this['getConn']();
                    const [_0x519fd7] = await _0x3225d3['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x58500f]);
                    return _0x519fd7[0x0] || null;
                } catch (_0x4bde6e) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x4bde6e['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x51a1d2 = await this['getConn']();
                    const [_0x582688] = await _0x51a1d2['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x741d1f = {};
                    _0x582688['forEach'](_0x52ef8c => {
                        _0x741d1f[_0x52ef8c['jid']] = {
                            'id': _0x52ef8c['jid'],
                            'name': _0x52ef8c['name'],
                            'conversationTimestamp': _0x52ef8c['conversation_timestamp'],
                            'unreadCount': _0x52ef8c['unread_count']
                        };
                    });
                    return _0x741d1f;
                } catch (_0x337a73) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x337a73['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x716190) {
                try {
                    const _0x5a66be = await this['getConn']();
                    await _0x5a66be['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x716190]);
                } catch (_0x3ad15c) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x3ad15c['message']);
                }
            },
            async 'saveSetting'(_0x4fef81, _0x302adc, _0x15bf9f) {
                try {
                    const _0xcb4b2c = await this['getConn']();
                    await _0xcb4b2c['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x4fef81,
                        _0x302adc,
                        JSON['stringify'](_0x15bf9f),
                        Date['now']()
                    ]);
                } catch (_0x3c773b) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x3c773b['message']);
                }
            },
            async 'getSetting'(_0x4bf866, _0x1a6a1d) {
                try {
                    const _0x1b854c = await this['getConn']();
                    const [_0x1b67b9] = await _0x1b854c['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x4bf866,
                        _0x1a6a1d
                    ]);
                    return _0x1b67b9[0x0] ? JSON['parse'](_0x1b67b9[0x0]['value']) : null;
                } catch (_0x13d3c0) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x13d3c0['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x230257) {
                try {
                    const _0x5c6a3c = await this['getConn']();
                    const [_0x5cd240] = await _0x5c6a3c['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x230257]);
                    const _0x5b00f2 = {};
                    _0x5cd240['forEach'](_0x5d3432 => {
                        _0x5b00f2[_0x5d3432['key']] = JSON['parse'](_0x5d3432['value']);
                    });
                    return _0x5b00f2;
                } catch (_0xb7848f) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0xb7848f['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x20bd4d = await this['getConn']();
                    const [_0x2ff34a] = await _0x20bd4d['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x2ff34a['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x2ff34a['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x3c3b23) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x3c3b23['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x6bf54e) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x6bf54e['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x3a89e7) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x3a89e7['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0xcf804b['dirname'](SQLITE_URL);
        if (!_0x0_0x42be3d['existsSync'](dir))
            _0x0_0x42be3d['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x6b101a, _0x327fc3, _0x2c6941) {
                try {
                    saveStmt['run'](_0x6b101a, _0x327fc3, Date['now'](), compress(_0x2c6941));
                    const {count: _0x2daa3c} = countStmt['get'](_0x6b101a);
                    if (_0x2daa3c > MESSAGE_LIMITS['sqlite']) {
                        const _0x4509e3 = _0x2daa3c - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x6b101a, _0x6b101a, _0x4509e3);
                    }
                } catch (_0x312196) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x312196['message']);
                }
            },
            'load'(_0x2e6384, _0x5030bb) {
                try {
                    const _0x187725 = loadStmt['get'](_0x2e6384, _0x5030bb);
                    return _0x187725 ? decompress(_0x187725['data']) : null;
                } catch (_0x2fea99) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x2fea99['message']);
                    return null;
                }
            },
            'incrementCount'(_0x48dc2d, _0x21c390) {
                try {
                    incrementCountStmt['run'](_0x48dc2d, _0x21c390);
                } catch (_0x47fcf3) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x47fcf3['message']);
                }
            },
            'getCount'(_0x10dd26, _0xbf549a) {
                try {
                    const _0x4c94ea = getCountStmt['get'](_0x10dd26, _0xbf549a);
                    return _0x4c94ea ? _0x4c94ea['count'] : 0x0;
                } catch (_0x3050e7) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x3050e7['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x2eb0c3 = getAllCountsStmt['all']();
                    const _0x471ad0 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2eb0c3['forEach'](_0x27d679 => {
                        if (!_0x471ad0['messageCount'][_0x27d679['chat_id']]) {
                            _0x471ad0['messageCount'][_0x27d679['chat_id']] = {};
                        }
                        _0x471ad0['messageCount'][_0x27d679['chat_id']][_0x27d679['user_id']] = _0x27d679['count'];
                    });
                    const _0x2081ad = getMetaStmt['get']();
                    if (_0x2081ad)
                        _0x471ad0['isPublic'] = _0x2081ad['value'] === 'true';
                    return _0x471ad0;
                } catch (_0x265b17) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x265b17['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x74839c) {
                try {
                    setMetaStmt['run'](_0x74839c['toString']());
                } catch (_0x46a68d) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x46a68d['message']);
                }
            },
            'setMetadata'(_0x303476, _0x46f2c4) {
                try {
                    setMetadataStmt['run'](_0x303476, _0x46f2c4['toString']());
                } catch (_0x3aa0af) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x3aa0af['message']);
                }
            },
            'getMetadata'(_0x1a5720) {
                try {
                    const _0x28f09e = getMetadataStmt['get'](_0x1a5720);
                    return _0x28f09e ? _0x28f09e['value'] : null;
                } catch (_0x3c7595) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x3c7595['message']);
                    return null;
                }
            },
            'saveContact'(_0x24e375, _0x177c4a) {
                try {
                    saveContactStmt['run'](_0x24e375, _0x177c4a['name'] || '', _0x177c4a['notify'] || '', _0x177c4a['verifiedName'] || '', Date['now']());
                } catch (_0x4c0db4) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x4c0db4['message']);
                }
            },
            'getContact'(_0x4b71c2) {
                try {
                    return getContactStmt['get'](_0x4b71c2) || null;
                } catch (_0x22abf0) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x22abf0['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x2e3056 = getAllContactsStmt['all']();
                    const _0x176d8e = {};
                    _0x2e3056['forEach'](_0x25de77 => {
                        _0x176d8e[_0x25de77['jid']] = {
                            'id': _0x25de77['jid'],
                            'name': _0x25de77['name'],
                            'notify': _0x25de77['notify']
                        };
                    });
                    return _0x176d8e;
                } catch (_0x44f4aa) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x44f4aa['message']);
                    return {};
                }
            },
            'saveChat'(_0x598c1e, _0x1f225) {
                try {
                    saveChatStmt['run'](_0x598c1e, _0x1f225['name'] || '', _0x1f225['conversationTimestamp'] || 0x0, _0x1f225['unreadCount'] || 0x0, Date['now']());
                } catch (_0x247fa2) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x247fa2['message']);
                }
            },
            'getChat'(_0x2ce84c) {
                try {
                    return getChatStmt['get'](_0x2ce84c) || null;
                } catch (_0x58176c) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x58176c['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x37a21e = getAllChatsStmt['all']();
                    const _0x385f36 = {};
                    _0x37a21e['forEach'](_0x55207a => {
                        _0x385f36[_0x55207a['jid']] = {
                            'id': _0x55207a['jid'],
                            'name': _0x55207a['name'],
                            'conversationTimestamp': _0x55207a['conversation_timestamp'],
                            'unreadCount': _0x55207a['unread_count']
                        };
                    });
                    return _0x385f36;
                } catch (_0x480f2e) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x480f2e['message']);
                    return {};
                }
            },
            'deleteChat'(_0x498cfc) {
                try {
                    deleteChatStmt['run'](_0x498cfc);
                } catch (_0x406c54) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x406c54['message']);
                }
            },
            'saveSetting'(_0xff4e26, _0x2cffd7, _0x4f72ed) {
                try {
                    saveSettingStmt['run'](_0xff4e26, _0x2cffd7, JSON['stringify'](_0x4f72ed), Date['now']());
                } catch (_0x35f72b) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x35f72b['message']);
                }
            },
            'getSetting'(_0x4667dd, _0x216c50) {
                try {
                    const _0xcc032d = getSettingStmt['get'](_0x4667dd, _0x216c50);
                    return _0xcc032d ? JSON['parse'](_0xcc032d['value']) : null;
                } catch (_0xf32a5e) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0xf32a5e['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x6b0ff2) {
                try {
                    const _0x7bc0d = getAllSettingsStmt['all'](_0x6b0ff2);
                    const _0x8151ec = {};
                    _0x7bc0d['forEach'](_0x476185 => {
                        _0x8151ec[_0x476185['key']] = JSON['parse'](_0x476185['value']);
                    });
                    return _0x8151ec;
                } catch (_0x1765da) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x1765da['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x2d8cc5 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x2d8cc5['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x2d8cc5['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x287ebc) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x287ebc['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x33c6f1) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x33c6f1['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x3029e2) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x3029e2['message']);
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
    async 'readFromFile'(_0x3344e8 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x5877e9 = await adapters[backend]['getAllContacts']();
                const _0x1db5dd = await adapters[backend]['getAllChats']();
                const _0x27782d = await this['getBotMode']();
                this['contacts'] = _0x5877e9;
                this['chats'] = _0x1db5dd;
                this['botMode'] = _0x27782d;
            } else {
                if (_0x0_0x42be3d['existsSync'](_0x3344e8)) {
                    const _0xbf523c = JSON['parse'](_0x0_0x42be3d['readFileSync'](_0x3344e8, 'utf-8'));
                    this['contacts'] = _0xbf523c['contacts'] || {};
                    this['chats'] = _0xbf523c['chats'] || {};
                    this['botMode'] = _0xbf523c['botMode'] || 'private';
                    this['messages'] = _0xbf523c['messages'] || {};
                    this['isPublic'] = _0xbf523c['isPublic'] !== undefined ? _0xbf523c['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x373fcf) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x373fcf['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x1b74d4 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x53ad60 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x42be3d['writeFileSync'](_0x1b74d4, JSON['stringify'](_0x53ad60, null, 0x2));
        } catch (_0x51b80c) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x51b80c['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x42be3d['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x1b36db = JSON['parse'](_0x0_0x42be3d['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x1b36db['messageCount'] || _0x1b36db;
                    this['isPublic'] = typeof _0x1b36db['isPublic'] === 'boolean' ? _0x1b36db['isPublic'] : ![];
                }
            } catch (_0x56006b) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x56006b['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x4b82ea = _0x0_0xcf804b['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x42be3d['existsSync'](_0x4b82ea))
                    _0x0_0x42be3d['mkdirSync'](_0x4b82ea, { 'recursive': !![] });
                const _0x343890 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x42be3d['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x343890, null, 0x2));
            } catch (_0x30f0fe) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x30f0fe['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x51c163 => {
                if (typeof this['messages'][_0x51c163] === 'object' && !Array['isArray'](this['messages'][_0x51c163])) {
                    const _0x4f39a3 = Object['values'](this['messages'][_0x51c163]);
                    this['messages'][_0x51c163] = _0x4f39a3['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x51c163])) {
                    if (this['messages'][_0x51c163]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x51c163] = this['messages'][_0x51c163]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x122b3d => {
                if (this['chats'][_0x122b3d]['messages']) {
                    delete this['chats'][_0x122b3d]['messages'];
                }
            });
        }
    },
    'bind'(_0x18706b) {
        _0x18706b['on']('messages.upsert', async ({messages: _0x459d89}) => {
            for (const _0x1d41d6 of _0x459d89) {
                if (!_0x1d41d6['key']?.['remoteJid'])
                    continue;
                const _0x5416f0 = _0x1d41d6['key']['remoteJid'];
                const _0xbca83e = slimMessage(_0x1d41d6);
                if (backend === 'memory') {
                    this['messages'][_0x5416f0] = this['messages'][_0x5416f0] || [];
                    this['messages'][_0x5416f0]['push'](_0xbca83e);
                    if (this['messages'][_0x5416f0]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x5416f0] = this['messages'][_0x5416f0]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x5416f0, _0x1d41d6['key']['id'], _0xbca83e);
                    } catch (_0x4e3e15) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x1d41d6['key']['id'] + ':', _0x4e3e15['message']);
                    }
                }
            }
        });
        _0x18706b['on']('contacts.update', async _0x13ea65 => {
            for (const _0x581803 of _0x13ea65) {
                if (_0x581803['id']) {
                    const _0x373091 = {
                        'id': _0x581803['id'],
                        'name': _0x581803['notify'] || _0x581803['name'] || _0x581803['verifiedName'] || '',
                        'notify': _0x581803['notify'],
                        'verifiedName': _0x581803['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x581803['id']] = _0x373091;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x581803['id'], _0x373091);
                        } catch (_0x1e0cb1) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x1e0cb1['message']);
                        }
                    }
                }
            }
        });
        _0x18706b['on']('contacts.set', async _0x435ab8 => {
            for (const _0x59ce14 of _0x435ab8) {
                if (_0x59ce14['id']) {
                    const _0xcb307b = {
                        'id': _0x59ce14['id'],
                        'name': _0x59ce14['notify'] || _0x59ce14['name'] || _0x59ce14['verifiedName'] || '',
                        'notify': _0x59ce14['notify'],
                        'verifiedName': _0x59ce14['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x59ce14['id']] = _0xcb307b;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x59ce14['id'], _0xcb307b);
                        } catch (_0x415461) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x415461['message']);
                        }
                    }
                }
            }
        });
        _0x18706b['on']('chats.set', async _0x1618c3 => {
            for (const _0x58f7a of _0x1618c3) {
                if (_0x58f7a['id']) {
                    const _0x3a4f39 = {
                        'id': _0x58f7a['id'],
                        'name': _0x58f7a['name'] || _0x58f7a['subject'] || '',
                        'conversationTimestamp': _0x58f7a['conversationTimestamp'],
                        'unreadCount': _0x58f7a['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x58f7a['id']] = _0x3a4f39;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x58f7a['id'], _0x3a4f39);
                        } catch (_0x6c4efc) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x6c4efc['message']);
                        }
                    }
                }
            }
        });
        _0x18706b['on']('chats.update', async _0x4aee0a => {
            for (const _0x191abe of _0x4aee0a) {
                if (_0x191abe['id']) {
                    if (backend === 'memory') {
                        const _0x365f80 = this['chats'][_0x191abe['id']] || {};
                        this['chats'][_0x191abe['id']] = {
                            'id': _0x191abe['id'],
                            'name': _0x191abe['name'] || _0x191abe['subject'] || _0x365f80['name'] || '',
                            'conversationTimestamp': _0x191abe['conversationTimestamp'] || _0x365f80['conversationTimestamp'],
                            'unreadCount': _0x191abe['unreadCount'] !== undefined ? _0x191abe['unreadCount'] : _0x365f80['unreadCount']
                        };
                    } else {
                        try {
                            const _0x12dacc = await adapters[backend]['getChat'](_0x191abe['id']) || {};
                            const _0x23e104 = {
                                'id': _0x191abe['id'],
                                'name': _0x191abe['name'] || _0x191abe['subject'] || _0x12dacc['name'] || '',
                                'conversationTimestamp': _0x191abe['conversationTimestamp'] || _0x12dacc['conversation_timestamp'],
                                'unreadCount': _0x191abe['unreadCount'] !== undefined ? _0x191abe['unreadCount'] : _0x12dacc['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x191abe['id'], _0x23e104);
                        } catch (_0x3d2270) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x3d2270['message']);
                        }
                    }
                }
            }
        });
        _0x18706b['on']('chats.delete', async _0x45ba37 => {
            for (const _0x58b426 of _0x45ba37) {
                if (backend === 'memory') {
                    delete this['chats'][_0x58b426];
                    delete this['messages'][_0x58b426];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x58b426);
                    } catch (_0x31fdf8) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x31fdf8['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x5e1639, _0xe2e717) {
        if (backend === 'memory') {
            const _0x6def8 = this['messages'][_0x5e1639]?.['find'](_0x31d17f => _0x31d17f['key']['id'] === _0xe2e717) || null;
            return _0x6def8;
        } else {
            try {
                return await adapters[backend]['load'](_0x5e1639, _0xe2e717);
            } catch (_0x5777ca) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0xe2e717 + ':', _0x5777ca['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x39b63c, _0x10d643, _0x4fb439) {
        if (backend === 'memory') {
            const _0x3c0859 = './data';
            if (!_0x0_0x42be3d['existsSync'](_0x3c0859))
                _0x0_0x42be3d['mkdirSync'](_0x3c0859, { 'recursive': !![] });
            const _0xd503b3 = _0x0_0xcf804b['join'](_0x3c0859, _0x10d643 + '.json');
            try {
                _0x0_0x42be3d['writeFileSync'](_0xd503b3, JSON['stringify'](_0x4fb439, null, 0x2));
            } catch (_0x4b4d2a) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x10d643 + ':', _0x4b4d2a['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x39b63c, _0x10d643, _0x4fb439);
            } catch (_0x10f2d2) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x10d643 + ':', _0x10f2d2['message']);
            }
        }
    },
    async 'getSetting'(_0x6303be, _0x570ae7) {
        if (backend === 'memory') {
            const _0x4473f6 = './data';
            const _0x428605 = _0x0_0xcf804b['join'](_0x4473f6, _0x570ae7 + '.json');
            try {
                if (_0x0_0x42be3d['existsSync'](_0x428605)) {
                    const _0x59c1a9 = JSON['parse'](_0x0_0x42be3d['readFileSync'](_0x428605, 'utf-8'));
                    if (_0x59c1a9['enabled'] !== undefined)
                        return _0x59c1a9;
                    if (_0x59c1a9[_0x6303be] !== undefined)
                        return _0x59c1a9[_0x6303be];
                    return null;
                }
                return null;
            } catch (_0x1bad46) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x570ae7 + ':', _0x1bad46['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x6303be, _0x570ae7);
            } catch (_0x29ac00) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x570ae7 + ':', _0x29ac00['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x7d5f97) {
        if (backend === 'memory') {
            const _0x278d02 = './data';
            const _0x4e76bb = {};
            try {
                if (_0x0_0x42be3d['existsSync'](_0x278d02)) {
                    const _0x443d78 = _0x0_0x42be3d['readdirSync'](_0x278d02)['filter'](_0x2f8545 => _0x2f8545['endsWith']('.json'));
                    for (const _0x10d2af of _0x443d78) {
                        const _0x27a7b8 = _0x0_0xcf804b['basename'](_0x10d2af, '.json');
                        if (_0x27a7b8 === 'messageCount' || _0x27a7b8 === 'owner')
                            continue;
                        const _0x1a7ec6 = _0x0_0xcf804b['join'](_0x278d02, _0x10d2af);
                        const _0x14c59d = JSON['parse'](_0x0_0x42be3d['readFileSync'](_0x1a7ec6, 'utf-8'));
                        if (_0x14c59d[_0x7d5f97]) {
                            _0x4e76bb[_0x27a7b8] = _0x14c59d[_0x7d5f97];
                        }
                    }
                }
                return _0x4e76bb;
            } catch (_0x3e5238) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x3e5238['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x7d5f97);
            } catch (_0x3f2e5c) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x3f2e5c['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x5427f2) {
        const _0x4f155c = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x4f155c['includes'](_0x5427f2)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x5427f2 + ',\x20defaulting\x20to\x20private');
            _0x5427f2 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x5427f2;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x5427f2);
            } catch (_0x121372) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x121372['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x2b7d46 = await adapters[backend]['getMetadata']('botMode');
                return _0x2b7d46 || 'private';
            } catch (_0x49af63) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x49af63['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x419dae, _0x51202e, _0xfec15c) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x419dae]) {
                this['messageCount'][_0x419dae] = {};
            }
            if (!this['messageCount'][_0x419dae][_0x51202e]) {
                this['messageCount'][_0x419dae][_0x51202e] = 0x0;
            }
            this['messageCount'][_0x419dae][_0x51202e]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x419dae, _0x51202e);
            } catch (_0x46bf2b) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x51202e + ':', _0x46bf2b['message']);
            }
        }
    },
    async 'getMessageCount'(_0x179d37, _0x5e9a9f) {
        if (backend === 'memory') {
            return this['messageCount'][_0x179d37]?.[_0x5e9a9f] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x179d37, _0x5e9a9f);
            } catch (_0x351e8d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x5e9a9f + ':', _0x351e8d['message']);
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
            } catch (_0x58dbab) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x58dbab['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x6d4ef2) {
        if (backend === 'memory') {
            this['isPublic'] = _0x6d4ef2;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x6d4ef2);
            } catch (_0x2da51b) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x2da51b['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x5f0e0f = await adapters[backend]['getAllCounts']();
                return _0x5f0e0f['isPublic'];
            } catch (_0x3d5785) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x3d5785['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x36bcf5) {
        const _0x474c0d = [
            'public',
            'private'
        ];
        if (!_0x474c0d['includes'](_0x36bcf5)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x36bcf5);
            _0x36bcf5 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x36bcf5;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x36bcf5);
            } catch (_0x2301e9) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x2301e9['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x3a6385 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x3a6385 || 'private';
            } catch (_0x394b6e) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x394b6e['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0xb9d4d9 = 0x0;
        const _0x48b512 = Object['keys'](this['contacts'])['length'];
        const _0x373249 = Object['keys'](this['chats'])['length'];
        let _0xcae583 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x3752cb => {
                if (Array['isArray'](_0x3752cb)) {
                    _0xb9d4d9 += _0x3752cb['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x5d1502 => {
                if (typeof _0x5d1502 === 'object') {
                    _0xcae583 += Object['keys'](_0x5d1502)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0xb9d4d9 : 'stored\x20in\x20database',
            'contacts': _0x48b512,
            'chats': _0x373249,
            'messageCounts': backend === 'memory' ? _0xcae583 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x2f00cb => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x2f00cb));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x2ad8df => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x2ad8df));
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
        let _0x455f51 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x2a1cff => {
            if (store['chats'][_0x2a1cff]['messages']) {
                delete store['chats'][_0x2a1cff]['messages'];
                _0x455f51++;
            }
        });
        if (_0x455f51 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x455f51 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x146304 => {
    console['log']('[STORE]\x20Received\x20' + _0x146304 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x219843) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x219843['message']);
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
process['on']('uncaughtException', _0x4db76a => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x4db76a);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x50f778, _0x3c7f31) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x3c7f31, 'reason:', _0x50f778);
});
export default store;