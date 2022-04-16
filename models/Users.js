const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  trackedAt: {
    type: Date,
    default: Date.now(),
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
  lastBanned: {
    type: Date,
  },
  lastUnbanned: {
    type: Date,
  },
});

module.exports = mongoose.model('Users', UsersSchema);
