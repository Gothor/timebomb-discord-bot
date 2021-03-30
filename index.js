const Discord = require('discord.js');
const commands = require('./commands')

const token = "tokenId";

const bot = new Discord.Client();

bot.login(token);

bot.on('message', message => {
  for (let command of commands) {
    if (command.parse(message)) break;
  }
});

process.on('SIGINT', _ => {
  bot.destroy();
})