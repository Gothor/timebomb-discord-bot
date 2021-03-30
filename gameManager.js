const Roles = {
  None: -1,
  Gentil: 0,
  Mechant: 1
}

const Cartes = {
  Vide: 0,
  Desammorcage: 1,
  Explosion: 2
}

class Player {

  constructor(author) {
    this.author = author;
    this.role = Roles.None;
    this.cards = [];
  }

}

class GameManager {

  constructor() {
    this.Roles = Roles;
    this.Cartes = Cartes;
    this.reset();
  }

  reset() {
    this.players = [];
    this.cartes = [];
    this.cartesJouees = [];
    this.manche = 0;
    this.joueurCourant = -1;
  }

  addPlayer(player) {
    this.players.push(new Player(player));
  }

  start() {
    const roles = [
      [Math.floor(Math.random() * 2)],
      [Roles.Gentil, Roles.Mechant],
      [Roles.Gentil, Roles.Gentil, Roles.Mechant],
      [Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Mechant, Roles.Mechant],
      [Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Mechant, Roles.Mechant],
      [Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Mechant, Roles.Mechant],
      [Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Mechant, Roles.Mechant],
      [Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Gentil, Roles.Mechant, Roles.Mechant]
    ];

    const selectedRoles = roles[this.players.length - 1];
    for (let i = 0; i < selectedRoles.length; i++) {
      let j = Math.floor(Math.random() * selectedRoles.length);
      
      let tmp = selectedRoles[i];
      selectedRoles[i] = selectedRoles[j];
      selectedRoles[j] = tmp;
    }
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].role = selectedRoles[i];
    }

    const nbCartesVides = 4 * this.players.length - 1;
    const nbCartesDesammorcage = this.players.length;
    for (let i = 0; i < nbCartesVides; i++) {
      this.cartes.push(Cartes.Vide);
    }
    for (let i = 0; i < nbCartesDesammorcage; i++) {
      this.cartes.push(Cartes.Desammorcage);
    }
    this.cartes.push(Cartes.Explosion);

    this.nouvelleManche();
    this.joueurCourant = Math.floor(Math.random() * this.players.length);
  }

  nouvelleManche() {
    this.manche++;
    this.melangerCartes();
    this.distribuerCartes(5 - (this.manche - 1));
  }

  melangerCartes() {
    for (let i = 0; i < this.cartes.length; i++) {
      let j = Math.floor(Math.random() * this.cartes.length);
      
      let tmp = this.cartes[i];
      this.cartes[i] = this.cartes[j];
      this.cartes[j] = tmp;
    }
  }

  distribuerCartes(nb) {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].cartes = this.cartes.slice(i * nb, i * nb + nb);
    }
  }

  cutCard(target) {
    if (!target.cartes.length) return -1;

    this.joueurCourant = this.players.indexOf(target);

    let index = Math.floor(Math.random() * target.cartes.length);
    let card = target.cartes.splice(index, 1)[0];
    this.cartes.splice(this.cartes.indexOf(card), 1);
    this.cartesJouees.push(card);
    return card;
  }

  isPlaying(author) {
    return !!this.players.find(p => p.author.id === author.id);
  }

  endGame() {
    this.reset();
  }

}

module.exports = new GameManager();