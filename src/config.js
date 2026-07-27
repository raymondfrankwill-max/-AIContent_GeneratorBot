require('dotenv').config();

const required = ['TELEGRAM_BOT_TOKEN', 'ANTHROPIC_API_KEY'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(
    `Missing required environment variable(s): ${missing.join(', ')}\n` +
      'Set them in a .env file locally, or in your Railway project variables.'
  );
  process.exit(1);
}

module.exports = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-5',
  botUsername: process.env.BOT_USERNAME || 'AIContent_GeneratorBot',
};
