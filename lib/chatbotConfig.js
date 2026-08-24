import _0x0_0x111112 from 'fs';
import _0x0_0x2cecea from 'path';
const CONFIG_FILE = './data/chatbot_config.json';
const DEFAULT_CONFIG = {
    'enabled': !![],
    'mode': 'public',
    'provider': 'systemai',
    'apiKey': '',
    'apiUrl': '',
    'puterModel': 'gpt-5.4-nano',
    'grokModel': 'grok-4.6',
    'customContext': '',
    'maxHistory': 0xf,
    'temperature': 0.7,
    'maxTokens': 0x400,
    'responseTimeout': 0x3a98,
    'language': 'auto',
    'responsePrefix': '🤖\x20',
    'fallbackResponse': 'Désolé,\x20je\x20n\x27ai\x20pas\x20pu\x20traiter\x20votre\x20demande.\x20Veuillez\x20réessayer.\x20🥲',
    'executeCommands': !![],
    'autoDetectLanguage': !![],
    'botName': 'Nova'
};
class ChatbotConfig {
    constructor() {
        this['config'] = null;
        this['loadConfig']();
    }
    ['loadConfig']() {
        try {
            if (_0x0_0x111112['existsSync'](CONFIG_FILE)) {
                const _0x1168cf = JSON['parse'](_0x0_0x111112['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x1168cf
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults');
            }
        } catch (_0x3ccf06) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x3ccf06);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x44e645 = _0x0_0x2cecea['dirname'](CONFIG_FILE);
            if (!_0x0_0x111112['existsSync'](_0x44e645)) {
                _0x0_0x111112['mkdirSync'](_0x44e645, { 'recursive': !![] });
            }
            _0x0_0x111112['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x3a7b17) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x3a7b17);
            return ![];
        }
    }
    ['get'](_0x24cca3) {
        return this['config'][_0x24cca3];
    }
    ['set'](_0x386475, _0x318c9d) {
        this['config'][_0x386475] = _0x318c9d;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        const _0x3367ed = {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature']
        };
        return _0x3367ed;
    }
}
export default new ChatbotConfig();