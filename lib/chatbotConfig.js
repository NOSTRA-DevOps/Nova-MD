import _0x0_0x4d4538 from 'fs';
import _0x0_0x59efd9, { dirname } from 'path';
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
            if (_0x0_0x4d4538['existsSync'](CONFIG_FILE)) {
                const _0x3b2524 = JSON['parse'](_0x0_0x4d4538['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x3b2524
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
                console['log']('📋\x20Provider:', this['config']['provider']);
                console['log']('📋\x20Mode:', this['config']['mode']);
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults\x20(Pollinations)');
            }
        } catch (_0x47ea6c) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x47ea6c);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x5a3dee = _0x0_0x59efd9['dirname'](CONFIG_FILE);
            if (!_0x0_0x4d4538['existsSync'](_0x5a3dee)) {
                _0x0_0x4d4538['mkdirSync'](_0x5a3dee, { 'recursive': !![] });
            }
            _0x0_0x4d4538['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x59570e) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x59570e);
            return ![];
        }
    }
    ['get'](_0x47f09c) {
        return this['config'][_0x47f09c];
    }
    ['set'](_0x4780d3, _0x3d0dd9) {
        this['config'][_0x4780d3] = _0x3d0dd9;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        const _0x40727d = {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature'],
            'botName': this['config']['botName'] || 'Nova'
        };
        return _0x40727d;
    }
}
export default new ChatbotConfig();