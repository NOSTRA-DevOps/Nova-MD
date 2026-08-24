import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x5ef238 from 'fs';
import _0x0_0x3c4071 from 'path';
import _0x0_0x5906a5 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x14ab47) {
    printLog = (_0x3189a7, _0x24b9fb) => console['log']('[' + _0x3189a7['toUpperCase']() + ']\x20' + _0x24b9fb);
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
} catch (_0x0_0x1e5dc1) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x14d8d3 => {
    try {
        return _0x0_0x5906a5['deflateSync'](JSON['stringify'](_0x14d8d3));
    } catch (_0x46cbbb) {
        console['error']('[STORE]\x20Compression\x20error:', _0x46cbbb['message']);
        return Buffer['from'](JSON['stringify'](_0x14d8d3));
    }
};
const decompress = _0x55cc8d => {
    try {
        return JSON['parse'](_0x0_0x5906a5['inflateSync'](_0x55cc8d));
    } catch (_0xfd33a6) {
        console['error']('[STORE]\x20Decompression\x20error:', _0xfd33a6['message']);
        try {
            return JSON['parse'](_0x55cc8d['toString']());
        } catch (_0x19f630) {
            return null;
        }
    }
};
function slimMessage(_0x2d440c) {
    return {
        'key': _0x2d440c['key'],
        'message': _0x2d440c['message'],
        'messageTimestamp': _0x2d440c['messageTimestamp'],
        'participant': _0x2d440c['participant'],
        'pushName': _0x2d440c['pushName'],
        'broadcast': _0x2d440c['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x96f464 => console['error']('[MONGO]\x20Connection\x20error:', _0x96f464));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x5b6578, _0x312998, _0x1f8bf1) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x5b6578,
                        'id': _0x312998
                    }, {
                        'data': compress(_0x1f8bf1),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x5cc978) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x5cc978['message']);
                }
            },
            async 'load'(_0x3b9b6c, _0x5c70f0) {
                try {
                    const _0x12e893 = await Msg['findOne']({
                        'jid': _0x3b9b6c,
                        'id': _0x5c70f0
                    });
                    return _0x12e893 ? decompress(_0x12e893['data']) : null;
                } catch (_0x3b0e9b) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x3b0e9b['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x5149fa, _0x46a177) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x5149fa,
                        'userId': _0x46a177
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0xb94e30) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0xb94e30['message']);
                }
            },
            async 'getCount'(_0xb0c5e5, _0x58721e) {
                try {
                    const _0x3596e9 = await MsgCount['findOne']({
                        'chatId': _0xb0c5e5,
                        'userId': _0x58721e
                    });
                    return _0x3596e9 ? _0x3596e9['count'] : 0x0;
                } catch (_0x2847b7) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x2847b7['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x3d7a8c = await MsgCount['find']({});
                    const _0x224708 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3d7a8c['forEach'](_0x4495a8 => {
                        if (!_0x224708['messageCount'][_0x4495a8['chatId']]) {
                            _0x224708['messageCount'][_0x4495a8['chatId']] = {};
                        }
                        _0x224708['messageCount'][_0x4495a8['chatId']][_0x4495a8['userId']] = _0x4495a8['count'];
                    });
                    const _0xf7e457 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0xf7e457)
                        _0x224708['isPublic'] = _0xf7e457['value'] === 'true';
                    return _0x224708;
                } catch (_0x2c0193) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x2c0193['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x2b6f85) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x2b6f85['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x27ffdd) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x27ffdd['message']);
                }
            },
            async 'setMetadata'(_0xead1a2, _0x5e7676) {
                try {
                    await Meta['updateOne']({ 'key': _0xead1a2 }, {
                        'key': _0xead1a2,
                        'value': _0x5e7676['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x377b1f) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x377b1f['message']);
                }
            },
            async 'getMetadata'(_0x3aee4e) {
                try {
                    const _0x2c3ade = await Meta['findOne']({ 'key': _0x3aee4e });
                    return _0x2c3ade ? _0x2c3ade['value'] : null;
                } catch (_0x1a5445) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x1a5445['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xeaf8b9, _0x2a501a) {
                try {
                    await Contact['updateOne']({ 'jid': _0xeaf8b9 }, {
                        ..._0x2a501a,
                        'jid': _0xeaf8b9,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x3faa08) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x3faa08['message']);
                }
            },
            async 'getContact'(_0x176789) {
                try {
                    return await Contact['findOne']({ 'jid': _0x176789 });
                } catch (_0x23117f) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x23117f['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x601a8d = await Contact['find']({});
                    const _0x148e4f = {};
                    _0x601a8d['forEach'](_0x1028d0 => {
                        _0x148e4f[_0x1028d0['jid']] = {
                            'id': _0x1028d0['jid'],
                            'name': _0x1028d0['name'],
                            'notify': _0x1028d0['notify']
                        };
                    });
                    return _0x148e4f;
                } catch (_0x5ce964) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x5ce964['message']);
                    return {};
                }
            },
            async 'saveChat'(_0xa33507, _0x2bbd7c) {
                try {
                    await Chat['updateOne']({ 'jid': _0xa33507 }, {
                        ..._0x2bbd7c,
                        'jid': _0xa33507,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4aa7e2) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x4aa7e2['message']);
                }
            },
            async 'getChat'(_0x484560) {
                try {
                    return await Chat['findOne']({ 'jid': _0x484560 });
                } catch (_0x340f11) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x340f11['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x30d1dd = await Chat['find']({});
                    const _0x4fa61c = {};
                    _0x30d1dd['forEach'](_0x46662d => {
                        _0x4fa61c[_0x46662d['jid']] = {
                            'id': _0x46662d['jid'],
                            'name': _0x46662d['name'],
                            'conversationTimestamp': _0x46662d['conversationTimestamp'],
                            'unreadCount': _0x46662d['unreadCount']
                        };
                    });
                    return _0x4fa61c;
                } catch (_0x3ecaf4) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x3ecaf4['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x3e0f3e) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x3e0f3e });
                } catch (_0x5ba340) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x5ba340['message']);
                }
            },
            async 'saveSetting'(_0x169af2, _0x2dac53, _0x5b68e3) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x169af2,
                        'key': _0x2dac53
                    }, {
                        'chatId': _0x169af2,
                        'key': _0x2dac53,
                        'value': _0x5b68e3,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x1c32c1) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x1c32c1['message']);
                }
            },
            async 'getSetting'(_0x466545, _0x17dd7c) {
                try {
                    const _0x32c7e6 = await Setting['findOne']({
                        'chatId': _0x466545,
                        'key': _0x17dd7c
                    });
                    return _0x32c7e6 ? _0x32c7e6['value'] : null;
                } catch (_0x2ddd40) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x2ddd40['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x1fc2a8) {
                try {
                    const _0x45efec = await Setting['find']({ 'chatId': _0x1fc2a8 });
                    const _0x42e1aa = {};
                    _0x45efec['forEach'](_0x52d0a7 => {
                        _0x42e1aa[_0x52d0a7['key']] = _0x52d0a7['value'];
                    });
                    return _0x42e1aa;
                } catch (_0x2bd07d) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x2bd07d['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x336650 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x336650['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x336650['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x20b7f7) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x20b7f7['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x355fbb) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x355fbb['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x3b224b) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x3b224b['message']);
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
        pool['on']('error', _0x40a866 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x40a866['message']);
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
                        const _0x257b52 = await pool['connect']();
                        try {
                            await _0x257b52['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x257b52['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x257b52['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x257b52['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x257b52['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x257b52['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x257b52['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x257b52['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x257b52['release']();
                        }
                    } catch (_0x23977) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x23977['message']);
                        this['initPromise'] = null;
                        throw _0x23977;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x286caa, _0x1c2347, _0x439ba2) {
                try {
                    await this['init']();
                    const _0x4ffd92 = await pool['connect']();
                    try {
                        await _0x4ffd92['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x286caa,
                            _0x1c2347,
                            Date['now'](),
                            compress(_0x439ba2)
                        ]);
                    } finally {
                        _0x4ffd92['release']();
                    }
                } catch (_0x3bc969) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x3bc969['message']);
                }
            },
            async 'load'(_0x28d294, _0x24513a) {
                try {
                    await this['init']();
                    const _0x1dbcdb = await pool['connect']();
                    try {
                        const _0x386d84 = await _0x1dbcdb['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x28d294,
                            _0x24513a
                        ]);
                        return _0x386d84['rows'][0x0] ? decompress(_0x386d84['rows'][0x0]['data']) : null;
                    } finally {
                        _0x1dbcdb['release']();
                    }
                } catch (_0x3fbdd3) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x3fbdd3['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x3fd594, _0x2f6348) {
                try {
                    await this['init']();
                    const _0x3f7653 = await pool['connect']();
                    try {
                        await _0x3f7653['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x3fd594,
                            _0x2f6348
                        ]);
                    } finally {
                        _0x3f7653['release']();
                    }
                } catch (_0x35da90) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x35da90['message']);
                }
            },
            async 'getCount'(_0xc9a952, _0x3f0cb6) {
                try {
                    await this['init']();
                    const _0x382980 = await pool['connect']();
                    try {
                        const _0x5c437e = await _0x382980['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0xc9a952,
                            _0x3f0cb6
                        ]);
                        return _0x5c437e['rows'][0x0] ? _0x5c437e['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x382980['release']();
                    }
                } catch (_0x45dadc) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x45dadc['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x3cb9a5 = await pool['connect']();
                    try {
                        const _0x4488e6 = await _0x3cb9a5['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x389b35 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x4488e6['rows']['forEach'](_0x25d88b => {
                            if (!_0x389b35['messageCount'][_0x25d88b['chat_id']]) {
                                _0x389b35['messageCount'][_0x25d88b['chat_id']] = {};
                            }
                            _0x389b35['messageCount'][_0x25d88b['chat_id']][_0x25d88b['user_id']] = _0x25d88b['count'];
                        });
                        const _0x3b6b6b = await _0x3cb9a5['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x3b6b6b['rows'][0x0])
                            _0x389b35['isPublic'] = _0x3b6b6b['rows'][0x0]['value'] === 'true';
                        return _0x389b35;
                    } finally {
                        _0x3cb9a5['release']();
                    }
                } catch (_0x5851a9) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x5851a9['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3c31cd) {
                try {
                    await this['init']();
                    const _0x1a35d7 = await pool['connect']();
                    try {
                        await _0x1a35d7['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x3c31cd['toString']()]);
                    } finally {
                        _0x1a35d7['release']();
                    }
                } catch (_0x1265ee) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x1265ee['message']);
                }
            },
            async 'setMetadata'(_0x2fdf06, _0x4164ff) {
                try {
                    await this['init']();
                    const _0x2cfc00 = await pool['connect']();
                    try {
                        await _0x2cfc00['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x2fdf06,
                            _0x4164ff['toString']()
                        ]);
                    } finally {
                        _0x2cfc00['release']();
                    }
                } catch (_0x2f4b2c) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x2f4b2c['message']);
                }
            },
            async 'getMetadata'(_0x1f1f0d) {
                try {
                    await this['init']();
                    const _0x33f990 = await pool['connect']();
                    try {
                        const _0x356e23 = await _0x33f990['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x1f1f0d]);
                        return _0x356e23['rows'][0x0] ? _0x356e23['rows'][0x0]['value'] : null;
                    } finally {
                        _0x33f990['release']();
                    }
                } catch (_0x5e61c9) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x5e61c9['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x377ded, _0x39ff5f) {
                try {
                    await this['init']();
                    const _0x24cd91 = await pool['connect']();
                    try {
                        await _0x24cd91['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x377ded,
                            _0x39ff5f['name'] || '',
                            _0x39ff5f['notify'] || '',
                            _0x39ff5f['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x24cd91['release']();
                    }
                } catch (_0x3a30cc) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x3a30cc['message']);
                }
            },
            async 'getContact'(_0x4e265d) {
                try {
                    await this['init']();
                    const _0x2aa314 = await pool['connect']();
                    try {
                        const _0x9b1150 = await _0x2aa314['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x4e265d]);
                        return _0x9b1150['rows'][0x0] || null;
                    } finally {
                        _0x2aa314['release']();
                    }
                } catch (_0x44fb3c) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x44fb3c['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x623cbe = await pool['connect']();
                    try {
                        const _0x40f2a8 = await _0x623cbe['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x3c0d68 = {};
                        _0x40f2a8['rows']['forEach'](_0x383790 => {
                            _0x3c0d68[_0x383790['jid']] = {
                                'id': _0x383790['jid'],
                                'name': _0x383790['name'],
                                'notify': _0x383790['notify']
                            };
                        });
                        return _0x3c0d68;
                    } finally {
                        _0x623cbe['release']();
                    }
                } catch (_0x4a3dc8) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x4a3dc8['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x336da5, _0x21ebba) {
                try {
                    await this['init']();
                    const _0x29650d = await pool['connect']();
                    try {
                        await _0x29650d['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x336da5,
                            _0x21ebba['name'] || '',
                            _0x21ebba['conversationTimestamp'] || 0x0,
                            _0x21ebba['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x29650d['release']();
                    }
                } catch (_0xe1e0dc) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0xe1e0dc['message']);
                }
            },
            async 'getChat'(_0x1824c0) {
                try {
                    await this['init']();
                    const _0x3be0f6 = await pool['connect']();
                    try {
                        const _0x16338a = await _0x3be0f6['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x1824c0]);
                        return _0x16338a['rows'][0x0] || null;
                    } finally {
                        _0x3be0f6['release']();
                    }
                } catch (_0x30add4) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x30add4['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x3ea1ac = await pool['connect']();
                    try {
                        const _0x6f3659 = await _0x3ea1ac['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x2c1d3a = {};
                        _0x6f3659['rows']['forEach'](_0x3fef56 => {
                            _0x2c1d3a[_0x3fef56['jid']] = {
                                'id': _0x3fef56['jid'],
                                'name': _0x3fef56['name'],
                                'conversationTimestamp': _0x3fef56['conversation_timestamp'],
                                'unreadCount': _0x3fef56['unread_count']
                            };
                        });
                        return _0x2c1d3a;
                    } finally {
                        _0x3ea1ac['release']();
                    }
                } catch (_0x4f4ec1) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x4f4ec1['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x34af04) {
                try {
                    await this['init']();
                    const _0xb89b97 = await pool['connect']();
                    try {
                        await _0xb89b97['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x34af04]);
                    } finally {
                        _0xb89b97['release']();
                    }
                } catch (_0x3ffe25) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x3ffe25['message']);
                }
            },
            async 'saveSetting'(_0x380d8b, _0x57ef5c, _0x467176) {
                try {
                    await this['init']();
                    const _0x2596d0 = await pool['connect']();
                    try {
                        await _0x2596d0['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x380d8b,
                            _0x57ef5c,
                            JSON['stringify'](_0x467176),
                            Date['now']()
                        ]);
                    } finally {
                        _0x2596d0['release']();
                    }
                } catch (_0x5dc316) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x5dc316['message']);
                }
            },
            async 'getSetting'(_0x946317, _0x2b00d3) {
                try {
                    await this['init']();
                    const _0x5c1d09 = await pool['connect']();
                    try {
                        const _0x426c11 = await _0x5c1d09['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x946317,
                            _0x2b00d3
                        ]);
                        return _0x426c11['rows'][0x0] ? JSON['parse'](_0x426c11['rows'][0x0]['value']) : null;
                    } finally {
                        _0x5c1d09['release']();
                    }
                } catch (_0xb0d8f6) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0xb0d8f6['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x5a7783) {
                try {
                    await this['init']();
                    const _0x226471 = await pool['connect']();
                    try {
                        const _0x379195 = await _0x226471['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x5a7783]);
                        const _0x5a46c1 = {};
                        _0x379195['rows']['forEach'](_0xf482c0 => {
                            _0x5a46c1[_0xf482c0['key']] = JSON['parse'](_0xf482c0['value']);
                        });
                        return _0x5a46c1;
                    } finally {
                        _0x226471['release']();
                    }
                } catch (_0x3bebe4) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x3bebe4['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x355b00 = await pool['connect']();
                    try {
                        const _0x7d507a = await _0x355b00['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x7d507a['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x7d507a['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x355b00['release']();
                    }
                } catch (_0x1cbdf7) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x1cbdf7['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x484da2) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x484da2['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x5ae22e) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x5ae22e['message']);
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
                    } catch (_0x2f4d77) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x2f4d77['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x2f4d77;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x1ca97b, _0x1b0aee, _0x1d47e4) {
                try {
                    const _0x139852 = await this['getConn']();
                    await _0x139852['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x1ca97b,
                        _0x1b0aee,
                        Date['now'](),
                        compress(_0x1d47e4)
                    ]);
                } catch (_0xf37eea) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0xf37eea['message']);
                }
            },
            async 'load'(_0x47e457, _0x3bb511) {
                try {
                    const _0x56559e = await this['getConn']();
                    const [_0x2c2c25] = await _0x56559e['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x47e457,
                        _0x3bb511
                    ]);
                    return _0x2c2c25[0x0] ? decompress(_0x2c2c25[0x0]['data']) : null;
                } catch (_0x57f9fb) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x57f9fb['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x2d82a4, _0x12f209) {
                try {
                    const _0x17fff4 = await this['getConn']();
                    await _0x17fff4['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x2d82a4,
                        _0x12f209
                    ]);
                } catch (_0x12c580) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x12c580['message']);
                }
            },
            async 'getCount'(_0x383578, _0x4da852) {
                try {
                    const _0x245810 = await this['getConn']();
                    const [_0x230054] = await _0x245810['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x383578,
                        _0x4da852
                    ]);
                    return _0x230054[0x0] ? _0x230054[0x0]['count'] : 0x0;
                } catch (_0x126a0d) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x126a0d['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x187118 = await this['getConn']();
                    const [_0x34a9aa] = await _0x187118['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x529e67 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x34a9aa['forEach'](_0x5235e6 => {
                        if (!_0x529e67['messageCount'][_0x5235e6['chat_id']]) {
                            _0x529e67['messageCount'][_0x5235e6['chat_id']] = {};
                        }
                        _0x529e67['messageCount'][_0x5235e6['chat_id']][_0x5235e6['user_id']] = _0x5235e6['count'];
                    });
                    const [_0x2686ee] = await _0x187118['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x2686ee[0x0])
                        _0x529e67['isPublic'] = _0x2686ee[0x0]['value'] === 'true';
                    return _0x529e67;
                } catch (_0x16d15e) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x16d15e['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x4b9fdc) {
                try {
                    const _0x2548bf = await this['getConn']();
                    await _0x2548bf['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x4b9fdc['toString']()]);
                } catch (_0x5a6a46) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x5a6a46['message']);
                }
            },
            async 'setMetadata'(_0x47aaff, _0x2c3bcc) {
                try {
                    const _0x59de70 = await this['getConn']();
                    await _0x59de70['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x47aaff,
                        _0x2c3bcc['toString']()
                    ]);
                } catch (_0x777e90) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x777e90['message']);
                }
            },
            async 'getMetadata'(_0x3173cc) {
                try {
                    const _0x1eeb06 = await this['getConn']();
                    const [_0x562e78] = await _0x1eeb06['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x3173cc]);
                    return _0x562e78[0x0] ? _0x562e78[0x0]['value'] : null;
                } catch (_0x144430) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x144430['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x4cbad9, _0xe14f6f) {
                try {
                    const _0x3ef444 = await this['getConn']();
                    await _0x3ef444['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x4cbad9,
                        _0xe14f6f['name'] || '',
                        _0xe14f6f['notify'] || '',
                        _0xe14f6f['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x4fea69) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x4fea69['message']);
                }
            },
            async 'getContact'(_0x289595) {
                try {
                    const _0x4b19cf = await this['getConn']();
                    const [_0x4ec36d] = await _0x4b19cf['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x289595]);
                    return _0x4ec36d[0x0] || null;
                } catch (_0x3bccb3) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x3bccb3['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x120b77 = await this['getConn']();
                    const [_0x5548c] = await _0x120b77['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x1affff = {};
                    _0x5548c['forEach'](_0x220acb => {
                        _0x1affff[_0x220acb['jid']] = {
                            'id': _0x220acb['jid'],
                            'name': _0x220acb['name'],
                            'notify': _0x220acb['notify']
                        };
                    });
                    return _0x1affff;
                } catch (_0x4a7c8d) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x4a7c8d['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x5d3473, _0x5f3c10) {
                try {
                    const _0x40e96c = await this['getConn']();
                    await _0x40e96c['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x5d3473,
                        _0x5f3c10['name'] || '',
                        _0x5f3c10['conversationTimestamp'] || 0x0,
                        _0x5f3c10['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x4bfc30) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x4bfc30['message']);
                }
            },
            async 'getChat'(_0x315ff3) {
                try {
                    const _0x379aa2 = await this['getConn']();
                    const [_0x1c797a] = await _0x379aa2['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x315ff3]);
                    return _0x1c797a[0x0] || null;
                } catch (_0x496953) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x496953['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x5c92f5 = await this['getConn']();
                    const [_0x2a47c7] = await _0x5c92f5['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x1cc794 = {};
                    _0x2a47c7['forEach'](_0x50e876 => {
                        _0x1cc794[_0x50e876['jid']] = {
                            'id': _0x50e876['jid'],
                            'name': _0x50e876['name'],
                            'conversationTimestamp': _0x50e876['conversation_timestamp'],
                            'unreadCount': _0x50e876['unread_count']
                        };
                    });
                    return _0x1cc794;
                } catch (_0x19a140) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x19a140['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x4ca2e8) {
                try {
                    const _0x25ef59 = await this['getConn']();
                    await _0x25ef59['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x4ca2e8]);
                } catch (_0x4175ea) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x4175ea['message']);
                }
            },
            async 'saveSetting'(_0x2e2c74, _0x51a7f7, _0x30b8b) {
                try {
                    const _0x5321e1 = await this['getConn']();
                    await _0x5321e1['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x2e2c74,
                        _0x51a7f7,
                        JSON['stringify'](_0x30b8b),
                        Date['now']()
                    ]);
                } catch (_0x1eb060) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x1eb060['message']);
                }
            },
            async 'getSetting'(_0x1f9222, _0x17793e) {
                try {
                    const _0x1828a0 = await this['getConn']();
                    const [_0x3ed07c] = await _0x1828a0['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x1f9222,
                        _0x17793e
                    ]);
                    return _0x3ed07c[0x0] ? JSON['parse'](_0x3ed07c[0x0]['value']) : null;
                } catch (_0x35401b) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x35401b['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0xf0d325) {
                try {
                    const _0x1a98b3 = await this['getConn']();
                    const [_0x5c174c] = await _0x1a98b3['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0xf0d325]);
                    const _0x3f3357 = {};
                    _0x5c174c['forEach'](_0x383fc1 => {
                        _0x3f3357[_0x383fc1['key']] = JSON['parse'](_0x383fc1['value']);
                    });
                    return _0x3f3357;
                } catch (_0x27e67b) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x27e67b['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x524ab2 = await this['getConn']();
                    const [_0x59cf22] = await _0x524ab2['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x59cf22['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x59cf22['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x32d1f3) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x32d1f3['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0x2fcaa6) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0x2fcaa6['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x46617f) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x46617f['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x3c4071['dirname'](SQLITE_URL);
        if (!_0x0_0x5ef238['existsSync'](dir))
            _0x0_0x5ef238['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x325753, _0x524dff, _0xb18046) {
                try {
                    saveStmt['run'](_0x325753, _0x524dff, Date['now'](), compress(_0xb18046));
                    const {count: _0x422a27} = countStmt['get'](_0x325753);
                    if (_0x422a27 > MESSAGE_LIMITS['sqlite']) {
                        const _0x2a669c = _0x422a27 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x325753, _0x325753, _0x2a669c);
                    }
                } catch (_0x26827d) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x26827d['message']);
                }
            },
            'load'(_0x291f2b, _0x556f56) {
                try {
                    const _0x4bc0d9 = loadStmt['get'](_0x291f2b, _0x556f56);
                    return _0x4bc0d9 ? decompress(_0x4bc0d9['data']) : null;
                } catch (_0x1e23da) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x1e23da['message']);
                    return null;
                }
            },
            'incrementCount'(_0xa85931, _0x52b10b) {
                try {
                    incrementCountStmt['run'](_0xa85931, _0x52b10b);
                } catch (_0x262aaa) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x262aaa['message']);
                }
            },
            'getCount'(_0x243148, _0x456156) {
                try {
                    const _0x596e5c = getCountStmt['get'](_0x243148, _0x456156);
                    return _0x596e5c ? _0x596e5c['count'] : 0x0;
                } catch (_0xc5c12e) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0xc5c12e['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x53593b = getAllCountsStmt['all']();
                    const _0x6d54a3 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x53593b['forEach'](_0x57bd65 => {
                        if (!_0x6d54a3['messageCount'][_0x57bd65['chat_id']]) {
                            _0x6d54a3['messageCount'][_0x57bd65['chat_id']] = {};
                        }
                        _0x6d54a3['messageCount'][_0x57bd65['chat_id']][_0x57bd65['user_id']] = _0x57bd65['count'];
                    });
                    const _0xe36d45 = getMetaStmt['get']();
                    if (_0xe36d45)
                        _0x6d54a3['isPublic'] = _0xe36d45['value'] === 'true';
                    return _0x6d54a3;
                } catch (_0x14fbdc) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x14fbdc['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x38d16f) {
                try {
                    setMetaStmt['run'](_0x38d16f['toString']());
                } catch (_0x3ebbc0) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x3ebbc0['message']);
                }
            },
            'setMetadata'(_0x21693e, _0x8e90c1) {
                try {
                    setMetadataStmt['run'](_0x21693e, _0x8e90c1['toString']());
                } catch (_0x85f5d2) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x85f5d2['message']);
                }
            },
            'getMetadata'(_0xd864e5) {
                try {
                    const _0x21417e = getMetadataStmt['get'](_0xd864e5);
                    return _0x21417e ? _0x21417e['value'] : null;
                } catch (_0x4f1ae3) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x4f1ae3['message']);
                    return null;
                }
            },
            'saveContact'(_0x1e4be2, _0x2ed5ba) {
                try {
                    saveContactStmt['run'](_0x1e4be2, _0x2ed5ba['name'] || '', _0x2ed5ba['notify'] || '', _0x2ed5ba['verifiedName'] || '', Date['now']());
                } catch (_0x519ee1) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x519ee1['message']);
                }
            },
            'getContact'(_0x1a4599) {
                try {
                    return getContactStmt['get'](_0x1a4599) || null;
                } catch (_0x1160e4) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x1160e4['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x4fec31 = getAllContactsStmt['all']();
                    const _0x2908af = {};
                    _0x4fec31['forEach'](_0x5a132 => {
                        _0x2908af[_0x5a132['jid']] = {
                            'id': _0x5a132['jid'],
                            'name': _0x5a132['name'],
                            'notify': _0x5a132['notify']
                        };
                    });
                    return _0x2908af;
                } catch (_0x50b8c0) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x50b8c0['message']);
                    return {};
                }
            },
            'saveChat'(_0x453c47, _0x522814) {
                try {
                    saveChatStmt['run'](_0x453c47, _0x522814['name'] || '', _0x522814['conversationTimestamp'] || 0x0, _0x522814['unreadCount'] || 0x0, Date['now']());
                } catch (_0x4fc38e) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x4fc38e['message']);
                }
            },
            'getChat'(_0x42fcea) {
                try {
                    return getChatStmt['get'](_0x42fcea) || null;
                } catch (_0x4705f8) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x4705f8['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x509798 = getAllChatsStmt['all']();
                    const _0x4bb8e7 = {};
                    _0x509798['forEach'](_0x398d46 => {
                        _0x4bb8e7[_0x398d46['jid']] = {
                            'id': _0x398d46['jid'],
                            'name': _0x398d46['name'],
                            'conversationTimestamp': _0x398d46['conversation_timestamp'],
                            'unreadCount': _0x398d46['unread_count']
                        };
                    });
                    return _0x4bb8e7;
                } catch (_0x2ba304) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x2ba304['message']);
                    return {};
                }
            },
            'deleteChat'(_0x5c24cb) {
                try {
                    deleteChatStmt['run'](_0x5c24cb);
                } catch (_0x45a6d7) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x45a6d7['message']);
                }
            },
            'saveSetting'(_0x2ab44b, _0x4cc60e, _0x43b6b3) {
                try {
                    saveSettingStmt['run'](_0x2ab44b, _0x4cc60e, JSON['stringify'](_0x43b6b3), Date['now']());
                } catch (_0x50512e) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x50512e['message']);
                }
            },
            'getSetting'(_0x244e9b, _0xb72e6d) {
                try {
                    const _0x56e599 = getSettingStmt['get'](_0x244e9b, _0xb72e6d);
                    return _0x56e599 ? JSON['parse'](_0x56e599['value']) : null;
                } catch (_0x21f64e) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x21f64e['message']);
                    return null;
                }
            },
            'getAllSettings'(_0xe2fc02) {
                try {
                    const _0x4f21b0 = getAllSettingsStmt['all'](_0xe2fc02);
                    const _0x34006 = {};
                    _0x4f21b0['forEach'](_0x378de3 => {
                        _0x34006[_0x378de3['key']] = JSON['parse'](_0x378de3['value']);
                    });
                    return _0x34006;
                } catch (_0x4bac85) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x4bac85['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x79611e = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x79611e['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x79611e['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x2b4483) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x2b4483['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x4629de) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x4629de['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x2f51ab) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x2f51ab['message']);
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
    async 'readFromFile'(_0x14106e = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x1b62a3 = await adapters[backend]['getAllContacts']();
                const _0x2d876e = await adapters[backend]['getAllChats']();
                const _0x2a2f91 = await this['getBotMode']();
                this['contacts'] = _0x1b62a3;
                this['chats'] = _0x2d876e;
                this['botMode'] = _0x2a2f91;
            } else {
                if (_0x0_0x5ef238['existsSync'](_0x14106e)) {
                    const _0x5ae885 = JSON['parse'](_0x0_0x5ef238['readFileSync'](_0x14106e, 'utf-8'));
                    this['contacts'] = _0x5ae885['contacts'] || {};
                    this['chats'] = _0x5ae885['chats'] || {};
                    this['botMode'] = _0x5ae885['botMode'] || 'private';
                    this['messages'] = _0x5ae885['messages'] || {};
                    this['isPublic'] = _0x5ae885['isPublic'] !== undefined ? _0x5ae885['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x18b70d) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x18b70d['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x41b4b0 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x387226 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x5ef238['writeFileSync'](_0x41b4b0, JSON['stringify'](_0x387226, null, 0x2));
        } catch (_0x2812b0) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x2812b0['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x5ef238['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x47212c = JSON['parse'](_0x0_0x5ef238['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x47212c['messageCount'] || _0x47212c;
                    this['isPublic'] = typeof _0x47212c['isPublic'] === 'boolean' ? _0x47212c['isPublic'] : ![];
                }
            } catch (_0x26b524) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x26b524['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x416112 = _0x0_0x3c4071['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x5ef238['existsSync'](_0x416112))
                    _0x0_0x5ef238['mkdirSync'](_0x416112, { 'recursive': !![] });
                const _0x20b817 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x5ef238['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x20b817, null, 0x2));
            } catch (_0x2c069d) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x2c069d['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x5a83a7 => {
                if (typeof this['messages'][_0x5a83a7] === 'object' && !Array['isArray'](this['messages'][_0x5a83a7])) {
                    const _0x2a63e2 = Object['values'](this['messages'][_0x5a83a7]);
                    this['messages'][_0x5a83a7] = _0x2a63e2['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x5a83a7])) {
                    if (this['messages'][_0x5a83a7]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x5a83a7] = this['messages'][_0x5a83a7]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x19c648 => {
                if (this['chats'][_0x19c648]['messages']) {
                    delete this['chats'][_0x19c648]['messages'];
                }
            });
        }
    },
    'bind'(_0x270f8f) {
        _0x270f8f['on']('messages.upsert', async ({messages: _0x34e22d}) => {
            for (const _0x2f2b5e of _0x34e22d) {
                if (!_0x2f2b5e['key']?.['remoteJid'])
                    continue;
                const _0xc054ef = _0x2f2b5e['key']['remoteJid'];
                const _0x38ab5e = slimMessage(_0x2f2b5e);
                if (backend === 'memory') {
                    this['messages'][_0xc054ef] = this['messages'][_0xc054ef] || [];
                    this['messages'][_0xc054ef]['push'](_0x38ab5e);
                    if (this['messages'][_0xc054ef]['length'] > MAX_MESSAGES) {
                        this['messages'][_0xc054ef] = this['messages'][_0xc054ef]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0xc054ef, _0x2f2b5e['key']['id'], _0x38ab5e);
                    } catch (_0x497477) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x2f2b5e['key']['id'] + ':', _0x497477['message']);
                    }
                }
            }
        });
        _0x270f8f['on']('contacts.update', async _0x4d2f26 => {
            for (const _0x43433c of _0x4d2f26) {
                if (_0x43433c['id']) {
                    const _0x453be5 = {
                        'id': _0x43433c['id'],
                        'name': _0x43433c['notify'] || _0x43433c['name'] || _0x43433c['verifiedName'] || '',
                        'notify': _0x43433c['notify'],
                        'verifiedName': _0x43433c['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x43433c['id']] = _0x453be5;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x43433c['id'], _0x453be5);
                        } catch (_0x185b24) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x185b24['message']);
                        }
                    }
                }
            }
        });
        _0x270f8f['on']('contacts.set', async _0x3118de => {
            for (const _0x2b9615 of _0x3118de) {
                if (_0x2b9615['id']) {
                    const _0x2d3eb7 = {
                        'id': _0x2b9615['id'],
                        'name': _0x2b9615['notify'] || _0x2b9615['name'] || _0x2b9615['verifiedName'] || '',
                        'notify': _0x2b9615['notify'],
                        'verifiedName': _0x2b9615['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x2b9615['id']] = _0x2d3eb7;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x2b9615['id'], _0x2d3eb7);
                        } catch (_0x53767c) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x53767c['message']);
                        }
                    }
                }
            }
        });
        _0x270f8f['on']('chats.set', async _0x30ce0c => {
            for (const _0x2ea3eb of _0x30ce0c) {
                if (_0x2ea3eb['id']) {
                    const _0xa20673 = {
                        'id': _0x2ea3eb['id'],
                        'name': _0x2ea3eb['name'] || _0x2ea3eb['subject'] || '',
                        'conversationTimestamp': _0x2ea3eb['conversationTimestamp'],
                        'unreadCount': _0x2ea3eb['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x2ea3eb['id']] = _0xa20673;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x2ea3eb['id'], _0xa20673);
                        } catch (_0x276e1a) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x276e1a['message']);
                        }
                    }
                }
            }
        });
        _0x270f8f['on']('chats.update', async _0x38b9a3 => {
            for (const _0x527fdd of _0x38b9a3) {
                if (_0x527fdd['id']) {
                    if (backend === 'memory') {
                        const _0x22aa5f = this['chats'][_0x527fdd['id']] || {};
                        this['chats'][_0x527fdd['id']] = {
                            'id': _0x527fdd['id'],
                            'name': _0x527fdd['name'] || _0x527fdd['subject'] || _0x22aa5f['name'] || '',
                            'conversationTimestamp': _0x527fdd['conversationTimestamp'] || _0x22aa5f['conversationTimestamp'],
                            'unreadCount': _0x527fdd['unreadCount'] !== undefined ? _0x527fdd['unreadCount'] : _0x22aa5f['unreadCount']
                        };
                    } else {
                        try {
                            const _0x335848 = await adapters[backend]['getChat'](_0x527fdd['id']) || {};
                            const _0x246e54 = {
                                'id': _0x527fdd['id'],
                                'name': _0x527fdd['name'] || _0x527fdd['subject'] || _0x335848['name'] || '',
                                'conversationTimestamp': _0x527fdd['conversationTimestamp'] || _0x335848['conversation_timestamp'],
                                'unreadCount': _0x527fdd['unreadCount'] !== undefined ? _0x527fdd['unreadCount'] : _0x335848['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x527fdd['id'], _0x246e54);
                        } catch (_0x4fa562) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x4fa562['message']);
                        }
                    }
                }
            }
        });
        _0x270f8f['on']('chats.delete', async _0xb24406 => {
            for (const _0x4d5028 of _0xb24406) {
                if (backend === 'memory') {
                    delete this['chats'][_0x4d5028];
                    delete this['messages'][_0x4d5028];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x4d5028);
                    } catch (_0x1b6faa) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x1b6faa['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x37be0b, _0x109f74) {
        if (backend === 'memory') {
            const _0x9fe07f = this['messages'][_0x37be0b]?.['find'](_0x1567b2 => _0x1567b2['key']['id'] === _0x109f74) || null;
            return _0x9fe07f;
        } else {
            try {
                return await adapters[backend]['load'](_0x37be0b, _0x109f74);
            } catch (_0x5eff4d) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x109f74 + ':', _0x5eff4d['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x13a5d6, _0x58d68c, _0x229440) {
        if (backend === 'memory') {
            const _0x49993d = './data';
            if (!_0x0_0x5ef238['existsSync'](_0x49993d))
                _0x0_0x5ef238['mkdirSync'](_0x49993d, { 'recursive': !![] });
            const _0x540b83 = _0x0_0x3c4071['join'](_0x49993d, _0x58d68c + '.json');
            try {
                _0x0_0x5ef238['writeFileSync'](_0x540b83, JSON['stringify'](_0x229440, null, 0x2));
            } catch (_0x4a2cfc) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x58d68c + ':', _0x4a2cfc['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x13a5d6, _0x58d68c, _0x229440);
            } catch (_0xb20d70) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x58d68c + ':', _0xb20d70['message']);
            }
        }
    },
    async 'getSetting'(_0x3f3284, _0x13b3bd) {
        if (backend === 'memory') {
            const _0x5be8b5 = './data';
            const _0xe5fc88 = _0x0_0x3c4071['join'](_0x5be8b5, _0x13b3bd + '.json');
            try {
                if (_0x0_0x5ef238['existsSync'](_0xe5fc88)) {
                    const _0x2331d1 = JSON['parse'](_0x0_0x5ef238['readFileSync'](_0xe5fc88, 'utf-8'));
                    if (_0x2331d1['enabled'] !== undefined)
                        return _0x2331d1;
                    if (_0x2331d1[_0x3f3284] !== undefined)
                        return _0x2331d1[_0x3f3284];
                    return null;
                }
                return null;
            } catch (_0x3e12b3) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x13b3bd + ':', _0x3e12b3['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x3f3284, _0x13b3bd);
            } catch (_0x1562c8) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x13b3bd + ':', _0x1562c8['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x56a0b6) {
        if (backend === 'memory') {
            const _0x1fb77f = './data';
            const _0x54f759 = {};
            try {
                if (_0x0_0x5ef238['existsSync'](_0x1fb77f)) {
                    const _0x5d64ea = _0x0_0x5ef238['readdirSync'](_0x1fb77f)['filter'](_0x152a86 => _0x152a86['endsWith']('.json'));
                    for (const _0x1e0821 of _0x5d64ea) {
                        const _0x59f1e5 = _0x0_0x3c4071['basename'](_0x1e0821, '.json');
                        if (_0x59f1e5 === 'messageCount' || _0x59f1e5 === 'owner')
                            continue;
                        const _0x1f77db = _0x0_0x3c4071['join'](_0x1fb77f, _0x1e0821);
                        const _0x320433 = JSON['parse'](_0x0_0x5ef238['readFileSync'](_0x1f77db, 'utf-8'));
                        if (_0x320433[_0x56a0b6]) {
                            _0x54f759[_0x59f1e5] = _0x320433[_0x56a0b6];
                        }
                    }
                }
                return _0x54f759;
            } catch (_0x12c31f) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x12c31f['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x56a0b6);
            } catch (_0x40574f) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x40574f['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x4fe51c) {
        const _0x5c0768 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x5c0768['includes'](_0x4fe51c)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x4fe51c + ',\x20defaulting\x20to\x20private');
            _0x4fe51c = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x4fe51c;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x4fe51c);
            } catch (_0x5e5d71) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x5e5d71['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x1ff0b1 = await adapters[backend]['getMetadata']('botMode');
                return _0x1ff0b1 || 'private';
            } catch (_0x5f8c2b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x5f8c2b['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x4184cc, _0x4fc5de, _0x3161d9) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x4184cc]) {
                this['messageCount'][_0x4184cc] = {};
            }
            if (!this['messageCount'][_0x4184cc][_0x4fc5de]) {
                this['messageCount'][_0x4184cc][_0x4fc5de] = 0x0;
            }
            this['messageCount'][_0x4184cc][_0x4fc5de]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x4184cc, _0x4fc5de);
            } catch (_0x32cdbd) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x4fc5de + ':', _0x32cdbd['message']);
            }
        }
    },
    async 'getMessageCount'(_0x265b91, _0x1419dc) {
        if (backend === 'memory') {
            return this['messageCount'][_0x265b91]?.[_0x1419dc] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x265b91, _0x1419dc);
            } catch (_0x33bf61) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x1419dc + ':', _0x33bf61['message']);
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
            } catch (_0xa290ef) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0xa290ef['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x37134c) {
        if (backend === 'memory') {
            this['isPublic'] = _0x37134c;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x37134c);
            } catch (_0x21840b) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x21840b['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x3e75a = await adapters[backend]['getAllCounts']();
                return _0x3e75a['isPublic'];
            } catch (_0x30bc75) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x30bc75['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x72dc66) {
        const _0x238c18 = [
            'public',
            'private'
        ];
        if (!_0x238c18['includes'](_0x72dc66)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x72dc66);
            _0x72dc66 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x72dc66;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x72dc66);
            } catch (_0xbbd3e4) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0xbbd3e4['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x4737a8 = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x4737a8 || 'private';
            } catch (_0x41db72) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x41db72['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x5e06d0 = 0x0;
        const _0x281186 = Object['keys'](this['contacts'])['length'];
        const _0x27071e = Object['keys'](this['chats'])['length'];
        let _0x3ee6ea = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x694c49 => {
                if (Array['isArray'](_0x694c49)) {
                    _0x5e06d0 += _0x694c49['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x111b98 => {
                if (typeof _0x111b98 === 'object') {
                    _0x3ee6ea += Object['keys'](_0x111b98)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x5e06d0 : 'stored\x20in\x20database',
            'contacts': _0x281186,
            'chats': _0x27071e,
            'messageCounts': backend === 'memory' ? _0x3ee6ea : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x3dda8c => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x3dda8c));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x149511 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x149511));
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
        let _0x47617f = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x4f271a => {
            if (store['chats'][_0x4f271a]['messages']) {
                delete store['chats'][_0x4f271a]['messages'];
                _0x47617f++;
            }
        });
        if (_0x47617f > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x47617f + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0xdf29f3 => {
    console['log']('[STORE]\x20Received\x20' + _0xdf29f3 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x436392) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x436392['message']);
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
process['on']('uncaughtException', _0x54fc95 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x54fc95);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x2e6e9a, _0x3af877) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x3af877, 'reason:', _0x2e6e9a);
});
export default store;