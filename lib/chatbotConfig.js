import _0x0_0x271aa8 from 'fs';
import _0x0_0xf46d65, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_FILE = './data/chatbot_config.json';
const DEFAULT_CONFIG = {
    'enabled': !![],
    'mode': 'public',
    'provider': 'systemai',
    'apiKey': '',
    'apiUrl': '',
    'puterModel': 'gpt-5.4-nano',
    'grokModel': 'grok-4.6',
    'openaiModel': 'gpt-4o-mini',
    'geminiModel': 'gemini-flash-latest',
    'pollinationsModel': 'openai',
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
            if (_0x0_0x271aa8['existsSync'](CONFIG_FILE)) {
                const _0x1c433c = JSON['parse'](_0x0_0x271aa8['readFileSync'](CONFIG_FILE, 'utf-8'));
                this['config'] = {
                    ...DEFAULT_CONFIG,
                    ..._0x1c433c
                };
                console['log']('🤖\x20Chatbot\x20config\x20loaded');
                console['log']('📋\x20Provider:', this['config']['provider']);
            } else {
                this['config'] = { ...DEFAULT_CONFIG };
                this['saveConfig']();
                console['log']('🤖\x20Chatbot\x20config\x20created\x20with\x20defaults\x20(systemai)');
            }
        } catch (_0x2ffa21) {
            console['error']('Error\x20loading\x20chatbot\x20config:', _0x2ffa21);
            this['config'] = { ...DEFAULT_CONFIG };
        }
        return this['config'];
    }
    ['saveConfig']() {
        try {
            const _0x1ace09 = _0x0_0xf46d65['dirname'](CONFIG_FILE);
            if (!_0x0_0x271aa8['existsSync'](_0x1ace09)) {
                _0x0_0x271aa8['mkdirSync'](_0x1ace09, { 'recursive': !![] });
            }
            _0x0_0x271aa8['writeFileSync'](CONFIG_FILE, JSON['stringify'](this['config'], null, 0x2));
            return !![];
        } catch (_0x55dcd5) {
            console['error']('Error\x20saving\x20chatbot\x20config:', _0x55dcd5);
            return ![];
        }
    }
    ['get'](_0x142d4e) {
        return this['config'][_0x142d4e];
    }
    ['set'](_0x549982, _0xcaaaed) {
        this['config'][_0x549982] = _0xcaaaed;
        this['saveConfig']();
        return this;
    }
    ['getStatus']() {
        return {
            'enabled': this['config']['enabled'] ? '✅' : '❌',
            'mode': this['config']['mode'] === 'private' ? '🔒\x20Privé' : '🌍\x20Public',
            'provider': this['config']['provider']['toUpperCase'](),
            'apiConfigured': !!(this['config']['apiKey'] || this['config']['apiUrl']),
            'contextLoaded': !!this['config']['customContext'],
            'historySize': this['config']['maxHistory'],
            'temperature': this['config']['temperature'],
            'botName': this['config']['botName'] || 'Nova'
        };
    }
}
export default new ChatbotConfig();