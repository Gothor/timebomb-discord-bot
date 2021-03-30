const Command = require('./command');
const gameManager = require('../gameManager');

module.exports = class NewGameCommand extends Command {
  static matches(message) {
    return message.content.split(' ').includes('!tbNewGame');
  }

  static action(message) {
    message.channel.send('Okaaaay ! On va commencer une nouvelle partie !');
    gameManager.reset();
  }
}