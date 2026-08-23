import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x28d844 from 'fs';
import _0x0_0x2c4036 from 'path';
import _0x0_0x5edd75 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0xc2dfa3) {
    printLog = (_0x55603a, _0x4b0f93) => console['log']('[' + _0x55603a['toUpperCase']() + ']\x20' + _0x4b0f93);
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
} catch (_0x0_0x186a53) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x2f832a => {
    try {
        return _0x0_0x5edd75['deflateSync'](JSON['stringify'](_0x2f832a));
    } catch (_0x7df2b5) {
        console['error']('[STORE]\x20Compression\x20error:', _0x7df2b5['message']);
        return Buffer['from'](JSON['stringify'](_0x2f832a));
    }
};
const decompress = _0x2bed6b => {
    try {
        return JSON['parse'](_0x0_0x5edd75['inflateSync'](_0x2bed6b));
    } catch (_0x3e51) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x3e51['message']);
        try {
            return JSON['parse'](_0x2bed6b['toString']());
        } catch (_0x28b1c6) {
            return null;
        }
    }
};
function slimMessage(_0x33e934) {
    return {
        'key': _0x33e934['key'],
        'message': _0x33e934['message'],
        'messageTimestamp': _0x33e934['messageTimestamp'],
        'participant': _0x33e934['participant'],
        'pushName': _0x33e934['pushName'],
        'broadcast': _0x33e934['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x5ee05a => console['error']('[MONGO]\x20Connection\x20error:', _0x5ee05a));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x3a9016, _0x431339, _0xb49cdc) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x3a9016,
                        'id': _0x431339
                    }, {
                        'data': compress(_0xb49cdc),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x1edf08) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x1edf08['message']);
                }
            },
            async 'load'(_0x3a1e88, _0x2bb1cd) {
                try {
                    const _0x281b89 = await Msg['findOne']({
                        'jid': _0x3a1e88,
                        'id': _0x2bb1cd
                    });
                    return _0x281b89 ? decompress(_0x281b89['data']) : null;
                } catch (_0x2a7114) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x2a7114['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x1d43fe, _0x3b9e07) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x1d43fe,
                        'userId': _0x3b9e07
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x13def0) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x13def0['message']);
                }
            },
            async 'getCount'(_0x198549, _0x59f94f) {
                try {
                    const _0x594ec0 = await MsgCount['findOne']({
                        'chatId': _0x198549,
                        'userId': _0x59f94f
                    });
                    return _0x594ec0 ? _0x594ec0['count'] : 0x0;
                } catch (_0x70f527) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x70f527['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x4b7dfc = await MsgCount['find']({});
                    const _0x6feb3b = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x4b7dfc['forEach'](_0x248170 => {
                        if (!_0x6feb3b['messageCount'][_0x248170['chatId']]) {
                            _0x6feb3b['messageCount'][_0x248170['chatId']] = {};
                        }
                        _0x6feb3b['messageCount'][_0x248170['chatId']][_0x248170['userId']] = _0x248170['count'];
                    });
                    const _0x1f3dd7 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x1f3dd7)
                        _0x6feb3b['isPublic'] = _0x1f3dd7['value'] === 'true';
                    return _0x6feb3b;
                } catch (_0x229a98) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x229a98['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3614d2) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x3614d2['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x47e42f) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x47e42f['message']);
                }
            },
            async 'setMetadata'(_0x1a00b4, _0x3e14c4) {
                try {
                    await Meta['updateOne']({ 'key': _0x1a00b4 }, {
                        'key': _0x1a00b4,
                        'value': _0x3e14c4['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x44c82e) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x44c82e['message']);
                }
            },
            async 'getMetadata'(_0x3b30b2) {
                try {
                    const _0x127085 = await Meta['findOne']({ 'key': _0x3b30b2 });
                    return _0x127085 ? _0x127085['value'] : null;
                } catch (_0x546f5f) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x546f5f['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x4249cd, _0x83d063) {
                try {
                    await Contact['updateOne']({ 'jid': _0x4249cd }, {
                        ..._0x83d063,
                        'jid': _0x4249cd,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x2906d6) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x2906d6['message']);
                }
            },
            async 'getContact'(_0x3ed3a9) {
                try {
                    return await Contact['findOne']({ 'jid': _0x3ed3a9 });
                } catch (_0x1b6dda) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x1b6dda['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x247ee0 = await Contact['find']({});
                    const _0x14be81 = {};
                    _0x247ee0['forEach'](_0x24f2f3 => {
                        _0x14be81[_0x24f2f3['jid']] = {
                            'id': _0x24f2f3['jid'],
                            'name': _0x24f2f3['name'],
                            'notify': _0x24f2f3['notify']
                        };
                    });
                    return _0x14be81;
                } catch (_0x1b9ffd) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x1b9ffd['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x46539b, _0x3dd195) {
                try {
                    await Chat['updateOne']({ 'jid': _0x46539b }, {
                        ..._0x3dd195,
                        'jid': _0x46539b,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0xa1006e) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0xa1006e['message']);
                }
            },
            async 'getChat'(_0x1706b2) {
                try {
                    return await Chat['findOne']({ 'jid': _0x1706b2 });
                } catch (_0x4629e3) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x4629e3['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x55f680 = await Chat['find']({});
                    const _0x29b0fb = {};
                    _0x55f680['forEach'](_0x36e509 => {
                        _0x29b0fb[_0x36e509['jid']] = {
                            'id': _0x36e509['jid'],
                            'name': _0x36e509['name'],
                            'conversationTimestamp': _0x36e509['conversationTimestamp'],
                            'unreadCount': _0x36e509['unreadCount']
                        };
                    });
                    return _0x29b0fb;
                } catch (_0x5afdff) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x5afdff['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x23ece3) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x23ece3 });
                } catch (_0x141d00) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x141d00['message']);
                }
            },
            async 'saveSetting'(_0x3010cc, _0x3c07c5, _0x1f04a4) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x3010cc,
                        'key': _0x3c07c5
                    }, {
                        'chatId': _0x3010cc,
                        'key': _0x3c07c5,
                        'value': _0x1f04a4,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3d47c2) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x3d47c2['message']);
                }
            },
            async 'getSetting'(_0x3edd5a, _0x1d07a9) {
                try {
                    const _0x36a32e = await Setting['findOne']({
                        'chatId': _0x3edd5a,
                        'key': _0x1d07a9
                    });
                    return _0x36a32e ? _0x36a32e['value'] : null;
                } catch (_0x243808) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x243808['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x9ee08a) {
                try {
                    const _0x253421 = await Setting['find']({ 'chatId': _0x9ee08a });
                    const _0x1f8f2d = {};
                    _0x253421['forEach'](_0x512bbd => {
                        _0x1f8f2d[_0x512bbd['key']] = _0x512bbd['value'];
                    });
                    return _0x1f8f2d;
                } catch (_0x6592dd) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x6592dd['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0xad3250 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0xad3250['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0xad3250['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x4aa44e) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x4aa44e['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x27fdc6) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x27fdc6['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x509835) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x509835['message']);
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
        pool['on']('error', _0x350f9a => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x350f9a['message']);
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
                        const _0x561cd6 = await pool['connect']();
                        try {
                            await _0x561cd6['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x561cd6['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x561cd6['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x561cd6['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x561cd6['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x561cd6['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x561cd6['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x561cd6['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x561cd6['release']();
                        }
                    } catch (_0x4c20c4) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x4c20c4['message']);
                        this['initPromise'] = null;
                        throw _0x4c20c4;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x750473, _0x2974c8, _0x4a29c6) {
                try {
                    await this['init']();
                    const _0x2f7270 = await pool['connect']();
                    try {
                        await _0x2f7270['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x750473,
                            _0x2974c8,
                            Date['now'](),
                            compress(_0x4a29c6)
                        ]);
                    } finally {
                        _0x2f7270['release']();
                    }
                } catch (_0x570cfa) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x570cfa['message']);
                }
            },
            async 'load'(_0x106259, _0xbe94de) {
                try {
                    await this['init']();
                    const _0x3d7155 = await pool['connect']();
                    try {
                        const _0x8712ad = await _0x3d7155['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x106259,
                            _0xbe94de
                        ]);
                        return _0x8712ad['rows'][0x0] ? decompress(_0x8712ad['rows'][0x0]['data']) : null;
                    } finally {
                        _0x3d7155['release']();
                    }
                } catch (_0x432b85) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x432b85['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x31f381, _0x937f4d) {
                try {
                    await this['init']();
                    const _0x2f42bf = await pool['connect']();
                    try {
                        await _0x2f42bf['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x31f381,
                            _0x937f4d
                        ]);
                    } finally {
                        _0x2f42bf['release']();
                    }
                } catch (_0x5d9ee3) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x5d9ee3['message']);
                }
            },
            async 'getCount'(_0x4e0add, _0x5bd318) {
                try {
                    await this['init']();
                    const _0x558917 = await pool['connect']();
                    try {
                        const _0x15b528 = await _0x558917['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x4e0add,
                            _0x5bd318
                        ]);
                        return _0x15b528['rows'][0x0] ? _0x15b528['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x558917['release']();
                    }
                } catch (_0x4b285c) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x4b285c['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x27e90b = await pool['connect']();
                    try {
                        const _0x5dee0f = await _0x27e90b['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x181ca2 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x5dee0f['rows']['forEach'](_0x315751 => {
                            if (!_0x181ca2['messageCount'][_0x315751['chat_id']]) {
                                _0x181ca2['messageCount'][_0x315751['chat_id']] = {};
                            }
                            _0x181ca2['messageCount'][_0x315751['chat_id']][_0x315751['user_id']] = _0x315751['count'];
                        });
                        const _0x4823bc = await _0x27e90b['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x4823bc['rows'][0x0])
                            _0x181ca2['isPublic'] = _0x4823bc['rows'][0x0]['value'] === 'true';
                        return _0x181ca2;
                    } finally {
                        _0x27e90b['release']();
                    }
                } catch (_0x526756) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x526756['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x200230) {
                try {
                    await this['init']();
                    const _0x285330 = await pool['connect']();
                    try {
                        await _0x285330['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x200230['toString']()]);
                    } finally {
                        _0x285330['release']();
                    }
                } catch (_0x5414cf) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x5414cf['message']);
                }
            },
            async 'setMetadata'(_0x592b1e, _0x1c1eec) {
                try {
                    await this['init']();
                    const _0x5ea389 = await pool['connect']();
                    try {
                        await _0x5ea389['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x592b1e,
                            _0x1c1eec['toString']()
                        ]);
                    } finally {
                        _0x5ea389['release']();
                    }
                } catch (_0x62d61f) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x62d61f['message']);
                }
            },
            async 'getMetadata'(_0x465067) {
                try {
                    await this['init']();
                    const _0x2a72b3 = await pool['connect']();
                    try {
                        const _0x59f030 = await _0x2a72b3['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x465067]);
                        return _0x59f030['rows'][0x0] ? _0x59f030['rows'][0x0]['value'] : null;
                    } finally {
                        _0x2a72b3['release']();
                    }
                } catch (_0x3ee265) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x3ee265['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x2b7254, _0x475c3c) {
                try {
                    await this['init']();
                    const _0xd8505c = await pool['connect']();
                    try {
                        await _0xd8505c['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x2b7254,
                            _0x475c3c['name'] || '',
                            _0x475c3c['notify'] || '',
                            _0x475c3c['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0xd8505c['release']();
                    }
                } catch (_0x1b854d) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x1b854d['message']);
                }
            },
            async 'getContact'(_0x3f7dfb) {
                try {
                    await this['init']();
                    const _0x400352 = await pool['connect']();
                    try {
                        const _0x2930bc = await _0x400352['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x3f7dfb]);
                        return _0x2930bc['rows'][0x0] || null;
                    } finally {
                        _0x400352['release']();
                    }
                } catch (_0x589c7e) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x589c7e['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x2e00b5 = await pool['connect']();
                    try {
                        const _0x463120 = await _0x2e00b5['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x410060 = {};
                        _0x463120['rows']['forEach'](_0x337c16 => {
                            _0x410060[_0x337c16['jid']] = {
                                'id': _0x337c16['jid'],
                                'name': _0x337c16['name'],
                                'notify': _0x337c16['notify']
                            };
                        });
                        return _0x410060;
                    } finally {
                        _0x2e00b5['release']();
                    }
                } catch (_0x54c7ff) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x54c7ff['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x271e7e, _0x5d485f) {
                try {
                    await this['init']();
                    const _0x44525b = await pool['connect']();
                    try {
                        await _0x44525b['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x271e7e,
                            _0x5d485f['name'] || '',
                            _0x5d485f['conversationTimestamp'] || 0x0,
                            _0x5d485f['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x44525b['release']();
                    }
                } catch (_0x376df4) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x376df4['message']);
                }
            },
            async 'getChat'(_0x4d4e9b) {
                try {
                    await this['init']();
                    const _0x5686e8 = await pool['connect']();
                    try {
                        const _0x352eb4 = await _0x5686e8['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x4d4e9b]);
                        return _0x352eb4['rows'][0x0] || null;
                    } finally {
                        _0x5686e8['release']();
                    }
                } catch (_0x44f59b) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x44f59b['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x52c10c = await pool['connect']();
                    try {
                        const _0x5ec453 = await _0x52c10c['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0xdf61a = {};
                        _0x5ec453['rows']['forEach'](_0x53a6ea => {
                            _0xdf61a[_0x53a6ea['jid']] = {
                                'id': _0x53a6ea['jid'],
                                'name': _0x53a6ea['name'],
                                'conversationTimestamp': _0x53a6ea['conversation_timestamp'],
                                'unreadCount': _0x53a6ea['unread_count']
                            };
                        });
                        return _0xdf61a;
                    } finally {
                        _0x52c10c['release']();
                    }
                } catch (_0x479497) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x479497['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x9dfe4e) {
                try {
                    await this['init']();
                    const _0x4ecf41 = await pool['connect']();
                    try {
                        await _0x4ecf41['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x9dfe4e]);
                    } finally {
                        _0x4ecf41['release']();
                    }
                } catch (_0x33f568) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x33f568['message']);
                }
            },
            async 'saveSetting'(_0x4a66ec, _0x6d933f, _0x586f86) {
                try {
                    await this['init']();
                    const _0x23f54e = await pool['connect']();
                    try {
                        await _0x23f54e['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x4a66ec,
                            _0x6d933f,
                            JSON['stringify'](_0x586f86),
                            Date['now']()
                        ]);
                    } finally {
                        _0x23f54e['release']();
                    }
                } catch (_0x2e50b3) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x2e50b3['message']);
                }
            },
            async 'getSetting'(_0x1b668f, _0x3f46c3) {
                try {
                    await this['init']();
                    const _0x17c91f = await pool['connect']();
                    try {
                        const _0x1af9a8 = await _0x17c91f['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x1b668f,
                            _0x3f46c3
                        ]);
                        return _0x1af9a8['rows'][0x0] ? JSON['parse'](_0x1af9a8['rows'][0x0]['value']) : null;
                    } finally {
                        _0x17c91f['release']();
                    }
                } catch (_0x393be2) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x393be2['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x28d761) {
                try {
                    await this['init']();
                    const _0x29c71c = await pool['connect']();
                    try {
                        const _0x23e9a2 = await _0x29c71c['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x28d761]);
                        const _0xa744f = {};
                        _0x23e9a2['rows']['forEach'](_0x1491ae => {
                            _0xa744f[_0x1491ae['key']] = JSON['parse'](_0x1491ae['value']);
                        });
                        return _0xa744f;
                    } finally {
                        _0x29c71c['release']();
                    }
                } catch (_0x232a76) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x232a76['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x56e5ed = await pool['connect']();
                    try {
                        const _0x4466e7 = await _0x56e5ed['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x4466e7['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x4466e7['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x56e5ed['release']();
                    }
                } catch (_0x2009b2) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x2009b2['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x48b39a) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x48b39a['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x3f44f8) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x3f44f8['message']);
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
                    } catch (_0x40bdc7) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x40bdc7['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x40bdc7;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x5f4a5f, _0x452488, _0x31fe24) {
                try {
                    const _0x36626f = await this['getConn']();
                    await _0x36626f['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x5f4a5f,
                        _0x452488,
                        Date['now'](),
                        compress(_0x31fe24)
                    ]);
                } catch (_0x4672e5) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x4672e5['message']);
                }
            },
            async 'load'(_0x5bf4ad, _0x2300c4) {
                try {
                    const _0x22e34a = await this['getConn']();
                    const [_0x462975] = await _0x22e34a['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x5bf4ad,
                        _0x2300c4
                    ]);
                    return _0x462975[0x0] ? decompress(_0x462975[0x0]['data']) : null;
                } catch (_0x17ad90) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x17ad90['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0xb56cd4, _0x4b9c30) {
                try {
                    const _0x57c17c = await this['getConn']();
                    await _0x57c17c['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0xb56cd4,
                        _0x4b9c30
                    ]);
                } catch (_0x17b63f) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x17b63f['message']);
                }
            },
            async 'getCount'(_0x5500b2, _0x75a344) {
                try {
                    const _0x43e9a5 = await this['getConn']();
                    const [_0x4c13a6] = await _0x43e9a5['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x5500b2,
                        _0x75a344
                    ]);
                    return _0x4c13a6[0x0] ? _0x4c13a6[0x0]['count'] : 0x0;
                } catch (_0x6686fe) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x6686fe['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x2bcd8b = await this['getConn']();
                    const [_0x3f0e57] = await _0x2bcd8b['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x46c50f = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3f0e57['forEach'](_0x397d24 => {
                        if (!_0x46c50f['messageCount'][_0x397d24['chat_id']]) {
                            _0x46c50f['messageCount'][_0x397d24['chat_id']] = {};
                        }
                        _0x46c50f['messageCount'][_0x397d24['chat_id']][_0x397d24['user_id']] = _0x397d24['count'];
                    });
                    const [_0x4dc12f] = await _0x2bcd8b['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x4dc12f[0x0])
                        _0x46c50f['isPublic'] = _0x4dc12f[0x0]['value'] === 'true';
                    return _0x46c50f;
                } catch (_0x144a2b) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x144a2b['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x296b3f) {
                try {
                    const _0x5a5c7e = await this['getConn']();
                    await _0x5a5c7e['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x296b3f['toString']()]);
                } catch (_0x2890fb) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x2890fb['message']);
                }
            },
            async 'setMetadata'(_0x5051f1, _0x206af3) {
                try {
                    const _0x57d117 = await this['getConn']();
                    await _0x57d117['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x5051f1,
                        _0x206af3['toString']()
                    ]);
                } catch (_0x46852e) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x46852e['message']);
                }
            },
            async 'getMetadata'(_0x267928) {
                try {
                    const _0x2a3591 = await this['getConn']();
                    const [_0x54950f] = await _0x2a3591['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x267928]);
                    return _0x54950f[0x0] ? _0x54950f[0x0]['value'] : null;
                } catch (_0x301cee) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x301cee['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x4db294, _0x4006e6) {
                try {
                    const _0x1de2bf = await this['getConn']();
                    await _0x1de2bf['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x4db294,
                        _0x4006e6['name'] || '',
                        _0x4006e6['notify'] || '',
                        _0x4006e6['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x488bc9) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x488bc9['message']);
                }
            },
            async 'getContact'(_0x38664f) {
                try {
                    const _0x451d75 = await this['getConn']();
                    const [_0x26e765] = await _0x451d75['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x38664f]);
                    return _0x26e765[0x0] || null;
                } catch (_0x4bd591) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x4bd591['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x1e5694 = await this['getConn']();
                    const [_0x5170ca] = await _0x1e5694['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x3e7171 = {};
                    _0x5170ca['forEach'](_0x326887 => {
                        _0x3e7171[_0x326887['jid']] = {
                            'id': _0x326887['jid'],
                            'name': _0x326887['name'],
                            'notify': _0x326887['notify']
                        };
                    });
                    return _0x3e7171;
                } catch (_0x2bfafa) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x2bfafa['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x23b3b2, _0x3d6b91) {
                try {
                    const _0x4024f4 = await this['getConn']();
                    await _0x4024f4['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x23b3b2,
                        _0x3d6b91['name'] || '',
                        _0x3d6b91['conversationTimestamp'] || 0x0,
                        _0x3d6b91['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0xc7264) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0xc7264['message']);
                }
            },
            async 'getChat'(_0x422365) {
                try {
                    const _0x11c4d7 = await this['getConn']();
                    const [_0xb2c57e] = await _0x11c4d7['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x422365]);
                    return _0xb2c57e[0x0] || null;
                } catch (_0x519a81) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x519a81['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x2f76ec = await this['getConn']();
                    const [_0x1d66cf] = await _0x2f76ec['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x517009 = {};
                    _0x1d66cf['forEach'](_0x15432d => {
                        _0x517009[_0x15432d['jid']] = {
                            'id': _0x15432d['jid'],
                            'name': _0x15432d['name'],
                            'conversationTimestamp': _0x15432d['conversation_timestamp'],
                            'unreadCount': _0x15432d['unread_count']
                        };
                    });
                    return _0x517009;
                } catch (_0x38b3f0) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x38b3f0['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x1ac70f) {
                try {
                    const _0x33e6eb = await this['getConn']();
                    await _0x33e6eb['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x1ac70f]);
                } catch (_0x17b6a0) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x17b6a0['message']);
                }
            },
            async 'saveSetting'(_0x40bcee, _0x5f341c, _0x3c8f0d) {
                try {
                    const _0x1baf84 = await this['getConn']();
                    await _0x1baf84['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x40bcee,
                        _0x5f341c,
                        JSON['stringify'](_0x3c8f0d),
                        Date['now']()
                    ]);
                } catch (_0x149d78) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x149d78['message']);
                }
            },
            async 'getSetting'(_0x160a98, _0x6f1cb3) {
                try {
                    const _0x6ce258 = await this['getConn']();
                    const [_0x36a860] = await _0x6ce258['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x160a98,
                        _0x6f1cb3
                    ]);
                    return _0x36a860[0x0] ? JSON['parse'](_0x36a860[0x0]['value']) : null;
                } catch (_0x4522e3) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x4522e3['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x3103a5) {
                try {
                    const _0x4348e6 = await this['getConn']();
                    const [_0x1a3e02] = await _0x4348e6['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x3103a5]);
                    const _0x368b99 = {};
                    _0x1a3e02['forEach'](_0x2d7af4 => {
                        _0x368b99[_0x2d7af4['key']] = JSON['parse'](_0x2d7af4['value']);
                    });
                    return _0x368b99;
                } catch (_0x3b409e) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x3b409e['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x4ca423 = await this['getConn']();
                    const [_0x2464d6] = await _0x4ca423['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x2464d6['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x2464d6['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0xaaee51) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0xaaee51['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x1bfef9) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x1bfef9['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x341d8f) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x341d8f['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x2c4036['dirname'](SQLITE_URL);
        if (!_0x0_0x28d844['existsSync'](dir))
            _0x0_0x28d844['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x3489b1, _0x36dc82, _0x4af79a) {
                try {
                    saveStmt['run'](_0x3489b1, _0x36dc82, Date['now'](), compress(_0x4af79a));
                    const {count: _0x119347} = countStmt['get'](_0x3489b1);
                    if (_0x119347 > MESSAGE_LIMITS['sqlite']) {
                        const _0x45ac4d = _0x119347 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x3489b1, _0x3489b1, _0x45ac4d);
                    }
                } catch (_0xb6c5eb) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0xb6c5eb['message']);
                }
            },
            'load'(_0x6a5034, _0x245b2d) {
                try {
                    const _0x5e925e = loadStmt['get'](_0x6a5034, _0x245b2d);
                    return _0x5e925e ? decompress(_0x5e925e['data']) : null;
                } catch (_0x9dc8b7) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x9dc8b7['message']);
                    return null;
                }
            },
            'incrementCount'(_0x5951c5, _0x4574bf) {
                try {
                    incrementCountStmt['run'](_0x5951c5, _0x4574bf);
                } catch (_0x443d8f) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x443d8f['message']);
                }
            },
            'getCount'(_0x5e5256, _0x44d29a) {
                try {
                    const _0x26f09f = getCountStmt['get'](_0x5e5256, _0x44d29a);
                    return _0x26f09f ? _0x26f09f['count'] : 0x0;
                } catch (_0x21096f) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x21096f['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x5bd79f = getAllCountsStmt['all']();
                    const _0x4ede5b = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x5bd79f['forEach'](_0x4b3f0e => {
                        if (!_0x4ede5b['messageCount'][_0x4b3f0e['chat_id']]) {
                            _0x4ede5b['messageCount'][_0x4b3f0e['chat_id']] = {};
                        }
                        _0x4ede5b['messageCount'][_0x4b3f0e['chat_id']][_0x4b3f0e['user_id']] = _0x4b3f0e['count'];
                    });
                    const _0x4a324b = getMetaStmt['get']();
                    if (_0x4a324b)
                        _0x4ede5b['isPublic'] = _0x4a324b['value'] === 'true';
                    return _0x4ede5b;
                } catch (_0x57daa3) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x57daa3['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x532019) {
                try {
                    setMetaStmt['run'](_0x532019['toString']());
                } catch (_0x5eb2f6) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x5eb2f6['message']);
                }
            },
            'setMetadata'(_0x1a3946, _0x3824d8) {
                try {
                    setMetadataStmt['run'](_0x1a3946, _0x3824d8['toString']());
                } catch (_0x43549a) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x43549a['message']);
                }
            },
            'getMetadata'(_0xd48aa3) {
                try {
                    const _0x422c2b = getMetadataStmt['get'](_0xd48aa3);
                    return _0x422c2b ? _0x422c2b['value'] : null;
                } catch (_0xc66912) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0xc66912['message']);
                    return null;
                }
            },
            'saveContact'(_0x1db3a3, _0x62a200) {
                try {
                    saveContactStmt['run'](_0x1db3a3, _0x62a200['name'] || '', _0x62a200['notify'] || '', _0x62a200['verifiedName'] || '', Date['now']());
                } catch (_0x3ae8c0) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x3ae8c0['message']);
                }
            },
            'getContact'(_0x286b4d) {
                try {
                    return getContactStmt['get'](_0x286b4d) || null;
                } catch (_0x1afaa9) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x1afaa9['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x899273 = getAllContactsStmt['all']();
                    const _0xacd82b = {};
                    _0x899273['forEach'](_0x4782be => {
                        _0xacd82b[_0x4782be['jid']] = {
                            'id': _0x4782be['jid'],
                            'name': _0x4782be['name'],
                            'notify': _0x4782be['notify']
                        };
                    });
                    return _0xacd82b;
                } catch (_0x42cd6d) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x42cd6d['message']);
                    return {};
                }
            },
            'saveChat'(_0x16809a, _0x1a66c3) {
                try {
                    saveChatStmt['run'](_0x16809a, _0x1a66c3['name'] || '', _0x1a66c3['conversationTimestamp'] || 0x0, _0x1a66c3['unreadCount'] || 0x0, Date['now']());
                } catch (_0x2554bc) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x2554bc['message']);
                }
            },
            'getChat'(_0x32a9bf) {
                try {
                    return getChatStmt['get'](_0x32a9bf) || null;
                } catch (_0x5d0f46) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x5d0f46['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x373924 = getAllChatsStmt['all']();
                    const _0x21028d = {};
                    _0x373924['forEach'](_0x33de17 => {
                        _0x21028d[_0x33de17['jid']] = {
                            'id': _0x33de17['jid'],
                            'name': _0x33de17['name'],
                            'conversationTimestamp': _0x33de17['conversation_timestamp'],
                            'unreadCount': _0x33de17['unread_count']
                        };
                    });
                    return _0x21028d;
                } catch (_0x326944) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x326944['message']);
                    return {};
                }
            },
            'deleteChat'(_0x225e24) {
                try {
                    deleteChatStmt['run'](_0x225e24);
                } catch (_0x5e27de) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x5e27de['message']);
                }
            },
            'saveSetting'(_0x15dbce, _0x30e116, _0x1620f3) {
                try {
                    saveSettingStmt['run'](_0x15dbce, _0x30e116, JSON['stringify'](_0x1620f3), Date['now']());
                } catch (_0xec33f) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0xec33f['message']);
                }
            },
            'getSetting'(_0x21c83d, _0x1ae8bb) {
                try {
                    const _0x532904 = getSettingStmt['get'](_0x21c83d, _0x1ae8bb);
                    return _0x532904 ? JSON['parse'](_0x532904['value']) : null;
                } catch (_0xe5dc58) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0xe5dc58['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x77b0d6) {
                try {
                    const _0x2ee7a0 = getAllSettingsStmt['all'](_0x77b0d6);
                    const _0x317d90 = {};
                    _0x2ee7a0['forEach'](_0x56b1e5 => {
                        _0x317d90[_0x56b1e5['key']] = JSON['parse'](_0x56b1e5['value']);
                    });
                    return _0x317d90;
                } catch (_0x45adad) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x45adad['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x3b4f34 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x3b4f34['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x3b4f34['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x108f13) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x108f13['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x3831a8) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x3831a8['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x4531d1) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x4531d1['message']);
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
    async 'readFromFile'(_0x46f105 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x1cba45 = await adapters[backend]['getAllContacts']();
                const _0x52f2df = await adapters[backend]['getAllChats']();
                const _0x3f8df9 = await this['getBotMode']();
                this['contacts'] = _0x1cba45;
                this['chats'] = _0x52f2df;
                this['botMode'] = _0x3f8df9;
            } else {
                if (_0x0_0x28d844['existsSync'](_0x46f105)) {
                    const _0x1f7af2 = JSON['parse'](_0x0_0x28d844['readFileSync'](_0x46f105, 'utf-8'));
                    this['contacts'] = _0x1f7af2['contacts'] || {};
                    this['chats'] = _0x1f7af2['chats'] || {};
                    this['botMode'] = _0x1f7af2['botMode'] || 'private';
                    this['messages'] = _0x1f7af2['messages'] || {};
                    this['isPublic'] = _0x1f7af2['isPublic'] !== undefined ? _0x1f7af2['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x1beefc) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x1beefc['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x20eff8 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x3ac209 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x28d844['writeFileSync'](_0x20eff8, JSON['stringify'](_0x3ac209, null, 0x2));
        } catch (_0x2a7055) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x2a7055['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x28d844['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x5108fa = JSON['parse'](_0x0_0x28d844['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x5108fa['messageCount'] || _0x5108fa;
                    this['isPublic'] = typeof _0x5108fa['isPublic'] === 'boolean' ? _0x5108fa['isPublic'] : ![];
                }
            } catch (_0x3128f0) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x3128f0['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x538d86 = _0x0_0x2c4036['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x28d844['existsSync'](_0x538d86))
                    _0x0_0x28d844['mkdirSync'](_0x538d86, { 'recursive': !![] });
                const _0x42e0d5 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x28d844['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x42e0d5, null, 0x2));
            } catch (_0x2cc801) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x2cc801['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x27105b => {
                if (typeof this['messages'][_0x27105b] === 'object' && !Array['isArray'](this['messages'][_0x27105b])) {
                    const _0x392d43 = Object['values'](this['messages'][_0x27105b]);
                    this['messages'][_0x27105b] = _0x392d43['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x27105b])) {
                    if (this['messages'][_0x27105b]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x27105b] = this['messages'][_0x27105b]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x17e4b9 => {
                if (this['chats'][_0x17e4b9]['messages']) {
                    delete this['chats'][_0x17e4b9]['messages'];
                }
            });
        }
    },
    'bind'(_0x5835cf) {
        _0x5835cf['on']('messages.upsert', async ({messages: _0x15d5d2}) => {
            for (const _0x14ce3f of _0x15d5d2) {
                if (!_0x14ce3f['key']?.['remoteJid'])
                    continue;
                const _0x443901 = _0x14ce3f['key']['remoteJid'];
                const _0x5d129a = slimMessage(_0x14ce3f);
                if (backend === 'memory') {
                    this['messages'][_0x443901] = this['messages'][_0x443901] || [];
                    this['messages'][_0x443901]['push'](_0x5d129a);
                    if (this['messages'][_0x443901]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x443901] = this['messages'][_0x443901]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x443901, _0x14ce3f['key']['id'], _0x5d129a);
                    } catch (_0x5a8a6f) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x14ce3f['key']['id'] + ':', _0x5a8a6f['message']);
                    }
                }
            }
        });
        _0x5835cf['on']('contacts.update', async _0x241564 => {
            for (const _0x500c1f of _0x241564) {
                if (_0x500c1f['id']) {
                    const _0x471a02 = {
                        'id': _0x500c1f['id'],
                        'name': _0x500c1f['notify'] || _0x500c1f['name'] || _0x500c1f['verifiedName'] || '',
                        'notify': _0x500c1f['notify'],
                        'verifiedName': _0x500c1f['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x500c1f['id']] = _0x471a02;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x500c1f['id'], _0x471a02);
                        } catch (_0x273866) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x273866['message']);
                        }
                    }
                }
            }
        });
        _0x5835cf['on']('contacts.set', async _0x3edf54 => {
            for (const _0x488cde of _0x3edf54) {
                if (_0x488cde['id']) {
                    const _0x1d74de = {
                        'id': _0x488cde['id'],
                        'name': _0x488cde['notify'] || _0x488cde['name'] || _0x488cde['verifiedName'] || '',
                        'notify': _0x488cde['notify'],
                        'verifiedName': _0x488cde['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x488cde['id']] = _0x1d74de;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x488cde['id'], _0x1d74de);
                        } catch (_0x3dac42) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x3dac42['message']);
                        }
                    }
                }
            }
        });
        _0x5835cf['on']('chats.set', async _0x1bbe37 => {
            for (const _0x4c99bd of _0x1bbe37) {
                if (_0x4c99bd['id']) {
                    const _0x23a4e2 = {
                        'id': _0x4c99bd['id'],
                        'name': _0x4c99bd['name'] || _0x4c99bd['subject'] || '',
                        'conversationTimestamp': _0x4c99bd['conversationTimestamp'],
                        'unreadCount': _0x4c99bd['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x4c99bd['id']] = _0x23a4e2;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x4c99bd['id'], _0x23a4e2);
                        } catch (_0x387615) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x387615['message']);
                        }
                    }
                }
            }
        });
        _0x5835cf['on']('chats.update', async _0x15d5e0 => {
            for (const _0xba7d52 of _0x15d5e0) {
                if (_0xba7d52['id']) {
                    if (backend === 'memory') {
                        const _0x2b4491 = this['chats'][_0xba7d52['id']] || {};
                        this['chats'][_0xba7d52['id']] = {
                            'id': _0xba7d52['id'],
                            'name': _0xba7d52['name'] || _0xba7d52['subject'] || _0x2b4491['name'] || '',
                            'conversationTimestamp': _0xba7d52['conversationTimestamp'] || _0x2b4491['conversationTimestamp'],
                            'unreadCount': _0xba7d52['unreadCount'] !== undefined ? _0xba7d52['unreadCount'] : _0x2b4491['unreadCount']
                        };
                    } else {
                        try {
                            const _0xed5474 = await adapters[backend]['getChat'](_0xba7d52['id']) || {};
                            const _0x422cef = {
                                'id': _0xba7d52['id'],
                                'name': _0xba7d52['name'] || _0xba7d52['subject'] || _0xed5474['name'] || '',
                                'conversationTimestamp': _0xba7d52['conversationTimestamp'] || _0xed5474['conversation_timestamp'],
                                'unreadCount': _0xba7d52['unreadCount'] !== undefined ? _0xba7d52['unreadCount'] : _0xed5474['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0xba7d52['id'], _0x422cef);
                        } catch (_0x577b00) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x577b00['message']);
                        }
                    }
                }
            }
        });
        _0x5835cf['on']('chats.delete', async _0x33195d => {
            for (const _0x7b4dd of _0x33195d) {
                if (backend === 'memory') {
                    delete this['chats'][_0x7b4dd];
                    delete this['messages'][_0x7b4dd];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x7b4dd);
                    } catch (_0x1c669f) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x1c669f['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x360887, _0x5a6490) {
        if (backend === 'memory') {
            const _0xa9e024 = this['messages'][_0x360887]?.['find'](_0x1dcd0c => _0x1dcd0c['key']['id'] === _0x5a6490) || null;
            return _0xa9e024;
        } else {
            try {
                return await adapters[backend]['load'](_0x360887, _0x5a6490);
            } catch (_0x1d2bab) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x5a6490 + ':', _0x1d2bab['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x399936, _0x2f72e8, _0x24147e) {
        if (backend === 'memory') {
            const _0x52265a = './data';
            if (!_0x0_0x28d844['existsSync'](_0x52265a))
                _0x0_0x28d844['mkdirSync'](_0x52265a, { 'recursive': !![] });
            const _0x17d165 = _0x0_0x2c4036['join'](_0x52265a, _0x2f72e8 + '.json');
            try {
                _0x0_0x28d844['writeFileSync'](_0x17d165, JSON['stringify'](_0x24147e, null, 0x2));
            } catch (_0x5d400a) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x2f72e8 + ':', _0x5d400a['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x399936, _0x2f72e8, _0x24147e);
            } catch (_0x269f56) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x2f72e8 + ':', _0x269f56['message']);
            }
        }
    },
    async 'getSetting'(_0x399185, _0x4266f2) {
        if (backend === 'memory') {
            const _0x3b82aa = './data';
            const _0x1fb28a = _0x0_0x2c4036['join'](_0x3b82aa, _0x4266f2 + '.json');
            try {
                if (_0x0_0x28d844['existsSync'](_0x1fb28a)) {
                    const _0x469f87 = JSON['parse'](_0x0_0x28d844['readFileSync'](_0x1fb28a, 'utf-8'));
                    if (_0x469f87['enabled'] !== undefined)
                        return _0x469f87;
                    if (_0x469f87[_0x399185] !== undefined)
                        return _0x469f87[_0x399185];
                    return null;
                }
                return null;
            } catch (_0x507017) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x4266f2 + ':', _0x507017['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x399185, _0x4266f2);
            } catch (_0x2c5bed) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x4266f2 + ':', _0x2c5bed['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x58b9ea) {
        if (backend === 'memory') {
            const _0x2223f2 = './data';
            const _0x24cc6a = {};
            try {
                if (_0x0_0x28d844['existsSync'](_0x2223f2)) {
                    const _0x11fcbb = _0x0_0x28d844['readdirSync'](_0x2223f2)['filter'](_0x516ca1 => _0x516ca1['endsWith']('.json'));
                    for (const _0x3119fd of _0x11fcbb) {
                        const _0x27c6fe = _0x0_0x2c4036['basename'](_0x3119fd, '.json');
                        if (_0x27c6fe === 'messageCount' || _0x27c6fe === 'owner')
                            continue;
                        const _0x168d07 = _0x0_0x2c4036['join'](_0x2223f2, _0x3119fd);
                        const _0x58f05f = JSON['parse'](_0x0_0x28d844['readFileSync'](_0x168d07, 'utf-8'));
                        if (_0x58f05f[_0x58b9ea]) {
                            _0x24cc6a[_0x27c6fe] = _0x58f05f[_0x58b9ea];
                        }
                    }
                }
                return _0x24cc6a;
            } catch (_0x5e6aed) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x5e6aed['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x58b9ea);
            } catch (_0x3564da) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x3564da['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x224095) {
        const _0x3a24a9 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x3a24a9['includes'](_0x224095)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x224095 + ',\x20defaulting\x20to\x20private');
            _0x224095 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x224095;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x224095);
            } catch (_0x3e7c15) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x3e7c15['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x4d0554 = await adapters[backend]['getMetadata']('botMode');
                return _0x4d0554 || 'private';
            } catch (_0x531a87) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x531a87['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x19420d, _0x2db1d1, _0x54f091) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x19420d]) {
                this['messageCount'][_0x19420d] = {};
            }
            if (!this['messageCount'][_0x19420d][_0x2db1d1]) {
                this['messageCount'][_0x19420d][_0x2db1d1] = 0x0;
            }
            this['messageCount'][_0x19420d][_0x2db1d1]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x19420d, _0x2db1d1);
            } catch (_0x3fae0c) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x2db1d1 + ':', _0x3fae0c['message']);
            }
        }
    },
    async 'getMessageCount'(_0x2d2b57, _0x3a0fd4) {
        if (backend === 'memory') {
            return this['messageCount'][_0x2d2b57]?.[_0x3a0fd4] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x2d2b57, _0x3a0fd4);
            } catch (_0x1123aa) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x3a0fd4 + ':', _0x1123aa['message']);
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
            } catch (_0x4c6fd9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x4c6fd9['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x384b4b) {
        if (backend === 'memory') {
            this['isPublic'] = _0x384b4b;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x384b4b);
            } catch (_0x3920ca) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x3920ca['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x3c3202 = await adapters[backend]['getAllCounts']();
                return _0x3c3202['isPublic'];
            } catch (_0xfebe17) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0xfebe17['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x1a5ef4) {
        const _0x3a607c = [
            'public',
            'private'
        ];
        if (!_0x3a607c['includes'](_0x1a5ef4)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x1a5ef4);
            _0x1a5ef4 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x1a5ef4;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x1a5ef4);
            } catch (_0x260337) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x260337['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x1298d6 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x1298d6 || 'private';
            } catch (_0x2060ff) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x2060ff['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x19c0db = 0x0;
        const _0x37800c = Object['keys'](this['contacts'])['length'];
        const _0x5befea = Object['keys'](this['chats'])['length'];
        let _0x1937d7 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x37c240 => {
                if (Array['isArray'](_0x37c240)) {
                    _0x19c0db += _0x37c240['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x5d5d6f => {
                if (typeof _0x5d5d6f === 'object') {
                    _0x1937d7 += Object['keys'](_0x5d5d6f)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x19c0db : 'stored\x20in\x20database',
            'contacts': _0x37800c,
            'chats': _0x5befea,
            'messageCounts': backend === 'memory' ? _0x1937d7 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x1726c0 => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x1726c0));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x557e20 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x557e20));
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
        let _0x1f08a8 = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x52f736 => {
            if (store['chats'][_0x52f736]['messages']) {
                delete store['chats'][_0x52f736]['messages'];
                _0x1f08a8++;
            }
        });
        if (_0x1f08a8 > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x1f08a8 + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0xf19f80 => {
    console['log']('[STORE]\x20Received\x20' + _0xf19f80 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x81248e) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x81248e['message']);
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
process['on']('uncaughtException', _0x270b52 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x270b52);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x5f0c5a, _0x482fe1) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x482fe1, 'reason:', _0x5f0c5a);
});
export default store;