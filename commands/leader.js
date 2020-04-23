const { pickLeaders } = require('../controllers/mix');

module.exports = {
  name: 'leader',
  cooldown: 5,
  description: 'Leader!',
  guildOnly: true,
  execute(message, args) {
    pickLeaders({
      leader: message.author.username,
      message: message,
    });
  },
};
