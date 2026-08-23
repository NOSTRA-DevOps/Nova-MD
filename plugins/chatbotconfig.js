// plugins/chatbotconfig.js - Configuration globale du chatbot
import chatbotService from '../lib/chatbotService.js';
import chatbotConfig from '../lib/chatbotConfig.js';
import { isOwnerOnly } from '../lib/isOwner.js';

export default {
    command: 'chatbotconfig',
    aliases: ['cbc', 'chbconfig', 'botconfig'],
    category: 'owner',
    description: 'Configure the chatbot (provider, mode, API key, context, etc.)',
    usage: '.chatbotconfig [option] [value]',
    ownerOnly: true,
    handler: async (sock, message, args, context) => {
        const chatId = context.chatId || message.key.remoteJid;
        const isOwner = await isOwnerOnly(message.key.participant || message.key.remoteJid);
        
        if (!isOwner && !message.key.fromMe) {
            return;
        }

        const option = args[0]?.toLowerCase();
        const value = args.slice(1).join(' ');

        // === AFFICHER LA CONFIGURATION ===
        if (!option || option === 'status' || option === 'info') {
            const config = chatbotConfig.config;
            const status = chatbotConfig.getStatus();
            
            let text = `🤖 *CHATBOT CONFIGURATION*\n\n`;
            text += `┌─────────────────────────\n`;
            text += `│ 📊 Status: ${status.enabled} ${config.enabled ? '✅ Enabled' : '❌ Disabled'}\n`;
            text += `│ 🔒 Mode: ${status.mode}\n`;
            text += `│ 🔌 Provider: ${status.provider}\n`;
            text += `│ ${config.apiKey ? '✅' : '❌'} API Key: ${config.apiKey ? 'Configured' : '⚠️ NOT SET'}\n`;
            text += `│ ${config.apiUrl ? '✅' : '❌'} URL: ${config.apiUrl || 'Not configured'}\n`;
            text += `│ 📚 Context: ${config.customContext ? '✅ Custom' : '❌ Default'}\n`;
            text += `│ 🔄 History: ${config.maxHistory} messages\n`;
            text += `│ 🌡️ Temperature: ${config.temperature}\n`;
            text += `│ ⚡ Commands: ${config.executeCommands ? '✅ Enabled' : '❌ Disabled'}\n`;
            text += `└─────────────────────────\n\n`;

            if (!config.apiKey) {
                text += `⚠️ *An API key is required!*\n`;
                text += `\`\`\`\n.cbc apikey <your_key>\n\`\`\`\n\n`;
            }

            text += `*📋 Providers:*\n`;
            text += `• \`grok\` - xAI (Grok) — *recommended*\n`;
            text += `• \`puter\` - Puter (free, needs account)\n`;
            text += `• \`pollinations\` - Free, no key needed\n`;
            text += `• \`gemini\` - Google Gemini\n`;
            text += `• \`openai\` - OpenAI\n`;
            text += `• \`custom\` - Custom API\n\n`;

            text += `*📋 Commands:*\n`;
            text += `• \`.cbc provider <grok|puter|pollinations|gemini|openai|custom>\`\n`;
            text += `• \`.cbc apikey <your_api_key>\`\n`;
            text += `• \`.cbc apiurl <your_api_url>\`\n`;
            text += `• \`.cbc mode <public|private>\`\n`;
            text += `• \`.cbc context <your_context>\`\n`;
            text += `• \`.cbc enable|disable\`\n`;
            text += `• \`.cbc clearhistory\`\n`;
            text += `• \`.cbc temp <0-1>\`\n`;
            text += `• \`.cbc maxtokens <50-4096>\`\n`;
            text += `• \`.cbc reset\`\n`;
            text += `• \`.cbc status\`\n\n`;
            
            text += `💡 *Examples:*\n`;
            text += `• \`.cbc apikey gsk_xxxxxxxx\`\n`;
            text += `• \`.cbc provider grok\`\n`;
            text += `• \`.cbc mode public\``;

            return await sock.sendMessage(chatId, { text }, { quoted: message });
        }

        // === CONFIGURATION ===
        try {
            switch (option) {
                case 'provider': {
                    const providers = ['grok', 'puter', 'pollinations', 'gemini', 'openai', 'custom'];
                    if (!providers.includes(value)) {
                        return await sock.sendMessage(chatId, {
                            text: `❌ Invalid provider. Choose: ${providers.join(', ')}`,
                            quoted: message
                        });
                    }
                    chatbotConfig.set('provider', value);
                    await sock.sendMessage(chatId, {
                        text: `✅ Provider changed to: *${value.toUpperCase()}*`,
                        quoted: message
                    });
                    break;
                }

                case 'apikey':
                    if (!value) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Please provide an API key',
                            quoted: message
                        });
                    }
                    chatbotConfig.set('apiKey', value);
                    await sock.sendMessage(chatId, {
                        text: `✅ API key updated (${value.slice(0, 8)}...)`,
                        quoted: message
                    });
                    break;

                case 'apiurl':
                    if (!value) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Please provide an API URL',
                            quoted: message
                        });
                    }
                    chatbotConfig.set('apiUrl', value);
                    await sock.sendMessage(chatId, {
                        text: `✅ API URL updated: ${value}`,
                        quoted: message
                    });
                    break;

                case 'mode':
                    if (!['public', 'private'].includes(value)) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Invalid mode. Use: `public` or `private`',
                            quoted: message
                        });
                    }
                    chatbotConfig.set('mode', value);
                    await sock.sendMessage(chatId, {
                        text: `🔒 Chatbot mode: ${value === 'private' ? '🔒 Private (owner only)' : '🌍 Public (everyone)'}`,
                        quoted: message
                    });
                    break;

                case 'context':
                    if (!value) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Please provide a context',
                            quoted: message
                        });
                    }
                    chatbotConfig.set('customContext', value);
                    chatbotService.setContext(null, value);
                    await sock.sendMessage(chatId, {
                        text: `✅ Custom context added (${value.length} characters)`,
                        quoted: message
                    });
                    break;

                case 'enable':
                    chatbotConfig.set('enabled', true);
                    await sock.sendMessage(chatId, {
                        text: '✅ Chatbot enabled!',
                        quoted: message
                    });
                    break;

                case 'disable':
                    chatbotConfig.set('enabled', false);
                    await sock.sendMessage(chatId, {
                        text: '❌ Chatbot disabled',
                        quoted: message
                    });
                    break;

                case 'clearhistory':
                case 'clear':
                    chatbotService.clearHistory();
                    await sock.sendMessage(chatId, {
                        text: '🗑️ Chat history cleared',
                        quoted: message
                    });
                    break;

                case 'temp':
                case 'temperature':
                    if (!value || isNaN(value)) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Please provide a number between 0 and 1 (e.g., 0.7)',
                            quoted: message
                        });
                    }
                    const temp = parseFloat(value);
                    if (temp < 0 || temp > 1) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Temperature must be between 0 and 1',
                            quoted: message
                        });
                    }
                    chatbotConfig.set('temperature', temp);
                    await sock.sendMessage(chatId, {
                        text: `🌡️ Temperature set to: ${temp}`,
                        quoted: message
                    });
                    break;

                case 'maxtokens':
                case 'tokens':
                    if (!value || isNaN(value)) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Please provide a number (e.g., 1024)',
                            quoted: message
                        });
                    }
                    const tokens = parseInt(value);
                    if (tokens < 50 || tokens > 4096) {
                        return await sock.sendMessage(chatId, {
                            text: '❌ Max tokens must be between 50 and 4096',
                            quoted: message
                        });
                    }
                    chatbotConfig.set('maxTokens', tokens);
                    await sock.sendMessage(chatId, {
                        text: `✅ Max tokens set to: ${tokens}`,
                        quoted: message
                    });
                    break;

                case 'reset':
                    chatbotConfig.set('customContext', '');
                    chatbotConfig.set('temperature', 0.7);
                    chatbotConfig.set('maxTokens', 1024);
                    chatbotService.clearHistory();
                    await sock.sendMessage(chatId, {
                        text: '🔄 Chatbot reset to default settings',
                        quoted: message
                    });
                    break;

                default:
                    await sock.sendMessage(chatId, {
                        text: `❌ Unknown option: *${option}*\n\nUse \`.cbc status\` to see all options.`,
                        quoted: message
                    });
            }
        } catch (error) {
            console.error('Chatbot config error:', error);
            await sock.sendMessage(chatId, {
                text: `❌ Error: ${error.message}`,
                quoted: message
            });
        }
    }
};