const Discord = require('discord.js');
const dotenv = require('dotenv');
const express = require('express');
const { prefix, token } = require('./config/config.json');
const {
  createGame,
  pickLeaders,
  teamPicker,
  mixPool,
} = require('./controllers/mix');
const client = new Discord.Client();
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json());

//config env

//Connect to database
connectDB();

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
  args = message.content.split(' ')[1];
  try {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    //randomly mix teams
    message.guild.channels.cache.map((channel) => {
      if (channel.type === 'voice') {
        channel.members.map((member) => {
          if (member.id === message.author.id) {
            const customMembers = channel.members.map((member) => {
              return member;
            });
            if (message.content === `${prefix}mix`) {
              let voice;
              message.guild.channels.cache.map((channel) => {
                channel.members.map((member) => {
                  if (member.id === message.author.id) {
                    voice = channel.members.map((users) => users.user.username);
                  }
                });
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
                  if (
                    !team1.includes(voice[rand]) &&
                    !team2.includes(voice[rand])
                  ) {
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

                message.guild.channels.cache.map((channel) => {
                  channel.members.map((member) => {
                    if (channel.id === member.voice.channelID) {
                      channel.members.map((user) => {
                        message.guild.channels.cache.map((channel) => {
                          if (channel.name === 'team1') {
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

              // poolmix
            } else if (message.content === `${prefix}mixpool`) {
              let voice;
              message.guild.channels.cache.map((channel) => {
                channel.members.map((member) => {
                  if (member.id === message.author.id) {
                    voice = channel.members.map((users) => users.user.username);
                  }
                });
              });

              message.channel.send(voice);
            } else if (message.content === `${prefix}picker`) {
              let voice = [];
              message.guild.channels.cache.map((channel) => {
                customMembers.map((member) => {
                  if (member.voice.channelID === channel.id) {
                    voice.push(member.displayName);
                  }
                });
              });
              console.log(voice);

              const list = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Osalejad')
                .addFields(
                  { name: '--------------', value: voice },
                  { name: '\u200B', value: '\u200B' },
                  { name: 'Help', value: '!leader et minna tiimijuhiks' }
                )
                .setTimestamp();

              message.channel.send(list);

              createGame({
                user: message.author.username,
                players: voice,
              });

              // message.channel.send(voice);
            } else if (message.content === `${prefix}leader`) {
              pickLeaders({
                leader: message.author.username,
                message: message,
              });
            } else if (message.content === `${prefix}start`) {
              mixPool()
                .then((resolve) => {
                  message.guild.channels.cache.map((channel) => {
                    channel.members.map((member) => {
                      if (channel.id === member.voice.channelID) {
                        channel.members.map((user) => {
                          message.guild.channels.cache.map((channel) => {
                            if (channel.name === 'team1') {
                              resolve.team1.map((names) => {
                                if (names === user.displayName) {
                                  user.voice.setChannel(channel.id);
                                }
                              });
                            }
                            if (channel.name === 'team2') {
                              resolve.team2.map((names) => {
                                if (names === user.displayName) {
                                  user.voice.setChannel(channel.id);
                                }
                              });
                            }
                          });
                        });
                      }
                    });
                  });
                })
                .catch((error) => console.log(error));
            } else if (message.content === `${prefix}pick ${args}`) {
              let voice;
              message.guild.channels.cache.map((channel) => {
                channel.members.map((member) => {
                  if (member.id === message.author.id) {
                    voice = channel.members.map((users) => users.user.username);
                  }
                });
              });
              customMembers.map((member) => {
                if (args.substring(3, 21) === member.id) {
                  teamPicker({
                    leader: message.author.username,
                    player: member.displayName,
                  }).then((resolve) => {
                    let data = [
                      {
                        name: '1. Tiim',
                        value: resolve.team1.map((user) => user),
                      },
                      {
                        name: '2. Tiim',
                        value: resolve.team2.map((user) => user),
                      },
                    ];
                    if (resolve.pool.length > 0) {
                      data = [
                        {
                          name: 'Pool',
                          value: resolve.pool.map((user) => user),
                        },
                        ...data,
                      ];
                    }
                    const list = new Discord.MessageEmbed()
                      .setColor('#0099ff')
                      .setTitle('POOL PARTY 2020')
                      .addFields(data)
                      .setTimestamp();
                    message.channel.send(list);

                    if (resolve.pool.length === 0) {
                      message.channel.send('!start, et alustada mängu!');
                    }
                  });
                }
              });
              // message.channel.send(member.displayName);
            }
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

client.login(token);
