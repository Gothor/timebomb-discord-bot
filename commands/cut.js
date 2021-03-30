const Command = require('./command');
const gameManager = require('../gameManager');
const Discord = require('discord.js');
const mergeImg = require('merge-img')

module.exports = class CutCommand extends Command {
  static matches(message) {
    return message.content.split(' ').includes('!tbCut');
  }

  static action(message) {
    console.log(message);

    if (gameManager.manche === 0) {
      message.channel.send('Aucune partie en cours.');
      return;
    }

    console.log(gameManager.players[gameManager.joueurCourant].author.id, message.author.id, gameManager.players[gameManager.joueurCourant].author.id != message.author.id);

    if (gameManager.players[gameManager.joueurCourant].author.id != message.author.id) {
      return;
    }

    const tokens = message.content.split(' ');
    const index = tokens.indexOf('!tbCut');
    const targetTag = tokens[index + 1];

    console.log(!/\<@\!?\d+\>/.test(targetTag));
    if (!/\<@\!?\d+\>/.test(targetTag)) return;

    const targetId = targetTag.slice(3, -1);

    console.log(message.author.id == targetId);
    if (message.author.id == targetId) return;

    const target = gameManager.players.find(p => p.author.id == targetId);

    let card = gameManager.cutCard(target);
    if (card != -1) {
      message.channel.send('Vous coupez un fil chez ' + target.author.username + ' et...');
      let asset;
      switch(card) {
        case gameManager.Cartes.Vide: asset = 'assets/vide.jpg'; break;
        case gameManager.Cartes.Desammorcage: asset = 'assets/desammorcage.jpg'; break;
        case gameManager.Cartes.Explosion: asset = 'assets/explosion.jpg'; break;
      }
      message.channel.send(new Discord.MessageAttachment(asset));

      if (card === gameManager.Cartes.Explosion) {
        const traitresUser = gameManager.players.filter(p => p.role === gameManager.Roles.Mechant);
        let traitres;
        if (traitresUser.length > 1)
          traitres = traitresUser.slice(0, -1).map(p => p.author.username).join(', ') + ' et ' + traitresUser.slice(-1).map(p => p.author.username)[0];
        else
          traitres = traitresUser[0].author.username;
        message.channel.send(`Victoire de l'équipe Moriarty : ${traitres} !`);
        gameManager.endGame();
        return;
      }

      const nbDesammorcages = gameManager.cartes.filter(c => c == gameManager.Cartes.Desammorcage).length;
      if (card === gameManager.Cartes.Desammorcage && nbDesammorcages === 0) {
        const sherlockUsers = gameManager.players.filter(p => p.role === gameManager.Roles.Gentil);
        const sherlock = sherlockUsers.slice(0, -1).map(p => p.author.username).join(', ') + ' et ' + sherlockUsers.slice(-1).map(p => p.author.username)[0];
        message.channel.send(`Victoire de l'équipe Sherlock : ${sherlock} !`);
        gameManager.endGame();
        return;
      } else if (card === gameManager.Cartes.Desammorcage) {
        message.channel.send(`Plus que ${nbDesammorcages} fils à désamorcer !`);
      } else {
        message.channel.send(`Il y a toujours ${nbDesammorcages} fils à désamorcer !`);
      }

      const nbCartes = gameManager.cartes.length % gameManager.players.length;
      if (nbCartes) {
        message.channel.send(`Encore ${nbCartes} à couper cette manche.`);
      } else {
        gameManager.nouvelleManche();
        new Promise(resolve => {
          setTimeout(_ => {
            message.channel.send('Fin de la manche, redistribution des cartes en cours...');
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
              message.channel.send(username + ' est le joueur actif.');
              resolve();
            }, 1000);
          });
        });
      }
    } else {
      message.channel.send('Il n\'y a aucune carte à couper chez ' + target.author.username);
    }
  }
}