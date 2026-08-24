import _0x0_0x2c8432 from 'fs';
import _0x0_0x590fe7, { dirname } from 'path';
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
            if (_0x0_0x2c8432['existsSync'](CONFIG_FILE)) {
                const _0x412bc8 = JSON['parse'](_0x0_0x2c8432['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x412bc8
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
                console['log']('📋\x20Provider:', this['config']['provider']);
                console['log']('📋\x20Mode:', this['config']['mode']);
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults\x20(Pollinations)');
            }
        } catch (_0x4a843e) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x4a843e);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x2bad0c = _0x0_0x590fe7['dirname'](CONFIG_FILE);
            if (!_0x0_0x2c8432['existsSync'](_0x2bad0c)) {
                _0x0_0x2c8432['mkdirSync'](_0x2bad0c, { 'recursive': !![] });
            }
            _0x0_0x2c8432['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x36d8f3) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x36d8f3);
            return ![];
        }
    }
    ['get'](_0x1b5912) {
        return this['config'][_0x1b5912];
    }
    ['set'](_0x47f306, _0x2058bf) {
        this['config'][_0x47f306] = _0x2058bf;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        const _0x45ad8c = {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature'],
            'botName': this['config']['botName'] || 'Nova'
        };
        return _0x45ad8c;
    }
}
export default new ChatbotConfig();