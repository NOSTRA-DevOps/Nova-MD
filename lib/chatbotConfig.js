import _0x0_0x32f86a from 'fs';
import _0x0_0x19ce13, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_FILE = './data/chatbot_config.json';
const DEFAULT_CONFIG = {
    'enabled': !![],
    'mode': 'public',
    'provider': 'pollinations',
    'apiKey': '',
    'apiUrl': '',
    'puterModel': 'gpt-5.4-nano',
    'grokModel': 'grok-4.3',
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
            if (_0x0_0x32f86a['existsSync'](CONFIG_FILE)) {
                const _0x261714 = JSON['parse'](_0x0_0x32f86a['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x261714
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
                console['log']('📋\x20Provider:', this['config']['provider']);
                console['log']('📋\x20Mode:', this['config']['mode']);
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults\x20(Pollinations)');
            }
        } catch (_0x2718b1) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x2718b1);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x4f7768 = _0x0_0x19ce13['dirname'](CONFIG_FILE);
            if (!_0x0_0x32f86a['existsSync'](_0x4f7768)) {
                _0x0_0x32f86a['mkdirSync'](_0x4f7768, { 'recursive': !![] });
            }
            _0x0_0x32f86a['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x55ee63) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x55ee63);
            return ![];
        }
    }
    ['get'](_0x48920e) {
        return this['config'][_0x48920e];
    }
    ['set'](_0x5f49bd, _0x49633f) {
        this['config'][_0x5f49bd] = _0x49633f;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        const _0x523fd5 = {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature'],
            'botName': this['config']['botName'] || 'Nova'
        };
        return _0x523fd5;
    }
}
export default new ChatbotConfig();