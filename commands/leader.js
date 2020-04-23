const { pickLeaders } = require('../controllers/mix');

module.exports = {
  name: 'leader',
  cooldown: 5,
  description: 'Leader!',
  guildOnly: true,
  execute(message, args) {
    let channelId;

    message.guild.channels.cache.map((channel) => {
      channel.members.map((member) => {
        if (member.voice.channelID === channel.id) {
          if (member.voice.channelID === message.member.voice.channelID) {
            channelId = member.voice.channel.id;
          }
        }
      });
    });

    pickLeaders({
      leader: message.author.username,
      channelId: channelId,
      message: message,
    });
  },
};
