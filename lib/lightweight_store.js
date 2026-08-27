import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x510ff7 from 'fs';
import _0x0_0xd55ebb from 'path';
import _0x0_0x4fe557 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x2d6988) {
    printLog = (_0x14d979, _0x5c4b44) => console['log']('[' + _0x14d979['toUpperCase']() + ']\x20' + _0x5c4b44);
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
} catch (_0x0_0x1770d0) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x4ac834 => {
    try {
        return _0x0_0x4fe557['deflateSync'](JSON['stringify'](_0x4ac834));
    } catch (_0x5e2742) {
        console['error']('[STORE]\x20Compression\x20error:', _0x5e2742['message']);
        return Buffer['from'](JSON['stringify'](_0x4ac834));
    }
};
const decompress = _0x3b8f5c => {
    try {
        return JSON['parse'](_0x0_0x4fe557['inflateSync'](_0x3b8f5c));
    } catch (_0x3a9040) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x3a9040['message']);
        try {
            return JSON['parse'](_0x3b8f5c['toString']());
        } catch (_0x243efa) {
            return null;
        }
    }
};
function slimMessage(_0x2e5ef8) {
    return {
        'key': _0x2e5ef8['key'],
        'message': _0x2e5ef8['message'],
        'messageTimestamp': _0x2e5ef8['messageTimestamp'],
        'participant': _0x2e5ef8['participant'],
        'pushName': _0x2e5ef8['pushName'],
        'broadcast': _0x2e5ef8['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x36e280 => console['error']('[MONGO]\x20Connection\x20error:', _0x36e280));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x315729, _0x86bcc, _0x157902) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x315729,
                        'id': _0x86bcc
                    }, {
                        'data': compress(_0x157902),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4f6d48) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x4f6d48['message']);
                }
            },
            async 'load'(_0x56d599, _0xfeb4f6) {
                try {
                    const _0x32f115 = await Msg['findOne']({
                        'jid': _0x56d599,
                        'id': _0xfeb4f6
                    });
                    return _0x32f115 ? decompress(_0x32f115['data']) : null;
                } catch (_0x598b3d) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x598b3d['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x2e7ff9, _0x39b74b) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x2e7ff9,
                        'userId': _0x39b74b
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x46ac9f) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x46ac9f['message']);
                }
            },
            async 'getCount'(_0xa731cd, _0x10aefb) {
                try {
                    const _0x1dc503 = await MsgCount['findOne']({
                        'chatId': _0xa731cd,
                        'userId': _0x10aefb
                    });
                    return _0x1dc503 ? _0x1dc503['count'] : 0x0;
                } catch (_0x120192) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x120192['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x388652 = await MsgCount['find']({});
                    const _0xaa8e8a = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x388652['forEach'](_0x163cdb => {
                        if (!_0xaa8e8a['messageCount'][_0x163cdb['chatId']]) {
                            _0xaa8e8a['messageCount'][_0x163cdb['chatId']] = {};
                        }
                        _0xaa8e8a['messageCount'][_0x163cdb['chatId']][_0x163cdb['userId']] = _0x163cdb['count'];
                    });
                    const _0x360a35 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x360a35)
                        _0xaa8e8a['isPublic'] = _0x360a35['value'] === 'true';
                    return _0xaa8e8a;
                } catch (_0x177dfc) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x177dfc['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3668ce) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x3668ce['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x566b60) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x566b60['message']);
                }
            },
            async 'setMetadata'(_0x4a7f36, _0x44a73b) {
                try {
                    await Meta['updateOne']({ 'key': _0x4a7f36 }, {
                        'key': _0x4a7f36,
                        'value': _0x44a73b['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x3e6354) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x3e6354['message']);
                }
            },
            async 'getMetadata'(_0x2f44c9) {
                try {
                    const _0xda6b19 = await Meta['findOne']({ 'key': _0x2f44c9 });
                    return _0xda6b19 ? _0xda6b19['value'] : null;
                } catch (_0x55641d) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x55641d['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x1b8539, _0x4efa22) {
                try {
                    await Contact['updateOne']({ 'jid': _0x1b8539 }, {
                        ..._0x4efa22,
                        'jid': _0x1b8539,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x2c211e) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x2c211e['message']);
                }
            },
            async 'getContact'(_0x4ac1a3) {
                try {
                    return await Contact['findOne']({ 'jid': _0x4ac1a3 });
                } catch (_0x97bc84) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x97bc84['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x45afcc = await Contact['find']({});
                    const _0x1a0ef1 = {};
                    _0x45afcc['forEach'](_0x16e194 => {
                        _0x1a0ef1[_0x16e194['jid']] = {
                            'id': _0x16e194['jid'],
                            'name': _0x16e194['name'],
                            'notify': _0x16e194['notify']
                        };
                    });
                    return _0x1a0ef1;
                } catch (_0x2d089f) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x2d089f['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x2785c9, _0x55f3df) {
                try {
                    await Chat['updateOne']({ 'jid': _0x2785c9 }, {
                        ..._0x55f3df,
                        'jid': _0x2785c9,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x335983) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x335983['message']);
                }
            },
            async 'getChat'(_0x1aa01d) {
                try {
                    return await Chat['findOne']({ 'jid': _0x1aa01d });
                } catch (_0x2ca023) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x2ca023['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x431636 = await Chat['find']({});
                    const _0x5c60c2 = {};
                    _0x431636['forEach'](_0x3961fa => {
                        _0x5c60c2[_0x3961fa['jid']] = {
                            'id': _0x3961fa['jid'],
                            'name': _0x3961fa['name'],
                            'conversationTimestamp': _0x3961fa['conversationTimestamp'],
                            'unreadCount': _0x3961fa['unreadCount']
                        };
                    });
                    return _0x5c60c2;
                } catch (_0x1ed260) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x1ed260['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x362470) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x362470 });
                } catch (_0x20a143) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x20a143['message']);
                }
            },
            async 'saveSetting'(_0x584f76, _0x31d0fe, _0x4f002d) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x584f76,
                        'key': _0x31d0fe
                    }, {
                        'chatId': _0x584f76,
                        'key': _0x31d0fe,
                        'value': _0x4f002d,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x420e8f) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x420e8f['message']);
                }
            },
            async 'getSetting'(_0x2c26ad, _0x14a733) {
                try {
                    const _0x618b15 = await Setting['findOne']({
                        'chatId': _0x2c26ad,
                        'key': _0x14a733
                    });
                    return _0x618b15 ? _0x618b15['value'] : null;
                } catch (_0x1fe9fb) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x1fe9fb['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x19a18a) {
                try {
                    const _0x28f893 = await Setting['find']({ 'chatId': _0x19a18a });
                    const _0x20dce1 = {};
                    _0x28f893['forEach'](_0xfa22a9 => {
                        _0x20dce1[_0xfa22a9['key']] = _0xfa22a9['value'];
                    });
                    return _0x20dce1;
                } catch (_0x4e31d5) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x4e31d5['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x19da56 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x19da56['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x19da56['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x4ed074) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x4ed074['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x3eecf5) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x3eecf5['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x27e424) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x27e424['message']);
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
        pool['on']('error', _0x1e8c0f => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x1e8c0f['message']);
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
                        const _0x36d7b3 = await pool['connect']();
                        try {
                            await _0x36d7b3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x36d7b3['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x36d7b3['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x36d7b3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x36d7b3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x36d7b3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x36d7b3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x36d7b3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x36d7b3['release']();
                        }
                    } catch (_0x3c847d) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x3c847d['message']);
                        this['initPromise'] = null;
                        throw _0x3c847d;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x7b930d, _0x313c20, _0x538897) {
                try {
                    await this['init']();
                    const _0x2d6074 = await pool['connect']();
                    try {
                        await _0x2d6074['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x7b930d,
                            _0x313c20,
                            Date['now'](),
                            compress(_0x538897)
                        ]);
                    } finally {
                        _0x2d6074['release']();
                    }
                } catch (_0x1f9e8d) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x1f9e8d['message']);
                }
            },
            async 'load'(_0x3b29e6, _0x3c45f9) {
                try {
                    await this['init']();
                    const _0x4f9405 = await pool['connect']();
                    try {
                        const _0x4da7df = await _0x4f9405['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x3b29e6,
                            _0x3c45f9
                        ]);
                        return _0x4da7df['rows'][0x0] ? decompress(_0x4da7df['rows'][0x0]['data']) : null;
                    } finally {
                        _0x4f9405['release']();
                    }
                } catch (_0x185998) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x185998['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x2a5e8e, _0x4fb6b3) {
                try {
                    await this['init']();
                    const _0x3b2791 = await pool['connect']();
                    try {
                        await _0x3b2791['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x2a5e8e,
                            _0x4fb6b3
                        ]);
                    } finally {
                        _0x3b2791['release']();
                    }
                } catch (_0x3288dd) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x3288dd['message']);
                }
            },
            async 'getCount'(_0x511f71, _0xd47598) {
                try {
                    await this['init']();
                    const _0x36c33b = await pool['connect']();
                    try {
                        const _0x1e5894 = await _0x36c33b['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x511f71,
                            _0xd47598
                        ]);
                        return _0x1e5894['rows'][0x0] ? _0x1e5894['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x36c33b['release']();
                    }
                } catch (_0x1077dd) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x1077dd['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x1858f7 = await pool['connect']();
                    try {
                        const _0xb91d17 = await _0x1858f7['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x333259 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0xb91d17['rows']['forEach'](_0x353e1f => {
                            if (!_0x333259['messageCount'][_0x353e1f['chat_id']]) {
                                _0x333259['messageCount'][_0x353e1f['chat_id']] = {};
                            }
                            _0x333259['messageCount'][_0x353e1f['chat_id']][_0x353e1f['user_id']] = _0x353e1f['count'];
                        });
                        const _0xb92550 = await _0x1858f7['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0xb92550['rows'][0x0])
                            _0x333259['isPublic'] = _0xb92550['rows'][0x0]['value'] === 'true';
                        return _0x333259;
                    } finally {
                        _0x1858f7['release']();
                    }
                } catch (_0x212e04) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x212e04['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x4576b9) {
                try {
                    await this['init']();
                    const _0x37555f = await pool['connect']();
                    try {
                        await _0x37555f['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x4576b9['toString']()]);
                    } finally {
                        _0x37555f['release']();
                    }
                } catch (_0x5c3a72) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x5c3a72['message']);
                }
            },
            async 'setMetadata'(_0x76d8d, _0x59b2a6) {
                try {
                    await this['init']();
                    const _0x25a823 = await pool['connect']();
                    try {
                        await _0x25a823['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x76d8d,
                            _0x59b2a6['toString']()
                        ]);
                    } finally {
                        _0x25a823['release']();
                    }
                } catch (_0x71fae5) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x71fae5['message']);
                }
            },
            async 'getMetadata'(_0x55fc98) {
                try {
                    await this['init']();
                    const _0x262d86 = await pool['connect']();
                    try {
                        const _0x591547 = await _0x262d86['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x55fc98]);
                        return _0x591547['rows'][0x0] ? _0x591547['rows'][0x0]['value'] : null;
                    } finally {
                        _0x262d86['release']();
                    }
                } catch (_0x1eb740) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x1eb740['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x115473, _0x6e973f) {
                try {
                    await this['init']();
                    const _0xed20e8 = await pool['connect']();
                    try {
                        await _0xed20e8['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x115473,
                            _0x6e973f['name'] || '',
                            _0x6e973f['notify'] || '',
                            _0x6e973f['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0xed20e8['release']();
                    }
                } catch (_0x208e64) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x208e64['message']);
                }
            },
            async 'getContact'(_0x2f3e90) {
                try {
                    await this['init']();
                    const _0x4f2dd6 = await pool['connect']();
                    try {
                        const _0x3ae162 = await _0x4f2dd6['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x2f3e90]);
                        return _0x3ae162['rows'][0x0] || null;
                    } finally {
                        _0x4f2dd6['release']();
                    }
                } catch (_0x14f2cb) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x14f2cb['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x5b5500 = await pool['connect']();
                    try {
                        const _0x228b58 = await _0x5b5500['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0xfbd086 = {};
                        _0x228b58['rows']['forEach'](_0x53bde1 => {
                            _0xfbd086[_0x53bde1['jid']] = {
                                'id': _0x53bde1['jid'],
                                'name': _0x53bde1['name'],
                                'notify': _0x53bde1['notify']
                            };
                        });
                        return _0xfbd086;
                    } finally {
                        _0x5b5500['release']();
                    }
                } catch (_0x37260e) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x37260e['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x15244a, _0x568168) {
                try {
                    await this['init']();
                    const _0x2f3df0 = await pool['connect']();
                    try {
                        await _0x2f3df0['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x15244a,
                            _0x568168['name'] || '',
                            _0x568168['conversationTimestamp'] || 0x0,
                            _0x568168['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x2f3df0['release']();
                    }
                } catch (_0x5271a0) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x5271a0['message']);
                }
            },
            async 'getChat'(_0x21c822) {
                try {
                    await this['init']();
                    const _0x4a6df8 = await pool['connect']();
                    try {
                        const _0x176aa4 = await _0x4a6df8['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x21c822]);
                        return _0x176aa4['rows'][0x0] || null;
                    } finally {
                        _0x4a6df8['release']();
                    }
                } catch (_0x32cf51) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x32cf51['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x413fab = await pool['connect']();
                    try {
                        const _0x2d2853 = await _0x413fab['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x5435c2 = {};
                        _0x2d2853['rows']['forEach'](_0x89aca8 => {
                            _0x5435c2[_0x89aca8['jid']] = {
                                'id': _0x89aca8['jid'],
                                'name': _0x89aca8['name'],
                                'conversationTimestamp': _0x89aca8['conversation_timestamp'],
                                'unreadCount': _0x89aca8['unread_count']
                            };
                        });
                        return _0x5435c2;
                    } finally {
                        _0x413fab['release']();
                    }
                } catch (_0x4a819c) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x4a819c['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x1941a9) {
                try {
                    await this['init']();
                    const _0x13a8b8 = await pool['connect']();
                    try {
                        await _0x13a8b8['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x1941a9]);
                    } finally {
                        _0x13a8b8['release']();
                    }
                } catch (_0x1bb2c9) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x1bb2c9['message']);
                }
            },
            async 'saveSetting'(_0x21b87c, _0x29c85c, _0x4c638b) {
                try {
                    await this['init']();
                    const _0x457326 = await pool['connect']();
                    try {
                        await _0x457326['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x21b87c,
                            _0x29c85c,
                            JSON['stringify'](_0x4c638b),
                            Date['now']()
                        ]);
                    } finally {
                        _0x457326['release']();
                    }
                } catch (_0x5241d8) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x5241d8['message']);
                }
            },
            async 'getSetting'(_0x55a843, _0x19fffd) {
                try {
                    await this['init']();
                    const _0x1940e0 = await pool['connect']();
                    try {
                        const _0x715631 = await _0x1940e0['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x55a843,
                            _0x19fffd
                        ]);
                        return _0x715631['rows'][0x0] ? JSON['parse'](_0x715631['rows'][0x0]['value']) : null;
                    } finally {
                        _0x1940e0['release']();
                    }
                } catch (_0x223d64) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x223d64['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x10b3dd) {
                try {
                    await this['init']();
                    const _0x5b8aeb = await pool['connect']();
                    try {
                        const _0x19b84b = await _0x5b8aeb['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x10b3dd]);
                        const _0x282ad8 = {};
                        _0x19b84b['rows']['forEach'](_0x3fae33 => {
                            _0x282ad8[_0x3fae33['key']] = JSON['parse'](_0x3fae33['value']);
                        });
                        return _0x282ad8;
                    } finally {
                        _0x5b8aeb['release']();
                    }
                } catch (_0x559976) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x559976['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x34dddc = await pool['connect']();
                    try {
                        const _0x5847e2 = await _0x34dddc['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x5847e2['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x5847e2['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x34dddc['release']();
                    }
                } catch (_0x2b4948) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x2b4948['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x56643e) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x56643e['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x5beb9a) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x5beb9a['message']);
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
                    } catch (_0x430f38) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x430f38['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x430f38;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x3cef5b, _0x8a694f, _0xa412c8) {
                try {
                    const _0x2bc9e1 = await this['getConn']();
                    await _0x2bc9e1['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x3cef5b,
                        _0x8a694f,
                        Date['now'](),
                        compress(_0xa412c8)
                    ]);
                } catch (_0x3596c5) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x3596c5['message']);
                }
            },
            async 'load'(_0x422b4b, _0x387431) {
                try {
                    const _0x4239f8 = await this['getConn']();
                    const [_0x4affdd] = await _0x4239f8['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x422b4b,
                        _0x387431
                    ]);
                    return _0x4affdd[0x0] ? decompress(_0x4affdd[0x0]['data']) : null;
                } catch (_0x45b4ac) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x45b4ac['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x2dd657, _0x951495) {
                try {
                    const _0x4871d4 = await this['getConn']();
                    await _0x4871d4['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x2dd657,
                        _0x951495
                    ]);
                } catch (_0x4d290f) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x4d290f['message']);
                }
            },
            async 'getCount'(_0x15fb96, _0x2944be) {
                try {
                    const _0x145e0e = await this['getConn']();
                    const [_0x44e3f2] = await _0x145e0e['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x15fb96,
                        _0x2944be
                    ]);
                    return _0x44e3f2[0x0] ? _0x44e3f2[0x0]['count'] : 0x0;
                } catch (_0x3b09ea) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x3b09ea['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x48d8de = await this['getConn']();
                    const [_0x527272] = await _0x48d8de['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x5051a2 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x527272['forEach'](_0x35570a => {
                        if (!_0x5051a2['messageCount'][_0x35570a['chat_id']]) {
                            _0x5051a2['messageCount'][_0x35570a['chat_id']] = {};
                        }
                        _0x5051a2['messageCount'][_0x35570a['chat_id']][_0x35570a['user_id']] = _0x35570a['count'];
                    });
                    const [_0x5c2a16] = await _0x48d8de['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x5c2a16[0x0])
                        _0x5051a2['isPublic'] = _0x5c2a16[0x0]['value'] === 'true';
                    return _0x5051a2;
                } catch (_0x5b647f) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x5b647f['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x213e06) {
                try {
                    const _0x21afe0 = await this['getConn']();
                    await _0x21afe0['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x213e06['toString']()]);
                } catch (_0x14ac1a) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x14ac1a['message']);
                }
            },
            async 'setMetadata'(_0x4adfba, _0x1819ce) {
                try {
                    const _0x5163a2 = await this['getConn']();
                    await _0x5163a2['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x4adfba,
                        _0x1819ce['toString']()
                    ]);
                } catch (_0x527578) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x527578['message']);
                }
            },
            async 'getMetadata'(_0x19b7a0) {
                try {
                    const _0x31009a = await this['getConn']();
                    const [_0xd6e41c] = await _0x31009a['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x19b7a0]);
                    return _0xd6e41c[0x0] ? _0xd6e41c[0x0]['value'] : null;
                } catch (_0xba0903) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0xba0903['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x49b4ea, _0x40e577) {
                try {
                    const _0x1b6d81 = await this['getConn']();
                    await _0x1b6d81['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x49b4ea,
                        _0x40e577['name'] || '',
                        _0x40e577['notify'] || '',
                        _0x40e577['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x2dc181) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x2dc181['message']);
                }
            },
            async 'getContact'(_0x370d5e) {
                try {
                    const _0x13fbcf = await this['getConn']();
                    const [_0x4b378e] = await _0x13fbcf['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x370d5e]);
                    return _0x4b378e[0x0] || null;
                } catch (_0x2983d7) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x2983d7['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x7b9f1c = await this['getConn']();
                    const [_0xa4ae7d] = await _0x7b9f1c['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x5c9e2b = {};
                    _0xa4ae7d['forEach'](_0xb77fb6 => {
                        _0x5c9e2b[_0xb77fb6['jid']] = {
                            'id': _0xb77fb6['jid'],
                            'name': _0xb77fb6['name'],
                            'notify': _0xb77fb6['notify']
                        };
                    });
                    return _0x5c9e2b;
                } catch (_0x2e9867) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x2e9867['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x246f52, _0x54b2c2) {
                try {
                    const _0x2a641f = await this['getConn']();
                    await _0x2a641f['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x246f52,
                        _0x54b2c2['name'] || '',
                        _0x54b2c2['conversationTimestamp'] || 0x0,
                        _0x54b2c2['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0xd7cde3) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0xd7cde3['message']);
                }
            },
            async 'getChat'(_0x39366c) {
                try {
                    const _0x1bf7eb = await this['getConn']();
                    const [_0x44d555] = await _0x1bf7eb['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x39366c]);
                    return _0x44d555[0x0] || null;
                } catch (_0x295228) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x295228['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x87e644 = await this['getConn']();
                    const [_0x29c10a] = await _0x87e644['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x1c64a5 = {};
                    _0x29c10a['forEach'](_0x2e1282 => {
                        _0x1c64a5[_0x2e1282['jid']] = {
                            'id': _0x2e1282['jid'],
                            'name': _0x2e1282['name'],
                            'conversationTimestamp': _0x2e1282['conversation_timestamp'],
                            'unreadCount': _0x2e1282['unread_count']
                        };
                    });
                    return _0x1c64a5;
                } catch (_0x3786fb) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x3786fb['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x3dd707) {
                try {
                    const _0x1127aa = await this['getConn']();
                    await _0x1127aa['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x3dd707]);
                } catch (_0x28a72e) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x28a72e['message']);
                }
            },
            async 'saveSetting'(_0x17cc28, _0xcc4cfb, _0x3d4efd) {
                try {
                    const _0x443408 = await this['getConn']();
                    await _0x443408['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x17cc28,
                        _0xcc4cfb,
                        JSON['stringify'](_0x3d4efd),
                        Date['now']()
                    ]);
                } catch (_0x5c0cf3) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x5c0cf3['message']);
                }
            },
            async 'getSetting'(_0x16555f, _0x469455) {
                try {
                    const _0x3e8362 = await this['getConn']();
                    const [_0x5e0f7b] = await _0x3e8362['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x16555f,
                        _0x469455
                    ]);
                    return _0x5e0f7b[0x0] ? JSON['parse'](_0x5e0f7b[0x0]['value']) : null;
                } catch (_0x331a18) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x331a18['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x1b3cfa) {
                try {
                    const _0x335a60 = await this['getConn']();
                    const [_0x57f9de] = await _0x335a60['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x1b3cfa]);
                    const _0x42edbd = {};
                    _0x57f9de['forEach'](_0x4a34f6 => {
                        _0x42edbd[_0x4a34f6['key']] = JSON['parse'](_0x4a34f6['value']);
                    });
                    return _0x42edbd;
                } catch (_0x5e6083) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x5e6083['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x1458e6 = await this['getConn']();
                    const [_0x5afbe9] = await _0x1458e6['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x5afbe9['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x5afbe9['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x5df28c) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x5df28c['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x1ecb99) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x1ecb99['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0xeb2179) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0xeb2179['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0xd55ebb['dirname'](SQLITE_URL);
        if (!_0x0_0x510ff7['existsSync'](dir))
            _0x0_0x510ff7['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x4d8082, _0x1d87e6, _0x384709) {
                try {
                    saveStmt['run'](_0x4d8082, _0x1d87e6, Date['now'](), compress(_0x384709));
                    const {count: _0x5991e7} = countStmt['get'](_0x4d8082);
                    if (_0x5991e7 > MESSAGE_LIMITS['sqlite']) {
                        const _0x5da8ed = _0x5991e7 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x4d8082, _0x4d8082, _0x5da8ed);
                    }
                } catch (_0xe1a22a) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0xe1a22a['message']);
                }
            },
            'load'(_0x488089, _0x541245) {
                try {
                    const _0x376b9b = loadStmt['get'](_0x488089, _0x541245);
                    return _0x376b9b ? decompress(_0x376b9b['data']) : null;
                } catch (_0x4637f2) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x4637f2['message']);
                    return null;
                }
            },
            'incrementCount'(_0x50ad7f, _0x17a0a6) {
                try {
                    incrementCountStmt['run'](_0x50ad7f, _0x17a0a6);
                } catch (_0x2d9557) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x2d9557['message']);
                }
            },
            'getCount'(_0x4b02d1, _0x2ebd1b) {
                try {
                    const _0x526321 = getCountStmt['get'](_0x4b02d1, _0x2ebd1b);
                    return _0x526321 ? _0x526321['count'] : 0x0;
                } catch (_0x1794a7) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x1794a7['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x5d8743 = getAllCountsStmt['all']();
                    const _0x1461c0 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x5d8743['forEach'](_0x440732 => {
                        if (!_0x1461c0['messageCount'][_0x440732['chat_id']]) {
                            _0x1461c0['messageCount'][_0x440732['chat_id']] = {};
                        }
                        _0x1461c0['messageCount'][_0x440732['chat_id']][_0x440732['user_id']] = _0x440732['count'];
                    });
                    const _0x359b64 = getMetaStmt['get']();
                    if (_0x359b64)
                        _0x1461c0['isPublic'] = _0x359b64['value'] === 'true';
                    return _0x1461c0;
                } catch (_0x4cafaa) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x4cafaa['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x4126dd) {
                try {
                    setMetaStmt['run'](_0x4126dd['toString']());
                } catch (_0x23f174) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x23f174['message']);
                }
            },
            'setMetadata'(_0x4937a7, _0x5cf1fd) {
                try {
                    setMetadataStmt['run'](_0x4937a7, _0x5cf1fd['toString']());
                } catch (_0x265aaa) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x265aaa['message']);
                }
            },
            'getMetadata'(_0x1df76d) {
                try {
                    const _0x302fbf = getMetadataStmt['get'](_0x1df76d);
                    return _0x302fbf ? _0x302fbf['value'] : null;
                } catch (_0x339fbe) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x339fbe['message']);
                    return null;
                }
            },
            'saveContact'(_0x365d9d, _0x9290a0) {
                try {
                    saveContactStmt['run'](_0x365d9d, _0x9290a0['name'] || '', _0x9290a0['notify'] || '', _0x9290a0['verifiedName'] || '', Date['now']());
                } catch (_0x4a83b3) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x4a83b3['message']);
                }
            },
            'getContact'(_0x361f1c) {
                try {
                    return getContactStmt['get'](_0x361f1c) || null;
                } catch (_0x30e6ef) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x30e6ef['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x325d05 = getAllContactsStmt['all']();
                    const _0x19531c = {};
                    _0x325d05['forEach'](_0x1a81d0 => {
                        _0x19531c[_0x1a81d0['jid']] = {
                            'id': _0x1a81d0['jid'],
                            'name': _0x1a81d0['name'],
                            'notify': _0x1a81d0['notify']
                        };
                    });
                    return _0x19531c;
                } catch (_0x447002) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x447002['message']);
                    return {};
                }
            },
            'saveChat'(_0xe148ab, _0x3d0451) {
                try {
                    saveChatStmt['run'](_0xe148ab, _0x3d0451['name'] || '', _0x3d0451['conversationTimestamp'] || 0x0, _0x3d0451['unreadCount'] || 0x0, Date['now']());
                } catch (_0x3d48ef) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x3d48ef['message']);
                }
            },
            'getChat'(_0x418f4f) {
                try {
                    return getChatStmt['get'](_0x418f4f) || null;
                } catch (_0x52946c) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x52946c['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0xebb409 = getAllChatsStmt['all']();
                    const _0x4de743 = {};
                    _0xebb409['forEach'](_0x225eaf => {
                        _0x4de743[_0x225eaf['jid']] = {
                            'id': _0x225eaf['jid'],
                            'name': _0x225eaf['name'],
                            'conversationTimestamp': _0x225eaf['conversation_timestamp'],
                            'unreadCount': _0x225eaf['unread_count']
                        };
                    });
                    return _0x4de743;
                } catch (_0x1fc226) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x1fc226['message']);
                    return {};
                }
            },
            'deleteChat'(_0x30f920) {
                try {
                    deleteChatStmt['run'](_0x30f920);
                } catch (_0x321ec8) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x321ec8['message']);
                }
            },
            'saveSetting'(_0x5750dd, _0x220106, _0x219f84) {
                try {
                    saveSettingStmt['run'](_0x5750dd, _0x220106, JSON['stringify'](_0x219f84), Date['now']());
                } catch (_0x425826) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x425826['message']);
                }
            },
            'getSetting'(_0x90107f, _0x4a8047) {
                try {
                    const _0x1215fd = getSettingStmt['get'](_0x90107f, _0x4a8047);
                    return _0x1215fd ? JSON['parse'](_0x1215fd['value']) : null;
                } catch (_0x5c232c) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x5c232c['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x29f8e4) {
                try {
                    const _0x2e024e = getAllSettingsStmt['all'](_0x29f8e4);
                    const _0x81c55c = {};
                    _0x2e024e['forEach'](_0xf59447 => {
                        _0x81c55c[_0xf59447['key']] = JSON['parse'](_0xf59447['value']);
                    });
                    return _0x81c55c;
                } catch (_0x2eb861) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x2eb861['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x2879ad = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x2879ad['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x2879ad['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x2cf9fd) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x2cf9fd['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x5101b2) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x5101b2['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x4e6275) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x4e6275['message']);
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
    async 'readFromFile'(_0x52aa7f = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x241c58 = await adapters[backend]['getAllContacts']();
                const _0x56b7a2 = await adapters[backend]['getAllChats']();
                const _0x276af3 = await this['getBotMode']();
                this['contacts'] = _0x241c58;
                this['chats'] = _0x56b7a2;
                this['botMode'] = _0x276af3;
            } else {
                if (_0x0_0x510ff7['existsSync'](_0x52aa7f)) {
                    const _0x1c61f3 = JSON['parse'](_0x0_0x510ff7['readFileSync'](_0x52aa7f, 'utf-8'));
                    this['contacts'] = _0x1c61f3['contacts'] || {};
                    this['chats'] = _0x1c61f3['chats'] || {};
                    this['botMode'] = _0x1c61f3['botMode'] || 'private';
                    this['messages'] = _0x1c61f3['messages'] || {};
                    this['isPublic'] = _0x1c61f3['isPublic'] !== undefined ? _0x1c61f3['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x14f340) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x14f340['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x4707ae = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x1c674d = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x510ff7['writeFileSync'](_0x4707ae, JSON['stringify'](_0x1c674d, null, 0x2));
        } catch (_0x360a82) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x360a82['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x510ff7['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x34a99f = JSON['parse'](_0x0_0x510ff7['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x34a99f['messageCount'] || _0x34a99f;
                    this['isPublic'] = typeof _0x34a99f['isPublic'] === 'boolean' ? _0x34a99f['isPublic'] : ![];
                }
            } catch (_0x494afd) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x494afd['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x30484f = _0x0_0xd55ebb['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x510ff7['existsSync'](_0x30484f))
                    _0x0_0x510ff7['mkdirSync'](_0x30484f, { 'recursive': !![] });
                const _0x339ac3 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x510ff7['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x339ac3, null, 0x2));
            } catch (_0x29ae22) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x29ae22['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x1d55a2 => {
                if (typeof this['messages'][_0x1d55a2] === 'object' && !Array['isArray'](this['messages'][_0x1d55a2])) {
                    const _0x1bdd07 = Object['values'](this['messages'][_0x1d55a2]);
                    this['messages'][_0x1d55a2] = _0x1bdd07['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x1d55a2])) {
                    if (this['messages'][_0x1d55a2]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x1d55a2] = this['messages'][_0x1d55a2]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0xd1ed50 => {
                if (this['chats'][_0xd1ed50]['messages']) {
                    delete this['chats'][_0xd1ed50]['messages'];
                }
            });
        }
    },
    'bind'(_0x1bdb08) {
        _0x1bdb08['on']('messages.upsert', async ({messages: _0x25d6c8}) => {
            for (const _0x4e469a of _0x25d6c8) {
                if (!_0x4e469a['key']?.['remoteJid'])
                    continue;
                const _0x4a6f06 = _0x4e469a['key']['remoteJid'];
                const _0x2fe5a9 = slimMessage(_0x4e469a);
                if (backend === 'memory') {
                    this['messages'][_0x4a6f06] = this['messages'][_0x4a6f06] || [];
                    this['messages'][_0x4a6f06]['push'](_0x2fe5a9);
                    if (this['messages'][_0x4a6f06]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x4a6f06] = this['messages'][_0x4a6f06]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x4a6f06, _0x4e469a['key']['id'], _0x2fe5a9);
                    } catch (_0xa90a06) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x4e469a['key']['id'] + ':', _0xa90a06['message']);
                    }
                }
            }
        });
        _0x1bdb08['on']('contacts.update', async _0x491614 => {
            for (const _0x56dc56 of _0x491614) {
                if (_0x56dc56['id']) {
                    const _0x234980 = {
                        'id': _0x56dc56['id'],
                        'name': _0x56dc56['notify'] || _0x56dc56['name'] || _0x56dc56['verifiedName'] || '',
                        'notify': _0x56dc56['notify'],
                        'verifiedName': _0x56dc56['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x56dc56['id']] = _0x234980;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x56dc56['id'], _0x234980);
                        } catch (_0x2bd449) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x2bd449['message']);
                        }
                    }
                }
            }
        });
        _0x1bdb08['on']('contacts.set', async _0xd41ae4 => {
            for (const _0x3c0f39 of _0xd41ae4) {
                if (_0x3c0f39['id']) {
                    const _0x463204 = {
                        'id': _0x3c0f39['id'],
                        'name': _0x3c0f39['notify'] || _0x3c0f39['name'] || _0x3c0f39['verifiedName'] || '',
                        'notify': _0x3c0f39['notify'],
                        'verifiedName': _0x3c0f39['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x3c0f39['id']] = _0x463204;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x3c0f39['id'], _0x463204);
                        } catch (_0x3b7a23) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x3b7a23['message']);
                        }
                    }
                }
            }
        });
        _0x1bdb08['on']('chats.set', async _0x38dce6 => {
            for (const _0x165557 of _0x38dce6) {
                if (_0x165557['id']) {
                    const _0x849d20 = {
                        'id': _0x165557['id'],
                        'name': _0x165557['name'] || _0x165557['subject'] || '',
                        'conversationTimestamp': _0x165557['conversationTimestamp'],
                        'unreadCount': _0x165557['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x165557['id']] = _0x849d20;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x165557['id'], _0x849d20);
                        } catch (_0x5c0239) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x5c0239['message']);
                        }
                    }
                }
            }
        });
        _0x1bdb08['on']('chats.update', async _0x11dddd => {
            for (const _0x5be6c8 of _0x11dddd) {
                if (_0x5be6c8['id']) {
                    if (backend === 'memory') {
                        const _0x49e2eb = this['chats'][_0x5be6c8['id']] || {};
                        this['chats'][_0x5be6c8['id']] = {
                            'id': _0x5be6c8['id'],
                            'name': _0x5be6c8['name'] || _0x5be6c8['subject'] || _0x49e2eb['name'] || '',
                            'conversationTimestamp': _0x5be6c8['conversationTimestamp'] || _0x49e2eb['conversationTimestamp'],
                            'unreadCount': _0x5be6c8['unreadCount'] !== undefined ? _0x5be6c8['unreadCount'] : _0x49e2eb['unreadCount']
                        };
                    } else {
                        try {
                            const _0x31185c = await adapters[backend]['getChat'](_0x5be6c8['id']) || {};
                            const _0x47f62c = {
                                'id': _0x5be6c8['id'],
                                'name': _0x5be6c8['name'] || _0x5be6c8['subject'] || _0x31185c['name'] || '',
                                'conversationTimestamp': _0x5be6c8['conversationTimestamp'] || _0x31185c['conversation_timestamp'],
                                'unreadCount': _0x5be6c8['unreadCount'] !== undefined ? _0x5be6c8['unreadCount'] : _0x31185c['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x5be6c8['id'], _0x47f62c);
                        } catch (_0x32720c) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x32720c['message']);
                        }
                    }
                }
            }
        });
        _0x1bdb08['on']('chats.delete', async _0x563041 => {
            for (const _0x9c4e9c of _0x563041) {
                if (backend === 'memory') {
                    delete this['chats'][_0x9c4e9c];
                    delete this['messages'][_0x9c4e9c];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x9c4e9c);
                    } catch (_0x507a24) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x507a24['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x1561a7, _0xe2edb7) {
        if (backend === 'memory') {
            const _0x4b36c8 = this['messages'][_0x1561a7]?.['find'](_0x222a9f => _0x222a9f['key']['id'] === _0xe2edb7) || null;
            return _0x4b36c8;
        } else {
            try {
                return await adapters[backend]['load'](_0x1561a7, _0xe2edb7);
            } catch (_0x2bf4b4) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0xe2edb7 + ':', _0x2bf4b4['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x48658a, _0x528723, _0x47ef3b) {
        if (backend === 'memory') {
            const _0x257cf7 = './data';
            if (!_0x0_0x510ff7['existsSync'](_0x257cf7))
                _0x0_0x510ff7['mkdirSync'](_0x257cf7, { 'recursive': !![] });
            const _0x23bfd7 = _0x0_0xd55ebb['join'](_0x257cf7, _0x528723 + '.json');
            try {
                _0x0_0x510ff7['writeFileSync'](_0x23bfd7, JSON['stringify'](_0x47ef3b, null, 0x2));
            } catch (_0x10eee7) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x528723 + ':', _0x10eee7['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x48658a, _0x528723, _0x47ef3b);
            } catch (_0x56bab1) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x528723 + ':', _0x56bab1['message']);
            }
        }
    },
    async 'getSetting'(_0x5d2021, _0x1f32d0) {
        if (backend === 'memory') {
            const _0x428b11 = './data';
            const _0x2187b9 = _0x0_0xd55ebb['join'](_0x428b11, _0x1f32d0 + '.json');
            try {
                if (_0x0_0x510ff7['existsSync'](_0x2187b9)) {
                    const _0x976062 = JSON['parse'](_0x0_0x510ff7['readFileSync'](_0x2187b9, 'utf-8'));
                    if (_0x976062['enabled'] !== undefined)
                        return _0x976062;
                    if (_0x976062[_0x5d2021] !== undefined)
                        return _0x976062[_0x5d2021];
                    return null;
                }
                return null;
            } catch (_0x10b1c1) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x1f32d0 + ':', _0x10b1c1['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x5d2021, _0x1f32d0);
            } catch (_0x51353c) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x1f32d0 + ':', _0x51353c['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x55fd06) {
        if (backend === 'memory') {
            const _0x9278df = './data';
            const _0x13b108 = {};
            try {
                if (_0x0_0x510ff7['existsSync'](_0x9278df)) {
                    const _0x2d60d2 = _0x0_0x510ff7['readdirSync'](_0x9278df)['filter'](_0x3bf592 => _0x3bf592['endsWith']('.json'));
                    for (const _0x5b9116 of _0x2d60d2) {
                        const _0x493be7 = _0x0_0xd55ebb['basename'](_0x5b9116, '.json');
                        if (_0x493be7 === 'messageCount' || _0x493be7 === 'owner')
                            continue;
                        const _0x4d9835 = _0x0_0xd55ebb['join'](_0x9278df, _0x5b9116);
                        const _0x3591a0 = JSON['parse'](_0x0_0x510ff7['readFileSync'](_0x4d9835, 'utf-8'));
                        if (_0x3591a0[_0x55fd06]) {
                            _0x13b108[_0x493be7] = _0x3591a0[_0x55fd06];
                        }
                    }
                }
                return _0x13b108;
            } catch (_0x98fb75) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x98fb75['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x55fd06);
            } catch (_0x7802f5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x7802f5['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x3019f0) {
        const _0xd03128 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0xd03128['includes'](_0x3019f0)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x3019f0 + ',\x20defaulting\x20to\x20private');
            _0x3019f0 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x3019f0;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x3019f0);
            } catch (_0x445214) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x445214['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x51756c = await adapters[backend]['getMetadata']('botMode');
                return _0x51756c || 'private';
            } catch (_0x5ea177) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x5ea177['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x2038da, _0x1e5baa, _0x16d3d1) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x2038da]) {
                this['messageCount'][_0x2038da] = {};
            }
            if (!this['messageCount'][_0x2038da][_0x1e5baa]) {
                this['messageCount'][_0x2038da][_0x1e5baa] = 0x0;
            }
            this['messageCount'][_0x2038da][_0x1e5baa]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x2038da, _0x1e5baa);
            } catch (_0x2af675) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x1e5baa + ':', _0x2af675['message']);
            }
        }
    },
    async 'getMessageCount'(_0x4fcfca, _0x1ea951) {
        if (backend === 'memory') {
            return this['messageCount'][_0x4fcfca]?.[_0x1ea951] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x4fcfca, _0x1ea951);
            } catch (_0x39d651) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x1ea951 + ':', _0x39d651['message']);
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
            } catch (_0x2086c2) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x2086c2['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x103d3f) {
        if (backend === 'memory') {
            this['isPublic'] = _0x103d3f;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x103d3f);
            } catch (_0x51a3e2) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x51a3e2['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x2d561b = await adapters[backend]['getAllCounts']();
                return _0x2d561b['isPublic'];
            } catch (_0x259fab) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x259fab['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x5d2f24) {
        const _0x3da7b6 = [
            'public',
            'private'
        ];
        if (!_0x3da7b6['includes'](_0x5d2f24)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x5d2f24);
            _0x5d2f24 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x5d2f24;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x5d2f24);
            } catch (_0x1b77a4) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x1b77a4['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x4b6bd3 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x4b6bd3 || 'private';
            } catch (_0x3e4dab) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x3e4dab['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x1d04e7 = 0x0;
        const _0x1901ef = Object['keys'](this['contacts'])['length'];
        const _0x2f22d3 = Object['keys'](this['chats'])['length'];
        let _0x305cfe = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x82de6b => {
                if (Array['isArray'](_0x82de6b)) {
                    _0x1d04e7 += _0x82de6b['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x2f15dc => {
                if (typeof _0x2f15dc === 'object') {
                    _0x305cfe += Object['keys'](_0x2f15dc)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x1d04e7 : 'stored\x20in\x20database',
            'contacts': _0x1901ef,
            'chats': _0x2f22d3,
            'messageCounts': backend === 'memory' ? _0x305cfe : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x5cb5f5 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x5cb5f5));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x56ec30 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x56ec30));
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
        let _0x199dc6 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x2adefd => {
            if (store['chats'][_0x2adefd]['messages']) {
                delete store['chats'][_0x2adefd]['messages'];
                _0x199dc6++;
            }
        });
        if (_0x199dc6 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x199dc6 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x51fc13 => {
    console['log']('[STORE]\x20Received\x20' + _0x51fc13 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x3b4993) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x3b4993['message']);
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
process['on']('uncaughtException', _0xb55e11 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0xb55e11);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x31b8f3, _0x26cf53) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x26cf53, 'reason:', _0x31b8f3);
});
export default store;