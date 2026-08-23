import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x590f44 from 'fs';
import _0x0_0x32240c from 'path';
import _0x0_0x209177 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x1ee82c) {
    printLog = (_0x2b6ee9, _0xd26a9c) => console['log']('[' + _0x2b6ee9['toUpperCase']() + ']\x20' + _0xd26a9c);
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
} catch (_0x0_0x8484f6) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x4f9a87 => {
    try {
        return _0x0_0x209177['deflateSync'](JSON['stringify'](_0x4f9a87));
    } catch (_0x3c0744) {
        console['error']('[STORE]\x20Compression\x20error:', _0x3c0744['message']);
        return Buffer['from'](JSON['stringify'](_0x4f9a87));
    }
};
const decompress = _0x3b3457 => {
    try {
        return JSON['parse'](_0x0_0x209177['inflateSync'](_0x3b3457));
    } catch (_0x3d0f09) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x3d0f09['message']);
        try {
            return JSON['parse'](_0x3b3457['toString']());
        } catch (_0x3e7290) {
            return null;
        }
    }
};
function slimMessage(_0x1f75eb) {
    return {
        'key': _0x1f75eb['key'],
        'message': _0x1f75eb['message'],
        'messageTimestamp': _0x1f75eb['messageTimestamp'],
        'participant': _0x1f75eb['participant'],
        'pushName': _0x1f75eb['pushName'],
        'broadcast': _0x1f75eb['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x4d1cfe => console['error']('[MONGO]\x20Connection\x20error:', _0x4d1cfe));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x50704e, _0xe85e40, _0x1fe521) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x50704e,
                        'id': _0xe85e40
                    }, {
                        'data': compress(_0x1fe521),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x52b900) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x52b900['message']);
                }
            },
            async 'load'(_0xe9e7c8, _0x241198) {
                try {
                    const _0x4da8c4 = await Msg['findOne']({
                        'jid': _0xe9e7c8,
                        'id': _0x241198
                    });
                    return _0x4da8c4 ? decompress(_0x4da8c4['data']) : null;
                } catch (_0x49c686) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x49c686['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x406c2a, _0x6b4cdb) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x406c2a,
                        'userId': _0x6b4cdb
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x3985e0) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x3985e0['message']);
                }
            },
            async 'getCount'(_0x551148, _0xe29fb6) {
                try {
                    const _0x4bd9aa = await MsgCount['findOne']({
                        'chatId': _0x551148,
                        'userId': _0xe29fb6
                    });
                    return _0x4bd9aa ? _0x4bd9aa['count'] : 0x0;
                } catch (_0x28f025) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x28f025['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x36a171 = await MsgCount['find']({});
                    const _0x1f450e = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x36a171['forEach'](_0x55bc0a => {
                        if (!_0x1f450e['messageCount'][_0x55bc0a['chatId']]) {
                            _0x1f450e['messageCount'][_0x55bc0a['chatId']] = {};
                        }
                        _0x1f450e['messageCount'][_0x55bc0a['chatId']][_0x55bc0a['userId']] = _0x55bc0a['count'];
                    });
                    const _0x3f3865 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x3f3865)
                        _0x1f450e['isPublic'] = _0x3f3865['value'] === 'true';
                    return _0x1f450e;
                } catch (_0x1d1666) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x1d1666['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x5ea04d) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x5ea04d['toString']()
                    }, { 'upsert': !![] });
                } catch (_0xc5f415) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0xc5f415['message']);
                }
            },
            async 'setMetadata'(_0x343d7f, _0x8a0c27) {
                try {
                    await Meta['updateOne']({ 'key': _0x343d7f }, {
                        'key': _0x343d7f,
                        'value': _0x8a0c27['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x5be387) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x5be387['message']);
                }
            },
            async 'getMetadata'(_0x158163) {
                try {
                    const _0x53a67a = await Meta['findOne']({ 'key': _0x158163 });
                    return _0x53a67a ? _0x53a67a['value'] : null;
                } catch (_0xbb8a) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0xbb8a['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x375396, _0x3037f2) {
                try {
                    await Contact['updateOne']({ 'jid': _0x375396 }, {
                        ..._0x3037f2,
                        'jid': _0x375396,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0xc4fb9) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0xc4fb9['message']);
                }
            },
            async 'getContact'(_0x10a6b7) {
                try {
                    return await Contact['findOne']({ 'jid': _0x10a6b7 });
                } catch (_0x2a41db) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x2a41db['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x3953f0 = await Contact['find']({});
                    const _0x5da142 = {};
                    _0x3953f0['forEach'](_0x28de24 => {
                        _0x5da142[_0x28de24['jid']] = {
                            'id': _0x28de24['jid'],
                            'name': _0x28de24['name'],
                            'notify': _0x28de24['notify']
                        };
                    });
                    return _0x5da142;
                } catch (_0xc26777) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0xc26777['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x124b2e, _0x530317) {
                try {
                    await Chat['updateOne']({ 'jid': _0x124b2e }, {
                        ..._0x530317,
                        'jid': _0x124b2e,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4c3b18) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x4c3b18['message']);
                }
            },
            async 'getChat'(_0x318f30) {
                try {
                    return await Chat['findOne']({ 'jid': _0x318f30 });
                } catch (_0x9f0289) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x9f0289['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x204344 = await Chat['find']({});
                    const _0x11a318 = {};
                    _0x204344['forEach'](_0xe2bcd0 => {
                        _0x11a318[_0xe2bcd0['jid']] = {
                            'id': _0xe2bcd0['jid'],
                            'name': _0xe2bcd0['name'],
                            'conversationTimestamp': _0xe2bcd0['conversationTimestamp'],
                            'unreadCount': _0xe2bcd0['unreadCount']
                        };
                    });
                    return _0x11a318;
                } catch (_0x1f09c9) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x1f09c9['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x11a59e) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x11a59e });
                } catch (_0x104ff4) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x104ff4['message']);
                }
            },
            async 'saveSetting'(_0x57ffb5, _0x4f945b, _0x3460a7) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x57ffb5,
                        'key': _0x4f945b
                    }, {
                        'chatId': _0x57ffb5,
                        'key': _0x4f945b,
                        'value': _0x3460a7,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3dd2fc) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x3dd2fc['message']);
                }
            },
            async 'getSetting'(_0x285dac, _0x3df5db) {
                try {
                    const _0x3c37c8 = await Setting['findOne']({
                        'chatId': _0x285dac,
                        'key': _0x3df5db
                    });
                    return _0x3c37c8 ? _0x3c37c8['value'] : null;
                } catch (_0x474bad) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x474bad['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x43d99a) {
                try {
                    const _0x314a25 = await Setting['find']({ 'chatId': _0x43d99a });
                    const _0x2a25dd = {};
                    _0x314a25['forEach'](_0x14b9e2 => {
                        _0x2a25dd[_0x14b9e2['key']] = _0x14b9e2['value'];
                    });
                    return _0x2a25dd;
                } catch (_0x1e2ddc) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x1e2ddc['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x1963bc = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x1963bc['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x1963bc['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x21a94e) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x21a94e['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x25df65) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x25df65['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x184c5d) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x184c5d['message']);
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
        pool['on']('error', _0x3a7e67 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x3a7e67['message']);
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
                        const _0xda3259 = await pool['connect']();
                        try {
                            await _0xda3259['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xda3259['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0xda3259['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0xda3259['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xda3259['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xda3259['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xda3259['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xda3259['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0xda3259['release']();
                        }
                    } catch (_0x285107) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x285107['message']);
                        this['initPromise'] = null;
                        throw _0x285107;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x369d7d, _0x4a1d3f, _0x43c2c2) {
                try {
                    await this['init']();
                    const _0x3f170d = await pool['connect']();
                    try {
                        await _0x3f170d['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x369d7d,
                            _0x4a1d3f,
                            Date['now'](),
                            compress(_0x43c2c2)
                        ]);
                    } finally {
                        _0x3f170d['release']();
                    }
                } catch (_0x4df488) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x4df488['message']);
                }
            },
            async 'load'(_0x17ed19, _0x3d3c17) {
                try {
                    await this['init']();
                    const _0x381c18 = await pool['connect']();
                    try {
                        const _0x3c91ed = await _0x381c18['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x17ed19,
                            _0x3d3c17
                        ]);
                        return _0x3c91ed['rows'][0x0] ? decompress(_0x3c91ed['rows'][0x0]['data']) : null;
                    } finally {
                        _0x381c18['release']();
                    }
                } catch (_0xa1fae0) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0xa1fae0['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x3050a1, _0x36b975) {
                try {
                    await this['init']();
                    const _0x45423b = await pool['connect']();
                    try {
                        await _0x45423b['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x3050a1,
                            _0x36b975
                        ]);
                    } finally {
                        _0x45423b['release']();
                    }
                } catch (_0x32e892) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x32e892['message']);
                }
            },
            async 'getCount'(_0x45d3d3, _0x529df6) {
                try {
                    await this['init']();
                    const _0x505d9b = await pool['connect']();
                    try {
                        const _0x4f7366 = await _0x505d9b['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x45d3d3,
                            _0x529df6
                        ]);
                        return _0x4f7366['rows'][0x0] ? _0x4f7366['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x505d9b['release']();
                    }
                } catch (_0x464d17) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x464d17['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0xa394ae = await pool['connect']();
                    try {
                        const _0x2f0006 = await _0xa394ae['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x47ce2e = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x2f0006['rows']['forEach'](_0xad4493 => {
                            if (!_0x47ce2e['messageCount'][_0xad4493['chat_id']]) {
                                _0x47ce2e['messageCount'][_0xad4493['chat_id']] = {};
                            }
                            _0x47ce2e['messageCount'][_0xad4493['chat_id']][_0xad4493['user_id']] = _0xad4493['count'];
                        });
                        const _0x260149 = await _0xa394ae['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x260149['rows'][0x0])
                            _0x47ce2e['isPublic'] = _0x260149['rows'][0x0]['value'] === 'true';
                        return _0x47ce2e;
                    } finally {
                        _0xa394ae['release']();
                    }
                } catch (_0x11098d) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x11098d['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x146aa7) {
                try {
                    await this['init']();
                    const _0x39f382 = await pool['connect']();
                    try {
                        await _0x39f382['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x146aa7['toString']()]);
                    } finally {
                        _0x39f382['release']();
                    }
                } catch (_0xfe7a90) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0xfe7a90['message']);
                }
            },
            async 'setMetadata'(_0xb47d17, _0x115e91) {
                try {
                    await this['init']();
                    const _0x50708f = await pool['connect']();
                    try {
                        await _0x50708f['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0xb47d17,
                            _0x115e91['toString']()
                        ]);
                    } finally {
                        _0x50708f['release']();
                    }
                } catch (_0x37f295) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x37f295['message']);
                }
            },
            async 'getMetadata'(_0x113c56) {
                try {
                    await this['init']();
                    const _0x1e28af = await pool['connect']();
                    try {
                        const _0x5c9618 = await _0x1e28af['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x113c56]);
                        return _0x5c9618['rows'][0x0] ? _0x5c9618['rows'][0x0]['value'] : null;
                    } finally {
                        _0x1e28af['release']();
                    }
                } catch (_0xf6f36) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0xf6f36['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x3365ad, _0x3e46ad) {
                try {
                    await this['init']();
                    const _0x5ca7eb = await pool['connect']();
                    try {
                        await _0x5ca7eb['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x3365ad,
                            _0x3e46ad['name'] || '',
                            _0x3e46ad['notify'] || '',
                            _0x3e46ad['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x5ca7eb['release']();
                    }
                } catch (_0x56f79f) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x56f79f['message']);
                }
            },
            async 'getContact'(_0x4ea61a) {
                try {
                    await this['init']();
                    const _0x4aa9d5 = await pool['connect']();
                    try {
                        const _0x6623c7 = await _0x4aa9d5['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x4ea61a]);
                        return _0x6623c7['rows'][0x0] || null;
                    } finally {
                        _0x4aa9d5['release']();
                    }
                } catch (_0x1279d4) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x1279d4['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x451e10 = await pool['connect']();
                    try {
                        const _0x3b0183 = await _0x451e10['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0xae05de = {};
                        _0x3b0183['rows']['forEach'](_0x2ee4ad => {
                            _0xae05de[_0x2ee4ad['jid']] = {
                                'id': _0x2ee4ad['jid'],
                                'name': _0x2ee4ad['name'],
                                'notify': _0x2ee4ad['notify']
                            };
                        });
                        return _0xae05de;
                    } finally {
                        _0x451e10['release']();
                    }
                } catch (_0x57be67) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x57be67['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x1999bf, _0x42e352) {
                try {
                    await this['init']();
                    const _0x30b16f = await pool['connect']();
                    try {
                        await _0x30b16f['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x1999bf,
                            _0x42e352['name'] || '',
                            _0x42e352['conversationTimestamp'] || 0x0,
                            _0x42e352['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x30b16f['release']();
                    }
                } catch (_0x3f9e32) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x3f9e32['message']);
                }
            },
            async 'getChat'(_0x825888) {
                try {
                    await this['init']();
                    const _0x4bfa7b = await pool['connect']();
                    try {
                        const _0x441157 = await _0x4bfa7b['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x825888]);
                        return _0x441157['rows'][0x0] || null;
                    } finally {
                        _0x4bfa7b['release']();
                    }
                } catch (_0x1c700b) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x1c700b['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x56b213 = await pool['connect']();
                    try {
                        const _0x1d2f53 = await _0x56b213['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x59d66d = {};
                        _0x1d2f53['rows']['forEach'](_0x5da553 => {
                            _0x59d66d[_0x5da553['jid']] = {
                                'id': _0x5da553['jid'],
                                'name': _0x5da553['name'],
                                'conversationTimestamp': _0x5da553['conversation_timestamp'],
                                'unreadCount': _0x5da553['unread_count']
                            };
                        });
                        return _0x59d66d;
                    } finally {
                        _0x56b213['release']();
                    }
                } catch (_0x514cee) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x514cee['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x29847e) {
                try {
                    await this['init']();
                    const _0x3918e7 = await pool['connect']();
                    try {
                        await _0x3918e7['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x29847e]);
                    } finally {
                        _0x3918e7['release']();
                    }
                } catch (_0x110790) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x110790['message']);
                }
            },
            async 'saveSetting'(_0x145a17, _0x4bf76b, _0x2c4fab) {
                try {
                    await this['init']();
                    const _0x460ab8 = await pool['connect']();
                    try {
                        await _0x460ab8['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x145a17,
                            _0x4bf76b,
                            JSON['stringify'](_0x2c4fab),
                            Date['now']()
                        ]);
                    } finally {
                        _0x460ab8['release']();
                    }
                } catch (_0x32cfd6) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x32cfd6['message']);
                }
            },
            async 'getSetting'(_0x662104, _0x39414d) {
                try {
                    await this['init']();
                    const _0x568b9f = await pool['connect']();
                    try {
                        const _0xf9156b = await _0x568b9f['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x662104,
                            _0x39414d
                        ]);
                        return _0xf9156b['rows'][0x0] ? JSON['parse'](_0xf9156b['rows'][0x0]['value']) : null;
                    } finally {
                        _0x568b9f['release']();
                    }
                } catch (_0x1fb989) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x1fb989['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x1d6d96) {
                try {
                    await this['init']();
                    const _0x363b8c = await pool['connect']();
                    try {
                        const _0x154247 = await _0x363b8c['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x1d6d96]);
                        const _0x5d8837 = {};
                        _0x154247['rows']['forEach'](_0x2c616e => {
                            _0x5d8837[_0x2c616e['key']] = JSON['parse'](_0x2c616e['value']);
                        });
                        return _0x5d8837;
                    } finally {
                        _0x363b8c['release']();
                    }
                } catch (_0x225e80) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x225e80['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x5a64c0 = await pool['connect']();
                    try {
                        const _0x6d62cd = await _0x5a64c0['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x6d62cd['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x6d62cd['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x5a64c0['release']();
                    }
                } catch (_0x30f1a9) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x30f1a9['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x424006) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x424006['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x37eeae) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x37eeae['message']);
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
                    } catch (_0x5293df) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x5293df['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x5293df;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x3e433a, _0x54563c, _0x55e384) {
                try {
                    const _0x38ab66 = await this['getConn']();
                    await _0x38ab66['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x3e433a,
                        _0x54563c,
                        Date['now'](),
                        compress(_0x55e384)
                    ]);
                } catch (_0x32fb73) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x32fb73['message']);
                }
            },
            async 'load'(_0x5128ab, _0xa3df0) {
                try {
                    const _0x318769 = await this['getConn']();
                    const [_0x258232] = await _0x318769['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x5128ab,
                        _0xa3df0
                    ]);
                    return _0x258232[0x0] ? decompress(_0x258232[0x0]['data']) : null;
                } catch (_0x115bed) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x115bed['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x3684a9, _0x30b889) {
                try {
                    const _0x51d9a8 = await this['getConn']();
                    await _0x51d9a8['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x3684a9,
                        _0x30b889
                    ]);
                } catch (_0x1a80f6) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x1a80f6['message']);
                }
            },
            async 'getCount'(_0x50d2b4, _0x1573fc) {
                try {
                    const _0x1299cf = await this['getConn']();
                    const [_0x13e26d] = await _0x1299cf['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x50d2b4,
                        _0x1573fc
                    ]);
                    return _0x13e26d[0x0] ? _0x13e26d[0x0]['count'] : 0x0;
                } catch (_0x1b04b0) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x1b04b0['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x303283 = await this['getConn']();
                    const [_0x45baef] = await _0x303283['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x503058 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x45baef['forEach'](_0x33d79a => {
                        if (!_0x503058['messageCount'][_0x33d79a['chat_id']]) {
                            _0x503058['messageCount'][_0x33d79a['chat_id']] = {};
                        }
                        _0x503058['messageCount'][_0x33d79a['chat_id']][_0x33d79a['user_id']] = _0x33d79a['count'];
                    });
                    const [_0x4a692a] = await _0x303283['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x4a692a[0x0])
                        _0x503058['isPublic'] = _0x4a692a[0x0]['value'] === 'true';
                    return _0x503058;
                } catch (_0x51ca4e) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x51ca4e['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x5e7470) {
                try {
                    const _0x4d0b43 = await this['getConn']();
                    await _0x4d0b43['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x5e7470['toString']()]);
                } catch (_0x40e6b6) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x40e6b6['message']);
                }
            },
            async 'setMetadata'(_0x511831, _0x16f926) {
                try {
                    const _0xe576d5 = await this['getConn']();
                    await _0xe576d5['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x511831,
                        _0x16f926['toString']()
                    ]);
                } catch (_0x18f77d) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x18f77d['message']);
                }
            },
            async 'getMetadata'(_0xd4f894) {
                try {
                    const _0x1233f8 = await this['getConn']();
                    const [_0x41724e] = await _0x1233f8['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0xd4f894]);
                    return _0x41724e[0x0] ? _0x41724e[0x0]['value'] : null;
                } catch (_0xce9721) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0xce9721['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xf62ff8, _0x1e7ff3) {
                try {
                    const _0x508ed8 = await this['getConn']();
                    await _0x508ed8['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0xf62ff8,
                        _0x1e7ff3['name'] || '',
                        _0x1e7ff3['notify'] || '',
                        _0x1e7ff3['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x373153) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x373153['message']);
                }
            },
            async 'getContact'(_0x4b59aa) {
                try {
                    const _0x53c765 = await this['getConn']();
                    const [_0x5e0055] = await _0x53c765['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x4b59aa]);
                    return _0x5e0055[0x0] || null;
                } catch (_0xdd5431) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0xdd5431['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x1c74b7 = await this['getConn']();
                    const [_0x11705e] = await _0x1c74b7['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x508ee5 = {};
                    _0x11705e['forEach'](_0x1df44c => {
                        _0x508ee5[_0x1df44c['jid']] = {
                            'id': _0x1df44c['jid'],
                            'name': _0x1df44c['name'],
                            'notify': _0x1df44c['notify']
                        };
                    });
                    return _0x508ee5;
                } catch (_0x37faa1) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x37faa1['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x90df6a, _0x14b35e) {
                try {
                    const _0x30bdb7 = await this['getConn']();
                    await _0x30bdb7['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x90df6a,
                        _0x14b35e['name'] || '',
                        _0x14b35e['conversationTimestamp'] || 0x0,
                        _0x14b35e['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x2dadd1) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x2dadd1['message']);
                }
            },
            async 'getChat'(_0x2947f2) {
                try {
                    const _0x216d79 = await this['getConn']();
                    const [_0x43b77e] = await _0x216d79['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x2947f2]);
                    return _0x43b77e[0x0] || null;
                } catch (_0x427327) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x427327['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x16b990 = await this['getConn']();
                    const [_0x371397] = await _0x16b990['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x15f5ee = {};
                    _0x371397['forEach'](_0x18ae5d => {
                        _0x15f5ee[_0x18ae5d['jid']] = {
                            'id': _0x18ae5d['jid'],
                            'name': _0x18ae5d['name'],
                            'conversationTimestamp': _0x18ae5d['conversation_timestamp'],
                            'unreadCount': _0x18ae5d['unread_count']
                        };
                    });
                    return _0x15f5ee;
                } catch (_0x314056) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x314056['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0xbf3689) {
                try {
                    const _0x347f18 = await this['getConn']();
                    await _0x347f18['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0xbf3689]);
                } catch (_0x6445cc) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x6445cc['message']);
                }
            },
            async 'saveSetting'(_0x10e04c, _0x10c352, _0x3ce48f) {
                try {
                    const _0x2acb3b = await this['getConn']();
                    await _0x2acb3b['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x10e04c,
                        _0x10c352,
                        JSON['stringify'](_0x3ce48f),
                        Date['now']()
                    ]);
                } catch (_0x240155) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x240155['message']);
                }
            },
            async 'getSetting'(_0x2fd9b6, _0x37a564) {
                try {
                    const _0x1c8c97 = await this['getConn']();
                    const [_0x3f86f7] = await _0x1c8c97['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x2fd9b6,
                        _0x37a564
                    ]);
                    return _0x3f86f7[0x0] ? JSON['parse'](_0x3f86f7[0x0]['value']) : null;
                } catch (_0x1343f7) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x1343f7['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x54284) {
                try {
                    const _0x4ccac4 = await this['getConn']();
                    const [_0x5ddcdd] = await _0x4ccac4['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x54284]);
                    const _0x4bb2b9 = {};
                    _0x5ddcdd['forEach'](_0xcc1843 => {
                        _0x4bb2b9[_0xcc1843['key']] = JSON['parse'](_0xcc1843['value']);
                    });
                    return _0x4bb2b9;
                } catch (_0xd7159) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0xd7159['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x3c67ee = await this['getConn']();
                    const [_0xb0ecf9] = await _0x3c67ee['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0xb0ecf9['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0xb0ecf9['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x1fd967) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x1fd967['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x3df51e) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x3df51e['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x2f4030) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x2f4030['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x32240c['dirname'](SQLITE_URL);
        if (!_0x0_0x590f44['existsSync'](dir))
            _0x0_0x590f44['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0xfd427e, _0xdfca57, _0x33386e) {
                try {
                    saveStmt['run'](_0xfd427e, _0xdfca57, Date['now'](), compress(_0x33386e));
                    const {count: _0x5239da} = countStmt['get'](_0xfd427e);
                    if (_0x5239da > MESSAGE_LIMITS['sqlite']) {
                        const _0x22f8f9 = _0x5239da - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0xfd427e, _0xfd427e, _0x22f8f9);
                    }
                } catch (_0x2b88f0) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x2b88f0['message']);
                }
            },
            'load'(_0x3f79c1, _0x3e4ce9) {
                try {
                    const _0x5e4e6f = loadStmt['get'](_0x3f79c1, _0x3e4ce9);
                    return _0x5e4e6f ? decompress(_0x5e4e6f['data']) : null;
                } catch (_0x24c954) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x24c954['message']);
                    return null;
                }
            },
            'incrementCount'(_0xbd27a6, _0x227926) {
                try {
                    incrementCountStmt['run'](_0xbd27a6, _0x227926);
                } catch (_0x4f4bdc) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x4f4bdc['message']);
                }
            },
            'getCount'(_0x59b1af, _0x1c8c2e) {
                try {
                    const _0x135acf = getCountStmt['get'](_0x59b1af, _0x1c8c2e);
                    return _0x135acf ? _0x135acf['count'] : 0x0;
                } catch (_0xb4ccbc) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0xb4ccbc['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x18b994 = getAllCountsStmt['all']();
                    const _0x3186b4 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x18b994['forEach'](_0x226014 => {
                        if (!_0x3186b4['messageCount'][_0x226014['chat_id']]) {
                            _0x3186b4['messageCount'][_0x226014['chat_id']] = {};
                        }
                        _0x3186b4['messageCount'][_0x226014['chat_id']][_0x226014['user_id']] = _0x226014['count'];
                    });
                    const _0x2f4272 = getMetaStmt['get']();
                    if (_0x2f4272)
                        _0x3186b4['isPublic'] = _0x2f4272['value'] === 'true';
                    return _0x3186b4;
                } catch (_0x4a0faf) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x4a0faf['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x44edb8) {
                try {
                    setMetaStmt['run'](_0x44edb8['toString']());
                } catch (_0x50be34) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x50be34['message']);
                }
            },
            'setMetadata'(_0x3f94bc, _0x431061) {
                try {
                    setMetadataStmt['run'](_0x3f94bc, _0x431061['toString']());
                } catch (_0x5eb370) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x5eb370['message']);
                }
            },
            'getMetadata'(_0x4a826a) {
                try {
                    const _0x26c09f = getMetadataStmt['get'](_0x4a826a);
                    return _0x26c09f ? _0x26c09f['value'] : null;
                } catch (_0x3c2887) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x3c2887['message']);
                    return null;
                }
            },
            'saveContact'(_0x53d8f7, _0x1a9101) {
                try {
                    saveContactStmt['run'](_0x53d8f7, _0x1a9101['name'] || '', _0x1a9101['notify'] || '', _0x1a9101['verifiedName'] || '', Date['now']());
                } catch (_0x4e19cc) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x4e19cc['message']);
                }
            },
            'getContact'(_0x179bdd) {
                try {
                    return getContactStmt['get'](_0x179bdd) || null;
                } catch (_0x8c42f7) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x8c42f7['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x518559 = getAllContactsStmt['all']();
                    const _0x5ead8f = {};
                    _0x518559['forEach'](_0x5544a0 => {
                        _0x5ead8f[_0x5544a0['jid']] = {
                            'id': _0x5544a0['jid'],
                            'name': _0x5544a0['name'],
                            'notify': _0x5544a0['notify']
                        };
                    });
                    return _0x5ead8f;
                } catch (_0x24cf1c) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x24cf1c['message']);
                    return {};
                }
            },
            'saveChat'(_0x2d7581, _0x4af9ca) {
                try {
                    saveChatStmt['run'](_0x2d7581, _0x4af9ca['name'] || '', _0x4af9ca['conversationTimestamp'] || 0x0, _0x4af9ca['unreadCount'] || 0x0, Date['now']());
                } catch (_0x5ecda1) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x5ecda1['message']);
                }
            },
            'getChat'(_0x242123) {
                try {
                    return getChatStmt['get'](_0x242123) || null;
                } catch (_0x20ecec) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x20ecec['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x42b1e7 = getAllChatsStmt['all']();
                    const _0x2f10b4 = {};
                    _0x42b1e7['forEach'](_0x55df1f => {
                        _0x2f10b4[_0x55df1f['jid']] = {
                            'id': _0x55df1f['jid'],
                            'name': _0x55df1f['name'],
                            'conversationTimestamp': _0x55df1f['conversation_timestamp'],
                            'unreadCount': _0x55df1f['unread_count']
                        };
                    });
                    return _0x2f10b4;
                } catch (_0x3757f2) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x3757f2['message']);
                    return {};
                }
            },
            'deleteChat'(_0x27cc14) {
                try {
                    deleteChatStmt['run'](_0x27cc14);
                } catch (_0x5f18a7) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x5f18a7['message']);
                }
            },
            'saveSetting'(_0x51f1fb, _0x111084, _0x2781c7) {
                try {
                    saveSettingStmt['run'](_0x51f1fb, _0x111084, JSON['stringify'](_0x2781c7), Date['now']());
                } catch (_0x27d38d) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x27d38d['message']);
                }
            },
            'getSetting'(_0x3cd09c, _0x36e272) {
                try {
                    const _0x2929bd = getSettingStmt['get'](_0x3cd09c, _0x36e272);
                    return _0x2929bd ? JSON['parse'](_0x2929bd['value']) : null;
                } catch (_0x3feacf) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x3feacf['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x401457) {
                try {
                    const _0x306824 = getAllSettingsStmt['all'](_0x401457);
                    const _0x412494 = {};
                    _0x306824['forEach'](_0x10e7b4 => {
                        _0x412494[_0x10e7b4['key']] = JSON['parse'](_0x10e7b4['value']);
                    });
                    return _0x412494;
                } catch (_0x4053d9) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x4053d9['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x3288ab = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x3288ab['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x3288ab['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x32ab5e) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x32ab5e['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x2d3e6c) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x2d3e6c['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x5e9905) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x5e9905['message']);
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
    async 'readFromFile'(_0x14888f = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x61ffab = await adapters[backend]['getAllContacts']();
                const _0x3b4ede = await adapters[backend]['getAllChats']();
                const _0x33a2dc = await this['getBotMode']();
                this['contacts'] = _0x61ffab;
                this['chats'] = _0x3b4ede;
                this['botMode'] = _0x33a2dc;
            } else {
                if (_0x0_0x590f44['existsSync'](_0x14888f)) {
                    const _0x3f7ddf = JSON['parse'](_0x0_0x590f44['readFileSync'](_0x14888f, 'utf-8'));
                    this['contacts'] = _0x3f7ddf['contacts'] || {};
                    this['chats'] = _0x3f7ddf['chats'] || {};
                    this['botMode'] = _0x3f7ddf['botMode'] || 'private';
                    this['messages'] = _0x3f7ddf['messages'] || {};
                    this['isPublic'] = _0x3f7ddf['isPublic'] !== undefined ? _0x3f7ddf['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x4b6f6f) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x4b6f6f['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0xd83979 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x315fe8 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x590f44['writeFileSync'](_0xd83979, JSON['stringify'](_0x315fe8, null, 0x2));
        } catch (_0x293ad8) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x293ad8['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x590f44['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x1b35e6 = JSON['parse'](_0x0_0x590f44['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x1b35e6['messageCount'] || _0x1b35e6;
                    this['isPublic'] = typeof _0x1b35e6['isPublic'] === 'boolean' ? _0x1b35e6['isPublic'] : ![];
                }
            } catch (_0x5284c2) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x5284c2['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x17cfff = _0x0_0x32240c['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x590f44['existsSync'](_0x17cfff))
                    _0x0_0x590f44['mkdirSync'](_0x17cfff, { 'recursive': !![] });
                const _0x487880 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x590f44['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x487880, null, 0x2));
            } catch (_0x4ef983) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x4ef983['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x15dad6 => {
                if (typeof this['messages'][_0x15dad6] === 'object' && !Array['isArray'](this['messages'][_0x15dad6])) {
                    const _0x1eae37 = Object['values'](this['messages'][_0x15dad6]);
                    this['messages'][_0x15dad6] = _0x1eae37['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x15dad6])) {
                    if (this['messages'][_0x15dad6]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x15dad6] = this['messages'][_0x15dad6]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x24792 => {
                if (this['chats'][_0x24792]['messages']) {
                    delete this['chats'][_0x24792]['messages'];
                }
            });
        }
    },
    'bind'(_0x3c4bd4) {
        _0x3c4bd4['on']('messages.upsert', async ({messages: _0x1fac50}) => {
            for (const _0x4d488f of _0x1fac50) {
                if (!_0x4d488f['key']?.['remoteJid'])
                    continue;
                const _0x5627c5 = _0x4d488f['key']['remoteJid'];
                const _0x583bb8 = slimMessage(_0x4d488f);
                if (backend === 'memory') {
                    this['messages'][_0x5627c5] = this['messages'][_0x5627c5] || [];
                    this['messages'][_0x5627c5]['push'](_0x583bb8);
                    if (this['messages'][_0x5627c5]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x5627c5] = this['messages'][_0x5627c5]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x5627c5, _0x4d488f['key']['id'], _0x583bb8);
                    } catch (_0x139b67) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x4d488f['key']['id'] + ':', _0x139b67['message']);
                    }
                }
            }
        });
        _0x3c4bd4['on']('contacts.update', async _0xa203f2 => {
            for (const _0x54896 of _0xa203f2) {
                if (_0x54896['id']) {
                    const _0x360d01 = {
                        'id': _0x54896['id'],
                        'name': _0x54896['notify'] || _0x54896['name'] || _0x54896['verifiedName'] || '',
                        'notify': _0x54896['notify'],
                        'verifiedName': _0x54896['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x54896['id']] = _0x360d01;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x54896['id'], _0x360d01);
                        } catch (_0x2a19c1) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x2a19c1['message']);
                        }
                    }
                }
            }
        });
        _0x3c4bd4['on']('contacts.set', async _0x30247f => {
            for (const _0x370fd9 of _0x30247f) {
                if (_0x370fd9['id']) {
                    const _0x5d093d = {
                        'id': _0x370fd9['id'],
                        'name': _0x370fd9['notify'] || _0x370fd9['name'] || _0x370fd9['verifiedName'] || '',
                        'notify': _0x370fd9['notify'],
                        'verifiedName': _0x370fd9['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x370fd9['id']] = _0x5d093d;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x370fd9['id'], _0x5d093d);
                        } catch (_0x2bf86d) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x2bf86d['message']);
                        }
                    }
                }
            }
        });
        _0x3c4bd4['on']('chats.set', async _0x467232 => {
            for (const _0x14ad53 of _0x467232) {
                if (_0x14ad53['id']) {
                    const _0x210aa1 = {
                        'id': _0x14ad53['id'],
                        'name': _0x14ad53['name'] || _0x14ad53['subject'] || '',
                        'conversationTimestamp': _0x14ad53['conversationTimestamp'],
                        'unreadCount': _0x14ad53['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x14ad53['id']] = _0x210aa1;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x14ad53['id'], _0x210aa1);
                        } catch (_0x2f8b19) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x2f8b19['message']);
                        }
                    }
                }
            }
        });
        _0x3c4bd4['on']('chats.update', async _0x47723f => {
            for (const _0x5aa0ee of _0x47723f) {
                if (_0x5aa0ee['id']) {
                    if (backend === 'memory') {
                        const _0x752d3f = this['chats'][_0x5aa0ee['id']] || {};
                        this['chats'][_0x5aa0ee['id']] = {
                            'id': _0x5aa0ee['id'],
                            'name': _0x5aa0ee['name'] || _0x5aa0ee['subject'] || _0x752d3f['name'] || '',
                            'conversationTimestamp': _0x5aa0ee['conversationTimestamp'] || _0x752d3f['conversationTimestamp'],
                            'unreadCount': _0x5aa0ee['unreadCount'] !== undefined ? _0x5aa0ee['unreadCount'] : _0x752d3f['unreadCount']
                        };
                    } else {
                        try {
                            const _0x16ff67 = await adapters[backend]['getChat'](_0x5aa0ee['id']) || {};
                            const _0x561544 = {
                                'id': _0x5aa0ee['id'],
                                'name': _0x5aa0ee['name'] || _0x5aa0ee['subject'] || _0x16ff67['name'] || '',
                                'conversationTimestamp': _0x5aa0ee['conversationTimestamp'] || _0x16ff67['conversation_timestamp'],
                                'unreadCount': _0x5aa0ee['unreadCount'] !== undefined ? _0x5aa0ee['unreadCount'] : _0x16ff67['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x5aa0ee['id'], _0x561544);
                        } catch (_0x5d4a5a) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x5d4a5a['message']);
                        }
                    }
                }
            }
        });
        _0x3c4bd4['on']('chats.delete', async _0x42610b => {
            for (const _0x373cc7 of _0x42610b) {
                if (backend === 'memory') {
                    delete this['chats'][_0x373cc7];
                    delete this['messages'][_0x373cc7];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x373cc7);
                    } catch (_0x2bc268) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x2bc268['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x1b4a7b, _0x375c31) {
        if (backend === 'memory') {
            const _0x23d3e8 = this['messages'][_0x1b4a7b]?.['find'](_0x4fe10b => _0x4fe10b['key']['id'] === _0x375c31) || null;
            return _0x23d3e8;
        } else {
            try {
                return await adapters[backend]['load'](_0x1b4a7b, _0x375c31);
            } catch (_0x1af654) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x375c31 + ':', _0x1af654['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x3a457e, _0xa21a1e, _0x566a1f) {
        if (backend === 'memory') {
            const _0x10c68c = './data';
            if (!_0x0_0x590f44['existsSync'](_0x10c68c))
                _0x0_0x590f44['mkdirSync'](_0x10c68c, { 'recursive': !![] });
            const _0x467940 = _0x0_0x32240c['join'](_0x10c68c, _0xa21a1e + '.json');
            try {
                _0x0_0x590f44['writeFileSync'](_0x467940, JSON['stringify'](_0x566a1f, null, 0x2));
            } catch (_0x526885) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0xa21a1e + ':', _0x526885['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x3a457e, _0xa21a1e, _0x566a1f);
            } catch (_0x1ea94d) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0xa21a1e + ':', _0x1ea94d['message']);
            }
        }
    },
    async 'getSetting'(_0x341cb1, _0x3c9528) {
        if (backend === 'memory') {
            const _0x5c1eb3 = './data';
            const _0x209f21 = _0x0_0x32240c['join'](_0x5c1eb3, _0x3c9528 + '.json');
            try {
                if (_0x0_0x590f44['existsSync'](_0x209f21)) {
                    const _0x4a0aa8 = JSON['parse'](_0x0_0x590f44['readFileSync'](_0x209f21, 'utf-8'));
                    if (_0x4a0aa8['enabled'] !== undefined)
                        return _0x4a0aa8;
                    if (_0x4a0aa8[_0x341cb1] !== undefined)
                        return _0x4a0aa8[_0x341cb1];
                    return null;
                }
                return null;
            } catch (_0x9ff828) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x3c9528 + ':', _0x9ff828['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x341cb1, _0x3c9528);
            } catch (_0x1646ad) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x3c9528 + ':', _0x1646ad['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0xadcaed) {
        if (backend === 'memory') {
            const _0x48d27b = './data';
            const _0x4c9f1a = {};
            try {
                if (_0x0_0x590f44['existsSync'](_0x48d27b)) {
                    const _0x59e183 = _0x0_0x590f44['readdirSync'](_0x48d27b)['filter'](_0x20db7b => _0x20db7b['endsWith']('.json'));
                    for (const _0x44ddc0 of _0x59e183) {
                        const _0x196f40 = _0x0_0x32240c['basename'](_0x44ddc0, '.json');
                        if (_0x196f40 === 'messageCount' || _0x196f40 === 'owner')
                            continue;
                        const _0x10e6c5 = _0x0_0x32240c['join'](_0x48d27b, _0x44ddc0);
                        const _0x57ac6c = JSON['parse'](_0x0_0x590f44['readFileSync'](_0x10e6c5, 'utf-8'));
                        if (_0x57ac6c[_0xadcaed]) {
                            _0x4c9f1a[_0x196f40] = _0x57ac6c[_0xadcaed];
                        }
                    }
                }
                return _0x4c9f1a;
            } catch (_0x126693) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x126693['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0xadcaed);
            } catch (_0x156e4f) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x156e4f['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x9ac648) {
        const _0x5a494c = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x5a494c['includes'](_0x9ac648)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x9ac648 + ',\x20defaulting\x20to\x20private');
            _0x9ac648 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x9ac648;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x9ac648);
            } catch (_0x1e5ed9) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x1e5ed9['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x3ec8af = await adapters[backend]['getMetadata']('botMode');
                return _0x3ec8af || 'private';
            } catch (_0x337297) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x337297['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x37c9f2, _0x5e009c, _0x18bd9b) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x37c9f2]) {
                this['messageCount'][_0x37c9f2] = {};
            }
            if (!this['messageCount'][_0x37c9f2][_0x5e009c]) {
                this['messageCount'][_0x37c9f2][_0x5e009c] = 0x0;
            }
            this['messageCount'][_0x37c9f2][_0x5e009c]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x37c9f2, _0x5e009c);
            } catch (_0xd40811) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x5e009c + ':', _0xd40811['message']);
            }
        }
    },
    async 'getMessageCount'(_0x3453c8, _0x41d0fd) {
        if (backend === 'memory') {
            return this['messageCount'][_0x3453c8]?.[_0x41d0fd] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x3453c8, _0x41d0fd);
            } catch (_0x21cc23) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x41d0fd + ':', _0x21cc23['message']);
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
            } catch (_0x26eefe) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x26eefe['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x576b2c) {
        if (backend === 'memory') {
            this['isPublic'] = _0x576b2c;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x576b2c);
            } catch (_0x49a3a0) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x49a3a0['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x2b4dfe = await adapters[backend]['getAllCounts']();
                return _0x2b4dfe['isPublic'];
            } catch (_0x4525d4) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x4525d4['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x4e0a84) {
        const _0x242643 = [
            'public',
            'private'
        ];
        if (!_0x242643['includes'](_0x4e0a84)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x4e0a84);
            _0x4e0a84 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x4e0a84;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x4e0a84);
            } catch (_0x62a5bc) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x62a5bc['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x41d294 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x41d294 || 'private';
            } catch (_0x41ce0a) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x41ce0a['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x4d9b42 = 0x0;
        const _0x438752 = Object['keys'](this['contacts'])['length'];
        const _0x50a737 = Object['keys'](this['chats'])['length'];
        let _0x5c4f24 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0xe49cc9 => {
                if (Array['isArray'](_0xe49cc9)) {
                    _0x4d9b42 += _0xe49cc9['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x5c616c => {
                if (typeof _0x5c616c === 'object') {
                    _0x5c4f24 += Object['keys'](_0x5c616c)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x4d9b42 : 'stored\x20in\x20database',
            'contacts': _0x438752,
            'chats': _0x50a737,
            'messageCounts': backend === 'memory' ? _0x5c4f24 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x47060c => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x47060c));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x42d9ad => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x42d9ad));
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
        let _0xa2e2f6 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x46321e => {
            if (store['chats'][_0x46321e]['messages']) {
                delete store['chats'][_0x46321e]['messages'];
                _0xa2e2f6++;
            }
        });
        if (_0xa2e2f6 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0xa2e2f6 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0xd4cda1 => {
    console['log']('[STORE]\x20Received\x20' + _0xd4cda1 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x5a9822) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x5a9822['message']);
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
process['on']('uncaughtException', _0x3b29cf => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x3b29cf);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x9708f3, _0x1cc8dd) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x1cc8dd, 'reason:', _0x9708f3);
});
export default store;