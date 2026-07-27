// Simple in-memory store for per-user preferences.
// NOTE: this resets whenever the process restarts (e.g. on Railway redeploys).
// That's fine for a single preference like "tone" — swap this for a real
// database (Redis, Postgres, etc.) later if you need it to persist.

const userTones = new Map();

const DEFAULT_TONE = 'friendly and professional';

function getTone(userId) {
  return userTones.get(userId) || DEFAULT_TONE;
}

function setTone(userId, tone) {
  userTones.set(userId, tone);
}

module.exports = { getTone, setTone, DEFAULT_TONE };
