const bot = require('./src/bot');

bot
  .launch()
  .then(() => console.log('Bot started (long polling)...'))
  .catch((err) => {
    console.error('Failed to start bot:', err);
    process.exit(1);
  });

// Graceful shutdown so Railway restarts/redeploys don't leave hanging connections
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
