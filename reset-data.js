import _0x0_0x15d06a from 'fs';
import _0x0_0x32d7ab from 'path';
const DATA_DIR = _0x0_0x32d7ab['join'](process['cwd'](), 'data');
const defaults = {
    'autoStatus.json': { 'enabled': ![] },
    'autoread.json': { 'enabled': ![] },
    'autotyping.json': { 'enabled': ![] },
    'pmblocker.json': { 'enabled': ![] },
    'anticall.json': { 'enabled': ![] },
    'stealthMode.json': { 'enabled': ![] },
    'autoBio.json': {
        'enabled': ![],
        'customBio': null
    },
    'autoReaction.json': { 'enabled': ![] },
    'messageCount.json': {
        'isPublic': !![],
        'messageCount': {}
    },
    'userGroupData.json': {
        'users': [],
        'groups': [],
        'antilink': {},
        'antibadword': {},
        'warnings': {},
        'sudo': [],
        'welcome': {},
        'goodbye': {},
        'chatbot': {},
        'autoReaction': ![]
    },
    'banned.json': [],
    'warnings.json': {},
    'notes.json': {},
    'owner.json': [],
    'premium.json': [],
    'autoAi.json': {},
    'antidelete.json': { 'enabled': ![] },
    'antilink.json': {},
    'antibadword.json': {},
    'antispam.json': { 'groups': {} },
    'autoreplies.json': {
        'enabled': !![],
        'replies': []
    },
    'schedules.json': [],
    'polls.json': { 'polls': [] },
    'baileys_store.json': {}
};
if (!_0x0_0x15d06a['existsSync'](DATA_DIR))
    _0x0_0x15d06a['mkdirSync'](DATA_DIR, { 'recursive': !![] });
for (const [file, value] of Object['entries'](defaults)) {
    const filePath = _0x0_0x32d7ab['join'](DATA_DIR, file);
    _0x0_0x15d06a['writeFileSync'](filePath, JSON['stringify'](value, null, 0x2));
    console['log']('✅\x20Reset:\x20' + file);
}
console['log']('\x0a✅\x20All\x20data\x20files\x20reset\x20to\x20defaults!');