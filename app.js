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
});

client.login(process.env.TOKEN);
