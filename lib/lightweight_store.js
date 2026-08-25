import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x41a38e from 'fs';
import _0x0_0x393cf3 from 'path';
import _0x0_0x5d1ab7 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x159a2) {
    printLog = (_0x19449c, _0x3b55b5) => console['log']('[' + _0x19449c['toUpperCase']() + ']\x20' + _0x3b55b5);
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
} catch (_0x0_0x4f620b) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x4dbda4 => {
    try {
        return _0x0_0x5d1ab7['deflateSync'](JSON['stringify'](_0x4dbda4));
    } catch (_0x3bdcde) {
        console['error']('[STORE]\x20Compression\x20error:', _0x3bdcde['message']);
        return Buffer['from'](JSON['stringify'](_0x4dbda4));
    }
};
const decompress = _0x484a8b => {
    try {
        return JSON['parse'](_0x0_0x5d1ab7['inflateSync'](_0x484a8b));
    } catch (_0x998a36) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x998a36['message']);
        try {
            return JSON['parse'](_0x484a8b['toString']());
        } catch (_0x4e68b4) {
            return null;
        }
    }
};
function slimMessage(_0x904b0d) {
    return {
        'key': _0x904b0d['key'],
        'message': _0x904b0d['message'],
        'messageTimestamp': _0x904b0d['messageTimestamp'],
        'participant': _0x904b0d['participant'],
        'pushName': _0x904b0d['pushName'],
        'broadcast': _0x904b0d['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x4a44bf => console['error']('[MONGO]\x20Connection\x20error:', _0x4a44bf));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x40902f, _0x4d62fe, _0x479f2c) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x40902f,
                        'id': _0x4d62fe
                    }, {
                        'data': compress(_0x479f2c),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4f8a1e) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x4f8a1e['message']);
                }
            },
            async 'load'(_0x3ec718, _0x469edd) {
                try {
                    const _0x594c40 = await Msg['findOne']({
                        'jid': _0x3ec718,
                        'id': _0x469edd
                    });
                    return _0x594c40 ? decompress(_0x594c40['data']) : null;
                } catch (_0x2a3d2d) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x2a3d2d['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x44fa6a, _0x4e1cb5) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x44fa6a,
                        'userId': _0x4e1cb5
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x2cce58) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x2cce58['message']);
                }
            },
            async 'getCount'(_0x1e3464, _0x3d8fb8) {
                try {
                    const _0xa4f3ab = await MsgCount['findOne']({
                        'chatId': _0x1e3464,
                        'userId': _0x3d8fb8
                    });
                    return _0xa4f3ab ? _0xa4f3ab['count'] : 0x0;
                } catch (_0x55bf24) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x55bf24['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x2c104f = await MsgCount['find']({});
                    const _0x1da0aa = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2c104f['forEach'](_0x3352a1 => {
                        if (!_0x1da0aa['messageCount'][_0x3352a1['chatId']]) {
                            _0x1da0aa['messageCount'][_0x3352a1['chatId']] = {};
                        }
                        _0x1da0aa['messageCount'][_0x3352a1['chatId']][_0x3352a1['userId']] = _0x3352a1['count'];
                    });
                    const _0x4d4239 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x4d4239)
                        _0x1da0aa['isPublic'] = _0x4d4239['value'] === 'true';
                    return _0x1da0aa;
                } catch (_0x54d47a) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x54d47a['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x254d4b) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x254d4b['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x6bf0f0) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x6bf0f0['message']);
                }
            },
            async 'setMetadata'(_0x2306c0, _0x2ec198) {
                try {
                    await Meta['updateOne']({ 'key': _0x2306c0 }, {
                        'key': _0x2306c0,
                        'value': _0x2ec198['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x231840) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x231840['message']);
                }
            },
            async 'getMetadata'(_0x25bf81) {
                try {
                    const _0xa73c19 = await Meta['findOne']({ 'key': _0x25bf81 });
                    return _0xa73c19 ? _0xa73c19['value'] : null;
                } catch (_0x2fa0b7) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x2fa0b7['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x9c0de6, _0x2cb603) {
                try {
                    await Contact['updateOne']({ 'jid': _0x9c0de6 }, {
                        ..._0x2cb603,
                        'jid': _0x9c0de6,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5317e3) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x5317e3['message']);
                }
            },
            async 'getContact'(_0x446d3e) {
                try {
                    return await Contact['findOne']({ 'jid': _0x446d3e });
                } catch (_0x111ce0) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x111ce0['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x1d834d = await Contact['find']({});
                    const _0x28035a = {};
                    _0x1d834d['forEach'](_0x3c0488 => {
                        _0x28035a[_0x3c0488['jid']] = {
                            'id': _0x3c0488['jid'],
                            'name': _0x3c0488['name'],
                            'notify': _0x3c0488['notify']
                        };
                    });
                    return _0x28035a;
                } catch (_0x28de26) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x28de26['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x4c22d5, _0x42523e) {
                try {
                    await Chat['updateOne']({ 'jid': _0x4c22d5 }, {
                        ..._0x42523e,
                        'jid': _0x4c22d5,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x337adb) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x337adb['message']);
                }
            },
            async 'getChat'(_0x17e805) {
                try {
                    return await Chat['findOne']({ 'jid': _0x17e805 });
                } catch (_0x20f605) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x20f605['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x2ca4b6 = await Chat['find']({});
                    const _0x3c935d = {};
                    _0x2ca4b6['forEach'](_0x95154f => {
                        _0x3c935d[_0x95154f['jid']] = {
                            'id': _0x95154f['jid'],
                            'name': _0x95154f['name'],
                            'conversationTimestamp': _0x95154f['conversationTimestamp'],
                            'unreadCount': _0x95154f['unreadCount']
                        };
                    });
                    return _0x3c935d;
                } catch (_0x42e3be) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x42e3be['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x31fb69) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x31fb69 });
                } catch (_0x4eef49) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x4eef49['message']);
                }
            },
            async 'saveSetting'(_0x3d867f, _0x3df08f, _0x2b0cf7) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x3d867f,
                        'key': _0x3df08f
                    }, {
                        'chatId': _0x3d867f,
                        'key': _0x3df08f,
                        'value': _0x2b0cf7,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3c0cf4) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x3c0cf4['message']);
                }
            },
            async 'getSetting'(_0xb30f7a, _0x4d9d35) {
                try {
                    const _0x952d9b = await Setting['findOne']({
                        'chatId': _0xb30f7a,
                        'key': _0x4d9d35
                    });
                    return _0x952d9b ? _0x952d9b['value'] : null;
                } catch (_0x3df35d) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x3df35d['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x2f49fa) {
                try {
                    const _0x5e4d54 = await Setting['find']({ 'chatId': _0x2f49fa });
                    const _0x4286f5 = {};
                    _0x5e4d54['forEach'](_0x3646fa => {
                        _0x4286f5[_0x3646fa['key']] = _0x3646fa['value'];
                    });
                    return _0x4286f5;
                } catch (_0x4a811b) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x4a811b['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x3e3124 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x3e3124['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x3e3124['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x59ef89) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x59ef89['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0xe7878d) {
                    console['error']('[MONGO]\x20Close\x20error:', _0xe7878d['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x5c579f) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x5c579f['message']);
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
        pool['on']('error', _0x4ce04b => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x4ce04b['message']);
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
                        const _0x53b2dc = await pool['connect']();
                        try {
                            await _0x53b2dc['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x53b2dc['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x53b2dc['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x53b2dc['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x53b2dc['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x53b2dc['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x53b2dc['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x53b2dc['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x53b2dc['release']();
                        }
                    } catch (_0xb01874) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0xb01874['message']);
                        this['initPromise'] = null;
                        throw _0xb01874;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x358a5b, _0x934569, _0x166d22) {
                try {
                    await this['init']();
                    const _0x1069d2 = await pool['connect']();
                    try {
                        await _0x1069d2['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x358a5b,
                            _0x934569,
                            Date['now'](),
                            compress(_0x166d22)
                        ]);
                    } finally {
                        _0x1069d2['release']();
                    }
                } catch (_0x590710) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x590710['message']);
                }
            },
            async 'load'(_0x28bdc9, _0x29866d) {
                try {
                    await this['init']();
                    const _0x483186 = await pool['connect']();
                    try {
                        const _0xc336e3 = await _0x483186['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x28bdc9,
                            _0x29866d
                        ]);
                        return _0xc336e3['rows'][0x0] ? decompress(_0xc336e3['rows'][0x0]['data']) : null;
                    } finally {
                        _0x483186['release']();
                    }
                } catch (_0x3b005a) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x3b005a['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x1ef59c, _0x53e1d4) {
                try {
                    await this['init']();
                    const _0x1ea3d3 = await pool['connect']();
                    try {
                        await _0x1ea3d3['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x1ef59c,
                            _0x53e1d4
                        ]);
                    } finally {
                        _0x1ea3d3['release']();
                    }
                } catch (_0x41e235) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x41e235['message']);
                }
            },
            async 'getCount'(_0x29bcc1, _0x49809b) {
                try {
                    await this['init']();
                    const _0x273829 = await pool['connect']();
                    try {
                        const _0xb3e734 = await _0x273829['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x29bcc1,
                            _0x49809b
                        ]);
                        return _0xb3e734['rows'][0x0] ? _0xb3e734['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x273829['release']();
                    }
                } catch (_0x23dfaf) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x23dfaf['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x3d0591 = await pool['connect']();
                    try {
                        const _0x594352 = await _0x3d0591['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x251be8 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x594352['rows']['forEach'](_0x570544 => {
                            if (!_0x251be8['messageCount'][_0x570544['chat_id']]) {
                                _0x251be8['messageCount'][_0x570544['chat_id']] = {};
                            }
                            _0x251be8['messageCount'][_0x570544['chat_id']][_0x570544['user_id']] = _0x570544['count'];
                        });
                        const _0x241412 = await _0x3d0591['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x241412['rows'][0x0])
                            _0x251be8['isPublic'] = _0x241412['rows'][0x0]['value'] === 'true';
                        return _0x251be8;
                    } finally {
                        _0x3d0591['release']();
                    }
                } catch (_0x2542d4) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x2542d4['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x431994) {
                try {
                    await this['init']();
                    const _0x22a49e = await pool['connect']();
                    try {
                        await _0x22a49e['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x431994['toString']()]);
                    } finally {
                        _0x22a49e['release']();
                    }
                } catch (_0x33d9fc) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x33d9fc['message']);
                }
            },
            async 'setMetadata'(_0x2364bf, _0x5014b8) {
                try {
                    await this['init']();
                    const _0x5ccac2 = await pool['connect']();
                    try {
                        await _0x5ccac2['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x2364bf,
                            _0x5014b8['toString']()
                        ]);
                    } finally {
                        _0x5ccac2['release']();
                    }
                } catch (_0x55c84f) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x55c84f['message']);
                }
            },
            async 'getMetadata'(_0x175f88) {
                try {
                    await this['init']();
                    const _0x25830f = await pool['connect']();
                    try {
                        const _0x1bc24e = await _0x25830f['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x175f88]);
                        return _0x1bc24e['rows'][0x0] ? _0x1bc24e['rows'][0x0]['value'] : null;
                    } finally {
                        _0x25830f['release']();
                    }
                } catch (_0x111387) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x111387['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xdc200b, _0x4a235d) {
                try {
                    await this['init']();
                    const _0x4a5917 = await pool['connect']();
                    try {
                        await _0x4a5917['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0xdc200b,
                            _0x4a235d['name'] || '',
                            _0x4a235d['notify'] || '',
                            _0x4a235d['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x4a5917['release']();
                    }
                } catch (_0x3578f0) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x3578f0['message']);
                }
            },
            async 'getContact'(_0x3aaccb) {
                try {
                    await this['init']();
                    const _0x411549 = await pool['connect']();
                    try {
                        const _0x31ff5d = await _0x411549['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x3aaccb]);
                        return _0x31ff5d['rows'][0x0] || null;
                    } finally {
                        _0x411549['release']();
                    }
                } catch (_0x216b1e) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x216b1e['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0xfbbf64 = await pool['connect']();
                    try {
                        const _0x5d8243 = await _0xfbbf64['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x4dda63 = {};
                        _0x5d8243['rows']['forEach'](_0x752d92 => {
                            _0x4dda63[_0x752d92['jid']] = {
                                'id': _0x752d92['jid'],
                                'name': _0x752d92['name'],
                                'notify': _0x752d92['notify']
                            };
                        });
                        return _0x4dda63;
                    } finally {
                        _0xfbbf64['release']();
                    }
                } catch (_0x2a7741) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x2a7741['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x2834db, _0x21b768) {
                try {
                    await this['init']();
                    const _0x2dcf6e = await pool['connect']();
                    try {
                        await _0x2dcf6e['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x2834db,
                            _0x21b768['name'] || '',
                            _0x21b768['conversationTimestamp'] || 0x0,
                            _0x21b768['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x2dcf6e['release']();
                    }
                } catch (_0x2ab776) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x2ab776['message']);
                }
            },
            async 'getChat'(_0x6a1972) {
                try {
                    await this['init']();
                    const _0x40f740 = await pool['connect']();
                    try {
                        const _0x278f06 = await _0x40f740['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x6a1972]);
                        return _0x278f06['rows'][0x0] || null;
                    } finally {
                        _0x40f740['release']();
                    }
                } catch (_0x188e13) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x188e13['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x48e76c = await pool['connect']();
                    try {
                        const _0x2c93d4 = await _0x48e76c['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0xf07b0b = {};
                        _0x2c93d4['rows']['forEach'](_0x52a9be => {
                            _0xf07b0b[_0x52a9be['jid']] = {
                                'id': _0x52a9be['jid'],
                                'name': _0x52a9be['name'],
                                'conversationTimestamp': _0x52a9be['conversation_timestamp'],
                                'unreadCount': _0x52a9be['unread_count']
                            };
                        });
                        return _0xf07b0b;
                    } finally {
                        _0x48e76c['release']();
                    }
                } catch (_0x37c88e) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x37c88e['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x460ea9) {
                try {
                    await this['init']();
                    const _0x395532 = await pool['connect']();
                    try {
                        await _0x395532['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x460ea9]);
                    } finally {
                        _0x395532['release']();
                    }
                } catch (_0x37632c) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x37632c['message']);
                }
            },
            async 'saveSetting'(_0x2d677c, _0x3d88ae, _0x5e4ef1) {
                try {
                    await this['init']();
                    const _0x16b2b1 = await pool['connect']();
                    try {
                        await _0x16b2b1['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x2d677c,
                            _0x3d88ae,
                            JSON['stringify'](_0x5e4ef1),
                            Date['now']()
                        ]);
                    } finally {
                        _0x16b2b1['release']();
                    }
                } catch (_0x13307d) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x13307d['message']);
                }
            },
            async 'getSetting'(_0x1da342, _0xe92abd) {
                try {
                    await this['init']();
                    const _0x512f6b = await pool['connect']();
                    try {
                        const _0x5daae9 = await _0x512f6b['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x1da342,
                            _0xe92abd
                        ]);
                        return _0x5daae9['rows'][0x0] ? JSON['parse'](_0x5daae9['rows'][0x0]['value']) : null;
                    } finally {
                        _0x512f6b['release']();
                    }
                } catch (_0x1a57b5) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x1a57b5['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x4ce039) {
                try {
                    await this['init']();
                    const _0x1f146c = await pool['connect']();
                    try {
                        const _0x72f099 = await _0x1f146c['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x4ce039]);
                        const _0x48ff96 = {};
                        _0x72f099['rows']['forEach'](_0x55f89b => {
                            _0x48ff96[_0x55f89b['key']] = JSON['parse'](_0x55f89b['value']);
                        });
                        return _0x48ff96;
                    } finally {
                        _0x1f146c['release']();
                    }
                } catch (_0x291ae7) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x291ae7['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x846989 = await pool['connect']();
                    try {
                        const _0x2c0f94 = await _0x846989['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x2c0f94['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x2c0f94['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x846989['release']();
                    }
                } catch (_0x228959) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x228959['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0xda6c4e) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0xda6c4e['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x560ccb) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x560ccb['message']);
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
                    } catch (_0x541ce4) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x541ce4['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x541ce4;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x306c87, _0xf1180d, _0x25675f) {
                try {
                    const _0x2ec96a = await this['getConn']();
                    await _0x2ec96a['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x306c87,
                        _0xf1180d,
                        Date['now'](),
                        compress(_0x25675f)
                    ]);
                } catch (_0xdba92d) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0xdba92d['message']);
                }
            },
            async 'load'(_0x1eaad3, _0xa1bca3) {
                try {
                    const _0x3df8bc = await this['getConn']();
                    const [_0x2a9969] = await _0x3df8bc['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x1eaad3,
                        _0xa1bca3
                    ]);
                    return _0x2a9969[0x0] ? decompress(_0x2a9969[0x0]['data']) : null;
                } catch (_0x10a408) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x10a408['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0xf90764, _0x5de1f2) {
                try {
                    const _0x5ee792 = await this['getConn']();
                    await _0x5ee792['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0xf90764,
                        _0x5de1f2
                    ]);
                } catch (_0x5e34d4) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x5e34d4['message']);
                }
            },
            async 'getCount'(_0x31cdc7, _0x2064e4) {
                try {
                    const _0x27917b = await this['getConn']();
                    const [_0x5dc442] = await _0x27917b['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x31cdc7,
                        _0x2064e4
                    ]);
                    return _0x5dc442[0x0] ? _0x5dc442[0x0]['count'] : 0x0;
                } catch (_0xfb486b) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0xfb486b['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x32daa0 = await this['getConn']();
                    const [_0x3b1492] = await _0x32daa0['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x313227 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3b1492['forEach'](_0x27794c => {
                        if (!_0x313227['messageCount'][_0x27794c['chat_id']]) {
                            _0x313227['messageCount'][_0x27794c['chat_id']] = {};
                        }
                        _0x313227['messageCount'][_0x27794c['chat_id']][_0x27794c['user_id']] = _0x27794c['count'];
                    });
                    const [_0xffc3f1] = await _0x32daa0['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0xffc3f1[0x0])
                        _0x313227['isPublic'] = _0xffc3f1[0x0]['value'] === 'true';
                    return _0x313227;
                } catch (_0xadab5) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0xadab5['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x58af37) {
                try {
                    const _0x543fed = await this['getConn']();
                    await _0x543fed['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x58af37['toString']()]);
                } catch (_0x1d6d33) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x1d6d33['message']);
                }
            },
            async 'setMetadata'(_0x5efcef, _0x4f672a) {
                try {
                    const _0x33f5f5 = await this['getConn']();
                    await _0x33f5f5['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x5efcef,
                        _0x4f672a['toString']()
                    ]);
                } catch (_0x5a7995) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x5a7995['message']);
                }
            },
            async 'getMetadata'(_0x3d45a0) {
                try {
                    const _0xee3a6b = await this['getConn']();
                    const [_0xcdebfa] = await _0xee3a6b['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x3d45a0]);
                    return _0xcdebfa[0x0] ? _0xcdebfa[0x0]['value'] : null;
                } catch (_0x48584a) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x48584a['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x51b0da, _0x26e012) {
                try {
                    const _0x4492c6 = await this['getConn']();
                    await _0x4492c6['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x51b0da,
                        _0x26e012['name'] || '',
                        _0x26e012['notify'] || '',
                        _0x26e012['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0xd6c29f) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0xd6c29f['message']);
                }
            },
            async 'getContact'(_0x1a77a7) {
                try {
                    const _0x2351c3 = await this['getConn']();
                    const [_0x2830ad] = await _0x2351c3['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x1a77a7]);
                    return _0x2830ad[0x0] || null;
                } catch (_0x248c6d) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x248c6d['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x59b68a = await this['getConn']();
                    const [_0xe1b4e1] = await _0x59b68a['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x339299 = {};
                    _0xe1b4e1['forEach'](_0xb61ca8 => {
                        _0x339299[_0xb61ca8['jid']] = {
                            'id': _0xb61ca8['jid'],
                            'name': _0xb61ca8['name'],
                            'notify': _0xb61ca8['notify']
                        };
                    });
                    return _0x339299;
                } catch (_0x2116a9) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x2116a9['message']);
                    return {};
                }
            },
            async 'saveChat'(_0xb549a1, _0x4afb22) {
                try {
                    const _0x1deeee = await this['getConn']();
                    await _0x1deeee['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0xb549a1,
                        _0x4afb22['name'] || '',
                        _0x4afb22['conversationTimestamp'] || 0x0,
                        _0x4afb22['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x1d31b4) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x1d31b4['message']);
                }
            },
            async 'getChat'(_0x3eb91f) {
                try {
                    const _0x7fa28e = await this['getConn']();
                    const [_0x23d0b8] = await _0x7fa28e['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x3eb91f]);
                    return _0x23d0b8[0x0] || null;
                } catch (_0x5b56b1) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x5b56b1['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x169014 = await this['getConn']();
                    const [_0x57298e] = await _0x169014['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x472d49 = {};
                    _0x57298e['forEach'](_0x4120aa => {
                        _0x472d49[_0x4120aa['jid']] = {
                            'id': _0x4120aa['jid'],
                            'name': _0x4120aa['name'],
                            'conversationTimestamp': _0x4120aa['conversation_timestamp'],
                            'unreadCount': _0x4120aa['unread_count']
                        };
                    });
                    return _0x472d49;
                } catch (_0x46b12f) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x46b12f['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x549a31) {
                try {
                    const _0x27ae6c = await this['getConn']();
                    await _0x27ae6c['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x549a31]);
                } catch (_0x49a0e0) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x49a0e0['message']);
                }
            },
            async 'saveSetting'(_0x378e88, _0xccc7e2, _0x29d496) {
                try {
                    const _0x2ffabb = await this['getConn']();
                    await _0x2ffabb['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x378e88,
                        _0xccc7e2,
                        JSON['stringify'](_0x29d496),
                        Date['now']()
                    ]);
                } catch (_0xdfc01a) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0xdfc01a['message']);
                }
            },
            async 'getSetting'(_0x2723b5, _0x21303d) {
                try {
                    const _0x38c88d = await this['getConn']();
                    const [_0x514767] = await _0x38c88d['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x2723b5,
                        _0x21303d
                    ]);
                    return _0x514767[0x0] ? JSON['parse'](_0x514767[0x0]['value']) : null;
                } catch (_0x4cb6e3) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x4cb6e3['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x23eb85) {
                try {
                    const _0x95e9b = await this['getConn']();
                    const [_0x23aaa7] = await _0x95e9b['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x23eb85]);
                    const _0x2668e0 = {};
                    _0x23aaa7['forEach'](_0x325da7 => {
                        _0x2668e0[_0x325da7['key']] = JSON['parse'](_0x325da7['value']);
                    });
                    return _0x2668e0;
                } catch (_0x561096) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x561096['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x254681 = await this['getConn']();
                    const [_0x5749f7] = await _0x254681['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x5749f7['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x5749f7['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x495aa9) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x495aa9['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x18532e) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x18532e['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x315e0e) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x315e0e['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x393cf3['dirname'](SQLITE_URL);
        if (!_0x0_0x41a38e['existsSync'](dir))
            _0x0_0x41a38e['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x2d47dc, _0xdfb4a3, _0x230729) {
                try {
                    saveStmt['run'](_0x2d47dc, _0xdfb4a3, Date['now'](), compress(_0x230729));
                    const {count: _0x32c7c7} = countStmt['get'](_0x2d47dc);
                    if (_0x32c7c7 > MESSAGE_LIMITS['sqlite']) {
                        const _0x56625e = _0x32c7c7 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x2d47dc, _0x2d47dc, _0x56625e);
                    }
                } catch (_0x10c23a) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x10c23a['message']);
                }
            },
            'load'(_0x4dc559, _0x4059d2) {
                try {
                    const _0x106728 = loadStmt['get'](_0x4dc559, _0x4059d2);
                    return _0x106728 ? decompress(_0x106728['data']) : null;
                } catch (_0x51330a) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x51330a['message']);
                    return null;
                }
            },
            'incrementCount'(_0x2bac2a, _0x35a068) {
                try {
                    incrementCountStmt['run'](_0x2bac2a, _0x35a068);
                } catch (_0x1aaf7b) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x1aaf7b['message']);
                }
            },
            'getCount'(_0x429d49, _0x42dd07) {
                try {
                    const _0x28b531 = getCountStmt['get'](_0x429d49, _0x42dd07);
                    return _0x28b531 ? _0x28b531['count'] : 0x0;
                } catch (_0x5435c8) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x5435c8['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x1056ac = getAllCountsStmt['all']();
                    const _0x1b80cc = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x1056ac['forEach'](_0x458d9a => {
                        if (!_0x1b80cc['messageCount'][_0x458d9a['chat_id']]) {
                            _0x1b80cc['messageCount'][_0x458d9a['chat_id']] = {};
                        }
                        _0x1b80cc['messageCount'][_0x458d9a['chat_id']][_0x458d9a['user_id']] = _0x458d9a['count'];
                    });
                    const _0x3b3498 = getMetaStmt['get']();
                    if (_0x3b3498)
                        _0x1b80cc['isPublic'] = _0x3b3498['value'] === 'true';
                    return _0x1b80cc;
                } catch (_0x56eec5) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x56eec5['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x29db14) {
                try {
                    setMetaStmt['run'](_0x29db14['toString']());
                } catch (_0x329339) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x329339['message']);
                }
            },
            'setMetadata'(_0x514073, _0x1783e8) {
                try {
                    setMetadataStmt['run'](_0x514073, _0x1783e8['toString']());
                } catch (_0x25eef2) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x25eef2['message']);
                }
            },
            'getMetadata'(_0x4670c0) {
                try {
                    const _0x4426f3 = getMetadataStmt['get'](_0x4670c0);
                    return _0x4426f3 ? _0x4426f3['value'] : null;
                } catch (_0x3e4bf9) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x3e4bf9['message']);
                    return null;
                }
            },
            'saveContact'(_0x518888, _0x388825) {
                try {
                    saveContactStmt['run'](_0x518888, _0x388825['name'] || '', _0x388825['notify'] || '', _0x388825['verifiedName'] || '', Date['now']());
                } catch (_0x2645ae) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x2645ae['message']);
                }
            },
            'getContact'(_0x30e1a4) {
                try {
                    return getContactStmt['get'](_0x30e1a4) || null;
                } catch (_0x22f44d) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x22f44d['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x1aa9c3 = getAllContactsStmt['all']();
                    const _0x48b615 = {};
                    _0x1aa9c3['forEach'](_0x396f1b => {
                        _0x48b615[_0x396f1b['jid']] = {
                            'id': _0x396f1b['jid'],
                            'name': _0x396f1b['name'],
                            'notify': _0x396f1b['notify']
                        };
                    });
                    return _0x48b615;
                } catch (_0x5e8ee0) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x5e8ee0['message']);
                    return {};
                }
            },
            'saveChat'(_0x20e092, _0x3d0549) {
                try {
                    saveChatStmt['run'](_0x20e092, _0x3d0549['name'] || '', _0x3d0549['conversationTimestamp'] || 0x0, _0x3d0549['unreadCount'] || 0x0, Date['now']());
                } catch (_0x5e8c1d) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x5e8c1d['message']);
                }
            },
            'getChat'(_0x926c36) {
                try {
                    return getChatStmt['get'](_0x926c36) || null;
                } catch (_0x37dcbf) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x37dcbf['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x3dedd0 = getAllChatsStmt['all']();
                    const _0x458e4b = {};
                    _0x3dedd0['forEach'](_0x40c51b => {
                        _0x458e4b[_0x40c51b['jid']] = {
                            'id': _0x40c51b['jid'],
                            'name': _0x40c51b['name'],
                            'conversationTimestamp': _0x40c51b['conversation_timestamp'],
                            'unreadCount': _0x40c51b['unread_count']
                        };
                    });
                    return _0x458e4b;
                } catch (_0x1fec06) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x1fec06['message']);
                    return {};
                }
            },
            'deleteChat'(_0x310de3) {
                try {
                    deleteChatStmt['run'](_0x310de3);
                } catch (_0x55429e) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x55429e['message']);
                }
            },
            'saveSetting'(_0x5cac91, _0x357d31, _0x3ea5b2) {
                try {
                    saveSettingStmt['run'](_0x5cac91, _0x357d31, JSON['stringify'](_0x3ea5b2), Date['now']());
                } catch (_0x5b1eaf) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x5b1eaf['message']);
                }
            },
            'getSetting'(_0x43c46f, _0x4dc5cb) {
                try {
                    const _0x1aca73 = getSettingStmt['get'](_0x43c46f, _0x4dc5cb);
                    return _0x1aca73 ? JSON['parse'](_0x1aca73['value']) : null;
                } catch (_0x114c68) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x114c68['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x52e342) {
                try {
                    const _0x282fd1 = getAllSettingsStmt['all'](_0x52e342);
                    const _0x2995e5 = {};
                    _0x282fd1['forEach'](_0x33ee2b => {
                        _0x2995e5[_0x33ee2b['key']] = JSON['parse'](_0x33ee2b['value']);
                    });
                    return _0x2995e5;
                } catch (_0x24edd) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x24edd['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x32b12f = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x32b12f['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x32b12f['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x15bb88) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x15bb88['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x3f75d5) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x3f75d5['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x5a5e5a) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x5a5e5a['message']);
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
    async 'readFromFile'(_0x288318 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x22b6a4 = await adapters[backend]['getAllContacts']();
                const _0x5e8965 = await adapters[backend]['getAllChats']();
                const _0x4c84e3 = await this['getBotMode']();
                this['contacts'] = _0x22b6a4;
                this['chats'] = _0x5e8965;
                this['botMode'] = _0x4c84e3;
            } else {
                if (_0x0_0x41a38e['existsSync'](_0x288318)) {
                    const _0x565454 = JSON['parse'](_0x0_0x41a38e['readFileSync'](_0x288318, 'utf-8'));
                    this['contacts'] = _0x565454['contacts'] || {};
                    this['chats'] = _0x565454['chats'] || {};
                    this['botMode'] = _0x565454['botMode'] || 'private';
                    this['messages'] = _0x565454['messages'] || {};
                    this['isPublic'] = _0x565454['isPublic'] !== undefined ? _0x565454['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x5e9e9a) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x5e9e9a['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x36130a = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x13d94b = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x41a38e['writeFileSync'](_0x36130a, JSON['stringify'](_0x13d94b, null, 0x2));
        } catch (_0x358e12) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x358e12['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x41a38e['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x4ad788 = JSON['parse'](_0x0_0x41a38e['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x4ad788['messageCount'] || _0x4ad788;
                    this['isPublic'] = typeof _0x4ad788['isPublic'] === 'boolean' ? _0x4ad788['isPublic'] : ![];
                }
            } catch (_0xa79319) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0xa79319['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x456a94 = _0x0_0x393cf3['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x41a38e['existsSync'](_0x456a94))
                    _0x0_0x41a38e['mkdirSync'](_0x456a94, { 'recursive': !![] });
                const _0x394989 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x41a38e['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x394989, null, 0x2));
            } catch (_0x428303) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x428303['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x4f6c60 => {
                if (typeof this['messages'][_0x4f6c60] === 'object' && !Array['isArray'](this['messages'][_0x4f6c60])) {
                    const _0x22b0e9 = Object['values'](this['messages'][_0x4f6c60]);
                    this['messages'][_0x4f6c60] = _0x22b0e9['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x4f6c60])) {
                    if (this['messages'][_0x4f6c60]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x4f6c60] = this['messages'][_0x4f6c60]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x268fc2 => {
                if (this['chats'][_0x268fc2]['messages']) {
                    delete this['chats'][_0x268fc2]['messages'];
                }
            });
        }
    },
    'bind'(_0x2d5977) {
        _0x2d5977['on']('messages.upsert', async ({messages: _0x111f95}) => {
            for (const _0x55da03 of _0x111f95) {
                if (!_0x55da03['key']?.['remoteJid'])
                    continue;
                const _0x1b354c = _0x55da03['key']['remoteJid'];
                const _0x2146ae = slimMessage(_0x55da03);
                if (backend === 'memory') {
                    this['messages'][_0x1b354c] = this['messages'][_0x1b354c] || [];
                    this['messages'][_0x1b354c]['push'](_0x2146ae);
                    if (this['messages'][_0x1b354c]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x1b354c] = this['messages'][_0x1b354c]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x1b354c, _0x55da03['key']['id'], _0x2146ae);
                    } catch (_0xe7bfe5) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x55da03['key']['id'] + ':', _0xe7bfe5['message']);
                    }
                }
            }
        });
        _0x2d5977['on']('contacts.update', async _0x48cbee => {
            for (const _0x55ee79 of _0x48cbee) {
                if (_0x55ee79['id']) {
                    const _0x324504 = {
                        'id': _0x55ee79['id'],
                        'name': _0x55ee79['notify'] || _0x55ee79['name'] || _0x55ee79['verifiedName'] || '',
                        'notify': _0x55ee79['notify'],
                        'verifiedName': _0x55ee79['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x55ee79['id']] = _0x324504;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x55ee79['id'], _0x324504);
                        } catch (_0x41a4d5) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x41a4d5['message']);
                        }
                    }
                }
            }
        });
        _0x2d5977['on']('contacts.set', async _0xfe44e5 => {
            for (const _0x48da6d of _0xfe44e5) {
                if (_0x48da6d['id']) {
                    const _0x6c0e8f = {
                        'id': _0x48da6d['id'],
                        'name': _0x48da6d['notify'] || _0x48da6d['name'] || _0x48da6d['verifiedName'] || '',
                        'notify': _0x48da6d['notify'],
                        'verifiedName': _0x48da6d['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x48da6d['id']] = _0x6c0e8f;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x48da6d['id'], _0x6c0e8f);
                        } catch (_0x464f5b) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x464f5b['message']);
                        }
                    }
                }
            }
        });
        _0x2d5977['on']('chats.set', async _0x573371 => {
            for (const _0x50832c of _0x573371) {
                if (_0x50832c['id']) {
                    const _0x1a8128 = {
                        'id': _0x50832c['id'],
                        'name': _0x50832c['name'] || _0x50832c['subject'] || '',
                        'conversationTimestamp': _0x50832c['conversationTimestamp'],
                        'unreadCount': _0x50832c['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x50832c['id']] = _0x1a8128;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x50832c['id'], _0x1a8128);
                        } catch (_0x2070f9) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x2070f9['message']);
                        }
                    }
                }
            }
        });
        _0x2d5977['on']('chats.update', async _0x570001 => {
            for (const _0x45e8f3 of _0x570001) {
                if (_0x45e8f3['id']) {
                    if (backend === 'memory') {
                        const _0x36a0eb = this['chats'][_0x45e8f3['id']] || {};
                        this['chats'][_0x45e8f3['id']] = {
                            'id': _0x45e8f3['id'],
                            'name': _0x45e8f3['name'] || _0x45e8f3['subject'] || _0x36a0eb['name'] || '',
                            'conversationTimestamp': _0x45e8f3['conversationTimestamp'] || _0x36a0eb['conversationTimestamp'],
                            'unreadCount': _0x45e8f3['unreadCount'] !== undefined ? _0x45e8f3['unreadCount'] : _0x36a0eb['unreadCount']
                        };
                    } else {
                        try {
                            const _0xefa86b = await adapters[backend]['getChat'](_0x45e8f3['id']) || {};
                            const _0x55708c = {
                                'id': _0x45e8f3['id'],
                                'name': _0x45e8f3['name'] || _0x45e8f3['subject'] || _0xefa86b['name'] || '',
                                'conversationTimestamp': _0x45e8f3['conversationTimestamp'] || _0xefa86b['conversation_timestamp'],
                                'unreadCount': _0x45e8f3['unreadCount'] !== undefined ? _0x45e8f3['unreadCount'] : _0xefa86b['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x45e8f3['id'], _0x55708c);
                        } catch (_0x5c608f) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x5c608f['message']);
                        }
                    }
                }
            }
        });
        _0x2d5977['on']('chats.delete', async _0x2c0c94 => {
            for (const _0x54a210 of _0x2c0c94) {
                if (backend === 'memory') {
                    delete this['chats'][_0x54a210];
                    delete this['messages'][_0x54a210];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x54a210);
                    } catch (_0x5a63a5) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x5a63a5['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x4a73d9, _0x2b0e4c) {
        if (backend === 'memory') {
            const _0x26ab63 = this['messages'][_0x4a73d9]?.['find'](_0x34ded4 => _0x34ded4['key']['id'] === _0x2b0e4c) || null;
            return _0x26ab63;
        } else {
            try {
                return await adapters[backend]['load'](_0x4a73d9, _0x2b0e4c);
            } catch (_0x429532) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x2b0e4c + ':', _0x429532['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x499ba4, _0x4be5dd, _0x10c072) {
        if (backend === 'memory') {
            const _0x2c8ab2 = './data';
            if (!_0x0_0x41a38e['existsSync'](_0x2c8ab2))
                _0x0_0x41a38e['mkdirSync'](_0x2c8ab2, { 'recursive': !![] });
            const _0x91cdb8 = _0x0_0x393cf3['join'](_0x2c8ab2, _0x4be5dd + '.json');
            try {
                _0x0_0x41a38e['writeFileSync'](_0x91cdb8, JSON['stringify'](_0x10c072, null, 0x2));
            } catch (_0x56df62) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x4be5dd + ':', _0x56df62['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x499ba4, _0x4be5dd, _0x10c072);
            } catch (_0x39f612) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x4be5dd + ':', _0x39f612['message']);
            }
        }
    },
    async 'getSetting'(_0x53499b, _0x434ab9) {
        if (backend === 'memory') {
            const _0x3e452b = './data';
            const _0x2fb569 = _0x0_0x393cf3['join'](_0x3e452b, _0x434ab9 + '.json');
            try {
                if (_0x0_0x41a38e['existsSync'](_0x2fb569)) {
                    const _0x3f0aab = JSON['parse'](_0x0_0x41a38e['readFileSync'](_0x2fb569, 'utf-8'));
                    if (_0x3f0aab['enabled'] !== undefined)
                        return _0x3f0aab;
                    if (_0x3f0aab[_0x53499b] !== undefined)
                        return _0x3f0aab[_0x53499b];
                    return null;
                }
                return null;
            } catch (_0x5ace0d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x434ab9 + ':', _0x5ace0d['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x53499b, _0x434ab9);
            } catch (_0x1d5300) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x434ab9 + ':', _0x1d5300['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x41021d) {
        if (backend === 'memory') {
            const _0x8b9098 = './data';
            const _0x4f5ce5 = {};
            try {
                if (_0x0_0x41a38e['existsSync'](_0x8b9098)) {
                    const _0x5005b6 = _0x0_0x41a38e['readdirSync'](_0x8b9098)['filter'](_0x4ef5db => _0x4ef5db['endsWith']('.json'));
                    for (const _0xf17719 of _0x5005b6) {
                        const _0x18bc4c = _0x0_0x393cf3['basename'](_0xf17719, '.json');
                        if (_0x18bc4c === 'messageCount' || _0x18bc4c === 'owner')
                            continue;
                        const _0x49e50d = _0x0_0x393cf3['join'](_0x8b9098, _0xf17719);
                        const _0x204fa5 = JSON['parse'](_0x0_0x41a38e['readFileSync'](_0x49e50d, 'utf-8'));
                        if (_0x204fa5[_0x41021d]) {
                            _0x4f5ce5[_0x18bc4c] = _0x204fa5[_0x41021d];
                        }
                    }
                }
                return _0x4f5ce5;
            } catch (_0x3090e3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x3090e3['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x41021d);
            } catch (_0x19fbc3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x19fbc3['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x3d4c84) {
        const _0xdf1573 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0xdf1573['includes'](_0x3d4c84)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x3d4c84 + ',\x20defaulting\x20to\x20private');
            _0x3d4c84 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x3d4c84;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x3d4c84);
            } catch (_0x5ac1fc) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x5ac1fc['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x5592a5 = await adapters[backend]['getMetadata']('botMode');
                return _0x5592a5 || 'private';
            } catch (_0x28614b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x28614b['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x304b1c, _0x238452, _0x95f94b) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x304b1c]) {
                this['messageCount'][_0x304b1c] = {};
            }
            if (!this['messageCount'][_0x304b1c][_0x238452]) {
                this['messageCount'][_0x304b1c][_0x238452] = 0x0;
            }
            this['messageCount'][_0x304b1c][_0x238452]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x304b1c, _0x238452);
            } catch (_0x473d6d) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x238452 + ':', _0x473d6d['message']);
            }
        }
    },
    async 'getMessageCount'(_0x187ab5, _0x3d52fc) {
        if (backend === 'memory') {
            return this['messageCount'][_0x187ab5]?.[_0x3d52fc] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x187ab5, _0x3d52fc);
            } catch (_0x4c0ca2) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x3d52fc + ':', _0x4c0ca2['message']);
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
            } catch (_0x30e958) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x30e958['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x543616) {
        if (backend === 'memory') {
            this['isPublic'] = _0x543616;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x543616);
            } catch (_0x58fbee) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x58fbee['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x2be835 = await adapters[backend]['getAllCounts']();
                return _0x2be835['isPublic'];
            } catch (_0x52e46b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x52e46b['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x5ef739) {
        const _0x240122 = [
            'public',
            'private'
        ];
        if (!_0x240122['includes'](_0x5ef739)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x5ef739);
            _0x5ef739 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x5ef739;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x5ef739);
            } catch (_0x158e4a) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x158e4a['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x3abc27 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x3abc27 || 'private';
            } catch (_0x4bfef3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x4bfef3['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x40ba98 = 0x0;
        const _0xcc14ca = Object['keys'](this['contacts'])['length'];
        const _0x7775a2 = Object['keys'](this['chats'])['length'];
        let _0x22951f = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x822b64 => {
                if (Array['isArray'](_0x822b64)) {
                    _0x40ba98 += _0x822b64['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x568be0 => {
                if (typeof _0x568be0 === 'object') {
                    _0x22951f += Object['keys'](_0x568be0)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x40ba98 : 'stored\x20in\x20database',
            'contacts': _0xcc14ca,
            'chats': _0x7775a2,
            'messageCounts': backend === 'memory' ? _0x22951f : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x1c7ebc => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x1c7ebc));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x31b9dd => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x31b9dd));
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
        let _0x2707b0 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x44ff0d => {
            if (store['chats'][_0x44ff0d]['messages']) {
                delete store['chats'][_0x44ff0d]['messages'];
                _0x2707b0++;
            }
        });
        if (_0x2707b0 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x2707b0 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x45e397 => {
    console['log']('[STORE]\x20Received\x20' + _0x45e397 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x4e3dd5) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x4e3dd5['message']);
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
process['on']('uncaughtException', _0x3b4bc3 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x3b4bc3);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x452db6, _0x45b4fc) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x45b4fc, 'reason:', _0x452db6);
});
export default store;