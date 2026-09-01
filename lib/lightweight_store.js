import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x1281b1 from 'fs';
import _0x0_0x474811 from 'path';
import _0x0_0x4bce5e from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x2f1aa7) {
    printLog = (_0x41f225, _0x4c0afb) => console['log']('[' + _0x41f225['toUpperCase']() + ']\x20' + _0x4c0afb);
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
} catch (_0x0_0x82c607) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x1667f0 => {
    try {
        return _0x0_0x4bce5e['deflateSync'](JSON['stringify'](_0x1667f0));
    } catch (_0x21aa67) {
        console['error']('[STORE]\x20Compression\x20error:', _0x21aa67['message']);
        return Buffer['from'](JSON['stringify'](_0x1667f0));
    }
};
const decompress = _0x2e3212 => {
    try {
        return JSON['parse'](_0x0_0x4bce5e['inflateSync'](_0x2e3212));
    } catch (_0x9fbfb7) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x9fbfb7['message']);
        try {
            return JSON['parse'](_0x2e3212['toString']());
        } catch (_0x1e7ae1) {
            return null;
        }
    }
};
function slimMessage(_0x41c814) {
    return {
        'key': _0x41c814['key'],
        'message': _0x41c814['message'],
        'messageTimestamp': _0x41c814['messageTimestamp'],
        'participant': _0x41c814['participant'],
        'pushName': _0x41c814['pushName'],
        'broadcast': _0x41c814['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x2a8e45 => console['error']('[MONGO]\x20Connection\x20error:', _0x2a8e45));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x2d46e5, _0x51fc38, _0x33d50c) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x2d46e5,
                        'id': _0x51fc38
                    }, {
                        'data': compress(_0x33d50c),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x519999) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x519999['message']);
                }
            },
            async 'load'(_0x3aa940, _0x139fb5) {
                try {
                    const _0x372aa5 = await Msg['findOne']({
                        'jid': _0x3aa940,
                        'id': _0x139fb5
                    });
                    return _0x372aa5 ? decompress(_0x372aa5['data']) : null;
                } catch (_0x4aa1d6) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x4aa1d6['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x20196e, _0x5cc27b) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x20196e,
                        'userId': _0x5cc27b
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x20fe5b) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x20fe5b['message']);
                }
            },
            async 'getCount'(_0x4f4726, _0xd576bc) {
                try {
                    const _0x4be7cb = await MsgCount['findOne']({
                        'chatId': _0x4f4726,
                        'userId': _0xd576bc
                    });
                    return _0x4be7cb ? _0x4be7cb['count'] : 0x0;
                } catch (_0x58cd48) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x58cd48['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x27fea0 = await MsgCount['find']({});
                    const _0xe6d323 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x27fea0['forEach'](_0x4b7f7e => {
                        if (!_0xe6d323['messageCount'][_0x4b7f7e['chatId']]) {
                            _0xe6d323['messageCount'][_0x4b7f7e['chatId']] = {};
                        }
                        _0xe6d323['messageCount'][_0x4b7f7e['chatId']][_0x4b7f7e['userId']] = _0x4b7f7e['count'];
                    });
                    const _0x5765e8 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x5765e8)
                        _0xe6d323['isPublic'] = _0x5765e8['value'] === 'true';
                    return _0xe6d323;
                } catch (_0x39a939) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x39a939['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3b9fe2) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x3b9fe2['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x362c97) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x362c97['message']);
                }
            },
            async 'setMetadata'(_0x451702, _0xc0695b) {
                try {
                    await Meta['updateOne']({ 'key': _0x451702 }, {
                        'key': _0x451702,
                        'value': _0xc0695b['toString']()
                    }, { 'upsert': !![] });
                } catch (_0xe8fb09) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0xe8fb09['message']);
                }
            },
            async 'getMetadata'(_0x47065d) {
                try {
                    const _0x3ca61f = await Meta['findOne']({ 'key': _0x47065d });
                    return _0x3ca61f ? _0x3ca61f['value'] : null;
                } catch (_0x24ab90) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x24ab90['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x56ab33, _0x395ed6) {
                try {
                    await Contact['updateOne']({ 'jid': _0x56ab33 }, {
                        ..._0x395ed6,
                        'jid': _0x56ab33,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3a405b) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x3a405b['message']);
                }
            },
            async 'getContact'(_0x50a9b5) {
                try {
                    return await Contact['findOne']({ 'jid': _0x50a9b5 });
                } catch (_0x13af1e) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x13af1e['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x2a3fe4 = await Contact['find']({});
                    const _0x2c82f7 = {};
                    _0x2a3fe4['forEach'](_0x12e342 => {
                        _0x2c82f7[_0x12e342['jid']] = {
                            'id': _0x12e342['jid'],
                            'name': _0x12e342['name'],
                            'notify': _0x12e342['notify']
                        };
                    });
                    return _0x2c82f7;
                } catch (_0x2c7e9e) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x2c7e9e['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x49003e, _0x447160) {
                try {
                    await Chat['updateOne']({ 'jid': _0x49003e }, {
                        ..._0x447160,
                        'jid': _0x49003e,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x422cb2) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x422cb2['message']);
                }
            },
            async 'getChat'(_0x37f6c0) {
                try {
                    return await Chat['findOne']({ 'jid': _0x37f6c0 });
                } catch (_0x45f118) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x45f118['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x2685e8 = await Chat['find']({});
                    const _0x752acc = {};
                    _0x2685e8['forEach'](_0x13adf5 => {
                        _0x752acc[_0x13adf5['jid']] = {
                            'id': _0x13adf5['jid'],
                            'name': _0x13adf5['name'],
                            'conversationTimestamp': _0x13adf5['conversationTimestamp'],
                            'unreadCount': _0x13adf5['unreadCount']
                        };
                    });
                    return _0x752acc;
                } catch (_0x3c03d8) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x3c03d8['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x9f4e00) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x9f4e00 });
                } catch (_0x33ef2e) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x33ef2e['message']);
                }
            },
            async 'saveSetting'(_0xbbca28, _0xbc9c9c, _0x4133ad) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0xbbca28,
                        'key': _0xbc9c9c
                    }, {
                        'chatId': _0xbbca28,
                        'key': _0xbc9c9c,
                        'value': _0x4133ad,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5cd38e) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x5cd38e['message']);
                }
            },
            async 'getSetting'(_0x437ad5, _0x10ded0) {
                try {
                    const _0x287e07 = await Setting['findOne']({
                        'chatId': _0x437ad5,
                        'key': _0x10ded0
                    });
                    return _0x287e07 ? _0x287e07['value'] : null;
                } catch (_0x5217b4) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x5217b4['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x57eac9) {
                try {
                    const _0x3e7988 = await Setting['find']({ 'chatId': _0x57eac9 });
                    const _0x22f442 = {};
                    _0x3e7988['forEach'](_0x34388c => {
                        _0x22f442[_0x34388c['key']] = _0x34388c['value'];
                    });
                    return _0x22f442;
                } catch (_0x56ddd1) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x56ddd1['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x548e6e = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x548e6e['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x548e6e['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x35d01c) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x35d01c['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x28b1fc) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x28b1fc['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0xc60b8b) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0xc60b8b['message']);
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
        pool['on']('error', _0x58270c => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x58270c['message']);
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
                        const _0x1b5eaf = await pool['connect']();
                        try {
                            await _0x1b5eaf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x1b5eaf['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x1b5eaf['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x1b5eaf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x1b5eaf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x1b5eaf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x1b5eaf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x1b5eaf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x1b5eaf['release']();
                        }
                    } catch (_0xe71e0d) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0xe71e0d['message']);
                        this['initPromise'] = null;
                        throw _0xe71e0d;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x4d64c3, _0x539791, _0xfd4e91) {
                try {
                    await this['init']();
                    const _0x179a58 = await pool['connect']();
                    try {
                        await _0x179a58['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x4d64c3,
                            _0x539791,
                            Date['now'](),
                            compress(_0xfd4e91)
                        ]);
                    } finally {
                        _0x179a58['release']();
                    }
                } catch (_0x4eb70f) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x4eb70f['message']);
                }
            },
            async 'load'(_0x3571a7, _0x3ef2c7) {
                try {
                    await this['init']();
                    const _0x10c0bb = await pool['connect']();
                    try {
                        const _0x34bbaf = await _0x10c0bb['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x3571a7,
                            _0x3ef2c7
                        ]);
                        return _0x34bbaf['rows'][0x0] ? decompress(_0x34bbaf['rows'][0x0]['data']) : null;
                    } finally {
                        _0x10c0bb['release']();
                    }
                } catch (_0x9a9824) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x9a9824['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x4ca38b, _0x4ad94f) {
                try {
                    await this['init']();
                    const _0xc3fa10 = await pool['connect']();
                    try {
                        await _0xc3fa10['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x4ca38b,
                            _0x4ad94f
                        ]);
                    } finally {
                        _0xc3fa10['release']();
                    }
                } catch (_0x8b0d43) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x8b0d43['message']);
                }
            },
            async 'getCount'(_0x5340d1, _0x20fb59) {
                try {
                    await this['init']();
                    const _0x4e28c0 = await pool['connect']();
                    try {
                        const _0x497b1b = await _0x4e28c0['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x5340d1,
                            _0x20fb59
                        ]);
                        return _0x497b1b['rows'][0x0] ? _0x497b1b['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x4e28c0['release']();
                    }
                } catch (_0x4fa782) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x4fa782['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x572c73 = await pool['connect']();
                    try {
                        const _0x52e1b7 = await _0x572c73['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x40c7ad = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x52e1b7['rows']['forEach'](_0x703d3 => {
                            if (!_0x40c7ad['messageCount'][_0x703d3['chat_id']]) {
                                _0x40c7ad['messageCount'][_0x703d3['chat_id']] = {};
                            }
                            _0x40c7ad['messageCount'][_0x703d3['chat_id']][_0x703d3['user_id']] = _0x703d3['count'];
                        });
                        const _0x839a25 = await _0x572c73['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x839a25['rows'][0x0])
                            _0x40c7ad['isPublic'] = _0x839a25['rows'][0x0]['value'] === 'true';
                        return _0x40c7ad;
                    } finally {
                        _0x572c73['release']();
                    }
                } catch (_0x214264) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x214264['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x28b1b5) {
                try {
                    await this['init']();
                    const _0x1c0a31 = await pool['connect']();
                    try {
                        await _0x1c0a31['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x28b1b5['toString']()]);
                    } finally {
                        _0x1c0a31['release']();
                    }
                } catch (_0x210c10) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x210c10['message']);
                }
            },
            async 'setMetadata'(_0x44ebe8, _0x4658df) {
                try {
                    await this['init']();
                    const _0x26c828 = await pool['connect']();
                    try {
                        await _0x26c828['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x44ebe8,
                            _0x4658df['toString']()
                        ]);
                    } finally {
                        _0x26c828['release']();
                    }
                } catch (_0x3307dc) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x3307dc['message']);
                }
            },
            async 'getMetadata'(_0x15854e) {
                try {
                    await this['init']();
                    const _0x45ce6f = await pool['connect']();
                    try {
                        const _0x344a58 = await _0x45ce6f['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x15854e]);
                        return _0x344a58['rows'][0x0] ? _0x344a58['rows'][0x0]['value'] : null;
                    } finally {
                        _0x45ce6f['release']();
                    }
                } catch (_0xf7540b) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0xf7540b['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x44a6a8, _0x20e060) {
                try {
                    await this['init']();
                    const _0x3d88a9 = await pool['connect']();
                    try {
                        await _0x3d88a9['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x44a6a8,
                            _0x20e060['name'] || '',
                            _0x20e060['notify'] || '',
                            _0x20e060['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x3d88a9['release']();
                    }
                } catch (_0x210f50) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x210f50['message']);
                }
            },
            async 'getContact'(_0xe8df5a) {
                try {
                    await this['init']();
                    const _0x10e68f = await pool['connect']();
                    try {
                        const _0x471138 = await _0x10e68f['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0xe8df5a]);
                        return _0x471138['rows'][0x0] || null;
                    } finally {
                        _0x10e68f['release']();
                    }
                } catch (_0x52a2d9) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x52a2d9['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x9572f3 = await pool['connect']();
                    try {
                        const _0x303379 = await _0x9572f3['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x1e9465 = {};
                        _0x303379['rows']['forEach'](_0x3c53be => {
                            _0x1e9465[_0x3c53be['jid']] = {
                                'id': _0x3c53be['jid'],
                                'name': _0x3c53be['name'],
                                'notify': _0x3c53be['notify']
                            };
                        });
                        return _0x1e9465;
                    } finally {
                        _0x9572f3['release']();
                    }
                } catch (_0x313e39) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x313e39['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x31fa8f, _0x8ebd74) {
                try {
                    await this['init']();
                    const _0x5d71d6 = await pool['connect']();
                    try {
                        await _0x5d71d6['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x31fa8f,
                            _0x8ebd74['name'] || '',
                            _0x8ebd74['conversationTimestamp'] || 0x0,
                            _0x8ebd74['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x5d71d6['release']();
                    }
                } catch (_0x507ecd) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x507ecd['message']);
                }
            },
            async 'getChat'(_0x262f7d) {
                try {
                    await this['init']();
                    const _0x4bfed8 = await pool['connect']();
                    try {
                        const _0x3bdea2 = await _0x4bfed8['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x262f7d]);
                        return _0x3bdea2['rows'][0x0] || null;
                    } finally {
                        _0x4bfed8['release']();
                    }
                } catch (_0x12a1c7) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x12a1c7['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x5be9d1 = await pool['connect']();
                    try {
                        const _0x18a6e3 = await _0x5be9d1['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x2f5944 = {};
                        _0x18a6e3['rows']['forEach'](_0x57ecfb => {
                            _0x2f5944[_0x57ecfb['jid']] = {
                                'id': _0x57ecfb['jid'],
                                'name': _0x57ecfb['name'],
                                'conversationTimestamp': _0x57ecfb['conversation_timestamp'],
                                'unreadCount': _0x57ecfb['unread_count']
                            };
                        });
                        return _0x2f5944;
                    } finally {
                        _0x5be9d1['release']();
                    }
                } catch (_0xb096b1) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0xb096b1['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x3072d2) {
                try {
                    await this['init']();
                    const _0x2398ad = await pool['connect']();
                    try {
                        await _0x2398ad['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x3072d2]);
                    } finally {
                        _0x2398ad['release']();
                    }
                } catch (_0x485cba) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x485cba['message']);
                }
            },
            async 'saveSetting'(_0xf9fb7f, _0x4fbe71, _0x5c40e6) {
                try {
                    await this['init']();
                    const _0x37b095 = await pool['connect']();
                    try {
                        await _0x37b095['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0xf9fb7f,
                            _0x4fbe71,
                            JSON['stringify'](_0x5c40e6),
                            Date['now']()
                        ]);
                    } finally {
                        _0x37b095['release']();
                    }
                } catch (_0x36e145) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x36e145['message']);
                }
            },
            async 'getSetting'(_0x24a620, _0xa7e0c2) {
                try {
                    await this['init']();
                    const _0x3ccd17 = await pool['connect']();
                    try {
                        const _0x1190d3 = await _0x3ccd17['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x24a620,
                            _0xa7e0c2
                        ]);
                        return _0x1190d3['rows'][0x0] ? JSON['parse'](_0x1190d3['rows'][0x0]['value']) : null;
                    } finally {
                        _0x3ccd17['release']();
                    }
                } catch (_0xee5e63) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0xee5e63['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x2b2d02) {
                try {
                    await this['init']();
                    const _0x12db01 = await pool['connect']();
                    try {
                        const _0x15cd58 = await _0x12db01['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x2b2d02]);
                        const _0x4b32b2 = {};
                        _0x15cd58['rows']['forEach'](_0x5cda71 => {
                            _0x4b32b2[_0x5cda71['key']] = JSON['parse'](_0x5cda71['value']);
                        });
                        return _0x4b32b2;
                    } finally {
                        _0x12db01['release']();
                    }
                } catch (_0x1511e5) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x1511e5['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x452fd1 = await pool['connect']();
                    try {
                        const _0x10e37f = await _0x452fd1['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x10e37f['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x10e37f['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x452fd1['release']();
                    }
                } catch (_0x5ebba1) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x5ebba1['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x400c1b) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x400c1b['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x28dc80) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x28dc80['message']);
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
                    } catch (_0x2d621b) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x2d621b['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x2d621b;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x47a024, _0x1af781, _0x5c6d58) {
                try {
                    const _0x5515e9 = await this['getConn']();
                    await _0x5515e9['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x47a024,
                        _0x1af781,
                        Date['now'](),
                        compress(_0x5c6d58)
                    ]);
                } catch (_0x18b5f5) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x18b5f5['message']);
                }
            },
            async 'load'(_0xbe71a4, _0xd918b5) {
                try {
                    const _0x4e46e1 = await this['getConn']();
                    const [_0x4f3007] = await _0x4e46e1['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0xbe71a4,
                        _0xd918b5
                    ]);
                    return _0x4f3007[0x0] ? decompress(_0x4f3007[0x0]['data']) : null;
                } catch (_0x579458) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x579458['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x5999ac, _0x54f222) {
                try {
                    const _0x3be5ac = await this['getConn']();
                    await _0x3be5ac['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x5999ac,
                        _0x54f222
                    ]);
                } catch (_0x144857) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x144857['message']);
                }
            },
            async 'getCount'(_0x5348ee, _0x2107b3) {
                try {
                    const _0x1c2704 = await this['getConn']();
                    const [_0x1db15a] = await _0x1c2704['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x5348ee,
                        _0x2107b3
                    ]);
                    return _0x1db15a[0x0] ? _0x1db15a[0x0]['count'] : 0x0;
                } catch (_0xbc600a) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0xbc600a['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x4acbeb = await this['getConn']();
                    const [_0x1e80f1] = await _0x4acbeb['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x431d4a = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x1e80f1['forEach'](_0x211d85 => {
                        if (!_0x431d4a['messageCount'][_0x211d85['chat_id']]) {
                            _0x431d4a['messageCount'][_0x211d85['chat_id']] = {};
                        }
                        _0x431d4a['messageCount'][_0x211d85['chat_id']][_0x211d85['user_id']] = _0x211d85['count'];
                    });
                    const [_0x5554a7] = await _0x4acbeb['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x5554a7[0x0])
                        _0x431d4a['isPublic'] = _0x5554a7[0x0]['value'] === 'true';
                    return _0x431d4a;
                } catch (_0x3644c3) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x3644c3['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x2d3748) {
                try {
                    const _0x24785f = await this['getConn']();
                    await _0x24785f['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x2d3748['toString']()]);
                } catch (_0x3a7f6f) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x3a7f6f['message']);
                }
            },
            async 'setMetadata'(_0x439df0, _0x55f9e6) {
                try {
                    const _0x5a439f = await this['getConn']();
                    await _0x5a439f['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x439df0,
                        _0x55f9e6['toString']()
                    ]);
                } catch (_0x5df956) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x5df956['message']);
                }
            },
            async 'getMetadata'(_0x509698) {
                try {
                    const _0x1dae85 = await this['getConn']();
                    const [_0xc77a67] = await _0x1dae85['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x509698]);
                    return _0xc77a67[0x0] ? _0xc77a67[0x0]['value'] : null;
                } catch (_0x1115a3) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x1115a3['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x311dd2, _0x533857) {
                try {
                    const _0x5c0549 = await this['getConn']();
                    await _0x5c0549['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x311dd2,
                        _0x533857['name'] || '',
                        _0x533857['notify'] || '',
                        _0x533857['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x4149ac) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x4149ac['message']);
                }
            },
            async 'getContact'(_0x877103) {
                try {
                    const _0x24acad = await this['getConn']();
                    const [_0x1dc111] = await _0x24acad['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x877103]);
                    return _0x1dc111[0x0] || null;
                } catch (_0x48b677) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x48b677['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x1f1bfe = await this['getConn']();
                    const [_0x466266] = await _0x1f1bfe['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x1775bf = {};
                    _0x466266['forEach'](_0x418ab4 => {
                        _0x1775bf[_0x418ab4['jid']] = {
                            'id': _0x418ab4['jid'],
                            'name': _0x418ab4['name'],
                            'notify': _0x418ab4['notify']
                        };
                    });
                    return _0x1775bf;
                } catch (_0x15ea03) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x15ea03['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x3fcd78, _0x18c628) {
                try {
                    const _0x40a715 = await this['getConn']();
                    await _0x40a715['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x3fcd78,
                        _0x18c628['name'] || '',
                        _0x18c628['conversationTimestamp'] || 0x0,
                        _0x18c628['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x23286b) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x23286b['message']);
                }
            },
            async 'getChat'(_0x3df2c7) {
                try {
                    const _0x64304f = await this['getConn']();
                    const [_0x567af8] = await _0x64304f['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x3df2c7]);
                    return _0x567af8[0x0] || null;
                } catch (_0x36be91) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x36be91['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x470be2 = await this['getConn']();
                    const [_0x390e0a] = await _0x470be2['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x15b928 = {};
                    _0x390e0a['forEach'](_0x226be7 => {
                        _0x15b928[_0x226be7['jid']] = {
                            'id': _0x226be7['jid'],
                            'name': _0x226be7['name'],
                            'conversationTimestamp': _0x226be7['conversation_timestamp'],
                            'unreadCount': _0x226be7['unread_count']
                        };
                    });
                    return _0x15b928;
                } catch (_0x15f37c) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x15f37c['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x49a5ec) {
                try {
                    const _0xc230ad = await this['getConn']();
                    await _0xc230ad['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x49a5ec]);
                } catch (_0x446f01) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x446f01['message']);
                }
            },
            async 'saveSetting'(_0x222dce, _0x2dfd27, _0xb614a9) {
                try {
                    const _0x48067f = await this['getConn']();
                    await _0x48067f['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x222dce,
                        _0x2dfd27,
                        JSON['stringify'](_0xb614a9),
                        Date['now']()
                    ]);
                } catch (_0x563943) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x563943['message']);
                }
            },
            async 'getSetting'(_0x2e4512, _0x1aced6) {
                try {
                    const _0x3b95ab = await this['getConn']();
                    const [_0x2ae39c] = await _0x3b95ab['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x2e4512,
                        _0x1aced6
                    ]);
                    return _0x2ae39c[0x0] ? JSON['parse'](_0x2ae39c[0x0]['value']) : null;
                } catch (_0x4c1db0) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x4c1db0['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x55e925) {
                try {
                    const _0x4848f1 = await this['getConn']();
                    const [_0x3e45bf] = await _0x4848f1['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x55e925]);
                    const _0xe12848 = {};
                    _0x3e45bf['forEach'](_0x1e64f => {
                        _0xe12848[_0x1e64f['key']] = JSON['parse'](_0x1e64f['value']);
                    });
                    return _0xe12848;
                } catch (_0x52d671) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x52d671['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x16f5ab = await this['getConn']();
                    const [_0x3502be] = await _0x16f5ab['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x3502be['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x3502be['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x39dd5d) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x39dd5d['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x4c167a) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x4c167a['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x2c302e) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x2c302e['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x474811['dirname'](SQLITE_URL);
        if (!_0x0_0x1281b1['existsSync'](dir))
            _0x0_0x1281b1['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x70dc8b, _0x75fbc0, _0x245355) {
                try {
                    saveStmt['run'](_0x70dc8b, _0x75fbc0, Date['now'](), compress(_0x245355));
                    const {count: _0x2b4f7c} = countStmt['get'](_0x70dc8b);
                    if (_0x2b4f7c > MESSAGE_LIMITS['sqlite']) {
                        const _0x323bab = _0x2b4f7c - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x70dc8b, _0x70dc8b, _0x323bab);
                    }
                } catch (_0xa13ee) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0xa13ee['message']);
                }
            },
            'load'(_0x50ee7a, _0x537575) {
                try {
                    const _0x413be3 = loadStmt['get'](_0x50ee7a, _0x537575);
                    return _0x413be3 ? decompress(_0x413be3['data']) : null;
                } catch (_0x326eeb) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x326eeb['message']);
                    return null;
                }
            },
            'incrementCount'(_0x31db57, _0x208fa9) {
                try {
                    incrementCountStmt['run'](_0x31db57, _0x208fa9);
                } catch (_0x5b5558) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x5b5558['message']);
                }
            },
            'getCount'(_0x5cac49, _0x4f4c7e) {
                try {
                    const _0x2917fc = getCountStmt['get'](_0x5cac49, _0x4f4c7e);
                    return _0x2917fc ? _0x2917fc['count'] : 0x0;
                } catch (_0x2f5464) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x2f5464['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0xddb7e2 = getAllCountsStmt['all']();
                    const _0x22f062 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0xddb7e2['forEach'](_0x1e249f => {
                        if (!_0x22f062['messageCount'][_0x1e249f['chat_id']]) {
                            _0x22f062['messageCount'][_0x1e249f['chat_id']] = {};
                        }
                        _0x22f062['messageCount'][_0x1e249f['chat_id']][_0x1e249f['user_id']] = _0x1e249f['count'];
                    });
                    const _0x3ebdfd = getMetaStmt['get']();
                    if (_0x3ebdfd)
                        _0x22f062['isPublic'] = _0x3ebdfd['value'] === 'true';
                    return _0x22f062;
                } catch (_0x58e882) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x58e882['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x33769b) {
                try {
                    setMetaStmt['run'](_0x33769b['toString']());
                } catch (_0x7c01c0) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x7c01c0['message']);
                }
            },
            'setMetadata'(_0x2178e3, _0x2d082d) {
                try {
                    setMetadataStmt['run'](_0x2178e3, _0x2d082d['toString']());
                } catch (_0x222817) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x222817['message']);
                }
            },
            'getMetadata'(_0x4e09c6) {
                try {
                    const _0x45088a = getMetadataStmt['get'](_0x4e09c6);
                    return _0x45088a ? _0x45088a['value'] : null;
                } catch (_0x1425a1) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x1425a1['message']);
                    return null;
                }
            },
            'saveContact'(_0x11e1d0, _0x4398c3) {
                try {
                    saveContactStmt['run'](_0x11e1d0, _0x4398c3['name'] || '', _0x4398c3['notify'] || '', _0x4398c3['verifiedName'] || '', Date['now']());
                } catch (_0x216346) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x216346['message']);
                }
            },
            'getContact'(_0x542bb1) {
                try {
                    return getContactStmt['get'](_0x542bb1) || null;
                } catch (_0x1f0a23) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x1f0a23['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x34cc48 = getAllContactsStmt['all']();
                    const _0x4e0998 = {};
                    _0x34cc48['forEach'](_0x5af34d => {
                        _0x4e0998[_0x5af34d['jid']] = {
                            'id': _0x5af34d['jid'],
                            'name': _0x5af34d['name'],
                            'notify': _0x5af34d['notify']
                        };
                    });
                    return _0x4e0998;
                } catch (_0xac669b) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0xac669b['message']);
                    return {};
                }
            },
            'saveChat'(_0x3067d6, _0x56e168) {
                try {
                    saveChatStmt['run'](_0x3067d6, _0x56e168['name'] || '', _0x56e168['conversationTimestamp'] || 0x0, _0x56e168['unreadCount'] || 0x0, Date['now']());
                } catch (_0x12c36a) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x12c36a['message']);
                }
            },
            'getChat'(_0x310a3c) {
                try {
                    return getChatStmt['get'](_0x310a3c) || null;
                } catch (_0x2aeab1) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x2aeab1['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x5dfcd4 = getAllChatsStmt['all']();
                    const _0x1419bb = {};
                    _0x5dfcd4['forEach'](_0x511dcd => {
                        _0x1419bb[_0x511dcd['jid']] = {
                            'id': _0x511dcd['jid'],
                            'name': _0x511dcd['name'],
                            'conversationTimestamp': _0x511dcd['conversation_timestamp'],
                            'unreadCount': _0x511dcd['unread_count']
                        };
                    });
                    return _0x1419bb;
                } catch (_0x3de054) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x3de054['message']);
                    return {};
                }
            },
            'deleteChat'(_0xeb4ace) {
                try {
                    deleteChatStmt['run'](_0xeb4ace);
                } catch (_0x1bdd43) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x1bdd43['message']);
                }
            },
            'saveSetting'(_0x2eff9b, _0x4fbddf, _0x5149ca) {
                try {
                    saveSettingStmt['run'](_0x2eff9b, _0x4fbddf, JSON['stringify'](_0x5149ca), Date['now']());
                } catch (_0x3bc5e1) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x3bc5e1['message']);
                }
            },
            'getSetting'(_0x3c5750, _0x89e8fb) {
                try {
                    const _0x56cc41 = getSettingStmt['get'](_0x3c5750, _0x89e8fb);
                    return _0x56cc41 ? JSON['parse'](_0x56cc41['value']) : null;
                } catch (_0x32802b) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x32802b['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x4dff15) {
                try {
                    const _0x2afdec = getAllSettingsStmt['all'](_0x4dff15);
                    const _0x5e05d6 = {};
                    _0x2afdec['forEach'](_0x2ad2bb => {
                        _0x5e05d6[_0x2ad2bb['key']] = JSON['parse'](_0x2ad2bb['value']);
                    });
                    return _0x5e05d6;
                } catch (_0xb4b3a4) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0xb4b3a4['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x3fbeb8 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x3fbeb8['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x3fbeb8['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x2afe93) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x2afe93['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x44878a) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x44878a['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x34726d) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x34726d['message']);
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
    async 'readFromFile'(_0x10c2bc = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x57d4d2 = await adapters[backend]['getAllContacts']();
                const _0x160929 = await adapters[backend]['getAllChats']();
                const _0x1ee576 = await this['getBotMode']();
                this['contacts'] = _0x57d4d2;
                this['chats'] = _0x160929;
                this['botMode'] = _0x1ee576;
            } else {
                if (_0x0_0x1281b1['existsSync'](_0x10c2bc)) {
                    const _0x185294 = JSON['parse'](_0x0_0x1281b1['readFileSync'](_0x10c2bc, 'utf-8'));
                    this['contacts'] = _0x185294['contacts'] || {};
                    this['chats'] = _0x185294['chats'] || {};
                    this['botMode'] = _0x185294['botMode'] || 'private';
                    this['messages'] = _0x185294['messages'] || {};
                    this['isPublic'] = _0x185294['isPublic'] !== undefined ? _0x185294['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x6d5be0) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x6d5be0['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x98bfe1 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x9efa8 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x1281b1['writeFileSync'](_0x98bfe1, JSON['stringify'](_0x9efa8, null, 0x2));
        } catch (_0x3b0c7c) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x3b0c7c['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x1281b1['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x32c48c = JSON['parse'](_0x0_0x1281b1['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x32c48c['messageCount'] || _0x32c48c;
                    this['isPublic'] = typeof _0x32c48c['isPublic'] === 'boolean' ? _0x32c48c['isPublic'] : ![];
                }
            } catch (_0x11bfe5) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x11bfe5['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x23459c = _0x0_0x474811['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x1281b1['existsSync'](_0x23459c))
                    _0x0_0x1281b1['mkdirSync'](_0x23459c, { 'recursive': !![] });
                const _0x21804c = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x1281b1['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x21804c, null, 0x2));
            } catch (_0xec8ab9) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0xec8ab9['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x4d47ed => {
                if (typeof this['messages'][_0x4d47ed] === 'object' && !Array['isArray'](this['messages'][_0x4d47ed])) {
                    const _0x1373cc = Object['values'](this['messages'][_0x4d47ed]);
                    this['messages'][_0x4d47ed] = _0x1373cc['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x4d47ed])) {
                    if (this['messages'][_0x4d47ed]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x4d47ed] = this['messages'][_0x4d47ed]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x406a39 => {
                if (this['chats'][_0x406a39]['messages']) {
                    delete this['chats'][_0x406a39]['messages'];
                }
            });
        }
    },
    'bind'(_0x1c7652) {
        _0x1c7652['on']('messages.upsert', async ({messages: _0x58c242}) => {
            for (const _0x11e119 of _0x58c242) {
                if (!_0x11e119['key']?.['remoteJid'])
                    continue;
                const _0xf2fcde = _0x11e119['key']['remoteJid'];
                const _0x4a2a9c = slimMessage(_0x11e119);
                if (backend === 'memory') {
                    this['messages'][_0xf2fcde] = this['messages'][_0xf2fcde] || [];
                    this['messages'][_0xf2fcde]['push'](_0x4a2a9c);
                    if (this['messages'][_0xf2fcde]['length'] > MAX_MESSAGES) {
                        this['messages'][_0xf2fcde] = this['messages'][_0xf2fcde]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0xf2fcde, _0x11e119['key']['id'], _0x4a2a9c);
                    } catch (_0x487951) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x11e119['key']['id'] + ':', _0x487951['message']);
                    }
                }
            }
        });
        _0x1c7652['on']('contacts.update', async _0x6997b2 => {
            for (const _0x55fbba of _0x6997b2) {
                if (_0x55fbba['id']) {
                    const _0x1e6dc9 = {
                        'id': _0x55fbba['id'],
                        'name': _0x55fbba['notify'] || _0x55fbba['name'] || _0x55fbba['verifiedName'] || '',
                        'notify': _0x55fbba['notify'],
                        'verifiedName': _0x55fbba['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x55fbba['id']] = _0x1e6dc9;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x55fbba['id'], _0x1e6dc9);
                        } catch (_0x3ae81a) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x3ae81a['message']);
                        }
                    }
                }
            }
        });
        _0x1c7652['on']('contacts.set', async _0x307d03 => {
            for (const _0x125385 of _0x307d03) {
                if (_0x125385['id']) {
                    const _0x1032a9 = {
                        'id': _0x125385['id'],
                        'name': _0x125385['notify'] || _0x125385['name'] || _0x125385['verifiedName'] || '',
                        'notify': _0x125385['notify'],
                        'verifiedName': _0x125385['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x125385['id']] = _0x1032a9;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x125385['id'], _0x1032a9);
                        } catch (_0x2f2271) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x2f2271['message']);
                        }
                    }
                }
            }
        });
        _0x1c7652['on']('chats.set', async _0x488e47 => {
            for (const _0x5e9cc0 of _0x488e47) {
                if (_0x5e9cc0['id']) {
                    const _0x4f6824 = {
                        'id': _0x5e9cc0['id'],
                        'name': _0x5e9cc0['name'] || _0x5e9cc0['subject'] || '',
                        'conversationTimestamp': _0x5e9cc0['conversationTimestamp'],
                        'unreadCount': _0x5e9cc0['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x5e9cc0['id']] = _0x4f6824;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x5e9cc0['id'], _0x4f6824);
                        } catch (_0x28d814) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x28d814['message']);
                        }
                    }
                }
            }
        });
        _0x1c7652['on']('chats.update', async _0x1942ce => {
            for (const _0x1a6c2b of _0x1942ce) {
                if (_0x1a6c2b['id']) {
                    if (backend === 'memory') {
                        const _0x448f4c = this['chats'][_0x1a6c2b['id']] || {};
                        this['chats'][_0x1a6c2b['id']] = {
                            'id': _0x1a6c2b['id'],
                            'name': _0x1a6c2b['name'] || _0x1a6c2b['subject'] || _0x448f4c['name'] || '',
                            'conversationTimestamp': _0x1a6c2b['conversationTimestamp'] || _0x448f4c['conversationTimestamp'],
                            'unreadCount': _0x1a6c2b['unreadCount'] !== undefined ? _0x1a6c2b['unreadCount'] : _0x448f4c['unreadCount']
                        };
                    } else {
                        try {
                            const _0x546aea = await adapters[backend]['getChat'](_0x1a6c2b['id']) || {};
                            const _0x9010d0 = {
                                'id': _0x1a6c2b['id'],
                                'name': _0x1a6c2b['name'] || _0x1a6c2b['subject'] || _0x546aea['name'] || '',
                                'conversationTimestamp': _0x1a6c2b['conversationTimestamp'] || _0x546aea['conversation_timestamp'],
                                'unreadCount': _0x1a6c2b['unreadCount'] !== undefined ? _0x1a6c2b['unreadCount'] : _0x546aea['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x1a6c2b['id'], _0x9010d0);
                        } catch (_0x30c69d) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x30c69d['message']);
                        }
                    }
                }
            }
        });
        _0x1c7652['on']('chats.delete', async _0x1aa4da => {
            for (const _0x2f231e of _0x1aa4da) {
                if (backend === 'memory') {
                    delete this['chats'][_0x2f231e];
                    delete this['messages'][_0x2f231e];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x2f231e);
                    } catch (_0x40fbde) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x40fbde['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x43b253, _0x14c534) {
        if (backend === 'memory') {
            const _0x1f6e4c = this['messages'][_0x43b253]?.['find'](_0x66f127 => _0x66f127['key']['id'] === _0x14c534) || null;
            return _0x1f6e4c;
        } else {
            try {
                return await adapters[backend]['load'](_0x43b253, _0x14c534);
            } catch (_0xc5f551) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x14c534 + ':', _0xc5f551['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x2ff18a, _0x425694, _0x33c956) {
        if (backend === 'memory') {
            const _0x1d93b4 = './data';
            if (!_0x0_0x1281b1['existsSync'](_0x1d93b4))
                _0x0_0x1281b1['mkdirSync'](_0x1d93b4, { 'recursive': !![] });
            const _0xcfb438 = _0x0_0x474811['join'](_0x1d93b4, _0x425694 + '.json');
            try {
                _0x0_0x1281b1['writeFileSync'](_0xcfb438, JSON['stringify'](_0x33c956, null, 0x2));
            } catch (_0x471f2a) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x425694 + ':', _0x471f2a['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x2ff18a, _0x425694, _0x33c956);
            } catch (_0x5daf27) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x425694 + ':', _0x5daf27['message']);
            }
        }
    },
    async 'getSetting'(_0x442c7b, _0x1a7c5f) {
        if (backend === 'memory') {
            const _0x510976 = './data';
            const _0x25c91b = _0x0_0x474811['join'](_0x510976, _0x1a7c5f + '.json');
            try {
                if (_0x0_0x1281b1['existsSync'](_0x25c91b)) {
                    const _0x45dfb6 = JSON['parse'](_0x0_0x1281b1['readFileSync'](_0x25c91b, 'utf-8'));
                    if (_0x45dfb6['enabled'] !== undefined)
                        return _0x45dfb6;
                    if (_0x45dfb6[_0x442c7b] !== undefined)
                        return _0x45dfb6[_0x442c7b];
                    return null;
                }
                return null;
            } catch (_0x5eb380) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x1a7c5f + ':', _0x5eb380['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x442c7b, _0x1a7c5f);
            } catch (_0x38fa87) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x1a7c5f + ':', _0x38fa87['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x2b230f) {
        if (backend === 'memory') {
            const _0x139c66 = './data';
            const _0x4d0134 = {};
            try {
                if (_0x0_0x1281b1['existsSync'](_0x139c66)) {
                    const _0x4dd247 = _0x0_0x1281b1['readdirSync'](_0x139c66)['filter'](_0x26ac55 => _0x26ac55['endsWith']('.json'));
                    for (const _0x4799c0 of _0x4dd247) {
                        const _0x4ba249 = _0x0_0x474811['basename'](_0x4799c0, '.json');
                        if (_0x4ba249 === 'messageCount' || _0x4ba249 === 'owner')
                            continue;
                        const _0x45b9a7 = _0x0_0x474811['join'](_0x139c66, _0x4799c0);
                        const _0x31a9fa = JSON['parse'](_0x0_0x1281b1['readFileSync'](_0x45b9a7, 'utf-8'));
                        if (_0x31a9fa[_0x2b230f]) {
                            _0x4d0134[_0x4ba249] = _0x31a9fa[_0x2b230f];
                        }
                    }
                }
                return _0x4d0134;
            } catch (_0x59f9f7) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x59f9f7['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x2b230f);
            } catch (_0x1a278d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x1a278d['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0xc61345) {
        const _0x80dbcb = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x80dbcb['includes'](_0xc61345)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0xc61345 + ',\x20defaulting\x20to\x20private');
            _0xc61345 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0xc61345;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0xc61345);
            } catch (_0x570ea5) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x570ea5['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x5b5682 = await adapters[backend]['getMetadata']('botMode');
                return _0x5b5682 || 'private';
            } catch (_0x5e46c4) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x5e46c4['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x4fab9c, _0x580df8, _0x2e7e66) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x4fab9c]) {
                this['messageCount'][_0x4fab9c] = {};
            }
            if (!this['messageCount'][_0x4fab9c][_0x580df8]) {
                this['messageCount'][_0x4fab9c][_0x580df8] = 0x0;
            }
            this['messageCount'][_0x4fab9c][_0x580df8]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x4fab9c, _0x580df8);
            } catch (_0x110e93) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x580df8 + ':', _0x110e93['message']);
            }
        }
    },
    async 'getMessageCount'(_0x458cf0, _0x4008e5) {
        if (backend === 'memory') {
            return this['messageCount'][_0x458cf0]?.[_0x4008e5] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x458cf0, _0x4008e5);
            } catch (_0x5e0aa7) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x4008e5 + ':', _0x5e0aa7['message']);
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
            } catch (_0x45d7c5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x45d7c5['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x45bb34) {
        if (backend === 'memory') {
            this['isPublic'] = _0x45bb34;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x45bb34);
            } catch (_0x2e9481) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x2e9481['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x8ea555 = await adapters[backend]['getAllCounts']();
                return _0x8ea555['isPublic'];
            } catch (_0x43bd8a) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x43bd8a['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x2369ff) {
        const _0x107900 = [
            'public',
            'private'
        ];
        if (!_0x107900['includes'](_0x2369ff)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x2369ff);
            _0x2369ff = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x2369ff;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x2369ff);
            } catch (_0x2e7b96) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x2e7b96['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x403ea8 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x403ea8 || 'private';
            } catch (_0x5dce20) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x5dce20['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x1a7ecc = 0x0;
        const _0x271994 = Object['keys'](this['contacts'])['length'];
        const _0x2d1e01 = Object['keys'](this['chats'])['length'];
        let _0x50fd30 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x4df98d => {
                if (Array['isArray'](_0x4df98d)) {
                    _0x1a7ecc += _0x4df98d['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x59c1fd => {
                if (typeof _0x59c1fd === 'object') {
                    _0x50fd30 += Object['keys'](_0x59c1fd)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x1a7ecc : 'stored\x20in\x20database',
            'contacts': _0x271994,
            'chats': _0x2d1e01,
            'messageCounts': backend === 'memory' ? _0x50fd30 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x177f7b => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x177f7b));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x481982 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x481982));
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
        let _0x4824ea = 0x0;
        Object['keys'](store['chats'])['forEach'](_0xf17721 => {
            if (store['chats'][_0xf17721]['messages']) {
                delete store['chats'][_0xf17721]['messages'];
                _0x4824ea++;
            }
        });
        if (_0x4824ea > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x4824ea + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x5add2c => {
    console['log']('[STORE]\x20Received\x20' + _0x5add2c + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x5251ed) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x5251ed['message']);
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
process['on']('uncaughtException', _0x555082 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x555082);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x25cdee, _0x4130f9) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x4130f9, 'reason:', _0x25cdee);
});
export default store;