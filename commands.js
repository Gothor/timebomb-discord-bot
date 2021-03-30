const StartCommand = require('./commands/start');
const JoinCommand = require('./commands/join');
const ShowPlayersCommand = require('./commands/showPlayers');
const NewGameCommand = require('./commands/newGame');
const CutCommand = require('./commands/cut');

module.exports = [
  StartCommand,
  JoinCommand,
  ShowPlayersCommand,
  NewGameCommand,
  CutCommand,
];