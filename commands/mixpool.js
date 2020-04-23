const Discord = require('discord.js');

module.exports = {
  name: 'mixpool',
  cooldown: 5,
  description: 'Mixpool!',
  //   guildOnly: true,
  execute(message, args) {
    let voice = [];

    message.guild.channels.cache.map((channel) => {
      channel.members.map((member) => {
        if (member.voice.channelID === channel.id) {
          voice.push(member.displayName);
        }
      });
    });
    const textAllMembers = new Discord.MessageEmbed()
      .setTitle('Kõik osalejad')
      .addFields({ name: '---------------', value: voice })
      .setColor('#00fcff')
      .setThumbnail('https://i.imgur.com/7fn2zvn.png')
      .setTimestamp();

    message.channel.send(textAllMembers);
  },
};
