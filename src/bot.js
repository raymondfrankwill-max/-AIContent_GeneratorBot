const { Telegraf } = require('telegraf');
const config = require('./config');
const { generateContent } = require('./claudeService');
const { getTone, setTone, DEFAULT_TONE } = require('./store');

const bot = new Telegraf(config.telegramToken);

const TELEGRAM_MAX_LENGTH = 4096;

// Telegram rejects messages over 4096 chars — split long articles into chunks.
async function replyLong(ctx, text) {
  if (text.length <= TELEGRAM_MAX_LENGTH) {
    return ctx.reply(text);
  }
  for (let i = 0; i < text.length; i += TELEGRAM_MAX_LENGTH) {
    // eslint-disable-next-line no-await-in-loop
    await ctx.reply(text.slice(i, i + TELEGRAM_MAX_LENGTH));
  }
}

function extractArg(ctx) {
  const parts = ctx.message.text.split(' ');
  return parts.slice(1).join(' ').trim();
}

async function handleGeneration(ctx, type, label) {
  const prompt = extractArg(ctx);
  if (!prompt) {
    return ctx.reply(
      `Tell me what to write about. Example:\n/${ctx.message.text.split(' ')[0].slice(1)} a productivity tip for remote workers`
    );
  }

  const tone = getTone(ctx.from.id);
  await ctx.sendChatAction('typing');

  try {
    const result = await generateContent(type, prompt, tone);
    await replyLong(ctx, result);
  } catch (err) {
    console.error(`Error generating ${label}:`, err);
    await ctx.reply(
      "Sorry, I couldn't generate that just now. Please try again in a moment."
    );
  }
}

bot.start((ctx) =>
  ctx.reply(
    `Hi! I'm @${config.botUsername} 👋\n\n` +
      "I generate text content with Claude. Here's what I can do:\n\n" +
      '/generate <topic> — a social media post\n' +
      '/caption <description> — a short caption\n' +
      '/article <topic> — a short article\n' +
      '/ideas <niche> — a list of content ideas\n' +
      '/tone <tone> — set how I should sound (e.g. "witty", "formal")\n' +
      '/help — show this again'
  )
);

bot.help((ctx) =>
  ctx.reply(
    'Commands:\n' +
      '/generate <topic> — a social media post\n' +
      '/caption <description> — a short caption\n' +
      '/article <topic> — a short article\n' +
      '/ideas <niche> — a list of content ideas\n' +
      '/tone <tone> — set how I should sound\n' +
      `Current tone: ${DEFAULT_TONE}`
  )
);

bot.command('generate', (ctx) => handleGeneration(ctx, 'post', 'post'));
bot.command('caption', (ctx) => handleGeneration(ctx, 'caption', 'caption'));
bot.command('article', (ctx) => handleGeneration(ctx, 'article', 'article'));
bot.command('ideas', (ctx) => handleGeneration(ctx, 'ideas', 'ideas'));

bot.command('tone', (ctx) => {
  const tone = extractArg(ctx);
  if (!tone) {
    return ctx.reply(
      `Your current tone is: "${getTone(ctx.from.id)}"\n` +
        'To change it: /tone witty and casual'
    );
  }
  setTone(ctx.from.id, tone);
  return ctx.reply(`Got it — I'll write in a "${tone}" tone from now on.`);
});

bot.catch((err, ctx) => {
  console.error(`Unhandled error for update ${ctx.updateType}:`, err);
});

module.exports = bot;
