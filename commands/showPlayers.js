const Command = require('./command');
const gameManager = require('../gameManager');

module.exports = class ShowPlayersCommand extends Command {
  static matches(message) {
    return message.content.split(' ').includes('!tbPlayers');
  }

  static action(message) {
    const list = gameManager.players.map(p => `- ${p.author.username}`).join('\n');
    message.channel.send(`Les joueurs actuellement enregistrés sont :\n${list}`);
  }
}