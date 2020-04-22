const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});
client.once('reconnecting', () => {
  console.log('Reconnecting!');
});
client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on('message', async (message, args) => {
  try {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(`${prefix}mix`)) {
      let voice;
      message.guild.channels.cache.map((channel) => {
        if (channel.name === 'mixlobby') {
          voice = channel.members.map((users) => users.user.username);
        }
      });
      const team1 = [];
      const team2 = [];
      // const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      if (voice.length === 10) {
        for (let i = 0; team1.length < 5; i++) {
          let rand = Math.floor(Math.random() * 10);
          if (!team1.includes(voice[rand])) {
            team1.push(voice[rand]);
          }
        }
        for (let j = 0; team2.length < 5; j++) {
          let rand = Math.floor(Math.random() * 10);
          if (!team1.includes(voice[rand]) && !team2.includes(voice[rand])) {
            team2.push(voice[rand]);
          }
        }
        const teams = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Tiimid')
          .addFields(
            { name: '1. Tiim', value: team1.map((user) => user) },
            { name: '\u200B', value: '\u200B' },
            { name: '2. Tiim', value: team2.map((user) => user) }
          )
          .setTimestamp();
        message.channel.send(teams);

        const authorId = message.author.id;
        const mixLobby = message.guild.channels.cache.find((name) => {
          if (name.name === 'mixlobby') {
            return name.id;
          }
        });

        // console.log(message.member.voice.channelID);
        // console.log(mixLobby.valueOf('id'));

        // message.guild.voiceStates.cache.map((user) => {
        //   if (user.id === authorId) {
        //     console.log('see on harambe');
        //   } else {
        //     console.log('meow meow');
        //   }
        // });

        // const createChannel = (name) => {
        //   message.guild.channels.create(name, {
        //     type: 'voice',
        //     parent: '702071845196791900',
        //     userLimit: 5,
        //   });
        // };

        // createChannel('team1');

        message.guild.channels.cache.map((channel) => {
          if (channel.name === 'mixlobby') {
            channel.members.map((user) => {
              message.guild.channels.cache.map((channel) => {
                if (channel.name === 'team1') {
                  // console.log(user.voice.connection.updateChannel());
                  team1.map((names) => {
                    if (names === user.displayName) {
                      user.voice.setChannel(channel.id);
                    }
                  });
                }
                if (channel.name === 'team2') {
                  team2.map((names) => {
                    if (names === user.displayName) {
                      user.voice.setChannel(channel.id);
                    }
                  });
                }
              });
            });
          }
        });

        return;
      } else if (voice.length > 10) {
        message.channel.send(
          `${voice.length - 10} ${
            voice.length - 10 === 1 ? 'inimene' : 'inimest'
          } üle!`
        );
      } else {
        message.channel.send(`@here +${10 - voice.length} mixile!`);
      }
    } else {
      message.channel.send('Kirjuta !mix');
    }
  } catch (error) {
    console.log(error);
  }
});

client.login(token);
