import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x260641 from 'fs';
import _0x0_0xaf1186 from 'path';
import _0x0_0x98e9b8 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0xbcf0b1) {
    printLog = (_0xc7da13, _0x40c9c5) => console['log']('[' + _0xc7da13['toUpperCase']() + ']\x20' + _0x40c9c5);
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
} catch (_0x0_0x2e9293) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x400ac2 => {
    try {
        return _0x0_0x98e9b8['deflateSync'](JSON['stringify'](_0x400ac2));
    } catch (_0x308727) {
        console['error']('[STORE]\x20Compression\x20error:', _0x308727['message']);
        return Buffer['from'](JSON['stringify'](_0x400ac2));
    }
};
const decompress = _0x16b0a2 => {
    try {
        return JSON['parse'](_0x0_0x98e9b8['inflateSync'](_0x16b0a2));
    } catch (_0x330afc) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x330afc['message']);
        try {
            return JSON['parse'](_0x16b0a2['toString']());
        } catch (_0x3d9be4) {
            return null;
        }
    }
};
function slimMessage(_0x525df8) {
    return {
        'key': _0x525df8['key'],
        'message': _0x525df8['message'],
        'messageTimestamp': _0x525df8['messageTimestamp'],
        'participant': _0x525df8['participant'],
        'pushName': _0x525df8['pushName'],
        'broadcast': _0x525df8['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x52999f => console['error']('[MONGO]\x20Connection\x20error:', _0x52999f));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0xec4444, _0x485b97, _0x52b30f) {
                try {
                    await Msg['updateOne']({
                        'jid': _0xec4444,
                        'id': _0x485b97
                    }, {
                        'data': compress(_0x52b30f),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x487b2d) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x487b2d['message']);
                }
            },
            async 'load'(_0x4a572f, _0x4b1763) {
                try {
                    const _0x2ba56a = await Msg['findOne']({
                        'jid': _0x4a572f,
                        'id': _0x4b1763
                    });
                    return _0x2ba56a ? decompress(_0x2ba56a['data']) : null;
                } catch (_0x3621a6) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x3621a6['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x340823, _0x307735) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x340823,
                        'userId': _0x307735
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x27b08e) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x27b08e['message']);
                }
            },
            async 'getCount'(_0x247e6a, _0x2c485b) {
                try {
                    const _0x4e18b7 = await MsgCount['findOne']({
                        'chatId': _0x247e6a,
                        'userId': _0x2c485b
                    });
                    return _0x4e18b7 ? _0x4e18b7['count'] : 0x0;
                } catch (_0x1cadd3) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x1cadd3['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x3e32c3 = await MsgCount['find']({});
                    const _0x5759e5 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3e32c3['forEach'](_0x4f6496 => {
                        if (!_0x5759e5['messageCount'][_0x4f6496['chatId']]) {
                            _0x5759e5['messageCount'][_0x4f6496['chatId']] = {};
                        }
                        _0x5759e5['messageCount'][_0x4f6496['chatId']][_0x4f6496['userId']] = _0x4f6496['count'];
                    });
                    const _0x5b4cd7 = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x5b4cd7)
                        _0x5759e5['isPublic'] = _0x5b4cd7['value'] === 'true';
                    return _0x5759e5;
                } catch (_0x1fd670) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x1fd670['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x3e43ff) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x3e43ff['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x1b9be2) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x1b9be2['message']);
                }
            },
            async 'setMetadata'(_0x5c076a, _0x361b47) {
                try {
                    await Meta['updateOne']({ 'key': _0x5c076a }, {
                        'key': _0x5c076a,
                        'value': _0x361b47['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x42432f) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x42432f['message']);
                }
            },
            async 'getMetadata'(_0x1c5c82) {
                try {
                    const _0x46fec8 = await Meta['findOne']({ 'key': _0x1c5c82 });
                    return _0x46fec8 ? _0x46fec8['value'] : null;
                } catch (_0xebed8a) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0xebed8a['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x235748, _0x4e743e) {
                try {
                    await Contact['updateOne']({ 'jid': _0x235748 }, {
                        ..._0x4e743e,
                        'jid': _0x235748,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x35472f) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x35472f['message']);
                }
            },
            async 'getContact'(_0x453898) {
                try {
                    return await Contact['findOne']({ 'jid': _0x453898 });
                } catch (_0x132c1b) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x132c1b['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x7c6ceb = await Contact['find']({});
                    const _0xc49c5a = {};
                    _0x7c6ceb['forEach'](_0x44af83 => {
                        _0xc49c5a[_0x44af83['jid']] = {
                            'id': _0x44af83['jid'],
                            'name': _0x44af83['name'],
                            'notify': _0x44af83['notify']
                        };
                    });
                    return _0xc49c5a;
                } catch (_0x2f9d28) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x2f9d28['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x4c5641, _0x1bf7c3) {
                try {
                    await Chat['updateOne']({ 'jid': _0x4c5641 }, {
                        ..._0x1bf7c3,
                        'jid': _0x4c5641,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x590fd0) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x590fd0['message']);
                }
            },
            async 'getChat'(_0x3c132a) {
                try {
                    return await Chat['findOne']({ 'jid': _0x3c132a });
                } catch (_0x4e6ddf) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x4e6ddf['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x2824dd = await Chat['find']({});
                    const _0x5cb20f = {};
                    _0x2824dd['forEach'](_0x5b64e1 => {
                        _0x5cb20f[_0x5b64e1['jid']] = {
                            'id': _0x5b64e1['jid'],
                            'name': _0x5b64e1['name'],
                            'conversationTimestamp': _0x5b64e1['conversationTimestamp'],
                            'unreadCount': _0x5b64e1['unreadCount']
                        };
                    });
                    return _0x5cb20f;
                } catch (_0x87f7b5) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0x87f7b5['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x4bb5cd) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x4bb5cd });
                } catch (_0x5619e3) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x5619e3['message']);
                }
            },
            async 'saveSetting'(_0x5acec9, _0x2a9060, _0x233535) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x5acec9,
                        'key': _0x2a9060
                    }, {
                        'chatId': _0x5acec9,
                        'key': _0x2a9060,
                        'value': _0x233535,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x51ecca) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x51ecca['message']);
                }
            },
            async 'getSetting'(_0x5bb605, _0x10aeac) {
                try {
                    const _0x15193d = await Setting['findOne']({
                        'chatId': _0x5bb605,
                        'key': _0x10aeac
                    });
                    return _0x15193d ? _0x15193d['value'] : null;
                } catch (_0x218a38) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x218a38['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x43c328) {
                try {
                    const _0x1303dd = await Setting['find']({ 'chatId': _0x43c328 });
                    const _0x417d63 = {};
                    _0x1303dd['forEach'](_0x214746 => {
                        _0x417d63[_0x214746['key']] = _0x214746['value'];
                    });
                    return _0x417d63;
                } catch (_0x26220d) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x26220d['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x3db3eb = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x3db3eb['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x3db3eb['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0x5af6de) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0x5af6de['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x2408d0) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x2408d0['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x1139cf) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x1139cf['message']);
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
        pool['on']('error', _0x122b4b => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x122b4b['message']);
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
                        const _0x5d9dbe = await pool['connect']();
                        try {
                            await _0x5d9dbe['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d9dbe['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0x5d9dbe['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0x5d9dbe['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d9dbe['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d9dbe['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d9dbe['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0x5d9dbe['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0x5d9dbe['release']();
                        }
                    } catch (_0xa35903) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0xa35903['message']);
                        this['initPromise'] = null;
                        throw _0xa35903;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x2ed79d, _0xd8f5aa, _0x545c57) {
                try {
                    await this['init']();
                    const _0x129aa3 = await pool['connect']();
                    try {
                        await _0x129aa3['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x2ed79d,
                            _0xd8f5aa,
                            Date['now'](),
                            compress(_0x545c57)
                        ]);
                    } finally {
                        _0x129aa3['release']();
                    }
                } catch (_0x1cf83d) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x1cf83d['message']);
                }
            },
            async 'load'(_0x289387, _0x2cec7f) {
                try {
                    await this['init']();
                    const _0x1394ce = await pool['connect']();
                    try {
                        const _0x3049fd = await _0x1394ce['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x289387,
                            _0x2cec7f
                        ]);
                        return _0x3049fd['rows'][0x0] ? decompress(_0x3049fd['rows'][0x0]['data']) : null;
                    } finally {
                        _0x1394ce['release']();
                    }
                } catch (_0x283ffa) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x283ffa['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x30d0c6, _0x8706c3) {
                try {
                    await this['init']();
                    const _0x2cf1ef = await pool['connect']();
                    try {
                        await _0x2cf1ef['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x30d0c6,
                            _0x8706c3
                        ]);
                    } finally {
                        _0x2cf1ef['release']();
                    }
                } catch (_0x886da3) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0x886da3['message']);
                }
            },
            async 'getCount'(_0x3ec2e5, _0x5b4f4a) {
                try {
                    await this['init']();
                    const _0x18f4c2 = await pool['connect']();
                    try {
                        const _0x2ad653 = await _0x18f4c2['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x3ec2e5,
                            _0x5b4f4a
                        ]);
                        return _0x2ad653['rows'][0x0] ? _0x2ad653['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x18f4c2['release']();
                    }
                } catch (_0x4ce78b) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x4ce78b['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x59615c = await pool['connect']();
                    try {
                        const _0x279bae = await _0x59615c['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x44c67b = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x279bae['rows']['forEach'](_0x5188d2 => {
                            if (!_0x44c67b['messageCount'][_0x5188d2['chat_id']]) {
                                _0x44c67b['messageCount'][_0x5188d2['chat_id']] = {};
                            }
                            _0x44c67b['messageCount'][_0x5188d2['chat_id']][_0x5188d2['user_id']] = _0x5188d2['count'];
                        });
                        const _0x23bb0f = await _0x59615c['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x23bb0f['rows'][0x0])
                            _0x44c67b['isPublic'] = _0x23bb0f['rows'][0x0]['value'] === 'true';
                        return _0x44c67b;
                    } finally {
                        _0x59615c['release']();
                    }
                } catch (_0x299608) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x299608['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x1d3dda) {
                try {
                    await this['init']();
                    const _0x5390d3 = await pool['connect']();
                    try {
                        await _0x5390d3['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x1d3dda['toString']()]);
                    } finally {
                        _0x5390d3['release']();
                    }
                } catch (_0x4ca35f) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x4ca35f['message']);
                }
            },
            async 'setMetadata'(_0x1fe50b, _0x3ac6a8) {
                try {
                    await this['init']();
                    const _0x5b3d05 = await pool['connect']();
                    try {
                        await _0x5b3d05['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x1fe50b,
                            _0x3ac6a8['toString']()
                        ]);
                    } finally {
                        _0x5b3d05['release']();
                    }
                } catch (_0x1e29ea) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x1e29ea['message']);
                }
            },
            async 'getMetadata'(_0x5a70b2) {
                try {
                    await this['init']();
                    const _0x2a7281 = await pool['connect']();
                    try {
                        const _0x1a521c = await _0x2a7281['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x5a70b2]);
                        return _0x1a521c['rows'][0x0] ? _0x1a521c['rows'][0x0]['value'] : null;
                    } finally {
                        _0x2a7281['release']();
                    }
                } catch (_0x15fe33) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x15fe33['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x57eb48, _0x5eb083) {
                try {
                    await this['init']();
                    const _0x2688c4 = await pool['connect']();
                    try {
                        await _0x2688c4['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x57eb48,
                            _0x5eb083['name'] || '',
                            _0x5eb083['notify'] || '',
                            _0x5eb083['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x2688c4['release']();
                    }
                } catch (_0x39f98e) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x39f98e['message']);
                }
            },
            async 'getContact'(_0xbff647) {
                try {
                    await this['init']();
                    const _0x28ee9a = await pool['connect']();
                    try {
                        const _0x23b1f0 = await _0x28ee9a['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0xbff647]);
                        return _0x23b1f0['rows'][0x0] || null;
                    } finally {
                        _0x28ee9a['release']();
                    }
                } catch (_0x38560e) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x38560e['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x5e8074 = await pool['connect']();
                    try {
                        const _0x18a47a = await _0x5e8074['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x49f91c = {};
                        _0x18a47a['rows']['forEach'](_0x1a18a8 => {
                            _0x49f91c[_0x1a18a8['jid']] = {
                                'id': _0x1a18a8['jid'],
                                'name': _0x1a18a8['name'],
                                'notify': _0x1a18a8['notify']
                            };
                        });
                        return _0x49f91c;
                    } finally {
                        _0x5e8074['release']();
                    }
                } catch (_0x4dac4d) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x4dac4d['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x4b2c7d, _0x45c121) {
                try {
                    await this['init']();
                    const _0x5c07fa = await pool['connect']();
                    try {
                        await _0x5c07fa['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x4b2c7d,
                            _0x45c121['name'] || '',
                            _0x45c121['conversationTimestamp'] || 0x0,
                            _0x45c121['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x5c07fa['release']();
                    }
                } catch (_0x1b45d6) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x1b45d6['message']);
                }
            },
            async 'getChat'(_0x136e4b) {
                try {
                    await this['init']();
                    const _0x2fabd2 = await pool['connect']();
                    try {
                        const _0x407af3 = await _0x2fabd2['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x136e4b]);
                        return _0x407af3['rows'][0x0] || null;
                    } finally {
                        _0x2fabd2['release']();
                    }
                } catch (_0x482862) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0x482862['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x59b4cc = await pool['connect']();
                    try {
                        const _0x252bdb = await _0x59b4cc['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x32f3e1 = {};
                        _0x252bdb['rows']['forEach'](_0x4d7eb3 => {
                            _0x32f3e1[_0x4d7eb3['jid']] = {
                                'id': _0x4d7eb3['jid'],
                                'name': _0x4d7eb3['name'],
                                'conversationTimestamp': _0x4d7eb3['conversation_timestamp'],
                                'unreadCount': _0x4d7eb3['unread_count']
                            };
                        });
                        return _0x32f3e1;
                    } finally {
                        _0x59b4cc['release']();
                    }
                } catch (_0x358ac3) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x358ac3['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x568d35) {
                try {
                    await this['init']();
                    const _0x2f6f73 = await pool['connect']();
                    try {
                        await _0x2f6f73['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x568d35]);
                    } finally {
                        _0x2f6f73['release']();
                    }
                } catch (_0x55ac9a) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0x55ac9a['message']);
                }
            },
            async 'saveSetting'(_0x5279ce, _0x32a2ca, _0x294a1f) {
                try {
                    await this['init']();
                    const _0x2825fd = await pool['connect']();
                    try {
                        await _0x2825fd['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x5279ce,
                            _0x32a2ca,
                            JSON['stringify'](_0x294a1f),
                            Date['now']()
                        ]);
                    } finally {
                        _0x2825fd['release']();
                    }
                } catch (_0x8a1aae) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x8a1aae['message']);
                }
            },
            async 'getSetting'(_0xc03aab, _0xe39081) {
                try {
                    await this['init']();
                    const _0x1b7370 = await pool['connect']();
                    try {
                        const _0x470b51 = await _0x1b7370['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0xc03aab,
                            _0xe39081
                        ]);
                        return _0x470b51['rows'][0x0] ? JSON['parse'](_0x470b51['rows'][0x0]['value']) : null;
                    } finally {
                        _0x1b7370['release']();
                    }
                } catch (_0x2664eb) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x2664eb['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x3367c2) {
                try {
                    await this['init']();
                    const _0x50f020 = await pool['connect']();
                    try {
                        const _0x8dfac9 = await _0x50f020['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x3367c2]);
                        const _0x6ac390 = {};
                        _0x8dfac9['rows']['forEach'](_0x3cf83b => {
                            _0x6ac390[_0x3cf83b['key']] = JSON['parse'](_0x3cf83b['value']);
                        });
                        return _0x6ac390;
                    } finally {
                        _0x50f020['release']();
                    }
                } catch (_0x4af97c) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x4af97c['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x4f3200 = await pool['connect']();
                    try {
                        const _0x55f483 = await _0x4f3200['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x55f483['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x55f483['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x4f3200['release']();
                    }
                } catch (_0xb60448) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0xb60448['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x4420e4) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x4420e4['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x5a7302) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x5a7302['message']);
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
                    } catch (_0x1af148) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x1af148['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x1af148;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x51ac19, _0x3b6a8c, _0x10cfa0) {
                try {
                    const _0x2a7afa = await this['getConn']();
                    await _0x2a7afa['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x51ac19,
                        _0x3b6a8c,
                        Date['now'](),
                        compress(_0x10cfa0)
                    ]);
                } catch (_0xf516f1) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0xf516f1['message']);
                }
            },
            async 'load'(_0x513f91, _0x453652) {
                try {
                    const _0x150291 = await this['getConn']();
                    const [_0x39731f] = await _0x150291['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x513f91,
                        _0x453652
                    ]);
                    return _0x39731f[0x0] ? decompress(_0x39731f[0x0]['data']) : null;
                } catch (_0x26cbe3) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x26cbe3['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x89a681, _0x14ae55) {
                try {
                    const _0x3567c8 = await this['getConn']();
                    await _0x3567c8['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x89a681,
                        _0x14ae55
                    ]);
                } catch (_0x43ad6e) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x43ad6e['message']);
                }
            },
            async 'getCount'(_0x12e870, _0x32efef) {
                try {
                    const _0x464b1b = await this['getConn']();
                    const [_0x40220e] = await _0x464b1b['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x12e870,
                        _0x32efef
                    ]);
                    return _0x40220e[0x0] ? _0x40220e[0x0]['count'] : 0x0;
                } catch (_0x6db7bd) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x6db7bd['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x23eff0 = await this['getConn']();
                    const [_0x2861bb] = await _0x23eff0['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x2d28b0 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2861bb['forEach'](_0x33a5be => {
                        if (!_0x2d28b0['messageCount'][_0x33a5be['chat_id']]) {
                            _0x2d28b0['messageCount'][_0x33a5be['chat_id']] = {};
                        }
                        _0x2d28b0['messageCount'][_0x33a5be['chat_id']][_0x33a5be['user_id']] = _0x33a5be['count'];
                    });
                    const [_0x575af5] = await _0x23eff0['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x575af5[0x0])
                        _0x2d28b0['isPublic'] = _0x575af5[0x0]['value'] === 'true';
                    return _0x2d28b0;
                } catch (_0x3ff8c3) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x3ff8c3['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x1576a1) {
                try {
                    const _0x428420 = await this['getConn']();
                    await _0x428420['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0x1576a1['toString']()]);
                } catch (_0x37990b) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x37990b['message']);
                }
            },
            async 'setMetadata'(_0x9b6d60, _0x3101f4) {
                try {
                    const _0x1da5c0 = await this['getConn']();
                    await _0x1da5c0['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x9b6d60,
                        _0x3101f4['toString']()
                    ]);
                } catch (_0x4b1c8a) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x4b1c8a['message']);
                }
            },
            async 'getMetadata'(_0x530a2d) {
                try {
                    const _0x589c8b = await this['getConn']();
                    const [_0x4c63f2] = await _0x589c8b['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x530a2d]);
                    return _0x4c63f2[0x0] ? _0x4c63f2[0x0]['value'] : null;
                } catch (_0x277a80) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x277a80['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x12d801, _0x28418c) {
                try {
                    const _0x6e2da7 = await this['getConn']();
                    await _0x6e2da7['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x12d801,
                        _0x28418c['name'] || '',
                        _0x28418c['notify'] || '',
                        _0x28418c['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0xe7811) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0xe7811['message']);
                }
            },
            async 'getContact'(_0x1d4a5d) {
                try {
                    const _0x4fed8b = await this['getConn']();
                    const [_0x5679a8] = await _0x4fed8b['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x1d4a5d]);
                    return _0x5679a8[0x0] || null;
                } catch (_0x2b81db) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x2b81db['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x33c839 = await this['getConn']();
                    const [_0x887067] = await _0x33c839['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x4e80fe = {};
                    _0x887067['forEach'](_0x57dd27 => {
                        _0x4e80fe[_0x57dd27['jid']] = {
                            'id': _0x57dd27['jid'],
                            'name': _0x57dd27['name'],
                            'notify': _0x57dd27['notify']
                        };
                    });
                    return _0x4e80fe;
                } catch (_0x48e29f) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x48e29f['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x2c39b0, _0x1d1013) {
                try {
                    const _0x5b6181 = await this['getConn']();
                    await _0x5b6181['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x2c39b0,
                        _0x1d1013['name'] || '',
                        _0x1d1013['conversationTimestamp'] || 0x0,
                        _0x1d1013['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x5cf3eb) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x5cf3eb['message']);
                }
            },
            async 'getChat'(_0x10cb48) {
                try {
                    const _0x565c6d = await this['getConn']();
                    const [_0x190146] = await _0x565c6d['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x10cb48]);
                    return _0x190146[0x0] || null;
                } catch (_0x368fb2) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x368fb2['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x102827 = await this['getConn']();
                    const [_0x1d801a] = await _0x102827['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x36d310 = {};
                    _0x1d801a['forEach'](_0x506679 => {
                        _0x36d310[_0x506679['jid']] = {
                            'id': _0x506679['jid'],
                            'name': _0x506679['name'],
                            'conversationTimestamp': _0x506679['conversation_timestamp'],
                            'unreadCount': _0x506679['unread_count']
                        };
                    });
                    return _0x36d310;
                } catch (_0x5339f1) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x5339f1['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x552747) {
                try {
                    const _0xef216f = await this['getConn']();
                    await _0xef216f['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x552747]);
                } catch (_0x40a7e1) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x40a7e1['message']);
                }
            },
            async 'saveSetting'(_0x59a895, _0x4bb6fe, _0x47003f) {
                try {
                    const _0x116ea2 = await this['getConn']();
                    await _0x116ea2['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x59a895,
                        _0x4bb6fe,
                        JSON['stringify'](_0x47003f),
                        Date['now']()
                    ]);
                } catch (_0x3f46e4) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x3f46e4['message']);
                }
            },
            async 'getSetting'(_0x213917, _0x5e471e) {
                try {
                    const _0x49d180 = await this['getConn']();
                    const [_0x585080] = await _0x49d180['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x213917,
                        _0x5e471e
                    ]);
                    return _0x585080[0x0] ? JSON['parse'](_0x585080[0x0]['value']) : null;
                } catch (_0x10ebb2) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x10ebb2['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x2bbd93) {
                try {
                    const _0x3482c9 = await this['getConn']();
                    const [_0x3f4b10] = await _0x3482c9['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x2bbd93]);
                    const _0xac898b = {};
                    _0x3f4b10['forEach'](_0xe50a8d => {
                        _0xac898b[_0xe50a8d['key']] = JSON['parse'](_0xe50a8d['value']);
                    });
                    return _0xac898b;
                } catch (_0x820d59) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x820d59['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x46a5bc = await this['getConn']();
                    const [_0x4d3cc9] = await _0x46a5bc['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x4d3cc9['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x4d3cc9['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x317470) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x317470['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0xed51be) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0xed51be['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x3a6edb) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x3a6edb['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0xaf1186['dirname'](SQLITE_URL);
        if (!_0x0_0x260641['existsSync'](dir))
            _0x0_0x260641['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x182909, _0x5e55d3, _0x5560b8) {
                try {
                    saveStmt['run'](_0x182909, _0x5e55d3, Date['now'](), compress(_0x5560b8));
                    const {count: _0x256875} = countStmt['get'](_0x182909);
                    if (_0x256875 > MESSAGE_LIMITS['sqlite']) {
                        const _0x2b0771 = _0x256875 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x182909, _0x182909, _0x2b0771);
                    }
                } catch (_0x428c45) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x428c45['message']);
                }
            },
            'load'(_0x2a2081, _0x39b383) {
                try {
                    const _0x29f012 = loadStmt['get'](_0x2a2081, _0x39b383);
                    return _0x29f012 ? decompress(_0x29f012['data']) : null;
                } catch (_0x2b8bfc) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x2b8bfc['message']);
                    return null;
                }
            },
            'incrementCount'(_0x59dc35, _0x261103) {
                try {
                    incrementCountStmt['run'](_0x59dc35, _0x261103);
                } catch (_0x37d969) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x37d969['message']);
                }
            },
            'getCount'(_0x3f32ef, _0x18499d) {
                try {
                    const _0x14244a = getCountStmt['get'](_0x3f32ef, _0x18499d);
                    return _0x14244a ? _0x14244a['count'] : 0x0;
                } catch (_0x4a9d8d) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x4a9d8d['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x2d0407 = getAllCountsStmt['all']();
                    const _0x45f631 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x2d0407['forEach'](_0x317a17 => {
                        if (!_0x45f631['messageCount'][_0x317a17['chat_id']]) {
                            _0x45f631['messageCount'][_0x317a17['chat_id']] = {};
                        }
                        _0x45f631['messageCount'][_0x317a17['chat_id']][_0x317a17['user_id']] = _0x317a17['count'];
                    });
                    const _0x481c9d = getMetaStmt['get']();
                    if (_0x481c9d)
                        _0x45f631['isPublic'] = _0x481c9d['value'] === 'true';
                    return _0x45f631;
                } catch (_0x236731) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x236731['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x14bb84) {
                try {
                    setMetaStmt['run'](_0x14bb84['toString']());
                } catch (_0x513e89) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x513e89['message']);
                }
            },
            'setMetadata'(_0x1271be, _0x1ace2f) {
                try {
                    setMetadataStmt['run'](_0x1271be, _0x1ace2f['toString']());
                } catch (_0x1059f8) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x1059f8['message']);
                }
            },
            'getMetadata'(_0x1864b6) {
                try {
                    const _0xee9fe = getMetadataStmt['get'](_0x1864b6);
                    return _0xee9fe ? _0xee9fe['value'] : null;
                } catch (_0x2aed4d) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x2aed4d['message']);
                    return null;
                }
            },
            'saveContact'(_0x3873f3, _0x5d7e79) {
                try {
                    saveContactStmt['run'](_0x3873f3, _0x5d7e79['name'] || '', _0x5d7e79['notify'] || '', _0x5d7e79['verifiedName'] || '', Date['now']());
                } catch (_0x522159) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x522159['message']);
                }
            },
            'getContact'(_0x41457f) {
                try {
                    return getContactStmt['get'](_0x41457f) || null;
                } catch (_0x4b9a56) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x4b9a56['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x4a2a71 = getAllContactsStmt['all']();
                    const _0x12eb74 = {};
                    _0x4a2a71['forEach'](_0x5ec2dd => {
                        _0x12eb74[_0x5ec2dd['jid']] = {
                            'id': _0x5ec2dd['jid'],
                            'name': _0x5ec2dd['name'],
                            'notify': _0x5ec2dd['notify']
                        };
                    });
                    return _0x12eb74;
                } catch (_0x1dac9b) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x1dac9b['message']);
                    return {};
                }
            },
            'saveChat'(_0x5a3837, _0x57ef56) {
                try {
                    saveChatStmt['run'](_0x5a3837, _0x57ef56['name'] || '', _0x57ef56['conversationTimestamp'] || 0x0, _0x57ef56['unreadCount'] || 0x0, Date['now']());
                } catch (_0x39b842) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x39b842['message']);
                }
            },
            'getChat'(_0x25ab05) {
                try {
                    return getChatStmt['get'](_0x25ab05) || null;
                } catch (_0x5a6532) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x5a6532['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x539054 = getAllChatsStmt['all']();
                    const _0x5d3b42 = {};
                    _0x539054['forEach'](_0x2264d5 => {
                        _0x5d3b42[_0x2264d5['jid']] = {
                            'id': _0x2264d5['jid'],
                            'name': _0x2264d5['name'],
                            'conversationTimestamp': _0x2264d5['conversation_timestamp'],
                            'unreadCount': _0x2264d5['unread_count']
                        };
                    });
                    return _0x5d3b42;
                } catch (_0x4ca791) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x4ca791['message']);
                    return {};
                }
            },
            'deleteChat'(_0x34661d) {
                try {
                    deleteChatStmt['run'](_0x34661d);
                } catch (_0x55590c) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x55590c['message']);
                }
            },
            'saveSetting'(_0x1a1c22, _0x444e2b, _0x3a49ad) {
                try {
                    saveSettingStmt['run'](_0x1a1c22, _0x444e2b, JSON['stringify'](_0x3a49ad), Date['now']());
                } catch (_0x66cfa8) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x66cfa8['message']);
                }
            },
            'getSetting'(_0x150680, _0x376aad) {
                try {
                    const _0x1b0d4d = getSettingStmt['get'](_0x150680, _0x376aad);
                    return _0x1b0d4d ? JSON['parse'](_0x1b0d4d['value']) : null;
                } catch (_0x14f4fc) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x14f4fc['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x3c92f1) {
                try {
                    const _0x5314b6 = getAllSettingsStmt['all'](_0x3c92f1);
                    const _0x38693c = {};
                    _0x5314b6['forEach'](_0x239135 => {
                        _0x38693c[_0x239135['key']] = JSON['parse'](_0x239135['value']);
                    });
                    return _0x38693c;
                } catch (_0x2c4b51) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x2c4b51['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0xa5a427 = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0xa5a427['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0xa5a427['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x51e388) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x51e388['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x8f2378) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x8f2378['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x257d24) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x257d24['message']);
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
    async 'readFromFile'(_0x51b951 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x453e68 = await adapters[backend]['getAllContacts']();
                const _0x44cc34 = await adapters[backend]['getAllChats']();
                const _0x1c2d6d = await this['getBotMode']();
                this['contacts'] = _0x453e68;
                this['chats'] = _0x44cc34;
                this['botMode'] = _0x1c2d6d;
            } else {
                if (_0x0_0x260641['existsSync'](_0x51b951)) {
                    const _0x5b8deb = JSON['parse'](_0x0_0x260641['readFileSync'](_0x51b951, 'utf-8'));
                    this['contacts'] = _0x5b8deb['contacts'] || {};
                    this['chats'] = _0x5b8deb['chats'] || {};
                    this['botMode'] = _0x5b8deb['botMode'] || 'private';
                    this['messages'] = _0x5b8deb['messages'] || {};
                    this['isPublic'] = _0x5b8deb['isPublic'] !== undefined ? _0x5b8deb['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x3cdfe8) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x3cdfe8['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x7d5738 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x229c6d = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x260641['writeFileSync'](_0x7d5738, JSON['stringify'](_0x229c6d, null, 0x2));
        } catch (_0x226318) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x226318['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x260641['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x3d9082 = JSON['parse'](_0x0_0x260641['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x3d9082['messageCount'] || _0x3d9082;
                    this['isPublic'] = typeof _0x3d9082['isPublic'] === 'boolean' ? _0x3d9082['isPublic'] : ![];
                }
            } catch (_0x269b89) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x269b89['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0x2aec4f = _0x0_0xaf1186['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x260641['existsSync'](_0x2aec4f))
                    _0x0_0x260641['mkdirSync'](_0x2aec4f, { 'recursive': !![] });
                const _0x9fb17b = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x260641['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x9fb17b, null, 0x2));
            } catch (_0x12d7f3) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x12d7f3['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x56f5fa => {
                if (typeof this['messages'][_0x56f5fa] === 'object' && !Array['isArray'](this['messages'][_0x56f5fa])) {
                    const _0x102f28 = Object['values'](this['messages'][_0x56f5fa]);
                    this['messages'][_0x56f5fa] = _0x102f28['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x56f5fa])) {
                    if (this['messages'][_0x56f5fa]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x56f5fa] = this['messages'][_0x56f5fa]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x2473e6 => {
                if (this['chats'][_0x2473e6]['messages']) {
                    delete this['chats'][_0x2473e6]['messages'];
                }
            });
        }
    },
    'bind'(_0x303768) {
        _0x303768['on']('messages.upsert', async ({messages: _0x482415}) => {
            for (const _0x523ba4 of _0x482415) {
                if (!_0x523ba4['key']?.['remoteJid'])
                    continue;
                const _0x1a6da5 = _0x523ba4['key']['remoteJid'];
                const _0x449cfa = slimMessage(_0x523ba4);
                if (backend === 'memory') {
                    this['messages'][_0x1a6da5] = this['messages'][_0x1a6da5] || [];
                    this['messages'][_0x1a6da5]['push'](_0x449cfa);
                    if (this['messages'][_0x1a6da5]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x1a6da5] = this['messages'][_0x1a6da5]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x1a6da5, _0x523ba4['key']['id'], _0x449cfa);
                    } catch (_0x2b9249) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x523ba4['key']['id'] + ':', _0x2b9249['message']);
                    }
                }
            }
        });
        _0x303768['on']('contacts.update', async _0x53d8ca => {
            for (const _0x211b0c of _0x53d8ca) {
                if (_0x211b0c['id']) {
                    const _0x55abc2 = {
                        'id': _0x211b0c['id'],
                        'name': _0x211b0c['notify'] || _0x211b0c['name'] || _0x211b0c['verifiedName'] || '',
                        'notify': _0x211b0c['notify'],
                        'verifiedName': _0x211b0c['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x211b0c['id']] = _0x55abc2;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x211b0c['id'], _0x55abc2);
                        } catch (_0xc6559c) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0xc6559c['message']);
                        }
                    }
                }
            }
        });
        _0x303768['on']('contacts.set', async _0x417c82 => {
            for (const _0x1be819 of _0x417c82) {
                if (_0x1be819['id']) {
                    const _0x1ee423 = {
                        'id': _0x1be819['id'],
                        'name': _0x1be819['notify'] || _0x1be819['name'] || _0x1be819['verifiedName'] || '',
                        'notify': _0x1be819['notify'],
                        'verifiedName': _0x1be819['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x1be819['id']] = _0x1ee423;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x1be819['id'], _0x1ee423);
                        } catch (_0x17324c) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x17324c['message']);
                        }
                    }
                }
            }
        });
        _0x303768['on']('chats.set', async _0x1e419d => {
            for (const _0x3b5aa3 of _0x1e419d) {
                if (_0x3b5aa3['id']) {
                    const _0x3aacc0 = {
                        'id': _0x3b5aa3['id'],
                        'name': _0x3b5aa3['name'] || _0x3b5aa3['subject'] || '',
                        'conversationTimestamp': _0x3b5aa3['conversationTimestamp'],
                        'unreadCount': _0x3b5aa3['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x3b5aa3['id']] = _0x3aacc0;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x3b5aa3['id'], _0x3aacc0);
                        } catch (_0x1c43c2) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x1c43c2['message']);
                        }
                    }
                }
            }
        });
        _0x303768['on']('chats.update', async _0x5c1365 => {
            for (const _0x3c0b10 of _0x5c1365) {
                if (_0x3c0b10['id']) {
                    if (backend === 'memory') {
                        const _0x352621 = this['chats'][_0x3c0b10['id']] || {};
                        this['chats'][_0x3c0b10['id']] = {
                            'id': _0x3c0b10['id'],
                            'name': _0x3c0b10['name'] || _0x3c0b10['subject'] || _0x352621['name'] || '',
                            'conversationTimestamp': _0x3c0b10['conversationTimestamp'] || _0x352621['conversationTimestamp'],
                            'unreadCount': _0x3c0b10['unreadCount'] !== undefined ? _0x3c0b10['unreadCount'] : _0x352621['unreadCount']
                        };
                    } else {
                        try {
                            const _0x3e03c0 = await adapters[backend]['getChat'](_0x3c0b10['id']) || {};
                            const _0x173a42 = {
                                'id': _0x3c0b10['id'],
                                'name': _0x3c0b10['name'] || _0x3c0b10['subject'] || _0x3e03c0['name'] || '',
                                'conversationTimestamp': _0x3c0b10['conversationTimestamp'] || _0x3e03c0['conversation_timestamp'],
                                'unreadCount': _0x3c0b10['unreadCount'] !== undefined ? _0x3c0b10['unreadCount'] : _0x3e03c0['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x3c0b10['id'], _0x173a42);
                        } catch (_0x5ade60) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x5ade60['message']);
                        }
                    }
                }
            }
        });
        _0x303768['on']('chats.delete', async _0x3edf23 => {
            for (const _0x3f5a8a of _0x3edf23) {
                if (backend === 'memory') {
                    delete this['chats'][_0x3f5a8a];
                    delete this['messages'][_0x3f5a8a];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x3f5a8a);
                    } catch (_0x183bd1) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x183bd1['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x567250, _0x3e2175) {
        if (backend === 'memory') {
            const _0x5b751c = this['messages'][_0x567250]?.['find'](_0x526b25 => _0x526b25['key']['id'] === _0x3e2175) || null;
            return _0x5b751c;
        } else {
            try {
                return await adapters[backend]['load'](_0x567250, _0x3e2175);
            } catch (_0x5cb686) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x3e2175 + ':', _0x5cb686['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x177ed8, _0x132abd, _0x2a6815) {
        if (backend === 'memory') {
            const _0x1fcff3 = './data';
            if (!_0x0_0x260641['existsSync'](_0x1fcff3))
                _0x0_0x260641['mkdirSync'](_0x1fcff3, { 'recursive': !![] });
            const _0x383143 = _0x0_0xaf1186['join'](_0x1fcff3, _0x132abd + '.json');
            try {
                _0x0_0x260641['writeFileSync'](_0x383143, JSON['stringify'](_0x2a6815, null, 0x2));
            } catch (_0x3dbfa7) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x132abd + ':', _0x3dbfa7['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x177ed8, _0x132abd, _0x2a6815);
            } catch (_0x20dd74) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x132abd + ':', _0x20dd74['message']);
            }
        }
    },
    async 'getSetting'(_0x2ac358, _0x2dd542) {
        if (backend === 'memory') {
            const _0x36cf61 = './data';
            const _0x53630a = _0x0_0xaf1186['join'](_0x36cf61, _0x2dd542 + '.json');
            try {
                if (_0x0_0x260641['existsSync'](_0x53630a)) {
                    const _0x400da0 = JSON['parse'](_0x0_0x260641['readFileSync'](_0x53630a, 'utf-8'));
                    if (_0x400da0['enabled'] !== undefined)
                        return _0x400da0;
                    if (_0x400da0[_0x2ac358] !== undefined)
                        return _0x400da0[_0x2ac358];
                    return null;
                }
                return null;
            } catch (_0x3be66f) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2dd542 + ':', _0x3be66f['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x2ac358, _0x2dd542);
            } catch (_0x45b7c9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x2dd542 + ':', _0x45b7c9['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x5b1b48) {
        if (backend === 'memory') {
            const _0x4d14bb = './data';
            const _0x479aa8 = {};
            try {
                if (_0x0_0x260641['existsSync'](_0x4d14bb)) {
                    const _0x29d40d = _0x0_0x260641['readdirSync'](_0x4d14bb)['filter'](_0x170457 => _0x170457['endsWith']('.json'));
                    for (const _0x41c5b0 of _0x29d40d) {
                        const _0x6ec2b6 = _0x0_0xaf1186['basename'](_0x41c5b0, '.json');
                        if (_0x6ec2b6 === 'messageCount' || _0x6ec2b6 === 'owner')
                            continue;
                        const _0x27efb8 = _0x0_0xaf1186['join'](_0x4d14bb, _0x41c5b0);
                        const _0x39483f = JSON['parse'](_0x0_0x260641['readFileSync'](_0x27efb8, 'utf-8'));
                        if (_0x39483f[_0x5b1b48]) {
                            _0x479aa8[_0x6ec2b6] = _0x39483f[_0x5b1b48];
                        }
                    }
                }
                return _0x479aa8;
            } catch (_0x43644a) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x43644a['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x5b1b48);
            } catch (_0x5558c6) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x5558c6['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x161dbc) {
        const _0x2dc3b1 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x2dc3b1['includes'](_0x161dbc)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x161dbc + ',\x20defaulting\x20to\x20private');
            _0x161dbc = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x161dbc;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x161dbc);
            } catch (_0x3e91a8) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0x3e91a8['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0xb53c4c = await adapters[backend]['getMetadata']('botMode');
                return _0xb53c4c || 'private';
            } catch (_0x393e5b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x393e5b['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x185c69, _0x47a27b, _0x1092c3) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x185c69]) {
                this['messageCount'][_0x185c69] = {};
            }
            if (!this['messageCount'][_0x185c69][_0x47a27b]) {
                this['messageCount'][_0x185c69][_0x47a27b] = 0x0;
            }
            this['messageCount'][_0x185c69][_0x47a27b]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x185c69, _0x47a27b);
            } catch (_0x1a8d1c) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x47a27b + ':', _0x1a8d1c['message']);
            }
        }
    },
    async 'getMessageCount'(_0x3275c3, _0x1a5855) {
        if (backend === 'memory') {
            return this['messageCount'][_0x3275c3]?.[_0x1a5855] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x3275c3, _0x1a5855);
            } catch (_0x470598) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x1a5855 + ':', _0x470598['message']);
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
            } catch (_0x30ab5d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x30ab5d['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x297ee8) {
        if (backend === 'memory') {
            this['isPublic'] = _0x297ee8;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x297ee8);
            } catch (_0x192131) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x192131['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x59ffce = await adapters[backend]['getAllCounts']();
                return _0x59ffce['isPublic'];
            } catch (_0x1bd34b) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x1bd34b['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x371715) {
        const _0x2737c5 = [
            'public',
            'private'
        ];
        if (!_0x2737c5['includes'](_0x371715)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x371715);
            _0x371715 = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x371715;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x371715);
            } catch (_0x567f9b) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0x567f9b['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0xeae3ef = await adapters[backend]['getMetadata']('chatbotMode');
                return _0xeae3ef || 'private';
            } catch (_0x112f18) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x112f18['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0x5de964 = 0x0;
        const _0xcd1041 = Object['keys'](this['contacts'])['length'];
        const _0x8ec508 = Object['keys'](this['chats'])['length'];
        let _0x4937d6 = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x5f1d00 => {
                if (Array['isArray'](_0x5f1d00)) {
                    _0x5de964 += _0x5f1d00['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0xe66940 => {
                if (typeof _0xe66940 === 'object') {
                    _0x4937d6 += Object['keys'](_0xe66940)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0x5de964 : 'stored\x20in\x20database',
            'contacts': _0xcd1041,
            'chats': _0x8ec508,
            'messageCounts': backend === 'memory' ? _0x4937d6 : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x13422f => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x13422f));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x9787fe => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x9787fe));
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
        let _0x76ebed = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x56de6c => {
            if (store['chats'][_0x56de6c]['messages']) {
                delete store['chats'][_0x56de6c]['messages'];
                _0x76ebed++;
            }
        });
        if (_0x76ebed > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x76ebed + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x2f4339 => {
    console['log']('[STORE]\x20Received\x20' + _0x2f4339 + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0x13d28a) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0x13d28a['message']);
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
process['on']('uncaughtException', _0x5df2f6 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x5df2f6);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x53e939, _0x38cbed) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x38cbed, 'reason:', _0x53e939);
});
export default store;