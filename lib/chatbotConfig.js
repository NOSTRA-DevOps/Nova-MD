import _0x0_0x2f608f from 'fs';
import _0x0_0x80275, { dirname } from 'path';
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
            if (_0x0_0x2f608f['existsSync'](CONFIG_FILE)) {
                const _0x2b8b00 = JSON['parse'](_0x0_0x2f608f['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x2b8b00
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults');
            }
        } catch (_0x323162) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x323162);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x39b5df = _0x0_0x80275['dirname'](CONFIG_FILE);
            if (!_0x0_0x2f608f['existsSync'](_0x39b5df)) {
                _0x0_0x2f608f['mkdirSync'](_0x39b5df, { 'recursive': !![] });
            }
            _0x0_0x2f608f['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x23300e) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x23300e);
            return ![];
        }
    }
    ['get'](_0x3e3c23) {
        return this['config'][_0x3e3c23];
    }
    ['set'](_0x4f7c7c, _0x42bee7) {
        this['config'][_0x4f7c7c] = _0x42bee7;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        const _0x612070 = {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature']
        };
        return _0x612070;
    }
}
export default new ChatbotConfig();