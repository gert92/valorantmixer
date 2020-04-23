const Discord = require('discord.js');
const { teamPicker } = require('../controllers/mix');

module.exports = {
  name: 'pick',
  description: 'pick',
  guildOnly: true,
  args: true,
  usage: '@nimi',
  execute(message, args) {
    const customMembers = message.channel.members.map((member) => {
      return member;
    });
    customMembers.map((member) => {
      const search =
        args[0].search('!') === -1
          ? args[0].substring(2, 20)
          : args[0].substring(3, 21);

      if (search === member.id) {
        teamPicker({
          leader: message.author.username,
          player: member.displayName,
        }).then((resolve) => {
          let data = [
            {
              name: 'Attackers',
              value: resolve.team1.map((user) => user),
              inline: true,
            },
            {
              name: 'Defenders',
              value: resolve.team2.map((user) => user),
              inline: true,
            },
          ];
          if (resolve.pool.length > 0) {
            data = [
              ...data,
              {
                name: 'Pool',
                value: resolve.pool.map((user) => user),
              },
              { name: '\u200B', value: '\u200B' },
            ];
          }
          if (resolve.pool.length === 0) {
            data = [
              ...data,
              {
                name: 'Help',
                value: '!start, et alustada mängu!',
              },
            ];
          }

          const list = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail('https://i.imgur.com/7fn2zvn.png')
            .setTitle('POOL PARTY 2020')
            .addFields(data)
            .setTimestamp();
          message.channel.send(list);
        });
      }
    });
  },
};
