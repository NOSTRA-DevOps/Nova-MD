import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import _0x0_0x2899fe from 'fs';
import _0x0_0x11189e from 'path';
import _0x0_0x598177 from 'zlib';
let printLog = null;
try {
    const print = require('./print');
    printLog = print['printLog'];
} catch (_0x0_0x4c03f9) {
    printLog = (_0x3f1774, _0x46619a) => console['log']('[' + _0x3f1774['toUpperCase']() + ']\x20' + _0x46619a);
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
} catch (_0x0_0x2f61e1) {
}
const TTL_MS = 0x1e * 0x18 * 0x3c * 0x3c * 0x3e8;
const CLEANUP_INTERVAL = 0x3c * 0x3c * 0x3e8;
const compress = _0x18c16c => {
    try {
        return _0x0_0x598177['deflateSync'](JSON['stringify'](_0x18c16c));
    } catch (_0x4a4773) {
        console['error']('[STORE]\x20Compression\x20error:', _0x4a4773['message']);
        return Buffer['from'](JSON['stringify'](_0x18c16c));
    }
};
const decompress = _0x1caa92 => {
    try {
        return JSON['parse'](_0x0_0x598177['inflateSync'](_0x1caa92));
    } catch (_0x3d198b) {
        console['error']('[STORE]\x20Decompression\x20error:', _0x3d198b['message']);
        try {
            return JSON['parse'](_0x1caa92['toString']());
        } catch (_0x4c7c1c) {
            return null;
        }
    }
};
function slimMessage(_0x4cc037) {
    return {
        'key': _0x4cc037['key'],
        'message': _0x4cc037['message'],
        'messageTimestamp': _0x4cc037['messageTimestamp'],
        'participant': _0x4cc037['participant'],
        'pushName': _0x4cc037['pushName'],
        'broadcast': _0x4cc037['broadcast']
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
        mongoose['connect'](MONGO_URL)['catch'](_0x38e057 => console['error']('[MONGO]\x20Connection\x20error:', _0x38e057));
        const Msg = mongoose['model']('Message', msgSchema);
        const MsgCount = mongoose['model']('MessageCount', countSchema);
        const Meta = mongoose['model']('Metadata', metaSchema);
        const Contact = mongoose['model']('Contact', contactSchema);
        const Chat = mongoose['model']('Chat', chatSchema);
        const Setting = mongoose['model']('Setting', settingSchema);
        adapters['mongo'] = {
            async 'save'(_0x15c1d2, _0x359aca, _0x1d74c4) {
                try {
                    await Msg['updateOne']({
                        'jid': _0x15c1d2,
                        'id': _0x359aca
                    }, {
                        'data': compress(_0x1d74c4),
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x4a87e4) {
                    console['error']('[MONGO]\x20Save\x20error:', _0x4a87e4['message']);
                }
            },
            async 'load'(_0x350132, _0x235ee5) {
                try {
                    const _0x51ad7b = await Msg['findOne']({
                        'jid': _0x350132,
                        'id': _0x235ee5
                    });
                    return _0x51ad7b ? decompress(_0x51ad7b['data']) : null;
                } catch (_0x5add0b) {
                    console['error']('[MONGO]\x20Load\x20error:', _0x5add0b['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x5415c6, _0x32fac1) {
                try {
                    await MsgCount['updateOne']({
                        'chatId': _0x5415c6,
                        'userId': _0x32fac1
                    }, { '$inc': { 'count': 0x1 } }, { 'upsert': !![] });
                } catch (_0x389aec) {
                    console['error']('[MONGO]\x20Increment\x20count\x20error:', _0x389aec['message']);
                }
            },
            async 'getCount'(_0x119e6d, _0x1e34d4) {
                try {
                    const _0x525c7c = await MsgCount['findOne']({
                        'chatId': _0x119e6d,
                        'userId': _0x1e34d4
                    });
                    return _0x525c7c ? _0x525c7c['count'] : 0x0;
                } catch (_0x4b91be) {
                    console['error']('[MONGO]\x20Get\x20count\x20error:', _0x4b91be['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x4262ba = await MsgCount['find']({});
                    const _0x53ce4c = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x4262ba['forEach'](_0xf162c5 => {
                        if (!_0x53ce4c['messageCount'][_0xf162c5['chatId']]) {
                            _0x53ce4c['messageCount'][_0xf162c5['chatId']] = {};
                        }
                        _0x53ce4c['messageCount'][_0xf162c5['chatId']][_0xf162c5['userId']] = _0xf162c5['count'];
                    });
                    const _0x273a9a = await Meta['findOne']({ 'key': 'isPublic' });
                    if (_0x273a9a)
                        _0x53ce4c['isPublic'] = _0x273a9a['value'] === 'true';
                    return _0x53ce4c;
                } catch (_0x2a8a2e) {
                    console['error']('[MONGO]\x20Get\x20all\x20counts\x20error:', _0x2a8a2e['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x6a58cc) {
                try {
                    await Meta['updateOne']({ 'key': 'isPublic' }, {
                        'key': 'isPublic',
                        'value': _0x6a58cc['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x365e22) {
                    console['error']('[MONGO]\x20Set\x20public\x20mode\x20error:', _0x365e22['message']);
                }
            },
            async 'setMetadata'(_0x1c3662, _0x440055) {
                try {
                    await Meta['updateOne']({ 'key': _0x1c3662 }, {
                        'key': _0x1c3662,
                        'value': _0x440055['toString']()
                    }, { 'upsert': !![] });
                } catch (_0x39c72b) {
                    console['error']('[MONGO]\x20Set\x20metadata\x20error:', _0x39c72b['message']);
                }
            },
            async 'getMetadata'(_0x4f9e64) {
                try {
                    const _0x49c1d0 = await Meta['findOne']({ 'key': _0x4f9e64 });
                    return _0x49c1d0 ? _0x49c1d0['value'] : null;
                } catch (_0x2df5bf) {
                    console['error']('[MONGO]\x20Get\x20metadata\x20error:', _0x2df5bf['message']);
                    return null;
                }
            },
            async 'saveContact'(_0xd9cd66, _0x420179) {
                try {
                    await Contact['updateOne']({ 'jid': _0xd9cd66 }, {
                        ..._0x420179,
                        'jid': _0xd9cd66,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x1e67e0) {
                    console['error']('[MONGO]\x20Save\x20contact\x20error:', _0x1e67e0['message']);
                }
            },
            async 'getContact'(_0x2a76de) {
                try {
                    return await Contact['findOne']({ 'jid': _0x2a76de });
                } catch (_0x33ebcb) {
                    console['error']('[MONGO]\x20Get\x20contact\x20error:', _0x33ebcb['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x372ccd = await Contact['find']({});
                    const _0x42601d = {};
                    _0x372ccd['forEach'](_0x5d4228 => {
                        _0x42601d[_0x5d4228['jid']] = {
                            'id': _0x5d4228['jid'],
                            'name': _0x5d4228['name'],
                            'notify': _0x5d4228['notify']
                        };
                    });
                    return _0x42601d;
                } catch (_0x259a38) {
                    console['error']('[MONGO]\x20Get\x20all\x20contacts\x20error:', _0x259a38['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x325989, _0x3f92f0) {
                try {
                    await Chat['updateOne']({ 'jid': _0x325989 }, {
                        ..._0x3f92f0,
                        'jid': _0x325989,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x20f76b) {
                    console['error']('[MONGO]\x20Save\x20chat\x20error:', _0x20f76b['message']);
                }
            },
            async 'getChat'(_0x5649e3) {
                try {
                    return await Chat['findOne']({ 'jid': _0x5649e3 });
                } catch (_0x81abc2) {
                    console['error']('[MONGO]\x20Get\x20chat\x20error:', _0x81abc2['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x41661a = await Chat['find']({});
                    const _0x3a2df4 = {};
                    _0x41661a['forEach'](_0x5c2f67 => {
                        _0x3a2df4[_0x5c2f67['jid']] = {
                            'id': _0x5c2f67['jid'],
                            'name': _0x5c2f67['name'],
                            'conversationTimestamp': _0x5c2f67['conversationTimestamp'],
                            'unreadCount': _0x5c2f67['unreadCount']
                        };
                    });
                    return _0x3a2df4;
                } catch (_0xc3f843) {
                    console['error']('[MONGO]\x20Get\x20all\x20chats\x20error:', _0xc3f843['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x4a33b4) {
                try {
                    await Chat['deleteOne']({ 'jid': _0x4a33b4 });
                } catch (_0x5e7300) {
                    console['error']('[MONGO]\x20Delete\x20chat\x20error:', _0x5e7300['message']);
                }
            },
            async 'saveSetting'(_0x566cd1, _0x1e847c, _0x22ec47) {
                try {
                    await Setting['updateOne']({
                        'chatId': _0x566cd1,
                        'key': _0x1e847c
                    }, {
                        'chatId': _0x566cd1,
                        'key': _0x1e847c,
                        'value': _0x22ec47,
                        'ts': Date['now']()
                    }, { 'upsert': !![] });
                } catch (_0x2559d6) {
                    console['error']('[MONGO]\x20Save\x20setting\x20error:', _0x2559d6['message']);
                }
            },
            async 'getSetting'(_0x5d912c, _0x1a0708) {
                try {
                    const _0x52284d = await Setting['findOne']({
                        'chatId': _0x5d912c,
                        'key': _0x1a0708
                    });
                    return _0x52284d ? _0x52284d['value'] : null;
                } catch (_0x586fff) {
                    console['error']('[MONGO]\x20Get\x20setting\x20error:', _0x586fff['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0xb9703e) {
                try {
                    const _0x27cebf = await Setting['find']({ 'chatId': _0xb9703e });
                    const _0xb50aec = {};
                    _0x27cebf['forEach'](_0x2bb1f9 => {
                        _0xb50aec[_0x2bb1f9['key']] = _0x2bb1f9['value'];
                    });
                    return _0xb50aec;
                } catch (_0x43ee77) {
                    console['error']('[MONGO]\x20Get\x20all\x20settings\x20error:', _0x43ee77['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x57f7d0 = await Msg['deleteMany']({ 'ts': { '$lt': Date['now']() - TTL_MS } });
                    if (_0x57f7d0['deletedCount'] > 0x0) {
                        console['log']('[MONGO]\x20Cleaned\x20up\x20' + _0x57f7d0['deletedCount'] + '\x20old\x20messages');
                    }
                } catch (_0xd486cd) {
                    console['error']('[MONGO]\x20Cleanup\x20error:', _0xd486cd['message']);
                }
            },
            async 'close'() {
                try {
                    await mongoose['connection']['close']();
                    console['log']('[MONGO]\x20Connection\x20closed');
                } catch (_0x582c99) {
                    console['error']('[MONGO]\x20Close\x20error:', _0x582c99['message']);
                }
            }
        };
        backend = 'mongo';
        messageLimit = MESSAGE_LIMITS['mongo'];
        printLog('store', 'MongoDB\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x147fdc) {
        printLog('warning', 'MongoDB\x20initialization\x20failed:\x20' + _0x0_0x147fdc['message']);
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
        pool['on']('error', _0x28aa22 => {
            printLog('error', 'PostgreSQL\x20pool\x20error:\x20' + _0x28aa22['message']);
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
                        const _0xa496ee = await pool['connect']();
                        try {
                            await _0xa496ee['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20id\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20data\x20BYTEA\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xa496ee['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_jid\x20ON\x20messages(jid)');
                            await _0xa496ee['query']('CREATE\x20INDEX\x20IF\x20NOT\x20EXISTS\x20idx_messages_ts\x20ON\x20messages(ts)');
                            await _0xa496ee['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20message_counts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20user_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20user_id)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xa496ee['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20metadata\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xa496ee['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20contacts\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20notify\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20verified_name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xa496ee['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20chats\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20jid\x20TEXT\x20PRIMARY\x20KEY,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20name\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20conversation_timestamp\x20BIGINT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20unread_count\x20INTEGER\x20DEFAULT\x200,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            await _0xa496ee['query']('\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20settings\x20(\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20chat_id\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20key\x20TEXT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20value\x20TEXT,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ts\x20BIGINT\x20NOT\x20NULL,\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20PRIMARY\x20KEY\x20(chat_id,\x20key)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20');
                            this['initialized'] = !![];
                            printLog('store', 'PostgreSQL\x20connected\x20and\x20tables\x20ready');
                        } finally {
                            _0xa496ee['release']();
                        }
                    } catch (_0x1d7c99) {
                        printLog('error', 'PostgreSQL\x20init\x20error:\x20' + _0x1d7c99['message']);
                        this['initPromise'] = null;
                        throw _0x1d7c99;
                    }
                })());
                return this['initPromise'];
            },
            async 'save'(_0x4ef40a, _0x5cdd74, _0x3a6d4e) {
                try {
                    await this['init']();
                    const _0x6f4b02 = await pool['connect']();
                    try {
                        await _0x6f4b02['query']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES($1,$2,$3,$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(id)\x20DO\x20UPDATE\x20SET\x20data=$4,\x20ts=$3', [
                            _0x4ef40a,
                            _0x5cdd74,
                            Date['now'](),
                            compress(_0x3a6d4e)
                        ]);
                    } finally {
                        _0x6f4b02['release']();
                    }
                } catch (_0x9e625c) {
                    console['error']('[POSTGRES]\x20Save\x20error:', _0x9e625c['message']);
                }
            },
            async 'load'(_0x5337f5, _0x574f12) {
                try {
                    await this['init']();
                    const _0x1aa278 = await pool['connect']();
                    try {
                        const _0x342c2f = await _0x1aa278['query']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=$1\x20AND\x20id=$2', [
                            _0x5337f5,
                            _0x574f12
                        ]);
                        return _0x342c2f['rows'][0x0] ? decompress(_0x342c2f['rows'][0x0]['data']) : null;
                    } finally {
                        _0x1aa278['release']();
                    }
                } catch (_0x48711e) {
                    console['error']('[POSTGRES]\x20Load\x20error:', _0x48711e['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x265596, _0x489fc1) {
                try {
                    await this['init']();
                    const _0x291fc1 = await pool['connect']();
                    try {
                        await _0x291fc1['query']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES($1,$2,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20user_id)\x20DO\x20UPDATE\x20SET\x20count\x20=\x20message_counts.count\x20+\x201', [
                            _0x265596,
                            _0x489fc1
                        ]);
                    } finally {
                        _0x291fc1['release']();
                    }
                } catch (_0xef2add) {
                    console['error']('[POSTGRES]\x20Increment\x20count\x20error:', _0xef2add['message']);
                }
            },
            async 'getCount'(_0x100c3a, _0x2473cd) {
                try {
                    await this['init']();
                    const _0x3403a1 = await pool['connect']();
                    try {
                        const _0x7d48f4 = await _0x3403a1['query']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=$1\x20AND\x20user_id=$2', [
                            _0x100c3a,
                            _0x2473cd
                        ]);
                        return _0x7d48f4['rows'][0x0] ? _0x7d48f4['rows'][0x0]['count'] : 0x0;
                    } finally {
                        _0x3403a1['release']();
                    }
                } catch (_0x1e0627) {
                    console['error']('[POSTGRES]\x20Get\x20count\x20error:', _0x1e0627['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    await this['init']();
                    const _0x1537a6 = await pool['connect']();
                    try {
                        const _0x38f188 = await _0x1537a6['query']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                        const _0x3ab603 = {
                            'isPublic': ![],
                            'messageCount': {}
                        };
                        _0x38f188['rows']['forEach'](_0x58bb9c => {
                            if (!_0x3ab603['messageCount'][_0x58bb9c['chat_id']]) {
                                _0x3ab603['messageCount'][_0x58bb9c['chat_id']] = {};
                            }
                            _0x3ab603['messageCount'][_0x58bb9c['chat_id']][_0x58bb9c['user_id']] = _0x58bb9c['count'];
                        });
                        const _0x178dfd = await _0x1537a6['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=\x27isPublic\x27');
                        if (_0x178dfd['rows'][0x0])
                            _0x3ab603['isPublic'] = _0x178dfd['rows'][0x0]['value'] === 'true';
                        return _0x3ab603;
                    } finally {
                        _0x1537a6['release']();
                    }
                } catch (_0x22ac7d) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20counts\x20error:', _0x22ac7d['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0x5efc11) {
                try {
                    await this['init']();
                    const _0x61a414 = await pool['connect']();
                    try {
                        await _0x61a414['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES(\x27isPublic\x27,\x20$1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$1', [_0x5efc11['toString']()]);
                    } finally {
                        _0x61a414['release']();
                    }
                } catch (_0x4a97eb) {
                    console['error']('[POSTGRES]\x20Set\x20public\x20mode\x20error:', _0x4a97eb['message']);
                }
            },
            async 'setMetadata'(_0x41c8e1, _0x2cb365) {
                try {
                    await this['init']();
                    const _0x989d50 = await pool['connect']();
                    try {
                        await _0x989d50['query']('INSERT\x20INTO\x20metadata(key,\x20value)\x20VALUES($1,\x20$2)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(key)\x20DO\x20UPDATE\x20SET\x20value=$2', [
                            _0x41c8e1,
                            _0x2cb365['toString']()
                        ]);
                    } finally {
                        _0x989d50['release']();
                    }
                } catch (_0x1c0276) {
                    console['error']('[POSTGRES]\x20Set\x20metadata\x20error:', _0x1c0276['message']);
                }
            },
            async 'getMetadata'(_0x324541) {
                try {
                    await this['init']();
                    const _0x510f2d = await pool['connect']();
                    try {
                        const _0x43e1d1 = await _0x510f2d['query']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20key=$1', [_0x324541]);
                        return _0x43e1d1['rows'][0x0] ? _0x43e1d1['rows'][0x0]['value'] : null;
                    } finally {
                        _0x510f2d['release']();
                    }
                } catch (_0x2f26fe) {
                    console['error']('[POSTGRES]\x20Get\x20metadata\x20error:', _0x2f26fe['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x1518f6, _0x3dbe88) {
                try {
                    await this['init']();
                    const _0x58b19a = await pool['connect']();
                    try {
                        await _0x58b19a['query']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20notify=$3,\x20verified_name=$4,\x20ts=$5', [
                            _0x1518f6,
                            _0x3dbe88['name'] || '',
                            _0x3dbe88['notify'] || '',
                            _0x3dbe88['verifiedName'] || '',
                            Date['now']()
                        ]);
                    } finally {
                        _0x58b19a['release']();
                    }
                } catch (_0x5abb8f) {
                    console['error']('[POSTGRES]\x20Save\x20contact\x20error:', _0x5abb8f['message']);
                }
            },
            async 'getContact'(_0x4b2b13) {
                try {
                    await this['init']();
                    const _0xe1b2ba = await pool['connect']();
                    try {
                        const _0xc179a3 = await _0xe1b2ba['query']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=$1', [_0x4b2b13]);
                        return _0xc179a3['rows'][0x0] || null;
                    } finally {
                        _0xe1b2ba['release']();
                    }
                } catch (_0x232cfe) {
                    console['error']('[POSTGRES]\x20Get\x20contact\x20error:', _0x232cfe['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    await this['init']();
                    const _0x2b5fff = await pool['connect']();
                    try {
                        const _0x4ec176 = await _0x2b5fff['query']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                        const _0x515cc8 = {};
                        _0x4ec176['rows']['forEach'](_0x54ce8c => {
                            _0x515cc8[_0x54ce8c['jid']] = {
                                'id': _0x54ce8c['jid'],
                                'name': _0x54ce8c['name'],
                                'notify': _0x54ce8c['notify']
                            };
                        });
                        return _0x515cc8;
                    } finally {
                        _0x2b5fff['release']();
                    }
                } catch (_0x107755) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20contacts\x20error:', _0x107755['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x512bff, _0x5ef16f) {
                try {
                    await this['init']();
                    const _0x11ffcf = await pool['connect']();
                    try {
                        await _0x11ffcf['query']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4,\x20$5)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(jid)\x20DO\x20UPDATE\x20SET\x20name=$2,\x20conversation_timestamp=$3,\x20unread_count=$4,\x20ts=$5', [
                            _0x512bff,
                            _0x5ef16f['name'] || '',
                            _0x5ef16f['conversationTimestamp'] || 0x0,
                            _0x5ef16f['unreadCount'] || 0x0,
                            Date['now']()
                        ]);
                    } finally {
                        _0x11ffcf['release']();
                    }
                } catch (_0x996834) {
                    console['error']('[POSTGRES]\x20Save\x20chat\x20error:', _0x996834['message']);
                }
            },
            async 'getChat'(_0x119e71) {
                try {
                    await this['init']();
                    const _0x4c8a97 = await pool['connect']();
                    try {
                        const _0x37bf16 = await _0x4c8a97['query']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x119e71]);
                        return _0x37bf16['rows'][0x0] || null;
                    } finally {
                        _0x4c8a97['release']();
                    }
                } catch (_0xb9deb8) {
                    console['error']('[POSTGRES]\x20Get\x20chat\x20error:', _0xb9deb8['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    await this['init']();
                    const _0x3a1367 = await pool['connect']();
                    try {
                        const _0x40c057 = await _0x3a1367['query']('SELECT\x20*\x20FROM\x20chats');
                        const _0x3c9d9f = {};
                        _0x40c057['rows']['forEach'](_0x1cfd9e => {
                            _0x3c9d9f[_0x1cfd9e['jid']] = {
                                'id': _0x1cfd9e['jid'],
                                'name': _0x1cfd9e['name'],
                                'conversationTimestamp': _0x1cfd9e['conversation_timestamp'],
                                'unreadCount': _0x1cfd9e['unread_count']
                            };
                        });
                        return _0x3c9d9f;
                    } finally {
                        _0x3a1367['release']();
                    }
                } catch (_0x39487b) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20chats\x20error:', _0x39487b['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x325c1c) {
                try {
                    await this['init']();
                    const _0x52ab87 = await pool['connect']();
                    try {
                        await _0x52ab87['query']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=$1', [_0x325c1c]);
                    } finally {
                        _0x52ab87['release']();
                    }
                } catch (_0xd8326b) {
                    console['error']('[POSTGRES]\x20Delete\x20chat\x20error:', _0xd8326b['message']);
                }
            },
            async 'saveSetting'(_0x15659a, _0x317b01, _0x3980e0) {
                try {
                    await this['init']();
                    const _0x28bb97 = await pool['connect']();
                    try {
                        await _0x28bb97['query']('INSERT\x20INTO\x20settings(chat_id,\x20key,\x20value,\x20ts)\x20VALUES($1,\x20$2,\x20$3,\x20$4)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20CONFLICT\x20(chat_id,\x20key)\x20DO\x20UPDATE\x20SET\x20value=$3,\x20ts=$4', [
                            _0x15659a,
                            _0x317b01,
                            JSON['stringify'](_0x3980e0),
                            Date['now']()
                        ]);
                    } finally {
                        _0x28bb97['release']();
                    }
                } catch (_0x35b71d) {
                    console['error']('[POSTGRES]\x20Save\x20setting\x20error:', _0x35b71d['message']);
                }
            },
            async 'getSetting'(_0x5f1d0f, _0x132d37) {
                try {
                    await this['init']();
                    const _0x196d4a = await pool['connect']();
                    try {
                        const _0x30d027 = await _0x196d4a['query']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1\x20AND\x20key=$2', [
                            _0x5f1d0f,
                            _0x132d37
                        ]);
                        return _0x30d027['rows'][0x0] ? JSON['parse'](_0x30d027['rows'][0x0]['value']) : null;
                    } finally {
                        _0x196d4a['release']();
                    }
                } catch (_0x3d596f) {
                    console['error']('[POSTGRES]\x20Get\x20setting\x20error:', _0x3d596f['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x32d968) {
                try {
                    await this['init']();
                    const _0x3381c0 = await pool['connect']();
                    try {
                        const _0x12686f = await _0x3381c0['query']('SELECT\x20key,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=$1', [_0x32d968]);
                        const _0x38b2e1 = {};
                        _0x12686f['rows']['forEach'](_0x20799c => {
                            _0x38b2e1[_0x20799c['key']] = JSON['parse'](_0x20799c['value']);
                        });
                        return _0x38b2e1;
                    } finally {
                        _0x3381c0['release']();
                    }
                } catch (_0x35e9da) {
                    console['error']('[POSTGRES]\x20Get\x20all\x20settings\x20error:', _0x35e9da['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    await this['init']();
                    const _0x75af78 = await pool['connect']();
                    try {
                        const _0x2cf42c = await _0x75af78['query']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20$1', [Date['now']() - TTL_MS]);
                        if (_0x2cf42c['rowCount'] > 0x0) {
                            console['log']('[POSTGRES]\x20Cleaned\x20up\x20' + _0x2cf42c['rowCount'] + '\x20old\x20messages');
                        }
                    } finally {
                        _0x75af78['release']();
                    }
                } catch (_0x329129) {
                    console['error']('[POSTGRES]\x20Cleanup\x20error:', _0x329129['message']);
                }
            },
            async 'close'() {
                try {
                    await pool['end']();
                    console['log']('[POSTGRES]\x20Pool\x20closed');
                } catch (_0x4426c3) {
                    console['error']('[POSTGRES]\x20Close\x20error:', _0x4426c3['message']);
                }
            }
        };
        backend = 'postgres';
        messageLimit = MESSAGE_LIMITS['postgres'];
        printLog('store', 'PostgreSQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x530719) {
        printLog('warning', 'PostgreSQL\x20initialization\x20failed:\x20' + _0x0_0x530719['message']);
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
                    } catch (_0x4260c8) {
                        printLog('error', 'MySQL\x20connection\x20error:\x20' + _0x4260c8['message']);
                        connectPromise = null;
                        mysqlConn = null;
                        throw _0x4260c8;
                    }
                })());
                return connectPromise;
            },
            async 'save'(_0x5eacb7, _0x59c835, _0x3640ef) {
                try {
                    const _0x5b8d40 = await this['getConn']();
                    await _0x5b8d40['execute']('INSERT\x20INTO\x20messages(jid,id,ts,data)\x20VALUES(?,?,?,?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20data=VALUES(data),\x20ts=VALUES(ts)', [
                        _0x5eacb7,
                        _0x59c835,
                        Date['now'](),
                        compress(_0x3640ef)
                    ]);
                } catch (_0x38fcaa) {
                    console['error']('[MYSQL]\x20Save\x20error:', _0x38fcaa['message']);
                }
            },
            async 'load'(_0x30269a, _0x262aba) {
                try {
                    const _0x772375 = await this['getConn']();
                    const [_0x5d5599] = await _0x772375['execute']('SELECT\x20data\x20FROM\x20messages\x20WHERE\x20jid=?\x20AND\x20id=?', [
                        _0x30269a,
                        _0x262aba
                    ]);
                    return _0x5d5599[0x0] ? decompress(_0x5d5599[0x0]['data']) : null;
                } catch (_0x260592) {
                    console['error']('[MYSQL]\x20Load\x20error:', _0x260592['message']);
                    return null;
                }
            },
            async 'incrementCount'(_0x16eeb0, _0xe00128) {
                try {
                    const _0x52baf3 = await this['getConn']();
                    await _0x52baf3['execute']('INSERT\x20INTO\x20message_counts(chat_id,\x20user_id,\x20count)\x20VALUES(?,?,1)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20count\x20=\x20count\x20+\x201', [
                        _0x16eeb0,
                        _0xe00128
                    ]);
                } catch (_0x30a9af) {
                    console['error']('[MYSQL]\x20Increment\x20count\x20error:', _0x30a9af['message']);
                }
            },
            async 'getCount'(_0x439a3b, _0x762540) {
                try {
                    const _0x5cab18 = await this['getConn']();
                    const [_0x4243ae] = await _0x5cab18['execute']('SELECT\x20count\x20FROM\x20message_counts\x20WHERE\x20chat_id=?\x20AND\x20user_id=?', [
                        _0x439a3b,
                        _0x762540
                    ]);
                    return _0x4243ae[0x0] ? _0x4243ae[0x0]['count'] : 0x0;
                } catch (_0x2b1110) {
                    console['error']('[MYSQL]\x20Get\x20count\x20error:', _0x2b1110['message']);
                    return 0x0;
                }
            },
            async 'getAllCounts'() {
                try {
                    const _0x59f798 = await this['getConn']();
                    const [_0x3c64b6] = await _0x59f798['execute']('SELECT\x20chat_id,\x20user_id,\x20count\x20FROM\x20message_counts');
                    const _0x56fc1d = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x3c64b6['forEach'](_0x1deb91 => {
                        if (!_0x56fc1d['messageCount'][_0x1deb91['chat_id']]) {
                            _0x56fc1d['messageCount'][_0x1deb91['chat_id']] = {};
                        }
                        _0x56fc1d['messageCount'][_0x1deb91['chat_id']][_0x1deb91['user_id']] = _0x1deb91['count'];
                    });
                    const [_0x58399f] = await _0x59f798['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=\x27isPublic\x27');
                    if (_0x58399f[0x0])
                        _0x56fc1d['isPublic'] = _0x58399f[0x0]['value'] === 'true';
                    return _0x56fc1d;
                } catch (_0x57e989) {
                    console['error']('[MYSQL]\x20Get\x20all\x20counts\x20error:', _0x57e989['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            async 'setPublicMode'(_0xd5d53e) {
                try {
                    const _0x5a8c86 = await this['getConn']();
                    await _0x5a8c86['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(\x27isPublic\x27,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [_0xd5d53e['toString']()]);
                } catch (_0x32904c) {
                    console['error']('[MYSQL]\x20Set\x20public\x20mode\x20error:', _0x32904c['message']);
                }
            },
            async 'setMetadata'(_0x4778cc, _0x4ecf00) {
                try {
                    const _0x2e78bf = await this['getConn']();
                    await _0x2e78bf['execute']('INSERT\x20INTO\x20metadata(`key`,\x20value)\x20VALUES(?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value)', [
                        _0x4778cc,
                        _0x4ecf00['toString']()
                    ]);
                } catch (_0x2e025e) {
                    console['error']('[MYSQL]\x20Set\x20metadata\x20error:', _0x2e025e['message']);
                }
            },
            async 'getMetadata'(_0x4d2ce0) {
                try {
                    const _0x213ad1 = await this['getConn']();
                    const [_0x208328] = await _0x213ad1['execute']('SELECT\x20value\x20FROM\x20metadata\x20WHERE\x20`key`=?', [_0x4d2ce0]);
                    return _0x208328[0x0] ? _0x208328[0x0]['value'] : null;
                } catch (_0x267260) {
                    console['error']('[MYSQL]\x20Get\x20metadata\x20error:', _0x267260['message']);
                    return null;
                }
            },
            async 'saveContact'(_0x2d62c5, _0xff19bb) {
                try {
                    const _0x4d283e = await this['getConn']();
                    await _0x4d283e['execute']('INSERT\x20INTO\x20contacts(jid,\x20name,\x20notify,\x20verified_name,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20notify=VALUES(notify),\x20verified_name=VALUES(verified_name),\x20ts=VALUES(ts)', [
                        _0x2d62c5,
                        _0xff19bb['name'] || '',
                        _0xff19bb['notify'] || '',
                        _0xff19bb['verifiedName'] || '',
                        Date['now']()
                    ]);
                } catch (_0x4fc3b6) {
                    console['error']('[MYSQL]\x20Save\x20contact\x20error:', _0x4fc3b6['message']);
                }
            },
            async 'getContact'(_0x30b4b8) {
                try {
                    const _0x2f5a1e = await this['getConn']();
                    const [_0x120984] = await _0x2f5a1e['execute']('SELECT\x20*\x20FROM\x20contacts\x20WHERE\x20jid=?', [_0x30b4b8]);
                    return _0x120984[0x0] || null;
                } catch (_0x2ac6cc) {
                    console['error']('[MYSQL]\x20Get\x20contact\x20error:', _0x2ac6cc['message']);
                    return null;
                }
            },
            async 'getAllContacts'() {
                try {
                    const _0x1c78f3 = await this['getConn']();
                    const [_0xb377f7] = await _0x1c78f3['execute']('SELECT\x20jid,\x20name,\x20notify\x20FROM\x20contacts');
                    const _0x5d5080 = {};
                    _0xb377f7['forEach'](_0x21d880 => {
                        _0x5d5080[_0x21d880['jid']] = {
                            'id': _0x21d880['jid'],
                            'name': _0x21d880['name'],
                            'notify': _0x21d880['notify']
                        };
                    });
                    return _0x5d5080;
                } catch (_0x1eb1b6) {
                    console['error']('[MYSQL]\x20Get\x20all\x20contacts\x20error:', _0x1eb1b6['message']);
                    return {};
                }
            },
            async 'saveChat'(_0x12415d, _0x2f0d21) {
                try {
                    const _0x2bddea = await this['getConn']();
                    await _0x2bddea['execute']('INSERT\x20INTO\x20chats(jid,\x20name,\x20conversation_timestamp,\x20unread_count,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20name=VALUES(name),\x20conversation_timestamp=VALUES(conversation_timestamp),\x20unread_count=VALUES(unread_count),\x20ts=VALUES(ts)', [
                        _0x12415d,
                        _0x2f0d21['name'] || '',
                        _0x2f0d21['conversationTimestamp'] || 0x0,
                        _0x2f0d21['unreadCount'] || 0x0,
                        Date['now']()
                    ]);
                } catch (_0x135e82) {
                    console['error']('[MYSQL]\x20Save\x20chat\x20error:', _0x135e82['message']);
                }
            },
            async 'getChat'(_0x7965ab) {
                try {
                    const _0x7a0746 = await this['getConn']();
                    const [_0x5f2e5c] = await _0x7a0746['execute']('SELECT\x20*\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x7965ab]);
                    return _0x5f2e5c[0x0] || null;
                } catch (_0x5a1bb0) {
                    console['error']('[MYSQL]\x20Get\x20chat\x20error:', _0x5a1bb0['message']);
                    return null;
                }
            },
            async 'getAllChats'() {
                try {
                    const _0x231d2a = await this['getConn']();
                    const [_0x49dfd9] = await _0x231d2a['execute']('SELECT\x20*\x20FROM\x20chats');
                    const _0x528631 = {};
                    _0x49dfd9['forEach'](_0x3dbd40 => {
                        _0x528631[_0x3dbd40['jid']] = {
                            'id': _0x3dbd40['jid'],
                            'name': _0x3dbd40['name'],
                            'conversationTimestamp': _0x3dbd40['conversation_timestamp'],
                            'unreadCount': _0x3dbd40['unread_count']
                        };
                    });
                    return _0x528631;
                } catch (_0x42f48d) {
                    console['error']('[MYSQL]\x20Get\x20all\x20chats\x20error:', _0x42f48d['message']);
                    return {};
                }
            },
            async 'deleteChat'(_0x2721dd) {
                try {
                    const _0x143c70 = await this['getConn']();
                    await _0x143c70['execute']('DELETE\x20FROM\x20chats\x20WHERE\x20jid=?', [_0x2721dd]);
                } catch (_0x2d2081) {
                    console['error']('[MYSQL]\x20Delete\x20chat\x20error:', _0x2d2081['message']);
                }
            },
            async 'saveSetting'(_0x67336c, _0xc435aa, _0x446a44) {
                try {
                    const _0x1b172f = await this['getConn']();
                    await _0x1b172f['execute']('INSERT\x20INTO\x20settings(chat_id,\x20`key`,\x20value,\x20ts)\x20VALUES(?,\x20?,\x20?,\x20?)\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20ON\x20DUPLICATE\x20KEY\x20UPDATE\x20value=VALUES(value),\x20ts=VALUES(ts)', [
                        _0x67336c,
                        _0xc435aa,
                        JSON['stringify'](_0x446a44),
                        Date['now']()
                    ]);
                } catch (_0x3a02da) {
                    console['error']('[MYSQL]\x20Save\x20setting\x20error:', _0x3a02da['message']);
                }
            },
            async 'getSetting'(_0x11de62, _0xe710bb) {
                try {
                    const _0x1d7767 = await this['getConn']();
                    const [_0x4b455f] = await _0x1d7767['execute']('SELECT\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?\x20AND\x20`key`=?', [
                        _0x11de62,
                        _0xe710bb
                    ]);
                    return _0x4b455f[0x0] ? JSON['parse'](_0x4b455f[0x0]['value']) : null;
                } catch (_0x261069) {
                    console['error']('[MYSQL]\x20Get\x20setting\x20error:', _0x261069['message']);
                    return null;
                }
            },
            async 'getAllSettings'(_0x26195f) {
                try {
                    const _0x85dd6e = await this['getConn']();
                    const [_0x260226] = await _0x85dd6e['execute']('SELECT\x20`key`,\x20value\x20FROM\x20settings\x20WHERE\x20chat_id=?', [_0x26195f]);
                    const _0x48e69d = {};
                    _0x260226['forEach'](_0x8c9107 => {
                        _0x48e69d[_0x8c9107['key']] = JSON['parse'](_0x8c9107['value']);
                    });
                    return _0x48e69d;
                } catch (_0x65e584) {
                    console['error']('[MYSQL]\x20Get\x20all\x20settings\x20error:', _0x65e584['message']);
                    return {};
                }
            },
            async 'cleanup'() {
                try {
                    const _0x1ac5b9 = await this['getConn']();
                    const [_0x4794e4] = await _0x1ac5b9['execute']('DELETE\x20FROM\x20messages\x20WHERE\x20ts\x20<\x20?', [Date['now']() - TTL_MS]);
                    if (_0x4794e4['affectedRows'] > 0x0) {
                        console['log']('[MYSQL]\x20Cleaned\x20up\x20' + _0x4794e4['affectedRows'] + '\x20old\x20messages');
                    }
                } catch (_0x4674c1) {
                    console['error']('[MYSQL]\x20Cleanup\x20error:', _0x4674c1['message']);
                }
            },
            async 'close'() {
                try {
                    if (mysqlConn) {
                        await mysqlConn['end']();
                        mysqlConn = null;
                        console['log']('[MYSQL]\x20Connection\x20closed');
                    }
                } catch (_0xd58872) {
                    console['error']('[MYSQL]\x20Close\x20error:', _0xd58872['message']);
                }
            }
        };
        backend = 'mysql';
        messageLimit = MESSAGE_LIMITS['mysql'];
        printLog('store', 'MySQL\x20enabled\x20-\x20Unlimited\x20storage\x20with\x20persistence');
    } catch (_0x0_0x354b6f) {
        printLog('warning', 'MySQL\x20initialization\x20failed:\x20' + _0x0_0x354b6f['message']);
    }
}
if (backend === 'memory' && SQLITE_URL) {
    try {
        const Database = require('better-sqlite3');
        const dir = _0x0_0x11189e['dirname'](SQLITE_URL);
        if (!_0x0_0x2899fe['existsSync'](dir))
            _0x0_0x2899fe['mkdirSync'](dir, { 'recursive': !![] });
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
            'save'(_0x5bcc28, _0x5236bc, _0x28920e) {
                try {
                    saveStmt['run'](_0x5bcc28, _0x5236bc, Date['now'](), compress(_0x28920e));
                    const {count: _0x419710} = countStmt['get'](_0x5bcc28);
                    if (_0x419710 > MESSAGE_LIMITS['sqlite']) {
                        const _0x7103af = _0x419710 - MESSAGE_LIMITS['sqlite'];
                        deleteOldestStmt['run'](_0x5bcc28, _0x5bcc28, _0x7103af);
                    }
                } catch (_0x487113) {
                    console['error']('[SQLITE]\x20Save\x20error:', _0x487113['message']);
                }
            },
            'load'(_0x3369c9, _0x1d9132) {
                try {
                    const _0x3cd1fe = loadStmt['get'](_0x3369c9, _0x1d9132);
                    return _0x3cd1fe ? decompress(_0x3cd1fe['data']) : null;
                } catch (_0x4ff854) {
                    console['error']('[SQLITE]\x20Load\x20error:', _0x4ff854['message']);
                    return null;
                }
            },
            'incrementCount'(_0x4d78b0, _0x36685b) {
                try {
                    incrementCountStmt['run'](_0x4d78b0, _0x36685b);
                } catch (_0x3e31e7) {
                    console['error']('[SQLITE]\x20Increment\x20count\x20error:', _0x3e31e7['message']);
                }
            },
            'getCount'(_0x44bfd8, _0x50dd46) {
                try {
                    const _0x1dec22 = getCountStmt['get'](_0x44bfd8, _0x50dd46);
                    return _0x1dec22 ? _0x1dec22['count'] : 0x0;
                } catch (_0x4e1d64) {
                    console['error']('[SQLITE]\x20Get\x20count\x20error:', _0x4e1d64['message']);
                    return 0x0;
                }
            },
            'getAllCounts'() {
                try {
                    const _0x22f66e = getAllCountsStmt['all']();
                    const _0x1c83d3 = {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                    _0x22f66e['forEach'](_0x17e6b9 => {
                        if (!_0x1c83d3['messageCount'][_0x17e6b9['chat_id']]) {
                            _0x1c83d3['messageCount'][_0x17e6b9['chat_id']] = {};
                        }
                        _0x1c83d3['messageCount'][_0x17e6b9['chat_id']][_0x17e6b9['user_id']] = _0x17e6b9['count'];
                    });
                    const _0xd35021 = getMetaStmt['get']();
                    if (_0xd35021)
                        _0x1c83d3['isPublic'] = _0xd35021['value'] === 'true';
                    return _0x1c83d3;
                } catch (_0x5ba33c) {
                    console['error']('[SQLITE]\x20Get\x20all\x20counts\x20error:', _0x5ba33c['message']);
                    return {
                        'isPublic': ![],
                        'messageCount': {}
                    };
                }
            },
            'setPublicMode'(_0x49c9f9) {
                try {
                    setMetaStmt['run'](_0x49c9f9['toString']());
                } catch (_0x4498b8) {
                    console['error']('[SQLITE]\x20Set\x20public\x20mode\x20error:', _0x4498b8['message']);
                }
            },
            'setMetadata'(_0x58838f, _0x200800) {
                try {
                    setMetadataStmt['run'](_0x58838f, _0x200800['toString']());
                } catch (_0x2a2d21) {
                    console['error']('[SQLITE]\x20Set\x20metadata\x20error:', _0x2a2d21['message']);
                }
            },
            'getMetadata'(_0x361345) {
                try {
                    const _0xabe6a6 = getMetadataStmt['get'](_0x361345);
                    return _0xabe6a6 ? _0xabe6a6['value'] : null;
                } catch (_0x12c55c) {
                    console['error']('[SQLITE]\x20Get\x20metadata\x20error:', _0x12c55c['message']);
                    return null;
                }
            },
            'saveContact'(_0x47dea5, _0x1ade8b) {
                try {
                    saveContactStmt['run'](_0x47dea5, _0x1ade8b['name'] || '', _0x1ade8b['notify'] || '', _0x1ade8b['verifiedName'] || '', Date['now']());
                } catch (_0x4bd37a) {
                    console['error']('[SQLITE]\x20Save\x20contact\x20error:', _0x4bd37a['message']);
                }
            },
            'getContact'(_0x2e34fe) {
                try {
                    return getContactStmt['get'](_0x2e34fe) || null;
                } catch (_0x256bb8) {
                    console['error']('[SQLITE]\x20Get\x20contact\x20error:', _0x256bb8['message']);
                    return null;
                }
            },
            'getAllContacts'() {
                try {
                    const _0x4cdb45 = getAllContactsStmt['all']();
                    const _0x5ad594 = {};
                    _0x4cdb45['forEach'](_0x4f08f5 => {
                        _0x5ad594[_0x4f08f5['jid']] = {
                            'id': _0x4f08f5['jid'],
                            'name': _0x4f08f5['name'],
                            'notify': _0x4f08f5['notify']
                        };
                    });
                    return _0x5ad594;
                } catch (_0x4a4c02) {
                    console['error']('[SQLITE]\x20Get\x20all\x20contacts\x20error:', _0x4a4c02['message']);
                    return {};
                }
            },
            'saveChat'(_0x178edb, _0x16b828) {
                try {
                    saveChatStmt['run'](_0x178edb, _0x16b828['name'] || '', _0x16b828['conversationTimestamp'] || 0x0, _0x16b828['unreadCount'] || 0x0, Date['now']());
                } catch (_0x4b04b5) {
                    console['error']('[SQLITE]\x20Save\x20chat\x20error:', _0x4b04b5['message']);
                }
            },
            'getChat'(_0x4b941c) {
                try {
                    return getChatStmt['get'](_0x4b941c) || null;
                } catch (_0x3025d2) {
                    console['error']('[SQLITE]\x20Get\x20chat\x20error:', _0x3025d2['message']);
                    return null;
                }
            },
            'getAllChats'() {
                try {
                    const _0x453306 = getAllChatsStmt['all']();
                    const _0xae9bf2 = {};
                    _0x453306['forEach'](_0x32729c => {
                        _0xae9bf2[_0x32729c['jid']] = {
                            'id': _0x32729c['jid'],
                            'name': _0x32729c['name'],
                            'conversationTimestamp': _0x32729c['conversation_timestamp'],
                            'unreadCount': _0x32729c['unread_count']
                        };
                    });
                    return _0xae9bf2;
                } catch (_0x2f5e61) {
                    console['error']('[SQLITE]\x20Get\x20all\x20chats\x20error:', _0x2f5e61['message']);
                    return {};
                }
            },
            'deleteChat'(_0x40f631) {
                try {
                    deleteChatStmt['run'](_0x40f631);
                } catch (_0x48353e) {
                    console['error']('[SQLITE]\x20Delete\x20chat\x20error:', _0x48353e['message']);
                }
            },
            'saveSetting'(_0x532425, _0x58db7c, _0x506255) {
                try {
                    saveSettingStmt['run'](_0x532425, _0x58db7c, JSON['stringify'](_0x506255), Date['now']());
                } catch (_0x577154) {
                    console['error']('[SQLITE]\x20Save\x20setting\x20error:', _0x577154['message']);
                }
            },
            'getSetting'(_0x8f0b57, _0x3d2465) {
                try {
                    const _0x431d05 = getSettingStmt['get'](_0x8f0b57, _0x3d2465);
                    return _0x431d05 ? JSON['parse'](_0x431d05['value']) : null;
                } catch (_0x94190d) {
                    console['error']('[SQLITE]\x20Get\x20setting\x20error:', _0x94190d['message']);
                    return null;
                }
            },
            'getAllSettings'(_0x21a623) {
                try {
                    const _0x354724 = getAllSettingsStmt['all'](_0x21a623);
                    const _0x2f9970 = {};
                    _0x354724['forEach'](_0x32bb25 => {
                        _0x2f9970[_0x32bb25['key']] = JSON['parse'](_0x32bb25['value']);
                    });
                    return _0x2f9970;
                } catch (_0x18604a) {
                    console['error']('[SQLITE]\x20Get\x20all\x20settings\x20error:', _0x18604a['message']);
                    return {};
                }
            },
            'cleanup'() {
                try {
                    const _0x4841ae = cleanupStmt['run'](Date['now']() - TTL_MS);
                    if (_0x4841ae['changes'] > 0x0) {
                        console['log']('[SQLITE]\x20Cleaned\x20up\x20' + _0x4841ae['changes'] + '\x20old\x20messages');
                    }
                } catch (_0x13088e) {
                    console['error']('[SQLITE]\x20Cleanup\x20error:', _0x13088e['message']);
                }
            },
            'close'() {
                try {
                    sqlite['close']();
                    console['log']('[SQLITE]\x20Database\x20closed');
                } catch (_0x43b81e) {
                    console['error']('[SQLITE]\x20Close\x20error:', _0x43b81e['message']);
                }
            }
        };
        backend = 'sqlite';
        messageLimit = MESSAGE_LIMITS['sqlite'];
        printLog('store', 'SQLite\x20enabled\x20-\x20Max\x20' + MESSAGE_LIMITS['sqlite'] + '\x20messages\x20per\x20chat\x20with\x20persistence');
    } catch (_0x0_0x3de725) {
        printLog('warning', 'SQLite\x20initialization\x20failed:\x20' + _0x0_0x3de725['message']);
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
    async 'readFromFile'(_0x1390f3 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                const _0x3802ce = await adapters[backend]['getAllContacts']();
                const _0x493bbe = await adapters[backend]['getAllChats']();
                const _0x2cfded = await this['getBotMode']();
                this['contacts'] = _0x3802ce;
                this['chats'] = _0x493bbe;
                this['botMode'] = _0x2cfded;
            } else {
                if (_0x0_0x2899fe['existsSync'](_0x1390f3)) {
                    const _0x405438 = JSON['parse'](_0x0_0x2899fe['readFileSync'](_0x1390f3, 'utf-8'));
                    this['contacts'] = _0x405438['contacts'] || {};
                    this['chats'] = _0x405438['chats'] || {};
                    this['botMode'] = _0x405438['botMode'] || 'private';
                    this['messages'] = _0x405438['messages'] || {};
                    this['isPublic'] = _0x405438['isPublic'] !== undefined ? _0x405438['isPublic'] : ![];
                    this['cleanupData']();
                }
            }
        } catch (_0x2dce4b) {
            console['warn']('[STORE]\x20Failed\x20to\x20read\x20store\x20file:', _0x2dce4b['message']);
        }
        await this['loadMessageCounts']();
    },
    async 'writeToFile'(_0x13b057 = STORE_FILE) {
        try {
            if (backend !== 'memory') {
                return;
            }
            const _0x5f07d9 = {
                'contacts': this['contacts'],
                'chats': this['chats'],
                'botMode': this['botMode'] || 'private',
                'messages': this['messages']
            };
            _0x0_0x2899fe['writeFileSync'](_0x13b057, JSON['stringify'](_0x5f07d9, null, 0x2));
        } catch (_0x252ee0) {
            console['warn']('[STORE]\x20Failed\x20to\x20write\x20store\x20file:', _0x252ee0['message']);
        }
        await this['saveMessageCounts']();
    },
    async 'loadMessageCounts'() {
        if (backend === 'memory') {
            try {
                if (_0x0_0x2899fe['existsSync'](MESSAGE_COUNT_FILE)) {
                    const _0x1d41c5 = JSON['parse'](_0x0_0x2899fe['readFileSync'](MESSAGE_COUNT_FILE, 'utf-8'));
                    this['messageCount'] = _0x1d41c5['messageCount'] || _0x1d41c5;
                    this['isPublic'] = typeof _0x1d41c5['isPublic'] === 'boolean' ? _0x1d41c5['isPublic'] : ![];
                }
            } catch (_0x3a9b75) {
                console['warn']('[STORE]\x20Failed\x20to\x20read\x20message\x20count\x20file:', _0x3a9b75['message']);
            }
        }
    },
    async 'saveMessageCounts'() {
        if (backend === 'memory') {
            try {
                const _0xb61375 = _0x0_0x11189e['dirname'](MESSAGE_COUNT_FILE);
                if (!_0x0_0x2899fe['existsSync'](_0xb61375))
                    _0x0_0x2899fe['mkdirSync'](_0xb61375, { 'recursive': !![] });
                const _0x1f9884 = {
                    'isPublic': this['isPublic'],
                    'messageCount': this['messageCount']
                };
                _0x0_0x2899fe['writeFileSync'](MESSAGE_COUNT_FILE, JSON['stringify'](_0x1f9884, null, 0x2));
            } catch (_0x16520a) {
                console['warn']('[STORE]\x20Failed\x20to\x20write\x20message\x20count\x20file:', _0x16520a['message']);
            }
        }
    },
    'cleanupData'() {
        if (this['messages'] && backend === 'memory') {
            Object['keys'](this['messages'])['forEach'](_0x5f512f => {
                if (typeof this['messages'][_0x5f512f] === 'object' && !Array['isArray'](this['messages'][_0x5f512f])) {
                    const _0x9a2c3d = Object['values'](this['messages'][_0x5f512f]);
                    this['messages'][_0x5f512f] = _0x9a2c3d['slice'](-MAX_MESSAGES);
                } else if (Array['isArray'](this['messages'][_0x5f512f])) {
                    if (this['messages'][_0x5f512f]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x5f512f] = this['messages'][_0x5f512f]['slice'](-MAX_MESSAGES);
                    }
                }
            });
        }
        if (this['chats']) {
            Object['keys'](this['chats'])['forEach'](_0x53aed0 => {
                if (this['chats'][_0x53aed0]['messages']) {
                    delete this['chats'][_0x53aed0]['messages'];
                }
            });
        }
    },
    'bind'(_0x227265) {
        _0x227265['on']('messages.upsert', async ({messages: _0x25d0a9}) => {
            for (const _0x35b249 of _0x25d0a9) {
                if (!_0x35b249['key']?.['remoteJid'])
                    continue;
                const _0x3edef4 = _0x35b249['key']['remoteJid'];
                const _0x22b410 = slimMessage(_0x35b249);
                if (backend === 'memory') {
                    this['messages'][_0x3edef4] = this['messages'][_0x3edef4] || [];
                    this['messages'][_0x3edef4]['push'](_0x22b410);
                    if (this['messages'][_0x3edef4]['length'] > MAX_MESSAGES) {
                        this['messages'][_0x3edef4] = this['messages'][_0x3edef4]['slice'](-MAX_MESSAGES);
                    }
                } else {
                    try {
                        await adapters[backend]['save'](_0x3edef4, _0x35b249['key']['id'], _0x22b410);
                    } catch (_0x3482b3) {
                        console['error']('[STORE]\x20Failed\x20to\x20save\x20message\x20' + _0x35b249['key']['id'] + ':', _0x3482b3['message']);
                    }
                }
            }
        });
        _0x227265['on']('contacts.update', async _0x1f22e4 => {
            for (const _0x24b0b0 of _0x1f22e4) {
                if (_0x24b0b0['id']) {
                    const _0xb898ce = {
                        'id': _0x24b0b0['id'],
                        'name': _0x24b0b0['notify'] || _0x24b0b0['name'] || _0x24b0b0['verifiedName'] || '',
                        'notify': _0x24b0b0['notify'],
                        'verifiedName': _0x24b0b0['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x24b0b0['id']] = _0xb898ce;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x24b0b0['id'], _0xb898ce);
                        } catch (_0x2e992e) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x2e992e['message']);
                        }
                    }
                }
            }
        });
        _0x227265['on']('contacts.set', async _0x2e1f23 => {
            for (const _0x381791 of _0x2e1f23) {
                if (_0x381791['id']) {
                    const _0x1514ec = {
                        'id': _0x381791['id'],
                        'name': _0x381791['notify'] || _0x381791['name'] || _0x381791['verifiedName'] || '',
                        'notify': _0x381791['notify'],
                        'verifiedName': _0x381791['verifiedName']
                    };
                    if (backend === 'memory') {
                        this['contacts'][_0x381791['id']] = _0x1514ec;
                    } else {
                        try {
                            await adapters[backend]['saveContact'](_0x381791['id'], _0x1514ec);
                        } catch (_0x8eb190) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20contact:', _0x8eb190['message']);
                        }
                    }
                }
            }
        });
        _0x227265['on']('chats.set', async _0x4f1233 => {
            for (const _0x5a2a4a of _0x4f1233) {
                if (_0x5a2a4a['id']) {
                    const _0x4b8f79 = {
                        'id': _0x5a2a4a['id'],
                        'name': _0x5a2a4a['name'] || _0x5a2a4a['subject'] || '',
                        'conversationTimestamp': _0x5a2a4a['conversationTimestamp'],
                        'unreadCount': _0x5a2a4a['unreadCount'] || 0x0
                    };
                    if (backend === 'memory') {
                        this['chats'][_0x5a2a4a['id']] = _0x4b8f79;
                    } else {
                        try {
                            await adapters[backend]['saveChat'](_0x5a2a4a['id'], _0x4b8f79);
                        } catch (_0x30a6ae) {
                            console['error']('[STORE]\x20Failed\x20to\x20save\x20chat:', _0x30a6ae['message']);
                        }
                    }
                }
            }
        });
        _0x227265['on']('chats.update', async _0x2270c4 => {
            for (const _0x892b92 of _0x2270c4) {
                if (_0x892b92['id']) {
                    if (backend === 'memory') {
                        const _0x3d5fa1 = this['chats'][_0x892b92['id']] || {};
                        this['chats'][_0x892b92['id']] = {
                            'id': _0x892b92['id'],
                            'name': _0x892b92['name'] || _0x892b92['subject'] || _0x3d5fa1['name'] || '',
                            'conversationTimestamp': _0x892b92['conversationTimestamp'] || _0x3d5fa1['conversationTimestamp'],
                            'unreadCount': _0x892b92['unreadCount'] !== undefined ? _0x892b92['unreadCount'] : _0x3d5fa1['unreadCount']
                        };
                    } else {
                        try {
                            const _0x4dda87 = await adapters[backend]['getChat'](_0x892b92['id']) || {};
                            const _0x4f9d62 = {
                                'id': _0x892b92['id'],
                                'name': _0x892b92['name'] || _0x892b92['subject'] || _0x4dda87['name'] || '',
                                'conversationTimestamp': _0x892b92['conversationTimestamp'] || _0x4dda87['conversation_timestamp'],
                                'unreadCount': _0x892b92['unreadCount'] !== undefined ? _0x892b92['unreadCount'] : _0x4dda87['unread_count']
                            };
                            await adapters[backend]['saveChat'](_0x892b92['id'], _0x4f9d62);
                        } catch (_0x28e49c) {
                            console['error']('[STORE]\x20Failed\x20to\x20update\x20chat:', _0x28e49c['message']);
                        }
                    }
                }
            }
        });
        _0x227265['on']('chats.delete', async _0x44a91e => {
            for (const _0x1e4826 of _0x44a91e) {
                if (backend === 'memory') {
                    delete this['chats'][_0x1e4826];
                    delete this['messages'][_0x1e4826];
                } else {
                    try {
                        await adapters[backend]['deleteChat'](_0x1e4826);
                    } catch (_0x2e415d) {
                        console['error']('[STORE]\x20Failed\x20to\x20delete\x20chat:', _0x2e415d['message']);
                    }
                }
            }
        });
    },
    async 'loadMessage'(_0x4bcc91, _0x5a6848) {
        if (backend === 'memory') {
            const _0x939203 = this['messages'][_0x4bcc91]?.['find'](_0x142f34 => _0x142f34['key']['id'] === _0x5a6848) || null;
            return _0x939203;
        } else {
            try {
                return await adapters[backend]['load'](_0x4bcc91, _0x5a6848);
            } catch (_0x155acd) {
                console['error']('[STORE]\x20Failed\x20to\x20load\x20message\x20' + _0x5a6848 + ':', _0x155acd['message']);
                return null;
            }
        }
    },
    async 'saveSetting'(_0x164622, _0x250687, _0x5240bf) {
        if (backend === 'memory') {
            const _0x2349c1 = './data';
            if (!_0x0_0x2899fe['existsSync'](_0x2349c1))
                _0x0_0x2899fe['mkdirSync'](_0x2349c1, { 'recursive': !![] });
            const _0x574080 = _0x0_0x11189e['join'](_0x2349c1, _0x250687 + '.json');
            try {
                _0x0_0x2899fe['writeFileSync'](_0x574080, JSON['stringify'](_0x5240bf, null, 0x2));
            } catch (_0x47c402) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x250687 + ':', _0x47c402['message']);
            }
        } else {
            try {
                await adapters[backend]['saveSetting'](_0x164622, _0x250687, _0x5240bf);
            } catch (_0x5169fe) {
                console['error']('[STORE]\x20Failed\x20to\x20save\x20setting\x20' + _0x250687 + ':', _0x5169fe['message']);
            }
        }
    },
    async 'getSetting'(_0x2a678f, _0x3c30b4) {
        if (backend === 'memory') {
            const _0x1ecf93 = './data';
            const _0x51d108 = _0x0_0x11189e['join'](_0x1ecf93, _0x3c30b4 + '.json');
            try {
                if (_0x0_0x2899fe['existsSync'](_0x51d108)) {
                    const _0x18eea9 = JSON['parse'](_0x0_0x2899fe['readFileSync'](_0x51d108, 'utf-8'));
                    if (_0x18eea9['enabled'] !== undefined)
                        return _0x18eea9;
                    if (_0x18eea9[_0x2a678f] !== undefined)
                        return _0x18eea9[_0x2a678f];
                    return null;
                }
                return null;
            } catch (_0x433aa9) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x3c30b4 + ':', _0x433aa9['message']);
                return null;
            }
        } else {
            try {
                return await adapters[backend]['getSetting'](_0x2a678f, _0x3c30b4);
            } catch (_0x4178cf) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20setting\x20' + _0x3c30b4 + ':', _0x4178cf['message']);
                return null;
            }
        }
    },
    async 'getAllSettings'(_0x17aabf) {
        if (backend === 'memory') {
            const _0x236f8e = './data';
            const _0xd3f353 = {};
            try {
                if (_0x0_0x2899fe['existsSync'](_0x236f8e)) {
                    const _0x531ee9 = _0x0_0x2899fe['readdirSync'](_0x236f8e)['filter'](_0x3d2084 => _0x3d2084['endsWith']('.json'));
                    for (const _0x1b1b00 of _0x531ee9) {
                        const _0xafea4f = _0x0_0x11189e['basename'](_0x1b1b00, '.json');
                        if (_0xafea4f === 'messageCount' || _0xafea4f === 'owner')
                            continue;
                        const _0x645bb0 = _0x0_0x11189e['join'](_0x236f8e, _0x1b1b00);
                        const _0x3ed9c9 = JSON['parse'](_0x0_0x2899fe['readFileSync'](_0x645bb0, 'utf-8'));
                        if (_0x3ed9c9[_0x17aabf]) {
                            _0xd3f353[_0xafea4f] = _0x3ed9c9[_0x17aabf];
                        }
                    }
                }
                return _0xd3f353;
            } catch (_0x3a687a) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x3a687a['message']);
                return {};
            }
        } else {
            try {
                return await adapters[backend]['getAllSettings'](_0x17aabf);
            } catch (_0x4b22e5) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20settings:', _0x4b22e5['message']);
                return {};
            }
        }
    },
    async 'setBotMode'(_0x15f9be) {
        const _0x1ffdd6 = [
            'public',
            'private',
            'groups',
            'inbox',
            'self'
        ];
        if (!_0x1ffdd6['includes'](_0x15f9be)) {
            console['warn']('[STORE]\x20Invalid\x20mode:\x20' + _0x15f9be + ',\x20defaulting\x20to\x20private');
            _0x15f9be = 'private';
        }
        if (backend === 'memory') {
            this['botMode'] = _0x15f9be;
        } else {
            try {
                await adapters[backend]['setMetadata']('botMode', _0x15f9be);
            } catch (_0xfbb0) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20bot\x20mode:', _0xfbb0['message']);
            }
        }
    },
    async 'getBotMode'() {
        if (backend === 'memory') {
            return this['botMode'] || 'private';
        } else {
            try {
                const _0x20c900 = await adapters[backend]['getMetadata']('botMode');
                return _0x20c900 || 'private';
            } catch (_0x3cd3c1) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20bot\x20mode:', _0x3cd3c1['message']);
                return 'private';
            }
        }
    },
    async 'incrementMessageCount'(_0x35d3a9, _0x2d423a, _0x440902) {
        if (backend === 'memory') {
            if (!this['messageCount'][_0x35d3a9]) {
                this['messageCount'][_0x35d3a9] = {};
            }
            if (!this['messageCount'][_0x35d3a9][_0x2d423a]) {
                this['messageCount'][_0x35d3a9][_0x2d423a] = 0x0;
            }
            this['messageCount'][_0x35d3a9][_0x2d423a]++;
        } else {
            try {
                await adapters[backend]['incrementCount'](_0x35d3a9, _0x2d423a);
            } catch (_0x52738d) {
                console['error']('[STORE]\x20Failed\x20to\x20increment\x20count\x20for\x20' + _0x2d423a + ':', _0x52738d['message']);
            }
        }
    },
    async 'getMessageCount'(_0x25f95d, _0x61cf4f) {
        if (backend === 'memory') {
            return this['messageCount'][_0x25f95d]?.[_0x61cf4f] || 0x0;
        } else {
            try {
                return await adapters[backend]['getCount'](_0x25f95d, _0x61cf4f);
            } catch (_0x4a4f58) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20count\x20for\x20' + _0x61cf4f + ':', _0x4a4f58['message']);
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
            } catch (_0x3cbf6c) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20all\x20counts:', _0x3cbf6c['message']);
                return {
                    'isPublic': ![],
                    'messageCount': {}
                };
            }
        }
    },
    async 'setPublicMode'(_0x114592) {
        if (backend === 'memory') {
            this['isPublic'] = _0x114592;
        } else {
            try {
                await adapters[backend]['setPublicMode'](_0x114592);
            } catch (_0x5e2ddf) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20public\x20mode:', _0x5e2ddf['message']);
            }
        }
    },
    async 'getPublicMode'() {
        if (backend === 'memory') {
            return this['isPublic'];
        } else {
            try {
                const _0x42986b = await adapters[backend]['getAllCounts']();
                return _0x42986b['isPublic'];
            } catch (_0x256c5d) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20public\x20mode:', _0x256c5d['message']);
                return ![];
            }
        }
    },
    async 'setChatbotMode'(_0x1a53fe) {
        const _0x558928 = [
            'public',
            'private'
        ];
        if (!_0x558928['includes'](_0x1a53fe)) {
            console['warn']('[STORE]\x20Invalid\x20chatbot\x20mode:\x20' + _0x1a53fe);
            _0x1a53fe = 'private';
        }
        if (backend === 'memory') {
            this['chatbotMode'] = _0x1a53fe;
        } else {
            try {
                await adapters[backend]['setMetadata']('chatbotMode', _0x1a53fe);
            } catch (_0xf913ea) {
                console['error']('[STORE]\x20Failed\x20to\x20set\x20chatbot\x20mode:', _0xf913ea['message']);
            }
        }
    },
    async 'getChatbotMode'() {
        if (backend === 'memory') {
            return this['chatbotMode'] || 'private';
        } else {
            try {
                const _0x52b02b = await adapters[backend]['getMetadata']('chatbotMode');
                return _0x52b02b || 'private';
            } catch (_0x552cc6) {
                console['error']('[STORE]\x20Failed\x20to\x20get\x20chatbot\x20mode:', _0x552cc6['message']);
                return 'private';
            }
        }
    },
    'getStats'() {
        let _0xd46387 = 0x0;
        const _0x40ec30 = Object['keys'](this['contacts'])['length'];
        const _0x4dc149 = Object['keys'](this['chats'])['length'];
        let _0xb404d = 0x0;
        if (backend === 'memory') {
            Object['values'](this['messages'])['forEach'](_0x1bef40 => {
                if (Array['isArray'](_0x1bef40)) {
                    _0xd46387 += _0x1bef40['length'];
                }
            });
            Object['values'](this['messageCount'])['forEach'](_0x5243ce => {
                if (typeof _0x5243ce === 'object') {
                    _0xb404d += Object['keys'](_0x5243ce)['length'];
                }
            });
        }
        return {
            'backend': backend,
            'messages': backend === 'memory' ? _0xd46387 : 'stored\x20in\x20database',
            'contacts': _0x40ec30,
            'chats': _0x4dc149,
            'messageCounts': backend === 'memory' ? _0xb404d : 'stored\x20in\x20database',
            'maxMessagesPerChat': messageLimit === Infinity ? 'unlimited' : messageLimit,
            'isPublic': this['isPublic'],
            'botMode': this['botMode']
        };
    }
};
if (backend !== 'memory') {
    setTimeout(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x45576c => console['error']('[STORE]\x20Initial\x20cleanup\x20error:', _0x45576c));
        }
    }, 0x5 * 0x3c * 0x3e8);
    cleanupTimer = setInterval(() => {
        if (adapters[backend]['cleanup']) {
            Promise['resolve'](adapters[backend]['cleanup']())['catch'](_0x9a4a23 => console['error']('[STORE]\x20Periodic\x20cleanup\x20error:', _0x9a4a23));
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
        let _0x572cfa = 0x0;
        Object['keys'](store['chats'])['forEach'](_0x5e080d => {
            if (store['chats'][_0x5e080d]['messages']) {
                delete store['chats'][_0x5e080d]['messages'];
                _0x572cfa++;
            }
        });
        if (_0x572cfa > 0x0) {
            console['log']('[STORE]\x20Cleaned\x20messages\x20from\x20' + _0x572cfa + '\x20chats');
        }
    }
}, 0x3c * 0x3e8);
const gracefulShutdown = async _0x5bc8ef => {
    console['log']('[STORE]\x20Received\x20' + _0x5bc8ef + ',\x20shutting\x20down\x20gracefully...');
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
        } catch (_0xbe8721) {
            console['error']('[STORE]\x20Error\x20during\x20shutdown:', _0xbe8721['message']);
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
process['on']('uncaughtException', _0x5e81d5 => {
    console['error']('[STORE]\x20Uncaught\x20exception:', _0x5e81d5);
    if (backend === 'memory') {
        store['writeToFile']();
    }
});
process['on']('unhandledRejection', (_0x3b1b3d, _0x56d3c3) => {
    console['error']('[STORE]\x20Unhandled\x20rejection\x20at:', _0x56d3c3, 'reason:', _0x3b1b3d);
});
export default store;