import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x5b324d from 'fs';
import _0x0_0x19bbc0 from 'path';
import _0x0_0x5ed340 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x49856f) {
    printLog = (_0x46ca1c, _0x3cbadd) => console['log']('[' + _0x46ca1c['toUpperCase']() + ']\x20' + _0x3cbadd);
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
} catch (_0x0_0x1a1a85) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x28572a => {
    try {
        return _0x0_0x5ed340['deflateSync'](JSON['stringify'](_0x28572a));
    } catch (_0x5c4fb7) {
        console['error']('[STORE]\x20Compression\x20error:', _0x5c4fb7['message']);
        return Buffer['from'](JSON['stringify'](_0x28572a));
    }
};
const decompress = _0x4c00ce => {
    try {
        return JSON['parse'](_0x0_0x5ed340['inflateSync'](_0x4c00ce));
    } catch (_0x3698a6) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x3698a6['message']);
        try {
            return JSON['parse'](_0x4c00ce['toString']());
        } catch (_0x9eb071) {
            return null;
        }
    }
};
function slimMessage(_0x52e73b) {
    return {
        'key': _0x52e73b['key'],
        'message': _0x52e73b['message'],
        'messageTimestamp': _0x52e73b['messageTimestamp'],
        'participant': _0x52e73b['participant'],
        'pushName': _0x52e73b['pushName'],
        'broadcast': _0x52e73b['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x7c8c43 => console['error']('[MONGO]\x20Connection\x20error:', _0x7c8c43));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x5b9573, _0x58f30b, _0x3a29ef) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x5b9573,
                        'id': _0x58f30b
                    }, {
                        'data': compress(_0x3a29ef),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x9ac114) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x9ac114['message']);
                }
            },
            async 'load'(_0x3c4cca, _0x59b1b7) {
                try {
                    const _0x16c43c = await Msg['findOne']({
                        'jid': _0x3c4cca,
                        'id': _0x59b1b7
                    });
                    return _0x16c43c ? decompress(_0x16c43c['data']) : null;
                } catch (_0x6e83d2) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x6e83d2['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x23e77a, _0x18e69f) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x23e77a,
                        'userId': _0x18e69f
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x5abbbb) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x5abbbb['message']);
                }
            },
            async 'getCount'(_0x2d2832, _0x40a60e) {
                try {
                    const _0x168ee5 = await MsgCount['findOne']({
                        'chatId': _0x2d2832,
                        'userId': _0x40a60e
                    });
                    return _0x168ee5 ? _0x168ee5['count'] : 0x0;
                } catch (_0x2f42a4) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x2f42a4['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x133b92 = await MsgCount['find']({});
                    const _0x3d0ccb = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x133b92['forEach'](_0x34b6ac => {
                        if (!_0x3d0ccb['messageCount'][_0x34b6ac['chatId']]) {
                            _0x3d0ccb['messageCount'][_0x34b6ac['chatId']] = {};
                        }
                        _0x3d0ccb['messageCount'][_0x34b6ac['chatId']][_0x34b6ac['userId']] = _0x34b6ac['count'];
                    });
                    const _0x2d3918 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x2d3918)
                        _0x3d0ccb['isPublic'] = _0x2d3918['value'] === 'true';
                    return _0x3d0ccb;
                } catch (_0x372444) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x372444['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3fd3f9) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x3fd3f9['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x426e21) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x426e21['message']);
                }
            },
            async 'setMetadata'(_0x4fb710, _0x467d09) {
                try {
                    await Meta['updateOne']({ 'key': _0x4fb710 }, {
                        'key': _0x4fb710,
                        'value': _0x467d09['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x29fef2) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x29fef2['message']);
                }
            },
            async 'getMetadata'(_0x58dc6d) {
                try {
                    const _0x3831cb = await Meta['findOne']({ 'key': _0x58dc6d });
                    return _0x3831cb ? _0x3831cb['value'] : null;
                } catch (_0x4431bd) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x4431bd['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x486eb8, _0x28507e) {
                try {
                    await Contact['updateOne']({ 'jid': _0x486eb8 }, {
                        ..._0x28507e,
                        'jid': _0x486eb8,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x39cc66) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x39cc66['message']);
                }
            },
            async 'getContact'(_0x46030a) {
                try {
                    return await Contact['findOne']({ 'jid': _0x46030a });
                } catch (_0x4349a5) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x4349a5['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x1a7b05 = await Contact['find']({});
                    const _0x188648 = {};
                    _0x1a7b05['forEach'](_0x3a0f3b => {
                        _0x188648[_0x3a0f3b['jid']] = {
                            'id': _0x3a0f3b['jid'],
                            'name': _0x3a0f3b['name'],
                            'notify': _0x3a0f3b['notify']
                        };
                    });
                    return _0x188648;
                } catch (_0x2a49de) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x2a49de['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x2d20d9, _0x4c8ec0) {
                try {
                    await Chat['updateOne']({ 'jid': _0x2d20d9 }, {
                        ..._0x4c8ec0,
                        'jid': _0x2d20d9,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4f444b) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x4f444b['message']);
                }
            },
            async 'getChat'(_0x48782d) {
                try {
                    return await Chat['findOne']({ 'jid': _0x48782d });
                } catch (_0x5e113b) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x5e113b['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x3c6126 = await Chat['find']({});
                    const _0x45da69 = {};
                    _0x3c6126['forEach'](_0x576ac3 => {
                        _0x45da69[_0x576ac3['jid']] = {
                            'id': _0x576ac3['jid'],
                            'name': _0x576ac3['name'],
                            'conversationTimestamp': _0x576ac3['conversationTimestamp'],
                            'unreadCount': _0x576ac3['unreadCount']
                        };
                    });
                    return _0x45da69;
                } catch (_0x1aa6fc) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x1aa6fc['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x288095) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x288095 });
                } catch (_0x31d5bf) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x31d5bf['message']);
                }
            },
            async 'saveSetting'(_0xfeab84, _0x3fba55, _0x1517ff) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0xfeab84,
                        'key': _0x3fba55
                    }, {
                        'chatId': _0xfeab84,
                        'key': _0x3fba55,
                        'value': _0x1517ff,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x521081) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x521081['message']);
                }
            },
            async 'getSetting'(_0x15243f, _0x31b386) {
                try {
                    const _0x53db22 = await Setting['findOne']({
                        'chatId': _0x15243f,
                        'key': _0x31b386
                    });
                    return _0x53db22 ? _0x53db22['value'] : null;
                } catch (_0x4c08f9) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x4c08f9['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x2a0700) {
                try {
                    const _0x3ff0bd = await Setting['find']({ 'chatId': _0x2a0700 });
                    const _0x89f47a = {};
                    _0x3ff0bd['forEach'](_0x3aecb8 => {
                        _0x89f47a[_0x3aecb8['key']] = _0x3aecb8['value'];
                    });
                    return _0x89f47a;
                } catch (_0x5b7f8a) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x5b7f8a['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x481c9c = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x481c9c['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x481c9c['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x167cfc) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x167cfc['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x139df0) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x139df0['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x1f486b) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x1f486b['message']);
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
        pool['on']('error', _0x222e2b => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x222e2b['message']);
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
                        const _0xf906d3 = await pool['connect']();
                        try {
                            await _0xf906d3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xf906d3['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0xf906d3['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0xf906d3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xf906d3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xf906d3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xf906d3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xf906d3['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0xf906d3['release']();
                        }
                    } catch (_0x167113) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x167113['message']);
                        this['initPromise'] = null;
                        throw _0x167113;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x5cbc5f, _0x42d2c9, _0x581dc1) {
                try {
                    await this['init']();
                    const _0x5b949a = await pool['connect']();
                    try {
                        await _0x5b949a['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x5cbc5f,
                            _0x42d2c9,
                            Date['now'](),
                            compress(_0x581dc1)
                        ]);
                    } finally {
                        _0x5b949a['release']();
                    }
                } catch (_0x4e09c7) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x4e09c7['message']);
                }
            },
            async 'load'(_0x36a138, _0x5c2d97) {
                try {
                    await this['init']();
                    const _0xdde56 = await pool['connect']();
                    try {
                        const _0x115d79 = await _0xdde56['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x36a138,
                            _0x5c2d97
                        ]);
                        return _0x115d79['rows'][0x0] ? decompress(_0x115d79['rows'][0x0]['data']) : null;
                    } finally {
                        _0xdde56['release']();
                    }
                } catch (_0x312e3b) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x312e3b['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x28441a, _0x4935c6) {
                try {
                    await this['init']();
                    const _0x442be5 = await pool['connect']();
                    try {
                        await _0x442be5['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x28441a,
                            _0x4935c6
                        ]);
                    } finally {
                        _0x442be5['release']();
                    }
                } catch (_0x3ca47a) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x3ca47a['message']);
                }
            },
            async 'getCount'(_0x3a9ffc, _0x508c28) {
                try {
                    await this['init']();
                    const _0x39ddfb = await pool['connect']();
                    try {
                        const _0x1658be = await _0x39ddfb['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x3a9ffc,
                            _0x508c28
                        ]);
                        return _0x1658be['rows'][0x0] ? _0x1658be['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x39ddfb['release']();
                    }
                } catch (_0x12c316) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x12c316['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x3af358 = await pool['connect']();
                    try {
                        const _0x4daa1a = await _0x3af358['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x54116c = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x4daa1a['rows']['forEach'](_0x323e18 => {
                            if (!_0x54116c['messageCount'][_0x323e18['chat_id']]) {
                                _0x54116c['messageCount'][_0x323e18['chat_id']] = {};
                            }
                            _0x54116c['messageCount'][_0x323e18['chat_id']][_0x323e18['user_id']] = _0x323e18['count'];
                        });
                        const _0x1a63e5 = await _0x3af358['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x1a63e5['rows'][0x0])
                            _0x54116c['isPublic'] = _0x1a63e5['rows'][0x0]['value'] === 'true';
                        return _0x54116c;
                    } finally {
                        _0x3af358['release']();
                    }
                } catch (_0x37e14) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x37e14['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x1c0989) {
                try {
                    await this['init']();
                    const _0x34cb3 = await pool['connect']();
                    try {
                        await _0x34cb3['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x1c0989['toString']()]);
                    } finally {
                        _0x34cb3['release']();
                    }
                } catch (_0x39e264) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x39e264['message']);
                }
            },
            async 'setMetadata'(_0x49b1bf, _0x2e9b18) {
                try {
                    await this['init']();
                    const _0x505ae3 = await pool['connect']();
                    try {
                        await _0x505ae3['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x49b1bf,
                            _0x2e9b18['toString']()
                        ]);
                    } finally {
                        _0x505ae3['release']();
                    }
                } catch (_0x2c0824) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x2c0824['message']);
                }
            },
            async 'getMetadata'(_0x345add) {
                try {
                    await this['init']();
                    const _0x3ed485 = await pool['connect']();
                    try {
                        const _0x166c2c = await _0x3ed485['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x345add]);
                        return _0x166c2c['rows'][0x0] ? _0x166c2c['rows'][0x0]['value'] : null;
                    } finally {
                        _0x3ed485['release']();
                    }
                } catch (_0x149c8a) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x149c8a['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x5b2055, _0x385eb0) {
                try {
                    await this['init']();
                    const _0xe987f6 = await pool['connect']();
                    try {
                        await _0xe987f6['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x5b2055,
                            _0x385eb0['name'] || '',
                            _0x385eb0['notify'] || '',
                            _0x385eb0['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0xe987f6['release']();
                    }
                } catch (_0x28adb1) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x28adb1['message']);
                }
            },
            async 'getContact'(_0x1c3fcf) {
                try {
                    await this['init']();
                    const _0x257613 = await pool['connect']();
                    try {
                        const _0x3693b3 = await _0x257613['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x1c3fcf]);
                        return _0x3693b3['rows'][0x0] || null;
                    } finally {
                        _0x257613['release']();
                    }
                } catch (_0x4f48ab) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x4f48ab['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x395334 = await pool['connect']();
                    try {
                        const _0x5b6533 = await _0x395334['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x35a40f = {};
                        _0x5b6533['rows']['forEach'](_0x558b89 => {
                            _0x35a40f[_0x558b89['jid']] = {
                                'id': _0x558b89['jid'],
                                'name': _0x558b89['name'],
                                'notify': _0x558b89['notify']
                            };
                        });
                        return _0x35a40f;
                    } finally {
                        _0x395334['release']();
                    }
                } catch (_0x527e05) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x527e05['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x43db9c, _0x1f1a47) {
                try {
                    await this['init']();
                    const _0x1d6039 = await pool['connect']();
                    try {
                        await _0x1d6039['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x43db9c,
                            _0x1f1a47['name'] || '',
                            _0x1f1a47['conversationTimestamp'] || 0x0,
                            _0x1f1a47['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x1d6039['release']();
                    }
                } catch (_0x19a394) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x19a394['message']);
                }
            },
            async 'getChat'(_0xc87abc) {
                try {
                    await this['init']();
                    const _0x3509c3 = await pool['connect']();
                    try {
                        const _0x3bbc35 = await _0x3509c3['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0xc87abc]);
                        return _0x3bbc35['rows'][0x0] || null;
                    } finally {
                        _0x3509c3['release']();
                    }
                } catch (_0x2ae6ee) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x2ae6ee['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x48115a = await pool['connect']();
                    try {
                        const _0x36444a = await _0x48115a['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x2e2f1f = {};
                        _0x36444a['rows']['forEach'](_0x2103e4 => {
                            _0x2e2f1f[_0x2103e4['jid']] = {
                                'id': _0x2103e4['jid'],
                                'name': _0x2103e4['name'],
                                'conversationTimestamp': _0x2103e4['conversation_timestamp'],
                                'unreadCount': _0x2103e4['unread_count']
                            };
                        });
                        return _0x2e2f1f;
                    } finally {
                        _0x48115a['release']();
                    }
                } catch (_0x343dc6) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x343dc6['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x21ce65) {
                try {
                    await this['init']();
                    const _0x476b99 = await pool['connect']();
                    try {
                        await _0x476b99['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x21ce65]);
                    } finally {
                        _0x476b99['release']();
                    }
                } catch (_0x51553a) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x51553a['message']);
                }
            },
            async 'saveSetting'(_0x543eb2, _0x1e63c9, _0x20a9e9) {
                try {
                    await this['init']();
                    const _0x31458a = await pool['connect']();
                    try {
                        await _0x31458a['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x543eb2,
                            _0x1e63c9,
                            JSON['stringify'](_0x20a9e9),
                            Date['now']()
                        ]);
                    } finally {
                        _0x31458a['release']();
                    }
                } catch (_0x37a099) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x37a099['message']);
                }
            },
            async 'getSetting'(_0x5e09af, _0x1134c5) {
                try {
                    await this['init']();
                    const _0x284480 = await pool['connect']();
                    try {
                        const _0x1ea983 = await _0x284480['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x5e09af,
                            _0x1134c5
                        ]);
                        return _0x1ea983['rows'][0x0] ? JSON['parse'](_0x1ea983['rows'][0x0]['value']) : null;
                    } finally {
                        _0x284480['release']();
                    }
                } catch (_0x15cdd1) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x15cdd1['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x4d9b89) {
                try {
                    await this['init']();
                    const _0x3b764c = await pool['connect']();
                    try {
                        const _0x4535b0 = await _0x3b764c['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x4d9b89]);
                        const _0x111571 = {};
                        _0x4535b0['rows']['forEach'](_0x4d11d7 => {
                            _0x111571[_0x4d11d7['key']] = JSON['parse'](_0x4d11d7['value']);
                        });
                        return _0x111571;
                    } finally {
                        _0x3b764c['release']();
                    }
                } catch (_0x118652) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x118652['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x2a9a98 = await pool['connect']();
                    try {
                        const _0x177d46 = await _0x2a9a98['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x177d46['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x177d46['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x2a9a98['release']();
                    }
                } catch (_0x597da5) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x597da5['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x56555b) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x56555b['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x324d5d) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x324d5d['message']);
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
                    } catch (_0x4a6622) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x4a6622['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x4a6622;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x3ccb6a, _0x338015, _0x5d54e0) {
                try {
                    const _0xca145d = await this['getConn']();
                    await _0xca145d['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x3ccb6a,
                        _0x338015,
                        Date['now'](),
                        compress(_0x5d54e0)
                    ]);
                } catch (_0x2e8aa5) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x2e8aa5['message']);
                }
            },
            async 'load'(_0x4c30b6, _0x590c7e) {
                try {
                    const _0x1845eb = await this['getConn']();
                    const [_0x3e9699] = await _0x1845eb['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x4c30b6,
                        _0x590c7e
                    ]);
                    return _0x3e9699[0x0] ? decompress(_0x3e9699[0x0]['data']) : null;
                } catch (_0x3ab283) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x3ab283['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x369097, _0x555d61) {
                try {
                    const _0x4b487f = await this['getConn']();
                    await _0x4b487f['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x369097,
                        _0x555d61
                    ]);
                } catch (_0x11f127) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x11f127['message']);
                }
            },
            async 'getCount'(_0x18ee5f, _0x11ed13) {
                try {
                    const _0x160728 = await this['getConn']();
                    const [_0x281bfb] = await _0x160728['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x18ee5f,
                        _0x11ed13
                    ]);
                    return _0x281bfb[0x0] ? _0x281bfb[0x0]['count'] : 0x0;
                } catch (_0x1e5e88) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x1e5e88['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x43a54e = await this['getConn']();
                    const [_0x2f36d4] = await _0x43a54e['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x436802 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2f36d4['forEach'](_0x2497f4 => {
                        if (!_0x436802['messageCount'][_0x2497f4['chat_id']]) {
                            _0x436802['messageCount'][_0x2497f4['chat_id']] = {};
                        }
                        _0x436802['messageCount'][_0x2497f4['chat_id']][_0x2497f4['user_id']] = _0x2497f4['count'];
                    });
                    const [_0x34c458] = await _0x43a54e['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x34c458[0x0])
                        _0x436802['isPublic'] = _0x34c458[0x0]['value'] === 'true';
                    return _0x436802;
                } catch (_0x361dea) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x361dea['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x32e038) {
                try {
                    const _0x170549 = await this['getConn']();
                    await _0x170549['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x32e038['toString']()]);
                } catch (_0x1a7f06) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x1a7f06['message']);
                }
            },
            async 'setMetadata'(_0x18e29b, _0xfcb119) {
                try {
                    const _0x507c83 = await this['getConn']();
                    await _0x507c83['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x18e29b,
                        _0xfcb119['toString']()
                    ]);
                } catch (_0x2fef7b) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x2fef7b['message']);
                }
            },
            async 'getMetadata'(_0x15ebc7) {
                try {
                    const _0x306ad7 = await this['getConn']();
                    const [_0x47d404] = await _0x306ad7['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x15ebc7]);
                    return _0x47d404[0x0] ? _0x47d404[0x0]['value'] : null;
                } catch (_0x49db41) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x49db41['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x5f00ed, _0x3cfded) {
                try {
                    const _0x3c68f7 = await this['getConn']();
                    await _0x3c68f7['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x5f00ed,
                        _0x3cfded['name'] || '',
                        _0x3cfded['notify'] || '',
                        _0x3cfded['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x96b5d0) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x96b5d0['message']);
                }
            },
            async 'getContact'(_0x57f2f6) {
                try {
                    const _0x180b28 = await this['getConn']();
                    const [_0x5413c4] = await _0x180b28['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x57f2f6]);
                    return _0x5413c4[0x0] || null;
                } catch (_0xb3a414) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0xb3a414['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x20ec78 = await this['getConn']();
                    const [_0x270c52] = await _0x20ec78['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x147377 = {};
                    _0x270c52['forEach'](_0x2488ce => {
                        _0x147377[_0x2488ce['jid']] = {
                            'id': _0x2488ce['jid'],
                            'name': _0x2488ce['name'],
                            'notify': _0x2488ce['notify']
                        };
                    });
                    return _0x147377;
                } catch (_0x583c6e) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x583c6e['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x24e60b, _0x37fb6d) {
                try {
                    const _0x3f381d = await this['getConn']();
                    await _0x3f381d['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x24e60b,
                        _0x37fb6d['name'] || '',
                        _0x37fb6d['conversationTimestamp'] || 0x0,
                        _0x37fb6d['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x250488) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x250488['message']);
                }
            },
            async 'getChat'(_0xa06117) {
                try {
                    const _0x3e1110 = await this['getConn']();
                    const [_0x5746e9] = await _0x3e1110['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0xa06117]);
                    return _0x5746e9[0x0] || null;
                } catch (_0x4e1068) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x4e1068['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x1c39bf = await this['getConn']();
                    const [_0x472c19] = await _0x1c39bf['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0xb06218 = {};
                    _0x472c19['forEach'](_0x3b2718 => {
                        _0xb06218[_0x3b2718['jid']] = {
                            'id': _0x3b2718['jid'],
                            'name': _0x3b2718['name'],
                            'conversationTimestamp': _0x3b2718['conversation_timestamp'],
                            'unreadCount': _0x3b2718['unread_count']
                        };
                    });
                    return _0xb06218;
                } catch (_0x2a5c7e) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x2a5c7e['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x284cde) {
                try {
                    const _0xbb564a = await this['getConn']();
                    await _0xbb564a['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x284cde]);
                } catch (_0x3c9b6f) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x3c9b6f['message']);
                }
            },
            async 'saveSetting'(_0x322d1c, _0x3ea20d, _0x38bf0d) {
                try {
                    const _0x54070c = await this['getConn']();
                    await _0x54070c['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x322d1c,
                        _0x3ea20d,
                        JSON['stringify'](_0x38bf0d),
                        Date['now']()
                    ]);
                } catch (_0x3aa1cf) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x3aa1cf['message']);
                }
            },
            async 'getSetting'(_0x757079, _0x4eb11a) {
                try {
                    const _0x6cf250 = await this['getConn']();
                    const [_0x1a2d51] = await _0x6cf250['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x757079,
                        _0x4eb11a
                    ]);
                    return _0x1a2d51[0x0] ? JSON['parse'](_0x1a2d51[0x0]['value']) : null;
                } catch (_0x430cdc) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x430cdc['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x5635ee) {
                try {
                    const _0x2f2bf3 = await this['getConn']();
                    const [_0x484473] = await _0x2f2bf3['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x5635ee]);
                    const _0x747064 = {};
                    _0x484473['forEach'](_0x3616f1 => {
                        _0x747064[_0x3616f1['key']] = JSON['parse'](_0x3616f1['value']);
                    });
                    return _0x747064;
                } catch (_0x10a93b) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x10a93b['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x335995 = await this['getConn']();
                    const [_0x58427a] = await _0x335995['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x58427a['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x58427a['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0xc296f5) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0xc296f5['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0xdac138) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0xdac138['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x32fed2) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x32fed2['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x19bbc0['dirname'](SQLITE_URL);
        if (!_0x0_0x5b324d['existsSync'](dir))
            _0x0_0x5b324d['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x743dff, _0x2763d0, _0x531bcd) {
                try {
                    saveStmt['run'](_0x743dff, _0x2763d0, Date['now'](), compress(_0x531bcd));
                    const {count: _0x414850} = countStmt['get'](_0x743dff);
                    if (_0x414850 > MESSAGE_LIMITS['sqlite']) {
                        const _0x34157b = _0x414850 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x743dff, _0x743dff, _0x34157b);
                    }
                } catch (_0x242bdf) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x242bdf['message']);
                }
            },
            'load'(_0x1babe0, _0x52310d) {
                try {
                    const _0x49a898 = loadStmt['get'](_0x1babe0, _0x52310d);
                    return _0x49a898 ? decompress(_0x49a898['data']) : null;
                } catch (_0x730858) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x730858['message']);
                    return null;
                }
            },
            'incrementCount'(_0x309c3f, _0x198bd2) {
                try {
                    incrementCountStmt['run'](_0x309c3f, _0x198bd2);
                } catch (_0x8568b8) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x8568b8['message']);
                }
            },
            'getCount'(_0x1b3dc9, _0x52cefc) {
                try {
                    const _0x4c0018 = getCountStmt['get'](_0x1b3dc9, _0x52cefc);
                    return _0x4c0018 ? _0x4c0018['count'] : 0x0;
                } catch (_0xbf3a86) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0xbf3a86['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x14b9af = getAllCountsStmt['all']();
                    const _0x4a5aaa = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x14b9af['forEach'](_0x41392f => {
                        if (!_0x4a5aaa['messageCount'][_0x41392f['chat_id']]) {
                            _0x4a5aaa['messageCount'][_0x41392f['chat_id']] = {};
                        }
                        _0x4a5aaa['messageCount'][_0x41392f['chat_id']][_0x41392f['user_id']] = _0x41392f['count'];
                    });
                    const _0x36a057 = getMetaStmt['get']();
                    if (_0x36a057)
                        _0x4a5aaa['isPublic'] = _0x36a057['value'] === 'true';
                    return _0x4a5aaa;
                } catch (_0x3d8e19) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x3d8e19['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x74a38c) {
                try {
                    setMetaStmt['run'](_0x74a38c['toString']());
                } catch (_0x182a3d) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x182a3d['message']);
                }
            },
            'setMetadata'(_0x4dc388, _0x13cf0b) {
                try {
                    setMetadataStmt['run'](_0x4dc388, _0x13cf0b['toString']());
                } catch (_0x59fc3e) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x59fc3e['message']);
                }
            },
            'getMetadata'(_0x4ea6ac) {
                try {
                    const _0xec1fd9 = getMetadataStmt['get'](_0x4ea6ac);
                    return _0xec1fd9 ? _0xec1fd9['value'] : null;
                } catch (_0x23b1da) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x23b1da['message']);
                    return null;
                }
            },
            'saveContact'(_0x24fe87, _0x5e7f90) {
                try {
                    saveContactStmt['run'](_0x24fe87, _0x5e7f90['name'] || '', _0x5e7f90['notify'] || '', _0x5e7f90['verifiedName'] || '', Date['now']());
                } catch (_0x38980c) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x38980c['message']);
                }
            },
            'getContact'(_0x549ebd) {
                try {
                    return getContactStmt['get'](_0x549ebd) || null;
                } catch (_0x437de1) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x437de1['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x212dcb = getAllContactsStmt['all']();
                    const _0x5679c5 = {};
                    _0x212dcb['forEach'](_0x23fa3c => {
                        _0x5679c5[_0x23fa3c['jid']] = {
                            'id': _0x23fa3c['jid'],
                            'name': _0x23fa3c['name'],
                            'notify': _0x23fa3c['notify']
                        };
                    });
                    return _0x5679c5;
                } catch (_0x1738e9) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x1738e9['message']);
                    return {};
                }
            },
            'saveChat'(_0x529c86, _0x432d95) {
                try {
                    saveChatStmt['run'](_0x529c86, _0x432d95['name'] || '', _0x432d95['conversationTimestamp'] || 0x0, _0x432d95['unreadCount'] || 0x0, Date['now']());
                } catch (_0x35015a) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x35015a['message']);
                }
            },
            'getChat'(_0x40116b) {
                try {
                    return getChatStmt['get'](_0x40116b) || null;
                } catch (_0x45c377) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x45c377['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x2408ec = getAllChatsStmt['all']();
                    const _0xf408e8 = {};
                    _0x2408ec['forEach'](_0x10c2d1 => {
                        _0xf408e8[_0x10c2d1['jid']] = {
                            'id': _0x10c2d1['jid'],
                            'name': _0x10c2d1['name'],
                            'conversationTimestamp': _0x10c2d1['conversation_timestamp'],
                            'unreadCount': _0x10c2d1['unread_count']
                        };
                    });
                    return _0xf408e8;
                } catch (_0x2309cf) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x2309cf['message']);
                    return {};
                }
            },
            'deleteChat'(_0x490d0b) {
                try {
                    deleteChatStmt['run'](_0x490d0b);
                } catch (_0xc5b376) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0xc5b376['message']);
                }
            },
            'saveSetting'(_0x5140c3, _0x1d97e3, _0x498105) {
                try {
                    saveSettingStmt['run'](_0x5140c3, _0x1d97e3, JSON['stringify'](_0x498105), Date['now']());
                } catch (_0x285964) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x285964['message']);
                }
            },
            'getSetting'(_0x2f8d36, _0x14605c) {
                try {
                    const _0x5a79e2 = getSettingStmt['get'](_0x2f8d36, _0x14605c);
                    return _0x5a79e2 ? JSON['parse'](_0x5a79e2['value']) : null;
                } catch (_0x5110f5) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x5110f5['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x2f2565) {
                try {
                    const _0x204282 = getAllSettingsStmt['all'](_0x2f2565);
                    const _0x369acf = {};
                    _0x204282['forEach'](_0x45d1c8 => {
                        _0x369acf[_0x45d1c8['key']] = JSON['parse'](_0x45d1c8['value']);
                    });
                    return _0x369acf;
                } catch (_0x1ade9c) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x1ade9c['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x4044cb = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x4044cb['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x4044cb['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x2242ef) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x2242ef['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x12e8d5) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x12e8d5['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x399689) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x399689['message']);
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
    async 'readFromFile'(_0x2e1724 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x45b076 = await adapters[backend]['getAllContacts']();
                const _0x2fa450 = await adapters[backend]['getAllChats']();
                const _0x916e5b = await this['getBotMode']();
                this['contacts'] = _0x45b076;
                this['chats'] = _0x2fa450;
                this['botMode'] = _0x916e5b;
            } else {
                if (_0x0_0x5b324d['existsSync'](_0x2e1724)) {
                    const _0x4438d4 = JSON['parse'](_0x0_0x5b324d['readFileSync'](_0x2e1724, 'utf-8'));
                    this['contacts'] = _0x4438d4['contacts'] || {};
                    this['chats'] = _0x4438d4['chats'] || {};
                    this['botMode'] = _0x4438d4['botMode'] || 'private';
                    this['messages'] = _0x4438d4['messages'] || {};
                    this['isPublic'] = _0x4438d4['isPublic'] !== undefined ? _0x4438d4['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x537983) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x537983['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x3f19cb = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0xd1fe56 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x5b324d['writeFileSync'](_0x3f19cb, JSON['stringify'](_0xd1fe56, null, 0x2));
        } catch (_0x4b7bd2) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x4b7bd2['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x5b324d['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x2595bd = JSON['parse'](_0x0_0x5b324d['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x2595bd['messageCount'] || _0x2595bd;
                    this['isPublic'] = typeof _0x2595bd['isPublic'] === 'boolean' ? _0x2595bd['isPublic'] : ![];
                }
            } catch (_0x137ab7) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x137ab7['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x4bfd5f = _0x0_0x19bbc0['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x5b324d['existsSync'](_0x4bfd5f))
                    _0x0_0x5b324d['mkdirSync'](_0x4bfd5f, { 'recursive': !![] });
                const _0x13fce5 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x5b324d['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x13fce5, null, 0x2));
            } catch (_0x5bd91e) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x5bd91e['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0xf998f7 => {
                if (typeof this['messages'][_0xf998f7] === 'object' && !Array['isArray'](this['messages'][_0xf998f7])) {
                    const _0x18deb2 = Object['values'](this['messages'][_0xf998f7]);
                    this['messages'][_0xf998f7] = _0x18deb2['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0xf998f7])) {
                    if (this['messages'][_0xf998f7]['length'] > MAX_MESSAGES) {
                        this['messages'][_0xf998f7] = this['messages'][_0xf998f7]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x697aa1 => {
                if (this['chats'][_0x697aa1]['messages']) {
                    delete this['chats'][_0x697aa1]['messages'];
                }
            });
        }
    },
    'bind'(_0x3c07f5) {
        _0x3c07f5['on']('messages.upsert', async ({messages: _0x3cda95}) => {
            for (const _0x35401a of _0x3cda95) {
                if (!_0x35401a['key']?.['remoteJid'])
                    continue;
                const _0x1661f2 = _0x35401a['key']['remoteJid'];
                const _0x14ab24 = slimMessage(_0x35401a);
                if (backend === 'memory') {
                    this['messages'][_0x1661f2] = this['messages'][_0x1661f2] || [];
                    this['messages'][_0x1661f2]['push'](_0x14ab24);
                    if (this['messages'][_0x1661f2]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x1661f2] = this['messages'][_0x1661f2]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x1661f2, _0x35401a['key']['id'], _0x14ab24);
                    } catch (_0x54e360) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x35401a['key']['id'] + ':', _0x54e360['message']);
                    }
                }
            }
        });
        _0x3c07f5['on']('contacts.update', async _0x4b46e9 => {
            for (const _0x5e6cd2 of _0x4b46e9) {
                if (_0x5e6cd2['id']) {
                    const _0x6a753e = {
                        'id': _0x5e6cd2['id'],
                        'name': _0x5e6cd2['notify'] || _0x5e6cd2['name'] || _0x5e6cd2['verifiedName'] || '',
                        'notify': _0x5e6cd2['notify'],
                        'verifiedName': _0x5e6cd2['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x5e6cd2['id']] = _0x6a753e;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x5e6cd2['id'], _0x6a753e);
                        } catch (_0x3934d2) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x3934d2['message']);
                        }
                    }
                }
            }
        });
        _0x3c07f5['on']('contacts.set', async _0xbb4d88 => {
            for (const _0x506c0b of _0xbb4d88) {
                if (_0x506c0b['id']) {
                    const _0x3accd2 = {
                        'id': _0x506c0b['id'],
                        'name': _0x506c0b['notify'] || _0x506c0b['name'] || _0x506c0b['verifiedName'] || '',
                        'notify': _0x506c0b['notify'],
                        'verifiedName': _0x506c0b['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x506c0b['id']] = _0x3accd2;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x506c0b['id'], _0x3accd2);
                        } catch (_0x3b0a7f) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x3b0a7f['message']);
                        }
                    }
                }
            }
        });
        _0x3c07f5['on']('chats.set', async _0x3a41df => {
            for (const _0x54740a of _0x3a41df) {
                if (_0x54740a['id']) {
                    const _0x417526 = {
                        'id': _0x54740a['id'],
                        'name': _0x54740a['name'] || _0x54740a['subject'] || '',
                        'conversationTimestamp': _0x54740a['conversationTimestamp'],
                        'unreadCount': _0x54740a['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x54740a['id']] = _0x417526;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x54740a['id'], _0x417526);
                        } catch (_0x173158) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x173158['message']);
                        }
                    }
                }
            }
        });
        _0x3c07f5['on']('chats.update', async _0x43932e => {
            for (const _0x4fb28d of _0x43932e) {
                if (_0x4fb28d['id']) {
                    if (backend === 'memory') {
                        const _0x51227b = this['chats'][_0x4fb28d['id']] || {};
                        this['chats'][_0x4fb28d['id']] = {
                            'id': _0x4fb28d['id'],
                            'name': _0x4fb28d['name'] || _0x4fb28d['subject'] || _0x51227b['name'] || '',
                            'conversationTimestamp': _0x4fb28d['conversationTimestamp'] || _0x51227b['conversationTimestamp'],
                            'unreadCount': _0x4fb28d['unreadCount'] !== undefined ? _0x4fb28d['unreadCount'] : _0x51227b['unreadCount']
                        };
                    } else {
                        try {
                            const _0x1a11cb = await adapters[backend]['getChat'](_0x4fb28d['id']) || {};
                            const _0x4dc756 = {
                                'id': _0x4fb28d['id'],
                                'name': _0x4fb28d['name'] || _0x4fb28d['subject'] || _0x1a11cb['name'] || '',
                                'conversationTimestamp': _0x4fb28d['conversationTimestamp'] || _0x1a11cb['conversation_timestamp'],
                                'unreadCount': _0x4fb28d['unreadCount'] !== undefined ? _0x4fb28d['unreadCount'] : _0x1a11cb['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x4fb28d['id'], _0x4dc756);
                        } catch (_0x4cdc86) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x4cdc86['message']);
                        }
                    }
                }
            }
        });
        _0x3c07f5['on']('chats.delete', async _0x367a3d => {
            for (const _0x4370fb of _0x367a3d) {
                if (backend === 'memory') {
                    delete this['chats'][_0x4370fb];
                    delete this['messages'][_0x4370fb];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x4370fb);
                    } catch (_0x1dd1fe) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x1dd1fe['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0xbcc9b7, _0x1333bf) {
        if (backend === 'memory') {
            const _0x74f8d = this['messages'][_0xbcc9b7]?.['find'](_0x24ba2d => _0x24ba2d['key']['id'] === _0x1333bf) || null;
            return _0x74f8d;
        } else {
            try {
                return await adapters[backend]['load'](_0xbcc9b7, _0x1333bf);
            } catch (_0x1fda5d) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x1333bf + ':', _0x1fda5d['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x324859, _0x24a737, _0x1f7fcf) {
        if (backend === 'memory') {
            const _0x4e1d04 = './data';
            if (!_0x0_0x5b324d['existsSync'](_0x4e1d04))
                _0x0_0x5b324d['mkdirSync'](_0x4e1d04, { 'recursive': !![] });
            const _0x304958 = _0x0_0x19bbc0['join'](_0x4e1d04, _0x24a737 + '.json');
            try {
                _0x0_0x5b324d['writeFileSync'](_0x304958, JSON['stringify'](_0x1f7fcf, null, 0x2));
            } catch (_0x1f3d71) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x24a737 + ':', _0x1f3d71['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x324859, _0x24a737, _0x1f7fcf);
            } catch (_0x4de0b5) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x24a737 + ':', _0x4de0b5['message']);
            }
        }
    },
    async 'getSetting'(_0x4f99be, _0x2972b3) {
        if (backend === 'memory') {
            const _0x2cb08a = './data';
            const _0x440e45 = _0x0_0x19bbc0['join'](_0x2cb08a, _0x2972b3 + '.json');
            try {
                if (_0x0_0x5b324d['existsSync'](_0x440e45)) {
                    const _0x46295b = JSON['parse'](_0x0_0x5b324d['readFileSync'](_0x440e45, 'utf-8'));
                    if (_0x46295b['enabled'] !== undefined)
                        return _0x46295b;
                    if (_0x46295b[_0x4f99be] !== undefined)
                        return _0x46295b[_0x4f99be];
                    return null;
                }
                return null;
            } catch (_0x9227a5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2972b3 + ':', _0x9227a5['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x4f99be, _0x2972b3);
            } catch (_0x51a17d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2972b3 + ':', _0x51a17d['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x8ec00b) {
        if (backend === 'memory') {
            const _0x2200dc = './data';
            const _0x123571 = {};
            try {
                if (_0x0_0x5b324d['existsSync'](_0x2200dc)) {
                    const _0x4fd98a = _0x0_0x5b324d['readdirSync'](_0x2200dc)['filter'](_0x26797f => _0x26797f['endsWith']('.json'));
                    for (const _0x506172 of _0x4fd98a) {
                        const _0x5fc65e = _0x0_0x19bbc0['basename'](_0x506172, '.json');
                        if (_0x5fc65e === 'messageCount' || _0x5fc65e === 'owner')
                            continue;
                        const _0x26c3e9 = _0x0_0x19bbc0['join'](_0x2200dc, _0x506172);
                        const _0x212071 = JSON['parse'](_0x0_0x5b324d['readFileSync'](_0x26c3e9, 'utf-8'));
                        if (_0x212071[_0x8ec00b]) {
                            _0x123571[_0x5fc65e] = _0x212071[_0x8ec00b];
                        }
                    }
                }
                return _0x123571;
            } catch (_0x39d22d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x39d22d['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x8ec00b);
            } catch (_0x39818c) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x39818c['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x3c5b80) {
        const _0x39ef9f = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x39ef9f['includes'](_0x3c5b80)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x3c5b80 + ',\x20defaulting\x20to\x20private');
            _0x3c5b80 = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x3c5b80;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x3c5b80);
            } catch (_0x187971) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x187971['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x27cd11 = await adapters[backend]['getMetadata']('botMode');
                return _0x27cd11 || 'private';
            } catch (_0x5ecb85) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x5ecb85['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x11156b, _0x409c34, _0x53c241) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x11156b]) {
                this['messageCount'][_0x11156b] = {};
            }
            if (!this['messageCount'][_0x11156b][_0x409c34]) {
                this['messageCount'][_0x11156b][_0x409c34] = 0x0;
            }
            this['messageCount'][_0x11156b][_0x409c34]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x11156b, _0x409c34);
            } catch (_0x49453c) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x409c34 + ':', _0x49453c['message']);
            }
        }
    },
    async 'getMessageCount'(_0x30eb40, _0x519f71) {
        if (backend === 'memory') {
            return this['messageCount'][_0x30eb40]?.[_0x519f71] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x30eb40, _0x519f71);
            } catch (_0x21dab0) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x519f71 + ':', _0x21dab0['message']);
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
            } catch (_0x44ab4b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x44ab4b['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x1285eb) {
        if (backend === 'memory') {
            this['isPublic'] = _0x1285eb;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x1285eb);
            } catch (_0x10a397) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x10a397['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x57404f = await adapters[backend]['getAllCounts']();
                return _0x57404f['isPublic'];
            } catch (_0x5a48af) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x5a48af['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x2b5c1c) {
        const _0x4241e6 = [
            'public',
            'private'
        ];
        if (!_0x4241e6['includes'](_0x2b5c1c)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x2b5c1c);
            _0x2b5c1c = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x2b5c1c;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x2b5c1c);
            } catch (_0x2d28f9) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x2d28f9['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x228512 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x228512 || 'private';
            } catch (_0x1c675e) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x1c675e['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x46d2e0 = 0x0;
        const _0x2a92a2 = Object['keys'](this['contacts'])['length'];
        const _0xdc4e8d = Object['keys'](this['chats'])['length'];
        let _0x58f699 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x3af259 => {
                if (Array['isArray'](_0x3af259)) {
                    _0x46d2e0 += _0x3af259['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x3de46b => {
                if (typeof _0x3de46b === 'object') {
                    _0x58f699 += Object['keys'](_0x3de46b)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x46d2e0 : 'stored\x20in\x20database',
            'contacts': _0x2a92a2,
            'chats': _0xdc4e8d,
            'messageCounts': backend === 'memory' ? _0x58f699 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x76d09d => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x76d09d));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x29f424 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x29f424));
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
        let _0x3500bd = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x399e5e => {
            if (store['chats'][_0x399e5e]['messages']) {
                delete store['chats'][_0x399e5e]['messages'];
                _0x3500bd++;
            }
        });
        if (_0x3500bd > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x3500bd + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x44a51b => {
    console['log']('[STORE]\x20Received\x20' + _0x44a51b + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x5515da) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x5515da['message']);
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
process['on']('uncaughtException', _0x59d2b9 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x59d2b9);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x347f15, _0x13c3b3) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x13c3b3, 'reason:', _0x347f15);
});
export default store;