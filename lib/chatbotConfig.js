import _0x0_0x1ab5dc from 'fs';
import _0x0_0x392fab, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_FILE = './data/chatbot_config.json';
const DEFAULT_CONFIG = {
    'enabled': !![],
    'mode': 'private',
    'provider': 'grok',
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
            if (_0x0_0x1ab5dc['existsSync'](CONFIG_FILE)) {
                const _0x4d350e = JSON['parse'](_0x0_0x1ab5dc['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x4d350e
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults');
            }
        } catch (_0x5cd6f1) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x5cd6f1);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x354ecb = _0x0_0x392fab['dirname'](CONFIG_FILE);
            if (!_0x0_0x1ab5dc['existsSync'](_0x354ecb)) {
                _0x0_0x1ab5dc['mkdirSync'](_0x354ecb, { 'recursive': !![] });
            }
            _0x0_0x1ab5dc['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x17d50b) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x17d50b);
            return ![];
        }
    }
    ['get'](_0x5720d6) {
        return this['config'][_0x5720d6];
    }
    ['set'](_0x4842f8, _0x1b03d3) {
        this['config'][_0x4842f8] = _0x1b03d3;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        const _0xe44e0c = {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature'],
            'botName': this['config']['botName'] || 'Nova'
        };
        return _0xe44e0c;
    }
}
export default new ChatbotConfig();