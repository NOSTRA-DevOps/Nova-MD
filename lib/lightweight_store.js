import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x48f527 from 'fs';
import _0x0_0x37d153 from 'path';
import _0x0_0x1c28bc from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x11aeca) {
    printLog = (_0x4485b4, _0x210585) => console['log']('[' + _0x4485b4['toUpperCase']() + ']\x20' + _0x210585);
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
} catch (_0x0_0x57a264) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x4962de => {
    try {
        return _0x0_0x1c28bc['deflateSync'](JSON['stringify'](_0x4962de));
    } catch (_0x164e28) {
        console['error']('[STORE]\x20Compression\x20error:', _0x164e28['message']);
        return Buffer['from'](JSON['stringify'](_0x4962de));
    }
};
const decompress = _0xcd1b2c => {
    try {
        return JSON['parse'](_0x0_0x1c28bc['inflateSync'](_0xcd1b2c));
    } catch (_0x4366e0) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x4366e0['message']);
        try {
            return JSON['parse'](_0xcd1b2c['toString']());
        } catch (_0x3363f5) {
            return null;
        }
    }
};
function slimMessage(_0x4c09f0) {
    return {
        'key': _0x4c09f0['key'],
        'message': _0x4c09f0['message'],
        'messageTimestamp': _0x4c09f0['messageTimestamp'],
        'participant': _0x4c09f0['participant'],
        'pushName': _0x4c09f0['pushName'],
        'broadcast': _0x4c09f0['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x2ec730 => console['error']('[MONGO]\x20Connection\x20error:', _0x2ec730));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x28a71b, _0x47ab80, _0x2b34e4) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x28a71b,
                        'id': _0x47ab80
                    }, {
                        'data': compress(_0x2b34e4),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x58af03) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x58af03['message']);
                }
            },
            async 'load'(_0x330753, _0x4851ba) {
                try {
                    const _0x155a70 = await Msg['findOne']({
                        'jid': _0x330753,
                        'id': _0x4851ba
                    });
                    return _0x155a70 ? decompress(_0x155a70['data']) : null;
                } catch (_0x7e03e7) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x7e03e7['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x1632a4, _0x43e5f1) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x1632a4,
                        'userId': _0x43e5f1
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x47e70d) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x47e70d['message']);
                }
            },
            async 'getCount'(_0x4cd508, _0x5c4c1c) {
                try {
                    const _0xee8dc5 = await MsgCount['findOne']({
                        'chatId': _0x4cd508,
                        'userId': _0x5c4c1c
                    });
                    return _0xee8dc5 ? _0xee8dc5['count'] : 0x0;
                } catch (_0x2e9ff4) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x2e9ff4['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0xca063d = await MsgCount['find']({});
                    const _0x196494 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0xca063d['forEach'](_0x140516 => {
                        if (!_0x196494['messageCount'][_0x140516['chatId']]) {
                            _0x196494['messageCount'][_0x140516['chatId']] = {};
                        }
                        _0x196494['messageCount'][_0x140516['chatId']][_0x140516['userId']] = _0x140516['count'];
                    });
                    const _0x564a85 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x564a85)
                        _0x196494['isPublic'] = _0x564a85['value'] === 'true';
                    return _0x196494;
                } catch (_0x292c51) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x292c51['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3f0d5e) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x3f0d5e['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x188cba) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x188cba['message']);
                }
            },
            async 'setMetadata'(_0xcf7974, _0x21c3be) {
                try {
                    await Meta['updateOne']({ 'key': _0xcf7974 }, {
                        'key': _0xcf7974,
                        'value': _0x21c3be['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x160f53) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x160f53['message']);
                }
            },
            async 'getMetadata'(_0x49d103) {
                try {
                    const _0x111d47 = await Meta['findOne']({ 'key': _0x49d103 });
                    return _0x111d47 ? _0x111d47['value'] : null;
                } catch (_0x119a0d) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x119a0d['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x857a48, _0x4e4fb0) {
                try {
                    await Contact['updateOne']({ 'jid': _0x857a48 }, {
                        ..._0x4e4fb0,
                        'jid': _0x857a48,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x31429e) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x31429e['message']);
                }
            },
            async 'getContact'(_0x3e663c) {
                try {
                    return await Contact['findOne']({ 'jid': _0x3e663c });
                } catch (_0x251e8a) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x251e8a['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x56a5b6 = await Contact['find']({});
                    const _0x1c04ad = {};
                    _0x56a5b6['forEach'](_0x14f826 => {
                        _0x1c04ad[_0x14f826['jid']] = {
                            'id': _0x14f826['jid'],
                            'name': _0x14f826['name'],
                            'notify': _0x14f826['notify']
                        };
                    });
                    return _0x1c04ad;
                } catch (_0x4d0ee3) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x4d0ee3['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x526470, _0x587a0d) {
                try {
                    await Chat['updateOne']({ 'jid': _0x526470 }, {
                        ..._0x587a0d,
                        'jid': _0x526470,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3db88f) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x3db88f['message']);
                }
            },
            async 'getChat'(_0x1d3aa3) {
                try {
                    return await Chat['findOne']({ 'jid': _0x1d3aa3 });
                } catch (_0x5a3807) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x5a3807['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x300596 = await Chat['find']({});
                    const _0x4fe968 = {};
                    _0x300596['forEach'](_0x3dfe51 => {
                        _0x4fe968[_0x3dfe51['jid']] = {
                            'id': _0x3dfe51['jid'],
                            'name': _0x3dfe51['name'],
                            'conversationTimestamp': _0x3dfe51['conversationTimestamp'],
                            'unreadCount': _0x3dfe51['unreadCount']
                        };
                    });
                    return _0x4fe968;
                } catch (_0x3ce617) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x3ce617['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x2e0b4b) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x2e0b4b });
                } catch (_0x4867a2) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x4867a2['message']);
                }
            },
            async 'saveSetting'(_0x517f65, _0x41f20d, _0x429e8c) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x517f65,
                        'key': _0x41f20d
                    }, {
                        'chatId': _0x517f65,
                        'key': _0x41f20d,
                        'value': _0x429e8c,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x1f24f2) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x1f24f2['message']);
                }
            },
            async 'getSetting'(_0xa51863, _0x42139e) {
                try {
                    const _0x21d512 = await Setting['findOne']({
                        'chatId': _0xa51863,
                        'key': _0x42139e
                    });
                    return _0x21d512 ? _0x21d512['value'] : null;
                } catch (_0x109f44) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x109f44['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x390bcc) {
                try {
                    const _0x5cfc9f = await Setting['find']({ 'chatId': _0x390bcc });
                    const _0x239af5 = {};
                    _0x5cfc9f['forEach'](_0x97a4f => {
                        _0x239af5[_0x97a4f['key']] = _0x97a4f['value'];
                    });
                    return _0x239af5;
                } catch (_0x279e40) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x279e40['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x5da902 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x5da902['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x5da902['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x31dc94) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x31dc94['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x188fc7) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x188fc7['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x3ebf46) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x3ebf46['message']);
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
        pool['on']('error', _0x53b7f7 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x53b7f7['message']);
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
                        const _0x41ebbf = await pool['connect']();
                        try {
                            await _0x41ebbf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x41ebbf['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x41ebbf['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x41ebbf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x41ebbf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x41ebbf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x41ebbf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x41ebbf['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x41ebbf['release']();
                        }
                    } catch (_0x26acde) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x26acde['message']);
                        this['initPromise'] = null;
                        throw _0x26acde;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0xeef1a6, _0x56b589, _0x590c79) {
                try {
                    await this['init']();
                    const _0xbbb626 = await pool['connect']();
                    try {
                        await _0xbbb626['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0xeef1a6,
                            _0x56b589,
                            Date['now'](),
                            compress(_0x590c79)
                        ]);
                    } finally {
                        _0xbbb626['release']();
                    }
                } catch (_0x3f554a) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x3f554a['message']);
                }
            },
            async 'load'(_0x3c7773, _0x2c16a1) {
                try {
                    await this['init']();
                    const _0x1d75cf = await pool['connect']();
                    try {
                        const _0x3345ff = await _0x1d75cf['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x3c7773,
                            _0x2c16a1
                        ]);
                        return _0x3345ff['rows'][0x0] ? decompress(_0x3345ff['rows'][0x0]['data']) : null;
                    } finally {
                        _0x1d75cf['release']();
                    }
                } catch (_0x3e7df7) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x3e7df7['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x152095, _0x48263e) {
                try {
                    await this['init']();
                    const _0x4b2499 = await pool['connect']();
                    try {
                        await _0x4b2499['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x152095,
                            _0x48263e
                        ]);
                    } finally {
                        _0x4b2499['release']();
                    }
                } catch (_0x111c7b) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x111c7b['message']);
                }
            },
            async 'getCount'(_0x1b95d8, _0x2b9642) {
                try {
                    await this['init']();
                    const _0x14a4a2 = await pool['connect']();
                    try {
                        const _0x1ec6e7 = await _0x14a4a2['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x1b95d8,
                            _0x2b9642
                        ]);
                        return _0x1ec6e7['rows'][0x0] ? _0x1ec6e7['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x14a4a2['release']();
                    }
                } catch (_0x51574f) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x51574f['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x5c4502 = await pool['connect']();
                    try {
                        const _0x359ca4 = await _0x5c4502['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x590f2d = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x359ca4['rows']['forEach'](_0x5c432d => {
                            if (!_0x590f2d['messageCount'][_0x5c432d['chat_id']]) {
                                _0x590f2d['messageCount'][_0x5c432d['chat_id']] = {};
                            }
                            _0x590f2d['messageCount'][_0x5c432d['chat_id']][_0x5c432d['user_id']] = _0x5c432d['count'];
                        });
                        const _0x34f946 = await _0x5c4502['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x34f946['rows'][0x0])
                            _0x590f2d['isPublic'] = _0x34f946['rows'][0x0]['value'] === 'true';
                        return _0x590f2d;
                    } finally {
                        _0x5c4502['release']();
                    }
                } catch (_0x2adb70) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x2adb70['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x5036ca) {
                try {
                    await this['init']();
                    const _0x2c3c76 = await pool['connect']();
                    try {
                        await _0x2c3c76['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x5036ca['toString']()]);
                    } finally {
                        _0x2c3c76['release']();
                    }
                } catch (_0x2952aa) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x2952aa['message']);
                }
            },
            async 'setMetadata'(_0x3b3d1d, _0x2fbbfc) {
                try {
                    await this['init']();
                    const _0xa39bde = await pool['connect']();
                    try {
                        await _0xa39bde['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x3b3d1d,
                            _0x2fbbfc['toString']()
                        ]);
                    } finally {
                        _0xa39bde['release']();
                    }
                } catch (_0x36246a) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x36246a['message']);
                }
            },
            async 'getMetadata'(_0x1b339d) {
                try {
                    await this['init']();
                    const _0xc44fc0 = await pool['connect']();
                    try {
                        const _0x48bc63 = await _0xc44fc0['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x1b339d]);
                        return _0x48bc63['rows'][0x0] ? _0x48bc63['rows'][0x0]['value'] : null;
                    } finally {
                        _0xc44fc0['release']();
                    }
                } catch (_0x3d212d) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x3d212d['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x110b46, _0x16ce93) {
                try {
                    await this['init']();
                    const _0x1160eb = await pool['connect']();
                    try {
                        await _0x1160eb['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x110b46,
                            _0x16ce93['name'] || '',
                            _0x16ce93['notify'] || '',
                            _0x16ce93['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x1160eb['release']();
                    }
                } catch (_0x22c35c) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x22c35c['message']);
                }
            },
            async 'getContact'(_0x4da841) {
                try {
                    await this['init']();
                    const _0x5c6caf = await pool['connect']();
                    try {
                        const _0x66a3d8 = await _0x5c6caf['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x4da841]);
                        return _0x66a3d8['rows'][0x0] || null;
                    } finally {
                        _0x5c6caf['release']();
                    }
                } catch (_0x3dca89) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x3dca89['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x59d481 = await pool['connect']();
                    try {
                        const _0x2339e5 = await _0x59d481['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x116597 = {};
                        _0x2339e5['rows']['forEach'](_0x473ea3 => {
                            _0x116597[_0x473ea3['jid']] = {
                                'id': _0x473ea3['jid'],
                                'name': _0x473ea3['name'],
                                'notify': _0x473ea3['notify']
                            };
                        });
                        return _0x116597;
                    } finally {
                        _0x59d481['release']();
                    }
                } catch (_0x3d0d63) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x3d0d63['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x2d8821, _0x271ca8) {
                try {
                    await this['init']();
                    const _0x2fd427 = await pool['connect']();
                    try {
                        await _0x2fd427['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x2d8821,
                            _0x271ca8['name'] || '',
                            _0x271ca8['conversationTimestamp'] || 0x0,
                            _0x271ca8['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x2fd427['release']();
                    }
                } catch (_0x293dd) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x293dd['message']);
                }
            },
            async 'getChat'(_0x1b743d) {
                try {
                    await this['init']();
                    const _0x1ae16b = await pool['connect']();
                    try {
                        const _0x31c395 = await _0x1ae16b['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x1b743d]);
                        return _0x31c395['rows'][0x0] || null;
                    } finally {
                        _0x1ae16b['release']();
                    }
                } catch (_0x310d19) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x310d19['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x3897e1 = await pool['connect']();
                    try {
                        const _0x228149 = await _0x3897e1['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x55095a = {};
                        _0x228149['rows']['forEach'](_0x52fded => {
                            _0x55095a[_0x52fded['jid']] = {
                                'id': _0x52fded['jid'],
                                'name': _0x52fded['name'],
                                'conversationTimestamp': _0x52fded['conversation_timestamp'],
                                'unreadCount': _0x52fded['unread_count']
                            };
                        });
                        return _0x55095a;
                    } finally {
                        _0x3897e1['release']();
                    }
                } catch (_0x5f3ffa) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x5f3ffa['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x264b49) {
                try {
                    await this['init']();
                    const _0xce977e = await pool['connect']();
                    try {
                        await _0xce977e['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x264b49]);
                    } finally {
                        _0xce977e['release']();
                    }
                } catch (_0x29326f) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x29326f['message']);
                }
            },
            async 'saveSetting'(_0xfef38b, _0x353c41, _0x5e5062) {
                try {
                    await this['init']();
                    const _0x45ae01 = await pool['connect']();
                    try {
                        await _0x45ae01['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0xfef38b,
                            _0x353c41,
                            JSON['stringify'](_0x5e5062),
                            Date['now']()
                        ]);
                    } finally {
                        _0x45ae01['release']();
                    }
                } catch (_0x5b9706) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x5b9706['message']);
                }
            },
            async 'getSetting'(_0x490573, _0x29cd4a) {
                try {
                    await this['init']();
                    const _0x478455 = await pool['connect']();
                    try {
                        const _0x2e412c = await _0x478455['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x490573,
                            _0x29cd4a
                        ]);
                        return _0x2e412c['rows'][0x0] ? JSON['parse'](_0x2e412c['rows'][0x0]['value']) : null;
                    } finally {
                        _0x478455['release']();
                    }
                } catch (_0x1f9938) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x1f9938['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x354188) {
                try {
                    await this['init']();
                    const _0x229755 = await pool['connect']();
                    try {
                        const _0x1533bc = await _0x229755['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x354188]);
                        const _0x1bbef5 = {};
                        _0x1533bc['rows']['forEach'](_0x55fce6 => {
                            _0x1bbef5[_0x55fce6['key']] = JSON['parse'](_0x55fce6['value']);
                        });
                        return _0x1bbef5;
                    } finally {
                        _0x229755['release']();
                    }
                } catch (_0x2bd2b6) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x2bd2b6['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x1e7c53 = await pool['connect']();
                    try {
                        const _0x18f193 = await _0x1e7c53['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x18f193['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x18f193['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x1e7c53['release']();
                    }
                } catch (_0x2c0467) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x2c0467['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x2597a1) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x2597a1['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x255d65) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x255d65['message']);
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
                    } catch (_0x2bc11e) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x2bc11e['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x2bc11e;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x524f7a, _0x2f99d1, _0x4077f2) {
                try {
                    const _0x4e6de7 = await this['getConn']();
                    await _0x4e6de7['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x524f7a,
                        _0x2f99d1,
                        Date['now'](),
                        compress(_0x4077f2)
                    ]);
                } catch (_0x1cac5c) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x1cac5c['message']);
                }
            },
            async 'load'(_0x6e5618, _0x454e2b) {
                try {
                    const _0x518113 = await this['getConn']();
                    const [_0x3fc889] = await _0x518113['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x6e5618,
                        _0x454e2b
                    ]);
                    return _0x3fc889[0x0] ? decompress(_0x3fc889[0x0]['data']) : null;
                } catch (_0x5d6ad1) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x5d6ad1['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x43f116, _0x4e3493) {
                try {
                    const _0x171f52 = await this['getConn']();
                    await _0x171f52['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x43f116,
                        _0x4e3493
                    ]);
                } catch (_0x3cf891) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x3cf891['message']);
                }
            },
            async 'getCount'(_0x3e205b, _0x36f87e) {
                try {
                    const _0x5448c0 = await this['getConn']();
                    const [_0xb4ed0e] = await _0x5448c0['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x3e205b,
                        _0x36f87e
                    ]);
                    return _0xb4ed0e[0x0] ? _0xb4ed0e[0x0]['count'] : 0x0;
                } catch (_0x18ceb9) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x18ceb9['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x5a76bf = await this['getConn']();
                    const [_0x5d2ace] = await _0x5a76bf['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0xeb46aa = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x5d2ace['forEach'](_0x20c37a => {
                        if (!_0xeb46aa['messageCount'][_0x20c37a['chat_id']]) {
                            _0xeb46aa['messageCount'][_0x20c37a['chat_id']] = {};
                        }
                        _0xeb46aa['messageCount'][_0x20c37a['chat_id']][_0x20c37a['user_id']] = _0x20c37a['count'];
                    });
                    const [_0x1dbd11] = await _0x5a76bf['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x1dbd11[0x0])
                        _0xeb46aa['isPublic'] = _0x1dbd11[0x0]['value'] === 'true';
                    return _0xeb46aa;
                } catch (_0x4555c4) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x4555c4['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3dac6f) {
                try {
                    const _0x4673a6 = await this['getConn']();
                    await _0x4673a6['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x3dac6f['toString']()]);
                } catch (_0x2ee4f1) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x2ee4f1['message']);
                }
            },
            async 'setMetadata'(_0x5b25fb, _0x122cf5) {
                try {
                    const _0x5b0f54 = await this['getConn']();
                    await _0x5b0f54['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x5b25fb,
                        _0x122cf5['toString']()
                    ]);
                } catch (_0x48993f) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x48993f['message']);
                }
            },
            async 'getMetadata'(_0x443bec) {
                try {
                    const _0x17b506 = await this['getConn']();
                    const [_0x47aa46] = await _0x17b506['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x443bec]);
                    return _0x47aa46[0x0] ? _0x47aa46[0x0]['value'] : null;
                } catch (_0x4d5acf) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x4d5acf['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x164011, _0x4ded64) {
                try {
                    const _0x4f4ef3 = await this['getConn']();
                    await _0x4f4ef3['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x164011,
                        _0x4ded64['name'] || '',
                        _0x4ded64['notify'] || '',
                        _0x4ded64['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x5ca813) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x5ca813['message']);
                }
            },
            async 'getContact'(_0x18a3d3) {
                try {
                    const _0x319120 = await this['getConn']();
                    const [_0x3326b8] = await _0x319120['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x18a3d3]);
                    return _0x3326b8[0x0] || null;
                } catch (_0xbd7ed9) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0xbd7ed9['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x3b4dd9 = await this['getConn']();
                    const [_0x45165d] = await _0x3b4dd9['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x13d587 = {};
                    _0x45165d['forEach'](_0x1a8e62 => {
                        _0x13d587[_0x1a8e62['jid']] = {
                            'id': _0x1a8e62['jid'],
                            'name': _0x1a8e62['name'],
                            'notify': _0x1a8e62['notify']
                        };
                    });
                    return _0x13d587;
                } catch (_0x1d8991) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x1d8991['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x47d2ee, _0x1689cb) {
                try {
                    const _0x563ab8 = await this['getConn']();
                    await _0x563ab8['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x47d2ee,
                        _0x1689cb['name'] || '',
                        _0x1689cb['conversationTimestamp'] || 0x0,
                        _0x1689cb['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x1d587d) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x1d587d['message']);
                }
            },
            async 'getChat'(_0x4fa5ce) {
                try {
                    const _0x2f60f3 = await this['getConn']();
                    const [_0x4844ec] = await _0x2f60f3['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x4fa5ce]);
                    return _0x4844ec[0x0] || null;
                } catch (_0xbde049) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0xbde049['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x3ff691 = await this['getConn']();
                    const [_0xea10bf] = await _0x3ff691['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x364336 = {};
                    _0xea10bf['forEach'](_0x319899 => {
                        _0x364336[_0x319899['jid']] = {
                            'id': _0x319899['jid'],
                            'name': _0x319899['name'],
                            'conversationTimestamp': _0x319899['conversation_timestamp'],
                            'unreadCount': _0x319899['unread_count']
                        };
                    });
                    return _0x364336;
                } catch (_0x498489) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x498489['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x2e5f10) {
                try {
                    const _0x22c7f8 = await this['getConn']();
                    await _0x22c7f8['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x2e5f10]);
                } catch (_0x53b87a) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x53b87a['message']);
                }
            },
            async 'saveSetting'(_0x18b230, _0x583e1a, _0x363d88) {
                try {
                    const _0x12065b = await this['getConn']();
                    await _0x12065b['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x18b230,
                        _0x583e1a,
                        JSON['stringify'](_0x363d88),
                        Date['now']()
                    ]);
                } catch (_0x4c6dcd) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x4c6dcd['message']);
                }
            },
            async 'getSetting'(_0x1bd639, _0x3e9858) {
                try {
                    const _0x42942b = await this['getConn']();
                    const [_0x2d8cd2] = await _0x42942b['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x1bd639,
                        _0x3e9858
                    ]);
                    return _0x2d8cd2[0x0] ? JSON['parse'](_0x2d8cd2[0x0]['value']) : null;
                } catch (_0x5efbb9) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x5efbb9['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x41b93a) {
                try {
                    const _0x3a7069 = await this['getConn']();
                    const [_0x5a50e0] = await _0x3a7069['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x41b93a]);
                    const _0x484750 = {};
                    _0x5a50e0['forEach'](_0x5a45ff => {
                        _0x484750[_0x5a45ff['key']] = JSON['parse'](_0x5a45ff['value']);
                    });
                    return _0x484750;
                } catch (_0x269762) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x269762['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x187cf9 = await this['getConn']();
                    const [_0x39ce1b] = await _0x187cf9['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x39ce1b['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x39ce1b['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0xde6216) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0xde6216['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x319ad2) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x319ad2['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x4acbf2) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x4acbf2['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x37d153['dirname'](SQLITE_URL);
        if (!_0x0_0x48f527['existsSync'](dir))
            _0x0_0x48f527['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x49d809, _0x54d60d, _0x4c5299) {
                try {
                    saveStmt['run'](_0x49d809, _0x54d60d, Date['now'](), compress(_0x4c5299));
                    const {count: _0x177a46} = countStmt['get'](_0x49d809);
                    if (_0x177a46 > MESSAGE_LIMITS['sqlite']) {
                        const _0x2631fc = _0x177a46 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x49d809, _0x49d809, _0x2631fc);
                    }
                } catch (_0x3a2a01) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x3a2a01['message']);
                }
            },
            'load'(_0x35d661, _0x5a2324) {
                try {
                    const _0x2dc233 = loadStmt['get'](_0x35d661, _0x5a2324);
                    return _0x2dc233 ? decompress(_0x2dc233['data']) : null;
                } catch (_0x51e59d) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x51e59d['message']);
                    return null;
                }
            },
            'incrementCount'(_0x5c152f, _0x5159c1) {
                try {
                    incrementCountStmt['run'](_0x5c152f, _0x5159c1);
                } catch (_0x2c51dd) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x2c51dd['message']);
                }
            },
            'getCount'(_0x26ef76, _0x466a86) {
                try {
                    const _0x295251 = getCountStmt['get'](_0x26ef76, _0x466a86);
                    return _0x295251 ? _0x295251['count'] : 0x0;
                } catch (_0x5a7e5b) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x5a7e5b['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x481943 = getAllCountsStmt['all']();
                    const _0x3ef522 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x481943['forEach'](_0x507fab => {
                        if (!_0x3ef522['messageCount'][_0x507fab['chat_id']]) {
                            _0x3ef522['messageCount'][_0x507fab['chat_id']] = {};
                        }
                        _0x3ef522['messageCount'][_0x507fab['chat_id']][_0x507fab['user_id']] = _0x507fab['count'];
                    });
                    const _0x102976 = getMetaStmt['get']();
                    if (_0x102976)
                        _0x3ef522['isPublic'] = _0x102976['value'] === 'true';
                    return _0x3ef522;
                } catch (_0x65be2c) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x65be2c['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x18df2f) {
                try {
                    setMetaStmt['run'](_0x18df2f['toString']());
                } catch (_0x27eeac) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x27eeac['message']);
                }
            },
            'setMetadata'(_0x4d1189, _0x137ba4) {
                try {
                    setMetadataStmt['run'](_0x4d1189, _0x137ba4['toString']());
                } catch (_0x1582e2) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x1582e2['message']);
                }
            },
            'getMetadata'(_0x1976da) {
                try {
                    const _0x1d34b9 = getMetadataStmt['get'](_0x1976da);
                    return _0x1d34b9 ? _0x1d34b9['value'] : null;
                } catch (_0x38c6f9) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x38c6f9['message']);
                    return null;
                }
            },
            'saveContact'(_0x3d7803, _0x40db18) {
                try {
                    saveContactStmt['run'](_0x3d7803, _0x40db18['name'] || '', _0x40db18['notify'] || '', _0x40db18['verifiedName'] || '', Date['now']());
                } catch (_0x9efb40) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x9efb40['message']);
                }
            },
            'getContact'(_0x1db2b1) {
                try {
                    return getContactStmt['get'](_0x1db2b1) || null;
                } catch (_0x233dcd) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x233dcd['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0xe9f5e8 = getAllContactsStmt['all']();
                    const _0x13b250 = {};
                    _0xe9f5e8['forEach'](_0x11e369 => {
                        _0x13b250[_0x11e369['jid']] = {
                            'id': _0x11e369['jid'],
                            'name': _0x11e369['name'],
                            'notify': _0x11e369['notify']
                        };
                    });
                    return _0x13b250;
                } catch (_0x3556bf) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x3556bf['message']);
                    return {};
                }
            },
            'saveChat'(_0x3a37eb, _0x2569d7) {
                try {
                    saveChatStmt['run'](_0x3a37eb, _0x2569d7['name'] || '', _0x2569d7['conversationTimestamp'] || 0x0, _0x2569d7['unreadCount'] || 0x0, Date['now']());
                } catch (_0x53df8b) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x53df8b['message']);
                }
            },
            'getChat'(_0x4310f9) {
                try {
                    return getChatStmt['get'](_0x4310f9) || null;
                } catch (_0xae5895) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0xae5895['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x347c29 = getAllChatsStmt['all']();
                    const _0x11fd89 = {};
                    _0x347c29['forEach'](_0x1c3178 => {
                        _0x11fd89[_0x1c3178['jid']] = {
                            'id': _0x1c3178['jid'],
                            'name': _0x1c3178['name'],
                            'conversationTimestamp': _0x1c3178['conversation_timestamp'],
                            'unreadCount': _0x1c3178['unread_count']
                        };
                    });
                    return _0x11fd89;
                } catch (_0x4036fe) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x4036fe['message']);
                    return {};
                }
            },
            'deleteChat'(_0x1f2172) {
                try {
                    deleteChatStmt['run'](_0x1f2172);
                } catch (_0x33ec16) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x33ec16['message']);
                }
            },
            'saveSetting'(_0x486099, _0x2c47bf, _0x515a4b) {
                try {
                    saveSettingStmt['run'](_0x486099, _0x2c47bf, JSON['stringify'](_0x515a4b), Date['now']());
                } catch (_0x3d5362) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x3d5362['message']);
                }
            },
            'getSetting'(_0xa41f34, _0x5c31e3) {
                try {
                    const _0x32aaf1 = getSettingStmt['get'](_0xa41f34, _0x5c31e3);
                    return _0x32aaf1 ? JSON['parse'](_0x32aaf1['value']) : null;
                } catch (_0x3118e1) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x3118e1['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x28e9c1) {
                try {
                    const _0x41fb23 = getAllSettingsStmt['all'](_0x28e9c1);
                    const _0x14a467 = {};
                    _0x41fb23['forEach'](_0x18d4b3 => {
                        _0x14a467[_0x18d4b3['key']] = JSON['parse'](_0x18d4b3['value']);
                    });
                    return _0x14a467;
                } catch (_0x3f0246) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x3f0246['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x121cdb = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x121cdb['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x121cdb['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x344794) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x344794['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x58556d) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x58556d['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x1274fc) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x1274fc['message']);
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
    async 'readFromFile'(_0x62a0ab = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x2c9d5d = await adapters[backend]['getAllContacts']();
                const _0x174c12 = await adapters[backend]['getAllChats']();
                const _0x37a0c2 = await this['getBotMode']();
                this['contacts'] = _0x2c9d5d;
                this['chats'] = _0x174c12;
                this['botMode'] = _0x37a0c2;
            } else {
                if (_0x0_0x48f527['existsSync'](_0x62a0ab)) {
                    const _0x31066e = JSON['parse'](_0x0_0x48f527['readFileSync'](_0x62a0ab, 'utf-8'));
                    this['contacts'] = _0x31066e['contacts'] || {};
                    this['chats'] = _0x31066e['chats'] || {};
                    this['botMode'] = _0x31066e['botMode'] || 'private';
                    this['messages'] = _0x31066e['messages'] || {};
                    this['isPublic'] = _0x31066e['isPublic'] !== undefined ? _0x31066e['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x417e73) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x417e73['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x4fbcbf = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x2c7bcf = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x48f527['writeFileSync'](_0x4fbcbf, JSON['stringify'](_0x2c7bcf, null, 0x2));
        } catch (_0x821c38) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x821c38['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x48f527['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x857508 = JSON['parse'](_0x0_0x48f527['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x857508['messageCount'] || _0x857508;
                    this['isPublic'] = typeof _0x857508['isPublic'] === 'boolean' ? _0x857508['isPublic'] : ![];
                }
            } catch (_0x19cca1) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x19cca1['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0xb180 = _0x0_0x37d153['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x48f527['existsSync'](_0xb180))
                    _0x0_0x48f527['mkdirSync'](_0xb180, { 'recursive': !![] });
                const _0x2716fb = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x48f527['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x2716fb, null, 0x2));
            } catch (_0x3b7cc6) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x3b7cc6['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x279623 => {
                if (typeof this['messages'][_0x279623] === 'object' && !Array['isArray'](this['messages'][_0x279623])) {
                    const _0x3cb9d6 = Object['values'](this['messages'][_0x279623]);
                    this['messages'][_0x279623] = _0x3cb9d6['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x279623])) {
                    if (this['messages'][_0x279623]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x279623] = this['messages'][_0x279623]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x460a01 => {
                if (this['chats'][_0x460a01]['messages']) {
                    delete this['chats'][_0x460a01]['messages'];
                }
            });
        }
    },
    'bind'(_0xb26914) {
        _0xb26914['on']('messages.upsert', async ({messages: _0x12a8be}) => {
            for (const _0x54027a of _0x12a8be) {
                if (!_0x54027a['key']?.['remoteJid'])
                    continue;
                const _0x339125 = _0x54027a['key']['remoteJid'];
                const _0x1fd77f = slimMessage(_0x54027a);
                if (backend === 'memory') {
                    this['messages'][_0x339125] = this['messages'][_0x339125] || [];
                    this['messages'][_0x339125]['push'](_0x1fd77f);
                    if (this['messages'][_0x339125]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x339125] = this['messages'][_0x339125]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x339125, _0x54027a['key']['id'], _0x1fd77f);
                    } catch (_0x35486f) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x54027a['key']['id'] + ':', _0x35486f['message']);
                    }
                }
            }
        });
        _0xb26914['on']('contacts.update', async _0x43fcdf => {
            for (const _0x786a6e of _0x43fcdf) {
                if (_0x786a6e['id']) {
                    const _0x2b4d4d = {
                        'id': _0x786a6e['id'],
                        'name': _0x786a6e['notify'] || _0x786a6e['name'] || _0x786a6e['verifiedName'] || '',
                        'notify': _0x786a6e['notify'],
                        'verifiedName': _0x786a6e['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x786a6e['id']] = _0x2b4d4d;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x786a6e['id'], _0x2b4d4d);
                        } catch (_0x16a89b) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x16a89b['message']);
                        }
                    }
                }
            }
        });
        _0xb26914['on']('contacts.set', async _0x26ae05 => {
            for (const _0x28b200 of _0x26ae05) {
                if (_0x28b200['id']) {
                    const _0x53f13e = {
                        'id': _0x28b200['id'],
                        'name': _0x28b200['notify'] || _0x28b200['name'] || _0x28b200['verifiedName'] || '',
                        'notify': _0x28b200['notify'],
                        'verifiedName': _0x28b200['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x28b200['id']] = _0x53f13e;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x28b200['id'], _0x53f13e);
                        } catch (_0x313c33) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x313c33['message']);
                        }
                    }
                }
            }
        });
        _0xb26914['on']('chats.set', async _0x5f103e => {
            for (const _0x3a9809 of _0x5f103e) {
                if (_0x3a9809['id']) {
                    const _0x4d42ed = {
                        'id': _0x3a9809['id'],
                        'name': _0x3a9809['name'] || _0x3a9809['subject'] || '',
                        'conversationTimestamp': _0x3a9809['conversationTimestamp'],
                        'unreadCount': _0x3a9809['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x3a9809['id']] = _0x4d42ed;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x3a9809['id'], _0x4d42ed);
                        } catch (_0x1b72bb) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x1b72bb['message']);
                        }
                    }
                }
            }
        });
        _0xb26914['on']('chats.update', async _0x3de783 => {
            for (const _0x4cb540 of _0x3de783) {
                if (_0x4cb540['id']) {
                    if (backend === 'memory') {
                        const _0x52598c = this['chats'][_0x4cb540['id']] || {};
                        this['chats'][_0x4cb540['id']] = {
                            'id': _0x4cb540['id'],
                            'name': _0x4cb540['name'] || _0x4cb540['subject'] || _0x52598c['name'] || '',
                            'conversationTimestamp': _0x4cb540['conversationTimestamp'] || _0x52598c['conversationTimestamp'],
                            'unreadCount': _0x4cb540['unreadCount'] !== undefined ? _0x4cb540['unreadCount'] : _0x52598c['unreadCount']
                        };
                    } else {
                        try {
                            const _0x573373 = await adapters[backend]['getChat'](_0x4cb540['id']) || {};
                            const _0x4d8b1 = {
                                'id': _0x4cb540['id'],
                                'name': _0x4cb540['name'] || _0x4cb540['subject'] || _0x573373['name'] || '',
                                'conversationTimestamp': _0x4cb540['conversationTimestamp'] || _0x573373['conversation_timestamp'],
                                'unreadCount': _0x4cb540['unreadCount'] !== undefined ? _0x4cb540['unreadCount'] : _0x573373['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x4cb540['id'], _0x4d8b1);
                        } catch (_0x215cb2) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x215cb2['message']);
                        }
                    }
                }
            }
        });
        _0xb26914['on']('chats.delete', async _0x465f88 => {
            for (const _0x2f5b99 of _0x465f88) {
                if (backend === 'memory') {
                    delete this['chats'][_0x2f5b99];
                    delete this['messages'][_0x2f5b99];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x2f5b99);
                    } catch (_0x20fd6f) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x20fd6f['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x1eeb74, _0x32232d) {
        if (backend === 'memory') {
            const _0x1c1b97 = this['messages'][_0x1eeb74]?.['find'](_0x1ad7c7 => _0x1ad7c7['key']['id'] === _0x32232d) || null;
            return _0x1c1b97;
        } else {
            try {
                return await adapters[backend]['load'](_0x1eeb74, _0x32232d);
            } catch (_0x3d2e16) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x32232d + ':', _0x3d2e16['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x3bc433, _0x132a76, _0x1247e2) {
        if (backend === 'memory') {
            const _0x6954e5 = './data';
            if (!_0x0_0x48f527['existsSync'](_0x6954e5))
                _0x0_0x48f527['mkdirSync'](_0x6954e5, { 'recursive': !![] });
            const _0x679d57 = _0x0_0x37d153['join'](_0x6954e5, _0x132a76 + '.json');
            try {
                _0x0_0x48f527['writeFileSync'](_0x679d57, JSON['stringify'](_0x1247e2, null, 0x2));
            } catch (_0x5d9265) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x132a76 + ':', _0x5d9265['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x3bc433, _0x132a76, _0x1247e2);
            } catch (_0x95976d) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x132a76 + ':', _0x95976d['message']);
            }
        }
    },
    async 'getSetting'(_0x2593b8, _0x606f7) {
        if (backend === 'memory') {
            const _0x4641a6 = './data';
            const _0x535323 = _0x0_0x37d153['join'](_0x4641a6, _0x606f7 + '.json');
            try {
                if (_0x0_0x48f527['existsSync'](_0x535323)) {
                    const _0x3bfaef = JSON['parse'](_0x0_0x48f527['readFileSync'](_0x535323, 'utf-8'));
                    if (_0x3bfaef['enabled'] !== undefined)
                        return _0x3bfaef;
                    if (_0x3bfaef[_0x2593b8] !== undefined)
                        return _0x3bfaef[_0x2593b8];
                    return null;
                }
                return null;
            } catch (_0x21646c) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x606f7 + ':', _0x21646c['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x2593b8, _0x606f7);
            } catch (_0x5368b0) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x606f7 + ':', _0x5368b0['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x42eade) {
        if (backend === 'memory') {
            const _0x2adcbc = './data';
            const _0x1d8559 = {};
            try {
                if (_0x0_0x48f527['existsSync'](_0x2adcbc)) {
                    const _0x580f21 = _0x0_0x48f527['readdirSync'](_0x2adcbc)['filter'](_0x3166b4 => _0x3166b4['endsWith']('.json'));
                    for (const _0x171564 of _0x580f21) {
                        const _0x5d2615 = _0x0_0x37d153['basename'](_0x171564, '.json');
                        if (_0x5d2615 === 'messageCount' || _0x5d2615 === 'owner')
                            continue;
                        const _0x254ac = _0x0_0x37d153['join'](_0x2adcbc, _0x171564);
                        const _0x46f091 = JSON['parse'](_0x0_0x48f527['readFileSync'](_0x254ac, 'utf-8'));
                        if (_0x46f091[_0x42eade]) {
                            _0x1d8559[_0x5d2615] = _0x46f091[_0x42eade];
                        }
                    }
                }
                return _0x1d8559;
            } catch (_0x9f7a16) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x9f7a16['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x42eade);
            } catch (_0x5e1dc0) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x5e1dc0['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x3b5c57) {
        const _0x33b85c = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x33b85c['includes'](_0x3b5c57)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x3b5c57 + ',\x20defaulting\x20to\x20private');
            _0x3b5c57 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x3b5c57;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x3b5c57);
            } catch (_0x5abb18) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x5abb18['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x3b1f38 = await adapters[backend]['getMetadata']('botMode');
                return _0x3b1f38 || 'private';
            } catch (_0x401bd2) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x401bd2['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x3d011a, _0x330a05, _0x4ac971) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x3d011a]) {
                this['messageCount'][_0x3d011a] = {};
            }
            if (!this['messageCount'][_0x3d011a][_0x330a05]) {
                this['messageCount'][_0x3d011a][_0x330a05] = 0x0;
            }
            this['messageCount'][_0x3d011a][_0x330a05]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x3d011a, _0x330a05);
            } catch (_0x2cd624) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x330a05 + ':', _0x2cd624['message']);
            }
        }
    },
    async 'getMessageCount'(_0x10887c, _0x14274e) {
        if (backend === 'memory') {
            return this['messageCount'][_0x10887c]?.[_0x14274e] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x10887c, _0x14274e);
            } catch (_0xa02db9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x14274e + ':', _0xa02db9['message']);
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
            } catch (_0x37f6a7) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x37f6a7['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x511f10) {
        if (backend === 'memory') {
            this['isPublic'] = _0x511f10;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x511f10);
            } catch (_0x75accf) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x75accf['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x4ad37c = await adapters[backend]['getAllCounts']();
                return _0x4ad37c['isPublic'];
            } catch (_0x5de053) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x5de053['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x53e668) {
        const _0x4dc109 = [
            'public',
            'private'
        ];
        if (!_0x4dc109['includes'](_0x53e668)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x53e668);
            _0x53e668 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x53e668;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x53e668);
            } catch (_0x5c4b48) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x5c4b48['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x3ede7b = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x3ede7b || 'private';
            } catch (_0x274aae) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x274aae['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x16d51c = 0x0;
        const _0x4930a4 = Object['keys'](this['contacts'])['length'];
        const _0x4f3be8 = Object['keys'](this['chats'])['length'];
        let _0x386100 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x5348cd => {
                if (Array['isArray'](_0x5348cd)) {
                    _0x16d51c += _0x5348cd['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x1345aa => {
                if (typeof _0x1345aa === 'object') {
                    _0x386100 += Object['keys'](_0x1345aa)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x16d51c : 'stored\x20in\x20database',
            'contacts': _0x4930a4,
            'chats': _0x4f3be8,
            'messageCounts': backend === 'memory' ? _0x386100 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x26ecf0 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x26ecf0));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x573752 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x573752));
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
        let _0x2bab40 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x4f331c => {
            if (store['chats'][_0x4f331c]['messages']) {
                delete store['chats'][_0x4f331c]['messages'];
                _0x2bab40++;
            }
        });
        if (_0x2bab40 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x2bab40 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x335c43 => {
    console['log']('[STORE]\x20Received\x20' + _0x335c43 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x14d6b8) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x14d6b8['message']);
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
process['on']('uncaughtException', _0x598d26 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x598d26);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x4a6582, _0x13139c) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x13139c, 'reason:', _0x4a6582);
});
export default store;