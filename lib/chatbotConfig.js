import _0x0_0x1c7918 from 'fs';
import _0x0_0x583a62, { dirname } from 'path';
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
    'grokModel': 'grok-1',
    'customContext': '',
    'maxHistory': 0xf,
    'temperature': 0.7,
    'maxTokens': 0x400,
    'responseTimeout': 0x3a98,
    'language': 'auto',
    'responsePrefix': '🤖\x20',
    'fallbackResponse': 'Désolé,\x20je\x20n\x27ai\x20pas\x20pu\x20traiter\x20votre\x20demande.\x20Veuillez\x20réessayer.\x20🥲',
    'executeCommands': !![],
    'autoDetectLanguage': !![]
};
class ChatbotConfig {
    constructor() {
        this['config'] = null;
        this['loadConfig']();
    }
    ['loadConfig']() {
        try {
            if (_0x0_0x1c7918['existsSync'](CONFIG_FILE)) {
                const _0x2b452d = JSON['parse'](_0x0_0x1c7918['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x2b452d
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults');
            }
        } catch (_0x1f023b) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x1f023b);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x72c6e6 = _0x0_0x583a62['dirname'](CONFIG_FILE);
            if (!_0x0_0x1c7918['existsSync'](_0x72c6e6)) {
                _0x0_0x1c7918['mkdirSync'](_0x72c6e6, { 'recursive': !![] });
            }
            _0x0_0x1c7918['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x2381fa) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x2381fa);
            return ![];
        }
    }
    ['get'](_0x1ace84) {
        return this['config'][_0x1ace84];
    }
    ['set'](_0x591ec5, _0x24df8f) {
        this['config'][_0x591ec5] = _0x24df8f;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        const _0x3373f8 = {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature']
        };
        return _0x3373f8;
    }
}
export default new ChatbotConfig();