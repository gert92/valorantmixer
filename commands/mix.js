const Discord = require('discord.js');

module.exports = {
  name: 'mix',
  description: 'Mix!',
  guildOnly: true,
  cooldown: 30,
  execute(message, args) {
    let users = [];

    message.guild.channels.cache.map((channel) => {
      channel.members.map((member) => {
        if (member.voice.channelID === channel.id) {
          if (member.voice.channelID === message.member.voice.channelID) {
            users.push(member.displayName);
          }
        }
      });
    });

    const team1 = [];
    const team2 = [];
    const map = [
      'https://blitz-cdn.blitz.gg/0x500/blitz/val/maps/haven/haven-hero.jpeg',
      'https://blitz-cdn.blitz.gg/0x500/blitz/val/maps/bind/bind-hero.jpeg',
      'https://blitz-cdn.blitz.gg/0x500/blitz/val/maps/split/split-hero2.jpeg',
    ];
    // const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (users.length === 10) {
      for (let i = 0; team1.length < 5; i++) {
        let rand = Math.floor(Math.random() * 10);
        if (!team1.includes(users[rand])) {
          team1.push(users[rand]);
        }
      }
      for (let j = 0; team2.length < 5; j++) {
        let rand = Math.floor(Math.random() * 10);
        if (!team1.includes(users[rand]) && !team2.includes(users[rand])) {
          team2.push(users[rand]);
        }
      }
      const teams = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setThumbnail('https://i.imgur.com/7fn2zvn.png')
        .setImage(map[Math.floor(Math.random() * 3)])
        .setTitle('Tiimid')
        .addFields(
          { name: 'Attackers', value: team1.map((user) => user), inline: true },
          { name: 'Defenders', value: team2.map((user) => user), inline: true }
        )
        .setTimestamp();
      message.channel.send(teams);

      message.guild.channels
        .create('Attackers', { type: 'voice', userlimit: 5 })
        .then((resolve) => {
          message.guild.channels.cache.map((channel) => {
            channel.members.map((member) => {
              if (channel.id === member.voice.channelID) {
                team1.map((names) => {
                  if (names === member.displayName) {
                    member.voice.setChannel(resolve);
                  }
                });
              }
            });
          });
        });
      message.guild.channels
        .create('Defenders', { type: 'voice', userlimit: 5 })
        .then((resolve) => {
          message.guild.channels.cache.map((channel) => {
            channel.members.map((member) => {
              if (channel.id === member.voice.channelID) {
                team2.map((names) => {
                  if (names === member.displayName) {
                    member.voice.setChannel(resolve);
                  }
                });
              }
            });
          });
        });

      return;
    } else if (users.length > 10) {
      message.channel.send(
        `${users.length - 10} ${
          users.length - 10 === 1 ? 'inimene' : 'inimest'
        } üle!`
      );
    } else {
      message.channel.send(`@here +${10 - users.length} mixile!`);
      //   message.guild.channels.create('nimi', { type: 'voice', userlimit: 5 });
    }
  },
};
