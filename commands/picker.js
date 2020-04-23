const Discord = require('discord.js');
const { createGame } = require('../controllers/mix');

module.exports = {
  name: 'picker',
  cooldown: 5,
  description: 'picker!',
  guildOnly: true,
  execute(message, args) {
    let users = [];

    message.guild.channels.cache.map((channel) => {
      channel.members.map((member) => {
        if (member.voice.channelID === channel.id) {
          users.push(member.displayName);
        }
      });
    });
    console.log(users);

    const list = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setThumbnail('https://i.imgur.com/7fn2zvn.png')
      .setTitle('Osalejad')
      .addFields(
        { name: '--------------', value: users },
        { name: '\u200B', value: '\u200B' },
        { name: 'Help', value: '!leader et minna tiimijuhiks' }
      )
      .setTimestamp();

    message.channel.send(list);

    createGame({
      user: message.author.username,
      players: users,
    });
  },
};
