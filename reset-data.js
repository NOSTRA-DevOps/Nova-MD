import _0x0_0x4b9988 from 'fs';
import _0x0_0x4f7ff7 from 'path';
const DATA_DIR = _0x0_0x4f7ff7['join'](process['cwd'](), 'data');
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
if (!_0x0_0x4b9988['existsSync'](DATA_DIR))
    _0x0_0x4b9988['mkdirSync'](DATA_DIR, { 'recursive': !![] });
for (const [file, value] of Object['entries'](defaults)) {
    const filePath = _0x0_0x4f7ff7['join'](DATA_DIR, file);
    _0x0_0x4b9988['writeFileSync'](filePath, JSON['stringify'](value, null, 0x2));
    console['log']('✅\x20Reset:\x20' + file);
}
console['log']('\x0a✅\x20All\x20data\x20files\x20reset\x20to\x20defaults!');