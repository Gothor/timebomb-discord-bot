const Command = require('./command');
const gameManager = require('../gameManager');
const mergeImg = require('merge-img');
const Discord = require('discord.js');

module.exports = class StartCommand extends Command {
  static matches(message) {
    return message.content.split(' ').includes('!tbStart');
  }

  static action(message) {
    if (gameManager.manche) {
      message.reply('la partie est déjà commencée. Merci d\'attendre la fin de la partie en cours.');
      return;
    }

    gameManager.start();

    message.channel.send('La partie va commencer !');

    const gentilMessage = 'Tu fais partie de **l\'équipe Sherlock** ! Tu dois désamorcer la bombe !';
    const mechantMessage = 'Tu fais partie de **l\'équipe Moriarty** ! Tu dois faire exploser la bombe !';
    for (let player of gameManager.players) {
      player.author
        .createDM()
        .then(channel => {
          channel.send(player.role === gameManager.Roles.Gentil ? gentilMessage : mechantMessage);
        });
    }

    new Promise(resolve => {
      setTimeout(_ => {
        message.channel.send('Distribution des cartes en cours...');
        resolve();
      }, 1000);
    }).then(_ => {
      return new Promise(resolve => {
        setTimeout(_ => {
          for (let player of gameManager.players) {
            player.author
              .createDM()
              .then(channel => {
                mergeImg(player.cartes.map(c => {
                  switch(c) {
                    case gameManager.Cartes.Vide: return 'assets/vide.jpg';
                    case gameManager.Cartes.Desammorcage: return 'assets/desammorcage.jpg';
                    case gameManager.Cartes.Explosion: return 'assets/explosion.jpg';
                  }
                }))
                .then(img => {
                  img.getBuffer('image/jpeg', (err, buffer) => {
                    channel.send('Voici les cartes que tu as reçues :');
                    channel.send(new Discord.MessageAttachment(buffer));
                  });
                });
              });
          }
          resolve();
        }, 1000);
      });
    }).then(_ => {
      return new Promise(resolve => {
        setTimeout(_ => {
          const username = gameManager.players[gameManager.joueurCourant].author.username;
          message.channel.send(username + ' est le premier joueur.');
          resolve();
        }, 1000);
      });
    });
  }
}