import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x36f622 from 'fs';
import _0x0_0x4e7d15 from 'path';
import _0x0_0xb57961 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x1d9724) {
    printLog = (_0x4300b1, _0x2c15ea) => console['log']('[' + _0x4300b1['toUpperCase']() + ']\x20' + _0x2c15ea);
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
} catch (_0x0_0x3f5a43) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x1cf5f7 => {
    try {
        return _0x0_0xb57961['deflateSync'](JSON['stringify'](_0x1cf5f7));
    } catch (_0x557be5) {
        console['error']('[STORE]\x20Compression\x20error:', _0x557be5['message']);
        return Buffer['from'](JSON['stringify'](_0x1cf5f7));
    }
};
const decompress = _0x39f3f7 => {
    try {
        return JSON['parse'](_0x0_0xb57961['inflateSync'](_0x39f3f7));
    } catch (_0xec0916) {
        console['error']('[STORE]\x20Decompression\x20error:', _0xec0916['message']);
        try {
            return JSON['parse'](_0x39f3f7['toString']());
        } catch (_0x288034) {
            return null;
        }
    }
};
function slimMessage(_0x15be03) {
    return {
        'key': _0x15be03['key'],
        'message': _0x15be03['message'],
        'messageTimestamp': _0x15be03['messageTimestamp'],
        'participant': _0x15be03['participant'],
        'pushName': _0x15be03['pushName'],
        'broadcast': _0x15be03['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x21106c => console['error']('[MONGO]\x20Connection\x20error:', _0x21106c));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x576f8d, _0x1c55bb, _0x135084) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x576f8d,
                        'id': _0x1c55bb
                    }, {
                        'data': compress(_0x135084),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5834e8) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x5834e8['message']);
                }
            },
            async 'load'(_0x38cadf, _0x50a70a) {
                try {
                    const _0xcd3a57 = await Msg['findOne']({
                        'jid': _0x38cadf,
                        'id': _0x50a70a
                    });
                    return _0xcd3a57 ? decompress(_0xcd3a57['data']) : null;
                } catch (_0x3f7130) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x3f7130['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x12302e, _0x53bcce) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x12302e,
                        'userId': _0x53bcce
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x3b0a4c) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x3b0a4c['message']);
                }
            },
            async 'getCount'(_0x9e19c2, _0x39d46a) {
                try {
                    const _0x54dd17 = await MsgCount['findOne']({
                        'chatId': _0x9e19c2,
                        'userId': _0x39d46a
                    });
                    return _0x54dd17 ? _0x54dd17['count'] : 0x0;
                } catch (_0x481fb7) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x481fb7['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x102246 = await MsgCount['find']({});
                    const _0x1dae29 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x102246['forEach'](_0x50ab4e => {
                        if (!_0x1dae29['messageCount'][_0x50ab4e['chatId']]) {
                            _0x1dae29['messageCount'][_0x50ab4e['chatId']] = {};
                        }
                        _0x1dae29['messageCount'][_0x50ab4e['chatId']][_0x50ab4e['userId']] = _0x50ab4e['count'];
                    });
                    const _0x5a074c = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x5a074c)
                        _0x1dae29['isPublic'] = _0x5a074c['value'] === 'true';
                    return _0x1dae29;
                } catch (_0x2feed8) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x2feed8['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x51c066) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x51c066['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x44e6de) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x44e6de['message']);
                }
            },
            async 'setMetadata'(_0x3cf2b1, _0x2d3020) {
                try {
                    await Meta['updateOne']({ 'key': _0x3cf2b1 }, {
                        'key': _0x3cf2b1,
                        'value': _0x2d3020['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x2cc0eb) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x2cc0eb['message']);
                }
            },
            async 'getMetadata'(_0x41e4a9) {
                try {
                    const _0x28324e = await Meta['findOne']({ 'key': _0x41e4a9 });
                    return _0x28324e ? _0x28324e['value'] : null;
                } catch (_0xcc95da) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0xcc95da['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x2acb52, _0x40cfb1) {
                try {
                    await Contact['updateOne']({ 'jid': _0x2acb52 }, {
                        ..._0x40cfb1,
                        'jid': _0x2acb52,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x20b09b) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x20b09b['message']);
                }
            },
            async 'getContact'(_0x1ebadd) {
                try {
                    return await Contact['findOne']({ 'jid': _0x1ebadd });
                } catch (_0x1dd4a1) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x1dd4a1['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x2a63c1 = await Contact['find']({});
                    const _0x42deff = {};
                    _0x2a63c1['forEach'](_0x1eadf6 => {
                        _0x42deff[_0x1eadf6['jid']] = {
                            'id': _0x1eadf6['jid'],
                            'name': _0x1eadf6['name'],
                            'notify': _0x1eadf6['notify']
                        };
                    });
                    return _0x42deff;
                } catch (_0x514856) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x514856['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x205291, _0x1caa5b) {
                try {
                    await Chat['updateOne']({ 'jid': _0x205291 }, {
                        ..._0x1caa5b,
                        'jid': _0x205291,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x2f5f17) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x2f5f17['message']);
                }
            },
            async 'getChat'(_0x34ade) {
                try {
                    return await Chat['findOne']({ 'jid': _0x34ade });
                } catch (_0x3135f8) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x3135f8['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x24720c = await Chat['find']({});
                    const _0xf10520 = {};
                    _0x24720c['forEach'](_0x2bbc62 => {
                        _0xf10520[_0x2bbc62['jid']] = {
                            'id': _0x2bbc62['jid'],
                            'name': _0x2bbc62['name'],
                            'conversationTimestamp': _0x2bbc62['conversationTimestamp'],
                            'unreadCount': _0x2bbc62['unreadCount']
                        };
                    });
                    return _0xf10520;
                } catch (_0xc55bc8) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0xc55bc8['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x4f8a69) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x4f8a69 });
                } catch (_0x13ee8f) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x13ee8f['message']);
                }
            },
            async 'saveSetting'(_0x818c34, _0xad6687, _0x4ae0b8) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x818c34,
                        'key': _0xad6687
                    }, {
                        'chatId': _0x818c34,
                        'key': _0xad6687,
                        'value': _0x4ae0b8,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5d8cd4) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x5d8cd4['message']);
                }
            },
            async 'getSetting'(_0x59fc02, _0x474ad6) {
                try {
                    const _0x4d6e17 = await Setting['findOne']({
                        'chatId': _0x59fc02,
                        'key': _0x474ad6
                    });
                    return _0x4d6e17 ? _0x4d6e17['value'] : null;
                } catch (_0x478969) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x478969['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x3457a8) {
                try {
                    const _0x213125 = await Setting['find']({ 'chatId': _0x3457a8 });
                    const _0x476c16 = {};
                    _0x213125['forEach'](_0x37b2f6 => {
                        _0x476c16[_0x37b2f6['key']] = _0x37b2f6['value'];
                    });
                    return _0x476c16;
                } catch (_0x3ab019) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x3ab019['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x4e8ad0 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x4e8ad0['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x4e8ad0['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x24fe3d) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x24fe3d['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x4bfefc) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x4bfefc['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x1fdb61) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x1fdb61['message']);
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
        pool['on']('error', _0x208ec4 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x208ec4['message']);
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
                        const _0x2ae56c = await pool['connect']();
                        try {
                            await _0x2ae56c['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x2ae56c['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x2ae56c['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x2ae56c['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x2ae56c['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x2ae56c['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x2ae56c['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x2ae56c['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x2ae56c['release']();
                        }
                    } catch (_0x4c5177) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x4c5177['message']);
                        this['initPromise'] = null;
                        throw _0x4c5177;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x2790b8, _0x4ce8cc, _0x5cc925) {
                try {
                    await this['init']();
                    const _0xc4adf8 = await pool['connect']();
                    try {
                        await _0xc4adf8['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x2790b8,
                            _0x4ce8cc,
                            Date['now'](),
                            compress(_0x5cc925)
                        ]);
                    } finally {
                        _0xc4adf8['release']();
                    }
                } catch (_0x4bc831) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x4bc831['message']);
                }
            },
            async 'load'(_0x54f5ed, _0x3bc152) {
                try {
                    await this['init']();
                    const _0x28bec0 = await pool['connect']();
                    try {
                        const _0x4cbb47 = await _0x28bec0['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x54f5ed,
                            _0x3bc152
                        ]);
                        return _0x4cbb47['rows'][0x0] ? decompress(_0x4cbb47['rows'][0x0]['data']) : null;
                    } finally {
                        _0x28bec0['release']();
                    }
                } catch (_0xc4f39f) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0xc4f39f['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x306fbe, _0x1ea33d) {
                try {
                    await this['init']();
                    const _0x217e35 = await pool['connect']();
                    try {
                        await _0x217e35['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x306fbe,
                            _0x1ea33d
                        ]);
                    } finally {
                        _0x217e35['release']();
                    }
                } catch (_0x3c9bc9) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x3c9bc9['message']);
                }
            },
            async 'getCount'(_0x74a832, _0x17cfb9) {
                try {
                    await this['init']();
                    const _0x115a9f = await pool['connect']();
                    try {
                        const _0x6e45a5 = await _0x115a9f['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x74a832,
                            _0x17cfb9
                        ]);
                        return _0x6e45a5['rows'][0x0] ? _0x6e45a5['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x115a9f['release']();
                    }
                } catch (_0x56e565) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x56e565['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x8a55ad = await pool['connect']();
                    try {
                        const _0x406a74 = await _0x8a55ad['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x3f74cc = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x406a74['rows']['forEach'](_0x297cae => {
                            if (!_0x3f74cc['messageCount'][_0x297cae['chat_id']]) {
                                _0x3f74cc['messageCount'][_0x297cae['chat_id']] = {};
                            }
                            _0x3f74cc['messageCount'][_0x297cae['chat_id']][_0x297cae['user_id']] = _0x297cae['count'];
                        });
                        const _0x286136 = await _0x8a55ad['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x286136['rows'][0x0])
                            _0x3f74cc['isPublic'] = _0x286136['rows'][0x0]['value'] === 'true';
                        return _0x3f74cc;
                    } finally {
                        _0x8a55ad['release']();
                    }
                } catch (_0x2127d2) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x2127d2['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x4f57a9) {
                try {
                    await this['init']();
                    const _0x5da90d = await pool['connect']();
                    try {
                        await _0x5da90d['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x4f57a9['toString']()]);
                    } finally {
                        _0x5da90d['release']();
                    }
                } catch (_0x17c6e8) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x17c6e8['message']);
                }
            },
            async 'setMetadata'(_0x58d69f, _0x3ae45d) {
                try {
                    await this['init']();
                    const _0x4248b4 = await pool['connect']();
                    try {
                        await _0x4248b4['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x58d69f,
                            _0x3ae45d['toString']()
                        ]);
                    } finally {
                        _0x4248b4['release']();
                    }
                } catch (_0x44abde) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x44abde['message']);
                }
            },
            async 'getMetadata'(_0x4ad550) {
                try {
                    await this['init']();
                    const _0x532d89 = await pool['connect']();
                    try {
                        const _0x37621 = await _0x532d89['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x4ad550]);
                        return _0x37621['rows'][0x0] ? _0x37621['rows'][0x0]['value'] : null;
                    } finally {
                        _0x532d89['release']();
                    }
                } catch (_0x7fadab) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x7fadab['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xf139d4, _0x5315ed) {
                try {
                    await this['init']();
                    const _0x3c7214 = await pool['connect']();
                    try {
                        await _0x3c7214['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0xf139d4,
                            _0x5315ed['name'] || '',
                            _0x5315ed['notify'] || '',
                            _0x5315ed['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x3c7214['release']();
                    }
                } catch (_0x2e1134) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x2e1134['message']);
                }
            },
            async 'getContact'(_0x166166) {
                try {
                    await this['init']();
                    const _0x555f30 = await pool['connect']();
                    try {
                        const _0x2c8b9b = await _0x555f30['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x166166]);
                        return _0x2c8b9b['rows'][0x0] || null;
                    } finally {
                        _0x555f30['release']();
                    }
                } catch (_0x30069a) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x30069a['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x5247ae = await pool['connect']();
                    try {
                        const _0x37aaa3 = await _0x5247ae['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x322920 = {};
                        _0x37aaa3['rows']['forEach'](_0x3d8dda => {
                            _0x322920[_0x3d8dda['jid']] = {
                                'id': _0x3d8dda['jid'],
                                'name': _0x3d8dda['name'],
                                'notify': _0x3d8dda['notify']
                            };
                        });
                        return _0x322920;
                    } finally {
                        _0x5247ae['release']();
                    }
                } catch (_0x2665f6) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x2665f6['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x255cf5, _0x3f140e) {
                try {
                    await this['init']();
                    const _0x5adb79 = await pool['connect']();
                    try {
                        await _0x5adb79['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x255cf5,
                            _0x3f140e['name'] || '',
                            _0x3f140e['conversationTimestamp'] || 0x0,
                            _0x3f140e['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x5adb79['release']();
                    }
                } catch (_0x282bbd) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x282bbd['message']);
                }
            },
            async 'getChat'(_0x565f59) {
                try {
                    await this['init']();
                    const _0x5adab9 = await pool['connect']();
                    try {
                        const _0x303efa = await _0x5adab9['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x565f59]);
                        return _0x303efa['rows'][0x0] || null;
                    } finally {
                        _0x5adab9['release']();
                    }
                } catch (_0x48fc22) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x48fc22['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x5797c8 = await pool['connect']();
                    try {
                        const _0x119b18 = await _0x5797c8['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x28ddc5 = {};
                        _0x119b18['rows']['forEach'](_0x32a398 => {
                            _0x28ddc5[_0x32a398['jid']] = {
                                'id': _0x32a398['jid'],
                                'name': _0x32a398['name'],
                                'conversationTimestamp': _0x32a398['conversation_timestamp'],
                                'unreadCount': _0x32a398['unread_count']
                            };
                        });
                        return _0x28ddc5;
                    } finally {
                        _0x5797c8['release']();
                    }
                } catch (_0x3670e4) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x3670e4['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x3b6f3b) {
                try {
                    await this['init']();
                    const _0x35b378 = await pool['connect']();
                    try {
                        await _0x35b378['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x3b6f3b]);
                    } finally {
                        _0x35b378['release']();
                    }
                } catch (_0x574838) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x574838['message']);
                }
            },
            async 'saveSetting'(_0x366ad8, _0x599db7, _0x374a09) {
                try {
                    await this['init']();
                    const _0x5b9b80 = await pool['connect']();
                    try {
                        await _0x5b9b80['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x366ad8,
                            _0x599db7,
                            JSON['stringify'](_0x374a09),
                            Date['now']()
                        ]);
                    } finally {
                        _0x5b9b80['release']();
                    }
                } catch (_0xa3706a) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0xa3706a['message']);
                }
            },
            async 'getSetting'(_0x39577b, _0x403eef) {
                try {
                    await this['init']();
                    const _0x2ec95d = await pool['connect']();
                    try {
                        const _0x4a7634 = await _0x2ec95d['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x39577b,
                            _0x403eef
                        ]);
                        return _0x4a7634['rows'][0x0] ? JSON['parse'](_0x4a7634['rows'][0x0]['value']) : null;
                    } finally {
                        _0x2ec95d['release']();
                    }
                } catch (_0x4142e0) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x4142e0['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x2b908c) {
                try {
                    await this['init']();
                    const _0x40a421 = await pool['connect']();
                    try {
                        const _0x1be169 = await _0x40a421['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x2b908c]);
                        const _0x55eec8 = {};
                        _0x1be169['rows']['forEach'](_0x7726a5 => {
                            _0x55eec8[_0x7726a5['key']] = JSON['parse'](_0x7726a5['value']);
                        });
                        return _0x55eec8;
                    } finally {
                        _0x40a421['release']();
                    }
                } catch (_0x55d840) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x55d840['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x2dbe50 = await pool['connect']();
                    try {
                        const _0x5e7149 = await _0x2dbe50['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x5e7149['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x5e7149['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x2dbe50['release']();
                    }
                } catch (_0x1d6b28) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x1d6b28['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x57b851) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x57b851['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x28283a) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x28283a['message']);
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
                    } catch (_0x497fc6) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x497fc6['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x497fc6;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x4f04f8, _0x472b49, _0xb62f65) {
                try {
                    const _0x47441c = await this['getConn']();
                    await _0x47441c['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x4f04f8,
                        _0x472b49,
                        Date['now'](),
                        compress(_0xb62f65)
                    ]);
                } catch (_0x23becf) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x23becf['message']);
                }
            },
            async 'load'(_0x39684e, _0x181549) {
                try {
                    const _0x3d5636 = await this['getConn']();
                    const [_0xf6fe5a] = await _0x3d5636['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x39684e,
                        _0x181549
                    ]);
                    return _0xf6fe5a[0x0] ? decompress(_0xf6fe5a[0x0]['data']) : null;
                } catch (_0x32a15c) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x32a15c['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x27850c, _0x3c90f4) {
                try {
                    const _0x81e1c8 = await this['getConn']();
                    await _0x81e1c8['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x27850c,
                        _0x3c90f4
                    ]);
                } catch (_0x40e4eb) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x40e4eb['message']);
                }
            },
            async 'getCount'(_0x5f2e6c, _0x22f340) {
                try {
                    const _0x5bff6e = await this['getConn']();
                    const [_0x1c118c] = await _0x5bff6e['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x5f2e6c,
                        _0x22f340
                    ]);
                    return _0x1c118c[0x0] ? _0x1c118c[0x0]['count'] : 0x0;
                } catch (_0x10e33b) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x10e33b['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x34a0a4 = await this['getConn']();
                    const [_0x4fd183] = await _0x34a0a4['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x5816de = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x4fd183['forEach'](_0x81a1ce => {
                        if (!_0x5816de['messageCount'][_0x81a1ce['chat_id']]) {
                            _0x5816de['messageCount'][_0x81a1ce['chat_id']] = {};
                        }
                        _0x5816de['messageCount'][_0x81a1ce['chat_id']][_0x81a1ce['user_id']] = _0x81a1ce['count'];
                    });
                    const [_0x211e44] = await _0x34a0a4['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x211e44[0x0])
                        _0x5816de['isPublic'] = _0x211e44[0x0]['value'] === 'true';
                    return _0x5816de;
                } catch (_0x493880) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x493880['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x9aad84) {
                try {
                    const _0x3965bc = await this['getConn']();
                    await _0x3965bc['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x9aad84['toString']()]);
                } catch (_0x18d118) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x18d118['message']);
                }
            },
            async 'setMetadata'(_0x4a6cf2, _0x1e4c7d) {
                try {
                    const _0x36ec5b = await this['getConn']();
                    await _0x36ec5b['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x4a6cf2,
                        _0x1e4c7d['toString']()
                    ]);
                } catch (_0x265357) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x265357['message']);
                }
            },
            async 'getMetadata'(_0x4e76b4) {
                try {
                    const _0x44a0df = await this['getConn']();
                    const [_0xfd05c1] = await _0x44a0df['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x4e76b4]);
                    return _0xfd05c1[0x0] ? _0xfd05c1[0x0]['value'] : null;
                } catch (_0xefda6b) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0xefda6b['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x51c635, _0x92a34c) {
                try {
                    const _0x19f766 = await this['getConn']();
                    await _0x19f766['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x51c635,
                        _0x92a34c['name'] || '',
                        _0x92a34c['notify'] || '',
                        _0x92a34c['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x351b08) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x351b08['message']);
                }
            },
            async 'getContact'(_0x1da38f) {
                try {
                    const _0x20d9d5 = await this['getConn']();
                    const [_0x33e7e7] = await _0x20d9d5['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x1da38f]);
                    return _0x33e7e7[0x0] || null;
                } catch (_0xdef93) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0xdef93['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x299718 = await this['getConn']();
                    const [_0x394fed] = await _0x299718['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0xa0e4ef = {};
                    _0x394fed['forEach'](_0x1f4990 => {
                        _0xa0e4ef[_0x1f4990['jid']] = {
                            'id': _0x1f4990['jid'],
                            'name': _0x1f4990['name'],
                            'notify': _0x1f4990['notify']
                        };
                    });
                    return _0xa0e4ef;
                } catch (_0x50521e) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x50521e['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x282285, _0x384a2c) {
                try {
                    const _0x3155f6 = await this['getConn']();
                    await _0x3155f6['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x282285,
                        _0x384a2c['name'] || '',
                        _0x384a2c['conversationTimestamp'] || 0x0,
                        _0x384a2c['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x4764a4) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x4764a4['message']);
                }
            },
            async 'getChat'(_0xfbea23) {
                try {
                    const _0x41f678 = await this['getConn']();
                    const [_0x38d661] = await _0x41f678['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0xfbea23]);
                    return _0x38d661[0x0] || null;
                } catch (_0x3402ed) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x3402ed['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0xeee66b = await this['getConn']();
                    const [_0x44e403] = await _0xeee66b['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x475916 = {};
                    _0x44e403['forEach'](_0x2c99de => {
                        _0x475916[_0x2c99de['jid']] = {
                            'id': _0x2c99de['jid'],
                            'name': _0x2c99de['name'],
                            'conversationTimestamp': _0x2c99de['conversation_timestamp'],
                            'unreadCount': _0x2c99de['unread_count']
                        };
                    });
                    return _0x475916;
                } catch (_0x1a8747) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x1a8747['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x3d8fd7) {
                try {
                    const _0x9c8019 = await this['getConn']();
                    await _0x9c8019['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x3d8fd7]);
                } catch (_0x14503b) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x14503b['message']);
                }
            },
            async 'saveSetting'(_0xb71ad, _0x1cbdab, _0x25dfc4) {
                try {
                    const _0x570ea0 = await this['getConn']();
                    await _0x570ea0['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0xb71ad,
                        _0x1cbdab,
                        JSON['stringify'](_0x25dfc4),
                        Date['now']()
                    ]);
                } catch (_0x44b8a3) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x44b8a3['message']);
                }
            },
            async 'getSetting'(_0xab5a97, _0x3bf7b5) {
                try {
                    const _0x21ae95 = await this['getConn']();
                    const [_0x464d32] = await _0x21ae95['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0xab5a97,
                        _0x3bf7b5
                    ]);
                    return _0x464d32[0x0] ? JSON['parse'](_0x464d32[0x0]['value']) : null;
                } catch (_0x1a6602) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x1a6602['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x536588) {
                try {
                    const _0x26f943 = await this['getConn']();
                    const [_0x296fe6] = await _0x26f943['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x536588]);
                    const _0xea40c4 = {};
                    _0x296fe6['forEach'](_0x2a4f20 => {
                        _0xea40c4[_0x2a4f20['key']] = JSON['parse'](_0x2a4f20['value']);
                    });
                    return _0xea40c4;
                } catch (_0x15f3fa) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x15f3fa['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x3ce9d9 = await this['getConn']();
                    const [_0x291358] = await _0x3ce9d9['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x291358['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x291358['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0xf3be7d) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0xf3be7d['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x4ee3e9) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x4ee3e9['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x177da9) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x177da9['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x4e7d15['dirname'](SQLITE_URL);
        if (!_0x0_0x36f622['existsSync'](dir))
            _0x0_0x36f622['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x3600ab, _0x13bfb8, _0x403bfd) {
                try {
                    saveStmt['run'](_0x3600ab, _0x13bfb8, Date['now'](), compress(_0x403bfd));
                    const {count: _0xd91bd4} = countStmt['get'](_0x3600ab);
                    if (_0xd91bd4 > MESSAGE_LIMITS['sqlite']) {
                        const _0x1f0cde = _0xd91bd4 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x3600ab, _0x3600ab, _0x1f0cde);
                    }
                } catch (_0x3bbb8c) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x3bbb8c['message']);
                }
            },
            'load'(_0x3e6ccf, _0x45c6d1) {
                try {
                    const _0x5a4b83 = loadStmt['get'](_0x3e6ccf, _0x45c6d1);
                    return _0x5a4b83 ? decompress(_0x5a4b83['data']) : null;
                } catch (_0x3f3b7d) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x3f3b7d['message']);
                    return null;
                }
            },
            'incrementCount'(_0x13cf2f, _0x15da14) {
                try {
                    incrementCountStmt['run'](_0x13cf2f, _0x15da14);
                } catch (_0x4a2e06) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x4a2e06['message']);
                }
            },
            'getCount'(_0x2f8551, _0x121926) {
                try {
                    const _0x468252 = getCountStmt['get'](_0x2f8551, _0x121926);
                    return _0x468252 ? _0x468252['count'] : 0x0;
                } catch (_0x44ac61) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x44ac61['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x7dad3 = getAllCountsStmt['all']();
                    const _0x2ae6a1 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x7dad3['forEach'](_0x3802cb => {
                        if (!_0x2ae6a1['messageCount'][_0x3802cb['chat_id']]) {
                            _0x2ae6a1['messageCount'][_0x3802cb['chat_id']] = {};
                        }
                        _0x2ae6a1['messageCount'][_0x3802cb['chat_id']][_0x3802cb['user_id']] = _0x3802cb['count'];
                    });
                    const _0x50401c = getMetaStmt['get']();
                    if (_0x50401c)
                        _0x2ae6a1['isPublic'] = _0x50401c['value'] === 'true';
                    return _0x2ae6a1;
                } catch (_0x280d2f) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x280d2f['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x355c86) {
                try {
                    setMetaStmt['run'](_0x355c86['toString']());
                } catch (_0x470ea5) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x470ea5['message']);
                }
            },
            'setMetadata'(_0x3f6f8e, _0x5e6131) {
                try {
                    setMetadataStmt['run'](_0x3f6f8e, _0x5e6131['toString']());
                } catch (_0x27c54c) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x27c54c['message']);
                }
            },
            'getMetadata'(_0x1f59ee) {
                try {
                    const _0x2a39c1 = getMetadataStmt['get'](_0x1f59ee);
                    return _0x2a39c1 ? _0x2a39c1['value'] : null;
                } catch (_0x1f014c) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x1f014c['message']);
                    return null;
                }
            },
            'saveContact'(_0x5716ef, _0x46efec) {
                try {
                    saveContactStmt['run'](_0x5716ef, _0x46efec['name'] || '', _0x46efec['notify'] || '', _0x46efec['verifiedName'] || '', Date['now']());
                } catch (_0x1dc81c) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x1dc81c['message']);
                }
            },
            'getContact'(_0x5b4a0c) {
                try {
                    return getContactStmt['get'](_0x5b4a0c) || null;
                } catch (_0x2b8e2c) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x2b8e2c['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x257356 = getAllContactsStmt['all']();
                    const _0x4ab9bd = {};
                    _0x257356['forEach'](_0x16e8b4 => {
                        _0x4ab9bd[_0x16e8b4['jid']] = {
                            'id': _0x16e8b4['jid'],
                            'name': _0x16e8b4['name'],
                            'notify': _0x16e8b4['notify']
                        };
                    });
                    return _0x4ab9bd;
                } catch (_0x583f56) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x583f56['message']);
                    return {};
                }
            },
            'saveChat'(_0x1f556c, _0x537c64) {
                try {
                    saveChatStmt['run'](_0x1f556c, _0x537c64['name'] || '', _0x537c64['conversationTimestamp'] || 0x0, _0x537c64['unreadCount'] || 0x0, Date['now']());
                } catch (_0x433731) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x433731['message']);
                }
            },
            'getChat'(_0x32c24c) {
                try {
                    return getChatStmt['get'](_0x32c24c) || null;
                } catch (_0x29ae21) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x29ae21['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x34be69 = getAllChatsStmt['all']();
                    const _0x366208 = {};
                    _0x34be69['forEach'](_0x9393e4 => {
                        _0x366208[_0x9393e4['jid']] = {
                            'id': _0x9393e4['jid'],
                            'name': _0x9393e4['name'],
                            'conversationTimestamp': _0x9393e4['conversation_timestamp'],
                            'unreadCount': _0x9393e4['unread_count']
                        };
                    });
                    return _0x366208;
                } catch (_0x19261d) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x19261d['message']);
                    return {};
                }
            },
            'deleteChat'(_0x53e87f) {
                try {
                    deleteChatStmt['run'](_0x53e87f);
                } catch (_0x5585d4) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x5585d4['message']);
                }
            },
            'saveSetting'(_0xe6be93, _0x36e5bc, _0x2427c6) {
                try {
                    saveSettingStmt['run'](_0xe6be93, _0x36e5bc, JSON['stringify'](_0x2427c6), Date['now']());
                } catch (_0x53ec90) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x53ec90['message']);
                }
            },
            'getSetting'(_0x86b55, _0x500ae0) {
                try {
                    const _0x1b49f3 = getSettingStmt['get'](_0x86b55, _0x500ae0);
                    return _0x1b49f3 ? JSON['parse'](_0x1b49f3['value']) : null;
                } catch (_0x12de7c) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x12de7c['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x4b8eac) {
                try {
                    const _0x2a5015 = getAllSettingsStmt['all'](_0x4b8eac);
                    const _0xe00f5c = {};
                    _0x2a5015['forEach'](_0x419def => {
                        _0xe00f5c[_0x419def['key']] = JSON['parse'](_0x419def['value']);
                    });
                    return _0xe00f5c;
                } catch (_0x13e725) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x13e725['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x214f6a = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x214f6a['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x214f6a['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x4a91eb) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x4a91eb['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x5c44a1) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x5c44a1['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x542fed) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x542fed['message']);
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
    async 'readFromFile'(_0x34869c = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x188e13 = await adapters[backend]['getAllContacts']();
                const _0x3737b7 = await adapters[backend]['getAllChats']();
                const _0x4451b5 = await this['getBotMode']();
                this['contacts'] = _0x188e13;
                this['chats'] = _0x3737b7;
                this['botMode'] = _0x4451b5;
            } else {
                if (_0x0_0x36f622['existsSync'](_0x34869c)) {
                    const _0x551834 = JSON['parse'](_0x0_0x36f622['readFileSync'](_0x34869c, 'utf-8'));
                    this['contacts'] = _0x551834['contacts'] || {};
                    this['chats'] = _0x551834['chats'] || {};
                    this['botMode'] = _0x551834['botMode'] || 'private';
                    this['messages'] = _0x551834['messages'] || {};
                    this['isPublic'] = _0x551834['isPublic'] !== undefined ? _0x551834['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x4241a9) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x4241a9['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x5e7bcc = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x11f40b = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x36f622['writeFileSync'](_0x5e7bcc, JSON['stringify'](_0x11f40b, null, 0x2));
        } catch (_0x31472c) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x31472c['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x36f622['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x296df8 = JSON['parse'](_0x0_0x36f622['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x296df8['messageCount'] || _0x296df8;
                    this['isPublic'] = typeof _0x296df8['isPublic'] === 'boolean' ? _0x296df8['isPublic'] : ![];
                }
            } catch (_0x235e21) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x235e21['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x449e44 = _0x0_0x4e7d15['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x36f622['existsSync'](_0x449e44))
                    _0x0_0x36f622['mkdirSync'](_0x449e44, { 'recursive': !![] });
                const _0x5b0bff = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x36f622['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x5b0bff, null, 0x2));
            } catch (_0x2097f0) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x2097f0['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x1b8e3a => {
                if (typeof this['messages'][_0x1b8e3a] === 'object' && !Array['isArray'](this['messages'][_0x1b8e3a])) {
                    const _0x3c456b = Object['values'](this['messages'][_0x1b8e3a]);
                    this['messages'][_0x1b8e3a] = _0x3c456b['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x1b8e3a])) {
                    if (this['messages'][_0x1b8e3a]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x1b8e3a] = this['messages'][_0x1b8e3a]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x2b1200 => {
                if (this['chats'][_0x2b1200]['messages']) {
                    delete this['chats'][_0x2b1200]['messages'];
                }
            });
        }
    },
    'bind'(_0x58caeb) {
        _0x58caeb['on']('messages.upsert', async ({messages: _0x1421bb}) => {
            for (const _0x2a3403 of _0x1421bb) {
                if (!_0x2a3403['key']?.['remoteJid'])
                    continue;
                const _0x1cb35a = _0x2a3403['key']['remoteJid'];
                const _0x5e1963 = slimMessage(_0x2a3403);
                if (backend === 'memory') {
                    this['messages'][_0x1cb35a] = this['messages'][_0x1cb35a] || [];
                    this['messages'][_0x1cb35a]['push'](_0x5e1963);
                    if (this['messages'][_0x1cb35a]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x1cb35a] = this['messages'][_0x1cb35a]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x1cb35a, _0x2a3403['key']['id'], _0x5e1963);
                    } catch (_0x1534bb) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x2a3403['key']['id'] + ':', _0x1534bb['message']);
                    }
                }
            }
        });
        _0x58caeb['on']('contacts.update', async _0x344e96 => {
            for (const _0x31bee5 of _0x344e96) {
                if (_0x31bee5['id']) {
                    const _0x24206a = {
                        'id': _0x31bee5['id'],
                        'name': _0x31bee5['notify'] || _0x31bee5['name'] || _0x31bee5['verifiedName'] || '',
                        'notify': _0x31bee5['notify'],
                        'verifiedName': _0x31bee5['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x31bee5['id']] = _0x24206a;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x31bee5['id'], _0x24206a);
                        } catch (_0x550445) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x550445['message']);
                        }
                    }
                }
            }
        });
        _0x58caeb['on']('contacts.set', async _0x5df764 => {
            for (const _0x3a8f52 of _0x5df764) {
                if (_0x3a8f52['id']) {
                    const _0xca8e6b = {
                        'id': _0x3a8f52['id'],
                        'name': _0x3a8f52['notify'] || _0x3a8f52['name'] || _0x3a8f52['verifiedName'] || '',
                        'notify': _0x3a8f52['notify'],
                        'verifiedName': _0x3a8f52['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x3a8f52['id']] = _0xca8e6b;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x3a8f52['id'], _0xca8e6b);
                        } catch (_0x21a881) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x21a881['message']);
                        }
                    }
                }
            }
        });
        _0x58caeb['on']('chats.set', async _0x507c17 => {
            for (const _0x3e4e7a of _0x507c17) {
                if (_0x3e4e7a['id']) {
                    const _0x316bf5 = {
                        'id': _0x3e4e7a['id'],
                        'name': _0x3e4e7a['name'] || _0x3e4e7a['subject'] || '',
                        'conversationTimestamp': _0x3e4e7a['conversationTimestamp'],
                        'unreadCount': _0x3e4e7a['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x3e4e7a['id']] = _0x316bf5;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x3e4e7a['id'], _0x316bf5);
                        } catch (_0x254234) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x254234['message']);
                        }
                    }
                }
            }
        });
        _0x58caeb['on']('chats.update', async _0x1c4883 => {
            for (const _0x4a54e9 of _0x1c4883) {
                if (_0x4a54e9['id']) {
                    if (backend === 'memory') {
                        const _0x153f00 = this['chats'][_0x4a54e9['id']] || {};
                        this['chats'][_0x4a54e9['id']] = {
                            'id': _0x4a54e9['id'],
                            'name': _0x4a54e9['name'] || _0x4a54e9['subject'] || _0x153f00['name'] || '',
                            'conversationTimestamp': _0x4a54e9['conversationTimestamp'] || _0x153f00['conversationTimestamp'],
                            'unreadCount': _0x4a54e9['unreadCount'] !== undefined ? _0x4a54e9['unreadCount'] : _0x153f00['unreadCount']
                        };
                    } else {
                        try {
                            const _0x3318cf = await adapters[backend]['getChat'](_0x4a54e9['id']) || {};
                            const _0x963fb7 = {
                                'id': _0x4a54e9['id'],
                                'name': _0x4a54e9['name'] || _0x4a54e9['subject'] || _0x3318cf['name'] || '',
                                'conversationTimestamp': _0x4a54e9['conversationTimestamp'] || _0x3318cf['conversation_timestamp'],
                                'unreadCount': _0x4a54e9['unreadCount'] !== undefined ? _0x4a54e9['unreadCount'] : _0x3318cf['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x4a54e9['id'], _0x963fb7);
                        } catch (_0x55b256) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x55b256['message']);
                        }
                    }
                }
            }
        });
        _0x58caeb['on']('chats.delete', async _0x4183aa => {
            for (const _0x4e44d2 of _0x4183aa) {
                if (backend === 'memory') {
                    delete this['chats'][_0x4e44d2];
                    delete this['messages'][_0x4e44d2];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x4e44d2);
                    } catch (_0x3ee27b) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x3ee27b['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x57c741, _0x19c388) {
        if (backend === 'memory') {
            const _0x4da4ec = this['messages'][_0x57c741]?.['find'](_0x5c69f9 => _0x5c69f9['key']['id'] === _0x19c388) || null;
            return _0x4da4ec;
        } else {
            try {
                return await adapters[backend]['load'](_0x57c741, _0x19c388);
            } catch (_0x294979) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x19c388 + ':', _0x294979['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x45abcc, _0x4397e7, _0x2b8690) {
        if (backend === 'memory') {
            const _0x602245 = './data';
            if (!_0x0_0x36f622['existsSync'](_0x602245))
                _0x0_0x36f622['mkdirSync'](_0x602245, { 'recursive': !![] });
            const _0x3527a4 = _0x0_0x4e7d15['join'](_0x602245, _0x4397e7 + '.json');
            try {
                _0x0_0x36f622['writeFileSync'](_0x3527a4, JSON['stringify'](_0x2b8690, null, 0x2));
            } catch (_0x2da74b) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x4397e7 + ':', _0x2da74b['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x45abcc, _0x4397e7, _0x2b8690);
            } catch (_0x304cbe) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x4397e7 + ':', _0x304cbe['message']);
            }
        }
    },
    async 'getSetting'(_0x463beb, _0x2b88da) {
        if (backend === 'memory') {
            const _0x546a2e = './data';
            const _0x35290f = _0x0_0x4e7d15['join'](_0x546a2e, _0x2b88da + '.json');
            try {
                if (_0x0_0x36f622['existsSync'](_0x35290f)) {
                    const _0x3a8bfe = JSON['parse'](_0x0_0x36f622['readFileSync'](_0x35290f, 'utf-8'));
                    if (_0x3a8bfe['enabled'] !== undefined)
                        return _0x3a8bfe;
                    if (_0x3a8bfe[_0x463beb] !== undefined)
                        return _0x3a8bfe[_0x463beb];
                    return null;
                }
                return null;
            } catch (_0x9eafe7) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2b88da + ':', _0x9eafe7['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x463beb, _0x2b88da);
            } catch (_0x30862d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2b88da + ':', _0x30862d['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x2b13af) {
        if (backend === 'memory') {
            const _0xa6c2a4 = './data';
            const _0x333336 = {};
            try {
                if (_0x0_0x36f622['existsSync'](_0xa6c2a4)) {
                    const _0xbae73 = _0x0_0x36f622['readdirSync'](_0xa6c2a4)['filter'](_0x21026f => _0x21026f['endsWith']('.json'));
                    for (const _0x8bebfb of _0xbae73) {
                        const _0x198de4 = _0x0_0x4e7d15['basename'](_0x8bebfb, '.json');
                        if (_0x198de4 === 'messageCount' || _0x198de4 === 'owner')
                            continue;
                        const _0xb25ab7 = _0x0_0x4e7d15['join'](_0xa6c2a4, _0x8bebfb);
                        const _0x194a43 = JSON['parse'](_0x0_0x36f622['readFileSync'](_0xb25ab7, 'utf-8'));
                        if (_0x194a43[_0x2b13af]) {
                            _0x333336[_0x198de4] = _0x194a43[_0x2b13af];
                        }
                    }
                }
                return _0x333336;
            } catch (_0x1174a7) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x1174a7['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x2b13af);
            } catch (_0x2c5ac7) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x2c5ac7['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x3ea4e1) {
        const _0x1941c9 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x1941c9['includes'](_0x3ea4e1)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x3ea4e1 + ',\x20defaulting\x20to\x20private');
            _0x3ea4e1 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x3ea4e1;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x3ea4e1);
            } catch (_0x358080) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x358080['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x280a19 = await adapters[backend]['getMetadata']('botMode');
                return _0x280a19 || 'private';
            } catch (_0x48c2a9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x48c2a9['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x1be15a, _0x989951, _0x4f5edb) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x1be15a]) {
                this['messageCount'][_0x1be15a] = {};
            }
            if (!this['messageCount'][_0x1be15a][_0x989951]) {
                this['messageCount'][_0x1be15a][_0x989951] = 0x0;
            }
            this['messageCount'][_0x1be15a][_0x989951]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x1be15a, _0x989951);
            } catch (_0x26219b) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x989951 + ':', _0x26219b['message']);
            }
        }
    },
    async 'getMessageCount'(_0x22a889, _0xa5bb68) {
        if (backend === 'memory') {
            return this['messageCount'][_0x22a889]?.[_0xa5bb68] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x22a889, _0xa5bb68);
            } catch (_0x3fbd96) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0xa5bb68 + ':', _0x3fbd96['message']);
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
            } catch (_0xb303a0) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0xb303a0['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x167d49) {
        if (backend === 'memory') {
            this['isPublic'] = _0x167d49;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x167d49);
            } catch (_0x2cdaae) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x2cdaae['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x442c6f = await adapters[backend]['getAllCounts']();
                return _0x442c6f['isPublic'];
            } catch (_0x230108) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x230108['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x1d0d04) {
        const _0x2ae1f4 = [
            'public',
            'private'
        ];
        if (!_0x2ae1f4['includes'](_0x1d0d04)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x1d0d04);
            _0x1d0d04 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x1d0d04;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x1d0d04);
            } catch (_0x5438e8) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x5438e8['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x224abb = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x224abb || 'private';
            } catch (_0x2edd71) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x2edd71['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x2297e8 = 0x0;
        const _0x52bf51 = Object['keys'](this['contacts'])['length'];
        const _0x4e8ffa = Object['keys'](this['chats'])['length'];
        let _0x4c4d11 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x1dcfe6 => {
                if (Array['isArray'](_0x1dcfe6)) {
                    _0x2297e8 += _0x1dcfe6['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x2145dc => {
                if (typeof _0x2145dc === 'object') {
                    _0x4c4d11 += Object['keys'](_0x2145dc)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x2297e8 : 'stored\x20in\x20database',
            'contacts': _0x52bf51,
            'chats': _0x4e8ffa,
            'messageCounts': backend === 'memory' ? _0x4c4d11 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x1f931a => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x1f931a));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x6afadd => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x6afadd));
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
        let _0x4c3fcc = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x37d69f => {
            if (store['chats'][_0x37d69f]['messages']) {
                delete store['chats'][_0x37d69f]['messages'];
                _0x4c3fcc++;
            }
        });
        if (_0x4c3fcc > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x4c3fcc + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x530513 => {
    console['log']('[STORE]\x20Received\x20' + _0x530513 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x18113a) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x18113a['message']);
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
process['on']('uncaughtException', _0x5593c0 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x5593c0);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x18af58, _0x30dceb) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x30dceb, 'reason:', _0x18af58);
});
export default store;