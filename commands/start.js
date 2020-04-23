const Discord = require('discord.js');
const { mixPool } = require('../controllers/mix');

module.exports = {
  name: 'start',
  cooldown: 5,
  description: 'start!',
  guildOnly: true,
  execute(message, args) {
    let channelId;

    message.guild.channels.cache.map((channel) => {
      channel.members.map((member) => {
        if (member.voice.channelID === channel.id) {
          channelId = channel.id;
        }
      });
    });
    const map = [
      'https://blitz-cdn.blitz.gg/0x500/blitz/val/maps/haven/haven-hero.jpeg',
      'https://blitz-cdn.blitz.gg/0x500/blitz/val/maps/bind/bind-hero.jpeg',
      'https://blitz-cdn.blitz.gg/0x500/blitz/val/maps/split/split-hero2.jpeg',
    ];

    const teams = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setThumbnail('https://i.imgur.com/7fn2zvn.png')
      .setImage(map[Math.floor(Math.random() * 3)])
      .setTitle('GLHF');
    message.channel.send(teams);

    mixPool({ channelId: channelId }).then((resolve) => {
      if (resolve.pool.length === 0) {
        message.guild.channels
          .create('Attackers', { type: 'voice', userLimit: 5 })
          .then((resolve1) => {
            message.guild.channels.cache.map((channel) => {
              channel.members.map((member) => {
                if (channel.id === member.voice.channelID) {
                  resolve.team1.map((names) => {
                    if (names === member.displayName) {
                      member.voice.setChannel(resolve1);
                    }
                  });
                }
              });
            });
          });
        message.guild.channels
          .create('Defenders', { type: 'voice', userLimit: 5 })
          .then((resolve1) => {
            message.guild.channels.cache.map((channel) => {
              channel.members.map((member) => {
                if (channel.id === member.voice.channelID) {
                  resolve.team2.map((names) => {
                    if (names === member.displayName) {
                      member.voice.setChannel(resolve1);
                    }
                  });
                }
              });
            });
          });
      }
    });
  },
};
