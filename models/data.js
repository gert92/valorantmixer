const mongoose = require('mongoose');

const MixSchema = new mongoose.Schema({
  starter: {
    type: String,
    require,
  },
  leaders: [],
  pool: [],
  team1: [],
  team2: [],
  ended: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  channelId: {
    type: String,
    require,
  },
});

module.exports = mongoose.model('Mix', MixSchema);
