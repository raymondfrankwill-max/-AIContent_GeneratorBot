const userTones = new Map();

const DEFAULT_TONE = 'friendly and professional';

function getTone(userId) {
  return userTones.get(userId) || DEFAULT_TONE;
}

function setTone(userId, tone) {
  userTones.set(userId, tone);
}

module.exports = { getTone, setTone, DEFAULT_TONE };
