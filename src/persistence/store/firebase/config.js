
const keys = process.env.FIREBASE_KEYS;

const config = {
  FIREBASE_KEY: JSON.parse(keys),
}

module.exports = {
  config,
}
