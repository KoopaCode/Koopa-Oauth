const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  discriminator: { type: String },
  avatar: { type: String },
  guilds: [{ type: String }],
  verifiedAt: { type: Date, default: Date.now },
  accessToken: { type: String },
  refreshToken: { type: String }
});

module.exports = mongoose.model('User', userSchema); 