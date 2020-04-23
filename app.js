const Discord = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const connectDB = require('./config/db');

//config env
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (oldMember.channel) {
    if (oldMember.channel.name === 'Attackers') {
      if (oldMember.channel.members.size === 0) {
        oldMember.channel.delete();
      }
    }
  }
  if (oldMember.channel) {
    if (oldMember.channel.name === 'Defenders') {
      if (oldMember.channel.members.size === 0) {
        oldMember.channel.delete();
      }
    }
  }
});

client.on('message', (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
    return;

  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);

  const commandName = args.shift().toLowerCase();
  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    let reply = `Sa ei sisestanud nime, ${message.author}!`;

    if (command.usage) {
      reply += `\nPalun kasuta: \`${process.env.PREFIX}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);

  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Palun oota ${timeLeft.toFixed(1)} sekund(it) enne \`${
          command.name
        }\` uuesti kasutamist.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    message.guild.channels.cache.map((channel) => {
      if (channel.type === 'voice') {
        channel.members.mapValues((member) => {
          if (member.id === message.author.id) {
            command.execute(message, args);
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

  //   try {
  //     if (message.author.bot) return;
  //     if (!message.content.startsWith(prefix)) return;

  //     message.guild.channels.cache.map((channel) => {
  //       if (channel.type === 'voice') {
  //         channel.members.map((member) => {
  //           if (member.id === message.author.id) {
  //             const customMembers = channel.members.map((member) => {
  //               return member;
  //             });
  //             //randomly mix teams

  //             if (message.content === `${prefix}mix`) {
  //               let voice = [];
  //               message.guild.channels.cache.map((channel) => {
  //                 customMembers.map((member) => {
  //                   if (member.voice.channelID === channel.id) {
  //                     voice.push(member.displayName);
  //                   }
  //                 });
  //               });
  //               const team1 = [];
  //               const team2 = [];
  //               // const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //               if (voice.length === 10) {
  //                 for (let i = 0; team1.length < 5; i++) {
  //                   let rand = Math.floor(Math.random() * 10);
  //                   if (!team1.includes(voice[rand])) {
  //                     team1.push(voice[rand]);
  //                   }
  //                 }
  //                 for (let j = 0; team2.length < 5; j++) {
  //                   let rand = Math.floor(Math.random() * 10);
  //                   if (
  //                     !team1.includes(voice[rand]) &&
  //                     !team2.includes(voice[rand])
  //                   ) {
  //                     team2.push(voice[rand]);
  //                   }
  //                 }
  //                 const teams = new Discord.MessageEmbed()
  //                   .setColor('#0099ff')
  //                   .setThumbnail('https://i.imgur.com/7fn2zvn.png')
  //                   .setTitle('Tiimid')
  //                   .addFields(
  //                     { name: '1. Tiim', value: team1.map((user) => user) },
  //                     { name: '\u200B', value: '\u200B' },
  //                     { name: '2. Tiim', value: team2.map((user) => user) }
  //                   )
  //                   .setTimestamp();
  //                 message.channel.send(teams);

  //                 message.guild.channels.cache.map((channel) => {
  //                   channel.members.map((member) => {
  //                     if (channel.id === member.voice.channelID) {
  //                       channel.members.map((user) => {
  //                         message.guild.channels.cache.map((channel) => {
  //                           if (channel.name === 'team1') {
  //                             team1.map((names) => {
  //                               if (names === user.displayName) {
  //                                 user.voice.setChannel(channel.id);
  //                               }
  //                             });
  //                           }
  //                           if (channel.name === 'team2') {
  //                             team2.map((names) => {
  //                               if (names === user.displayName) {
  //                                 user.voice.setChannel(channel.id);
  //                               }
  //                             });
  //                           }
  //                         });
  //                       });
  //                     }
  //                   });
  //                 });

  //                 return;
  //               } else if (voice.length > 10) {
  //                 message.channel.send(
  //                   `${voice.length - 10} ${
  //                     voice.length - 10 === 1 ? 'inimene' : 'inimest'
  //                   } üle!`
  //                 );
  //               } else {
  //                 message.channel.send(`@here +${10 - voice.length} mixile!`);
  //               }

  //               // poolmix
  //             } else if (message.content === `${prefix}mixpool`) {
  //               let voice = [];
  //               message.guild.channels.cache.map((channel) => {
  //                 customMembers.map((member) => {
  //                   if (member.voice.channelID === channel.id) {
  //                     voice.push(member.displayName);
  //                   }
  //                 });
  //               });

  //               const textAllMembers = new Discord.MessageEmbed()
  //                 .setTitle('Kõik osalejad')
  //                 .addFields({ name: '---------------', value: voice })
  //                 .setColor('#00fcff')
  //                 .setThumbnail('https://i.imgur.com/7fn2zvn.png')
  //                 .setTimestamp();

  //               message.channel.send(textAllMembers);
  //             } else if (message.content === `${prefix}picker`) {
  //               let voice = [];
  //               message.guild.channels.cache.map((channel) => {
  //                 customMembers.map((member) => {
  //                   if (member.voice.channelID === channel.id) {
  //                     voice.push(member.displayName);
  //                   }
  //                 });
  //               });
  //               console.log(voice);

  //               const list = new Discord.MessageEmbed()
  //                 .setColor('#0099ff')
  //                 .setThumbnail('https://i.imgur.com/7fn2zvn.png')
  //                 .setTitle('Osalejad')
  //                 .addFields(
  //                   { name: '--------------', value: voice },
  //                   { name: '\u200B', value: '\u200B' },
  //                   { name: 'Help', value: '!leader et minna tiimijuhiks' }
  //                 )
  //                 .setTimestamp();

  //               message.channel.send(list);

  //               createGame({
  //                 user: message.author.username,
  //                 players: voice,
  //               });

  //               // message.channel.send(voice);
  //             } else if (message.content === `${prefix}leader`) {
  //               pickLeaders({
  //                 leader: message.author.username,
  //                 message: message,
  //               });
  //             } else if (message.content === `${prefix}start`) {
  //               mixPool()
  //                 .then((resolve) => {
  //                   if (resolve.pool.length === 0) {
  //                     message.guild.channels.cache.map((channel) => {
  //                       channel.members.map((member) => {
  //                         if (channel.id === member.voice.channelID) {
  //                           channel.members.map((user) => {
  //                             message.guild.channels.cache.map((channel) => {
  //                               if (channel.name === 'team1') {
  //                                 resolve.team1.map((names) => {
  //                                   if (names === user.displayName) {
  //                                     user.voice.setChannel(channel.id);
  //                                   }
  //                                 });
  //                               }
  //                               if (channel.name === 'team2') {
  //                                 resolve.team2.map((names) => {
  //                                   if (names === user.displayName) {
  //                                     user.voice.setChannel(channel.id);
  //                                   }
  //                                 });
  //                               }
  //                             });
  //                           });
  //                         }
  //                       });
  //                     });
  //                   }
  //                 })
  //                 .catch((error) => console.log(error));
  //             } else if (message.content === `${prefix}pick ${args}`) {
  //               let voice = [];
  //               message.guild.channels.cache.map((channel) => {
  //                 customMembers.map((member) => {
  //                   if (member.voice.channelID === channel.id) {
  //                     voice.push(member.displayName);
  //                   }
  //                 });
  //               });
  //               customMembers.map((member) => {
  //                 if (args.substring(3, 21) === member.id) {
  //                   teamPicker({
  //                     leader: message.author.username,
  //                     player: member.displayName,
  //                   }).then((resolve) => {
  //                     let data = [
  //                       {
  //                         name: '1. Tiim',
  //                         value: resolve.team1.map((user) => user),
  //                       },
  //                       {
  //                         name: '2. Tiim',
  //                         value: resolve.team2.map((user) => user),
  //                       },
  //                     ];
  //                     if (resolve.pool.length > 0) {
  //                       data = [
  //                         {
  //                           name: 'Pool',
  //                           value: resolve.pool.map((user) => user),
  //                         },
  //                         ...data,
  //                       ];
  //                     }
  //                     const list = new Discord.MessageEmbed()
  //                       .setColor('#0099ff')
  //                       .setThumbnail('https://i.imgur.com/7fn2zvn.png')
  //                       .setTitle('POOL PARTY 2020')
  //                       .addFields(data)
  //                       .setTimestamp();
  //                     message.channel.send(list);

  //                     if (resolve.pool.length === 0) {
  //                       message.channel.send('!start, et alustada mängu!');
  //                     }
  //                   });
  //                 }
  //               });
  //               // message.channel.send(member.displayName);
  //             }
  //           }
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
});

client.login(process.env.TOKEN);
