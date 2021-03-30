const Command = require('./command');
const gameManager = require('../gameManager');

module.exports = class JoinCommand extends Command {
  static matches(message) {
    return message.content.split(' ').includes('!tbJoin');
  }

  static action(message) {
    if (gameManager.manche) {
      message.reply('la partie est déjà commencée. Merci d\'attendre la fin de la partie en cours.');
      return;
    }

    if (gameManager.players.find(p => p.author.id === message.author.id)) {
      message.reply('tu as déjà rejoint la partie !');
      return;
    }

    gameManager.addPlayer(message.author);
    message.channel.send(`${message.author.username} rejoint la partie !`);
  }
}