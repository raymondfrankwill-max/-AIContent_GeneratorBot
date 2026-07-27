const Anthropic = require('@anthropic-ai/sdk');
const config = require('./config');

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPTS = {
  post: (tone) =>
    `You are a social media copywriter. Write a single ready-to-publish social ` +
    `media post in a ${tone} tone. Keep it punchy, include relevant hashtags if ` +
    `appropriate, and output ONLY the post text — no preamble, no explanations, ` +
    `no quotation marks around it.`,

  caption: (tone) =>
    `You are a social media copywriter. Write a short, scroll-stopping caption ` +
    `in a ${tone} tone for the image or moment described. Output ONLY the ` +
    `caption text — no preamble, no explanations.`,

  article: (tone) =>
    `You are a content writer. Write a well-structured short article (roughly ` +
    `400-600 words) in a ${tone} tone, with a clear title and a few sections. ` +
    `Use plain text formatting suitable for Telegram (no markdown tables). ` +
    `Output ONLY the article — no preamble.`,

  ideas: (tone) =>
    `You are a content strategist. Generate a numbered list of 8 distinct, ` +
    `specific content ideas in a ${tone} tone. Each idea should be one or two ` +
    `sentences — a concrete angle, not a vague topic. Output ONLY the list.`,
};

async function generateContent(type, prompt, tone) {
  const systemPromptFn = SYSTEM_PROMPTS[type];
  if (!systemPromptFn) {
    throw new Error(`Unknown content type: ${type}`);
  }

  const response = await anthropic.messages.create({
    model: config.claudeModel,
    max_tokens: type === 'article' ? 1500 : 500,
    system: systemPromptFn(tone),
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text.trim() : '';
}

module.exports = { generateContent };
